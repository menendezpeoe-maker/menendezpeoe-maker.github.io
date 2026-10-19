// Pruebas de la entrada en un toque (tanda T1): sin sexo ni edad, un solo titular con el botón
// «Empezar» a la vista, la provincia al final (recordando la última), la pregunta de ejemplo real
// y compatibilidad con estados guardados y enlaces compartidos antiguos.
// Uso: NODE_PATH=$(npm root -g) node qa/onboarding.mjs   (con el servidor local en :8765; BASE para otra URL)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) { fails.push(msg); console.log("  ✗", msg); } else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const browser = await chromium.launch();
const view = (page) => page.evaluate(() => ["home", "quiz", "prios", "results"].find((v) => !document.querySelector(`#v-${v}`).hidden));
const saved = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("papeleta29n.v2")));
async function open({ w = 390, h = 844, dark = false, st = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, colorScheme: dark ? "dark" : "light" });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  if (st) { await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st); await page.reload(); await page.waitForSelector("#start-btn:not([disabled])", { state: "attached" }); await page.waitForTimeout(300); }
  return { ctx, page };
}
async function answerAll(page) {
  const total = parseInt((await page.textContent("#q-count")).split("/")[1]);
  for (let i = 0; i < total; i++) {
    if ((await view(page)) !== "quiz") break;
    await page.keyboard.press(String(1 + (i % 5))); await page.waitForTimeout(430);
  }
  await page.waitForSelector("#v-prios:not([hidden])");
}

console.log("Portada: un solo mensaje y «Empezar» sin scroll");
for (const [w, h, dark] of [[390, 844, false], [390, 844, true], [1280, 800, false]]) {
  const { ctx, page } = await open({ w, h, dark });
  const tag = `${w}×${h}${dark ? " oscuro" : ""}`;
  ok((await page.locator("#v-home h1").count()) === 1 && /Lo que piensas, tema a tema/.test(await page.textContent("#v-home h1")), `un único titular «Lo que piensas, tema a tema» (${tag})`);
  ok(await page.locator(".banner #home-h").count() === 1 && /¿Con quién coincides el 29N\?/.test(await page.textContent(".banner")), `el titular va dentro del banner, con su pregunta (${tag})`);
  ok((await page.locator("#v-home .bn-h").count()) === 1, `sin titulares duplicados (${tag})`);
  const b = await page.locator("#start-btn").boundingBox();
  ok(b && b.y >= 0 && b.y + b.height <= h && await page.isVisible("#start-btn"), `«Empezar el test» visible sin scroll (${tag}: ${b && Math.round(b.y + b.height)} px)`);
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), `sin scroll horizontal (${tag})`);
  ok((await page.locator("input[name=sex], #f-age").count()) === 0 && !/sexo|edad/i.test(await page.innerText("#v-home")), `la portada no pide sexo ni edad (${tag})`);
  await ctx.close();
}

console.log("Empezar en un toque");
{
  const { ctx, page } = await open();
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  const s = await saved(page);
  ok(s && s.stage === "quiz" && s.mode === "expres" && !("sex" in s) && !("age" in s) && !s.prov, "un toque empieza la exprés sin pedir datos (ni sexo, edad o provincia)");
  ok(/\/ 24/.test(await page.textContent("#q-count")), "la exprés tiene 24 preguntas");
  await ctx.close();
}
{
  const { ctx, page } = await open();
  await page.check("#f-mode-media", { force: true });
  ok(/Versión media: 48 preguntas/.test(await page.textContent("#start-note")), "la nota del botón sigue a la versión elegida");
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  ok(/\/ 48/.test(await page.textContent("#q-count")), "el botón de la portada respeta la versión elegida");
  await ctx.close();
}

console.log("La pregunta de ejemplo es real");
{
  const { ctx, page } = await open();
  ok((await page.locator(".ex-scale button").count()) === 5, "la pregunta de ejemplo tiene 5 botones");
  await page.click('.ex-scale [data-ex="2"]'); await page.waitForSelector("#v-quiz:not([hidden])");
  const s = await saved(page);
  ok(s.ans.C01 === 2 && s.order[0] === "C01" && s.idx === 1, "responderla guarda la respuesta y empieza el test en la siguiente");
  ok((await page.textContent("#q-count")).startsWith("02") && s.order.length === 24, "el test sigue en la pregunta 2 de 24");
  await page.click("#q-prev");
  ok(await page.isChecked('#q-main input[value="2"]'), "al volver atrás se ve la respuesta de la portada");
  // Con un test a medias, la respuesta se añade a ese test en lugar de borrarlo
  await page.click("#q-exit"); await page.waitForSelector("#v-home:not([hidden])");
  const before = await saved(page);
  await page.click('.ex-scale [data-ex="5"]'); await page.waitForSelector("#v-quiz:not([hidden])");
  const after = await saved(page);
  ok(after.seed === before.seed && after.ans.C01 === 5, "con un test a medias, cambia esa respuesta sin empezar otro");
  await ctx.close();
}

