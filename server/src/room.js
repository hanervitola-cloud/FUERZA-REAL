// One live room (a Durable Object): up to 8 phones connected by WebSocket. Each phone counts its own person
// with its camera and sends its count; the room tells everyone the state of everyone. It also passes the
// messages two phones need to show each other's camera (WebRTC), so no other service is needed.
// Rooms close by themselves 3 hours after they are created.
import { DurableObject } from 'cloudflare:workers';

const MAX = 8;
const LIFE = 3 * 36e5;
// Each phone may send about 20 messages a second; more are dropped so nobody can flood a room.
const rate = new WeakMap();
const clean = (s) => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 16);

export class Room extends DurableObject {
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/init' && req.method === 'POST') {
      const cfg = await req.json();
      await this.ctx.storage.put('cfg', { c: cfg.c, w: cfg.w, u: cfg.u, host: cfg.host, phase: 'lobby', created: Date.now(), round: 0 });
      await this.ctx.storage.setAlarm(Date.now() + LIFE);
      return new Response('ok');
    }
    if (url.pathname !== '/ws') return new Response('not found', { status: 404 });
    const cfg = await this.ctx.storage.get('cfg');
    if (!cfg) return new Response('no room', { status: 404 });
    const uid = url.searchParams.get('uid');
    // The same person reconnecting replaces their old connection.
    for (const ws of this.ctx.getWebSockets()) { const a = ws.deserializeAttachment(); if (a && a.uid === uid) { try { ws.close(4000, 'replaced'); } catch (e) { /* closed */ } } }
    if (this.players().length >= MAX) return new Response('full', { status: 409 });
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);
    this.ctx.acceptWebSocket(server);
    const pid = crypto.randomUUID().slice(0, 8);
    server.serializeAttachment({ pid, uid, name: clean(url.searchParams.get('name')) || 'Atleta', ready: false, n: 0, done: false, joined: Date.now() });
    server.send(JSON.stringify({ t: 'you', pid, host: uid === cfg.host }));
    await this.broadcast();
    const asked = (req.headers.get('Sec-WebSocket-Protocol') || '').split(',').map((x) => x.trim());
    return new Response(null, { status: 101, webSocket: client, headers: asked.includes('es-v1') ? { 'Sec-WebSocket-Protocol': 'es-v1' } : {} });
  }

  players(skip) {
    return this.ctx.getWebSockets().filter((ws) => ws !== skip).map((ws) => ({ ws, a: ws.deserializeAttachment() })).filter((x) => x.a);
  }

  async broadcast(extra, skip) {
    const cfg = await this.ctx.storage.get('cfg');
    if (!cfg) return;
    const list = this.players(skip).sort((x, y) => x.a.joined - y.a.joined);
    const state = { t: 'state', c: cfg.c, w: cfg.w, u: cfg.u, phase: cfg.phase, round: cfg.round, players: list.map(({ a }) => ({ pid: a.pid, name: a.name, ready: a.ready, n: a.n, done: a.done, host: a.uid === cfg.host })) };
    const msg = JSON.stringify(state);
    for (const { ws } of list) { try { ws.send(msg); } catch (e) { /* gone */ } }
    if (extra) { const em = JSON.stringify(extra); for (const { ws } of list) { try { ws.send(em); } catch (e) { /* gone */ } } }
  }

  async start(cfg) {
    // Everyone starts the 3-2-1 at the same moment.
    cfg.phase = 'go';
    cfg.round += 1;
    await this.ctx.storage.put('cfg', cfg);
    for (const { ws, a } of this.players()) ws.serializeAttachment({ ...a, n: 0, done: false });
    await this.broadcast({ t: 'go', round: cfg.round });
  }

  async webSocketMessage(ws, raw) {
    if (typeof raw !== 'string' || raw.length > 20000) return;
    const now = Date.now(), q = rate.get(ws) || { t: now, n: 0 };
    if (now - q.t > 2000) { q.t = now; q.n = 0; }
    q.n += 1;
    rate.set(ws, q);
    if (q.n > 40) return;
    let m;
    try { m = JSON.parse(raw); } catch (e) { return; }
    const a = ws.deserializeAttachment();
    const cfg = await this.ctx.storage.get('cfg');
    if (!a || !cfg || !m || typeof m.t !== 'string') return;
    const isHost = a.uid === cfg.host;
    if (m.t === 'ready') {
      ws.serializeAttachment({ ...a, ready: !!m.v });
      const all = this.players();
      // Starts by itself when 2 or more are in the room and all of them are ready.
      if (cfg.phase !== 'go' && all.length >= 2 && all.every((x) => (x.ws === ws ? !!m.v : x.a.ready))) return this.start(cfg);
      return this.broadcast();
    }
    if (m.t === 'go' && isHost && cfg.phase !== 'go' && this.players().length >= 2) return this.start(cfg);
    if (m.t === 'n') {
      const n = Math.max(0, Math.min(9999, Math.round(+m.n || 0)));
      ws.serializeAttachment({ ...a, n });
      return this.broadcast();
    }
    if (m.t === 'done') {
      const n = Math.max(0, Math.min(9999, Math.round(+m.n || 0)));
      ws.serializeAttachment({ ...a, n, done: true });
      if (this.players().every((x) => (x.ws === ws ? true : x.a.done))) { cfg.phase = 'done'; await this.ctx.storage.put('cfg', cfg); }
      return this.broadcast();
    }
    if (m.t === 'again' && isHost) {
      cfg.phase = 'lobby';
      await this.ctx.storage.put('cfg', cfg);
      for (const p of this.players()) p.ws.serializeAttachment({ ...p.a, ready: false, n: 0, done: false });
      return this.broadcast({ t: 'again' });
    }
    if (m.t === 'rtc' && typeof m.to === 'string') {
      // Camera connection messages between two phones, passed along as they are.
      const target = this.players().find((x) => x.a.pid === m.to);
      if (target) { try { target.ws.send(JSON.stringify({ t: 'rtc', from: a.pid, data: m.data })); } catch (e) { /* gone */ } }
    }
  }

  async webSocketClose(ws) {
    try { ws.close(1000, 'bye'); } catch (e) { /* closed */ }
    await this.broadcast(null, ws);
  }

  async webSocketError(ws) { await this.broadcast(null, ws); }

  async alarm() {
    for (const ws of this.ctx.getWebSockets()) { try { ws.close(4001, 'room closed'); } catch (e) { /* closed */ } }
    await this.ctx.storage.deleteAll();
  }
}
