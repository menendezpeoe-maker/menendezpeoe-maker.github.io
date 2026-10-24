// Diputados por circunscripción en las elecciones generales del 29 de noviembre de 2026 (anexo del Real Decreto 806/2026)
// y reglas del reparto (Ley Orgánica del Régimen Electoral General). Revisado el 23 oct 2026.
export const SEATS_SOURCE = { url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-20742", label: "Real Decreto 806/2026, anexo (BOE, 6 oct 2026)" };
export const LOREG_URL = "https://www.boe.es/buscar/act.php?id=BOE-A-1985-11672";
export const SEATS = {
  albacete: 4, alicante: 12, almeria: 6, alava: 4, asturias: 7, avila: 3, badajoz: 5, baleares: 8, barcelona: 32, bizkaia: 8,
  burgos: 4, caceres: 4, cadiz: 8, cantabria: 5, castellon: 5, ciudadreal: 5, cordoba: 6, coruna: 8, cuenca: 3, gipuzkoa: 6,
  girona: 6, granada: 7, guadalajara: 3, huelva: 5, huesca: 3, jaen: 5, leon: 4, lleida: 4, lugo: 4, madrid: 38,
  malaga: 11, murcia: 10, navarra: 5, ourense: 4, palencia: 3, laspalmas: 8, pontevedra: 7, rioja: 4, salamanca: 4, tenerife: 7,
  segovia: 3, sevilla: 12, soria: 2, tarragona: 6, teruel: 3, toledo: 6, valencia: 16, valladolid: 5, zamora: 3, zaragoza: 7,
  ceuta: 1, melilla: 1,
};
// Senado (art. 3.2 del real decreto): 4 por provincia; en las islas y en Ceuta y Melilla, reglas propias
export const SENATE = {
  baleares: "En las Illes Balears se eligen 3 senadores en Mallorca y 1 en cada una de estas circunscripciones: Menorca e Ibiza-Formentera.",
  laspalmas: "En la provincia de Las Palmas se eligen 3 senadores en Gran Canaria y 1 en Fuerteventura y en Lanzarote.",
  tenerife: "En la provincia de Santa Cruz de Tenerife se eligen 3 senadores en Tenerife y 1 en La Gomera, en El Hierro y en La Palma.",
  ceuta: "Ceuta elige 2 senadores.",
  melilla: "Melilla elige 2 senadores.",
};
