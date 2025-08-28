// Sube el número en cada despliegue
const VERSION = 18;
const CACHE_NAME = `puntoya-v${VERSION}`;

const ASSETS = [
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

// Permitir SKIP_WAITING desde la página
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

// FETCH:
// - HTML/navegación: network-first con fallback a index.html (ignorando querystring)
// - Estáticos: cache-first con “relleno” a medida que se descargan
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // no cachear externos (Google Maps, etc.)

  const isDoc =
    req.mode === 'navigate' ||
    req.destination === 'document' ||
    url.pathname.endsWith('/index.html');

if (isDoc) {
  e.respondWith((async () => {
    try {
      const preloaded = await e.preloadResponse;
      if (preloaded) {
        // guarda una copia en cache
        const copy = preloaded.clone();
        caches.open(CACHE_NAME).then(c => c.put('./index.html', copy));
        return preloaded;
      }
      const res = await fetch(req);
      const copy = res.clone();
      caches.open(CACHE_NAME).then(c => c.put('./index.html', copy));
      return res;
    } catch {
      return caches.match('./index.html', { ignoreSearch: true });
    }
  })());
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
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // limpia caches viejos
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : undefined)));

    // habilita navigation preload si existe (mejora el primer paint)
    if (self.registration.navigationPreload) {
      await self.registration.navigationPreload.enable();
    }
    await self.clients.claim();
  })());
});
