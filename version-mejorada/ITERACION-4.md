# Iteración 4 · Resultados, «Volver arriba», microinteracciones y repaso final

## Qué cambia
| Mejora | WCAG | Móvil | Escritorio |
|---|---|---|---|
| Buscador de provincia activado (textos aprobados) | 2.4.6, 3.3.2, 4.1.3 | ✅ | ✅ |
| **Mínimo de 16 px en toda la página** (resultados, portada y pie): ~1 000 elementos que estaban entre 10,5 y 15,5 px. Solo agranda; excluye logotipos de partido, gráficos y elementos decorativos ocultos | 1.4.4, 1.4.12 | ✅ | ✅ |
| Resultados: desplegables «más», pestañas del ranking, «¿Te ha resultado útil?», compartir, revisar, comparar, mapa y botones-enlace a 48 px (los enlaces dentro de frases, exentos) | 2.5.8 | ✅ | ✅ |
| Barras de dimensiones: el nombre ocupa dos líneas en vez de cortarse con «…» | 1.4.12, 1.4.10 | ✅ | ✅ |
| Menú «Secciones»: sus dos textos a 16 px, rótulo en minúscula (solo presentación) y sin cortar nombres largos | 1.4.4 | ✅ | ✅ |
| Un solo encabezado de nivel 1 por vista y sin saltos (en el test y el último paso, el `<h2>` visible se marca con `aria-level="1"`) | 1.3.1, 2.4.6 | ✅ | ✅ |
| Microinteracciones: los botones se hunden al pulsar y cambian suave al pasar por encima; desplazamiento suave. Todo se quita con «reducir movimiento» | 2.3.3 | ✅ (sin «encima» en táctil) | ✅ |
| **«Volver arriba»**: 48 px (52 en escritorio), tras una pantalla, solo en portada y resultados (no tapa «Siguiente» ni el teclado), lleva el foco al título | 2.4.1, 2.5.8 | ⚠️ hecho y probado; **oculto hasta que apruebes su texto** | ⚠️ ídem |

## Checklist verificado (`qa-iteracion.mjs`: todo OK, con las cuatro iteraciones)
- [x] P2 en resultados completos con todos los desplegables abiertos: 4 161 nodos de texto idénticos a 375 px (claro) y 1280 px (oscuro).
- [x] Ningún texto queda recortado por el tamaño mayor.
- [x] Resultados completos en 320, 375, 414, 640, 768, 1024, 1280, 1440 y 1920 px: sin scroll horizontal, todo el texto ≥ 16 px, todos los controles ≥ 48 px, sin errores de JavaScript.
- [x] Encabezados: portada, test, último paso y resultados, cada uno con un solo nivel 1 y sin saltos (375 y 1280 px).
- [x] «Volver arriba» (activado solo para la prueba): oculto arriba, aparece tras una pantalla, 48 × 48 px, lleva arriba y enfoca el título, no aparece en el test. En la entrega no existe.
- [x] axe-core en resultados completos (375 y 1280 px, claro y oscuro): 0 fallos en ambas.
- [x] Contraste: todos los pares cumplen; se corrigió el foco de «Volver arriba» (amarillo sobre papel 1,10:1 → tinta 16,7:1).
