/* Test 29N — aplicación
   Estructura: datos → estado → vistas (inicio, test, prioridades, resultados, metodología, explorador).
   El cálculo (sección CÁLCULO) son funciones puras sobre el estado; las vistas solo pintan. */
(() => {
"use strict";

// ───────────────────────────── Configuración
const ARTIFACT_URL = "https://claude.ai/artifact/AwTtH6GM3GMWjFxDVVb6yV";
// Dirección pública que se comparte cuando la web no se está usando desde ella misma
const PUBLIC_URL = "https://menendezpeoe-maker.github.io/";
// Aportaciones voluntarias: enlace público de Ko-fi o PayPal del titular. Vacío = botón desactivado.
const DONATE_URL = "";
// Titular de la web para el aviso legal. Vacío = no se muestra.
const OWNER = { name: "", email: "" };
const KEY = "papeleta29n.v2";
const PREFS_KEY = "papeleta29n.prefs";
const W_IMPORTANT = 2;      // pregunta marcada como importante
const W_PRIORITY = 1.5;     // área elegida como prioritaria
const W_ESTIMATED = 0.6;    // postura de partido estimada (no documentada)
const W_NEUTRAL = 0.5;      // respuesta «ni de acuerdo ni en desacuerdo»: cuenta, pero informa menos
const MIN_COVERAGE = 0.5;   // por debajo, la coincidencia se acerca al 50 %
const MODES = {
  expres: { label: "Exprés", mins: 5 },
  media: { label: "Media", mins: 10 },
  completa: { label: "Completa", mins: 20 }
};
const LIK = ["Totalmente en desacuerdo", "En desacuerdo", "Ni de acuerdo ni en desacuerdo", "De acuerdo", "Totalmente de acuerdo"];
const LIK_LOW = ["totalmente en desacuerdo", "en desacuerdo", "neutral", "de acuerdo", "totalmente de acuerdo"];
const DIL = ["Claramente A", "Más bien A", "Las dos por igual", "Más bien B", "Claramente B"];
const DIM_PHRASE = {
  eco: ["más Estado en economía", "más mercado en economía"],
  soc: ["posiciones progresistas en valores", "posiciones tradicionales en valores"],
  lib: ["más garantías y libertades", "más orden y control"],
  ter: ["más autogobierno territorial", "más centralización"],
  inm: ["más apertura en inmigración", "más control migratorio"],
  eur: ["más integración europea", "más soberanía nacional"],
  amb: ["prioridad ambiental", "prioridad productiva"]
};
const DIM_SHORT = { eco: "economía", soc: "valores sociales", lib: "libertades y seguridad", ter: "modelo territorial", inm: "inmigración", eur: "Europa", amb: "medioambiente" };

// ───────────────────────────── Utilidades
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* almacenamiento no disponible */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* idem */ } }
};
const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const isSheet = () => matchMedia("(max-width: 1039.98px)").matches;
const signed = (v) => { const r = Math.round(v); return r > 0 ? `+${r}` : r < 0 ? `−${Math.abs(r)}` : "0"; };
const lcFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const pctPos = (v) => ((v + 100) / 2).toFixed(2);
function mulberry(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hashStr(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function shuffled(arr, rnd) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function textOn(hex) { const n = parseInt(hex.slice(1), 16); const L = (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255; return L > 0.58 ? "#111318" : "#FFFFFF"; }
const ICON = {
  info: '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M10 9v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="6.2" r="1.1" fill="currentColor"/></svg>',
  starO: '<svg class="ico star-o" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  starF: '<svg class="ico star-f" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2.8l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L2.8 8.1l5-.7z" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  tick: '<svg class="tick" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.6 3.6L15.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10.5l3.6 3.6L15.5 6.5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ok: '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true" style="color:var(--ok)"><circle cx="10" cy="10" r="9" fill="currentColor"/><path d="M5.8 10.3l2.8 2.8 5.6-6" fill="none" stroke="var(--sheet)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  ko: '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true" style="color:var(--ko)"><circle cx="10" cy="10" r="9" fill="currentColor"/><path d="M6.6 6.6l6.8 6.8M13.4 6.6l-6.8 6.8" fill="none" stroke="var(--sheet)" stroke-width="2.2" stroke-linecap="round"/></svg>',
  neu: '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true" style="color:var(--ink-3)"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2"/><path d="M6.5 10h7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
  na: '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true" style="color:var(--rule)"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3 3"/></svg>',
  warn: '<svg class="ico" viewBox="0 0 20 20" aria-hidden="true" style="color:var(--warn)"><path d="M10 2.5l8 14.5H2z" fill="currentColor"/><path d="M10 8v4.5" stroke="var(--sheet)" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="14.6" r="1.1" fill="var(--sheet)"/></svg>'
};

// ───────────────────────────── Datos
let BANK = null, PD = null, POLS = [];
const Q = {}, AREA = {}, DIM = {}, P = {}, PROV = {};
let PIDS = [], PROV_LIST = [];
const PARTY_DIM = {}, PARTY_AREA = {};

async function loadData() {
  const get = (u) => fetch(u, { cache: "no-cache" }).then((r) => { if (!r.ok) throw new Error(`${u}: ${r.status}`); return r.json(); });
  // Los políticos son un extra: si no cargan, el test funciona igual
  const pols = get("data/politicos.json").then((d) => d.politicians, () => []);
  [BANK, PD] = await Promise.all([get("data/preguntas.json"), get("data/partidos.json")]);
  POLS = await pols;
  BANK.questions.forEach((q) => { Q[q.id] = q; });
  BANK.areas.forEach((a, i) => { AREA[a.id] = { ...a, idx: i }; });
  BANK.dims.forEach((d) => { DIM[d.id] = d; });
  PD.parties.forEach((p) => { P[p.id] = p; });
  PIDS = PD.order;
  PD.regions.forEach((r) => r.provs.forEach((p) => { PROV[p.id] = { ...p, region: r.id, regionName: r.name }; PROV_LIST.push(p.id); }));
  // Posición de cada partido en dimensiones y áreas, con todas sus posturas del banco
  for (const pid of PIDS) {
    const dAcc = {}, aAcc = {};
    for (const q of BANK.questions) {
      const v = q.pos[pid]; if (!v) continue;
      const c = q.est.includes(pid) ? W_ESTIMATED : 1;
      const s = (v - 3) / 2 * 100;
      if (q.dim) { const o = (dAcc[q.dim] ||= [0, 0]); o[0] += c * s * q.dir; o[1] += c; }
      if (q.lr) { const o = (aAcc[q.area] ||= [0, 0]); o[0] += c * s * q.lr; o[1] += c; }
    }
    PARTY_DIM[pid] = Object.fromEntries(Object.entries(dAcc).map(([k, [s, w]]) => [k, s / w]));
    PARTY_AREA[pid] = Object.fromEntries(Object.entries(aAcc).map(([k, [s, w]]) => [k, s / w]));
  }
}

function runsIn(pid, provId) {
  const s = P[pid].scope, r = PROV[provId]?.region;
  if (!r) return false;
  if (s.all) return !(s.except || []).includes(r);
  if (s.regions) return s.regions.includes(r);
  if (s.provinces) return s.provinces.includes(provId);
  return false;
}
const partiesIn = (provId) => PIDS.filter((pid) => runsIn(pid, provId));
function pName(pid, provId) { const p = P[pid]; const r = PROV[provId]?.region; return (p.local && r && p.local[r]) || p.name; }
function logo(pid, cls = "") { const p = P[pid]; return `<span class="logo ${cls}" style="background:${p.color};color:${textOn(p.color)}" aria-hidden="true">${esc(p.ab)}</span>`; }
const qCode = (q) => `${AREA[q.area].letter}·${q.id.slice(1)}`;

// ───────────────────────────── Selección de preguntas
// Reproducible: misma semilla y versión → mismo cuestionario. Siempre incluye la pregunta núcleo de
// cada área y completa con preguntas que compensan el sesgo izquierda-derecha de las ya elegidas.
function pickBalanced(cands, chosen, n) {
  const pool = [...cands], res = [];
  let sum = chosen.reduce((s, q) => s + q.lr, 0);
  while (res.length < n && pool.length) {
    let i = 0;
    if (sum !== 0) { const j = pool.findIndex((q) => Math.sign(q.lr) === -Math.sign(sum)); if (j >= 0) i = j; }
    const q = pool.splice(i, 1)[0];
    res.push(q); sum += q.lr;
  }
  return res;
}
function buildOrder(mode, seed) {
  const out = [];
  for (const a of BANK.areas) {
    const qs = BANK.questions.filter((q) => q.area === a.id);
    const rnd = mulberry((seed ^ hashStr(a.id)) >>> 0);
    const p1 = qs.filter((q) => q.prio === 1);
    const p2 = shuffled(qs.filter((q) => q.prio === 2), rnd);
    const p3 = shuffled(qs.filter((q) => q.prio === 3), rnd);
    let pick;
    if (mode === "completa") pick = [...p1, ...pickBalanced(p2, p1, p2.length), ...pickBalanced(p3, p1, p3.length)];
    else if (mode === "media") { const two = pickBalanced(p2, p1, 2); pick = [...p1, ...two, ...pickBalanced(p3, [...p1, ...two], 1)]; }
    else pick = [...p1, ...pickBalanced(p2, p1, 1)];
    out.push(...pick.map((q) => q.id));
  }
  return out;
}
const newSeed = () => Math.floor(Math.random() * 46655) + 1;

// ───────────────────────────── Estado
let S = null;          // test propio
let SHARED = null;     // resultado abierto desde un enlace compartido (solo lectura)
let PREFS = store.get(PREFS_KEY) || { ctx: false };
let CURRENT = "home";
const UI = { cmp: null, mx: "eco", my: "soc", scope: "prov", reviewFilter: "all" };
const savePrefs = () => store.set(PREFS_KEY, PREFS);
const save = () => { if (S) { S.t = Date.now(); store.set(KEY, S); } };
const ST = () => SHARED || S;

function loadState() {
  const s = store.get(KEY);
  if (!s || s.v !== 2 || !Array.isArray(s.order) || typeof s.ans !== "object") return null;
  s.order = s.order.filter((id) => Q[id]);
  for (const k of Object.keys(s.ans)) if (!Q[k] || ![0, 1, 2, 3, 4, 5].includes(s.ans[k])) delete s.ans[k];
  s.imp = s.imp && typeof s.imp === "object" ? s.imp : {};
  s.prios = Array.isArray(s.prios) ? s.prios.filter((a) => AREA[a]).slice(0, 3) : [];
  if (!PROV[s.prov] || !s.order.length) return null;
  s.idx = Math.min(Math.max(0, s.idx | 0), s.order.length - 1);
  return s;
}

// ───────────────────────────── Navegación entre vistas
const VIEWS = ["home", "quiz", "prios", "results", "method", "explorer", "error"];
function go(view, { focus = true, scroll = true } = {}) {
  for (const v of VIEWS) $(`#v-${v}`).hidden = v !== view;
  CURRENT = view;
  document.body.classList.toggle("in-quiz", view === "quiz" || view === "prios");
  $$(".navlink").forEach((b) => { if (b.dataset.go === view) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
  if (view !== "quiz") { $("#ctx").hidden = true; document.documentElement.style.setProperty("--sheet-h", "0px"); }
  const el = $(`#v-${view}`);
  if (!reduceMotion()) { el.classList.remove("enter"); void el.offsetWidth; el.classList.add("enter"); }
  if (scroll) window.scrollTo(0, 0);
  if (focus) { const h = el.querySelector("h1, h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
}

// ───────────────────────────── INICIO
function initHome() {
  const sel = $("#f-prov");
  sel.innerHTML = '<option value="">Elige tu provincia…</option>' + PD.regions.map((r) =>
    `<optgroup label="${esc(r.name)}">${r.provs.map((p) => `<option value="${p.id}">${esc(p.name)}</option>`).join("")}</optgroup>`).join("");
  sel.disabled = false;
  sel.addEventListener("change", renderProvChips);
  $$("[data-count]").forEach((el) => { el.textContent = buildOrder(el.dataset.count, 1).length; });
  $("#areas-list").innerHTML = BANK.areas.map((a) => {
    const n = BANK.questions.filter((q) => q.area === a.id).length;
    return `<li><span class="al">${a.letter}</span><b>${esc(a.name)}</b><span>${esc(a.intro)} ${n} preguntas.</span></li>`;
  }).join("");
  const ex = Q.C01;
  if (ex) { $("#ex-code").textContent = qCode(ex); $("#ex-area").textContent = AREA[ex.area].name; $("#ex-text").textContent = ex.text; $("#ex-ctx").textContent = ex.ctx; }
  $("#foot-version").textContent = `Banco de preguntas v${BANK.version} · ${BANK.questions.length} preguntas · actualizado el 17 de octubre de 2026`;
  $("#setup").addEventListener("submit", startTest);
  fillSetup();
}
function fillSetup(s = S) {
  if (s) {
    $("#f-prov").value = s.prov || "";
    $$('input[name=sex]').forEach((i) => { i.checked = i.value === s.sex; });
    $("#f-age").value = s.age || "";
    $$('input[name=mode]').forEach((i) => { i.checked = i.value === s.mode; });
  }
  renderProvChips(); renderResume();
}
function renderProvChips() {
  const v = $("#f-prov").value, box = $("#prov-chips");
  if (!v) { box.innerHTML = '<span class="muted small">Al elegirla verás qué candidaturas se presentan allí.</span>'; return; }
  const list = partiesIn(v);
  box.innerHTML = list.map((pid) => `<span class="chip${P[pid].tbd ? " tbd" : ""}"><i class="sw" style="background:${P[pid].color}"></i>${esc(pName(pid, v))}${P[pid].tbd ? " · por confirmar" : ""}</span>`).join("")
    + `<span class="small muted" style="align-self:center">${list.length} candidaturas en ${esc(PROV[v].name)}</span>`;
}
function renderResume() {
  const box = $("#resume");
  if (!S) { box.hidden = true; return; }
  const done = S.order.filter((id) => S.ans[id] !== undefined).length;
  if (S.stage === "done") {
    box.innerHTML = `<p><b>Tienes un resultado guardado.</b> ${MODES[S.mode].label}, ${esc(PROV[S.prov].name)}.</p><button type="button" class="btn btn-primary btn-sm" data-act="see-results">Ver mis resultados</button>`;
  } else if (done > 0) {
    box.innerHTML = `<p><b>Tienes un test a medias:</b> ${done} de ${S.order.length} respondidas. Si empiezas uno nuevo, se sustituirá.</p><button type="button" class="btn btn-primary btn-sm" data-act="resume">Continuar</button>`;
  } else { box.hidden = true; return; }
  box.hidden = false;
}
function startTest(e) {
  e.preventDefault();
  const prov = $("#f-prov").value;
  const sex = ($('input[name=sex]:checked') || {}).value;
  const ageRaw = $("#f-age").value.trim();
  const age = Number(ageRaw);
  const mode = ($('input[name=mode]:checked') || {}).value || "expres";
  const missing = [];
  if (!prov) missing.push("elige tu provincia");
  if (!sex) missing.push("indica tu sexo o «Prefiero no responder»");
  if (!ageRaw || !Number.isInteger(age) || age < 16 || age > 110) missing.push("escribe tu edad, entre 16 y 110 años");
  const err = $("#setup-err");
  if (missing.length) {
    err.textContent = `Para empezar, ${missing.join("; ")}.`;
    (!prov ? $("#f-prov") : !sex ? $("#f-sex-m") : $("#f-age")).focus();
    return;
  }
  err.textContent = "";
  const seed = newSeed();
  S = { v: 2, bank: BANK.version, prov, sex, age, mode, seed, order: buildOrder(mode, seed), idx: 0, ans: {}, imp: {}, prios: [], stage: "quiz", t: Date.now() };
  SHARED = null; SH.edited = false;
  save();
  renderQuestion(0);
  go("quiz", { focus: false });
  focusStatement();
}

// ───────────────────────────── TEST
let lastPointer = 0, advanceTimer = 0;
const curQ = () => Q[S.order[S.idx]];

function renderProgress() {
  const order = S.order, bar = $("#q-prog");
  const areas = BANK.areas.filter((a) => order.some((id) => Q[id].area === a.id));
  const cur = curQ();
  bar.innerHTML = areas.map((a) => {
    const ids = order.filter((id) => Q[id].area === a.id);
    const done = ids.filter((id) => S.ans[id] !== undefined).length;
    return `<span class="seg-a${a.id === cur.area ? " cur" : ""}" style="--w:${ids.length};--f:${(done / ids.length * 100).toFixed(1)}%" title="${esc(a.name)}: ${done}/${ids.length}"><i></i></span>`;
  }).join("");
  const answered = order.filter((id) => S.ans[id] !== undefined).length;
  bar.setAttribute("aria-valuemax", order.length);
  bar.setAttribute("aria-valuenow", answered);
  bar.setAttribute("aria-valuetext", `${answered} de ${order.length} respondidas`);
  const ai = areas.findIndex((a) => a.id === cur.area);
  $("#q-prog-label").textContent = `Bloque ${ai + 1} de ${areas.length} · ${AREA[cur.area].name}`;
  $("#q-count").textContent = `${String(S.idx + 1).padStart(2, "0")} / ${order.length}`;
}

function renderQuestion(dir) {
  const q = curQ(), a = AREA[q.area], v = S.ans[q.id], N = S.order.length;
  const prev = S.idx > 0 ? Q[S.order[S.idx - 1]] : null;
  const firstOfArea = !prev || prev.area !== q.area;
  const areasInOrder = BANK.areas.filter((x) => S.order.some((id) => Q[id].area === x.id));
  const labels = q.type === "dilema" ? DIL : LIK;
  const open = !!PREFS.ctx;
  const main = $("#q-main");
  main.innerHTML = `
    <p class="q-meta"><span class="q-code">${qCode(q)}</span><span>${esc(a.name)}</span>${q.type === "dilema" ? '<span class="muted">· Dilema: elige entre dos opciones</span>' : ""}</p>
    ${firstOfArea ? `<p class="q-intro"><b>Bloque ${areasInOrder.findIndex((x) => x.id === a.id) + 1} de ${areasInOrder.length}.</b> ${esc(a.intro)}</p>` : ""}
    <h2 class="q-stmt" id="q-stmt" tabindex="-1">${esc(q.text)}</h2>
    ${q.type === "dilema" ? `<div class="dil"><p class="dil-o"><b>A</b><span>${esc(q.A)}</span></p><p class="dil-o"><b>B</b><span>${esc(q.B)}</span></p></div>` : ""}
    <div class="q-tools">
      <button type="button" class="ctx-toggle" id="ctx-toggle" aria-expanded="${open}" aria-controls="ctx">${ICON.info}<span>${open ? "Ocultar contexto" : "Más contexto"}</span></button>
    </div>
    <fieldset>
      <legend class="sr">Tu respuesta: ${esc(q.short)}</legend>
      <div class="scale">${labels.map((l, i) => `<label class="opt"><input type="radio" name="ans" value="${i + 1}"${v === i + 1 ? " checked" : ""}><span class="box"><span class="n">${i + 1}</span><span class="t">${l}</span>${ICON.tick}</span></label>`).join("")}</div>
      <div class="q-aux" style="margin-top:12px">
        <label class="opt-ns"><input type="radio" name="ans" value="0"${v === 0 ? " checked" : ""}><span>No lo sé · no tengo suficiente información</span></label>
        <button type="button" class="imp" id="imp-btn" aria-pressed="${!!S.imp[q.id]}">${ICON.starO}${ICON.starF}<span>Me importa especialmente</span></button>
      </div>
    </fieldset>
    <p class="err" id="q-err" role="alert"></p>
    <div class="q-nav">
      <button type="button" class="btn btn-ghost btn-sm" id="q-prev">${S.idx === 0 ? "Volver al inicio" : "Anterior"}</button>
      <span class="kbd">Teclas 1-5 · 0 «No lo sé» · C contexto · Intro siguiente</span>
      <button type="button" class="btn btn-primary btn-sm" id="q-next">${S.idx === N - 1 ? "Terminar" : "Siguiente"}</button>
    </div>`;
  if (dir && !reduceMotion()) { main.classList.remove("swap"); void main.offsetWidth; main.classList.add("swap"); }
  renderProgress();
  setCtx(open, { focus: false });
}
function focusStatement() { const h = $("#q-stmt"); if (h) h.focus({ preventScroll: true }); }

function setAnswer(v) {
  const q = curQ();
  S.ans[q.id] = v;
  save();
  $("#q-err").textContent = "";
  $$('#q-main input[name=ans]').forEach((i) => { i.checked = Number(i.value) === v; });
  renderProgress();
}
function scheduleAdvance() {
  clearTimeout(advanceTimer);
  advanceTimer = setTimeout(next, reduceMotion() ? 120 : 340);
}
function next() {
  clearTimeout(advanceTimer);
  const q = curQ();
  if (S.ans[q.id] === undefined) {
    $("#q-err").textContent = "Elige una opción del 1 al 5 o marca «No lo sé» para seguir.";
    const first = $('#q-main input[name=ans]'); if (first) first.focus();
    return;
  }
  if (S.idx >= S.order.length - 1) { finishQuiz(); return; }
  S.idx++; save();
  renderQuestion(1);
  focusStatement();
  if (isSheet() && PREFS.ctx) $("#ctx-body").scrollTop = 0;
  window.scrollTo({ top: 0, behavior: "auto" });
}
function prev() {
  clearTimeout(advanceTimer);
  if (S.idx === 0) { save(); fillSetup(); go("home"); return; }
  S.idx--; save();
  renderQuestion(-1);
  focusStatement();
}
function finishQuiz() {
  S.stage = "prios"; save();
  renderPrios();
  go("prios");
}

// Panel de contexto: no cambia la respuesta ni el progreso
function setCtx(open, { focus = false } = {}) {
  PREFS.ctx = open; savePrefs();
  const aside = $("#ctx");
  aside.hidden = !open;
  $("#quiz-grid").classList.toggle("with-ctx", open);
  const t = $("#ctx-toggle");
  if (t) { t.setAttribute("aria-expanded", String(open)); t.querySelector("span").textContent = open ? "Ocultar contexto" : "Más contexto"; }
  if (open) {
    const q = curQ();
    $("#ctx-body").innerHTML = `<p class="cq">${esc(q.short)}</p><p class="ct">${esc(q.ctx)}</p>${q.ley ? `<p class="cl"><b>Marco legal:</b> ${esc(q.ley)}</p>` : ""}<p class="cn">Información neutral para entender la cuestión: no indica qué responder. Abrirla o cerrarla no cambia tu respuesta.</p>`;
    if (focus) $("#ctx-h").focus({ preventScroll: !isSheet() });
  } else if (focus && t) t.focus();
  updateSheetPad();
}
function updateSheetPad() {
  const aside = $("#ctx");
  const h = !aside.hidden && isSheet() ? aside.getBoundingClientRect().height : 0;
  document.documentElement.style.setProperty("--sheet-h", `${Math.round(h)}px`);
}

function bindQuiz() {
  const main = $("#q-main");
  main.addEventListener("pointerdown", (e) => { if (e.target.closest(".opt, .opt-ns")) lastPointer = Date.now(); });
  main.addEventListener("change", (e) => {
    if (e.target.name !== "ans") return;
    setAnswer(Number(e.target.value));
    if (Date.now() - lastPointer < 1200) scheduleAdvance();
  });
  main.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.id === "q-next") next();
    else if (b.id === "q-prev") prev();
    else if (b.id === "ctx-toggle") setCtx(!PREFS.ctx, { focus: true });
    else if (b.id === "imp-btn") {
      const q = curQ(); S.imp[q.id] = !S.imp[q.id]; if (!S.imp[q.id]) delete S.imp[q.id];
      b.setAttribute("aria-pressed", String(!!S.imp[q.id])); save();
    }
  });
  $("#ctx-close").addEventListener("click", () => setCtx(false, { focus: true }));
  $("#q-exit").addEventListener("click", () => { save(); fillSetup(); go("home"); });
  new ResizeObserver(updateSheetPad).observe($("#ctx"));
  addEventListener("resize", updateSheetPad);
  document.addEventListener("keydown", (e) => {
    if (CURRENT !== "quiz" || e.metaKey || e.ctrlKey || e.altKey) return;
    const tag = e.target.tagName;
    if (tag === "SELECT" || tag === "TEXTAREA" || (tag === "INPUT" && e.target.type !== "radio")) return;
    if (/^[1-5]$/.test(e.key)) { e.preventDefault(); lastPointer = Date.now(); setAnswer(Number(e.key)); scheduleAdvance(); }
    else if (e.key === "0") { e.preventDefault(); setAnswer(0); scheduleAdvance(); }
    else if (e.key === "c" || e.key === "C" || e.key === "i" || e.key === "I") { e.preventDefault(); setCtx(!PREFS.ctx, { focus: true }); }
    else if (e.key === "Escape" && PREFS.ctx) { e.preventDefault(); setCtx(false, { focus: true }); }
    else if (e.key === "Enter" && tag !== "BUTTON") { e.preventDefault(); next(); }
  });
}

// ───────────────────────────── PRIORIDADES
function renderPrios() {
  const grid = $("#prio-grid");
  const full = S.prios.length >= 3;
  grid.innerHTML = BANK.areas.map((a) => {
    const on = S.prios.includes(a.id);
    return `<button type="button" class="prio-b" data-a="${a.id}" aria-pressed="${on}"${!on && full ? ' aria-disabled="true"' : ""}><span class="al">${a.letter}</span><span>${esc(a.name)}</span>${ICON.check}</button>`;
  }).join("");
  $("#prio-count").textContent = `${S.prios.length} de 3 elegidas${full ? ". Para cambiar, desmarca una." : ""}`;
}
function bindPrios() {
  $("#prio-grid").addEventListener("click", (e) => {
    const b = e.target.closest(".prio-b"); if (!b) return;
    const id = b.dataset.a, i = S.prios.indexOf(id);
    if (i >= 0) S.prios.splice(i, 1);
    else if (S.prios.length < 3) S.prios.push(id);
    else { toast("Ya has elegido tres áreas. Desmarca una para cambiarla."); return; }
    save(); renderPrios();
    $(`.prio-b[data-a="${id}"]`).focus();
  });
  const finish = (skip) => { if (skip) S.prios = []; S.stage = "done"; save(); openResults(); };
  $("#prio-go").addEventListener("click", () => finish(false));
  $("#prio-skip").addEventListener("click", () => finish(true));
  $("#prio-back").addEventListener("click", () => { S.stage = "quiz"; S.idx = S.order.length - 1; save(); renderQuestion(0); go("quiz", { focus: false }); focusStatement(); });
}

// ───────────────────────────── CÁLCULO (funciones puras)
function answered(st) { return BANK.questions.filter((q) => st.ans[q.id] >= 1); }
function weightOf(q, st) { return (st.imp[q.id] ? W_IMPORTANT : 1) * (st.prios.includes(q.area) ? W_PRIORITY : 1) * (st.ans[q.id] === 3 ? W_NEUTRAL : 1); }

// Perfil del usuario. La importancia y las prioridades no alteran tu posición (solo el peso en la
// comparación con partidos); una respuesta neutral cuenta como punto intermedio con la mitad de peso.
function userProfile(st) {
  const qs = answered(st), dims = {}, areas = {};
  for (const q of qs) {
    const u = st.ans[q.id], s = (u - 3) / 2 * 100, w = u === 3 ? W_NEUTRAL : 1;
    if (q.dim) (dims[q.dim] ||= []).push([s * q.dir, w]);
    if (q.lr) (areas[q.area] ||= []).push([s * q.lr, w]);
  }
  const avg = (a) => a.reduce((x, [v, w]) => x + v * w, 0) / a.reduce((x, [, w]) => x + w, 0);
  const D = Object.fromEntries(Object.entries(dims).map(([k, a]) => [k, { v: avg(a), n: a.length }]));
  const A = Object.fromEntries(Object.entries(areas).map(([k, a]) => [k, { v: avg(a), n: a.length }]));
  return { dims: D, areas: A };
}

// Coincidencia con un partido: proximidad media ponderada (misma respuesta = 1, 4 puntos de distancia = 0).
// Método alternativo para la comprobación de solidez: solo cuenta si estáis del mismo lado.
function matchParty(pid, st, qs, user) {
  let sw = 0, sa = 0, salt = 0, wAll = 0, nEst = 0;
  const items = [];
  for (const q of qs) {
    const w = weightOf(q, st); wAll += w;
    const v = q.pos[pid]; if (!v) continue;
    const u = st.ans[q.id], est = q.est.includes(pid);
    const W = w * (est ? W_ESTIMATED : 1), d = Math.abs(u - v);
    sw += W; sa += W * (1 - d / 4); salt += W * (Math.sign(u - 3) * Math.sign(v - 3) + 1) / 2;
    if (est) nEst++;
    items.push({ q, u, v, d, est });
  }
  const pad = Math.max(0, wAll * MIN_COVERAGE - sw);
  const score = sw + pad ? (sa + 0.5 * pad) / (sw + pad) : 0.5;
  const alt = sw + pad ? (salt + 0.5 * pad) / (sw + pad) : 0.5;
  // Cercanía ideológica: distancia media en las dimensiones que has respondido
  const pd = PARTY_DIM[pid], dd = [];
  for (const [k, o] of Object.entries(user.dims)) if (pd[k] !== undefined) dd.push(Math.abs(o.v - pd[k]) / 200);
  const close = dd.length ? 1 - dd.reduce((a, b) => a + b, 0) / dd.length : null;
  const raw = sw ? Math.round(sa / sw * 100) : null;
  return { pid, score, pct: Math.round(score * 100), alt, raw, n: items.length, nEst, items, close, padded: pad > 0 };
}

function computeModel(st) {
  const qs = answered(st);
  const ns = BANK.questions.filter((q) => st.ans[q.id] === 0);
  const user = userProfile(st);
  const all = PIDS.map((pid) => matchParty(pid, st, qs, user)).sort((a, b) => b.score - a.score || b.n - a.n);
  const avail = partiesIn(st.prov);
  const prov = all.filter((m) => avail.includes(m.pid));
  return { st, qs, ns, user, all, prov, avail, rel: reliability(st, qs, ns, prov), traits: traits(st, qs, ns) };
}

function reliability(st, qs, ns, prov) {
  const nAns = qs.length, neutral = qs.filter((q) => st.ans[q.id] === 3).length;
  const softShare = (neutral + ns.length) / Math.max(1, nAns + ns.length);
  const [a, b] = prov;
  const gap = a && b ? a.pct - b.pct : 100;
  const altTop = [...prov].sort((x, y) => y.alt - x.alt)[0];
  const sameTop = !a || !altTop || altTop.pid === a.pid;
  const estShare = a && a.n ? a.nEst / a.n : 0;
  const pn = (pid) => pName(pid, st.prov);
  const checks = [
    { ok: nAns >= 20, txt: nAns >= 20 ? `Has dado tu opinión en ${nAns} preguntas.` : `Has dado tu opinión en ${nAns} preguntas: es un resultado orientativo. Una versión más larga lo afina.` },
    { ok: softShare < 0.4, txt: softShare < 0.4 ? "La mayoría de tus respuestas toman partido." : `El ${Math.round(softShare * 100)} % de tus respuestas son neutrales o «No lo sé», lo que acerca a todos los partidos entre sí.` },
    { ok: gap >= 4, txt: !b ? "Solo hay una candidatura comparable." : gap >= 4 ? `Tu primera opción saca ${gap} puntos a la segunda.` : `Empate técnico: ${pn(a.pid)} y ${pn(b.pid)} están a ${gap} ${gap === 1 ? "punto" : "puntos"}.` },
    { ok: sameTop, txt: sameTop ? "Con el método alternativo (solo acuerdo o desacuerdo, sin matices) tu primera opción no cambia." : `Con el método alternativo (solo acuerdo o desacuerdo) tu primera opción sería ${pn(altTop.pid)}.` },
    { ok: estShare <= 0.5, txt: estShare <= 0.5 ? `La comparación con ${a ? pn(a.pid) : "tu primera opción"} se apoya sobre todo en posturas documentadas.` : `Más de la mitad de las posturas de ${pn(a.pid)} que se comparan son estimadas.` }
  ];
  const okN = checks.filter((c) => c.ok).length;
  const level = nAns < 12 || softShare >= 0.6 || okN <= 2 ? "baja" : okN === 5 ? "alta" : "media";
  return { level, checks, gap, sameTop, altTop, softShare };
}

function answerText(q, v, short = false) {
  if (v === 0) return "No lo sé";
  if (q.type === "dilema") return v === 3 ? "Las dos por igual" : `${DIL[v - 1]}${short ? "" : `: ${v < 3 ? q.A : q.B}`}`;
  return short ? LIK_LOW[v - 1] : LIK[v - 1];
}
function traits(st, qs, ns) {
  const firm = qs.filter((q) => st.ans[q.id] === 1 || st.ans[q.id] === 5)
    .sort((a, b) => (st.imp[b.id] ? 1 : 0) - (st.imp[a.id] ? 1 : 0) || AREA[a.area].idx - AREA[b.area].idx);
  const neutral = qs.filter((q) => st.ans[q.id] === 3);
  const cross = [];
  for (const d of BANK.dims) {
    const rows = qs.filter((q) => q.dim === d.id && st.ans[q.id] !== 3).map((q) => ({ q, s: (st.ans[q.id] - 3) * q.dir }));
    const hi = rows.filter((r) => r.s > 0).sort((a, b) => b.s - a.s)[0];
    const lo = rows.filter((r) => r.s < 0).sort((a, b) => a.s - b.s)[0];
    if (hi && lo) cross.push({ d, a: lo, b: hi, k: hi.s - lo.s });
  }
  cross.sort((x, y) => y.k - x.k);
  return { firm, neutral, ns, cross: cross.slice(0, 3) };
}

function strength(v) {
  const a = Math.abs(v);
  return a < 15 ? "equilibrio" : a < 40 ? "inclinación moderada" : a < 70 ? "inclinación clara" : "posición muy marcada";
}
function dimLabel(d, v) {
  if (v == null) return "Sin respuestas en esta versión";
  if (Math.abs(v) < 15) return "Equilibrio entre ambos polos";
  return `${v < 0 ? d.a : d.b} · ${strength(v)}`;
}
function profileSentence(M) {
  const strong = Object.entries(M.user.dims).filter(([, o]) => Math.abs(o.v) >= 25).sort((a, b) => Math.abs(b[1].v) - Math.abs(a[1].v));
  const mixed = BANK.dims.filter((d) => M.user.dims[d.id] && Math.abs(M.user.dims[d.id].v) < 25);
  const list = (arr) => arr.length <= 1 ? arr.join("") : `${arr.slice(0, -1).join(", ")} y ${arr[arr.length - 1]}`;
  const head = strong.length
    ? `Te inclinas por ${list(strong.slice(0, 3).map(([k, o]) => DIM_PHRASE[k][o.v < 0 ? 0 : 1]))}.`
    : "Tus respuestas no se inclinan con claridad hacia ningún polo.";
  const tail = mixed.length ? `En ${list(mixed.map((d) => DIM_SHORT[d.id]))} mantienes posiciones intermedias o combinas ideas de ambos lados.` : "";
  const more = strong.length > 3 ? `También muestras ${list(strong.slice(3).map(([k, o]) => DIM_PHRASE[k][o.v < 0 ? 0 : 1]))}.` : "";
  return { head, sub: [more, tail].filter(Boolean).join(" ") };
}

// ───────────────────────────── RESULTADOS
let MODEL = null;
function openResults() {
  MODEL = computeModel(ST());
  UI.cmp = MODEL.prov[0]?.pid || null;
  UI.scope = "prov";
  renderResults();
  go("results");
}

function renderResults() {
  const st = ST();
  const next = st.mode === "expres" ? "media" : st.mode === "media" ? "completa" : null;
  $("#v-results").innerHTML = `
    ${SHARED ? `<div class="shared-banner"><div class="wrap"><p><b>Estás viendo un resultado compartido.</b> No incluye datos personales y no modifica tu test.</p><button type="button" class="btn btn-primary btn-sm" data-act="own-test">Hacer mi propio test</button></div></div>` : ""}
    <nav class="res-nav" aria-label="Secciones del resultado"><div class="wrap">
      <a href="#r-summary">Resumen</a><a href="#r-dims">Dimensiones</a><a href="#r-map">Mapa</a><a href="#r-areas">Por temas</a><a href="#r-traits">Firmes y dudas</a><a href="#r-parties">Partidos</a><a href="#r-solid">Solidez</a>${SHARED ? "" : '<a href="#r-share">Compartir</a>'}<a href="#r-review">Tus respuestas</a><a href="#r-least">Menos afines</a><a href="#r-pols">Políticos</a>
    </div></nav>
    <div class="wrap">
      <section id="r-summary" class="summary res-sec" style="padding-top:34px"></section>
      <section id="r-dims" class="res-sec" aria-labelledby="dims-h"></section>
      <section id="r-map" class="res-sec" aria-labelledby="map-h"></section>
      <section id="r-areas" class="res-sec" aria-labelledby="areas-h2"></section>
      <section id="r-traits" class="res-sec" aria-labelledby="traits-h"></section>
      <section id="r-parties" class="res-sec" aria-labelledby="parties-h"></section>
      <section id="r-solid" class="res-sec" aria-labelledby="solid-h"></section>
      <section id="r-share" class="res-sec share" aria-labelledby="share-h"></section>
      <section id="r-review" class="res-sec" aria-labelledby="review-h"></section>
      <section id="r-least" class="res-sec" aria-labelledby="least-h"></section>
      <section id="r-pols" class="res-sec" aria-labelledby="pols-h"></section>
      <section id="r-support" class="res-sec" aria-labelledby="support-h"></section>
      <section class="res-sec" aria-label="Siguientes pasos">
        <div class="res-actions">
          ${!SHARED && next ? `<button type="button" class="btn btn-primary" data-act="more">Afinar con la versión ${MODES[next].label.toLowerCase()} (${buildOrder(next, st.seed).length} preguntas)</button>` : ""}
          ${!SHARED ? `<a class="btn btn-ghost" href="#r-share">Compartir mi resultado</a><button type="button" class="btn btn-ghost" data-act="new">Repetir el test</button>` : `<button type="button" class="btn btn-primary" data-act="own-test">Hacer mi propio test</button>`}
          <button type="button" class="link-btn" data-go="method">Cómo se calcula</button>
        </div>
        ${!SHARED && next ? '<p class="small muted">Conservas tus respuestas: solo contestarás las preguntas nuevas.</p>' : ""}
      </section>
    </div>`;
  invalidateCards(); renderSummary(); renderDims(); renderMap(); renderAreas(); renderTraits(); renderParties(); renderSolid(); renderShare(); renderReview(); renderLeast(); renderPoliticians(); renderSupport();
}

function rerenderAfterEdit() {
  MODEL = computeModel(ST());
  if (!MODEL.prov.some((m) => m.pid === UI.cmp)) UI.cmp = MODEL.prov[0]?.pid || null;
  invalidateCards();
  renderSummary(); renderDims(); renderMap(); renderAreas(); renderTraits(); renderParties(); renderSolid(); renderShare(); renderLeast(); renderPoliticians();
}

function renderSummary() {
  const st = ST(), M = MODEL, pr = PROV[st.prov], top = M.prov[0];
  const ps = profileSentence(M);
  const sig = BANK.dims.map((d) => {
    const o = M.user.dims[d.id];
    if (!o) return `<div class="sig-row"><span>${esc(d.name)}</span><span class="small muted">sin datos</span></div>`;
    const x = pctPos(o.v);
    const band = o.v < 0 ? `<span class="b l" style="left:${x}%;width:${(50 - x).toFixed(2)}%"></span>` : o.v > 0 ? `<span class="b r" style="left:50%;width:${(x - 50).toFixed(2)}%"></span>` : "";
    return `<div class="sig-row" title="${esc(d.name)}: ${esc(dimLabel(d, o.v))} (${signed(o.v)})"><span>${esc(d.name)}</span><span class="mini"><span class="c"></span>${band}<span class="d" style="left:${x}%"></span></span></div>`;
  }).join("");
  const nAns = M.qs.length, nTotal = st.order ? st.order.length : nAns + M.ns.length;
  $("#r-summary").innerHTML = `
    <div class="ballot">
      <div class="ballot-top"><span>Tu resultado · ${MODES[st.mode]?.label || ""}</span><span>Congreso · ${esc(pr.name)}</span></div>
      <div class="ballot-body">
        <div style="display:grid;gap:16px;align-content:start">
          <p class="who">${SHARED ? "Resultado compartido" : `${esc(st.sex)} · ${esc(st.age)} años`} · ${nAns} respuestas con opinión de ${nTotal}${M.ns.length ? ` · ${M.ns.length} «No lo sé»` : ""}${st.prios.length ? ` · Prioridades: ${st.prios.map((a) => AREA[a].letter).join(", ")}` : ""}</p>
          <h1 id="res-h" class="profile-h">${esc(ps.head)}</h1>
          ${ps.sub ? `<p class="profile-sub">${esc(ps.sub)}</p>` : ""}
          <div class="sig" aria-label="Tu firma ideológica en siete dimensiones">${sig}</div>
          <p class="small muted">Cada barra va del polo A (izquierda) al B (derecha) de su dimensión. <a href="#r-dims" class="link-btn" style="padding:0">Ver el detalle</a></p>
        </div>
        <div class="top-match">
          <p class="label">Tu mayor coincidencia en ${esc(pr.name)}</p>
          ${top ? `<div class="tm-row">${logo(top.pid)}<span class="tm-name">${esc(pName(top.pid, st.prov))}</span></div>
          <p class="tm-pct">${top.pct}<small>%</small></p>
          <p class="small">${top.close != null ? `Cercanía ideológica: <b>${Math.round(top.close * 100)} %</b> · ` : ""}comparado en ${top.n} de ${nAns} respuestas</p>
          <p class="small muted">Siguientes: ${M.prov.slice(1, 3).map((m) => `${esc(pName(m.pid, st.prov))} (${m.pct} %)`).join(" · ") || "—"}</p>` : "<p>No hay candidaturas comparables.</p>"}
          <p class="rel ${M.rel.level}"><i></i>Solidez del resultado: ${M.rel.level}</p>
          <div class="res-actions"><a class="btn btn-primary btn-sm" href="#r-parties">Ver partidos en detalle</a>${!SHARED ? '<a class="btn btn-ghost btn-sm" href="#r-share">Compartir</a>' : ""}</div>
        </div>
      </div>
    </div>`;
}

function compareOptions() {
  const st = ST();
  return MODEL.prov.map((m) => `<option value="${m.pid}"${UI.cmp === m.pid ? " selected" : ""}>${esc(pName(m.pid, st.prov))} (${m.pct} %)</option>`).join("")
    + `<option value=""${!UI.cmp ? " selected" : ""}>Sin comparar</option>`;
}
function renderDims() {
  const st = ST(), M = MODEL, cmp = UI.cmp;
  const rows = BANK.dims.map((d) => {
    const o = M.user.dims[d.id], pv = cmp ? PARTY_DIM[cmp][d.id] : undefined;
    const nBank = BANK.questions.filter((q) => q.dim === d.id).length;
    let track = '<span class="tk" style="left:0"></span><span class="tk" style="left:25%"></span><span class="tk" style="left:75%"></span><span class="tk" style="left:100%"></span><span class="ctr"></span>';
    if (o) {
      const x = Number(pctPos(o.v));
      track += o.v < 0 ? `<span class="hb l" style="left:${x}%;width:${(50 - x).toFixed(2)}%"></span>` : o.v > 0 ? `<span class="hb r" style="left:50%;width:${(x - 50).toFixed(2)}%"></span>` : "";
      track += `<span class="me" style="left:${x}%" data-tip="Tú: ${esc(dimLabel(d, o.v))} (${signed(o.v)})"></span>`;
    }
    if (pv !== undefined) track += `<span class="pm" style="left:${pctPos(pv)}%;background:${P[cmp].color}" data-tip="${esc(pName(cmp, st.prov))}: ${esc(dimLabel(d, pv))} (${signed(pv)})"></span>`;
    return `<div class="drow">
      <div class="dname"><b>${esc(d.name)}</b><span class="dv">${esc(dimLabel(d, o?.v))}${o ? ` <span class="muted">(${signed(o.v)})</span>` : ""}</span><span class="dn">${o ? `${o.n} ${o.n === 1 ? "respuesta" : "respuestas"} de ${nBank} preguntas del banco` : `${nBank} preguntas en el banco`}${pv !== undefined ? ` · ${esc(P[cmp].ab)}: ${signed(pv)}` : ""}</span></div>
      <div class="dplot">
        <div class="track" role="img" aria-label="${esc(d.name)}: tú ${o ? signed(o.v) : "sin datos"}${pv !== undefined ? `, ${esc(pName(cmp, st.prov))} ${signed(pv)}` : ""}, en una escala de −100 (${esc(d.a)}) a +100 (${esc(d.b)})">${track}</div>
        <div class="poles"><span>← ${esc(d.a)}</span><span>${esc(d.b)} →</span></div>
        <details class="more"><summary>Qué mide</summary><p class="dinfo">${esc(d.desc)}</p></details>
      </div>
    </div>`;
  }).join("");
  $("#r-dims").innerHTML = `
    <div class="sec-head"><p class="label">Tu perfil</p><h2 id="dims-h" class="h2">Siete dimensiones, no una sola línea</h2>
    <p class="sub">Cada dimensión resume tus respuestas a las preguntas que la miden, de −100 a +100. Cero es equilibrio, o un empate entre respuestas en sentidos opuestos. La importancia y las prioridades no cambian este perfil.</p></div>
    <div class="cmp-bar"><label class="label" for="cmp-sel">Comparar con</label><select id="cmp-sel" data-ctl="cmp">${compareOptions()}</select></div>
    <div class="legend"><span><i class="lg-me"></i>Tú</span><span><i class="lg-band"></i>Distancia al centro</span>${cmp ? `<span><i class="lg-dia" style="background:${P[cmp].color}"></i>${esc(pName(cmp, st.prov))} (con todas sus posturas)</span>` : ""}</div>
    <div class="dims">${rows}</div>`;
}

function renderMap() {
  const st = ST(), M = MODEL, X = DIM[UI.mx], Y = DIM[UI.my];
  const W = 520, H = 520, pad = 58, inner = W - pad * 2;
  const sx = (v) => pad + (v + 100) / 200 * inner, sy = (v) => H - pad - (v + 100) / 200 * inner;
  const pts = M.prov.map((m) => ({ pid: m.pid, x: PARTY_DIM[m.pid][X.id], y: PARTY_DIM[m.pid][Y.id] })).filter((p) => p.x !== undefined && p.y !== undefined);
  const u = { x: M.user.dims[X.id]?.v, y: M.user.dims[Y.id]?.v };
  const placed = [];
  const lab = (px, py, w, h) => {
    const cands = [[12, 4], [-12 - w, 4], [-w / 2, -14], [-w / 2, 22], [12, 18], [12, -10], [-12 - w, 18], [-12 - w, -10]];
    for (const [dx, dy] of cands) {
      const r = { x: px + dx, y: py + dy - h + 4, w, h };
      if (r.x < 2 || r.x + w > W - 2 || r.y < 2 || r.y + h > H - 2) continue;
      if (!placed.some((o) => r.x < o.x + o.w && r.x + r.w > o.x && r.y < o.y + o.h && r.y + r.h > o.y)) { placed.push(r); return [px + dx, py + dy]; }
    }
    return null;
  };
  const grid = [-100, -50, 0, 50, 100].map((v) => `<line class="mg${v === 0 ? " z" : ""}" x1="${sx(v)}" y1="${pad}" x2="${sx(v)}" y2="${H - pad}"/><line class="mg${v === 0 ? " z" : ""}" x1="${pad}" y1="${sy(v)}" x2="${W - pad}" y2="${sy(v)}"/>`).join("");
  const hasU = u.x !== undefined && u.y !== undefined;
  if (hasU) placed.push({ x: sx(u.x) - 16, y: sy(u.y) - 16, w: 32, h: 32 });
  pts.forEach((p) => placed.push({ x: sx(p.x) - 8, y: sy(p.y) - 8, w: 16, h: 16 }));
  const dots = pts.map((p) => {
    const px = sx(p.x), py = sy(p.y), name = pName(p.pid, st.prov), t = P[p.pid].ab;
    const at = lab(px, py, t.length * 7.4 + 4, 14);
    return `<g class="map-pt" tabindex="0" role="img" aria-label="${esc(name)}: ${esc(X.name)} ${signed(p.x)}, ${esc(Y.name)} ${signed(p.y)}" data-tip="${esc(name)} · ${esc(X.name)} ${signed(p.x)} · ${esc(Y.name)} ${signed(p.y)}">
      <circle class="hit" cx="${px}" cy="${py}" r="14" fill="transparent"/>
      <circle cx="${px}" cy="${py}" r="8" style="fill:${P[p.pid].color};stroke:var(--sheet);stroke-width:2.5"/>
      ${at ? `<text x="${at[0]}" y="${at[1]}" class="ml">${esc(t)}</text>` : ""}</g>`;
  }).join("");
  const me = hasU ? `<g role="img" aria-label="Tu posición: ${esc(X.name)} ${signed(u.x)}, ${esc(Y.name)} ${signed(u.y)}"><circle cx="${sx(u.x)}" cy="${sy(u.y)}" r="15" class="me-o"/><circle cx="${sx(u.x)}" cy="${sy(u.y)}" r="11" class="me-i"/><text x="${sx(u.x)}" y="${sy(u.y) + 3.6}" text-anchor="middle" class="me-t">TÚ</text></g>` : "";
  const opts = (sel, other) => BANK.dims.map((d) => `<option value="${d.id}"${d.id === sel ? " selected" : ""}${d.id === other ? " disabled" : ""}>${esc(d.name)}</option>`).join("");
  $("#r-map").innerHTML = `
    <div class="sec-head"><p class="label">Mapa</p><h2 id="map-h" class="h2">Dónde te sitúas frente a las candidaturas de ${esc(PROV[st.prov].name)}</h2>
    <p class="sub">Elige dos dimensiones. Los partidos se colocan con todas sus posturas del banco; tú, con tus respuestas.</p></div>
    <div class="map-wrap">
      <div class="map-box">
        <svg class="map-svg" viewBox="0 0 ${W} ${H}" role="group" aria-label="Mapa de ${esc(X.name)} frente a ${esc(Y.name)}">
          <style>.mg{stroke:var(--rule-2);stroke-width:1}.mg.z{stroke:var(--rule);stroke-width:1.6}.ax{fill:var(--ink-2);font-size:12.5px;font-weight:650}.ml{fill:var(--ink);font-size:12px;font-weight:750}.me-o{fill:var(--mark);stroke:var(--mark-ink);stroke-width:2}.me-i{fill:var(--ink)}.me-t{fill:var(--paper);font-size:9.5px;font-weight:900;letter-spacing:.04em}.frame{fill:none;stroke:var(--rule);stroke-width:1}</style>
          <rect class="frame" x="${pad}" y="${pad}" width="${inner}" height="${inner}"/>
          ${grid}
          <text class="ax" x="${pad}" y="${H - pad + 22}">← ${esc(X.a)}</text>
          <text class="ax" x="${W - pad}" y="${H - pad + 22}" text-anchor="end">${esc(X.b)} →</text>
          <text class="ax" x="${pad - 10}" y="${pad + 4}" text-anchor="end" transform="rotate(-90 ${pad - 10} ${pad + 4})">${esc(Y.b)} →</text>
          <text class="ax" x="${pad - 10}" y="${H - pad}" text-anchor="start" transform="rotate(-90 ${pad - 10} ${H - pad})">← ${esc(Y.a)}</text>
          <text class="ax" x="${W / 2}" y="${H - 14}" text-anchor="middle" style="font-weight:800;fill:var(--ink)">${esc(X.name)}</text>
          <text class="ax" x="20" y="${H / 2}" text-anchor="middle" transform="rotate(-90 20 ${H / 2})" style="font-weight:800;fill:var(--ink)">${esc(Y.name)}</text>
          ${dots}${me}
        </svg>
      </div>
      <div class="map-ctrl">
        <div class="field-row">
          <div class="field"><label class="label" for="map-x">Eje horizontal</label><select id="map-x" data-ctl="mx">${opts(UI.mx, UI.my)}</select></div>
          <div class="field"><label class="label" for="map-y">Eje vertical</label><select id="map-y" data-ctl="my">${opts(UI.my, UI.mx)}</select></div>
        </div>
        ${hasU ? "" : `<p class="small" style="color:var(--warn)">${ICON.warn} No has respondido preguntas de alguna de estas dimensiones en tu versión, así que tu posición no aparece.</p>`}
        <ul class="tlist">${pts.slice().sort((a, b) => a.x - b.x).map((p) => `<li><b><span class="sw" style="background:${P[p.pid].color}"></span> ${esc(pName(p.pid, st.prov))}</b><span>${esc(X.name)} ${signed(p.x)} · ${esc(Y.name)} ${signed(p.y)}</span></li>`).join("")}</ul>
        <p class="small muted">Las posiciones de los partidos son una estimación a partir de sus posturas en este test; no son una medición oficial.</p>
      </div>
    </div>`;
}

function renderAreas() {
  const st = ST(), M = MODEL, cmp = UI.cmp;
  const rows = BANK.areas.map((a) => {
    const o = M.user.areas[a.id], pv = cmp ? PARTY_AREA[cmp][a.id] : undefined;
    let track = '<span class="tk" style="left:0"></span><span class="tk" style="left:25%"></span><span class="tk" style="left:75%"></span><span class="tk" style="left:100%"></span><span class="ctr"></span>';
    if (o) {
      const x = Number(pctPos(o.v));
      track += o.v < 0 ? `<span class="hb l" style="left:${x}%;width:${(50 - x).toFixed(2)}%"></span>` : o.v > 0 ? `<span class="hb r" style="left:50%;width:${(x - 50).toFixed(2)}%"></span>` : "";
      track += `<span class="me" style="left:${x}%" data-tip="Tú: ${signed(o.v)}"></span>`;
    }
    if (pv !== undefined) track += `<span class="pm" style="left:${pctPos(pv)}%;background:${P[cmp].color}" data-tip="${esc(P[cmp].ab)}: ${signed(pv)}"></span>`;
    const label = !o ? "Sin preguntas con lectura izquierda-derecha" : Math.abs(o.v) < 15 ? "Mezcla de ambos" : `${Math.abs(o.v) >= 60 ? "Muy " : ""}${o.v < 0 ? (Math.abs(o.v) >= 60 ? "progresista" : "Progresista") : (Math.abs(o.v) >= 60 ? "conservador" : "Conservador")} (${signed(o.v)})`;
    return `<div class="arow"><div class="an"><span class="al">${a.letter}</span><span>${esc(a.name)}</span>${st.prios.includes(a.id) ? '<span class="pri-tag">Prioridad</span>' : ""}</div>
      <div class="track" role="img" aria-label="${esc(a.name)}: ${esc(label)}">${track}</div><div class="av">${esc(label)}</div></div>`;
  }).join("");
  $("#r-areas").innerHTML = `
    <div class="sec-head"><p class="label">Por temas</p><h2 id="areas-h2" class="h2">¿Más progresista o más conservador en cada área?</h2>
    <p class="sub">Lectura simplificada: sigue cómo se suelen alinear los partidos españoles en cada tema. Las preguntas transversales, que no dividen así, no cuentan aquí. Para un perfil más fino, mira las dimensiones.</p></div>
    <div class="legend"><span><i class="lg-me"></i>Tú</span>${cmp ? `<span><i class="lg-dia" style="background:${P[cmp].color}"></i>${esc(pName(cmp, st.prov))}</span>` : ""}<span>← Progresista · Conservador →</span></div>
    <div class="areas-chart">${rows}</div>`;
}

function renderTraits() {
  const st = ST(), T = MODEL.traits;
  const li = (q, extra = "") => `<li><b>${esc(q.short)}</b><span>${esc(answerText(q, st.ans[q.id]))}${extra}</span></li>`;
  const firm = T.firm.slice(0, 6).map((q) => li(q, st.imp[q.id] ? " · ★ importante para ti" : "")).join("") || '<li class="empty">No has dado respuestas extremas: tus posiciones son matizadas.</li>';
  const doubts = [...T.ns, ...T.neutral];
  const dl = doubts.slice(0, 6).map((q) => li(q)).join("") || '<li class="empty">Has tomado partido en todas las preguntas.</li>';
  const cross = T.cross.map((c) => `<li><b>${esc(c.d.name)}</b><span>«${esc(c.a.q.short)}» te acerca a <i>${esc(lcFirst(c.d.a))}</i>, y «${esc(c.b.q.short)}», a <i>${esc(lcFirst(c.d.b))}</i>.</span></li>`).join("")
    || '<li class="empty">Tus respuestas van en la misma dirección dentro de cada dimensión.</li>';
  $("#r-traits").innerHTML = `
    <div class="sec-head"><p class="label">Tus matices</p><h2 id="traits-h" class="h2">Lo que tienes claro, lo que dudas y lo que combinas</h2>
    <p class="sub">Combinar ideas de distinto signo no es una contradicción: es frecuente y suele reflejar prioridades propias en cada tema.</p></div>
    <div class="traits">
      <div class="trait"><h3 class="h3">Posiciones firmes <span class="muted small">(${T.firm.length})</span></h3><ul class="tlist">${firm}</ul>${T.firm.length > 6 ? `<p class="small muted">Y ${T.firm.length - 6} más en «Tus respuestas».</p>` : ""}</div>
      <div class="trait"><h3 class="h3">Dudas y neutralidad <span class="muted small">(${doubts.length})</span></h3><ul class="tlist">${dl}</ul><p class="small muted">${T.ns.length} «No lo sé» y ${T.neutral.length} neutrales. «No lo sé» no cuenta en el cálculo; una respuesta neutral sí, como posición intermedia con la mitad de peso.</p></div>
      <div class="trait"><h3 class="h3">Combinaciones cruzadas <span class="muted small">(${T.cross.length})</span></h3><ul class="tlist">${cross}</ul></div>
    </div>`;
}

function areaAff(m) {
  const acc = {};
  for (const it of m.items) { const o = (acc[it.q.area] ||= [0, 0]); o[0] += 1 - it.d / 4; o[1]++; }
  return BANK.areas.filter((a) => acc[a.id]).map((a) => ({ a, v: acc[a.id][0] / acc[a.id][1], n: acc[a.id][1] }));
}
function whyText(m, rank) {
  const st = ST(), nm = pName(m.pid, st.prov), pr = PROV[st.prov].name;
  const agree = m.items.filter((i) => i.d <= 1).length;
  const aa = areaAff(m).filter((x) => x.n >= 1).sort((a, b) => b.v - a.v);
  const opener = rank === 0 ? `<b>${esc(nm)}</b> es la candidatura de ${esc(pr)} que más coincide con tus respuestas.` : `<b>${esc(nm)}</b> es tu ${rank === 1 ? "segunda" : "tercera"} opción en ${esc(pr)}.`;
  let t = `${opener} Coincidís en ${agree} de las ${m.n} afirmaciones en las que tiene una postura conocida.`;
  if (aa.length >= 2) t += ` Vuestra mayor sintonía está en ${esc(aa[0].a.name.toLowerCase())} (${Math.round(aa[0].v * 100)} %) y ${esc(aa[1].a.name.toLowerCase())} (${Math.round(aa[1].v * 100)} %).`;
  if (aa.length >= 3) { const w = aa[aa.length - 1]; if (w.v < aa[1].v) t += ` Donde más os separáis es en ${esc(w.a.name.toLowerCase())} (${Math.round(w.v * 100)} %).`; }
  return t;
}
function propStatus(pid, qid, st) {
  if (!qid) return { k: "na", txt: "Propuesta sin pregunta equivalente en el test" };
  const q = Q[qid], v = q.pos[pid], u = st.ans[qid];
  if (u === undefined) return { k: "na", txt: "No preguntada en tu versión" };
  if (u === 0) return { k: "neu", txt: "Respondiste «No lo sé»" };
  const su = Math.sign(u - 3), sp = Math.sign((v || 3) - 3);
  if (!sp) return { k: "neu", txt: `Respondiste: ${answerText(q, u, true)}` };
  if (!su) return { k: "neu", txt: "Te resulta indiferente" };
  return su === sp ? { k: "ok", txt: "Coincide con lo que respondiste" } : { k: "ko", txt: "Choca con lo que respondiste" };
}
function cmpList(items, ab, empty) {
  const row = (i) => `<li><b>${esc(i.q.short)}</b><span>Tú: ${esc(answerText(i.q, i.u, true))} · ${esc(ab)}: <span${i.est ? ' class="est" title="Postura estimada"' : ""}>${esc(answerText(i.q, i.v, true))}${i.est ? " (estimada)" : ""}</span></span></li>`;
  if (!items.length) return `<ul class="cmp"><li class="empty">${empty}</li></ul>`;
  return `<ul class="cmp">${items.slice(0, 4).map(row).join("")}</ul>${items.length > 4 ? `<details class="more"><summary>Ver ${items.length - 4} más</summary><ul class="cmp" style="margin-top:8px">${items.slice(4).map(row).join("")}</ul></details>` : ""}`;
}
function partyCard(m, rank) {
  const st = ST(), p = P[m.pid], nm = pName(m.pid, st.prov);
  const strength2 = (i) => Math.abs(i.u - 3) + Math.abs(i.v - 3);
  const yes = m.items.filter((i) => i.d <= 1).sort((a, b) => (strength2(b) - b.d * 2) - (strength2(a) - a.d * 2));
  const no = m.items.filter((i) => i.d >= 2).sort((a, b) => b.d - a.d || strength2(b) - strength2(a));
  const props = p.props.map((pp) => { const s = propStatus(m.pid, pp.q, st); return { ...pp, s }; });
  const cnt = props.reduce((a, x) => { a[x.s.k] = (a[x.s.k] || 0) + 1; return a; }, {});
  const aa = areaAff(m);
  const affRows = BANK.areas.map((a) => { const x = aa.find((y) => y.a.id === a.id); return x
    ? `<div class="affrow"><span>${esc(a.name)}</span><span class="bar"><i style="width:${Math.round(x.v * 100)}%"></i></span><span class="v">${Math.round(x.v * 100)}</span></div>`
    : `<div class="affrow na"><span>${esc(a.name)}</span><span class="bar"></span><span class="v">–</span></div>`; }).join("");
  return `<article class="pcard${rank === 0 ? " first" : ""}" id="card-${m.pid}" aria-labelledby="ph-${m.pid}">
    <div class="phead">${logo(m.pid)}<div style="display:grid;gap:3px;min-width:0"><h3 id="ph-${m.pid}"><span class="rk">${rank + 1}º</span>${esc(nm)}</h3><span class="tag">${esc(p.tag)}</span>${p.lead ? `<span class="lead">Cabeza de cartel: ${esc(p.lead)}</span>` : ""}${p.tbd ? '<span><span class="tbd">Candidatura por confirmar</span></span>' : ""}</div>
      <div class="pc"><b>${m.pct}<small style="font-size:.45em">%</small></b><span>coincidencia</span></div></div>
    <div class="metrics">
      <div class="metric"><b>${m.close != null ? Math.round(m.close * 100) + " %" : "–"}</b><span>Cercanía ideológica</span></div>
      <div class="metric"><b>${m.n}/${MODEL.qs.length}</b><span>Preguntas comparadas</span></div>
      <div class="metric"><b>${m.n ? Math.round(m.nEst / m.n * 100) : 0} %</b><span>Posturas estimadas</span></div>
      ${m.padded ? `<div class="metric"><b>${m.raw} %</b><span>Coincidencia solo en sus ${m.n} temas</span></div>` : ""}
    </div>
    ${m.padded ? `<p class="small muted">Esta candidatura solo tiene postura conocida en ${m.n} de tus ${MODEL.qs.length} respuestas. Para no exagerar, el resto cuenta como un 50 % neutro.</p>` : ""}
    <div><p class="why">${whyText(m, rank)}</p><p class="why" style="margin-top:8px">${esc(p.desc)}</p></div>
    <div><p class="subh">Sus propuestas · ${cnt.ok || 0} coinciden y ${cnt.ko || 0} chocan con tus respuestas</p>
      <ul class="props">${props.map((x) => `<li>${ICON[x.s.k]}<div><p class="pt">${esc(x.t)}</p><p class="ps"><span class="${x.s.k === "ok" ? "st-ok" : x.s.k === "ko" ? "st-ko" : ""}">${esc(x.s.txt)}</span>${x.q ? `<span>${esc(qCode(Q[x.q]))} · ${esc(AREA[Q[x.q].area].name)}</span>` : ""}</p></div></li>`).join("")}</ul></div>
    <div class="two">
      <div><p class="subh" style="color:var(--ok)">En qué coincidís (${yes.length})</p>${cmpList(yes, p.ab, "Ninguna coincidencia clara.")}</div>
      <div><p class="subh" style="color:var(--ko)">En qué no estás de acuerdo (${no.length})</p>${cmpList(no, p.ab, "No hay discrepancias fuertes.")}</div>
    </div>
    <details class="more"><summary>Coincidencia por área</summary><div class="aff" style="margin-top:10px">${affRows}</div></details>
  </article>`;
}
function renderParties() {
  const st = ST(), M = MODEL, pr = PROV[st.prov];
  const list = (UI.scope === "prov" ? M.prov : M.all).slice(0, 10);
  const rows = list.map((m, i) => {
    const p = P[m.pid], here = M.avail.includes(m.pid);
    const meta = [!here ? "No se presenta en tu provincia" : "", p.tbd ? "Por confirmar" : "", m.padded ? `Solo se pronuncia en ${m.n} de tus respuestas: en ellas coincidís un ${m.raw} %` : "", m.close != null ? `Cercanía ideológica ${Math.round(m.close * 100)} %` : ""].filter(Boolean).join(" · ");
    return `<li class="${here ? "" : "out"}${i === 0 && here ? " me-top" : ""}"><span class="rn">${i + 1}</span>${logo(m.pid, "sm")}<div class="nm"><b>${esc(here ? pName(m.pid, st.prov) : p.name)}</b><span class="bar"><i style="width:${m.pct}%"></i></span><span class="meta">${esc(meta)}</span></div><span class="pv"><b>${m.pct} %</b><span>${m.n} comparadas</span></span></li>`;
  }).join("");
  $("#r-parties").innerHTML = `
    <div class="sec-head"><p class="label">Partidos</p><h2 id="parties-h" class="h2">Coincidencia con las candidaturas</h2>
    <p class="sub"><b>Coincidencia</b>: cuánto se parecen tus respuestas a las posturas del partido, pregunta a pregunta. <b>Cercanía ideológica</b>: distancia media en las siete dimensiones. Pueden no coincidir: un partido puede estar cerca en el conjunto y lejos en temas concretos.</p></div>
    <div class="rank-tabs" role="group" aria-label="Ámbito del ranking"><button type="button" data-scope="prov" aria-pressed="${UI.scope === "prov"}">${esc(pr.name)} (${M.prov.length})</button><button type="button" data-scope="all" aria-pressed="${UI.scope === "all"}">Toda España (${M.all.length})</button></div>
    <p class="small muted">${UI.scope === "prov" ? (M.prov.length < 10 ? `En ${esc(pr.name)} se presentan ${M.prov.length} candidaturas. Cambia a «Toda España» para ver tu top 10 con partidos de otros territorios.` : `Las 10 candidaturas de ${esc(pr.name)} más cercanas a tus respuestas.`) : "Las candidaturas que no se presentan en tu provincia aparecen atenuadas."}</p>
    <ol class="rank">${rows}</ol>
    <div class="sec-head" style="padding-top:20px"><h3 class="h2" style="font-size:clamp(21px,3vw,27px)">Tu top 3 en ${esc(pr.name)}, en detalle</h3><p class="sub">Por qué coincides, sus propuestas comparadas con tus respuestas y dónde chocáis.</p></div>
    <div class="pcards">${M.prov.slice(0, 3).map((m, i) => partyCard(m, i)).join("")}</div>`;
}

function renderSolid() {
  const M = MODEL, r = M.rel;
  $("#r-solid").innerHTML = `
    <div class="solid">
      <div class="sec-head"><p class="label">Solidez</p><h2 id="solid-h" class="h2">¿Cuánto fiarte de este resultado?</h2>
      <p class="sub">Los tests de este tipo pueden dar resultados distintos según cómo se calcula la coincidencia. Por eso comprobamos el tuyo con un segundo método y te avisamos si hay empates o pocas respuestas.</p>
      <p class="rel ${r.level}" style="margin-top:8px"><i></i>Solidez ${r.level}</p></div>
      <ul class="checks">${r.checks.map((c) => `<li>${c.ok ? ICON.ok : ICON.warn}<span>${esc(c.txt)}</span></li>`).join("")}</ul>
    </div>`;
}

function renderReview() {
  const st = ST(), ro = !!SHARED;
  const ids = st.order && st.order.length ? st.order : BANK.questions.filter((q) => st.ans[q.id] !== undefined).map((q) => q.id);
  const avail = partiesIn(st.prov);
  const f = UI.reviewFilter;
  const keep = (id) => f === "all" || (f === "doubt" && (st.ans[id] === 0 || st.ans[id] === 3)) || (f === "imp" && st.imp[id]) || (f === "firm" && (st.ans[id] === 1 || st.ans[id] === 5));
  const groups = BANK.areas.map((a) => ({ a, ids: ids.filter((id) => Q[id].area === a.id && keep(id)) })).filter((g) => g.ids.length);
  const opt = (q, v) => [1, 2, 3, 4, 5].map((n) => `<option value="${n}"${v === n ? " selected" : ""}>${n} · ${esc(q.type === "dilema" ? DIL[n - 1] : LIK[n - 1])}</option>`).join("")
    + `<option value="0"${v === 0 ? " selected" : ""}>No lo sé</option>${v === undefined ? '<option value="" selected>Sin responder</option>' : ""}`;
  const positions = (q) => {
    const cols = [1, 2, 3, 4, 5].map((n) => {
      const ps = avail.filter((pid) => q.pos[pid] === n);
      const you = st.ans[q.id] === n;
      return `<div class="pc5${you ? " you" : ""}"><span>${n} · ${esc(q.type === "dilema" ? DIL[n - 1] : LIK[n - 1])}</span>${you ? '<span class="you-tag">Tú</span>' : ""}<span class="chips">${ps.map((pid) => `<span class="chip${q.est.includes(pid) ? " est" : ""}" title="${q.est.includes(pid) ? "Postura estimada" : "Postura documentada"}"><i class="sw" style="background:${P[pid].color}"></i>${esc(P[pid].ab)}</span>`).join("")}</span></div>`;
    }).join("");
    const unk = avail.filter((pid) => !q.pos[pid]);
    return `<div class="pos5">${cols}</div>${unk.length ? `<p class="unk">Sin postura conocida: ${unk.map((pid) => esc(P[pid].ab)).join(", ")}.</p>` : ""}<p class="unk">Las etiquetas con borde discontinuo y en cursiva son posturas estimadas.</p>`;
  };
  $("#r-review").innerHTML = `
    <div class="sec-head"><p class="label">Tus respuestas</p><h2 id="review-h" class="h2">Revisa y cambia lo que quieras</h2>
    <p class="sub">${ro ? "Respuestas del resultado compartido. Despliega cada pregunta para ver qué responde cada partido." : "Si cambias una respuesta o su importancia, el resultado se recalcula al momento. Despliega cada pregunta para ver qué responde cada partido de tu provincia."}</p></div>
    <div class="review-tools"><label class="label" for="rv-filter">Mostrar</label><select id="rv-filter" data-ctl="rv" style="width:auto;min-height:42px">
      <option value="all"${f === "all" ? " selected" : ""}>Todas (${ids.length})</option>
      <option value="firm"${f === "firm" ? " selected" : ""}>Posiciones firmes</option>
      <option value="doubt"${f === "doubt" ? " selected" : ""}>Neutrales y «No lo sé»</option>
      <option value="imp"${f === "imp" ? " selected" : ""}>Marcadas como importantes</option></select></div>
    ${groups.map((g) => `<div class="rv-area"><h3 class="h3"><span class="al">${g.a.letter}</span>${esc(g.a.name)}</h3>
      ${g.ids.map((id) => { const q = Q[id], v = st.ans[id]; return `<div class="rv" data-q="${id}">
        <span class="q-code" style="width:fit-content">${qCode(q)}</span>
        <div class="rv-text"><b>${esc(q.text)}</b>${q.type === "dilema" ? `<p>A: ${esc(q.A)} · B: ${esc(q.B)}</p>` : ""}</div>
        <div class="rv-ctl"><label class="sr" for="rv-${id}">Tu respuesta a ${esc(q.short)}</label><select id="rv-${id}" data-ctl="ans" data-q="${id}"${ro ? " disabled" : ""}>${opt(q, v)}</select></div>
        <div class="rv-ctl"><button type="button" class="imp" data-ctl="imp" data-q="${id}" aria-pressed="${!!st.imp[id]}"${ro ? " disabled" : ""}>${ICON.starO}${ICON.starF}<span>Importante</span></button></div>
        <div class="rv-more"><details class="more"><summary>Contexto y posturas de los partidos</summary><p class="dinfo" style="margin:8px 0">${esc(q.ctx)}</p>${positions(q)}</details></div>
      </div>`; }).join("")}</div>`).join("") || '<p class="muted">No hay preguntas con este filtro.</p>'}`;
}

// ───────────────────────────── MENOR AFINIDAD
// Mismo cálculo que el ranking. Solo entran candidaturas con cobertura suficiente (sin relleno neutro)
// y fuera de tu top 3. Neutral y «No lo sé» nunca cuentan como discrepancia.
const LEAST_MIN_ANS = 8;
const sideOf = (v) => Math.sign(v - 3);
function leastModel(M) {
  const st = M.st, top = new Set(M.prov.slice(0, 3).map((m) => m.pid));
  const pool = M.prov.filter((m) => !m.padded && !top.has(m.pid));
  const rankWithout = (qid) => {
    const qs = M.qs.filter((q) => q.id !== qid);
    return pool.map((m) => matchParty(m.pid, st, qs, M.user)).sort((a, b) => a.score - b.score || b.n - a.n).slice(0, 3).map((m) => m.pid);
  };
  const bottom = [...pool].sort((a, b) => a.score - b.score || b.n - a.n).slice(0, 3);
  return { pool, list: bottom.map((m) => {
    const w = (i) => weightOf(i.q, st) * (i.est ? W_ESTIMATED : 1);
    const clash = m.items.filter((i) => sideOf(i.u) && sideOf(i.v) && sideOf(i.u) !== sideOf(i.v)).sort((a, b) => b.d * w(b) - a.d * w(a));
    const agree = m.items.filter((i) => sideOf(i.u) && sideOf(i.u) === sideOf(i.v));
    const dist = m.items.reduce((a, i) => a + w(i) * i.d / 4, 0);
    const key = [...m.items].sort((a, b) => w(b) * b.d - w(a) * a.d)[0];
    const keyShare = key && dist ? w(key) * key.d / 4 / dist : 0;
    const aa = areaAff(m).sort((a, b) => a.v - b.v || b.n - a.n);
    const areas = aa.filter((x) => x.n >= 2 && x.v < 0.5).slice(0, 2);
    const pd = PARTY_DIM[m.pid];
    const dim = Object.entries(M.user.dims).filter(([k]) => pd[k] !== undefined).map(([k, o]) => ({ d: DIM[k], u: o.v, p: pd[k], gap: Math.abs(o.v - pd[k]) })).sort((a, b) => b.gap - a.gap)[0];
    return { m, clash, agree, key, keyShare, stable: key ? rankWithout(key.q.id).includes(m.pid) : true, areas, dim: dim && dim.gap >= 40 ? dim : null };
  }) };
}
function leastText(x, rank) {
  const st = ST(), m = x.m, nm = pName(m.pid, st.prov), ab = P[m.pid].ab;
  const list = (arr) => arr.length <= 1 ? arr.join("") : `${arr.slice(0, -1).join(", ")} y ${arr[arr.length - 1]}`;
  let t = rank === 0 ? `<b>${esc(nm)}</b> es la candidatura de ${esc(PROV[st.prov].name)} más alejada de tus respuestas: coincidís un ${m.pct} % en las ${m.n} preguntas en las que tiene postura conocida.`
    : `Con <b>${esc(nm)}</b> coincides un ${m.pct} % en las ${m.n} preguntas en las que tiene postura conocida.`;
  t += x.clash.length ? ` Estáis en lados opuestos en ${x.clash.length} de ellas${x.areas.length ? `, sobre todo en ${esc(list(x.areas.map((a) => a.a.name.toLowerCase())))}` : ""}.` : " No llegáis a estar en lados opuestos en ninguna: la distancia viene de diferencias de grado.";
  if (x.dim) {
    const side = (v) => Math.abs(v) < 15 ? "una posición intermedia" : DIM_PHRASE[x.dim.d.id][v < 0 ? 0 : 1];
    t += Math.sign(x.dim.u) !== Math.sign(x.dim.p) && Math.abs(x.dim.u) >= 15 && Math.abs(x.dim.p) >= 15
      ? ` La mayor distancia de fondo está en ${esc(DIM_SHORT[x.dim.d.id])}: tú te inclinas por ${esc(side(x.dim.u))} y ${esc(ab)} por ${esc(side(x.dim.p))}.`
      : ` La mayor distancia de fondo está en ${esc(DIM_SHORT[x.dim.d.id])} (tú: ${esc(side(x.dim.u))}; ${esc(ab)}: ${esc(side(x.dim.p))}).`;
  }
  if (x.agree.length) t += ` Aun así, coincidís en ${x.agree.length} ${x.agree.length === 1 ? "cuestión" : "cuestiones"}, como «${esc([...x.agree].sort((a, b) => (Math.abs(b.u - 3) + Math.abs(b.v - 3) - b.d) - (Math.abs(a.u - 3) + Math.abs(a.v - 3) - a.d))[0].q.short)}».`;
  return t;
}
function renderLeast() {
  const st = ST(), M = MODEL, pr = PROV[st.prov];
  const head = `<div class="sec-head"><p class="label">Menor afinidad</p><h2 id="least-h" class="h2">Los 3 partidos con los que menos coincides</h2>
    <p class="sub">Las candidaturas de ${esc(pr.name)} más alejadas de tus respuestas, con el mismo cálculo que el ranking. Tus respuestas neutrales y «No lo sé» no cuentan como discrepancia, y excluimos a las candidaturas con muy pocas posturas conocidas para no señalar a nadie sin datos.</p></div>`;
  const firm = M.qs.filter((q) => st.ans[q.id] !== 3).length;
  if (firm < LEAST_MIN_ANS) {
    $("#r-least").innerHTML = `${head}<ul class="cmp"><li class="empty">Solo ${firm === 1 ? "una de tus respuestas toma" : `${firm} de tus respuestas toman`} partido. No hay datos suficientes para decir con quién coincides menos: hacen falta al menos ${LEAST_MIN_ANS} respuestas de acuerdo o en desacuerdo.</li></ul>`;
    return;
  }
  const L = leastModel(M);
  if (!L.list.length) {
    $("#r-least").innerHTML = `${head}<ul class="cmp"><li class="empty">En ${esc(pr.name)} no hay, fuera de tu top 3, candidaturas con suficientes posturas conocidas para compararlas con fiabilidad.</li></ul>`;
    return;
  }
  const cards = L.list.map((x, i) => {
    const m = x.m, p = P[m.pid], nm = pName(m.pid, st.prov);
    const affRows = x.areas.map((a) => `<div class="affrow"><span>${esc(a.a.name)}</span><span class="bar"><i style="width:${Math.round(a.v * 100)}%"></i></span><span class="v">${Math.round(a.v * 100)}</span></div>`).join("");
    const keyNote = !x.key ? "" : x.stable
      ? `Ninguna pregunta decide por sí sola este resultado: sin «${esc(x.key.q.short)}», la que más os separa, ${esc(p.ab)} seguiría entre las tres últimas.`
      : `Ojo: este puesto depende en buena parte de «${esc(x.key.q.short)}». Sin esa pregunta, ${esc(p.ab)} saldría de las tres últimas.`;
    return `<article class="pcard" id="least-${m.pid}" aria-labelledby="lh-${m.pid}">
      <div class="phead">${logo(m.pid)}<div style="display:grid;gap:3px;min-width:0"><h3 id="lh-${m.pid}">${esc(nm)}</h3><span class="tag">${esc(p.ab)} · ${esc(p.tag)}</span></div>
        <div class="pc"><b>${m.pct}<small style="font-size:.45em">%</small></b><span>coincidencia</span></div></div>
      <div class="metrics">
        <div class="metric"><b>${x.clash.length}/${m.n}</b><span>En lados opuestos</span></div>
        <div class="metric"><b>${x.agree.length}</b><span>Coincidencias claras</span></div>
        <div class="metric"><b>${m.n ? Math.round(m.nEst / m.n * 100) : 0} %</b><span>Posturas estimadas</span></div>
      </div>
      <p class="why">${leastText(x, i)}</p>
      <div class="two">
        <div><p class="subh" style="color:var(--ko)">Dónde más os separáis (${x.clash.length})</p>${cmpList(x.clash, p.ab, "No hay preguntas en las que estéis en lados opuestos.")}</div>
        <div><p class="subh">Áreas con menos coincidencia</p>${affRows ? `<div class="aff" style="grid-template-columns:1fr">${affRows}</div>` : '<ul class="cmp"><li class="empty">Ninguna área baja del 50 % con al menos dos preguntas.</li></ul>'}
          <p class="small muted" style="margin-top:12px">${keyNote}</p></div>
      </div>
    </article>`;
  }).join("");
  $("#r-least").innerHTML = `${head}
    ${L.list.length < 3 ? `<p class="small muted">Solo ${L.list.length === 1 ? "una candidatura cumple" : `${L.list.length} candidaturas cumplen`} los requisitos para compararla con fiabilidad.</p>` : ""}
    <div class="pcards">${cards}</div>`;
}

// ───────────────────────────── POLÍTICOS
// Solo se comparan las posturas públicas propias de cada persona (data/politicos.json), nunca las de su
// partido. Pocas posturas por persona: se muestra un nivel cualitativo, no un porcentaje.
const POL_MIN = 2, POL_SHOW = 5, POL_CUT = 0.62;
function matchPolitician(x, st) {
  const items = Object.entries(x.pos).filter(([qid]) => Q[qid] && st.ans[qid] >= 1)
    .map(([qid, [v, basis]]) => { const q = Q[qid], u = st.ans[qid]; return { q, u, v, basis, d: Math.abs(u - v), w: weightOf(q, st) }; });
  const sw = items.reduce((a, i) => a + i.w, 0), sa = items.reduce((a, i) => a + i.w * (1 - i.d / 4), 0);
  const agree = items.filter((i) => sideOf(i.u) && sideOf(i.u) === sideOf(i.v));
  const clash = items.filter((i) => sideOf(i.u) && sideOf(i.v) && sideOf(i.u) !== sideOf(i.v));
  // Suavizado hacia el 50 %: con dos o tres posturas, un acierto no basta para quedar arriba
  return { x, items, agree, clash, n: items.length, score: (sa + 0.5) / (sw + 1) };
}
const polLevel = (s) => s >= 0.85 ? "Muy alta" : s >= 0.72 ? "Alta" : "Moderada";
const initials = (name) => name.split(/\s+/).filter((w) => /^[A-ZÁÉÍÓÚÑ]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
function renderPoliticians() {
  const st = ST(), M = MODEL;
  const head = `<div class="sec-head"><p class="label">Políticos</p><h2 id="pols-h" class="h2">Los políticos con los que más coincides</h2>
    <p class="sub">Comparamos tus respuestas solo con lo que cada persona ha defendido públicamente o impulsado desde su cargo, no con el programa de su partido. Como de cada una conocemos pocas posturas, mostramos un nivel orientativo y no un porcentaje.</p></div>`;
  const all = POLS.map((x) => matchPolitician(x, st));
  const top = all.filter((r) => r.n >= POL_MIN && r.agree.length >= POL_MIN && r.score >= POL_CUT)
    .sort((a, b) => b.score - a.score || b.agree.length - a.agree.length).slice(0, POL_SHOW);
  const method = `<details class="more"><summary>Qué políticos se comparan y cómo</summary><div class="small" style="display:grid;gap:8px;margin-top:10px">
    <p>Comparamos ${POLS.length} perfiles con posturas propias documentadas: ${esc(POLS.map((x) => x.name).join(", "))}. Cada postura se apoya en una propuesta, una decisión de gobierno, una votación que ha liderado o una declaración pública, y la puedes leer en su ficha.</p>
    <p>Solo aparece quien comparte contigo al menos ${POL_MIN} posturas claras y supera un nivel mínimo de afinidad. El cálculo es el mismo acuerdo pregunta a pregunta que con los partidos, suavizado hacia el 50 % porque cada persona tiene pocas posturas conocidas. Tus respuestas neutrales cuentan con la mitad de peso y «No lo sé» no cuenta. Cargos a 17 de octubre de 2026.</p>
    <p>Fotos: Wikimedia Commons, con licencia libre o reutilización autorizada citando la fuente, y la autoría indicada en cada ficha.</p></div></details>`;
  if (!POLS.length) { $("#r-pols").innerHTML = `${head}<ul class="cmp"><li class="empty">No se han podido cargar los perfiles de los políticos. Recarga la página para intentarlo de nuevo.</li></ul>`; return; }
  if (!top.length) {
    $("#r-pols").innerHTML = `${head}<ul class="cmp"><li class="empty">Con tus respuestas no hay suficientes coincidencias claras con las posturas personales documentadas de ningún político: necesitamos al menos ${POL_MIN} en común.${st.mode !== "completa" && !SHARED ? " Una versión más larga del test incluye más preguntas sobre las que se han pronunciado." : ""}</li></ul>${method}`;
    return;
  }
  const best = (r) => [...r.agree].sort((a, b) => (Math.abs(b.u - 3) + Math.abs(b.v - 3) - b.d) - (Math.abs(a.u - 3) + Math.abs(a.v - 3) - a.d) || b.w - a.w);
  const cards = top.map((r) => {
    const x = r.x, p = P[x.party], ex = best(r).slice(0, 2), diff = [...r.clash].sort((a, b) => b.d - a.d)[0];
    const list = (arr) => arr.length <= 1 ? arr.join("") : `${arr.slice(0, -1).join(", ")} y ${arr[arr.length - 1]}`;
    const why = `Coincidís en ${r.agree.length} de las ${r.n} cuestiones en las que conocemos su postura personal y que has respondido${r.clash.length ? `, y discrepáis en ${r.clash.length}` : ""}. Pensáis parecido sobre ${esc(list(best(r).slice(0, 3).map((i) => `«${i.q.short}»`)))}.`
      + (x.party !== M.prov[0]?.pid ? ` Su partido no es tu candidatura más afín: aquí solo cuentan sus posturas personales.` : "");
    const photo = x.photo
      ? `<img src="${esc(x.photo.src)}" alt="Retrato de ${esc(x.name)}" width="88" height="88" loading="lazy" decoding="async">`
      : `<span class="pol-ini" aria-hidden="true">${esc(initials(x.name))}</span>`;
    const exRow = (i) => `<li><b>${esc(i.q.short)}</b><span>Tú: ${esc(answerText(i.q, i.u, true))} · ${esc(x.name)}: ${esc(i.basis)}</span></li>`;
    return `<article class="pcard pol" id="pol-${x.id}" aria-labelledby="polh-${x.id}">
      <div class="pol-head"><figure class="pol-ph" data-ini="${esc(initials(x.name))}"${x.photo ? "" : ' role="img" aria-label="Sin foto disponible"'}>${photo}</figure>
        <div style="display:grid;gap:4px;min-width:0"><h3 id="polh-${x.id}" class="pol-name">${esc(x.name)}</h3>
          <span class="pol-party"><i style="background:${p.color}"></i>${esc(x.partyLabel)}${x.partyLabel.toLowerCase().includes(p.ab.toLowerCase()) ? "" : ` (${esc(p.ab)})`}</span>
          <span class="pol-role">${esc(x.role)}</span></div></div>
      <div class="metrics"><div class="metric"><b>${polLevel(r.score)}</b><span>Afinidad orientativa</span></div><div class="metric"><b>${r.agree.length} de ${r.n}</b><span>Posturas en común</span></div></div>
      <p class="why" style="font-size:16.5px">${why}</p>
      <div><p class="subh" style="color:var(--ok)">En qué coincidís</p><ul class="cmp">${ex.map(exRow).join("")}</ul></div>
      ${diff ? `<div><p class="subh" style="color:var(--ko)">Dónde no</p><ul class="cmp">${exRow(diff)}</ul></div>` : ""}
      ${x.photo ? `<p class="pol-credit">Foto: ${esc(x.photo.author)} · ${esc(x.photo.license)} · <a href="${esc(x.photo.source)}" target="_blank" rel="noopener">Wikimedia Commons</a></p>` : ""}
    </article>`;
  }).join("");
  $("#r-pols").innerHTML = `${head}
    ${top.length < 3 ? `<p class="small muted">Solo ${top.length === 1 ? "una persona supera" : `${top.length} personas superan`} el mínimo de posturas en común; preferimos no completar la lista con coincidencias débiles.</p>` : ""}
    <div class="pols">${cards}</div>${method}`;
  // La CSP no permite onerror en línea: si una foto falla, se sustituye por las iniciales
  $$("#r-pols .pol-ph img").forEach((img) => {
    const swap = () => { const f = img.parentElement; f.setAttribute("role", "img"); f.setAttribute("aria-label", img.alt); img.replaceWith(Object.assign(document.createElement("span"), { className: "pol-ini", textContent: f.dataset.ini })); };
    if (img.complete && !img.naturalWidth) swap(); else img.addEventListener("error", swap, { once: true });
  });
}

// ───────────────────────────── APOYO
// Solo un enlace externo: no se carga ningún script de la plataforma ni se le envía nada del test.
const donatePlatform = () => /ko-fi\.com$/.test(new URL(DONATE_URL).hostname) ? "Ko-fi" : "PayPal";
function renderSupport() {
  const act = DONATE_URL
    ? `<a class="btn btn-primary" href="${esc(DONATE_URL)}" target="_blank" rel="noopener noreferrer">Apoyar el proyecto<span class="sr"> (se abre ${donatePlatform()} en una pestaña nueva)</span></a>
       <p class="small muted">Se abre ${donatePlatform()}, donde eliges si quieres aportar y cuánto. Tus respuestas no se envían.</p>`
    : `<button type="button" class="btn btn-primary" disabled aria-describedby="support-off">Apoyar el proyecto</button>
       <p id="support-off" class="small muted">Las aportaciones todavía no están activadas.</p>`;
  $("#r-support").innerHTML = `
    <div class="support">
      <div class="sec-head"><h2 id="support-h" class="h2">¿Te ha resultado útil el test?</h2>
        <p class="sub">Este proyecto busca ayudarte a comprender mejor las distintas posiciones políticas de una forma clara, independiente y accesible. Si te ha resultado útil y quieres contribuir a que siga mejorando, puedes apoyarlo con una pequeña aportación voluntaria.</p>
        <p class="small muted">El test es y seguirá siendo gratuito. Aportar es opcional y no cambia ningún resultado.</p></div>
      <div class="support-act">${act}</div>
    </div>`;
}

function bindResults() {
  const root = $("#v-results");
  root.addEventListener("change", (e) => {
    const el = e.target, c = el.dataset.ctl; if (!c) return;
    if (c === "cmp") { UI.cmp = el.value || null; renderDims(); renderAreas(); $("#cmp-sel").focus(); }
    else if (c === "mx" || c === "my") { UI[c] = el.value; renderMap(); $(c === "mx" ? "#map-x" : "#map-y").focus(); }
    else if (c === "rv") { UI.reviewFilter = el.value; renderReview(); $("#rv-filter").focus(); }
    else if (c === "ans" && !SHARED) {
      const id = el.dataset.q, v = el.value === "" ? undefined : Number(el.value);
      if (v === undefined) delete S.ans[id]; else S.ans[id] = v;
      save(); rerenderAfterEdit();
      el.closest(".rv").classList.add("changed");
      toast("Resultado recalculado");
    }
  });
  root.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#r-"]');
    if (a) { e.preventDefault(); const t = $(a.getAttribute("href")); if (t) { t.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" }); const h = t.querySelector("h1, h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } } return; }
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.scope) { UI.scope = b.dataset.scope; renderParties(); $(`[data-scope="${UI.scope}"]`).focus(); return; }
    if (b.dataset.ctl === "imp" && !SHARED) {
      const id = b.dataset.q; S.imp[id] = !S.imp[id]; if (!S.imp[id]) delete S.imp[id];
      b.setAttribute("aria-pressed", String(!!S.imp[id])); save(); rerenderAfterEdit(); toast("Resultado recalculado"); return;
    }
    const act = b.dataset.act;
    if (act === "more") {
      const next = S.mode === "expres" ? "media" : "completa";
      S.mode = next; S.order = buildOrder(next, S.seed);
      const first = S.order.findIndex((id) => S.ans[id] === undefined);
      S.idx = first < 0 ? S.order.length - 1 : first; S.stage = "quiz"; save();
      renderQuestion(0); go("quiz", { focus: false }); focusStatement();
    } else if (act === "new") { const keep = { prov: S.prov, sex: S.sex, age: S.age, mode: S.mode }; S = null; store.del(KEY); fillSetup(keep); go("home"); $("#f-prov").focus(); }
    else if (act === "own-test") { SHARED = null; try { history.replaceState(null, "", location.pathname + location.search); } catch { /* sin historial */ } S = loadState(); fillSetup(); go("home"); }
  });
}

// ───────────────────────────── Compartir
// Enlace con fragmento (#r2…): solo letras y números. Incluye provincia, versión, prioridades y
// respuestas (con su importancia) en el orden del banco. No incluye sexo ni edad.
function encodeShare(st) {
  const prov = PROV_LIST.indexOf(st.prov).toString(36).padStart(2, "0");
  const mode = { expres: "e", media: "m", completa: "c" }[st.mode] || "e";
  const mask = BANK.areas.reduce((m, a, i) => m | (st.prios.includes(a.id) ? 1 << i : 0), 0).toString(36).padStart(3, "0");
  const ans = BANK.questions.map((q) => { const v = st.ans[q.id]; if (v === undefined) return "0"; if (v === 0) return "n"; return st.imp[q.id] ? "abcde"[v - 1] : String(v); }).join("");
  return `r2${prov}${mode}${mask}${ans}`;
}
function decodeShare(hash) {
  const m = /^#r2([0-9a-z]{2})([emc])([0-9a-z]{3})([0-5na-e]+)$/.exec(hash || "");
  if (!m || m[4].length !== BANK.questions.length) return null;
  const prov = PROV_LIST[parseInt(m[1], 36)]; if (!prov) return null;
  const mask = parseInt(m[3], 36), ans = {}, imp = {};
  BANK.questions.forEach((q, i) => {
    const c = m[4][i];
    if (c === "0") return;
    if (c === "n") ans[q.id] = 0;
    else if (/[a-e]/.test(c)) { ans[q.id] = "abcde".indexOf(c) + 1; imp[q.id] = true; }
    else ans[q.id] = Number(c);
  });
  if (!Object.keys(ans).length) return null;
  return { v: 2, prov, mode: { e: "expres", m: "media", c: "completa" }[m[2]], ans, imp, prios: BANK.areas.filter((a, i) => mask & (1 << i)).map((a) => a.id), order: null, stage: "done", seed: 0 };
}
async function copyText(text, okMsg, fallbackEl) {
  try { await navigator.clipboard.writeText(text); toast(okMsg); return true; }
  catch { showCopyFallback(text, fallbackEl); return false; }
}
function showCopyFallback(text, el) {
  if (el) { el.focus(); el.select(); shareStatus("Tu navegador no deja copiar automáticamente: el texto está seleccionado, cópialo con Ctrl+C o «Copiar».", "warn"); return; }
  let box = $("#copy-fallback");
  if (!box) { box = document.createElement("div"); box.id = "copy-fallback"; box.className = "wrap"; $("#v-results").appendChild(box); }
  box.innerHTML = `<div class="sheet" style="padding:16px;display:grid;gap:8px;margin-top:20px"><label class="label" for="copy-ta">Copia este texto</label><textarea id="copy-ta" rows="4" style="width:100%;font:inherit;font-size:14px;padding:10px;border:1px solid var(--rule);border-radius:8px;background:var(--sheet-2)">${esc(text)}</textarea></div>`;
  const ta = $("#copy-ta"); ta.focus(); ta.select();
  toast("Selecciona el texto y cópialo");
}

// URL que se comparte: la de la propia web cuando se usa desde su dirección pública;
// desde la vista previa en Claude o en local, la dirección pública configurada.
const IN_FRAME = (() => { try { return window.self !== window.top; } catch { return true; } })();
function siteUrl() {
  const local = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname);
  if (!IN_FRAME && /^https:$/.test(location.protocol) && !local) return location.origin + location.pathname;
  return PUBLIC_URL;
}
const siteHost = () => siteUrl().replace(/^https?:\/\//, "").replace(/\/$/, "");

const SH = { fmt: "story", party: true, text: "", edited: false, blobs: {}, urls: {}, gen: 0 };
const FMT = {
  story: { label: "Historia", hint: "9:16 · 1080 × 1920", w: 1080, h: 1920, file: "historia" },
  square: { label: "Cuadrada", hint: "1:1 · 1080 × 1080", w: 1080, h: 1080, file: "cuadrada" },
  wide: { label: "Horizontal", hint: "1,91:1 · 1200 × 630", w: 1200, h: 630, file: "horizontal" }
};
function profileFirst(M) {
  return profileSentence(M).head.replace(/^Te inclinas por/, "Me inclino por").replace(/^Tus respuestas no se inclinan/, "Mis respuestas no se inclinan");
}
function buildShareText() {
  const st = S, M = MODEL, top = M.prov[0];
  const lines = ["He hecho el Test 29N, el test político de las elecciones generales."];
  if (SH.party && top) lines.push(`Mi mayor coincidencia en ${PROV[st.prov].name}: ${pName(top.pid, st.prov)} (${top.pct} %).`);
  lines.push(`Mi perfil: ${lcFirst(profileFirst(M))}`);
  lines.push("", `¿Y tú? Haz el test aquí: ${siteUrl()}`);
  return lines.join("\n");
}
// X cuenta cada enlace como 23 caracteres
const xLength = (t) => [...t.replace(/https?:\/\/\S+/g, "x".repeat(23))].length;
const xHref = (t) => `https://x.com/intent/tweet?text=${encodeURIComponent(t)}`;
const waHref = (t) => `https://wa.me/?text=${encodeURIComponent(t)}`;

const SVG = {
  x: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  wa: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" d="M4.2 19.8l1.1-3.9A8.6 8.6 0 1 1 8.4 19l-4.2.8z"/><path fill="currentColor" d="M9 7.6c.3-.1.6 0 .7.3l.7 1.6c.1.3 0 .5-.1.7l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.5c.2-.2.5-.2.7-.1l1.6.7c.3.1.4.4.3.7-.3 1-1.2 1.6-2.2 1.4-2.8-.6-5-2.8-5.6-5.6-.2-1 .4-1.9 1.4-2.2z"/></svg>',
  ig: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.3" cy="6.7" r="1.3" fill="currentColor"/></svg>',
  copy: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  dl: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  link: '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>'
};

function renderShare() {
  const box = $("#r-share");
  if (!box) return;
  if (SHARED) { box.hidden = true; return; }
  if (!SH.edited || !SH.text) SH.text = buildShareText();
  box.innerHTML = `
    <div class="sec-head"><p class="label">Compartir</p><h2 id="share-h" class="h2">Enseña tu papeleta</h2>
    <p class="sub">Compartir es opcional. Nada sale de tu navegador hasta que pulsas un botón, y solo se envía el texto o la imagen que ves aquí, nunca tus respuestas.</p></div>
    <div class="share-grid">
      <figure class="card-prev">
        <div class="fmt-tabs" role="radiogroup" aria-label="Formato de la imagen">
          ${Object.entries(FMT).map(([k, f]) => `<label><input type="radio" name="sh-fmt" value="${k}"${SH.fmt === k ? " checked" : ""}><span><b>${f.label}</b><small>${f.hint}</small></span></label>`).join("")}
        </div>
        <div class="card-frame" data-fmt="${SH.fmt}"><img id="sh-img" alt="Vista previa de tu tarjeta de resultado" hidden><p class="card-loading" id="sh-loading">Generando la imagen…</p></div>
        <figcaption class="small muted">La imagen se crea en tu dispositivo con tu resultado. Puedes descargarla o, en el móvil, mantenerla pulsada para guardarla.</figcaption>
      </figure>
      <div class="share-panel">
        <label class="check"><input type="checkbox" id="sh-party"${SH.party ? " checked" : ""}><span>Incluir mi partido con más coincidencia</span></label>
        <div class="field"><label class="label" for="sh-text">Tu mensaje · puedes editarlo</label><textarea id="sh-text" rows="7" spellcheck="true">${esc(SH.text)}</textarea>
          <p class="small muted" id="sh-count"></p></div>
        <div class="share-btns">
          <a class="sbtn sbtn-x" id="sh-x" href="${xHref(SH.text)}" target="_blank" rel="noopener noreferrer">${SVG.x}<span><b>Publicar en X</b><small>Se abre X con el texto listo</small></span></a>
          <a class="sbtn sbtn-wa" id="sh-wa" href="${waHref(SH.text)}" target="_blank" rel="noopener noreferrer">${SVG.wa}<span><b>Enviar por WhatsApp</b><small>Eliges tú el chat o grupo</small></span></a>
          <button type="button" class="sbtn sbtn-ig" id="sh-ig">${SVG.ig}<span><b>Imagen para Instagram</b><small>Historia vertical para subir tú</small></span></button>
          <button type="button" class="sbtn sbtn-copy" id="sh-copy">${SVG.copy}<span><b>Copiar resultado</b><small>El mensaje, al portapapeles</small></span></button>
        </div>
        <p class="share-help">X y WhatsApp se abren con el mensaje preparado para que lo revises: nada se publica ni se envía sin que lo confirmes. Instagram no permite publicar desde una web, así que preparamos la imagen vertical y, si tu móvil lo permite, abrimos el menú de compartir para que elijas Instagram; si no, se descarga para que la subas a tu historia.</p>
        <p class="sh-status" id="sh-status" role="status" aria-live="polite"></p>
        <div class="share-more">
          <button type="button" class="btn btn-ghost btn-sm" id="sh-dl">${SVG.dl}Descargar imagen PNG</button>
          <button type="button" class="btn btn-ghost btn-sm" id="sh-invite">${SVG.link}Invitar sin compartir mi resultado</button>
        </div>
        <details class="more"><summary>Enlace a mi resultado completo</summary>
          <p class="dinfo" style="margin:8px 0">Este enlace permite a quien lo abra ver tu resultado completo, <b>incluidas tus respuestas a cada pregunta</b>, tu provincia y tus prioridades (no tu sexo ni tu edad). Va dentro del propio enlace: no se guarda en ningún servidor. Compártelo solo si quieres que se vean tus respuestas.</p>
          <button type="button" class="btn btn-ghost btn-sm" id="sh-full">${SVG.link}Copiar enlace con mis respuestas</button>
        </details>
      </div>
    </div>`;
  updateShareLinks();
  refreshCard();
}
function updateShareLinks() {
  const t = SH.text;
  const x = $("#sh-x"), w = $("#sh-wa"); if (!x) return;
  x.href = xHref(t); w.href = waHref(t);
  const n = xLength(t);
  $("#sh-count").textContent = n > 280 ? `Para X: ${n}/280 caracteres. Acórtalo un poco o X te pedirá recortarlo.` : `Para X: ${n}/280 caracteres.`;
}
function shareStatus(msg, kind = "") { const el = $("#sh-status"); if (!el) return; el.className = `sh-status ${kind}`; el.textContent = msg; }

// Tarjeta: se dibuja en un canvas y se guarda en caché por formato para poder compartirla
// al instante desde el gesto del usuario (algunos navegadores lo exigen).
function invalidateCards() { for (const k of Object.keys(SH.urls)) URL.revokeObjectURL(SH.urls[k]); SH.blobs = {}; SH.urls = {}; SH.gen++; }
async function cardBlob(fmt) {
  if (SH.blobs[fmt]) return SH.blobs[fmt];
  const gen = SH.gen;
  const canvas = await drawCard(fmt);
  const blob = await new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob"))), "image/png"));
  if (gen === SH.gen) { SH.blobs[fmt] = blob; SH.urls[fmt] = URL.createObjectURL(blob); }
  return blob;
}
async function refreshCard() {
  const fmt = SH.fmt, img = $("#sh-img"), frame = $(".card-frame");
  if (!img) return;
  frame.dataset.fmt = fmt;
  frame.setAttribute("aria-busy", "true");
  try {
    await cardBlob(fmt);
    if (fmt !== SH.fmt || !SH.urls[fmt]) return;
    img.src = SH.urls[fmt]; img.hidden = false; $("#sh-loading").hidden = true; frame.removeAttribute("aria-busy");
    img.alt = `Tarjeta de resultado en formato ${FMT[fmt].label.toLowerCase()}: ${profileFirst(MODEL)}`;
    if (fmt !== "story") cardBlob("story").catch(() => {});
  } catch (e) { console.error(e); $("#sh-loading").textContent = "No se ha podido generar la imagen en este navegador."; }
}
async function downloadCard(fmt) {
  try {
    shareStatus("Preparando la imagen…");
    await cardBlob(fmt);
    const a = document.createElement("a");
    a.href = SH.urls[fmt]; a.download = `test-29n-${FMT[fmt].file}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    shareStatus(IN_FRAME
      ? "Si no se ha descargado, mantén pulsada la vista previa (o haz clic derecho) y elige «Guardar imagen»."
      : `Imagen ${FMT[fmt].label.toLowerCase()} descargada (${FMT[fmt].w} × ${FMT[fmt].h}).`, "ok");
  } catch { shareStatus("No se ha podido crear la imagen. Prueba a hacer una captura de pantalla de la vista previa.", "warn"); }
}
async function shareInstagram() {
  const blob = SH.blobs.story;
  if (!blob) { shareStatus("Preparando la imagen vertical…"); await cardBlob("story"); }
  const file = new File([SH.blobs.story], "test-29n-historia.png", { type: "image/png" });
  if (!IN_FRAME && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: "Mi resultado del Test 29N" });
      shareStatus("Listo. Si has elegido Instagram, termina la publicación allí.", "ok");
    } catch (e) {
      if (e.name === "AbortError") shareStatus("Has cerrado el menú de compartir. Puedes descargar la imagen cuando quieras.");
      else { await downloadCard("story"); }
    }
    return;
  }
  SH.fmt = "story";
  $$('input[name="sh-fmt"]').forEach((r) => { r.checked = r.value === "story"; });
  refreshCard();
  await downloadCard("story");
  shareStatus(`${$("#sh-status").textContent} En Instagram: pulsa «Tu historia» y elige la imagen de tu galería. Instagram no permite publicar directamente desde una web.`, "ok");
}
async function inviteOnly() {
  const url = siteUrl();
  const text = "Te paso este test político sobre los debates reales de España, con contexto en cada pregunta. Haz el tuyo:";
  if (!IN_FRAME && navigator.share) {
    try { await navigator.share({ title: "Test 29N", text, url }); shareStatus("Enlace compartido.", "ok"); return; }
    catch (e) { if (e.name === "AbortError") { shareStatus("Has cerrado el menú de compartir."); return; } }
  }
  if (await copyText(`${text} ${url}`, "Enlace copiado")) shareStatus("Enlace a la web copiado, sin tu resultado.", "ok");
}

function bindShare() {
  const root = $("#v-results");
  root.addEventListener("input", (e) => {
    if (e.target.id === "sh-text") { SH.text = e.target.value; SH.edited = true; updateShareLinks(); }
  });
  root.addEventListener("change", (e) => {
    if (e.target.name === "sh-fmt") { SH.fmt = e.target.value; refreshCard(); }
    else if (e.target.id === "sh-party") {
      SH.party = e.target.checked; SH.edited = false; SH.text = buildShareText();
      $("#sh-text").value = SH.text; updateShareLinks(); invalidateCards(); refreshCard();
      shareStatus(SH.party ? "Mensaje e imagen incluyen tu partido con más coincidencia." : "Mensaje e imagen ya no incluyen ningún partido.");
    }
  });
  root.addEventListener("click", (e) => {
    const el = e.target.closest("#sh-x, #sh-wa, #sh-ig, #sh-copy, #sh-dl, #sh-invite, #sh-full"); if (!el) return;
    if (el.id === "sh-x") shareStatus("Se ha abierto X en otra pestaña con tu mensaje. Revísalo y publícalo si quieres.", "ok");
    else if (el.id === "sh-wa") shareStatus("Se ha abierto WhatsApp con tu mensaje. Elige el chat o grupo y envíalo.", "ok");
    else if (el.id === "sh-ig") shareInstagram();
    else if (el.id === "sh-copy") copyText(SH.text, "Resultado copiado", $("#sh-text")).then((ok) => ok && shareStatus("Resultado copiado. Pégalo donde quieras.", "ok"));
    else if (el.id === "sh-dl") downloadCard(SH.fmt);
    else if (el.id === "sh-invite") inviteOnly();
    else if (el.id === "sh-full") copyText(`${siteUrl()}#${encodeShare(S)}`, "Enlace copiado").then((ok) => ok && shareStatus("Enlace con tus respuestas copiado.", "ok"));
  });
}

