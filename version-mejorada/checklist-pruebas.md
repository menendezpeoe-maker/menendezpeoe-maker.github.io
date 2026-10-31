# Cómo probar la versión mejorada

## 1. Abrirla
- **Más fácil (móvil u ordenador):** la página privada de claude.ai «Prueba versión mejorada» (https://claude.ai/artifact/QFPw2MRUveAdCVC6wiL5Ue): botones «Abrir la versión mejorada» y «Abrir la original».
- **En el ordenador, sin internet:** abre `index.html` (mejorada) y `original.html` con doble clic en Chrome, Edge o Firefox, en dos pestañas. Los visores de archivos del móvil o de apps no ejecutan el código y la página no responde: usa la página de claude.ai.
- **Con servidor (opcional):** `python3 -m http.server 8000` en esta carpeta → http://localhost:8000/.

## 2. Móvil y escritorio
- En el ordenador: F12 → icono de móvil (Ctrl+Mayús+M) → prueba 320, 375 y 414 px; después cierra ese modo (escritorio) y prueba la ventana a pantalla completa.
- En tu móvil: abre la página de claude.ai.
- Compara siempre la misma anchura y el mismo paso en las dos pestañas.

## 3. Recorrido (en las dos versiones)
1. Portada: «Empezar el test» (en móvil se despliegan las versiones; en escritorio, el recuadro «Elige la versión»).
2. Test: elige respuestas, abre y cierra «Más contexto», marca la estrella, apaga «Pasar de pregunta automáticamente» y comprueba que ya no avanza solo.
3. Último paso: escribe parte de tu provincia en «Buscar provincia»; pulsa «Ver mis resultados» sin provincia y mira el error.
4. Resultados: «Ver el análisis completo», abre los desplegables, usa el menú «Secciones».

## 4. Teclado (escritorio)
- Tab / Mayús+Tab recorren todo con un contorno visible; Intro y Espacio activan.
- En las versiones y en las respuestas, las flechas cambian la opción.
- En el test: teclas 1–5, 0 («No lo sé»), C (contexto), Intro (siguiente), Esc (cerrar contexto).

## 5. Táctil (móvil)
- Todo se alcanza con el pulgar; ningún botón es menor que la yema (48 px).
- El teclado del móvil no tapa el buscador de provincia.

## 6. Lector de pantalla
- Windows: NVDA (gratis, nvaccess.org) con Chrome o Firefox. Mac/iPhone: VoiceOver (Cmd+F5 / Ajustes → Accesibilidad).
- Comprueba que se anuncian: el nombre de cada versión, «1 de 6» en las respuestas, «Respuesta guardada», el área cuando cambia, el número de provincias al buscar y el error de provincia.

## 7. Zoom al 200 %
- En el ordenador, Ctrl + «+» hasta 200 %: no debe aparecer barra horizontal ni perderse texto.

## 8. Pruebas automáticas (para quien mantenga la web)
- `node build.mjs && SITE_URL=https://test29n.es/ node publish.mjs && node version-mejorada/build-local.mjs`
- `NODE_PATH=$(npm root -g) node version-mejorada/qa-iteracion.mjs` → textos idénticos nodo a nodo, 9 anchuras, tamaños, teclado, acordeón, interruptor, provincia, encabezados y axe-core (WCAG 2.1 AA) en claro y oscuro.
