// Perfiles ficticios para comprobar el comportamiento del algoritmo (no para fijar qué partido debe ganar).
// Uso: NODE_PATH=$(npm root -g) node qa/profiles.mjs   (BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const state = (ans, o = {}) => ({ v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1, ...o });
// Respuestas desde preferencias por dimensión: −1 = polo A, +1 = polo B, 0 = sin preferencia (neutral).
// Cada afirmación se responde según su dirección; las transversales, neutrales.
const fromPrefs = (pref, strength = 2) => Object.fromEntries(bank.questions.map((q) => {
  const p = q.dim ? pref[q.dim] ?? 0 : 0;
  return [q.id, Math.max(1, Math.min(5, 3 + Math.round(p * q.dir * strength)))];
}));
const PROFILES = {
  "Intervencionista y progresista": { eco: -1, soc: -1, lib: -0.5, inm: -0.5, amb: -0.5 },
  "Libre mercado y conservador": { eco: 1, soc: 1, lib: 0.5, inm: 0.5, amb: 0.5 },
  "Intervencionista y conservador en valores": { eco: -1, soc: 1, inm: 0.5, lib: 0.5 },
  "Liberal en lo personal e intervencionista en economía": { eco: -1, soc: -1, lib: -1 },
  "Moderado / mixto": { eco: 0.5, soc: -0.5, lib: 0.5, ter: 0, inm: -0.5, eur: -0.5, amb: 0.5 }
};
import { withFullAnalysis } from "./_full.mjs";
const browser = withFullAnalysis(await chromium.launch());
const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
const page = await ctx.newPage();
page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
async function load(st) {
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st);
  await page.reload(); await page.waitForSelector("#r-pols");
  return page.evaluate(() => ({
    rank: [...document.querySelectorAll("#r-parties .rank li")].map((li) => [li.querySelector(".nm b").textContent, parseInt(li.querySelector(".pv b").textContent)]),
    top: document.querySelector(".tm-name")?.textContent,
    head: document.querySelector("#res-h").textContent,
    dims: [...document.querySelectorAll("#r-dims .drow")].map((r) => r.innerText.replace(/\s+/g, " ").slice(0, 70)),
    mapList: [...document.querySelectorAll("#r-map .map-list li b")].map((b) => b.textContent.replace(/^\s*\d+\.\s*/, "").trim()),
    mapMe: !!document.querySelector("#r-map .me-o"),
    rel: document.querySelector("#r-summary .rel").textContent,
    cross: document.querySelector("#r-traits").innerText.includes("Combinaciones cruzadas") ? [...document.querySelectorAll("#r-traits .trait:nth-child(3) li")].map((l) => l.innerText.split("\n")[0]) : []
  }));
}

console.log("Perfiles ficticios");
for (const [name, pref] of Object.entries(PROFILES)) {
  const r = await load(state(fromPrefs(pref)));
  console.log(`  · ${name}\n      «${r.head}»\n      ${r.rank.slice(0, 4).map(([n, p]) => `${n} ${p} %`).join(" · ")} · solidez: ${r.rel.replace("Solidez del resultado: ", "")}${r.cross.length ? `\n      combinaciones cruzadas: ${r.cross.join(", ")}` : ""}`);
  ok(r.top === r.rank[0][0] && r.mapList.join("|") === r.rank.map((x) => x[0]).join("|"), `${name}: resumen, ranking y mapa coinciden`);
  ok(r.mapMe, `${name}: aparece en el mapa`);
  // El perfil calculado refleja las preferencias: cada dimensión con preferencia sale del lado buscado
  const want = Object.entries(pref).filter(([, v]) => Math.abs(v) >= 1);
  const dimTxt = r.dims.join(" ");
  ok(want.every(([d, v]) => { const D = bank.dims.find((x) => x.id === d); return r.head.includes(v < 0 ? "" : "") && new RegExp(`${D.name}[^]*?${v < 0 ? D.a : D.b}`, "i").test(dimTxt); }), `${name}: las dimensiones marcadas salen del lado esperado (${want.map(([d, v]) => `${d} ${v < 0 ? "A" : "B"}`).join(", ")})`);
}
{
  const r = await load(state(fromPrefs(PROFILES["Intervencionista y conservador en valores"])));
  ok(r.head.includes("más Estado en economía") && r.head.includes("tradicionales en valores"), "un perfil cruzado se describe como tal (no se fuerza a una etiqueta única)");
}

