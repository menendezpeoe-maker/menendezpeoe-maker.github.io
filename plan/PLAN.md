# Plan automático de Test 29N hasta el 29N

Este plan lo ejecutan, por tandas, conversaciones automáticas programadas. Las tandas van una por noche, del 19 al 29 de octubre, con dos tandas de recuperación (R1 y R2) el 31 de octubre y el 1 de noviembre: el titular dedica a esto su límite de uso esas semanas. Cada tanda empieza sin memoria de las anteriores, así que **todo lo necesario está aquí y en `plan/ESTADO.md`**. El encargo completo del titular, con el contexto y las reglas, está en `plan/PROMPT-ORIGINAL.md`; este archivo lo concreta en tandas.

## Reglas para cada tanda (además de las de PROMPT-ORIGINAL.md, que se aplican siempre)

1. **Lee primero** `plan/MISION.md` (la misión del titular, completa y obligatoria), `plan/PROMPT-ORIGINAL.md` (secciones 2 a 4 y 6), este archivo y `plan/ESTADO.md`.
   - Cada tanda cumple también los puntos de su fecha en `MISION.md`, aunque aquí no estén detallados. Ejemplos: en /votar/, diferenciar lo oficial, lo explicativo y lo que depende de cada convocatoria; en T5–T7, la fecha de consulta y si la postura es compromiso explícito, inferida o sin información suficiente; en el 30 de noviembre, aclarar que el test y el voto miden cosas distintas.
2. **Si la tanda anterior quedó a medias**, termínala antes de empezar la tuya. Si no da tiempo a las dos, prioriza terminar lo pendiente y deja la tuya anotada.
3. **Gasta poco: el titular necesita su límite semanal para otras cosas.**
   - Haz solo lo de tu tanda, con unas 2–3 horas de trabajo como máximo.
   - Nunca más de 2 subagentes a la vez.
   - Nada de rehacer o reanalizar lo que ya funciona.
   - Si algo es demasiado grande, haz la parte de más valor y anota el resto en `ESTADO.md`.
4. **Calidad antes que cantidad.**
   - Cada cambio lleva sus pruebas en `qa/`.
   - Todas las baterías deben pasar en local antes de publicar y en la web real después.
   - `share` solo pasa del todo en el dominio real.
   - No publiques nada roto. Si no puedes dejarlo bien, no lo publiques y explícalo.
5. **Publicación (siempre igual):**
   - **Permiso del titular (19 oct 2026):** publicar en `main` (test29n.es) al final de cada tanda no necesita preguntarle, siempre que se cumplan todas las reglas del plan y pasen todas las pruebas. Si algo falla, no se publica.
   - Ejecuta `node build.mjs` y `node publish.mjs`.
   - Comprueba que `dist/` no contiene datos privados (los términos de `PRIVATE_TERMS`) ni nada con formato de IBAN.
   - Copia `dist/` a la rama `main` (otro worktree) y haz commit y push.
   - Espera a que el nuevo `papeleta.js?v=` aparezca en https://test29n.es.
   - Pasa las baterías con `BASE=https://test29n.es/` y `node indexnow.mjs`.
   - Haz commit y push de los cambios de código en `fuente`, incluido `plan/ESTADO.md`.
6. **Al terminar**, añade al principio de `plan/ESTADO.md` una entrada con:
   - Fecha y tanda.
   - Qué has hecho y qué está verificado.
   - Qué ha quedado pendiente.
   - Qué necesita hacer el titular.

   Tu respuesta final es el aviso que le llega al móvil: 4–6 líneas, en español sencillo, con lo hecho y como mucho 2 cosas para él.
7. **Fechas y datos oficiales:** solo de fuentes oficiales (BOE, Junta Electoral Central, Ministerio del Interior, INE, Correos), comprobadas y enlazadas. Si un dato aún no se ha publicado (listas proclamadas, programas), no lo inventes: deja el hueco preparado y anótalo.
8. **Posturas de partidos:**
   - No cambies ninguna postura de PSOE, PP, Vox, Frente Amplio, Podemos, ERC o Junts sin una fuente que lo justifique claramente.
   - Si la evidencia es discutible, no la cambies: anótala en `ESTADO.md` como «pendiente de decisión del titular».

