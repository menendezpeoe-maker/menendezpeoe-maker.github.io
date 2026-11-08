// Comparar dos candidaturas desde la portada (sin hacer el test) y tarjeta de resultado con estilo claro/oscuro.
// Uso: NODE_PATH=$(npm root -g) node qa/comparar.mjs   (BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const browser = await chromium.launch();
const all = bank.questions.map((q) => q.id);
const expected = (a, b) => { const c = bank.questions.filter((q) => q.pos[a] && q.pos[b]); return { n: c.length, pct: Math.round((c.reduce((t, q) => t + (1 - Math.abs(q.pos[a] - q.pos[b]) / 4), 0) / c.length) * 100) }; };

console.log("Comparar dos candidaturas desde la portada");
for (const w of [390, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } }); const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); }); page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  ok(await page.isVisible("#cmpx"), `la comparación está a la vista en la portada (${w} px), sin plegar`);
  const a = await page.inputValue("#cx-a"), b = await page.inputValue("#cx-b");
  ok(a !== b, "empieza con dos candidaturas distintas");
  let e = expected(a, b);
  ok((await page.textContent(".cx-big b")).trim() === `${e.pct} %` && (await page.textContent(".cx-big span")).includes(`${e.n} preguntas`), `el acuerdo medio coincide con el cálculo (${e.pct} % en ${e.n} preguntas)`);
  ok((await page.locator(".cx-dims li").count()) === 7, "muestra las siete dimensiones");
  await page.selectOption("#cx-a", "vox"); await page.selectOption("#cx-b", "pod");
  e = expected("vox", "pod");
  ok((await page.textContent(".cx-big b")).trim() === `${e.pct} %`, "al cambiar de candidaturas se recalcula");
  ok((await page.locator("#cx-b option[value=vox]").isDisabled()), "no se puede elegir la misma candidatura en A y en B");
  await page.click("#cx-swap");
  ok((await page.inputValue("#cx-a")) === "pod" && (await page.inputValue("#cx-b")) === "vox" && (await page.textContent(".cx-big b")).trim() === `${e.pct} %`, "intercambiar A y B mantiene el mismo acuerdo");
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)), `sin scroll horizontal (${w} px)`);
  ok(!/vot[ae]\s+(a|por)\b/i.test(await page.innerText("#cmpx")) || /no recomienda voto/i.test(await page.innerText("#cmpx")), "aclara que no recomienda voto");
  await ctx.close();
}

console.log("Tarjeta de resultado: estilo claro y oscuro");
{
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 } });
  await ctx.addInitScript(() => { try { localStorage.setItem("papeleta29n.prefs", JSON.stringify({ full: true })); } catch {} });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  const ans = Object.fromEntries(bank.questions.map((q) => [q.id, q.pos.psoe || 3]));
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), { v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 });
  await page.reload(); await page.waitForSelector("#r-share");
  const img = async () => { await page.waitForFunction(() => { const i = document.querySelector("#sh-img"); return i && !i.hidden && i.complete && i.naturalWidth > 0; }); return page.evaluate(async () => { const r = await fetch(document.querySelector("#sh-img").src); return (await r.blob()).size; }); };
  ok((await page.locator('input[name="sh-theme"]').count()) === 2 && await page.isChecked('input[name="sh-theme"][value="light"]'), "hay selector de estilo, con el claro por defecto");
  const s1 = await img();
  await page.evaluate(() => { const r = document.querySelector('input[name="sh-theme"][value="dark"]'); r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); });
  await page.waitForTimeout(1500); const s2 = await img();
  ok(s1 > 20000 && s2 > 20000 && s1 !== s2, `la imagen se genera en los dos estilos y cambia (${Math.round(s1 / 1024)} kB y ${Math.round(s2 / 1024)} kB)`);
  const px = await page.evaluate(async () => { const i = document.querySelector("#sh-img"), c = document.createElement("canvas"); c.width = 8; c.height = 8; const g = c.getContext("2d"); g.drawImage(i, 0, 0, 8, 8); const d = g.getImageData(1, 1, 1, 1).data; return d[0] + d[1] + d[2]; });
  ok(px < 300, "con el estilo oscuro el fondo es oscuro (el claro suma unos 700)");
  await ctx.close();
}
await browser.close();
if (errors.length) { console.log("Errores de consola:", errors.slice(0, 5)); fails.push("hay errores de consola"); } else console.log("  Errores de consola: ninguno");
if (fails.length) { console.log(`\n  FALLOS (${fails.length}):`); fails.forEach((f) => console.log("   -", f)); process.exit(1); }
console.log("\n  Todo bien.");
