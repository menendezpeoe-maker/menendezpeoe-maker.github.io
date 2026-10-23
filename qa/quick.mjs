// Versión rápida (unas 15 preguntas): equilibrio y estabilidad del primer puesto con perfiles simulados.
// Uso: NODE_PATH=$(npm root -g) node qa/quick.mjs   (con el servidor local en :8765; BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const fails = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const provFor = { psoe: "madrid", pp: "madrid", vox: "madrid", fa: "madrid", pod: "madrid", salf: "madrid", pacma: "madrid", d21: "madrid", erc: "barcelona", junts: "barcelona", pnv: "bizkaia", bildu: "bizkaia", upn: "navarra", gbai: "navarra", bng: "coruna", ccpc: "tenerife", upc: "tenerife", drago: "tenerife", comp: "valencia", cha: "teruel", existe: "teruel", mes: "baleares", adel: "sevilla", jmm: "jaen", upl: "leon", soria: "soria", pav: "avila" };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
const errors = []; page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");

console.log("Composición de la versión rápida");
await page.check("#f-mode-rapida", { force: true }); await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
const order = await page.evaluate(() => JSON.parse(localStorage.getItem("papeleta29n.v2")).order);
const qs = order.map((id) => bank.questions.find((q) => q.id === id));
ok(qs.length === 15, `15 preguntas (${qs.length})`);
ok(bank.areas.every((a) => qs.some((q) => q.area === a.id && q.prio === 1)), "una pregunta núcleo de cada una de las 12 áreas");
ok(bank.dims.every((d) => qs.some((q) => q.dim === d.id)), "cubre las 7 dimensiones");
const plus = qs.filter((q) => q.dir > 0).length, minus = qs.filter((q) => q.dir < 0).length;
ok(Math.abs(plus - minus) <= 2, `afirmaciones en los dos sentidos (${plus} y ${minus})`);
await page.evaluate(() => localStorage.clear());
await page.reload(); await page.waitForSelector("#start-btn:not([disabled])"); await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
ok(JSON.stringify(await page.evaluate(() => JSON.parse(localStorage.getItem("papeleta29n.v2")).order)) === JSON.stringify(order), "la versión rápida es la de por defecto y siempre las mismas preguntas");

console.log("Perfiles simulados: responder como un partido en las 15 preguntas");
const rows = []; let firsts = 0, total = 0;
for (const pid of pd.order.filter((p) => !pd.parties.find((x) => x.id === p).out)) {
  if (!provFor[pid]) continue;
  const known = qs.filter((q) => q.pos[pid]).length;
  const ans = Object.fromEntries(qs.map((q) => [q.id, q.pos[pid] || 3]));
  const st = { v: 2, bank: bank.version, prov: provFor[pid], mode: "rapida", seed: 7, order, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 };
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st);
  await page.reload(); await page.waitForSelector("#v-results:not([hidden])");
  const names = await page.$$eval("#r-parties .rank li .nm b", (els) => els.slice(0, 2).map((e) => e.textContent));
  const pcts = await page.$$eval("#r-parties .rank li .pv b", (els) => els.slice(0, 2).map((e) => e.textContent));
  const w = pd.parties.find((p) => p.id === pid), mine = [w.name, ...Object.values(w.local || {})];
  const hit = mine.includes(names[0]) || (pcts[0] === pcts[1] && mine.includes(names[1]));
  total++; if (hit) firsts++;
  rows.push(`${hit ? "✓" : "·"} ${pid.padEnd(7)} ${String(known).padStart(2)}/15 posturas → ${names[0]} ${pcts[0]}${hit ? "" : ` (2.º ${names[1]} ${pcts[1]})`}`);
}
console.log(rows.join("\n"));
ok(firsts / total >= 0.7, `el partido imitado sale primero en ${firsts} de ${total} casos (mínimo 70 %)`);
ok(["psoe", "pp", "vox", "fa", "pod", "salf"].every((pid) => rows.find((r) => r.includes(` ${pid.padEnd(7)}`))?.startsWith("✓")), "los seis partidos de ámbito estatal salen primeros si se responde como ellos");
console.log("Perfiles con ruido: 3 de las 15 respuestas se alejan un punto de las del partido");
let nf = 0, nt = 0; const miss = [];
for (const pid of ["psoe", "pp", "vox", "fa", "pod", "salf", "erc", "junts", "pnv", "bildu", "bng", "ccpc"]) {
  for (const shift of [0, 5, 10]) {
    const ans = Object.fromEntries(qs.map((q, i) => { const v = q.pos[pid] || 3; const moved = [shift % 15, (shift + 4) % 15, (shift + 9) % 15].includes(i); return [q.id, moved ? (v >= 3 ? v - 1 : v + 1) : v]; }));
    await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), { v: 2, bank: bank.version, prov: provFor[pid], mode: "rapida", seed: 7, order, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 });
    await page.reload(); await page.waitForSelector("#v-results:not([hidden])");
    const names = await page.$$eval("#r-parties .rank li .nm b", (els) => els.slice(0, 2).map((e) => e.textContent));
    const w = pd.parties.find((p) => p.id === pid), mine = [w.name, ...Object.values(w.local || {})];
    nt++; if (mine.includes(names[0])) nf++; else miss.push(`${pid}/${shift} → ${names[0]}`);
  }
}
console.log(`  ${nf} de ${nt} con el partido imitado primero${miss.length ? `; fallos: ${miss.join(", ")}` : ""}`);
ok(nf / nt >= 0.7, `con ruido, el partido imitado sigue primero en la mayoría de los casos (${nf}/${nt})`);
await page.evaluate(() => localStorage.clear());

console.log("«Afinar» desde la rápida");
const anyAns = Object.fromEntries(qs.map((q, i) => [q.id, 1 + (i % 5)]));
await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), { v: 2, bank: bank.version, prov: "madrid", mode: "rapida", seed: 7, order, idx: 0, ans: anyAns, imp: {}, prios: [], stage: "done", t: 1 });
await page.reload(); await page.waitForSelector("#v-results:not([hidden])");
ok(/versión exprés/.test(await page.textContent('[data-act="more"]')), "«Afinar» ofrece pasar a la exprés");
await page.click('[data-act="more"]'); await page.waitForSelector("#v-quiz:not([hidden])");
const st2 = await page.evaluate(() => JSON.parse(localStorage.getItem("papeleta29n.v2")));
ok(st2.mode === "expres" && qs.every((q) => st2.ans[q.id] === anyAns[q.id]) && st2.ans[st2.order[st2.idx]] === undefined, "pasa a la exprés conservando las respuestas y empieza por una sin responder");

await browser.close();
if (errors.length) console.log("Errores:\n" + errors.join("\n"));
if (fails.length || errors.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
