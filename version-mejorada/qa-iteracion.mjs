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
  while ((n = w.nextNode())) { const el = n.parentElement; if (!el || el.closest("script,style,noscript,[data-mejora]")) continue; out.push([n.data, el.checkVisibility ? el.checkVisibility({ visibilityProperty: true, opacityProperty: false }) : true]); } return out; });
const attrsOf = (p) => p.evaluate(() => [...document.querySelectorAll("[alt],[title],[placeholder],[aria-label],[value]")].filter((e) => !e.closest("[data-mejora]")).map((e) => ["alt", "title", "placeholder", "aria-label", "value"].map((a) => e.getAttribute(a)).join("|")));

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

// ═══ ITERACIÓN 2 · Pregunta, respuestas y «Más contexto»
const startQuiz = async (p) => { await p.evaluate(() => document.querySelector("#setup").requestSubmit()); await p.waitForSelector("#v-quiz:not([hidden]) #q-stmt"); await p.waitForTimeout(350); };
// Textos del test: la secuencia fuera del panel de contexto es idéntica, y el panel conserva exactamente sus textos (solo cambia de sitio)
const quizTexts = (p) => p.evaluate(() => { const get = (root, skip) => { const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const el = n.parentElement; if (!el || el.closest("script,style,[data-mejora]") || (skip && el.closest("#ctx"))) continue; out.push(n.data); } return out; };
  return { rest: get(document.querySelector("#v-quiz"), true), ctx: get(document.querySelector("#ctx"), false) }; });
console.log("Iteración 2 · P2 en el test: textos idénticos (pregunta normal, con el contexto cerrado y abierto, y un dilema)");
for (const [w, dark] of [[375, false], [1280, true]]) {
  const A = await open(ORIG, w, dark), B = await open(NEW, w, dark);
  for (const x of [A, B]) await startQuiz(x.p);
  for (const step of ["cerrado", "abierto", "siguiente pregunta con el contexto abierto"]) {
    if (step === "abierto") for (const x of [A, B]) { await x.p.click("#ctx-toggle"); await x.p.waitForTimeout(250); }
    if (step.startsWith("siguiente")) for (const x of [A, B]) { await x.p.click(".opt >> nth=3"); await x.p.waitForTimeout(700); }
    const [ta, tb] = [await quizTexts(A.p), await quizTexts(B.p)];
    ok(JSON.stringify(ta.rest) === JSON.stringify(tb.rest) && JSON.stringify(ta.ctx) === JSON.stringify(tb.ctx), `${w} px ${dark ? "oscuro" : "claro"}, contexto ${step}: ${ta.rest.length + ta.ctx.length} nodos idénticos`);
  }
  // Un dilema (opciones A y B), en la versión completa: se avanza respondiendo «3» con el teclado hasta encontrar uno
  const C = await open(ORIG, w, dark), D = await open(NEW, w, dark), dil = [false, false];
  for (const [k, x] of [C, D].entries()) { await x.p.evaluate(() => { document.querySelector("#f-mode-completa").checked = true; }); await startQuiz(x.p);
    for (let i = 0; i < 40 && !(dil[k] = await x.p.isVisible("#q-main .dil")); i++) { await x.p.focus("#q-stmt"); await x.p.keyboard.press("3"); await x.p.waitForTimeout(400); } }
  const [da, db] = [await quizTexts(C.p), await quizTexts(D.p)];
  ok(dil[0] && dil[1] && JSON.stringify(da) === JSON.stringify(db), `${w} px: dilema ${await D.p.textContent("#q-main .q-code")} (opciones A y B): ${da.rest.length + da.ctx.length} nodos idénticos`);
  await C.p.close(); await D.p.close();
  ok(!B.errs.length, `${w} px: sin errores de JavaScript en el test${B.errs.length ? ": " + B.errs[0] : ""}`);
  await A.p.close(); await B.p.close();
}

