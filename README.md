# Test 29N · código fuente

Código fuente de https://test29n.es (la web publicada está en la rama `main`, generada con `publish.mjs`).

- `src/` — preguntas (`preguntas.src.mjs`), partidos (`partidos.src.mjs`) y políticos (`politicos.src.mjs`), editables.
- `node build.mjs` — valida las fuentes y genera `data/*.json`.
- `node qa/assets.mjs` — imágenes de marca y vista previa para redes.
- `node publish.mjs` — genera `dist/` para el dominio (`SITE_URL` opcional).
- `qa/` — pruebas con Playwright (`NODE_PATH=$(npm root -g) node qa/<prueba>.mjs`, con `sh qa/mklocal.sh` y un servidor local en :8765).
