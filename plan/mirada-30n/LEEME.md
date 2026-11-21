# Mirada Política · web del 30N (prototipo aprobado por el titular, 21 nov 2026)

Web nueva desde cero para después de las elecciones (sustituye al rediseño anterior de esta rama).
Aprovecha todos los datos de `fuente` y el test; cambian diseño, formato y secciones.

- `app.html`: plantilla (CSS + JS) del prototipo. `gen.mjs`: la rellena con `data/*.json` y `src/*` → `index.html` y `prueba/index.html`.
- `prueba.html`: versión a pantalla completa que ha probado el titular.
- Secciones: Inicio · Partidos · Políticos (18 + 533 cabezas de lista) · Temas (lista/matriz) · Comparar · Resultados 29N · Mi provincia · Debates y Programas (archivo) · Congreso y Senado · Gobierno · Cómo funciona el Estado · Comunidades autónomas · Cómo se vota · Glosario · Datos y método · Test.
- Móvil: barra inferior (Inicio, Partidos, Temas, Comparar, Test) que el titular pidió NO tocar + botón de menú.
- Resultados: `D.res29` vacío → vista previa con 2023 y aviso; el 30N se cargan los oficiales del 29N.
- Pendiente antes de publicar: verificación de ChatGPT (cifras 1977–2023, artículos CE, capitales), pasarlo a páginas estáticas con las URL actuales (SEO), pruebas `qa`, y el visto bueno final del titular («sube el rediseño»).