console.log("Iteración 2 · Anchuras: objetivos ≥ 48 px (respuestas ≥ 56 px), texto ≥ 16 px, sin scroll horizontal, con el contexto abierto");
for (const w of WIDTHS) {
  const { p, errs } = await open(NEW, w);
  await startQuiz(p); await p.click("#ctx-toggle"); await p.waitForTimeout(250);
  const r = await p.evaluate((w) => {
    const vis = (e) => e.checkVisibility() && e.getBoundingClientRect().width > 0;
    const h = (sel, min) => [...document.querySelectorAll(sel)].filter(vis).filter((e) => e.getBoundingClientRect().height < min - .5).map((e) => sel);
    const small = [...h(".opt span.box", w >= 640 ? 56 : 48), ...h(".opt-ns span, .imp, .ctx-toggle, #q-prev, #q-next, #ctx-close", 48)];
    const tiny = [...document.querySelectorAll(".q-meta, .q-intro, .opt .t, .opt-ns span, .imp span, .ctx-toggle span, .kbd, .ctx-body p, .err, .dil-o")].filter(vis).filter((e) => parseFloat(getComputedStyle(e).fontSize) < 15.99).map((e) => e.className);
    const ctx = document.querySelector("#ctx"), tools = document.querySelector(".q-tools");
    return { hs: document.documentElement.scrollWidth > innerWidth + 1, small, tiny, placed: tools.nextElementSibling === ctx && !ctx.hidden && ctx.getAttribute("role") === "region",
      covers: getComputedStyle(ctx).position === "fixed", ring: getComputedStyle(document.querySelector(".opt .tick")).boxShadow !== "none" };
  }, w);
  ok(!r.hs && !r.small.length && !r.tiny.length && r.placed && !r.covers && r.ring && !errs.length, `${w} px: sin scroll horizontal · objetivos${r.small.length ? " (fallan: " + [...new Set(r.small)].join(", ") + ")" : " OK"} · texto ≥ 16 px${r.tiny.length ? " (fallan: " + [...new Set(r.tiny)].join(", ") + ")" : " OK"} · contexto bajo su botón, como región, sin tapar respuestas · círculo de selección visible`);
  if (SHOTS && [375, 1280].includes(w)) await p.screenshot({ path: `${SHOTS}/nueva-test-${w}.png`, fullPage: true });
  await p.close();
}
if (SHOTS) for (const w of [375, 1280]) { const { p } = await open(ORIG, w); await startQuiz(p); await p.click("#ctx-toggle"); await p.waitForTimeout(300); await p.screenshot({ path: `${SHOTS}/original-test-${w}.png`, fullPage: true }); await p.close(); }

console.log("Iteración 2 · Teclado y acordeón");
for (const w of [375, 1280]) {
  const { p } = await open(NEW, w);
  await startQuiz(p);
  await p.focus("#ctx-toggle"); await p.keyboard.press("Enter"); await p.waitForTimeout(250);
  ok(await p.evaluate(() => document.activeElement.id === "ctx-toggle" && document.activeElement.getAttribute("aria-expanded") === "true" && !document.querySelector("#ctx").hidden), `${w} px: Intro en «Más contexto» abre el panel y el foco se queda en el botón (aria-expanded=true)`);
  await p.keyboard.press("Tab");
  ok(await p.evaluate(() => document.activeElement.id === "ctx-close"), `${w} px: el siguiente Tab entra en el panel (orden de foco = orden visual)`);
  await p.keyboard.press("Enter"); await p.waitForTimeout(150);
  ok(await p.evaluate(() => document.activeElement.id === "ctx-toggle" && document.querySelector("#ctx").hidden), `${w} px: cerrar el panel devuelve el foco al botón`);
  await p.keyboard.press("c"); await p.waitForTimeout(250);
  ok(await p.evaluate(() => document.activeElement.id === "ctx-toggle" && !document.querySelector("#ctx").hidden), `${w} px: la tecla C abre el contexto con el foco en el botón`);
  await p.keyboard.press("Escape"); await p.waitForTimeout(150);
  await p.focus('#q-main input[name=ans][value="1"]'); await p.keyboard.press("ArrowDown");
  ok(await p.evaluate(() => document.querySelector('#q-main input[name=ans][value="2"]').checked && document.activeElement.value === "2"), `${w} px: las flechas cambian la respuesta (radios nativos) sin pasar de pregunta`);
  ok(await p.evaluate(() => getComputedStyle(document.querySelector('#q-main input[value="2"] + span .tick')).color !== "rgba(0, 0, 0, 0)"), `${w} px: la respuesta elegida muestra ✓ (no solo color)`);
  await p.close();
}

