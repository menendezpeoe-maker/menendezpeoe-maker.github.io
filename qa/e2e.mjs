// Prueba de extremo a extremo del Test 29N con Chromium (Playwright).
// Uso: NODE_PATH=$(npm root -g) node qa/e2e.mjs   (con el servidor local en :8765)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const OUT = new URL("./shots/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const errors = [];
const fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };

import { withFullAnalysis } from "./_full.mjs";
// Empieza desde la portada: en el móvil «Empezar el test» despliega las versiones en el banner y se toca una
async function startHome(page, mode) {
  if (await page.evaluate(() => matchMedia("(max-width: 759px)").matches)) {
    mode ||= await page.evaluate(() => (document.querySelector("input[name=mode]:checked") || {}).value || "rapida");
    await page.click("#start-btn"); await page.click(`#bn-modes [data-mode="${mode}"]`);
  } else { if (mode) await page.check(`#f-mode-${mode}`, { force: true }); await page.click("#start-btn"); }
}

const browser = withFullAnalysis(await chromium.launch());
async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: opts.w || 390, height: opts.h || 860 }, colorScheme: opts.dark ? "dark" : "light", reducedMotion: opts.rm ? "reduce" : "no-preference", hasTouch: !!opts.touch });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${opts.tag}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${opts.tag}] ${e}`));
  return { ctx, page };
}
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
const posOf = (q, pid) => bank.questions.find((x) => x.id === q).pos[pid];

// 1 · Flujo completo en móvil (exprés)
{
  console.log("Móvil · flujo exprés");
  const { ctx, page } = await newPage({ w: 390, tag: "mobile" });
  await page.goto(BASE);
  await page.waitForSelector("#start-btn:not([disabled])");
  ok(!(await overflow(page)), "inicio sin scroll horizontal (390px)");
  await page.screenshot({ path: OUT + "m-home.png", fullPage: true });
  await startHome(page, "expres");
  await page.waitForSelector("#v-quiz:not([hidden])");
  const n = Number(/de (\d+)/.exec(await page.textContent("#q-count"))[1]);
  ok(n === 24, `exprés tiene 24 preguntas (${n})`);
  await page.screenshot({ path: OUT + "m-quiz.png" });
  // Contexto: abrir y cerrar sin cambiar respuesta
  await page.click("#q-main .opt:nth-child(4)");
  await page.waitForTimeout(450);
  ok((await page.textContent("#q-count")).startsWith("Pregunta 2 de"), "responder con toque avanza solo");
  await page.click("#q-prev");
  ok(await page.isChecked('#q-main input[value="4"]'), "al volver atrás se conserva la respuesta");
  await page.click("#ctx-toggle");
  ok(await page.isVisible("#ctx"), "el contexto se abre");
  ok((await page.textContent("#ctx-body")).length > 200, "el contexto tiene texto");
  ok(await page.isChecked('#q-main input[value="4"]'), "abrir el contexto no cambia la respuesta");
  await page.screenshot({ path: OUT + "m-ctx.png" });
  await page.keyboard.press("Escape");
  ok(await page.isHidden("#ctx"), "Escape cierra el contexto");
  ok((await page.textContent("#q-count")).startsWith("Pregunta 1 de"), "cerrar el contexto no cambia de pregunta");
  await page.click("#q-next");
  ok((await page.textContent("#q-count")).startsWith("Pregunta 2 de"), "Siguiente avanza");
  await page.click("#q-next");
  ok((await page.textContent("#q-err")).includes("Elige"), "no deja avanzar sin responder");
  // Responder como el PP, con un «No lo sé» y una importante
  for (let i = 1; i < n; i++) {
    const id = await page.evaluate(() => document.querySelector("#q-main .q-code").textContent);
    const qid = bank.questions.find((q) => `${bank.areas.find((a) => a.id === q.area).letter}·${q.id.slice(1)}` === id).id;
    if (i === 3) await page.click("#imp-btn");
    if (i === 5) { await page.click("#q-main .opt-ns"); }
    else await page.click(`#q-main .opt:nth-child(${posOf(qid, "pp") || 3})`);
    await page.waitForTimeout(420);
    if (i === 10) {
      await page.reload();
      await page.waitForSelector("#resume:not([hidden])");
      ok((await page.textContent("#resume")).includes("a medias"), "al recargar ofrece continuar");
      await page.click('#resume [data-act="resume"]');
      await page.waitForSelector("#v-quiz:not([hidden])");
      ok((await page.textContent("#q-count")).startsWith("Pregunta 12 de"), "continúa en la misma pregunta");
    }
  }
  await page.waitForSelector("#v-prios:not([hidden])");
  await page.click('.prio-b[data-a="eco"]');
  await page.click('.prio-b[data-a="viv"]');
  await page.click("#prio-go");
  ok((await page.textContent("#prov-err")).includes("provincia") && !(await page.isHidden("#v-prios")), "sin provincia no muestra resultados y la pide");
  await page.selectOption("#f-prov", "madrid");
  ok((await page.locator("#prov-chips .chip").count()) === 8, "Madrid muestra 8 candidaturas");
  await page.screenshot({ path: OUT + "m-prios.png" });
  await page.click("#prio-go");
  await page.waitForSelector("#v-results:not([hidden])");
  const top = await page.textContent(".tm-name");
  ok(/Partido Popular/i.test(top), `respondiendo como el PP, el PP sale primero (${top})`);
  for (const id of ["#r-dims .drow", "#r-map svg", "#r-areas .arow", "#r-traits .trait", "#r-parties .pcard", "#r-solid .checks li", "#r-review .rv"]) ok((await page.locator(id).count()) > 0, `sección presente: ${id}`);
  ok((await page.locator("#r-parties .pcard").count()) === 3, "tres fichas detalladas");
  ok(!(await overflow(page)), "resultados sin scroll horizontal (390px)");
  await page.screenshot({ path: OUT + "m-results.png", fullPage: true });
  // Cambiar una respuesta recalcula
  const before = await page.textContent(".tm-pct");
  ok(!(await page.locator("#r-review details.rv-area[open]").count()), "«Tus respuestas» empieza plegado por áreas");
  await page.locator("#r-review details.rv-area > summary").first().click();
  const sel = page.locator('#r-review details.rv-area[open] select[data-ctl="ans"]').first();
  const cur = await sel.inputValue();
  await sel.selectOption(cur === "1" ? "5" : "1");
  await page.waitForTimeout(200);
  const after = await page.textContent(".tm-pct");
  ok(before !== after, `editar una respuesta recalcula (${before} → ${after})`);
  // Enlace completo (con respuestas) desde la sección Compartir
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.click("#r-share details summary");
  await page.click("#sh-full");
  await page.waitForTimeout(250);
  const link = await page.evaluate(() => navigator.clipboard.readText());
  ok(/#r2[0-9a-z]+/.test(link), "genera enlace para compartir");
  const token = link.split("#")[1];
  const p2 = await ctx.newPage();
  p2.on("pageerror", (e) => errors.push(`[shared] ${e}`));
  await p2.goto(BASE + "#" + token);
  await p2.waitForSelector(".shared-banner");
  ok((await p2.textContent(".tm-pct")) === after, "el enlace reproduce el mismo resultado");
  ok(await p2.isDisabled('#r-review select[data-ctl="ans"] >> nth=0'), "el resultado compartido es de solo lectura");
  await p2.close();
  // Metodología y explorador
  await page.click('[data-go="method"] >> nth=0');
  await page.waitForSelector("#v-method:not([hidden]) table");
  ok(!(await overflow(page)), "metodología sin scroll horizontal");
  await page.screenshot({ path: OUT + "m-method.png", fullPage: true });
  await page.click('.head-nav [data-go="explorer"]');
  await page.fill("#ex-q", "lobo");
  await page.waitForTimeout(300);
  ok((await page.locator(".exq").count()) === 1, "el buscador filtra (lobo)");
  ok(!(await overflow(page)), "explorador sin scroll horizontal");
  await ctx.close();
}

