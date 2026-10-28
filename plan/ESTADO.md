# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 28 oct 2026, T12c)

**Estado de los bloques**
- Completadas y verificadas en la web real: T1, T9, T2, T3, T4 (19–24 oct), T10, T5, T6, T7 (24 oct), T8 (25 oct), T11 (26 oct), T12 y T12b (27 oct), T12c (28 oct, adelantada a petición del titular).
- Pendientes, con tarea programada: R0 (29), R1 (31), R2 (1 nov), S1 (10 nov), S2 (21 nov), P1 (30 nov).
- Donación por Bizum: bloqueada por dependencia externa (aprobación de Stripe).

**Orden de trabajo para la próxima tanda**
1. **R0 (29 oct):** repaso de lo pendiente. Fuentes que siguen sin enlace (prioridad 1–2): Junts 21, EH Bildu 18, PNV 19, BNG 17, CC 26, UPN 30, Compromís 40, SALF 34; ya se buscaron en T12–T12c, así que solo merece la pena si aparecen programas de 2026 o votaciones nuevas. Método de fuentes y votaciones nominales del Congreso: entradas de T12 (en `plan/ESTADO-HISTORICO.md`) y T12c.
2. **Candidaturas (audit del 28 oct, `plan/AUDITORIA-CANDIDATURAS.md`):** al salir las listas definitivas en el BOE del 3 nov, volver a pasar `qa/herramientas/boe-candidaturas.py` y `boe-comparar.mjs`, y corregir en la web las candidaturas que no se presentan (UPL, Por Ávila, Jaén Merece Más, FA en Teruel/Ceuta/Melilla, Existe fuera de Teruel, Podemos en Baleares y Melilla, PACMA en 15 circunscripciones, SALF en 6) y decidir con el titular qué hacer con las candidaturas que la web no recoge (S1 del 10 nov es tarde: hacerlo el 3 o 4 nov).
3. **Programas del 29N:** a 28 oct ningún partido ha publicado el suyo (comprobado en prensa y agregadores; suelen salir unas dos semanas antes). Cada tanda lo vuelve a comprobar (regla 5).
4. **Pendiente de tandas anteriores:** 22 posturas documentadas de Podemos sin enlace (podemos.info bloquea a los robots; lista en la entrada de T7 del histórico) → T12b, R0 o R1. 
5. **Pendiente de decisión del titular:** correo público de contacto (hoy el de la cuenta, en los enlaces `mailto:`); preguntas para un asesor en `plan/LEGAL.md`.

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

## 28 oct 2026 · Auditoría de candidaturas por circunscripción (petición del titular)
- Comparadas las 27 candidaturas de la web con las listas provisionales del BOE del 28 oct (BOE-A-2026-22607). Resultado y propuestas en `plan/AUDITORIA-CANDIDATURAS.md`: 9 grupos de diferencias en la web (UPL, Por Ávila, JMM, Frente Amplio, CHA, Existe, Podemos, PACMA y SALF) y unas 40 candidaturas del BOE que la web no recoge (Alhora, NEX, JUEX, PREPAL, Valencia Unida, Frente Obrero, PCTE…).
- **No se ha cambiado la web:** las listas son provisionales hasta la proclamación del 2 nov.

## 28 oct 2026 · T12c · Fuentes de SALF y votaciones nominales del Congreso (adelantada a petición del titular)
- **SALF** (0 → 13 posturas con fuente): no tiene programa nacional ni europeo; se usa su programa de Castilla y León de 2026 (copia de The Objective). Las que hablan en clave nacional (desalojo en 24 h, deportaciones, cierre nuclear, Mercosur) quedan documentadas; las de enfoque autonómico, con fuente pero **siguen estimadas** (pesan menos). Descartadas: sanidad (el documento repite texto de Aragón), pensiones (frase genérica), rearme y referéndum UE (cita no localizada), financiación catalana y patrimonio (no responden a la pregunta).
- **Votaciones nominales del Congreso** (datos abiertos oficiales, `congreso.es/webpublica/opendata/votaciones/…`), una votación para varios partidos: aborto en el art. 43 (30/04/2026), prioridad nacional de Vox (25/06/2026), prisión permanente del PP (17/03/2026), cierre nuclear del PP (12/02/2025), ocupación de Junts (18/03/2025), reforma de la ley mordaza (29/10/2024), gasto militar (11/06/2026) y castellano en Cataluña (09/06/2022, solo PNV). Descartadas las de 2021–2022 de Junts, UPN y Compromís (estaban en grupos compartidos y el desglose no es fiable).
- **Cambios de valor:** Coalición Canaria E02 3→2 (votó ampliar la prisión permanente), G01 3→2 (contra revisar el cierre nuclear, como el PNV), H01 2→3 (contra revertir el aumento del gasto militar).
- **Revisión independiente:** 8 ajustes de redacción y 2 fuentes retiradas (SALF C01 y A03).
- **Programas del 29N:** ninguno publicado a 28 oct (Demócrata los anuncia como «próximamente»).
- **Calendario:** la tarea programada de T12c (28 oct, 2:13) se desactivó para no repetirla.

## 28 oct 2026 · Cambio pedido · Rediseño visual aprobado por el titular
- Preparado en la rama `propuesta-ui`, revisado por el titular con capturas y vídeos, y publicado con su visto bueno. Sin cambios de contenido ni de datos.
- **Resultado:** secciones agrupadas en un botón fijo arriba a la derecha (sección actual con icono y anillo de progreso) que abre un menú en 3 grupos con «Estás aquí»; se cierra con el botón, la ✕, Escape o pulsando fuera (`bindResNav`, `navLinks`).
- **Pulsar otra vez para ocultar:** «Ver/Ocultar el análisis completo» (`setFull`), «Ver/Ocultar su ficha» (`syncCardBtns`) y notas emergentes en táctil (`bindTips`).
- **Portada:** banner más grande con textura de papeleta, titular a 900, cuadrícula también en el móvil, cifras como marcador, marca amarilla sobre cada título, pasos numerados, ✓ en «Qué lo hace distinto», tests por tema en 2 columnas, letras de las áreas en casillas. Bloque CSS al final de `assets/papeleta.css`.
- **Móvil:** «Empezar el test» despliega las 4 versiones en el banner (`bindHeroModes`, `#bn-modes`) y el bloque «Elige la versión» se oculta; nota de versión en píldora con reloj; «Gratis · Sin registro · Contexto neutral» en una franja con iconos bajo el banner (`.trust`).
- **Pruebas:** nuevas en `qa/summary.mjs` y `qa/onboarding.mjs`; `qa/e2e.mjs` y `qa/share.mjs` usan `startHome()`; presupuesto local de `qa/rendimiento.mjs` 960 kB (los datos crecen con las fuentes).

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

