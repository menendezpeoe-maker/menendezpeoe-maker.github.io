# Fuentes en curso (3 nov 2026)

Tarea «poner enlace a las 258 posturas documentadas sin fuente» (petición del titular, 3 nov).
- `lista.json`: las 258 posturas. `grupo1.json` y `grupo2.json`: reparto entre dos investigadores.
- `resultado1.json` y `resultado2.json`: lo investigado (138) hasta que se agotó el límite de uso.
- `verificar.py`: comprueba que cada fuente responde y contiene la cita (111 de 112 automáticas; la otra, revisada a mano).
- `revisado.json`: lo aplicado y publicado el 3 nov con `qa/herramientas/aplicar-fuentes.mjs`: 110 fuentes, 40 posturas a estimadas, 3 cambios de valor (H05/ccpc 4→2, A02/d21 2→3, D09/bildu 1→4 estimada).
- **`pendiente.json`: las 120 que faltan por investigar.** Mismo método: investigar, `verificar.py`, revisar a mano los casos «intensidad» y «contradice», aplicar, `node qa/correcciones.mjs`, todas las baterías.
