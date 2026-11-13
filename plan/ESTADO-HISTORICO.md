# Estado del plan · histórico (entradas movidas desde ESTADO.md, sin cambios; lo más reciente arriba)

## 13 nov 2026 (00:30) · Programas de EAJ-PNV y Adelante Andalucía publicados (estado); revisión diaria de programas; COLA PARA S1c
- **Estado «publicado» (sin cambiar posturas):** EAJ-PNV (PDF oficial de 43 págs., https://www.eaj-pnv.eus/es/adjuntos-documentos/21765/pdf/programa-electoral-29n ; página https://www.eaj-pnv.eus/es/programa-elecciones-generales-2026/ y presentación en su web, ambas 200) y Adelante Andalucía (PDF de 134 págs., creado el 10 nov, https://programa.adelanteandalucia.org/programa-29n-adelante-andalucia.pdf ; incluye un apartado por provincia andaluza). Circunscripciones cruzadas con el BOE del 3 nov (`src/candidaturas.json`): PNV en Álava, Bizkaia y Gipuzkoa; Adelante en las 8 andaluzas. Portada y /programas/: **7 de 29** (PP, ERC, BNG, CC-PC, Vox, PNV, Adelante), cada uno con «0 posturas revisadas con él» hasta revisarlas.
- **COLA PARA S1c (y después para la revisión diaria): revisar con su programa 29N las posturas de Vox, EAJ-PNV y Adelante Andalucía**, en ese orden, con fuente de tipo `programa`, `#page=N`, pasaje y alcance (regla 8; lo dudoso no se aplica y se anota). Descarga con `curl -sSL -A "Mozilla/5.0"`. No volver a tocar el estado de Vox (ya está).
- **M+J (Por un Mundo Más Justo): el titular decide incluirlo como candidatura 30 (13 nov, 00:52). Lo hace el hilo del acuerdo Codex–Claude el 13 nov DESPUÉS de S1c; S1c no lo toca.** Antes: Programa oficial del 29N: https://www.porunmundomasjusto.es/wp-content/uploads/2026/11/Castellano.pdf (95 págs., 7 nov). Proclamado en 26 circunscripciones según el BOE del 3 nov, pero no está en el test (sin `pid`), así que no cuenta en el denominador de 29. Incluirlo exige ficha y posturas con fuente (pasaría a 30 candidaturas). Correcciones de la JEC posteriores al 3 nov: sin comprobar.
- **Revisión diaria de programas (tarea programada nueva, 14–23 nov, 9:47 Madrid, en la nube, sesión nueva cada día):** busca programas nuevos en webs oficiales de las candidaturas que faltan, los marca, revisa posturas pendientes de esta cola y publica con la regla 5; sin avisos de éxito. Del 24 al 28 no hace nada. Si encuentra un commit de hace menos de 30 min, espera.
- **Búsqueda de programas (13 nov, 00:50; encargo del titular «todos los publicados, por fases»):** revisadas webs oficiales y agregadores. **Ningún otro programa del 29N verificable** en dominio oficial: PSOE, Junts, EH Bildu, UPN, Geroa Bai, CHA, Falange, D21 y PCTE (portadas sin enlace a programa 2026; PCTE solo enlaza el de 2019); PACMA solo tiene programas autonómicos 2025–26 y generales hasta 2019; Frente Obrero tiene un programa general (64 págs., modificado el 12 nov) que no dice ser del 29N: no se marca hasta que lo diga o lo presente como tal. Inaccesibles desde aquí: Podemos y Compromís (403), Frente Amplio (436), SALF, Soria ¡Ya! y Drago (sin conexión). Un agregador cita un programa de SALF («La ilusión de un país», 119 medidas) sin enlace oficial: comprobar en su web.
- **Enlaces aportados por el titular (13 nov, 01:00):** **SALF** «Contrato electoral simplificado · Generales 2026 · 29 de noviembre de 2026» (40 págs.), https://www.seacabolafiesta.com/SALF_Contrato_Electoral_29N.pdf (da 403 a `curl`; leído de la copia del titular, también en la carpeta del proyecto `test29n/programas/`) y **Partido Humanista** «Elecciones generales 2026» (31 págs., 9 nov), ambos marcados como publicados → **9 de 29**. **Frente Obrero** (https://frenteobrero.es/documentos/programa-frente-obrero.pdf, modificado el 6 oct) e **Iustitia Europa** («Contrato electoral», https://iustitiaeuropa.es/img/bloques/documentos/descarga-aqui-tu-contrato-00030.pdf , subido el 11 nov) no dicen ser del 29N: no se marcan como programa del 29N, pero se pueden usar como fuente de tipo `programa` (documento vigente) al revisar sus posturas. **PSOE: publica su programa el 15 nov** (aviso del titular): la revisión diaria de ese día debe buscarlo primero.
- **Cola de revisión de posturas con programa 29N (orden del titular, 13 nov 01:30: por importancia, neutral y documentado):** criterio = (1) escaños en el Congreso de 2023 (resultado oficial); (2) a igualdad, votos en las últimas elecciones de ámbito estatal (europeas de 2024); (3) a igualdad, número de circunscripciones donde se presenta (BOE del 3 nov). **No se usan encuestas** (regla de neutralidad: la web no trata sondeos). Solo entre los que ya tienen programa del 29N publicado. Orden: Vox (33 escaños) → EAJ-PNV (5) → Adelante Andalucía (0; se mantiene en S1c porque ya estaba comprometido) → SALF (0; europeas 2024) → M+J (0; 26 circunscripciones; además se incorpora como candidatura 30) → Partido Humanista (0; 1 circunscripción). **El PSOE (121) pasa a la cabeza en cuanto publique (anunciado para el 15 nov).** Cada programa nuevo entra en su puesto según este criterio.
- **Regla de la cola (titular, 13 nov 01:35):** la importancia solo ordena entre partidos que YA tienen programa del 29N publicado y verificado. Un partido grande sin programa no bloquea: se trabaja el siguiente que sí lo tenga. Cuando uno importante publica (p. ej. el PSOE el 15), su estado «publicado» se marca en cuanto se detecta y su revisión de posturas pasa a la cabeza de la siguiente tanda o revisión diaria, sin interrumpir a mitad la revisión de otro partido que esté en curso (se termina esa y se sigue con él).
- **Orden de BÚSQUEDA y PUBLICACIÓN de los 20 programas que faltan (titular, 13 nov 01:30; mismo criterio que la revisión de posturas, sin encuestas):** (1) escaños de 2023 con candidatura propia o como fuerza principal de su coalición; (2) votos con lista propia en las europeas de 2024; (3) circunscripciones donde se presenta (BOE 3 nov). Las fuerzas que fueron dentro de Sumar en 2023 sin encabezarla cuentan 0 escaños propios. Orden resultante: **PSOE** (121; anunciado para el 15 nov) → **Frente Amplio** (31, continuidad de Sumar; 41 circ.) → **Junts** (7) → **EH Bildu** (6) → **UPN** (1) → con 0 escaños, por europeas 2024 con lista propia: **Podemos** → **PACMA** → sin lista propia en 2024, por circunscripciones: **Frente Obrero** (52) → **PCTE** (36) → **Falange** (9) → **Compromís** (3) → **CHA**, **Drago**, **UPC**, **Democracia 21** (2) → **Ara MÉS**, **Geroa Bai**, **Soria ¡Ya!**, **Existe**, **Iustitia Europa** (1). Si un dato de desempate resulta erróneo, se corrige aquí con su fuente y se reordena; no cambia la vara de verificación (programa del 29N en dominio oficial). Frente Obrero e Iustitia Europa tienen documentos vigentes sin fecha del 29N: se vuelven a comprobar en su turno.
- **Descubierto:** del 24 al 29 nov no se revisan programas (congelación); P1 (30 nov) ya no los necesita.

## 12 nov 2026 (noche) · GUARDADO EN `fuente` (sin publicar): Programas electorales más visibles
- Enlace «Programas» en la cabecera de la app y de las páginas informativas (móvil: 4 pestañas iguales); bloque destacado «Programas electorales del 29N» en la portada, justo debajo del test, con el recuento «N de 29» generado al publicar (`<!--PROG_STATS-->` en `publish.mjs`, desde `PROGRAMAS`). CSS en `mejora.css` sección 18. Mismas URLs.
- Cabecera de páginas informativas en una sola fila a 320, 360 y 390 px (a ≤340 px «Temas» sale de la cabecera; sigue en el pie). Pruebas `paginas`, `test` y `difusion` 22/22. **PUBLICADO** con el «publica» del titular. Pendiente opcional: enlace a los programas en la pantalla de resultados (toca `papeleta.js`; no se hizo).

## 12 nov 2026 (noche) · GUARDADO EN `fuente` (sin publicar): programa 2026 de Coalición Canaria – Primero Canarias («Defiende Canarias»)
- Programa oficial: https://primerocanarias.com/wp-content/uploads/2026/11/CCA-26-Programa_Electoral-29NOV-comprimido.pdf (200, PDF, 9 nov). El titular pasó una copia de 23 páginas; las páginas citadas son las de esa copia.
- **Aplicado (14 posturas de `ccpc`, con cita y página):** B02 2→3; B07 3~→4 doc.; B08 3~→4 doc.; C02 2~→4 doc.; F07 0→4 doc.; F08 3~→4 doc.; G09 3~→4 doc.; B06, C05, F04 de estimada a documentada con el mismo valor; B05, C03, F03, F05 con fuente 2026 y el mismo valor. `/programas/` lo marca como publicado (9 nov).
- Pruebas: `posturas`, `paginas` y `test` 21/21. Sin tocar URLs ni cálculo.
- **No se ha tocado (el programa no dice nada claro):** A01 y B01 (siguen con la fuente parlamentaria), C04, H05, G06, F06 y el resto. El programa es casi todo de agenda canaria.
- **Falta publicar** (esperar el «publica» del titular).

## 12 nov 2026 (noche) · PUBLICADO: 10 posturas más de PP y ERC por sus programas 2026
- Aplicadas las interpretativas con encaje literal: PP A06 4→5, F01 2→1, F05 2→1, H09 3→4, I05 4→5, K08 3→2, L07 4→3; ERC A02 4→5, G09 4→5, J01 3→4 (cada una con cita y página del programa).
- **Decididos por el titular («decide tú»): no aplicar** PP F02, F06, H07, K04 ni ERC G08: el programa 2026 no respalda esa lectura de forma literal. Se quedan como están, con su fuente anterior.
- Pruebas: `posturas` + `paginas` 11/11 y `test` en verde.

## 12 nov 2026 (noche) · GUARDADO EN `fuente` (sin publicar en `main`): programas 2026 de PP, ERC y BNG incorporados
- El titular pasó los tres PDF oficiales (PP «Reconstrucción Nacional», ERC e2026-programa, BNG Xerais 2026) y dio el OK «haz lo más profesional». Propuesta y páginas en `plan/propuesta-programas-12nov.md`.
- **Aplicado (117 posturas con fuente 2026 y página `#page=N`):** PP 46, ERC 42, BNG 29. Cada una con justificación nueva (`JUSTIF`) basada en el programa.
- **Valor/estimación que cambian (19):** ERC A01 4→5, A03 4→5, F06 4→5, K01 2→1; ERC A06 (est. 2→3 doc.), F08 (est.→doc. 4), I03 (est. 2→1 doc.); PP C02, C07, K02 (est.→doc., mismo valor); BNG A05, B04, B06, D05, K02, L05, L08 (est.→doc., mismo valor), C06 (est. 4→5 doc.), E05 (est. 5→4 doc.).
- **`/programas/`:** PP, ERC y BNG pasan a «publicado» con enlace oficial (`PROGRAMAS.publicados`); `pages.mjs` compara la URL sin el `#page=` para contar «posturas revisadas con él» (46/42/29). `comprobado`: 12 nov.
- **Pendiente de decisión del titular (regla 8, evidencia discutible; NO aplicado):** PP A06 4→5, F01 2→1, F02 2→3, F05 2→1, F06 3→4, H07 4→3, H09 3→4, I05 4→5 (fuente ya añadida con el valor actual), K04 5→4, K08 3→2, L07 4→3; ERC A02 4→5, G08 0→3~, G09 4→5, J01 3→4. En K04, K08, L07, F01, F02, F05, F06, H07, H09 y A06 del PP no se cambió la fuente para no dejar un valor que el programa 2026 no respalda del todo.
- **Pruebas:** `posturas` 5/5, `paginas` 7/7, `test` 12/12. Sin tocar URLs, cálculo ni diseño. El enlace del BNG da 403 a `curl` (bloqueo a bots); el PDF se leyó desde la copia que pasó el titular.
- **Falta publicar** (esperar el «publica» del titular): generar `dist/`, hacer commit de `src/lastmod.json` y publicar en `main`.

## 12 nov 2026 · PUBLICADO (main 60019a9): fuera el CTA fijo de las páginas informativas y cabecera más fácil de pulsar (aviso del titular, iPhone)
- El titular vio, en iPhone/Safari, que «Partidos» y «Temas» de la cabecera de las páginas informativas no respondían y que el botón fijo «Hacer el test · 3 min» molestaba a quien busca información. Se quitó `.sticky-cta` (HTML en `pages.mjs`, CSS en `papeleta.css`, y el seguimiento en `stats.js`).
- Cabecera de esas páginas (`.sp-nav`): enlaces de 44 px de alto con separación del borde (gesto «atrás» de iOS), `touch-action: manipulation`, sin `:hover` en pantallas táctiles y `z-index` por encima de otras capas. En Chromium con tamaño de iPhone navegaba bien antes y después; **la causa exacta en Safari no se pudo reproducir**: pedir al titular que confirme en su iPhone (y la versión de iOS si sigue fallando).
- El recuadro «Responde tú y compara» dentro del contenido sigue (se le ha preguntado si quiere quitarlo).

## 12 nov 2026 · Auditoría final de calidad + PUBLICADO (main 59c94c0, IndexNow 200 OK, web real 3/3)
- **Auditoría:** 236 rutas del sitemap 200 en la web real; 14.653 enlaces internos sin ninguno roto ni ancla perdida; metadatos, canonical, OG y JSON-LD correctos en todas; sin títulos ni descripciones duplicados; 76 páginas × 3 motores (iPhone, Pixel, escritorio) sin errores de consola ni peticiones fallidas ni desbordes; 23/23 baterías. WebKit no está disponible en este entorno (iOS = 44 % de las visitas: revisar a mano en un iPhone). Peso por visita nueva: portada 447 KB comprimidos.
- **Hallazgo y cambio:** 17 pares de páginas de partidos pequeños con >50 % de texto igual (hasta 0,83) por listar las 107 preguntas con «Sin postura conocida». Ahora solo se detallan las posturas conocidas y cada área resume las que faltan (`sp-unk` en `pages.mjs`); pares >0,5: 17 → 3. `qa/growth.mjs` adaptado. Mismas URLs.
- **Capacidad:** GitHub Pages: límite blando de 100 GB/mes (~220.000 visitas completas); GoatCounter no publica un tope claro (los eventos de progreso suman ~4 por test).

## 12 nov 2026 · PUBLICADO (main 2e8b518, IndexNow 200 OK): títulos largos de páginas sin tráfico relevante
- `tt()` en `pages.mjs` recorta en dos pasos (quita « · Test 29N»; si sigue >72, quita «, tema a tema» o « el 29N»); también en los tests por tema. Títulos >70: de 28 a 10 (quedan provincias con tráfico, 4 preguntas y `/datos/`, `/temas/`, `/tests/`). Mismas URLs. Web real 4/4.

## 12 nov 2026 · Auditoría de compartir y entrada: PUBLICADO (main c344d1b, IndexNow 200 OK, web real 5/5)
- **Auditoría (iPhone 12 simulado):** la entrada se entiende (H1 + pregunta + «Empezar» + versión rápida) y las cuatro versiones se explican con su duración; OG/Twitter completos (1200×630, 78 KB); la tarjeta se genera en el móvil a 1080×1920 sin respuestas individuales. Limitación inherente: el enlace compartido lleva el resultado tras `#`, por lo que las vistas previas de WhatsApp/X solo pueden mostrar la imagen general.
- **Cambios:** botón nativo «Compartir imagen y enlace» (`#sh-native`, solo si el móvil permite compartir archivos); texto por defecto que cabe en X (≤ 280, la línea del perfil entra solo si cabe); en móvil las acciones de compartir van primero (CSS en `mejora.css`, sección 17) y WhatsApp antes que X; eventos de progreso sin respuestas (`progreso-25/50/75`, `paso-final`) para ver el abandono (OJO: sus títulos no pueden contener «%», «provincia», etc.: `qa/stats.mjs` lo vigila).
- **No se ha tocado:** cálculo, orden de preguntas, URLs.

## 11 nov 2026 (noche) · PUBLICADO (main 2ffee45, IndexNow 200 OK): «Reta a un amigo» como botón principal y títulos/descripciones más cortos
- En el resumen del resultado, «Reta a un amigo» (compartir nativo, un toque) pasa a primario y «Compartir» a secundario (mismos selectores para las pruebas).
- Descripciones de más de 160 caracteres: de 225 a 8; títulos de más de 70: de 83 a 28 (`tt()` en `pages.mjs` quita « · Test 29N» si se pasan). Mismas URLs.
- **Congelado de SEO hasta el 13–14 nov:** no tocar más títulos ni descripciones hasta tener datos nuevos de Search Console (recordatorio programado el 13 nov a las 10:00).

## 11 nov 2026 (noche) · Sprint SEO de posicionamiento: PUBLICADO (main 1d35029, IndexNow 200 OK, web real 4/4 baterías)
- **Mismas URLs** (regla crítica del titular). Cambios de title/descripción/H2/contenido:
  - Portada: sección visible «¿Qué es un test político y para qué sirve?» y 2 preguntas frecuentes nuevas (qué es un test político; cómo conocer mi orientación política): 11 en total, con `FAQPage` generado del HTML.
  - 33 páginas de partido: title «X: programa y propuestas para el 29N, tema a tema» (consultas «programa electoral X 29n»).
  - 10 comparaciones: title «A y B: diferencias y coincidencias para el 29N» (consultas «salf vs vox», «diferencias entre…»).
  - 52 provincias: descripción «Listas y candidatos del 29N en X: …» y H2 «Listas y candidaturas que se presentan en X» (consultas «listas pp/psoe/vox X», «candidatos»).
  - `/debates/`: «calendario, fechas y cadenas»; `/escanos/`: «Simulador de elecciones 29N» (consultas «calendario debates», «simulador 29n»).
- **Auditoría técnica:** 238 HTML, 236 en el sitemap (los 2 que faltan, `/correcciones/` y `/insertar/`, son `noindex` a propósito); canonical correcto en todas; ningún title ni descripción duplicados; un H1 por página. Pendiente menor: 225 descripciones y 83 títulos pasan de 160 y 70 caracteres (Google los recorta); prioridad baja salvo las páginas con tráfico.
- **No se persigue** (neutralidad: no hacemos sondeos): «encuestas/predicciones/estimaciones 29n».

## 11 nov 2026 · Misión de crecimiento inmediato (SEO técnico y CRO), por encargo del titular
- **Diagnóstico (sin datos de Search Console más allá de 1.860 clics / 19.100 impresiones / CTR 9,7 % / posición 6,6):**
  1. La portada no tenía enlaces rastreables a sus páginas más valiosas (`/partidos/`, `/preguntas/`, `/temas/`, `/tests/`, `/comparar/`, `/escanos/`, `/votar/`, `/metodologia/`): solo 7 (en «Más información»). Las 234 páginas interiores sí las enlazaban, la portada (la que más autoridad recibe) no. Los «Tests por tema» de la portada enlazaban a `?tema=` (solo JavaScript) y no a `/tests/<tema>/`.
  2. El texto visible de la portada no contenía las búsquedas objetivo: «test político» solo estaba en el título y la descripción; no aparecían «ideología política», «orientación política», «qué partido representa mis ideas».
  3. Sin `WebSite` en los datos estructurados (nombre del sitio).
- **PUBLICADO el 11 nov (main 3a63f0a, IndexNow 200 OK con 236 URL; web real comprobada):** todo lo de esta entrada, más medición (`?ref=` y evento `cta-*` desde páginas estáticas) y CTA fijo en móvil en las páginas estáticas (no en sobre, prensa, datos, metodología ni correcciones).
- **Cambios:** H1 «Test político del 29N»; subtítulo «¿Con qué partido coincides? … qué partido representa tus ideas»; párrafo «test de ideología política … orientación política en siete dimensiones»; 4 preguntas frecuentes nuevas (qué partido representa mis ideas, ¿ideología/izquierda-derecha?, cuánto se tarda, diferencia con otros tests; los datos estructurados `FAQPage` se generan solos); sección «Para decidir con información» con enlaces en contexto a los 8 grupos de páginas, los 6 tests por tema y las 10 comparaciones; los botones de «Tests por tema» de la portada ahora apuntan a `/tests/<tema>/` (el clic sigue abriendo el test); descripción de la portada con «qué partido representa tus ideas»; `/tests/` pasa a «Tests políticos por tema»; `WebSite` en JSON-LD. No se cambian URLs, ni el título de la portada (CTR 9,7 %), ni el diseño.
- **Datos de Search Console (export del 11 nov, 3 meses) y PageSpeed:** 83 % de los clics de las consultas listadas son de marca («test 29n», «test29n», «test elecciones 29n», posición 1–3). Lo no resuelto: «mesa electoral 29n <provincia>» = 3.481 impresiones y solo 30 clics (posición 6–9) en las páginas de provincia, que no hablaban de la mesa; «test político 29n» (168 imp., pos. 6,9, CTR 4,8 %); `/debates/` 786 imp., pos. 7,7, CTR 3,8 %. Cobertura: 228 indexadas, 11 no (5 redirecciones http/www, 2 canónicas alternativas, 4 «descubiertas, sin indexar»: falta saber cuáles). CWV: portada falla INP en móvil (344 ms; origen bien); medido: «Ver mis resultados» tardaba 552 ms (4× CPU).
- **Cambios añadidos:** (1) `finish()` de `assets/papeleta.js`: «Calculando…» y el cálculo del resultado en la tarea siguiente (la interacción queda por debajo de 40 ms); (2) las 52 páginas de provincia: sección «¿Te ha tocado mesa electoral en X?» (LOREG arts. 25–27, verificados en el BOE) y title «Elecciones 29N en X: candidaturas y mesa electoral»; mismas URLs; (3) `/votar/`: sección «Si te ha tocado mesa electoral» (`#mesa`).
- **Pendiente / datos que pide el titular:** ver el mensaje al titular del 11 nov (informes de Search Console y GoatCounter).

## 10 nov 2026 · S1b (madrugada): listo en `fuente`, PENDIENTE DE PUBLICAR en `main`
- **Hecho y verificado:** web real 23/23 baterías; versión nueva en local 23/23; `dist/` sin términos privados. Buscadores: `site:test29n.es` ya indexa portada, provincias, partidos y /debates/; para «test político elecciones 29N» aún no aparece entre los primeros resultados (sitio nuevo; sin trucos).
- **Cambio:** la imagen para compartir (`og.png`, `qa/assets.mjs`) decía 25 candidaturas; ahora 29 (107 preguntas, 12 áreas). `comprobado` (programas) y `revisado` (debates) → 2026-11-10: sin programas oficiales nuevos ni cambios de debates con fuente oficial (cara a cara Mediaset 16 nov: fecha acordada por las dos partes, hora sin anunciar; debate a cuatro y RTVE sin acordar; no se halló vídeo oficial del debate de laSexta del 9 nov, por eso sigue «confirmado»).
- **Kit de difusión** (`plan/DIFUSION-CAMPANA.md`): ya completo desde el 4 nov (medios, texto neutral y 11 preguntas del día, 13–23 nov); sin cambios.
- **Bloqueo:** la publicación en `main` (copiar `dist/` y push) fue denegada por el sistema de seguridad («Production Deploy») al ejecutarse sin el titular delante. `fuente` está al día (commits 91762c2 y 9592fca). Para publicar: copiar `dist/` (generado con `SITE_URL=https://test29n.es/ node publish.mjs`) a la rama `main`, commit y push normal, y luego `node indexnow.mjs`.

## Nota del 7 nov 2026 (tarde, trabajo manual con el titular): lee esto antes de la próxima tanda

Publicado y verificado en la web real (21/21 baterías): mejora visual del test y la portada («Completo» en el resultado), aviso de privacidad ampliado, aviso de «otras candidaturas» en el ranking, orden de las candidaturas por importancia (`DISPLAY_ORDER` en `src/partidos.src.mjs`; `PARTY_ORDER` no se toca), unas 160 posturas más con fuente o estimadas con base documentada y cinco partidos nuevos.
- **Partidos nuevos** (ficha en `partidos.src.mjs`, posturas en `preguntas.src.mjs`, `pid` en `candidaturas.json`): PCTE (36 provincias), Frente Obrero (52), Falange (9), Iustitia Europa y Partido Humanista (solo Madrid). Solo posturas explícitas de sus documentos; el resto es «desconocida» (valor 0). Madrid muestra 13 candidaturas (`qa/e2e.mjs`, `provFor` en e2e y quick).
- **Donaciones:** PayPal retirado; Apple Pay sigue (decisión del titular, que asume el riesgo de LSSI art. 10: no publica nombre ni domicilio). Análisis en `plan/LEGAL.md`.
- **Estimadas:** solo con base documentada directa (principio del documento, coalición, declaración o documento territorial); nunca por ideología. Propuestas descartadas y razones en `plan/fuentes-grandes/` y `plan/partidos-pequenos/`.
- **Sin programa del 29N a 7 nov:** Frente Amplio y SALF (sus estimadas siguen). A partir del 13 nov (campaña) revisar los programas oficiales de todos: se espera el de Vox. Faltan programas estatales de Por un Mundo Más Justo y Feministas al Congreso, y una copia pública de Podemos (la URL de podemos.info da 403 desde aquí).
- **Ciclo de pruebas que funciona:** `sh /tmp/ciclo.sh`-equivalente: `node qa/run.mjs posturas`, `node build.mjs`, `SITE_URL=https://test29n.es/ node publish.mjs` (conservar `src/lastmod.json`), `node qa/run.mjs todas`; levantar antes `python3 -m http.server` en :8765 (raíz) y :8766 (`dist/`). Esperar a que el proceso termine antes de leer el resultado.
- **Vídeos para redes:** guion y código en `plan/campana/` (los MP4 no están en el repositorio). Publicar solo del 9 al 23 de noviembre.

## Ficha de continuidad (actualizada el 3 nov 2026, C1)

**Estado de los bloques**
- Completadas y verificadas en la web real: T1–T12c (19–28 oct), R0 (29 oct), R1 (31 oct), mejoras de accesibilidad y uso (31 oct, ver regla 5 de `PLAN.md`), R2 y bloques B, A, C y E (1 nov), mejoras 1–6 del titular (2 nov) y C1 (3 nov, candidaturas definitivas y cabezas de lista).
- Pendientes de las mejoras del titular (esperan fecha o datos): tarjeta compartible y vista previa en X/WhatsApp (S1b), aviso de fecha en portada (S1c), enlaces rotos (S1d), verificación de neutralidad (S2).
- Pendientes, con tarea programada (calendario de campaña del titular, 28 oct; ver `PLAN.md`): S1 (6 nov), S1b (10 nov), S1c (13 nov), S1d (17 nov), S2 (21 nov), P1 (30 nov).
- Donación por Bizum: bloqueada por dependencia externa (aprobación de Stripe).

**Orden de trabajo para la próxima tanda**
0. **(13 nov) Primero:** revisar con su programa del 29N las posturas de Vox, EAJ-PNV y Adelante Andalucía (estado «publicado» ya puesto; ver la entrada del 13 nov arriba).
1. **Debates (`src/debates.src.mjs`):** a 1 nov, tres propuestas sin confirmar (Mediaset 16 nov, RTVE 23 nov, Atresmedia sin fecha). En cada tanda de campaña: actualizar estado, hora y cadena con fuente; tras cada debate, solo el enlace al vídeo oficial. No indicar qué partido acepta cada uno (neutralidad).
2. **Partidos regionales (decisión del titular pendiente):** el BOE recoge candidaturas regionales que no están en el test (Alhora, NEX, PREPAL, Convergents, Valencia Unida, Liberación Canaria, FIA…; lista en `plan/AUDITORIA-CANDIDATURAS.md`). El código admite posturas desconocidas («0»), pero cada postura necesita fuente: no añadir ninguno a medias. Ya aparecen, con su cabeza de lista, en la lista del BOE de cada página de provincia.
3. **Programas del 29N:** a 3 nov, ninguno publicado. Cuando salga uno: `src/programas.src.mjs` (`publicados`, `comprobado`) y revisión de sus 107 posturas con el PDF como fuente `programa`.
4. **Podemos:** 19 posturas documentadas siguen sin enlace (podemos.info da 403 y web.archive.org está bloqueado desde aquí): C03, C06, D01, D05, D06, F06, F08, F09, G03, G04, H09, I05, I06, I07, I09, K07, K08, L09 y F04. Se cierran con su programa del 29N.
5. **Pendiente de decisión del titular:** preguntas para un asesor en `plan/LEGAL.md`. (Correo público decidido el 4 nov: `test29n.es@gmail.com`.) Kit de difusión listo en `plan/DIFUSION-CAMPANA.md` (lo completa S1b).

**Archivos clave y decisiones técnicas**
- Mapa del código y grupos de pruebas: `CLAUDE.md`. Pruebas con `node qa/run.mjs <grupo|todas>` (21 baterías).
- Contador (GoatCounter, `count()` en `assets/papeleta.js`): pasos inicio, test-empezado, test-terminado, compartir, reto, donar-*, util-si/util-no. Nunca respuestas, provincia ni resultado (`qa/stats.mjs`).
- Tipografías recortadas con `qa/fonts.py` (necesita fonttools y brotli).
- Tras cambiar posturas: `node qa/run.mjs posturas` (regenera /correcciones/ y /metodologia/).
- Sitemap con fecha real por página: `src/lastmod.json`, que actualiza `publish.mjs` (hacer commit tras publicar). Programas: `src/programas.src.mjs`.
- Diseño aprobado por el titular (no revertir sin preguntar): ver regla 5 de `PLAN.md`.

**Pruebas (3 nov)**
- Local, versión publicable y web real: 21/21 baterías OK (ver la entrada C1).

**Errores pendientes (menores)**
- Ninguno conocido. (La lentitud de la portada en 3G se mejoró el 1 nov: ver la entrada «Velocidad de la portada».)

Entradas anteriores a R0: `plan/ESTADO-HISTORICO.md`.

## 6 nov 2026 · S1 (tanda completa de las 21:00): sin novedades, nada publicado
- **Programas del 29N:** ninguno publicado con enlace oficial abierto y leído (PP: solo el manifiesto «Contrato con España» del 19 oct; PSOE, Vox, Frente Amplio, Podemos, Junts: nada; ERC: un documento detallado que solo cita la prensa (Demócrata, 403 al abrirlo), no la web oficial: no cuenta). Webs de Vox, Podemos, ERC y Junts bloquean a los robots; un intento de abrirlas con un navegador que se hace pasar por uno normal fue denegado por el sistema y no se repitió. Hallazgos previos en `plan/REVISION-PREVIA-6NOV.md`. Sin cambios en `src/programas.src.mjs` ni en posturas.
- **Debates:** fuente abierta (Euronews 22 oct): cara a cara 16 nov (Mediaset), portavoces 23 nov (RTVE), cuatro candidatos 26 nov (PSOE acepta RTVE; PP rechaza RTVE y mantiene Atresmedia; sin hora ni cadena acordadas). Es lo que ya recoge `src/debates.src.mjs`: sin cambios. No se atribuyen posiciones por partido en la web (neutralidad).
- **Publicación:** ninguna (sin datos nuevos). `comprobado` y `revisado` siguen en 2026-11-04; se actualizarán en la próxima tanda con datos nuevos.
- **Cambio de reglas del titular (6 nov):** sin límite de tiempo por tanda y hasta 3 subagentes a la vez (`PLAN.md`, regla 3; solo S1 lo lleva en su encargo programado).
- **Para S1b (10 nov):** repetir programas con otro acceso a Vox, Podemos, ERC y Junts, y localizar la web oficial de Frente Amplio.

## 4 nov 2026 · Correo público, debates y revisión de provincias (petición del titular)
- **Correo público de contacto:** `test29n.es@gmail.com` (elegido por el titular el 4 nov). Sustituye al anterior en `pages.mjs`, `assets/papeleta.js` («¿Ves un error?», aviso legal, prensa, metodología, contacto de la ficha de prensa; 150 páginas) y en las pruebas `confianza`, `support` y `growth`. El correo de los commits (`CLAUDE.md`) no cambia.
- **Debates (`src/debates.src.mjs`, fuente Euronews 22 oct):** cara a cara de Mediaset del 16 nov aceptado por los dos candidatos (hora y confirmación de la cadena por anunciar); debate a cuatro planteado para el 26 nov con la cadena sin acordar (RTVE y Atresmedia lo han planteado), redactado sin atribuir posiciones a ningún partido. La fila «Atresmedia» pasa a «Debate entre los principales candidatos» (`debate-candidatos`). Portavoces de RTVE del 23 nov sin cambios (propuesta).
- **Programas del 29N:** ninguno publicado a 4 nov (búsqueda de PP, PSOE, Vox y Sumar; solo constan los responsables de elaborarlos). `comprobado` → 2026-11-04.
- **Provincias:** comprobadas las 52 páginas (título, descripción, número de candidaturas, lista del BOE, migas de pan y sitemap): sin problemas.
- **Prueba de PayPal (`qa/support.mjs`):** fallaba ~50 % de las veces porque PayPal muestra a veces una verificación anti-robot al navegador automático. Sigue siendo estricto lo nuestro (el botón abre exactamente la dirección de donación, en pestaña nueva y sin pasar la página de origen); que PayPal muestre el nombre de la donación pasa a aviso, con la comprobación de que la dirección responde 200.
- **Verificación:** 21/21 en local salvo esa prueba de PayPal (ya corregida), web real 20/21 por lo mismo; IndexNow 200 (231 URL).

## 4 nov 2026 · Mejora 7 · Letra del sistema con 3G o ahorro de datos (aprobada por el titular; publicada a las 01:30 como pidió)
- **Cambio (`publish.mjs`, solo la portada):** un script en línea (con su firma en la CSP de esa página, sin abrir `script-src`) comprueba `navigator.connection`: con `saveData` o `effectiveType` slow-2g/2g/3g no se piden las tipografías propias (168 kB) y la web usa la letra del sistema, con las medidas de las letras de reserva de `papeleta.css`; en el resto, o sin JavaScript (`noscript`), todo igual. Safari y Firefox no exponen esa información y siguen cargando las tipografías.
- **Medido en la web real (3G lenta, mediana de 3):** «Empezar» funciona en 8,0 s → 5,6 s; con ahorro de datos, 1,0 s y 0 archivos de letra; 4G sin cambios (1,0 s, con letra propia). Aspecto con letra del sistema revisado por el titular: títulos algo más finos y estrechos, mismo diseño.
- **Verificación:** 21/21 en local y 6/6 en la versión publicable antes de publicar; web real 21/21 después. IndexNow 200. Para deshacerlo: `git revert 92251cd`.

## 3 nov 2026 · Comprobación de enlaces de todas las fuentes (petición del titular)
- **Enlaces** (`qa/herramientas/comprobar-enlaces.py`, solo curl): 330 URL distintas en 823 posturas; 328 responden. Euronews (G01/psoe) da 406 a los robots pero la noticia existe (comprobada aparte). EITB redirige a orain.eus: enlace de D04/upn actualizado a la dirección nueva (misma noticia, «172 votos en contra (PP, Vox, UPN y CC)»).
- **¿Dice lo que decimos?** Las fuentes antiguas no guardan cita, así que se comprobó que cada página nombre al partido: 53 de 823 no lo hacen, casi todas explicables (documentos del Gobierno para el PSOE, votaciones nominales del Congreso en datos abiertos, programa de Sumar 2023 para sus socios de entonces). Revisadas a mano las dudosas (L02/ccpc, I01/vox): correctas. Sin fuentes rotas.
- **Verificación:** web real 21/21 tras publicar las fuentes; IndexNow 200.

## 3 nov 2026 · Fuentes de las posturas documentadas sin enlace (petición del titular, terminada)
- **Punto de partida:** de 2.130 posturas, 1.246 estimadas, 639 con fuente y **258 marcadas como documentadas pero sin enlace ni justificación**.
- **Hecho (138 de 258):** dos investigadores buscaron fuente para cada una; `verificar.py` comprobó que cada página responde y contiene la cita (111 de 112; la otra, revisada a mano). Aplicado con `qa/herramientas/aplicar-fuentes.mjs`: **110 fuentes nuevas con su justificación**; **40 posturas pasan a estimadas** (26 sin fuente fiable, B05/vox con fuente ambigua, C07/d21 y 12 de Democracia 21 cuya única fuente es el programa de Ciudadanos de 2019, que se enlaza pero no es de D21); **3 cambios de valor con fuente**: H05/ccpc 4→2 (Clavijo asume en 2024 la posición del Gobierno sobre el Sáhara), A02/d21 2→3 y D09/bildu 1→4 (estimada; propuesta de Otxandiano en 2024). Registro en `src/correcciones.json` (no público, decisión del 28 oct).
- **Segunda tanda (120 restantes, noche del 3 nov):** 74 fuentes nuevas verificadas; 54 posturas a estimadas (sin fuente fiable, fuente solo indirecta —J08 de Junts/PNV/Bildu, C05/upn, F05/junts…— o intensidad dudosa; 8 de ellas con la fuente enlazada como referencia); B07/mes 5→2 con fuente (Apesteguia rechaza gravar por nacionalidad). Se aceptan programas de coalición de 2023 (Sumar, NC) cuando la etiqueta lo dice.
- **Resultado total:** ya no queda ninguna postura «documentada» sin enlace. Con fuente: 639 → 823; estimadas: 1.246 → 1.340 (de 2.130). 4 cambios de valor con fuente: H05/ccpc, A02/d21, D09/bildu y B07/mes.
- **Rendimiento:** `data/preguntas.json` 384 → 426 kB sin comprimir (+9 kB comprimido). Portada en la web real: 389 kB y 8,2–8,4 s con 3G lenta (antes 380 kB y 7,2 s). Presupuestos: web real 380 kB/8,5 s → 410 kB/9 s; local 1000 → 1060 kB. `UPDATED` → 2026-11-03.
- **Verificación:** 21/21 en local y en la versión publicable; web real 20/21 hasta ajustar el presupuesto de rendimiento, después 21/21. IndexNow 200 (231 URL).

## 3 nov 2026 · Nombres en la papeleta según el BOE (petición del titular)
- **Cambio (`src/partidos.src.mjs`, `local`):** cada candidatura del test usa el nombre de su lista en el BOE: Frente Amplio como «Comuns-Front Ampli» (Cataluña), «Frente Amplio-Fronte Ampla» (Galicia), «Frente Amplio-Fronte Zabala» (Navarra y Álava), «Frente Ampliu por Asturies» y «Frente Amplio Andaluz» (Cádiz, Córdoba, Granada, Huelva y Sevilla; en Almería, Jaén y Málaga va como «Frente Amplio»); antes ponía «Frente Amplio por Andalucía», que no figura en el BOE. EH Bildu en Navarra, «EH Bildu-ERC»; PSOE en Baleares, «PSIB-PSOE»; Existe, «Teruel Existe».
- **`local` admite provincias** (la provincia manda sobre la comunidad): `pName` en `assets/papeleta.js`, `localName` en `pages.mjs`; `build.mjs` valida las claves.
- **Verificación:** 21/21 en local.

## 3 nov 2026 · C1 · Candidaturas definitivas y cabezas de lista (adelantada a petición del titular; la tarea de las 16:47 se desactivó)
- **BOE:** proclamación definitiva BOE-A-2026-23103 (3 nov, 225 págs.): 52 circunscripciones, 533 candidaturas proclamadas, 21 no proclamadas. Detalle en `plan/AUDITORIA-CANDIDATURAS.md`.
- **Candidaturas (`src/partidos.src.mjs`):** fuera del test UPL, Por Ávila y Jaén Merece Más (`out`); PACMA fuera de 22 circunscripciones, SALF de 6, Podemos de Baleares y Melilla, Frente Amplio de Ceuta y Melilla; CHA solo Huesca y Zaragoza; Existe solo Teruel; D21 y Soria ¡Ya! ya no «por confirmar». `except` admite ahora provincias (cambiado en `papeleta.js`, `pages.mjs`, `build.mjs` y las pruebas `territorio`, `metodologia`, `explain`). Sin diferencias con el BOE tras el cambio. 24 candidaturas en el test.
- **Cabezas de lista:** `src/candidaturas.json` (generado con `qa/herramientas/boe-cabezas.mjs`). Cada página de provincia: título «Candidaturas y cabezas de lista en [provincia] · 29N», cabeza de lista en cada candidatura del test y la lista completa de candidaturas proclamadas con enlace al BOE. Nueva comprobación en `qa/territorio.mjs`.
- **Herramienta del BOE reescrita** (`boe-candidaturas.py`): el PDF definitivo parte provincias en varios bloques, marca «No proclamada» y usa «Titular:» en Ceuta y Melilla.
- **Programas:** ninguno publicado a 3 nov (`src/programas.src.mjs`, `comprobado`); /programas/ apunta al BOE definitivo.
- **No hecho:** partidos regionales nuevos (pendiente de decisión del titular); revisión de enlaces de fuentes (es de S1d, regla anti-duplicación del titular); fuentes de Podemos (sin programa aún).
- **Pruebas:** `e2e` ponía el perfil de CHA en Teruel, donde ya no se presenta: pasa a Zaragoza. Kit de difusión: 27 → 24 candidaturas.
- **Verificación:** 21/21 en local y en la versión publicable; web real 21/21 (`growth` y `stats` fallaron una vez porque el reinicio del entorno apagó el servidor local de apoyo; pasan al repetir). IndexNow 200 (231 URL).

## 2 nov 2026 · Mejora 6 · Barra fina también con el móvil en horizontal (aprobada por el titular tras ver la prueba)
- **Problema:** con el móvil en horizontal (≥ 561 px de ancho y ≤ 500 px de alto) la barra del test era fija y ocupaba ~106 de 390 px; las respuestas quedaban fuera de la pantalla.
- **Cambio (`assets/mejora.css`):** en pantallas de ≤ 500 px de alto la barra del test deja de ser fija y se usa la barra fina del bloque 2. La pregunta sube ~50 px y las respuestas empiezan a verse. Revisados también iPhone SE (375×667) y Android pequeño (360×640) en vertical: sin problemas.
- **Verificación:** 21/21 en local y en la versión publicable. Observación: `rendimiento` falló una vez en la página estática (FCP 4,9 s con presupuesto local de 5 s, sin comprimir; no la afecta este cambio) y pasó dos veces al repetir. El margen local es justo; el presupuesto de la web real (3 s) se cumple. Web real: 21/21. IndexNow 200.

## 2 nov 2026 · Mejora 5 · Imprimir o guardar en PDF el resultado (aprobada por el titular tras ver la prueba)
- **Cambio (`assets/papeleta.js`, `assets/papeleta.css`):** enlace «Imprimir o guardar en PDF» bajo los botones del resumen (`window.print()`). Estilo de impresión: cabecera con fecha y test29n.es, resumen con clasificación y perfil, coincidencias y discrepancias, y «¿Cómo se calcula?» con la postura de cada partido y su fuente (las URL se imprimen). Se ocultan menús, botones y el análisis completo. Antes de imprimir se abren los desplegables del resumen y del cálculo; después vuelven a su estado (se guarda su posición, no el nodo, por si la página se redibuja; protección ante «beforeprint» doble).
- **Arreglado antes de publicar:** en la clasificación, la rejilla hacía que Chrome superpusiera la fila siguiente al partir página; en impresión va en bloque.
- **Verificación:** PDF A4 de 3 páginas revisado; 21/21 en local, en la versión publicable y en la web real. IndexNow 200.

## 2 nov 2026 · Mejora 4 · Resultados interactivos (aprobada por el titular tras ver la prueba)
- **Comparar desde la clasificación** (`rank5` en `assets/papeleta.js`): «Comparar [primera] con:» y un botón por cada una de las otras cuatro, que abre el comparador «frente a frente» existente (`data-vs`) con esos dos partidos.
- **Qué cambia al editar una respuesta** en «Revisa y cambia»: bajo la respuesta, «Tu coincidencia cambia: X 45 → 37 %, … y N más» y, si cambia, «Ahora tu mayor coincidencia es …»; o «Este cambio no mueve tu coincidencia con ninguna candidatura». Sustituye al aviso «Resultado recalculado» (los dos avisos se pisaban en el lector de pantalla).
- **Verificación:** 21/21 en local y en la versión publicable; en la web real 20/21 con solo `support` fallando en la comprobación externa de PayPal, que pasa al repetirla. IndexNow 200.
- **Prueba más robusta:** `qa/support.mjs` esperaba 4 s fijos a la página de PayPal y fallaba cuando PayPal tardaba (4 veces el 2 nov, ninguna por la web: el enlace responde 200). Ahora espera hasta 20 s a que aparezca el nombre de la donación; lo comprobado no cambia. Después: 2 de 2 en local y 5 de 6 en la web real.

## 2 nov 2026 · Mejora 3 · Portada más corta en el móvil (aprobada por el titular tras ver la prueba)
- **Cambio (`assets/mejora.js`, `assets/mejora.css`):** en el móvil (≤ 760 px), «Cómo funciona», «Qué lo hace distinto» y «Las 12 áreas del test» se pliegan (título con botón «+», patrón de acordeón con aria-expanded/aria-controls). Ningún texto cambia ni se quita; en ordenador, igual que antes. Altura de la portada a 390 px: 7.375 → 4.661 px.
- **«Preguntas frecuentes» sigue abierta** a propósito: `qa/seo.mjs` exige que sus respuestas se vean a 390 px.
- **Verificación:** 21/21 en local (`support` volvió a fallar una vez en la comprobación externa de PayPal; pasa al repetirla y el enlace responde 200), en la versión publicable y en la web real. IndexNow 200.

## 2 nov 2026 · Mejora 2 · Barra fina durante el test en el móvil (aprobada por el titular tras ver la prueba)
- **Problema:** en el móvil (≤ 560 px), al centrar cada pregunta, la barra del test (contador, área, progreso) quedaba fuera de la pantalla y «Anterior» al final de la página.
- **Cambio (`assets/mejora.js`, `assets/mejora.css`):** barra fina fija arriba (`.q-mini`) mientras la barra original no se ve casi entera: «‹ Anterior» (usa el mismo botón del test: vuelve con la respuesta marcada; no aparece en la primera pregunta), «Pregunta N de M», el área y una línea de progreso. Sin textos nuevos visibles; los textos van ocultos al lector de pantalla (ya están en la barra original). El centrado de la pregunta descuenta la barra y nunca tapa la línea del código y el área; «Respuesta guardada» baja bajo la barra. En ordenador no cambia nada.
- **Verificación:** 21/21 en local, en la versión publicable y en la web real. IndexNow 200.

## 2 nov 2026 · Mejora 1 · Resultados más claros (aprobada por el titular tras ver la prueba)
- **Clasificación de las 5 candidaturas más cercanas** en el resumen (`rank5` en `assets/papeleta.js`, estilos `.rank5` en `assets/papeleta.css`): logo, nombre, barra en escala real 0–100 % y porcentaje, con enlace «Ver las N candidaturas de [provincia]». Sustituye la línea «Siguientes: …». En ordenador va en la columna derecha; en móvil, tras los botones, para que «Compartir» y «Reta a un amigo» sigan en la primera pantalla (lo exige `qa/summary.mjs`).
- **Final sin repeticiones:** con el análisis completo plegado ya no se repiten «Compartir mi resultado», «Repetir el test» ni «Cómo se calcula» (clase `.dup`); vuelven al desplegarlo.
- **«¿Te ha resultado útil?»** en su línea, con «Sí»/«No» juntos debajo.
- **Verificación:** 21/21 en local (`support` falló una vez por la comprobación externa de PayPal y pasó al repetirla), en la versión publicable y en la web real. IndexNow 200.

- **4 nov (tarde) · Mejora 8 publicada (aviso de guardado):** quitado el párrafo fijo `q-save`; aviso transitorio «Respuesta guardada» (2,5 s, aria-live polite, se apaga al cambiar de pregunta/salir), indicador «Autoguardado» y aviso `role=alert` si falla localStorage (`store.set` emite `save-failed`). Pruebas en `qa/e2e.mjs`. 21 baterías OK, web real OK. Pendiente del encargo de 5 puntos: 2–5 (la mayoría ya existen); decisión del titular sobre quién aparece en «Quién está detrás».
- **4 nov (noche) · Mejora 9 publicada:** hitos de progreso (cuarto, mitad, tres cuartos; aria-live) y textos de /sobre/ (Dery es un apodo; proyecto de una sola persona; sin financiación externa, pagado por su autor; sin mención a IA por decisión del titular, sin afirmar lo contrario). 21 baterías OK y web real OK. Puntos 2–3 del encargo cubiertos. Quedan 4 (compartir por Telegram; OG por resultado imposible, tarjeta genérica prevista 10 nov) y el indicador de autoguardado tapado por la barra fina en móvil.
- **5 nov · Mejora 10 publicada:** quitado el cartel visual «Respuesta guardada» tras cada respuesta (a petición del titular: saturaba). El guardado no cambia; quedan el indicador «Autoguardado», el anuncio invisible para el lector de pantalla (no se anuncia si falla el guardado) y el aviso role=alert si falla. Publicado con la batería `support` en rojo por bloqueo 403 de PayPal desde el entorno (no relacionado; el titular lo autorizó); `e2e` y resto OK. Pendiente: comprobar el enlace de donación desde fuera del entorno.
- **7 nov · Fuentes de los 8 partidos grandes:** de 230 posturas estimadas (PSOE, PP, Vox, Frente Amplio, Podemos, PACMA, ERC, EH Bildu) se investigaron todas; 58 con fuente verificable, 40 aplicadas (citas literales y valor sin cambios) y publicadas: 863 posturas con fuente, 1.300 estimadas, 0 documentadas sin enlace. En `plan/fuentes-grandes/`: `en-revision-manual.json` (18: 12 cambian el valor y 6 con cita no exacta; no aplicadas), `resultado*.json` y `revisado.json`. 172 siguen estimadas por falta de fuente fiable (programas de 2023 casi mudos, webs de Vox/PSOE/Podemos/ERC bloquean robots, congreso.es da 403 a curl). Herramienta nueva: `qa/herramientas/quitar-estimadas.mjs`. 21 baterías: 20 OK en local y web real; `support` falla por 403 de PayPal desde el entorno (autorizado por el titular). Pendiente: resto de partidos (1.070 estimadas) y revisión manual de las 18.
- **7 nov (tarde) · Telegram y revisión manual de 18 fuentes:** botón «Enviar por Telegram» en Compartir (t.me/share/url, enlace aparte, sin destinatario; pruebas en `qa/share.mjs`). De las 18 fuentes pendientes de los partidos grandes se aplican 11 (5 con el mismo valor y 6 con valor nuevo por fuente explícita: B03/erc 2→1, F05/erc 3→4, A05/vox 2→3, C06/fa 4→2, G02/pacma 3→4, L07/pod 3→2) y 7 siguen estimadas (E02/psoe 2018, L04/bildu 2017, B05/pp, I03/vox, C07/pp, K02/pp, G04/erc: no hablan exactamente de lo preguntado o están desfasadas). Total: 874 posturas con fuente, 1.289 estimadas. 21 baterías: 20 OK en local y web real; `support` falla por el 403 de PayPal desde el entorno (autorizado por el titular). Herramienta: `qa/herramientas/quitar-estimadas.mjs`.
- **7 nov (madrugada) · PayPal retirado y barra fina del móvil:** `DONATE.paypal` vacío (decisión del titular: solo daba problemas); queda Apple Pay (Stripe), visible solo en dispositivos Apple, y el botón «Donar» del resumen solo aparece si hay método. La barra fina del móvil repite los hitos de progreso y «Sin guardar» (antes los tapaba). Pruebas adaptadas (`support`, `stats`, `summary`). **21/21 en local y en la web real** (ya no depende de PayPal). Correos de difusión: 14 direcciones públicas verificadas, programados para las 09:00 (ver `plan/CORREOS-7NOV.md`; tarea `trig_0197JWodrcTp9J2NvprDXGkX`). Tarjeta OG genérica: ya existía, S1b la actualiza.
- **7 nov (tarde) · Información al día, publicado:** /debates/ con los debates confirmados (laSexta Debate lunes 9 con Ana Pastor, regeneración/inmigración/Estado del bienestar, sin hora ni participantes publicados; debate de economía viernes 13, 21:30, laSexta, Cuerpo/Bravo/Bustinduy/Figaredo; cara a cara de vivienda miércoles 18, Cadena SER, Isabel Rodríguez/Juan Bravo) y las propuestas sin cerrar (cara a cara 16 en Mediaset, portavoces RTVE 23, cuatro 26 sin cadena: PSOE quiere RTVE, PP Atresmedia), con fuentes del 6 nov (El Cronista, Pressdigital) y de Atresmedia. Programas: ninguno publicado con enlace oficial (`comprobado` 2026-11-07). Calendario de /votar/ revisado el 7 nov (sin cambios: voto por correo hasta el 19, entrega en Correos hasta el 25). `UPDATED` de build.mjs → 2026-11-07. 21/21 en local y en la web real; IndexNow 200. Pendiente: confirmar la hora del debate del 13 (anuncio de laSexta en X no se pudo abrir) y repetir en S1b.
- **8 nov · Repaso de pendientes:** (1) hora del debate del 13 (21:30, laSexta) confirmada por el titular y ya publicada, citando el anuncio de laSexta y El Cronista. (2) Kit de difusión revisado: no menciona PayPal ni aportaciones, sin cambios. (3) Segunda búsqueda de las 7 fuentes estimadas (E02/psoe, L04/bildu, B05/pp, I03/vox, C07/pp, K02/pp, G04/erc): sin fuente nueva que cumpla las reglas (PSOE: nada posterior a 2022 sobre la prisión permanente, y en 2022 apoyó ampliarla; Bildu: solo la declaración de 2017; Vox y PP: sin votación ni texto explícito sobre universidades privadas o pisos turísticos). Siguen estimadas; se reabren con los programas del 29N.

## 1 nov 2026 · Velocidad de la portada en móvil (petición del titular)
- **Problema (pendiente desde el 31 oct):** con 3G lenta, «Empezar» tardaba ~8,8 s: los datos se pedían solo después de descargar y ejecutar `papeleta.js`, y la fuente precargada (85 kB) compartía la conexión con ellos.
- **Cambio (solo en `publish.mjs`, solo la portada):** precarga de `data/preguntas.json`, `partidos.json` y `politicos.json`; `fetchpriority="high"` en `papeleta.js` y en los dos datos principales; la portada ya no precarga la tipografía (las demás páginas sí). Sin cambios en el motor, el cálculo ni el aspecto: el texto sale desde el principio con la fuente del sistema y cambia a la propia al llegar (`font-display: swap`), como ya pasaba en conexiones lentas.
- **Medido (simulación local con compresión, mediana):** 3G lenta 8,6 → ~7 s; 3G rápida 2,3 → 1,8 s; primer pintado igual o mejor. Descartado recortar glifos de las fuentes: solo ahorraba ~20 kB y arriesgaba nombres con letras poco comunes.
- **Prueba permanente:** `qa/rendimiento.mjs` comprueba que cada archivo de datos se descarga una sola vez (si la precarga dejara de coincidir, se bajaría dos veces) y el presupuesto de la web real baja de 10 a 8,5 s.
- **Web real (mediana de 5):** 3G lenta 8,8 → 7,2 s; 3G rápida 2,8 → 2,3 s. 21/21 en local, versión publicable y web real. IndexNow 200.

## 1 nov 2026 · Bloque E · Accesibilidad (5a, petición del titular)
- **Barrido completo** con axe-core (WCAG 2.2 AA y buenas prácticas) en inicio, pregunta con contexto abierto, resultado completo con todo desplegado y comparando, «Cómo funciona», posturas y 22 páginas estáticas, en claro 1280, oscuro 390 y 320 px; y recorrido con Tab (unas 1.400 paradas) comprobando foco visible.
- **Corregido:** orden de títulos en «¿Cómo se calcula?» (h3 → h2, mismo aspecto) y en «Posturas de los partidos» (título oculto para lector); la pregunta de ejemplo de la portada era una región «complementaria» dentro de la principal (ahora `section`); contraste de los hitos pasados del calendario (2,35:1 → sin opacidad); las llamadas «Hacer el test» de las páginas de partido tienen nombre propio; enlace subrayado en el mini test insertable; colores del sistema para el radar en modo de alto contraste.
- **Sin cambios necesarios:** foco visible en todo, movimiento reducido (regla global), textos alternativos y nombres de botones.
- **Prueba permanente:** `qa/audit.mjs` ahora falla con cualquier infracción (antes solo con las graves), revisa también el resultado completo abierto y, con `BASE` en dist o la web real, 5 páginas estáticas.
- **Verificación:** 21/21 en local, en la versión publicable y en la web real. IndexNow 200 (231 URL).

## 1 nov 2026 · Bloque C · Radar de las siete dimensiones (petición del titular)
- **Radar SVG nativo** (sin librerías) encima de las barras de «Tu perfil» (`radarSVG` en `assets/papeleta.js`, estilos `.radar`/`.rd-*` en `assets/papeleta.css`). Misma escala que las barras: centro = primer polo (−100), borde = segundo polo (+100), círculo discontinuo = equilibrio. Con «Comparar con», añade el polígono discontinuo de esa candidatura. Descripción completa con los valores para lector de pantalla; las barras siguen debajo como alternativa en texto.
- **Puerta superada:** `qa/e2e.mjs` (sección 7) responde 3 tests distintos (mixto, de acuerdo, en desacuerdo) y comprueba que cada punto coincide con su barra, que su radio es el del valor y que todo lo que dice el texto del resultado («Te inclinas por…») está en el lado correcto del radar, y al revés.
- **Arreglado de paso:** a 320 px, «Comparar con» ensanchaba «Tu perfil» 14 px (misma causa que en el repaso; ahora la regla vale para todas las secciones del resultado, `assets/mejora.css`).
- **Verificación:** 21/21 en local y en la versión publicable; en la web real, 20/21 antes de publicar E (solo fallaba la `audit` ya endurecida, por lo que corrige E) y 21/21 después.

## 1 nov 2026 · Bloque A · Transparencia del cálculo (petición del titular)
- **Panel «¿Cómo se calcula tu resultado?»** en el resultado, cerrado por defecto, justo después del resumen (`#r-how`, `renderHow` y `renderHowParty` en `assets/papeleta.js`; estilos `.how` en `assets/papeleta.css`; enlace «Cómo se calcula» en el menú de candidaturas). Solo lee el cálculo existente (`MODEL`, `weightOf` y las constantes): no cambia ningún resultado.
- Muestra: las reglas y pesos reales (importante ×2, prioridad ×1,5, estimada ×0,6, neutral ×0,5, cobertura mínima 50 %); el peso de cada dimensión en **tu** resultado; y, para la candidatura elegida, cada pregunta con tu respuesta, la suya, «Documentada» o «Estimada» y su fuente enlazada (o «Deducida de su línea general» / «Sin enlace todavía»).
- **Puerta superada:** `qa/e2e.mjs` (sección 6) comprueba a 320, 390 (oscuro) y 1280 px que cada enlace es exactamente la fuente del banco, que la marca de estimada coincide, que la coincidencia es la del selector y que los pesos suman ~100 %.
- **Arreglado de paso:** a 320 px «Repasa tus respuestas» desbordaba 10 px en horizontal (el texto largo de las opciones ensanchaba la rejilla; `assets/mejora.css`).
- **Verificación:** 21/21 en local, en la versión publicable y en la web real. IndexNow 200.

## 1 nov 2026 · Bloque B · Flujo del test (petición del titular)
- **Contador** «Pregunta 3 de 15» en lugar de «03 / 15» (`renderProgress` en `assets/papeleta.js`, una línea); el total es el de la versión (15/24/48/107 o tema).
- **Aviso fijo** bajo la barra de progreso, en todas las preguntas: «Puedes cerrar y volver cuando quieras: tus respuestas se guardan en este navegador.» (`assets/mejora.js`).
- **Confirmación visible** «✓ Respuesta guardada» 1,2 s al elegir (toque, ratón o teclado), arriba y centrada, sin recibir toques y oculta al lector de pantalla (ya se anunciaba). Arreglado de paso: con el paso automático activado, las teclas 0–5 no anunciaban «Respuesta guardada».
- **Pruebas:** nueva sección en `qa/e2e.mjs` (contador en las 4 versiones; aviso y confirmación de 320 a 1920 px). **Arreglo importante en las pruebas:** `e2e` y `share` no devolvían código de error, así que sus fallos no se veían en `run.mjs`: desde el 31 oct `e2e` ocultaba 2 fallos (comprobaciones del panel de contexto antiguo, actualizadas al acordeón aprobado) y `share` 4 en local (comparaban con la dirección local en vez de la pública). Ahora ambas fallan de verdad si algo falla. Contador adaptado en `e2e`, `features`, `onboarding`, `share` y `stats`.
- **Verificación:** 21/21 en local, en la versión publicable y en la web real (con `e2e` y `share` ya devolviendo errores). IndexNow 200.
- **Rendimiento:** presupuesto local 960 kB/21 s → 1000 kB/22 s (archivos sin comprimir; C1 añadirá fuentes); el de la web real (380 kB comprimidos, 10 s) no cambia. `publish.mjs` compacta también los espacios de `mejora.css`.

## 1 nov 2026 · R2 · Página /debates/ y revisión
- **Página nueva /debates/:** una tarjeta por debate (estado, organiza, fecha, hora, dónde verlo, participantes, fuente y botón al test). A 1 nov ningún debate está confirmado por todos sus participantes: se publican las tres propuestas contrastadas en RTVC e Infobae (9 oct): cara a cara Sánchez–Feijóo en Mediaset (16 nov), portavoces parlamentarios en RTVE (23 nov) y candidatos de los principales partidos en Atresmedia (fecha por fijar; se ha planteado el 26). Hora y cadena, «por confirmar». No se indica qué partido acepta cada uno. Sin enlace en la portada: sería un texto nuevo en la interfaz del test, que necesita la aprobación del titular (regla 5); está en el pie de todas las páginas, en el del test y en /calendario/. Sus estilos van dentro de la página para no sumar peso a la portada (presupuesto de `rendimiento`). Sitemap: 231 URL; pruebas nuevas en `growth`.
- **Programas del 29N:** ninguno publicado a 1 nov; fecha de comprobación de /programas/ al día.
- **Revisión total:** 21/21 baterías en local y en la web real (erratas de datos, enlaces, accesibilidad, 320–1920 px, claro y oscuro, rendimiento); sin errores nuevos que corregir. IndexNow 200 (231 URL).

## 31 oct 2026 · Mejoras de accesibilidad y uso (petición del titular, publicadas)
- Versión mejorada en cuatro iteraciones (sistema de diseño y cabecera; pregunta, respuestas y «Más contexto»; progreso, avance automático y provincia; resultados y repaso final) más ajustes pedidos por el titular («Volver arriba» en todas las vistas salvo el test, «Posturas» sin retraso, botones del resumen en cuadrícula). Ningún texto existente cambia; textos nuevos aprobados: «Respuesta guardada», «Pasar de pregunta automáticamente», «Buscar provincia», «1 provincia coincide / N provincias coinciden», «Ninguna provincia coincide con la búsqueda» y «Volver arriba».
- Integración: `assets/mejora.css` y `assets/mejora.js` solo en la página del test; 21/21 baterías sin cambiar ninguna prueba. Para que «Compartir» siga en la primera pantalla del móvil (batería `summary`), el resumen se compactó sin reducir la letra.
- Web real: 21/21 (`onboarding` falló una vez justo tras publicar, sin detalle, y pasó en las dos repeticiones: probablemente archivos aún sin actualizar en el servidor). IndexNow 200.
- Después (pedido por el titular, publicado con su OK): al empezar el test y al pasar de pregunta, el enunciado y sus respuestas quedan centrados en la pantalla en lugar de subir arriba del todo (`centerQuestion` en `assets/mejora.js`). Web real: 21/21; IndexNow 200.
- Pruebas propias y documentación: rama `version-mejorada`, carpeta `version-mejorada/` (`qa-iteracion.mjs`, `CHANGELOG.md`, `contraste.md`, `textos-nuevos-ui.md`).

## 31 oct 2026 · R1 · Página /programas/ y repaso
- **Página nueva /programas/** (para buscadores en campaña): una fila por candidatura con el estado de su programa del 29N (publicado, con enlace oficial, fecha y posturas revisadas con él; o «aún no publicado»), fecha de comprobación, datos estructurados `ItemList` y aviso para UPL, Por Ávila y JMM («no figuran en las listas provisionales del BOE»). Datos en `src/programas.src.mjs` (solo enlaces oficiales del partido). Enlazada desde el pie de todas las páginas, el pie del test, /partidos/ y cada página de partido (nueva fila «Programa del 29N»). Sitemap: 230 URL. Pruebas nuevas en `growth`.
- **Programas del 29N:** ninguno publicado a 31 oct (prensa y agregadores; el PP presentó el 19 oct un manifiesto, «Contrato con España», que no es el programa). 
- **Fuentes:** sin programas nuevos ni votaciones nuevas, no se añaden (orden de la ficha).
- **ESTADO.md:** la entrada de R0 estaba mezclada dentro de la de la auditoría; separada. Entradas anteriores a R0, movidas al histórico.

## 29 oct 2026 · R0 · Repaso y pendientes (adelantada a petición del titular)
- **Podemos:** 4 posturas más con fuente (edad penal E04, prioridad nacional F03, reparto de menores F05 y ley de cooperación H07), todas de votaciones nominales del Congreso contra iniciativas de Vox, sin cambiar valores. Descartadas por no tratar la misma cuestión o por voto partido: velo integral (L09), regularización (F04) y educación en español (I05). Podemos pasa de 53 a 57 posturas con fuente.
- **Barra del test en móvil:** la etiqueta «Área 2 de 12 · Vivienda y urbanismo» ya no se corta con puntos suspensivos (hasta 3 líneas a 320 px).
- **Programas del 29N:** ninguno publicado a 29 oct.
- **Calendario:** la tarea programada de R0 (29 oct, 2:13) se desactivó para no repetirla.

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

## Ficha de continuidad anterior (sustituida el 26 oct 2026)

**Aviso para la próxima tanda (leer primero).** El 20 oct se agotó el límite de uso y las tandas T9 (a medias), T2, T3 y T4 no llegaron a hacerse. Las tareas perdidas no se recuperan solas. Orden de trabajo acordado, por valor:
1. ~~Cerrar T9, parte 1~~ **Hecho y publicado el 23 oct** (ver la entrada de abajo).
2. ~~T2~~ **Hecho y publicado el 23 oct** (ver la entrada de abajo).
3. ~~T3~~ **Hecho y publicado el 23 oct.**
4. La tanda del día.
5. ~~T4~~ **Hecho y publicado el 24 oct.**
6. ~~T10~~ **Hecho y publicado el 24 oct.** ~~T7~~ también, el 24 oct (modo de bajo consumo). ~~T6~~ también, el 24 oct (adelantada a petición del titular, todas las posturas de Vox y Frente Amplio).
7. ~~T5~~ **Hecho y publicado el 24 oct** (adelantada a petición del titular). Ampliada el mismo día a todas las posturas de PSOE y PP (prioridad 3 incluida).
8. **Calendario adelantado (24 oct), porque T5, T6 y T7 se hicieron el 24:** T8 el 25 oct, T11 el 26, T12 (fuentes del resto de candidaturas) el 27, T12b (continuación y programas de 2026) el 28 y R0 (repaso y recuperación) el 29. Tareas programadas actualizadas. Nueva instrucción permanente del titular: incorporar los programas electorales de 2026 en cuanto se publiquen (PLAN.md, regla 5). Siguiente: T8, T11, T12, T12b y R0 según el calendario. Posturas discutibles de PSOE y PP ya decididas (ver la entrada de T5).
Cada tanda hace lo que le dé tiempo en este orden y anota aquí lo que quede. Referencia completa: `plan/ESTADO_MAESTRO_WEB_POLITICA.md`.


**Estado de los bloques**
- T1 · Portada y entrada: completada y verificada (web real, 19 oct).
- T9 · Buscadores y datos abiertos: completada y verificada (web real, 23 oct).
- T2 · Test rápido y resultados: completada y verificada (web real, 23 oct).
- T3 · Guía para votar y calendario: completada y verificada (web real, 23 oct).
- T4 · Provincias, simulador y glosario: completada y verificada (web real, 24 oct).
- T10 · Tests por tema, imágenes para redes y kit: completada y verificada (web real, 24 oct).
- T5 · Fuentes de PSOE y PP: completada y verificada (web real, 24 oct).
- T6 · Fuentes de Vox y Frente Amplio: completada y verificada (web real, 24 oct).
- T7 · Fuentes de Podemos y ERC: completada y verificada (web real, 24 oct).
- T8 · Justificaciones visibles y confianza: completada y verificada (web real, 25 oct). T11, T12, T12b y R0: pendientes.
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

## 24 oct 2026 · T7 · Fuentes de las posturas de Podemos y ERC
- **Adelantada a petición del titular, en modo de bajo consumo:** un subagente por partido (190 posturas sin fuente: 96 de Podemos, 94 de ERC), un revisor y una sola pasada de pruebas. Mismo criterio que T5 y T6.
- **Resultado:** 96 fuentes nuevas (42 de Podemos, 54 de ERC). Total de la web: 361 → 457. Los 38 enlaces únicos nuevos responden con 200.
  - **Podemos:** 53 de 107 posturas con fuente; 31 estimadas.
  - **ERC:** 64 de 104 posturas con fuente; 40 estimadas.
- **6 posturas ajustadas** (nota en `NOTES`): Podemos A09 2→1 y C04 5→4; ERC B08 5→4, D02 2→4, H06 3→2 y K08 4→2 (ponencia política del 30.º congreso de ERC, de marzo de 2025).
- **Pasan a «estimadas» (mismo valor), porque no hay ninguna fuente:** ERC B03, D03, D09, E04 y F03.
- **Pendiente para T12b o R1:** la web de Podemos (podemos.info) bloquea a los robots con Cloudflare y no se pudo leer su programa. 22 posturas documentadas de Podemos siguen sin enlace: C03, C06, D01, D05, D06, E04, F03, F04, F05, F08, F09, G03, G04, H07, H09, I05, I06, I07, I09, K07, K08 y L09. No se marcan como estimadas, porque el problema es de acceso, no de falta de fuente. Reintentar con otra copia del programa o con hemerotecas.
- **Revisión independiente:** corregida una frase que no estaba en su fuente (A01 de Podemos) y una exageración (D03 de Podemos); 6 estimaciones sin base pasan a 3 (Podemos C02, D02, H02, H03 y H08; ERC G07); los resúmenes de prensa del programa europeo de Podemos pasan a tipo «prensa»; etiquetas y fechas unificadas.
- **Pruebas:** las 19 baterías pasan en local y en https://test29n.es. IndexNow: 200 OK, 227 URL.
- **Propuesta destacada de Podemos corregida:** «Bajar por ley un 40 % los alquileres y prohibir comprar vivienda que no sea para vivir».

## 24 oct 2026 · T6 · Fuentes de las posturas de Vox y Frente Amplio
- **Adelantada a petición del titular.** Mismo método y criterio que T5: todas las posturas sin fuente (190: 96 de Vox, 94 de Frente Amplio), cuatro subagentes de dos en dos y revisión una a una. Se aceptan programas de 2023 a 2026, leyes en vigor y votaciones desde 2021; se descartan declaraciones anteriores a 2021, fuentes indirectas y evidencias solo autonómicas. Ni Vox ni Frente Amplio han publicado aún programa para 2026: se usan el programa de Vox de 2023 y el de Sumar de 2023, más votaciones, decretos y declaraciones de 2021 a 2026.
- **Resultado:** 134 fuentes nuevas (65 de Vox, 69 de Frente Amplio). Total de la web: 227 → 361. Los 48 enlaces únicos nuevos responden con 200.
  - **Vox:** 76 de 107 posturas con fuente; 26 estimadas.
  - **Frente Amplio:** 82 de 107 posturas con fuente; 19 estimadas.
- **16 posturas ajustadas** (casi todas en un punto), por una fuente oficial reciente; cada una con su nota en `NOTES`:
  - **Vox:** A07 5→4, B07 3→4, D09 3→2, K03 3→4, L07 2→1. H05 se cambió a 3 y se deshizo en la revisión, porque la fuente no lo sostenía.
  - **Frente Amplio:** C04 5→4, D06 5→4, E07 4→2, E09 5→4, G02 2→3, G08 2→3, H02 3→4, H03 3→2, J03 5→4, J05 3→4, J08 4→5.
- **Pasan a «estimadas» (mismo valor), porque no hay ninguna fuente reciente:** Vox D07, E07 y L05; Frente Amplio D09, E02 y E04.
- **Estimaciones extremas sin base, moderadas un punto hacia el centro** (revisión independiente): Frente Amplio E04 1→2, E05 5→4, G07 5→4, I04 1→2, J06 1→2, K07 1→2; Vox E05 1→2, E07 1→2, J04 1→2, L05 1→2.
- **Revisión independiente:** además, corregidas atribuciones (L07 Vox: cita literal de Abascal; I03 FA), una nota (B07 Vox: la propuesta no distingue residentes ni origen), un tipo de fuente (B03 Vox, prensa) y las etiquetas del programa de Vox, unificadas.
- **Sin cambios por ser evidencia antigua, indirecta o autonómica**, aunque los subagentes proponían cambiarlas: Vox A05, C07, D01, F08 e I03; Frente Amplio F09.
- **Pruebas:** las 19 baterías pasan en local y en https://test29n.es. IndexNow: 200 OK, 227 URL.
- **Propuestas destacadas actualizadas:**
  - **Vox:** competencias que quiere devolver al Estado (Educación, Sanidad, Seguridad y Justicia); Plan Nacional del Agua con interconexión de cuencas, porque su programa no habla de «trasvases».
  - **Frente Amplio:** congelar el alquiler y prorrogar tres años los contratos (propuesta de octubre de 2025); prestación de 200 euros al mes por hijo; embargo de armas a Israel sin excepciones; electrificar el parque móvil para que en 2040 no circulen coches de combustión.

## 24 oct 2026 · T5 (ampliación) · Todas las posturas de PSOE y PP revisadas
- **Petición del titular:** buscar fuente para todas las posturas de PSOE y PP que no la tenían (137, casi todas de prioridad 3). Cuatro subagentes, de dos en dos, con revisión una a una.
- **Criterio aplicado (uniforme):** se aceptan programas de 2023 a 2026, la ponencia política del PP de 2025, leyes en vigor y votaciones desde 2021. Se descartan declaraciones anteriores a 2021, fuentes indirectas y evidencias solo autonómicas. Una votación en las Cortes es «parlamento» aunque se cite a través de la prensa.
- **Resultado:** 95 fuentes nuevas (50 del PSOE, 45 del PP). Total de la web: 131 → 227. Los 55 enlaces únicos nuevos responden con 200.
  - **PSOE:** 92 de 107 posturas con fuente; 12 estimadas.
  - **PP:** 80 de 107 posturas con fuente; 21 estimadas.
- **22 posturas ajustadas** (casi todas en un punto), por una fuente oficial reciente; cada una con su nota en `NOTES`:
  - **PSOE:** F06 3→4, G02 1→2, G08 3→4, H08 5→4, I09 3→4, J05 3→4, J06 2→3, J07 3→2, K06 3→4, K08 4→3.
  - **PP:** A09 3→4, C08 2→4, F04 3→4, G02 3→2, G06 2→3, H05 3→4, H07 3→4, H09 4→3, K08 2→3, L04 2→3, L06 2→4. Siguen estimadas, con el valor corregido: A07 4→2 (solo hay una fuente de 2012, y apunta en contra) y D06 2→3 (no hay base para inclinarla).
- **Sin cambios por ser evidencia antigua o indirecta**, aunque los subagentes proponían cambiarlas: PSOE C06, D02, D05, J02 (fuentes de 2016–2018) y F05; PP A05, D05, F02 y K02. PP I03 se cambió y se deshizo en la revisión, porque la fuente no lo sostenía.
- **Pruebas:** las 19 baterías pasan en local y en https://test29n.es. IndexNow: 200 OK, 227 URL.
- **Revisión independiente:** corregidas dos justificaciones que atribuían al PP lo que la fuente no dice (I03, H09), términos valorativos («presume», el «absoluto defensor» sin comillas), tipos de fuente (L04 PP es prensa; E05 PSOE, declaración) y redacción de las propuestas del PP.
- **Propuestas destacadas del PP actualizadas** al «Mi contrato con España» (19/10/2026) y al argumentario de vivienda (octubre de 2026): un millón de viviendas con nueva ley del suelo; un 60 % menos de IVA e ITP para jóvenes compradores; desalojos en 48 horas (no 24); vías legales de entrada y prohibición por ley de las regularizaciones colectivas; planes de seguridad y económico para Ceuta y Melilla.
- **Arreglo del test rápido:** con las nuevas posturas, la selección de 15 preguntas quedaba desequilibrada (5 afirmaciones en un sentido y 8 en el otro). `quickOrder()` impone ahora el equilibrio. Se llegó a publicar unos minutos con ese desequilibrio porque el comando de publicación no comprobaba el resultado de las pruebas; ahora sí lo hace.

## 24 oct 2026 · T5 · Fuentes de las posturas de PSOE y PP
- **Alcance:** las 71 posturas de prioridad 1 y 2 sin fuente de PSOE (37) y PP (34), más las dos discutidas del PSOE (E06 y H01). Investigadas por dos subagentes y revisadas una a una. La prioridad 3 queda para R1/R2.
- **Resultado:** 49 fuentes nuevas o mejoradas (31 del PSOE, 20 del PP; dos sustituyen a las anteriores de E06 y H01). Total de la web: 82 → 131. Los 33 enlaces únicos responden con 200.
  - **PSOE:** 42 de 107 posturas con fuente; 29 estimadas.
  - **PP:** 34 de 107 posturas con fuente; 43 estimadas.
  - Se descartaron por indirectas o antiguas: PSOE C03, E02, I05, I07 y J02; PP A05, C04, G04, H02, H09 y J02.
- **Postura cambiada en la revisión (evidencia literal, nota en `NOTES`):** PSOE J08 (estándares sanitarios comunes), 4 estimada → 5 documentada: su programa de 2023 promete tiempos máximos de espera por ley en todo el SNS.
- **Posturas discutidas del PSOE (pendientes desde T9):** quedan respaldadas. H01 trata del 3,5 % de la OTAN, que Sánchez rechazó por carta (19/06/2025). E06: pacto PSOE-Sumar de junio de 2026 para derogar las injurias a la Corona. Los valores extremos en «Europa y mundo» e «Inmigración» descansan ahora en posturas documentadas (H01, F02, F03, H09).
- **Posturas discutibles: decididas el 24 oct.** El titular delegó la decisión con un criterio: lo más coherente y la fuente más fiable. Mandan las fuentes nacionales y oficiales del partido (programa, votaciones en el Congreso, recursos ante el TC) sobre las autonómicas o antiguas. Cada cambio lleva su nota en `NOTES`.
  - **Cambiadas:** PP E08 (ley intrafamiliar) 2 → 1, por su programa («sin pasos atrás» en el Pacto de Estado). PP I05 (elegir el castellano) 5 → 4, porque su programa pide lenguas vehiculares «en equilibrio»; fuente añadida. PP L03 (cambio registral a los 16) 2 → 1, porque recurrió exactamente esos artículos ante el TC. PSOE L09 (burka) 2 → 1, porque votó contra las dos leyes de prohibición de 2026.
  - **Sin cambios:** PP B05 (3), porque la evidencia es autonómica y en el Congreso votó contra la moratoria estatal. PP F02 (2), por el «ni regularizarlos a todos ni echarlos a todos» de Feijóo. PP I02 (2) y PP J08 (2), porque la evidencia es autonómica o no trata la pregunta. PP K05 (1), porque la única fuente es de 2022 y es ambigua. PP G04 (4, estimada), porque el partido está dividido por territorios y su programa nacional no habla de trasvases.
- **Estimadas sin fuente (regla 12; justificación de la estimación en `JUSTIF`):** PSOE D01, E02, F07, J02, J03; PP A05, B05, G04, H09, I02, I07, J02, J08. PSOE D01 y PP I07 pasan a «estimadas» porque no hay ninguna fuente reciente (sin cambiar su valor). **Documentadas sin enlace propio:** PSOE C03, I05, I07; PP C04, D07, F02, H02, K05.
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
