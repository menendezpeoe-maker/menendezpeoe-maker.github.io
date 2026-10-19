# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 19 oct 2026, tras T1)

**Estado de los bloques**
- T1 · Portada y entrada: completada y verificada (web real, 19 oct).
- T9 · Buscadores y datos abiertos (20 oct): pendiente.
- T2, T3, T4, T10, T5–T8, T11: pendientes.
- R1, R2, S1, S2, P1: pendientes.
- Donación por Bizum: bloqueada por dependencia externa (aprobación de Stripe; la comprueba otra tarea).

**Archivos clave y decisiones (T1)**
- `papeleta-29n.html`: titular único (h1 «Lo que piensas, tema a tema») dentro del banner, con el botón `#start-btn` («Empezar el test», envía el formulario `#setup` con la versión elegida). El formulario solo elige versión. La provincia (`#f-prov`) está en el último paso (`#v-prios`). La pregunta de ejemplo (C01) tiene 5 botones `[data-ex]`.
- `assets/papeleta.js`: `newTest()`/`launchQuiz()`; `startFromExample()` pone C01 la primera con la respuesta guardada (si hay un test a medias, la cambia en ese test); `setProv()` guarda la última provincia en `papeleta29n.prefs` (`prov`); `openResults()` no muestra resultados sin provincia; `loadState()` borra `sex` y `age` de estados antiguos.
- `qa/brand/banner.html`: copia fija del banner antiguo para la imagen de cabecera de redes (`qa/brandkit.mjs`), que ya no depende de la portada.
- Las pruebas esperan a `#start-btn:not([disabled])` como señal de carga.

**Pruebas (19 oct)**
- Local: 12 baterías + `qa/onboarding.mjs`, todas OK (`share`: solo fallan sus 4 comprobaciones de dominio, como siempre en local).
- Web real (`BASE=https://test29n.es/`): las 13 OK, también `share`. `node indexnow.mjs`: 200 OK, 43 URL.

**Errores pendientes (menores, anteriores a T1)**
- En la barra del test a 390 px, «Área 1 de 12 · Economía y…» se corta con puntos suspensivos.

**Próxima tarea prioritaria:** T9 (20 oct), buscadores y datos abiertos. No depende de nada externo.

## 19 oct 2026 · T1 · Fase 1a: entrada en un toque
- **Hecho y verificado en la web real:**
  - Quitados sexo y edad del formulario, del resumen («who»), del estado guardado y de los textos de privacidad. Los estados antiguos siguen cargando y pierden esos campos.
  - Un solo mensaje principal: el titular va dentro del banner, con la pregunta «¿Con quién coincides el 29N?» como subtítulo.
  - «Empezar el test» se ve sin scroll a 390 × 844 (termina a 480 px) y en escritorio. Un toque empieza la versión exprés.
  - La provincia se pide en el último paso, antes de los resultados, y se recuerda la última elegida. Sin provincia no hay resultados. Los enlaces antiguos (#r2…) funcionan.
  - La pregunta de ejemplo es real: responderla empieza el test con esa respuesta guardada, sin duplicarla.
  - Pruebas nuevas en `qa/onboarding.mjs` (portada, un toque, ejemplo, provincia al final, estados y enlaces antiguos, privacidad), y adaptadas las anteriores.
- **Revisión (reglas 9 y 14):** capturas a 390 × 844 y 1280 × 800, claro y oscuro, revisadas por mí y por un revisor independiente. Corregido: textos de privacidad, aviso del resultado compartido, «partidos» → «candidaturas» en prioridades, mensaje de provincia, «Sin registro» duplicado, el «·» suelto de «Dilema», el aviso «Respuesta guardada» (ahora arriba durante el test), la etiqueta «por confirmar» y el color de los enlaces del pie. Datos y neutralidad: sin problemas. axe (en `audit`): sin infracciones.
- **Comprobación de partida (regla 13):** al empezar, el `dist/` generado desde `origin/fuente` (6ade094) era idéntico a `main`.
- **Incidencia:** al empezar, a `origin/fuente` le faltaba código que ya estaba publicado (pages.mjs, indexnow.mjs, qa/growth.mjs, qa/badge.mjs, banner, comparación con un amigo). La sesión principal lo subió (6ade094) antes de cambiar nada.
- **Pendiente:** nada de T1.
- **Para el titular:** nada obligatorio. Si quieres, prueba la portada en tu móvil.

## 19 oct 2026 · Preparación
- El plan está en `plan/PLAN.md` y el encargo completo, en `plan/PROMPT-ORIGINAL.md`.
- La web publicada ya incluye:
  - Resultado explicado y comparador.
  - Comparación con un amigo.
  - 42 páginas por partido y por tema, y /prensa/.
  - Contador GoatCounter `test29n`.
  - Banner e imagen de marca.
  - IndexNow.
- Hay 82 posturas con fuente enlazada.
- Pendiente de Stripe: aprobación de Bizum. Una tarea aparte lo comprueba.
- Primera tanda: T1, el sábado 24 de octubre.
