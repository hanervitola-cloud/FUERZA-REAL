// Earned Strength server (Cloudflare Worker): accounts without passwords, friends, backup, online rankings,
// live rooms (Durable Object in room.js) and the AI coach (coach.js). The app works without it; this adds
// the parts that need internet.
import { Room } from './room.js';
import { askCoach } from './coach.js';

export { Room };

// Challenge ids from the app (app/repcount.js) and their kind: t = most reps in 60 s, m = most reps non-stop,
// h = longest hold in seconds. CAP = the most a real person could plausibly do, to drop impossible scores.
const CH = {
  pu60: 't', pumax: 'm', sq60: 't', lu60: 't', cr60: 't', gb60: 't', dimax: 'm', pkmax: 'm', cdmax: 'm', lrmax: 'm', plank: 'h',
  bp: 'm', sqb: 'm', dl: 'm', pull: 'm', chin: 'm', dip: 'm', ibp: 'm', ohp: 'm', row60: 't', lpd60: 't', crow60: 't', lp: 'm',
  ht: 'm', rdl60: 't', bss60: 't', gs60: 't', cu60: 't', sp60: 't', lat60: 't', tp60: 't', sk60: 't', le60: 't', hlr: 'm',
};
const CAP = { t: 110, m: 300, h: 1800 };
const LIMITS = { coach: 40, scores: 120, accounts: 20, backup: 30, rooms: 30, events: 80, cheers: 200, xp: 300 };
// Weeks start on Monday (1 Jan 1970 was a Thursday, hence the +3).
const thisWeek = () => Math.floor((Math.floor(Date.now() / 864e5) + 3) / 7);
const MAX_WEEK_XP = 6000;
// What each kind of activity may carry. Anything else is dropped.
const EVENT_FIELDS = { workout: { w: 's', sets: 'n' }, pr: { ex: 'id' }, record: { c: 'id', n: 'n' }, goal: { c: 'id', n: 'n' }, level: { n: 'n' } };
function cleanEvent(kind, d) {
  const spec = EVENT_FIELDS[kind];
  if (!spec || !d || typeof d !== 'object') return null;
  const out = {};
  for (const [k, type] of Object.entries(spec)) {
    const v = d[k];
    if (type === 'n') { const n = Math.round(+v); if (Number.isFinite(n) && n >= 0 && n < 100000) out[k] = n; }
    else if (type === 'id') { if (typeof v === 'string' && /^[a-z0-9-]{1,40}$/.test(v)) out[k] = v; }
    else if (typeof v === 'string') out[k] = cleanName(v.slice(0, 40)) || undefined;
  }
  return out;
}
const ALPHA = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

const randCode = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => ALPHA[b % ALPHA.length]).join('');
const today = () => Math.floor(Date.now() / 864e5);
export const cleanName = (s) => String(s || '').replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 16);
async function sha(s) {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function corsHeaders(req, env) {
  const o = req.headers.get('Origin') || '';
  const ok = (env.ORIGINS || '').split(',').map((x) => x.trim()).includes(o);
  return ok ? { 'Access-Control-Allow-Origin': o, 'Access-Control-Allow-Headers': 'authorization, content-type', 'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS', 'Access-Control-Max-Age': '86400', Vary: 'Origin' } : { Vary: 'Origin' };
}
const json = (data, status, cors) => new Response(JSON.stringify(data), { status: status || 200, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...cors } });
const fail = (code, status, cors) => json({ error: code }, status, cors);

async function body(req, max = 20000) {
  const text = await req.text();
  if (text.length > max) throw new Error('too_big');
  try { return text ? JSON.parse(text) : {}; } catch (e) { throw new Error('bad_json'); }
}
// Counts one use of something per day; false once the limit is reached.
async function allow(env, who, kind) {
  const day = today();
  const row = await env.DB.prepare('INSERT INTO usage (who, day, kind, n) VALUES (?, ?, ?, 1) ON CONFLICT (who, day, kind) DO UPDATE SET n = n + 1 RETURNING n')
    .bind(who, day, kind).first();
  return !row || row.n <= LIMITS[kind];
}
async function auth(req, env, token) {
  const h = req.headers.get('Authorization') || '';
  const tok = token || (h.startsWith('Bearer ') ? h.slice(7).trim() : '');
  if (!/^[A-Z0-9]{24}$/.test(tok)) return null;
  const u = await env.DB.prepare('SELECT id, name, code, seen FROM users WHERE token_hash = ?').bind(await sha(tok)).first();
  if (u && Date.now() - u.seen > 36e5) await env.DB.prepare('UPDATE users SET seen = ? WHERE id = ?').bind(Date.now(), u.id).run();
  return u;
}