9. **Revisión con ojos nuevos antes de publicar.** Nadie revisa en directo, así que la revisión la haces tú:
   - **Capturas:** haz capturas a 390 × 844 y a 1280 × 800, en modo claro y oscuro, de cada pantalla o página que hayas cambiado, y míralas tú (abre la imagen). Las pruebas automáticas no bastan: busca textos cortados, solapados, desalineados, con poco contraste o botones sin texto.
   - **Revisor independiente:** lanza un subagente que no sepa cómo lo has hecho. Pásale las capturas y todos los textos visibles nuevos o cambiados. Debe buscar:
     - Erratas y faltas de ortografía: tildes, «¿» y «¡», concordancias, mayúsculas, comillas «».
     - Frases confusas o poco naturales.
     - Datos que no cuadran con `data/*.json`.
     - Cualquier tono no neutral o cualquier cosa que parezca una recomendación de voto.
   - Corrige todo lo que encuentre y vuelve a pasar las pruebas antes de publicar.
   - **Enlaces nuevos:** comprueba que responden con 200, o anota por qué no (por ejemplo, un bloqueo a robots).
   - **Al empezar cada tanda:** revisa en la web real lo que publicó la anterior. Haz capturas a 390 px de la portada, el test, los resultados y una de sus páginas nuevas, y corrige cualquier errata o fallo visual antes de seguir con lo tuyo.
10. **Trabajo por bloques, nunca a medias en público.**
    - Antes de empezar, divide tu tanda en bloques ordenados de más a menos valor.
    - Termina, prueba, revisa (regla 9) y publica bloque a bloque. Lo que se ve en la web siempre está completo.
    - Hacia las 2 horas no empieces bloques nuevos: dedica el resto a revisar y publicar.
    - Lo que no dé tiempo, anótalo en `ESTADO.md` con pasos concretos (archivos, qué falta, qué pruebas añadir), para que otra tanda lo retome sin volver a analizar.
11. **Si una tanda anterior no llegó a ejecutarse** (no tiene entrada en `ESTADO.md`; por ejemplo, porque se agotó el límite de uso):
    - No la hagas entera además de la tuya: no daría tiempo y saldrían las dos a medias.
    - Haz la tuya y anota la que falta como pendiente para R1 y R2.
    - Gasta con cabeza: busca con grep en vez de leer archivos enteros, y usa subagentes solo para investigar fuentes y para la revisión de la regla 9.
12. **Fuentes de posturas (T5–T7, S1 y R1–R2):**
    - **Orden de búsqueda:**
      1. Programa electoral más reciente del partido (el de 2026 si ya está publicado; si no, el de 2023).
      2. Votaciones nominales e iniciativas en el Congreso (congreso.es y sus datos abiertos).
      3. Acuerdos de gobierno o leyes que el partido haya impulsado.
      4. Declaraciones de sus portavoces en medios de referencia, con fecha.
    - **Abre y lee cada fuente.** Comprueba que el texto respalda de verdad esa postura en esa pregunta; el titular de una noticia no basta.
    - **Antes de dejar una postura como «estimada»,** prueba al menos dos búsquedas distintas.
    - **Si sigue sin fuente clara,** déjala «estimada» con una nota de una línea que diga en qué se basa la estimación. Añádela a una lista «estimadas sin fuente» en `ESTADO.md` para que el titular lo sepa.

