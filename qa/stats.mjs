// Pruebas del contador de visitas (GoatCounter). La web se sirve bajo su dirección pública real pero desde la
// copia local (dist/), y las peticiones al contador se interceptan: no sale ninguna visita real.
// Uso: NODE_PATH=$(npm root -g) node qa/stats.mjs   (LOCAL: servidor de dist/, por defecto :8766)
// STATS_CODE: código real ya publicado (comprueba también la CSP); si no, se simula «prueba».
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const LOCAL = process.env.LOCAL || "http://127.0.0.1:8766";
const PUBLIC = "https://test29n.es";
const CODE = process.env.STATS_CODE || "prueba";
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const done = { v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans: Object.fromEntries(all.map((id, i) => [id, [1, 2, 4, 5, 3][i % 5]])), imp: {}, prios: [], stage: "done", t: 1 };
import { withFullAnalysis } from "./_full.mjs";
const browser = withFullAnalysis(await chromium.launch());

async function open({ code = CODE, real = false } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1100, height: 900 }, bypassCSP: !real });
  await ctx.addInitScript(() => Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false }));
  const hits = [];
  // La web pública se sirve desde la copia local; el código del contador se sustituye solo en la prueba
  if (!real) await ctx.route(`${PUBLIC}/**`, async (route) => {
    const u = new URL(route.request().url());
    const r = await fetch(LOCAL + u.pathname + u.search);
    let body = Buffer.from(await r.arrayBuffer());
    if (u.pathname.endsWith("papeleta.js")) body = Buffer.from(body.toString().replace(/goatcounter: "[^"]*"/, `goatcounter: ${JSON.stringify(code)}`));
    await route.fulfill({ status: r.status, headers: { "content-type": r.headers.get("content-type") || "text/html" }, body });
  });
  await ctx.route("https://*.goatcounter.com/**", (route) => { hits.push(new URL(route.request().url())); route.fulfill({ status: 200, contentType: "image/gif", body: Buffer.from("R0lGODlhAQABAAAAACw=", "base64") }); });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  return { ctx, page, hits };
}
const paths = (hits) => hits.map((u) => u.searchParams.get("p"));
const clean = (hits) => hits.every((u) => [...u.searchParams.keys()].every((k) => ["p", "t", "s", "rnd", "e", "r"].includes(k)) && !/r2[0-9a-z]{6}|madrid|Mujer|PSOE|%25/i.test(u.search));

console.log("Visitas y pasos del test");
{
  const { ctx, page, hits } = await open();
  await page.goto(PUBLIC + "/"); await page.waitForSelector("#start-btn:not([disabled])"); await page.waitForTimeout(400);
  ok(JSON.stringify(paths(hits)) === '["/"]' && hits[0].host === `${CODE}.goatcounter.com`, "abrir la web cuenta una visita al inicio");
  await page.check("input[name=mode][value=expres]", { force: true }).catch(() => {});
  await page.click("#start-btn"); await page.waitForSelector("#v-quiz:not([hidden])"); await page.waitForTimeout(300);
  ok(paths(hits).includes("test-empezado") && hits.find((u) => u.searchParams.get("p") === "test-empezado").searchParams.get("e") === "true", "empezar el test cuenta «test empezado»");
  const total = parseInt((await page.textContent("#q-count")).split("/")[1]);
  for (let i = 0; i < total; i++) { await page.keyboard.press(String(1 + (i % 5))); await page.waitForTimeout(350); }
  await page.waitForSelector("#v-prios:not([hidden])"); await page.selectOption("#f-prov", "madrid"); await page.click("#prio-skip"); await page.waitForSelector("#r-pols"); await page.waitForTimeout(300);
  ok(paths(hits).filter((p) => p === "test-terminado").length === 1, "terminarlo cuenta «test terminado» una vez");
  await page.reload(); await page.waitForSelector("#r-pols"); await page.waitForTimeout(300);
  ok(paths(hits).filter((p) => p === "test-terminado").length === 1, "volver a abrir los resultados no lo cuenta otra vez");
  ok(clean(hits), "nunca se envían respuestas, provincia, sexo, partido ni el enlace con respuestas");
  await page.click("#r-support a.btn").catch(() => {}); await page.waitForTimeout(300);
  ok(paths(hits).includes("donar-paypal"), "un clic en donar se cuenta, sin datos del test");
  await page.click(".head-nav [data-go='method']");
  ok(/GoatCounter/.test(await page.innerText("#m-priv")) && !/Sin cookies, analítica/.test(await page.innerText("#m-priv")), "el aviso de privacidad explica el contador");
  await ctx.close();
}
{
  const { ctx, page, hits } = await open();
  await page.goto(PUBLIC + "/"); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), done);
  await page.reload(); await page.waitForSelector("#r-share");
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.click("#r-share details summary"); await page.click("#sh-full"); await page.waitForTimeout(200);
  const link = (await page.evaluate(() => navigator.clipboard.readText())).match(/#r2[0-9a-z]+/)[0];
  const p2 = await ctx.newPage(); await p2.goto(PUBLIC + "/" + link); await p2.waitForSelector("#r-pols"); await p2.waitForTimeout(300);
  ok(paths(hits).includes("/compartido") && clean(hits), "abrir un resultado compartido se cuenta como «/compartido», sin su contenido");
  ok(paths(hits).filter((p) => p === "compartir").length === 1, "usar un botón de compartir cuenta «compartir» una vez");
  await page.click('#r-summary [data-act="challenge"]'); await page.waitForTimeout(200);
  ok(paths(hits).includes("reto"), "«Reta a un amigo» cuenta «reto»");
  ok(await p2.locator("#r-useful").count() === 0, "en un resultado compartido no se pregunta si ha sido útil");
  await page.click('#r-useful [data-useful="si"]'); await page.waitForTimeout(200);
  ok(paths(hits).includes("util-si") && /Gracias/.test(await page.textContent("#r-useful")) && clean(hits), "«¿Te ha resultado útil?» cuenta «util-si», da las gracias y no envía datos del test");
  await page.reload(); await page.waitForSelector("#r-share");
  ok(await page.locator("#r-useful").count() === 0, "una vez respondida, no se vuelve a preguntar");
  await ctx.close();
}

console.log("Sin código, no se cuenta nada");
{
  const { ctx, page, hits } = await open({ code: "" });
  await page.goto(PUBLIC + "/"); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), done);
  await page.reload(); await page.waitForSelector("#r-pols"); await page.waitForTimeout(300);
  ok(hits.length === 0 && /Sin cookies, analítica ni publicidad/.test(await page.evaluate(() => { document.querySelector("[data-go='method']").click(); return document.querySelector("#m-priv").innerText; })), "sin código: ninguna petición y el aviso dice «sin analítica»");
  await ctx.close();
}

if (process.env.STATS_CODE) {
  console.log("Web publicada");
  const { ctx, page, hits } = await open({ real: true });
  await page.goto(PUBLIC + "/"); await page.waitForSelector("#start-btn:not([disabled])"); await page.waitForTimeout(500);
  const csp = await page.getAttribute('meta[http-equiv="Content-Security-Policy"]', "content");
  ok(csp.includes(`img-src 'self' data: blob: https://${CODE}.goatcounter.com;`) && !/script-src[^;]*goatcounter/.test(csp), "la CSP solo permite la imagen del contador, ningún script externo");
  ok(JSON.stringify(paths(hits)) === '["/"]', "la web publicada cuenta la visita (interceptada, no llega al contador)");
  await ctx.close();
}

await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
