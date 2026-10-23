# Estado maestro · Test 29N (web de test político)

Revisado el 23 oct 2026. Resume y enlaza; no repite lo que ya está en `PLAN.md`, `MISION.md`, `PROMPT-ORIGINAL.md` y `ESTADO.md`. Marcas: **[H]** hecho verificado · **[D]** decisión aprobada · **[P]** propuesta · **[?]** pendiente o incierto.

## 1. Objetivo y alcance
- **[H]** Test político gratuito y neutral para las elecciones generales del 29 de noviembre de 2026 (convocadas por el Real Decreto 806/2026, BOE del 6 oct). Compara las respuestas de cada persona con las candidaturas de su provincia.
- **[D]** Misión completa, prioridades y calendario: `plan/MISION.md`, que manda donde sea más exigente. Plan por tandas: `plan/PLAN.md`.

## 2. Versión vigente y evidencias
- **[H]** Versión publicada: rama `main` en `cf45a08` (T1, 19 oct). Sirve `papeleta.js?v=f759a313aa` en https://test29n.es.
- **[H]** Código fuente válido: rama `fuente` en GitHub (`menendezpeoe-maker/menendezpeoe-maker.github.io`), en `e712629`. Regla 13: es la única fuente de verdad.
- **[H]** El 20 oct, `dist/` generado desde `origin/fuente` era idéntico byte a byte a `main`.
- **[H]** Solo hay dos ramas remotas (`fuente` y `main`); no hay otras copias en GitHub.
- **[?]** Trabajo de T9 sin guardar: solo existe en la copia local del contenedor de la sesión de las tandas. Son cambios en `papeleta-29n.html`, `publish.mjs`, `pages.mjs`, `assets/papeleta.css`, `qa/share.mjs` y el archivo nuevo `qa/seo.mjs`. Está probado en local y sin publicar. Se pierde si el contenedor se recicla.

## 3. Archivos principales (rama `fuente`)
- `src/preguntas.src.mjs`: 107 preguntas, 12 áreas, 7 dimensiones y posturas de 1 a 5 por partido (estimadas con `~`), más `NOTES`, `SOURCES` y `FAMILIES`.
- `src/partidos.src.mjs`: 27 partidos (25 activos; UPL y Por Ávila retirados) y 52 circunscripciones. Por confirmar: D21, JMM y Soria ¡Ya!
- `src/politicos.src.mjs` y `assets/politicos/`: perfiles y fotos con sus créditos.
- `build.mjs`: valida y genera `data/*.json`.
- `assets/papeleta.js` (aplicación), `assets/papeleta.css` y `papeleta-29n.html` (cuerpo de la página).
- `publish.mjs`: genera `dist/` con CSP, Open Graph, sitemap, contador, IndexNow y 404.
- `pages.mjs`: páginas estáticas de partidos, temas y prensa.
- `indexnow.mjs`: aviso a los buscadores.
- `qa/`: 15 baterías Playwright (`e2e`, `share`, `sections`, `profiles`, `map`, `support`, `audit`, `features`, `explain`, `growth`, `stats`, `onboarding` y otras), más generadores de imágenes (`brandkit`, `badge`, `assets`) y `qa/brand/`.
- `plan/`: `MISION.md`, `PLAN.md`, `PROMPT-ORIGINAL.md`, `ESTADO.md` (con la ficha de continuidad) y este archivo.

## 4. Arquitectura
- **[H]** Web estática en JavaScript puro, sin servidor ni base de datos. Todo se calcula en el navegador.
- **[H]** Las respuestas se guardan solo en `localStorage` (`papeleta29n.v2`, `papeleta29n.prefs`, `papeleta29n.amigo`).
- **[H]** Cálculo: coincidencia pregunta a pregunta. Una pregunta importante pesa ×2, un área prioritaria ×1,5, una postura estimada ×0,6 y una respuesta neutral ×0,5. Además hay perfil en 7 dimensiones, solidez del resultado y mapa por análisis de componentes principales.
- **[H]** Publicación en GitHub Pages: `main` contiene solo `dist/` y el dominio es test29n.es, con HTTPS.
- **[H]** Contador GoatCounter `test29n`, sin cookies; solo registra pasos, nunca respuestas.

## 5. Funcionalidades
**Implementadas y publicadas [H]:**
- Tres versiones del test (24, 48 y 107 preguntas), con contexto neutral, importancia y prioridades.
- Resultados completos: perfil, dimensiones, temas, ranking, fichas, comparador, mapa, solidez, menor coincidencia, políticos afines, comparación con un amigo, compartir y donaciones.
- 42 páginas estáticas (partidos, temas y prensa).
- T1: sin sexo ni edad, titular único con «Empezar», provincia al final y pregunta de ejemplo real.