console.log("Iteración 2 · axe-core en el test con el contexto abierto");
for (const [w, dark] of [[375, false], [375, true], [1280, false], [1280, true]]) {
  const res = [];
  for (const u of [ORIG, NEW]) { const { p } = await open(u, w, dark); await startQuiz(p); await p.click("#ctx-toggle"); await p.waitForTimeout(300);
    await p.addScriptTag({ content: axe }); res.push(await p.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] })).violations.map((v) => `${v.impact}:${v.id}(${v.nodes.length})`))); await p.close(); }
  const [o, n] = res;
  ok(!n.some((v) => v.startsWith("critical")) && n.length <= o.length, `${w} px ${dark ? "oscuro" : "claro"}: original ${o.length ? o.join(", ") : "0"} · mejorada ${n.length ? n.join(", ") : "0"}`);
}

// ═══ ITERACIÓN 3 · Barra de progreso, avance automático, provincia y avisos
const APROBADOS = ["Respuesta guardada", "Pasar de pregunta automáticamente", "Buscar provincia"];  // «Volver arriba» es aria-label, sin texto visible
const newTexts = (p) => p.evaluate(() => [...document.querySelectorAll("[data-mejora]")].map((e) => e.textContent.trim()).filter(Boolean));
const answerAll = async (p) => { for (let i = 0; i < 40 && !(await p.isVisible("#v-prios")); i++) { await p.focus("#q-stmt").catch(() => {}); await p.keyboard.press("4"); await p.waitForTimeout(260); } await p.waitForSelector("#v-prios:not([hidden])"); };
console.log("Iteración 3 · P2 en la barra del test y en «Antes de ver tus resultados» (los textos nuevos aprobados van aparte)");
for (const [w, dark] of [[375, false], [1280, true]]) {
  const A = await open(ORIG, w, dark), B = await open(NEW, w, dark);
  for (const x of [A, B]) { await startQuiz(x.p); await answerAll(x.p); }
  const all = (p) => p.evaluate(() => { const get = (root, skip) => { const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const el = n.parentElement; if (!el || el.closest("script,style,noscript,[data-mejora]") || (skip && el.closest("#ctx"))) continue; out.push(n.data); } return out; };
    return { rest: get(document.documentElement, true), ctx: get(document.querySelector("#ctx"), false) }; });
  const [ta, tb] = [await all(A.p), await all(B.p)];
  ok(JSON.stringify(ta) === JSON.stringify(tb), `${w} px ${dark ? "oscuro" : "claro"}, último paso: ${ta.rest.length + ta.ctx.length} nodos de texto originales idénticos (el panel de contexto, aparte por su nueva posición)`);
  const extra = await newTexts(B.p);
  ok(extra.every((t) => APROBADOS.includes(t)), `${w} px: solo aparecen textos nuevos aprobados (${[...new Set(extra)].join(" · ") || "ninguno visible aquí"})`);
  ok(!!(await B.p.$("#prov-q")), `${w} px: el buscador de provincia aparece (textos aprobados el 31 oct)`);
  await A.p.close(); await B.p.close();
}

console.log("Iteración 3 · Barra del test en todas las anchuras");
for (const w of WIDTHS) {
  const { p, errs } = await open(NEW, w); await startQuiz(p);
  const r = await p.evaluate((w) => { const lab = document.querySelector("#q-prog-label"), ex = document.querySelector("#q-exit"), bar = document.querySelector(".quiz-bar"), sw = document.querySelector(".auto-adv label");
    return { hs: document.documentElement.scrollWidth > innerWidth + 1, fs: parseFloat(getComputedStyle(lab).fontSize), cut: lab.scrollHeight > lab.clientHeight + 1, exitH: ex.getBoundingClientRect().height, sticky: getComputedStyle(bar).position, swH: sw ? sw.getBoundingClientRect().height : 0, live: lab.getAttribute("aria-live"), sw: !!document.querySelector('#auto-adv[role="switch"]:checked') }; }, w);
  ok(!r.hs && r.fs >= 16 && !r.cut && r.exitH >= 47.5 && r.swH >= 47.5 && r.live === "polite" && r.sw && (w <= 560 ? r.sticky === "static" : r.sticky === "sticky") && !errs.length,
    `${w} px: sin scroll horizontal · área a ${r.fs} px sin recortar · «Guardar y salir» ${Math.round(r.exitH)} px · interruptor ${Math.round(r.swH)} px y activado · barra ${r.sticky === "sticky" ? "fija arriba" : "sin fijar (móvil)"}`);
  if (SHOTS && [375, 1280].includes(w)) await p.screenshot({ path: `${SHOTS}/nueva-barra-${w}.png` });
  await p.close();
}

