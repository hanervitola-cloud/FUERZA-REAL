// Training reminders with Web Push. The push carries no data: the phone's service worker shows the
// reminder text the app saved on the phone. The server only knows when to wake the phone up.
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const b64uText = (s) => b64u(new TextEncoder().encode(s));

// Push services the phones use. Anything else is refused, so the server never calls unknown addresses.
const PUSH_HOSTS = [/^fcm\.googleapis\.com$/, /^updates\.push\.services\.mozilla\.com$/, /^web\.push\.apple\.com$/, /\.notify\.windows\.com$/, /^push\.services\.mozilla\.com$/];
export function okEndpoint(url, dev) {
  try {
    const u = new URL(url);
    if (dev && u.protocol === 'http:' && u.hostname === '127.0.0.1') return true;
    return u.protocol === 'https:' && PUSH_HOSTS.some((re) => re.test(u.hostname)) && url.length < 1000;
  } catch (e) { return false; }
}

// Next moment at the chosen local hour:minute on one of the chosen weekdays (0 = Sunday).
// tz = minutes ahead of UTC on the phone (e.g. Colombia = -300).
export function nextTime(hour, minute, days, tz, after) {
  const local = after + tz * 60000;
  const d = new Date(local);
  d.setUTCHours(hour, minute, 0, 0);
  for (let i = 0; i < 8; i++) {
    const when = d.getTime() + i * 864e5;
    const wd = new Date(when).getUTCDay();
    if (when > local && days.includes(wd)) return when - tz * 60000;
  }
  return after + 7 * 864e5;
}

async function vapidAuth(env, endpoint) {
  const aud = new URL(endpoint).origin;
  const header = b64uText(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = b64uText(JSON.stringify({ aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: 'https://earnedstrength.online' }));
  const key = await crypto.subtle.importKey('jwk', JSON.parse(env.VAPID_PRIVATE_JWK), { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(`${header}.${payload}`));
  return `vapid t=${header}.${payload}.${b64u(sig)}, k=${env.VAPID_PUBLIC}`;
}

// Sends one reminder. Returns 'gone' when the phone unsubscribed (the subscription is then deleted).
export async function sendPush(env, endpoint) {
  const r = await fetch(endpoint, { method: 'POST', headers: { Authorization: await vapidAuth(env, endpoint), TTL: '43200', Urgency: 'normal', 'Content-Length': '0' } });
  if (r.status === 404 || r.status === 410) return 'gone';
  return r.ok ? 'ok' : 'fail';
}

// Runs every 10 minutes (cron in wrangler.jsonc): sends the reminders that are due.
export async function sendDue(env) {
  const now = Date.now();
  const due = await env.DB.prepare('SELECT endpoint, hour, minute, days, tz FROM push WHERE next_at <= ? LIMIT 300').bind(now).all();
  let sent = 0;
  for (const s of due.results) {
    let res = 'fail';
    try { res = await sendPush(env, s.endpoint); } catch (e) { res = 'fail'; }
    if (res === 'gone') await env.DB.prepare('DELETE FROM push WHERE endpoint = ?').bind(s.endpoint).run();
    else {
      await env.DB.prepare('UPDATE push SET next_at = ? WHERE endpoint = ?').bind(nextTime(s.hour, s.minute, JSON.parse(s.days), s.tz, now + 60000), s.endpoint).run();
      if (res === 'ok') sent++;
    }
  }
  return sent;
}
