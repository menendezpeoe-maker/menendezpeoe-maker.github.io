// Las pruebas que revisan el análisis completo lo abren desplegado, como quien ya pulsó «Ver el análisis completo».
// El resumen plegado se prueba aparte (qa/summary.mjs). Se respeta cualquier otra preferencia guardada.
export function withFullAnalysis(browser) {
  const init = () => { try { const k = "papeleta29n.prefs", p = JSON.parse(localStorage.getItem(k) || "{}"); if (p.full === undefined) { p.full = true; localStorage.setItem(k, JSON.stringify(p)); } } catch { /* sin almacenamiento */ } };
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (...a) => { const c = await newContext(...a); await c.addInitScript(init); return c; };
  browser.newPage = async (...a) => { const c = await browser.newContext(...a); const p = await c.newPage(); p.close = async () => c.close(); return p; };
  return browser;
}
