// Pruebas de las mejoras de la segunda auditoría: ampliar versión sin repasar, ficha de cualquier
// candidatura, «qué os diferencia», empates, perfiles sin encaje, fuentes y ninguna petición a terceros.
// Uso: NODE_PATH=$(npm root -g) node qa/features.mjs   (BASE para otra URL)
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
const asParty = (pid) => Object.fromEntries(bank.questions.map((q) => [q.id, q.pos[pid] || 3]));
const browser = await chromium.launch();
const host = new URL(BASE).host, external = new Set();
async function open(st, w = 1100) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  page.on("request", (r) => { const u = new URL(r.url()); if (u.host && u.host !== host && /^https?:$/.test(u.protocol)) external.add(u.host); });
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  if (st) { await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st); await page.reload(); await page.waitForSelector(st.stage === "done" ? "#r-pols" : "#v-home:not([hidden])"); }
  return { ctx, page };
}

console.log("Ampliar a una versión más larga");
{
  // Exprés terminada con su orden real: al ampliar, solo se recorren las preguntas nuevas
  const { ctx, page } = await open(null);
  const order = await page.evaluate(() => { const s = { mode: "expres" }; return null; });
  await page.check("input[name=mode][value=expres]", { force: true }).catch(() => {});
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  const total = parseInt((await page.textContent("#q-count")).split("/")[1]);
  for (let i = 0; i < total; i++) { await page.keyboard.press(String(1 + (i % 5))); await page.waitForTimeout(380); }
  await page.waitForSelector("#v-prios:not([hidden])"); await page.selectOption("#f-prov", "madrid"); await page.click("#prio-skip"); await page.waitForSelector("#v-results:not([hidden])");
  await page.click('[data-act="more"]'); await page.waitForSelector("#v-quiz:not([hidden])");
  const seen = [];
  for (let i = 0; i < 4; i++) {
    seen.push(await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("papeleta29n.v2")); return s.ans[s.order[s.idx]] === undefined; }));
    await page.keyboard.press("3"); await page.waitForTimeout(420);
  }
  ok(seen.every(Boolean), `al ampliar solo se muestran preguntas sin responder (${seen.length} seguidas, versión exprés de ${total})`);
  await ctx.close();
}

console.log("Ficha de cualquier candidatura y comparación con la primera");
{
  const { ctx, page } = await open(state(asParty("psoe")));
  const rows = await page.locator("#r-parties .rank [data-card]").count();
  ok(rows === await page.locator("#r-parties .rank li").count(), "cada fila del ranking tiene «Ver su ficha»");
  await page.click('#r-parties .rank [data-card="vox"]'); await page.waitForTimeout(1200);
  ok((await page.locator("#pc-extra #card-vox").count()) === 1 && /ocupa el puesto \d+ de \d+/.test(await page.innerText("#pc-extra")), "abre la ficha completa de una candidatura fuera del top 3");
  ok(await page.evaluate(() => { const r = document.querySelector("#pc-extra").getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }), "y lleva hasta ella");
  const sel = '#r-review .rv select[data-ctl="ans"]';
  const before = await page.locator("#card-vox .pc b").textContent();
  const vox = asParty("vox");
  await page.evaluate(([s, v]) => { for (const el of [...document.querySelectorAll(s)].slice(0, 25)) { el.value = String(v[el.dataset.q]); el.dispatchEvent(new Event("change", { bubbles: true })); } }, [sel, vox]);
  ok((await page.locator("#pc-extra #card-vox").count()) === 1 && (await page.locator("#card-vox .pc b").textContent()) !== before, "la ficha abierta se mantiene y se recalcula al cambiar respuestas");
  await page.click('[data-act="close-card"]');
  ok((await page.locator("#pc-extra .pcard").count()) === 0, "«Cerrar ficha» la quita");
  const top3 = await page.locator("#r-parties .pcards .pcard").first().getAttribute("id");
  await page.click(`#r-parties .rank [data-card="${top3.replace("card-", "")}"]`); await page.waitForTimeout(300);
  ok((await page.locator("#pc-extra .pcard").count()) === 0, "en el top 3 no duplica la ficha: va a la que ya existe");
  const vs = page.locator("#r-parties .pcards .pcard").nth(1).locator("details.more", { hasText: "qué os diferencia" });
  ok((await vs.count()) === 1 && (await vs.locator("li").count()) > 0, "la 2.ª candidatura explica qué la diferencia de la primera");
  await ctx.close();
}

console.log("Empates, perfiles sin encaje y fuentes");
{
  const mixed = Object.fromEntries(all.map((id, i) => [id, [1, 5, 2, 4, 3][i % 5]]));
  const { ctx, page } = await open(state(mixed));
  const r = await page.$$eval("#r-parties .rank li", (ls) => ls.map((l) => [parseInt(l.querySelector(".pv b").textContent), l.querySelector(".meta").textContent]));
  const shouldTie = r.slice(1).filter(([p]) => r[0][0] - p <= 3).length, tagged = r.slice(1).filter(([, m]) => m.includes("Empate técnico")).length;
  ok(shouldTie === tagged, `las candidaturas a 3 puntos o menos de la primera se marcan como empate técnico (${tagged})`);
  const top = r[0][0], msg = (await page.innerText("#r-summary")).includes("Ninguna candidatura encaja de lleno");
  ok(top < 60 ? msg : !msg, `aviso de perfil sin encaje claro solo cuando la primera no llega al 60 % (primera: ${top} %)`);
  await page.locator("#r-review details.rv-area").filter({ has: page.locator('[data-q="L01"]') }).locator("> summary").click();
  await page.locator('#r-review .rv[data-q="L01"] details.more summary').click(); await page.waitForTimeout(300);
  const a = page.locator('#r-review .rv[data-q="L01"] a[href^="https://"]');
  ok((await a.count()) >= 1 && (await a.first().getAttribute("rel")).includes("noopener"), "las posturas verificadas enlazan su fuente (pestaña nueva, sin referencia)");
  await ctx.close();
}

ok(!external.size, `ninguna petición a otros dominios durante el uso${external.size ? ": " + [...external].join(", ") : ""}`);
await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