console.log("La provincia se pide al final y se recuerda");
{
  const { ctx, page } = await open();
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  await answerAll(page);
  ok((await page.inputValue("#f-prov")) === "" && await page.isVisible("#f-prov"), "el último paso pide la provincia");
  await page.click("#prio-skip");
  ok((await view(page)) === "prios" && /provincia/.test(await page.textContent("#prov-err")), "sin provincia no se muestran resultados");
  ok(await page.evaluate(() => document.activeElement.id === "f-prov"), "el foco va al selector de provincia");
  await page.selectOption("#f-prov", "valencia");
  ok((await page.locator("#prov-chips .chip").count()) > 3 && (await page.textContent("#prov-err")) === "", "al elegirla se ven sus candidaturas y desaparece el aviso");
  await page.click("#prio-skip"); await page.waitForSelector("#v-results:not([hidden])");
  ok(/Valencia/.test(await page.innerText("#v-results")), "los resultados usan la provincia elegida");
  ok(!/años|Mujer|Hombre/.test(await page.textContent("#v-results .who")), "el resumen no muestra sexo ni edad");
  // Repetir: la provincia se recuerda
  page.once("dialog", (d) => d.accept());
  await page.click('[data-act="new"]'); await page.waitForSelector("#v-home:not([hidden])");
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])");
  await answerAll(page);
  ok((await page.inputValue("#f-prov")) === "valencia", "en el siguiente test recuerda la última provincia elegida");
  await page.click("#prio-skip"); await page.waitForSelector("#v-results:not([hidden])");
  ok(true, "con la provincia recordada se llega a los resultados en un toque");
  await ctx.close();
}

console.log("Estados guardados antiguos");
{
  const old = { v: 2, bank: bank.version, prov: "madrid", sex: "Mujer", age: 40, mode: "completa", seed: 7, order: all, idx: 0, ans: Object.fromEntries(all.map((id, i) => [id, 1 + (i % 5)])), imp: {}, prios: [], stage: "done", t: 1 };
  const { ctx, page } = await open({ st: old, w: 1100, h: 900 });
  await page.waitForSelector("#v-results:not([hidden])");
  ok((await page.locator("#r-parties .rank li").count()) > 0 && /Madrid/.test(await page.innerText("#v-results")), "un resultado guardado con sexo y edad sigue cargando");
  ok(!/años|Mujer/.test(await page.textContent("#v-results .who")), "y ya no muestra sexo ni edad");
  await page.click('[data-act="new"]').catch(() => {});
  await ctx.close();
}
{
  const half = { v: 2, bank: bank.version, prov: "sevilla", sex: "Hombre", age: 33, mode: "expres", seed: 9, order: all.slice(0, 24), idx: 3, ans: { [all[0]]: 4, [all[1]]: 2, [all[2]]: 5 }, imp: {}, prios: [], stage: "quiz", t: 1 };
  const { ctx, page } = await open({ st: half });
  ok(/a medias/.test(await page.textContent("#resume")), "un test a medias antiguo ofrece continuar");
  await page.click('#resume [data-act="resume"]'); await page.waitForSelector("#v-quiz:not([hidden])");
  ok((await page.textContent("#q-count")).startsWith("04"), "y continúa donde estaba");
  await answerAll(page);
  ok((await page.inputValue("#f-prov")) === "sevilla", "la provincia que ya tenía aparece elegida al final");
  const s = await saved(page);
  ok(!("sex" in s) && !("age" in s), "al guardarlo de nuevo ya no conserva sexo ni edad");
  await ctx.close();
}
{
  const noProv = { v: 2, bank: bank.version, mode: "completa", seed: 7, order: all, idx: 0, ans: Object.fromEntries(all.map((id) => [id, 4])), imp: {}, prios: [], stage: "done", t: 1 };
  const { ctx, page } = await open({ st: noProv });
  ok((await view(page)) === "home" && /a medias/.test(await page.textContent("#resume")), "un resultado sin provincia no se muestra: ofrece continuar");
  await page.click('#resume [data-act="resume"]'); await page.waitForSelector("#v-prios:not([hidden])");
  ok(await page.isVisible("#f-prov"), "y continuar lleva al último paso, que pide la provincia");
  await ctx.close();
}

console.log("Enlaces compartidos antiguos (#r2…)");
{
  const token = "r2" + "00" + "c" + "000" + all.map((_, i) => String(1 + (i % 5))).join("");
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(BASE + "#" + token); await page.waitForSelector(".shared-banner");
  ok((await page.locator("#r-parties .rank li").count()) > 0 && /Estás viendo un resultado compartido/.test(await page.textContent(".shared-banner")), "un enlace #r2… antiguo muestra el resultado compartido");
  ok(!/sexo|edad/i.test(await page.textContent(".shared-banner")), "el aviso del resultado compartido ya no menciona sexo ni edad");
  await ctx.close();
}

console.log("Privacidad");
{
  const { ctx, page } = await open({ w: 1100, h: 900 });
  await page.click('.head-nav [data-go="method"]'); await page.waitForSelector("#m-priv");
  const t = await page.textContent("#m-priv");
  ok(/no pide ningún dato personal aparte de la provincia/.test(t) && !/sexo|edad/i.test(t), "el aviso de privacidad ya no habla de sexo ni edad y dice que solo se pide la provincia");
  await ctx.close();
}

await browser.close();
const real = errors.filter((e) => !/favicon|goatcounter/i.test(e));
if (real.length) console.log("Errores de consola:\n" + real.join("\n"));
if (fails.length || real.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
