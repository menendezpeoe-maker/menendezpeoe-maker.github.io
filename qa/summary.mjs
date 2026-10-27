// Resumen de resultados en una pantalla (tanda T2): candidatura con más coincidencia, 3 coincidencias y 3 choques,
// perfil en una frase, solidez, «Compartir» y «Reta a un amigo»; el resto plegado tras «Ver el análisis completo».
// Uso: NODE_PATH=$(npm root -g) node qa/summary.mjs   (con el servidor local en :8765; BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const fails = [], errors = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const browser = await chromium.launch();
const quickIds = ["A02", "B01", "B03", "C01", "D01", "E01", "F01", "G01", "H01", "I01", "I05", "J01", "K01", "K04", "L01"].filter((id) => bank.questions.some((q) => q.id === id));
const state = (o = {}) => ({ v: 2, bank: bank.version, prov: "madrid", mode: "rapida", seed: 7, order: quickIds, idx: 0, ans: Object.fromEntries(quickIds.map((id, i) => [id, [4, 2, 5, 3, 1][i % 5]])), imp: {}, prios: [], stage: "done", t: 1, ...o });
async function open(w = 390, h = 844, dark = false) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: dark ? "dark" : "light", permissions: ["clipboard-read", "clipboard-write"] });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/goatcounter|favicon/i.test(m.text())) errors.push(m.text()); });
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), state());
  await page.reload(); await page.waitForSelector("#r-summary .tm-name");
  return { ctx, page };
}

console.log("Resumen en una pantalla");
for (const [w, h, dark] of [[390, 844, false], [390, 844, true], [1280, 800, false]]) {
  const { ctx, page } = await open(w, h, dark);
  const tag = `${w}×${h}${dark ? " oscuro" : ""}`;
  ok(await page.isHidden("#r-full") && await page.isVisible("#r-unfold"), `el análisis completo está plegado tras «Ver el análisis completo» (${tag})`);
  ok(/\d+%/.test((await page.textContent("#r-summary .tm-pct")).replace(/\s/g, "")) && (await page.textContent("#r-summary .tm-name")).length > 1, `candidatura con más coincidencia y porcentaje (${tag})`);
  const yes = await page.locator("#r-summary .sum-two > div:first-child .sum-l li").count(), no = await page.locator("#r-summary .sum-two > div:last-child .sum-l li").count();
  ok(yes >= 1 && yes <= 3 && no >= 1 && no <= 3, `hasta 3 coincidencias y 3 choques (${yes} y ${no}) (${tag})`);
  ok(await page.isVisible("#r-summary h1.profile-h") && await page.isVisible("#r-summary .rel"), `perfil en una frase y solidez a la vista (${tag})`);
  const r = await page.locator('#r-summary [data-act="challenge"]').boundingBox(), c = await page.locator('#r-summary a[href="#r-share"]').boundingBox();
  ok(r && c && r.y + r.height <= h && c.y + c.height <= h, `«Compartir» y «Reta a un amigo» caben en la primera pantalla (${tag}: ${Math.round(r?.y + r?.height)} px)`);
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), `sin scroll horizontal (${tag})`);
  await ctx.close();
}

console.log("Análisis completo y navegación interna");
{
  const { ctx, page } = await open(1100, 900);
  const order = await page.$$eval("#r-full > section", (els) => els.map((e) => e.id));
  ok(order.indexOf("r-map") > order.indexOf("r-parties") && order.indexOf("r-map") > order.indexOf("r-versus"), "el mapa está en la parte avanzada, después de candidaturas y comparador");
  ok(["r-portrait", "r-dims", "r-areas", "r-traits", "r-parties", "r-versus", "r-map", "r-solid", "r-share", "r-review", "r-least", "r-pols", "r-support"].every((id) => order.includes(id)), "todas las secciones siguen ahí");
  await page.click("#nav-btn"); await page.click('.res-nav a[href="#r-parties"]'); await page.waitForTimeout(500);
  ok(await page.isVisible("#r-parties .pcard"), "un enlace de la navegación interna despliega el análisis y lleva a la sección");
  ok(await page.evaluate(() => JSON.parse(localStorage.getItem("papeleta29n.prefs")).full === true), "se recuerda que lo has desplegado");
  await page.reload(); await page.waitForSelector("#r-summary .tm-name");
  ok(await page.isVisible("#r-full") && /Ocultar el análisis completo/.test(await page.textContent("#r-unfold")), "al volver sigue desplegado (y el botón ofrece ocultarlo)");
  await ctx.close();
}
{
  const { ctx, page } = await open(390, 844);
  await page.click("#r-unfold"); await page.waitForTimeout(400);
  ok(await page.isVisible("#r-portrait") && await page.evaluate(() => document.activeElement?.closest("#r-portrait") !== null), "«Ver el análisis completo» despliega y lleva el foco a «Tu perfil»");
  ok((await page.getAttribute("#r-unfold", "aria-expanded")) === "true" && /Ocultar/.test(await page.textContent("#r-unfold")), "el mismo botón pasa a «Ocultar el análisis completo»");
  await page.click("#r-unfold"); await page.waitForTimeout(400);
  ok(await page.isHidden("#r-full") && (await page.getAttribute("#r-unfold", "aria-expanded")) === "false" && await page.evaluate(() => !JSON.parse(localStorage.getItem("papeleta29n.prefs")).full), "pulsarlo otra vez lo vuelve a plegar (y se recuerda)");
  await ctx.close();
}

