// Pruebas de «¿Te ha resultado útil el test?» (PayPal, Apple Pay, banco) y del aviso legal.
// Uso: NODE_PATH=$(npm root -g) node qa/support.mjs   (BASE para otra URL)
// PayPal se prueba con el enlace real. Apple Pay y banco se prueban sustituyendo su configuración solo
// en esta prueba, con enlaces ficticios de Stripe que se interceptan y nunca salen a internet.
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const OUT = new URL("./shots/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const PAYPAL = "https://www.paypal.com/donate?hosted_button_id=R2X5MXLRUM7U4";
const APPLE = "https://buy.stripe.com/7sYaEYcq8bwS6lL1Kiew800";
const FAKE_BANK = "https://buy.stripe.com/prueba_banco";
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const ans = Object.fromEntries(bank.questions.map((q) => [q.id, q.pos.psoe || 3]));
const st = { v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: bank.questions.map((q) => q.id), idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1 };

const browser = await chromium.launch();
async function open({ w = 1100, cfg = null, apple = false, tag = "" } = {}) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  if (apple) await ctx.addInitScript(() => { window.ApplePaySession = { canMakePayments: () => true }; });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${tag}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${tag}] ${e}`));
  if (cfg) await ctx.route("**/papeleta.js*", async (route) => {
    const r = await route.fetch();
    let body = await r.text();
    for (const [k, v] of Object.entries(cfg)) body = body.replace(new RegExp(`(\\b${k}: )"[^"]*"`), `$1${JSON.stringify(v)}`);
    await route.fulfill({ response: r, body });
  });
  await ctx.route("https://buy.stripe.com/**", (route) => route.fulfill({ status: 200, contentType: "text/html", body: "<title>Stripe (simulado)</title>" }));
  await page.goto(BASE);
  await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st);
  await page.reload();
  await page.waitForSelector("#v-results:not([hidden])");
  return { ctx, page };
}
const ranking = (page) => page.$$eval("#r-parties .rank li", (els) => els.map((e) => e.innerText).join("|"));
const buttons = (page) => page.$$eval("#r-support a.btn", (as) => as.map((a) => ({ t: a.firstChild.textContent, href: a.getAttribute("href"), target: a.target, rel: a.rel })));

console.log("Configuración publicada · navegador sin Apple Pay");
let base;
{
  const { ctx, page } = await open({ tag: "paypal" });
  const sec = page.locator("#r-support");
  ok(await sec.isVisible(), "sección visible");
  ok((await sec.locator("h2").textContent()) === "¿Te ha resultado útil el test?", "título");
  ok((await sec.innerText()).includes("puedes apoyarlo con una aportación voluntaria."), "texto de la sección");
  const b = await buttons(page);
  ok(b.length === 1 && b[0].t === "Donar con PayPal" && b[0].href === PAYPAL, "solo «Donar con PayPal», con el enlace exacto");
  ok(b[0].target === "_blank" && /noopener/.test(b[0].rel) && /noreferrer/.test(b[0].rel), "pestaña nueva sin referencia a la página");
  ok(!/Apple Pay|tu banco|activad|configur/i.test(await sec.innerText()), "no muestra opciones pendientes ni avisos técnicos");
  const order = await page.$$eval("#v-results section[id]", (s) => s.map((x) => x.id));
  ok(order.indexOf("r-support") === order.indexOf("r-pols") + 1, "va después de todos los resultados");
  base = await ranking(page);
  // PayPal real
  const [popup] = await Promise.all([page.waitForEvent("popup"), sec.locator("a.btn").click()]);
  await popup.waitForLoadState("domcontentloaded").catch(() => {});
  await popup.waitForURL(/paypal\.com\/donate\?hosted_button_id=R2X5MXLRUM7U4/, { timeout: 30000 }).catch(() => {});
  await popup.waitForTimeout(4000);
  const title = await popup.title().catch(() => "");
  ok(/paypal\.com\/donate\?hosted_button_id=R2X5MXLRUM7U4/.test(popup.url()) && /EleccionesTest/.test(await popup.innerText("body").catch(() => "")), `PayPal real abre tu donación (${popup.url()})`);
  const ppHtml = (await popup.content().catch(() => "")).toLowerCase();
  if ((process.env.PRIVATE_TERMS || "").trim()) ok(!(process.env.PRIVATE_TERMS).split(",").some((t) => t.trim() && ppHtml.includes(t.trim().toLowerCase())), "la página de PayPal no muestra datos privados");
  ok(await popup.evaluate(() => document.referrer === "" && window.opener === null).catch(() => false), "PayPal no recibe la página de origen");
  await popup.close();
  // Aviso legal
  await page.click("footer [data-anchor='m-priv']");
  await page.waitForSelector("#v-method:not([hidden])");
  const m = await page.innerText("#m-priv");
  ok(m.includes("PayPal") && m.includes("Stripe") && m.includes("no recibe ni guarda datos de pago"), "aviso legal con las plataformas configuradas");
  ok(!(await page.innerText("#v-method")).includes("Versión y cambios"), "sin «Versión y cambios»");
  ok(m.includes("Stripe (Apple Pay)") && !m.includes("Bizum"), "solo nombra los métodos activos");
  ok(m.includes("Responsable: Dery · Contacto: menendezpeoe@gmail.com"), "responsable y contacto públicos");
  const all = await page.content() + await page.evaluate(async () => (await (await fetch(document.querySelector("script[src*='papeleta.js']").src)).text()));
  // Los datos privados que no deben aparecer se pasan fuera del repositorio: PRIVATE_TERMS="término1,término2"
  const priv = (process.env.PRIVATE_TERMS || "").split(",").map((t) => t.trim().toLowerCase()).filter(Boolean);
  if (priv.length) ok(!priv.some((t) => all.toLowerCase().includes(t)), "ningún dato privado aparece en la página ni en el código");
  const html = await page.content();
  ok(!/\b[A-Z]{2}\d{2}(?:[ -]?[A-Z0-9]{4}){3,7}\b/.test(html), "ningún IBAN en la página");
  await ctx.close();
}

