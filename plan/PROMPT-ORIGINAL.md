CONVIERTE TEST 29N EN LA MEJOR WEB DE ESPAÑA SOBRE LAS ELECCIONES GENERALES DEL 29N (SIN PRESUPUESTO)

## 1. Tu papel y el objetivo

Actúa como responsable de producto, desarrollo, datos, metodología, SEO y comunicación de Test 29N (https://test29n.es), un test político gratuito e independiente para las elecciones generales del 29 de noviembre de 2026.

El objetivo es que deje de ser «un test muy completo» y se convierta en la web de referencia en España para entender y decidir el voto del 29N:
- La más fácil de usar.
- Con los datos más fiables y verificables.
- Con todo lo que la gente busca esas semanas.

Debe superar en utilidad, claridad y credibilidad a los tests rivales: conquienvoy29n.es, voto29n.es, aquienvotar29n.com y afinidadpolitica.es.

No hay presupuesto, o casi ninguno. Usa solo lo que ya existe y herramientas gratuitas. No contrates servicios, no añadas infraestructura de pago y no metas dependencias externas sin una razón técnica clara.

Trabaja de forma autónoma: implementa, prueba, publica y verifica. Pregúntame solo cuando necesites algo que no puedas hacer tú (ver la sección 7).

## 2. Estado actual del proyecto (no lo rehagas: mejóralo)

**Dónde está todo**
- Web publicada en GitHub Pages:
  - Repositorio: menendezpeoe-maker/menendezpeoe-maker.github.io.
  - Rama `main`: contiene solo la web generada (dist/).
  - Rama `fuente`: contiene el código fuente completo. Trabaja siempre a partir de ella.
  - Si estás en una sesión nueva, añade el repositorio con permiso de escritura y clona la rama `fuente`.
- Dominio test29n.es con HTTPS.

**Tecnología**
- Web estática en JavaScript puro, sin servidor ni base de datos.
- Todo se calcula en el navegador y las respuestas se guardan solo en localStorage (`papeleta29n.v2`).
- CSP estricta: sin scripts de terceros, con tipografías propias.

**Archivos clave**
- `src/preguntas.src.mjs`: 107 preguntas en 12 áreas y 7 dimensiones, con posturas de 1 a 5 por partido, estimadas marcadas con `~`, y las exportaciones NOTES, SOURCES (`[url, etiqueta, tipo, fecha]`) y FAMILIES.
- `src/partidos.src.mjs`: 27 partidos, 25 activos, con su ámbito, propuestas y colores.
- `src/politicos.src.mjs`: perfiles de políticos.
- `build.mjs`: valida y genera `data/*.json`.
- `publish.mjs`: genera `dist/`, con CSP, Open Graph, sitemap, contador GoatCounter (`STATS.goatcounter = "test29n"`), clave IndexNow, `stats.js`, botón para medios e imágenes de marca.
- `pages.mjs`: páginas estáticas por partido (/partidos/…), por tema (/temas/…), índices y /prensa/.
- `assets/papeleta.js` (aplicación) y `assets/papeleta.css`.
- `papeleta-29n.html`: cuerpo de la página.
- `indexnow.mjs`: avisa a Bing y otros buscadores después de publicar.
- `qa/brandkit.mjs` y `qa/badge.mjs`: imágenes de marca.

**Pruebas (Playwright)**
- Baterías: `qa/e2e`, `share`, `sections`, `profiles`, `map`, `support`, `audit` (incluye axe), `features`, `explain`, `growth` y `stats`.
- Ejecución: `NODE_PATH=$(npm root -g) node qa/X.mjs`.
- En local: `sh qa/mklocal.sh` y servidores en :8765 (raíz, `_local.html`) y :8766 (`dist/`).
- En la web real: `BASE=https://test29n.es/`.
- `share` solo pasa del todo en el dominio real.
- `support` usa la variable `PRIVATE_TERMS` con datos privados que no deben aparecer. Pídemelos si no los tienes y no los escribas nunca en el repositorio.

**Funcionalidad que ya existe y hay que conservar**
- Tres versiones del test (24, 48 y 107 preguntas), con contexto neutral, importancia y prioridades.
- Resultados:
  - Perfil en 7 dimensiones y «Tu perfil, explicado».
  - Detalle de cada dimensión y de cada tema.
  - Ranking con fichas y desglose del cálculo.
  - Comparador de dos candidaturas.
  - Mapa por análisis de componentes principales, con selector de dimensión.
  - Solidez del resultado.
  - Menor coincidencia y políticos afines.
  - Comparar con un amigo («¿Cuánto coincidís?»).
  - Compartir (tarjeta, X, WhatsApp, Instagram).
  - Donaciones.
- Explorador de posturas, «Cómo funciona», 42 páginas estáticas, página de prensa y kit de difusión (artefacto privado del usuario).

**Tareas programadas activas** (no las dupliques)
- «Seguimiento Test 29N»: cada 3 días revisa la indexación y busca promoción gratuita.
- «Comprobar aprobación de Bizum en Stripe»: activa la donación por Bizum cuando Stripe la apruebe.

## 3. Reglas que no se pueden romper

**Datos**
- No inventes posturas, fuentes, citas, fechas, estadísticas, cifras de visitas ni niveles de precisión.
- Cada fuente nueva debe abrirse de verdad. Guarda una cita literal, comprueba que la URL responde e indica tipo y fecha.
- Una postura sin evidencia se marca como estimada. Una desconocida no se rellena ni se toma como neutral.
- Mismo criterio para todos los partidos.

**Neutralidad**
- Nunca recomiendes voto ni favorezcas a ningún partido, en la web ni en los textos de difusión.
- No publiques encuestas propias ni porcentajes de usuarios por partido. Nada que parezca un sondeo, y nunca del 24 al 28 de noviembre (prohibido por la ley electoral).
- Sin promoción el 28 de noviembre (jornada de reflexión).

**Privacidad**
- Sin registro, sin cookies, sin publicidad y sin enviar respuestas a ningún servidor.
- El contador solo puede registrar pasos (inicio, test empezado o terminado, clics), nunca respuestas, provincia, sexo, edad ni resultado.
- Cualquier cambio en lo que se mide debe reflejarse en el aviso de privacidad.

**Datos personales del titular**
- El nombre real del titular no puede aparecer en ningún sitio público.
- Responsable público: «Dery». Contacto público: menendezpeoe@gmail.com.
- Ningún IBAN ni dato bancario en código, interfaz, repositorio ni registros.
- Ninguna clave secreta en el frontend.

**Donaciones**
- El test es y seguirá siendo gratuito: sin suscripciones, sin criptomonedas y sin anuncios.
- Métodos: solo PayPal, Apple Pay (Stripe) y Bizum (Stripe, cuando se apruebe). No muestres opciones no configuradas.
- No des un pago por hecho sin la confirmación del proveedor.

**Textos fijados por el usuario**
- No cambies la sección «¿Te ha resultado útil el test?» ni sus botones («Donar con PayPal», «Donar con Apple Pay», «Donar mediante tu banco»).
- No cambies el título «Los 3 partidos con los que menos coincides».
- No reintroduzcas «Versión y cambios».

**Acciones externas**
- No publiques en redes sociales ni envíes correos en nombre del usuario.
- No crees cuentas.
- Prepárale los textos y los enlaces exactos.

**Git**
- Sin identificadores de modelo en los commits.
- Termina cada commit con las líneas de atribución que indique la sesión.
- No abras pull requests salvo que te lo pida.

**Técnica**
- No reescribas la aplicación ni cambies de tecnología sin una razón clara.
- Mantén la identidad visual («la papeleta y el fosforito»: papel frío, tinta y amarillo para «lo tuyo»).
- Accesibilidad WCAG 2.1 AA (axe sin infracciones graves).
- Sin scroll horizontal a 390 px.
- Modo claro y oscuro.
- Recalcular tras cambiar una respuesta en menos de 300 ms.

## 4. Forma de trabajar

1. Al empezar, ejecuta todas las baterías de pruebas para tener una línea base.
2. Trabaja por fases, en el orden de la sección 5. Dentro de cada fase, primero lo de más impacto.
3. Para cada cambio:
   - Impleméntalo.
   - Añade o actualiza las pruebas en `qa/`.
   - Ejecuta todas las baterías en local.
   - Publica: `node build.mjs`, `node publish.mjs`, copia `dist/` a `main` y haz push.
   - Espera a que la versión esté en la web y repite las pruebas sobre https://test29n.es.
   - Ejecuta `node indexnow.mjs` si hay páginas nuevas o cambiadas.
   - Actualiza la rama `fuente` con el código fuente.
4. Antes de publicar, comprueba que no hay datos privados ni nada con formato de IBAN.
5. No digas que algo funciona si no lo has comprobado. Si algo falla o se queda a medias, dilo.
6. Usa subagentes para la investigación de fuentes, con reglas estrictas: cita literal de una página abierta, URL verificada y veredicto («apoya», «matiza», «contradice», «sin fuente»). Revisa tú cada resultado antes de usarlo.
7. Al terminar cada fase, envíame un resumen corto para leer en el móvil: qué has hecho, qué has probado y qué necesitas de mí.

## 5. Plan por fases

### Fase 1 · Primera experiencia (imprescindible antes del 13 de noviembre)

1. **Quitar sexo y edad del inicio.** No intervienen en el cálculo. Quítalos de la portada, el resumen y el estado guardado, y respeta los resultados ya guardados. Actualiza el aviso de privacidad.
2. **Un solo mensaje principal y el botón «Empezar» visible sin scroll** a 390 px. Fusiona el banner y el titular sin perder la identidad.
3. **Empezar en un toque.** Pide la provincia al final, antes de mostrar resultados, recordando la última elegida. Comprueba que los resultados y los enlaces compartidos siguen funcionando.
4. **La pregunta de ejemplo de la portada es real:** si la respondes, ya has empezado el test.
5. **Versión rápida de unas 15 preguntas y unos 3 minutos,** equilibrada en dimensiones y en sentido de las afirmaciones, sin quitar las versiones actuales. Comprueba con perfiles simulados que el primer puesto es estable.
6. **Resumen de resultados en una pantalla:**
   - Partido con más coincidencia y porcentaje.
   - 3 coincidencias y 3 choques.
   - Perfil en una frase y solidez.
   - Botones «Compartir» y «Reta a un amigo».
   - El resto de secciones plegadas en «Ver el análisis completo», sin eliminar ninguna.
7. **El mapa pasa a la parte avanzada.** Valora añadir una vista sencilla de dos ejes, solo si sale de los mismos datos y se explica.
8. **Tarjetas para compartir más atractivas,** incluida una por tema, sin exponer respuestas.

Criterios: el test se empieza en un toque; el resumen cabe en la primera pantalla del móvil; todas las pruebas pasan.

### Fase 2 · Credibilidad de los datos (la ventaja decisiva)

1. **Fuente y justificación de una línea para cada postura** de los partidos con escaño: PSOE, PP, Vox, Frente Amplio, Podemos, ERC, Junts, EH Bildu, PNV, BNG, CC y UPN.
   - Prioridad: preguntas núcleo, después las importantes y después el resto.
   - Si una fuente contradice la postura, corrígela con una nota explicativa.
   - Muestra la justificación junto a la postura y en las páginas de partido.
2. **Programas del 29N:** cuando se publiquen, revisa las posturas y marca las que vienen del programa nuevo. Comprueba cada semana si ya están.
3. **Botón «¿Ves un error?» en cada postura:** un enlace de correo con asunto prellenado (pregunta y partido), sin servidor. Añade una página pública de correcciones con fecha.
4. **Página «Sobre el proyecto»:** quién lo hace (seudónimo), por qué, cómo se financia, qué se ha recaudado (pídemelo) y política de independencia y correcciones.
5. **Informe de metodología y sesgos:** pruebas con perfiles simulados y aleatorios, sesgo hacia el centro, posturas estimadas por partido y límites. Con cifras reproducibles generadas por un script del repositorio.
6. **Kits para partidos y expertos** (los envío yo):
   - Una ficha por partido con todas sus posturas y un correo listo para pedirles que las revisen.
   - Un correo para 1 o 2 politólogos o profesores.
   - Publica quién respondió y qué cambió.

### Fase 3 · La web del 29N (más allá del test)

1. **Guía práctica para votar,** solo con fuentes oficiales enlazadas (Junta Electoral Central, BOE, Ministerio del Interior, INE para el voto desde el extranjero, Correos): plazos del voto por correo, voto desde el extranjero, documentación, dónde votar, etc. Verifica cada fecha en el real decreto de convocatoria y en el BOE.
2. **Calendario electoral oficial,** con fuente para cada fecha.
3. **52 páginas por provincia:**
   - Escaños según el real decreto.
   - Candidaturas que se presentan (actualizadas con la proclamación oficial en el BOE).
   - Cabezas de lista cuando sean oficiales.
   - Enlace al test.
4. **Simulador de reparto de escaños (D'Hondt) por provincia,** con votos que introduce el usuario. Nunca con encuestas ni estimaciones propias.
5. **Programas comparados por tema,** con enlace a cada programa oficial, cuando se publiquen.
6. **Glosario electoral.**
7. **Plan para después del 29N:** enlace a los resultados oficiales y opción de comparar tu resultado con lo votado en tu provincia (solo con datos oficiales y después de la jornada electoral).

### Fase 4 · Buscadores y enlaces

1. **107 páginas por pregunta:** «¿Qué piensa cada partido sobre…?», con contexto, posturas, justificaciones y fuentes.
2. **Páginas comparativas de parejas de partidos** relevantes (por ejemplo PSOE–Frente Amplio, PP–Vox, ERC–Junts), generadas con los mismos datos que el comparador.
3. **Datos abiertos:** todas las posturas en CSV y JSON con licencia CC BY 4.0 y una página que lo explique.
4. **Mini test insertable** (5 preguntas) para medios y blogs, sin rastreo, con el código en /prensa/.
5. **Optimización:**
   - Títulos y descripciones únicos.
   - Datos estructurados válidos.
   - Enlazado interno.
   - Sitemap.
   - IndexNow en cada publicación.
6. **Versiones en catalán, gallego, euskera e inglés** (esta última para quien vota desde el extranjero), solo si puedo conseguir una revisión nativa. Mientras no la haya, no las publiques.

### Fase 5 · Difusión (preparada por ti, ejecutada por mí)

1. **Actualiza el kit de difusión** con:
   - Textos y guiones para las novedades (reta a un amigo, tests por tema, guía para votar).
   - Un calendario de publicaciones por días hasta el 29N.
2. **Tests temáticos de 6–8 preguntas** (vivienda, inmigración, impuestos, sanidad…), con resultado propio y paso al test completo. Son la puerta de entrada viral.
3. **Imágenes para redes con la identidad de la marca:** pregunta del día y tarjetas por tema.
4. **Lista de medios, creadores, asociaciones y docentes** con el canal de contacto público de cada uno (sin inventar direcciones), ordenada por prioridad.

### Fase 6 · Medición, técnica y legal

1. **Embudo en GoatCounter:** entra → empieza → termina → comparte → reta a un amigo.
   - Añade una pregunta final opcional «¿Te ha resultado útil? Sí/No», contada sin datos personales.
   - Ajusta el aviso de privacidad.
2. **Modo de lectura fácil** opcional, con lenguaje sencillo, sin cambiar el sentido de las preguntas.
3. **Rendimiento:** mide el peso y los tiempos de carga en móvil lento y no los empeores.
4. **Lista de comprobación legal sobre la normativa de servicios web (LSSI)** y el aviso legal al recibir donaciones, para consultarla con un asesor. No decidas tú lo jurídico.

## 6. Lo que no debes hacer

- Publicidad.
- Pedir datos personales.
- Encuestas propias.
- Recomendaciones de voto.
- Cifras inventadas.
- Posturas sin evidencia presentadas como documentadas.
- Cambiar los textos fijados.
- Eliminar funciones que funcionan.
- Rediseñar desde cero.

## 7. Lo que necesitarás de mí (pídemelo cuando toque, no antes)

- Los términos privados para `PRIVATE_TERMS`.
- Aprobación antes de cambiar posturas de partidos con muchos votos cuando la evidencia sea discutible.
- Contactos y respuestas de partidos y expertos.
- Revisores nativos para las traducciones.
- Cifras reales de donaciones y visitas (tú no tienes acceso).
- Pruebas en mis móviles reales.
- Publicar en redes y enviar correos.
- La consulta legal.

## 8. Entregables y cierre

Al final de cada fase:
- Web publicada y verificada en https://test29n.es.
- Pruebas nuevas o actualizadas.
- Rama `fuente` y copia en claude.ai actualizadas.
- Un resumen breve con:
  - Qué se ha hecho y qué está probado.
  - Qué queda pendiente y por qué.
  - Qué necesito hacer yo, como mucho 3 cosas, con el enlace exacto.

Separa siempre lo implementado y verificado de lo que solo se recomienda.
