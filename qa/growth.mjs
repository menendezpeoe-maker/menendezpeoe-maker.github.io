// Pruebas de difusión: «¿Cuánto coincidís?» con otra persona y páginas estáticas (partidos, temas, prensa).
// Uso: NODE_PATH=$(npm root -g) node qa/growth.mjs   (BASE: test; SITE: dist servido, por defecto :8766)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const SITE = (process.env.SITE || "http://127.0.0.1:8766/").replace(/\/?$/, "/");
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const errors = [], fails = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); else console.log("  ✓", msg); };
const all = bank.questions.map((q) => q.id);
const state = (ans, o = {}) => ({ v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: all, idx: 0, ans, imp: {}, prios: [], stage: "done", t: 1, ...o });
const asParty = (pid) => Object.fromEntries(bank.questions.map((q) => [q.id, q.pos[pid] || 3]));
const LIK = ["Totalmente en desacuerdo", "En desacuerdo", "Ni de acuerdo ni en desacuerdo", "De acuerdo", "Totalmente de acuerdo"];
const DIL = ["Claramente A", "Más bien A", "Las dos por igual", "Más bien B", "Claramente B"];
const browser = await chromium.launch();
const newPage = async (w = 1100) => { const ctx = await browser.newContext({ viewport: { width: w, height: 900 } }); const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(String(e))); page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); }); return { ctx, page }; };

console.log("¿Cuánto coincidís? (comparar con otra persona)");
{
  // La otra persona responde como el PP; tú, como el PSOE
  const { ctx, page } = await newPage();
  await ctx.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), state(asParty("pp")));
  await page.reload(); await page.waitForSelector("#r-share");
  ok(await page.isHidden("#r-friend"), "sin resultado compartido, no aparece la comparación");
  await page.click("#r-share details summary"); await page.click("#sh-full"); await page.waitForTimeout(200);
  const link = (await page.evaluate(() => navigator.clipboard.readText())).match(/#r2[0-9a-z]+/)[0];
  // Otra persona (otro navegador) sin test propio abre el enlace
  const { ctx: c2, page: p2 } = await newPage();
  await p2.goto(BASE + link); await p2.waitForSelector("#r-pols");
  ok(await p2.isHidden("#r-friend") && /Haz tu propio test y descubre cuánto coincidís/.test(await p2.innerText(".shared-banner")), "quien no ha hecho el test ve la invitación a compararse");
  await c2.close();
  // Tú, con tu test hecho (como el PSOE), abres el enlace
  await page.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), state(asParty("psoe")));
  await page.reload(); await page.waitForSelector("#r-pols");
  await page.goto(BASE + link); await page.waitForSelector("#r-friend:not([hidden])");
  const A = asParty("psoe"), B = asParty("pp");
  const expect = Math.round(all.reduce((x, id) => x + 1 - Math.abs(A[id] - B[id]) / 4, 0) / all.length * 100);
  const shown = parseInt(await page.textContent("#r-friend .tm-pct"));
  ok(shown === expect, `el porcentaje entre las dos personas coincide con el cálculo independiente (${shown} %)`);
  ok((await page.locator("#r-friend .cmp li:not(.empty)").count()) >= 2 && /Tu mayor coincidencia es PSOE[\s\S]*Partido Popular/.test(await page.innerText("#r-friend")), "muestra acuerdos, choques y la candidatura de cada uno");
  // Después, en tus propios resultados, la comparación sigue disponible y se puede olvidar
  await page.click(".shared-banner [data-act='own-test']"); await page.waitForSelector("#v-home:not([hidden])");
  await page.goto(BASE); await page.waitForSelector("#r-friend:not([hidden])");
  ok(/quien te compartió su resultado/i.test(await page.textContent("#r-friend")), "en tus resultados puedes seguir comparándote con quien te lo compartió");
  await page.click("[data-act='forget-friend']");
  ok(await page.isHidden("#r-friend"), "«Olvidar este resultado compartido» lo quita");
  await page.reload(); await page.waitForSelector("#r-pols");
  ok(await page.isHidden("#r-friend"), "y no vuelve a aparecer");
  await ctx.close();
}

