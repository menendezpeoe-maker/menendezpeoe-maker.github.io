# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 26 oct 2026, T11)

**Estado de los bloques**
- Completadas y verificadas en la web real: T1, T9, T2, T3, T4 (19–24 oct), T10, T5, T6, T7 (24 oct), T8 (25 oct), T11 (26 oct).
- Pendientes, con tarea programada: T12 (27 oct), T12b (28), R0 (29), R1 (31), R2 (1 nov), S1 (10 nov), S2 (21 nov), P1 (30 nov).
- Donación por Bizum: bloqueada por dependencia externa (aprobación de Stripe).

**Orden de trabajo para la próxima tanda**
1. **T12:** empieza por `plan/APORTACION-T12.md` (58 fuentes de Junts, PNV y EH Bildu, sin aplicar; 11 cambian de valor, marcadas con ⚠). Método de las tandas de fuentes: el de T7 y T5, descrito en sus entradas de `plan/ESTADO-HISTORICO.md`.
2. **Programas del 29N:** a 26 oct ningún partido ha publicado el suyo (comprobado en prensa y agregadores; suelen salir unas dos semanas antes). Cada tanda lo vuelve a comprobar (regla 5).
3. **Pendiente de tandas anteriores:** 22 posturas documentadas de Podemos sin enlace (podemos.info bloquea a los robots; lista en la entrada de T7 del histórico) → T12b, R0 o R1. Fallo menor: 40 notas repiten la justificación y se muestran dos veces (detalle en `APORTACION-T12.md`).
4. **Pendiente de decisión del titular:** correo público de contacto (hoy el de la cuenta, en los enlaces `mailto:`); preguntas para un asesor en `plan/LEGAL.md`.

**Archivos clave y decisiones técnicas**
- Mapa del código y grupos de pruebas: `CLAUDE.md`. Pruebas con `node qa/run.mjs <grupo|todas>` (21 baterías, incluida `rendimiento` desde T11).
- Contador (GoatCounter, `count()` en `assets/papeleta.js`): pasos inicio, test-empezado, test-terminado, compartir, reto, donar-*, util-si/util-no. Nunca respuestas, provincia ni resultado (`qa/stats.mjs`).
- Tipografías recortadas con `qa/fonts.py` (necesita fonttools y brotli) y tipografías de reserva con medidas ajustadas al principio de `assets/papeleta.css`.
- Tras cambiar posturas: `node qa/run.mjs posturas` (regenera /correcciones/ y /metodologia/).

**Pruebas (26 oct)**
- Local: 21/21 baterías OK. Web real: ver la entrada de T11.

**Errores pendientes (menores)**
- En la barra del test a 390 px, «Área 1 de 12 · Economía y…» se corta con puntos suspensivos.
- La portada tarda unos 8 s en ser usable con 3G lenta: lo que más pesa tras las tipografías son `papeleta.js` (66 kB comprimido) y `data/preguntas.json` (69 kB), que se cargan enteros antes de activar «Empezar». Mejora posible (no urgente): activar el botón antes de tener todas las justificaciones.

Entradas anteriores al 25 oct: `plan/ESTADO-HISTORICO.md`.

## 26 oct 2026 · T11 · Embudo, rendimiento, preguntas legales y repaso
- **Embudo en GoatCounter:** entra (inicio) → empieza → termina → comparte (`compartir`, una vez por visita, con cualquier botón de compartir) → reta a un amigo (`reto`). Nueva pregunta opcional al final del resumen, «¿Te ha resultado útil el test?» (Sí / No): cuenta `util-si` o `util-no`, da las gracias y no vuelve a preguntar (se recuerda en el navegador). No aparece en resultados compartidos. Aviso de privacidad actualizado (frase partida en dos tras la revisión). Pruebas nuevas en `qa/stats.mjs`. En GoatCounter, el embudo se lee comparando los totales de esos pasos.
- **Rendimiento (nueva batería `qa/rendimiento.mjs`, 3G lenta y CPU ×4, con presupuesto):**
  - La página «saltaba» al llegar las tipografías (CLS 0,21 en portada y páginas estáticas). Con tipografías de reserva de medidas ajustadas: 0,00.
  - Newsreader recortada a los pesos y tamaños que usa la web (128 → 81 kB, sin cambio visible en las capturas). Portada en la web real antes: 391 kB, usable en 9,3 s.
