// Resultados por secciones (8 nov): una sección cada vez, menú con nombres claros, tarjetas de acceso e impresión completa.
// Uso: NODE_PATH=$(npm root -g) node qa/resultados.mjs   (BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const ans = Object.fromEntries(bank.questions.map((q) => [q.id, q.pos.psoe || 3]));
const st = { v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 };
const browser = await chromium.launch();
const NAMES = ["Resultado", "Tu perfil explicado", "Siete dimensiones", "Por áreas", "Certezas y dudas", "Coincidencia por partido", "Comparar dos partidos", "Mapa político", "Cómo se calcula", "Fiabilidad", "Compartir", "Revisar mis respuestas", "Con quién menos coincides", "Políticos afines"];
const visible = (page) => page.$$eval("#v-results .res-sec[id]", (x) => x.filter((e) => getComputedStyle(e).display !== "none" && !e.hidden).map((e) => e.id));

console.log("Resultados por secciones");
for (const w of [390, 1280]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } }); const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); }); page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st); await page.reload(); await page.waitForSelector("#r-summary .tm-name");
  const v0 = await visible(page);
  ok(v0.includes("r-summary") && v0.includes("r-tiles") && !v0.includes("r-portrait") && !v0.includes("r-parties"), `al terminar solo se ve el resumen y las tarjetas (${w} px)`);
  ok((await page.locator("#r-tiles .rt-tiles a").count()) === 13, "hay una tarjeta por cada una de las otras 13 secciones");
  await page.click("#nav-btn");
  const names = await page.$$eval("#nav-panel a span:last-child", (x) => x.map((e) => e.textContent.trim()));
  ok(JSON.stringify(names) === JSON.stringify(NAMES), "el menú usa los nombres nuevos, en este orden");
  ok((await page.locator(".np-g").allTextContents()).join("|") === "Sobre ti|Candidaturas|Tus respuestas", "tres grupos: Sobre ti, Candidaturas y Tus respuestas");
  for (const id of ["areas", "map", "pols"]) {
    await page.click('#nav-panel a[data-sec="r-' + id + '"]').catch(async () => { await page.click("#nav-btn"); await page.click('#nav-panel a[data-sec="r-' + id + '"]'); });
    await page.waitForTimeout(250);
    const v = await visible(page);
    ok(v.length === 1 && v[0] === "r-" + id, `elegir «${id}» deja visible solo esa sección`);
    if (id !== "pols") await page.click("#nav-btn");
  }
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), `sin scroll horizontal (${w} px)`);
  if (w === 1280) {
    await page.emulateMedia({ media: "print" });
    const vp = await visible(page);
    ok(vp.includes("r-portrait") && vp.includes("r-parties") && vp.includes("r-pols"), "al imprimir se ven todas las secciones");
    await page.emulateMedia({ media: "screen" });
  }
  await ctx.close();
}
await browser.close();
if (errors.length) { console.log("Errores de consola:", errors.slice(0, 5)); fails.push("hay errores de consola"); } else console.log("  Errores de consola: ninguno");
if (fails.length) { console.log(`\n  FALLOS (${fails.length}):`); fails.forEach((f) => console.log("   -", f)); process.exit(1); }
console.log("\n  Todo bien.");
