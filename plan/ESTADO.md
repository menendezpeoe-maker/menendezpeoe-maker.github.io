# Estado del plan (lo más reciente arriba)

## Ficha de continuidad (actualizada el 1 nov 2026, R2)

**Estado de los bloques**
- Completadas y verificadas en la web real: T1–T12c (19–28 oct), R0 (29 oct), R1 (31 oct), mejoras de accesibilidad y uso (31 oct, ver regla 5 de `PLAN.md`), R2 y bloques B (flujo), A (transparencia), C (radar) y E (accesibilidad) (1 nov).
- Pendientes, con tarea programada (calendario de campaña del titular, 28 oct; ver `PLAN.md`): C1 (3 nov, 16:47, candidaturas definitivas, cabezas de lista, programas y fuentes), S1 (6 nov), S1b (10 nov), S1c (13 nov), S1d (17 nov), S2 (21 nov), P1 (30 nov).
- Donación por Bizum: bloqueada por dependencia externa (aprobación de Stripe).

**Orden de trabajo para la próxima tanda**
1. **Debates (`src/debates.src.mjs`):** a 1 nov, tres propuestas sin confirmar (Mediaset 16 nov, RTVE 23 nov, Atresmedia sin fecha). En cada tanda de campaña: actualizar estado, hora y cadena con fuente; tras cada debate, solo el enlace al vídeo oficial. No indicar qué partido acepta cada uno (neutralidad).
2. **C1 (3 nov):** BOE con la proclamación definitiva → `qa/herramientas/boe-candidaturas.py` y `boe-comparar.mjs`; cabezas de lista en las páginas de provincia; quitar las candidaturas que no se presentan (UPL, Por Ávila, JMM, FA en Teruel/Ceuta/Melilla, Existe fuera de Teruel, CHA en Teruel, Podemos en Baleares y Melilla, PACMA en 15 y SALF en 6 circunscripciones, según `plan/AUDITORIA-CANDIDATURAS.md`); añadir solo regionales con posturas documentables (decisión del titular, 28 oct: nada sin fuente; si el código no admite huecos, no se añaden a medias y la página de provincia enlaza al BOE). Actualizar `sinLista` de `src/programas.src.mjs`.
3. **Programas del 29N:** a 1 nov, ninguno publicado. Cuando salga uno: `src/programas.src.mjs` (`publicados`, `comprobado`) y revisión de sus 107 posturas con el PDF como fuente `programa`.
4. **Podemos:** 19 posturas documentadas siguen sin enlace (podemos.info da 403 y web.archive.org está bloqueado desde aquí): C03, C06, D01, D05, D06, F06, F08, F09, G03, G04, H09, I05, I06, I07, I09, K07, K08, L09 y F04. Se cierran con su programa del 29N.
5. **Pendiente de decisión del titular:** correo público de contacto; preguntas para un asesor en `plan/LEGAL.md`. Kit de difusión listo en `plan/DIFUSION-CAMPANA.md` (lo completa S1b).

**Archivos clave y decisiones técnicas**
- Mapa del código y grupos de pruebas: `CLAUDE.md`. Pruebas con `node qa/run.mjs <grupo|todas>` (21 baterías).
- Contador (GoatCounter, `count()` en `assets/papeleta.js`): pasos inicio, test-empezado, test-terminado, compartir, reto, donar-*, util-si/util-no. Nunca respuestas, provincia ni resultado (`qa/stats.mjs`).
- Tipografías recortadas con `qa/fonts.py` (necesita fonttools y brotli).
- Tras cambiar posturas: `node qa/run.mjs posturas` (regenera /correcciones/ y /metodologia/).
- Sitemap con fecha real por página: `src/lastmod.json`, que actualiza `publish.mjs` (hacer commit tras publicar). Programas: `src/programas.src.mjs`.
- Diseño aprobado por el titular (no revertir sin preguntar): ver regla 5 de `PLAN.md`.

