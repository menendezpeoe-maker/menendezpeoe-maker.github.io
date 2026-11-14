// Menú único y /programas/ (14 nov, acordado con el titular a partir de la tabla de Codex): mismas secciones en la portada
// y en las interiores, con «Comparar» y «Mi circunscripción» visibles en móvil; en /programas/, búsqueda por nombre o sigla,
// filtro por circunscripción, «Últimas incorporaciones», dos botones separados y el mismo contador que la portada.
// Uso: NODE_PATH=$(npm root -g) node qa/menu.mjs   (servidores :8765 y :8766; BASE para la web real)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8765/_local.html";
const SP = process.env.BASE ? process.env.BASE : "http://127.0.0.1:8766/";
const PROG = new URL("programas/", SP).href, PART = new URL("partidos/", SP).href;
const SHOTS = process.env.SHOTS;
const fails = [], errors = [];
const ok = (c, m) => { if (!c) fails.push(m); console.log(c ? "  ✓" : "  ✗", m); };
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url), "utf8"));
const live = pd.order.filter((pid) => !pd.parties.find((x) => x.id === pid)?.out);
const browser = await chromium.launch();
const navOf = (p) => p.evaluate(() => [...document.querySelectorAll(".head-nav .navlink")].filter((e) => e.offsetParent && getComputedStyle(e).display !== "none").map((e) => ({ t: e.innerText.trim(), h: Math.round(e.getBoundingClientRect().height), r: Math.round(e.getBoundingClientRect().right) })));
const overflow = (p) => p.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1);
for (const [w, h] of [[360, 780], [390, 844], [1280, 900]]) {
  console.log(`${w} × ${h}`);
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...(w < 500 ? { hasTouch: true, isMobile: true } : {}) });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => errors.push(`${w}: ${e}`));
  const want = w < 500 ? ["Test", "Partidos", "Programas", "Temas", "Debates", "Comparar", "Mi circunscripción", "Cómo funciona"] : ["Test", "Partidos", "Programas", "Temas", "Debates", "Comparar propuestas", "Mi circunscripción", "Cómo funciona"];
  await page.goto(BASE); await page.waitForSelector("#start-btn:not([disabled])");
  const a = await navOf(page);
  ok(want.every((t) => a.some((x) => x.t === t)) && a.every((x) => x.h >= 34 && x.r <= w), `portada: menú con ${a.map((x) => x.t).join(" · ")}`);
  const homeCount = (await (await page.request.get(SP)).text()).match(/<b>(\d+) de (\d+)<\/b> candidaturas lo han publicado/)?.slice(1, 3).join("/");  // portada publicada (dist o web real)
  const sb = await page.locator("#start-alt").boundingBox();
  if (w < 500) ok(sb && sb.y + sb.height <= h, `portada: «Elegir otra versión» sigue en la primera pantalla (${Math.round(sb.y + sb.height)} px)`);
  ok(!(await overflow(page)), "portada sin desplazamiento horizontal");
  await page.goto(PART);
  const b = await navOf(page);
  ok(want.every((t) => b.some((x) => x.t === t)) && b.every((x) => x.h >= 34 && x.r <= w), `interior: mismo menú (${b.map((x) => x.t).join(" · ")})`);
  ok(JSON.stringify(a.map((x) => x.t)) === JSON.stringify(b.map((x) => x.t)), "portada e interiores: mismas secciones en el mismo orden");
  // Sección actual marcada (aria-current, en amarillo como en la portada) y nada más resaltado (14 nov: «Test» salía en blanco)
  for (const [u, want] of [["comparar/", "Comparar"], ["partidos/pp/", "Partidos"], ["temas/vivienda-y-urbanismo/", "Temas"], ["tests/vivienda/", "Temas"], ["provincias/bizkaia/", "Mi circunscripción"], ["programas/", "Programas"], ["debates/", "Debates"], ["votar/", null]]) {
    await page.goto(new URL(u, SP).href);
    const hi = await page.evaluate(() => [...document.querySelectorAll(".head-nav .navlink")].filter((a) => a.getAttribute("aria-current") || !/rgba\(0, 0, 0, 0\)|transparent/.test(getComputedStyle(a).backgroundColor)).map((a) => [a.innerText.trim(), a.getAttribute("aria-current")]));
    ok(want ? hi.length === 1 && hi[0][1] === "page" && hi[0][0].startsWith(want.split(" ")[0]) : hi.length === 0, `/${u}: resaltado ${hi.length ? hi.map((x) => x[0]).join(", ") : "ninguno"}`);
  }
  await page.goto(PROG); await page.waitForSelector("#pg-tools:not([hidden])");
  ok(!(await overflow(page)), "/programas/ sin desplazamiento horizontal");
  const sum = await page.evaluate(() => document.getElementById("pg-sum").innerText.match(/(\d+) de (\d+)/).slice(1, 3).join("/"));
  ok(homeCount && sum === homeCount && sum.endsWith(`/${live.length}`), `contador igual que la portada (${sum} y ${homeCount})`);
  const nNew = await page.locator(".pg-new li").count();
  ok(nNew >= 1 && nNew <= 4 && await page.locator(".pg-new .btn", { hasText: "Abrir programa oficial" }).count() === nNew && await page.locator(".pg-new .btn", { hasText: "Ver posturas revisadas" }).count() === nNew, `«Últimas incorporaciones»: ${nNew} con los dos botones`);
  const nPubRows = +sum.split("/")[0];
  ok(await page.locator("#pg-all a.btn", { hasText: "Abrir programa oficial" }).count() === nPubRows && await page.locator("#pg-all a.btn", { hasText: "Ver posturas revisadas" }).count() === nPubRows, `cada programa publicado tiene «Abrir programa oficial» y «Ver posturas revisadas» (${nPubRows})`);
  const ext = await page.getAttribute("#pg-all a.btn:has-text('Abrir programa oficial') >> nth=0", "target"), rev = await page.getAttribute("#pg-all a.btn:has-text('Ver posturas revisadas') >> nth=0", "href");
  ok(ext === "_blank" && /^\/partidos\/[a-z0-9]+\/#h-pos$/.test(rev), `el programa se abre aparte y las posturas van a la ficha (${rev})`);
  const vis = () => page.evaluate(() => [...document.querySelectorAll("#pg-all > li")].filter((l) => !l.hidden && l.offsetParent).map((l) => l.querySelector("b").textContent));
  for (const [t, exp] of [["psc", "PSOE"], ["pnv", "EAJ-PNV"], ["bildu", "EH Bildu"], ["teruel existe", "Coalición Existe"], ["Comuns", "Frente Amplio"], ["pp", "Partido Popular"]]) {
    await page.fill("#pg-q", t); const v = await vis(); ok(v.includes(exp), `buscar «${t}» encuentra ${exp} (${v.length} filas)`);
  }
  await page.fill("#pg-q", "zzzz"); ok((await vis()).length === 0 && await page.isVisible("#pg-none"), "sin coincidencias: aviso visible");
  await page.click("#pg-clear"); ok((await vis()).length === live.length, `«Borrar filtros» vuelve a las ${live.length}`);
  await page.selectOption("#pg-prov", "bizkaia"); const vb = await vis();
  ok(vb.includes("EH Bildu") && vb.includes("EAJ-PNV") && !vb.includes("Esquerra Republicana") && !vb.includes("Se Acabó La Fiesta") && /^En Bizkaia: \d+ candidaturas, \d+ con programa publicado\.$/.test(await page.textContent("#pg-n")), `Bizkaia: ${vb.length} candidaturas («${await page.textContent("#pg-n")}»)`);
  await page.selectOption("#pg-prov", "soria"); const vs = await vis();
  ok(vs.includes("Soria ¡Ya!") && !vs.includes("Coalición Existe") && !vs.includes("EH Bildu"), `Soria: ${vs.length} candidaturas`);
  await page.selectOption("#pg-prov", "navarra"); const vn = await vis();
  ok(vn.includes("UPN – Partido Popular") && !vn.includes("Partido Popular") && vn.includes("Geroa Bai"), "Navarra: UPN-PP y no PP");
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/programas-${w}.png` });
  await page.goto(PROG + "?circ=madrid"); await page.waitForSelector("#pg-tools:not([hidden])");
  ok(await page.inputValue("#pg-prov") === "madrid" && (await vis()).includes("Democracia 21"), "?circ=madrid abre ya filtrado");
  await ctx.close();
}
await browser.close();
if (errors.length) console.log("Errores:", errors);
console.log(fails.length ? `${fails.length} FALLOS` : "Todo OK");
process.exit(fails.length || errors.length ? 1 : 0);
