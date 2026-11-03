// Aplica a src/preguntas.src.mjs una lista revisada de fuentes para posturas «documentadas» que no tenían enlace.
// Uso: node qa/herramientas/aplicar-fuentes.mjs <revisado.json>
// Cada elemento: { id: "A01/bng", estado: "fuente" | "estimada", url, etiqueta, tipo, fecha, justificacion }
//   «fuente»: añade la fuente (SOURCES) y la justificación (JUSTIF) de esa postura.
//   «estimada»: no se encontró fuente fiable; la postura pasa a estimada (sufijo «~» en «pos»), que pesa menos.
// Inserta líneas en el archivo sin reformatearlo. Los cambios de valor de una postura se hacen a mano, nunca aquí.
import fs from "fs";
import { PARTY_ORDER } from "../../src/partidos.src.mjs";
const FILE = "src/preguntas.src.mjs";
const items = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const L = fs.readFileSync(FILE, "utf8").split("\n");
const start = (re) => L.findIndex((l) => re.test(l));
const block = (sectionRe, q) => {
  const s = start(sectionRe); if (s < 0) throw new Error(`No encuentro ${sectionRe}`);
  const i = L.findIndex((l, k) => k > s && l === `  ${q}: {`); if (i < 0) throw new Error(`No encuentro ${q} en ${sectionRe}`);
  const j = L.findIndex((l, k) => k > i && /^  \},?$/.test(l)); return [i, j];
};
const has = ([i, j], pid) => L.slice(i + 1, j).some((l) => l.startsWith(`    ${pid}: `));
const insert = (sectionRe, q, pid, value) => {
  const b = block(sectionRe, q); if (has(b, pid)) return false;
  const [, j] = b; if (!L[j - 1].trimEnd().endsWith(",") && !L[j - 1].trimEnd().endsWith("{")) L[j - 1] += ",";
  L.splice(j, 0, `    ${pid}: ${value},`); return true;
};
let nSrc = 0, nEst = 0;
for (const it of items) {
  const [q, pid] = it.id.split("/");
  if (it.estado === "fuente") {
    if (!/^https:\/\//.test(it.url) || !it.etiqueta || !it.tipo || !it.fecha || !it.justificacion) throw new Error(`${it.id}: faltan datos de la fuente`);
    if (insert(/^export const SOURCES = \{/, q, pid, JSON.stringify([it.url, it.etiqueta, it.tipo, it.fecha]).replace(/","/g, "\", \""))) nSrc++;
    insert(/^export const JUSTIF = \{/, q, pid, JSON.stringify(it.justificacion));
  } else if (it.estado === "estimada") {
    const i = L.findIndex((l) => l.startsWith(`{ id: "${q}",`)); const k = L.findIndex((l, n) => n > i && /^\s*pos: "/.test(l));
    const m = /^(\s*pos: ")([^"]*)(".*)$/.exec(L[k]); const t = m[2].split(" "), x = PARTY_ORDER.indexOf(pid);
    if (t.length !== PARTY_ORDER.length || x < 0 || t[x] === "0") throw new Error(`${it.id}: postura no encontrada`);
    if (!t[x].endsWith("~")) { t[x] += "~"; nEst++; }
    L[k] = m[1] + t.join(" ") + m[3];
  }
}
fs.writeFileSync(FILE, L.join("\n"));
console.log(`${nSrc} fuentes añadidas, ${nEst} posturas pasan a estimadas`);