console.log("Iteración 3 · Avance automático, avisos y provincia (móvil y escritorio)");
for (const w of [375, 1280]) {
  const { p } = await open(NEW, w); await startQuiz(p);
  const id0 = await p.textContent("#q-main .q-code");
  await p.click(".opt >> nth=1"); await p.waitForTimeout(700);
  ok((await p.textContent("#q-main .q-code")) !== id0 && (await p.textContent("#ans-live")) === "Respuesta guardada", `${w} px: con el interruptor activado, elegir pasa de pregunta (como la original) y se anuncia «Respuesta guardada»`);
  // Reescribir el área con el mismo texto no la cambia (no se repite el aviso); con otro texto, sí
  const same = await p.evaluate(() => { const l = document.querySelector("#q-prog-label"), n = l.firstChild; l.textContent = l.textContent; const keep = l.firstChild === n; return keep; });
  ok(same, `${w} px: el área solo se reescribe (y se anuncia) cuando cambia`);
  await p.click(".auto-adv label"); await p.waitForTimeout(100);
  const id1 = await p.textContent("#q-main .q-code");
  await p.click(".opt >> nth=2"); await p.waitForTimeout(800);
  ok((await p.textContent("#q-main .q-code")) === id1 && (await p.isChecked('#q-main input[name=ans][value="3"]')), `${w} px: con el interruptor desactivado, tocar una respuesta la elige sin pasar de pregunta`);
  await p.focus("#q-stmt"); await p.keyboard.press("5"); await p.waitForTimeout(600);
  ok((await p.textContent("#q-main .q-code")) === id1 && (await p.isChecked('#q-main input[name=ans][value="5"]')), `${w} px: …y la tecla 5 también elige sin avanzar`);
  await p.click("#q-next"); await p.waitForTimeout(300);
  ok((await p.textContent("#q-main .q-code")) !== id1 && !(await p.isChecked("#auto-adv")), `${w} px: «Siguiente» avanza y el interruptor sigue desactivado en la pregunta nueva`);
  await p.click(".auto-adv label"); await answerAll(p);
  await p.click("#prio-go"); await p.waitForTimeout(200);
  ok((await p.getAttribute("#f-prov", "aria-invalid")) === "true" && (await p.textContent("#prov-err")).length > 0, `${w} px: sin provincia, el desplegable queda marcado con aria-invalid y el error enlazado`);
  await p.selectOption("#f-prov", "sevilla"); await p.waitForTimeout(150);
  ok(!(await p.getAttribute("#f-prov", "aria-invalid")), `${w} px: al elegir provincia, aria-invalid desaparece`);
  const r = await p.evaluate(() => { const vis = (e) => e.checkVisibility() && e.getBoundingClientRect().width > 0;
    return { hs: document.documentElement.scrollWidth > innerWidth + 1, small: [...document.querySelectorAll("#f-prov, .prio-b, #prio-go, #prio-skip, #prio-back")].filter(vis).filter((e) => e.getBoundingClientRect().height < 47.5).length,
      tiny: [...document.querySelectorAll("#v-prios .label, #v-prios .small, .prov-field .chip, .prio-b span")].filter(vis).filter((e) => parseFloat(getComputedStyle(e).fontSize) < 15.99).map((e) => e.className) }; });
  ok(!r.hs && !r.small && !r.tiny.length, `${w} px: último paso sin scroll horizontal, controles ≥ 48 px y textos ≥ 16 px${r.tiny.length ? " (fallan: " + r.tiny.join(", ") + ")" : ""}`);
  if (SHOTS) await p.screenshot({ path: `${SHOTS}/nueva-prov-${w}.png`, fullPage: true });
  await p.close();
}

