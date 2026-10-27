# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 27 oct 2026, T12b)

**Estado de los bloques**
- Completadas y verificadas en la web real: T1, T9, T2, T3, T4 (19–24 oct), T10, T5, T6, T7 (24 oct), T8 (25 oct), T11 (26 oct), T12 y T12b (27 oct).
- Pendientes, con tarea programada: T12c (28 oct, continuación de fuentes), R0 (29), R1 (31), R2 (1 nov), S1 (10 nov), S2 (21 nov), P1 (30 nov).
- Donación por Bizum: bloqueada por dependencia externa (aprobación de Stripe).

**Orden de trabajo para la próxima tanda**
1. **T12c:** posturas de prioridad 1 y 2 aún sin fuente: Junts 22, EH Bildu 21, PNV 21, BNG 19, Coalición Canaria 33, UPN 31; después SALF y el resto. Muchas ya se buscaron sin éxito (T12 y T12b): mejor buscar votaciones del Congreso que cubran varios partidos a la vez. Método: entrada de T12.
2. **Programas del 29N:** a 27 oct ningún partido ha publicado el suyo (comprobado en prensa y agregadores; suelen salir unas dos semanas antes). Cada tanda lo vuelve a comprobar (regla 5).
3. **Pendiente de tandas anteriores:** 22 posturas documentadas de Podemos sin enlace (podemos.info bloquea a los robots; lista en la entrada de T7 del histórico) → T12b, R0 o R1. 
4. **Pendiente de decisión del titular:** correo público de contacto (hoy el de la cuenta, en los enlaces `mailto:`); preguntas para un asesor en `plan/LEGAL.md`.

**Archivos clave y decisiones técnicas**
- Mapa del código y grupos de pruebas: `CLAUDE.md`. Pruebas con `node qa/run.mjs <grupo|todas>` (21 baterías, incluida `rendimiento` desde T11).
- Contador (GoatCounter, `count()` en `assets/papeleta.js`): pasos inicio, test-empezado, test-terminado, compartir, reto, donar-*, util-si/util-no. Nunca respuestas, provincia ni resultado (`qa/stats.mjs`).
- Tipografías recortadas con `qa/fonts.py` (necesita fonttools y brotli) y tipografías de reserva con medidas ajustadas al principio de `assets/papeleta.css`.
- Tras cambiar posturas: `node qa/run.mjs posturas` (regenera /correcciones/ y /metodologia/).
- Sitemap con fecha real por página: `src/lastmod.json`, que actualiza `publish.mjs` (hacer commit tras publicar).

**Pruebas (27 oct)**
- Local y web real (https://test29n.es): 21/21 baterías OK. IndexNow 200.

**Errores pendientes (menores)**
- En la barra del test a 390 px, «Área 1 de 12 · Economía y…» se corta con puntos suspensivos.
- La portada tarda unos 8 s en ser usable con 3G lenta: lo que más pesa tras las tipografías son `papeleta.js` (66 kB comprimido) y `data/preguntas.json` (69 kB), que se cargan enteros antes de activar «Empezar». Mejora posible (no urgente): activar el botón antes de tener todas las justificaciones.

Entradas anteriores al 25 oct: `plan/ESTADO-HISTORICO.md`.

## 28 oct 2026 · Cambio pedido · Correcciones fuera de la web
- El registro público de correcciones deja de mostrarse (instrucción permanente en PLAN.md, regla 5). `/correcciones/` es un aviso sin indexar que redirige a `/sobre/`; quitado del pie, de /sobre/, de /metodologia/ y del sitemap (229 URL). Pruebas actualizadas en `qa/confianza.mjs` y `qa/growth.mjs`.

## 27 oct 2026 · Revisión de indexación (petición del titular)
- **Motivo:** Google Search Console mostraba 172 páginas sin indexar; el titular pidió la validación. Revisión completa desde fuera (`curl` y rastreo de las 230 URL del sitemap): todas responden 200 sin redirecciones, `canonical` correcta, sin `noindex` salvo `/insertar/` (a propósito), 404 real para lo que no existe, sin títulos ni descripciones repetidos y sin URL antiguas desaparecidas.
- **Corregido:**
  - 11 páginas huérfanas (`/comparar/` y sus 10 comparativas solo estaban en el sitemap): ahora se enlazan desde el pie de todas las páginas y de la portada.
  - `lastmod` del sitemap: antes era la misma fecha (24 oct) para todas las páginas aunque cambiaran; ahora es la fecha real de cada página, calculada con una huella de su contenido en `publish.mjs` y guardada en `src/lastmod.json` (**hay que hacer commit de ese archivo tras publicar**).
  - Fechas desfasadas escritas a mano en el pie de la portada (17 y 18 oct): ahora salen de los datos. `UPDATED` = 27 oct.
- **Pruebas nuevas** en `qa/seo.mjs`: ninguna página a más de 3 clics de la portada, fecha real por página y fecha del pie.
- **Normal, no es un error:** Search Console cuenta como «no indexadas» también las variantes que redirigen (`www`, `http`, sin barra final, el dominio github.io) y los enlaces con parámetros (`/?tema=…`, `/escanos/?p=…`), que llevan `canonical` a la página buena. Una web nueva tarda semanas en indexarse entera.

## 27 oct 2026 · T12b · Fuentes de Coalición Canaria y UPN (adelantada a petición del titular)
- **Nuevas:** 33 aceptadas de 34 propuestas; tras el revisor se retiraron 2 (CC B05, BNG D03). Coalición Canaria 0 → 9 posturas con fuente; UPN 0 → 17; restos: Junts +1, PNV +2, BNG +2.
  - CC no publicó programa de generales en 2023: se usan el acuerdo PSOE-CC de noviembre de 2023 y votaciones del Congreso. UPN tampoco (su PDF de 2023 es foral y municipal): solo votaciones del Congreso.
- **Cambios de valor (con fuente):** CC A01 3→4, D04 2→1, H04 3→4, K01 3→1 (contra el acuerdo con Mercosur), K04 4→3; UPN A01 2→1, F01 2→1, G04 2→3, H04 2→3, L09 3→4. Criterio igual para todos en una misma votación (jornada, lobo, embargo).
- **Revisión independiente:** textos unificados para las votaciones compartidas (jornada, decretos de vivienda, trasvase Tajo-Segura, defensa, lobo), fechas de la amnistía precisadas (marzo y mayo de 2024) y Junts L02 con la fuente de 2021, que nombra su voto.
- **Dato útil:** el 02/10/2026 el Congreso tumbó dos decretos de vivienda (Demócrata y Público): el primero con 172 apoyos (PSOE, Sumar, ERC, Bildu, PNV, Podemos, BNG, CC y Compromís) y 178 en contra (PP, Vox, Junts y UPN). La congelación de alquileres del 28/04/2026 es otra votación distinta.
- **Programas del 29N:** ninguno publicado a 27 oct.
- **Calendario:** la tarea programada del 28 oct pasa a ser T12c (continuación de fuentes).

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

