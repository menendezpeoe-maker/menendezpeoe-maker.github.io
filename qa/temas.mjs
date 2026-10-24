// Tanda T10: tests por tema (6 o 7 preguntas), con su página, su resultado, su tarjeta y el paso al test completo.
// Uso: NODE_PATH=$(npm root -g) node qa/temas.mjs
//   App en :8765 (_local.html) y páginas en :8766 (dist/); BASE=https://test29n.es/ para la web real.
import { createRequire } from "module";
import fs from "fs";
import { TOPICS } from "../src/temas.src.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const REAL = /^https:/.test(process.env.BASE || "");
const APP = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const SITE = (process.env.SITE || (REAL ? process.env.BASE : "http://127.0.0.1:8766/")).replace(/\/?$/, "/");
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const Q = Object.fromEntries(bank.questions.map((q) => [q.id, q]));
const fails = [], errors = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const get = async (p) => { const r = await fetch(SITE + p); return { status: r.status, text: await r.text() }; };
const appUrl = (qs) => APP.replace(/[?#].*$/, "") + qs;

console.log("Datos");
const js = fs.readFileSync(new URL("../assets/papeleta.js", import.meta.url), "utf8");
const inApp = JSON.parse(/const TOPICS = (\{.*\});/.exec(js)[1]);
ok(JSON.stringify(inApp) === JSON.stringify(TOPICS), "la lista de temas de la app es la misma que la de src/temas.src.mjs");
const entries = Object.entries(TOPICS);
ok(entries.length === 6 && entries.every(([, t]) => t.ids.length >= 6 && t.ids.length <= 8 && t.ids.every((id) => Q[id])), "6 temas de 6 a 8 preguntas, todas existentes en el banco");
ok(new Set(entries.map(([, t]) => t.code)).size === 6 && entries.every(([, t]) => !"remc".includes(t.code)), "cada tema tiene un código propio para compartir");

console.log("Páginas /tests/");
const idx = await get("tests/");
ok(idx.status === 200 && entries.every(([k]) => idx.text.includes(`href="/tests/${k}/"`)) && (idx.text.match(/<h1[\s>]/g) || []).length === 1, "el índice enlaza los 6 tests");
let bad = [];
for (const [k, t] of entries) {
  const r = await get(`tests/${k}/`);
  const allQ = t.ids.every((id) => r.text.includes(`href="/preguntas/${id.toLowerCase()}/"`));
  if (r.status !== 200 || !allQ || !r.text.includes(`href="/?tema=${k}"`) || (r.text.match(/<h1[\s>]/g) || []).length !== 1 || !/no es una recomendación de voto/.test(r.text)) bad.push(k);
}
ok(!bad.length, `cada página lista sus preguntas, enlaza el test y aclara que no es una recomendación${bad.length ? `: fallan ${bad.join(", ")}` : ""}`);
const sm = await get("sitemap.xml"), home = await get("");
ok(entries.every(([k]) => sm.text.includes(`tests/${k}/</loc>`)) && /href="tests\/"/.test(home.text), "están en el sitemap y en el pie de la portada");

const browser = await chromium.launch();
const open = async () => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await ctx.newPage(); page.on("pageerror", (e) => errors.push(String(e)));
  page.on("dialog", (d) => d.accept());
  return { ctx, page };
};
const state = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("papeleta29n.v2")));
const answerAll = async (page, n) => { for (let i = 0; i < n; i++) { await page.keyboard.press(String(1 + (i % 5))); await page.waitForTimeout(430); } };