// 2 · Escritorio oscuro, teclado, versión media, contexto lateral
{
  console.log("Escritorio oscuro · teclado");
  const { ctx, page } = await newPage({ w: 1280, h: 900, dark: true, tag: "desktop" });
  await page.goto(BASE);
  await page.waitForSelector("#start-btn:not([disabled])");
  await page.screenshot({ path: OUT + "d-home.png", fullPage: true });
  await startHome(page, "media");
  await page.waitForSelector("#v-quiz:not([hidden])");
  await page.keyboard.press("c");
  ok(await page.isVisible("#ctx"), "tecla C abre el contexto");
  // Diseño aprobado el 31 oct: el contexto es un acordeón justo debajo de su botón (también en escritorio)
  ok(await page.evaluate(() => document.querySelector("#q-main .q-tools").nextElementSibling === document.querySelector("#ctx")), "en escritorio el contexto se abre debajo de su botón");
  await page.screenshot({ path: OUT + "d-quiz-ctx.png" });
  const n = Number(/de (\d+)/.exec(await page.textContent("#q-count"))[1]);
  ok(n === 48, `media tiene 48 preguntas (${n})`);
  for (let i = 0; i < n; i++) {
    const code = await page.textContent("#q-main .q-code");
    const qid = bank.questions.find((q) => `${bank.areas.find((a) => a.id === q.area).letter}·${q.id.slice(1)}` === code).id;
    await page.keyboard.press(String(posOf(qid, "junts") || 3));
    await page.waitForTimeout(400);
  }
  await page.waitForSelector("#v-prios:not([hidden])");
  await page.selectOption("#f-prov", "barcelona");
  await page.click("#prio-skip");
  await page.waitForSelector("#v-results:not([hidden])");
  const top = await page.textContent(".tm-name");
  ok(/Junts/i.test(top), `respondiendo como Junts, Junts sale primero (${top})`);
  ok(!(await overflow(page)), "resultados sin scroll horizontal (1280px)");
  await page.screenshot({ path: OUT + "d-results.png", fullPage: true });
  ok((await page.locator("#r-map select:not(#map-dim)").count()) === 0 && (await page.locator("#r-map .me-o").count()) === 1, "mapa automático, sin selectores, con tu posición");
  await page.click('[data-act="more"]');
  await page.waitForSelector("#v-quiz:not([hidden])");
  ok((await page.textContent("#q-count")).includes("de 107"), "afinar pasa a la completa conservando respuestas");
  await ctx.close();
}

