// Sign in with Google, tested on the local server with a practice key (never Google's real one).
// node test_google.mjs setup <server dir> <private key file>   -> writes the practice public key into .dev.vars
// node test_google.mjs run <private key file> [base]           -> runs the checks against wrangler dev
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const CLIENT = 'test-client.apps.googleusercontent.com';
const [mode, a1, a2] = process.argv.slice(2);
const b64u = (buf) => Buffer.from(buf).toString('base64url');

if (mode === 'setup') {
  const mk = () => crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const good = await mk(), other = await mk();
  const pub = { ...(await crypto.subtle.exportKey('jwk', good.publicKey)), kid: 'test1', alg: 'RS256', use: 'sig' };
  writeFileSync(a2, JSON.stringify({ good: await crypto.subtle.exportKey('jwk', good.privateKey), other: await crypto.subtle.exportKey('jwk', other.privateKey) }));
  const f = join(a1, '.dev.vars');
  const lines = readFileSync(f, 'utf8').split(/\r?\n/).filter((l) => l && !/^GOOGLE_(CLIENT_ID|TEST_JWKS)=/.test(l));
  lines.push(`GOOGLE_CLIENT_ID=${CLIENT}`, `GOOGLE_TEST_JWKS='${JSON.stringify({ keys: [{ kty: pub.kty, n: pub.n, e: pub.e, kid: pub.kid, alg: 'RS256' }] })}'`);
  writeFileSync(f, lines.join('\n') + '\n');
  console.log('setup ok');
  process.exit(0);
}

const keys = JSON.parse(readFileSync(a1, 'utf8'));
if (mode === 'token') { // node test_google.mjs token <keys> <sub> -> prints one practice token
  const sub = process.argv[4] || '42';
  const now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg: 'RS256', kid: 'test1', typ: 'JWT' }));
  const body = b64u(JSON.stringify({ iss: 'https://accounts.google.com', aud: CLIENT, iat: now, exp: now + 3600, sub, given_name: 'Sofía' }));
  const k = await crypto.subtle.importKey('jwk', keys.good, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  console.log(head + '.' + body + '.' + b64u(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', k, new TextEncoder().encode(head + '.' + body))));
  process.exit(0);
}
const B = a2 || 'http://127.0.0.1:8787';
const imp = (jwk) => crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
async function token(claims, { key = 'good', kid = 'test1', alg = 'RS256' } = {}) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64u(JSON.stringify({ alg, kid, typ: 'JWT' }));
  const body = b64u(JSON.stringify({ iss: 'https://accounts.google.com', aud: CLIENT, iat: now, exp: now + 3600, sub: '1000', given_name: 'Sofía', email: 'x@example.com', ...claims }));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', await imp(keys[key]), new TextEncoder().encode(head + '.' + body));
  return head + '.' + body + '.' + b64u(sig);
}
const H = { 'content-type': 'application/json', Origin: 'http://localhost:8770' };
const call = async (method, path, tok, body) => {
  const r = await fetch(B + path, { method, headers: { ...H, ...(tok ? { Authorization: 'Bearer ' + tok } : {}) }, body: body ? JSON.stringify(body) : undefined });
  const t = await r.text();
  let j; try { j = JSON.parse(t); } catch (e) { j = t; }
  return { s: r.status, j };
};
const ok = (cond, msg) => { console.log((cond ? 'OK  ' : 'FAIL') + ' ' + msg); if (!cond) process.exitCode = 1; };
const sub = String(Date.now()); // a new practice Google user each run
const g = (claims, opts) => token({ sub, ...claims }, opts);

// Fakes and broken tokens are refused.
ok((await call('POST', '/v1/auth/google', null, { credential: 'abc.def.ghi' })).s === 401, 'garbage token refused');
ok((await call('POST', '/v1/auth/google', null, { credential: await g({}, { key: 'other' }) })).s === 401, 'token signed by someone else refused');
ok((await call('POST', '/v1/auth/google', null, { credential: await g({ aud: 'another-app' }) })).s === 401, 'token made for another app refused');
ok((await call('POST', '/v1/auth/google', null, { credential: await g({ exp: Math.floor(Date.now() / 1000) - 3600 }) })).s === 401, 'expired token refused');
ok((await call('POST', '/v1/auth/google', null, { credential: await g({ iss: 'https://evil.example' }) })).s === 401, 'token from another issuer refused');
ok((await call('POST', '/v1/auth/google', null, { credential: await g({}, { alg: 'none' }) })).s === 401, 'unsigned token refused');

// First sign-in makes the account; the name comes from the app, else from Google.
const first = await call('POST', '/v1/auth/google', null, { credential: await g({}) });
ok(first.s === 201 && first.j.created && /^[A-Z0-9]{24}$/.test(first.j.token) && first.j.name === 'Sofía', `new account with Google (${first.j.name}, ${first.j.code})`);
ok(!JSON.stringify(first.j).includes('example.com'), 'email is not stored or sent back');
const me1 = await call('GET', '/v1/me', first.j.token);
ok(me1.j.google === true && me1.j.id === first.j.id, 'account shows it is joined to Google');

// Same Google account on a second phone: same account, its own key; the first phone stays signed in.
const second = await call('POST', '/v1/auth/google', null, { credential: await g({}) });
ok(second.s === 200 && second.j.existing && second.j.id === first.j.id && second.j.token !== first.j.token, 'second phone opens the same account');
ok((await call('GET', '/v1/me', second.j.token)).s === 200 && (await call('GET', '/v1/me', first.j.token)).s === 200, 'both phones signed in');

// Joining Google to an account made without it keeps that account (and its data).
const anon = await call('POST', '/v1/users', null, { name: 'Pedro' });
await call('PUT', '/v1/backup', anon.j.token, { v: 1, workouts: [1, 2] });
const sub2 = sub + '7';
const linked = await call('POST', '/v1/auth/google', anon.j.token, { credential: await token({ sub: sub2 }) });
ok(linked.s === 200 && linked.j.linked && linked.j.id === anon.j.id, 'existing account joined to Google');
const back = await call('POST', '/v1/auth/google', null, { credential: await token({ sub: sub2 }) });
ok(back.j.id === anon.j.id && back.j.backup === true, 'new phone gets the same account and sees its backup');
ok((await call('GET', '/v1/backup', back.j.token)).j.data.workouts.length === 2, 'backup restored on the new phone');

// Signing out removes only this phone's key.
ok((await call('POST', '/v1/logout', second.j.token)).s === 200, 'sign out on the second phone');
ok((await call('GET', '/v1/me', second.j.token)).s === 401 && (await call('GET', '/v1/me', first.j.token)).s === 200, 'second phone out, first still in');
// An account without Google cannot sign out (it would be lost forever).
const lone = await call('POST', '/v1/users', null, { name: 'Solo' });
ok((await call('POST', '/v1/logout', lone.j.token)).s === 409, 'account without Google keeps its key');

// Deleting the account removes the Google link: signing in again starts a new account.
ok((await call('DELETE', '/v1/me', first.j.token)).s === 200, 'delete account');
ok((await call('GET', '/v1/me', first.j.token)).s === 401, 'old key no longer works');
const again = await call('POST', '/v1/auth/google', null, { credential: await g({}) });
ok(again.s === 201 && again.j.id !== first.j.id, 'after deleting, Google makes a fresh account');
