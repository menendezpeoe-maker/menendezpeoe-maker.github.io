// Pruebas de «Los 3 partidos con los que menos coincides» y «Los políticos con los que más coincides».
// Uso: NODE_PATH=$(npm root -g) node qa/sections.mjs   (BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const OUT = new URL("./shots/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const pols = JSON.parse(fs.readFileSync(new URL("../data/politicos.json", import.meta.url))).politicians;
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const state = (ans, o = {}) => ({ v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1, ...o });
const asParty = (pid, fill = 3) => Object.fromEntries(bank.questions.map((q) => [q.id, q.pos[pid] || fill]));

const browser = await chromium.launch();
async function open(st, w = 1100, tag = "") {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${tag}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${tag}] ${e}`));
  await page.goto(BASE);
  await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st);
  await page.reload();
  await page.waitForSelector("#v-results:not([hidden])");
  return { ctx, page };
}
const read = (page) => page.evaluate(() => ({
  top: [...document.querySelectorAll("#r-parties .rank li .nm b")].slice(0, 3).map((e) => e.textContent),
  least: [...document.querySelectorAll("#r-least .pcard h3")].map((e) => e.textContent),
  leastPct: [...document.querySelectorAll("#r-least .pcard .pc b")].map((e) => parseInt(e.textContent)),
  leastText: document.querySelector("#r-least").innerText,
  pols: [...document.querySelectorAll("#r-pols .pol-name")].map((e) => e.textContent),
  polsText: document.querySelector("#r-pols").innerText,
  nav: [...document.querySelectorAll(".res-nav a")].map((a) => a.getAttribute("href")),
  order: [...document.querySelectorAll("#v-results section[id]")].map((s) => s.id)
}));

// 1 · Perfiles distintos dan resultados distintos y coherentes
console.log("Perfiles sintéticos");
const seen = {};
for (const [pid, prov] of [["vox", "madrid"], ["pod", "madrid"], ["pp", "madrid"], ["psoe", "madrid"], ["erc", "barcelona"], ["junts", "barcelona"], ["bng", "coruna"]]) {
  const { ctx, page } = await open(state(asParty(pid), { prov }), 1100, pid);
  const r = await read(page);
  seen[pid] = r;
  console.log(`  ${pid.padEnd(6)} top: ${r.top.join(" | ")}\n         menos: ${r.least.map((n, i) => `${n} ${r.leastPct[i]}%`).join(" | ")}\n         políticos: ${r.pols.join(" | ")}`);
  ok(r.least.length === 3, `${pid}: 3 partidos menos afines`);
  ok(r.least.every((n) => !r.top.includes(n)), `${pid}: los menos afines no están en el top 3`);
  ok(r.leastPct.every((v, i, a) => i === 0 || a[i - 1] <= v), `${pid}: ordenados de menos a más coincidencia`);
  ok(r.pols.length >= 1 && r.pols.length <= 5, `${pid}: entre 1 y 5 políticos`);
  for (const img of await page.$$("#r-pols img")) { await img.scrollIntoViewIfNeeded(); await page.waitForFunction((el) => el.complete, img); }
  const photos = await page.$$eval("#r-pols .pol-ph img", (imgs) => imgs.map((i) => ({ w: i.naturalWidth, h: i.naturalHeight, alt: i.alt })));
  ok(photos.every((p) => p.w === 320 && p.h === 320 && p.alt.startsWith("Retrato de")), `${pid}: fotos cargadas, cuadradas y con texto alternativo`);
  const credits = await page.$$eval("#r-pols .pol", (cs) => cs.map((c) => !!c.querySelector(".pol-ph img") === !!c.querySelector(".pol-credit a[href*='commons.wikimedia.org']")));
  ok(credits.every(Boolean), `${pid}: cada foto lleva su crédito`);
  ok(JSON.stringify(r.order.slice(-4)) === JSON.stringify(["r-review", "r-least", "r-pols", "r-support"]), `${pid}: secciones nuevas al final y en orden`);
  await ctx.close();
}
const polParty = (name) => pols.find((x) => x.name === name)?.party;
ok(seen.vox.pols[0] && polParty(seen.vox.pols[0]) === "vox", "perfil Vox → primer político de Vox");
ok(["pod", "fa"].includes(polParty(seen.pod.pols[0])), "perfil Podemos → primer político de Podemos o Frente Amplio");
ok(seen.vox.least.some((n) => /Podemos|Frente Amplio|Bildu|ERC/.test(n)), "perfil Vox → la izquierda entre los menos afines");
ok(seen.pod.least.some((n) => /Vox|Se Acabó|Partido Popular/.test(n)), "perfil Podemos → la derecha entre los menos afines");
ok(seen.vox.pols.join() !== seen.pod.pols.join(), "Vox y Podemos dan políticos distintos");

// 2 · Neutral y «No lo sé» no son discrepancia; datos insuficientes
console.log("Casos límite");
{
  const ans = Object.fromEntries(all.map((id) => [id, 3]));
  const { ctx, page } = await open(state(ans), 1100, "neutral");
  const r = await read(page);
  const opp = await page.$$eval("#r-least .pcard", (cs) => cs.map((c) => c.querySelector(".metric b").textContent));
  ok(opp.length === 0 && r.leastText.includes("No hay datos suficientes"), "todo neutral → no señala partidos menos afines");
  ok(r.pols.length === 0 && r.polsText.includes("no hay suficientes coincidencias"), "todo neutral → no se muestran políticos");
  await ctx.close();
}
{
  const ans = Object.fromEntries(all.map((id) => [id, 0]));
  Object.assign(ans, { A01: 5, B01: 5, C01: 1 });
  const { ctx, page } = await open(state(ans), 1100, "pocas");
  const r = await read(page);
  ok(r.least.length === 0 && r.leastText.includes("No hay datos suficientes"), "3 respuestas con opinión → aviso de datos insuficientes");
  await ctx.close();
}
{
  // Una sola coincidencia con un político no basta para mostrarlo
  const ans = Object.fromEntries(all.map((id) => [id, 0]));
  Object.assign(ans, { J01: 5, A01: 1, B02: 3, C02: 3, D02: 3, E02: 3, F02: 3, G02: 3, H02: 3 });
  const { ctx, page } = await open(state(ans), 1100, "uno");
  const r = await read(page);
  ok(!r.pols.includes("Mónica García"), "una sola postura en común no basta para mostrar a un político");
  await ctx.close();
}

// 3 · Recalcular al editar, y cada foto se sirve
console.log("Edición y fotos");
{
  const { ctx, page } = await open(state(asParty("vox")), 1100, "edit");
  const before = await read(page);
  for (const id of all.slice(0, 60)) { /* invierte 60 respuestas */
    const v = asParty("pod")[id];
    await page.evaluate(([i, val]) => { const el = document.getElementById(`rv-${i}`); el.value = String(val); el.dispatchEvent(new Event("change", { bubbles: true })); }, [id, v]);
  }
  const after = await read(page);
  ok(JSON.stringify(before.least) !== JSON.stringify(after.least) || JSON.stringify(before.pols) !== JSON.stringify(after.pols), "cambiar respuestas recalcula las secciones nuevas");
  const codes = await page.evaluate(async (ids) => Promise.all(ids.map((id) => fetch(`assets/politicos/${id}.jpg`).then((r) => r.status))), pols.filter((x) => x.photo).map((x) => x.id));
  ok(codes.every((c) => c === 200), `las ${codes.length} fotos se sirven`);
  await ctx.close();
}

// 4 · Capturas móvil y escritorio, sin scroll horizontal
for (const [w, tag] of [[390, "m"], [1280, "d"]]) {
  const { ctx, page } = await open(state(asParty("psoe")), w, `shot-${tag}`);
  for (const img of await page.$$("#r-pols img")) { await img.scrollIntoViewIfNeeded(); await page.waitForFunction((el) => el.complete && el.naturalWidth > 0, img); }
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)), `${w}px sin scroll horizontal`);
  await (await page.$("#r-least")).screenshot({ path: `${OUT}${tag}-least.png` });
  await (await page.$("#r-pols")).screenshot({ path: `${OUT}${tag}-pols.png` });
  await ctx.close();
}

await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
