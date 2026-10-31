// Test 29N · versión mejorada: comportamiento añadido. Se carga después de papeleta.js y no cambia ningún texto.
// Iteración 1: barra decorativa de duración en cada versión (formulario y banner móvil).
// Iteración 2: «Más contexto» como acordeón (panel bajo su botón, foco en el botón).
// Iteración 3: avisos aria-live, avance automático opcional, barra de progreso y provincia con buscador.
// Iteración 4: mínimo de 16 px, jerarquía de encabezados, «Volver arriba».
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

  /* ═══ ITERACIÓN 3 ═══════════════════════════════════════════════════════════════════════
     Textos nuevos de interfaz: solo se muestran los aprobados por el titular (textos-nuevos-ui.md).
     Un texto vacío ("") significa «pendiente»: la función que lo necesita no aparece. Los elementos añadidos llevan
     data-mejora="texto-nuevo" para distinguirlos de los textos originales en las pruebas. */
  const PROPUESTA = window.__MEJORA_PROPUESTA === true;   // solo para capturas de la propuesta (pruebas), nunca en la entrega
  const T = {
    respuestaGuardada: "Respuesta guardada",                   // aprobado el 31 oct
    autoAvance: "Pasar de pregunta automáticamente",           // aprobado el 31 oct
    buscarProvincia: "Buscar provincia",                        // aprobado el 31 oct
    nCoinciden: (n) => (n === 1 ? "1 provincia coincide" : `${n} provincias coinciden`),   // aprobado el 31 oct
    ningunaCoincide: "Ninguna provincia coincide con la búsqueda",  // aprobado el 31 oct
    volverArriba: "Volver arriba",                              // aprobado el 31 oct
  };
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } } };
  const quizView = $("#v-quiz");

  /* MEJORA: «Respuesta guardada» anunciado al lector de pantalla al elegir (región invisible). WCAG 4.1.3. */
  if (quizView && qMain) {
    const live = document.createElement("p"); live.className = "sr"; live.id = "ans-live"; live.setAttribute("aria-live", "polite"); live.dataset.mejora = "texto-nuevo";
    quizView.append(live);
    let tm = 0;
    qMain.addEventListener("change", (e) => { if (e.target.name !== "ans") return; live.textContent = ""; clearTimeout(tm); tm = setTimeout(() => { live.textContent = T.respuestaGuardada; }, 60); });
  }

  /* MEJORA: interruptor de avance automático (activado por defecto, como la original). Si se desactiva, ni el
     toque/clic ni las teclas 0–5 pasan de pregunta: se elige y se pulsa «Siguiente» (o Intro). WCAG 3.2.2, 2.2.1. */
  let auto = store.get("t29n-mejora-auto", true);
  const switchHTML = () => { const d = document.createElement("div"); d.className = "auto-adv"; d.dataset.mejora = "texto-nuevo";
    d.innerHTML = `<label><input type="checkbox" role="switch" id="auto-adv"${auto ? " checked" : ""}><span class="sw" aria-hidden="true"></span><span></span></label>`;
    d.querySelector("label > span:last-child").textContent = T.autoAvance; return d; };
  const placeSwitch = () => { const nav = qMain && $(".q-nav", qMain); if (nav && !$(".auto-adv", qMain)) nav.after(switchHTML()); };
  if (qMain) {
    new MutationObserver(placeSwitch).observe(qMain, { childList: true });
    placeSwitch();
    qMain.addEventListener("change", (e) => { if (e.target.id !== "auto-adv") return; auto = e.target.checked; store.set("t29n-mejora-auto", auto); });
    // papeleta.js pasa de pregunta si la respuesta llega menos de 1,2 s después de un toque o de una tecla 1–5.
    // Con el avance desactivado: (1) el toque no llega a registrarse como tal; (2) las teclas 0–5 eligen sin
    // avanzar; (3) si se elige justo después de un toque o tecla hecho con el avance activado (menos de 1,25 s),
    // la respuesta se entrega a papeleta.js en cuanto pasa ese margen, para que no avance.
    let lastReal = 0;
    quizView.addEventListener("pointerdown", (e) => { if (!e.target.closest(".opt, .opt-ns")) return; if (auto) lastReal = Date.now(); else e.stopPropagation(); }, true);
    window.addEventListener("keydown", (e) => {
      if (quizView.hidden || e.metaKey || e.ctrlKey || e.altKey || !/^[0-5]$/.test(e.key)) return;
      const tag = e.target.tagName; if (tag === "SELECT" || tag === "TEXTAREA" || (tag === "INPUT" && e.target.type !== "radio")) return;
      if (auto) { if (e.key !== "0") lastReal = Date.now(); return; }
      const r = $(`input[name=ans][value="${e.key}"]`, qMain); if (!r) return;
      e.preventDefault(); e.stopImmediatePropagation();
      r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true }));
    }, true);
    quizView.addEventListener("change", (e) => {
      if (auto || e.target.name !== "ans" || e.mejoraDiferido) return;
      const wait = lastReal + 1250 - Date.now(); if (wait <= 0) return;
      e.stopPropagation();
      const target = e.target;
      setTimeout(() => { if (!target.isConnected) return; const ev = new Event("change", { bubbles: true }); ev.mejoraDiferido = true; target.dispatchEvent(ev); }, wait);
    }, true);
  }

  /* MEJORA: el área actual («Área 2 de 12 · Vivienda y urbanismo») se anuncia al lector de pantalla cuando cambia,
     y solo entonces (papeleta.js la reescribe en cada pregunta con el mismo texto). WCAG 4.1.3. */
  const progLabel = $("#q-prog-label");
  if (progLabel) {
    const d = Object.getOwnPropertyDescriptor(Node.prototype, "textContent");
    Object.defineProperty(progLabel, "textContent", { configurable: true, get() { return d.get.call(this); }, set(v) { if (d.get.call(this) !== String(v)) d.set.call(this, v); } });
    progLabel.setAttribute("aria-live", "polite"); progLabel.setAttribute("aria-atomic", "true");
  }

  /* MEJORA: provincia sin elegir → el desplegable se marca con aria-invalid mientras se muestra el error
     (ya enlazado con aria-describedby). WCAG 3.3.1, 4.1.2. */
  const provSel = $("#f-prov"), provErr = $("#prov-err");
  if (provSel && provErr) {
    const sync = () => { if (provErr.textContent.trim()) provSel.setAttribute("aria-invalid", "true"); else provSel.removeAttribute("aria-invalid"); };
    new MutationObserver(sync).observe(provErr, { childList: true, characterData: true, subtree: true });
    provSel.addEventListener("change", sync);
  }

  /* MEJORA (pendiente de aprobar sus textos): buscador de provincia encima del desplegable. Filtra las opciones
     ocultándolas (no se cambian ni se reordenan); con una sola coincidencia, la elige. WCAG 2.4.6, 3.3.2, 4.1.3. */
  if (provSel && T.buscarProvincia) {
    const box = document.createElement("div"); box.className = "prov-search"; box.dataset.mejora = "texto-nuevo";
    box.innerHTML = `<label class="label" for="prov-q"></label><input type="search" id="prov-q" autocomplete="off" spellcheck="false" aria-controls="f-prov" aria-describedby="prov-q-st"><p id="prov-q-st" class="small muted prov-q-st" aria-live="polite"></p>`;
    $("label", box).textContent = T.buscarProvincia;
    provSel.closest(".prov-field").querySelector("label[for=f-prov]").before(box);
    const norm = (x) => x.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const q = $("#prov-q", box), st = $("#prov-q-st", box);
    q.addEventListener("input", () => {
      const t = norm(q.value); let hits = [];
      for (const o of provSel.querySelectorAll("option[value]:not([value=''])")) { const ok = !t || norm(o.textContent).includes(t); o.hidden = !ok; o.disabled = !ok; if (ok) hits.push(o); }
      for (const g of provSel.querySelectorAll("optgroup")) g.hidden = ![...g.children].some((o) => !o.hidden);
      st.textContent = !t ? "" : hits.length ? T.nCoinciden(hits.length) : T.ningunaCoincide;
      if (t && hits.length === 1 && provSel.value !== hits[0].value) { provSel.value = hits[0].value; provSel.dispatchEvent(new Event("change", { bubbles: true })); }
    });
  }
  /* ═══ ITERACIÓN 4 ═══════════════════════════════════════════════════════════════════════ */

  /* MEJORA: suelo de 16 px. Cada elemento con texto propio y tamaño calculado < 16 px recibe .m16 (y .m16lh si su
     interlineado fijo quedaría estrecho). Se aplica al cargar y a todo lo que papeleta.js pinte después
     (resultados, comparador, revisar…). Excluidos: logotipos de partido, gráficos SVG/canvas y lo oculto a
     lectores de pantalla por ser decorativo. Solo agranda. WCAG 1.4.4, 1.4.12. */
  const SKIP16 = '[aria-hidden="true"], svg, canvas, .logo, .brand, script, style, noscript, .sr';
  const ownText = (el) => { for (const n of el.childNodes) if (n.nodeType === 3 && n.data.trim()) return true; return false; };
  // Rendimiento: el tamaño se mide una sola vez por «tipo» de elemento (etiqueta y clases del elemento, de su padre y
  // de su abuelo, dentro de la misma vista) y se reutiliza: elementos del mismo tipo en el mismo sitio tienen el mismo
  // tamaño. Así, «Posturas de los partidos» (~12 000 elementos) hace unas decenas de medidas en vez de miles.
  // Primero se mide y después se escribe, para no obligar al navegador a recalcular estilos a cada paso.
  const sizeCache = new Map();
  const sig = (el) => { const v = el.closest(".view"); let k = v ? v.id : "-"; for (let e = el, i = 0; e && i < 3; e = e.parentElement, i++) k += "|" + e.tagName + "." + e.className; return k; };
  const floor16 = (root) => {
    const els = root.nodeType === 1 ? [root, ...root.querySelectorAll("*")] : [];
    const add = [];
    for (const el of els) {
      if (el.classList.contains("m16") || !ownText(el) || el.closest(SKIP16)) continue;
      const k = sig(el); let r = sizeCache.get(k);
      if (r === undefined) { const cs = getComputedStyle(el), fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight); r = fs && fs < 15.99 ? (lh && lh < 20 ? 2 : 1) : 0; if (!el.style.fontSize) sizeCache.set(k, r); }
      if (r) add.push([el, r === 2]);
    }
    for (const [el, lh] of add) { el.classList.add("m16"); if (lh) el.classList.add("m16lh"); }
  };
  const roots = [$("#main"), $(".site-foot")].filter(Boolean);
  let pending = new Set(), raf = 0;
  // «Posturas de los partidos» (#v-explorer) tiene sus tamaños en mejora.css (reglas fijas): aquí se salta entera.
  const flush = () => { raf = 0; const list = [...pending]; pending = new Set(); for (const n of list) if (n.isConnected && !n.closest("#v-explorer")) floor16(n); };
  for (const r of roots) { for (const c of r.children) if (c.id !== "v-explorer") floor16(c); new MutationObserver((ms) => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1) pending.add(n); else if (n.nodeType === 3 && n.parentElement) pending.add(n.parentElement); if (pending.size && !raf) raf = requestAnimationFrame(flush); }).observe(r, { childList: true, subtree: true }); }

  /* MEJORA: un único nivel 1 por vista. En el test y en el último paso el título visible es un <h2>; se marca como
     nivel 1 (aria-level) sin cambiar la etiqueta ni el texto. WCAG 1.3.1, 2.4.6. */
  const lvl1 = () => { for (const h of [$("#q-stmt"), $("#prios-h")]) if (h && h.getAttribute("aria-level") !== "1") h.setAttribute("aria-level", "1"); };
  lvl1(); if (qMain) new MutationObserver(lvl1).observe(qMain, { childList: true });

  /* MEJORA: «Volver arriba» (texto aprobado), flotante, al bajar media pantalla, en la portada, «Cómo funciona»,
     «Posturas de los partidos» y resultados. Lleva arriba y deja el foco en el título de la vista (o en el contenido). WCAG 2.4.1, 2.5.8. */
  if (T.volverArriba) {
    const btn = document.createElement("button"); btn.type = "button"; btn.className = "to-top"; btn.dataset.mejora = "texto-nuevo"; btn.setAttribute("aria-label", T.volverArriba); btn.tabIndex = -1;
    btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.body.append(btn);
    const where = () => { const v = $$(".view").find((x) => !x.hidden); return v ? v.id : ""; };
    // Todas las vistas salvo el test y el último paso (ahí taparía «Siguiente» o el teclado del móvil). Aparece al bajar
    // media pantalla. Se recalcula también al cambiar de vista (papeleta.js muestra y oculta las vistas con «hidden»).
    const upd = () => { const on = scrollY > innerHeight * 0.5 && !["v-quiz", "v-prios", ""].includes(where()); btn.classList.toggle("on", on); btn.tabIndex = on ? 0 : -1; btn.setAttribute("aria-hidden", String(!on)); };
    for (const v of $$(".view")) new MutationObserver(upd).observe(v, { attributes: true, attributeFilter: ["hidden"] });
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
    btn.addEventListener("click", () => {
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      const v = $(`#${where()}`), h = v && (v.querySelector("h1") || v.querySelector("h2"));
      const target = h || $("#main"); if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }
  /* MEJORA (rendimiento, pedido por el titular): «Posturas de los partidos» se abría con 1–2 s de retraso en el móvil
     porque papeleta.js vuelve a dibujar las 107 preguntas (≈ 12 000 elementos) cada vez que se entra, aunque nada
     haya cambiado. Si el listado nuevo es idéntico al que ya está en pantalla, no se vuelve a dibujar; si cambia
     (filtro de área, partido o búsqueda), se dibuja como siempre. WCAG 2.2.1 (sin esperas innecesarias). */
  const exRoot = $("#v-explorer");
  if (exRoot) {
    const hook = () => {
      const list = $("#ex-list", exRoot); if (!list || list.dataset.mejoraHook) return;
      list.dataset.mejoraHook = "1";
      const d = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
      let last = null;
      Object.defineProperty(list, "innerHTML", { configurable: true, get() { return d.get.call(this); }, set(v) { v = String(v); if (v === last) return; last = v; d.set.call(this, v); } });
    };
    new MutationObserver(hook).observe(exRoot, { childList: true });
    hook();
  }
})();
