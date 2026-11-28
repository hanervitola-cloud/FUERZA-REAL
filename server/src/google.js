// Sign in with Google. The app gets a signed ID token from Google (a JWT) and sends it here.
// We check Google's signature, who it was made for and that it has not expired, and then use only
// Google's user id (sub). Nothing else is kept: no email, no photo.

let keyCache = { at: 0, keys: null };
async function googleKeys(env) {
  // Local tests only: a practice key next to Google's real ones (needs DEV=1, which production never has).
  if (env.DEV === '1' && env.GOOGLE_TEST_JWKS) {
    const test = JSON.parse(env.GOOGLE_TEST_JWKS).keys;
    try { return [...test, ...(await realKeys())]; } catch (e) { return test; }
  }
  return realKeys();
}
async function realKeys() {
  if (keyCache.keys && Date.now() - keyCache.at < 36e5) return keyCache.keys;
  const r = await fetch('https://www.googleapis.com/oauth2/v3/certs');
  if (!r.ok) throw new Error('google_keys');
  keyCache = { at: Date.now(), keys: (await r.json()).keys || [] };
  return keyCache.keys;
}

const bytes = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), (c) => c.charCodeAt(0));
const part = (s) => JSON.parse(new TextDecoder().decode(bytes(s)));

// Returns { sub, name } for a real, current token made for this app, or null.
export async function verifyGoogle(env, jwt) {
  if (typeof jwt !== 'string' || jwt.length > 4096) return null;
  const pieces = jwt.split('.');
  if (pieces.length !== 3) return null;
  let head, claims;
  try { head = part(pieces[0]); claims = part(pieces[1]); } catch (e) { return null; }
  if (head.alg !== 'RS256' || typeof head.kid !== 'string') return null;
  const jwk = (await googleKeys(env)).find((k) => k.kid === head.kid && k.kty === 'RSA');
  if (!jwk) return null;
  let good = false;
  try {
    const key = await crypto.subtle.importKey('jwk', { kty: 'RSA', n: jwk.n, e: jwk.e, alg: 'RS256', ext: true }, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    good = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, bytes(pieces[2]), new TextEncoder().encode(pieces[0] + '.' + pieces[1]));
  } catch (e) { return null; }
  if (!good) return null;
  const now = Date.now() / 1000;
  const ids = String(env.GOOGLE_CLIENT_ID || '').split(',').map((x) => x.trim()).filter(Boolean);
  if (!['accounts.google.com', 'https://accounts.google.com'].includes(claims.iss)) return null;
  if (!ids.includes(claims.aud)) return null;
  if (!(claims.exp > now - 60) || (claims.iat && claims.iat > now + 300)) return null;
  if (typeof claims.sub !== 'string' || !/^[0-9A-Za-z_-]{1,64}$/.test(claims.sub)) return null;
  return { sub: claims.sub, name: typeof claims.given_name === 'string' ? claims.given_name : typeof claims.name === 'string' ? claims.name : '' };
}
