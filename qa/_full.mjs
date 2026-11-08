// Las pruebas que revisan el análisis completo lo abren desplegado, como quien ya pulsó «Ver el análisis completo».
// Además se ven todas las secciones a la vez (clase rt-all, como al imprimir): el modo por secciones se prueba aparte (qa/resultados.mjs).
// El resumen se prueba aparte (qa/summary.mjs). Se respeta cualquier otra preferencia guardada.
export function withFullAnalysis(browser) {
  const init = () => { try { const mk = () => document.documentElement && document.documentElement.classList.add("rt-all"); if (document.documentElement) mk(); else new MutationObserver((_, o) => { if (document.documentElement) { mk(); o.disconnect(); } }).observe(document, { childList: true }); } catch { /* sin DOM */ } try { const k = "papeleta29n.prefs", p = JSON.parse(localStorage.getItem(k) || "{}"); if (p.full === undefined) { p.full = true; localStorage.setItem(k, JSON.stringify(p)); } } catch { /* sin almacenamiento */ } };
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (...a) => { const c = await newContext(...a); await c.addInitScript(init); return c; };
  browser.newPage = async (...a) => { const c = await browser.newContext(...a); const p = await c.newPage(); p.close = async () => c.close(); return p; };
  return browser;
}
