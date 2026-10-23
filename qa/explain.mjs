// Pruebas de la explicación del resultado: «Tu perfil, explicado», detalle de dimensiones y temas,
// desglose del cálculo de cada partido, comparador de dos candidaturas, mapa interactivo y datos.
// Uso: NODE_PATH=$(npm root -g) node qa/explain.mjs   (BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const Q = Object.fromEntries(bank.questions.map((q) => [q.id, q]));
const state = (ans, o = {}) => ({ v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1, ...o });
const asParty = (pid) => Object.fromEntries(bank.questions.map((q) => [q.id, q.pos[pid] || 3]));
import { withFullAnalysis } from "./_full.mjs";
const browser = withFullAnalysis(await chromium.launch());
async function open(st, w = 1100) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st);
  await page.reload(); await page.waitForSelector("#r-pols");
  return { ctx, page };
}
const openDetails = (page, sel) => page.evaluate((s) => { const d = document.querySelector(s); d.open = true; d.dispatchEvent(new Event("toggle")); }, sel);
// Valor −100…+100 de una respuesta en su dimensión, como en la web
const sval = (q, u) => (u - 3) / 2 * 100 * q.dir;

console.log("Tu perfil, explicado");
{
  // Perfil cruzado: como el PSOE en todo, salvo inmigración y seguridad, como Vox
  const ans = Object.fromEntries(bank.questions.map((q) => [q.id, (q.dim === "inm" || q.dim === "lib" ? q.pos.vox : q.pos.psoe) || 3]));
  const { ctx, page } = await open(state(ans));
  const p = page.locator("#r-portrait");
  ok((await p.locator(".trait").count()) === 4, "cuatro bloques: lo que te define, moderado o mixto, combinaciones y opiniones sin candidatura");
  const txt = await p.innerText();
  ok(/control migratorio/i.test(txt) && /Pesan sobre todo «/.test(txt), "lo que te define cita tus propias respuestas");
  ok(/Combinaciones poco habituales[\s\S]*control migratorio/i.test(txt), "detecta que combinas ideas que entre los partidos no suelen ir juntas");
  ok((await page.locator("#r-portrait .tlist li:not(.empty)").count()) > 0, "hay contenido real, no solo mensajes vacíos");
  await ctx.close();
}
{
  // Mixto frente a moderado: misma posición media (0), respuestas muy distintas
  const eco = bank.questions.filter((q) => q.dim === "eco" && q.type === "likert");
  const mixed = Object.fromEntries(all.map((id) => [id, 3]));
  eco.forEach((q, i) => { mixed[q.id] = (i % 2 ? (q.dir > 0 ? 5 : 1) : (q.dir > 0 ? 1 : 5)); });
  const { ctx, page } = await open(state(mixed));
  ok(/Economía: posición mixta/.test(await page.innerText("#r-portrait")), "respuestas firmes que se compensan → posición «mixta»");
  await ctx.close();
  const { ctx: c2, page: p2 } = await open(state(Object.fromEntries(all.map((id) => [id, 3]))));
  ok(/Economía: posición moderada/.test(await p2.innerText("#r-portrait")), "respuestas intermedias → posición «moderada»");
  await c2.close();
}
{
  // Opiniones sin candidatura: pregunta en la que ninguna candidatura de Madrid está de acuerdo
  const madrid = pd.parties.filter((p) => !p.out && (p.scope.all ? !(p.scope.except || []).includes("mad") : (p.scope.regions || []).includes("mad") || (p.scope.provinces || []).includes("madrid"))).map((p) => p.id);
  const q = bank.questions.find((x) => { const w = madrid.filter((pid) => x.pos[pid]); return w.length >= 2 && w.every((pid) => x.pos[pid] <= 3); });
  const ans = asParty("psoe"); ans[q.id] = 5;
  const { ctx, page } = await open(state(ans));
  ok((await page.innerText("#r-portrait")).includes(q.short), `una opinión que no comparte ninguna candidatura de Madrid aparece («${q.short}»)`);
  await ctx.close();
}

console.log("Detalle de cada dimensión");
{
  const ans = Object.fromEntries(bank.questions.map((q, i) => [q.id, [1, 2, 4, 5, 3][i % 5]]));
  const { ctx, page } = await open(state(ans));
  await openDetails(page, "#r-dims .drow:first-child details.more");
  await page.evaluate(() => document.querySelectorAll("#r-dims .drow:first-child .ddetail details").forEach((d) => { d.open = true; }));
  const shown = parseInt((await page.textContent("#r-dims .drow:first-child .dv")).match(/\(([−+]?\d+)\)/)[1].replace("−", "-"));
  const items = await page.$$eval("#r-dims .drow:first-child .ddetail .cmp li:not(.empty) b.num", (b) => b.map((x) => x.textContent));
  const sum = items.reduce((a, t) => a + (t === "±0" ? 0 : parseInt(t.replace("−", "-"))), 0);
  const eco = bank.questions.filter((q) => q.dim === "eco");
  const expect = Math.round(eco.reduce((a, q) => a + sval(q, ans[q.id]) * (ans[q.id] === 3 ? 0.5 : 1), 0) / eco.reduce((a, q) => a + (ans[q.id] === 3 ? 0.5 : 1), 0));
  ok(shown === expect, `la posición en economía coincide con el cálculo independiente (${shown})`);
  ok(Math.abs(sum - shown) <= items.length * 0.5 + 1, `las aportaciones de cada respuesta suman tu posición (${sum} ≈ ${shown})`);
  ok((await page.locator("#r-dims .drow:first-child .sub-row").count()) >= 2, "muestra tu posición tema a tema dentro de la dimensión");
  const chips = await page.$$eval("#r-dims .drow:first-child .dchips .chip", (c) => c.map((x) => x.textContent));
  ok(chips.some((t) => t.startsWith("Tú")) && chips.length >= 5, "sitúa a las candidaturas de tu provincia y a ti en la misma escala");
  await ctx.close();
}

