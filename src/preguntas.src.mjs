// Fuente editable del banco de preguntas de Papeleta 29N.
// `node build.mjs` valida este archivo y genera data/preguntas.json.
//
// Campos de cada pregunta
//   id     Código estable (letra del área + número). No reutilizar códigos retirados.
//   prio   1 = núcleo (siempre en todas las versiones), 2 = importante, 3 = complementaria.
//   type   "likert" (acuerdo 1-5) o "dilema" (1 = opción A, 5 = opción B).
//   dim    Dimensión que mide (ver DIMS) o null si solo sirve para comparar con partidos.
//   dir    +1 si responder 5 acerca al polo B de la dimensión; -1 si lo acerca al polo A.
//   lr     Lectura clásica izquierda-derecha: +1 si responder 5 es la posición habitual de la derecha,
//          -1 si es la de la izquierda, 0 si el tema no se alinea así.
//   ctx    Contexto neutral (40-85 palabras): qué se plantea, conceptos y argumentos de ambos lados.
//   pos    Posturas de las 27 candidaturas en el orden de PARTY_ORDER (partidos.src.mjs):
//          1-5 = postura, 0 = sin postura conocida, sufijo ~ = postura estimada (menos peso).

export const DIMS = [
  { id: "eco", name: "Economía", a: "Más Estado", b: "Más mercado",
    desc: "Cuánto debe intervenir el Estado en la economía: impuestos, gasto público, regulación de precios y empresas públicas frente a más margen para el mercado y la iniciativa privada." },
  { id: "soc", name: "Valores sociales", a: "Progresista", b: "Tradicional",
    desc: "Posición ante cambios en costumbres, familia, religión y derechos individuales: aborto, eutanasia, igualdad de género, laicidad o tradiciones como la tauromaquia." },
  { id: "lib", name: "Libertades y seguridad", a: "Más garantías", b: "Más control",
    desc: "Equilibrio entre libertades individuales y garantías frente al poder, y medidas de orden, castigo o control para proteger la seguridad o la salud." },
  { id: "ter", name: "Modelo territorial", a: "Más autogobierno", b: "Más centralización",
    desc: "Cuánto poder deben tener las comunidades autónomas frente al Estado central: financiación, competencias, lenguas cooficiales y derecho a decidir." },
  { id: "inm", name: "Inmigración", a: "Más apertura", b: "Más control",
    desc: "Política migratoria: regularización, expulsiones, acceso de los extranjeros a ayudas y control de fronteras." },
  { id: "eur", name: "Europa y mundo", a: "Más integración", b: "Más soberanía",
    desc: "Peso que debe tener la Unión Europea y la cooperación internacional frente a la capacidad de decisión propia de España." },
  { id: "amb", name: "Medioambiente", a: "Prioridad ambiental", b: "Prioridad productiva",
    desc: "Cómo equilibrar la protección del medio natural y la lucha contra el cambio climático con la actividad económica, el agua para el regadío o la energía." }
];

export const AREAS = [
  { id: "eco", letter: "A", name: "Economía y modelo productivo", intro: "Impuestos, deuda, pensiones, salarios y el papel del Estado en las empresas." },
  { id: "viv", letter: "B", name: "Vivienda y urbanismo", intro: "Alquiler, construcción, vivienda pública, ocupación y usos turísticos." },
  { id: "ter", letter: "C", name: "Organización territorial", intro: "Cómo se reparten el poder y el dinero entre el Estado, las comunidades y los ayuntamientos." },
  { id: "ins", letter: "D", name: "Calidad democrática e instituciones", intro: "Cómo votamos, cómo se controla al Gobierno y cómo se elige a los jueces." },
  { id: "jus", letter: "E", name: "Justicia, seguridad y libertades", intro: "Penas, garantías procesales, privacidad y libertad de expresión." },
  { id: "dem", letter: "F", name: "Demografía, inmigración y políticas sociales", intro: "Inmigración, natalidad, despoblación, cuidados y protección social." },
  { id: "ene", letter: "G", name: "Energía, medioambiente e infraestructuras", intro: "Nucleares, renovables, agua, transporte y adaptación al clima." },
  { id: "ext", letter: "H", name: "Política exterior y defensa", intro: "La Unión Europea, la OTAN, el gasto militar y las relaciones con el mundo." },
  { id: "edu", letter: "I", name: "Educación, ciencia y cultura", intro: "Colegios, universidad, becas, lenguas y cultura." },
  { id: "san", letter: "J", name: "Sanidad y gestión pública", intro: "Listas de espera, gestión de la sanidad y funcionamiento de la Administración." },
  { id: "rur", letter: "K", name: "Agricultura, pesca y mundo rural", intro: "El campo, la pesca, el comercio agrario y la fauna." },
  { id: "der", letter: "L", name: "Derechos y cuestiones éticas", intro: "Aborto, eutanasia, igualdad, laicidad y derechos digitales." }
];

