# Iteración 1 · Sistema de diseño, cabecera y selector de versión

## Decisiones (delegadas por el titular el 31 oct: «las opciones más inteligentes y profesionales»)
1. **Paleta y tipografía aprobadas** (papel, tinta, fosforito; Archivo y Newsreader) + los mínimos pedidos: 16 px de texto de interfaz, 48 px de objetivo táctil, foco de 3 px en tinta con halo amarillo (16,7:1; el azul `#1a56db` rompería la identidad sin ganar contraste).
2. **Respuestas como radios nativos** (no botones con `aria-pressed`): es el patrón correcto para elegir una opción; las flechas y los lectores de pantalla funcionan sin código extra.
3. **Copias autónomas** (`index.html` y `original.html`) que se abren con doble clic.
4. **Archivos completos en la carpeta**; en el chat, el resumen.
5. **Rama aparte** `version-mejorada`: no se mezcla con las revisiones programadas ni se publica.
6. **Alcance:** la aplicación del test (las páginas estáticas, más adelante si se quiere).

## Cómo están hoy las dos versiones (P1, comprobado en el código)
Una sola página (`papeleta-29n.html` + `assets/papeleta.js` + `assets/papeleta.css`). Móvil y escritorio se separan con puntos de corte CSS (600, 759/760, 900, 960, 980, 1040 px) y tres condiciones JS (`HERO_MQ` ≤ 759 px: versiones dentro del banner; `isSheet` ≤ 1039 px: paneles como hoja inferior; `NARROW` ≤ 600 px: gráficos). Sin archivos separados ni redirecciones. La mejora respeta ese mecanismo: un solo `index.html` con los mismos puntos de corte.

## Qué cambia
| Mejora | WCAG | Móvil | Escritorio |
|---|---|---|---|
| Tokens del sistema de diseño (`--font-base`, `--font-small`, `--touch-min`, `--focus-ring`, `--radius`, `--transition`…) | 1.4.4, 2.5.8 | ✅ | ✅ |
| Sin animaciones con «reducir movimiento» (bloque global) | 2.3.3 | ✅ | ✅ |
| «Saltar al contenido»: 48 px y 16 px | 2.4.1, 2.5.8 | ✅ | ✅ |
| Marca (ir al inicio): 48 px de alto | 2.5.8 | ✅ | ✅ |
| Secciones de la cabecera: 48 px, 16 px y barra inferior en la actual (no solo color) | 2.5.8, 1.4.1 | ✅ | ✅ |
| Secciones como 3 pestañas iguales a ≤ 560 px | 2.5.8, 1.4.10 | ✅ | ➖ (en escritorio van en línea a la derecha, como ya estaban) |
| Tarjetas de versión: 16 px mínimo, borde de 2 px, radio 12 px | 1.4.4, 1.4.11 | ✅ | ✅ |
| Marca ✓ en la versión elegida (círculo vacío → con ✓) | 1.4.1 | ✅ (formulario) | ✅ |
| Barra decorativa de duración (15/24/48/107 sobre 107), `aria-hidden` | 1.3.3 | ✅ (banner y formulario) | ✅ |
| Versiones del banner: 16 px, cifras que se parten en vez de desbordar, 1 por fila a < 400 px | 1.4.4, 1.4.10 | ✅ | ➖ (en escritorio no existe: se usa el formulario, por diseño de `HERO_MQ`) |
| Nota «Versión rápida…» y «Ocultar versiones» a 16 px | 1.4.4 | ✅ | ✅ (la nota; el botón solo existe en móvil) |
| Leyenda «Versión» a 16 px | 1.4.4 | ✅ | ✅ |

## Textos nuevos de interfaz
**Ninguno** en esta iteración (todo lo añadido es CSS, una barra decorativa sin texto y una marca ✓ gráfica).

## Checklist verificado (`qa-iteracion.mjs`, todo OK)
- [x] P2: los ~500 nodos de texto son idénticos carácter a carácter a la original, a 375 y 1280 px, en claro y en oscuro, con el selector del banner abierto en móvil; ningún texto visible en la original queda oculto; `alt`, `title`, `placeholder`, `aria-label` y `value` sin cambios.
- [x] 320, 375, 414, 640 (= 1280 al 200 % de zoom), 768, 1024, 1280, 1440 y 1920 px: sin scroll horizontal, objetivos de la cabecera y del selector ≥ 48 px, textos del selector ≥ 16 px, barras de duración presentes.
- [x] Teclado: Tab → «Saltar al contenido» → marca → secciones con contorno visible; flechas cambian de versión; la elegida muestra ✓. En móvil, al abrir las versiones el foco va a la versión actual.
- [x] axe-core (WCAG 2.1 A y AA) a 375 y 1280 px, claro y oscuro: 0 fallos en la original y 0 en la mejorada.
- [x] Contraste: todos los pares de esta iteración cumplen (ver `contraste.md`).
- [x] Sin errores de JavaScript.
- [ ] Pendiente para ti: probar con un lector de pantalla real (NVDA o VoiceOver) y en tu móvil.

## Tabla de paridad (P3)
| Mejora | Móvil | Escritorio |
|---|---|---|
| Tokens y reducir movimiento | ✅ | ✅ |
| Saltar al contenido | ✅ | ✅ |
| Marca 48 px | ✅ | ✅ |
| Secciones 48 px + barra de la actual | ✅ | ✅ |
| Secciones como pestañas iguales | ✅ | ➖ en escritorio caben en línea |
| Tarjetas del formulario (16 px, ✓, barra) | ✅ (visible desde 760 px; en móvil el formulario está oculto por diseño y se usa el banner) | ✅ |
| Tarjetas del banner (16 px, barra, 1 por fila < 400 px) | ✅ | ➖ no existen en escritorio |
| Nota bajo «Empezar el test» 16 px | ✅ | ✅ |

## Confirmación P2
**Ningún texto existente ha sido alterado en móvil ni en escritorio** (comprobado nodo a nodo con la prueba automática, en claro y oscuro). Durante la iteración, la prueba detectó un salto de línea extra en `<head>`: venía de mi generador al juntar etiquetas `<style>`, no de la página; se quitó y la comparación quedó idéntica.

## Pendiente para las siguientes iteraciones (no tocado aquí)
- Textos de menos de 16 px fuera del alcance de la iteración 1: etiqueta superior del banner, franja de confianza, rejilla decorativa del banner (`aria-hidden`, decorativa) y etiquetas pequeñas del resto de vistas. Se corrigen en su iteración (2: test; 3: provincia y progreso; 4: resultados y pulido de portada).
- `--font-base: 18px` se aplica a los textos de lectura de cada componente en su iteración, para no desajustar vistas aún sin revisar.