// ── Dibujo de la tarjeta (canvas)
const CC = { paper: "#F2F3EE", sheet: "#FFFFFF", ink: "#111318", ink2: "#434955", ink3: "#676D79", rule: "#D2D5CC", rule2: "#E4E6DF", mark: "#F6DD2F" };
const cf = (w, s, fam = "Archivo") => `${w} ${s}px "${fam}", system-ui, -apple-system, sans-serif`;
function fontsReady() {
  if (!document.fonts || !document.fonts.load) return Promise.resolve();
  const loads = ["900 60px Archivo", "800 60px Archivo", "700 30px Archivo", "600 26px Archivo", "500 40px Newsreader"].map((f) => document.fonts.load(f));
  return Promise.race([Promise.all(loads), new Promise((r) => setTimeout(r, 2500))]);
}
function wrapLines(g, text, maxW) {
  const out = []; let cur = "";
  for (const w of text.split(/\s+/)) { const t = cur ? `${cur} ${w}` : w; if (!cur || g.measureText(t).width <= maxW) cur = t; else { out.push(cur); cur = w; } }
  if (cur) out.push(cur);
  return out;
}
function fitLines(g, text, maxW, maxLines, sizes, weight = 850) {
  for (const s of sizes) { g.font = cf(weight, s); const l = wrapLines(g, text, maxW); if (l.length <= maxLines && l.every((x) => g.measureText(x).width <= maxW)) return { lines: l, size: s }; }
  const s = sizes[sizes.length - 1]; g.font = cf(weight, s);
  const l = wrapLines(g, text, maxW); const cut = l.slice(0, maxLines); cut[maxLines - 1] = cut[maxLines - 1].replace(/\s*\S*$/, "…");
  return { lines: cut, size: s };
}
function rrect(g, x, y, w, h, r) { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); }
function stretch(g, v) { if ("fontStretch" in g) g.fontStretch = v; }
function drawMark(g, x, y, s) {
  const k = s / 40; g.save(); g.translate(x, y); g.scale(k, k);
  g.lineJoin = "round"; g.lineWidth = 2.6; g.strokeStyle = CC.ink;
  g.beginPath(); g.moveTo(7, 4); g.lineTo(27, 4); g.lineTo(34, 11); g.lineTo(34, 36); g.lineTo(7, 36); g.closePath(); g.fillStyle = CC.sheet; g.fill(); g.stroke();
  g.beginPath(); g.moveTo(27, 4); g.lineTo(27, 11); g.lineTo(34, 11); g.stroke();
  g.fillStyle = CC.mark; g.fillRect(11, 20, 19, 7);
  g.beginPath(); g.lineCap = "round"; g.moveTo(12, 31); g.lineTo(26, 31); g.stroke();
  g.restore();
}
function drawBrand(g, x, y, size) {
  drawMark(g, x, y - size * 0.95, size * 1.25);
  stretch(g, "expanded"); g.font = cf(900, size); g.fillStyle = CC.ink; g.textBaseline = "alphabetic";
  const tx = x + size * 1.45; g.fillText("Test", tx, y);
  const w = g.measureText("Test").width; stretch(g, "normal");
  g.font = cf(850, size * 0.52); const ew = g.measureText("29N").width + size * 0.4;
  g.lineWidth = Math.max(2, size * 0.07); g.strokeStyle = CC.ink; rrect(g, tx + w + size * 0.3, y - size * 0.68, ew, size * 0.78, size * 0.12); g.stroke();
  g.fillStyle = CC.ink; g.fillText("29N", tx + w + size * 0.5, y - size * 0.11);
}
function drawDims(g, x, y, w, rowH, M, opts) {
  const nameW = opts.nameW, trackX = x + nameW, trackW = w - nameW;
  BANK.dims.forEach((d, i) => {
    const cy = y + i * rowH + rowH / 2, o = M.user.dims[d.id];
    g.fillStyle = CC.ink; g.font = cf(700, opts.fs); g.textBaseline = "middle"; g.fillText(d.name, x, cy - (opts.poles ? opts.fs * 0.15 : 0));
    if (opts.poles) { g.font = cf(500, opts.fs * 0.62); g.fillStyle = CC.ink3; g.fillText(o ? (Math.abs(o.v) < 15 ? "Equilibrio" : o.v < 0 ? d.a : d.b) : "Sin datos", x, cy + opts.fs * 0.78); }
    g.strokeStyle = CC.rule2; g.lineWidth = 3; g.beginPath(); g.moveTo(trackX, cy); g.lineTo(trackX + trackW, cy); g.stroke();
    g.strokeStyle = CC.rule; g.lineWidth = 3; g.beginPath(); g.moveTo(trackX + trackW / 2, cy - opts.bar); g.lineTo(trackX + trackW / 2, cy + opts.bar); g.stroke();
    if (!o) return;
    const px = trackX + (o.v + 100) / 200 * trackW, cx = trackX + trackW / 2, bh = opts.bar * 1.1;
    if (Math.abs(px - cx) > 1) { g.fillStyle = CC.mark; g.strokeStyle = CC.ink; g.lineWidth = 2.5; rrect(g, Math.min(px, cx), cy - bh / 2, Math.abs(px - cx), bh, bh / 2); g.fill(); g.stroke(); }
    g.fillStyle = CC.ink; g.beginPath(); g.arc(px, cy, opts.bar * 0.95, 0, Math.PI * 2); g.fill();
    g.strokeStyle = CC.sheet; g.lineWidth = 3; g.stroke();
  });
  g.textBaseline = "alphabetic";
}
function drawParty(g, x, y, w, h, M, st, big) {
  const top = M.prov[0];
  g.fillStyle = CC.mark; g.strokeStyle = CC.ink; g.lineWidth = 3; rrect(g, x, y, w, h, 14); g.fill(); g.stroke();
  const pad = big * 0.5;
  g.fillStyle = CC.ink; g.font = cf(700, big * 0.3); stretch(g, "semi-condensed");
  g.fillText(`MI MAYOR COINCIDENCIA EN ${PROV[st.prov].name.toUpperCase()}`, x + pad, y + pad + big * 0.18); stretch(g, "normal");
  const sw = big * 0.9, sy = y + h - pad - sw;
  g.fillStyle = P[top.pid].color; rrect(g, x + pad, sy, sw, sw, 8); g.fill();
  g.fillStyle = textOn(P[top.pid].color); g.font = cf(900, sw * 0.24); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(P[top.pid].ab, x + pad + sw / 2, sy + sw / 2); g.textAlign = "left"; g.textBaseline = "alphabetic";
  g.font = cf(900, big * 1.45); const pctTxt = `${top.pct}%`; const pw = g.measureText(pctTxt).width;
  g.fillStyle = CC.ink; g.fillText(pctTxt, x + w - pad - pw, y + h - pad);
  const nameMax = w - pad * 3 - sw - pw;
  const fl = fitLines(g, pName(top.pid, st.prov).toUpperCase(), nameMax, 2, [big * 0.62, big * 0.54, big * 0.46, big * 0.4, big * 0.34], 900);
  g.font = cf(900, fl.size); g.fillStyle = CC.ink;
  fl.lines.forEach((l, i) => g.fillText(l, x + pad * 1.4 + sw, sy + sw / 2 + fl.size * 0.35 + (i - (fl.lines.length - 1) / 2) * fl.size * 1.05));
}
async function drawCard(fmt) {
  await fontsReady();
  const st = S, M = MODEL, f = FMT[fmt], W = f.w, H = f.h;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = CC.paper; g.fillRect(0, 0, W, H);
  const m = fmt === "wide" ? 28 : 48;
  g.fillStyle = CC.sheet; g.strokeStyle = CC.ink; g.lineWidth = 4; rrect(g, m, m, W - m * 2, H - m * 2, 18); g.fill(); g.stroke();
  const head = profileFirst(M), withParty = SH.party && M.prov[0];
  const L = m + (fmt === "wide" ? 36 : 56), R = W - L, CW = R - L;
  const line = (y) => { g.strokeStyle = CC.ink; g.lineWidth = 4; g.beginPath(); g.moveTo(m, y); g.lineTo(W - m, y); g.stroke(); };
  const label = (t, x, y, s) => { stretch(g, "semi-condensed"); g.font = cf(700, s); g.fillStyle = CC.ink2; g.fillText(t, x, y); stretch(g, "normal"); };
  const footer = (y, s) => {
    g.setLineDash([10, 10]); g.strokeStyle = CC.rule; g.lineWidth = 3; g.beginPath(); g.moveTo(L, y - s * 1.6); g.lineTo(R, y - s * 1.6); g.stroke(); g.setLineDash([]);
    g.font = cf(850, s); g.fillStyle = CC.ink; g.fillText("¿Y tú? Haz el test", L, y);
    g.font = cf(600, s * 0.78); g.fillStyle = CC.ink2; const u = siteHost(); g.fillText(u, R - g.measureText(u).width, y);
  };
  if (fmt === "story") {
    drawBrand(g, L, m + 104, 54); label("TEST POLÍTICO · ELECCIONES DEL 29N", L, m + 176, 26); line(m + 214);
    let y = m + 300; label("MI RESULTADO", L, y, 28); y += 30;
    const fl = fitLines(g, head, CW, 5, [74, 66, 60, 54, 50]); g.fillStyle = CC.ink;
    fl.lines.forEach((l, i) => { g.font = cf(850, fl.size); g.fillText(l, L, y + fl.size * (i + 1) * 1.06); });
    y += fl.size * fl.lines.length * 1.06 + 50;
    if (withParty) { drawParty(g, L, y, CW, 230, M, st, 88); y += 230 + 58; }
    label("MIS SIETE DIMENSIONES", L, y, 26); y += 18;
    const rowH = Math.min(110, (H - m - 170 - y) / 7);
    drawDims(g, L, y, CW, rowH, M, { nameW: 380, fs: rowH >= 84 ? 32 : 29, bar: 12, poles: rowH >= 84 });
    footer(H - m - 64, 40);
  } else if (fmt === "square") {
    drawBrand(g, L, m + 92, 44); label("TEST POLÍTICO · 29N", R - 300, m + 86, 22); line(m + 136);
    let y = m + 170;
    const fl = fitLines(g, head, CW, withParty ? 3 : 4, [56, 50, 44, 40, 36]); g.fillStyle = CC.ink;
    fl.lines.forEach((l, i) => { g.font = cf(850, fl.size); g.fillText(l, L, y + fl.size * (i + 1) * 1.06); });
    y += fl.size * fl.lines.length * 1.06 + 34;
    if (withParty) { drawParty(g, L, y, CW, 168, M, st, 66); y += 168 + 30; }
    const rowH = Math.min(62, (H - m - 120 - y) / 7);
    drawDims(g, L, y, CW, rowH, M, { nameW: 330, fs: 27, bar: 10, poles: false });
    footer(H - m - 40, 32);
  } else {
    drawBrand(g, L, m + 70, 36); label("TEST POLÍTICO · 29N", R - 236, m + 64, 18); line(m + 100);
    const colW = CW * 0.47, rx = L + colW + 40, rw = R - rx;
    let y = m + 122;
    const fl = fitLines(g, head, colW, withParty ? 4 : 6, [38, 34, 30, 27, 24]); g.fillStyle = CC.ink;
    fl.lines.forEach((l, i) => { g.font = cf(850, fl.size); g.fillText(l, L, y + fl.size * (i + 1) * 1.08); });
    if (withParty) drawParty(g, L, H - m - 210, colW, 128, M, st, 50);
    drawDims(g, rx, m + 120, rw, 50, M, { nameW: 220, fs: 21, bar: 8, poles: false });
    footer(H - m - 26, 24);
  }
  return c;
}

