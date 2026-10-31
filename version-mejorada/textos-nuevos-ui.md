# Textos nuevos de interfaz

Solo se muestran los **aprobados**. Los **pendientes** están programados pero desactivados (valor vacío en `assets/mejora.js`, objeto `T`): no aparecen en la página hasta su aprobación.

| # | Iteración | Ubicación | Texto | Motivo | `aria-label` / rol | Aplica a | Estado |
|---|---|---|---|---|---|---|---|
| 1 | 2 | Test, al elegir una respuesta (invisible, solo lectores de pantalla) | Respuesta guardada | Confirma que la elección se ha guardado (WCAG 4.1.3) | `aria-live="polite"`, clase `sr` | Móvil y escritorio | **Aprobado** (31 oct) · activo |
| 2 | 2–3 | Test, bajo Anterior/Siguiente | Pasar de pregunta automáticamente | Permite desactivar el avance automático tras elegir (WCAG 3.2.2) | Casilla con `role="switch"` | Móvil y escritorio | **Aprobado** (31 oct) · activo |
| 3 | 3 | Último paso, encima de «Provincia en la que votas» | Buscar provincia | Etiqueta visible del buscador (WCAG 3.3.2, 2.4.6) | `<label for="prov-q">` | Móvil y escritorio | Pendiente |
| 4 | 3 | Último paso, bajo el buscador (también se anuncia) | 1 provincia coincide / N provincias coinciden | Dice cuántas provincias quedan al buscar (WCAG 4.1.3) | `aria-live="polite"` | Móvil y escritorio | Pendiente |
| 5 | 3 | Ídem | Ninguna provincia coincide con la búsqueda | Avisa de que no hay resultados (WCAG 4.1.3, 3.3.1) | `aria-live="polite"` | Móvil y escritorio | Pendiente |
