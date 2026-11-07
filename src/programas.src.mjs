// Programas electorales del 29N: estado del programa de cada candidatura (página /programas/).
// Solo se marca «publicado» con el enlace oficial del partido (su web o el PDF) y la fecha de publicación.
// Cada tanda de campaña lo vuelve a comprobar y actualiza `comprobado`.
export const PROGRAMAS = {
  comprobado: "2026-11-07",
  // id de partido → { url, titulo, fecha }   (vacío: aún no publicado)
  publicados: {},
  // Candidaturas que no figuran en la proclamación definitiva del BOE (3 nov): también están fuera del test («out»)
  sinLista: ["upl", "pav", "jmm"],
  boe: { url: "https://www.boe.es/diario_boe/txt.php?id=BOE-A-2026-23103", label: "BOE del 3 de noviembre de 2026, candidaturas proclamadas", fecha: "2026-11-03" },
};
