// Glosario electoral: definiciones breves y neutrales, cada una con su base legal (revisado el 23 oct 2026).
const L = "https://www.boe.es/buscar/act.php?id=BOE-A-1985-11672", CE = "https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229";
export const GLOSARIO = [
  { t: "Abstención", d: "No votar. Las personas que no votan no cuentan para calcular la barrera del 3 % ni el reparto de escaños.", f: [L, "LOREG, art. 163"] },
  { t: "Barrera electoral", d: "Porcentaje mínimo de votos que necesita una candidatura para entrar en el reparto de escaños: en el Congreso, el 3 % de los votos válidos de la circunscripción.", f: [L, "LOREG, art. 163.1.a"] },
  { t: "Campaña electoral", d: "Periodo en el que las candidaturas pueden pedir el voto. Dura quince días y termina a las cero horas del día anterior a la votación; para el 29N, del 13 al 27 de noviembre.", f: [L, "LOREG, arts. 50 y 51"] },
  { t: "Censo electoral", d: "Registro de las personas con derecho a voto. Tiene dos partes: los residentes en España (CER) y los residentes en el extranjero (CERA).", f: [L, "LOREG, art. 31"] },
  { t: "Circunscripción", d: "Territorio en el que se reparten los escaños. En el Congreso, cada provincia es una circunscripción, y Ceuta y Melilla eligen un diputado cada una.", f: [CE, "Constitución, art. 68.2"] },
  { t: "Coalición electoral", d: "Acuerdo entre partidos para presentarse juntos con una sola candidatura. Debe comunicarse a la Junta Electoral en los diez días siguientes a la convocatoria.", f: [L, "LOREG, art. 44"] },
  { t: "Escaño", d: "Puesto de diputado o senador. El Congreso tiene 350 escaños.", f: [CE, "Constitución, art. 68.1"] },
  { t: "Escrutinio", d: "Recuento de los votos. Primero lo hace cada mesa al cerrar los colegios y después la Junta Electoral Provincial (escrutinio general), que proclama a los electos.", f: [L, "LOREG, arts. 95 a 108"] },
  { t: "Interventor y apoderado", d: "Personas que nombran las candidaturas para vigilar la votación y el recuento. Los interventores actúan en una mesa concreta; los apoderados, en todos los colegios de la circunscripción.", f: [L, "LOREG, arts. 76 a 79"] },
  { t: "Investidura", d: "Votación en la que el Congreso otorga su confianza al candidato a la Presidencia del Gobierno. Necesita mayoría absoluta en la primera votación o mayoría simple en una segunda, 48 horas después.", f: [CE, "Constitución, art. 99"] },
  { t: "Jornada de reflexión", d: "El día anterior a la votación. No se puede hacer campaña ni pedir el voto.", f: [L, "LOREG, art. 53"] },
  { t: "Ley D'Hondt", d: "Método para repartir los escaños: los votos de cada candidatura se dividen entre 1, 2, 3… y los escaños van a los cocientes más altos.", f: [L, "LOREG, art. 163"] },
  { t: "Lista cerrada y bloqueada", d: "En el Congreso se vota a una candidatura completa, sin poder tachar nombres ni cambiar su orden: los escaños se asignan por el orden de la lista.", f: [L, "LOREG, arts. 96 y 163"] },
  { t: "Listas abiertas (Senado)", d: "En el Senado se vota a personas: en las provincias que eligen cuatro senadores, cada elector puede marcar hasta tres nombres, de una o de varias candidaturas.", f: [L, "LOREG, art. 166"] },
  { t: "Mesa electoral", d: "Lugar donde se vota. La forman un presidente y dos vocales, elegidos por sorteo entre los electores de la sección.", f: [L, "LOREG, arts. 25 y 26"] },
  { t: "Sondeos electorales", d: "Durante los cinco días anteriores a la votación está prohibido publicar o difundir sondeos electorales.", f: [L, "LOREG, art. 69.7"] },
  { t: "Voto en blanco", d: "Sobre sin papeleta o, en el Senado, papeleta sin ningún nombre marcado. Es un voto válido: cuenta para calcular la barrera del 3 %, pero no da escaños a nadie.", f: [L, "LOREG, art. 96.5"] },
  { t: "Voto nulo", d: "El que no se puede atribuir: papeleta no oficial, papeletas de distintas candidaturas en el mismo sobre, o papeleta con tachaduras o añadidos. No cuenta como voto válido.", f: [L, "LOREG, art. 96"] },
  { t: "Voto por correo", d: "Forma de votar sin ir a la mesa: se pide en Correos y se envía el voto por correo certificado dentro de plazo.", f: [L, "LOREG, arts. 72 y 73"] },
];
