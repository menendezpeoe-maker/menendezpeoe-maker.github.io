# Debates y entrevistas del 29N (/debates/)

Pedido por el titular el 14 nov 2026: /debates/ se actualiza cada día desde la nube con debates y entrevistas del 29N, incluidos los ya emitidos con grabación y contexto breve. Codex aporta fuentes y verifica la web por su cuenta (sus hallazgos llegan a `plan/HALLAZGOS.md`); la revisión diaria es autónoma y no depende de mensajes ni de Codex.

## Datos
`src/debates.src.mjs` (cabecera con todos los campos). Reglas:
- **Solo lo acreditado:** fecha, hora y medio según la cadena o el organizador (o un medio que lo atribuya). La hora solo si la cadena la anuncia, en hora peninsular; nunca se extrapola de otra cita del mismo ciclo.
- **Estado:** «confirmado» (fecha y medio anunciados), «propuesta» (sin cerrar o anunciado sin confirmar su emisión) y «emitido» (solo con grabación publicada o confirmación de la cadena). Un anuncio antiguo no se fusiona con otro debate sin que la cadena lo diga (ej.: el «laSexta Debate» del 2 nov se trasladó al 13; el del 9 nov es otro y sigue como propuesta).
- **Grabación:** `completa` solo si la fuente dice íntegro/completo o la duración cuadra con el debate; `programa` para un programa emitido (p. ej. La Revuelta) sin afirmar que la entrevista no esté editada; `fragmento` para cortes. Comprobar que el enlace reproduce y es del canal oficial (YouTube: `https://www.youtube.com/oembed?url=…&format=json` da título y canal). Si el vídeo falla, la publicación del pódcast oficial.
- **Fecha de un emitido:** la de emisión según la cadena; si la ficha y otro artículo no coinciden, mirar los metadatos de la grabación (fecha de emisión, duración); si sigue la duda, no se fecha y se anota abajo.
- **Contexto:** 1–2 frases neutras de qué se habló, según la fuente (sin quién ganó, sin adjetivos). Las entrevistas no cambian posturas del test.
- **Duplicados:** antes de añadir, buscar en el archivo por fecha, medio, participantes y URL (`node qa/debates.mjs` los detecta).
- **Mismo criterio para todas las candidaturas:** debates de cadenas estatales, autonómicas y locales, y entrevistas a cabezas de lista o portavoces en medios de amplia audiencia. Ciclos de entrevistas: incluir a todos los invitados acreditados, no solo a unos.
- `revisado` y `verificado` de cada ficha tocada = día de la comprobación.

## Revisión diaria (tarea programada en la nube, 09:47 Madrid)
1. Pendientes de `plan/HALLAZGOS.md` y de la cola de abajo.
2. Fichas con fecha pasada y estado distinto de «emitido» (`node qa/debates.mjs` las avisa): buscar la grabación en la web de la cadena y, si está, pasar a «emitido» con `grabacion`; si no se celebró, anotarlo en el contexto o quitarla con motivo en ESTADO.md.
3. Próximos: comprobar cambios de fecha, hora, cadena y participantes (Academia de TV, RTVE, Atresmedia, Mediaset, SER, COPE, autonómicas de cada comunidad, cadenas locales).
4. Nuevos: buscar debates y entrevistas anunciados o emitidos el día anterior.
5. `node qa/debates.mjs` y la pasada completa; publicar por la regla 5.

## Calendario y congelación
- 14–23 nov: se publica el mismo día.
- **24–27 nov: excepción mínima a la congelación** (autorizada por el titular el 14 nov): se publican solo fichas verificadas de /debates/ y sus metadatos (`revisado`, `verificado`, `src/lastmod.json`, ESTADO.md y este archivo). Nada de test, programas, posturas, navegación, metodología ni otras páginas. Antes de publicar, en el worktree de main con dist/ copiado: `git status --short` solo puede mostrar `debates/index.html` (y, si acaso, `sitemap.xml`); si cambia otra cosa, no se publica y se anota en la cola. Pruebas: `node qa/debates.mjs`, `node qa/growth.mjs` y `node qa/barrido.mjs`, y después `BASE=https://test29n.es/ node qa/debates.mjs`.
- **28 y 29 nov: no se publica nada.** El 28 es jornada de reflexión (LOREG art. 53: no hay campaña ese día; el plan dice «ninguna promoción el 28») y el 29 es el día de votación. La revisión verifica y anota en la cola de abajo (commit en `fuente` que toca solo este archivo; `dist/` no cambia).
- **30 nov:** la revisión aplica la cola y publica. Último día de la tarea.

## Cola (comprobado, pendiente de aplicar)
- Encuentros SER Andalucía «¿Qué se juega Andalucía el 29N?»: Antonio Maíllo (Frente Amplio / Por Andalucía), 28 oct, y María Jesús Montero (PSOE-A): su ficha del 3 nov dice jueves 5 nov a las 10:00 y el artículo del 13 nov dice «el pasado 3 de noviembre». Sin grabación localizada aún: no se fechan ni se añaden hasta encontrar la grabación en Radio Sevilla (web o YouTube) con su fecha. El del PP (fecha sin anunciar) también falta.