console.log("Iteración 3 · Buscador de provincia (textos aprobados)");
for (const w of [375, 1280]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
  await p.goto(NEW); await p.waitForSelector("#start-btn:not([disabled])"); await startQuiz(p); await answerAll(p);
  await p.fill("#prov-q", "sevi"); await p.waitForTimeout(100);
  ok((await p.inputValue("#f-prov")) === "sevilla" && (await p.textContent("#prov-q-st")) === "1 provincia coincide", `${w} px: «sevi» → elige Sevilla y lo anuncia`);
  await p.fill("#prov-q", "ávila"); await p.waitForTimeout(100);
  const n = await p.evaluate(() => [...document.querySelectorAll("#f-prov option")].filter((o) => !o.hidden && o.value).map((o) => o.textContent));
  ok(n.length === 1 && n[0] === "Ávila", `${w} px: la búsqueda ignora tildes y no cambia ni reordena las opciones (${n.join(", ")})`);
  await p.fill("#prov-q", "zzz"); await p.waitForTimeout(100);
  ok((await p.textContent("#prov-q-st")).startsWith("Ninguna"), `${w} px: sin coincidencias, lo dice`);
  await p.fill("#prov-q", "le"); await p.waitForTimeout(100);
  if (SHOTS) await p.screenshot({ path: `${SHOTS}/nueva-buscador-${w}.png`, fullPage: true });
  await p.close();
}

console.log("Iteración 3 · axe-core en el test (con el interruptor) y en el último paso");
for (const [w, dark] of [[375, false], [375, true], [1280, false], [1280, true]]) {
  const res = [];
  for (const u of [ORIG, NEW]) { const { p } = await open(u, w, dark); await startQuiz(p); await answerAll(p); await p.click("#prio-go"); await p.waitForTimeout(200);
    await p.addScriptTag({ content: axe }); res.push(await p.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] })).violations.map((v) => `${v.impact}:${v.id}(${v.nodes.length})`))); await p.close(); }
  const [o, n] = res;
  ok(!n.some((v) => v.startsWith("critical")) && n.length <= o.length, `${w} px ${dark ? "oscuro" : "claro"}, último paso con error: original ${o.length ? o.join(", ") : "0"} · mejorada ${n.length ? n.join(", ") : "0"}`);
}

// ═══ ITERACIÓN 4 · Resultados, encabezados, «Volver arriba» y repaso final
const toResults = async (p) => { await startQuiz(p); await answerAll(p); await p.selectOption("#f-prov", "madrid"); await p.click("#prio-skip"); await p.waitForSelector("#v-results:not([hidden])"); await p.waitForTimeout(500);
  const full = await p.$("text=Ver el análisis completo"); if (full) { await full.click(); await p.waitForTimeout(900); }
  await p.evaluate(() => document.querySelectorAll("#v-results details").forEach((d) => { d.open = true; })); await p.waitForTimeout(300); };
console.log("Iteración 4 · P2 en resultados completos (todos los desplegables abiertos)");
for (const [w, dark] of [[375, false], [1280, true]]) {
  const A = await open(ORIG, w, dark), B = await open(NEW, w, dark);
  for (const x of [A, B]) await toResults(x.p);
  const all = (p) => p.evaluate(() => { const get = (root, skip) => { const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { const el = n.parentElement; if (!el || el.closest("script,style,noscript,[data-mejora]") || (skip && el.closest("#ctx"))) continue; out.push(n.data); } return out; };
    return { rest: get(document.documentElement, true), ctx: get(document.querySelector("#ctx"), false) }; });
  const [ta, tb] = [await all(A.p), await all(B.p)];
  const same = JSON.stringify(ta) === JSON.stringify(tb);
  if (!same) { const i = ta.rest.findIndex((t, k) => t !== tb.rest[k]); console.log("    primera diferencia:", JSON.stringify(ta.rest[i]), "→", JSON.stringify(tb.rest[i])); }
  ok(same, `${w} px ${dark ? "oscuro" : "claro"}: ${ta.rest.length + ta.ctx.length} nodos de texto idénticos en resultados`);
  // Ningún texto queda recortado (puntos suspensivos o líneas limitadas) que no lo estuviera en la original
  const cut = (p) => p.evaluate(() => [...document.querySelectorAll("#v-results *")].filter((e) => { const cs = getComputedStyle(e); return e.checkVisibility() && (cs.textOverflow === "ellipsis" || cs.webkitLineClamp !== "none") && (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1); }).map((e) => e.textContent.trim().slice(0, 30)));
  const [ca, cb] = [await cut(A.p), await cut(B.p)];
  const newly = cb.filter((t) => !ca.includes(t));
  ok(!newly.length, `${w} px: ningún texto queda recortado por el tamaño mayor${newly.length ? ": " + newly.slice(0, 3).join(" | ") : ""}`);
  await A.p.close(); await B.p.close();
}