**Hechas en local, sin guardar ni publicar [?] (T9, parte 1):**
- Título «Test político 2026: ¿con qué partido coincides? · Elecciones 29N» y descripción nueva.
- Un único H1.
- 5 preguntas frecuentes con datos estructurados y fecha comprobada en el BOE.
- 107 páginas `/preguntas/<id>/` y su índice.
- `qa/seo.mjs`, que comprueba títulos y descripciones únicos.
- Las baterías pasaron en local. Faltan la revisión final y la publicación.

**Pendientes [?]:**
- Resto de T9: `/comparar/`, `/datos/` e `/insertar/`.
- T2 a T8, T10 y T11, según `PLAN.md`.
- 82 posturas tienen fuente; las fuentes de los grandes partidos se completan en T5–T7.

## 6. Decisiones confirmadas (no cambiar sin autorización)
- **[D]** Reglas de `PROMPT-ORIGINAL.md` (sección 3) y de `PLAN.md` (reglas 1–15): neutralidad, nada de encuestas ni de promoción del 24 al 28 de noviembre, nada de datos inventados, privacidad, responsable público «Dery», ningún dato bancario y los textos fijados.
- **[D]** Instrucciones permanentes del titular (regla 5 de `PLAN.md`):
  - publicar en `main` sin preguntar si se cumplen las reglas y pasan las pruebas;
  - primero `fuente` y después `main`;
  - si algo falla, publicar solo lo verificado;
  - una sola conversación trabaja en la web; las demás sesiones solo informan.
- **[D]** Commits como `menendezpeoe-maker` con `menendezpeoe@gmail.com`, sin identificadores de modelo.
- **[D]** Los términos privados se leen de la variable `PRIVATE_TERMS`; nunca se escriben en el repositorio.

## 7. Dependencias y ejecución
- Node 22 y Playwright con Chromium. No hay `package.json`: se usa `NODE_PATH=$(npm root -g)`.
- `node build.mjs` → `SITE_URL=https://test29n.es/ node publish.mjs` → `sh qa/mklocal.sh` → servidores en `:8765` (raíz, `_local.html`) y `:8766` (`dist/`) → `node qa/<batería>.mjs`. En la web real se usa `BASE=https://test29n.es/`. La batería `share` solo pasa del todo en el dominio real.
- Publicación: copiar `dist/` a `main` y hacer push; esperar a que aparezca el nuevo `papeleta.js?v=` y ejecutar `node indexnow.mjs`.

## 8. Tareas programadas (consultadas el 23 oct)
- **Ya disparadas, de una sola vez:**
  - T1: hecha.
  - T9: cortada por el límite de uso.
  - T2, T3 y T4: entregadas tarde (23 oct) y sin ejecutar.
- **Activas, en la sesión de las tandas:** T10 (24 oct), T5 (25), T6 (26), T7 (27), T8 (28), T11 (29), R1 (31), R2 (1 nov), S1 (10 nov), S2 (21 nov) y P1 (30 nov).
- **[D] Otras activas según el titular:** «Seguimiento Test 29N» y «Comprobar aprobación de Bizum en Stripe». No aparecen en el listado consultado (posiblemente están en otra superficie). No duplicarlas ni tocar lo que dependa de ellas.
- **[H]** Una tarea que falla por el límite de uso no se relanza sola.

## 9. Problemas, riesgos e incertidumbres
1. Pérdida del trabajo de T9 si no se guarda en `fuente`.
2. Retraso acumulado (resto de T9, T2, T3, T4 y T10) frente a solo dos tandas de recuperación.
3. El límite semanal de uso puede volver a cortar tandas; no se puede consultar desde la sesión.
4. Errores menores conocidos: en el móvil se corta «Área 1 de 12 · …» en la barra del test.
5. Programas del 29N y candidaturas proclamadas aún sin publicar (se revisan en S1).

## 10. Próximas acciones, por prioridad [P]
1. Guardar T9 en `fuente`, sin publicar. Consumo bajo.
2. Revisar y publicar la parte hecha de T9, y actualizar `ESTADO.md`. Consumo medio.
3. Anotar en `ESTADO.md` el nuevo orden: T2 → T3 → T10 → T4; el resto de T9 pasa a R1. Consumo bajo.
4. Continuar con las tandas programadas, empezando cada una por lo pendiente de más valor. Consumo alto por tanda.
