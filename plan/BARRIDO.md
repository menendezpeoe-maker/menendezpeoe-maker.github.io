# Barrido de coherencia con los programas del 29N

Pedido por el titular el 13 nov 2026: cuando entra un programa nuevo, se publica cuanto antes y se revisa toda la web, cualquier apartado, para añadir, cambiar o quitar lo que la nueva información deje viejo. Mismas reglas para todas las candidaturas (regla 8: pasaje, página `#page=N` y alcance; lo dudoso no se aplica y se anota). Nada de encuestas ni recomendación de voto.

## Cuándo
- **Barrido ligero, el mismo día en que entra un programa** (rutina diaria 14–23 nov, 09:47 Madrid): solo la candidatura nueva.
- **Barrido completo n.º 1:** 13 nov (hecho, ver ESTADO.md).
- **Barrido completo n.º 2:** el 20 nov en la rutina diaria (antes de S2 el 21 y de la revisión final de Codex el 22). Se adelanta al primer día en que hayan publicado programa las candidaturas que suman la mayoría de los escaños de 2023 (PP + PSOE ya bastan). Se hace una sola vez.
- Del 24 al 28 nov no se publica nada. P1 (30 nov) lo retoma si queda algo.

## Hallazgos de Codex
Antes de buscar, procesa los «pendiente» de `plan/HALLAZGOS.md` (canal único de Codex): comprueba con la fuente, aplica, publica y márcalos como aplicados o descartados con motivo.

## Herramienta
`node qa/barrido.mjs` (o `node qa/barrido.mjs <pid>` para el detalle de una candidatura, con los ids de pregunta).
1. Textos fijos que contradicen los datos (falla con código 1): «la mayoría no ha publicado», «N candidaturas» viejo, etc. Se corrigen haciendo que salgan de los datos.
2. Por candidatura con programa del 29N: posturas que siguen con otro programa, estimadas o con justificación que cita 2023. Es la cola de revisión de posturas (orden de ESTADO.md).
3. Secciones que se revisan a mano (abajo).

## Barrido ligero (una candidatura nueva)
1. `src/programas.src.mjs`: `publicados` (url oficial, título, fecha) y `comprobado`. Esto actualiza solo /programas/, la portada («N de 30»), /prensa/, /metodologia/ y /datos/.
2. `src/partidos.src.mjs`: `desc`, `tag` y `props` de esa candidatura; si citan el programa de 2023 y el del 29N dice algo distinto o más concreto, se actualizan con el del 29N.
3. Posturas: `node qa/barrido.mjs <pid>`; revisar con el programa nuevo, primero las estimadas y las que citan 2023 (regla 8). Lo que no dé tiempo queda en la cola de ESTADO.md.
4. Resúmenes de tema («En un minuto» en /temas/…): salen de los datos; comprobar que se leen bien.
5. Pruebas (`node qa/run.mjs todas`), publicar (regla 5), comprobar en la web real e IndexNow.

## Barrido completo (todas las secciones)
Además de lo anterior para cada candidatura con programa:
- Portada, /programas/, /partidos/ y cada ficha, /comparar/ (pares de las que cambian), /temas/ y /tests/, /preguntas/, /prensa/, /metodologia/, /datos/, /calendario/, /debates/, /votar/: textos que hablen del estado de los programas, de fechas («aún», «todavía», «próximamente») o de cifras escritas a mano.
- `grep -rniE "aún no|todavía|próximamente|2023" pages.mjs papeleta-29n.html src/*.mjs` y revisar cada caso que dependa de los programas.
- Anotar en ESTADO.md qué se cambió, qué se quitó y qué queda en cola.
