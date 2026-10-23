// Pruebas del mapa automático (todas las dimensiones a la vez, sin selección de ejes).
// Uso: NODE_PATH=$(npm root -g) node qa/map.mjs   (BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const OUT = new URL("./shots/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const state = (ans, o = {}) => ({ v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1, ...o });
const asParty = (pid) => Object.fromEntries(bank.questions.map((q) => [q.id, q.pos[pid] || 3]));
const ab = Object.fromEntries(pd.parties.map((p) => [p.id, p.ab]));

import { withFullAnalysis } from "./_full.mjs";
const browser = withFullAnalysis(await chromium.launch());
async function open(st, w = 1100, tag = "") {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${tag}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${tag}] ${e}`));
  await page.goto(BASE);
  await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st);
  await page.reload();
  await page.waitForSelector("#r-map svg");
  return { ctx, page };
}
// Coordenadas dibujadas: partidos (por siglas) y tu punto
const coords = (page) => page.evaluate(() => {
  const pts = {};
  for (const g of document.querySelectorAll("#r-map .map-pt")) {
    const c = g.querySelectorAll("circle")[1];
    pts[g.dataset.pid] = [+c.getAttribute("cx"), +c.getAttribute("cy")];
  }
  const me = document.querySelector("#r-map .me-o");
  return { pts, me: me ? [+me.getAttribute("cx"), +me.getAttribute("cy")] : null };
});
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

console.log("Mapa automático");
let base;
{
  const { ctx, page } = await open(state(asParty("psoe")), 1100, "psoe");
  const txt = await page.innerText("#r-map");
  ok((await page.locator("#r-map select:not(#map-dim)").count()) === 0 && !/Elige dos dimensiones|Eje horizontal|Eje vertical/.test(txt), "sin selectores de ejes ni instrucciones para elegirlos");
  ok(/7 dimensiones/.test(txt) && /Eje 1 · \d+ %/.test(await page.textContent("#r-map svg")), "explica que usa las 7 dimensiones y cuánto recoge cada eje");
  ok(!/izquierda-derecha|eje (izquierda|derecha)/i.test(await page.textContent("#r-map svg")), "los ejes no se etiquetan como izquierda o derecha");
  base = await coords(page);
  ok(!!base.me, "aparece tu posición");
  ok(!base.pts.pacma && /PACMA[\s\S]*sin datos suficientes/.test(txt), "PACMA (datos en 3 de 7 dimensiones) no se dibuja y se avisa en la lista");
  ok(dist(base.pts.pod, base.pts.fa) < dist(base.pts.pod, base.pts.vox) && dist(base.pts.vox, base.pts.salf) < dist(base.pts.vox, base.pts.psoe), "partidos parecidos cerca y distintos lejos (Podemos–FA, Vox–SALF)");
  const list = await page.$$eval("#r-map .map-list li b", (b) => b.map((x) => x.textContent.trim()));
  const rank = await page.$$eval("#r-parties .rank li .nm b", (b) => b.map((x) => x.textContent.trim()));
  ok(list.map((t) => t.replace(/^\d+\.\s*/, "")).join("|") === rank.slice(0, list.length).join("|"), "la lista de próximos usa la misma coincidencia que el ranking");
  await ctx.close();
}

console.log("Perfiles: respondiendo como un partido, tu punto cae en él");
for (const pid of ["psoe", "pp", "vox", "pod", "salf", "d21"]) {
  const { ctx, page } = await open(state(asParty(pid)), 1100, pid);
  const c = await coords(page);
  const near = Object.entries(c.pts).sort((a, b) => dist(a[1], c.me) - dist(b[1], c.me))[0];
  ok(near[0] === pid && dist(near[1], c.me) < 25, `${ab[pid]}: el más cercano en el mapa es ${ab[near[0]]} (a ${dist(near[1], c.me).toFixed(0)} px)`);
  ok(Object.entries(base.pts).every(([k, v]) => !c.pts[k] || dist(c.pts[k], v) < 0.5), `${ab[pid]}: los partidos no se mueven según quién haga el test`);
  await ctx.close();
}

console.log("Recalcular al cambiar respuestas");
{
  const { ctx, page } = await open(state(asParty("vox")), 1100, "edit");
  const before = (await coords(page)).me;
  const pod = asParty("pod");
  for (const id of all.slice(0, 70)) await page.evaluate(([i, v]) => { const el = document.getElementById(`rv-${i}`); el.value = String(v); el.dispatchEvent(new Event("change", { bubbles: true })); }, [id, pod[id]]);
  const after = await coords(page);
  ok(dist(before, after.me) > 60 && dist(after.me, after.pts.pod) < dist(after.me, after.pts.vox), "tu punto se mueve hacia Podemos al cambiar las respuestas");
  await ctx.close();
}

console.log("Datos insuficientes");
{
  const ans = asParty("psoe");
  for (const q of bank.questions) if (q.dim === "eur") ans[q.id] = 0;
  const { ctx, page } = await open(state(ans), 1100, "sin-europa");
  const c = await coords(page);
  ok(!c.me && /No podemos situarte en el mapa[\s\S]*Europa/.test(await page.innerText("#r-map")), "sin opinión en Europa (lo que más pesa en el eje 2) no te coloca y lo explica");
  await ctx.close();
}
{
  const ans = Object.fromEntries(all.map((id) => [id, 3]));
  const { ctx, page } = await open(state(ans), 1100, "neutral");
  ok(!!(await coords(page)).me, "todo neutral: apareces (en el centro de tus respuestas), no se trata como dato ausente");
  await ctx.close();
}

console.log("Móvil y escritorio, claro y oscuro");
for (const [w, dark] of [[390, true], [390, false], [1280, true]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, colorScheme: dark ? "dark" : "light" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`[${w}] ${e}`));
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), state(asParty("erc"), { prov: "barcelona" }));
  await page.reload(); await page.waitForSelector("#r-map svg");
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `${w}px ${dark ? "oscuro" : "claro"}: sin scroll horizontal`);
  const vb = await page.getAttribute("#r-map svg", "viewBox");
  ok(w < 600 ? vb.startsWith("0 0 380") : vb.startsWith("0 0 560"), `${w}px: lienzo adaptado (${vb})`);
  await (await page.$("#r-map")).screenshot({ path: `${OUT}map-${w}-${dark ? "dark" : "light"}.png` });
  await ctx.close();
}

await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
