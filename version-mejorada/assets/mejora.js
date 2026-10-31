// Test 29N · versión mejorada: comportamiento añadido. Se carga después de papeleta.js y no cambia ningún texto.
// Iteración 1: barra decorativa de duración en cada versión (formulario y banner móvil).
// Iteración 2: «Más contexto» como acordeón (panel bajo su botón, foco en el botón).
// Iteración 3: avisos aria-live, avance automático opcional, barra de progreso y provincia con buscador.
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
    buscarProvincia: PROPUESTA ? "Buscar provincia" : "",      // pendiente
    nCoinciden: PROPUESTA ? (n) => (n === 1 ? "1 provincia coincide" : `${n} provincias coinciden`) : null,          // pendiente
    ningunaCoincide: PROPUESTA ? "Ninguna provincia coincide con la búsqueda" : "",  // pendiente
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
})();
