// Páginas estáticas: «Volver arriba» (aparece al bajar una pantalla, lleva arriba y deja el foco al principio del contenido)
// y apertura del desplegable que contiene el ancla del enlace (#a-vivienda, #B08…).
(() => {
  const b = document.createElement("a");
  b.href = "#main"; b.className = "to-top"; b.setAttribute("aria-label", "Volver arriba"); b.tabIndex = -1; b.setAttribute("aria-hidden", "true");
  b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg><span class="to-top-t">Arriba</span>';
  document.body.append(b);
  const upd = () => { const on = scrollY > innerHeight * 0.9; b.classList.toggle("on", on); b.tabIndex = on ? 0 : -1; b.setAttribute("aria-hidden", String(!on)); };
  addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  b.addEventListener("click", (e) => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    const m = document.getElementById("main"); if (m) m.focus({ preventScroll: true });
    history.replaceState(null, "", location.pathname + location.search);
  });
  const openHash = () => { const id = decodeURIComponent(location.hash.slice(1)); const t = id && document.getElementById(id); if (!t) return; const d = t.closest("details"); if (d && !d.open) { d.open = true; t.scrollIntoView(); } else if (t.tagName === "DETAILS" && !t.open) { t.open = true; t.scrollIntoView(); } };
  addEventListener("hashchange", openHash); openHash();
})();
