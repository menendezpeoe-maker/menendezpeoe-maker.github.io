# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 27 oct 2026, T12)

**Estado de los bloques**
- Completadas y verificadas en la web real: T1, T9, T2, T3, T4 (19–24 oct), T10, T5, T6, T7 (24 oct), T8 (25 oct), T11 (26 oct), T12 (27 oct).
- Pendientes, con tarea programada: T12b (28 oct), R0 (29), R1 (31), R2 (1 nov), S1 (10 nov), S2 (21 nov), P1 (30 nov).
- Donación por Bizum: bloqueada por dependencia externa (aprobación de Stripe).

**Orden de trabajo para la próxima tanda**
1. **T12b:** sigue el orden de T12 con las posturas de prioridad 1 y 2 aún sin fuente: Junts 23, EH Bildu 23, PNV 24, BNG 22; después Coalición Canaria y UPN (ninguna fuente aún) y SALF. Programas de 2023 ya en texto: método en la entrada de T12. Método general: el de T7 y T5 (`plan/ESTADO-HISTORICO.md`).
2. **Programas del 29N:** a 27 oct ningún partido ha publicado el suyo (comprobado en prensa y agregadores; suelen salir unas dos semanas antes). Cada tanda lo vuelve a comprobar (regla 5).
3. **Pendiente de tandas anteriores:** 22 posturas documentadas de Podemos sin enlace (podemos.info bloquea a los robots; lista en la entrada de T7 del histórico) → T12b, R0 o R1. 
4. **Pendiente de decisión del titular:** correo público de contacto (hoy el de la cuenta, en los enlaces `mailto:`); preguntas para un asesor en `plan/LEGAL.md`.

**Archivos clave y decisiones técnicas**
- Mapa del código y grupos de pruebas: `CLAUDE.md`. Pruebas con `node qa/run.mjs <grupo|todas>` (21 baterías, incluida `rendimiento` desde T11).
- Contador (GoatCounter, `count()` en `assets/papeleta.js`): pasos inicio, test-empezado, test-terminado, compartir, reto, donar-*, util-si/util-no. Nunca respuestas, provincia ni resultado (`qa/stats.mjs`).
- Tipografías recortadas con `qa/fonts.py` (necesita fonttools y brotli) y tipografías de reserva con medidas ajustadas al principio de `assets/papeleta.css`.
- Tras cambiar posturas: `node qa/run.mjs posturas` (regenera /correcciones/ y /metodologia/).