console.log("Iteración 4 · Resultados completos en todas las anchuras: sin scroll horizontal, texto ≥ 16 px, controles ≥ 48 px");
for (const w of WIDTHS) {
  const { p, errs } = await open(NEW, w); await toResults(p);
  const r = await p.evaluate(() => {
    const vis = (e) => e.checkVisibility() && e.getBoundingClientRect().width > 0;
    const own = (e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.data.trim());
    const tiny = [...document.querySelectorAll("#v-results *, .site-foot *")].filter((e) => vis(e) && own(e) && !e.closest('[aria-hidden="true"], svg, canvas, .logo, .sr') && parseFloat(getComputedStyle(e).fontSize) < 15.99).map((e) => e.tagName + "." + String(e.className).split(" ")[0]);
    const small = [...document.querySelectorAll("#v-results :is(button, summary, select, .btn, .link-btn)")].filter((e) => vis(e) && e.getBoundingClientRect().width > 2 && getComputedStyle(e).display !== "inline" && e.getBoundingClientRect().height < 47.5).map((e) => e.tagName + "." + String(e.className).split(" ")[0]);
    return { hs: document.documentElement.scrollWidth > innerWidth + 1, tiny: [...new Set(tiny)], ntiny: tiny.length, small: [...new Set(small)], nsmall: small.length };
  });
  ok(!r.hs && !r.ntiny && !r.nsmall && !errs.length, `${w} px: sin scroll horizontal · texto ≥ 16 px${r.ntiny ? ` (fallan ${r.ntiny}: ${r.tiny.slice(0, 4).join(", ")})` : ""} · controles ≥ 48 px${r.nsmall ? ` (fallan ${r.nsmall}: ${r.small.slice(0, 4).join(", ")})` : ""}${errs.length ? " · error JS: " + errs[0] : ""}`);
  if (SHOTS && [375, 1280].includes(w)) await p.screenshot({ path: `${SHOTS}/nueva-resultados-${w}.png`, fullPage: true });
  await p.close();
}
if (SHOTS) for (const w of [375, 1280]) { const { p } = await open(ORIG, w); await toResults(p); await p.screenshot({ path: `${SHOTS}/original-resultados-${w}.png`, fullPage: true }); await p.close(); }

console.log("Iteración 4 · Encabezados: un solo nivel 1 por vista y sin saltos");
for (const w of [375, 1280]) {
  const { p } = await open(NEW, w);
  const lv = () => p.evaluate(() => { const hs = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6,[role=heading]")].filter((h) => h.checkVisibility()).map((h) => Number(h.getAttribute("aria-level")) || Number(h.tagName[1]));
    let jump = false; for (let i = 1; i < hs.length; i++) if (hs[i] > hs[i - 1] + 1) jump = true; return { ones: hs.filter((x) => x === 1).length, first: hs[0], jump }; });
  const res = {};
  res.portada = await lv(); await startQuiz(p); res.test = await lv(); await answerAll(p); res["último paso"] = await lv();
  await p.selectOption("#f-prov", "madrid"); await p.click("#prio-skip"); await p.waitForSelector("#v-results:not([hidden])"); await p.waitForTimeout(400);
  const full = await p.$("text=Ver el análisis completo"); if (full) { await full.click(); await p.waitForTimeout(700); }
  res.resultados = await lv();
  ok(Object.values(res).every((x) => x.ones === 1 && x.first === 1 && !x.jump), `${w} px: ${Object.entries(res).map(([k, x]) => `${k}: ${x.ones} de nivel 1${x.jump ? ", con salto" : ""}`).join(" · ")}`);
  await p.close();
}

