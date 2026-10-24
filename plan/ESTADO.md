# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 24 oct 2026)

**Aviso para la próxima tanda (leer primero).** El 20 oct se agotó el límite de uso y las tandas T9 (a medias), T2, T3 y T4 no llegaron a hacerse. Las tareas perdidas no se recuperan solas. Orden de trabajo acordado, por valor:
1. ~~Cerrar T9, parte 1~~ **Hecho y publicado el 23 oct** (ver la entrada de abajo).
2. ~~T2~~ **Hecho y publicado el 23 oct** (ver la entrada de abajo).
3. ~~T3~~ **Hecho y publicado el 23 oct.**
4. La tanda del día.
5. ~~T4~~ **Hecho y publicado el 24 oct.**
6. ~~T10~~ **Hecho y publicado el 24 oct.**
7. ~~T5~~ **Hecho y publicado el 24 oct** (adelantada a petición del titular). Siguiente: T6–T8 y T11 según el calendario. **Hay posturas pendientes de decisión del titular** (ver la entrada de T5).
Cada tanda hace lo que le dé tiempo en este orden y anota aquí lo que quede. Referencia completa: `plan/ESTADO_MAESTRO_WEB_POLITICA.md`.


**Estado de los bloques**
- T1 · Portada y entrada: completada y verificada (web real, 19 oct).
- T9 · Buscadores y datos abiertos: completada y verificada (web real, 23 oct).
- T2 · Test rápido y resultados: completada y verificada (web real, 23 oct).
- T3 · Guía para votar y calendario: completada y verificada (web real, 23 oct).
- T4 · Provincias, simulador y glosario: completada y verificada (web real, 24 oct).
- T10 · Tests por tema, imágenes para redes y kit: completada y verificada (web real, 24 oct).
- T5 · Fuentes de PSOE y PP: completada y verificada (web real, 24 oct). T6–T8, T11: pendientes.
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

## 24 oct 2026 · T5 · Fuentes de las posturas de PSOE y PP
- **Alcance:** las 71 posturas de prioridad 1 y 2 sin fuente de PSOE (37) y PP (34), más las dos discutidas del PSOE (E06 y H01). Investigadas por dos subagentes y revisadas una a una. La prioridad 3 queda para R1/R2.
- **Resultado:** 49 fuentes nuevas o mejoradas (31 del PSOE, 20 del PP; dos sustituyen a las anteriores de E06 y H01). Total de la web: 82 → 131. Los 33 enlaces únicos responden con 200.
  - **PSOE:** 42 de 107 posturas con fuente; 29 estimadas.
  - **PP:** 34 de 107 posturas con fuente; 43 estimadas.
  - Se descartaron por indirectas o antiguas: PSOE C03, E02, I05, I07 y J02; PP A05, C04, G04, H02, H09 y J02.
- **Postura cambiada (evidencia literal, nota en `NOTES`):** PSOE J08 (estándares sanitarios comunes), 4 estimada → 5 documentada: su programa de 2023 promete tiempos máximos de espera por ley en todo el SNS.
- **Posturas discutidas del PSOE (pendientes desde T9):** quedan respaldadas. H01 trata del 3,5 % de la OTAN, que Sánchez rechazó por carta (19/06/2025). E06: pacto PSOE-Sumar de junio de 2026 para derogar las injurias a la Corona. Los valores extremos en «Europa y mundo» e «Inmigración» descansan ahora en posturas documentadas (H01, F02, F03, H09).
- **Pendiente de decisión del titular (regla 8; no se ha cambiado nada):**
  - PP B05 (pisos turísticos) 3 → 4: limitan Madrid y Andalucía, pero votó contra la moratoria estatal.
  - PP E08 (ley intrafamiliar) 2 → 1: su programa promete cumplir el Pacto de Estado «sin pasos atrás».
  - PP F02 (expulsar a irregulares) 2 → 3: el contrato de 2026 prohíbe las regularizaciones colectivas.
  - PP I02 (universidad gratuita) 2 → 3: Galicia y Castilla y León la dan solo a quien aprueba.
  - PP I05 (elegir el castellano) 5 → 4: su programa habla de «equilibrio» entre lenguas vehiculares.
  - PP J08 (estándares sanitarios) 2 → 3: su programa homogeneiza algunos estándares.
  - PP K05 (macrogranjas) 1 → 2: fuente de 2022, ambigua.
  - PP L03 (cambio registral a los 16) 2 → 1: recurrió exactamente esto ante el TC.
  - PP G04 (trasvases) 4 → 3: el PP está dividido por territorios.
  - PSOE L09 (burka) 2 → 1: votó contra las dos leyes de prohibición de 2026.
