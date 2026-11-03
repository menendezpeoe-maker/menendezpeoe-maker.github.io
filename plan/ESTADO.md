# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 3 nov 2026, C1)

**Estado de los bloques**
- Completadas y verificadas en la web real: T1–T12c (19–28 oct), R0 (29 oct), R1 (31 oct), mejoras de accesibilidad y uso (31 oct, ver regla 5 de `PLAN.md`), R2 y bloques B, A, C y E (1 nov), mejoras 1–6 del titular (2 nov) y C1 (3 nov, candidaturas definitivas y cabezas de lista).
- Pendientes de las mejoras del titular (esperan fecha o datos): tarjeta compartible y vista previa en X/WhatsApp (S1b), aviso de fecha en portada (S1c), enlaces rotos (S1d), verificación de neutralidad (S2).
- Pendientes, con tarea programada (calendario de campaña del titular, 28 oct; ver `PLAN.md`): S1 (6 nov), S1b (10 nov), S1c (13 nov), S1d (17 nov), S2 (21 nov), P1 (30 nov).
- Donación por Bizum: bloqueada por dependencia externa (aprobación de Stripe).

**Orden de trabajo para la próxima tanda**
1. **Debates (`src/debates.src.mjs`):** a 1 nov, tres propuestas sin confirmar (Mediaset 16 nov, RTVE 23 nov, Atresmedia sin fecha). En cada tanda de campaña: actualizar estado, hora y cadena con fuente; tras cada debate, solo el enlace al vídeo oficial. No indicar qué partido acepta cada uno (neutralidad).
2. **Partidos regionales (decisión del titular pendiente):** el BOE recoge candidaturas regionales que no están en el test (Alhora, NEX, PREPAL, Convergents, Valencia Unida, Liberación Canaria, FIA…; lista en `plan/AUDITORIA-CANDIDATURAS.md`). El código admite posturas desconocidas («0»), pero cada postura necesita fuente: no añadir ninguno a medias. Ya aparecen, con su cabeza de lista, en la lista del BOE de cada página de provincia.
3. **Programas del 29N:** a 3 nov, ninguno publicado. Cuando salga uno: `src/programas.src.mjs` (`publicados`, `comprobado`) y revisión de sus 107 posturas con el PDF como fuente `programa`.
4. **Podemos:** 19 posturas documentadas siguen sin enlace (podemos.info da 403 y web.archive.org está bloqueado desde aquí): C03, C06, D01, D05, D06, F06, F08, F09, G03, G04, H09, I05, I06, I07, I09, K07, K08, L09 y F04. Se cierran con su programa del 29N.
5. **Pendiente de decisión del titular:** correo público de contacto; preguntas para un asesor en `plan/LEGAL.md`. Kit de difusión listo en `plan/DIFUSION-CAMPANA.md` (lo completa S1b).

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