console.log("Páginas por candidatura y por tema");
{
  const { ctx, page } = await newPage();
  const sitemap = await (await fetch(SITE + "sitemap.xml")).text();
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(locs.length === 1 + pd.parties.length + bank.areas.length + 3, `el sitemap incluye la portada y las ${locs.length - 1} páginas nuevas`);
  const paths = locs.map((u) => new URL(u).pathname);
  let bad = [], estOk = true, srcOk = true, canon = true;
  for (const pid of pd.order) {
    const r = await fetch(`${SITE}partidos/${pid}/`); if (r.status !== 200) { bad.push(pid); continue; }
    const html = await r.text();
    if (!html.includes(`<link rel="canonical" href="https://test29n.es/partidos/${pid}/">`)) canon = false;
    // Cada postura de la página coincide con los datos del test
    for (const q of bank.questions) {
      const v = q.pos[pid];
      const want = v ? `${(q.type === "dilema" ? (v === 3 ? DIL[2] : `${DIL[v - 1]}: ${v < 3 ? q.A : q.B}`) : LIK[v - 1])} · ${q.est.includes(pid) ? "estimada" : "documentada"}` : "Sin postura conocida";
      const esc = want.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const block = html.split(`<span class="q-code">${bank.areas.find((a) => a.id === q.area).letter}·${q.id.slice(1)}</span>`)[1]?.split("</li>")[0] || "";
      if (!block.includes(esc)) { estOk = false; bad.push(`${pid}/${q.id}`); break; }
      if (q.src?.[pid] && !block.includes(q.src[pid][0].replace(/&/g, "&amp;"))) srcOk = false;
    }
  }
  ok(!bad.length && estOk, `las ${pd.order.length} páginas de partido muestran cada postura tal como está en los datos, con «estimada» o «documentada»${bad.length ? ": " + bad.slice(0, 5).join(", ") : ""}`);
  ok(srcOk, "y enlazan todas sus fuentes");
  ok(canon, "cada página tiene su dirección canónica");
  for (const [w, path] of [[390, "partidos/vox/"], [390, "temas/justicia-seguridad-y-libertades/"], [1280, "prensa/"], [390, "partidos/"], [390, "temas/"]]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(SITE + path); await page.waitForSelector("main h1");
    ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)) && (await page.locator('a.btn[href="/"]').count()) >= 1, `${path} a ${w} px: sin scroll horizontal y con botón al test`);
  }
  await page.goto(SITE + "temas/vivienda-y-urbanismo/");
  const chips = await page.locator("#B01 .pos5 a.chip").count();
  ok(chips === pd.order.filter((pid) => !pd.parties.find((p) => p.id === pid).out && bank.questions.find((q) => q.id === "B01").pos[pid]).length, "cada tema sitúa a todas las candidaturas con postura y enlaza su página");
  await page.click("#B01 .pos5 a.chip >> nth=0"); await page.waitForSelector("main h1");
  ok(/partidos\/[a-z0-9]+\/$/.test(page.url()), "tocar un partido lleva a su página");
  await page.goto(SITE + "prensa/");
  const t = await page.innerText("main");
  ok(t.includes('<a href="https://test29n.es/"') && t.includes("boton-test29n.png") && (await (await fetch(SITE + "boton-test29n.png")).status) === 200, "prensa: código para enlazar el test y botón descargable");
  const priv = (process.env.PRIVATE_TERMS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);
  ok(!priv.some((x) => t.toLowerCase().includes(x)) && t.includes("menendezpeoe@gmail.com"), `prensa: contacto público, sin datos privados${priv.length ? "" : " (sin PRIVATE_TERMS: solo se comprueba el contacto)"}`);
  await page.goto(SITE); await page.waitForSelector("#start-btn:not([disabled])");
  ok((await page.locator('footer a[href="partidos/"]').count()) === 1 && (await page.locator('footer a[href="prensa/"]').count()) === 1, "el pie del test enlaza las páginas nuevas (para que Google las encuentre)");
  await ctx.close();
}

await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `\nFALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "\nTODO OK");
process.exit(fails.length || errors.length ? 1 : 0);
