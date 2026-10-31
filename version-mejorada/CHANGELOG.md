# CHANGELOG · Test 29N, versión mejorada

Versión independiente para probar en local (rama `version-mejorada`). **No modifica la web publicada ni ningún archivo original**: todo está en `assets/mejora.css` y `assets/mejora.js`, que se cargan después de los originales. Detalle por iteración en `ITERACION-1.md` … `ITERACION-4.md`.

## Confirmación de contenido
**Ningún texto, dato, pregunta, opción, área, provincia, resultado ni mensaje existente ha sido modificado, ni en móvil ni en escritorio.** Comprobado automáticamente, nodo a nodo y carácter a carácter, en portada, test (preguntas normales, dilemas, contexto abierto), último paso y resultados completos (4 161 nodos), en claro y oscuro, a 375 y 1280 px.
- Textos nuevos: solo los 6 aprobados por el titular, ver `textos-nuevos-ui.md`.
- Único cambio estructural, aprobado: el panel de «Más contexto» (mismo nodo, mismos textos) se coloca justo debajo de su botón.
- Solo presentación (sin cambiar el texto): mayor tamaño de letra, el rótulo «Secciones» en minúscula y menos espaciado entre letras en etiquetas en mayúsculas.

## Iteración 1 · Sistema de diseño, cabecera y selector de versión (ambas versiones)
- Tokens de diseño; foco de 3 px en tinta con halo amarillo (16,7:1), manteniendo la paleta aprobada; «reducir movimiento» global. WCAG 1.4.4, 2.4.7, 2.5.8, 2.3.3.
- Cabecera a 48 px y 16 px; sección actual con barra (no solo color); en móvil, tres pestañas iguales. WCAG 2.5.8, 1.4.1.
- Versiones: 16 px, ✓ en la elegida, barra de duración decorativa; en móvil < 400 px, una por fila. WCAG 1.4.1, 1.4.4, 1.4.10.

## Iteración 2 · Pregunta, respuestas y «Más contexto» (ambas)
- Respuestas como radios nativos con aspecto de tarjeta (56 px móvil / 120 px escritorio), círculo que pasa a ✓; estados diferenciados. WCAG 2.5.8, 1.4.1, 2.4.7.
- «No lo sé», estrella y navegación a 48 px; «Volver al inicio» ya no se parte en tres líneas. WCAG 2.5.8, 1.4.10.
- «Más contexto» como acordeón WAI-ARIA bajo su botón, foco en el botón, 200 ms; texto del contexto a 18 px y ≤ 68 caracteres por línea. WCAG 1.3.2, 2.4.3, 4.1.2, 1.4.8.

## Iteración 3 · Progreso, avance automático, provincia y avisos (ambas)
- «Respuesta guardada» para lectores de pantalla; área anunciada solo al cambiar. WCAG 4.1.3.
- Interruptor «Pasar de pregunta automáticamente» (activado por defecto). WCAG 3.2.2, 2.2.1.
- Barra del test: 48 px, área a 16 px sin recortar; en móvil sin fijar y en dos filas; en escritorio el foco nunca queda bajo ella. WCAG 1.4.10, 2.4.11.
- Último paso a 16 px / 48 px; error de provincia con `aria-invalid`; buscador de provincia que filtra sin cambiar ni reordenar. WCAG 3.3.1, 3.3.2, 4.1.3.

## Iteración 4 · Resultados y repaso final (ambas)
- Mínimo de 16 px en toda la página; controles de resultados a 48 px; barras de dimensiones sin «…»; menú «Secciones» a 16 px. WCAG 1.4.4, 1.4.12, 2.5.8.
- Un nivel 1 por vista sin saltos (`aria-level`). WCAG 1.3.1.
- Microinteracciones discretas, desactivadas con «reducir movimiento». WCAG 2.3.3.
- «Volver arriba» (texto aprobado el 31 oct). WCAG 2.4.1.

## Ajustes tras las iteraciones (pedidos por el titular, 31 oct)
- «Volver arriba» también en «Cómo funciona», «Posturas de los partidos» y resultados; aparece al bajar media pantalla.
- «Posturas de los partidos» sin retraso: con un procesador de móvil simulado, abrir esa vista pasa de ~1 s (original) y ~3,7 s (versión mejorada anterior) a ~0,35–0,4 s. Cómo: el listado no se vuelve a dibujar si no ha cambiado; el mínimo de 16 px de esa vista va en CSS fijo; el navegador solo dibuja las preguntas cercanas a la pantalla; y al salir, la vista se oculta conservando lo calculado (sigue sin verse, sin ocupar sitio, sin foco y fuera del árbol de accesibilidad).

## Propuestas para el futuro (no hechas, a tu criterio)
- Llevar estas mejoras a la web real: copiar `assets/mejora.css` y `assets/mejora.js` y enlazarlos tras los originales en `papeleta-29n.html`, pasar todas las baterías (`node qa/run.mjs todas`) y publicar. Recomendado **después del 29N** o antes del 21 nov como muy tarde, para no cambiar la web en plena campaña sin margen.
- Aplicar el mismo mínimo de 16 px y 48 px a las 230 páginas estáticas (partidos, temas, provincias…).