async function createUser(req, env, cors) {
  const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
  if (!(await allow(env, 'ip:' + (await sha(ip)).slice(0, 16), 'accounts'))) return fail('limit', 429, cors);
  const b = await body(req);
  const name = cleanName(b.name) || 'Atleta';
  const token = randCode(24), id = crypto.randomUUID(), now = Date.now();
  for (let i = 0; i < 5; i++) {
    const code = randCode(6);
    try {
      await env.DB.prepare('INSERT INTO users (id, token_hash, name, code, created, seen) VALUES (?, ?, ?, ?, ?, ?)').bind(id, await sha(token), name, code, now, now).run();
      return json({ id, name, code, token }, 201, cors);
    } catch (e) { if (!/UNIQUE/.test(String(e))) throw e; }
  }
  return fail('busy', 503, cors);
}

async function rank(env, me, cid, scope) {
  const friendsOnly = scope === 'friends';
  const where = friendsOnly ? 'AND (s.user_id = ?2 OR s.user_id IN (SELECT b FROM friends WHERE a = ?2))' : '';
  const binds = friendsOnly ? [cid, me.id] : [cid];
  const rows = await env.DB.prepare(`SELECT u.id, u.name, s.n, s.w, s.u, s.at FROM scores s JOIN users u ON u.id = s.user_id WHERE s.cid = ?1 ${where} ORDER BY s.n DESC, s.at ASC LIMIT 50`)
    .bind(...binds).all();
  const list = rows.results.map((r, i) => ({ pos: i + 1, name: r.name, n: r.n, w: r.w, u: r.u, me: !!me && r.id === me.id }));
  let mine = null;
  if (me) {
    const s = await env.DB.prepare('SELECT n, at FROM scores WHERE user_id = ? AND cid = ?').bind(me.id, cid).first();
    if (s) {
      const ahead = await env.DB.prepare(`SELECT COUNT(*) AS c FROM scores s WHERE s.cid = ?1 AND (s.n > ?3 OR (s.n = ?3 AND s.at < ?4)) ${where}`)
        .bind(cid, me.id, s.n, s.at).first();
      mine = { pos: ahead.c + 1, n: s.n };
    }
  }
  const total = await env.DB.prepare(`SELECT COUNT(*) AS c FROM scores s WHERE s.cid = ?1 ${where}`).bind(...binds).first();
  return { list, mine, total: total.c };
}

