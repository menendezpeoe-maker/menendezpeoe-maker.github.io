# Iteración 3 · Barra de progreso, avance automático, provincia con buscador y avisos

## Qué cambia
| Mejora | WCAG | Móvil | Escritorio |
|---|---|---|---|
| «Respuesta guardada» para lectores de pantalla (texto aprobado) | 4.1.3 | ✅ | ✅ |
| Interruptor «Pasar de pregunta automáticamente» (aprobado), activado por defecto como la original; desactivado, ni el toque ni las teclas 0–5 pasan de pregunta y se recuerda | 3.2.2, 2.2.1, 2.5.8 | ✅ | ✅ |
| El área («Área 2 de 12 · …») se anuncia al lector de pantalla solo cuando cambia | 4.1.3 | ✅ | ✅ |
| «Guardar y salir» de 48 px y 16 px; área a 16 px **sin recortar** (la original la recortaba a 3 líneas); contador a 17 px | 2.5.8, 1.4.4, 1.4.10 | ✅ | ✅ |
| Barra de 10 px; el área actual con contorno de 2 px (forma, no solo color) | 1.4.1, 1.4.11 | ✅ | ✅ |
| Barra **sin fijar** y en dos filas (salir y contador arriba; barra y área a todo el ancho) | 1.4.10, 2.4.11 | ✅ (≤ 560 px) | ➖ (en escritorio sigue fija arriba: cabe en una fila y no tapa nada) |
| Lo enfocado con el teclado nunca queda escondido bajo la barra fija | 2.4.11 | ➖ (barra sin fijar) | ✅ |
| Último paso: etiquetas, ayuda, candidaturas y recuento a 16 px; desplegable, áreas y botones ≥ 48 px | 1.4.4, 2.5.8 | ✅ | ✅ |
| Provincia sin elegir: además del mensaje, el desplegable se marca con `aria-invalid` y borde rojo grueso | 3.3.1, 1.4.1 | ✅ | ✅ |
| **Buscador de provincia** (filtra sin cambiar ni reordenar; ignora tildes; con una sola coincidencia, la elige; anuncia cuántas quedan) | 2.4.6, 3.3.2, 4.1.3 | ⚠️ programado y probado; **oculto hasta que apruebes sus textos (3, 4 y 5)** | ⚠️ ídem |

Nota: el buscador va **encima** del desplegable, así el teclado del móvil no tapa las opciones. La propuesta se ve en las capturas `propuesta-buscador-*.png` (se generan activando los textos solo para la captura).

## Textos nuevos
- Activos (aprobados): «Respuesta guardada», «Pasar de pregunta automáticamente».
- Pendientes de tu aprobación: «Buscar provincia», «1 provincia coincide / N provincias coinciden», «Ninguna provincia coincide con la búsqueda». Ver `textos-nuevos-ui.md`.

## Checklist verificado (`qa-iteracion.mjs`: todo OK, incluidas las iteraciones 1 y 2)
- [x] P2: textos originales del último paso idénticos a 375 px (claro) y 1280 px (oscuro); solo aparecen textos nuevos aprobados; el buscador no aparece sin aprobar.
- [x] Barra del test en 320, 375, 414, 640, 768, 1024, 1280, 1440 y 1920 px: sin scroll horizontal, área a 16 px sin recortar, «Guardar y salir» e interruptor de 48 px, barra sin fijar ≤ 560 px y fija por encima.
- [x] Avance automático: activado, pasa de pregunta y anuncia «Respuesta guardada»; desactivado, ni el toque ni la tecla 5 avanzan; «Siguiente» avanza y el interruptor se mantiene.
- [x] Provincia: sin elegir → `aria-invalid` y error enlazado; al elegir, desaparece. Controles ≥ 48 px y textos ≥ 16 px.
- [x] Buscador (propuesta): «sevi» elige Sevilla y lo anuncia; «ávila» encuentra solo Ávila; «zzz» avisa de que no hay coincidencias.
- [x] axe-core en el último paso con el error visible (375 y 1280 px, claro y oscuro): 0 fallos en ambas.
- [x] Contraste: todos los pares cumplen. Se corrigió la bolita del interruptor en oscuro (1,27:1 → 16,4:1).
- [ ] Pendiente para ti: probar en tu móvil y con lector de pantalla.

## Tabla de paridad (P3)
| Mejora | Móvil | Escritorio |
|---|---|---|
| «Respuesta guardada» | ✅ | ✅ |
| Interruptor de avance automático | ✅ | ✅ |
| Aviso del área al cambiar | ✅ | ✅ |
| Barra del test: tamaños y área sin recortar | ✅ | ✅ |
| Barra sin fijar en dos filas | ✅ | ➖ fija y en una fila (no tapa) |
| Foco nunca bajo la barra | ➖ barra sin fijar | ✅ |
| Último paso a 16 px / 48 px | ✅ | ✅ |
| Error de provincia con `aria-invalid` | ✅ | ✅ |
| Buscador de provincia | ⚠️ espera tu aprobación de textos | ⚠️ ídem |

## Confirmación P2
**Ningún texto existente ha sido alterado en móvil ni en escritorio.** Los únicos textos nuevos visibles son los dos aprobados. El panel de contexto sigue en la posición que aprobaste (la prueba lo compara aparte).