// 3 · Tableta
{
  console.log("Tableta");
  const { ctx, page } = await newPage({ w: 820, h: 1180, tag: "tablet", touch: true });
  await page.goto(BASE);
  await page.waitForSelector("#start-btn:not([disabled])");
  ok(!(await overflow(page)), "inicio sin scroll horizontal (820px)");
  await startHome(page);
  await page.click("#ctx-toggle");
  ok(await page.evaluate(() => document.querySelector("#q-main .q-tools").nextElementSibling === document.querySelector("#ctx") && getComputedStyle(document.querySelector("#ctx")).position !== "fixed"), "en tableta el contexto se abre debajo de su botón, sin tapar las respuestas");
  await page.screenshot({ path: OUT + "t-quiz-ctx.png" });
  await ctx.close();
}

// 4 · Perfiles sintéticos: cada partido debe ser el primero en su provincia si respondes como él
{
  console.log("Perfiles sintéticos (versión completa)");
  const { ctx, page } = await newPage({ w: 1100, tag: "profiles" });
  const provFor = { psoe: "madrid", pp: "madrid", vox: "madrid", fa: "madrid", pod: "madrid", salf: "madrid", pacma: "madrid", d21: "madrid", erc: "barcelona", junts: "barcelona", pnv: "bizkaia", bildu: "bizkaia", upn: "navarra", gbai: "navarra", bng: "coruna", ccpc: "tenerife", upc: "tenerife", drago: "tenerife", comp: "valencia", cha: "teruel", existe: "teruel", mes: "baleares", adel: "sevilla", jmm: "jaen", upl: "leon", soria: "soria", pav: "avila" };
  await page.goto(BASE);
  await page.waitForSelector("#start-btn:not([disabled])");
  const rows = [];
  for (const pid of pd.order) {
    const ans = {};
    bank.questions.forEach((q) => { ans[q.id] = q.pos[pid] || 3; });
    const st = { v: 2, bank: bank.version, prov: provFor[pid], mode: "completa", seed: 7, order: bank.questions.map((q) => q.id), idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 };
    await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st);
    await page.reload();
    await page.waitForSelector("#v-results:not([hidden])");
    const names = await page.$$eval("#r-parties .rank li .nm b", (els) => els.slice(0, 3).map((e) => e.textContent));
    const pcts = await page.$$eval("#r-parties .rank li .pv b", (els) => els.slice(0, 3).map((e) => e.textContent));
    rows.push(`${pid.padEnd(7)} ${provFor[pid].padEnd(10)} → ${names.map((n, i) => `${n} ${pcts[i]}`).join(" | ")}`);
    const wanted = pd.parties.find((p) => p.id === pid);
    const local = Object.values(wanted.local || {});
    const tie = pcts[0] === pcts[1] && [wanted.name, ...local].includes(names[1]);
    const known = bank.questions.filter((q) => q.pos[pid]).length;
    if (![wanted.name, ...local].includes(names[0]) && !tie) (known < 30 ? console.log(`  (aviso esperado) ${pid}: solo ${known} posturas conocidas, sale ${names[0]}`) : fails.push(`perfil ${pid}: primero sale ${names[0]}`));
  }
  console.log(rows.join("\n"));
  // Respuestas neutras: todo «3»
  const ans = {}; bank.questions.forEach((q) => { ans[q.id] = 3; });
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), { v: 2, prov: "madrid", mode: "completa", seed: 7, order: bank.questions.map((q) => q.id), idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 });
  await page.reload();
  await page.waitForSelector("#v-results:not([hidden])");
  ok((await page.textContent("#r-summary .rel")).includes("baja"), "todo neutral → solidez baja");
  console.log("  todo neutral:", (await page.$$eval("#r-parties .rank li", (els) => els.slice(0, 8).map((e) => e.querySelector(".nm b").textContent + " " + e.querySelector(".pv b").textContent))).join(" | "));
  await ctx.close();
}