13. **Una sola fuente de verdad, para que nunca se pierda nada entre sesiones.**
    - **El único código válido es la rama `fuente` de GitHub.** No existen copias locales «buenas». Cada tanda, y cualquier otra conversación que toque la web, incluida la del titular con Claude, empieza con `git fetch` y trabaja sobre `origin/fuente`.
    - **Comprobación de partida, antes de cambiar nada:**
      1. Genera `dist/` desde `origin/fuente` sin modificar, con `node build.mjs` y `SITE_URL=https://test29n.es/ node publish.mjs`.
      2. Compáralo con la rama `main` publicada (`diff -r`, sin `.git`).
      3. Si hay cualquier diferencia, PARA. Significa que la web tiene algo que el código no tiene, y publicar lo borraría. No publiques nada: anótalo en `ESTADO.md` y avisa al titular.
    - **Orden al publicar, siempre:** primero commit y push a `fuente`; después copia `dist/` a `main` y push. Nunca se publica en `main` nada cuyo código no esté ya en `origin/fuente`.
    - **Si un push se rechaza porque `fuente` avanzó:** haz `git pull --rebase`, vuelve a pasar las pruebas y reintenta. Nunca fuerces.
    - **Al terminar:** `git status` limpio, `git log origin/fuente..HEAD` vacío y la web real sirviendo la versión nueva. Si algo de esto falla, la tanda no ha terminado.
    - **Datos privados:** ningún archivo del repositorio puede contener los términos de `PRIVATE_TERMS`, tampoco en pruebas. Se leen siempre de la variable.
14. **Trabaja como un equipo profesional completo.** Antes de dar por bueno un bloque, revísalo con estos ojos (puedes repartirlos con el revisor de la regla 9):
    - **Diseño y experiencia de uso:** el móvil primero, claridad y cero fricción.
    - **Accesibilidad (WCAG 2.2 AA):** contraste, uso con teclado y lectores de pantalla.
    - **Ciencia política y neutralidad:** preguntas equilibradas, sin sesgo, sin recomendar voto.
    - **Periodismo y verificación:** fuentes primarias con fecha; nada inventado.
    - **Corrección lingüística:** ortografía y estilo según la RAE.
    - **Legal y privacidad (LOREG, RGPD, LSSI):** nada parecido a una encuesta del 24 al 28 de noviembre, ninguna promoción el 28 y los datos mínimos.
    - **SEO y rendimiento:** títulos, metadatos, datos estructurados y velocidad en un móvil lento.
    - **Seguridad:** CSP estricta, sin secretos y sin datos privados.

    Si una mejora no supera esta revisión, no se publica: se corrige o se anota en `ESTADO.md`.

15. **Ficha de continuidad.** Al principio de `plan/ESTADO.md`, y antes de las entradas por fecha, mantén una sección «Ficha de continuidad» breve. Actualízala en cada tanda solo si cambia algo, con:
    - El estado de cada bloque del calendario, con uno de estos cinco valores: completada y verificada / implementada, pendiente de verificación / en curso / pendiente / bloqueada por dependencia externa (di cuál).
    - Archivos clave modificados y decisiones técnicas relevantes.
    - Pruebas ejecutadas y su resultado. Nunca pongas como hecha una prueba que no se ha ejecutado.
    - Errores pendientes.
    - Próxima tarea prioritaria y sus dependencias.

## Tandas

| Tanda | Fecha (hora de Madrid) | Contenido |
|---|---|---|
| T1 | lun 19 oct (mediodía) | Fase 1a: entrada |
| T9 | mar 20 oct | Fase 4: buscadores y datos abiertos (adelantada para que Google tenga más tiempo) |
| T2 | mié 21 oct | Fase 1b: test rápido y resultados |
| T3 | jue 22 oct | Fase 3a: guía para votar y calendario |
| T4 | vie 23 oct | Fase 3b: provincias, simulador y glosario |
| T10 | sáb 24 oct | Fase 5: difusión y tests por tema |
| T5 | dom 25 oct | Fase 2: fuentes de PSOE y PP |
| T6 | lun 26 oct | Fase 2: fuentes de Vox y Frente Amplio |
| T7 | mar 27 oct | Fase 2: fuentes de Podemos y ERC |
| T8 | mié 28 oct | Fase 2: justificaciones visibles y confianza |
| T11 | jue 29 oct | Fase 6 y repaso final |
| R1 | sáb 31 oct | Recuperación: termina lo pendiente de `ESTADO.md` por orden de valor (incluidas tandas que no llegaran a ejecutarse) |
| R2 | dom 1 nov | Recuperación y revisión total: lo que siga pendiente; después, revisión de erratas, coherencia y aspecto (regla 9) de todas las páginas de la web, no solo de las nuevas. Si no queda nada que corregir, termina pronto. |
| S1 | mar 10 nov | Seguimiento antes de la campaña: candidaturas proclamadas y programas |
| S2 | sáb 21 nov | Seguimiento de campaña (último antes del 24) |
| P1 | lun 30 nov | Después de las elecciones |

