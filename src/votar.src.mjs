// Guía para votar y calendario de las elecciones generales del 29 de noviembre de 2026.
// SOLO datos de fuentes oficiales abiertas y comprobadas (revisado el 23 oct 2026). Cada dato lleva su fuente.
// Si cambia algo (nuevos acuerdos de la JEC, candidaturas proclamadas…), actualízalo aquí con su enlace.

const RD = { url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-20742", label: "Real Decreto 806/2026 (BOE, 6 oct 2026)" };
const JEC = { url: "https://www.juntaelectoralcentral.es/cs/jec/documentos/eg2026_calendario.pdf", label: "Calendario electoral de la Junta Electoral Central" };
const INE = { url: "https://www.ine.es/dyngs/CEL/index.htm?cid=1700", label: "Oficina del Censo Electoral (INE): elecciones generales 2026" };
const INE_MESA = { url: "https://sede.ine.gob.es/ce-mesas/?lang=es_ES", label: "Consulta de mesa y local electoral (INE)" };
const COR = { url: "https://www.correos.es/es/es/particulares/para-el-ciudadano/voto-por-correo", label: "Correos: voto por correo" };
const EXT = { url: "https://www.exteriores.gob.es/es/Paginas/Elecciones.aspx", label: "Ministerio de Asuntos Exteriores: elecciones" };
const LOREG = { url: "https://www.boe.es/buscar/act.php?id=BOE-A-1985-11672", label: "Ley Orgánica del Régimen Electoral General" };
const BRAILLE = { url: "https://www.boe.es/eli/es/rd/2007/12/07/1612/con", label: "Real Decreto 1612/2007 (voto accesible)" };

export const VOTAR = {
  revisado: "2026-10-23",
  calendario: [
    { fecha: "2026-10-06", cuando: "6 de octubre", hito: "Convocatoria y disolución de las Cortes", nota: "Se publica en el BOE el real decreto que disuelve el Congreso y el Senado y convoca las elecciones.", fuente: RD },
    { fecha: "2026-10-06", cuando: "6 oct – 19 nov", hito: "Plazo para pedir el voto por correo", nota: "En cualquier oficina de Correos o por internet con certificado digital.", fuente: JEC },
    { fecha: "2026-10-06", cuando: "6 oct – 2 nov", hito: "Plazo para pedir la documentación del voto en braille", fuente: JEC },
    { fecha: "2026-10-06", cuando: "6 – 31 oct", hito: "Solicitud del voto de quienes están temporalmente en el extranjero", fuente: JEC },
    { fecha: "2026-10-12", cuando: "12 – 19 oct", hito: "Consulta y reclamaciones del censo electoral", nota: "En ayuntamientos y consulados.", fuente: JEC },
    { fecha: "2026-10-21", cuando: "21 – 26 oct", hito: "Presentación de candidaturas", fuente: JEC },
    { fecha: "2026-10-24", cuando: "24 – 30 oct", hito: "Envío de la documentación a los residentes en el extranjero (CERA)", fuente: JEC },
    { fecha: "2026-10-28", cuando: "28 de octubre", hito: "Publicación en el BOE de las candidaturas presentadas", fuente: JEC },
    { fecha: "2026-11-02", cuando: "2 de noviembre", hito: "Proclamación de candidaturas", fuente: JEC },
    { fecha: "2026-11-03", cuando: "3 de noviembre", hito: "Publicación en el BOE de las candidaturas proclamadas", fuente: JEC },
    { fecha: "2026-11-09", cuando: "9 – 22 nov", hito: "La Oficina del Censo envía la documentación del voto por correo", nota: "Llega por correo certificado y hay que firmar el acuse de recibo en persona.", fuente: JEC },
    { fecha: "2026-11-13", cuando: "13 – 27 nov", hito: "Campaña electoral", nota: "Empieza a las 0:00 del viernes 13 y termina a las 24:00 del viernes 27.", fuente: RD },
    { fecha: "2026-11-21", cuando: "21 – 26 nov", hito: "Voto en urna en los consulados (residentes en el extranjero)", fuente: JEC },
    { fecha: "2026-11-24", cuando: "24 – 28 nov", hito: "Prohibido publicar o difundir sondeos electorales", fuente: JEC },
    { fecha: "2026-11-24", cuando: "24 de noviembre", hito: "Último día para enviar por correo el voto al consulado (residentes en el extranjero)", fuente: JEC },
    { fecha: "2026-11-25", cuando: "25 de noviembre", hito: "Último día para entregar el voto por correo en Correos", fuente: JEC },
    { fecha: "2026-11-28", cuando: "28 de noviembre", hito: "Jornada de reflexión", fuente: JEC },
    { fecha: "2026-11-29", cuando: "Domingo 29 de noviembre", hito: "Jornada de votación", nota: "La ley electoral (art. 84.1) fija la votación de 9:00 a 20:00.", fuente: RD, fuente2: LOREG },
    { fecha: "2026-12-04", cuando: "4 – 7 dic", hito: "Escrutinio general en las Juntas Electorales Provinciales", fuente: JEC },
    { fecha: "2026-12-23", cuando: "23 de diciembre", hito: "Constitución de las nuevas Cortes", nota: "Sesiones constitutivas del Congreso y del Senado a las 10:00.", fuente: RD },
  ],
  secciones: [
    { id: "quien", titulo: "Quién puede votar y qué llevar", pasos: [
      "Pueden votar las personas de nacionalidad española mayores de edad inscritas en el censo electoral (en el de residentes en España o en el de residentes en el extranjero). Para estas elecciones se usa el censo cerrado a 1 de agosto de 2026.",
      "Para votar en la mesa hay que identificarse con el DNI, el pasaporte o el permiso de conducir, siempre que lleve tu fotografía. La Junta Electoral Central admite el documento aunque esté caducado.",
    ], fuentes: [INE, LOREG, { url: "https://www.juntaelectoralcentral.es/cs/jec/informacion", label: "Junta Electoral Central: información al elector" }] },
    { id: "donde", titulo: "Dónde te toca votar", pasos: [
      "La Oficina del Censo Electoral envía a cada elector una tarjeta con su mesa y su local electoral entre el 2 y el 10 de noviembre.",
      "También puedes consultarlo en la web del INE sin certificado digital, indicando, entre otros datos, la provincia, el municipio y la inicial de tu primer apellido, o en tu ayuntamiento o consulado. El teléfono gratuito de la Oficina del Censo es el 900 343 232 (de lunes a viernes laborables, de 9:00 a 14:00, y el 29 de noviembre, de 8:00 a 20:00; consulta en la web del INE los horarios ampliados de algunos días).",
    ], fuentes: [INE_MESA, INE, { url: "https://www.ine.es/dyngs/CEL/index.htm?cid=1702", label: "Plazos de interés para los electores (INE)" }] },
    { id: "correo", titulo: "Voto por correo desde España", pasos: [
      "Pídelo hasta el 19 de noviembre, en persona en cualquier oficina de Correos (con el DNI, el pasaporte o el permiso de conducir originales, nunca fotocopias) o por internet en la web de Correos con DNI electrónico o certificado digital. Si una enfermedad o una discapacidad te impide pedirlo en persona, otra persona puede hacerlo por ti con autorización notarial o consular y un certificado médico oficial y gratuito.",
      "La Oficina del Censo envía la documentación por correo certificado entre el 9 y el 22 de noviembre; tienes que recibirla y firmar el acuse en persona. Después, envía tu voto por correo certificado desde cualquier oficina de Correos como muy tarde el 25 de noviembre.",
      "Si pides el voto por correo, ya no podrás votar en persona en tu mesa.",
    ], fuentes: [COR, INE, JEC] },
    { id: "extranjero", titulo: "Votar desde el extranjero", pasos: [
      "Si vives en el extranjero y estás inscrito en el censo de residentes ausentes (CERA), no tienes que pedir nada: la Oficina del Censo te envía la documentación entre el 24 y el 30 de octubre, y las papeletas, entre el 4 y el 8 de noviembre (más tarde si hay recursos contra candidaturas); también se pueden descargar en internet. Puedes enviar tu voto por correo a tu consulado como muy tarde el 24 de noviembre o depositarlo en urna en el consulado entre el 21 y el 26 de noviembre. No lo envíes directamente a la Junta Electoral Provincial: sería nulo.",
      "Si estás fuera de España de forma temporal, debes estar inscrito como no residente en el Registro de Matrícula Consular y pedir la documentación en persona en tu consulado o embajada hasta el 31 de octubre. Se envía entre el 3 y el 9 de noviembre (más tarde si hay recursos contra candidaturas) y debes enviar tu voto por correo certificado como muy tarde el 25 de noviembre.",
    ], fuentes: [EXT, INE, JEC] },
    { id: "accesible", titulo: "Personas con discapacidad", pasos: [
      "Toda persona puede votar de forma consciente, libre y voluntaria, con los medios de apoyo que necesite. Si una discapacidad te impide elegir la papeleta, meterla en el sobre o entregarla al presidente de la mesa, puedes ayudarte de una persona de tu confianza.",
      "Las personas ciegas o con discapacidad visual que conocen el braille (con una discapacidad reconocida de al menos el 33 % o afiliadas a la ONCE) pueden pedir la documentación del voto en braille hasta el 2 de noviembre. El día de la votación la recogen en su mesa y votan en un espacio accesible que garantiza su privacidad.",
    ], fuentes: [LOREG, BRAILLE, JEC] },
  ],
};
