# Auditoría de candidaturas por circunscripción

## Resultado definitivo (3 nov 2026, C1)

Proclamación definitiva de candidaturas al Congreso: **BOE-A-2026-23103** (BOE nº 273, 3 nov 2026, 225 páginas). 52 circunscripciones, **533 candidaturas proclamadas** y 21 no proclamadas (entre ellas PACMA en 7 provincias más que en las provisionales y Juntos por Extremadura en Badajoz y Cáceres).

**Aplicado en la web** (`src/partidos.src.mjs`; «except» admite ahora provincias sueltas):
- Fuera del test, con página de aviso: **UPL**, **Por Ávila** y **Jaén Merece Más** (no figuran en la proclamación).
- **PACMA**: no se presenta en 22 circunscripciones (Ávila, Badajoz, Illes Balears, Barcelona, Burgos, Cáceres, Cantabria, Ciudad Real, A Coruña, Guadalajara, Lugo, Murcia, Ourense, Palencia, Pontevedra, Salamanca, Soria, Toledo, Zamora, Zaragoza, Ceuta y Melilla).
- **SALF**: no se presenta en Bizkaia, Gipuzkoa, Girona, Lleida, Cantabria y Ciudad Real.
- **Podemos**: no se presenta en Illes Balears ni Melilla. **Frente Amplio**: no se presenta en Ceuta ni Melilla.
- **CHA-Frente Amplio**: solo Huesca y Zaragoza. **Existe**: solo Teruel.
- Democracia 21 y Soria ¡Ya! dejan de estar «por confirmar».
- En Navarra, EH Bildu concurre en coalición con ERC (EH BILDU-ERC): se mantiene como EH Bildu.
- Tras los cambios, `boe-comparar.mjs` no encuentra ninguna diferencia entre la web y el BOE.

**Cabezas de lista:** `src/candidaturas.json` (generado con `qa/herramientas/boe-cabezas.mjs`) guarda las 533 candidaturas con su primer nombre tal como figuran en el BOE. Cada página de provincia muestra el cabeza de lista de las candidaturas del test y la lista completa de candidaturas proclamadas, con enlace al BOE.

**Sin hacer (decisión pendiente, ver ESTADO.md):** añadir candidaturas regionales al test (Alhora, NEX, PREPAL, Convergents, Valencia Unida…). El código admite posturas desconocidas, pero cada postura necesita fuente; no se ha añadido ninguna a medias.

Herramientas: `qa/herramientas/boe-candidaturas.py` (reescrito el 3 nov: une los bloques partidos de una provincia, descarta las «No proclamada» y saca el cabeza de lista), `boe-comparar.mjs` y `boe-cabezas.mjs`.

---

## Auditoría previa con las listas provisionales (28 oct 2026)

Comparación de lo que muestra la web (`data/partidos.json`, 27 candidaturas) con las listas **provisionales** del Congreso publicadas en el BOE del 28 de octubre de 2026 (BOE-A-2026-22607, 52 circunscripciones, 556 candidaturas). **Las listas definitivas se proclaman el 2 de noviembre y salen en el BOE el 3.** Hasta entonces, los partidos pueden corregir defectos, así que no se ha cambiado nada en la web.

Herramientas para repetirlo con las listas definitivas: `qa/herramientas/boe-candidaturas.py` (extrae el PDF del BOE) y `qa/herramientas/boe-comparar.mjs` (compara con la web). Instrucciones en la cabecera de cada archivo.

## 1. Candidaturas que la web muestra y el BOE no recoge

| Candidatura | Dónde la web la muestra de más | Situación |
|---|---|---|
| Unión del Pueblo Leonés (UPL) | León, Zamora, Salamanca | No se presenta. En su lugar concurre el **Partido Regionalista del País Leonés (PREPAL)**, otro partido. |
| Por Ávila (PAV) | Ávila | No se presenta. |
| Jaén Merece Más (JMM) | Jaén | No se presenta. |
| Frente Amplio | Ceuta, Melilla, Teruel | No presenta lista al Congreso (en Teruel va solo al Senado). |
| CHUNTA-Frente Amplio (CHA) | Teruel | Solo concurre en Huesca y Zaragoza. |
| Coalición Existe | Huesca, Zaragoza | Solo concurre en Teruel (con el nombre «Teruel Existe»). |
| Podemos | Illes Balears, Melilla | No presenta lista al Congreso allí. |
| PACMA | Ávila, Badajoz, Burgos, Cáceres, Cantabria, Ciudad Real, Guadalajara, Lugo, Palencia, Pontevedra, Soria, Toledo, Zamora, Ceuta, Melilla (15) | No presenta lista en esas circunscripciones. |
| Se Acabó La Fiesta | Bizkaia, Gipuzkoa, Girona, Lleida, Cantabria, Ciudad Real (6) | No presenta lista en esas circunscripciones. |