Nota: las páginas estáticas (T9) se generan desde los datos al publicar, así que recogen solas las fuentes y justificaciones que añadan T5–T8. Cada tanda posterior a T9 debe ampliar las pruebas y el sitemap si crea páginas nuevas.

### T1 · Fase 1a: entrada en un toque
- **Quitar sexo y edad.** Elimínalos del formulario, del resumen («who»), del estado guardado y de los textos de privacidad.
  - Los estados guardados antiguos deben seguir cargando: ignora esos campos.
  - Actualiza las pruebas que los usan.
- **Un solo mensaje principal.** Integra el titular «Lo que piensas, tema a tema» con el banner sin perder ninguno de los dos estilos, sin duplicar titulares y sin romper la portada.
- **Botón «Empezar» visible sin scroll** a 390 × 844.
- **La provincia se pide al final**, justo antes de ver resultados, recordando la última elegida.
  - Antes de mostrar resultados siempre debe haber provincia.
  - Los enlaces compartidos antiguos (#r2…) deben seguir funcionando.
- **La pregunta de ejemplo de la portada es real:** si la respondes, empieza el test con esa respuesta guardada.
- Pruebas nuevas en `qa/onboarding.mjs`, y todas las anteriores deben pasar.

### T2 · Fase 1b: test rápido y resultados
- **Versión rápida de unas 15 preguntas (unos 3 minutos)**, además de las actuales.
  - Equilibrada: núcleo de cada área cuando sea posible, ambos sentidos de afirmación y todas las dimensiones.
  - Comprueba con perfiles simulados que quien responde como un partido lo obtiene primero en la mayoría de los casos, y documenta el resultado en `ESTADO.md`.
  - El paso «Afinar» debe llevar de la rápida a las demás versiones.
- **Resumen de resultados en una pantalla:**
  - Candidatura con más coincidencia y porcentaje.
  - 3 coincidencias y 3 choques.
  - Perfil en una frase y solidez.
  - Botones «Compartir» y «Reta a un amigo», que lleva directo al enlace para compararse.
  - Todas las demás secciones siguen ahí, plegadas tras «Ver el análisis completo» y accesibles desde la navegación interna.
- **El mapa pasa a la parte avanzada**, sin quitarlo.
- **Tarjeta para compartir:** revisa que no muestre respuestas y que se lea bien en historias.

### T3 · Fase 3a: guía para votar y calendario
- **Página estática /votar/** (generada en `pages.mjs`, con el mismo estilo), solo con fuentes oficiales enlazadas:
  - Quién puede votar y qué documento llevar.
  - Cómo saber dónde votas.
  - Voto por correo: solicitud, plazos y entrega.
  - Voto desde el extranjero.
  - Personas con discapacidad.
- **Página /calendario/** con las fechas oficiales del proceso, todas comprobadas en el real decreto de convocatoria y en la Junta Electoral Central, con su enlace.
- Enlázalas desde el pie, desde /prensa/ y desde el sitemap, y añade pruebas en `qa/growth.mjs`.

### T4 · Fase 3b: provincias, simulador y glosario
- **52 páginas /provincias/<provincia>/**, con:
  - Escaños que reparte, según el real decreto.
  - Candidaturas que se presentan según los datos del test.
  - Cuando el BOE publique las candidaturas proclamadas: revisa las marcadas como «por confirmar» (D21, JMM, Soria ¡Ya!) y los cabezas de lista, y anota en `ESTADO.md` lo que falte.
  - Enlace al test y a las páginas de cada partido.
- **Simulador D'Hondt por provincia** (página /escanos/), con votos que introduce el usuario.
  - Sin encuestas ni estimaciones.
  - Respeta la barrera del 3 % y explícala.
  - Pruebas con casos de reparto conocidos.
- **Glosario electoral /glosario/.**

### T5–T7 · Fase 2: fuentes de las posturas de los grandes partidos
- **Alcance:**
  - Preguntas con `prio` 1 y 2 sin fuente, de los partidos de la tanda (T5: PSOE y PP; T6: Vox y Frente Amplio; T7: Podemos y ERC).
  - Si sobra tiempo, `prio` 3 de esos mismos partidos.
- **Método:**
  - 2 subagentes en paralelo como máximo, cada uno con unas 30 posturas.
  - Fuente abierta de verdad, cita literal, URL que responde, tipo (programa, parlamento, gobierno, declaración o prensa) y fecha.
  - Veredicto: «apoya», «matiza», «contradice» o «sin fuente».
  - Revisa tú cada resultado:
    - Descarta lo antiguo o indirecto.
    - Corrige solo con evidencia clara y deja una nota en `NOTES`.
    - Anota lo discutible como pendiente de decisión del titular.
- **Además de la fuente,** guarda una justificación de una línea por postura: amplía el formato de `SOURCES` o crea `JUSTIF` en `src/preguntas.src.mjs`, con validación en `build.mjs`.
- Anota en `ESTADO.md` cuántas posturas tienen ya fuente por partido.

### T8 · Fase 2: justificaciones visibles y confianza
- **Muestra la justificación** junto a cada postura: en «Tus respuestas», en el explorador, en las páginas de partido y de tema, y en las fichas.
- **Botón «¿Ves un error?» en cada postura:** un enlace `mailto:` a menendezpeoe@gmail.com con asunto prellenado (pregunta y partido).
- **Página /correcciones/:** registro público de cambios de posturas con fecha, generado desde los datos y el historial de notas.
- **Página /sobre/:**
  - Quién lo hace: seudónimo «Dery», nunca el nombre real.
  - Por qué y cómo se financia (aportaciones voluntarias, sin cifras inventadas).
  - Independencia y política de correcciones.
- **Informe de metodología /metodologia/** con cifras reproducibles generadas por un script (`qa/metodologia.mjs`):
  - Pruebas con perfiles simulados y aleatorios.
  - Sesgo hacia el centro.
  - Posturas estimadas y con fuente por partido.
  - Límites.

### T9 · Fase 4: buscadores y datos abiertos
- **107 páginas /preguntas/<id>/**, del tipo «¿Qué piensa cada partido sobre…?», con contexto, posturas, justificaciones y fuentes.
- **Páginas /comparar/<a>-<b>/** para unas 10 parejas relevantes, con los mismos datos que el comparador del test.
- **/datos/:** descarga de posturas en CSV y JSON, con licencia CC BY 4.0 y su explicación.
- **Mini test insertable** de 5 preguntas en /insertar/:
  - Página propia que se pueda incluir con un `iframe`.
  - Sin rastreo ni cookies.
  - Cuenta solo la visita, como el resto.
  - Código para copiar en /prensa/.
- Títulos y descripciones únicos, datos estructurados válidos, sitemap e IndexNow.
- **No publiques traducciones** sin revisión nativa.
- **Encargo del titular (19 oct), con prioridad dentro de T9:**
  1. **Título de la portada:** exactamente «Test político 2026: ¿con qué partido coincides? · Elecciones 29N». **Descripción** con «test político», «elecciones generales 2026» y «a quién votar», sin recomendar voto (por ejemplo, dejando claro que el test no dice a quién votar: muestra coincidencias). Cambia `<title>`, `meta description`, Open Graph y Twitter de forma coherente (`papeleta-29n.html` y `publish.mjs`).
  2. **Un único H1 en la portada:** el aviso `<noscript>` de `publish.mjs` no puede llevar H1 (usa un párrafo destacado o un H2). Añade una prueba que cuente los H1 del HTML servido, incluido el `<noscript>`.
  3. **Preguntas frecuentes en la portada,** en HTML estático y visible (no generado por JavaScript), con datos estructurados `FAQPage` que repitan exactamente el texto visible:
     - ¿Cuándo son las elecciones? Fecha comprobada en el real decreto de convocatoria del BOE, con enlace (regla 7).
     - ¿Cómo funciona el test?
     - ¿Es neutral?
     - ¿Me dice a quién votar? No: muestra coincidencias.
     - ¿Guarda mis datos? Coherente con el aviso de privacidad actual (sin sexo ni edad, provincia y respuestas solo en el navegador, contador sin cookies).
     Pásalas por la revisión de la regla 9 (neutralidad y RAE) y valida el JSON-LD.
  4. **Títulos y descripciones únicos en todas las páginas:** script en `qa/` que recorra `dist/` y falle si dos páginas repiten `<title>` o `meta description`, o si alguna falta. Añádelo a las baterías.

### T10 · Fase 5: difusión y tests por tema
- **Tests por tema de 6–8 preguntas** (vivienda, inmigración, impuestos y economía, sanidad, energía, territorio):
  - Cada uno con su página y resultado propio.
  - Paso al test completo conservando las respuestas.
  - Tarjeta para compartir por tema.
- **Imágenes para redes:** pregunta del día y tarjetas por tema con la identidad de marca, en `dist/redes/`.
- **Kit de difusión:** actualiza `plan/KIT.md` con:
  - Textos para las novedades.
  - Calendario de publicaciones día a día hasta el 27 de noviembre.
  - Lista de medios, creadores, asociaciones y docentes, con su canal público de contacto (sin inventar direcciones).

### T11 · Fase 6 y repaso final antes de la campaña
- **Embudo en GoatCounter:** entra → empieza → termina → comparte → reta a un amigo.
  - Pregunta final opcional «¿Te ha resultado útil? Sí / No», contada sin datos personales.
  - Actualiza el aviso de privacidad.
- **Rendimiento:** mide peso y tiempos con la red de un móvil lento y corrige si algo ha empeorado.
- **`plan/LEGAL.md`:** preguntas para un asesor sobre la normativa de servicios web (LSSI) y las donaciones. No decidas lo jurídico.
- **Repaso completo de la web real:** todas las baterías, axe en claro y oscuro, 390 px y escritorio.
- **Programas del 29N:** comprueba si se han publicado. Si es así, anota qué partidos y deja preparada la revisión.

### S1 y S2 · Seguimiento de campaña
- Comprueba en Google y Bing qué páginas aparecen y para qué búsquedas.
- Comprueba si ya hay programas o candidaturas proclamadas y actualiza lo que sea seguro y documentado.
- Busca oportunidades gratuitas: artículos que recopilen tests, hilos o creadores que cubran la campaña. Prepara textos y enlaces para el titular.
- **S2 es el último cambio antes del periodo del 24 al 28 de noviembre:** después, nada que pueda parecer un sondeo, y ninguna publicación el 28.

### P1 · Después de las elecciones (lunes 30 de noviembre)
- Enlace a los resultados oficiales (Ministerio del Interior).
- Opción de comparar tu resultado con el voto oficial de tu provincia, solo con datos oficiales ya publicados.
- Un aviso en la portada indicando que las elecciones ya se han celebrado.
- Desactiva cualquier tarea programada de este plan que siga activa.
