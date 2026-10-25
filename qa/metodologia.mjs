// Cifras reproducibles del informe /metodologia/: se calculan con la propia app (mismo algoritmo que ve la gente).
// Uso: NODE_PATH=$(npm root -g) node qa/metodologia.mjs   (con el servidor local en :8765)  → src/metodologia.json
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const P = Object.fromEntries(pd.parties.map((p) => [p.id, p]));
const live = pd.order.filter((pid) => !P[pid].out);
const provs = pd.regions.flatMap((r) => r.provs.map((p) => ({ id: p.id, region: r.id })));
const runs = (pid, pr) => { const s = P[pid].scope; if (s.all) return !(s.except || []).includes(pr.region); if (s.regions) return s.regions.includes(pr.region); if (s.provinces) return s.provinces.includes(pr.id); return false; };
const homeProv = (pid) => (P[pid].scope.all ? { id: "madrid", region: "mad" } : provs.find((pr) => runs(pid, pr)));
const order = bank.questions.map((q) => q.id);
let seed = 29; const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
const names = Object.fromEntries(pd.parties.flatMap((p) => [[p.name, p.id], ...Object.values(p.local || {}).map((n) => [n, p.id])]));
async function result(ans, prov) {
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), { v: 2, bank: bank.version, prov, mode: "completa", seed: 7, order, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 });
  await page.reload(); await page.waitForSelector("#v-results:not([hidden])");
  const rows = await page.$$eval("#r-parties .rank li", (els) => els.map((li) => [li.querySelector(".nm b")?.textContent, parseInt(li.querySelector(".pv b")?.textContent)]));
  return rows.map(([n, v]) => ({ pid: names[n], pct: v }));
}
// 1. Imitación: responder exactamente como cada partido (sin postura conocida → neutral)
const imit = [];
for (const pid of live) { const pr = homeProv(pid); if (!pr) continue;
  const ans = Object.fromEntries(bank.questions.map((q) => [q.id, q.pos[pid] || 3]));
  const r = await result(ans, pr.id); imit.push({ pid, prov: pr.id, primero: r[0]?.pid === pid || (r[0]?.pct === r[1]?.pct && r[1]?.pid === pid), pct: r.find((x) => x.pid === pid)?.pct }); }
// 2. Perfiles aleatorios (Madrid, 6 candidaturas estatales y las que se presentan allí)
const N = 300, wins = {}; let sumTop = 0, sumGap = 0;
for (let i = 0; i < N; i++) { const ans = Object.fromEntries(bank.questions.map((q) => [q.id, 1 + Math.floor(rnd() * 5)]));
  const r = await result(ans, "madrid"); wins[r[0].pid] = (wins[r[0].pid] || 0) + 1; sumTop += r[0].pct; sumGap += r[0].pct - r[1].pct; }
// 3. Perfil totalmente neutral (todo «ni de acuerdo ni en desacuerdo»)
const neutral = (await result(Object.fromEntries(bank.questions.map((q) => [q.id, 3])), "madrid")).slice(0, 6);
await browser.close();
// 4. Posturas por partido
const posturas = live.map((pid) => { const k = bank.questions.filter((q) => q.pos[pid]); return { pid, conocidas: k.length, estimadas: k.filter((q) => q.est.includes(pid)).length, conFuente: k.filter((q) => q.src?.[pid]).length }; });
const outj = { generado: new Date().toISOString().slice(0, 10), datos: bank.updated, preguntas: bank.questions.length,
  imitacion: { total: imit.length, primero: imit.filter((x) => x.primero).length, detalle: imit },
  aleatorios: { n: N, semilla: 29, provincia: "madrid", ganadores: Object.entries(wins).sort((a, b) => b[1] - a[1]).map(([pid, n]) => ({ pid, n })), mediaPrimero: Math.round(sumTop / N), mediaDistancia: Math.round(sumGap / N * 10) / 10 },
  neutral, posturas };
fs.writeFileSync(new URL("../src/metodologia.json", import.meta.url), JSON.stringify(outj, null, 1) + "\n");
console.log(`imitación ${outj.imitacion.primero}/${outj.imitacion.total} · aleatorios: media del primero ${outj.aleatorios.mediaPrimero} %, ganadores ${JSON.stringify(outj.aleatorios.ganadores.slice(0, 4))} · neutral ${JSON.stringify(neutral.slice(0, 3))}`);
