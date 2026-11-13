// Recorrido móvil completo (390 y 360 px) y pasada en escritorio, tras la revisión móvil de Codex del 13 nov: portada en un toque,
// guardar y salir, continuar en un toque, hitos de progreso hasta el final, Bizkaia, prioridad Vivienda, comparar y resumen de vivienda.
// Uso: NODE_PATH=$(npm root -g) node qa/recorrido.mjs   (servidores :8765 y :8766; BASE y VIV para la web real)
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
import { goSection } from "./_nav.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const VIV = process.env.VIV || (process.env.BASE ? new URL("temas/vivienda-y-urbanismo/", process.env.BASE).href : "http://127.0.0.1:8766/temas/vivienda-y-urbanismo/");
const SHOTS = process.env.SHOTS;
const fails = [], errors = [];
const ok = (c, m) => { if (!c) fails.push(m); console.log(c ? "  ✓" : "  ✗", m); };
const browser = await chromium.launch();
const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);

for (const w of [390, 360]) {
  console.log(`Móvil ${w} × 844`);
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${w}: ${e}`)); page.on("dialog", (d) => { errors.push(`${w}: diálogo inesperado ${d.message()}`); d.dismiss(); });
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  const b = await page.locator("#start-btn").boundingBox(), a2 = await page.locator("#start-alt").boundingBox();
  ok(await page.textContent("#start-btn") === "Empezar test rápido · 3 min" && b.y + b.height <= 844 && a2.y + a2.height <= 844, `portada: «Empezar test rápido · 3 min» y «Elegir otra versión» en la primera pantalla (${Math.round(a2.y + a2.height)} px)`);
  ok(!(await overflow(page)), "portada sin desplazamiento horizontal");
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/home-${w}.png` });
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  ok(await page.textContent("#q-count") === "Pregunta 1 de 15", "un toque abre la pregunta 1 de 15");
  const autoTxt = [];
  const answer = async () => { await page.click("#q-main .opt >> nth=3"); await page.waitForTimeout(500); autoTxt.push([await page.textContent("#q-count").catch(() => "fin"), await page.textContent(".q-auto").catch(() => "")]); };
  for (let i = 0; i < 4; i++) await answer();
  await page.click("#q-exit"); await page.waitForSelector("#v-home:not([hidden])");
  ok(await page.textContent("#start-btn") === "Continuar test · 4 de 15 respondidas" && await page.isHidden("#resume"), `tras «Guardar y salir»: «${await page.textContent("#start-btn")}» como acción principal`);
  ok(await page.textContent("#start-alt") === "Empezar otro test", "secundaria: «Empezar otro test»");
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/resume-${w}.png` });
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  ok(await page.textContent("#q-count") === "Pregunta 5 de 15", "un toque retoma en la pregunta 5");
  for (let i = 4; i < 15; i++) await answer();
  const late = autoTxt.filter(([q]) => /Pregunta 1[3-5] de 15/.test(q));
  ok(!autoTxt.some(([q, t]) => /cuarto/.test(t) && /Pregunta 1[3-5]/.test(q)), `sin «Te queda solo un cuarto» en el último tramo (${late.map(([q, t]) => `${q}: ${t}`).join(" | ")})`);
  ok(autoTxt.some(([q, t]) => q === "Pregunta 15 de 15" && t === "Última pregunta") && autoTxt.at(-1)[1] === "Has respondido las 15 preguntas", `en la 15 de 15: «Última pregunta» y, al contestarla, «${autoTxt.at(-1)[1]}»`);
  await page.waitForSelector("#v-prios:not([hidden])");
  await page.selectOption("#f-prov", "bizkaia");
  await page.click('#prio-grid .prio-b:has-text("Vivienda")');
  ok(await page.getAttribute('#prio-grid .prio-b:has-text("Vivienda")', "aria-pressed") === "true", "Vivienda marcada como prioridad");
  ok(!(await overflow(page)), "provincia y prioridades sin desplazamiento horizontal");
  await page.click("#prio-go"); await page.waitForSelector("#v-results:not([hidden])");
  ok(/Bizkaia/i.test(await page.innerText("#v-results")), "resultados de Bizkaia");
  ok(!(await overflow(page)), "resultados sin desplazamiento horizontal");
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/results-${w}.png` });
  await goSection(page, "solid");
  ok(/Sin las posturas estimadas, la candidatura con más coincidencia (sigue siendo|sería) .+ \(\d+ %/.test(await page.innerText("#r-solid")) && !(await overflow(page)), "solidez: cómo cambiaría el resultado sin las posturas estimadas, sin desbordar");
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/solid-${w}.png` });
  await goSection(page, "versus");
  ok((await page.innerText("#r-versus")).length > 200 && !(await overflow(page)), "comparación entre dos candidaturas abierta y sin desbordar");
  // Salida sin prioridades: volver a las prioridades y ver resultados sin ellas
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("papeleta29n.v2")); s.stage = "prios"; localStorage.setItem("papeleta29n.v2", JSON.stringify(s)); });
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  ok(await page.textContent("#start-btn") === "Continuar test · 15 de 15 respondidas", "con todas respondidas y sin ver resultados, el principal sigue ofreciendo continuar");
  await page.click("#start-btn"); await page.waitForSelector("#v-prios:not([hidden])");
  await page.click("#prio-skip"); await page.waitForSelector("#v-results:not([hidden])");
  ok(true, "«Ver resultados sin prioridades» lleva a los resultados");
  // Tema: acceso al test de vivienda y página de vivienda
  await page.goto(VIV);
  const top = await page.evaluate(() => { const r = (s) => { const e = document.querySelector(s); return e ? Math.round(e.getBoundingClientRect().bottom) : 9999; }; return { rows: [...document.querySelectorAll(".sumv-row summary")].map((s) => Math.round(s.getBoundingClientRect().bottom)), btn: r(".sumv-top .btn") }; });
  ok(top.rows.length === 3 && top.rows[2] <= 844 * 1.6 && top.btn <= 844, `vivienda: botón al test en la primera pantalla (${top.btn} px) y las tres filas pronto (${top.rows.join(", ")} px)`);
  ok(!(await overflow(page)), "vivienda sin desplazamiento horizontal");
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/vivienda-${w}.png` });
  await page.click(".sumv-row >> nth=0 >> summary");
  ok(await page.isVisible(".sumv-row >> nth=0 >> .sumv-d") && /Documentadas a favor/.test(await page.innerText(".sumv-row >> nth=0")) && !(await overflow(page)), "la fila de alquiler se despliega con nombres y fuentes, sin desbordar");
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/vivienda-open-${w}.png`, fullPage: false });
  const href = await page.getAttribute(".sumv-top .btn", "href"); ok(href === "/tests/vivienda/" && /7 preguntas, unos 2 min/.test(await page.textContent(".sumv-top .btn")), "acceso al test de vivienda (7 preguntas, unos 2 min)");
  await ctx.close();
}
console.log("Escritorio 1280 × 900");
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } }); const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`desk: ${e}`)); page.on("dialog", (d) => d.accept());
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  ok(await page.textContent("#start-btn") === "Empezar test rápido · 3 min", "escritorio: botón principal");
  await page.check("#f-mode-media", { force: true });
  ok(await page.textContent("#start-btn") === "Empezar versión media · 10 min", "escritorio: el botón sigue a la versión elegida en el formulario");
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  ok(/de 48$/.test(await page.textContent("#q-count")), "escritorio: empieza la media");
  await page.click("#q-main .opt >> nth=2"); await page.waitForTimeout(500);
  await page.click("#q-exit"); await page.waitForSelector("#v-home:not([hidden])");
  ok(/^Continuar test · 1 de 48 respondidas$/.test(await page.textContent("#start-btn")), "escritorio: continuar en un clic");
  await page.click("#start-alt"); await page.waitForTimeout(400);
  ok(await page.evaluate(() => document.querySelector("#setup").getBoundingClientRect().top < innerHeight), "escritorio: «Empezar otro test» lleva al formulario de versiones");
  await page.check("#f-mode-completa", { force: true }); await page.click("#start-btn-2"); await page.waitForSelector("#v-quiz:not([hidden])");
  ok(/de 107$/.test(await page.textContent("#q-count")), "escritorio: empezar otro test pide confirmación y lo sustituye");
  for (const v of ["rapida", "expres"]) { await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])"); await page.evaluate(() => localStorage.removeItem("papeleta29n.v2")); await page.reload(); await page.waitForSelector("#start-btn:not([disabled])"); await page.check(`#f-mode-${v}`, { force: true }); await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])"); ok(/de (15|24)$/.test(await page.textContent("#q-count")), `escritorio: versión ${v}`); }
  await page.goto(VIV); ok(!(await overflow(page)) && (await page.locator(".sumv-row").count()) === 3, "escritorio: vivienda con tres filas");
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/vivienda-desk.png` });
  await ctx.close();
}
// Salvaguarda en móvil: empezar otro test con uno a medias pide confirmación (cancelar conserva el guardado)
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }); const page = await ctx.newPage();
  let asked = 0; page.on("dialog", (d) => { asked++; d.dismiss(); });
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])"); await page.click("#q-main .opt >> nth=1"); await page.waitForTimeout(500);
  await page.click("#q-exit"); await page.waitForSelector("#v-home:not([hidden])");
  await page.click("#start-alt"); await page.click('#bn-modes [data-mode="completa"]'); await page.waitForTimeout(300);
  ok(asked === 1 && await page.textContent("#start-btn") === "Continuar test · 1 de 15 respondidas", "móvil: empezar otro test pide confirmación y, si se cancela, conserva el test a medias");
  await ctx.close();
}
await browser.close();
if (errors.length) console.log("Errores:", errors);
console.log(fails.length ? `${fails.length} FALLOS` : "Todo OK");
process.exit(fails.length || errors.length ? 1 : 0);
