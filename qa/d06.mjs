// Sensibilidad de la afinidad a una pregunta (D06 por defecto), con el motor real de la página (globalThis.__T29N).
// Perfiles uniformes 1–5 en todas las preguntas en el orden del JSON, LCG (1664525, 1013904223, 2^32), semilla 20261113;
// valor = 1 + floor(estado · 5 / 2^32). Con y sin la respuesta a la pregunta, con y sin prioridad de su área.
// Uso: NODE_PATH=$(npm root -g) node qa/d06.mjs [N=2000] [QID=D06]   (servidor :8765; BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const N = +(process.argv[2] || 2000), QID = process.argv[3] || "D06";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const ids = bank.questions.map((q) => q.id), area = bank.questions.find((q) => q.id === QID).area;
const PROVS = ["madrid", "bizkaia", "sevilla", "soria", "barcelona", "navarra"];
const browser = await chromium.launch(); const page = await browser.newPage();
await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
const out = await page.evaluate(({ ids, N, QID, area, PROVS }) => {
  const res = {};
  for (const prov of PROVS) for (const pr of [false, true]) {
    let s = 20261113 >>> 0; const next = () => (s = (Math.imul(1664525, s) + 1013904223) >>> 0);
    let changed = 0, maxd = 0, maxAt = "", same = 0;
    for (let k = 0; k < N; k++) {
      const ans = {}; for (const id of ids) ans[id] = 1 + Math.floor(next() * 5 / 4294967296);
      const st = { v: 2, mode: "completa", order: ids, idx: 0, ans, imp: {}, prios: pr ? [area] : [], prov, stage: "done", t: 1 };
      const a = __T29N.model(st); const b2 = { ...st, ans: { ...ans } }; delete b2.ans[QID]; const b = __T29N.model(b2);
      if (a.prov[0].pid !== b.prov[0].pid) changed++;
      const pb = Object.fromEntries(b.prov.map((x) => [x.pid, x.pct]));
      for (const x of a.prov) { const d = Math.abs(x.pct - pb[x.pid]); if (d > maxd) { maxd = d; maxAt = x.pid; } }
      if (a.prov.every((x) => x.pct === pb[x.pid])) same++;
    }
    res[`${prov}${pr ? "+prio" : ""}`] = { n: N, changed, maxd, maxAt, same };
  }
  return res;
}, { ids, N, QID, area, PROVS });
await browser.close();
console.log(`Pregunta ${QID} (área ${area}); ${N} perfiles por circunscripción; con frente a sin la respuesta a ${QID}`);
for (const [k, v] of Object.entries(out)) console.log(`  ${k.padEnd(16)} cambios de primer puesto ${String(v.changed).padStart(4)} · máxima variación ${v.maxd} pt (${v.maxAt || "–"}) · perfiles sin ningún cambio ${v.same}`);
