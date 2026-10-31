// Test 29N · versión mejorada: comportamiento añadido. Se carga después de papeleta.js y no cambia ningún texto.
// Iteración 1: barra decorativa de duración en cada versión (formulario y banner móvil).
// Iteración 2: «Más contexto» como acordeón (panel bajo su botón, foco en el botón).
(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* MEJORA: barra proporcional a las preguntas de cada versión (sobre el total de la versión completa).
     Es decorativa (aria-hidden): la cifra ya está en el texto. WCAG 1.3.3, 1.4.1. */
  const meter = (n, max) => { const m = document.createElement("span"); m.className = "m-meter"; m.setAttribute("aria-hidden", "true"); const i = document.createElement("i"); i.style.width = `${Math.max(4, Math.round((n / max) * 100))}%`; m.append(i); return m; };
  function addMeters() {
    const counts = Object.fromEntries($$("#f-modes input[name=mode]").map((i) => [i.value, Number(($(`[data-count="${i.value}"]`, i.closest("label")) || {}).textContent) || 0]));
    const max = Math.max(...Object.values(counts));
    if (!max) return false;
    for (const l of $$("#f-modes label")) { const v = $("input", l).value, sp = $(":scope > span", l); if (sp && !$(".m-meter", sp)) sp.append(meter(counts[v], max)); }
    for (const b of $$("#bn-mode-grid .bn-mode")) if (!$(".m-meter", b)) b.append(meter(counts[b.dataset.mode], max));
    return true;
  }
  // Los datos llegan después de cargar la página: se espera a que el test esté listo («Empezar el test» activo)
  const start = $("#start-btn");
  const ready = () => start && !start.disabled && addMeters();
  if (!ready() && start) { const mo = new MutationObserver(() => { if (ready()) mo.disconnect(); }); mo.observe(start, { attributes: true, attributeFilter: ["disabled"] }); }
  /* ═══ ITERACIÓN 2 · «Más contexto» como acordeón ═══════════════════════════════════════
     MEJORA: el panel de contexto (#ctx, el mismo nodo con sus mismos textos) se coloca justo después de la fila
     de su botón «Más contexto», dentro de la pregunta, como pide el patrón de acordeón de WAI-ARIA. El foco se
     queda en el botón al abrir y al cerrar. WCAG 1.3.2, 2.4.3, 4.1.2.
     papeleta.js reescribe #q-main en cada pregunta (innerHTML) y después busca #ctx por su id: por eso, justo
     antes de reescribirlo, el panel vuelve a su sitio original y, justo después, se coloca bajo el botón. */
  const qMain = $("#q-main"), ctxBox = $("#ctx"), qGrid = $("#quiz-grid");
  if (qMain && ctxBox && qGrid) {
    const desc = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    const place = () => { const tools = $(".q-tools", qMain); if (tools && tools.nextElementSibling !== ctxBox) tools.after(ctxBox); };
    Object.defineProperty(qMain, "innerHTML", { configurable: true, get() { return desc.get.call(this); }, set(v) { qGrid.append(ctxBox); desc.set.call(this, v); place(); } });
    place();
    // MEJORA: el panel es una región con nombre (su título «Contexto»). WCAG 1.3.1, 4.1.2.
    ctxBox.setAttribute("role", "region");
    // MEJORA: el foco se queda en «Más contexto» / «Ocultar contexto» (botón o tecla C), y la apertura se anima
    // solo cuando la pide la persona (no al pasar de pregunta con el panel ya abierto).
    const keepFocus = () => { const t = $("#ctx-toggle"); if (!t) return; if (!ctxBox.hidden) { ctxBox.classList.remove("ctx-anim"); void ctxBox.offsetWidth; ctxBox.classList.add("ctx-anim"); } t.focus({ preventScroll: true }); };
    ctxBox.addEventListener("animationend", () => ctxBox.classList.remove("ctx-anim"));
    qMain.addEventListener("click", (e) => { if (e.target.closest("#ctx-toggle")) keepFocus(); });
    document.addEventListener("keydown", (e) => { if (e.metaKey || e.ctrlKey || e.altKey || $("#v-quiz").hidden) return; const tag = e.target.tagName; if (tag === "SELECT" || tag === "TEXTAREA" || (tag === "INPUT" && e.target.type !== "radio")) return; if (/^[cCiI]$/.test(e.key)) keepFocus(); });
  }

  /* MEJORA (pendiente de aprobar el texto): al elegir una respuesta, una región aria-live="polite" anunciaría
     «Respuesta guardada». No se inserta ningún texto hasta que el titular lo apruebe (textos-nuevos-ui.md).
     WCAG 4.1.3 (mensajes de estado). */
  const TEXTOS_APROBADOS = { respuestaGuardada: "" };   // "" = sin aprobar: no se anuncia nada
  if (TEXTOS_APROBADOS.respuestaGuardada && qMain) {
    const live = document.createElement("p"); live.className = "sr"; live.setAttribute("aria-live", "polite"); live.id = "ans-live";
    $("#v-quiz").append(live);
    qMain.addEventListener("change", (e) => { if (e.target.name !== "ans") return; live.textContent = ""; setTimeout(() => { live.textContent = TEXTOS_APROBADOS.respuestaGuardada; }, 50); });
  }
})();
