// Keeps the app opening fast and working without internet.
// Code (html, js, css) comes from the network when there is one, so updates arrive right away, and from the
// saved copy when there is not. Pictures and the camera counter's files are saved the first time they load.
const CODE = 'es-code-v1';
const MEDIA = 'es-media-v1';
const SHELL = ['./', 'index.html', 'app.css', 'app.js', 'data.js', 'i18n.js', 'combat.js', 'figures.js', 'bodymap.js',
  'moves.js', 'plan.js', 'quotes.js', 'coach.js', 'repcount.js', 'net.js', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/logo-512.png'];
// Outside files the app uses: fonts, the pose model and its code, and the live-room library.
const CDN = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net', 'storage.googleapis.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CODE).then((c) => c.addAll(SHELL)).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => ![CODE, MEDIA].includes(k)).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function networkFirst(req) {
  const cache = await caches.open(CODE);
  try {
    const res = await fetch(req);
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  } catch (e) {
    return (await cache.match(req, { ignoreSearch: true })) || (req.mode === 'navigate' ? cache.match('index.html') : Response.error());
  }
}
async function cacheFirst(req) {
  const cache = await caches.open(MEDIA);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
  return res;
}

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === self.location.origin) {
    if (!url.pathname.startsWith('/app/') || url.pathname.endsWith('/sw.js')) return;
    e.respondWith(/\.(webp|png|jpe?g|svg)$/.test(url.pathname) ? cacheFirst(req) : networkFirst(req));
  } else if (CDN.includes(url.hostname)) {
    e.respondWith(cacheFirst(req));
  }
});
