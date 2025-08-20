// sube el número cada vez que haya cambios
const CACHE_NAME = 'puntoya-v7';  // antes v6, v5, etc.
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './Flecha.png',
  // ...tus otros assets (iconos, css si lo separas, etc.)
];

// install
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

// activate: limpia caches viejos
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// fetch: cache-first con fallback a red
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
