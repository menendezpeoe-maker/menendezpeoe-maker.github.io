// Auditoría funcional: historial del navegador, estados de error, accesibilidad (axe-core) y rendimiento.
// Uso: NODE_PATH=$(npm root -g) node qa/audit.mjs   (BASE para otra URL; AXE=0 para saltar axe)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const errors = [], fails = [], notes = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const done = (ans, o = {}) => ({ v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1, ...o });
import { withFullAnalysis } from "./_full.mjs";
const browser = withFullAnalysis(await chromium.launch());
async function ctxPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: opts.w || 1100, height: 900 }, colorScheme: opts.dark ? "dark" : "light", bypassCSP: !!opts.axe });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error" && !opts.allowErr) errors.push(`[${opts.tag}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${opts.tag}] ${e}`));
  return { ctx, page };
}
const view = (page) => page.evaluate(() => ["home", "quiz", "prios", "results", "method", "explorer", "error"].find((v) => !document.getElementById(`v-${v}`).hidden));

console.log("Historial del navegador");
{
  const { ctx, page } = await ctxPage({ tag: "hist" });
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.click(".head-nav [data-go='method']"); ok((await view(page)) === "method", "ir a «Cómo funciona»");
  await page.goBack(); ok((await view(page)) === "home", "Atrás vuelve al inicio (antes salía de la web)");
  await page.goForward(); ok((await view(page)) === "method", "Adelante vuelve a «Cómo funciona»");
  await page.click(".head-nav [data-go='explorer']"); await page.goBack(); ok((await view(page)) === "method", "Atrás desde «Posturas» vuelve a «Cómo funciona»");
  await page.goBack();
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  for (let i = 0; i < 3; i++) { await page.click(".scale label:nth-child(4)", { force: true }).catch(() => page.keyboard.press("4")); await page.waitForTimeout(450); }
  await page.goBack(); ok((await view(page)) === "home" && await page.isVisible("#resume"), "Atrás desde el test vuelve al inicio y ofrece continuar");
  await page.goForward(); ok((await view(page)) === "quiz", "Adelante vuelve al test donde estaba");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), done(Object.fromEntries(all.map((id) => [id, 4]))));
  await page.reload(); await page.waitForSelector("#v-results:not([hidden])");
  await page.click(".head-nav [data-go='method']"); await page.goBack();
  ok((await view(page)) === "results" && (await page.locator("#r-parties .rank li").count()) > 0, "Atrás desde «Cómo funciona» vuelve a tus resultados, recalculados");
  await ctx.close();
}

console.log("Estados de carga y error");
{
  const { ctx, page } = await ctxPage({ tag: "err", allowErr: true });
  await ctx.route("**/data/preguntas.json*", (r) => r.fulfill({ status: 500, body: "" }));
  await page.goto(BASE); await page.waitForTimeout(1500);
  ok((await view(page)) === "error" && await page.isVisible("#retry-btn"), "si fallan los datos se muestra un error con «Reintentar»");
  await ctx.close();
}
{
  const { ctx, page } = await ctxPage({ tag: "pols-fail", allowErr: true });
  await ctx.route("**/data/politicos.json*", (r) => r.abort());
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), done(Object.fromEntries(all.map((id) => [id, 2]))));
  await page.reload(); await page.waitForSelector("#v-results:not([hidden])");
  ok((await page.locator("#r-parties .rank li").count()) > 0 && /No se han podido cargar los perfiles/.test(await page.innerText("#r-pols")), "si fallan los políticos, el resto del resultado funciona y se avisa");
  await ctx.close();
}
{
  const { ctx, page } = await ctxPage({ tag: "corrupt" });
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate(() => localStorage.setItem("papeleta29n.v2", "{roto"));
  await page.reload(); await page.waitForTimeout(1200);
  ok((await view(page)) === "home", "un progreso guardado corrupto no rompe la web");
  await page.evaluate(() => localStorage.setItem("papeleta29n.v2", JSON.stringify({ v: 2, prov: "no-existe", ans: { A01: 9 }, stage: "done", order: ["ZZZ"] })));
  await page.reload(); await page.waitForTimeout(1200);
  ok(["home", "results"].includes(await view(page)), "un progreso con datos inválidos no rompe la web");
  await page.goto(BASE + "#r2basura"); await page.waitForTimeout(1200);
  ok(["home", "results"].includes(await view(page)), "un enlace compartido inválido no rompe la web");
  await ctx.close();
}

