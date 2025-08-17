
const CACHE = "puntoya-v1";
const BASE = "/gps-app/";
const ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "manifest.json",
  BASE + "PuntoYa.html",
  BASE + "PUNTOMAPS.png",
  BASE + "excel-icon.png",
  BASE + "basurero-icon.png",
  BASE + "Mis-ubicaciones-icon.png",
  BASE + "Flecha.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (!url.pathname.startsWith(BASE)) return;
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request)));
});
