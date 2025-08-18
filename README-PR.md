# PR: PWA instalable con icono (Android)

Este PR agrega lo mínimo para que la app se pueda **instalar con icono** desde Chrome/Edge en Android.

## Archivos nuevos
- `manifest.json` — incluye `icons` (192 y 512).
- `sw.js` — service worker mínimo con `fetch` handler.
- `icon-192.png`, `icon-512.png` — placeholders. Reemplázalos luego por tus definitivos.

## Cambios que debes hacer en `index.html`
En el `<head>`, después de los `<meta>` iniciales, agrega:

```html
<base href="./">
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#3282F6">
<link rel="icon" href="icon-256.png" sizes="256x256">
<link rel="apple-touch-icon" href="icon-180.png">
```

Al final del `<body>`, agrega el registro del SW:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js', { scope: './' }).catch(console.error);
  }
</script>
```

> Si tu `index.html` ya tenía `link rel="manifest"` o registro de SW, deja **uno solo** (no dupliques).

## Prueba
1. Sirve por **HTTPS** (GitHub Pages) o `http://localhost` para pruebas locales.
2. Abre en **Chrome Android** → menú ⋮ → **Instalar app** / **Añadir a pantalla de inicio**.
3. Verás el **icono** definido en `manifest.json`.

## Notas
- Android usa los iconos del **manifest** para el launcher (no los `<img>` del HTML).
- Mantén el `start_url` y `scope` en `"./"` si tu sitio está en `/gps-app/` en GitHub Pages.
