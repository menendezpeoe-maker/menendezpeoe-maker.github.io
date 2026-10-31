// Programas electorales del 29N: estado del programa de cada candidatura (página /programas/).
// Solo se marca «publicado» con el enlace oficial del partido (su web o el PDF) y la fecha de publicación.
// Cada tanda de campaña lo vuelve a comprobar y actualiza `comprobado`.
export const PROGRAMAS = {
  comprobado: "2026-10-31",
  // id de partido → { url, titulo, fecha }   (vacío: aún no publicado)
  publicados: {},
  // Candidaturas que no figuran en las listas provisionales del BOE (se revisa con la proclamación definitiva)
  sinLista: ["upl", "pav", "jmm"],
  boe: { url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-22607", label: "BOE del 28 de octubre de 2026, candidaturas presentadas al Congreso", fecha: "2026-10-28" },
};
