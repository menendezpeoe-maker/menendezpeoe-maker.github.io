// Programas electorales del 29N: estado del programa de cada candidatura (página /programas/).
// Solo se marca «publicado» con el enlace oficial del partido (su web o el PDF) y la fecha de publicación.
// Cada tanda de campaña lo vuelve a comprobar y actualiza `comprobado`.
export const PROGRAMAS = {
  comprobado: "2026-11-17",
  // id de partido → { url, titulo, fecha, alta?, tipo?, nota? }   (tipo "avance": documento breve o parcial; si no, programa completo)   (vacío: aún no publicado). `alta`: día en que entró en la web, solo si la
  // fecha del programa no es un día concreto; ordena «Últimas incorporaciones» en /programas/.
  publicados: {
    fa: { url: "https://frenteamplio.info/pdf/ProgramaFrenteAmplio.pdf", titulo: "Programa electoral del Frente Amplio para las elecciones generales del 29N de 2026", fecha: "2026-11-16" },
    bildu: { url: "https://ehbildu.eus/media/dokumentuak/posibleegin-programa-cas.pdf", titulo: "Programa de EH Bildu para las generales del 29N de 2026: «Posible egin. Garantía y derechos» (versión en castellano)", fecha: "2026-11-16" },
    psoe: { url: "https://www.psoe.es/media-content/2026/11/PROGRAMAPSOE29N26.pdf", titulo: "Programa electoral del PSOE para las generales del 29N de 2026: «La fuerza de seguir avanzando»", fecha: "2026-11-14" },
    comp: { url: "https://frontvalencia.net/programa-compromis-front-valencia.pdf", titulo: "Programa electoral de Compromís-Front Valencià para el 29N (en valenciano)", fecha: "2026-11-13" },
    gbai: { url: "https://geroabai.eus/files/2026/11/bases-politicas-29n-1.pdf", titulo: "Bases políticas de Geroa Bai para las elecciones generales del 29 de noviembre de 2026", fecha: "2026-11-13", tipo: "avance", nota: "bases políticas de 14 páginas, sin medidas detalladas" },
    existe: { url: "https://teruelexiste.info/wp-content/uploads/2026/11/Programa-Elecciones-Generales-2026.pdf", titulo: "Programa de Teruel Existe para las elecciones generales de 2026", fecha: "2026-11-12", tipo: "avance", nota: "tres páginas con 14 propuestas" },
    upc: { url: "https://unidadpueblocanario.org/documentos/manifiesto-upc.pdf", titulo: "Manifiesto electoral de Unidad del Pueblo Canario para el 29N", fecha: "2026-11", alta: "2026-11-15", tipo: "avance", nota: "manifiesto de seis páginas con 16 ejes" },
    soria: { url: "https://soriaya.org/wp-content/uploads/2026/11/ProgramaGenerales_26.pdf", titulo: "Programa de Soria ¡Ya! para las generales del 29N de 2026 (una página)", fecha: "2026-11-12", tipo: "avance", nota: "una página con sus exigencias" },
    d21: { url: "https://mi.democracia21.es/programa", titulo: "«La España que merecemos», programa electoral de Democracia 21 para el 29N (versión web, sin fecha impresa; detectado el 14 nov)", fecha: "2026-11", alta: "2026-11-14" },
    pacma: { url: "https://pacma.es/wp-content/uploads/2026/11/PE_GENERALES_29N26.pdf", titulo: "Programa electoral de PACMA para las elecciones generales del 29N de 2026", fecha: "2026-11-12" },
    falange: { url: "https://falange.es/wp-content/uploads/2026/11/FEDELASJONS_ProgramaElectoral_29NGenerales2026.pdf", titulo: "Programa electoral de Falange Española de las JONS para las elecciones generales del 29 de noviembre de 2026", fecha: "2026-11-13" },
    mj: { url: "https://www.porunmundomasjusto.es/wp-content/uploads/2026/11/Castellano.pdf", titulo: "Programa electoral de Por un Mundo Más Justo para las generales del 29N de 2026", fecha: "2026-11-07" },
    pp: { url: "https://www.pp.es/wp-content/uploads/2026/11/PROGRAMA-ELECTORAL-PP-2026-RECONSTRUCCION-NACIONAL.pdf", titulo: "Programa electoral del PP: «Reconstrucción Nacional»", fecha: "2026-11-10" },
    erc: { url: "https://esquerrarepublicana.cat/documents/e2026-programa.pdf", titulo: "Programa electoral de ERC (Eleccions al Congrés 2026)", fecha: "2026-11-10" },
    ccpc: { url: "https://primerocanarias.com/wp-content/uploads/2026/11/CCA-26-Programa_Electoral-29NOV-comprimido.pdf", titulo: "Programa electoral de Coalición Canaria y Primero Canarias: «Defiende Canarias»", fecha: "2026-11-09" },
    vox: { url: "https://www.voxespana.es/wp-content/uploads/2026/11/Programa-completo-A5-1.pdf", titulo: "Programa electoral de Vox para el 29 de noviembre de 2026: «Es sentido común»", fecha: "2026-11" },
    pnv: { url: "https://www.eaj-pnv.eus/es/adjuntos-documentos/21765/pdf/programa-electoral-29n", titulo: "Programa de EAJ-PNV para las elecciones generales de 2026", fecha: "2026-11" },
    adel: { url: "https://programa.adelanteandalucia.org/programa-29n-adelante-andalucia.pdf", titulo: "Programa electoral de Adelante Andalucía para el 29N: «Un programa para frenar a las derechas»", fecha: "2026-11" },
    salf: { url: "https://www.seacabolafiesta.com/SALF_Contrato_Electoral_29N.pdf", titulo: "Contrato electoral de Se Acabó La Fiesta para las generales del 29 de noviembre de 2026", fecha: "2026-11" },
    ph: { url: "https://www.partidohumanista.es/Documentos/Programas/Programa%20Generales%202026.pdf", titulo: "Programa del Partido Humanista para las elecciones generales de 2026", fecha: "2026-11" },
    fo: { url: "https://frenteobrero.es/documentos/programa-frente-obrero.pdf", titulo: "Programa político del Frente Obrero (enlazado desde su web como programa de las generales de 2026)", fecha: "2026-10" },
    ie: { url: "https://iustitiaeuropa.es/img/bloques/documentos/descarga-aqui-tu-contrato-00030.pdf", titulo: "Contrato electoral de Iustitia Europa (sección «Elecciones 29-N» de su web)", fecha: "2026-11-11" },
    bng: { url: "https://www.bng.gal/media/bnggaliza/files/2026/11/03/26_bng_xerais_documentos_programa_electoral.pdf", titulo: "Programa electoral del BNG (Xerais 2026)", fecha: "2026-11-03" },
  },
  // Candidaturas que no figuran en la proclamación definitiva del BOE (3 nov): también están fuera del test («out»)
  sinLista: ["upl", "pav", "jmm"],
  boe: { url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-23103", label: "BOE del 3 de noviembre de 2026, candidaturas proclamadas", fecha: "2026-11-03" },
};
