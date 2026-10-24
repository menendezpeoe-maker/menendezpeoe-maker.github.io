// Tests por tema (tanda T10): 6–8 preguntas del banco por tema, con afirmaciones en ambos sentidos.
// La misma lista está en assets/papeleta.js (const TOPICS); qa/temas.mjs comprueba que coinciden.
export const TOPICS = {
  vivienda: { label: "Vivienda", code: "v", ids: ["B01", "B02", "B03", "B04", "B05", "B06", "B07"] },
  inmigracion: { label: "Inmigración", code: "i", ids: ["F01", "F02", "F03", "F04", "F05", "H09", "L09"] },
  economia: { label: "Impuestos y economía", code: "k", ids: ["A01", "A02", "A03", "A04", "A05", "A08", "A10"] },
  sanidad: { label: "Sanidad", code: "s", ids: ["J01", "J02", "J03", "J04", "J07", "J08"] },
  energia: { label: "Energía y medioambiente", code: "g", ids: ["G01", "G02", "G03", "G04", "G05", "G08", "G09"] },
  territorio: { label: "Territorio", code: "x", ids: ["C01", "C02", "C03", "C04", "C05", "C07"] },
};
