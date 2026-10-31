# Contraste (WCAG 2.1 AA)

Calculado con la fórmula de luminancia relativa de WCAG. Texto normal: mínimo 4,5:1; componentes de interfaz, contornos de foco y elementos gráficos: mínimo 3:1 (1.4.3 y 1.4.11). Actualizado en cada iteración.

## Iteración 1 · Sistema de diseño, cabecera y selector de versión

| Modo | Par | Primer plano | Fondo | Ratio | Mínimo | Resultado |
|---|---|---|---|---|---|---|
| Claro | Texto principal (--ink) / papel | `#111318` | `#F2F3EE` | 16.66:1 | 4.5:1 | ✅ |
| Claro | Texto principal / tarjeta (--sheet) | `#111318` | `#FFFFFF` | 18.58:1 | 4.5:1 | ✅ |
| Claro | Texto secundario (--ink-2) / papel | `#434955` | `#F2F3EE` | 8.11:1 | 4.5:1 | ✅ |
| Claro | Descripción de versión (--ink-2) / tarjeta (--sheet-2) | `#434955` | `#F7F8F4` | 8.48:1 | 4.5:1 | ✅ |
| Claro | Texto terciario (--ink-3) / papel | `#676D79` | `#F2F3EE` | 4.66:1 | 4.5:1 | ✅ |
| Claro | Versión elegida: texto (--mark-ink) / fosforito (--mark) | `#111318` | `#F6DD2F` | 13.54:1 | 4.5:1 | ✅ |
| Claro | Sección actual: texto / --mark-2 | `#111318` | `#FCF1A6` | 16.17:1 | 4.5:1 | ✅ |
| Claro | Círculo de selección (--ink-3) / tarjeta (componente) | `#676D79` | `#F7F8F4` | 4.87:1 | 3.0:1 | ✅ |
| Claro | Barra de duración (--ink) / fondo de barra (--rule-2) | `#111318` | `#E4E6DF` | 14.76:1 | 3.0:1 | ✅ |
| Claro | Contorno de foco (--ink) / papel | `#111318` | `#F2F3EE` | 16.66:1 | 3.0:1 | ✅ |
| Oscuro | Texto principal / papel | `#EDEEF0` | `#0E1014` | 16.40:1 | 4.5:1 | ✅ |
| Oscuro | Texto secundario (--ink-2) / tarjeta (--sheet-2) | `#B8BDC7` | `#1C2027` | 8.67:1 | 4.5:1 | ✅ |
| Oscuro | Texto terciario (--ink-3) / papel | `#8E94A1` | `#0E1014` | 6.26:1 | 4.5:1 | ✅ |
| Oscuro | Versión elegida: texto / fosforito | `#0E1014` | `#EED534` | 12.88:1 | 4.5:1 | ✅ |
| Oscuro | Círculo de selección (--ink-3) / tarjeta | `#8E94A1` | `#1C2027` | 5.37:1 | 3.0:1 | ✅ |
| Oscuro | Contorno de foco (--ink) / papel | `#EDEEF0` | `#0E1014` | 16.40:1 | 3.0:1 | ✅ |
| Banner | Texto (--bn-paper) / fondo del banner | `#F2F3EE` | `#111318` | 16.66:1 | 4.5:1 | ✅ |
| Banner | Texto apagado (--bn-mute) / fondo | `#AEB3BD` | `#111318` | 8.83:1 | 4.5:1 | ✅ |
| Banner | Cifras de versión (--bn-mark) / fondo | `#F6DD2F` | `#111318` | 13.54:1 | 4.5:1 | ✅ |
| Banner | Nota (#D7DADF) / píldora (papel 7 % sobre fondo) | `#D7DADF` | `#212327` | 11.23:1 | 4.5:1 | ✅ |
| Banner | Rápida: texto / fosforito | `#111318` | `#F6DD2F` | 13.54:1 | 4.5:1 | ✅ |
| Banner | Rápida: descripción (#3A3F49) / fosforito | `#3A3F49` | `#F6DD2F` | 7.70:1 | 4.5:1 | ✅ |
| Banner | Barra de duración (--bn-mark) / fondo de barra | `#F6DD2F` | `#35373A` | 8.70:1 | 3.0:1 | ✅ |
| Banner | Contorno de foco (--bn-paper) / fondo | `#F2F3EE` | `#111318` | 16.66:1 | 3.0:1 | ✅ |

## Iteración 2 · Pregunta, respuestas y «Más contexto»

| Modo | Par | Primer plano | Fondo | Ratio | Mínimo | Resultado |
|---|---|---|---|---|---|---|
| Claro | Respuesta: texto (--ink) / tarjeta (--sheet) | `#111318` | `#FFFFFF` | 18.58:1 | 4.5:1 | ✅ |
| Claro | Respuesta encima: texto / --sheet-2 | `#111318` | `#F7F8F4` | 17.42:1 | 4.5:1 | ✅ |
| Claro | Respuesta elegida: texto / fosforito | `#111318` | `#F6DD2F` | 13.54:1 | 4.5:1 | ✅ |
| Claro | Círculo sin elegir (--ink-3) / tarjeta (componente) | `#676D79` | `#FFFFFF` | 5.20:1 | 3.0:1 | ✅ |
| Claro | ✓ elegido (--mark) / círculo (--mark-ink) | `#F6DD2F` | `#111318` | 13.54:1 | 3.0:1 | ✅ |
| Claro | Borde de tarjeta sin elegir (--rule) / papel — se refuerza con el círculo | `#D2D5CC` | `#F2F3EE` | 1.33:1 | —:1 | ℹ️ decorativo: la tarjeta se identifica por su texto y el círculo (3:1 ✅) |
| Claro | «No lo sé»: texto (--ink-2) / papel | `#434955` | `#F2F3EE` | 8.11:1 | 4.5:1 | ✅ |
| Claro | «No lo sé»: borde discontinuo (--ink-3) / papel | `#676D79` | `#F2F3EE` | 4.66:1 | 3.0:1 | ✅ |
| Claro | «No lo sé» elegido: texto (--paper) / tinta | `#F2F3EE` | `#111318` | 16.66:1 | 4.5:1 | ✅ |
| Claro | «Más contexto» abierto: texto / --mark-2 | `#111318` | `#FCF1A6` | 16.17:1 | 4.5:1 | ✅ |
| Claro | Borde del panel de contexto (--ink) / papel | `#111318` | `#F2F3EE` | 16.66:1 | 3.0:1 | ✅ |
| Claro | Nota del contexto (--ink-3) / tarjeta | `#676D79` | `#FFFFFF` | 5.20:1 | 4.5:1 | ✅ |
| Claro | Ayuda de teclado (--ink-3) / papel | `#676D79` | `#F2F3EE` | 4.66:1 | 4.5:1 | ✅ |
| Claro | Error (--ko) / papel | `#B3261E` | `#F2F3EE` | 5.86:1 | 4.5:1 | ✅ |
| Oscuro | Respuesta: texto / tarjeta (--sheet) | `#EDEEF0` | `#171A20` | 15.01:1 | 4.5:1 | ✅ |
| Oscuro | Respuesta elegida: texto / fosforito | `#0E1014` | `#EED534` | 12.88:1 | 4.5:1 | ✅ |
| Oscuro | Círculo sin elegir (--ink-3) / tarjeta | `#8E94A1` | `#171A20` | 5.73:1 | 3.0:1 | ✅ |
| Oscuro | «No lo sé»: borde (--ink-3) / papel | `#8E94A1` | `#0E1014` | 6.26:1 | 3.0:1 | ✅ |
| Oscuro | Nota del contexto (--ink-3) / tarjeta | `#8E94A1` | `#171A20` | 5.73:1 | 4.5:1 | ✅ |
| Oscuro | Error (--ko) / papel | `#F07B6E` | `#0E1014` | 7.04:1 | 4.5:1 | ✅ |
