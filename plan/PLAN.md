# Plan automático de Test 29N hasta el 29N

Este plan lo ejecutan, por tandas, conversaciones automáticas programadas. Cada tanda empieza sin memoria de las anteriores, así que **todo lo necesario está aquí y en `plan/ESTADO.md`**. El encargo completo del titular, con el contexto y las reglas, está en `plan/PROMPT-ORIGINAL.md`; este archivo lo concreta en tandas.

## Reglas para cada tanda (además de las de PROMPT-ORIGINAL.md, que se aplican siempre)

1. **Lee primero** `plan/PROMPT-ORIGINAL.md` (secciones 2 a 4 y 6), este archivo y `plan/ESTADO.md`.
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

## Tandas

| Tanda | Fecha (hora de Madrid) | Contenido |
|---|---|---|
| T1 | sáb 24 oct | Fase 1a: entrada |
| T2 | lun 26 oct | Fase 1b: test rápido y resultados |
| T3 | mié 28 oct | Fase 3a: guía para votar y calendario |
| T4 | sáb 31 oct | Fase 3b: provincias, simulador y glosario |
| T5 | lun 2 nov | Fase 2: fuentes de PSOE y PP |
| T6 | mar 3 nov | Fase 2: fuentes de Vox y Frente Amplio |
| T7 | mié 4 nov | Fase 2: fuentes de Podemos y ERC |
| T8 | jue 5 nov | Fase 2: justificaciones visibles y confianza |
| T9 | sáb 7 nov | Fase 4: buscadores y datos abiertos |
| T10 | lun 9 nov | Fase 5: difusión y tests por tema |
| T11 | mié 11 nov | Fase 6 y repaso final antes de la campaña |
| S1 | lun 16 nov | Seguimiento de campaña |
| S2 | sáb 21 nov | Seguimiento de campaña (último antes del 24) |
| P1 | lun 30 nov | Después de las elecciones |

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