async function route(req, env, cors) {
  const url = new URL(req.url);
  const p = url.pathname.replace(/\/+$/, '');
  const m = req.method;
  if (p === '' || p === '/v1') return json({ ok: true, name: 'earned-strength-api' }, 200, cors);
  if (p === '/v1/users' && m === 'POST') return createUser(req, env, cors);

  // Live rooms: the WebSocket goes straight to the room (it checks the token itself).
  const roomWs = p.match(/^\/v1\/rooms\/([A-Z0-9]{6})\/ws$/);
  if (roomWs) {
    if (req.headers.get('Upgrade') !== 'websocket') return fail('websocket_only', 426, cors);
    const me = await auth(req, env, url.searchParams.get('t') || '');
    if (!me) return fail('auth', 401, cors);
    const stub = env.ROOMS.get(env.ROOMS.idFromName(roomWs[1]));
    const fwd = new URL('https://room/ws');
    fwd.searchParams.set('uid', me.id);
    fwd.searchParams.set('name', me.name);
    return stub.fetch(new Request(fwd, req));
  }

  const me = await auth(req, env);
  if (!me) return fail('auth', 401, cors);
  if (p === '/v1/me' && m === 'GET') return json(me, 200, cors);
  if (p === '/v1/me' && m === 'PATCH') {
    const name = cleanName((await body(req)).name);
    if (!name) return fail('name', 400, cors);
    await env.DB.prepare('UPDATE users SET name = ? WHERE id = ?').bind(name, me.id).run();
    return json({ ...me, name }, 200, cors);
  }
  // Delete the account and everything linked to it (app stores require this to be possible from the app).
  if (p === '/v1/me' && m === 'DELETE') {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM friends WHERE a = ? OR b = ?').bind(me.id, me.id),
      env.DB.prepare('DELETE FROM scores WHERE user_id = ?').bind(me.id),
      env.DB.prepare('DELETE FROM backups WHERE user_id = ?').bind(me.id),
      env.DB.prepare('DELETE FROM usage WHERE who = ?').bind(me.id),
      env.DB.prepare('DELETE FROM cheers WHERE user_id = ? OR event_id IN (SELECT id FROM events WHERE user_id = ?)').bind(me.id, me.id),
      env.DB.prepare('DELETE FROM events WHERE user_id = ?').bind(me.id),
      env.DB.prepare('DELETE FROM xpweek WHERE user_id = ?').bind(me.id),
      env.DB.prepare('DELETE FROM users WHERE id = ?').bind(me.id),
    ]);
    return json({ ok: true }, 200, cors);
  }
  // Activity: what you did, for your friends to see.
  if (p === '/v1/events' && m === 'POST') {
    const b = await body(req);
    const data = cleanEvent(b.kind, b.data);
    if (!data) return fail('bad_event', 400, cors);
    if (!(await allow(env, me.id, 'events'))) return fail('limit', 429, cors);
    const now = Date.now();
    await env.DB.batch([
      env.DB.prepare('INSERT INTO events (user_id, kind, data, at) VALUES (?, ?, ?, ?)').bind(me.id, b.kind, JSON.stringify(data), now),
      env.DB.prepare('DELETE FROM events WHERE user_id = ? AND at < ?').bind(me.id, now - 30 * 864e5),
    ]);
    return json({ ok: true }, 201, cors);
  }
  if (p === '/v1/feed' && m === 'GET') {
    const rows = await env.DB.prepare(`SELECT e.id, e.kind, e.data, e.at, u.name, (e.user_id = ?1) AS me,
        (SELECT COUNT(*) FROM cheers c WHERE c.event_id = e.id) AS cheers,
        EXISTS (SELECT 1 FROM cheers c WHERE c.event_id = e.id AND c.user_id = ?1) AS mine
      FROM events e JOIN users u ON u.id = e.user_id
      WHERE e.user_id = ?1 OR e.user_id IN (SELECT b FROM friends WHERE a = ?1)
      ORDER BY e.at DESC LIMIT 40`).bind(me.id).all();
    return json({ feed: rows.results.map((r) => ({ id: r.id, kind: r.kind, data: JSON.parse(r.data), at: r.at, name: r.name, me: !!r.me, cheers: r.cheers, mine: !!r.mine })) }, 200, cors);
  }
  const cheer = p.match(/^\/v1\/events\/(\d+)\/cheer$/);
  if (cheer && m === 'POST') {
    const ev = await env.DB.prepare('SELECT user_id FROM events WHERE id = ?').bind(+cheer[1]).first();
    if (!ev) return fail('not_found', 404, cors);
    const friend = ev.user_id === me.id || (await env.DB.prepare('SELECT 1 AS ok FROM friends WHERE a = ? AND b = ?').bind(me.id, ev.user_id).first());
    if (!friend) return fail('not_friend', 403, cors);
    if (!(await allow(env, me.id, 'cheers'))) return fail('limit', 429, cors);
    await env.DB.prepare('INSERT OR IGNORE INTO cheers (event_id, user_id) VALUES (?, ?)').bind(+cheer[1], me.id).run();
    const c = await env.DB.prepare('SELECT COUNT(*) AS n FROM cheers WHERE event_id = ?').bind(+cheer[1]).first();
    return json({ cheers: c.n }, 200, cors);
  }
  // Weekly league: XP this week, you and your friends.
  if (p === '/v1/xp' && m === 'PUT') {
    const xp = Math.round(+(await body(req)).xp);
    if (!Number.isFinite(xp) || xp < 0 || xp > MAX_WEEK_XP) return fail('bad_xp', 400, cors);
    if (!(await allow(env, me.id, 'xp'))) return fail('limit', 429, cors);
    await env.DB.prepare('INSERT INTO xpweek (user_id, week, xp) VALUES (?, ?, ?) ON CONFLICT (user_id, week) DO UPDATE SET xp = MAX(xpweek.xp, excluded.xp)')
      .bind(me.id, thisWeek(), xp).run();
    return json({ ok: true }, 200, cors);
  }
  if (p === '/v1/league' && m === 'GET') {
    const week = thisWeek();
    const rows = await env.DB.prepare(`SELECT u.id, u.name, COALESCE(x.xp, 0) AS xp FROM users u LEFT JOIN xpweek x ON x.user_id = u.id AND x.week = ?2
      WHERE u.id = ?1 OR u.id IN (SELECT b FROM friends WHERE a = ?1) ORDER BY xp DESC, u.name LIMIT 50`).bind(me.id, week).all();
    const endsAt = (week + 1) * 7 * 864e5 - 3 * 864e5;
    return json({ league: rows.results.map((r, i) => ({ pos: i + 1, name: r.name, xp: r.xp, me: r.id === me.id })), endsAt }, 200, cors);
  }
  if (p === '/v1/friends' && m === 'GET') {
    const rows = await env.DB.prepare('SELECT u.id, u.name, u.code FROM friends f JOIN users u ON u.id = f.b WHERE f.a = ? ORDER BY u.name').bind(me.id).all();
    return json({ friends: rows.results }, 200, cors);
  }
  if (p === '/v1/friends' && m === 'POST') {
    const code = String((await body(req)).code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
    const f = await env.DB.prepare('SELECT id, name, code FROM users WHERE code = ?').bind(code).first();
    if (!f) return fail('not_found', 404, cors);
    if (f.id === me.id) return fail('self', 400, cors);
    const now = Date.now();
    await env.DB.batch([
      env.DB.prepare('INSERT OR IGNORE INTO friends (a, b, created) VALUES (?, ?, ?)').bind(me.id, f.id, now),
      env.DB.prepare('INSERT OR IGNORE INTO friends (a, b, created) VALUES (?, ?, ?)').bind(f.id, me.id, now),
    ]);
    return json({ friend: f }, 201, cors);
  }
  const fdel = p.match(/^\/v1\/friends\/([0-9a-f-]{36})$/);
  if (fdel && m === 'DELETE') {
    await env.DB.batch([
      env.DB.prepare('DELETE FROM friends WHERE a = ? AND b = ?').bind(me.id, fdel[1]),
      env.DB.prepare('DELETE FROM friends WHERE a = ? AND b = ?').bind(fdel[1], me.id),
    ]);
    return json({ ok: true }, 200, cors);
  }
  if (p === '/v1/backup' && m === 'PUT') {
    if (!(await allow(env, me.id, 'backup'))) return fail('limit', 429, cors);
    const text = await req.text();
    if (text.length > 900000) return fail('too_big', 413, cors);
    try { JSON.parse(text); } catch (e) { return fail('bad_json', 400, cors); }
    await env.DB.prepare('INSERT INTO backups (user_id, data, updated) VALUES (?, ?, ?) ON CONFLICT (user_id) DO UPDATE SET data = excluded.data, updated = excluded.updated')
      .bind(me.id, text, Date.now()).run();
    return json({ ok: true, updated: Date.now() }, 200, cors);
  }
  if (p === '/v1/backup' && m === 'GET') {
    const b = await env.DB.prepare('SELECT data, updated FROM backups WHERE user_id = ?').bind(me.id).first();
    return b ? json({ data: JSON.parse(b.data), updated: b.updated }, 200, cors) : fail('none', 404, cors);
  }
  if (p === '/v1/scores' && m === 'POST') {
    const b = await body(req);
    const kind = CH[b.c];
    const n = Math.round(+b.n);
    if (!kind || !Number.isFinite(n) || n <= 0 || n > CAP[kind]) return fail('bad_score', 400, cors);
    if (!(await allow(env, me.id, 'scores'))) return fail('limit', 429, cors);
    const w = Number.isFinite(+b.w) && +b.w > 0 && +b.w < 1000 ? Math.round(+b.w * 10) / 10 : null;
    const u = w ? (b.u === 'lb' ? 'lb' : 'kg') : null;
    await env.DB.prepare('INSERT INTO scores (user_id, cid, n, w, u, at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (user_id, cid) DO UPDATE SET n = excluded.n, w = excluded.w, u = excluded.u, at = excluded.at WHERE excluded.n > scores.n')
      .bind(me.id, b.c, n, w, u, Date.now()).run();
    return json(await rank(env, me, b.c, 'global'), 200, cors);
  }
  const rk = p.match(/^\/v1\/rank\/([a-z0-9]{2,8})$/);
  if (rk && m === 'GET') {
    if (!CH[rk[1]]) return fail('not_found', 404, cors);
    return json(await rank(env, me, rk[1], url.searchParams.get('scope') === 'friends' ? 'friends' : 'global'), 200, cors);
  }
  if (p === '/v1/rooms' && m === 'POST') {
    const b = await body(req);
    if (!CH[b.c]) return fail('bad_challenge', 400, cors);
    if (!(await allow(env, me.id, 'rooms'))) return fail('limit', 429, cors);
    const code = randCode(6);
    const stub = env.ROOMS.get(env.ROOMS.idFromName(code));
    await stub.fetch('https://room/init', { method: 'POST', body: JSON.stringify({ c: b.c, w: Number.isFinite(+b.w) && +b.w > 0 ? +b.w : null, u: b.u === 'lb' ? 'lb' : 'kg', host: me.id }) });
    return json({ code }, 201, cors);
  }
  if (p === '/v1/coach' && m === 'POST') {
    if (!(await allow(env, me.id, 'coach'))) return fail('limit', 429, cors);
    const b = await body(req, 12000);
    try { return json({ text: await askCoach(env, b) }, 200, cors); } catch (e) { return fail('ai_unavailable', 503, cors); }
  }
  return fail('not_found', 404, cors);
}

export default {
  async fetch(req, env) {
    const cors = corsHeaders(req, env);
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    try { return await route(req, env, cors); } catch (e) {
      const code = e && /too_big|bad_json/.test(e.message) ? e.message : 'server';
      if (code === 'server') console.error(e && e.stack || e);
      return fail(code, code === 'server' ? 500 : 400, cors);
    }
  },
};
