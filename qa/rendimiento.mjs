// Rendimiento con la red de un móvil lento (tanda T11): peso transferido y tiempos de la portada,
// el test y una página estática, con red «3G lenta» (400 kbit/s, 400 ms) y CPU 4 veces más lenta.
// Falla si se supera el presupuesto. Uso: NODE_PATH=$(npm root -g) node qa/rendimiento.mjs
//   Por defecto mide dist/ en :8766 (sin compresión); BASE=https://test29n.es/ para la web real (con gzip).
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const REAL = /^https:/.test(process.env.BASE || "");
const SITE = (process.env.BASE || "http://127.0.0.1:8766/").replace(/_local\.html$/, "").replace(/\/?$/, "/");
// Presupuestos (algo por encima de lo medido el 26 oct 2026, tras aligerar las tipografías): kB transferidos y
// segundos hasta poder usar la portada (botón «Empezar» activo) o hasta ver el texto de una página estática (FCP)
// 28 oct: local 900 → 960 kB porque data/preguntas.json crece con las fuentes de cada tanda (comprimido, en la web real, sigue en ~345 kB).
// 1 nov (bloque B): local 960 kB/21 s → 1000 kB/22 s: mejora.css/js (31 oct y bloque B) y fuentes nuevas suman sin comprimir, y C1 añadirá más.
// En local los archivos van sin comprimir; el presupuesto de la web real (comprimido: 380 kB, usable en 10 s) no cambia y es el que cuenta.
// 3 nov (fuentes): web real 380 kB/8,5 s → 410 kB/9 s (medido 389 kB y 8,2–8,4 s con 110 fuentes nuevas; margen para las 120 pendientes). Local 1000 → 1100 kB: data/preguntas.json pasa de 384 a 454 kB sin comprimir al añadir 184 fuentes con su justificación (+15 kB comprimido).
// 1 nov (velocidad en móvil): web real usable en 10 → 8,5 s, tras precargar los datos y no precargar la fuente en la portada (medido: 8,8 → ~7,2 s).
// 8 nov: local 22 → 23 s (medido 21,9–22,2 s con el recorrido interactivo y la calculadora de la metodología, +1,4 kB comprimidos); el presupuesto de la web real no cambia.
const BUDGET = REAL ? { home: [410, 9], page: [220, 3] } : { home: [1100, 23], page: [300, 5] };
const fails = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const browser = await chromium.launch();

async function measure(path, ready) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 400, downloadThroughput: 400 * 1024 / 8, uploadThroughput: 400 * 1024 / 8 });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  let bytes = 0, reqs = 0; const urls = {};
  cdp.on("Network.requestWillBeSent", (e) => { const u = e.request.url.split("?")[0].replace(/^.*\/\/[^/]+\//, ""); urls[u] = (urls[u] || 0) + 1; });
  cdp.on("Network.loadingFinished", (e) => { bytes += e.encodedDataLength; reqs++; });
  const t0 = Date.now();
  await page.goto(SITE + path, { waitUntil: "commit" });
  await page.waitForSelector(ready, { timeout: 60000 });
  const tReady = (Date.now() - t0) / 1000;
  await page.waitForLoadState("load").catch(() => {});
  await page.waitForTimeout(800);
  const v = await page.evaluate(() => new Promise((res) => {
    const out = { fcp: 0, lcp: 0, cls: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) out.lcp = e.startTime; }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value; }).observe({ type: "layout-shift", buffered: true });
    out.fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime || 0;
    setTimeout(() => res(out), 300);
  }));
  await ctx.close();
  return { urls, kb: Math.round(bytes / 1024), reqs, ready: tReady, fcp: v.fcp / 1000, lcp: v.lcp / 1000, cls: v.cls };
}
const fmt = (r) => `${r.kb} kB en ${r.reqs} peticiones · usable en ${r.ready.toFixed(1)} s · FCP ${r.fcp.toFixed(1)} s · LCP ${r.lcp.toFixed(1)} s · CLS ${r.cls.toFixed(3)}`;

console.log(`Rendimiento con 3G lenta y CPU ×4 (${REAL ? "web real, con compresión" : "dist local, sin compresión"})`);
const home = await measure("", "#start-btn:not([disabled])");
console.log("  · Portada:", fmt(home));
ok(home.kb <= BUDGET.home[0] && home.ready <= BUDGET.home[1], `la portada cabe en el presupuesto (${BUDGET.home[0]} kB, ${BUDGET.home[1]} s)`);
ok(home.cls < 0.1, "la portada no salta al cargar (CLS < 0,1)");
// Precarga de los datos (1 nov): si la petición del programa dejara de coincidir con la precarga, se descargarían dos veces
const dup = ["data/preguntas.json", "data/partidos.json", "data/politicos.json"].filter((u) => home.urls[u] !== 1);
ok(!dup.length, `la portada descarga cada archivo de datos una sola vez${dup.length ? ": " + dup.map((u) => `${u} ×${home.urls[u] || 0}`).join(", ") : ""}`);
const pg = await measure("preguntas/a02/", "h1");
console.log("  · Página de pregunta:", fmt(pg));
ok(pg.kb <= BUDGET.page[0] && pg.fcp <= BUDGET.page[1], `una página estática cabe en el presupuesto (${BUDGET.page[0]} kB, texto visible en ${BUDGET.page[1]} s)`);
ok(pg.cls < 0.1, "la página estática no salta al cargar (CLS < 0,1)");

await browser.close();
if (fails.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
