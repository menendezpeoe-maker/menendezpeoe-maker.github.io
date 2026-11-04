// Debates electorales del 29N (página /debates/). Solo datos publicados, con su fuente; lo no anunciado, «por confirmar».
// Nada de quién ganó ni resúmenes: tras cada debate solo se añade el enlace al vídeo oficial (campo `video`).
// Se revisa en S1, S1b, S1c, S1d y S2. `estado`: "propuesta" (sin confirmar por todos) · "confirmado" · "celebrado".
const RTVC = ["https://rtvc.es/feijoo-acepta-un-cara-a-cara-con-sanchez-el-16-de-noviembre-9-octubre-2026/", "RTVC, 9 de octubre de 2026"];
const INFOBAE = ["https://www.infobae.com/espana/2026/10/09/los-tres-debates-de-las-elecciones-generales-del-29n-ya-tienen-fecha-y-el-ultimo-se-celebrara-tres-dias-antes-de-los-comicios/", "Infobae, 9 de octubre de 2026"];
const EURONEWS = ["https://es.euronews.com/2026/10/22/sanchez-y-feijoo-se-citan-el-16-de-noviembre", "Euronews, 22 de octubre de 2026"];
export const DEBATES = {
  revisado: "2026-11-04",
  lista: [
    { id: "mediaset-cara-a-cara", formato: "Cara a cara entre Pedro Sánchez (PSOE) y Alberto Núñez Feijóo (PP)", organiza: "Mediaset", fecha: "2026-11-16", fechaTexto: "Lunes 16 de noviembre (aceptado por los dos candidatos; hora y confirmación de la cadena por anunciar)", hora: "", canal: "", participantes: "Pedro Sánchez y Alberto Núñez Feijóo", estado: "propuesta", fuentes: [EURONEWS, RTVC, INFOBAE] },
    { id: "rtve-portavoces", formato: "Debate entre portavoces de los grupos parlamentarios", organiza: "RTVE", fecha: "2026-11-23", fechaTexto: "Lunes 23 de noviembre (fecha propuesta)", hora: "", canal: "", participantes: "Portavoces de los grupos con representación en el Congreso (nombres por confirmar)", estado: "propuesta", fuentes: [INFOBAE, RTVC] },
    { id: "debate-candidatos", formato: "Debate entre los candidatos de los principales partidos", organiza: "Cadena por acordar (RTVE y Atresmedia han planteado organizarlo)", fecha: "2026-11-26", fechaTexto: "Jueves 26 de noviembre (fecha planteada; cadena aún sin acordar)", hora: "", canal: "", participantes: "Los principales candidatos, entre ellos los de Vox y Frente Amplio (por confirmar)", estado: "propuesta", fuentes: [EURONEWS, INFOBAE] },
  ],
};
