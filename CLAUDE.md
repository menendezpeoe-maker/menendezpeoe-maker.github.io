# Test 29N · guía rápida para Claude

Test político gratuito y neutral para las elecciones generales del 29 de noviembre de 2026 (https://test29n.es).

## Lee primero (y solo lo necesario)
1. La **ficha de continuidad**, al principio de `plan/ESTADO.md`: estado real y orden de trabajo.
2. La sección de tu tanda en `plan/PLAN.md`, y sus reglas 1–15. Las instrucciones permanentes del titular están en la regla 5.
3. Solo si hace falta: `plan/ESTADO_MAESTRO_WEB_POLITICA.md` (mapa del proyecto), `plan/MISION.md` (manda donde sea más exigente) y `plan/PROMPT-ORIGINAL.md`.

No vuelvas a analizar lo que ya funciona. Busca con `grep` en vez de leer archivos enteros.

## Reglas que nunca se rompen
- Neutralidad: nunca recomendar voto; nada que parezca una encuesta, ni publicar o promocionar del 24 al 28 de noviembre.
- Nada inventado: posturas, fuentes, fechas y cifras, siempre verificadas y enlazadas.
- Privacidad: sin registro ni cookies; el contador no registra respuestas. Responsable público: «Dery». Ningún dato bancario.
- Los términos privados se leen de la variable `PRIVATE_TERMS`; nunca se escriben en el repositorio.
- `fuente` es la única fuente de verdad: primero se sube a `fuente` y después se publica en `main` (que solo contiene `dist/`). Nunca se fuerza un push.
- Commits con `git -c user.name=menendezpeoe-maker -c user.email=menendezpeoe@gmail.com`, sin identificadores de modelo.
- Guarda el trabajo en `fuente` al terminar cada bloque: el contenedor es temporal y el límite de uso puede cortar la sesión.

## Comandos
```sh
node build.mjs                                  # valida src/ y genera data/*.json
SITE_URL=https://test29n.es/ node publish.mjs   # genera dist/
sh qa/mklocal.sh                                # _local.html para probar
python3 -m http.server 8765 &                   # raíz (qa con _local.html)
(cd dist && python3 -m http.server 8766 &)      # dist/
NODE_PATH=$(npm root -g) node qa/<batería>.mjs  # BASE=https://test29n.es/ para la web real
node indexnow.mjs                               # tras publicar
```
Baterías: `seo onboarding e2e share sections profiles map support audit features explain growth stats`. La batería `share` solo pasa del todo en el dominio real.
