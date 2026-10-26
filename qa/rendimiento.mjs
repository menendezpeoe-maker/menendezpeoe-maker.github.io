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
const BUDGET = REAL ? { home: [380, 10], page: [220, 3] } : { home: [900, 20], page: [300, 5] };
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
  let bytes = 0, reqs = 0;
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
  return { kb: Math.round(bytes / 1024), reqs, ready: tReady, fcp: v.fcp / 1000, lcp: v.lcp / 1000, cls: v.cls };
}
const fmt = (r) => `${r.kb} kB en ${r.reqs} peticiones · usable en ${r.ready.toFixed(1)} s · FCP ${r.fcp.toFixed(1)} s · LCP ${r.lcp.toFixed(1)} s · CLS ${r.cls.toFixed(3)}`;

console.log(`Rendimiento con 3G lenta y CPU ×4 (${REAL ? "web real, con compresión" : "dist local, sin compresión"})`);
const home = await measure("", "#start-btn:not([disabled])");
console.log("  · Portada:", fmt(home));
ok(home.kb <= BUDGET.home[0] && home.ready <= BUDGET.home[1], `la portada cabe en el presupuesto (${BUDGET.home[0]} kB, ${BUDGET.home[1]} s)`);
ok(home.cls < 0.1, "la portada no salta al cargar (CLS < 0,1)");
const pg = await measure("preguntas/a02/", "h1");
console.log("  · Página de pregunta:", fmt(pg));
ok(pg.kb <= BUDGET.page[0] && pg.fcp <= BUDGET.page[1], `una página estática cabe en el presupuesto (${BUDGET.page[0]} kB, texto visible en ${BUDGET.page[1]} s)`);
ok(pg.cls < 0.1, "la página estática no salta al cargar (CLS < 0,1)");

await browser.close();
if (fails.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