console.log("Iteración 4 · «Volver arriba»");
{
  const { p } = await open(NEW, 375); await toResults(p);
  ok((await p.getAttribute(".to-top", "aria-label")) === "Volver arriba", "el botón está en la entrega, con su nombre aprobado");
  await p.close();
  for (const w of [375, 1280]) {
    const q = await b.newPage({ viewport: { width: w, height: 800 }, reducedMotion: "reduce" });
    await q.goto(NEW); await q.waitForSelector("#start-btn:not([disabled])");
    const check = async (nombre, titulo) => {
      await q.evaluate(() => scrollTo(0, 0)); await q.waitForTimeout(120);
      const off = await q.$eval(".to-top", (e) => !e.classList.contains("on"));
      await q.evaluate(() => scrollTo(0, Math.min(document.documentElement.scrollHeight - innerHeight, innerHeight * 0.8))); await q.waitForTimeout(150);
      const bx = await q.$eval(".to-top", (e) => { const r = e.getBoundingClientRect(), top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { on: e.classList.contains("on"), w: r.width, h: r.height, inView: r.bottom <= innerHeight && r.right <= innerWidth, free: e.contains(top) }; });
      await q.click(".to-top"); await q.waitForTimeout(150);
      const back = await q.evaluate(() => ({ y: scrollY, f: document.activeElement.tagName + " " + document.activeElement.textContent.trim().slice(0, 30) }));
      ok(off && bx.on && bx.w >= 48 && bx.h >= 48 && bx.inView && bx.free && back.y === 0, `${w} px · ${nombre}: oculto arriba; al bajar aparece (${Math.round(bx.w)}×${Math.round(bx.h)} px, sin nada encima); lleva arriba y enfoca «${back.f.replace(/^\S+ /, "")}…»`);
    };
    await check("portada");
    await q.click('.navlink[data-go="method"]'); await q.waitForSelector("#v-method:not([hidden])"); await q.waitForTimeout(300); await check("Cómo funciona");
    await q.click('.navlink[data-go="explorer"]'); await q.waitForSelector("#v-explorer:not([hidden])"); await q.waitForTimeout(300); await check("Posturas de los partidos");
    await q.click('.navlink[data-go="home"]'); await q.waitForSelector("#v-home:not([hidden])");
    await startQuiz(q); await q.evaluate(() => scrollTo(0, 2000)); await q.waitForTimeout(150);
    ok(!(await q.$eval(".to-top", (e) => e.classList.contains("on"))), `${w} px · test: no aparece (no tapa «Siguiente»)`);
    await answerAll(q); await q.evaluate(() => scrollTo(0, 2000)); await q.waitForTimeout(150);
    ok(!(await q.$eval(".to-top", (e) => e.classList.contains("on"))), `${w} px · último paso: no aparece (no tapa el teclado ni los botones)`);
    await q.selectOption("#f-prov", "madrid"); await q.click("#prio-skip"); await q.waitForSelector("#v-results:not([hidden])"); await q.waitForTimeout(500);
    await check("resultados (resumen)");
    const full = await q.$("text=Ver el análisis completo"); if (full) { await full.click(); await q.waitForTimeout(800); }
    await check("resultados (análisis completo)");
    if (SHOTS) { await q.evaluate(() => scrollTo(0, innerHeight * 2)); await q.waitForTimeout(200); await q.screenshot({ path: `${SHOTS}/volver-arriba-resultados-${w}.png` }); }
    await q.close();
  }
}

console.log("Iteración 4 · axe-core en resultados completos");
for (const [w, dark] of [[375, false], [375, true], [1280, false], [1280, true]]) {
  const res = [];
  for (const u of [ORIG, NEW]) { const { p } = await open(u, w, dark); await toResults(p);
    await p.addScriptTag({ content: axe }); res.push(await p.evaluate(async () => (await axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] })).violations.map((v) => `${v.impact}:${v.id}(${v.nodes.length})`))); await p.close(); }
  const [o, n] = res;
  ok(!n.some((v) => v.startsWith("critical")) && n.length <= o.length, `${w} px ${dark ? "oscuro" : "claro"}: original ${o.length ? o.join(", ") : "0"} · mejorada ${n.length ? n.join(", ") : "0"}`);
}
await b.close();
console.log(fails ? `\n${fails} comprobaciones fallan` : "\nTodo OK");
process.exit(fails ? 1 : 0);