- **Estimadas sin fuente (regla 12; justificación de la estimación en `JUSTIF`):** PSOE D01, E02, F07, J02, J03; PP A05, B05, G04, H09, I02, I07, J02, J08. PSOE D01 y PP I07 pasan a «estimadas» porque no hay ninguna fuente reciente (sin cambiar su valor). **Documentadas sin enlace propio:** PSOE C03, I05, I07; PP C04, D07, F02, H02, I05, K05.
- **Revisión independiente:** corregidas una cifra y una cita que no estaban en sus fuentes (PSOE F02, PP L03), tipos de fuente iguales para todos (una votación en las Cortes es «parlamento» aunque se cite por la prensa), términos cargados y redacción de varias justificaciones.
- **Justificaciones:** nuevo `JUSTIF` en `src/preguntas.src.mjs` (de 20 a 200 caracteres, terminadas en punto, validadas en `build.mjs`), publicado como `why` en `data/preguntas.json`. 56 ya escritas; T8 las mostrará.
- **Fecha de los datos:** `UPDATED` pasa al 24 de octubre de 2026.
- **Pruebas:** las 19 baterías pasan en local y en https://test29n.es. IndexNow: 200 OK, 227 URL.

## 24 oct 2026 · T10 · Tests por tema, imágenes para redes y kit de difusión
- **Tests por tema** (vivienda, inmigración, impuestos y economía, sanidad, energía y medioambiente, territorio; 6 o 7 preguntas, lista en `src/temas.src.mjs` y copiada en `assets/papeleta.js`, una prueba comprueba que coinciden):
  - Se empiezan desde la portada (`#temas`) o con `/?tema=<id>`. Si ya hay un test guardado, se pide confirmación (portada) o se señala el tema sin borrar nada (`?tema=`).
  - El último paso solo pide la provincia; el resultado se titula «Test de …» y el perfil se limita a la dimensión que mide el tema. «Afinar» pasa a la exprés conservando las respuestas.
  - Compartir: texto con el tema y enlace `?tema=`; código propio por tema en los enlaces `#r2` (v, i, k, s, g, x; los antiguos r, e, m, c siguen valiendo); tarjetas con la etiqueta del tema, su dimensión y las siguientes coincidencias.
  - Páginas `/tests/` y `/tests/<tema>/` (7 nuevas, en el sitemap y en los pies).
- **Imágenes para redes** (`qa/redes.mjs` → `qa/redes/` → `dist/redes/`): 29 «preguntas del día» del 26 oct al 23 nov (ninguna del 24 al 28) y una tarjeta por tema, 1080 × 1350. Sin casillas de respuesta, para que no parezcan una encuesta.
- **`plan/KIT.md`:** textos y guiones (tests por tema, reta a un amigo, guía para votar, simulador, pregunta del día), calendario día a día hasta el 27 nov (pausa del 24 al 28) con fechas comprobadas contra `src/votar.src.mjs`, y 43 contactos con canal público verificado el 24 oct, por prioridad.
- **Revisión independiente:** nada bloqueante. Corregido: viñetas en `/tests/<tema>/`, imágenes con aspecto de encuesta, guion sin partido visible, «okupación», textos de la portada y del reto, frase de territorio, versión marcada tras «Empezar de nuevo», separación en la tarjeta cuadrada.
- **Pruebas:** nueva `qa/temas.mjs`; las 19 baterías pasan en local y en https://test29n.es (en la web real, `temas` esperaba antes de que arrancara la app; corregida la espera). IndexNow: 200 OK, 227 URL.