console.log("Detalle por temas");
{
  const { ctx, page } = await open(state(asParty("pp")));
  await openDetails(page, "#r-areas .arow:first-child details.more");
  const t = await page.textContent("#r-areas .arow:first-child .ddetail");
  ok(/Tus respuestas \(\d+/.test(t) && /Coincidencia en/.test(t), "cada tema muestra tus respuestas y la coincidencia por candidatura");
  ok((await page.$$eval("#r-areas .arow:first-child .ddetail .affrow span:first-child", (s) => s.map((x) => x.textContent)))[0].includes("Partido Popular"), "quien responde como el PP lo ve primero en el tema");
  await ctx.close();
}

console.log("Cómo se calcula la coincidencia con cada partido");
{
  const ans = Object.fromEntries(bank.questions.map((q, i) => [q.id, [1, 2, 4, 5, 3][i % 5]]));
  const { ctx, page } = await open(state(ans));
  const card = page.locator("#r-parties .pcards .pcard").first();
  const pct = parseInt(await card.locator(".pc b").textContent());
  await page.evaluate(() => { const d = document.querySelector("#r-parties .pcards .pcard .pc-more details"); d.open = true; });
  await page.waitForTimeout(200);
  const steps = await card.locator(".calc-steps").innerText();
  ok(steps.includes(`${pct} %`) && /Acuerdo medio simple: \d+ %/.test(steps) && /Comprobación: \d+ %/.test(steps), "el desglose paso a paso termina en el mismo porcentaje de la ficha");
  const first = card.locator(".pc-more .ddetail .two > div:first-child li:not(.empty)").first();
  const short = await first.locator("b").textContent();
  const delta = parseFloat((await first.innerText()).match(/bajaría ([\d,]+)/)[1].replace(",", "."));
  const qid = bank.questions.find((q) => q.short === short).id;
  const pid = (await card.getAttribute("id")).slice(5);
  await page.evaluate((id) => { const el = document.getElementById(`rv-${id}`); el.value = "0"; el.dispatchEvent(new Event("change", { bubbles: true })); }, qid);
  const after = parseInt(await page.locator(`#card-${pid} .pc b`).textContent().catch(() => "0")) || parseInt((await page.$$eval("#r-parties .rank li", (ls, p) => ls.find((l) => l.querySelector(`[data-card="${p}"]`)).querySelector(".pv b").textContent, pid)));
  ok(Math.abs((pct - after) - delta) <= 1, `quitar la respuesta que más le suma baja su coincidencia lo anunciado (${pct} → ${after}, anunciado −${delta})`);
  await ctx.close();
}
{
  const { ctx, page } = await open(state(asParty("psoe")));
  const a = page.locator('#card-psoe .cmp a[href^="https://"]').first();
  ok((await a.count()) === 1 && (await a.getAttribute("target")) === "_blank" && (await a.getAttribute("rel")).includes("noopener"), "las coincidencias enlazan la fuente de la postura cuando existe");
  ok(/Datos de PSOE: \d+ posturas documentadas, \d+ estimadas y \d+ sin postura conocida/.test(await page.innerText("#card-psoe .data-line")), "cada ficha resume el estado de sus datos");
  await page.click('#card-psoe .data-line [data-party="psoe"]');
  await page.waitForSelector("#v-explorer:not([hidden])");
  ok((await page.inputValue("#ex-party")) === "psoe" && (await page.locator(".focus-line").count()) > 50, "«Ver todas sus posturas» abre el explorador con el partido destacado");
  await ctx.close();
}

console.log("Comparar dos candidaturas");
{
  const { ctx, page } = await open(state(asParty("pod")));
  const a = await page.inputValue("#vs-a"), b = await page.inputValue("#vs-b");
  const rank = await page.$$eval("#r-parties .rank [data-card]", (x) => x.map((e) => e.dataset.card));
  ok(a === rank[0] && b === rank[1], "por defecto compara tus dos primeras candidaturas");
  await page.selectOption("#vs-a", "psoe"); await page.selectOption("#vs-b", "pp");
  const n = bank.questions.filter((q) => q.pos.psoe && q.pos.pp && Math.abs(q.pos.psoe - q.pos.pp) >= 2).length;
  ok((await page.textContent("#r-versus .two .subh")).includes(`(${n})`), `cuenta bien dónde se diferencian PSOE y PP (${n} preguntas)`);
  const firstQ = await page.locator("#r-versus .cmp li").first().locator("b").first().textContent();
  const q = bank.questions.find((x) => x.short === firstQ), u = asParty("pod")[q.id];
  const closer = Math.abs(u - q.pos.psoe) < Math.abs(u - q.pos.pp) ? "PSOE" : Math.abs(u - q.pos.psoe) > Math.abs(u - q.pos.pp) ? "PP" : null;
  const li = await page.locator("#r-versus .cmp li").first().innerText();
  ok(closer ? li.includes(`más cerca de ${closer}`) : li.includes("a igual distancia"), "indica correctamente de cuál estás más cerca en cada pregunta");
  ok((await page.locator("#r-versus .pdrow").count()) === bank.dims.length, "compara las siete dimensiones");
  await page.click('#card-pod [data-vs="pod"]').catch(() => {});
  await page.click(`#r-parties .pcards .pcard:nth-child(2) [data-vs]`);
  ok((await page.inputValue("#vs-a")) === rank[0] && (await page.inputValue("#vs-b")) === rank[1], "«Comparar con otra candidatura» desde una ficha la enfrenta a tu primera");
  await ctx.close();
}

console.log("Mapa interactivo");
{
  const { ctx, page } = await open(state(asParty("vox")));
  const before = await page.$$eval("#r-map .map-pt", (g) => g.map((x) => x.querySelector(".dot").getAttribute("cx") + "," + x.querySelector(".dot").getAttribute("cy")).join("|"));
  await page.click('#r-map .map-pt[data-pid="pp"]');
  ok((await page.innerText("#map-sel")).includes("Partido Popular") && (await page.getAttribute('#r-map .map-pt[data-pid="pp"]', "aria-pressed")) === "true", "tocar un punto explica por qué está ahí");
  await page.focus('#r-map .map-pt[data-pid="psoe"]'); await page.keyboard.press("Enter");
  ok((await page.innerText("#map-sel")).includes("PSOE"), "también con el teclado");
  await page.click('#r-map .map-me');
  ok(/Tu posición/.test(await page.textContent("#map-sel")), "tocar tu punto explica tu posición");
  await page.selectOption("#map-dim", "eur");
  const after = await page.$$eval("#r-map .map-pt", (g) => g.map((x) => x.querySelector(".dot").getAttribute("cx") + "," + x.querySelector(".dot").getAttribute("cy")).join("|"));
  ok((await page.locator("#r-map .map-dim .dstrip").count()) === 1 && before === after, "ver una dimensión añade su escala sin mover el mapa global");
  await page.click('#map-sel [data-card]').catch(() => {});
  await ctx.close();
}

console.log("Metodología y datos");
{
  const { ctx, page } = await open(state(asParty("psoe")));
  await page.click(".head-nav [data-go='method']");
  const t = await page.innerText("#v-method");
  const nsrc = bank.questions.reduce((n, q) => n + Object.keys(q.src || {}).length, 0);
  const secs = await page.$$eval("#m-datos, #m-expl, #m-glos", (x) => x.length);
  ok(secs === 3 && t.includes(`Hoy hay ${nsrc} posturas con fuente enlazada`), `estado de los datos, explicaciones y glosario (${nsrc} fuentes)`);
  ok(/Pendiente de verificar/.test(t) && /Cobertura temática/.test(t), "indica qué está pendiente de verificar y qué temas cubre el test");
  await ctx.close();
}

console.log("Resultado compartido y móvil");
{
  const { ctx, page } = await open(state(asParty("erc"), { prov: "barcelona" }), 390);
  for (const sel of ["#r-dims details.more", "#r-areas details.more", "#r-parties .pc-more details", "#r-portrait"]) await page.evaluate((s) => document.querySelectorAll(s).forEach((d) => { if (d.tagName === "DETAILS") { d.open = true; d.dispatchEvent(new Event("toggle")); } }), sel);
  await page.selectOption("#map-dim", "ter"); await page.click('#r-map [data-mapsel]');
  await page.waitForTimeout(300);
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), "390 px con todos los paneles abiertos: sin scroll horizontal");
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.click("#r-share details summary"); await page.click("#sh-full"); await page.waitForTimeout(300);
  const link = (await page.evaluate(() => navigator.clipboard.readText())).match(/#r2[A-Za-z0-9]+/);
  await ctx.close();
  const c2 = await browser.newContext({ viewport: { width: 1100, height: 900 } }); const p2 = await c2.newPage();
  p2.on("pageerror", (e) => errors.push(String(e)));
  await p2.goto(BASE + link[0]); await p2.waitForSelector("#r-pols");
  ok((await p2.locator("#r-portrait .trait").count()) === 4 && (await p2.locator("#r-versus .vs-card").count()) === 2, "el resultado compartido también muestra el perfil explicado y el comparador");
  await c2.close();
}

await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
