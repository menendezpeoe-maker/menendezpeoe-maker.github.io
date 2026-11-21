# Rediseño para el 30N (Mirada Política)

Rama: `claude/project-thread-rbz0gu` (sale de `fuente` del 21 nov, c265943). **No se publica antes del 30 nov.**
Decisiones del titular (21 nov): aplicar las mejoras de la auditoría (project-files test29n/auditoria/auditoria-21nov.md); tras el 29N la web es sobre todo de información de política española y el test es una sección destacada; la marca pasa a «Mirada Política».

## Hecho en la rama (pruebas `test` y `paginas` en verde)
- Cabecera: Partidos · Programas · Temas · Comparar · Mi provincia · Cómo funciona + «Hacer el test» + «Menú» agrupado (Información política / Elecciones / Test político), con `<details>` (sin JavaScript); en el móvil (≤ 900 px) solo «Test» y el menú. `qa/menu.mjs` actualizado.
- Marca: constante `MARCA` en `sitio.mjs` (títulos, migas, og:site_name, datos estructurados, manifest, 404). En la cabecera, «Mirada [Política]».
- Portada: «Explora la política española» (tira con las 30 candidaturas y 8 accesos con icono) antes de elegir versión del test.
- /comparar/: comparador libre (formulario GET a `/?cmp_a=&cmp_b=`, abre «Compara dos candidaturas»); CSP `form-action 'self'`. Prueba en `qa/comparar.mjs`.
- Resultado: radar tú frente a la primera candidatura en «Tu perfil en siete dimensiones» (abierto en escritorio).
- Fichas de partido: índice de la página (Propuestas · Siete dimensiones · Posturas por tema · ¿Cuánto coincides?) y propuestas a partir de la 7.ª plegadas; sin el recuadro del test de arriba (el test ya está en la cabecera).
- Sin desborde lateral a 320 px en fichas de partido y comparativas (pista de rejilla `minmax(0, 1fr)`).

## Cómo publicarlo el 30N
1. Después de P1 y antes o junto al cambio de dominio (plan/CAMBIO-DOMINIO.md): `git fetch origin fuente claude/project-thread-rbz0gu`, fusionar la rama en `fuente` (resolver conflictos en `pages.mjs`, `papeleta.js`, `papeleta.css`, `publish.mjs` si los hay).
2. `node build.mjs && node publish.mjs`, `node qa/run.mjs todas`, capturas 390/1280 claro y oscuro (regla 9), publicar en `main`.

## Pendiente (siguiente paso)
- El 30N, con P1: textos de la portada y títulos con «29N» (héroe «Test político del 29N», FAQ, descripciones) y, a la vez, las imágenes con la marca (`qa/redes.mjs`: `top()` dice «Test 29N»; `qa/badge.mjs`; `qa/brand/banner.html`; og.png), porque sus textos también hablan del 29N.
- Resultado en pestañas: NO hecho. Cambia la estructura del resultado aprobada por el titular el 14 nov (tarjetas «Explora tu resultado»); regla 5: no revertir sin pedírselo. Proponérselo con maqueta antes.
