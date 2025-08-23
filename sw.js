// Sube el número en cada despliegue
const VERSION = 15;
const CACHE_NAME = `puntoya-v${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './Flecha.png',
  './PUNTOMAPS.png',
  './Mis-ubicaciones-icon.png',
  './icon-180.png',
  './icon-192.png',
  './icon-256.png',
  './icon-384.png',
  './icon-512.png',
];

// INSTALL: precachea (forzando ir a red)
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((c) =>
      c.addAll(ASSETS.map((url) => new Request(url, { cache: 'reload' })))
    )
  );
  self.skipWaiting();
});

// ACTIVATE: limpia caches viejos
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : undefined)))
    )
  );
  self.clients.claim();
});

// Permitir SKIP_WAITING desde index.js (tu registro ya lo envía)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// FETCH:
// - HTML / navegación: network-first (con fallback a cache)
// - Estáticos: cache-first (y guarda en cache lo nuevo)
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // no cachear externos (p.ej. Google Maps)

  const isDoc =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    url.pathname.endsWith('/index.html');

  if (isDoc) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          return res;
        })
        .catch(() => undefined);
    })
  );
});
