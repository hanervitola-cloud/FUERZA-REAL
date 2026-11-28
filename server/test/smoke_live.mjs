// Quick check of the live server. It makes one test account and deletes it at the end (nothing is left behind).
// node test/smoke_live.mjs [base]
const B = process.argv[2] || 'https://api.earnedstrength.online';
const H = { 'content-type': 'application/json', Origin: 'https://earnedstrength.online' };
const call = async (method, path, tok, body) => {
  const r = await fetch(B + path, { method, headers: { ...H, ...(tok ? { Authorization: 'Bearer ' + tok } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch (e) { j = t; }
  return { s: r.status, j, h: r.headers };
};
const ok = (cond, msg) => { console.log((cond ? 'OK  ' : 'FAIL') + ' ' + msg); if (!cond) process.exitCode = 1; };

const up = await call('GET', '/v1');
ok(up.s === 200 && up.j.ok, 'server answers over HTTPS');
ok(up.h.get('access-control-allow-origin') === 'https://earnedstrength.online', 'the app\'s website is allowed');
const bad = await fetch(B + '/v1', { headers: { Origin: 'https://evil.example' } });
ok(!bad.headers.get('access-control-allow-origin'), 'other websites are not allowed');
ok((await call('GET', '/v1/me', 'X'.repeat(24))).s === 401, 'fake key refused');

const a = await call('POST', '/v1/users', null, { name: 'Prueba' });
ok(a.s === 201 && /^[A-Z0-9]{24}$/.test(a.j.token), 'test account created');
const T = a.j.token;
try {
  ok((await call('GET', '/v1/me', T)).j.google === false, 'account details');
  ok((await call('PUT', '/v1/backup', T, { v: 1, test: true })).s === 200 && (await call('GET', '/v1/backup', T)).j.data.test === true, 'backup saved and read back');
  const room = await call('POST', '/v1/rooms', T, { c: 'pu60' });
  ok(room.s === 201 && /^[A-Z0-9]{6}$/.test(room.j.code), 'live room created');
  const ws = await new Promise((res) => {
    const w = new WebSocket(B.replace('https', 'wss') + `/v1/rooms/${room.j.code}/ws`, ['es-v1', 'tk.' + T]);
    const tm = setTimeout(() => res({ err: 'timeout' }), 10000);
    w.onmessage = (e) => { const m = JSON.parse(e.data); if (m.t === 'state') { clearTimeout(tm); w.close(); res(m); } };
    w.onerror = () => { clearTimeout(tm); res({ err: 'error' }); };
  });
  ok(ws.t === 'state' && ws.players.length === 1, 'live room connection works');
  const t0 = Date.now();
  const ai = await call('POST', '/v1/coach', T, { lang: 'es', messages: [{ me: true, text: '¿Cuántos días a la semana debo entrenar si soy principiante?' }], profile: { age: 17, level: 'beginner' } });
  ok(ai.s === 200 && typeof ai.j.text === 'string' && ai.j.text.length > 20, `AI coach answered in ${Math.round((Date.now() - t0) / 100) / 10} s`);
  if (ai.s === 200) console.log('     ' + ai.j.text.replace(/\s+/g, ' ').slice(0, 300));
  else console.log('     ', ai.s, ai.j);
} finally {
  const del = await call('DELETE', '/v1/me', T);
  ok(del.s === 200 && (await call('GET', '/v1/me', T)).s === 401, 'test account deleted, nothing left');
}
