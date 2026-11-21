# Revisión de Mirada Política (versión del 30N) · 21 nov 2026

## Hecho en esta ronda
- Volver atrás en todo: botón ← arriba (móvil y PC), también entre pestañas, y el «atrás» del navegador o del móvil.
- En el móvil, la barra de arriba muestra el nombre de la página en la que estás.
- Recuerda tu provincia la próxima vez que entras.
- Diseño más amable: más aire, tarjetas suaves, títulos de sección con marca amarilla y botones más grandes en el móvil.
- Inicio más corto: «Temas que dividen» pliega la lista de partidos en el móvil y el archivo de campaña queda en una línea de enlaces.
- Pie de página con todas las secciones. Nombres de menú más cortos: Debates, Programas, El Estado, Autonomías.

## Qué quitaría
- La «Pregunta destacada» y los contadores grandes como protagonistas de Inicio: ya no tocan tras el 29N (hecho).
- La página «Cómo votar» como sección principal: pasa a Aprende (hecho).
- Debates y programas como secciones vivas: pasan a ser archivo (hecho).

## Qué añadiría para ser la web de referencia (por orden de impacto)
1. **Seguimiento de promesas del Gobierno**: cada compromiso del programa del partido que gobierne, con su estado (cumplida, en marcha, pendiente o incumplida) y la fuente (BOE o Congreso). Es la sección que más visitas recurrentes genera en webs como esta.
2. **Así votan en el Congreso**: qué votó cada grupo en las leyes importantes, con datos abiertos del Congreso, y su relación con lo que prometió.
3. **Una página para cada político**, también para las cabezas de lista: trayectoria, cargo y posturas. Atrae búsquedas en Google por nombre.
4. **Explicadores de 1 minuto**: qué es una moción de censura, cómo funciona la investidura, qué es D'Hondt. Muy buscados y fáciles de compartir.
5. **Resumen semanal por correo**: «la semana en el Congreso», neutral y con fuentes.
6. **Botón de compartir** en fichas, temas y resultados, con imagen automática para redes.
7. **Modo oscuro y tamaño de letra**, con contraste AA en todo.
8. **Datos abiertos** de resultados y posturas para descargar, y un buscador de leyes del BOE.
No añadiría encuestas ni noticias de opinión: rompen la neutralidad y la regla de «información, no opinión».

---

# Revisión 2 (diseño, gráfico y técnico) · 22 nov 2026

## Contraste con la revisión 1
| Propuesta de la revisión 1 | Revisión 2 | Estado en la prueba |
|---|---|---|
| 1. Seguimiento de promesas | Se mantiene como n.º 1, pero solo con prueba oficial (BOE, Congreso, Consejo de Ministros) y sin datos inventados hasta que haya Gobierno | **Hecho**: sección «Legislatura» con método, estados y aviso de activación |
| 2. Así votan en el Congreso | Se mantiene, con los datos abiertos del Congreso y el enlace a la página del programa cuando el voto lo contradiga | **Hecho** (estructura y fuente); se llena con la primera votación |
| 3. Página para cada político, también cabezas de lista | **Cambia**: 533 páginas con solo nombre y provincia serían contenido pobre para Google. Mejor: página para los 18 rostros actuales y para los 350 diputados electos el 30N | Pendiente de los resultados oficiales |
| 4. Explicadores de 1 minuto | Se mantiene y sube de prioridad: es lo que más se busca y comparte | **Hecho**: 8 explicadores con pasos, dato clave y artículo de la ley |
| 5. Boletín semanal | Se mantiene | **Hecho** (formulario de prueba; se conecta al publicar) |
| 6. Compartir | Se mantiene; se añade a todas las páginas, no solo a fichas | **Hecho**: botón en la barra superior, enlace con la URL definitiva |
| 7. Modo oscuro y letra grande | Se mantiene | **Hecho**: Claro, Oscuro o Automático, y letra Grande; se recuerda |
| 8. Datos abiertos y buscador del BOE | Se mantiene para después del 30N | Pendiente |

## Diseño visual y gráfico (aplicado)
- Texto base un poco más grande (14,5 px) y gris secundario más oscuro, para cumplir el contraste AA.
- Las tarjetas de temas ya no cortan el título: hasta dos líneas.
- Tarjetas con sombra suave y elevación al pasar el ratón; respeta «reducir movimiento».
- Nuevo bloque «Explicado en 1 minuto» en Inicio, en lugar de la fila de instituciones, que se repetía con el menú.
- Mapa político y todos los gráficos adaptados al modo oscuro.
- En el móvil, los ajustes de lectura están en el menú de secciones, para no llenar la barra de arriba.

## Técnico (para la web real del 30N)
- Una página HTML estática por URL (partido, político, tema, provincia, explicador), con título y descripción propios. La prueba es una sola página; la web real no debe serlo, por SEO.
- Datos estructurados: `Person` (políticos), `PoliticalParty`, `FAQPage` (explicadores), `Dataset` (datos abiertos).
- Imagen para redes (Open Graph) generada para cada página, con el color del partido o del tema.
- Fotos en WebP y tamaño fijo; hoy van en base64 y pesan 1,1 MB juntas.
- Accesibilidad: foco visible, botones de 44 px en el móvil y textos alternativos ya están. Falta revisar el orden de lectura de la matriz con lector de pantalla.

## Qué no haría
- Encuestas, noticias de opinión, comentarios de usuarios o rankings «mejor/peor partido»: rompen la neutralidad.
- Páginas para los 533 cabezas de lista con solo nombre y provincia.