- **`plan/LEGAL.md`:** 16 preguntas para un asesor (LSSI, aportaciones y fiscalidad, RGPD, LOREG, contenido). No decide nada.
- **Programas del 29N:** ninguno publicado a 26 oct.
- **Revisión (regla 9):** capturas a 390 px (claro y oscuro) y 1280 px de portada, resultados, pregunta nueva y una página de pregunta; revisor independiente: solo la frase larga de privacidad, corregida.
- **ESTADO.md aligerado:** ficha reescrita; entradas del 24 oct y anteriores, sin cambios, en `plan/ESTADO-HISTORICO.md`.

## 25 oct 2026 · Aportación externa para T12 (no publicada)
- En otra conversación con el titular se buscaron 58 fuentes de Junts, PNV y EH Bildu (programas de 2023 y votaciones del Congreso). Están en `plan/APORTACION-T12.md`, **sin aplicar a `src/` ni publicar**: la web y `dist/` no cambian.
- **T12:** empieza por revisar y aplicar ese archivo (reglas 8 y 12) y no repitas esas posturas. Hay 11 que cambian de valor (marcadas con ⚠).
- Fallo menor detectado: 40 notas repiten la justificación y se muestran dos veces (detalle en el mismo archivo).

## 25 oct 2026 · Cambio pedido · Repetir y donar al terminar
- El resumen de resultados muestra, junto a «Compartir» y «Reta a un amigo», «Repetir el test» y «Donar» (lleva a las opciones de aportación). Test nuevo en qa/summary.mjs. 20 baterías en verde, publicado y comprobado en la web real; IndexNow 200.

## 25 oct 2026 · T8 · Justificaciones visibles y confianza
- **Justificaciones visibles:** bloque plegable «Por qué piensa así cada partido» en el repaso de tus respuestas, el explorador y las páginas de tema y de pregunta, con la justificación (`why`), la nota (`notes`), la fuente y un enlace «¿Ves un error?». En las fichas de partido de la app y en las páginas de partido, la justificación aparece bajo cada postura. También va en los datos abiertos (columna `justificacion`).
- **«¿Ves un error?»:** enlace `mailto:` a menendezpeoe@gmail.com con asunto prellenado (pregunta y partido).
- **/correcciones/:** registro público de cambios de posturas, generado desde el historial de git de `data/preguntas.json` por `qa/correcciones.mjs` → `src/correcciones.json` (84 cambios). Agrupa por día, así que no aparecen los pasos intermedios de una revisión. **Hay que volver a ejecutarlo tras cambiar posturas** (antes de `publish.mjs`).
- **/sobre/:** quién lo hace (solo «Dery»), por qué existe, cómo se financia (aportaciones voluntarias, sin cifras), independencia, privacidad y política de correcciones.
- **/metodologia/:** cifras reproducibles de `qa/metodologia.mjs` → `src/metodologia.json`, calculadas con la propia app: imitación (25 de 25 candidaturas salen primeras), 300 perfiles aleatorios (semilla 29) y perfil neutral, con la explicación del sesgo hacia el centro, posturas con fuente por partido y límites. **Hay que volver a ejecutarlo tras cambiar posturas.**
- **Revisión independiente:** aviso de que los porcentajes de perfiles aleatorios no son una encuesta; explicación del sesgo hacia el centro sin etiquetas ideológicas; /sobre/ en tercera persona; el correo de contacto se muestra como enlace («escribe un correo»), no como texto.
- **Pendiente de decisión del titular:** el correo menendezpeoe@gmail.com va en los enlaces `mailto:` (como pide el plan) y deja ver un apellido. Si prefiere un alias sin nombre real, basta con cambiar `ERR_MAIL` en `assets/papeleta.js` y las direcciones de `pages.mjs`.
- **Pruebas:** nueva batería `qa/confianza.mjs` (20 en total). Las 20 pasan en local y en https://test29n.es. IndexNow: 200 OK, 230 URL.

