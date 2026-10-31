# Iteración 2 · Pregunta, respuestas y «Más contexto»

## Qué cambia
| Mejora | WCAG | Móvil | Escritorio |
|---|---|---|---|
| Código/área, introducción del área, error y ayuda de teclado a 16 px | 1.4.4 | ✅ | ✅ |
| Opciones A/B de los dilemas a 17 px, letra en círculo de 32 px | 1.4.4 | ✅ | ✅ |
| Respuestas 1–5: tarjetas de 56 px (móvil, en filas) y 120 px (escritorio, 5 columnas), borde de 2 px, texto 16–17 px | 2.5.8, 1.4.4 | ✅ | ✅ |
| Círculo en cada respuesta que pasa a relleno con ✓ al elegirla (antes el ✓ solo aparecía en la elegida) | 1.4.1, 1.4.11 | ✅ | ✅ |
| Estados diferenciados: encima, foco (contorno + halo), pulsado, elegido | 2.4.7, 1.4.11 | ✅ (sin «encima» en táctil) | ✅ |
| «No lo sé» y «Me importa especialmente» de 48 px y 16 px; a ≤ 420 px ocupan el ancho | 2.5.8, 1.4.4 | ✅ | ✅ |
| Anterior/Siguiente de 48 px y 16 px, sin partirse; la ayuda de teclado baja a su línea si no cabe | 2.5.8, 1.4.10 | ✅ | ✅ |
| «Más contexto» como botón de 48 px con flecha que gira | 2.5.8, 1.4.1, 4.1.2 | ✅ | ✅ |
| **Panel de contexto justo debajo de su botón** (acordeón WAI-ARIA), con `role="region"` y su título como nombre | 1.3.1, 1.3.2, 2.4.3, 4.1.2 | ✅ (antes: hoja fija que tapaba las respuestas) | ✅ (antes: columna lateral) |
| El foco se queda en el botón al abrir/cerrar (clic, Intro o tecla C); la X devuelve el foco al botón | 2.4.3 | ✅ | ✅ |
| Apertura animada en 200 ms, sin animación con «reducir movimiento» | 2.3.3 | ✅ | ✅ |
| Texto del contexto a 18 px y ≤ 68 caracteres por línea; nota y marco legal a 16 px; cerrar de 48 px | 1.4.4, 1.4.8, 2.5.8 | ✅ | ✅ |

## Aviso importante (P5): un cambio de posición, no de texto
El panel de contexto es **el mismo nodo con los mismos textos**, pero ahora está **colocado en el documento justo después de su botón** (antes iba después de toda la pregunta). Es lo que exige el patrón de acordeón que pediste: así el orden de lectura y de foco coincide con lo que se ve, y en móvil deja de tapar las respuestas. La prueba automática confirma que los textos de fuera del panel siguen en el mismo orden y que el panel conserva exactamente los suyos. Si prefieres la colocación anterior, se revierte quitando un bloque de `mejora.js` y otro de `mejora.css`.

## Decisión pendiente para ti (no tocada)
- **Avance automático tras elegir con el dedo o el ratón** (ya existe en la original: pasa de pregunta a los 0,34 s). A algunas personas mayores o con lector de pantalla les puede desorientar (WCAG 3.2.2, «al recibir entrada»). Propuesta: mantenerlo y añadir un interruptor «Pasar de pregunta automáticamente», lo que requiere un texto nuevo. Con el teclado ya no avanza solo salvo con las teclas 1–5.

## Textos nuevos de interfaz
1 propuesto y **no insertado**: «Respuesta guardada» (anuncio para lector de pantalla). Ver `textos-nuevos-ui.md`.

## Checklist verificado (`qa-iteracion.mjs`: todo OK, incluidas las pruebas de la iteración 1)
- [x] P2 en el test, a 375 px (claro) y 1280 px (oscuro): textos idénticos con el contexto cerrado, abierto, al pasar de pregunta con el contexto abierto y en un dilema (A·02).
- [x] 320, 375, 414, 640, 768, 1024, 1280, 1440 y 1920 px con el contexto abierto: sin scroll horizontal; respuestas ≥ 56 px (escritorio) / ≥ 48 px (móvil); «No lo sé», estrella, contexto, cerrar, Anterior y Siguiente ≥ 48 px; textos ≥ 16 px; panel bajo su botón, como región, sin tapar respuestas; círculo de selección visible.
- [x] Teclado: Intro abre el contexto y el foco se queda en el botón; el siguiente Tab entra en el panel; cerrar devuelve el foco; la tecla C funciona; las flechas cambian la respuesta sin pasar de pregunta; la elegida muestra ✓.
- [x] axe-core en el test con el contexto abierto (375 y 1280 px, claro y oscuro): 0 fallos en ambas.
- [x] Contraste de todos los pares nuevos (ver `contraste.md`).
- [x] Sin errores de JavaScript.
- [ ] Pendiente para ti: probar en tu móvil y con lector de pantalla.

## Tabla de paridad (P3)
| Mejora | Móvil | Escritorio |
|---|---|---|
| Textos de la pregunta a 16 px | ✅ | ✅ |
| Respuestas grandes con círculo/✓ | ✅ | ✅ |
| Estados encima/foco/pulsado/elegido | ✅ (encima: ➖ en táctil, no existe) | ✅ |
| «No lo sé» y estrella de 48 px | ✅ | ✅ |
| Anterior/Siguiente sin partirse | ✅ | ✅ |
| Contexto como acordeón bajo su botón | ✅ | ✅ |
| Foco en el botón del acordeón | ✅ | ✅ |
| Animación ≤ 250 ms con «reducir movimiento» | ✅ | ✅ |
| «Respuesta guardada» | ⚠️ preparado, sin texto hasta tu aprobación | ⚠️ ídem |

## Confirmación P2
**Ningún texto existente ha sido alterado en móvil ni en escritorio.** Único cambio estructural: la posición del panel de contexto en el documento (explicado arriba), con sus textos intactos.