console.log("Configuración publicada · dispositivo con Apple Pay");
{
  const { ctx, page } = await open({ apple: true, tag: "apple-real" });
  const b = await buttons(page);
  ok(JSON.stringify(b.map((x) => [x.t, x.href])) === JSON.stringify([["Donar con PayPal", PAYPAL], ["Donar con Apple Pay", APPLE]]), "PayPal y Apple Pay con sus enlaces reales; banco oculto hasta configurarlo");
  ok(!/tu banco/.test(await page.innerText("#r-support")), "no muestra la opción de banco pendiente");
  await ctx.close();
}

console.log("Con banco configurado (solo en la prueba)");
for (const [w, apple] of [[390, true], [1280, true], [1280, false]]) {
  const tag = `${w}px ${apple ? "Apple" : "sin Apple Pay"}`;
  const { ctx, page } = await open({ w, apple, cfg: { bank: FAKE_BANK }, tag });
  const b = await buttons(page);
  const want = apple ? ["Donar con PayPal", "Donar con Apple Pay", "Donar mediante tu banco"] : ["Donar con PayPal", "Donar mediante tu banco"];
  ok(JSON.stringify(b.map((x) => x.t)) === JSON.stringify(want), `${tag}: opciones ${want.join(", ")}`);
  ok(b.every((x) => [PAYPAL, APPLE, FAKE_BANK].includes(x.href) && x.target === "_blank" && /noreferrer/.test(x.rel)), `${tag}: enlaces exactos, sin parámetros ni respuestas`);
  ok((await ranking(page)) === base, `${tag}: los resultados no cambian`);
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), `${tag}: sin scroll horizontal`);
  const bankBtn = page.locator("#r-support a.btn", { hasText: "Donar mediante tu banco" });
  await bankBtn.scrollIntoViewIfNeeded();
  if (apple) await (await page.$("#r-support")).screenshot({ path: `${OUT}support3-${w}.png` });
  const [popup] = await Promise.all([page.waitForEvent("popup"), bankBtn.click()]);
  await popup.waitForLoadState();
  ok(popup.url() === FAKE_BANK && await popup.evaluate(() => document.referrer === "" && window.opener === null), `${tag}: el banco abre Stripe sin datos de la página`);
  ok(await page.isVisible("#r-support") && !(await page.innerText("#v-results")).match(/gracias por tu (aportación|donación)|pago completado/i), `${tag}: la web no da ningún pago por hecho`);
  if (w === 1280 && apple) {
    await page.click("footer [data-anchor='m-priv']");
    ok((await page.innerText("#m-priv")).includes("Stripe (Apple Pay y Bizum)"), "aviso legal menciona Bizum solo cuando está configurado");
  }
  await ctx.close();
}

console.log("Sin ninguna opción configurada");
{
  const { ctx, page } = await open({ cfg: { paypal: "", applePay: "" }, apple: true, tag: "none" });
  ok(await page.isHidden("#r-support"), "la sección no aparece");
  ok((await ranking(page)) === base, "los resultados no cambian");
  await ctx.close();
}

await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
