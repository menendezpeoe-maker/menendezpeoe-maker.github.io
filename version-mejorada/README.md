# Test 29N · versión mejorada (prueba local)

Versión independiente para probar en local. **No cambia la web publicada** (test29n.es) ni ningún archivo original: está en la rama `version-mejorada` y solo añade `assets/mejora.css` y `assets/mejora.js`.

## Cómo abrirla
1. Descarga la carpeta `version-mejorada/` entera (con su subcarpeta `assets/`).
2. Abre **`index.html`** (versión mejorada) y **`original.html`** (la web tal como está hoy) con doble clic, en dos pestañas. No hace falta servidor: los datos van dentro de cada archivo.
3. **Móvil y escritorio:** es la misma página, que cambia según el ancho. En Chrome o Edge, pulsa F12 → icono de móvil (Ctrl+Mayús+M) y prueba 320, 375 y 414 px; después, cierra ese modo para ver el escritorio. Compara siempre la misma anchura en las dos pestañas.

Las dos copias comparten lo que guardas en el navegador (tu progreso), así que puedes empezar el test en una y seguirlo en la otra.

Sin doble clic (opcional): `python3 -m http.server 8000` dentro de la carpeta y abre http://localhost:8000/.

## Cómo se genera (para mantenerla)
Desde la raíz del repositorio: `node build.mjs && SITE_URL=https://test29n.es/ node publish.mjs && node version-mejorada/build-local.mjs`.
Pruebas: `NODE_PATH=$(npm root -g) node version-mejorada/qa-iteracion.mjs` (textos idénticos nodo a nodo, anchuras, tamaños, teclado y axe-core).
