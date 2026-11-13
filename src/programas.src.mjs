// Programas electorales del 29N: estado del programa de cada candidatura (página /programas/).
// Solo se marca «publicado» con el enlace oficial del partido (su web o el PDF) y la fecha de publicación.
// Cada tanda de campaña lo vuelve a comprobar y actualiza `comprobado`.
export const PROGRAMAS = {
  comprobado: "2026-11-12",
  // id de partido → { url, titulo, fecha }   (vacío: aún no publicado)
  publicados: {
    pp: { url: "https://www.pp.es/wp-content/uploads/2026/11/PROGRAMA-ELECTORAL-PP-2026-RECONSTRUCCION-NACIONAL.pdf", titulo: "Programa electoral del PP: «Reconstrucción Nacional»", fecha: "2026-11" },
    erc: { url: "https://esquerrarepublicana.cat/documents/e2026-programa.pdf", titulo: "Programa electoral de ERC (Eleccions al Congrés 2026)", fecha: "2026-11" },
    ccpc: { url: "https://primerocanarias.com/wp-content/uploads/2026/11/CCA-26-Programa_Electoral-29NOV-comprimido.pdf", titulo: "Programa electoral de Coalición Canaria y Primero Canarias: «Defiende Canarias»", fecha: "2026-11-09" },
    vox: { url: "https://www.voxespana.es/wp-content/uploads/2026/11/Programa-completo-A5-1.pdf", titulo: "Programa electoral de Vox para el 29 de noviembre de 2026: «Es sentido común»", fecha: "2026-11" },
    pnv: { url: "https://www.eaj-pnv.eus/es/adjuntos-documentos/21765/pdf/programa-electoral-29n", titulo: "Programa de EAJ-PNV para las elecciones generales de 2026", fecha: "2026-11" },
    adel: { url: "https://programa.adelanteandalucia.org/programa-29n-adelante-andalucia.pdf", titulo: "Programa electoral de Adelante Andalucía para el 29N: «Un programa para frenar a las derechas»", fecha: "2026-11" },
    salf: { url: "https://www.seacabolafiesta.com/SALF_Contrato_Electoral_29N.pdf", titulo: "Contrato electoral de Se Acabó La Fiesta para las generales del 29 de noviembre de 2026", fecha: "2026-11" },
    ph: { url: "https://www.partidohumanista.es/Documentos/Programas/Programa%20Generales%202026.pdf", titulo: "Programa del Partido Humanista para las elecciones generales de 2026", fecha: "2026-11" },
    bng: { url: "https://www.bng.gal/media/bnggaliza/files/2026/11/03/26_bng_xerais_documentos_programa_electoral.pdf", titulo: "Programa electoral del BNG (Xerais 2026)", fecha: "2026-11-03" },
  },
  // Candidaturas que no figuran en la proclamación definitiva del BOE (3 nov): también están fuera del test («out»)
  sinLista: ["upl", "pav", "jmm"],
  boe: { url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-23103", label: "BOE del 3 de noviembre de 2026, candidaturas proclamadas", fecha: "2026-11-03" },
};
