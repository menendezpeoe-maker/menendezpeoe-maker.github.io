// Comprobaciones de la versión mejorada frente a la original (las dos copias locales, abiertas con file://).
// Uso: NODE_PATH=$(npm root -g) node version-mejorada/qa-iteracion.mjs [carpeta-capturas]
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const DIR = new URL("./", import.meta.url).pathname, SHOTS = process.argv[2] || "";
const ORIG = "file://" + DIR + "original.html", NEW = "file://" + DIR + "index.html";
const WIDTHS = [320, 375, 414, 640, 768, 1024, 1280, 1440, 1920];
let fails = 0; const ok = (c, m) => { console.log(`  ${c ? "✓" : "✗"} ${m}`); if (!c) fails++; };
const b = await chromium.launch();
const open = async (url, w, dark = false) => {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, colorScheme: dark ? "dark" : "light", reducedMotion: "reduce" });
  const errs = []; p.on("pageerror", (e) => errs.push(e.message));
  await p.goto(url); await p.waitForSelector("#start-btn:not([disabled])"); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
  return { p, errs };
};
// Todos los nodos de texto fuera de <script>/<style>, tal cual (sin normalizar espacios), y si se ven
const texts = (p) => p.evaluate(() => { const out = [], w = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { const el = n.parentElement; if (!el || el.closest("script,style,noscript")) continue; out.push([n.data, el.checkVisibility ? el.checkVisibility({ visibilityProperty: true, opacityProperty: false }) : true]); } return out; });
const attrsOf = (p) => p.evaluate(() => [...document.querySelectorAll("[alt],[title],[placeholder],[aria-label],[value]")].map((e) => ["alt", "title", "placeholder", "aria-label", "value"].map((a) => e.getAttribute(a)).join("|")));

console.log("P2 · textos idénticos nodo a nodo (móvil y escritorio, claro y oscuro, con el selector del banner abierto en móvil)");
for (const [w, dark] of [[375, false], [375, true], [1280, false], [1280, true]]) {
  const A = await open(ORIG, w, dark), B = await open(NEW, w, dark);
  if (w < 760) for (const x of [A, B]) { await x.p.click("#start-btn"); await x.p.waitForSelector("#bn-modes:not([hidden])"); }
  const ta = await texts(A.p), tb = await texts(B.p);
  const same = ta.length === tb.length && ta.every((t, i) => t[0] === tb[i][0]);
  ok(same, `${w} px ${dark ? "oscuro" : "claro"}: ${ta.length} nodos de texto, idénticos carácter a carácter`);
  if (!same) { const i = ta.findIndex((t, k) => !tb[k] || t[0] !== tb[k][0]); console.log("    primera diferencia:", JSON.stringify(ta[i]?.[0]), "→", JSON.stringify(tb[i]?.[0])); }
  const hid = ta.map((t, i) => t[1] && tb[i] && !tb[i][1] && t[0].trim() ? t[0].trim() : null).filter(Boolean);
  ok(!hid.length, `${w} px ${dark ? "oscuro" : "claro"}: ningún texto visible en la original queda oculto${hid.length ? ": " + hid.slice(0, 3).join(" | ") : ""}`);
  ok(JSON.stringify(await attrsOf(A.p)) === JSON.stringify(await attrsOf(B.p)), `${w} px: alt, title, placeholder, aria-label y value existentes, sin cambios`);
  ok(!B.errs.length, `${w} px: sin errores de JavaScript${B.errs.length ? ": " + B.errs[0] : ""}`);
  await A.p.close(); await B.p.close();
}