**Pruebas (31 oct)**
- Local y web real (https://test29n.es): 21/21 baterías OK. IndexNow 200 (230 URL).

**Errores pendientes (menores)**
- La portada tarda unos 8 s en ser usable con 3G lenta (`papeleta.js` y `data/preguntas.json` se cargan enteros antes de activar «Empezar»). Mejora posible, no urgente.

Entradas anteriores a R0: `plan/ESTADO-HISTORICO.md`.

## 1 nov 2026 · Bloque E · Accesibilidad (5a, petición del titular)
- **Barrido completo** con axe-core (WCAG 2.2 AA y buenas prácticas) en inicio, pregunta con contexto abierto, resultado completo con todo desplegado y comparando, «Cómo funciona», posturas y 22 páginas estáticas, en claro 1280, oscuro 390 y 320 px; y recorrido con Tab (unas 1.400 paradas) comprobando foco visible.
- **Corregido:** orden de títulos en «¿Cómo se calcula?» (h3 → h2, mismo aspecto) y en «Posturas de los partidos» (título oculto para lector); la pregunta de ejemplo de la portada era una región «complementaria» dentro de la principal (ahora `section`); contraste de los hitos pasados del calendario (2,35:1 → sin opacidad); las llamadas «Hacer el test» de las páginas de partido tienen nombre propio; enlace subrayado en el mini test insertable; colores del sistema para el radar en modo de alto contraste.
- **Sin cambios necesarios:** foco visible en todo, movimiento reducido (regla global), textos alternativos y nombres de botones.
- **Prueba permanente:** `qa/audit.mjs` ahora falla con cualquier infracción (antes solo con las graves), revisa también el resultado completo abierto y, con `BASE` en dist o la web real, 5 páginas estáticas.
- **Verificación:** 21/21 en local y en la versión publicable.

## 1 nov 2026 · Bloque C · Radar de las siete dimensiones (petición del titular)
- **Radar SVG nativo** (sin librerías) encima de las barras de «Tu perfil» (`radarSVG` en `assets/papeleta.js`, estilos `.radar`/`.rd-*` en `assets/papeleta.css`). Misma escala que las barras: centro = primer polo (−100), borde = segundo polo (+100), círculo discontinuo = equilibrio. Con «Comparar con», añade el polígono discontinuo de esa candidatura. Descripción completa con los valores para lector de pantalla; las barras siguen debajo como alternativa en texto.
- **Puerta superada:** `qa/e2e.mjs` (sección 7) responde 3 tests distintos (mixto, de acuerdo, en desacuerdo) y comprueba que cada punto coincide con su barra, que su radio es el del valor y que todo lo que dice el texto del resultado («Te inclinas por…») está en el lado correcto del radar, y al revés.
- **Arreglado de paso:** a 320 px, «Comparar con» ensanchaba «Tu perfil» 14 px (misma causa que en el repaso; ahora la regla vale para todas las secciones del resultado, `assets/mejora.css`).
- **Verificación:** 21/21 en local y en la versión publicable.

## 1 nov 2026 · Bloque A · Transparencia del cálculo (petición del titular)
- **Panel «¿Cómo se calcula tu resultado?»** en el resultado, cerrado por defecto, justo después del resumen (`#r-how`, `renderHow` y `renderHowParty` en `assets/papeleta.js`; estilos `.how` en `assets/papeleta.css`; enlace «Cómo se calcula» en el menú de candidaturas). Solo lee el cálculo existente (`MODEL`, `weightOf` y las constantes): no cambia ningún resultado.
- Muestra: las reglas y pesos reales (importante ×2, prioridad ×1,5, estimada ×0,6, neutral ×0,5, cobertura mínima 50 %); el peso de cada dimensión en **tu** resultado; y, para la candidatura elegida, cada pregunta con tu respuesta, la suya, «Documentada» o «Estimada» y su fuente enlazada (o «Deducida de su línea general» / «Sin enlace todavía»).
- **Puerta superada:** `qa/e2e.mjs` (sección 6) comprueba a 320, 390 (oscuro) y 1280 px que cada enlace es exactamente la fuente del banco, que la marca de estimada coincide, que la coincidencia es la del selector y que los pesos suman ~100 %.
- **Arreglado de paso:** a 320 px «Repasa tus respuestas» desbordaba 10 px en horizontal (el texto largo de las opciones ensanchaba la rejilla; `assets/mejora.css`).
- **Verificación:** 21/21 en local y en la versión publicable.

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