// 5 · Bloque B (1 nov): contador «Pregunta X de N», aviso de que se puede volver y confirmación al responder
{
  console.log("Bloque B · flujo del test");
  const AVISO = "Puedes cerrar y volver cuando quieras: tus respuestas se guardan en este navegador.";
  for (const [mode, n] of [["rapida", 15], ["expres", 24], ["media", 48], ["completa", 107]]) {
    const { ctx, page } = await newPage({ w: 1280, h: 800, tag: `b-${mode}` });
    await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
    await startHome(page, mode); await page.waitForSelector("#v-quiz:not([hidden])");
    ok((await page.textContent("#q-count")) === `Pregunta 1 de ${n}`, `versión ${mode}: el contador dice «Pregunta 1 de ${n}»`);
    await ctx.close();
  }
  for (const [w, h] of [[320, 568], [375, 667], [390, 844], [414, 896], [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080]]) {
    const { ctx, page } = await newPage({ w, h, tag: `b-${w}`, touch: w < 760 });
    await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
    await startHome(page, "rapida"); await page.waitForSelector("#v-quiz:not([hidden])");
    const r = await page.evaluate(() => { const n = document.querySelector(".q-save"), c = document.querySelector("#q-count"); const rn = n.getBoundingClientRect();
      return { text: n.textContent, fs: parseFloat(getComputedStyle(n).fontSize), vis: n.checkVisibility(), inBar: !!n.closest(".quiz-bar"), cnt: c.getBoundingClientRect().height < 40 && getComputedStyle(c).whiteSpace === "nowrap" }; });
    ok(r.text === AVISO && r.fs >= 16 && r.vis && r.inBar && r.cnt && !(await overflow(page)), `${w} px: aviso visible a 16 px en la barra del test, contador en una línea, sin scroll horizontal`);
    // Confirmación al elegir: aparece, no tapa nada que se pueda pulsar, no la lee el lector de pantalla y desaparece
    await page.evaluate(() => { const a = document.querySelector("#auto-adv"); if (a && a.checked) a.click(); });
    await page.click("#q-main .opt >> nth=1");
    const on = await page.evaluate(() => { const c = document.querySelector(".ans-ok"); return { on: c.classList.contains("on"), text: c.textContent.trim(), hidden: c.getAttribute("aria-hidden") === "true", pe: getComputedStyle(c).pointerEvents }; });
    await page.waitForTimeout(1500);
    const off = await page.evaluate(() => !document.querySelector(".ans-ok").classList.contains("on"));
    ok(on.on && on.text === "Respuesta guardada" && on.hidden && on.pe === "none" && off, `${w} px: al elegir aparece «✓ Respuesta guardada» 1,2 s, sin tapar toques y oculto al lector de pantalla`);
    // Sigue en la misma pregunta (avance automático desactivado) y el aviso sigue igual en la siguiente
    await page.click("#q-next"); await page.waitForTimeout(300);
    ok((await page.textContent("#q-count")) === "Pregunta 2 de 15" && (await page.textContent(".q-save")) === AVISO, `${w} px: en la pregunta siguiente el contador avanza y el aviso sigue en su sitio`);
    await ctx.close();
  }
  // Con el teclado también hay confirmación; al salir del test no queda visible
  const { ctx, page } = await newPage({ w: 1280, h: 800, tag: "b-teclado", rm: true });
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await startHome(page, "rapida"); await page.waitForSelector("#v-quiz:not([hidden])");
  await page.focus("#q-stmt"); await page.keyboard.press("3"); await page.waitForTimeout(150);
  ok(await page.evaluate(() => document.querySelector(".ans-ok").classList.contains("on") && getComputedStyle(document.querySelector(".ans-ok")).transitionDuration.split(",").every((d) => parseFloat(d) === 0)), "con el teclado también aparece, y sin animación con «reducir movimiento»");
  await page.click("#q-exit"); await page.waitForSelector("#v-home:not([hidden])");
  ok(await page.evaluate(() => !document.querySelector(".ans-ok").classList.contains("on")), "al salir del test la confirmación no se queda en pantalla");
  await ctx.close();
}

await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
