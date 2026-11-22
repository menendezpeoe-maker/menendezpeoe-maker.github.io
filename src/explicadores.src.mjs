// Explicado en 1 minuto: cómo funcionan las instituciones, paso a paso y con el artículo que lo regula.
// Formato: [id (URL /explicado/<id>/), título, subtítulo, icono, pasos, dato clave, fuentes [[etiqueta, url]]]. Solo texto de la ley.
const CE = "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229";
const LOREG = "https://www.boe.es/buscar/act.php?id=BOE-A-1985-11672";
export const EXPLICADORES = [
  ["investidura", "Investidura", "Cómo se elige al presidente del Gobierno", "elec", [
    "El Rey consulta a los representantes de los grupos políticos y propone un candidato a través de la presidencia del Congreso.",
    "El candidato expone su programa ante el Congreso y pide la confianza de la Cámara.",
    "En la 1.ª votación necesita mayoría absoluta: 176 síes de 350.",
    "Si no la logra, 48 horas después basta con mayoría simple: más síes que noes.",
    "Si a los dos meses de la primera votación nadie la ha obtenido, se disuelven las Cortes y se repiten las elecciones."],
    "176 síes en la 1.ª votación, o más síes que noes en la 2.ª", [["CE, art. 99", CE + "#a99"]]],
  ["mocion-de-censura", "Moción de censura", "Cómo el Congreso puede cambiar de presidente", "cmp", [
    "La presenta al menos una décima parte de los diputados: 35.",
    "Es «constructiva»: tiene que incluir un candidato a presidente.",
    "No se puede votar hasta que pasen cinco días desde que se presenta.",
    "Si logra mayoría absoluta (176 síes), el candidato pasa a ser presidente.",
    "Si no prospera, quienes la firmaron no pueden presentar otra en el mismo periodo de sesiones."],
    "176 síes · desde 1978 solo ha prosperado una, en 2018", [["CE, arts. 113 y 114", CE + "#a113"]]],
  ["cuestion-de-confianza", "Cuestión de confianza", "Cuando el presidente pide el apoyo del Congreso", "test", [
    "La plantea el presidente, tras deliberarlo con el Consejo de Ministros.",
    "Es sobre su programa o sobre una declaración de política general.",
    "La gana con mayoría simple: más síes que noes.",
    "Si la pierde, el Gobierno dimite y se elige un nuevo presidente por el procedimiento de investidura."],
    "Basta con mayoría simple", [["CE, arts. 112 y 114", CE + "#a112"]]],
  ["ley-dhondt", "Ley D'Hondt", "Cómo se reparten los escaños de cada provincia", "data", [
    "Solo entran las candidaturas con al menos el 3 % de los votos válidos de la provincia.",
    "Los votos de cada candidatura se dividen entre 1, 2, 3… hasta el número de escaños en juego.",
    "Los escaños van a los cocientes más altos, uno a uno.",
    "Ejemplo con 3 escaños: A 100 votos, B 60 y C 30. Cocientes: A 100 y 50, B 60, C 30 y B 30. Resultado: A 2 escaños, B 1, C 0."],
    "Barrera del 3 % en cada provincia", [["LOREG, art. 163", LOREG]]],
  ["como-se-hace-una-ley", "Cómo se hace una ley", "Del proyecto al BOE", "prog", [
    "La propone el Gobierno (proyecto de ley), los grupos del Congreso o el Senado, un parlamento autonómico o 500.000 ciudadanos con su firma.",
    "El Congreso la debate, la enmienda y la aprueba.",
    "El Senado tiene dos meses para aprobarla, enmendarla o vetarla (el veto requiere mayoría absoluta).",
    "El Congreso puede levantar el veto: con mayoría absoluta enseguida o con mayoría simple pasados dos meses.",
    "El Rey la sanciona en 15 días y se publica en el BOE. Las leyes orgánicas necesitan mayoría absoluta del Congreso en una votación final."],
    "Leyes orgánicas: 176 síes en el Congreso", [["CE, arts. 81 y 87–91", CE + "#a87"]]],
  ["decreto-ley", "Decreto-ley", "La norma urgente del Gobierno", "glos", [
    "Lo dicta el Gobierno solo en caso de «extraordinaria y urgente necesidad».",
    "No puede tocar las instituciones básicas del Estado, los derechos del Título I, el régimen de las comunidades ni el derecho electoral general.",
    "El Congreso tiene 30 días para convalidarlo o derogarlo.",
    "Además, puede tramitarlo como proyecto de ley para cambiarlo con enmiendas."],
    "30 días para que el Congreso lo convalide", [["CE, art. 86", CE + "#a86"]]],
  ["presupuestos-generales", "Presupuestos del Estado", "Las cuentas del año", "data", [
    "El Gobierno los elabora y los presenta al Congreso al menos tres meses antes de que acaben los del año anterior.",
    "Las Cortes los examinan, los enmiendan y los aprueban.",
    "Si el 1 de enero no hay presupuestos nuevos, se prorrogan automáticamente los anteriores."],
    "Sin presupuestos nuevos se prorrogan los anteriores", [["CE, art. 134", CE + "#a134"]]],
  ["adelanto-electoral", "Adelanto electoral", "Cuándo puede el presidente convocar elecciones", "cal", [
    "El presidente puede disolver las Cortes, bajo su exclusiva responsabilidad y tras deliberarlo con el Consejo de Ministros.",
    "No puede hacerlo si hay una moción de censura en trámite.",
    "Tampoco antes de un año desde la disolución anterior, salvo si fracasa la investidura.",
    "Las elecciones se celebran entre 30 y 60 días después de la convocatoria."],
    "Elecciones entre 30 y 60 días después", [["CE, arts. 68 y 115", CE + "#a115"]]],
];