// ───────────────────────────── METODOLOGÍA
function renderMethod() {
  const qs = BANK.questions;
  const balance = BANK.dims.map((d) => { const l = qs.filter((q) => q.dim === d.id); const lk = l.filter((q) => q.type === "likert");
    return `<tr><td>${esc(d.name)}</td><td class="num">${l.length}</td><td class="num">${lk.filter((q) => q.dir < 0).length}</td><td class="num">${lk.filter((q) => q.dir > 0).length}</td><td class="num">${l.length - lk.length}</td><td>${esc(d.a)} ↔ ${esc(d.b)}</td></tr>`; }).join("");
  const cover = PIDS.map((pid) => { const k = qs.filter((q) => q.pos[pid]).length, e = qs.filter((q) => q.est.includes(pid)).length, d = k - e;
    return `<tr><td><span class="sw" style="background:${P[pid].color}"></span> ${esc(P[pid].name)}</td><td class="num">${d}</td><td class="num">${e}</td><td class="num">${qs.length - k}</td><td><span class="cov" style="width:${d * 1.1}px"></span><span class="cov e" style="width:${e * 1.1}px;margin-left:2px"></span></td></tr>`; }).join("");
  const lik = qs.filter((q) => q.type === "likert");
  $("#v-method").innerHTML = `
    <div class="wrap method">
      <p class="label">Metodología · banco v${esc(BANK.version)}</p>
      <h1 id="method-h" class="h1">Cómo funciona el Test 29N</h1>
      <p class="lede">Qué medimos, de dónde salen las posturas de los partidos, cómo se calcula tu resultado y qué límites tiene. Todo lo que ves aquí se calcula en directo a partir de los mismos datos que usa el test.</p>
      <div class="mgrid">
        <nav class="toc" aria-label="Índice"><a href="#m-que">Qué mide</a><a href="#m-preg">Las preguntas</a><a href="#m-pos">Posturas de los partidos</a><a href="#m-calc">El cálculo</a><a href="#m-sol">Solidez y límites</a><a href="#m-priv">Privacidad y aviso legal</a></nav>
        <div class="mbody">
          <section class="msec" id="m-que"><h2 class="h2">Qué mide</h2>
            <p>El test no te asigna una etiqueta. Mide tu posición en <b>siete dimensiones</b> independientes y la compara, pregunta a pregunta, con las posturas de las candidaturas que se presentan en tu provincia.</p>
            <ul class="dots">${BANK.dims.map((d) => `<li><b>${esc(d.name)}</b> (${esc(d.a)} ↔ ${esc(d.b)}): ${esc(d.desc)}</li>`).join("")}</ul>
            <p>Las ${qs.length} preguntas se reparten en ${BANK.areas.length} áreas temáticas. Algunas no miden ninguna dimensión porque no dividen a la gente de forma ideológica clara (por ejemplo, la ley electoral o el tren frente a la alta velocidad): solo sirven para comparar con los partidos.</p>
          </section>
          <section class="msec" id="m-preg"><h2 class="h2">Las preguntas</h2>
            <ul class="dots">
              <li><b>Una idea por pregunta.</b> Evitamos afirmaciones dobles («X e Y») y cuantificadores ambiguos.</li>
              <li><b>Dilemas</b> cuando la cuestión es elegir entre dos objetivos con costes, como bajar impuestos o mantener servicios.</li>
              <li><b>Contexto neutral</b> en cada pregunta, de 50 a 80 palabras: hechos verificables, conceptos y los argumentos principales de ambos lados.</li>
              <li><b>Formulación equilibrada</b>: en cada dimensión, una parte de las afirmaciones apunta a un polo y otra al contrario, para que estar «de acuerdo con todo» no sesgue el resultado.</li>
              <li><b>«No lo sé»</b> es distinto de «Ni de acuerdo ni en desacuerdo»: el primero no cuenta en el cálculo; el segundo cuenta como posición intermedia, pero con la mitad de peso, porque puede reflejar equilibrio, ambivalencia o poco interés por el tema.</li>
            </ul>
            <div class="tbl-wrap"><table class="tbl"><caption class="sr">Equilibrio de formulación por dimensión</caption><thead><tr><th>Dimensión</th><th class="num">Preguntas</th><th class="num">Acuerdo → polo A</th><th class="num">Acuerdo → polo B</th><th class="num">Dilemas</th><th>Polos</th></tr></thead><tbody>${balance}</tbody></table></div>
            <p>En la lectura clásica izquierda-derecha, ${lik.filter((q) => q.lr < 0).length} afirmaciones apuntan a la izquierda, ${lik.filter((q) => q.lr > 0).length} a la derecha y ${lik.filter((q) => !q.lr).length} son transversales.</p>
            <p><b>Versiones y selección.</b> Cada área tiene una pregunta núcleo, varias importantes y otras complementarias. La versión exprés usa la núcleo y una importante por área; la media, la núcleo, dos importantes y una complementaria; la completa, todas. Las preguntas que completan cada área se eligen con una semilla aleatoria, compensando el sesgo izquierda-derecha de las ya elegidas, así que dos personas pueden recibir cuestionarios algo distintos pero siempre equilibrados y con todas las áreas. La misma semilla reproduce siempre el mismo cuestionario.</p>
          </section>
          <section class="msec" id="m-pos"><h2 class="h2">Posturas de los partidos</h2>
            <p>Para cada pregunta asignamos a cada candidatura una postura de 1 a 5 a partir de sus <b>programas electorales de 2023</b>, sus <b>votaciones en el Congreso</b> y sus <b>declaraciones públicas</b> hasta el 17 de octubre de 2026. Los programas para el 29N aún no se han publicado completos.</p>
            <ul class="dots">
              <li><b>Documentada</b>: hay programa, voto o declaración explícita. Pesa 1.</li>
              <li><b>Estimada</b>: se deduce de la línea general del partido o de su posición en temas cercanos. Pesa 0,6 y se marca siempre como estimada.</li>
              <li><b>Sin postura conocida</b>: no se inventa. Esa pregunta no cuenta para ese partido.</li>
            </ul>
            <p>Las coaliciones nuevas (Frente Amplio, Democracia para el Siglo 21, Unidad del Pueblo Canario…) heredan las posturas de sus integrantes, por lo que tienen más posturas estimadas. Puedes revisar todas en <button type="button" class="link-btn" data-go="explorer" style="padding:0">Posturas de los partidos</button>.</p>
            <div class="tbl-wrap"><table class="tbl"><caption class="sr">Cobertura de posturas por candidatura</caption><thead><tr><th>Candidatura</th><th class="num">Documentadas</th><th class="num">Estimadas</th><th class="num">Sin postura</th><th>Cobertura</th></tr></thead><tbody>${cover}</tbody></table></div>
          </section>
          <section class="msec" id="m-calc"><h2 class="h2">El cálculo</h2>
            <p><b>Coincidencia con un partido.</b> Para cada pregunta que has respondido y en la que el partido tiene postura:</p>
            <p class="formula">acuerdo = 1 − |tu respuesta − su postura| ÷ 4</p>
            <p>Responder lo mismo vale 100 %; estar en extremos opuestos (1 frente a 5), 0 %. La coincidencia es la media ponderada de esos acuerdos. Pesos: pregunta marcada como importante ×${W_IMPORTANT}; área prioritaria ×${String(W_PRIORITY).replace(".", ",")}; respuesta neutral ×${String(W_NEUTRAL).replace(".", ",")}; postura estimada ×${String(W_ESTIMATED).replace(".", ",")}. Si un partido tiene postura en menos de la mitad (en peso) de tus respuestas, añadimos el peso que falta con un valor neutro del 50 %, para que un partido con pocas posturas conocidas no aparezca artificialmente arriba o abajo.</p>
            <p><b>Tu posición en cada dimensión.</b> Cada respuesta se convierte en un valor de −100 a +100 (1 → −100, 3 → 0, 5 → +100) con el signo de la dirección de la pregunta, y se promedia. Las respuestas neutrales pesan la mitad; la importancia y las prioridades no cambian tu posición. La de cada partido se calcula igual con todas sus posturas del banco, ponderando las estimadas.</p>
            <p><b>Cercanía ideológica.</b> 100 % menos la distancia media entre tu posición y la del partido en las dimensiones que has respondido. Complementa a la coincidencia, que compara pregunta a pregunta.</p>
            <p><b>Lectura por temas.</b> Usa la dirección izquierda-derecha habitual de cada pregunta en la política española, sin las preguntas transversales. Es una simplificación y se presenta como tal.</p>
            <p><b>Partidos con los que menos coincides.</b> Son las tres candidaturas de tu provincia con menor coincidencia, con el mismo cálculo, dejando fuera tu top 3 y las candidaturas con pocas posturas conocidas. Solo cuenta como discrepancia estar en lados opuestos de una pregunta: tus respuestas neutrales y «No lo sé» nunca lo son. Comprobamos además si el resultado depende de una sola pregunta quitando la que más os separa, y te avisamos si es así. Si menos de ${LEAST_MIN_ANS} de tus respuestas toman partido, no mostramos esta sección.</p>
            <p><b>Políticos con los que más coincides.</b> Comparamos tus respuestas con ${POLS.length} perfiles de políticos con posturas propias documentadas (propuestas, decisiones de gobierno, votaciones que han liderado o declaraciones), nunca con las de su partido por defecto. Cada persona tiene pocas posturas conocidas, así que el acuerdo se suaviza hacia el 50 %, se exigen al menos ${POL_MIN} posturas claras en común y se muestra un nivel orientativo en lugar de un porcentaje. Las fotos proceden de Wikimedia Commons, con licencia libre o reutilización autorizada citando la fuente, y su autoría en cada ficha.</p>
          </section>
          <section class="msec" id="m-sol"><h2 class="h2">Solidez y límites</h2>
            <p>La investigación sobre estas herramientas, conocidas como «aplicaciones de consejo de voto», muestra que el resultado puede cambiar según el método de cálculo, que las respuestas neutrales tienden a acercar a todos los partidos y que estimar las posturas de los partidos es la parte más delicada. Por eso:</p>
            <ul class="dots">
              <li>Comprobamos tu primera opción con un <b>método alternativo</b> que solo cuenta si estás del mismo lado que el partido, y te avisamos si cambia.</li>
              <li>Avisamos de los <b>empates técnicos</b> (menos de 4 puntos), de las respuestas mayoritariamente neutrales y de las comparaciones apoyadas en posturas estimadas.</li>
              <li>Publicamos todas las posturas para que puedas contrastarlas.</li>
            </ul>
            <p>Límites: los partidos pueden cambiar de posición, actuar de forma distinta a lo que proponen o no pronunciarse; las candidaturas locales tienen pocas posturas conocidas; y un test no recoge la confianza en los líderes, la gestión o el voto útil. <b>No es una recomendación de voto ni un diagnóstico científico.</b></p>
          </section>
          <section class="msec" id="m-priv"><h2 class="h2">Privacidad y aviso legal</h2>
            <p>No hay registro ni servidor de respuestas: tu provincia, sexo, edad y respuestas se guardan solo en el almacenamiento local de tu navegador, y puedes borrarlas empezando un test nuevo. Sexo y edad solo se muestran en tu resultado. El enlace para compartir lleva en el propio enlace tus respuestas, provincia y prioridades, pero no tu sexo ni tu edad.</p>
            <p><b>Sin cookies, analítica ni publicidad.</b> La web no usa cookies ni herramientas de medición de audiencia. Está alojada en GitHub Pages (GitHub, Inc.), que puede registrar datos técnicos de conexión, como la dirección IP, por motivos de seguridad. Las tipografías se descargan de Google Fonts, por lo que tu navegador se conecta a servidores de Google; ninguno de los dos recibe tus respuestas.</p>
            <p><b>Aportaciones voluntarias.</b> El test es gratuito y lo seguirá siendo. El botón «Apoyar el proyecto» solo abre ${DONATE_URL ? donatePlatform() : "la plataforma de pago (Ko-fi o PayPal)"} en una pestaña nueva: no le enviamos tus respuestas ni tu resultado. Si decides aportar, esa plataforma trata tus datos de pago según su propia política de privacidad. Aportar o no hacerlo no cambia ningún resultado, coincidencia ni postura.</p>
            <p><b>Independencia.</b> El test no tiene vínculo con ningún partido, candidatura ni institución, y no acepta aportaciones a cambio de modificar preguntas, posturas o resultados.</p>
            ${OWNER.name ? `<p><b>Titular</b>: ${esc(OWNER.name)}${OWNER.email ? ` · contacto: <a href="mailto:${esc(OWNER.email)}">${esc(OWNER.email)}</a>` : ""}.</p>` : ""}
          </section>
        </div>
      </div>
    </div>`;
}

