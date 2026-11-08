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
  /* MEJORA (pedida por el titular): al empezar el test y al pasar de pregunta, papeleta.js lleva la página arriba del
     todo; con la letra más grande, en el móvil las respuestas quedaban cortadas por abajo. Ahora la pregunta y sus
     respuestas (del enunciado a «No lo sé») quedan centradas en la pantalla; si no caben enteras, el enunciado se coloca
     arriba, bajo la barra de progreso cuando está fija (el código y el área de la pregunta quedan justo encima). Sin animación: el salto es tan inmediato como antes. WCAG 2.4.3, 1.4.10. */
  const centerQuestion = () => {
    const main = $("#q-main"); if (!main || $("#v-quiz").hidden) return;
    const first = $("#q-stmt", main), last = $(".q-aux", main) || $(".scale", main); if (!first || !last) return;
    const bar = $(".quiz-bar"), mini = $(".q-mini");
    // Bloque 2: en el móvil la barra fina fija (.q-mini) ocupa la parte de arriba mientras se responde
    const fixed = bar && getComputedStyle(bar).position === "sticky" ? bar.getBoundingClientRect().height : mini && getComputedStyle(mini).display !== "none" ? mini.offsetHeight : 0;
    const top = first.getBoundingClientRect().top + scrollY, bottom = last.getBoundingClientRect().bottom + scrollY;
    const room = innerHeight - fixed, h = bottom - top;
    // La línea del código y el área nunca queda debajo de la barra (bloque 2: la barra fina la tapaba a medias)
    const meta = $(".q-meta", main), metaTop = meta ? meta.getBoundingClientRect().top + scrollY : top;
    let y = h <= room - 24 ? top - fixed - (room - h) / 2 : top - fixed - 12;
    y = Math.min(y, metaTop - fixed - 8);
    y = Math.max(0, Math.min(y, document.documentElement.scrollHeight - innerHeight));
    window.scrollTo({ top: y, behavior: "auto" });
  };
  // papeleta.js reescribe la pregunta y justo después sube la página: se centra en el fotograma siguiente
  const centerSoon = () => requestAnimationFrame(() => setTimeout(centerQuestion, 0));

  if (qMain && ctxBox && qGrid) {
    const desc = Object.getOwnPropertyDescriptor(Element.prototype, "innerHTML");
    const place = () => { const tools = $(".q-tools", qMain); if (tools && tools.nextElementSibling !== ctxBox) tools.after(ctxBox); };
    Object.defineProperty(qMain, "innerHTML", { configurable: true, get() { return desc.get.call(this); }, set(v) { qGrid.append(ctxBox); desc.set.call(this, v); place(); centerSoon(); } });
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
    autoguardado: "Autoguardado en este navegador",                // mejora 8
    noGuarda: "Sin guardar",                                       // mejora 8
    noGuardaAviso: "No se pueden guardar tus respuestas en este navegador (modo privado o sin espacio). Si cierras la página las perderás.",  // mejora 8
  };
  const store = { get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* sin almacenamiento */ } } };
  const quizView = $("#v-quiz");

  /* MEJORA: «Respuesta guardada» anunciado al lector de pantalla al elegir (región invisible). WCAG 4.1.3. */
  if (quizView && qMain) {
    const live = document.createElement("p"); live.className = "sr"; live.id = "ans-live"; live.setAttribute("aria-live", "polite"); live.dataset.mejora = "texto-nuevo";
    quizView.append(live);
    let tm = 0;
    const announce = () => { if (failed) return; live.textContent = ""; clearTimeout(tm); tm = setTimeout(() => { live.textContent = T.respuestaGuardada; }, 60); };
    qMain.addEventListener("change", (e) => { if (e.target.name === "ans") announce(); });
    // Con el paso automático activado, las teclas 0–5 guardan la respuesta sin evento «change»: también se anuncia
    document.addEventListener("ans-saved", announce);
  }
  // Aviso común de «respuesta guardada» para las teclas 0–5 (papeleta.js las procesa en document, después de esto)
  window.addEventListener("keydown", (e) => {
    if (!quizView || quizView.hidden || e.metaKey || e.ctrlKey || e.altKey || !/^[0-5]$/.test(e.key)) return;
    const tag = e.target.tagName; if (tag === "SELECT" || tag === "TEXTAREA" || (tag === "INPUT" && e.target.type !== "radio")) return;
    if (!$(`input[name=ans][value="${e.key}"]`, qMain)) return;
    setTimeout(() => document.dispatchEvent(new Event("ans-saved")), 0);
  }, true);

  /* BLOQUE B (8) · Guardado de respuestas
     MEJORA: se quita el párrafo fijo «Puedes cerrar y volver…». En su lugar: (1) un indicador discreto de autoguardado en
     la barra del test, (2) un aviso transitorio (2,5 s) al elegir, que se apaga al cambiar de pregunta o salir, y
     (3) un aviso permanente y accesible si el navegador no deja guardar (modo privado, sin espacio). WCAG 3.3.2, 4.1.3. */
  const progWrap = $(".qprog-wrap");
  let failed = false;
  const autoNote = document.createElement("p"); autoNote.className = "q-auto"; autoNote.dataset.mejora = "texto-nuevo";
  autoNote.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.6 3.6L15.5 6.5"/></svg><span></span>';
  const setAuto = () => { autoNote.classList.toggle("bad", failed); autoNote.querySelector("span").textContent = failed ? T.noGuarda : T.autoguardado; };
  setAuto(); if (progWrap) progWrap.append(autoNote);
  /* MEJORA: hitos de progreso (cuarto, mitad, tres cuartos) en la misma línea del indicador de autoguardado, durante 4 s.
     Es una región aria-live="polite" que solo cambia en estos casos. Contra la fatiga en el test largo (107 preguntas). */
  autoNote.setAttribute("aria-live", "polite");
  {
    const qc = $("#q-count"); let prev = 0, ht2 = 0;
    const HIT = [[.25, "Llevas un cuarto del test"], [.5, "Ya vas por la mitad"], [.75, "Te queda solo un cuarto"]];
    if (qc) new MutationObserver(() => {
      const m = /(\d+) de (\d+)/.exec(qc.textContent); if (!m) return; const n = +m[1], t = +m[2];
      const fwd = n === prev + 1; prev = n; if (!fwd || failed || t < 8) return;
      const h = HIT.find(([f]) => n - 1 === Math.round(t * f)); if (!h) return;
      autoNote.querySelector("span").textContent = h[1]; clearTimeout(ht2); ht2 = setTimeout(setAuto, 4000);
    }).observe(qc, { childList: true, characterData: true, subtree: true });
  }
  const warn = document.createElement("p"); warn.className = "save-warn"; warn.setAttribute("role", "alert"); warn.hidden = true; warn.dataset.mejora = "texto-nuevo";
  warn.textContent = T.noGuardaAviso; if (quizView) quizView.prepend(warn);
  document.addEventListener("save-failed", () => { if (failed) return; failed = true; setAuto(); warn.hidden = false; });
  /* 5 nov: se quita el cartel «Respuesta guardada» tras cada respuesta (saturaba, a petición del titular). El guardado sigue
     igual; se mantienen el indicador discreto, el anuncio invisible para el lector de pantalla y el aviso si falla. */

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

  /* BLOQUE 2 (2 nov) · Durante el test, en el móvil
     MEJORA: al centrar cada pregunta, la barra del test (contador, área y progreso) queda por encima de la pantalla y
     «Anterior» al final de la página. En el móvil (≤ 560 px), mientras esa barra no se ve, aparece arriba una barra fina
     fija con «Anterior», «Pregunta N de M», el área y una línea de progreso. Repite los textos de la barra original
     (sin textos nuevos) y su botón usa el mismo «Anterior» del test: vuelve a la pregunta con la respuesta marcada,
     para cambiarla. Los textos van ocultos al lector de pantalla, que ya los tiene en la barra original.
     WCAG 2.4.8 (ubicación), 3.2.3 (navegación coherente), 2.5.8 (objetivo de 44 px). */
  const qBar = $(".quiz-bar"), qCount = $("#q-count"), qLabel = $("#q-prog-label"), qProg = $("#q-prog");
  if (quizView && qBar && qCount && qProg) {
    const mini = document.createElement("div"); mini.className = "q-mini"; mini.dataset.mejora = "bloque-2";
    mini.innerHTML = '<button type="button" class="q-mini-prev" aria-label="Pregunta anterior"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5L7 10l5.5 5.5"/></svg><span aria-hidden="true">Anterior</span></button><p class="q-mini-txt" aria-hidden="true"><b></b><span></span></p><span class="q-mini-line" aria-hidden="true"><i></i></span>';
    quizView.append(mini);
    /* 7 nov: la barra fina tapaba la línea de autoguardado y los hitos de progreso. Ahora repite aquí, en una tercera línea,
       solo lo que no es el texto de siempre: los hitos («Ya vas por la mitad») y el «Sin guardar». */
    const mmsg = document.createElement("em"); mmsg.className = "q-mini-msg"; mmsg.hidden = true; $(".q-mini-txt", mini).append(mmsg);
    const syncMsg = () => { const t = autoNote.querySelector("span").textContent; const extra = t !== T.autoguardado; mmsg.hidden = !extra; mmsg.textContent = extra ? t : ""; };
    new MutationObserver(syncMsg).observe(autoNote, { childList: true, characterData: true, subtree: true }); syncMsg();
    const btn = $(".q-mini-prev", mini), b = $(".q-mini-txt b", mini), sp = $(".q-mini-txt span", mini), line = $(".q-mini-line i", mini);
    const sync = () => {
      b.textContent = qCount.textContent;
      sp.textContent = (qLabel && qLabel.textContent.replace(/^Área \d+ de \d+ · /, "")) || "";
      const now = Number(qProg.getAttribute("aria-valuenow")) || 0, max = Number(qProg.getAttribute("aria-valuemax")) || 1;
      line.style.width = `${Math.round(now / max * 100)}%`;
      // En la primera pregunta «Anterior» llevaría a la portada: aquí no se ofrece
      btn.hidden = /^Pregunta 1 de /.test(qCount.textContent);
    };
    new MutationObserver(sync).observe(qCount, { childList: true, characterData: true, subtree: true });
    new MutationObserver(sync).observe(qProg, { attributes: true, attributeFilter: ["aria-valuenow", "aria-valuemax"] });
    sync();
    btn.addEventListener("click", () => { const p = $("#q-prev"); if (p) p.click(); });
    // Visible mientras la barra original no se ve casi entera (si solo asoma un trozo, no sirve para orientarse)
    new IntersectionObserver(([e]) => mini.classList.toggle("on", e.intersectionRatio < 0.9), { threshold: [0, 0.9, 1] }).observe(qBar);
  }

  /* BLOQUE 3 (2 nov) · Portada más corta en el móvil
     MEJORA: en el móvil (≤ 760 px) la portada ocupaba unas 9 pantallas. «Cómo funciona», «Qué lo hace distinto» y
     «Las 12 áreas del test» se pliegan: su título pasa a ser un botón con «+» que despliega el contenido (patrón de
     acordeón de WAI-ARIA: el botón va dentro del título y lleva aria-expanded y aria-controls). No cambia ni se quita
     ningún texto: sigue en la página (lo leen igual los buscadores) y en ordenador todo queda como estaba.
     «Preguntas frecuentes» se queda abierta a propósito (qa/seo.mjs lo exige). WCAG 1.3.1, 2.4.6, 4.1.2. */
  const FOLD_MQ = matchMedia("(max-width: 760px)");
  const folds = [["how-h", ".hw"], ["diff-h", ".diff, .two-col > div > p.small"], ["temas-h", ".topic-list, :scope > p.small"], ["faq-h", ".faq"], ["areas-h", "#areas-list"]].map(([hid, body]) => {
    const h = document.getElementById(hid), sec = h && h.closest("section"); if (!sec) return null;
    return { h, sec, bodies: $$(body, sec), text: h.textContent };
  }).filter(Boolean);
  const buildFolds = () => {
    for (const f of folds) {
      const on = FOLD_MQ.matches, btn = $(".m-fold-btn", f.h);
      if (on && !btn) {
        const id = `${f.h.id}-body`; f.bodies.forEach((b, i) => { b.classList.add("m-fold-body"); if (!i && !b.id) b.id = id; });
        const b = document.createElement("button"); b.type = "button"; b.className = "m-fold-btn"; b.setAttribute("aria-expanded", "false");
        b.setAttribute("aria-controls", f.bodies.map((x) => x.id).filter(Boolean).join(" "));
        b.textContent = f.text; f.h.textContent = ""; f.h.append(b); f.sec.classList.add("m-fold");
        b.addEventListener("click", () => { const open = b.getAttribute("aria-expanded") !== "true"; b.setAttribute("aria-expanded", String(open)); f.sec.classList.toggle("open", open); });
      } else if (!on && btn) { f.h.textContent = f.text; f.sec.classList.remove("m-fold", "open"); f.bodies.forEach((b) => b.classList.remove("m-fold-body")); }
    }
  };
  buildFolds();
  FOLD_MQ.addEventListener("change", buildFolds);
  // 8 nov: si un enlace interno (o ?tema=) apunta a algo que está dentro de un apartado plegado, se despliega antes de ir allí
  const openFoldFor = (el) => { const sec = el && el.closest && el.closest(".m-fold"); if (!sec || sec.classList.contains("open")) return; const b = $(".m-fold-btn", sec); if (b) { b.setAttribute("aria-expanded", "true"); sec.classList.add("open"); } };
  window.openFoldFor = openFoldFor;
  document.addEventListener("click", (e) => { const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href").length < 2) return; const t = document.getElementById(a.getAttribute("href").slice(1)); if (t) openFoldFor(t); }, true);
})();

