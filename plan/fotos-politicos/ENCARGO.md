# Fotos de los políticos · encargo de Claude a Codex (ChatGPT)

26 de noviembre de 2026 · lo pide el titular: que cada político de la web tenga su foto.

## Situación

«Quién es quién» de Mirada Política recoge 60 destacados y las 533 cabezas de lista al Congreso del 29N (BOE-A-2026-23103). Los destacados son el Gobierno completo, los 19 presidentes autonómicos y los líderes y candidatos.

- **Ya tienen foto:** los 60 destacados y 107 cabezas de lista. Todas vienen de Wikimedia Commons con licencia libre, y he comprobado el autor y la licencia de cada una.
- **Faltan:** 426 cabezas de lista. Están en `faltan-fotos.csv`, ordenadas por partido: primero los que tienen grupo en el Congreso y después el resto.
- **Mejorar (`mejorar-fotos.csv`):** 4 cabezas de lista tienen una foto válida pero floja (de grupo, con mascarilla o muy lejana). Si encuentras un retrato mejor, sustitúyela.

## Por qué te toca a ti

Desde la nube de Claude no se puede abrir congreso.es, senado.es, los parlamentos autonómicos ni muchas webs de partidos. El proxy devuelve 403. Wikimedia, además, limita las descargas.

Tú sí llegas a esas webs. Así que el reparto es este:

- **Codex:** busca, verifica y descarga.
- **Claude:** recorta, comprueba otra vez y lo integra en la web.

## Dónde buscar, por este orden

1. **Wikimedia Commons** (CC BY, CC BY-SA, CC0 o dominio público). Ya miré los enlaces de Wikidata y una búsqueda por nombre, pero puede haber fotos con otro nombre de archivo.
2. **Fuentes institucionales** con aviso legal que permita reutilizar citando la fuente (Ley 37/2007). Por ejemplo:
   - la ficha de diputado o senador del Congreso o del Senado;
   - parlamentos autonómicos, gobiernos autonómicos y La Moncloa;
   - ayuntamientos y diputaciones;
   - el Parlamento Europeo.
3. **La web oficial del partido**, solo si dice expresamente que las fotos son para uso de los medios o tienen licencia libre.

## Qué no vale

- Fotos de redes sociales, agencias, periódicos, bancos de imágenes o buscadores.
- Imágenes generadas o retocadas con IA.
- Fotos de grupo sin un recorte limpio, con logos encima o anteriores a 2019, si hay otra mejor.

Si dudas de que sea la persona (el nombre del BOE lleva dos apellidos; comprueba el partido y la provincia), no la pongas. Preferimos las iniciales a una foto equivocada.

## Cómo entregarlo

En una rama `codex/fotos-politicos`, a partir de esta, haz lo siguiente:

1. Guarda cada foto en `plan/fotos-politicos/entrega/<n>.jpg`, donde `<n>` es el número de la columna `n` del CSV. Vale la imagen original o un recorte de al menos 300 × 300 px. Yo la reencuadro centrando la cara.
2. Rellena en `faltan-fotos.csv` las columnas `url_foto`, `autor`, `licencia`, `url_fuente` y `notas`. En `notas` va el aviso legal o «sin foto reutilizable».
3. Haz commit y push de la rama, y deja una línea en `plan/HALLAZGOS.md`: «fotos-politicos: N entregadas, M sin foto reutilizable».

Claude revisará esa rama, comprobará cada foto y licencia y las subirá a la prueba de Mirada Política. A la web real irán cuando el titular dé el visto bueno al rediseño.
