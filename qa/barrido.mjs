// Barrido de coherencia con los programas del 29N (pedido por el titular el 13 nov 2026).
// Informe, no prueba: lista lo que puede haber quedado viejo cuando entra un programa nuevo, para revisarlo a mano
// con las reglas de siempre (regla 8: pasaje, página y alcance; lo dudoso no se aplica). Ver plan/BARRIDO.md.
// Uso: node qa/barrido.mjs [pid…]   (sin argumentos: todas las candidaturas con programa publicado)
// Sale con código 1 solo si hay textos fijos que contradicen los datos (sección 1); lo demás es una cola de trabajo.
import fs from "fs";
import { PROGRAMAS } from "../src/programas.src.mjs";
const R = (f) => fs.readFileSync(new URL(`../${f}`, import.meta.url), "utf8");
const bank = JSON.parse(R("data/preguntas.json")), pd = JSON.parse(R("data/partidos.json"));
const P = Object.fromEntries(pd.parties.map((p) => [p.id, p]));
const live = pd.order.filter((pid) => P[pid] && !P[pid].out);
const PUB = PROGRAMAS.publicados, pubLive = live.filter((pid) => PUB[pid]);
const only = process.argv.slice(2);
const want = only.length ? only : pubLive;
let hard = 0;

console.log(`Programas del 29N publicados: ${pubLive.length} de ${live.length} (comprobado el ${PROGRAMAS.comprobado})`);

// 1 · Textos fijos que dependen del estado de los programas (deben salir de los datos, no estar escritos a mano)
console.log("\n1 · Textos fijos sobre el estado de los programas o el número de candidaturas");
const FILES = ["pages.mjs", "papeleta-29n.html", "assets/papeleta.js", "publish.mjs", "src/temas.src.mjs", "src/partidos.src.mjs"];
const PATS = [
  [/(la mayoría|ningún|ninguno|casi todos)[^.<"`]{0,40}(ha|han) publicado[^.<"`]{0,60}/gi, "afirmación fija sobre cuántos han publicado"],
  [/(aún|todavía) no (ha|han) publicado[^.<"`]{0,60}/gi, "«aún no ha publicado» fijo (solo vale si es condicional por candidatura)"],
  [new RegExp(`\\b(${[...new Set([live.length - 1, live.length + 1, 29])].filter((n) => n !== live.length).join("|")}) (candidaturas|partidos)\\b`, "g"), `número de candidaturas distinto de ${live.length}`],
  [new RegExp(`\\b\\d+ de (${[...new Set([live.length - 1, 29])].filter((n) => n !== live.length).join("|")}) programas\\b`, "g"), "recuento «N de M programas» con M viejo"],
];
for (const f of FILES) {
  const lines = R(f).split("\n");
  lines.forEach((l, i) => { for (const [re, why] of PATS) for (const m of l.matchAll(re)) {
    // Lo condicional (con PROG[...] o ${…} en la misma expresión) sale de los datos y no cuenta
    const around = l.slice(Math.max(0, m.index - 160), m.index);
    if (/PROG\[|pub\b|\?\s*$|:\s*`?$|\$\{/.test(around.slice(-60))) continue;
    hard++; console.log(`  ✗ ${f}:${i + 1} · ${why}: «${m[0].trim()}»`);
  } });
}
if (!hard) console.log("  ✓ ninguno");

// 2 · Por candidatura con programa del 29N: posturas que siguen apoyadas en otra cosa (cola de revisión, regla 8)
console.log("\n2 · Posturas que aún no citan el programa del 29N (candidatas a revisar con él)");
for (const pid of want) {
  const url = PUB[pid]?.url; if (!url) { console.log(`  · ${pid}: sin programa del 29N publicado`); continue; }
  const qs = bank.questions.filter((q) => q.pos[pid]);
  const own = qs.filter((q) => q.src?.[pid]?.[0]?.split("#")[0] === url);
  const est = qs.filter((q) => q.est.includes(pid) && !own.includes(q));
  const old = qs.filter((q) => !own.includes(q) && !q.est.includes(pid) && q.src?.[pid]?.[2] === "programa");
  const why23 = qs.filter((q) => !own.includes(q) && /programa de 2023|programa del 23J|en 2023/i.test(q.why?.[pid] || ""));
  const unk = bank.questions.filter((q) => !q.pos[pid]).length;
  console.log(`  · ${P[pid].ab}: ${own.length} con el programa del 29N · ${old.length} con otro programa · ${est.length} estimadas · ${why23.length} justificaciones que citan 2023 · ${unk} sin postura`);
  if (only.length) {
    if (old.length) console.log(`      otro programa: ${old.map((q) => q.id).join(" ")}`);
    if (est.length) console.log(`      estimadas: ${est.map((q) => q.id).join(" ")}`);
    if (why23.length) console.log(`      citan 2023: ${why23.map((q) => q.id).join(" ")}`);
  }
}

// 3 · Lista de comprobación de secciones (lo que no se puede mirar con un script)
console.log(`\n3 · Secciones que revisar a mano tras un programa nuevo (plan/BARRIDO.md): ficha /partidos/<id>/ (descripción y propuestas), /programas/, /comparar/ de sus pares, /temas/ con resumen («En un minuto»), /prensa/ y /metodologia/ (cifras), /datos/ (CSV), portada («N de ${live.length}»), descripciones de src/partidos.src.mjs (tag, desc, props).`);
process.exit(hard ? 1 : 0);