export const QUESTIONS = [
// ───────────── A · Economía y modelo productivo
{ id: "A01", area: "eco", prio: 2, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "La jornada laboral máxima debería reducirse por ley a 37,5 horas semanales sin rebaja de sueldo.",
  short: "Jornada de 37,5 horas por ley",
  ctx: "La jornada máxima legal es de 40 horas semanales de promedio anual, aunque muchos convenios ya fijan menos. En 2025 el Congreso rechazó el proyecto del Gobierno para bajarla a 37,5 horas. A favor se citan la conciliación y repartir las ganancias de productividad; en contra, el coste para pymes y sectores con poco margen, y la preferencia por pactarlo en la negociación colectiva.",
  ley: "Estatuto de los Trabajadores, art. 34",
  pos: "5 2 1 5 5 1 0 2~ 4 1 3~ 5 2 4~ 5 3~ 5 5~ 5 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "A02", area: "eco", prio: 1, type: "dilema", dim: "eco", dir: -1, lr: -1,
  text: "Si hubiera que elegir, ¿qué debería priorizar el Estado?",
  A: "Bajar impuestos, aunque haya que reducir gasto público",
  B: "Mantener o ampliar los servicios públicos, aunque haya que mantener o subir los impuestos",
  short: "Bajar impuestos o mantener servicios",
  ctx: "España recauda en impuestos y cotizaciones en torno al 37 % del PIB, algo menos que la media de la zona euro, y mantiene déficit público desde hace años. Bajar impuestos deja más renta a familias y empresas y puede estimular la actividad, pero exige recortar gasto o endeudarse. Mantener la recaudación sostiene sanidad, educación o pensiones con una presión fiscal mayor.",
  pos: "4 2 1 5 5 1 0 2 4 2 3~ 5 2 4~ 5 3~ 5~ 5~ 5~ 5~ 3~ 5~ 5~ 0 0 0 0" },
{ id: "A03", area: "eco", prio: 2, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "Debería existir un impuesto estatal sobre las grandes fortunas que se pague en todas las comunidades.",
  short: "Impuesto estatal a las grandes fortunas",
  ctx: "El impuesto de patrimonio está cedido a las comunidades, y algunas, como Madrid, lo bonifican al 100 %. En 2022 el Estado creó un impuesto de solidaridad para patrimonios de más de 3 millones de euros, de modo que se pague en todo el territorio. Sus defensores invocan la equidad y frenar la competencia fiscal entre comunidades; sus críticos, la deslocalización de patrimonios y la invasión de competencias autonómicas.",
  pos: "5 1 1 5 5 1 0 1~ 4 2~ 2~ 5 1 3~ 4~ 2~ 5~ 5~ 5 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "A04", area: "eco", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Reducir la deuda pública debería ser prioritario, aunque obligue a contener el gasto durante varios años.",
  short: "Prioridad a reducir la deuda",
  ctx: "La deuda pública española ronda el 100 % del PIB, por encima de la media de la UE, y las reglas fiscales europeas exigen planes de reducción a varios años. Reducirla libera dinero que hoy se paga en intereses y deja margen para futuras crisis. Aplazarlo permite mantener inversión y gasto social, a cambio de pagar más intereses y depender más de los mercados.",
  pos: "3 4 4 1 1 5 0 5 2~ 4~ 4~ 1~ 4~ 3~ 1~ 3~ 1~ 1~ 2~ 1~ 2~ 2~ 1~ 0 0 0 0" },
{ id: "A05", area: "eco", prio: 2, type: "dilema", dim: "eco", dir: 1, lr: 1,
  text: "Para garantizar las pensiones del futuro, ¿qué debería pesar más?",
  A: "Aumentar cotizaciones e impuestos para mantener la cuantía de las pensiones",
  B: "Contener el gasto: retrasar la jubilación o ligar más la pensión a lo cotizado",
  short: "Cómo sostener las pensiones",
  ctx: "El gasto en pensiones supera el 12 % del PIB y crecerá con la jubilación de la generación del baby boom. Las reformas de 2021 y 2023 garantizaron la revalorización con el IPC y la financiaron con más cotizaciones, como el Mecanismo de Equidad Intergeneracional. Unos economistas lo consideran suficiente; otros, como la AIReF, advierten de tensiones a largo plazo si no se modera el gasto.",
  pos: "1 3~ 2~ 1 1 3~ 0 4~ 1~ 3~ 2~ 1 3~ 2~ 1~ 2~ 1~ 1~ 1~ 1~ 2~ 1~ 1~ 0 0 0 0" },
{ id: "A06", area: "eco", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Habría que suavizar las obligaciones que se activan cuando una empresa supera los 50 trabajadores, para que las pymes crezcan.",
  short: "Menos trabas al crecimiento de las pymes",
  ctx: "Al superar ciertos tamaños, las empresas asumen nuevas obligaciones: comité de empresa a partir de 50 trabajadores, auditoría obligatoria o un control más estricto de Hacienda al facturar más de 6 millones. Estudios del Banco de España observan muchas empresas justo por debajo de esos umbrales, lo que frena la productividad. Suavizarlos favorecería el crecimiento; sus críticos temen menos protección laboral y control fiscal.",
  pos: "2~ 4~ 4~ 1~ 1~ 5~ 0 5~ 2~ 4~ 4~ 1~ 4~ 0 1~ 4~ 1~ 0 2~ 0 0 0 0 0 0 0 0" },
{ id: "A07", area: "eco", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Habría que eliminar el límite de 1.000 euros para los pagos en efectivo.",
  short: "Eliminar el límite a los pagos en efectivo",
  ctx: "Desde 2021 los pagos en efectivo en los que interviene una empresa o un profesional están limitados a 1.000 euros. Las estimaciones sitúan la economía sumergida entre el 10 % y el 20 % del PIB, según el método. Los defensores del límite sostienen que dificulta cobrar sin factura y facilita perseguir el fraude; sus críticos defienden la privacidad y a quienes dependen del efectivo, como muchas personas mayores, y dudan de su eficacia.",
  pos: "2~ 4~ 5 1~ 1~ 5~ 0 3~ 2~ 4~ 3~ 2~ 4~ 0 2~ 0 0 0 2~ 0 0 0 0 0 0 0 0" },
{ id: "A08", area: "eco", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Las subidas del salario mínimo deberían frenarse hasta que crezca la productividad.",
  short: "Frenar las subidas del salario mínimo",
  ctx: "El salario mínimo ha subido más de un 65 % desde 2018, hasta 1.221 euros en 14 pagas en 2026, y el Gobierno lo vincula al 60 % del salario medio que recomienda la Carta Social Europea. Sus defensores destacan la reducción de la pobreza entre quienes trabajan; sus críticos, el efecto sobre el empleo en el campo, el pequeño comercio o las regiones con salarios más bajos.",
  pos: "1 3~ 4~ 1 1 5~ 0 4~ 1~ 4~ 3~ 1 4~ 2~ 1 3~ 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },
{ id: "A09", area: "eco", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "El Estado debería vender sus participaciones en empresas como Telefónica o Indra.",
  short: "Vender las participaciones públicas en empresas",
  ctx: "En 2024 la SEPI, el holding empresarial del Estado, compró un 10 % de Telefónica tras la entrada de un fondo saudí, y es el primer accionista de Indra. El Gobierno lo justifica para proteger sectores estratégicos como las telecomunicaciones o la defensa; sus críticos ven riesgo de injerencia política y gasto público. La alternativa es controlar las inversiones extranjeras con autorizaciones, sin entrar en el capital.",
  pos: "1 3~ 3~ 1~ 2~ 5~ 0 5~ 3~ 4~ 3~ 2~ 4~ 3~ 2~ 3~ 2~ 2~ 2~ 2~ 3~ 2~ 2~ 0 0 0 0" },
{ id: "A10", area: "eco", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "El impuesto de sucesiones debería eliminarse en las herencias entre padres e hijos.",
  short: "Sin impuesto de sucesiones entre padres e hijos",
  ctx: "El impuesto de sucesiones es estatal, pero lo gestionan las comunidades, que fijan bonificaciones: en Madrid, Andalucía o Canarias las herencias entre padres e hijos apenas tributan, y en otras sí a partir de ciertos importes. Quienes piden eliminarlo alegan que ese patrimonio ya pagó impuestos al generarse; quienes lo defienden lo ven como una herramienta para reducir la desigualdad entre quienes heredan y quienes no.",
  pos: "2 5 5 1 1 5~ 0 5 1~ 3~ 2~ 1 4~ 2~ 1~ 4 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },

// ───────────── B · Vivienda y urbanismo
{ id: "B01", area: "viv", prio: 1, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "El Estado debería poder limitar el precio del alquiler en las zonas donde los precios se han disparado.",
  short: "Topes al alquiler en zonas tensionadas",
  ctx: "La Ley de Vivienda de 2023 permite a las comunidades declarar «zonas de mercado tensionado» y limitar allí las rentas; Cataluña fue la primera en aplicarla. Sus defensores señalan bajadas de precio en los contratos afectados; sus críticos, que se reduce la oferta de alquiler habitual y crece el de temporada. El debate es si limitar precios ayuda más que construir o dar incentivos fiscales.",
  ley: "Ley 12/2023, por el derecho a la vivienda",
  pos: "5 1 1 5 5 1~ 0 1~ 5 2 3 5 1 4~ 5 2~ 5 5~ 5 5~ 3~ 5~ 5 0 0 0 0" },
{ id: "B02", area: "viv", prio: 2, type: "dilema", dim: "eco", dir: -1, lr: -1,
  text: "¿Qué debería priorizarse para abaratar la vivienda?",
  A: "Construir mucho más, liberando suelo y agilizando licencias",
  B: "Regular los precios y ampliar la vivienda pública",
  short: "Construir más o regular precios",
  ctx: "España termina unas 100.000 viviendas al año, por debajo de los nuevos hogares que se forman, y el Banco de España estima un déficit de varios cientos de miles. Quienes priorizan construir sostienen que el precio solo baja si aumenta la oferta; quienes priorizan regular y la vivienda pública argumentan que el mercado no produce vivienda asequible por sí solo y que construir tarda años en notarse.",
  pos: "4 1 1 5 5 1~ 0 1~ 4~ 2~ 3~ 5 1~ 4~ 5~ 2~ 5~ 5~ 4~ 4~ 3~ 5~ 5~ 0 0 0 0" },
{ id: "B03", area: "viv", prio: 2, type: "likert", dim: "lib", dir: 1, lr: 1,
  text: "Si alguien ocupa sin permiso una vivienda vacía de un particular, el propietario debería poder recuperarla en 48 horas.",
  short: "Desalojo en 48 horas de viviendas ocupadas",
  ctx: "Entrar en una vivienda que es morada de alguien, incluidas, según la Fiscalía, las segundas residencias, es allanamiento, y la policía puede actuar de inmediato. El debate está en la ocupación de viviendas vacías, que se resuelve por vía judicial como usurpación; desde 2025 estos casos pueden ir por juicio rápido. Quienes piden desalojos en 48 horas priorizan la propiedad; sus críticos advierten del riesgo de errores sin control judicial previo y de situaciones de vulnerabilidad.",
  pos: "3 5 5 1 1 5 0 5 2 5 4 1 5 2~ 1 4~ 1~ 1~ 2~ 1~ 3~ 1~ 1~ 0 0 0 0" },
{ id: "B04", area: "viv", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Debería levantarse la suspensión de desahucios de familias vulnerables cuando el propietario es un particular.",
  short: "Fin de la suspensión de desahucios si el dueño es particular",
  ctx: "Desde 2020, un «escudo social» prorrogado varias veces permite suspender el desahucio de familias vulnerables sin alternativa de vivienda, con compensaciones al propietario. En 2026 el Congreso rechazó tres decretos que lo prorrogaban, y en octubre el Gobierno lo volvió a aprobar, pendiente de convalidación. Sus defensores lo consideran una protección básica mientras falte vivienda social; sus críticos, que traslada a propietarios particulares una obligación que corresponde a la Administración y que facilita impagos prolongados.",
  pos: "4 5 5 2~ 1 5~ 0 5~ 1~ 4 3~ 1 5~ 2~ 1~ 4~ 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },
{ id: "B05", area: "viv", prio: 2, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "Los ayuntamientos deberían poder prohibir nuevos pisos turísticos en los barrios con problemas de vivienda.",
  short: "Prohibir nuevos pisos turísticos",
  ctx: "España tiene más de 350.000 viviendas de uso turístico. Desde 2025 abrir un piso turístico en un edificio exige el permiso de la comunidad de propietarios, y Barcelona ha anunciado que eliminará todas sus licencias en 2028. Los defensores de prohibirlos buscan devolver viviendas al alquiler residencial; sus críticos alertan de la pérdida de ingresos de pequeños propietarios y de un efecto limitado sobre los precios.",
  pos: "4 3~ 2 5 5 2~ 0 3~ 5 3~ 4~ 5 3~ 4~ 5~ 4 5 5 5 4~ 3~ 5 5 0 0 0 0" },
{ id: "B06", area: "viv", prio: 3, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "Las viviendas vacías durante años deberían pagar un recargo fiscal elevado.",
  short: "Recargo fiscal a las viviendas vacías",
  ctx: "El censo de 2021 contó unos 3,8 millones de viviendas vacías, aunque muchas están en zonas rurales o necesitan reformas. La Ley de Vivienda permite a los ayuntamientos subir hasta un 150 % el IBI de los pisos vacíos más de dos años. Los defensores buscan que salgan al mercado; sus críticos recuerdan que muchas no son habitables ni están donde hay demanda, y que el recargo penaliza a pequeños propietarios.",
  pos: "4 1 1 5 5 1~ 0 2~ 5~ 2~ 3~ 5~ 1~ 4~ 5~ 2~ 5~ 5~ 5~ 5~ 2~ 5~ 5~ 0 0 0 0" },
{ id: "B07", area: "viv", prio: 3, type: "likert", dim: "eco", dir: -1, lr: 0,
  text: "La compra de vivienda por extranjeros no residentes de fuera de la UE debería tener un impuesto especial.",
  short: "Impuesto a compradores no residentes",
  ctx: "En 2025 el Gobierno propuso un recargo de hasta el 100 % para estas compras: según sus datos, unas 27.000 viviendas al año, concentradas en la costa, Baleares, Canarias y grandes ciudades. Sus defensores buscan frenar la demanda especulativa en las zonas tensionadas; sus críticos dudan de su eficacia y de su encaje con las normas europeas, y temen perder inversión.",
  pos: "5 2 3~ 5 5 2~ 0 1~ 5~ 3~ 3~ 5~ 2~ 4~ 5~ 3~ 5 5 5~ 5~ 0 5 5~ 0 0 0 0" },
{ id: "B08", area: "viv", prio: 3, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "El Estado debería construir directamente un gran parque de vivienda pública en alquiler.",
  short: "Gran parque público de alquiler",
  ctx: "La vivienda social supone en torno al 2,5 % del total en España, frente a cerca del 9 % de media en la UE. En 2025 el Gobierno creó la empresa pública Casa 47 para promover y gestionar alquiler asequible. Otros partidos prefieren la colaboración público-privada: ceder suelo público a promotores a cambio de precios limitados durante años, para movilizar más inversión con menos gasto público.",
  pos: "5 2 2 5 5 2~ 0 2~ 5 3~ 4~ 5 2~ 5~ 5 3~ 5 5 5 5 4~ 5 5 4~ 4~ 4~ 0" },
{ id: "B09", area: "viv", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "El Estado debería avalar parte de la hipoteca de los jóvenes para que puedan comprar su primera vivienda.",
  short: "Avales públicos a hipotecas de jóvenes",
  ctx: "Desde 2023 el ICO avala hasta el 20 % de la hipoteca a menores de 35 años y familias con hijos con ingresos limitados, para cubrir la entrada que los bancos no financian. Facilita el acceso a la propiedad; sus críticos advierten de que, sin más oferta, estas ayudas pueden empujar los precios al alza y de que el riesgo de impago recae en el Estado.",
  pos: "5 5 4~ 2~ 1~ 3~ 0 4~ 3~ 4~ 3~ 2~ 4~ 3~ 2~ 4~ 2~ 2~ 3~ 2~ 0 2~ 2~ 0 0 0 0" },

// ───────────── C · Organización territorial
{ id: "C01", area: "ter", prio: 1, type: "likert", dim: "ter", dir: -1, lr: -1,
  text: "Cataluña debería recaudar y gestionar todos sus impuestos, con un sistema propio parecido al del País Vasco.",
  short: "Financiación singular para Cataluña",
  ctx: "El País Vasco y Navarra recaudan casi todos sus impuestos y pagan al Estado un cupo por los servicios comunes, por derechos históricos reconocidos en la Constitución. Las demás comunidades se financian con un sistema común de impuestos cedidos y fondos de nivelación. En 2024 PSC y ERC pactaron una «financiación singular» para Cataluña. A favor se invoca la corresponsabilidad fiscal; en contra, la solidaridad entre territorios.",
  ley: "Constitución, art. 156-158 y disp. adicional 1.ª",
  pos: "2 1 1 3 3~ 1~ 0 1 5 5 5 5 2~ 4~ 5 3~ 3~ 3~ 2 2~ 1~ 4~ 2~ 1~ 1~ 1~ 1~" },
{ id: "C02", area: "ter", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "La reforma de la financiación autonómica debería dar más recursos a las comunidades que hoy reciben menos por habitante.",
  short: "Más fondos a las comunidades peor financiadas",
  ctx: "El sistema actual se aprobó en 2009 y debía revisarse en 2014; en enero de 2026 el Gobierno propuso un nuevo modelo con unos 21.000 millones más. Entre las comunidades de régimen común, la financiación por habitante ajustado varía en torno a un 30 %: Cantabria o La Rioja reciben más, y la Comunitat Valenciana, Murcia o Andalucía, menos. Igualarla exige más dinero del Estado o quitar a otras, y cada comunidad defiende criterios (población, envejecimiento, dispersión) que la favorecen.",
  pos: "4~ 4~ 3~ 4~ 4~ 3~ 0 4~ 2~ 2~ 0 0 0 0 2~ 2~ 2~ 2~ 5 2~ 2~ 4~ 5~ 4~ 2~ 2~ 0" },
{ id: "C03", area: "ter", prio: 2, type: "likert", dim: "ter", dir: 1, lr: 1,
  text: "El Estado debería recuperar la competencia de educación, que hoy gestionan las comunidades autónomas.",
  short: "Recentralizar la educación",
  ctx: "La educación está transferida a todas las comunidades desde el año 2000: el Estado fija las enseñanzas mínimas y los títulos, y las comunidades gestionan centros, profesorado y buena parte del currículo. Quienes piden recentralizarla apuntan a desigualdades entre territorios y a usos políticos del currículo o la lengua; quienes se oponen defienden la gestión cercana y el autogobierno de los estatutos.",
  ley: "Constitución, art. 149.1.30.ª",
  pos: "1 2 5 1 1 5~ 0 4 1 1 1 1 1 1 1 1 1 1 1 1 2~ 1 1 0 1~ 0 0" },
{ id: "C04", area: "ter", prio: 2, type: "likert", dim: "ter", dir: -1, lr: -1,
  text: "España debería reformar la Constitución para convertirse en un Estado federal.",
  short: "Estado federal",
  ctx: "La Constitución creó un Estado autonómico con amplias competencias para las comunidades, pero sin una cámara que represente realmente a los territorios ni mecanismos estables de cooperación. Un modelo federal fijaría en la Constitución el reparto de competencias y daría voz a las comunidades en las decisiones del Estado. Sus críticos temen que abra la puerta a más diferencias entre territorios; algunos nacionalistas lo consideran insuficiente.",
  ley: "Constitución, título VIII",
  pos: "4 1 1 5 5 1~ 0 1 2~ 2~ 3~ 2~ 1 4~ 3~ 3~ 4~ 4~ 5 5 3~ 4~ 4~ 0 0 0 0" },
{ id: "C05", area: "ter", prio: 2, type: "likert", dim: "ter", dir: -1, lr: -1,
  text: "Debería poder celebrarse un referéndum de independencia pactado si lo pide una mayoría clara de una comunidad.",
  short: "Referéndum de independencia pactado",
  ctx: "La Constitución atribuye la soberanía al conjunto del pueblo español, y el Tribunal Constitucional anuló las consultas unilaterales, como la catalana de 2017. Un referéndum pactado, como el de Escocia en 2014, exigiría según la mayoría de los juristas reformar la Constitución. Sus defensores apelan al principio democrático; sus detractores, a la unidad de la soberanía y a los riesgos de división social.",
  ley: "Constitución, art. 1.2 y 2",
  pos: "1 1 1 3~ 5 1~ 0 1 5 5 4 5 1 4~ 5 2~ 4~ 4~ 4~ 4~ 1~ 4~ 4~ 1~ 2~ 1~ 1~" },
{ id: "C06", area: "ter", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "Las diputaciones provinciales deberían suprimirse y sus funciones pasar a comunidades y ayuntamientos.",
  short: "Suprimir las diputaciones",
  ctx: "Las diputaciones gobiernan cada provincia y apoyan con dinero y técnicos a los municipios pequeños. Sus miembros no se eligen en las urnas, sino entre los concejales. Sus críticos las ven como una capa administrativa redundante y poco transparente; sus defensores, como imprescindibles para que los pueblos pequeños tengan servicios. En el País Vasco las diputaciones forales recaudan los impuestos, y en las islas existen cabildos y consejos insulares.",
  ley: "Constitución, art. 141",
  pos: "2 1 2~ 4~ 5 4~ 0 5 4~ 3~ 1 3~ 1~ 0 4~ 1~ 0 0 4~ 3~ 1~ 0 3~ 1~ 1~ 1~ 1~" },
{ id: "C07", area: "ter", prio: 3, type: "likert", dim: "ter", dir: 1, lr: 0,
  text: "Los municipios muy pequeños deberían fusionarse o compartir obligatoriamente sus servicios.",
  short: "Fusionar municipios pequeños",
  ctx: "España tiene más de 8.100 municipios y casi la mitad no llega a 500 habitantes. Muchos no pueden prestar por sí solos servicios básicos ni tener personal técnico. Fusionarlos o agruparlos podría ahorrar costes y profesionalizar la gestión, como hicieron otros países europeos; sus críticos temen perder identidad, representación y cercanía, sobre todo en la España rural.",
  pos: "2~ 2~ 3~ 2~ 1~ 4~ 0 5 2~ 2~ 2~ 1~ 1~ 0 0 0 0 0 0 1~ 1 0 0 0 1~ 1 1~" },
{ id: "C08", area: "ter", prio: 3, type: "likert", dim: "ter", dir: -1, lr: -1,
  text: "El Senado debería convertirse en una cámara de representación de las comunidades autónomas.",
  short: "Un Senado territorial",
  ctx: "Hoy la mayoría de los senadores se eligen por provincias, cuatro por provincia sea cual sea su población, y el Senado tiene poco peso: el Congreso puede levantar sus vetos. Convertirlo en una cámara territorial, como el Bundesrat alemán, daría voz a los gobiernos autonómicos en las leyes del Estado. Otros proponen suprimirlo o mantenerlo como está.",
  ley: "Constitución, art. 69",
  pos: "4 2~ 1~ 4~ 3~ 1~ 0 2~ 2~ 2~ 3~ 2~ 2~ 3~ 2~ 4~ 3~ 0 4~ 4~ 2~ 3~ 3~ 2~ 2~ 1~ 2~" },
{ id: "C09", area: "ter", prio: 3, type: "likert", dim: "ter", dir: 1, lr: 1,
  text: "El concierto vasco y el convenio navarro deberían reformarse para que esas comunidades aporten más a la caja común.",
  short: "Reformar el concierto vasco y el convenio navarro",
  ctx: "Por sus derechos históricos, el País Vasco y Navarra recaudan casi todos sus impuestos y pagan al Estado un cupo o aportación por las competencias que no ejercen. Sus defensores lo ven como un pacto constitucional de autogobierno y responsabilidad fiscal; sus críticos sostienen que el cálculo del cupo es opaco y que ambas comunidades aportan a la solidaridad interterritorial menos de lo que les correspondería por su renta.",
  ley: "Constitución, disp. adicional 1.ª",
  pos: "1 2 5 3~ 3~ 5~ 0 5 2~ 2~ 1 1 1 1 2~ 2~ 0 0 3~ 0 4~ 0 4~ 0 0 0 0" },

// ───────────── D · Calidad democrática e instituciones
{ id: "D01", area: "ins", prio: 1, type: "likert", dim: null, dir: 0, lr: 0,
  text: "La ley electoral debería ser más proporcional, para que cada voto valga lo mismo en todo el país, aunque las provincias pequeñas pierdan peso.",
  short: "Ley electoral más proporcional",
  ctx: "El Congreso se elige por provincias, con un mínimo de dos diputados cada una. Por eso un escaño cuesta muchos menos votos en Soria o Teruel que en Madrid, y el sistema favorece a los partidos grandes y a los concentrados en un territorio. Una ley más proporcional reflejaría mejor el voto nacional; sus críticos defienden la voz de las provincias despobladas y la estabilidad de los gobiernos.",
  ley: "Constitución, art. 68; Ley Orgánica del Régimen Electoral General",
  pos: "2~ 1 3~ 4 5 4~ 5 5 2~ 1~ 1~ 2~ 1~ 2~ 2~ 1~ 3~ 3~ 3~ 2~ 1 3~ 3~ 1 1 1 1" },
{ id: "D02", area: "ins", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "Los votantes deberían poder elegir a sus candidatos preferidos dentro de la lista de cada partido.",
  short: "Listas desbloqueadas",
  ctx: "Para el Congreso se vota a listas cerradas y bloqueadas: el partido decide el orden y el elector no puede cambiarlo. Con listas desbloqueadas, el votante podría marcar preferencias, como ya ocurre en el Senado, donde se elige a personas concretas. A favor: más vínculo entre representantes y representados; en contra: campañas más personalistas y caras y más luchas internas en los partidos.",
  pos: "2~ 2~ 3~ 4~ 4~ 5~ 4~ 5 2~ 2~ 2~ 2~ 2~ 0 2~ 0 0 0 4~ 0 0 0 0 0 0 0 0" },
{ id: "D03", area: "ins", prio: 2, type: "likert", dim: null, dir: 0, lr: 1,
  text: "Los propios jueces deberían elegir a la mayoría de los miembros del Consejo General del Poder Judicial.",
  short: "Que los jueces elijan el CGPJ",
  ctx: "El CGPJ nombra a los altos cargos judiciales. Desde 1985 sus vocales los eligen el Congreso y el Senado por mayoría de tres quintos, y su bloqueo entre 2018 y 2024 se cerró con la mediación de la Comisión Europea. Las instituciones europeas recomiendan que al menos la mitad de los vocales sean elegidos por los propios jueces. Los partidarios del sistema actual sostienen que aporta legitimidad democrática y evita el corporativismo judicial.",
  ley: "Constitución, art. 122.3",
  pos: "2 5 5 1 1 5~ 0 5 1 2~ 2~ 1 5 2~ 1~ 3~ 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },
{ id: "D04", area: "ins", prio: 2, type: "likert", dim: null, dir: 0, lr: -1,
  text: "Las Cortes deberían poder aprobar amnistías para cerrar conflictos políticos.",
  short: "Amnistías por conflictos políticos",
  ctx: "La Constitución prohíbe los indultos generales, pero no menciona la amnistía. En 2024 las Cortes aprobaron una amnistía para los delitos ligados al proceso independentista catalán, avalada en lo esencial por el Tribunal Constitucional en 2025. Sus defensores la ven como una herramienta para cerrar conflictos y facilitar la convivencia; sus críticos, como una ruptura de la igualdad ante la ley negociada a cambio de apoyos parlamentarios.",
  ley: "Constitución, art. 62.i",
  pos: "4 1 1 5 4 1 0 1 5 5 4 5 1 4~ 4 2 4~ 4~ 5 4~ 0 5~ 4~ 0 0 0 0" },
{ id: "D05", area: "ins", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "Los altos cargos deberían esperar al menos cinco años antes de trabajar en empresas del sector que regulaban.",
  short: "Cinco años contra las puertas giratorias",
  ctx: "Hoy los altos cargos del Gobierno no pueden trabajar durante dos años en empresas relacionadas con las decisiones que tomaron, y varios expresidentes y exministros han acabado en consejos de grandes empresas. Ampliar el plazo dificultaría las «puertas giratorias» y los conflictos de interés; sus críticos advierten de que disuade a profesionales del sector privado de entrar en la Administración.",
  ley: "Ley 3/2015, reguladora del ejercicio del alto cargo",
  pos: "3~ 3~ 4~ 5~ 5 5~ 4~ 5~ 4~ 3~ 2~ 4~ 3~ 0 4~ 0 4~ 4~ 4~ 0 0 0 4~ 0 0 0 0" },
{ id: "D06", area: "ins", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "Las iniciativas legislativas populares con suficientes firmas deberían votarse obligatoriamente en el Congreso en un plazo fijo.",
  short: "Votación obligatoria de las iniciativas populares",
  ctx: "Con 500.000 firmas la ciudadanía puede presentar una iniciativa legislativa popular, aunque no sobre impuestos ni leyes orgánicas. Muchas no llegan a debatirse a fondo o quedan bloqueadas años en el Congreso. Obligar a votarlas en plazo reforzaría la participación directa; sus críticos temen que la usen sobre todo grupos muy organizados y prefieren preservar el margen de la democracia representativa.",
  ley: "Constitución, art. 87.3",
  pos: "3~ 2~ 3~ 5~ 5 5~ 4~ 4~ 4~ 3~ 2~ 4~ 2~ 0 4~ 0 4~ 4~ 4~ 4~ 0 0 4~ 0 0 0 0" },
{ id: "D07", area: "ins", prio: 2, type: "likert", dim: "soc", dir: -1, lr: -1,
  text: "España debería celebrar un referéndum para elegir entre monarquía y república.",
  short: "Referéndum entre monarquía y república",
  ctx: "La Constitución de 1978 establece la monarquía parlamentaria: el Rey es jefe del Estado, con funciones sobre todo simbólicas y de arbitraje. Cambiar la forma de Estado exige una reforma agravada, con disolución de las Cortes y referéndum. Los partidarios de votarlo sostienen que la monarquía no se sometió a votación por separado; los contrarios, que la Constitución ya se aprobó en referéndum y que la monarquía aporta estabilidad.",
  ley: "Constitución, art. 1.3 y 168",
  pos: "2 1 1 4~ 5 2~ 0 1 5 5 4 5 1 4~ 5 3~ 5~ 5~ 5 5 0 5~ 5~ 0 0 0 0" },
{ id: "D08", area: "ins", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "Debería limitarse más la capacidad del Gobierno de aprobar decretos-ley, que entran en vigor antes de pasar por el Parlamento.",
  short: "Limitar los decretos-ley",
  ctx: "El decreto-ley permite al Gobierno aprobar normas con rango de ley en casos de «extraordinaria y urgente necesidad», y el Congreso solo puede convalidarlas o derogarlas en 30 días. Todos los gobiernos recientes lo han usado a menudo; en octubre de 2026, la derrota de dos decretos de vivienda precipitó estas elecciones. Limitarlo refuerza el control parlamentario; usarlo permite actuar rápido con parlamentos fragmentados.",
  ley: "Constitución, art. 86",
  pos: "2~ 4~ 5~ 2~ 3~ 5~ 0 5~ 3~ 4~ 3~ 2~ 4~ 0 3~ 3~ 0 0 3~ 0 0 0 0 0 0 0 0" },
{ id: "D09", area: "ins", prio: 3, type: "likert", dim: null, dir: 0, lr: 1,
  text: "Debería gobernar el partido más votado cuando no exista una mayoría alternativa clara.",
  short: "Que gobierne la lista más votada",
  ctx: "En España el presidente necesita la confianza del Congreso: mayoría absoluta en una primera votación o simple en la segunda, y puede gobernar quien sume más apoyos aunque no haya ganado las elecciones. Que gobierne la lista más votada favorecería la estabilidad y la claridad para el votante; sus críticos sostienen que contradice el sistema parlamentario, en el que gobierna quien reúne una mayoría.",
  ley: "Constitución, art. 99",
  pos: "2 4 3~ 1 1 2~ 1~ 2~ 1 1 1 1 4~ 1~ 1 1~ 1~ 1~ 1~ 1~ 1~ 1~ 1~ 0 0 0 0" },

// ───────────── E · Justicia, seguridad y libertades
{ id: "E01", area: "jus", prio: 1, type: "likert", dim: "lib", dir: 1, lr: 1,
  text: "Las penas para los delincuentes multirreincidentes deberían endurecerse.",
  short: "Penas más duras a multirreincidentes",
  ctx: "Los hurtos leves se castigaban con multas, lo que permitía a algunas personas acumular decenas de detenciones sin entrar en prisión, una queja frecuente de comercios y vecinos de grandes ciudades. En 2026 las Cortes aprobaron, a propuesta de Junts, una reforma que castiga con prisión a quien acumula varios hurtos. Los partidarios de penas más duras buscan disuadir; sus críticos señalan que el problema es la lentitud de los juicios y que más cárcel no reduce por sí sola la reincidencia.",
  pos: "4 5 5 1 1 5 0 5~ 2 5 4~ 1~ 5 2~ 1~ 4~ 1~ 1~ 2~ 1~ 0 1~ 1~ 0 0 0 0" },
{ id: "E02", area: "jus", prio: 2, type: "likert", dim: "lib", dir: -1, lr: -1,
  text: "La prisión permanente revisable debería derogarse.",
  short: "Derogar la prisión permanente revisable",
  ctx: "Desde 2015 el Código Penal permite condenas de prisión indefinida para delitos muy graves, como asesinatos de menores o atentados terroristas, revisables tras 25 a 35 años. El Tribunal Constitucional la avaló en 2021. Sus críticos la consideran contraria a la reinserción que exige la Constitución e innecesaria con las penas máximas existentes; sus defensores, proporcionada a la gravedad de esos crímenes.",
  ley: "Constitución, art. 25.2; Código Penal, art. 36",
  pos: "3~ 1 1 5 5 1~ 0 1~ 5 3~ 5~ 5 1 5~ 5 3~ 5~ 5~ 5~ 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "E03", area: "jus", prio: 2, type: "likert", dim: "lib", dir: -1, lr: -1,
  text: "La Ley de Seguridad Ciudadana, conocida como «ley mordaza», debería derogarse.",
  short: "Derogar la «ley mordaza»",
  ctx: "La ley de 2015 permite multas administrativas, sin juicio previo, por conductas como desobedecer a los agentes, difundir imágenes de policías que pongan en riesgo su seguridad o protestar ante el Congreso, y regula las devoluciones inmediatas en Ceuta y Melilla. Sus críticos la consideran restrictiva de derechos; sus defensores, útil para el orden público. Su reforma ha fracasado en dos legislaturas.",
  ley: "Ley Orgánica 4/2015, de protección de la seguridad ciudadana",
  pos: "4 1 1 5 5 2~ 0 2~ 5 4 4 5 1 5~ 5 3~ 5~ 5~ 5 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "E04", area: "jus", prio: 3, type: "likert", dim: "lib", dir: 1, lr: 1,
  text: "La edad mínima de responsabilidad penal, hoy de 14 años, debería rebajarse para los delitos graves.",
  short: "Rebajar la edad penal",
  ctx: "Los menores de 14 años no responden penalmente, y los de 14 a 17 se rigen por la Ley del Menor, que prioriza la reeducación, con internamientos de hasta ocho años en los casos más graves. Tras varios delitos graves cometidos por niños, algunos partidos piden rebajar la edad; muchos especialistas en justicia juvenil sostienen que no reduciría la delincuencia y prefieren reforzar la intervención educativa.",
  ley: "Ley Orgánica 5/2000, de responsabilidad penal de los menores",
  pos: "1 3~ 5 1 1 5~ 0 3~ 1 3~ 1~ 1 3~ 1~ 1 2~ 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },
{ id: "E05", area: "jus", prio: 3, type: "likert", dim: "lib", dir: -1, lr: -1,
  text: "El uso policial del reconocimiento facial en espacios públicos debería prohibirse.",
  short: "Prohibir el reconocimiento facial policial",
  ctx: "El Reglamento europeo de Inteligencia Artificial prohíbe con carácter general la identificación biométrica en tiempo real en espacios públicos, con excepciones sujetas a autorización previa, como buscar a víctimas de secuestro o prevenir un atentado. Sus partidarios lo ven como una herramienta eficaz contra el crimen; sus críticos alertan del riesgo de vigilancia masiva, de errores de identificación y de la pérdida de privacidad.",
  ley: "Reglamento (UE) 2024/1689 de Inteligencia Artificial, art. 5",
  pos: "3~ 2~ 1~ 5~ 5~ 1~ 0 3~ 5~ 3~ 4~ 5~ 2~ 0 5~ 0 5~ 5~ 5~ 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "E06", area: "jus", prio: 3, type: "likert", dim: "lib", dir: -1, lr: -1,
  text: "Las injurias a la Corona deberían dejar de ser delito.",
  short: "Despenalizar las injurias a la Corona",
  ctx: "El Código Penal castiga las injurias y calumnias contra el Rey y la familia real con penas más graves que las ordinarias, y ha dado lugar a condenas de raperos y usuarios de redes. El Tribunal Europeo de Derechos Humanos ha condenado a España en casos así por vulnerar la libertad de expresión. Sus defensores creen que protege la dignidad de la jefatura del Estado; sus críticos, que ninguna institución debe quedar blindada frente a la crítica.",
  ley: "Código Penal, art. 490-491",
  pos: "4 1 1 5 5 2~ 0 2~ 5 5 4~ 5 1 4~ 5 3~ 5~ 5~ 5~ 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "E07", area: "jus", prio: 3, type: "likert", dim: null, dir: 0, lr: -1,
  text: "La acusación popular, que permite a quien no es víctima ejercer la acusación en un proceso penal, debería limitarse.",
  short: "Limitar la acusación popular",
  ctx: "La Constitución permite ejercer la acusación popular en un proceso penal sin ser víctima. La usan asociaciones, sindicatos y partidos, y ha impulsado causas contra políticos y familiares de distinto signo. En 2025 el PSOE propuso restringirla para evitar su uso partidista; sus críticos sostienen que debilitaría el control ciudadano de la corrupción y del poder, sobre todo cuando la Fiscalía no actúa.",
  ley: "Constitución, art. 125",
  pos: "5 1 1 4~ 3~ 1~ 0 1~ 4~ 2~ 3~ 4~ 1~ 3~ 3~ 2~ 3~ 3~ 4~ 3~ 0 3~ 3~ 0 0 0 0" },
{ id: "E08", area: "jus", prio: 2, type: "likert", dim: "soc", dir: 1, lr: 1,
  text: "La Ley de Violencia de Género debería sustituirse por una ley de violencia intrafamiliar que no distinga según el sexo de la víctima y del agresor.",
  short: "Sustituir la Ley de Violencia de Género",
  ctx: "La Ley Integral de 2004 trata la violencia de hombres contra sus parejas o exparejas mujeres como un fenómeno específico, con juzgados especializados, medidas de protección y penas agravadas; el Constitucional la avaló en 2008. Quienes proponen sustituirla sostienen que vulnera la igualdad ante la ley; quienes la defienden, que la violencia machista tiene causas propias y que la ley ha mejorado la protección de las víctimas.",
  ley: "Ley Orgánica 1/2004, de violencia de género",
  pos: "1 2 5 1 1 5~ 1~ 2~ 1 1 1 1 2~ 1 1 1~ 1 1~ 1 1~ 0 1~ 1 0 0 0 0" },
{ id: "E09", area: "jus", prio: 3, type: "likert", dim: "lib", dir: -1, lr: -1,
  text: "Debería legalizarse y regularse la venta de cannabis para uso adulto.",
  short: "Legalizar el cannabis",
  ctx: "En España consumir cannabis en privado no es delito, pero venderlo sí, y consumirlo en la calle se sanciona. Desde 2025 se permite el cannabis medicinal en farmacias hospitalarias. Regular su venta, como en Canadá, Uruguay o en parte en Alemania, permitiría controlar la calidad y recaudar impuestos; sus detractores temen más consumo, sobre todo entre jóvenes, y efectos sobre la salud mental.",
  pos: "2 1 1 5 5 2~ 0 4 5 4~ 3~ 5 1 4~ 4~ 2~ 5~ 5~ 5 4~ 0 5~ 4~ 0 0 0 0" },

// ───────────── F · Demografía, inmigración y políticas sociales
{ id: "F01", area: "dem", prio: 1, type: "likert", dim: "inm", dir: -1, lr: -1,
  text: "España debería regularizar a los inmigrantes en situación irregular que ya viven y trabajan aquí.",
  short: "Regularización de inmigrantes",
  ctx: "Funcas estimaba en unas 840.000 las personas sin permiso de residencia a comienzos de 2025, muchas trabajando en la economía sumergida. En abril de 2026 el Gobierno aprobó por real decreto una regularización extraordinaria, que recogía una iniciativa popular respaldada por más de 600.000 firmas y recibió más de 1,1 millones de solicitudes. Sus defensores destacan la integración, los derechos y las cotizaciones; sus críticos temen un «efecto llamada» y prefieren vías individuales como el arraigo.",
  pos: "5 2 1 5 5 1 0 2~ 4 2 4 5 2~ 5~ 5 3~ 5 5~ 5 5~ 3~ 5~ 5 0 0 0 0" },
{ id: "F02", area: "dem", prio: 2, type: "likert", dim: "inm", dir: 1, lr: 1,
  text: "Los inmigrantes en situación irregular deberían ser expulsados, aunque lleven años viviendo y trabajando en España.",
  short: "Expulsar a los inmigrantes irregulares",
  ctx: "La ley prevé expulsar a quien está en España sin permiso, pero se ejecutan pocas expulsiones: requieren identificar el país de origen y que este acepte el retorno. Tras dos años de estancia, el arraigo permite regularizarse si se cumplen requisitos como un contrato o una formación. Vox defiende expulsiones masivas («remigración»); otros partidos proponen expulsar solo a quienes delinquen y regularizar al resto por vías ordinarias.",
  pos: "1 2 5 1 1 5 0 2~ 1 3~ 2~ 1 2~ 1~ 1 2~ 1 1~ 1 1~ 2~ 1~ 1 0 0 0 0" },
{ id: "F03", area: "dem", prio: 2, type: "likert", dim: "inm", dir: 1, lr: 1,
  text: "Los españoles deberían tener prioridad sobre los extranjeros residentes en el acceso a ayudas sociales y vivienda pública.",
  short: "«Prioridad nacional» en ayudas",
  ctx: "Los extranjeros con residencia legal acceden hoy a las prestaciones en las mismas condiciones que los españoles, aunque muchas ayudas exigen años de empadronamiento. Vox propone la «prioridad nacional», y varios gobiernos autonómicos han endurecido los requisitos de residencia previa. Sus defensores sostienen que los recursos son limitados y deben atender primero a los nacionales; sus críticos, que discrimina por nacionalidad, choca con la Constitución y el derecho europeo y afecta a personas que trabajan y cotizan aquí.",
  pos: "1 2 5 1 1 5~ 0 1~ 1 2~ 2~ 1 2~ 1~ 1 2~ 1 1~ 1 1~ 1~ 1~ 1 0 0 0 0" },
{ id: "F04", area: "dem", prio: 3, type: "likert", dim: "inm", dir: -1, lr: -1,
  text: "España debería facilitar la llegada legal de trabajadores extranjeros para ocupar los empleos que quedan sin cubrir.",
  short: "Facilitar la inmigración laboral legal",
  ctx: "Sin inmigración, la población en edad de trabajar se reduciría en las próximas décadas, y sectores como el campo, la hostelería, la construcción o los cuidados tienen dificultades para cubrir puestos. Facilitar la llegada legal, por ejemplo con contratación en origen, cubre vacantes y aporta cotizantes; sus críticos temen presión sobre salarios, vivienda y servicios, y prefieren priorizar el empleo de los parados.",
  pos: "5 3 1 5 5 1~ 0 4~ 4~ 3~ 4~ 4~ 3~ 4~ 4~ 4~ 5~ 5~ 5~ 5~ 4~ 4~ 4~ 3~ 3~ 4~ 0" },
{ id: "F05", area: "dem", prio: 3, type: "likert", dim: "inm", dir: -1, lr: -1,
  text: "Los menores migrantes no acompañados deberían repartirse obligatoriamente entre todas las comunidades autónomas.",
  short: "Reparto obligatorio de menores migrantes",
  ctx: "La tutela de los menores que llegan solos corresponde a la comunidad donde se encuentran, y Canarias llegó a tener más de 5.000 a su cargo. En 2025 una reforma de la Ley de Extranjería estableció un reparto obligatorio cuando una comunidad supera su capacidad. Sus defensores lo ven como solidaridad entre territorios; varias comunidades lo rechazan por falta de recursos o de acuerdo y lo han recurrido ante el Constitucional.",
  pos: "5 2 1 5 5 1~ 0 3~ 3~ 2 3~ 4~ 2~ 4~ 3~ 5 5 5 4~ 4~ 3~ 3~ 4~ 0 0 0 0" },
{ id: "F06", area: "dem", prio: 3, type: "likert", dim: "eco", dir: -1, lr: 0,
  text: "Todas las familias deberían recibir una ayuda mensual por cada hijo menor, sin depender de sus ingresos.",
  short: "Ayuda universal por hijo",
  ctx: "España tiene una de las natalidades más bajas del mundo, con unos 1,1 hijos por mujer. Hoy las ayudas por hijo dependen sobre todo de la renta, como el complemento de ayuda a la infancia, o de deducciones para madres trabajadoras. Una prestación universal, como las de Alemania o Irlanda, llegaría a todas las familias y sería más sencilla de gestionar; sus críticos alegan su alto coste y que beneficia también a quien no la necesita.",
  pos: "3~ 3~ 4~ 5 5 3~ 0 2~ 4~ 3~ 3~ 4~ 3~ 0 4~ 0 5~ 4~ 4~ 4~ 0 4~ 4~ 0 0 0 0" },
{ id: "F07", area: "dem", prio: 2, type: "likert", dim: null, dir: 0, lr: 0,
  text: "Las zonas rurales despobladas deberían tener impuestos más bajos que las ciudades.",
  short: "Menos impuestos en zonas despobladas",
  ctx: "Más de la mitad de los municipios españoles pierde población, y provincias como Soria, Teruel o Cuenca tienen densidades muy bajas. Desde 2022 sus empresas tienen rebajas en las cotizaciones sociales, que la UE permite en zonas muy despobladas. Extender la fiscalidad diferenciada atraería población y empleo, según sus defensores; sus críticos dudan de su eficacia frente a la falta de servicios y advierten de agravios con otros territorios.",
  pos: "4~ 4 4~ 3~ 3~ 3~ 0 3~ 0 0 0 0 3~ 0 3~ 0 0 0 3~ 4~ 5 0 3~ 5 5 5 5" },
{ id: "F08", area: "dem", prio: 3, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "La atención a la dependencia debería ser un servicio público universal, aunque haya que subir impuestos para financiarla.",
  short: "Dependencia como servicio público universal",
  ctx: "Más de 250.000 personas esperan la valoración de su dependencia o la ayuda que ya tienen reconocida, y muchas fallecen antes. El sistema se financia entre el Estado y las comunidades y descansa en gran medida en cuidadoras familiares. Convertirlo en un servicio universal reduciría esperas y profesionalizaría los cuidados, con un fuerte aumento del gasto. La alternativa es combinar ayudas públicas con seguros y servicios privados.",
  pos: "4 2~ 2~ 5 5 1~ 0 2~ 4~ 3~ 3~ 5 3~ 4~ 5 3~ 5~ 5~ 5~ 5~ 4~ 5~ 5~ 0 0 0 0" },
{ id: "F09", area: "dem", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "El Ingreso Mínimo Vital debería exigir búsqueda activa de empleo a quienes pueden trabajar.",
  short: "Más condiciones al Ingreso Mínimo Vital",
  ctx: "El Ingreso Mínimo Vital, creado en 2020, garantiza unos ingresos mínimos a hogares en pobreza y llega a más de 700.000 hogares; se puede compatibilizar en parte con un salario. Exigir búsqueda activa de empleo pretende evitar que desincentive trabajar; sus críticos recuerdan que buena parte de los beneficiarios son menores o personas que no pueden trabajar y que muchos hogares con derecho ni siquiera lo solicitan.",
  pos: "2~ 4~ 4 1 1 5~ 0 4~ 1~ 3~ 3~ 1 4~ 2~ 1~ 3~ 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },

// ───────────── G · Energía, medioambiente e infraestructuras
{ id: "G01", area: "ene", prio: 1, type: "likert", dim: "amb", dir: 1, lr: 1,
  text: "España debería alargar la vida de sus centrales nucleares más allá del calendario de cierre previsto, que termina en 2035.",
  short: "Alargar la vida de las nucleares",
  ctx: "Los siete reactores españoles producen alrededor del 20 % de la electricidad. El plan pactado con las eléctricas en 2019 prevé cerrarlos de forma escalonada hasta 2035, aunque en 2026 el Gobierno prorrogó Almaraz, el primero de la lista, hasta 2030. El apagón de abril de 2025 reabrió el debate. Sus defensores destacan que es una fuente estable y sin emisiones de CO₂; sus detractores, los residuos, el coste de prolongarlas y que las renovables con almacenamiento pueden sustituirlas.",
  pos: "2 5 5 1 1 5~ 1 5 2 3 3~ 1 4~ 1~ 1 3~ 1~ 1~ 1 1~ 2~ 1~ 1~ 0 3~ 0 3~" },
{ id: "G02", area: "ene", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "Las grandes plantas solares y eólicas deberían limitarse en el campo para proteger el paisaje y la agricultura, aunque eso frene la transición energética.",
  short: "Limitar las macroplantas renovables",
  ctx: "Las renovables ya producen más de la mitad de la electricidad en España. Su expansión ha llevado grandes parques solares y eólicos a zonas rurales, con rechazo de parte de los vecinos por el paisaje, la pérdida de suelo agrícola o el poco empleo local. Quienes piden limitarlos buscan proteger el territorio; los defensores de estas plantas recuerdan que generan ingresos a ayuntamientos y propietarios y abaratan la electricidad.",
  pos: "1 3~ 4~ 2~ 3~ 4~ 3~ 2~ 2~ 3~ 2~ 3~ 3~ 0 3~ 3~ 3~ 4~ 3~ 4~ 5 3~ 3~ 4~ 4~ 5 4~" },
{ id: "G03", area: "ene", prio: 2, type: "likert", dim: "amb", dir: -1, lr: -1,
  text: "La prohibición europea de vender coches nuevos de gasolina y diésel a partir de 2035 debería mantenerse.",
  short: "Fin de los coches de combustión en 2035",
  ctx: "La UE decidió en 2023 que desde 2035 solo se vendan coches nuevos sin emisiones de CO₂, lo que en la práctica supone el coche eléctrico; en diciembre de 2025 la Comisión propuso rebajar la exigencia a un 90 % menos de emisiones. La medida busca descarbonizar el transporte y dar certidumbre a la industria; sus críticos alegan el precio de los eléctricos, la escasez de puntos de recarga y el impacto en la industria del automóvil, muy relevante en España, y piden flexibilizarla.",
  pos: "5 2 1 5 5 1 5~ 3~ 4~ 3~ 3~ 4~ 2~ 4~ 4~ 3~ 5~ 5~ 5~ 4~ 2~ 5~ 4~ 2~ 2~ 2~ 0" },
{ id: "G04", area: "ene", prio: 2, type: "likert", dim: "amb", dir: 1, lr: 1,
  text: "Habría que ampliar los trasvases de agua entre cuencas para garantizar el regadío en las zonas con escasez.",
  short: "Ampliar los trasvases de agua",
  ctx: "El trasvase Tajo-Segura lleva agua desde 1979 al sureste, donde sostiene buena parte de la agricultura de Murcia, Alicante y Almería. La reducción de los envíos para garantizar caudales ecológicos en el Tajo ha enfrentado a comunidades. Los partidarios de más trasvases hablan de solidaridad hídrica; los contrarios defienden los ríos de origen y proponen desalación, reutilización y modernizar regadíos.",
  pos: "2 4~ 5 1 1 4~ 1~ 3~ 1~ 1~ 0 1~ 2~ 0 1~ 0 0 0 3~ 1 1 0 2~ 3~ 3~ 1~ 0" },
{ id: "G05", area: "ene", prio: 3, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "El Estado debería crear una empresa pública de energía para abaratar la factura de la luz.",
  short: "Empresa pública de energía",
  ctx: "La electricidad la producen y venden empresas privadas en un mercado en el que el precio lo marca la última central necesaria, a menudo una de gas. Una empresa pública podría gestionar las centrales hidroeléctricas cuyas concesiones caducan y vender a precio de coste; sus críticos dudan de que abarate la factura, temen ineficiencia y prefieren reformar el mercado o bajar impuestos a la luz.",
  pos: "2 1 2~ 5 5 2~ 0 1~ 4~ 2~ 1~ 5 1~ 4~ 5 2~ 5~ 5~ 5~ 5~ 3~ 5~ 5~ 0 0 0 0" },
{ id: "G06", area: "ene", prio: 3, type: "dilema", dim: null, dir: 0, lr: 0,
  text: "¿Qué debería priorizar la inversión ferroviaria?",
  A: "Completar y mejorar la red de alta velocidad",
  B: "Mejorar las Cercanías y los trenes regionales",
  short: "Alta velocidad o Cercanías",
  ctx: "España tiene la mayor red de alta velocidad de Europa, con más de 4.000 kilómetros, mientras que las Cercanías y los trenes regionales, que usan muchas más personas cada día, acumulan retrasos e incidencias, como las de Rodalies en Cataluña. Priorizar la alta velocidad acerca capitales y vertebra el país; priorizar Cercanías y media distancia mejora la movilidad diaria y la conexión de zonas rurales.",
  pos: "3~ 2~ 2~ 5~ 5~ 3~ 4~ 3~ 5 5~ 3~ 5~ 2~ 3~ 3~ 0 0 0 4~ 4~ 2~ 0 4~ 2~ 2~ 3~ 0" },
{ id: "G07", area: "ene", prio: 3, type: "likert", dim: "amb", dir: -1, lr: 0,
  text: "Debería prohibirse construir en zonas inundables, aunque haya suelos ya aprobados y sus propietarios pierdan dinero.",
  short: "Prohibir construir en zonas inundables",
  ctx: "La dana de octubre de 2024 causó más de 220 muertos en la provincia de Valencia y puso el foco en viviendas y polígonos construidos en zonas inundables. La normativa ya limita edificar en ellas, pero hay suelos aprobados antes y excepciones. Prohibirlo del todo reduciría los riesgos futuros, pero obligaría a desclasificar suelo e indemnizar, con costes para propietarios y ayuntamientos.",
  pos: "4~ 3~ 2~ 5~ 5~ 2~ 4~ 3~ 4~ 3~ 3~ 4~ 3~ 0 4~ 0 0 0 5~ 0 0 0 0 0 0 0 0" },
{ id: "G08", area: "ene", prio: 3, type: "likert", dim: "amb", dir: 1, lr: 1,
  text: "Para prevenir incendios debería permitirse más pastoreo, desbroce y aprovechamiento del monte, aunque se flexibilice la protección de algunos espacios naturales.",
  short: "Más aprovechamiento del monte contra incendios",
  ctx: "En el verano de 2025 ardieron más de 350.000 hectáreas, sobre todo en Galicia, Castilla y León y Extremadura. Los expertos coinciden en que el abandono del campo acumula vegetación que alimenta los fuegos. La discusión es cómo actuar: más pastoreo, desbroces y aprovechamiento, incluso en espacios protegidos, o más medios de extinción y una gestión forestal con criterios de conservación.",
  pos: "3~ 4~ 5~ 2~ 2~ 4~ 2~ 4~ 0 0 0 0 4~ 0 3~ 0 0 0 0 0 4~ 0 0 0 5~ 4~ 4~" },
{ id: "G09", area: "ene", prio: 2, type: "dilema", dim: "amb", dir: -1, lr: -1,
  text: "Tras el apagón de 2025, ¿qué debería priorizar el sistema eléctrico?",
  A: "Más centrales que producen a demanda (gas, nuclear, hidráulica), aunque se frenen las renovables",
  B: "Acelerar las renovables invirtiendo en redes y almacenamiento",
  short: "Producción a demanda o más renovables",
  ctx: "El 28 de abril de 2025 un apagón dejó sin electricidad a la España peninsular durante horas. Los informes oficiales apuntaron a un fallo en el control de la tensión, en un momento de mucha producción solar. Desde entonces se discute si hacen falta más centrales que aporten estabilidad o acelerar redes, baterías y tecnologías que permitan a las renovables cumplir esa función.",
  pos: "5 2 1 5 5 1~ 5~ 3~ 4~ 3~ 3~ 4~ 2~ 4~ 4~ 3~ 5~ 5~ 5~ 4~ 3~ 5~ 4~ 0 0 0 0" },

// ───────────── H · Política exterior y defensa
{ id: "H01", area: "ext", prio: 1, type: "likert", dim: null, dir: 0, lr: 1,
  text: "España debería subir su gasto en defensa hacia el 3,5 % del PIB acordado en la OTAN, en lugar de quedarse en torno al 2 %.",
  short: "Más gasto en defensa",
  ctx: "En la cumbre de La Haya de 2025, los aliados de la OTAN acordaron llegar en 2035 al 5 % del PIB en defensa y seguridad, del que un 3,5 % sería gasto militar directo. España obtuvo una excepción y sostiene que con alrededor del 2,1 % cumple los objetivos de capacidades. Sus defensores invocan la amenaza rusa y la dependencia de EE. UU.; sus críticos, el coste frente a otras prioridades.",
  pos: "1 4~ 4~ 1 1 4~ 1~ 5 1 3~ 3~ 1 4 2~ 1 2~ 1 1 1 1 2~ 1 1 0 0 0 0" },
{ id: "H02", area: "ext", prio: 2, type: "likert", dim: "eur", dir: -1, lr: 0,
  text: "La Unión Europea debería tener más competencias, aunque los Estados pierdan capacidad de decisión.",
  short: "Más competencias para la UE",
  ctx: "La UE decide sobre comercio, competencia, moneda en la zona euro y buena parte de la agricultura y la regulación económica; impuestos, defensa o sanidad siguen siendo sobre todo nacionales, y muchas decisiones exigen unanimidad. Darle más competencias permitiría a Europa actuar con más peso en el mundo; sus críticos defienden la soberanía nacional y un control democrático más cercano.",
  pos: "5 4 1 3~ 2~ 1~ 3~ 5 4~ 3~ 5 3~ 4~ 4~ 2~ 4~ 3~ 2~ 4~ 3~ 3~ 3~ 2~ 0 0 0 0" },
{ id: "H03", area: "ext", prio: 3, type: "likert", dim: "eur", dir: 1, lr: 0,
  text: "Las decisiones importantes de la UE deberían seguir exigiendo unanimidad, para que cada país conserve su derecho de veto.",
  short: "Mantener el veto de cada país en la UE",
  ctx: "En política exterior, defensa, impuestos o ampliación, la UE decide por unanimidad, de modo que un solo país puede bloquear una decisión, como ha hecho Hungría con la ayuda a Ucrania. Pasar a la mayoría cualificada agilizaría las decisiones; sus críticos temen que los países grandes impongan su criterio y que se pierda soberanía en asuntos sensibles.",
  pos: "1~ 2~ 5 3~ 4~ 5~ 0 1~ 2~ 3~ 1~ 3~ 2~ 2~ 4~ 2~ 3~ 4~ 2~ 3~ 0 3~ 4~ 0 0 0 0" },
{ id: "H04", area: "ext", prio: 2, type: "likert", dim: null, dir: 0, lr: -1,
  text: "España debería mantener el embargo de armas a Israel.",
  short: "Embargo de armas a Israel",
  ctx: "En 2025 España aprobó por decreto-ley un embargo de compraventa de armas con Israel por la guerra de Gaza, que causó decenas de miles de muertos tras el ataque de Hamás del 7 de octubre de 2023. Sus defensores lo ven como coherencia con el derecho internacional humanitario; sus críticos, como una medida que daña la relación con un aliado tecnológico y a la industria de defensa, y más simbólica que eficaz.",
  pos: "5 1 1 5 5 2~ 0 2~ 5 3~ 4 5 2~ 5~ 5 3~ 5 5 5 5 0 5 5 0 0 0 0" },
{ id: "H05", area: "ext", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "España debería retirar su apoyo al plan de autonomía marroquí para el Sáhara Occidental.",
  short: "Retirar el apoyo al plan marroquí para el Sáhara",
  ctx: "En 2022 el Gobierno pasó a considerar la autonomía bajo soberanía de Marruecos como «la base más seria, realista y creíble» para resolver el conflicto del Sáhara Occidental, antigua colonia española, y en 2025 el Consejo de Seguridad de la ONU pidió negociar sobre esa base. El giro mejoró la cooperación con Marruecos en migración y comercio; sus críticos sostienen que abandona el derecho de autodeterminación del pueblo saharaui y que no ha evitado crisis como las de Ceuta.",
  pos: "1 3~ 4 5 5 3~ 0 3~ 5 3~ 4~ 5 3~ 4~ 5 4 5 5 5 5 0 5~ 5 0 0 0 0" },
{ id: "H06", area: "ext", prio: 3, type: "likert", dim: null, dir: 0, lr: 1,
  text: "España debería seguir en la OTAN.",
  short: "Seguir en la OTAN",
  ctx: "España es miembro de la OTAN desde 1982 y lo ratificó en el referéndum de 1986. La Alianza garantiza la defensa colectiva de sus miembros, con el respaldo militar de EE. UU., aunque el ámbito geográfico del tratado no incluye expresamente Ceuta y Melilla. Una parte de la izquierda propone salir o reducir su papel y apostar por una defensa europea propia o por la neutralidad.",
  pos: "5 5 5 3~ 1 5~ 0 5 3~ 4~ 5~ 1 5 3~ 1 4~ 2~ 2~ 2~ 2~ 0 2~ 2~ 0 0 0 0" },
{ id: "H07", area: "ext", prio: 3, type: "likert", dim: "eur", dir: 1, lr: 1,
  text: "La ayuda al desarrollo debería recortarse para dedicar ese dinero a necesidades dentro de España.",
  short: "Recortar la ayuda al desarrollo",
  ctx: "La ONU fijó hace décadas el objetivo de dedicar el 0,7 % de la renta nacional a la ayuda oficial al desarrollo; España destina en torno al 0,25 %, y la ley de cooperación de 2023 se compromete a llegar al 0,7 % en 2030. Sus defensores la ven como responsabilidad global y una forma de reducir la migración forzada; sus críticos priorizan las necesidades internas o dudan de su eficacia.",
  ley: "Ley 1/2023, de cooperación para el desarrollo sostenible",
  pos: "1 3~ 5 1 1 5~ 0 3~ 1~ 2~ 2~ 1~ 3~ 2~ 2~ 3~ 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },
{ id: "H08", area: "ext", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "España debería estrechar sus relaciones comerciales con China, aunque genere tensiones con Estados Unidos.",
  short: "Más comercio con China",
  ctx: "China es el principal proveedor de España fuera de la UE, con un gran déficit comercial, y el presidente del Gobierno la ha visitado varias veces para atraer inversiones como fábricas de baterías y coches eléctricos. Con los aranceles de EE. UU., unos ven una oportunidad para diversificar; otros advierten de la dependencia tecnológica, la competencia con la industria europea y las tensiones con Washington.",
  pos: "5 2~ 1 3~ 4~ 1~ 0 2~ 3~ 3~ 3~ 3~ 2~ 0 3~ 0 0 0 0 0 0 0 0 0 0 0 0" },
{ id: "H09", area: "ext", prio: 2, type: "likert", dim: "inm", dir: 1, lr: 1,
  text: "La UE debería poder trasladar a centros en terceros países a los solicitantes de asilo mientras se estudian sus casos.",
  short: "Centros de asilo fuera de la UE",
  ctx: "El Pacto Europeo de Migración y Asilo, aplicable desde 2026, endurece los controles en frontera y obliga a repartir la responsabilidad entre países. Italia ha ensayado centros en Albania y la UE estudia «centros de retorno» fuera de su territorio. Sus defensores buscan disuadir las llegadas irregulares y a las mafias; sus críticos alertan de vulneraciones de derechos, altos costes y dudas legales.",
  pos: "1 4~ 5 1 1 5~ 0 3~ 1 3~ 2~ 1 4~ 1~ 1 3~ 1 1 1 1 0 1 1 0 0 0 0" },

// ───────────── I · Educación, ciencia y cultura
{ id: "I01", area: "edu", prio: 1, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "La escuela concertada debería mantener o ampliar su financiación pública.",
  short: "Financiación de la escuela concertada",
  ctx: "Una cuarta parte del alumnado estudia en centros concertados: privados, a menudo religiosos, financiados con dinero público a cambio de ser gratuitos en la enseñanza obligatoria, aunque muchos cobran cuotas «voluntarias». Sus defensores apelan a la libertad de elección de las familias; sus críticos señalan que escolarizan a menos alumnado vulnerable y prefieren priorizar la red pública.",
  ley: "Constitución, art. 27",
  pos: "3 5 5 1 1 5~ 0 4 2 4 4 1 5 2~ 1 3~ 1 1~ 1 1 0 1 1 0 0 0 0" },
{ id: "I02", area: "edu", prio: 2, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "La universidad pública debería ser gratuita para todos los estudiantes.",
  short: "Universidad pública gratuita",
  ctx: "Las tasas de la universidad pública las fijan las comunidades y van de unos 700 a más de 2.000 euros por curso; algunas bonifican las asignaturas aprobadas. Hacerla gratuita eliminaría una barrera económica; sus críticos sostienen que beneficiaría sobre todo a familias con más renta, que están sobrerrepresentadas en la universidad, y prefieren reforzar las becas para quienes tienen menos ingresos.",
  pos: "3 2~ 2~ 5 5 1~ 0 2~ 4~ 2~ 3~ 5~ 2~ 4~ 5 3~ 5~ 5~ 5~ 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "I03", area: "edu", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Debería ser más fácil crear universidades privadas.",
  short: "Facilitar nuevas universidades privadas",
  ctx: "En España ya hay casi tantas universidades privadas como públicas, aunque estudian en ellas muchos menos alumnos. En 2025 el Gobierno endureció los requisitos para crearlas y mantenerlas: investigación, profesorado doctor y un número mínimo de estudiantes. Sus defensores ven en las privadas más oferta y libertad de enseñanza; sus críticos temen centros con poca investigación y títulos de baja calidad.",
  pos: "1 5 5~ 1~ 1~ 5~ 0 4~ 2~ 4~ 3~ 2~ 5~ 0 2~ 0 0 0 2~ 0 0 0 2~ 0 0 0 0" },
{ id: "I04", area: "edu", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Los resultados de cada colegio en las evaluaciones externas deberían hacerse públicos.",
  short: "Publicar los resultados de cada colegio",
  ctx: "Las comunidades hacen pruebas de evaluación externas y España participa en PISA, pero en general no se publican los resultados de cada centro. Publicarlos daría información a las familias y presionaría para mejorar; sus críticos advierten de clasificaciones que estigmatizan a los centros con alumnado más vulnerable y de que se acabe enseñando para el examen.",
  pos: "2~ 4~ 4~ 1~ 1~ 4~ 0 5~ 2~ 3~ 2~ 1~ 4~ 0 1~ 0 0 0 1~ 0 0 0 0 0 0 0 0" },
{ id: "I05", area: "edu", prio: 2, type: "likert", dim: "ter", dir: 1, lr: 1,
  text: "En las comunidades con lengua cooficial, las familias deberían poder elegir que sus hijos estudien principalmente en castellano.",
  short: "Elegir el castellano como lengua de estudio",
  ctx: "En Cataluña la inmersión hace del catalán la lengua vehicular, y los tribunales fijaron un mínimo del 25 % de clases en castellano; en otras comunidades conviven modelos con distintos porcentajes. Quienes defienden la elección invocan los derechos de las familias castellanohablantes; quienes defienden la inmersión, garantizar que todo el alumnado domine ambas lenguas y la cohesión social.",
  pos: "2 5 5 1 1 5~ 0 5 1 1 1 1 5 1 1 0 0 0 1 1~ 0 1 0 0 0 0 0" },
{ id: "I06", area: "edu", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Las becas deberían exigir mejores notas que el simple aprobado.",
  short: "Becas con más exigencia académica",
  ctx: "Desde 2021 las becas estatales se conceden sobre todo por renta: en bachillerato y FP basta con aprobar, y en la universidad hay que superar un porcentaje de créditos. Exigir mejores notas premia el esfuerzo y el uso eficiente del dinero público; sus críticos señalan que los estudiantes con menos recursos suelen tener más dificultades y que la beca busca la igualdad de oportunidades.",
  pos: "1 4 4~ 1 1 4~ 0 4~ 1~ 3~ 0 1~ 4~ 0 1~ 0 0 0 1~ 0 0 0 1~ 0 0 0 0" },
{ id: "I07", area: "edu", prio: 2, type: "likert", dim: "soc", dir: -1, lr: -1,
  text: "Las actividades de educación afectivo-sexual en los colegios no deberían necesitar permiso previo de los padres.",
  short: "Educación sexual sin «pin parental»",
  ctx: "La ley educativa incluye la educación afectivo-sexual en el currículo. Vox impulsó el «pin parental», un permiso expreso de los padres para que sus hijos asistan a actividades complementarias sobre sexualidad o identidad de género, y llegó a aplicarse en Murcia. Sus defensores apelan al derecho de los padres a decidir la educación moral de sus hijos; sus críticos, al derecho de los menores a una formación completa.",
  pos: "5 2~ 1 5 5 1~ 0 4~ 5 4~ 4~ 5 2~ 5~ 5 4~ 5 5~ 5 5~ 0 5~ 5 0 0 0 0" },
{ id: "I08", area: "edu", prio: 3, type: "likert", dim: "soc", dir: 1, lr: 1,
  text: "La tauromaquia debería seguir recibiendo dinero público como patrimonio cultural.",
  short: "Dinero público para la tauromaquia",
  ctx: "La tauromaquia es patrimonio cultural por ley desde 2013, y comunidades y ayuntamientos financian festejos y escuelas taurinas; en 2024 el Ministerio de Cultura suprimió el Premio Nacional de Tauromaquia. Sus defensores la consideran parte de la identidad y la economía de muchos pueblos; sus críticos, un espectáculo con sufrimiento animal que no debe pagarse con fondos públicos. Canarias la prohíbe desde 1991.",
  ley: "Ley 18/2013, de la tauromaquia como patrimonio cultural",
  pos: "3~ 5 5 1 1 5~ 1 4~ 1 2~ 3~ 1 5 2~ 1 2~ 1 1 2~ 2~ 4~ 1 3~ 5~ 5~ 4~ 5" },
{ id: "I09", area: "edu", prio: 3, type: "likert", dim: "ter", dir: -1, lr: -1,
  text: "Conocer la lengua cooficial debería ser requisito para trabajar en la Administración de esa comunidad.",
  short: "Lengua cooficial como requisito",
  ctx: "En Cataluña, el País Vasco, Galicia, Baleares o la Comunitat Valenciana, las administraciones exigen o valoran el conocimiento de la lengua propia, con distinta intensidad según la comunidad y el gobierno de turno. Sus defensores sostienen que garantiza que la ciudadanía sea atendida en cualquiera de las lenguas oficiales; sus críticos, que limita el acceso al empleo público, por ejemplo de médicos de otras comunidades.",
  pos: "3 2 1 4 4 1~ 0 1 5 5 5 5 1 5 5 0 0 0 5 4~ 0 5 0 0 0 0 0" },

// ───────────── J · Sanidad y gestión pública
{ id: "J01", area: "san", prio: 1, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "La sanidad pública debería dejar de encargar operaciones y la gestión de hospitales a empresas privadas.",
  short: "Sanidad sin gestión privada",
  ctx: "Las comunidades conciertan con clínicas privadas pruebas y operaciones para reducir las listas de espera, y algunas han cedido la gestión de hospitales públicos a empresas, como Madrid o la Comunitat Valenciana. En 2026 el Gobierno llevó al Congreso un proyecto de ley para limitar esa gestión privada. Los defensores de la colaboración con la privada ven en ella más capacidad y eficiencia; sus críticos, desvío de fondos y menos control público.",
  pos: "4 1 1 5 5 2~ 0 2 3 2 3~ 5 2~ 4~ 5 3~ 5 5~ 5 5~ 4~ 5~ 5 4~ 4~ 4~ 4~" },
{ id: "J02", area: "san", prio: 2, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "Si la sanidad pública supera un plazo máximo de espera, el paciente debería poder operarse en una clínica privada pagada por el sistema público.",
  short: "Clínica privada si se supera la espera",
  ctx: "Más de 800.000 personas esperan una operación en la sanidad pública, con una media de más de cuatro meses. Algunas comunidades fijan plazos máximos y, si se superan, ofrecen operarse en un centro concertado. Sus defensores priorizan el derecho del paciente a ser atendido a tiempo; sus críticos sostienen que desvía recursos a la privada en lugar de ampliar la capacidad pública.",
  pos: "2~ 4~ 5~ 1 1 5~ 0 5~ 2~ 4~ 3~ 1 4~ 2~ 1 3~ 1~ 1~ 1~ 1~ 3~ 1~ 1~ 0 0 0 0" },
{ id: "J03", area: "san", prio: 2, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "Los médicos de la sanidad pública no deberían poder trabajar a la vez en la privada.",
  short: "Exclusividad de los médicos públicos",
  ctx: "Muchos médicos combinan su plaza pública con consulta privada. El nuevo Estatuto Marco que negocia el Ministerio de Sanidad propone exigir dedicación exclusiva a los nuevos jefes de servicio, uno de los motivos de las huelgas médicas de 2025 y 2026. Sus defensores buscan evitar conflictos de interés y reforzar lo público; sus críticos temen que más médicos abandonen la sanidad pública, donde ya faltan en muchas especialidades.",
  pos: "4~ 1 1~ 5 5~ 1~ 0 1~ 3~ 2~ 2~ 4~ 2~ 0 4~ 0 0 0 4~ 0 0 0 4~ 0 0 0 0" },
{ id: "J04", area: "san", prio: 3, type: "likert", dim: "lib", dir: 1, lr: -1,
  text: "Habría que subir los impuestos sobre el tabaco, el alcohol y las bebidas azucaradas para reducir su consumo.",
  short: "Impuestos saludables",
  ctx: "El Ministerio de Sanidad ha propuesto subir los impuestos del tabaco y extenderlos a productos como los vapeadores, y en Europa se debate gravar más las bebidas azucaradas. Según la experiencia de otros países, estos impuestos reducen el consumo y recaudan para la sanidad; sus críticos señalan que pesan más sobre las rentas bajas y que limitan la libertad de cada persona para decidir qué consume.",
  pos: "4~ 2~ 1~ 5~ 4~ 1~ 0 2~ 4~ 2~ 3~ 4~ 2~ 0 4~ 2~ 0 0 4~ 0 0 0 0 0 0 0 0" },
{ id: "J05", area: "san", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "Las leyes y programas con un coste importante deberían evaluarse de forma independiente y suprimirse si no cumplen sus objetivos.",
  short: "Evaluar y suprimir políticas ineficaces",
  ctx: "En España se evalúa poco qué funciona: la AIReF revisa algunos gastos y en 2022 se creó una agencia estatal de evaluación de políticas públicas, pero sus informes no obligan a nada. Incluir cláusulas de evaluación y caducidad haría el gasto más eficiente; sus críticos advierten de que muchos objetivos sociales son difíciles de medir a corto plazo y de que el cierre podría usarse con fines políticos.",
  pos: "3~ 4~ 4~ 3~ 3~ 5~ 0 5~ 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0" },
{ id: "J06", area: "san", prio: 3, type: "likert", dim: "eco", dir: 1, lr: 1,
  text: "El empleo público debería incluir una evaluación del desempeño con consecuencias, incluido el despido por bajo rendimiento.",
  short: "Evaluar a los empleados públicos",
  ctx: "España tiene unos 3,5 millones de empleados públicos; la mayoría tiene plaza fija tras aprobar una oposición, una garantía pensada para proteger su imparcialidad frente a los cambios de gobierno. La ley ya prevé evaluar el desempeño, pero apenas se aplica. Sus defensores creen que mejoraría la eficiencia de la Administración; sus críticos temen arbitrariedad y presiones políticas sobre los empleados.",
  pos: "2~ 3~ 4~ 1~ 1~ 5~ 0 5~ 2~ 3~ 3~ 1~ 3~ 0 1~ 0 0 0 1~ 0 0 0 1~ 0 0 0 0" },
{ id: "J07", area: "san", prio: 3, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "Los funcionarios deberían dejar de poder elegir sanidad privada a través de MUFACE y pasar a la sanidad pública.",
  short: "Integrar MUFACE en la sanidad pública",
  ctx: "Los funcionarios del Estado pueden elegir, a través de MUFACE, ser atendidos por aseguradoras privadas concertadas en lugar de por la sanidad pública, y la mayoría lo hace. En 2024 las aseguradoras se negaron a renovar el concierto por considerarlo deficitario, y el Gobierno acabó subiendo la prima. Integrarlos acabaría con un sistema diferenciado; los defensores de MUFACE destacan que es más barato por persona y descarga los centros públicos.",
  pos: "3~ 1 1~ 5 5 1~ 0 2~ 4~ 2~ 0 4~ 2~ 0 4~ 0 0 0 4~ 0 0 0 4~ 0 0 0 0" },
{ id: "J08", area: "san", prio: 2, type: "likert", dim: "ter", dir: 1, lr: 0,
  text: "El Ministerio de Sanidad debería poder fijar estándares obligatorios, como tiempos máximos de espera, en todas las comunidades.",
  short: "Estándares sanitarios comunes",
  ctx: "La sanidad está transferida a las comunidades desde 2002, y el Estado coordina a través del Consejo Interterritorial, donde las decisiones suelen requerir acuerdo. Eso explica diferencias en listas de espera, vacunas o prestaciones entre territorios. Dar más poder al Ministerio favorecería la igualdad entre ciudadanos; sus críticos defienden la autonomía de gestión y la cercanía, y temen una uniformización impuesta por el Gobierno central.",
  pos: "5 2~ 5 4~ 4~ 5~ 0 5~ 1 1 1 1 1~ 1~ 1 1~ 2~ 2~ 2~ 2~ 3~ 2~ 2~ 0 0 0 0" },

// ───────────── K · Agricultura, pesca y mundo rural
{ id: "K01", area: "rur", prio: 1, type: "likert", dim: "eur", dir: -1, lr: 0,
  text: "España debería apoyar el acuerdo comercial entre la UE y Mercosur, aunque aumente la competencia para los agricultores.",
  short: "Acuerdo comercial UE-Mercosur",
  ctx: "El acuerdo, cerrado en 2024 tras 25 años de negociación, reduce aranceles entre la UE y Argentina, Brasil, Paraguay y Uruguay. Beneficiaría a exportadores de vino, aceite, maquinaria o automóviles; las organizaciones agrarias temen la competencia de carne, azúcar o cereales producidos con normas ambientales y sanitarias menos exigentes. Incluye cláusulas de salvaguarda cuya eficacia se discute. Se aplica provisionalmente desde mayo de 2026, mientras el Tribunal de Justicia de la UE examina su legalidad.",
  pos: "5 4 1 1 1 1~ 1 5 2~ 3~ 4~ 1 3~ 2~ 1 3~ 1~ 1~ 2~ 1~ 1~ 1~ 1~ 2~ 1~ 1~ 0" },
{ id: "K02", area: "rur", prio: 3, type: "likert", dim: "eco", dir: -1, lr: 0,
  text: "Habría que reforzar el control de los márgenes de la distribución para que agricultores y ganaderos no tengan que vender por debajo de sus costes de producción.",
  short: "Controlar los márgenes de la distribución",
  ctx: "La Ley de la Cadena Alimentaria prohíbe desde 2021 comprar a los productores por debajo de sus costes, pero las organizaciones agrarias denuncian incumplimientos y grandes diferencias entre el precio en origen y el del supermercado. Reforzar el control protegería al eslabón más débil; sus críticos advierten de que intervenir márgenes puede encarecer la cesta de la compra o reducir la competencia.",
  ley: "Ley 12/2013, de la cadena alimentaria",
  pos: "4 3~ 4~ 5~ 5~ 3~ 0 2~ 4~ 3~ 3~ 5~ 3~ 0 5~ 3~ 5~ 5~ 5~ 5~ 5~ 4~ 5~ 5~ 5~ 5~ 0" },
{ id: "K03", area: "rur", prio: 2, type: "likert", dim: "eco", dir: -1, lr: -1,
  text: "Las ayudas de la PAC deberían concentrarse en los agricultores profesionales y las pequeñas explotaciones, en lugar de repartirse según las hectáreas.",
  short: "PAC para profesionales y pequeñas explotaciones",
  ctx: "España recibe cada año unos 5.000 millones de euros en ayudas directas de la Política Agraria Común. Una parte importante se reparte en función de las hectáreas y de derechos históricos, de modo que los mayores perceptores son grandes propietarios. Vincularla a quienes viven del campo y a explotaciones pequeñas y medianas reforzaría el medio rural; sus críticos advierten de que la agricultura competitiva necesita escala.",
  pos: "4 2 3~ 5~ 5~ 3~ 0 2~ 4~ 2~ 3~ 5~ 2~ 0 5~ 0 0 0 4~ 5~ 4~ 0 5~ 4~ 4~ 4~ 0" },
{ id: "K04", area: "rur", prio: 2, type: "likert", dim: "amb", dir: 1, lr: 1,
  text: "El lobo debería poder cazarse de forma controlada en las zonas donde ataca al ganado.",
  short: "Control del lobo",
  ctx: "El lobo estuvo protegido en toda España entre 2021 y 2025, cuando el Congreso aprobó volver a permitir su control al norte del Duero, después de que la UE rebajara su nivel de protección. Los ganaderos denuncian miles de ataques al año; los conservacionistas sostienen que la especie aún no está en buen estado y que hay alternativas como mastines, vallados e indemnizaciones rápidas.",
  pos: "2 5 5 1 1 5~ 1 4~ 2~ 4 4 1~ 4~ 0 2~ 4 1~ 1~ 1~ 1~ 4~ 1~ 0 0 5 4~ 5~" },
{ id: "K05", area: "rur", prio: 2, type: "likert", dim: "amb", dir: -1, lr: -1,
  text: "Debería prohibirse abrir nuevas macrogranjas.",
  short: "Prohibir nuevas macrogranjas",
  ctx: "Las granjas industriales concentran miles de animales, sobre todo cerdos, y han crecido mucho en Aragón, Cataluña o Castilla-La Mancha. Generan empleo y exportaciones, pero también contaminación de acuíferos por nitratos, olores y la desaparición de ganaderos pequeños; varias comunidades han aprobado moratorias. Sus defensores sostienen que cumplen la normativa y fijan población en el medio rural.",
  pos: "2 1 1 5 5 1~ 5 2~ 4~ 2~ 2~ 4~ 1~ 3~ 4~ 2~ 4~ 5 4~ 4~ 3~ 4~ 4~ 2~ 3~ 5 0" },
{ id: "K06", area: "rur", prio: 3, type: "likert", dim: "amb", dir: 1, lr: 1,
  text: "La UE debería relajar las restricciones a la pesca en el Mediterráneo, aunque las poblaciones de peces se recuperen más despacio.",
  short: "Relajar los límites a la pesca en el Mediterráneo",
  ctx: "Para recuperar especies sobreexplotadas, la UE ha recortado con fuerza los días de pesca de arrastre en el Mediterráneo occidental desde 2020, y muchos barcos pasan buena parte del año amarrados. El sector y varias comunidades piden flexibilizar los límites para sobrevivir; los científicos y las organizaciones ecologistas advierten de que, sin esas restricciones, no habrá peces que pescar en el futuro.",
  pos: "3~ 4~ 5~ 2~ 2~ 4~ 1~ 3~ 3~ 3~ 0 0 0 0 3~ 0 0 0 3~ 0 0 2~ 3~ 0 0 0 0" },
{ id: "K07", area: "rur", prio: 3, type: "likert", dim: "amb", dir: 1, lr: 1,
  text: "La caza debería protegerse por ley como una actividad necesaria para la gestión del medio rural.",
  short: "Proteger la caza por ley",
  ctx: "En España hay unas 750.000 licencias de caza. Sus defensores la consideran clave para controlar especies como el jabalí o el conejo, que causan daños en cultivos y accidentes de tráfico, y para la economía de muchos pueblos. Sus críticos denuncian el sufrimiento animal y proponen otros métodos de control de fauna; la Ley de Bienestar Animal de 2023 dejó fuera a los perros de caza.",
  pos: "3~ 5 5 1~ 1 5~ 1 4~ 2~ 3~ 3~ 2~ 5~ 0 2~ 3~ 1~ 1~ 2~ 2~ 4~ 1~ 2~ 4~ 5~ 4~ 5~" },
{ id: "K08", area: "rur", prio: 3, type: "likert", dim: "amb", dir: -1, lr: -1,
  text: "Debería limitarse la creación de nuevos regadíos en las zonas con escasez de agua.",
  short: "Limitar los nuevos regadíos",
  ctx: "La agricultura de regadío consume en torno al 80 % del agua en España. En el entorno de Doñana, la extracción para cultivos como la fresa ha contribuido a secar lagunas del parque nacional, y el Tribunal de Justicia de la UE condenó a España en 2021. Limitar nuevos regadíos protege acuíferos y ecosistemas; sus críticos defienden la riqueza y el empleo agrícola y piden más infraestructuras y desaladoras.",
  pos: "4 2 1 5 5 2~ 5~ 3~ 4~ 3~ 3~ 4~ 2~ 0 4~ 0 0 0 3~ 3~ 0 0 4~ 2~ 1~ 0 0" },

// ───────────── L · Derechos y cuestiones éticas
{ id: "L01", area: "der", prio: 1, type: "likert", dim: "soc", dir: -1, lr: -1,
  text: "El derecho al aborto debería incluirse en la Constitución.",
  short: "El aborto en la Constitución",
  ctx: "La ley de 2010 permite el aborto libre hasta la semana 14 y hasta la 22 por riesgos graves, y el Tribunal Constitucional la avaló en 2023. En 2025 el Gobierno propuso reformar la Constitución para incluirlo, como hizo Francia en 2024. Sus defensores quieren protegerlo frente a futuros cambios de mayoría; sus críticos defienden la vida del no nacido o consideran innecesaria la reforma, que exige tres quintos de las Cámaras.",
  ley: "Ley Orgánica 2/2010; Constitución, art. 167",
  pos: "5 1 1 5 5 0 5~ 3~ 4 3 4~ 5 1~ 5~ 5 3~ 5 5~ 5 5~ 0 5~ 5 0 0 0 0" },
{ id: "L02", area: "der", prio: 2, type: "likert", dim: "soc", dir: 1, lr: 1,
  text: "La ley de eutanasia debería derogarse.",
  short: "Derogar la ley de eutanasia",
  ctx: "Desde 2021 España permite la eutanasia a personas con una enfermedad grave e incurable o un padecimiento crónico e imposibilitante, tras varios controles médicos y de una comisión; se realizan varios cientos al año. Quienes piden derogarla temen presiones sobre personas vulnerables y prefieren reforzar los cuidados paliativos, que no llegan a todos; quienes la defienden la ven como el derecho a una muerte digna.",
  ley: "Ley Orgánica 3/2021, de regulación de la eutanasia",
  pos: "1 3 5 1 1 4~ 2~ 1~ 1 2~ 2 1 5~ 1~ 1 2~ 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },
{ id: "L03", area: "der", prio: 2, type: "likert", dim: "soc", dir: -1, lr: -1,
  text: "Las personas de 16 años o más deberían poder cambiar su sexo en el Registro Civil sin informes médicos.",
  short: "Cambio de sexo registral sin informes",
  ctx: "La «ley trans» de 2023 permite desde los 16 años cambiar el sexo registral por simple declaración, ratificada a los tres meses; entre los 14 y los 16 años se necesita la asistencia de los padres, y entre los 12 y los 14, autorización judicial. Sus defensores la ven como reconocimiento de la identidad de las personas trans; sus críticos, incluida parte del feminismo, temen fraudes, efectos en el deporte o en espacios de mujeres y decisiones precipitadas.",
  ley: "Ley 4/2023, para la igualdad de las personas trans",
  pos: "4 2 1 5 5 1~ 0 3~ 5 4~ 4~ 5 1~ 4~ 5 3~ 5 5~ 5 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "L04", area: "der", prio: 3, type: "likert", dim: null, dir: 0, lr: 0,
  text: "La gestación subrogada debería legalizarse con garantías para la mujer gestante.",
  short: "Legalizar la gestación subrogada",
  ctx: "En España los contratos de gestación por sustitución son nulos, aunque durante años se inscribieron en el Registro Civil los bebés nacidos así en el extranjero; en 2025 el Gobierno restringió esa inscripción. Sus defensores apelan al derecho a formar una familia y a regularla con garantías; sus críticos, desde el feminismo hasta sectores conservadores, la consideran una explotación del cuerpo de las mujeres.",
  pos: "1 2~ 1 1 1 3~ 0 5 2~ 3~ 3~ 1~ 2~ 0 1~ 0 1~ 1~ 1~ 0 0 0 1~ 0 0 0 0" },
{ id: "L05", area: "der", prio: 3, type: "likert", dim: "soc", dir: -1, lr: -1,
  text: "Los acuerdos de 1979 con la Santa Sede deberían revisarse para reducir las ventajas que reconocen a la Iglesia católica.",
  short: "Revisar los acuerdos con la Santa Sede",
  ctx: "Los acuerdos con el Vaticano regulan la enseñanza de la Religión, la asistencia religiosa, exenciones fiscales y la financiación de la Iglesia, que recibe el 0,7 % del IRPF de quienes marcan su casilla. Sus críticos sostienen que otorgan privilegios impropios de un Estado aconfesional; sus defensores, que reconocen la labor social de la Iglesia y la libertad religiosa, y que otras confesiones también tienen acuerdos.",
  ley: "Constitución, art. 16.3",
  pos: "3~ 1 1 5 5 2~ 0 3~ 5~ 3~ 2~ 5~ 1 4~ 5~ 2~ 5~ 5~ 5~ 5~ 0 5~ 5~ 0 0 0 0" },
{ id: "L06", area: "der", prio: 3, type: "likert", dim: "lib", dir: 1, lr: 0,
  text: "Las redes sociales deberían estar obligadas a verificar la identidad real de cada usuario.",
  short: "Fin del anonimato en redes",
  ctx: "En 2025 el presidente del Gobierno propuso acabar con el anonimato en las redes sociales vinculando cada cuenta a una identidad verificada, para combatir el acoso, los bulos y las cuentas falsas. Sus críticos alertan de riesgos para la privacidad, para quienes denuncian abusos o viven bajo regímenes autoritarios y para la libertad de expresión, y recuerdan que ya se puede identificar a autores de delitos con orden judicial.",
  pos: "5 2~ 1 3~ 3~ 1~ 0 2~ 3~ 2~ 3~ 2~ 2~ 0 2~ 0 0 0 3~ 0 0 0 0 0 0 0 0" },
{ id: "L07", area: "der", prio: 3, type: "likert", dim: "lib", dir: 1, lr: 0,
  text: "Debería prohibirse el acceso a las redes sociales a los menores de 16 años.",
  short: "Redes sociales solo desde los 16 años",
  ctx: "España tramita una ley de protección de los menores en entornos digitales que eleva a 16 años la edad para consentir el uso de sus datos, y en 2026 el Gobierno anunció que prohibiría las redes por debajo de esa edad, como hace Australia desde diciembre de 2025. Sus defensores citan los efectos en la salud mental y el acoso; sus críticos dudan de que pueda aplicarse sin sistemas de verificación de edad invasivos y prefieren la educación digital y el control parental.",
  pos: "5 4~ 2~ 4~ 3~ 1~ 0 3~ 3~ 3~ 4~ 3~ 4~ 0 3~ 0 0 0 4~ 0 0 0 0 0 0 0 0" },
{ id: "L08", area: "der", prio: 3, type: "likert", dim: "soc", dir: 1, lr: 1,
  text: "Las cuotas obligatorias de paridad entre sexos en listas electorales y consejos de administración deberían eliminarse.",
  short: "Eliminar las cuotas de paridad",
  ctx: "La Ley de Paridad de 2024 obliga a que las listas electorales, el Gobierno y los consejos de las grandes empresas cotizadas tengan al menos un 40 % de cada sexo. Quienes piden eliminar las cuotas sostienen que debe primar el mérito individual y que la ley invade decisiones de partidos y empresas; quienes las defienden, que corrigen barreras que frenan a las mujeres en los puestos de poder.",
  ley: "Ley Orgánica 2/2024, de representación paritaria",
  pos: "1 3~ 5 1 1 5~ 2~ 4~ 1~ 2~ 2~ 1~ 4~ 1~ 1~ 2~ 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" },
{ id: "L09", area: "der", prio: 2, type: "likert", dim: "inm", dir: 1, lr: 1,
  text: "Debería prohibirse llevar velo integral (burka o niqab) en los espacios públicos.",
  short: "Prohibir el velo integral",
  ctx: "Francia, Bélgica o Dinamarca prohíben cubrirse el rostro en la calle. En España no existe una prohibición general, y el Tribunal Supremo anuló en 2013 una ordenanza municipal que lo vetaba por invadir competencias del Estado. Sus defensores invocan la seguridad y la igualdad de las mujeres; sus críticos, la libertad religiosa y el riesgo de excluir aún más a las pocas mujeres que lo llevan.",
  pos: "2 5 5 1 1 5~ 0 4~ 2~ 4~ 2~ 1~ 3~ 0 1~ 0 1~ 1~ 1~ 1~ 0 1~ 1~ 0 0 0 0" }
];

// Familias de preguntas que miden casi la misma opinión. En la coincidencia con los partidos, si
// respondes varias de una familia, pesan juntas como √k preguntas en lugar de k (no se cuenta dos veces).
export const FAMILIES = [
  ["B01", "B02"], // limitar precios del alquiler / construir o regular
  ["F01", "F02"], // regularizar / expulsar a inmigrantes en situación irregular
  ["G01", "G09"], // alargar las nucleares / producción a demanda o renovables
  ["H02", "H03"], // más competencias para la UE / mantener el veto
  ["J01", "J02"]  // gestión privada en la sanidad pública / clínicas privadas si se supera la espera
];

// Notas cuando lo que un partido propone, declara o hace no coincide. Se muestran junto a su postura.
export const NOTES = {
  B04: {
    psoe: "Su programa de 2023 defendía mantener el escudo social, pero el decreto del Gobierno de febrero de 2026 ya excluía de la suspensión a los propietarios con dos viviendas o menos.",
    fa: "Como socio del Gobierno aprobó el decreto que excluye a los pequeños propietarios, aunque defiende mantener la suspensión con carácter general."
  },
  C01: {
    psoe: "El acuerdo PSC-ERC de 2024 prevé que la Agencia Tributaria de Cataluña recaude todos los impuestos, pero la dirección federal del PSOE niega que sea un concierto y Hacienda solo ha concretado la cesión del IRPF."
  },
  D01: {
    fa: "Su programa de 2023 solo se compromete a «valorar» actualizar la ley electoral o ampliar el número de diputados."
  },
  E01: {
    erc: "Se abstuvo en la ley contra la multirreincidencia (febrero de 2026) y rechaza endurecer las penas «a golpe de Código Penal»."
  },
  F03: {
    pp: "En el Congreso votó contra la «prioridad nacional» que propone Vox, pero sus pactos de gobierno de 2026 con Vox en Extremadura y Aragón dan prioridad en vivienda y ayudas según los años de empadronamiento."
  },
  G01: {
    psoe: "El Gobierno prorrogó en 2026 la central de Almaraz hasta 2030, pero mantiene el cierre de todo el parque nuclear en 2035.",
    junts: "Su grupo de la Ribera d'Ebre pide prorrogar Ascó y Vandellòs, pero en el Congreso se abstuvo en las dos votaciones sobre la prórroga nuclear (febrero y noviembre de 2025)."
  },
  H01: {
    junts: "Votó en contra de revertir la subida del gasto militar, pero no se ha pronunciado sobre el objetivo del 3,5 %."
  },
  I01: {
    psoe: "Su programa de 2023 no propone recortar los conciertos: plantea actualizar su financiación a cambio de que no segreguen al alumnado."
  },
  J01: {
    vox: "Defiende abiertamente la colaboración público-privada en la sanidad pública; su programa de 2023 prometía reforzar los conciertos con la privada.",
    erc: "En el Parlament votó pedir la retirada de la ley estatal que limita la gestión privada, en defensa del modelo sanitario catalán con hospitales concertados."
  },
  J08: {
    psoe: "Su programa de 2023 promete fijar por ley tiempos máximos de espera comunes en todo el Sistema Nacional de Salud (120 días para operaciones y 60 para consultas)."
  },
  K01: {
    pp: "Sus eurodiputados han votado a favor de seguir adelante con el acuerdo y de sus salvaguardas agrícolas, mientras algunos presidentes autonómicos del PP lo rechazan."
  },
  L01: {
    erc: "Defiende el derecho al aborto y permitió tramitar la reforma constitucional, pero comparte objeciones jurídicas y no se ha comprometido a votarla.",
    junts: "Permitió tramitar la reforma constitucional, pero la calificó de «espectáculo» y no se ha comprometido a apoyarla."
  },
  L09: {
    psoe: "Votó en contra de la ley de Vox, aunque se mostró dispuesto a negociar la prohibición que propone Junts."
  }
};

// Fuentes enlazadas de posturas verificadas en octubre de 2026. El resto de posturas se basa en programas de
// 2023, votaciones y declaraciones, todavía sin enlace individual.
// Formato: [url, etiqueta, tipo, fecha]. Tipo: programa (programa electoral o documento oficial del
// partido), parlamento (voto, iniciativa o enmienda en las Cortes), gobierno (decisión o ley impulsada desde el
// Gobierno), declaracion (declaración pública de sus dirigentes) o prensa (información periodística sobre su postura).
// Fecha: AAAA, AAAA-MM o AAAA-MM-DD de la evidencia, no de la consulta.
export const SOURCES = {
  A01: {
    psoe: ["https://www.periodicodeibiza.es/noticias/nacional/2025/09/11/2467647/congreso-tumba-reduccion-jornada-laboral-prosperar-veto-vox-junts.html", "Periódico de Ibiza (Europa Press), votación de las enmiendas de totalidad a la ley de jornada, 10/09/2025", "parlamento", "2025-09-11"],
    pp: ["https://theobjective.com/espana/politica/2025-09-10/congreso-reduccion-jornada-laboral-pp-vox-junts/", "The Objective, votación en el Congreso del 10/09/2025", "parlamento", "2025-09-10"]
  },
  A02: {
    psoe: ["https://theobjective.com/wp-content/uploads/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023-1.pdf", "Programa electoral del PSOE para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    pp: ["https://theobjective.com/wp-content/uploads/2023/07/programa-pp-23j.pdf", "Programa electoral del PP para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    vox: ["https://theobjective.com/wp-content/uploads/2023/07/programa-vox-23j.pdf", "Programa electoral de Vox para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    fa: ["https://movimientosumar.es/wp-content/uploads/2023/07/Un-Programa-para-ti.pdf", "Programa electoral de Sumar de 2023", "programa", "2023-07"],
    pod: ["https://theobjective.com/espana/politica/2025-06-26/pp-vox-junts-bajada-impuestos/", "The Objective, votación en el Congreso del 26/06/2025", "parlamento", "2025-06-26"],
    erc: ["https://theobjective.com/espana/politica/2025-06-26/pp-vox-junts-bajada-impuestos/", "The Objective, votación en el Congreso del 26/06/2025", "parlamento", "2025-06-26"],
    junts: ["https://theobjective.com/espana/politica/2025-06-26/pp-vox-junts-bajada-impuestos/", "The Objective, votación en el Congreso del 26/06/2025", "parlamento", "2025-06-26"]
  },
  A03: {
    psoe: ["https://www.boe.es/buscar/act.php?id=BOE-A-2023-26452", "BOE, Real Decreto-ley 8/2023, de 27 de diciembre", "gobierno", "2023-12"],
    pp: ["https://www.pp.es/storage/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf#page=23", "Programa electoral del PP de 2023", "programa", "2023-07-04"]
  },
  A05: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"]
  },
  B01: {
    psoe: ["https://www.eldiario.es/politica/ultima-hora-actualidad-politica-directo_6_13411162_1124105.html", "eldiario.es, rueda de prensa de balance de Pedro Sánchez, 28/07/2026", "declaracion", "2026-07-28"],
    pp: ["https://www.newtral.es/pp-propuesta-congreso/20260421/", "Newtral, toma en consideración de la ley de vivienda del PP, 21/04/2026", "parlamento", "2026-04-21"],
    vox: ["https://theobjective.com/wp-content/uploads/2023/07/programa-vox-23j.pdf", "Programa electoral de Vox para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    fa: ["https://movimientosumar.es/wp-content/uploads/2023/07/Un-Programa-para-ti.pdf", "Programa electoral de Sumar de 2023", "programa", "2023-07"],
    pod: ["https://www.publico.es/politica/congreso/derechas-tumban-prorroga-alquileres.html", "Público, votación en el Congreso del 28/04/2026", "parlamento", "2026-04-28"],
    erc: ["https://www.merca2.es/2023/04/27/ley-de-vivienda-mayoria-absoluta-1292494/", "Merca2, votación de la Ley de Vivienda del 27/04/2023", "parlamento", "2023-04-27"],
    junts: ["https://www.publico.es/politica/congreso/derechas-tumban-prorroga-alquileres.html", "Público, votación en el Congreso del 28/04/2026", "parlamento", "2026-04-28"]
  },
  B02: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"],
    pp: ["https://www.pp.es/wp-content/uploads/2026/10/26-10-21-UNA-NUEVA-GENERACION-DE-PROPIETARIOS.pdf", "PP, argumentario «Hablemos claro: Una nueva generación de propietarios» (octubre de 2026)", "declaracion", "2026-10-22"]
  },
  B03: {
    psoe: ["https://www.deia.eus/politica/2025/03/18/psoe-acepta-tramitar-congreso-ley-9413516.html", "Deia (Europa Press), toma en consideración de la ley de Junts sobre ocupación, 18/03/2025", "parlamento", "2025-03-18"],
    pp: ["https://www.pp.es/wp-content/uploads/2026/10/CONTRATO-CON-ESPANA-.pdf", "«Mi contrato con España», compromisos de Feijóo para el 29-N (PP, 19/10/2026)", "programa", "2026-10-19"]
  },
  B04: {
    psoe: ["https://www.legaltoday.com/actualidad-juridica/noticias-de-derecho/el-decreto-del-escudo-social-con-cambios-en-la-moratoria-de-desahucios-entrara-en-vigor-manana-2026-02-04/", "Legal Today, febrero de 2026", "gobierno", "2026-02"]
  },
  B05: {
    psoe: ["https://forbes.es/?p=625995", "Forbes España (Europa Press), declaraciones de la ministra de Vivienda Isabel Rodríguez, 20/02/2025", "declaracion", "2025-02-20"]
  },
  C01: {
    psoe: ["https://maldita.es/malditahemeroteca/20240731/ceder-tributos-cataluna-psoe/", "Maldita, julio de 2024", "declaracion", "2024-07"],
    pp: ["https://valenciaplaza.com/presidentes-pp-firman-manifiesto-posicion-comun-contra-cupo-catalan", "Valencia Plaza (EFE), manifiesto de los presidentes autonómicos del PP, 26/08/2024", "declaracion", "2024-08-26"],
    vox: ["https://theobjective.com/wp-content/uploads/2023/07/programa-vox-23j.pdf", "Programa electoral de Vox para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    fa: ["https://es.ara.cat/politica/parlamento-tumba-concierto-economico-voto-psc_1_5432030.html", "Ara, votación en el Parlament del 03/07/2025", "parlamento", "2025-07-03"],
    erc: ["https://www.elindependiente.com/espana/2025/09/03/erc-ultima-el-registro-de-su-propuesta-de-financiacion-para-cataluna-para-presionar-al-gobierno/", "El Independiente, 03/09/2025", "declaracion", "2025-09-03"],
    junts: ["https://www.diaridetarragona.com/catalunya/249019/junts-avisa-apoyara-sistema-financiacion-singular-pasa-concierto-economico.html", "Diari de Tarragona (ACN), declaraciones de Míriam Nogueras, 07/01/2026", "declaracion", "2026-01-07"]
  },
  C03: {
    pp: ["https://www.pp.es/storage/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf#page=50", "Programa electoral del PP de 2023", "programa", "2023-07-04"]
  },
  C04: {
    psoe: ["https://theobjective.com/espana/politica/2024-11-05/psoe-cambios-constitucion-congreso-federal/", "The Objective, ponencia marco del 41.º Congreso Federal del PSOE, 05/11/2024", "prensa", "2024-11-05"]
  },
  C05: {
    psoe: ["https://theobjective.com/espana/politica/2023-11-09/consulte-aqui-acuerdo-integro-psoe-junts/", "The Objective, acuerdo de investidura PSOE-Junts, 09/11/2023", "prensa", "2023-11-09"],
    pp: ["https://www.pp.es/storage/2023/07/23.07.19_titulares_feijoo_en_arv.pdf", "PP, titulares de Feijóo en «Al Rojo Vivo» (19/07/2023)", "declaracion", "2023-07-19"],
    fa: ["https://es.ara.cat/politica/elecciones-generales/programa-sumar-referendum-consulta-mesa-dialogo_1_4754782.html", "Ara, programa de Sumar de 2023", "programa", "2023"]
  },
  D01: {
    pp: ["https://es.ara.cat/politica/feijoo-plantea-reforma-partido-gane-elecciones-tenga-plus-diputados_1_5783437.html", "Ara, entrevista de Feijóo en esRadio, 29/06/2026", "declaracion", "2026-06-29"],
    fa: ["https://movimientosumar.es/wp-content/uploads/2023/07/Un-Programa-para-ti.pdf", "Programa electoral de Sumar de 2023", "programa", "2023-07"]
  },
  D03: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"],
    pp: ["https://www.pp.es/wp-content/uploads/2026/10/CONTRATO-CON-ESPANA-.pdf", "«Mi contrato con España», compromisos de Feijóo para el 29-N (PP, 19/10/2026)", "programa", "2026-10-19"]
  },
  D04: {
    psoe: ["https://www.boe.es/buscar/act.php?id=BOE-A-2024-11776", "BOE, Ley Orgánica 1/2024, de amnistía", "gobierno", "2024-06-11"],
    pp: ["https://es.ara.cat/politica/congreso-aprueba-amnistia-decada-independentismo_1_5045075.html", "Ara, votación final de la Ley de amnistía en el Congreso del 30/05/2024", "parlamento", "2024-05-30"]
  },
  D07: {
    psoe: ["https://es.ara.cat/politica/relacion-psoe-monarquia_1_5823620.html", "Ara, «¿Qué relación tiene el PSOE con la monarquía?», 13/08/2026", "prensa", "2026-08-13"]
  },
  E01: {
    psoe: ["https://www.eldebate.com/espana/20260212/junts-saca-adelante-voto-pp-psoe-vox-ley-combatir-multirreincidencia_384540.html", "El Debate, votación del 12 de febrero de 2026", "parlamento", "2026-02-12"],
    pp: ["https://theobjective.com/wp-content/uploads/2023/07/programa-pp-23j.pdf", "Programa electoral del PP para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    vox: ["https://www.eldebate.com/espana/20260212/junts-saca-adelante-voto-pp-psoe-vox-ley-combatir-multirreincidencia_384540.html", "El Debate, votación de la ley de multirreincidencia, 12/02/2026", "parlamento", "2026-02-12"],
    fa: ["https://www.diaridetarragona.com/espana/252011/congreso-aprueba-amplio-apoyo-ley-junts-multirreincidencia.html", "Diari de Tarragona, votación del 12 de febrero de 2026", "parlamento", "2026-02-12"],
    pod: ["https://www.diarimes.com/es/actualidad/260212/congreso-aprueba-ley-multirreincidencia-votos-psoe-pp-vox_208972.html", "Diari Més, votación en el Congreso del 12/02/2026", "parlamento", "2026-02-12"],
    erc: ["https://www.diarimes.com/es/actualidad/260212/congreso-aprueba-ley-multirreincidencia-votos-psoe-pp-vox_208972.html", "Diari Més, votación en el Congreso del 12/02/2026", "parlamento", "2026-02-12"],
    junts: ["https://es.ara.cat/politica/congreso-aprueba-jueves-ley-multirreincidencia-junts_1_5646210.html", "Ara, votación en el Congreso del 12/02/2026", "parlamento", "2026-02-12"]
  },
  E02: {
    pp: ["https://www.pp.es/storage/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf#page=81", "Programa electoral del PP de 2023", "programa", "2023-07-04"]
  },
  E03: {
    psoe: ["https://maldita.es/malditahemeroteca/20241003/sanchez-2015-derogar-ley-mordaza", "Maldita.es, acuerdo de coalición PSOE-Sumar (24/10/2023) y pacto con EH Bildu (03/10/2024)", "prensa", "2024-10-03"],
    pp: ["https://www.ondavasca.com/el-congreso-debate-las-enmiendas-a-la-totalidad-de-pp-y-vox-a-la-reforma-de-la-ley-mordaza/", "Onda Vasca, enmienda a la totalidad del PP en el Congreso, 12/12/2024", "parlamento", "2024-12-12"]
  },
  E06: {
    psoe: ["https://es.ara.cat/politica/psoe-sumar-pactan-despenalizar-injurias-corona-ofensas-sentimientos-religiosos_1_5769460.html", "Ara, pacto PSOE-Sumar para reformar el Código Penal, 15/06/2026", "prensa", "2026-06-15"]
  },
  E08: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"],
    pp: ["https://www.pp.es/storage/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf#page=62", "Programa electoral del PP de 2023", "programa", "2023-07-04"]
  },
  F01: {
    psoe: ["https://www.diaridetarragona.com/espana/250726/saiz-sobre-regularizacion-migrantes-conscientes-administracion-dar-respuesta.html", "Diari de Tarragona (EFE), declaraciones de la ministra Elma Saiz, 27/01/2026", "gobierno", "2026-01-27"],
    pp: ["https://theobjective.com/espana/politica/2026-01-29/pp-tribunales-regularizacion-inmigrantes/", "The Objective (con Europa Press), entrevista de Feijóo en Antena 3, 29/01/2026", "declaracion", "2026-01-29"],
    vox: ["https://theobjective.com/wp-content/uploads/2023/07/programa-vox-23j.pdf", "Programa electoral de Vox para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    fa: ["https://movimientosumar.es/wp-content/uploads/2023/07/Un-Programa-para-ti.pdf", "Programa electoral de Sumar de 2023", "programa", "2023-07"],
    pod: ["https://www.elindependiente.com/espana/2026/01/26/el-gobierno-pacta-con-podemos-una-regularizacion-extraordinaria-de-migrantes-que-acrediten-cinco-meses-de-residencia/amp/", "El Independiente, enero de 2026", "prensa", "2026-01"],
    erc: ["https://www.elsaltodiario.com/migracion/socios-del-gobierno-presionan-desatascar-regularizacion-migrantes", "El Salto, debate de una PNL en el Congreso, 26/02/2025", "parlamento", "2025-02-26"],
    junts: ["https://en.ara.cat/politics/together-they-will-denounce-in-europe-the-marginalization-of-catalan-in-the-regularization-of-migrants_1_5709974.html", "Ara (edición en inglés), comunicado de Junts, 17/04/2026", "declaracion", "2026-04-17"]
  },
  F02: {
    psoe: ["https://www.lamoncloa.gob.es/consejodeministros/resumenes/Paginas/2026/140426-rueda-prensa-ministros.aspx", "La Moncloa, Consejo de Ministros del 14/04/2026: regularización extraordinaria", "gobierno", "2026-04-14"]
  },
  F03: {
    psoe: ["https://www.menorca.info/actualidad/nacional/2026/05/03/2621747/ofensiva-del-psoe-toda-espana-europa-contra-prioridad-nacional-vox.html", "Menorca – Es Diari (EFE), comunicado del PSOE contra la «prioridad nacional», 03/05/2026", "prensa", "2026-05-03"],
    pp: ["https://www.menorca.info/actualidad/nacional/2026/04/22/2614427/prioridad-nacional-desata-discrepancias-entre-vox-arraigo-espanoles-primero.html", "Menorca.info, abril de 2026", "prensa", "2026-04"]
  },
  F07: {
    pp: ["https://www.pp.es/storage/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf#page=32", "Programa electoral del PP de 2023", "programa", "2023-07-04"]
  },
  G01: {
    psoe: ["https://es.euronews.com/my-europe/2026/08/14/el-gobierno-de-espana-prorroga-la-central-nuclear-de-almaraz-hasta-2030-y-aplaza-su-cierre", "Euronews, agosto de 2026", "gobierno", "2026-08"],
    pp: ["https://theobjective.com/wp-content/uploads/2023/07/programa-pp-23j.pdf", "Programa electoral del PP para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    vox: ["https://theobjective.com/wp-content/uploads/2023/07/programa-vox-23j.pdf", "Programa electoral de Vox para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    fa: ["https://movimientosumar.es/wp-content/uploads/2023/07/Un-Programa-para-ti.pdf", "Programa electoral de Sumar de 2023", "programa", "2023-07"],
    pod: ["https://www.noticiasdenavarra.com/politica/2025/11/13/junts-salva-prorroga-nucleares-pese-10343862.html", "Noticias de Navarra (Europa Press), debate en el Congreso, 13/11/2025", "declaracion", "2025-11-13"],
    erc: ["https://www.noticiasdenavarra.com/politica/2025/11/13/junts-salva-prorroga-nucleares-pese-10343862.html", "Noticias de Navarra (Europa Press), votación en el Congreso, 13/11/2025", "parlamento", "2025-11-13"],
    junts: ["https://www.noticiasdenavarra.com/politica/2025/11/13/junts-salva-prorroga-nucleares-pese-10343862.html", "Noticias de Navarra (Europa Press), votación en el Congreso, 13/11/2025", "parlamento", "2025-11-13"]
  },
  G03: {
    psoe: ["https://www.deia.eus/economia/2025/12/12/sanchez-von-der-leyen-motor-combustion-10464731.html", "Deia (EFE), carta de Sánchez a Von der Leyen del 11/12/2025", "declaracion", "2025-12-12"],
    pp: ["https://www.moncloa.com/2024/05/24/montserrat-motores-combustion-2624770/", "Moncloa.com, Dolors Montserrat (cabeza de lista del PP a las europeas), 24/05/2024", "declaracion", "2024-05-24"]
  },
  G04: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"]
  },
  G09: {
    psoe: ["https://www.boe.es/buscar/doc.php?id=BOE-A-2025-12857", "BOE, Real Decreto-ley 7/2025, de 24 de junio, de refuerzo del sistema eléctrico", "gobierno", "2025-06"],
    pp: ["https://www.pp.es/storage/2026/04/26.04.27-Discurso-ANF-Jornadas-Apagon.pdf", "Discurso de Feijóo en las jornadas sobre el apagón (PP, 27/04/2026)", "declaracion", "2026-04-27"]
  },
  H01: {
    psoe: ["https://www.diaridetarragona.com/espana/233697/sanchez-comunica-carta-otan-gasto-defensa-ve-razonable-5.html", "Diari de Tarragona (EFE), carta de Sánchez a Rutte, 19/06/2025", "declaracion", "2025-06-19"],
    pp: ["https://www.publico.es/politica/pp-compromete-llegar-5-pib-defensa-pide-trump.html", "Público, postura del PP sobre el gasto en defensa, 15/10/2025", "declaracion", "2025-10-15"],
    vox: ["https://theobjective.com/espana/politica/2025-03-26/abascal-gasto-defensa-ceuta-melilla/", "The Objective, intervención de Abascal en el Congreso, 26/03/2025", "declaracion", "2025-03-26"],
    fa: ["https://www.elnacional.cat/es/politica/politicas-defensa-gasto-militar-divide-gobierno-socios-congreso_1384091_102.html", "ElNacional.cat, votación en el Congreso del 20/03/2025", "parlamento", "2025-03-20"],
    pod: ["https://www.elnacional.cat/es/politica/politicas-defensa-gasto-militar-divide-gobierno-socios-congreso_1384091_102.html", "ElNacional.cat, votación en el Congreso del 20/03/2025", "parlamento", "2025-03-20"],
    erc: ["https://www.elnacional.cat/es/politica/politicas-defensa-gasto-militar-divide-gobierno-socios-congreso_1384091_102.html", "ElNacional.cat, votación en el Congreso del 20/03/2025", "parlamento", "2025-03-20"],
    junts: ["https://www.galiciapress.es/articulo/politica/2026-06-11/5915942-congreso-rechaza-mocion-bng-pedia-salir-otan-reducir-gasto-militar-gobierno-dividido", "Galiciapress (Europa Press), votación en el Congreso del 11/06/2026", "parlamento", "2026-06-11"]
  },
  H02: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"]
  },
  H04: {
    psoe: ["https://www.boe.es/buscar/act.php?id=BOE-A-2025-18831", "BOE, Real Decreto-ley 10/2025, de 23 de septiembre (embargo de armas a Israel)", "gobierno", "2025-09-24"],
    pp: ["https://rtvc.es/congreso-aprueba-embargo-armas-israel-8-octubre-2025/", "RTVC, votación del 8 de octubre de 2025", "parlamento", "2025-10-08"]
  },
  H06: {
    pod: ["https://www.eldebate.com/espana/20260422/congreso-rechaza-peticion-podemos-convocar-nuevo-referendum-sobre-otan_409815.html", "El Debate, abril de 2026", "parlamento", "2026-04"]
  },
  H09: {
    psoe: ["https://www.vozpopuli.com/espana/sanchez-rechaza-propuesta-centros-inmigrantes-ue.html", "Vozpópuli, declaraciones de la portavoz Pilar Alegría, 15/10/2024", "prensa", "2024-10-15"]
  },
  I01: {
    psoe: ["https://theobjective.com/wp-content/uploads/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023-1.pdf", "Programa electoral del PSOE para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    pp: ["https://theobjective.com/wp-content/uploads/2023/07/programa-pp-23j.pdf", "Programa electoral del PP para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    vox: ["https://elfarodeceuta.es/vox-pregunta-infrafinancion-escuela-concertada/", "El Faro de Ceuta, interpelación de Vox en el Congreso, 02/04/2021", "declaracion", "2021-04-02"],
    fa: ["https://movimientosumar.es/wp-content/uploads/2023/07/Un-Programa-para-ti.pdf", "Programa electoral de Sumar de 2023", "programa", "2023-07"],
    pod: ["https://www.congreso.es/public_oficiales/L14/CONG/BOCG/B/BOCG-14-B-240-1.PDF", "BOCG, Proposición de Ley de Unidas Podemos, 29/04/2022", "programa", "2022-04-29"],
    erc: ["https://www.ultimahora.es/noticias/comunidades/2023/04/27/1925961/cambray-dice-govern-dejara-destinar-millones-concertar-educacion-segregada.html", "Última Hora (Europa Press), conseller de ERC Josep Gonzàlez-Cambray, 27/04/2023", "gobierno", "2023-04-27"],
    junts: ["https://naciodigital.cat/politica/pp-vox-i-cs-se-sumen-a-jxcat-en-defensa-de-lescola-concertada.html", "NacióDigital, enmienda a la LOMLOE, 18/11/2020", "parlamento", "2020-11-18"]
  },
  I02: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"]
  },
  J01: {
    psoe: ["https://theobjective.com/wp-content/uploads/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023-1.pdf", "Programa electoral del PSOE para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    pp: ["https://www.redaccionmedica.com/politica/20260318/la-ley-de-gestion-publica-llegara-herida-al-congreso-por-el-modelo-catalan/260331_0.html", "Redacción Médica, posición del PP ante la Ley de Gestión Pública del SNS, 18/03/2026", "declaracion", "2026-03-18"],
    vox: ["https://www.redaccionmedica.com/politica/20260318/la-ley-de-gestion-publica-llegara-herida-al-congreso-por-el-modelo-catalan/260331_0.html", "Redacción Médica, posición de Vox ante la Ley de Gestión Pública del SNS, 18/03/2026", "declaracion", "2026-03-18"],
    fa: ["https://www.redaccionmedica.com/politica/20260318/la-ley-de-gestion-publica-llegara-herida-al-congreso-por-el-modelo-catalan/260331_0.amp.html", "Redacción Médica, 18/03/2026", "declaracion", "2026-03-18"],
    pod: ["https://www.redaccionmedica.com/politica/20240401/podemos-lleva-al-congreso-la-muerte-lenta-de-gestion-indirecta-del-sns/216640_0.amp.html", "Redacción Médica, proposición de ley de Podemos, 01/04/2024", "programa", "2024-04-01"],
    erc: ["https://www.redaccionmedica.com/autonomias/cataluna/el-parlament-catalan-pide-la-retirada-de-la-ley-de-gestion-publica-del-sns-3607", "Redacción Médica, votación en el Parlament del 12/03/2026", "parlamento", "2026-03-12"],
    junts: ["https://www.redaccionmedica.com/politica/20260318/la-ley-de-gestion-publica-llegara-herida-al-congreso-por-el-modelo-catalan/260331_0.amp.html", "Redacción Médica, 18/03/2026", "declaracion", "2026-03-18"]
  },
  J03: {
    pp: ["https://www.redaccionmedica.com/profesionales/20250524/la-exclusividad-de-las-jefaturas-medicas-entra-en-la-politica-bloques/243693_0.amp.html", "Redacción Médica, consejeros de Sanidad del PP sobre la exclusividad, 24/05/2025", "prensa", "2025-05-24"]
  },
  J08: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"]
  },
  K01: {
    psoe: ["https://theobjective.com/wp-content/uploads/2023/07/PROGRAMA_ELECTORAL-GENERALES-2023-1.pdf", "Programa electoral del PSOE para el 23J de 2023 (copia publicada por The Objective)", "programa", "2023-07"],
    pp: ["https://www.newtral.es/acuerdo-mercosur-maria-guardiola-pp-europeo-sanchez-factcheck/20260129/", "Newtral, enero de 2026", "prensa", "2026-01"],
    vox: ["https://www.eldebate.com/campo-y-caza/20260121/parlamento-europeo-bloquea-entrada-vigor-trato-mercosur-menos-ano_376697.html", "El Debate, votación en el Parlamento Europeo sobre remitir el acuerdo UE-Mercosur al TJUE, 21/01/2026", "parlamento", "2026-01-21"],
    fa: ["https://fashionunited.es/noticias/empresas/el-parlamento-europeo-frena-la-entrada-en-vigor-del-acuerdo-de-libre-comercio-ue-mercosur/2026012248173", "FashionUnited, votación en el Parlamento Europeo del 21/01/2026", "parlamento", "2026-01-21"],
    pod: ["https://fashionunited.es/noticias/empresas/el-parlamento-europeo-frena-la-entrada-en-vigor-del-acuerdo-de-libre-comercio-ue-mercosur/2026012248173", "FashionUnited, votación en el Parlamento Europeo del 21/01/2026", "parlamento", "2026-01-21"]
  },
  K03: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"],
    pp: ["https://www.pp.es/storage/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf#page=27", "Programa electoral del PP de 2023", "programa", "2023-07-04"]
  },
  K04: {
    psoe: ["https://forbes.es/?p=672070", "Forbes España (Europa Press), votación sobre el lobo en la Ley de Desperdicio Alimentario, 03/04/2025", "parlamento", "2025-04-03"],
    pp: ["https://www.pp.es/storage/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf#page=31", "Programa electoral del PP de 2023", "programa", "2023-07-04"]
  },
  K05: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"]
  },
  L01: {
    psoe: ["https://www.diaridetarragona.com/espana/256561/gobierno-aprueba-proyecto-reforma-constitucional-proteger-aborto.html", "Diari de Tarragona (ACN), Consejo de Ministros del 07/04/2026", "gobierno", "2026-04-07"],
    pp: ["https://www.elsaltodiario.com/derechos-reproductivos/congreso-rechaza-enmiendas-totalidad-pp-vox-incluir-aborto-constitucion", "El Salto, abril de 2026", "parlamento", "2026-04"],
    vox: ["https://www.redaccionmedica.com/politica/20260423/pp-vox-vetan-el-blindaje-constitucional-del-aborto-propone-un-fraude/261890_0.html", "Redacción Médica, enmiendas a la totalidad de PP y Vox, 23/04/2026", "prensa", "2026-04-23"],
    fa: ["https://www.publico.es/politica/congreso/sumar-propone-reforma-articulo-43-constitucion-blindar-derecho-aborto.html", "Público, propuesta de reforma constitucional de Sumar, 27/02/2025", "declaracion", "2025-02-27"],
    pod: ["https://www.elespanol.com/espana/politica/20251017/carmen-calvo-suma-irene-montero-cuestiona-reforma-constitucion-propone-gobierno-aborto/1003743974273_0.amp.html", "El Español, declaraciones de Irene Montero, 17/10/2025", "declaracion", "2025-10-17"],
    erc: ["https://www.vozpopuli.com/espana/politica/la-reforma-del-aborto-supera-su-primer-examen-en-el-congreso-pero-se-encamina-al-fracaso.html", "Vozpópuli, debate de totalidad en el Congreso del 30/04/2026", "parlamento", "2026-04-30"],
    junts: ["https://www.vozpopuli.com/espana/politica/la-reforma-del-aborto-supera-su-primer-examen-en-el-congreso-pero-se-encamina-al-fracaso.html", "Vozpópuli, debate de totalidad en el Congreso del 30/04/2026", "parlamento", "2026-04-30"]
  },
  L02: {
    psoe: ["https://www.elindependiente.com/wp-content/uploads/2023/07/ProgramaElectoral_ElexGenerales_PSOE_2023.pdf", "Programa electoral del PSOE de 2023 (copia en El Independiente)", "programa", "2023-07-07"],
    pp: ["https://www.pp.es/storage/2023/07/programa_electoral_pp_23j_feijoo_2023.pdf#page=48", "Programa electoral del PP de 2023", "programa", "2023-07-04"]
  },
  L03: {
    psoe: ["https://www.boe.es/buscar/act.php?id=BOE-A-2023-5366", "BOE, Ley 4/2023 (Ley trans), artículos 43 y 44", "gobierno", "2023-03-01"],
    pp: ["https://theobjective.com/espana/tribunales/2025-04-27/tribunal-constitucional-modificara-ley-trans/", "The Objective, el Tribunal Constitucional estudia el recurso del PP contra la Ley trans, 27/04/2025", "prensa", "2025-04-27"]
  },
  L09: {
    psoe: ["https://www.vozpopuli.com/espana/politica/junts-se-queda-solo-y-ningun-partido-respalda-su-ley-contra-el-burka-y-el-niqab.html", "Vozpópuli, votación de la ley de Junts contra el burka, 14/04/2026", "parlamento", "2026-04-14"],
    pp: ["https://orain.eus/es/politica/2026/02/17/la-posible-prohibicion-del-burka-llega-al-congreso-avalada-el-pp-vox-sin-el-apoyo-junts/", "Orain, febrero de 2026", "parlamento", "2026-02"]
  }
};

// Justificación de una línea por postura (tanda T5 en adelante): por qué ese partido tiene esa postura, en
// lenguaje neutral y sin adjetivos. Se publica en data/preguntas.json (`why`) y la mostrará T8.
// Formato: { pregunta: { partido: "frase de hasta 200 caracteres" } }. Cada partido citado debe tener postura.
export const JUSTIF = {
  A01: {
    psoe: "Votó contra el veto al proyecto de su Gobierno que bajaba la jornada máxima a 37,5 horas semanales sin merma salarial.",
    pp: "El PP votó con Vox y Junts la enmienda a la totalidad que tumbó la ley: prefiere que la jornada se pacte en el diálogo social."
  },
  A03: {
    psoe: "Su Gobierno creó un impuesto estatal a las grandes fortunas que rige en todas las comunidades y lo prorrogó sin fecha de fin.",
    pp: "El PP promete suprimir el impuesto estatal de solidaridad sobre las grandes fortunas, que ve como una invasión de la autonomía fiscal."
  },
  A05: {
    psoe: "Su reforma de pensiones garantiza la revalorización con el IPC y equilibra el sistema por la vía de los ingresos."
  },
  B02: {
    psoe: "Apuesta por la Ley de Vivienda, con límites al alquiler y un parque público del 20 %, más que por liberalizar suelo.",
    pp: "El PP apuesta por aumentar la oferta (un millón de viviendas, suelo y licencias rápidas) y rechaza la regulación de precios de la ley de vivienda."
  },
  B03: {
    psoe: "Votó tramitar el desalojo en 48 horas propuesto por Junts, pero sostiene que «los datos no corroboran» la alarma y anunció enmiendas.",
    pp: "El PP promete una ley contra la ocupación ilegal con desalojo en 48 horas para proteger la propiedad."
  },
  B05: {
    psoe: "Su ministra de Vivienda defiende que los ayuntamientos con problemas puedan prohibir pisos turísticos, como ha anunciado Barcelona."
  },
  C03: {
    pp: "El PP propone reformar la LOMLOE y una EBAU común, pero respetando las competencias educativas de las comunidades."
  },
  C04: {
    psoe: "La ponencia de su 41.º Congreso (2024) propone «ahondar en la federalización» del Estado, en la línea de la Declaración de Granada."
  },
  C05: {
    psoe: "Rechaza el referéndum de autodeterminación: frente a la propuesta de Junts, ofrece desarrollar el Estatut de 2006.",
    pp: "El PP sostiene que un referéndum de autodeterminación no cabe en la Constitución y propone tipificar como delito convocarlo."
  },
  D01: {
    psoe: "Estimación: el PSOE no propone cambiar la circunscripción provincial y su programa de 2023 no trata la proporcionalidad.",
    pp: "El PP propone una prima de escaños para el partido ganador, en sentido contrario a un sistema más proporcional."
  },
  D03: {
    psoe: "Defiende que las Cortes elijan a los vocales del CGPJ, frente a que lo hagan los propios jueces.",
    pp: "El PP promete que «los jueces elegirán a los jueces», es decir, que elijan ellos a los vocales judiciales del CGPJ."
  },
  D04: {
    psoe: "Impulsó la Ley de amnistía de 2024 para la «normalización» en Cataluña y defiende que las Cortes pueden aprobarla.",
    pp: "El PP votó contra la Ley de amnistía y la recurrió ante el Tribunal Constitucional; la considera contraria a la igualdad ante la ley."
  },
  D07: {
    psoe: "Asume la monarquía parlamentaria de 1978 y su dirección rechaza reabrir el debate sobre la forma de Estado.",
    pp: "Defiende la monarquía parlamentaria de 1978 y votó en 2014 contra los referendos sobre la forma de Estado."
  },
  E02: {
    pp: "El PP introdujo la prisión permanente revisable en 2015 y propone ampliarla, no derogarla."
  },
  E03: {
    psoe: "Su acuerdo de coalición y su pacto con Bildu prevén sustituir o reformar a fondo la ley de 2015, aunque no la derogan entera.",
    pp: "El PP aprobó la ley en 2015, votó contra su reforma y defiende el texto vigente como protección de las fuerzas de seguridad."
  },
  E06: {
    psoe: "En junio de 2026 pactó con Sumar una reforma del Código Penal que suprime los delitos de injurias y calumnias a la Corona."
  },
  E08: {
    psoe: "Defiende la ley integral y el Pacto de Estado contra la violencia de género, y critica a los partidos que niegan esa violencia.",
    pp: "El PP reivindica el Pacto de Estado contra la violencia de género de 2017 y promete cumplirlo «sin pasos atrás»."
  },
  F02: {
    psoe: "Su Gobierno aprobó en abril de 2026 una regularización extraordinaria de inmigrantes en situación irregular."
  },
  F03: {
    psoe: "Considera ilegal la «prioridad nacional» de PP y Vox porque vulnera la igualdad del artículo 14 y presenta iniciativas en su contra."
  },
  F07: {
    psoe: "Sin postura estatal documentada; algunos gobiernos autonómicos del PSOE, como el de Castilla-La Mancha, aplican deducciones del IRPF en zonas rurales.",
    pp: "El PP propone una fiscalidad específica y bonificaciones para las zonas rurales despobladas, además de menores costes laborales en Soria, Cuenca y Teruel."
  },
  G03: {
    psoe: "Sánchez pidió por carta a la Comisión Europea mantener la prohibición de vender coches de combustión a partir de 2035.",
    pp: "El PP y el PPE piden aplazar o revisar la prohibición de 2035 en nombre de la neutralidad tecnológica y de la industria del automóvil."
  },
  G04: {
    psoe: "Prioriza desalación, reutilización y caudales ecológicos frente a ampliar los trasvases."
  },
  G09: {
    psoe: "Tras el apagón, su Gobierno defendió las renovables y aprobó medidas para reforzar las redes y el almacenamiento.",
    pp: "El PP atribuye el apagón a la falta de generación síncrona y prioriza la nuclear, la hidráulica y el gas, sin renunciar a las renovables."
  },
  H01: {
    psoe: "Sánchez rechazó el objetivo de la OTAN y sostiene que un gasto en defensa del 2,1 % del PIB basta para cubrir las capacidades exigidas a España."
  },
  H02: {
    psoe: "Se define como europeísta y propone decidir la política exterior común por mayoría cualificada, sin veto nacional."
  },
  H04: {
    psoe: "Su Gobierno aprobó por decreto ley el embargo de armas a Israel, que el Congreso convalidó en octubre de 2025."
  },
  H09: {
    psoe: "Su Gobierno rechaza los centros fuera de la UE al estilo Italia-Albania, por dudas sobre los derechos humanos."
  },
  I02: {
    psoe: "Propone que la universidad sea gratuita solo para quien apruebe las asignaturas a la primera, no para todos los estudiantes."
  },
  I07: {
    pp: "Estimación: en 2019 Vox exigió en Murcia el permiso de los padres para estas charlas; la dirección nacional del PP no se ha pronunciado."
  },
  J03: {
    psoe: "Estimación: el borrador de Estatuto Marco del Ministerio de Sanidad (Sumar) prevé exclusividad parcial; no consta una postura propia del PSOE.",
    pp: "Las comunidades del PP rechazan imponer la exclusividad del Estatuto Marco porque temen la fuga de médicos y defienden poder compatibilizar."
  },
  J08: {
    psoe: "Su programa promete fijar por ley tiempos máximos de espera comunes para todo el Sistema Nacional de Salud."
  },
  K03: {
    psoe: "Quiere priorizar la agricultura familiar y profesional y las pequeñas y medianas explotaciones.",
    pp: "El PP defiende ayudas de la PAC para todas las explotaciones, sean del tamaño que sean, y «PAC sin recortes»; no quiere concentrarlas."
  },
  K04: {
    psoe: "Votó en 2025 contra sacar al lobo del listado de protección; su ministra lo calificó de decisión «en contra de la ciencia».",
    pp: "El PP quiere sacar al lobo del LESPRE al norte del Duero y permitir su control para proteger la ganadería."
  },
  K05: {
    psoe: "Prioriza la ganadería extensiva sin proponer prohibir las granjas intensivas."
  },
  L02: {
    psoe: "Aprobó la Ley de eutanasia de 2021 y la defiende como un nuevo derecho.",
    pp: "El PP votó contra la ley de eutanasia, pero en 2023 promete revisarla, priorizando los cuidados paliativos, no derogarla."
  },
  L03: {
    psoe: "Su Gobierno aprobó la Ley trans de 2023, que permite el cambio registral desde los 16 años sin informes médicos.",
    pp: "El PP recurrió ante el Tribunal Constitucional el cambio registral desde los 16 años sin informes médicos que permite la Ley trans."
  },
  L09: {
    psoe: "Votó contra las leyes de Vox y Junts (febrero y abril de 2026) para prohibir el burka, por considerarlas discriminatorias."
  }
};