**Pruebas (27 oct)**
- Local y web real (https://test29n.es): 21/21 baterías OK. IndexNow 200.

**Errores pendientes (menores)**
- En la barra del test a 390 px, «Área 1 de 12 · Economía y…» se corta con puntos suspensivos.
- La portada tarda unos 8 s en ser usable con 3G lenta: lo que más pesa tras las tipografías son `papeleta.js` (66 kB comprimido) y `data/preguntas.json` (69 kB), que se cargan enteros antes de activar «Empezar». Mejora posible (no urgente): activar el botón antes de tener todas las justificaciones.

Entradas anteriores al 25 oct: `plan/ESTADO-HISTORICO.md`.

## 27 oct 2026 · T12 · Fuentes de Junts, EH Bildu, PNV y BNG
- **Aportación externa aplicada** (`plan/APORTACION-T12.md`): 58 fuentes revisadas; abiertas y comprobadas las 11 que cambiaban de valor. Aplicadas 10; PNV E09 (cannabis) se queda en 3, porque su programa solo pide el uso medicinal.
- **Nuevas (dos subagentes y revisión una a una):** aceptadas 55 de 79 propuestas (quedan 48 tras la revisión); se descartan las autonómicas, las deducidas y las que no responden a la pregunta. Tras el revisor independiente se quitaron 7 más que no respaldaban la pregunta (Bildu B03, J02 y H09; BNG J02 y H09; Junts H06; PNV F02) y se unificaron textos y fuentes repetidas (amnistía, lobo, eutanasia, ley mordaza).
- **Cambios de valor (todos con fuente y nota en la justificación):** PNV A01 3→4, F05 3→4, G01 3→2 (votación del Congreso), H05 4→5; Junts A05 3→4, A08 4→2, E02 3→5, H04 3→4, L09 4→5, L02 2→1; EH Bildu K04 1→3; BNG D01 2→5, K04 2→1.
- **Posturas con fuente por partido (de las que tienen postura):** Junts 27 de 104 (antes 10), EH Bildu 34 de 102 (antes 0), PNV 29 de 99 (antes 0), BNG 26 de 105 (antes 0). Sin fuente con prioridad 1–2: Junts 23, EH Bildu 23, PNV 24, BNG 22.
- **Método reutilizable:** programas de 2023 de Junts (copia de Betevé), PNV, EH Bildu y BNG (`https://www.bng.gal/media/bnggaliza/files/2023/07/05/23_bng_xerais_programa.pdf`) se pasan a texto con `pdftotext -layout` y se trocean por página (`#page=N` = número de página del PDF). deia.eus, ondavasca.com y similares responden a `curl` con User-Agent de navegador.
- **Posturas discutibles: decididas el 27 oct** (el titular delegó la decisión; criterio: lo más coherente y la fuente más fiable, como en T5):
  - EH Bildu I01 (concertada) 1 → 2: criticó la «concertación universal» de la ley vasca de educación de 2023 (Orain/EITB); en 2021 había propuesto financiar al 100 % la concertada integrándola. Evidencia autonómica: se modera un punto.
  - EH Bildu B03 (desalojo en 48 h) sigue en 1, ahora con fuente: votó en 2024 una reforma para agilizar desahucios por ocupación, pero dijo después que fue «un error», y criticó la ley de Junts de 48 horas (El Español).
  - BNG B01 (limitar alquileres) sigue en 5, ahora con fuente: votó a favor del decreto de congelación de alquileres (28/04/2026, Público). Con la misma votación: Compromís B01 5 con fuente y Coalición Canaria B01 2 estimada → 4.
  - PNV L01 (aborto en la Constitución) 4 estimada → 3: votó por seguir tramitando la reforma, pero la llamó oportunista y cuestionó su utilidad (Vozpópuli, 30/04/2026).
  - PNV D07 (referéndum monarquía o república) 4 → 3 estimada: no consta ninguna postura suya; estimación sin base, al punto medio.
- **Notas que repetían la justificación:** ya no se muestran dos veces (40 casos; `posWhy` en la app y `whyOf` en las páginas). Prueba nueva en `qa/confianza.mjs`.
- **Programas del 29N:** ninguno publicado a 27 oct.
- **Pruebas:** 21/21 baterías en local y en la web real; IndexNow 200 OK. Capturas de una página de partido y una de pregunta a 390 px, en claro y oscuro.
- **Ojo al publicar posturas:** `qa/correcciones.mjs` lee el historial de git, así que hay que ejecutarlo después de hacer commit de `data/preguntas.json` (y volver a hacer commit de `src/correcciones.json`).

## 26 oct 2026 · T11 · Embudo, rendimiento, preguntas legales y repaso
- **Embudo en GoatCounter:** entra (inicio) → empieza → termina → comparte (`compartir`, una vez por visita, con cualquier botón de compartir) → reta a un amigo (`reto`). Nueva pregunta opcional al final del resumen, «¿Te ha resultado útil el test?» (Sí / No): cuenta `util-si` o `util-no`, da las gracias y no vuelve a preguntar (se recuerda en el navegador). No aparece en resultados compartidos. Aviso de privacidad actualizado (frase partida en dos tras la revisión). Pruebas nuevas en `qa/stats.mjs`. En GoatCounter, el embudo se lee comparando los totales de esos pasos.
- **Rendimiento (nueva batería `qa/rendimiento.mjs`, 3G lenta y CPU ×4, con presupuesto):**
  - La página «saltaba» al llegar las tipografías (CLS 0,21 en portada y páginas estáticas). Con tipografías de reserva de medidas ajustadas: 0,00.
  - Newsreader recortada a los pesos y tamaños que usa la web (128 → 81 kB, sin cambio visible en las capturas). Portada en la web real: 391 → 340 kB, usable en 9,3 → 8,3 s, primer texto en 3,0 → 2,1 s; página de pregunta 241 → 190 kB.
- **`plan/LEGAL.md`:** 16 preguntas para un asesor (LSSI, aportaciones y fiscalidad, RGPD, LOREG, contenido). No decide nada.
- **Programas del 29N:** ninguno publicado a 26 oct.
- **Revisión (regla 9):** capturas a 390 px (claro y oscuro) y 1280 px de portada, resultados, pregunta nueva y una página de pregunta; revisor independiente: solo la frase larga de privacidad, corregida.
- **Pruebas:** 21/21 baterías en local y en la web real; IndexNow 200 OK.
- **ESTADO.md aligerado:** ficha reescrita; entradas del 24 oct y anteriores, sin cambios, en `plan/ESTADO-HISTORICO.md`.