console.log("Pulsar otra vez para ocultar");
{
  const { ctx, page } = await open(1100, 900);
  await page.click("#r-unfold"); await page.waitForTimeout(300);
  const btn = page.locator('#r-parties li:not(:nth-child(-n+3)) [data-card]').first();
  const pid = await btn.getAttribute("data-card");
  await btn.click(); await page.waitForTimeout(300);
  const b2 = page.locator(`#r-parties [data-card="${pid}"]`).first();
  ok((await page.locator("#pc-extra .pcard, #pc-extra *").count()) > 0 && /Ocultar su ficha/.test(await b2.textContent()), "«Ver su ficha» abre la ficha y pasa a «Ocultar su ficha»");
  await b2.click(); await page.waitForTimeout(300);
  ok((await page.locator("#pc-extra *").count()) === 0 && /Ver su ficha/.test(await b2.textContent()), "pulsarlo otra vez cierra la ficha");
  const tip = page.locator("#v-results [data-tip]").first();
  if (await tip.count()) { await tip.scrollIntoViewIfNeeded(); await tip.focus(); await tip.click(); await page.waitForTimeout(450); const shown = await page.isVisible("#tip");
    await tip.click(); await page.waitForTimeout(100); ok(shown && await page.isHidden("#tip"), "una nota emergente se muestra y se oculta al pulsarla otra vez"); }
  console.log("Menú de secciones");
  ok(await page.isVisible("#nav-btn") && await page.isHidden("#nav-panel"), "las secciones están agrupadas en un único botón, cerrado al empezar");
  await page.click("#nav-btn"); await page.waitForTimeout(150);
  ok(await page.isVisible("#nav-panel") && (await page.getAttribute("#nav-btn", "aria-expanded")) === "true" && (await page.locator(".np-g").count()) === 3 && (await page.locator("#nav-panel a svg").count()) === (await page.locator("#nav-panel a").count()), "al abrirlo muestra todas las secciones, en 3 grupos y con su icono");
  await page.click("#nav-btn"); await page.waitForTimeout(150);
  ok(await page.isHidden("#nav-panel"), "pulsar el botón otra vez lo cierra");
  await page.click("#nav-btn"); await page.keyboard.press("Escape"); await page.waitForTimeout(150);
  ok(await page.isHidden("#nav-panel") && await page.evaluate(() => document.activeElement?.id === "nav-btn"), "Escape lo cierra y devuelve el foco al botón");
  await page.click("#nav-btn"); await page.mouse.click(20, 700); await page.waitForTimeout(150);
  ok(await page.isHidden("#nav-panel"), "pulsar fuera lo cierra");
  await page.click("#nav-btn"); await page.click('#nav-panel a[href="#r-map"]'); await page.waitForTimeout(700);
  ok(await page.isHidden("#nav-panel") && (await page.getAttribute('.res-nav a[href="#r-map"]', "aria-current")) === "true" && /Mapa/.test(await page.textContent("#nav-cur")), "elegir una sección lleva a ella, cierra el menú y el botón muestra dónde estás");
  ok(await page.evaluate(() => Number(document.querySelector("#nav-pct").textContent) > 0 && /scaleX\(0\.[0-9]*[1-9]|scaleX\(1\)/.test(document.querySelector("#nav-bar").style.transform)), "muestra cuánto llevas leído");
  await ctx.close();
}
console.log("Repetir y donar desde el resumen");
{
  const { ctx, page } = await open(390, 844);
  ok(await page.isVisible('#r-summary [data-act="new"]') && await page.isVisible('#r-summary a[href="#r-support"]'), "el resumen ofrece «Repetir el test» y «Donar» junto a compartir");
  await page.click('#r-summary a[href="#r-support"]'); await page.waitForTimeout(700);
  ok(!(await page.isHidden("#r-full")) && await page.isVisible("#r-support a.btn"), "«Donar» despliega y lleva a las opciones de aportación");
  await ctx.close();
}
console.log("Reta a un amigo");
{
  const { ctx, page } = await open(1100, 900);
  await page.click('#r-summary [data-act="challenge"]'); await page.waitForTimeout(400);
  const txt = await page.evaluate(() => navigator.clipboard.readText());
  ok(/compárate conmigo/.test(txt) && /#r2[0-9a-z]+/.test(txt), "copia un mensaje con el enlace para compararse");
  const token = txt.split("#")[1];
  const p2 = await ctx.newPage();
  await p2.evaluate(() => 0);
  await p2.goto(BASE + "#" + token); await p2.waitForSelector(".shared-banner");
  ok(await p2.isVisible("#r-friend") && /¿Cuánto coincidís\?/.test(await p2.textContent("#r-friend")), "el enlace abre la comparación «¿Cuánto coincidís?» para quien ya tiene su test");
  ok((await p2.locator('#r-summary [data-act="challenge"]').count()) === 0, "en un resultado compartido no aparece «Reta a un amigo»");
  await ctx.close();
}

await browser.close();
if (errors.length) console.log("Errores:\n" + errors.join("\n"));
if (fails.length || errors.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