console.log("Test por tema desde la portada");
{
  const { ctx, page } = await open();
  await page.goto(APP); await page.waitForSelector("#start-btn:not([disabled])");
  ok((await page.locator("#topic-list [data-tema]").count()) === 6, "la portada muestra los 6 tests por tema");
  await page.click('#topic-list [data-tema="vivienda"]'); await page.waitForSelector("#v-quiz:not([hidden])");
  const st = await state(page);
  ok(st.mode === "tema" && st.topic === "vivienda" && JSON.stringify(st.order) === JSON.stringify(TOPICS.vivienda.ids), `empieza con las ${TOPICS.vivienda.ids.length} preguntas de vivienda`);
  await answerAll(page, st.order.length);
  await page.waitForSelector("#v-prios:not([hidden])");
  ok(await page.isVisible("#f-prov") && !(await page.isVisible("#prio-grid")), "el último paso solo pide la provincia (sin elegir áreas prioritarias)");
  await page.selectOption("#f-prov", "madrid");
  ok(!(await page.isVisible("#prio-skip")), "y un solo botón para ver el resultado");
  await page.click("#prio-go");
  await page.waitForSelector("#v-results:not([hidden])");
  ok(/Test de vivienda/.test(await page.textContent("#r-summary .ballot-top")), "el resultado indica que es el test de vivienda");
  ok(/versión exprés/.test(await page.textContent('[data-act="more"]')), "«Afinar» propone seguir con la versión exprés");
  const ans1 = (await state(page)).ans;
  await page.click('[data-act="more"]'); await page.waitForSelector("#v-quiz:not([hidden])");
  const st2 = await state(page);
  ok(st2.mode === "expres" && Object.keys(ans1).every((id) => st2.ans[id] === ans1[id]) && st2.ans[st2.order[st2.idx]] === undefined, "pasa a la exprés conservando las respuestas y empieza por una sin responder");
  await ctx.close();
}

console.log("Enlace ?tema= desde las páginas");
{
  const { ctx, page } = await open();
  await page.goto(appUrl("?tema=sanidad")); await page.waitForSelector("#v-quiz:not([hidden])");
  const st = await state(page);
  ok(st.topic === "sanidad" && st.order.length === TOPICS.sanidad.ids.length, "sin test guardado, ?tema=sanidad empieza directamente");
  ok(!/tema=/.test(page.url()), "la dirección se limpia para no repetir el test al recargar");
  // Con un test guardado no se sustituye sin preguntar
  await page.evaluate(() => { const s = JSON.parse(localStorage.getItem("papeleta29n.v2")); s.ans = { B01: 4 }; localStorage.setItem("papeleta29n.v2", JSON.stringify(s)); });
  await page.goto(appUrl("?tema=energia")); await page.waitForSelector("#v-home:not([hidden])");
  ok((await state(page)).topic === "sanidad" && await page.evaluate(() => document.activeElement?.dataset?.tema === "energia"), "con un test guardado muestra la portada con el tema señalado, sin borrar nada");
  await ctx.close();
}

console.log("Compartir");
{
  const { ctx, page } = await open();
  await page.goto(APP); await page.waitForSelector("#start-btn:not([disabled])");
  const ans = Object.fromEntries(TOPICS.inmigracion.ids.map((id, i) => [id, 1 + (i % 5)]));
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), { v: 2, bank: bank.version, prov: "sevilla", mode: "tema", topic: "inmigracion", seed: 1, order: TOPICS.inmigracion.ids, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 });
  await page.reload(); await page.waitForSelector("#v-results:not([hidden])");
  await page.waitForSelector("#r-share .sbtn", { state: "attached" });
  const txt = await page.inputValue("#sh-text");
  ok(/test de inmigración/.test(txt) && /\?tema=inmigracion/.test(txt) && !/Mi perfil/.test(txt), "el mensaje para compartir nombra el tema y enlaza a ese test");
  await page.$eval("#sh-full", (b) => b.click()); await page.waitForTimeout(200);
  const link = await page.evaluate(() => navigator.clipboard.readText());
  const code = /#(r2[0-9a-z]+)$/.exec(link)?.[1] || "";
  ok(code.slice(4, 5) === TOPICS.inmigracion.code, "el enlace con las respuestas lleva el código del tema");
  const p2 = await ctx.newPage(); p2.on("pageerror", (e) => errors.push(String(e)));
  await p2.goto(appUrl("#" + code)); await p2.waitForSelector("#v-results:not([hidden])");
  ok(/Resultado compartido · Test de inmigración/.test(await p2.textContent("#r-summary .ballot-top")) && /Sevilla/.test(await p2.textContent("#r-summary .ballot-top")), "al abrirlo se reconoce el tema y la provincia");
  await ctx.close();
}

await browser.close();
if (errors.length) console.log("Errores:\n" + errors.join("\n"));
if (fails.length || errors.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
