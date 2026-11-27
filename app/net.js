// Talks to the Earned Strength server (../server). The app works without it: every call here can fail
// and the app keeps going with what is saved on the phone.
const API = (() => {
  try { const o = localStorage.getItem('es-api'); if (o) return o; } catch (e) { /* storage blocked */ }
  return ['localhost', '127.0.0.1'].includes(location.hostname) ? 'http://127.0.0.1:8787' : 'https://api.earnedstrength.online';
})();
let acct = null; // { id, name, code, token }
export function setAccount(a) { acct = a && a.token ? a : null; }
export const isOnline = () => navigator.onLine !== false;

export async function api(method, path, body, opts = {}) {
  const ctl = new AbortController();
  const tm = setTimeout(() => ctl.abort(), opts.timeout || 9000);
  try {
    const headers = {};
    if (body !== undefined) headers['content-type'] = 'application/json';
    if (acct) headers.Authorization = 'Bearer ' + acct.token;
    const r = await fetch(API + path, { method, signal: ctl.signal, headers, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) });
    const text = await r.text();
    let j = null;
    try { j = text ? JSON.parse(text) : null; } catch (e) { /* not json */ }
    // The account no longer exists on the server (deleted from another phone): the app forgets it.
    if (r.status === 401 && acct && acct.id) window.dispatchEvent(new CustomEvent('es-auth-lost'));
    if (!r.ok) { const err = new Error((j && j.error) || 'http_' + r.status); err.status = r.status; throw err; }
    return j;
  } finally { clearTimeout(tm); }
}

export async function createAccount(name) {
  const j = await api('POST', '/v1/users', { name });
  return { id: j.id, name: j.name, code: j.code, token: j.token };
}
// The recovery code is the account's secret token, shown in groups of 4 so it is easy to write down.
export const recoveryCode = (token) => (token.match(/.{1,4}/g) || []).join('-');
export async function restoreAccount(code) {
  const token = String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (token.length !== 24) throw new Error('bad_code');
  const prev = acct;
  acct = { token };
  try { const me = await api('GET', '/v1/me'); return { id: me.id, name: me.name, code: me.code, token }; } catch (e) { acct = prev; throw e; }
}
// "Continuar con Google": the web client id from Google Cloud (public, not a secret). Empty until the account
// owner creates it; for local tests it can be set in localStorage 'es-gid'.
const GOOGLE_CLIENT_ID = '';
export const googleClientId = () => { try { const o = localStorage.getItem('es-gid'); if (o) return o; } catch (e) { /* storage blocked */ } return GOOGLE_CLIENT_ID; };
// Sends Google's signed token; the server answers with the account (new, joined to this phone's, or existing).
export const googleLogin = (credential, name) => api('POST', '/v1/auth/google', { credential, name });
export const logout = () => api('POST', '/v1/logout');
export const rename = (name) => api('PATCH', '/v1/me', { name });
export const deleteAccount = () => api('DELETE', '/v1/me');
export const listFriends = () => api('GET', '/v1/friends').then((j) => j.friends);
export const addFriend = (code) => api('POST', '/v1/friends', { code }).then((j) => j.friend);
export const removeFriend = (id) => api('DELETE', '/v1/friends/' + encodeURIComponent(id));
export const pushBackup = (data) => api('PUT', '/v1/backup', JSON.stringify(data), { timeout: 20000 });
export const pullBackup = () => api('GET', '/v1/backup', undefined, { timeout: 20000 });
export const sendScore = (c, n, w, u) => api('POST', '/v1/scores', { c, n, w, u });
export const getRank = (c, scope) => api('GET', `/v1/rank/${encodeURIComponent(c)}?scope=${scope === 'friends' ? 'friends' : 'global'}`);
export const askAI = (payload) => api('POST', '/v1/coach', payload, { timeout: 25000 }).then((j) => j.text);
export const newRoom = (c, w, u) => api('POST', '/v1/rooms', { c, w, u }).then((j) => j.code);
export const roomSocket = (code) => new WebSocket(`${API.replace(/^http/, 'ws')}/v1/rooms/${encodeURIComponent(code)}/ws?t=${encodeURIComponent(acct ? acct.token : '')}`);
export const postEvent = (kind, data) => api('POST', '/v1/events', { kind, data });
export const getFeed = () => api('GET', '/v1/feed').then((j) => j.feed);
export const cheer = (id) => api('POST', `/v1/events/${encodeURIComponent(id)}/cheer`).then((j) => j.cheers);
export const pushXp = (xp) => api('PUT', '/v1/xp', { xp });
export const getLeague = () => api('GET', '/v1/league');
// Public key for training reminders (Web Push). The private half stays on the server.
export const VAPID_PUBLIC = 'BA-iSJQV7KA_YQPkYUDikQcGFvRf4LYVrUVxLhDxkFIE3WdqRGiqr0NRDmxibqtO9oJwzVCk8ag_PPTaC63d944';
export const savePush = (sub, hour, minute, days, tz) => api('PUT', '/v1/push', { sub, hour, minute, days, tz });
export const deletePush = (endpoint) => api('DELETE', '/v1/push', { endpoint });