## 24 oct 2026 · T4 · Provincias, simulador y glosario
- **52 páginas `/provincias/<id>/` y su índice:** diputados según el anexo del Real Decreto 806/2026 (suman 350, en `src/escanos.src.mjs`), senadores según el art. 3.2 del real decreto y la LOREG (con la Ley Orgánica 2/2026, Ibiza y Formentera eligen 1 senador cada una), las candidaturas que se presentan según los datos del test y un enlace al simulador.
  - Revisar cuando el BOE publique las candidaturas proclamadas (3 nov): D21, JMM y Soria ¡Ya! siguen «por confirmar». Tarea de S1.
- **Simulador `/escanos/`:** D'Hondt con barrera del 3 % de los votos válidos (incluido el voto en blanco). Desempate por más votos y, si también empatan en votos, aviso de que la ley lo resuelve por sorteo (art. 163.1.d). Sin encuestas ni estimaciones; botón con el ejemplo del art. 163 de la LOREG.
- **Glosario `/glosario/`:** 19 términos con su artículo de la LOREG o de la Constitución (`src/glosario.src.mjs`).
- **Revisión legal independiente** contra la LOREG consolidada, la Constitución y el real decreto. Corregido: senadores de las islas, artículo del desempate, definiciones de escaño, mesa, jornada de reflexión, voto nulo y voto por correo, y la frase sobre el reparto por población.
- **Pruebas:** nueva `qa/territorio.mjs`. Las 18 baterías pasan en local y en https://test29n.es. IndexNow: 200 OK, 220 URL.

## 23 oct 2026 · T3 y T9 (parte 2)
- **T3, `/votar/` y `/calendario/`:** datos en `src/votar.src.mjs`, solo de fuentes oficiales abiertas y comprobadas: Real Decreto 806/2026, calendario electoral de la JEC para el 29N, Oficina del Censo Electoral (INE), Correos, Exteriores, LOREG y RD 1612/2007. Cubre quién vota y qué llevar, dónde votar, voto por correo, voto desde el extranjero (CERA y ERTA) y voto accesible. El calendario tiene 20 fechas, cada una con su fuente. Enlaces en el pie de todas las páginas, en `/prensa/` y en el sitemap. Prueba: `qa/votar.mjs`.
  - Un revisor independiente comprobó cada fecha contra la JEC, el INE, el BOE, Correos y Exteriores; aplicadas sus correcciones.
  - Sin dato oficial por ahora: el canal concreto para pedir el voto en braille (Interior no respondía) y el horario de los colegios en una fuente propia del 29N (se usa el art. 84.1 de la LOREG).
  - `sede.ine.gob.es` (consulta de mesa) devolvía 503 desde aquí el 23 oct. Es el servicio oficial, enlazado desde la web del INE, que sí responde.
  - Revisar tras el 3 nov, cuando se publiquen las candidaturas proclamadas (S1).
- **T9, parte 2:**
  - 10 comparativas `/comparar/<a>-<b>/` y su índice, con los mismos datos que el comparador.
  - `/datos/`, con `posturas.csv` y `posturas.json` (2191 posturas, CC BY 4.0, con fuentes, estimadas marcadas).
  - Mini test insertable `/insertar/`: 5 preguntas, sin cookies ni almacenamiento ni peticiones a terceros, dentro de un iframe, con el código en `/prensa/`. No cuenta visitas dentro del marco, porque `stats.js` excluye los iframes.
  - Prueba: `qa/opendata.mjs`.
- **Pruebas:** las 17 baterías pasan en local y en https://test29n.es. IndexNow: 200 OK, 165 URL.
- **Pendiente de decisión del titular (posturas, regla 8):** el revisor señaló como discutibles, en la comparativa PSOE–PP:
  - PSOE «totalmente en desacuerdo» con «Más gasto en defensa» (documentada); el Gobierno subió el gasto al 2 % en 2025 y rechazó el 5 % de la OTAN;
  - PSOE «de acuerdo» con despenalizar las injurias a la Corona;
  - valores muy extremos del PSOE en «Europa y mundo» (−100) e «Inmigración» (−95).

  No se han cambiado: se revisarán con fuentes en T5.
- **Para el titular:** puede borrar en GitHub la rama de respaldo `wip-t3`, que ya no hace falta; el sistema no me deja borrarla.

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