// ───────────────────────────── EXPLORADOR DE POSTURAS
const EX = { area: "", party: "", text: "" };
function renderExplorer() {
  const root = $("#v-explorer");
  if (!root.dataset.ready) {
    root.innerHTML = `
      <div class="wrap method">
        <p class="label">Transparencia</p>
        <h1 id="explorer-h" class="h1">Posturas de los partidos</h1>
        <p class="lede">Todas las posturas que usa el test, pregunta a pregunta. Las estimadas aparecen con borde discontinuo y en cursiva; si un partido no tiene postura conocida en un tema, no se le asigna ninguna.</p>
      </div>
      <div class="wrap">
        <div class="ex-tools">
          <div class="field"><label class="label" for="ex-area">Área</label><select id="ex-area"><option value="">Todas las áreas</option>${BANK.areas.map((a) => `<option value="${a.id}">${a.letter} · ${esc(a.name)}</option>`).join("")}</select></div>
          <div class="field"><label class="label" for="ex-party">Destacar partido</label><select id="ex-party"><option value="">Ninguno</option>${PIDS.map((pid) => `<option value="${pid}">${esc(P[pid].name)}</option>`).join("")}</select></div>
          <div class="field"><label class="label" for="ex-q">Buscar</label><input id="ex-q" type="search" placeholder="Por ejemplo: alquiler, Senado, lobo…" autocomplete="off"></div>
        </div>
        <p class="small muted" id="ex-count" aria-live="polite" style="padding-top:12px"></p>
        <div class="ex-list" id="ex-list"></div>
      </div>`;
    root.dataset.ready = "1";
    $("#ex-area").addEventListener("change", (e) => { EX.area = e.target.value; drawExplorer(); });
    $("#ex-party").addEventListener("change", (e) => { EX.party = e.target.value; drawExplorer(); });
    let t = 0;
    $("#ex-q").addEventListener("input", (e) => { clearTimeout(t); t = setTimeout(() => { EX.text = e.target.value.trim().toLowerCase(); drawExplorer(); }, 160); });
  }
  drawExplorer();
}
function drawExplorer() {
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const needle = norm(EX.text);
  const qs = BANK.questions.filter((q) => (!EX.area || q.area === EX.area) && (!needle || norm(`${q.text} ${q.short} ${q.ctx}`).includes(needle)));
  $("#ex-count").textContent = `${qs.length} ${qs.length === 1 ? "pregunta" : "preguntas"}`;
  $("#ex-list").innerHTML = qs.map((q) => {
    const cols = [1, 2, 3, 4, 5].map((n) => {
      const ps = PIDS.filter((pid) => q.pos[pid] === n);
      return `<div class="pc5"><span>${n} · ${esc(q.type === "dilema" ? DIL[n - 1] : LIK[n - 1])}</span><span class="chips">${ps.map((pid) => `<span class="chip${q.est.includes(pid) ? " est" : ""}"${EX.party === pid ? ' style="outline:2.5px solid var(--ink);background:var(--mark-2)"' : ""} title="${esc(P[pid].name)}${q.est.includes(pid) ? " · estimada" : ""}"><i class="sw" style="background:${P[pid].color}"></i>${esc(P[pid].ab)}</span>`).join("")}</span></div>`;
    }).join("");
    const unk = PIDS.filter((pid) => !q.pos[pid]);
    const focus = EX.party ? (q.pos[EX.party] ? `<p class="focus-line"><b>${esc(P[EX.party].name)}:</b> ${esc(answerText(q, q.pos[EX.party]))}${q.est.includes(EX.party) ? " (estimada)" : " (documentada)"}</p>` : `<p class="focus-line"><b>${esc(P[EX.party].name)}:</b> sin postura conocida</p>`) : "";
    const d = q.dim ? `${DIM[q.dim].name}: de acuerdo → ${q.dir > 0 ? DIM[q.dim].b : DIM[q.dim].a}` : "Transversal: no mide ninguna dimensión";
    return `<article class="exq"><p class="q-meta"><span class="q-code">${qCode(q)}</span><span>${esc(AREA[q.area].name)}</span><span class="tagd">${esc(d)}</span></p>
      <h3>${esc(q.text)}</h3>${q.type === "dilema" ? `<p class="small">A: ${esc(q.A)} · B: ${esc(q.B)}</p>` : ""}${focus}
      <details class="more"><summary>Contexto</summary><p class="dinfo" style="margin-top:6px">${esc(q.ctx)}${q.ley ? ` <b>Marco legal:</b> ${esc(q.ley)}.` : ""}</p></details>
      <div class="pos5">${cols}</div>${unk.length ? `<p class="unk">Sin postura conocida: ${unk.map((pid) => esc(P[pid].ab)).join(", ")}.</p>` : ""}</article>`;
  }).join("") || '<p class="muted" style="padding:24px 0">Ninguna pregunta coincide con la búsqueda.</p>';
}