console.log("Prioridades muy marcadas (vivienda, empleo y seguridad)");
{
  const ans = fromPrefs(PROFILES["Moderado / mixto"]);
  const base = await load(state(ans));
  const prio = await load(state(ans, { prios: ["B", "A", "E"].map((l) => bank.areas.find((a) => a.letter === l).id), imp: { B01: true, A01: true, E01: true } }));
  const diff = prio.rank.map(([n, p]) => Math.abs(p - (base.rank.find((x) => x[0] === n) || [0, p])[1]));
  console.log(`      sin prioridades: ${base.rank.slice(0, 4).map(([n, p]) => `${n} ${p}`).join(" · ")}\n      con prioridades: ${prio.rank.slice(0, 4).map(([n, p]) => `${n} ${p}`).join(" · ")}`);
  ok(diff.some((d) => d > 0) && Math.max(...diff) <= 15, `las prioridades cambian la coincidencia de forma moderada (máx. ${Math.max(...diff)} puntos)`);
}

console.log("Coherencia del cálculo");
{
  // «No lo sé» = no responder
  const ans = fromPrefs(PROFILES["Libre mercado y conservador"]);
  const half = Object.fromEntries(Object.entries(ans).filter(([, ], i) => i % 2));
  const ns = { ...ans }; Object.keys(ans).forEach((k, i) => { if (!(i % 2)) ns[k] = 0; });
  const a = await load(state(half)), b = await load(state(ns));
  ok(JSON.stringify(a.rank) === JSON.stringify(b.rank), "«No lo sé» cuenta igual que no responder (no se toma como neutral)");
  // Monotonía: acercar una respuesta a la postura de un partido nunca le baja la coincidencia
  const mix = fromPrefs(PROFILES["Moderado / mixto"]);
  const before = await load(state(mix));
  let checked = 0, broken = [];
  for (const q of bank.questions.filter((q) => q.prio === 1).slice(0, 8)) {
    for (const pid of ["psoe", "pp", "vox", "fa"]) {
      const v = q.pos[pid]; if (!v || v === mix[q.id]) continue;
      const moved = { ...mix, [q.id]: v };
      const after = await load(state(moved));
      const name = { psoe: "PSOE", pp: "Partido Popular", vox: "Vox", fa: "Frente Amplio" }[pid];
      const p0 = before.rank.find((x) => x[0] === name)[1], p1 = after.rank.find((x) => x[0] === name)[1];
      checked++; if (p1 < p0) broken.push(`${q.id}/${pid} ${p0}→${p1}`);
    }
  }
  ok(!broken.length, `acercar una respuesta a un partido nunca le resta coincidencia (${checked} casos)${broken.length ? ": " + broken.join(", ") : ""}`);
  // Preguntas invertidas: misma opinión expresada en una afirmación de cada sentido
  const pairs = bank.questions.filter((q) => q.type === "likert" && q.dim);
  const inv = pairs.find((q) => q.dir < 0), dir = pairs.find((q) => q.dir > 0 && q.dim === inv.dim);
  const r1 = await load(state({ [inv.id]: 5, [dir.id]: 1 })), r2 = await load(state({ [inv.id]: 1, [dir.id]: 5 }));
  const D = bank.dims.find((d) => d.id === inv.dim);
  ok(new RegExp(`${D.name}[^]*?${D.a}`).test(r1.dims.join(" ")) && new RegExp(`${D.name}[^]*?${D.b}`).test(r2.dims.join(" ")), `afirmaciones invertidas (${inv.id} y ${dir.id}): estar de acuerdo con una y en desacuerdo con la otra da el mismo polo`);
  // Aquiescencia
  const yes = await load(state(Object.fromEntries(all.map((id) => [id, 5]))));
  ok(/baja/.test(yes.rel), "responder «totalmente de acuerdo» a todo se marca con solidez baja");
}

await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
