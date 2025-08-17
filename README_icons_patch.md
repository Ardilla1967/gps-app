
# Patch: Iconos + manifest + service worker

Este patch agrega/actualiza:
- `icon-180/192/256/384/512.png` (raíz)
- `manifest.json` (maskable + más tamaños + id/orientation)
- `sw.js` (CACHE=v3; ya no precachea manifest)
- `index.html` (link `apple-touch-icon` + `manifest.json?v=2`)

## Cómo subir (sobre tu rama del PR, p. ej. `feat/pwa`)
1) En GitHub, **Add file → Upload files** y arrastra estos archivos a la **raíz** del repo:
   - `index.html`
   - `manifest.json`
   - `sw.js`
   - `icon-180.png`, `icon-192.png`, `icon-256.png`, `icon-384.png`, `icon-512.png`
2) Haz **Commit** a la rama del PR (o crea una rama nueva y PR).
3) **Merge** a `main`.

## GitHub Pages
- Settings → Pages → *Deploy from a branch* (`main` / `/ (root)`)

## Limpieza de caché en el celu
- Abre la URL, recarga 2–3 veces. Si no cambia:
  - Ajustes del sitio → Borrar datos (esto limpia SW/manifest en caché)
  - Vuelve a abrir y prueba **Instalar app**.
