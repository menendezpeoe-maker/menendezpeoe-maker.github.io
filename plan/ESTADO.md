# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 23 oct 2026)

**Aviso para la próxima tanda (leer primero).** El 20 oct se agotó el límite de uso y las tandas T9 (a medias), T2, T3 y T4 no llegaron a hacerse. Las tareas perdidas no se recuperan solas. Orden de trabajo acordado, por valor:
1. ~~Cerrar T9, parte 1~~ **Hecho y publicado el 23 oct** (ver la entrada de abajo).
2. ~~T2~~ **Hecho y publicado el 23 oct** (ver la entrada de abajo).
3. **T3** (guía para votar y calendario; fecha ya verificada: Real Decreto 806/2026, BOE del 6 oct, elecciones el 29 nov, campaña del 13 al 27 nov).
4. La tanda del día.
5. **T4** y el resto de T9 (`/comparar/`, `/datos/`, `/insertar/`) pasan a R1 y R2.
Cada tanda hace lo que le dé tiempo en este orden y anota aquí lo que quede. Referencia completa: `plan/ESTADO_MAESTRO_WEB_POLITICA.md`.


**Estado de los bloques**
- T1 · Portada y entrada: completada y verificada (web real, 19 oct).
- T9 · Buscadores y datos abiertos: parte 1 completada y verificada (web real, 23 oct). Pendiente: `/comparar/`, `/datos/` e `/insertar/` (pasan a R1).
- T2 · Test rápido y resultados: completada y verificada (web real, 23 oct).
- T3, T4: pendientes (no se ejecutaron por el límite de uso). T10, T5–T8, T11: pendientes.
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

## 23 oct 2026 · T2 · Test rápido y resultados
- **Versión rápida (15 preguntas, unos 3 minutos), ahora la de por defecto:** una pregunta núcleo de cada una de las 12 áreas más 3 elegidas por cuánto distinguen entre partidos. Cubre las 7 dimensiones, con 6 afirmaciones en un sentido y 7 en el otro. Es fija (`quickOrder()` en `assets/papeleta.js`). «Afinar» lleva a la exprés conservando las respuestas. Código `r` en los enlaces compartidos; los antiguos siguen funcionando.
- **Perfiles simulados (`qa/quick.mjs`):** respondiendo exactamente como cada partido, sale primero en 25 de 25 casos. Con ruido (3 de las 15 respuestas movidas un punto, 12 partidos × 3 variantes), en 34 de 36. Los 2 fallos son Podemos, que sale detrás de Frente Amplio, porque son posturas muy parecidas.
- **Resumen en una pantalla:** mayor coincidencia y porcentaje, 3 coincidencias y 3 choques, perfil en una frase, solidez, «Compartir» y «Reta a un amigo» (enlace con las respuestas, con aviso). Todo cabe en la primera pantalla a 390 × 844 y a 1280 × 800. El resto queda plegado tras «Ver el análisis completo»: se despliega al pulsarlo o desde la navegación interna, y se recuerda (`papeleta29n.prefs.full`). El mapa pasa a la parte avanzada, detrás del comparador.
- **Tarjeta para compartir:** revisada en formato historia; no muestra respuestas.
- **Pruebas:** nuevas `qa/quick.mjs` y `qa/summary.mjs`. `qa/_full.mjs` hace que las baterías que revisan el análisis completo lo abran desplegado. Las 15 baterías pasan en local y en https://test29n.es.
- **Revisión:** revisor independiente; aplicados el aviso de privacidad de «Reta a un amigo», los textos de un resultado compartido, el mensaje duplicado y las descripciones de las versiones.
- **Pendiente menor:** en el móvil, las listas del resumen muestran solo el tema, sin «Tú: … · Partido: …», para caber en una pantalla. La barra de secciones no indica que se puede desplazar.

## 23 oct 2026 · T9 (parte 1) · Buscadores
- **Hecho y verificado en la web real:**
  - Título «Test político 2026: ¿con qué partido coincides? · Elecciones 29N» y descripción con «test político», «elecciones generales 2026» y «a quién votar» (sin recomendar voto). Open Graph y Twitter, coherentes.
  - Un único H1 en la portada. El aviso sin JavaScript ya no es un H1, y las pantallas ocultas usan H2.
  - Preguntas frecuentes en HTML estático y visible, con datos estructurados `FAQPage` generados desde el propio HTML. La fecha está comprobada en el Real Decreto 806/2026 (BOE del 6 oct): elecciones el 29 nov y campaña del 13 al 27 nov.
  - 107 páginas `/preguntas/<id>/` («qué piensa cada partido»), índice `/preguntas/` y enlaces desde los temas y el pie.
  - `qa/seo.mjs`: título y descripción de la portada, H1 único por página, preguntas frecuentes iguales a los datos estructurados, títulos y descripciones únicos en las 151 páginas, y sitemap completo.
  - Pruebas: las 13 baterías OK en local y en https://test29n.es. IndexNow: 200 OK, 151 URL.
- **Revisión (reglas 9 y 14):** capturas a 390 y 1280 px, en claro y oscuro, de las preguntas frecuentes y de las páginas de pregunta. Un revisor independiente comprobó la fecha en el BOE y la coherencia con el aviso de privacidad; aplicadas sus 3 mejoras: descripción más corta, frase de «¿Es neutral?» y mención de GoatCounter con enlace a la privacidad.
- **Pendiente de T9:** `/comparar/`, `/datos/` e `/insertar/` (pasan a R1).
- **Además:** `CLAUDE.md` en la raíz, con el orden de lectura, las reglas clave y los comandos.

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