/* BLOQUE 15 (8 nov) · Cómo funciona: recorrido de cuatro pasos con demostración manejable
   MEJORA: pestañas accesibles (flechas, Inicio, Fin) y una demostración por paso. Avanza sola cada 6 s mientras
   está a la vista, se detiene al tocar cualquier cosa y no avanza con movimiento reducido. Sin JavaScript se ven los
   cuatro pasos uno debajo de otro. */
(function () {
  const hw = document.getElementById("hw"); if (!hw) return;
  const tabs = [...hw.querySelectorAll(".hw-tab")], panels = [...hw.querySelectorAll(".hw-panel")];
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let cur = 0, timer = 0, stopped = calm, visible = false;
  hw.classList.add("on");
  const show = (i, focus) => {
    cur = (i + tabs.length) % tabs.length;
    tabs.forEach((t, k) => { t.setAttribute("aria-selected", String(k === cur)); t.tabIndex = k === cur ? 0 : -1; });
    panels.forEach((p, k) => { p.hidden = k !== cur; });
    if (focus) tabs[cur].focus();
    schedule();
  };
  const schedule = () => {
    clearTimeout(timer); hw.classList.remove("play");
    if (stopped || !visible) return;
    void hw.offsetWidth; hw.classList.add("play");
    timer = setTimeout(() => show(cur + 1), 6000);
  };
  const stop = () => { stopped = true; clearTimeout(timer); hw.classList.remove("play"); };
  tabs.forEach((t, k) => t.addEventListener("click", () => { stop(); show(k); }));
  hw.querySelector(".hw-tabs").addEventListener("keydown", (e) => {
    const m = { ArrowRight: cur + 1, ArrowDown: cur + 1, ArrowLeft: cur - 1, ArrowUp: cur - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (m === undefined) return; e.preventDefault(); stop(); show(m, true);
  });
  hw.querySelector(".hw-stage").addEventListener("pointerdown", stop);
  hw.querySelector(".hw-stage").addEventListener("focusin", stop);
  // Demo 1: versión
  const modes = hw.querySelector(".hw-modes"), out0 = panels[0].querySelector(".hw-out"), meter = panels[0].querySelector(".hw-meter i");
  modes.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    modes.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    out0.innerHTML = "<b>" + b.dataset.n + "</b> preguntas · unos <b>" + b.dataset.m + "</b> minutos";
    meter.style.setProperty("--w", Math.max(8, Math.round(b.dataset.n / 107 * 100)) + "%");
  });
  // Demo 2: respuesta
  const scale = panels[1].querySelector(".hw-scale"), out1 = panels[1].querySelector(".hw-out"), star = panels[1].querySelector(".hw-star"), skip = panels[1].querySelector(".hw-skip");
  const say = (t) => { out1.textContent = t; };
  scale.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    skip.setAttribute("aria-pressed", "false");
    scale.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", String(x === b)));
    say("Has marcado " + b.textContent + ": " + b.dataset.t + (star.getAttribute("aria-pressed") === "true" ? ", y te importa mucho." : "."));
  });
  star.addEventListener("click", () => { const on = star.getAttribute("aria-pressed") !== "true"; star.setAttribute("aria-pressed", String(on)); star.textContent = (on ? "★" : "☆") + " Me importa mucho"; say(on ? "Esta pregunta pesará más en tu resultado." : "Vuelve a pesar lo normal."); });
  skip.addEventListener("click", () => { const on = skip.getAttribute("aria-pressed") !== "true"; skip.setAttribute("aria-pressed", String(on)); scale.querySelectorAll("button").forEach((x) => x.setAttribute("aria-checked", "false")); say(on ? "«No lo sé»: esta pregunta no cuenta en tu resultado." : "Pulsa una respuesta."); });
  // Demo 3: áreas (máximo tres)
  const areas = panels[2].querySelector(".hw-areas"), out2 = panels[2].querySelector(".hw-out");
  areas.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    const on = b.getAttribute("aria-pressed") === "true", n = areas.querySelectorAll('[aria-pressed="true"]').length;
    if (!on && n >= 3) { out2.innerHTML = "Ya tienes <b>3</b> de 3. Quita una para elegir otra."; return; }
    b.setAttribute("aria-pressed", String(!on));
    const m = areas.querySelectorAll('[aria-pressed="true"]').length;
    out2.innerHTML = "<b>" + m + "</b> de 3 áreas elegidas" + (m ? "" : ". Sin elegir, todas pesan igual.");
  });
  if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { visible = en.isIntersecting; schedule(); }, { threshold: 0.4 }).observe(hw);
})();