Coinciden con el BOE, sin cambios: PSOE (52), PP (51; en Navarra va con UPN), Vox (52), Frente Amplio y Podemos en el resto, ERC y Junts (4 de Cataluña), PNV, EH Bildu, BNG, Compromís, MÉS, Adelante Andalucía, Geroa Bai, UPN-PP, CC-Primero Canarias, UPC, Drago Canarias, Soria ¡Ya! y Democracia para el Siglo 21 (Madrid y Barcelona).

## 2. Candidaturas del BOE que la web no recoge

**De ámbito regional o con presencia relevante** (no están entre las 27):

| Candidatura | Circunscripciones |
|---|---|
| Alhora | Barcelona, Girona, Lleida, Tarragona |
| Convergents | Tarragona |
| Nuevo Extremeñismo – Adelante Extremadura (NEX) | Badajoz, Cáceres |
| Juntos por Extremadura (JUEX) | Badajoz, Cáceres |
| Partido Regionalista del País Leonés (PREPAL) | León, Zamora, Salamanca |
| Proyecto Alantre | León |
| Valencia Unida · Agenda Valenciana · Renacer-Renaixer | Valencia |
| Liberación Canaria | Las Palmas, Santa Cruz de Tenerife |
| Partido Comunista del Pueblo Canario | Las Palmas |
| Izquierda por Almería (IPAL) | Almería |
| Federación de los Independientes de Aragón (FIA) | Huesca, Zaragoza |
| Unión Cartaginense | Murcia |
| Partido Nacionalista de Castilla y León – Unión Reformista Ciudadana | Valladolid |
| Alternativa Malagueña | Málaga |
| Eguzkilore | Navarra |
| Feministas al Congreso | Álava, Bizkaia |

**De ámbito estatal, extraparlamentarias:** Frente Obrero (52 circunscripciones), Partido Comunista de los Trabajadores de España (36), Por un Mundo Más Justo (28), Escaños en Blanco (13), Falange Española de las JONS (12), Partido Autónomos (4), y con una sola lista: Partido Humanista, Iustitia Europa, Tercera Edad en Acción, Justicia y Ley, Partido Unionista Estado de España, Partido Demócrata Social Jubilados Europeos y la candidatura individual de un particular en Málaga. Además, partidos comunistas territoriales: PCTC (Cataluña), PCTG (Galicia) y PCTE/ELAK (Euskadi).

## 3. Datos de prensa que conviene saber

- No se presentan: Aliança Catalana, CUP, PRC (Cantabria), Foro Asturias, Pi (Baleares), Partido Riojano, UPL, Por Ávila.
- El **PAR** va integrado en las listas del PP (no hay lista propia).
- Ciudadanos va dentro de Democracia para el Siglo 21 (Madrid y Barcelona).
- ASG y AHI (La Gomera y El Hierro) concurren solo al Senado.

## 4. Qué hay que decidir

1. **Quitar o ajustar** lo de la sección 1 cuando se proclamen las listas (3 nov). Sin ello, el resultado del test puede mostrar, por ejemplo, a la UPL en León o al Frente Amplio en Melilla, que no se presentan.
2. **Qué hacer con las candidaturas de la sección 2.** Añadirlas al test como las demás exige 107 posturas con fuente cada una, lo que no es realista para partidos sin programa ni votaciones. Opciones: (a) no añadirlas y explicar en cada página de provincia que existen otras candidaturas sin posturas en el test, con un enlace a la lista oficial; (b) añadir solo las regionales con programa publicado (Alhora, NEX, JUEX, PREPAL, Convergents, Valencia Unida), con las posturas que se puedan documentar y el resto «sin postura conocida».