console.log("Anchuras: sin scroll horizontal, objetivos ≥ 48 px y texto ≥ 16 px en cabecera y selector de versión");
for (const w of WIDTHS) {
  const { p } = await open(NEW, w);
  const mobile = w < 760;
  if (mobile) { await p.click("#start-btn"); await p.waitForSelector("#bn-modes:not([hidden])"); }
  const r = await p.evaluate((mobile) => {
    const vis = (e) => e.checkVisibility() && e.getBoundingClientRect().width > 0;
    const targets = [...document.querySelectorAll(".brand, .navlink, #f-modes label > span" + (mobile ? ", .bn-mode" : ""))].filter(vis);
    const small = targets.filter((e) => e.getBoundingClientRect().height < 47.5).map((e) => e.className || e.tagName);
    const fsSel = "#setup legend, .navlink, .modes b, .modes em, .modes small, .bn-note, .bn-modes-h, .bn-mode em, .bn-mode small, .bn-modes-note";
    const tiny = [...document.querySelectorAll(fsSel)].filter(vis).filter((e) => parseFloat(getComputedStyle(e).fontSize) < 15.99).map((e) => e.className || e.tagName);
    const meters = document.querySelectorAll("#f-modes .m-meter").length + (mobile ? document.querySelectorAll(".bn-mode .m-meter").length : 0);
    return { hs: document.documentElement.scrollWidth > innerWidth + 1, small, tiny, meters, n: targets.length };
  }, mobile);
  ok(!r.hs && !r.small.length && !r.tiny.length && r.meters === (mobile ? 8 : 4), `${w} px: sin scroll horizontal · ${r.n} objetivos ≥ 48 px${r.small.length ? " (falla: " + r.small.join(", ") + ")" : ""} · texto ≥ 16 px${r.tiny.length ? " (falla: " + r.tiny.join(", ") + ")" : ""} · ${r.meters} barras de duración`);
  if (SHOTS && [320, 375, 1280, 1920].includes(w)) { await p.screenshot({ path: `${SHOTS}/nueva-${w}.png` }); if (!mobile) await p.locator("#setup").screenshot({ path: `${SHOTS}/nueva-setup-${w}.png` }); }
  await p.close();
}
if (SHOTS) for (const w of [375, 1280]) { const { p } = await open(ORIG, w); if (w < 760) { await p.click("#start-btn"); await p.waitForSelector("#bn-modes:not([hidden])"); } await p.screenshot({ path: `${SHOTS}/original-${w}.png` }); if (w >= 760) await p.locator("#setup").screenshot({ path: `${SHOTS}/original-setup-${w}.png` }); await p.close(); }

console.log("Teclado");
{
  const { p } = await open(NEW, 1280);
  await p.keyboard.press("Tab"); ok(await p.evaluate(() => document.activeElement.classList.contains("skip")), "Tab 1: «Saltar al contenido»");
  await p.keyboard.press("Tab"); ok(await p.evaluate(() => document.activeElement.classList.contains("brand")), "Tab 2: la marca (ir al inicio)");
  await p.keyboard.press("Tab"); ok(await p.evaluate(() => document.activeElement.classList.contains("navlink") && getComputedStyle(document.activeElement).outlineStyle === "solid"), "Tab 3: primera sección, con contorno de foco visible");
  await p.focus("#f-mode-rapida"); await p.keyboard.press("ArrowDown");
  ok(await p.evaluate(() => document.querySelector("#f-mode-expres").checked && document.activeElement.id === "f-mode-expres"), "flechas: mueven la selección entre versiones (radios nativos)");
  ok(await p.evaluate(() => getComputedStyle(document.querySelector("#f-mode-expres + span"), "::after").backgroundImage.includes("svg")), "la versión elegida muestra la marca ✓ (no solo color)");
  await p.close();
  const m = await open(NEW, 375);
  await m.p.click("#start-btn"); await m.p.waitForSelector("#bn-modes:not([hidden])");
  ok(await m.p.evaluate(() => document.activeElement.classList.contains("bn-mode")), "móvil: al abrir las versiones, el foco va a la tarjeta de la versión actual");
  await m.p.close();
}

console.log("axe-core (WCAG 2.1 AA): la mejorada no añade fallos y no tiene ninguno crítico");
const axe = await (await fetch("https://cdn.jsdelivr.net/npm/axe-core@4.10.2/axe.min.js")).text();
for (const [w, dark] of [[375, false], [375, true], [1280, false], [1280, true]]) {
  const res = [];
  for (const u of [ORIG, NEW]) { const { p } = await open(u, w, dark); if (w < 760) { await p.click("#start-btn"); await p.waitForSelector("#bn-modes:not([hidden])"); }
    await p.addScriptTag({ content: axe }); res.push(await p.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] })).violations.map((v) => `${v.impact}:${v.id}(${v.nodes.length})`))); await p.close(); }
  const [o, n] = res;
  ok(!n.some((v) => v.startsWith("critical")) && n.length <= o.length, `${w} px ${dark ? "oscuro" : "claro"}: original ${o.length ? o.join(", ") : "0"} · mejorada ${n.length ? n.join(", ") : "0"}`);
}
await b.close();
console.log(fails ? `\n${fails} comprobaciones fallan` : "\nTodo OK");
process.exit(fails ? 1 : 0);