// ───────────────────────────── Avisos y tooltips
let toastTimer = 0;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.hidden = false; clearTimeout(toastTimer); toastTimer = setTimeout(() => { t.hidden = true; }, 2200); }
function bindTips() {
  const tip = $("#tip");
  const show = (el, x, y) => { tip.textContent = el.dataset.tip; tip.hidden = false; const r = tip.getBoundingClientRect(); tip.style.left = `${Math.min(window.innerWidth - r.width - 8, Math.max(8, x - r.width / 2))}px`; tip.style.top = `${Math.max(8, y - r.height - 12)}px`; };
  const hide = () => { tip.hidden = true; };
  document.addEventListener("pointerover", (e) => { const el = e.target.closest("[data-tip]"); if (el) { const r = el.getBoundingClientRect(); show(el, r.left + r.width / 2, r.top); } });
  document.addEventListener("pointerout", (e) => { if (e.target.closest("[data-tip]")) hide(); });
  document.addEventListener("focusin", (e) => { const el = e.target.closest("[data-tip]"); if (el) { const r = el.getBoundingClientRect(); show(el, r.left + r.width / 2, r.top); } else hide(); });
  addEventListener("scroll", hide, { passive: true });
}

// ───────────────────────────── Arranque
function bindGlobal() {
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]");
    if (g) {
      const v = g.dataset.go;
      if (CURRENT === "quiz" && S) save();
      if (v === "home") { fillSetup(); go("home"); }
      else if (v === "method") { renderMethod(); go("method", { focus: !g.dataset.anchor }); const t = g.dataset.anchor && $(`#${g.dataset.anchor}`); if (t) { t.scrollIntoView(); const h = t.querySelector("h2"); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
      else if (v === "explorer") { renderExplorer(); go("explorer"); }
      return;
    }
    const a = e.target.closest("[data-act]");
    if (!a || a.closest("#v-results")) return;
    if (a.dataset.act === "resume") { if (S.stage === "prios") { renderPrios(); go("prios"); } else { renderQuestion(0); go("quiz", { focus: false }); focusStatement(); } }
    else if (a.dataset.act === "see-results") openResults();
  });
  $("#v-method").addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#m-"]'); if (!a) return;
    e.preventDefault(); const t = $(a.getAttribute("href")); if (t) { t.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth" }); const h = t.querySelector("h2"); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  });
  $("#retry-btn").addEventListener("click", () => location.reload());
}

async function boot() {
  bindGlobal(); bindQuiz(); bindPrios(); bindResults(); bindShare(); bindTips();
  try { await loadData(); }
  catch (e) { console.error(e); go("error"); return; }
  S = loadState();
  initHome();
  const shared = decodeShare(location.hash);
  if (shared) { SHARED = shared; openResults(); return; }
  if (S && S.stage === "done" && answered(S).length) { openResults(); return; }
  go("home", { focus: false });
}
boot();
})();