console.log("Teclado");
{
  const { ctx, page } = await ctxPage({ tag: "kbd" });
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.keyboard.press("Tab");
  ok(await page.evaluate(() => document.activeElement.classList.contains("skip")), "el primer Tab muestra «Saltar al contenido»");
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  const c0 = await page.textContent("#q-count");
  await page.keyboard.press("4"); await page.waitForTimeout(700);
  ok((await page.textContent("#q-count")) !== c0, "en el test se puede responder con las teclas 1–5");
  await ctx.close();
}

if (process.env.AXE !== "0") {
  console.log("Accesibilidad (axe-core, WCAG 2.1 AA)");
  const axe = await (await fetch("https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js")).text();
  for (const [tag, dark, w] of [["claro", false, 1100], ["oscuro", true, 390]]) {
    const { ctx, page } = await ctxPage({ tag: `axe-${tag}`, dark, w, axe: true });
    await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
    const run = async (name) => {
      await page.waitForTimeout(700); // que termine la animación de entrada antes de medir contraste
      await page.addScriptTag({ content: axe });
      const r = await page.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21aa"], resultTypes: ["violations"] })).violations.map((v) => ({ id: v.id, impact: v.impact, n: v.nodes.length, ex: v.nodes.slice(0, 3).map((x) => x.target.join(" ")).join(" | "), msg: v.nodes[0]?.failureSummary?.split("\n")[1]?.trim() })));
      console.log(`  [${tag}] ${name}: ${r.length ? r.map((v) => `${v.id}(${v.impact}, ${v.n})`).join(", ") : "sin infracciones"}`);
      r.forEach((v) => notes.push(`${tag}/${name} ${v.id}: ${v.ex} — ${v.msg}`));
      return r;
    };
    const res = {};
    res.home = await run("inicio");
    await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), done(Object.fromEntries(all.map((id, i) => [id, [1, 2, 4, 5, 3][i % 5]])), { stage: "quiz", idx: 3 }));
    await page.reload(); await page.waitForSelector("#start-btn:not([disabled])");
    await page.click("[data-act='resume']"); await page.waitForSelector("#v-quiz:not([hidden])");
    res.quiz = await run("pregunta");
    await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), done(Object.fromEntries(all.map((id, i) => [id, [1, 2, 4, 5, 3][i % 5]]))));
    await page.reload(); await page.waitForSelector("#v-results:not([hidden])");
    res.results = await run("resultados");
    await page.click(".head-nav [data-go='method']"); res.method = await run("cómo funciona");
    await page.click(".head-nav [data-go='explorer']"); res.explorer = await run("posturas");
    const serious = Object.values(res).flat().filter((v) => ["critical", "serious"].includes(v.impact));
    ok(!serious.length, `[${tag}] sin infracciones graves de accesibilidad${serious.length ? ": " + [...new Set(serious.map((v) => v.id))].join(", ") : ""}`);
    await ctx.close();
  }
}

console.log("Rendimiento");
{
  const { ctx, page } = await ctxPage({ tag: "perf" });
  let bytes = 0; page.on("response", async (r) => { try { bytes += (await r.body()).length; } catch { /* redirecciones */ } });
  const t0 = Date.now(); await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])"); const t = Date.now() - t0;
  const nav = await page.evaluate(() => { const n = performance.getEntriesByType("navigation")[0]; return { dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd) }; });
  console.log(`  listo para usar en ${t} ms · DOMContentLoaded ${nav.dcl} ms · carga ${nav.load} ms · ${(bytes / 1024).toFixed(0)} KB descargados`);
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), done(Object.fromEntries(all.map((id) => [id, 4]))));
  const t1 = Date.now(); await page.reload(); await page.waitForSelector("#r-pols"); console.log(`  resultados completos (107 respuestas) en ${Date.now() - t1} ms`);
  const t2 = await page.evaluate(() => { const el = document.querySelector("#rv-A01"); const s = performance.now(); el.value = "1"; el.dispatchEvent(new Event("change", { bubbles: true })); return Math.round(performance.now() - s); });
  console.log(`  recalcular todo al cambiar una respuesta: ${t2} ms`);
  ok(t2 < 300, "recalcular al cambiar una respuesta tarda menos de 300 ms");
  await ctx.close();
}

await browser.close();
if (notes.length) console.log("\nDetalle accesibilidad:\n - " + notes.join("\n - "));
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
