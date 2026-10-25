// Registro público de cambios de posturas (página /correcciones/), generado desde el historial de git de
// data/preguntas.json: compara cada versión con la anterior y anota los cambios de valor y de «estimada».
// Uso: node qa/correcciones.mjs   → src/correcciones.json (publish.mjs lo usa; vuelve a ejecutarlo tras cambiar posturas)
import { execSync } from "child_process";
import fs from "fs";
const sh = (c) => execSync(c, { encoding: "utf8", maxBuffer: 1 << 28 });
const commits = sh("git log --reverse --format=%H%x09%ad --date=short -- data/preguntas.json").trim().split("\n").map((l) => l.split("\t"));
const load = (h) => { try { return JSON.parse(sh(`git show ${h}:data/preguntas.json`)); } catch { return null; } };
const out = [];
let prev = load(commits[0][0]);
for (const [h, date] of commits.slice(1)) {
  const cur = load(h); if (!cur || !prev) { prev = cur || prev; continue; }
  const P = Object.fromEntries(prev.questions.map((q) => [q.id, q]));
  for (const q of cur.questions) {
    const o = P[q.id]; if (!o) continue;
    for (const pid of new Set([...Object.keys(q.pos), ...Object.keys(o.pos)])) {
      const a = o.pos[pid] || 0, b = q.pos[pid] || 0, ea = o.est.includes(pid), eb = q.est.includes(pid);
      if (a === b && ea === eb) continue;
      if (a === b && ea && !eb && q.src?.[pid]) continue; // pasar de estimada a documentada al añadir fuente no es una corrección
      out.push({ fecha: date, id: q.id, partido: pid, de: a, a: b, estimadaAntes: ea, estimada: eb, motivo: q.notes?.[pid] || q.why?.[pid] || "", fuente: q.src?.[pid] || null });
    }
  }
  prev = cur;
}
// Dentro de un mismo día cuenta el cambio neto (los pasos intermedios de una revisión no llegaron a publicarse)
const net = new Map();
for (const c of out) { const k = `${c.fecha}|${c.id}|${c.partido}`, n = net.get(k); if (!n) net.set(k, c); else Object.assign(n, { a: c.a, estimada: c.estimada, motivo: c.motivo, fuente: c.fuente }); }
out.length = 0; for (const c of net.values()) if (c.de !== c.a || c.estimadaAntes !== c.estimada) out.push(c);
// Último cambio de cada postura primero
out.sort((x, y) => y.fecha.localeCompare(x.fecha) || x.id.localeCompare(y.id) || x.partido.localeCompare(y.partido));
fs.writeFileSync(new URL("../src/correcciones.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`src/correcciones.json: ${out.length} cambios en ${commits.length} versiones`);
