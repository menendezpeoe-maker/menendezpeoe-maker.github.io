/* Test 29N — aplicación
   Estructura: datos → estado → vistas (inicio, test, prioridades, resultados, metodología, explorador).
   El cálculo (sección CÁLCULO) son funciones puras sobre el estado; las vistas solo pintan. */
(() => {
"use strict";

// ───────────────────────────── Configuración
// Dirección pública que se comparte cuando la web no se está usando desde ella misma
const PUBLIC_URL = "https://test29n.es/";
// Aportaciones voluntarias: solo enlaces públicos de pago. Una opción vacía no se muestra.
// Nunca van aquí datos bancarios, claves ni credenciales: el cobro y su confirmación ocurren en PayPal y Stripe.
const DONATE = {
  paypal: "https://www.paypal.com/donate?hosted_button_id=R2X5MXLRUM7U4",
  applePay: "https://buy.stripe.com/7sYaEYcq8bwS6lL1Kiew800",   // enlace de pago de Stripe con Apple Pay (y tarjeta, que Apple Pay necesita)
  bank: ""        // enlace de pago de Stripe (https://buy.stripe.com/…) con Bizum activado
};
// Contador de visitas con GoatCounter (sin cookies ni datos personales): código de la cuenta, por ejemplo
// "test29n" para test29n.goatcounter.com. Vacío = no se cuenta nada. Solo cuenta en la dirección pública.
const STATS = { goatcounter: "test29n" };
// Titular de la web para el aviso legal. Vacío = no se muestra.
const OWNER = { name: "Dery", email: "menendezpeoe@gmail.com" };
const KEY = "papeleta29n.v2";
const PREFS_KEY = "papeleta29n.prefs";
const FRIEND_KEY = "papeleta29n.amigo";  // último resultado compartido que has abierto, para compararte (solo en tu navegador)
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
const ucFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const joinY = (arr) => arr.length <= 1 ? arr.join("") : `${arr.slice(0, -1).join(", ")} y ${arr[arr.length - 1]}`;
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const pctPos = (v) => ((v + 100) / 2).toFixed(2);
function mulberry(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function hashStr(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function shuffled(arr, rnd) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
// Texto sobre el color de un partido: el que dé más contraste según WCAG (negro o blanco)
function textOn(hex) {
  const n = parseInt(hex.slice(1), 16), lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return (L + 0.05) / 0.0559 >= 1.05 / (L + 0.05) ? "#111318" : "#FFFFFF";
}
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
const Q = {}, AREA = {}, DIM = {}, P = {}, PROV = {}, FAM = {};
let PIDS = [], PROV_LIST = [];
const PARTY_DIM = {}, PARTY_AREA = {};
let MAPM = null;

async function loadData() {
  const get = (u) => fetch(u, { cache: "no-cache" }).then((r) => { if (!r.ok) throw new Error(`${u}: ${r.status}`); return r.json(); });
  // Los políticos son un extra: si no cargan, el test funciona igual
  const pols = get("data/politicos.json").then((d) => d.politicians, () => []);
  [BANK, PD] = await Promise.all([get("data/preguntas.json"), get("data/partidos.json")]);
  POLS = await pols;
  BANK.questions.forEach((q) => { Q[q.id] = q; });
  (BANK.families || []).forEach((f) => f.forEach((id) => { FAM[id] = f; }));
  BANK.areas.forEach((a, i) => { AREA[a.id] = { ...a, idx: i }; });
  BANK.dims.forEach((d) => { DIM[d.id] = d; });
  PD.parties.forEach((p) => { P[p.id] = p; });
  // Las candidaturas que han anunciado que no se presentan se conservan en los datos, pero no se comparan
  PIDS = PD.order.filter((pid) => !P[pid].out);
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
  fitMap();
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
function logo(pid, cls = "") { const p = P[pid]; return `<span class="logo ${cls}${p.ab.length >= 5 ? " long" : ""}" style="background:${p.color};color:${textOn(p.color)}" aria-hidden="true">${esc(p.ab)}</span>`; }
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
const UI = { cmp: null, scope: "prov", reviewFilter: "all", extra: null };
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
  delete s.sex; delete s.age;  // versiones anteriores pedían sexo y edad: se ignoran
  if (!s.order.length) return null;
  if (!PROV[s.prov]) { delete s.prov; if (s.stage === "done") s.stage = "prios"; }
  s.idx = Math.min(Math.max(0, s.idx | 0), s.order.length - 1);
  return s;
}

// ───────────────────────────── Navegación entre vistas
const VIEWS = ["home", "quiz", "prios", "results", "method", "explorer", "error"];
function go(view, { focus = true, scroll = true, push = true } = {}) {
  for (const v of VIEWS) $(`#v-${v}`).hidden = v !== view;
  // Cada pantalla queda en el historial para que «Atrás» del navegador vuelva a la anterior
  if (push && view !== "error") {
    try { if (!history.state?.view) history.replaceState({ view }, ""); else if (history.state.view !== view) history.pushState({ view }, ""); } catch { /* sin historial (marco) */ }
  }
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
  sel.addEventListener("change", () => { setProv(sel.value); renderProvChips(); });
  $$('input[name=mode]').forEach((i) => i.addEventListener("change", renderStartNote));
  $(".ex-scale").addEventListener("click", (e) => { const b = e.target.closest("[data-ex]"); if (b) startFromExample(Number(b.dataset.ex)); });
  $$("[data-count]").forEach((el) => { el.textContent = buildOrder(el.dataset.count, 1).length; });
  $("#areas-list").innerHTML = BANK.areas.map((a) => {
    const n = BANK.questions.filter((q) => q.area === a.id).length;
    return `<li><span class="al">${a.letter}</span><b>${esc(a.name)}</b><span>${esc(a.intro)} ${n} preguntas.</span></li>`;
  }).join("");
  const ex = Q.C01;
  if (ex) { $("#ex-code").textContent = qCode(ex); $("#ex-area").textContent = AREA[ex.area].name; $("#ex-text").textContent = ex.text; $("#ex-ctx").textContent = ex.ctx; }
  $("#foot-version").textContent = `${BANK.questions.length} preguntas · posturas actualizadas el 18 de octubre de 2026`;
  $("#setup").addEventListener("submit", startTest);
  $("#start-btn").disabled = false;
  fillSetup();
}
function fillSetup(s = S) {
  if (s && MODES[s.mode]) $$('input[name=mode]').forEach((i) => { i.checked = i.value === s.mode; });
  renderStartNote(); renderResume();
}
const MODE_NOTE = { expres: "unos 5 minutos", media: "unos 10 minutos", completa: "unos 20 minutos" };
function renderStartNote() {
  const mode = ($('input[name=mode]:checked') || {}).value || "expres";
  $("#start-note").innerHTML = `Versión ${MODES[mode].label.toLowerCase()}: ${buildOrder(mode, 1).length} preguntas, ${MODE_NOTE[mode]}. <a href="#setup">${mode === "expres" ? "Otras versiones" : "Cambiar de versión"}</a>`;
}
// La provincia se pide al final y se recuerda la última elegida (solo en este navegador)
function setProv(v) {
  if (!PROV[v]) return;
  if (S) { S.prov = v; save(); }
  PREFS.prov = v; savePrefs();
  $("#prov-err").textContent = "";
}
function renderProvChips() {
  const v = $("#f-prov").value, box = $("#prov-chips");
  if (!v) { box.innerHTML = ""; return; }
  const list = partiesIn(v);
  box.innerHTML = list.map((pid) => `<span class="chip${P[pid].tbd ? " tbd" : ""}"><i class="sw" style="background:${P[pid].color}"></i>${esc(pName(pid, v))}${P[pid].tbd ? " · por confirmar" : ""}</span>`).join("")
    + `<span class="small muted" style="align-self:center">${list.length} candidaturas en ${esc(PROV[v].name)}</span>`;
}
function renderResume() {
  const box = $("#resume");
  if (!S) { box.hidden = true; return; }
  const done = S.order.filter((id) => S.ans[id] !== undefined).length;
  if (S.stage === "done") {
    box.innerHTML = `<p><b>Tienes un resultado guardado.</b> Versión ${MODES[S.mode].label.toLowerCase()}, ${esc(PROV[S.prov].name)}.</p><button type="button" class="btn btn-primary btn-sm" data-act="see-results">Ver mis resultados</button>`;
  } else if (done > 0) {
    box.innerHTML = `<p><b>Tienes un test a medias:</b> ${done} de ${S.order.length} respondidas. Si empiezas uno nuevo, se sustituirá.</p><button type="button" class="btn btn-primary btn-sm" data-act="resume">Continuar</button>`;
  } else { box.hidden = true; return; }
  box.hidden = false;
}
function newTest() {
  const mode = ($('input[name=mode]:checked') || {}).value || "expres";
  const seed = newSeed();
  S = { v: 2, bank: BANK.version, mode, seed, order: buildOrder(mode, seed), idx: 0, ans: {}, imp: {}, prios: [], stage: "quiz", t: Date.now() };
  if (PROV[PREFS.prov]) S.prov = PREFS.prov;
  SHARED = null; SH.edited = false;
}
function startTest(e) {
  e.preventDefault();
  newTest();
  save();
  launchQuiz(true);
}
// La pregunta de ejemplo de la portada es real: responderla empieza el test con esa respuesta guardada
function startFromExample(v) {
  const ex = Q.C01; if (!ex) return;
  const inProgress = S && S.stage !== "done" && S.order.includes(ex.id);
  if (!inProgress) {
    newTest();
    S.order = [ex.id, ...S.order.filter((id) => id !== ex.id)];
  }
  S.ans[ex.id] = v;
  const nxt = S.order.findIndex((id) => S.ans[id] === undefined);
  S.idx = nxt < 0 ? S.order.length - 1 : nxt;
  save();
  toast("Respuesta guardada");
  launchQuiz(!inProgress);
}
function launchQuiz(isNew) {
  renderQuestion(0);
  if (isNew) count("test-empezado", "Test empezado", true);
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
  $("#q-prog-label").textContent = `Área ${ai + 1} de ${areas.length} · ${AREA[cur.area].name}`;
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
    ${firstOfArea ? `<p class="q-intro"><b>Área ${areasInOrder.findIndex((x) => x.id === a.id) + 1} de ${areasInOrder.length}.</b> ${esc(a.intro)}</p>` : ""}
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
  // Al ampliar a una versión más larga solo se recorren las preguntas nuevas
  const pending = (from) => S.order.findIndex((id, i) => i > from && S.ans[id] === undefined);
  const nxt = S.fill ? (pending(S.idx) >= 0 ? pending(S.idx) : pending(-1)) : S.idx + 1;
  if (nxt < 0 || nxt >= S.order.length) { delete S.fill; finishQuiz(); return; }
  S.idx = nxt; save();
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

// ───────────────────────────── PRIORIDADES (y provincia, que se pide aquí)
function renderProvField() {
  if (!PROV[S.prov] && PROV[PREFS.prov]) { S.prov = PREFS.prov; save(); }
  $("#f-prov").value = S.prov || "";
  $("#prov-err").textContent = "";
  renderProvChips();
}
function renderPrios() {
  renderProvField();
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
  const finish = (skip) => {
    if (!PROV[S.prov]) { $("#prov-err").textContent = "Elige tu provincia para ver con qué candidaturas de allí coincides."; $("#f-prov").focus(); return; }
    if (skip) S.prios = []; S.stage = "done"; save(); count("test-terminado", "Test terminado", true); openResults();
  };
  $("#prio-go").addEventListener("click", () => finish(false));
  $("#prio-skip").addEventListener("click", () => finish(true));
  $("#prio-back").addEventListener("click", () => { S.stage = "quiz"; S.idx = S.order.length - 1; save(); renderQuestion(0); go("quiz", { focus: false }); focusStatement(); });
}

// ───────────────────────────── CÁLCULO (funciones puras)
function answered(st) { return BANK.questions.filter((q) => st.ans[q.id] >= 1); }
function weightOf(q, st) { return (st.imp[q.id] ? W_IMPORTANT : 1) * (st.prios.includes(q.area) ? W_PRIORITY : 1) * (st.ans[q.id] === 3 ? W_NEUTRAL : 1) * famFactor(q, st); }
// Preguntas casi equivalentes (data/preguntas.json → families): k respuestas pesan como √k
function famFactor(q, st) {
  const f = FAM[q.id]; if (!f) return 1;
  const k = f.filter((id) => st.ans[id] >= 1).length;
  return k > 1 ? 1 / Math.sqrt(k) : 1;
}

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
    { ok: nAns >= 20, txt: nAns >= 20 ? `Has dado tu opinión en ${nAns} preguntas.` : `Has dado tu opinión en solo ${nAns} preguntas: el resultado es poco preciso. Una versión más larga lo afina.` },
    { ok: softShare < 0.4, txt: softShare < 0.4 ? "La mayoría de tus respuestas toman partido." : `El ${Math.round(softShare * 100)} % de tus respuestas son neutrales o «No lo sé», lo que acerca a todos los partidos entre sí.` },
    { ok: gap >= 4, txt: !b ? "Solo hay una candidatura comparable." : gap >= 4 ? `La candidatura con más coincidencia saca ${gap} puntos a la segunda.` : `Empate técnico: ${pn(a.pid)} y ${pn(b.pid)} están a ${gap} ${gap === 1 ? "punto" : "puntos"}.` },
    { ok: sameTop, txt: sameTop ? "Con el método alternativo (solo acuerdo o desacuerdo, sin matices), la candidatura con más coincidencia no cambia." : `Con el método alternativo (solo acuerdo o desacuerdo), la candidatura con más coincidencia sería ${pn(altTop.pid)}.` },
    { ok: estShare <= 0.5, txt: estShare <= 0.5 ? `La comparación con ${a ? pn(a.pid) : "la candidatura con más coincidencia"} se apoya sobre todo en posturas documentadas.` : `Más de la mitad de las posturas de ${pn(a.pid)} que se comparan son estimadas.` }
  ];
  // Aquiescencia: el banco equilibra afirmaciones en ambos sentidos, así que estar de acuerdo (o en
  // desacuerdo) con casi todas indica una tendencia a responder igual más que una opinión coherente.
  const firm = qs.filter((q) => q.type === "likert" && st.ans[q.id] !== 3);
  const agreeShare = firm.length ? firm.filter((q) => st.ans[q.id] > 3).length / firm.length : 0.5;
  const sameWay = firm.length >= 12 && (agreeShare >= 0.8 || agreeShare <= 0.2);
  checks.push({ ok: !sameWay, txt: !sameWay ? (firm.length >= 12 ? "Tus respuestas combinan acuerdos y desacuerdos, como se espera de un cuestionario con afirmaciones en ambos sentidos." : "Hay pocas afirmaciones con opinión para valorar si respondes siempre en el mismo sentido.") : `Has respondido «${agreeShare >= 0.8 ? "de acuerdo" : "en desacuerdo"}» en el ${Math.round((agreeShare >= 0.8 ? agreeShare : 1 - agreeShare) * 100)} % de las afirmaciones en las que tomas partido, aunque el banco las formula en ambos sentidos. Puede ser una tendencia a responder siempre igual: revisa tus respuestas.` });
  const okN = checks.filter((c) => c.ok).length;
  const level = nAns < 12 || softShare >= 0.6 || sameWay || okN <= checks.length - 3 ? "baja" : okN === checks.length ? "alta" : "media";
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
  const head = strong.length
    ? `Te inclinas por ${joinY(strong.slice(0, 3).map(([k, o]) => DIM_PHRASE[k][o.v < 0 ? 0 : 1]))}.`
    : "Tus respuestas no se inclinan con claridad hacia ningún polo.";
  const tail = mixed.length ? `En ${joinY(mixed.map((d) => DIM_SHORT[d.id]))} mantienes posiciones intermedias o combinas ideas de ambos lados.` : "";
  const more = strong.length > 3 ? `También te inclinas por ${joinY(strong.slice(3).map(([k, o]) => DIM_PHRASE[k][o.v < 0 ? 0 : 1]))}.` : "";
  return { head, sub: [more, tail].filter(Boolean).join(" ") };
}

// ── Explicación del perfil (funciones puras sobre tus respuestas)
// Aportación de cada respuesta a tu posición en una dimensión: la suma de las aportaciones es tu posición.
function dimContrib(st, dimId) {
  const rows = answered(st).filter((q) => q.dim === dimId).map((q) => { const u = st.ans[q.id]; return { q, u, s: (u - 3) / 2 * 100 * q.dir, w: u === 3 ? W_NEUTRAL : 1 }; });
  const W = rows.reduce((a, r) => a + r.w, 0);
  rows.forEach((r) => { r.c = W ? r.s * r.w / W : 0; });
  return rows;
}
// Tu posición en una dimensión, tema a tema (por ejemplo, «más Estado» en vivienda pero no en educación)
function dimByArea(rows) {
  const acc = {};
  for (const r of rows) { const o = (acc[r.q.area] ||= { s: 0, w: 0, n: 0 }); o.s += r.s * r.w; o.w += r.w; o.n++; }
  return BANK.areas.filter((a) => acc[a.id]).map((a) => ({ a, v: acc[a.id].s / acc[a.id].w, n: acc[a.id].n }));
}
// Una posición cercana a cero puede deberse a respuestas intermedias (moderada) o a respuestas firmes en
// sentidos opuestos que se compensan (mixta). Se distingue por cuánto empuja cada lado.
function dimKind(rows) {
  const pos = rows.filter((r) => r.c > 0).reduce((a, r) => a + r.c, 0), neg = -rows.filter((r) => r.c < 0).reduce((a, r) => a + r.c, 0);
  return Math.min(pos, neg) >= 20 ? "mixta" : "moderada";
}
// Preguntas en las que tienes una opinión clara y ninguna candidatura de tu provincia con postura conocida está de tu lado
function unrepresented(M) {
  const st = M.st;
  return M.qs.filter((q) => sideOf(st.ans[q.id])).map((q) => {
    const withPos = M.avail.filter((pid) => q.pos[pid]);
    const same = withPos.filter((pid) => sideOf(q.pos[pid]) === sideOf(st.ans[q.id]));
    return { q, u: st.ans[q.id], n: withPos.length, same };
  }).filter((x) => x.n >= 2 && !x.same.length)
    .sort((a, b) => (Math.abs(b.u - 3) - Math.abs(a.u - 3)) || ((st.imp[b.q.id] ? 1 : 0) - (st.imp[a.q.id] ? 1 : 0)) || (a.q.prio - b.q.prio));
}
// Combinaciones de dimensiones poco habituales: entre los partidos, dos dimensiones suelen ir juntas
// (correlación ≥ 0,6); tú las combinas al revés. Solo con posiciones claras (≥ 25) en ambas.
function unusualCombos(M) {
  const G = MAPM, out = [];
  for (let i = 0; i < G.ids.length; i++) for (let j = i + 1; j < G.ids.length; j++) {
    const r = G.corr[i][j], a = G.ids[i], b = G.ids[j], ua = M.user.dims[a], ub = M.user.dims[b];
    if (Math.abs(r) < 0.6 || !ua || !ub || Math.abs(ua.v) < 25 || Math.abs(ub.v) < 25) continue;
    if (Math.sign(ua.v) * Math.sign(ub.v) === Math.sign(r)) continue;
    const like = M.avail.filter((pid) => { const pa = PARTY_DIM[pid][a], pb = PARTY_DIM[pid][b]; return pa !== undefined && pb !== undefined && Math.abs(pa) >= 15 && Math.abs(pb) >= 15 && Math.sign(pa) === Math.sign(ua.v) && Math.sign(pb) === Math.sign(ub.v); });
    out.push({ a, b, r, ua: ua.v, ub: ub.v, like, k: Math.abs(r) * Math.min(Math.abs(ua.v), Math.abs(ub.v)) });
  }
  return out.sort((x, y) => y.k - x.k).slice(0, 2);
}

// ───────────────────────────── RESULTADOS
let MODEL = null;
function openResults() {
  // Sin provincia no hay resultados: se pide en el último paso
  if (!SHARED && S && !PROV[S.prov]) { S.stage = "prios"; save(); renderPrios(); go("prios"); return; }
  MODEL = computeModel(ST());
  UI.cmp = MODEL.prov[0]?.pid || null;
  UI.scope = "prov"; UI.extra = null; UI.vsA = UI.vsB = null; UI.mapSel = null; UI.mapDim = "";
  renderResults();
  go("results");
}

function renderResults() {
  const st = ST();
  const next = st.mode === "expres" ? "media" : st.mode === "media" ? "completa" : null;
  $("#v-results").innerHTML = `
    ${SHARED ? `<div class="shared-banner"><div class="wrap"><p><b>Estás viendo un resultado compartido.</b> ${S && answered(S).length >= 5 ? "Debajo ves cuánto coincidís." : "Haz tu propio test y descubre cuánto coincidís."} No modifica tu test.</p><button type="button" class="btn btn-primary btn-sm" data-act="own-test">Hacer mi propio test</button></div></div>` : ""}
    <nav class="res-nav" aria-label="Secciones del resultado"><div class="wrap">
      <a href="#r-summary">Resumen</a><a href="#r-portrait">Tu perfil</a><a href="#r-dims">Dimensiones</a><a href="#r-map">Mapa</a><a href="#r-areas">Por temas</a><a href="#r-traits">Firmes y dudas</a><a href="#r-parties">Partidos</a><a href="#r-versus">Comparar</a><a href="#r-solid">Solidez</a>${SHARED ? "" : '<a href="#r-share">Compartir</a>'}<a href="#r-review">Tus respuestas</a><a href="#r-least">Menor coincidencia</a><a href="#r-pols">Políticos</a>
    </div></nav>
    <div class="wrap">
      <section id="r-summary" class="summary res-sec" style="padding-top:34px"></section>
      <section id="r-friend" class="res-sec" aria-labelledby="friend-h" hidden></section>
      <section id="r-portrait" class="res-sec" aria-labelledby="portrait-h"></section>
      <section id="r-dims" class="res-sec" aria-labelledby="dims-h"></section>
      <section id="r-map" class="res-sec" aria-labelledby="map-h"></section>
      <section id="r-areas" class="res-sec" aria-labelledby="areas-h2"></section>
      <section id="r-traits" class="res-sec" aria-labelledby="traits-h"></section>
      <section id="r-parties" class="res-sec" aria-labelledby="parties-h"></section>
      <section id="r-versus" class="res-sec" aria-labelledby="versus-h"></section>
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
  invalidateCards(); renderSummary(); renderFriend(); renderPortrait(); renderDims(); renderMap(); renderAreas(); renderTraits(); renderParties(); renderVersus(); renderSolid(); renderShare(); renderReview(); renderLeast(); renderPoliticians(); renderSupport();
}

function rerenderAfterEdit() {
  MODEL = computeModel(ST());
  if (!MODEL.prov.some((m) => m.pid === UI.cmp)) UI.cmp = MODEL.prov[0]?.pid || null;
  invalidateCards();
  renderSummary(); renderFriend(); renderPortrait(); renderDims(); renderMap(); renderAreas(); renderTraits(); renderParties(); renderVersus(); renderSolid(); renderShare(); renderLeast(); renderPoliticians();
}

// ── Piezas comunes de los resultados
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const fmtDate = (iso) => { const [y, m, d] = String(iso).split("-").map(Number); return d ? `${d} de ${MONTHS[m - 1]} de ${y}` : m ? `${MONTHS[m - 1]} de ${y}` : String(y); };
const SRC_TYPE = { programa: "programa o documento del partido", parlamento: "actuación parlamentaria", gobierno: "acción de gobierno", declaracion: "declaración pública", prensa: "información periodística" };
// Respuesta en pocas palabras, también para los dilemas (con la opción elegida)
function ansBrief(q, u) {
  if (u === 0) return "no lo sé";
  if (u === undefined) return "sin responder";
  if (q.type !== "dilema") return LIK_LOW[u - 1];
  if (u === 3) return "las dos por igual";
  return `${u === 1 || u === 5 ? "claramente" : "más bien"} «${lcFirst((u < 3 ? q.A : q.B).split(",")[0])}»`;
}
const TICKS = '<span class="tk" style="left:0"></span><span class="tk" style="left:25%"></span><span class="tk" style="left:75%"></span><span class="tk" style="left:100%"></span><span class="ctr"></span>';
// Pista de −100 a +100: tu posición (círculo y banda hasta el centro) y marcas de partidos
function trackHTML(me, marks = [], meTip = "") {
  let t = TICKS;
  if (me != null) {
    const x = Number(pctPos(me));
    t += me < 0 ? `<span class="hb l" style="left:${x}%;width:${(50 - x).toFixed(2)}%"></span>` : me > 0 ? `<span class="hb r" style="left:50%;width:${(x - 50).toFixed(2)}%"></span>` : "";
    t += `<span class="me" style="left:${x}%"${meTip ? ` data-tip="${esc(meTip)}"` : ""}></span>`;
  }
  for (const m of marks) t += `<span class="${m.cls || "pm"}" style="left:${pctPos(m.v)}%;background:${P[m.pid].color}" data-tip="${esc(m.tip)}"></span>`;
  return t;
}
const miniHTML = (v) => { const x = pctPos(v); return `<span class="mini"><span class="c"></span>${v < 0 ? `<span class="b l" style="left:${x}%;width:${(50 - x).toFixed(2)}%"></span>` : v > 0 ? `<span class="b r" style="left:50%;width:${(x - 50).toFixed(2)}%"></span>` : ""}<span class="d" style="left:${x}%"></span></span>`; };
// Todas las candidaturas (y tú) en una sola dimensión
function dimStrip(d, M, pids) {
  const st = M.st, o = M.user.dims[d.id];
  const pts = pids.filter((pid) => PARTY_DIM[pid][d.id] !== undefined).map((pid) => { const v = PARTY_DIM[pid][d.id]; return { pid, v, cls: "pd", tip: `${pName(pid, st.prov)}: ${dimLabel(d, v)} (${signed(v)})` }; });
  const order = [...pts, ...(o ? [{ pid: null, v: o.v }] : [])].sort((a, b) => a.v - b.v);
  const miss = pids.filter((pid) => PARTY_DIM[pid][d.id] === undefined);
  const aria = `${d.name}, de −100 (${d.a}) a +100 (${d.b}): ${order.map((x) => `${x.pid ? P[x.pid].ab : "tú"} ${signed(x.v)}`).join(", ")}`;
  return `<div class="dstrip"><div class="track" role="img" aria-label="${esc(aria)}">${trackHTML(o?.v, pts, o ? `Tú: ${dimLabel(d, o.v)} (${signed(o.v)})` : "")}</div>
    <div class="poles"><span>← ${esc(d.a)}</span><span>${esc(d.b)} →</span></div>
    <p class="chips dchips" aria-hidden="true">${order.map((x) => x.pid ? `<span class="chip"><i class="sw" style="background:${P[x.pid].color}"></i>${esc(P[x.pid].ab)} <span class="muted">${signed(x.v)}</span></span>` : `<span class="chip you">Tú <span>${signed(x.v)}</span></span>`).join("")}</p>
    ${miss.length ? `<p class="unk">Sin posturas en esta dimensión: ${miss.map((pid) => esc(P[pid].ab)).join(", ")}.</p>` : ""}</div>`;
}
// Datos de un partido: cuántas posturas son documentadas, estimadas o desconocidas, y cuántas tienen fuente
function partyData(pid) {
  const qs = BANK.questions, k = qs.filter((q) => q.pos[pid]).length, e = qs.filter((q) => q.est.includes(pid)).length, s = qs.filter((q) => q.src?.[pid]).length;
  return { doc: k - e, est: e, unk: qs.length - k, src: s, total: qs.length };
}
function dataLine(pid) {
  const x = partyData(pid);
  return `<p class="small muted data-line">${ICON.info}<span>Datos de ${esc(P[pid].ab)}: ${x.doc} posturas documentadas, ${x.est} estimadas y ${x.unk} sin postura conocida, de ${x.total} preguntas${x.src ? `; ${x.src} con fuente enlazada` : ""}. Actualizados el ${fmtDate(BANK.updated)}. <button type="button" class="link-btn" data-go="explorer" data-party="${pid}">Ver todas sus posturas</button></span></p>`;
}
const srcLink = (q, pid) => { const s = q.src?.[pid]; return s ? ` · <a href="${esc(s[0])}" target="_blank" rel="noopener noreferrer" title="${esc(s[1])}">Fuente${s[2] ? `: ${esc(SRC_TYPE[s[2]])}` : ""}</a>` : ""; };

// ── Tu perfil, explicado
function renderPortrait() {
  const M = MODEL, st = M.st, pr = PROV[st.prov];
  const have = BANK.dims.filter((d) => M.user.dims[d.id]);
  const strong = have.filter((d) => Math.abs(M.user.dims[d.id].v) >= 25).sort((a, b) => Math.abs(M.user.dims[b.id].v) - Math.abs(M.user.dims[a.id].v));
  const soft = have.filter((d) => Math.abs(M.user.dims[d.id].v) < 25);
  const ex = (d, v) => dimContrib(st, d.id).filter((r) => Math.sign(r.c) === Math.sign(v) && Math.abs(r.c) >= 1).sort((a, b) => Math.abs(b.c) - Math.abs(a.c)).slice(0, 2).map((r) => `«${esc(r.q.short)}» (${esc(ansBrief(r.q, r.u))})`);
  const defines = strong.map((d) => { const o = M.user.dims[d.id], e = ex(d, o.v);
    return `<li><b>${esc(ucFirst(DIM_PHRASE[d.id][o.v < 0 ? 0 : 1]))} <span class="muted">· ${strength(o.v)} (${signed(o.v)})</span></b><span>${e.length ? `Pesan sobre todo ${joinY(e)}.` : ""}${o.n < 3 ? ` Con ${plural(o.n, "respuesta", "respuestas")} en esta dimensión, es orientativo.` : ""}</span></li>`; }).join("")
    || '<li class="empty">Ninguna dimensión se inclina con claridad (más de 25 puntos) hacia un polo.</li>';
  const softs = soft.map((d) => {
    const rows = dimContrib(st, d.id), o = M.user.dims[d.id];
    if (dimKind(rows) === "mixta") {
      const a = rows.filter((r) => r.c < 0).sort((x, y) => x.c - y.c)[0], b = rows.filter((r) => r.c > 0).sort((x, y) => y.c - x.c)[0];
      return `<li><b>${esc(d.name)}: posición mixta <span class="muted">(${signed(o.v)})</span></b><span>Tienes respuestas firmes en los dos sentidos que se compensan: tu respuesta a «${esc(a.q.short)}» (${esc(ansBrief(a.q, a.u))}) te acerca a ${esc(lcFirst(d.a))}, y la de «${esc(b.q.short)}» (${esc(ansBrief(b.q, b.u))}), a ${esc(lcFirst(d.b))}.</span></li>`;
    }
    const neu = rows.filter((r) => r.u === 3).length;
    return `<li><b>${esc(d.name)}: posición moderada <span class="muted">(${signed(o.v)})</span></b><span>${plural(rows.length, "respuesta", "respuestas")}${neu ? `, ${neu} de ellas neutrales` : ""}; ninguna empuja con fuerza hacia un polo.</span></li>`;
  }).join("") || '<li class="empty">Tienes una inclinación clara en todas las dimensiones que has respondido.</li>';
  const combos = unusualCombos(M).map((c) => {
    const ph = (dim, v) => DIM_PHRASE[dim][v < 0 ? 0 : 1], typ = Math.sign(c.r) * Math.sign(c.ua);
    return `<li><b>${esc(ucFirst(ph(c.a, c.ua)))} con ${esc(ph(c.b, c.ub))}</b><span>Entre los partidos, quien defiende ${esc(ph(c.a, c.ua))} suele defender también ${esc(ph(c.b, typ))}. ${c.like.length ? `En ${esc(pr.name)} combinan como tú: ${esc(joinY(c.like.map((pid) => P[pid].ab)))}.` : `Ninguna candidatura de ${esc(pr.name)} combina así estas dos dimensiones.`}</span></li>`;
  }).join("") || '<li class="empty">Tus posiciones se combinan como suelen hacerlo entre los partidos: no hay ninguna combinación claramente inusual.</li>';
  const un = unrepresented(M);
  const unl = un.slice(0, 4).map((x) => `<li><b>${esc(x.q.short)}</b><span>Tú: ${esc(ansBrief(x.q, x.u))}. Ninguna de las ${x.n} candidaturas de ${esc(pr.name)} con postura conocida está de tu lado.</span></li>`).join("")
    || `<li class="empty">En todas las preguntas en las que tomas partido hay al menos una candidatura de ${esc(pr.name)} de tu lado.</li>`;
  const top = M.prov[0], byClose = M.prov.filter((m) => m.close != null).sort((a, b) => b.close - a.close)[0];
  const closeTxt = !top || !byClose ? "" : byClose.pid === top.pid
    ? `${esc(pName(top.pid, st.prov))} es a la vez la candidatura con más coincidencia pregunta a pregunta y la más cercana en el conjunto de las dimensiones (cercanía ${Math.round(byClose.close * 100)} %).`
    : `La candidatura más cercana en el conjunto de las dimensiones es ${esc(pName(byClose.pid, st.prov))} (cercanía ${Math.round(byClose.close * 100)} %), aunque la de más coincidencia pregunta a pregunta es ${esc(pName(top.pid, st.prov))}. Pasa cuando un partido se parece a ti en el conjunto pero no en temas concretos.`;
  $("#r-portrait").innerHTML = `
    <div class="sec-head"><p class="label">Tu perfil, explicado</p><h2 id="portrait-h" class="h2">Qué dicen de ti tus ${M.qs.length} respuestas</h2>
    <p class="sub">Todo lo que aparece aquí sale de tus respuestas, no de etiquetas previas. Cuando hay pocos datos para afirmar algo, lo decimos. ${closeTxt}</p></div>
    <div class="portrait">
      <div class="trait"><h3 class="h3">Lo que define tus respuestas</h3><ul class="tlist">${defines}</ul></div>
      <div class="trait"><h3 class="h3">Donde eres moderado o mixto</h3><ul class="tlist">${softs}</ul></div>
      <div class="trait"><h3 class="h3">Combinaciones poco habituales</h3><ul class="tlist">${combos}</ul></div>
      <div class="trait"><h3 class="h3">Opiniones sin candidatura en ${esc(pr.name)} <span class="muted small">(${un.length})</span></h3><ul class="tlist">${unl}</ul>${un.length > 4 ? `<p class="small muted">Y ${un.length - 4} más. Las ves pregunta a pregunta en «Tus respuestas».</p>` : ""}</div>
    </div>
    <p class="small muted">Abre cada dimensión en <a href="#r-dims" class="link-btn" style="padding:0">«Siete dimensiones»</a> para ver qué respuestas te sitúan ahí y dónde está cada partido.</p>`;
}

// Detalle de una dimensión: qué respuestas te sitúan, tu posición tema a tema y las candidaturas
function dimDetail(id) {
  const M = MODEL, st = M.st, d = DIM[id], o = M.user.dims[id], rows = dimContrib(st, id);
  const what = `<p class="dinfo"><b>Qué mide.</b> ${esc(d.desc)}</p>`;
  const strip = `<div><p class="subh">Las candidaturas de ${esc(PROV[st.prov].name)} en esta dimensión</p>${dimStrip(d, M, M.avail)}</div>`;
  if (!rows.length) return `<div class="ddetail">${what}${strip}</div>`;
  const fmt = (c) => Math.abs(c) < 0.5 ? "±0" : signed(c);
  const li = (r) => `<li><b>${esc(r.q.short)}</b><span>${esc(ucFirst(ansBrief(r.q, r.u)))}${st.imp[r.q.id] ? " · ★" : ""} · aporta <b class="num">${fmt(r.c)}</b></span></li>`;
  const toA = rows.filter((r) => r.c <= -0.5).sort((a, b) => a.c - b.c), toB = rows.filter((r) => r.c >= 0.5).sort((a, b) => b.c - a.c), mid = rows.length - toA.length - toB.length;
  const col = (arr, title) => `<div><p class="subh">${title} (${arr.length})</p>${arr.length ? `<ul class="cmp">${arr.slice(0, 4).map(li).join("")}</ul>${arr.length > 4 ? `<details class="more"><summary>Ver ${arr.length - 4} más</summary><ul class="cmp" style="margin-top:8px">${arr.slice(4).map(li).join("")}</ul></details>` : ""}` : '<ul class="cmp"><li class="empty">Ninguna respuesta.</li></ul>'}</div>`;
  const by = dimByArea(rows);
  const kind = Math.abs(o.v) < 25 ? (dimKind(rows) === "mixta" ? " Tu posición es <b>mixta</b>: respuestas firmes en los dos sentidos se compensan." : " Tu posición es <b>moderada</b>: tus respuestas son intermedias o poco marcadas.") : "";
  return `<div class="ddetail">
    <p class="small">Tu posición (${signed(o.v)}) es la media de tus ${plural(rows.length, "respuesta", "respuestas")} en esta dimensión: cada una «aporta» los puntos que suma o resta, y las neutrales pesan la mitad.${kind}${rows.length < 3 ? " Con tan pocas respuestas, es orientativa." : ""}</p>
    <div class="two">${col(toA, `Te acercan a «${esc(d.a)}»`)}${col(toB, `Te acercan a «${esc(d.b)}»`)}</div>
    ${mid ? `<p class="small muted">${plural(mid, "respuesta neutral no te mueve", "respuestas neutrales no te mueven")} hacia ningún lado.</p>` : ""}
    ${by.length >= 2 ? `<div><p class="subh">Tu posición tema a tema</p><div class="subdims">${by.map((x) => `<div class="sub-row"><span>${esc(x.a.name)}</span>${miniHTML(x.v)}<span class="small muted">${signed(x.v)} <span class="sr">con </span>(${x.n})<span class="sr"> respuestas</span></span></div>`).join("")}</div><p class="small muted" style="margin-top:6px">Entre paréntesis, cuántas de tus respuestas de cada tema miden esta dimensión.</p></div>` : ""}
    ${strip}${what}</div>`;
}

// Detalle de un tema: tus respuestas y las candidaturas que más y menos coinciden contigo en él
function areaDetail(id) {
  const M = MODEL, st = M.st, a = AREA[id];
  const qs = M.qs.filter((q) => q.area === id).sort((x, y) => Math.abs(st.ans[y.id] - 3) - Math.abs(st.ans[x.id] - 3)), ns = M.ns.filter((q) => q.area === id);
  const li = (q) => `<li><b>${esc(q.short)}</b><span>${esc(ucFirst(ansBrief(q, st.ans[q.id])))}${st.imp[q.id] ? " · ★ importante" : ""}</span></li>`;
  const aff = M.prov.map((m) => ({ m, x: areaAff(m).find((y) => y.a.id === id) })).filter((o) => o.x && o.x.n >= 2).sort((p, q) => q.x.v - p.x.v || q.x.n - p.x.n);
  const row = (o) => `<div class="affrow"><span><i class="sw" style="background:${P[o.m.pid].color}"></i> ${esc(pName(o.m.pid, st.prov))} <span class="muted">(${o.x.n})</span></span><span class="bar"><i style="width:${Math.round(o.x.v * 100)}%"></i></span><span class="v">${Math.round(o.x.v * 100)}</span></div>`;
  const parties = aff.length ? `${aff.slice(0, 3).map(row).join("")}${aff.length > 3 ? `<p class="small muted" style="margin:6px 0 0">La que menos:</p>${row(aff[aff.length - 1])}` : ""}` : '<ul class="cmp"><li class="empty">Ninguna candidatura tiene postura conocida en al menos dos de tus respuestas de este tema.</li></ul>';
  return `<div class="ddetail two">
    <div><p class="subh">Tus respuestas (${qs.length}${ns.length ? ` y ${ns.length} «No lo sé»` : ""})</p>${qs.length ? `<ul class="cmp">${qs.slice(0, 5).map(li).join("")}</ul>${qs.length > 5 ? `<details class="more"><summary>Ver ${qs.length - 5} más</summary><ul class="cmp" style="margin-top:8px">${qs.slice(5).map(li).join("")}</ul></details>` : ""}` : '<ul class="cmp"><li class="empty">No has dado tu opinión en ninguna pregunta de este tema.</li></ul>'}</div>
    <div><p class="subh">Coincidencia en ${esc(lcFirst(a.name))}</p><div class="aff" style="grid-template-columns:1fr">${parties}</div>
      <p class="small muted" style="margin-top:8px">Acuerdo medio en las preguntas de este tema que has respondido y en las que cada candidatura tiene postura (entre paréntesis). Solo con al menos dos.</p></div>
  </div>`;
}

// Cómo se calcula la coincidencia con un partido, paso a paso, y qué respuestas la mueven más
function calcDetail(pid) {
  const M = MODEL, st = M.st, m = M.all.find((x) => x.pid === pid);
  if (!m) return "";
  const ab = P[pid].ab, n = m.items.length;
  if (!n) return `<p class="small">${esc(ab)} no tiene postura conocida en ninguna de tus respuestas: su coincidencia es el valor neutro del 50 %.</p>`;
  const simple = Math.round(m.items.reduce((a, i) => a + 1 - i.d / 4, 0) / n * 100);
  const nImp = m.items.filter((i) => st.imp[i.q.id]).length, nPri = m.items.filter((i) => st.prios.includes(i.q.area)).length, nNeu = m.items.filter((i) => i.u === 3).length, nFam = m.items.filter((i) => famFactor(i.q, st) < 1).length;
  const eff = m.items.map((i) => ({ i, d: m.score - matchParty(pid, st, M.qs.filter((q) => q.id !== i.q.id), M.user).score }));
  const pts = (x) => `${(Math.abs(x) * 100).toFixed(1).replace(".", ",")} ${Math.abs(x) * 100 >= 0.95 && Math.abs(x) * 100 < 1.05 ? "punto" : "puntos"}`;
  const plus = eff.filter((e) => e.d > 0.0005).sort((a, b) => b.d - a.d).slice(0, 3), minus = eff.filter((e) => e.d < -0.0005).sort((a, b) => a.d - b.d).slice(0, 3);
  const li = (e) => `<li><b>${esc(e.i.q.short)}</b><span>Tú: ${esc(ansBrief(e.i.q, e.i.u))} · ${esc(ab)}: ${esc(ansBrief(e.i.q, e.i.v))}${e.i.est ? " (estimada)" : ""} · sin ella, ${e.d > 0 ? "bajaría" : "subiría"} ${pts(e.d)}</span></li>`;
  const w = [nImp && `${nImp} marcadas como importantes (×${W_IMPORTANT})`, nPri && `${nPri} de tus áreas prioritarias (×${String(W_PRIORITY).replace(".", ",")})`, nNeu && `${nNeu} neutrales (×${String(W_NEUTRAL).replace(".", ",")})`, m.nEst && `${m.nEst} con su postura estimada (×${String(W_ESTIMATED).replace(".", ",")})`, nFam && `${nFam} de familias de preguntas parecidas (peso repartido)`].filter(Boolean);
  return `<div class="ddetail">
    <ol class="calc-steps">
      <li><b>Preguntas comparadas: ${n} de tus ${M.qs.length} respuestas con opinión.</b> En el resto, ${esc(ab)} no tiene postura conocida y no cuenta.</li>
      <li><b>Acuerdo medio simple: ${simple} %.</b> Cada pregunta vale 1 − |tu respuesta − su postura| ÷ 4: 100 % si coincidís, 0 % si estáis en extremos opuestos.</li>
      <li><b>Con los pesos: ${m.raw} %.</b> ${w.length ? `Pesan distinto ${joinY(w)}.` : "Todas tus respuestas pesan lo mismo."}</li>
      ${m.padded ? `<li><b>Relleno neutro: ${m.pct} %.</b> Como solo tiene postura en una parte pequeña de tus respuestas, se añade un 50 % neutro hasta completar la mitad del peso.</li>` : `<li><b>Resultado: ${m.pct} %.</b> Tiene postura en suficientes respuestas, sin relleno neutro.</li>`}
      <li><b>Comprobación: ${Math.round(m.alt * 100)} %</b> con el método alternativo, que solo mira si estáis del mismo lado.</li>
    </ol>
    <div class="two">
      <div><p class="subh" style="color:var(--ok)">Lo que más le suma</p>${plus.length ? `<ul class="cmp">${plus.map(li).join("")}</ul>` : '<ul class="cmp"><li class="empty">Ninguna respuesta le suma por encima de su media.</li></ul>'}</div>
      <div><p class="subh" style="color:var(--ko)">Lo que más le resta</p>${minus.length ? `<ul class="cmp">${minus.map(li).join("")}</ul>` : '<ul class="cmp"><li class="empty">Ninguna respuesta le resta por debajo de su media.</li></ul>'}</div>
    </div></div>`;
}

// Un partido frente a ti en cada dimensión
function partyDims(pid) {
  const M = MODEL, st = M.st, pd = PARTY_DIM[pid], ab = P[pid].ab;
  const rows = BANK.dims.map((d) => {
    const o = M.user.dims[d.id], pv = pd[d.id];
    const txt = o && pv !== undefined ? `Tú ${signed(o.v)} · ${esc(ab)} ${signed(pv)} · a ${plural(Math.round(Math.abs(o.v - pv)), "punto", "puntos")}` : pv !== undefined ? `${esc(ab)} ${signed(pv)} · no has respondido` : o ? `Tú ${signed(o.v)} · ${esc(ab)} sin posturas` : "Sin datos";
    return `<div class="pdrow"><div><b>${esc(d.name)}</b><span class="small muted">${txt}</span></div><div class="track sm" role="img" aria-label="${esc(d.name)}: ${esc(txt)}, de ${esc(d.a)} a ${esc(d.b)}">${trackHTML(o?.v, pv !== undefined ? [{ pid, v: pv, tip: `${pName(pid, st.prov)}: ${dimLabel(d, pv)} (${signed(pv)})` }] : [], o ? `Tú: ${dimLabel(d, o.v)}` : "")}</div></div>`;
  }).join("");
  return `<div class="ddetail"><div class="pdims">${rows}</div><p class="small muted">Círculo con banda amarilla: tú. Rombo: ${esc(ab)}, con todas sus posturas del banco. La distancia media en estas dimensiones es su cercanía ideológica.</p></div>`;
}

// ── Tú y otra persona: al abrir un resultado compartido (o después, con el último que abriste)
function friendPair() {
  if (!S || answered(S).length < 5) return null;
  if (SHARED) return { me: S, them: SHARED, live: true };
  const them = decodeShare(store.get(FRIEND_KEY));
  if (!them || BANK.questions.every((q) => them.ans[q.id] === S.ans[q.id])) return null;
  return { me: S, them, live: false };
}
function renderFriend() {
  const sec = $("#r-friend"), F = friendPair();
  sec.hidden = !F;
  if (!F) { sec.innerHTML = ""; return; }
  const a = F.me, b = F.them, who = F.live ? "esta persona" : "quien te compartió su resultado";
  const common = BANK.questions.filter((q) => a.ans[q.id] >= 1 && b.ans[q.id] >= 1);
  const head = `<div class="sec-head"><p class="label">Tú y ${who}</p><h2 id="friend-h" class="h2">¿Cuánto coincidís?</h2></div>`;
  const forget = F.live ? "" : '<p><button type="button" class="link-btn" data-act="forget-friend" style="padding:0">Olvidar este resultado compartido</button></p>';
  if (common.length < 5) { sec.innerHTML = `${head}<p class="small muted">Habéis respondido muy pocas preguntas en común (${common.length}) para compararos. Una versión más larga del test lo permite.</p>${forget}`; return; }
  const agree = Math.round(common.reduce((x, q) => x + 1 - Math.abs(a.ans[q.id] - b.ans[q.id]) / 4, 0) / common.length * 100);
  const same = common.filter((q) => sideOf(a.ans[q.id]) && sideOf(a.ans[q.id]) === sideOf(b.ans[q.id])).sort((x, y) => (Math.abs(b.ans[y.id] - 3) + Math.abs(a.ans[y.id] - 3)) - (Math.abs(b.ans[x.id] - 3) + Math.abs(a.ans[x.id] - 3)));
  const opp = common.filter((q) => sideOf(a.ans[q.id]) && sideOf(b.ans[q.id]) && sideOf(a.ans[q.id]) !== sideOf(b.ans[q.id])).sort((x, y) => Math.abs(a.ans[y.id] - b.ans[y.id]) - Math.abs(a.ans[x.id] - b.ans[x.id]));
  const li = (q) => `<li><b>${esc(q.short)}</b><span>Tú: ${esc(ansBrief(q, a.ans[q.id]))} · ${F.live ? "Esta persona" : "La otra persona"}: ${esc(ansBrief(q, b.ans[q.id]))}</span></li>`;
  const ua = userProfile(a).dims, ub = userProfile(b).dims;
  const rows = BANK.dims.map((d) => { const x = ua[d.id], y = ub[d.id];
    const txt = [x ? `Tú ${signed(x.v)}` : "Tú sin datos", y ? `${F.live ? "Esta persona" : "La otra persona"} ${signed(y.v)}` : "la otra persona sin datos"].join(" · ");
    return `<div class="pdrow"><div><b>${esc(d.name)}</b><span class="small muted">${esc(txt)}</span></div><div class="track sm" role="img" aria-label="${esc(d.name)}: ${esc(txt)}">${trackHTML(x?.v, [], x ? `Tú: ${signed(x.v)}` : "")}${y ? `<span class="fm" style="left:${pctPos(y.v)}%" data-tip="${F.live ? "Esta persona" : "La otra persona"}: ${signed(y.v)}"></span>` : ""}</div></div>`; }).join("");
  const ta = computeModel(a).prov[0], tb = computeModel(b).prov[0];
  sec.innerHTML = `${head}
    <div class="friend-top"><p class="tm-pct">${agree}<small>%</small></p><p class="why">Coincidís en un ${agree} % en las ${common.length} preguntas que habéis respondido los dos: estáis del mismo lado en ${same.length} y en lados opuestos en ${opp.length}.${ta && tb ? ` Tu mayor coincidencia es ${esc(pName(ta.pid, a.prov))} (${ta.pct} %); la de ${F.live ? "esta persona" : "la otra persona"}, ${esc(pName(tb.pid, b.prov))} (${tb.pct} %).` : ""}</p></div>
    <div class="two">
      <div><p class="subh" style="color:var(--ok)">En qué estáis de acuerdo (${same.length})</p>${same.length ? `<ul class="cmp">${same.slice(0, 3).map(li).join("")}</ul>` : '<ul class="cmp"><li class="empty">En ninguna pregunta estáis claramente del mismo lado.</li></ul>'}</div>
      <div><p class="subh" style="color:var(--ko)">Dónde chocáis (${opp.length})</p>${opp.length ? `<ul class="cmp">${opp.slice(0, 3).map(li).join("")}</ul>` : '<ul class="cmp"><li class="empty">No estáis en lados opuestos en ninguna pregunta.</li></ul>'}</div>
    </div>
    <details class="more"><summary>Vuestras posiciones en las siete dimensiones</summary><div class="ddetail"><div class="pdims">${rows}</div><p class="small muted">Círculo con banda amarilla: tú. Círculo hueco: ${F.live ? "esta persona" : "la otra persona"}.</p></div></details>
    <p class="small muted">La comparación se hace en tu navegador: nadie recibe tus respuestas.</p>${forget}`;
}

// ── Comparar dos candidaturas
function renderVersus() {
  const M = MODEL, st = M.st, pr = PROV[st.prov], sec = $("#r-versus");
  const others = M.all.filter((m) => !M.avail.includes(m.pid));
  const valid = (pid) => M.all.some((m) => m.pid === pid);
  if (!valid(UI.vsA)) UI.vsA = M.prov[0]?.pid || M.all[0]?.pid;
  if (!valid(UI.vsB) || UI.vsB === UI.vsA) UI.vsB = (M.prov.find((m) => m.pid !== UI.vsA) || M.all.find((m) => m.pid !== UI.vsA))?.pid;
  const head = `<div class="sec-head"><p class="label">Comparar</p><h2 id="versus-h" class="h2">Dos candidaturas, frente a frente</h2>
    <p class="sub">Elige dos candidaturas para ver en qué se diferencian de verdad, pregunta a pregunta y dimensión a dimensión, y de cuál estás más cerca en cada caso.</p></div>`;
  if (!UI.vsA || !UI.vsB) { sec.innerHTML = `${head}<ul class="cmp"><li class="empty">No hay suficientes candidaturas para comparar.</li></ul>`; return; }
  const opts = (sel) => `<optgroup label="En ${esc(pr.name)}">${M.prov.map((m) => `<option value="${m.pid}"${m.pid === sel ? " selected" : ""}>${esc(pName(m.pid, st.prov))}</option>`).join("")}</optgroup>${others.length ? `<optgroup label="En otros territorios">${others.map((m) => `<option value="${m.pid}"${m.pid === sel ? " selected" : ""}>${esc(P[m.pid].name)}</option>`).join("")}</optgroup>` : ""}`;
  const A = M.all.find((m) => m.pid === UI.vsA), B = M.all.find((m) => m.pid === UI.vsB), a = A.pid, b = B.pid, abA = P[a].ab, abB = P[b].ab;
  const both = BANK.questions.filter((q) => q.pos[a] && q.pos[b]);
  const same = both.filter((q) => sideOf(q.pos[a]) && sideOf(q.pos[a]) === sideOf(q.pos[b])), opp = both.filter((q) => sideOf(q.pos[a]) && sideOf(q.pos[b]) && sideOf(q.pos[a]) !== sideOf(q.pos[b]));
  const gap = (q) => Math.abs(q.pos[a] - q.pos[b]), ans = (q) => (st.ans[q.id] >= 1 ? 1 : 0);
  const diffs = both.filter((q) => gap(q) >= 2).sort((x, y) => gap(y) - gap(x) || ans(y) - ans(x) || x.prio - y.prio);
  const est = (q, pid) => (q.est.includes(pid) ? ' <i class="est">(estimada)</i>' : "");
  const li = (q) => { const u = st.ans[q.id], du = u >= 1 ? Math.abs(u - q.pos[a]) - Math.abs(u - q.pos[b]) : null;
    return `<li><b>${esc(q.short)}</b><span>${esc(abA)}: ${esc(ansBrief(q, q.pos[a]))}${est(q, a)} · ${esc(abB)}: ${esc(ansBrief(q, q.pos[b]))}${est(q, b)}</span><span>Tú: ${esc(ansBrief(q, u))}${du == null ? "" : du < 0 ? ` · <b>más cerca de ${esc(abA)}</b>` : du > 0 ? ` · <b>más cerca de ${esc(abB)}</b>` : " · a igual distancia"}</span></li>`; };
  const dgap = BANK.dims.filter((d) => PARTY_DIM[a][d.id] !== undefined && PARTY_DIM[b][d.id] !== undefined).map((d) => ({ d, g: Math.abs(PARTY_DIM[a][d.id] - PARTY_DIM[b][d.id]) })).sort((x, y) => y.g - x.g);
  const dimRows = BANK.dims.map((d) => {
    const o = M.user.dims[d.id], va = PARTY_DIM[a][d.id], vb = PARTY_DIM[b][d.id];
    const marks = [va !== undefined && { pid: a, v: va, tip: `${abA}: ${signed(va)}` }, vb !== undefined && { pid: b, v: vb, tip: `${abB}: ${signed(vb)}` }].filter(Boolean);
    const txt = [o && `Tú ${signed(o.v)}`, `${abA} ${va !== undefined ? signed(va) : "sin datos"}`, `${abB} ${vb !== undefined ? signed(vb) : "sin datos"}`].filter(Boolean).join(" · ");
    return `<div class="pdrow"><div><b>${esc(d.name)}</b><span class="small muted">${esc(txt)}</span></div><div class="track sm" role="img" aria-label="${esc(d.name)}: ${esc(txt)}">${trackHTML(o?.v, marks, o ? `Tú: ${signed(o.v)}` : "")}</div></div>`;
  }).join("");
  const card = (m) => `<div class="vs-card">${logo(m.pid)}<div style="display:grid;gap:2px;min-width:0"><b>${esc(M.avail.includes(m.pid) ? pName(m.pid, st.prov) : P[m.pid].name)}</b><span class="small muted">Coincidencia contigo ${m.pct} %${m.close != null ? ` · cercanía ${Math.round(m.close * 100)} %` : ""}${M.avail.includes(m.pid) ? "" : " · no se presenta en tu provincia"}</span></div></div>`;
  sec.innerHTML = `${head}
    <div class="vs-pick"><div class="field"><label class="label" for="vs-a">Candidatura A</label><select id="vs-a" data-ctl="vsA">${opts(a)}</select></div>
      <div class="field"><label class="label" for="vs-b">Candidatura B</label><select id="vs-b" data-ctl="vsB">${opts(b)}</select></div></div>
    <div class="vs-head">${card(A)}${card(B)}</div>
    <p class="why">${esc(P[a].name)} y ${esc(P[b].name)} tienen postura conocida en ${both.length} preguntas comunes: están del mismo lado en ${same.length}, en lados opuestos en ${opp.length}${both.length - same.length - opp.length ? ` y en ${both.length - same.length - opp.length} alguna de las dos es neutral` : ""}.${dgap.length && dgap[0].g >= 15 ? ` Donde más se separan de fondo es en ${esc(joinY(dgap.filter((x) => x.g >= 15).slice(0, 2).map((x) => DIM_SHORT[x.d.id])))}.` : " En el conjunto de las dimensiones están muy cerca."}</p>
    <div class="two">
      <div><p class="subh">Dónde más se diferencian (${diffs.length})</p>${diffs.length ? `<ul class="cmp">${diffs.slice(0, 5).map(li).join("")}</ul>${diffs.length > 5 ? `<details class="more"><summary>Ver ${diffs.length - 5} diferencias más</summary><ul class="cmp" style="margin-top:8px">${diffs.slice(5).map(li).join("")}</ul></details>` : ""}` : '<ul class="cmp"><li class="empty">No hay preguntas en las que sus posturas se separen dos puntos o más.</li></ul>'}</div>
      <div><p class="subh">Las siete dimensiones</p><div class="pdims">${dimRows}</div><p class="small muted">Círculo con banda amarilla: tú. Rombos: cada candidatura, con su color.</p></div>
    </div>
    <p class="small muted">Las posturas estimadas aparecen en cursiva. Comparar dos partidos no cambia tu resultado.</p>`;
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
      <div class="ballot-top"><span>${SHARED ? "Resultado compartido" : "Tu resultado"} · ${MODES[st.mode]?.label || ""}</span><span>Congreso · ${esc(pr.name)}</span></div>
      <div class="ballot-body">
        <div style="display:grid;gap:16px;align-content:start">
          <p class="who">${SHARED ? "Resultado compartido · " : ""}${nAns} respuestas con opinión de ${nTotal}${M.ns.length ? ` · ${M.ns.length} «No lo sé»` : ""}${st.prios.length ? ` · Prioridades: ${st.prios.map((a) => AREA[a].letter).join(", ")}` : ""}</p>
          <h1 id="res-h" class="profile-h">${esc(ps.head)}</h1>
          ${ps.sub ? `<p class="profile-sub">${esc(ps.sub)}</p>` : ""}
          <div class="sig" aria-label="Tu firma ideológica en siete dimensiones">${sig}</div>
          <p class="small muted">Cada barra va del primer polo de su dimensión (a la izquierda) al segundo (a la derecha); no es el eje izquierda-derecha. <a href="#r-dims" class="link-btn" style="padding:0">Ver el detalle</a></p>
        </div>
        <div class="top-match">
          <p class="label">Tu mayor coincidencia en ${esc(pr.name)}</p>
          ${top ? `<div class="tm-row">${logo(top.pid)}<span class="tm-name">${esc(pName(top.pid, st.prov))}</span></div>
          <p class="tm-pct">${top.pct}<small>%</small></p>
          <p class="small muted">de coincidencia con sus posturas, pregunta a pregunta. No es una probabilidad de voto.</p>
          <p class="small">${top.close != null ? `Cercanía ideológica: <b>${Math.round(top.close * 100)} %</b> · ` : ""}comparado en ${top.n} de ${nAns} respuestas</p>
          ${top.pct < 60 ? `<p class="small">Ninguna candidatura encaja de lleno con tus respuestas: es normal en perfiles que combinan ideas de distintos lados.</p>` : ""}
          <p class="small muted">Siguientes: ${M.prov.slice(1, 3).map((m) => `${esc(pName(m.pid, st.prov))} (${m.pct} %)`).join(" · ") || "—"}</p>` : "<p>No hay candidaturas comparables.</p>"}
          <p class="rel ${M.rel.level}"><i></i>Solidez del resultado: ${M.rel.level}</p>
          <div class="res-actions"><a class="btn btn-primary btn-sm" href="#r-parties">Ver partidos en detalle</a><a class="btn btn-ghost btn-sm" href="#r-portrait">Tu perfil, explicado</a>${!SHARED ? '<a class="btn btn-ghost btn-sm" href="#r-share">Compartir</a>' : ""}</div>
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
        <details class="more"><summary>${o ? "Por qué estás aquí y dónde están los partidos" : "Qué mide y dónde están los partidos"}</summary><div data-lazy="dim:${d.id}"></div></details>
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

const NARROW = matchMedia("(max-width: 600px)");
NARROW.addEventListener?.("change", () => { if (MODEL && CURRENT === "results") renderMap(); });
function renderMap() {
  const st = ST(), M = MODEL, G = MAPM;
  const u = mapProject(Object.fromEntries(Object.entries(M.user.dims).map(([k, o]) => [k, o.v])));
  const ranked = M.prov.map((m) => ({ m, pt: G.pts[m.pid] }));
  const shown = ranked.filter((r) => r.pt.ok);
  const hidden = ranked.filter((r) => !r.pt.ok);
  // Misma escala en los dos ejes: la distancia en pantalla respeta la del modelo
  const xs = [...Object.values(G.pts).filter((p) => p.ok).map((p) => p.x), ...(u.ok ? [u.x] : [])];
  const ys = [...Object.values(G.pts).filter((p) => p.ok).map((p) => p.y), ...(u.ok ? [u.y] : [])];
  const span = Math.max(Math.max(...xs) - Math.min(...xs), (Math.max(...ys) - Math.min(...ys)) * 1.6) * 1.12;
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  // En móvil, un lienzo más estrecho y alto para que puntos y etiquetas se lean bien
  const narrow = NARROW.matches, W = narrow ? 380 : 560, pad = narrow ? 34 : 44, inner = W - pad * 2, k = inner / span;
  const ih = Math.max(inner * (narrow ? 0.72 : 0.5), Math.min(inner, (Math.max(...ys) - Math.min(...ys)) * 1.25 * k + 40)), H = ih + pad * 2;
  const sx = (v) => pad + inner / 2 + (v - cx) * k, sy = (v) => pad + ih / 2 - (v - cy) * k;
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
  const grid = [0.25, 0.5, 0.75].map((f) => `<line class="mg${f === 0.5 ? " z" : ""}" x1="${pad + inner * f}" y1="${pad}" x2="${pad + inner * f}" y2="${pad + ih}"/><line class="mg${f === 0.5 ? " z" : ""}" x1="${pad}" y1="${pad + ih * f}" x2="${pad + inner}" y2="${pad + ih * f}"/>`).join("");
  if (u.ok) placed.push({ x: sx(u.x) - 16, y: sy(u.y) - 16, w: 32, h: 32 });
  shown.forEach((r) => placed.push({ x: sx(r.pt.x) - 8, y: sy(r.pt.y) - 8, w: 16, h: 16 }));
  const dots = shown.map(({ m, pt }) => {
    const px = sx(pt.x), py = sy(pt.y), name = pName(m.pid, st.prov), t = P[m.pid].ab;
    const at = lab(px, py, t.length * 7.4 + 4, 14);
    const note = pt.missing.length ? ` · posición aproximada: sin datos de ${pt.missing.map((d) => DIM_SHORT[d]).join(", ")}` : "";
    return `<g class="map-pt${UI.mapSel === m.pid ? " sel" : ""}" data-pid="${m.pid}" tabindex="0" role="button" aria-pressed="${UI.mapSel === m.pid}" aria-label="${esc(name)}: coincidencia contigo ${m.pct} %${esc(note)}. Ver por qué está ahí" data-tip="${esc(name)} · coincidencia contigo ${m.pct} %${esc(note)}">
      <circle class="hit" cx="${px}" cy="${py}" r="14" fill="transparent"/>
      <circle class="dot" cx="${px}" cy="${py}" r="8" style="fill:${P[m.pid].color};stroke:var(--sheet);stroke-width:2.5"/>
      ${pt.missing.length ? `<circle cx="${px}" cy="${py}" r="11.5" fill="none" style="stroke:${P[m.pid].color};stroke-width:1.4;stroke-dasharray:2.5 2.5"/>` : ""}
      ${at ? `<text x="${at[0]}" y="${at[1]}" class="ml">${esc(t)}</text>` : ""}</g>`;
  }).join("");
  const me = u.ok ? `<g class="map-me${UI.mapSel === "me" ? " sel" : ""}" data-pid="me" tabindex="0" role="button" aria-pressed="${UI.mapSel === "me"}" aria-label="Tu posición en el mapa. Ver qué la explica"><circle cx="${sx(u.x)}" cy="${sy(u.y)}" r="15" class="me-o"/><circle cx="${sx(u.x)}" cy="${sy(u.y)}" r="11" class="me-i"/><text x="${sx(u.x)}" y="${sy(u.y) + 3.6}" text-anchor="middle" class="me-t">TÚ</text></g>` : "";
  const pct = (r) => `${Math.round(r * 100)} %`;
  const cap = (arr) => { const t = arr.join(", "); return t.charAt(0).toUpperCase() + t.slice(1) + "."; };
  const near = M.prov.slice(0, 3);
  const row = (m, i) => `<li${i < 3 ? ' class="near"' : ""}><button type="button" class="ml-btn" data-mapsel="${m.pid}" aria-pressed="${UI.mapSel === m.pid}"><b><span class="sw" style="background:${P[m.pid].color}"></span> ${i + 1}. ${esc(pName(m.pid, st.prov))}</b><span>Coincidencia ${m.pct} %${m.close != null ? ` · cercanía ideológica ${Math.round(m.close * 100)} %` : ""}${G.pts[m.pid].ok ? "" : " · sin datos suficientes para situarla en el mapa"}</span></button></li>`;
  $("#r-map").innerHTML = `
    <div class="sec-head"><p class="label">Mapa</p><h2 id="map-h" class="h2">Dónde te sitúas frente a las candidaturas de ${esc(PROV[st.prov].name)}</h2>
    <p class="sub">El mapa se calcula automáticamente con las ${BANK.dims.length} dimensiones del test a la vez: tus respuestas y las posturas de cada partido. Los perfiles parecidos quedan cerca y los muy distintos, lejos.</p></div>
    <div class="map-wrap">
      <div class="map-box">
        <svg class="map-svg" viewBox="0 0 ${W} ${H}" role="group" aria-label="Mapa político con las ${BANK.dims.length} dimensiones del test">
          <style>.mg{stroke:var(--rule-2);stroke-width:1}.mg.z{stroke:var(--rule);stroke-width:1.6}.ax{fill:var(--ink-2);font-size:12px;font-weight:650}.ml{fill:var(--ink);font-size:12px;font-weight:750}.me-o{fill:var(--mark);stroke:var(--mark-ink);stroke-width:2}.me-i{fill:var(--ink)}.me-t{fill:var(--paper);font-size:9.5px;font-weight:900;letter-spacing:.04em}.frame{fill:none;stroke:var(--rule);stroke-width:1}.map-pt,.map-me{cursor:pointer}.map-pt.sel .dot{stroke:var(--ink)!important;stroke-width:3.5!important}.map-me.sel .me-o{stroke-width:4}.map-me:focus{outline:none}.map-me:focus-visible .me-o{stroke:var(--ink);stroke-width:4}</style>
          <rect class="frame" x="${pad}" y="${pad}" width="${inner}" height="${ih}"/>
          ${grid}
          <text class="ax" x="${pad + inner / 2}" y="${pad + ih + 24}" text-anchor="middle" style="font-weight:800;fill:var(--ink)">← Eje 1 · ${pct(G.ratio[0])} de las diferencias →</text>
          <text class="ax" x="${pad - 14}" y="${pad + ih / 2}" text-anchor="middle" transform="rotate(-90 ${pad - 14} ${pad + ih / 2})" style="font-weight:800;fill:var(--ink)">← Eje 2 · ${pct(G.ratio[1])} →</text>
          ${dots}${me}
        </svg>
        <dl class="map-axes">
          <div><dt>→ Hacia la derecha</dt><dd>${esc(cap(G.axes[0].pos))}</dd></div>
          <div><dt>← Hacia la izquierda</dt><dd>${esc(cap(G.axes[0].neg))}</dd></div>
          <div><dt>↑ Hacia arriba</dt><dd>${esc(cap(G.axes[1].pos))}</dd></div>
          <div><dt>↓ Hacia abajo</dt><dd>${esc(cap(G.axes[1].neg))}</dd></div>
        </dl>
        ${UI.mapDim ? `<div class="map-dim"><p class="subh">${esc(DIM[UI.mapDim].name)}, por separado</p>${dimStrip(DIM[UI.mapDim], M, M.avail)}<p class="small muted">Solo esta dimensión, en la misma escala de −100 a +100 que «Siete dimensiones». El mapa de arriba sigue resumiendo las ${BANK.dims.length}.</p></div>` : ""}
      </div>
      <div class="map-ctrl">
        <div class="cmp-bar"><label class="label" for="map-dim">Ver una dimensión</label><select id="map-dim" data-ctl="mapdim"><option value="">Ninguna: solo el mapa global</option>${BANK.dims.map((d) => `<option value="${d.id}"${UI.mapDim === d.id ? " selected" : ""}>${esc(d.name)}</option>`).join("")}</select></div>
        <div id="map-sel" class="map-sel" aria-live="polite">${mapSelHTML()}</div>
        ${u.ok ? "" : `<p class="small" style="color:var(--warn)">${ICON.warn} No podemos situarte en el mapa: te faltan respuestas con opinión en ${esc(u.missing.map((d) => DIM_SHORT[d]).join(", "))}, que pesan mucho en sus ejes. Tu coincidencia con cada partido sí está calculada.</p>`}
        <div><p class="subh">Candidaturas por orden de coincidencia</p>
          <ul class="tlist map-list">${M.prov.map(row).join("")}</ul></div>
        <p class="small muted">La coincidencia se calcula pregunta a pregunta con todas tus respuestas, no midiendo distancias en el dibujo: dos puntos cercanos pueden tener coincidencias algo distintas. El orden de la lista es el más fiable.</p>
        <details class="more"><summary>Cómo leer el mapa</summary><div class="small" style="display:grid;gap:8px;margin-top:10px">
          <p>Los ejes no son «izquierda» y «derecha»: son las dos combinaciones de dimensiones que más diferencian a los partidos españoles, calculadas con un análisis de componentes principales. Juntas recogen el ${pct(G.ratio[0] + G.ratio[1])} de esas diferencias.</p>
          <p>Cada partido se sitúa con sus posturas en todas las dimensiones; tú, con tus respuestas. Dos puntos cercanos son perfiles de respuesta parecidos según este modelo, pero el dibujo pierde el ${pct(1 - G.ratio[0] - G.ratio[1])} restante de las diferencias.</p>
          <p>Cada dimensión cuenta lo mismo, tenga más o menos preguntas. Las posturas desconocidas no se rellenan: un partido con datos incompletos aparece con un círculo discontinuo, y si le faltan dimensiones clave no se dibuja.${hidden.length ? ` En tu provincia no ${hidden.length === 1 ? "se dibuja" : "se dibujan"}: ${esc(hidden.map((r) => pName(r.m.pid, st.prov)).join(", "))}.` : ""}</p>
        </div></details>
      </div>
    </div>`;
}

// Panel del punto seleccionado en el mapa: por qué está donde está, respecto a ti
function mapSelHTML() {
  const M = MODEL, st = M.st, pid = UI.mapSel;
  if (!pid) return `<p class="small muted">Toca un punto del mapa o un nombre de la lista para ver por qué está ahí.</p>`;
  if (pid === "me") {
    const ds = BANK.dims.filter((d) => M.user.dims[d.id]).sort((a, b) => Math.abs(M.user.dims[b.id].v) - Math.abs(M.user.dims[a.id].v));
    return `<p class="subh">Tu posición</p><p class="small">Te sitúan sobre todo ${ds.slice(0, 3).map((d) => `${esc(DIM_PHRASE[d.id][M.user.dims[d.id].v < 0 ? 0 : 1])} (${signed(M.user.dims[d.id].v)})`).join(", ") || "tus respuestas"}.</p><p class="small muted">Abre cada dimensión en «Siete dimensiones» para ver qué respuestas pesan más.</p>`;
  }
  const m = M.all.find((x) => x.pid === pid); if (!m) return "";
  const pd = PARTY_DIM[pid], ab = P[pid].ab;
  const gaps = Object.entries(M.user.dims).filter(([k]) => pd[k] !== undefined).map(([k, o]) => ({ k, u: o.v, p: pd[k], g: Math.abs(o.v - pd[k]) })).sort((a, b) => b.g - a.g);
  const fmt = (x) => `${DIM_SHORT[x.k]} (tú ${signed(x.u)}, ${esc(ab)} ${signed(x.p)})`;
  const far = gaps.filter((x) => x.g >= 30).slice(0, 2), near = gaps.filter((x) => x.g < 20).sort((a, b) => a.g - b.g).slice(0, 2);
  const pt = MAPM.pts[pid];
  return `<div class="tm-row">${logo(pid, "sm")}<b>${esc(pName(pid, st.prov))}</b></div>
    <p class="small">Coincidencia contigo <b>${m.pct} %</b>${m.close != null ? ` · cercanía ideológica <b>${Math.round(m.close * 100)} %</b>` : ""}.</p>
    ${far.length ? `<p class="small">Más lejos de ti en ${joinY(far.map(fmt))}.</p>` : ""}${near.length ? `<p class="small">Más cerca en ${joinY(near.map(fmt))}.</p>` : ""}
    ${!pt.ok ? `<p class="small muted">No aparece en el mapa: le faltan posturas en las dimensiones que más pesan en sus ejes.</p>` : pt.missing.length ? `<p class="small muted">Posición aproximada: sin posturas en ${esc(pt.missing.map((d) => DIM_SHORT[d]).join(", "))}.</p>` : ""}
    <div class="res-actions"><button type="button" class="btn btn-ghost btn-sm" data-card="${pid}">Ver su ficha</button>${M.prov[0] && M.prov[0].pid !== pid ? `<button type="button" class="btn btn-ghost btn-sm" data-vs="${pid}">Comparar con ${esc(P[M.prov[0].pid].ab)}</button>` : ""}</div>`;
}
function selectMap(pid) {
  UI.mapSel = UI.mapSel === pid ? null : pid;
  const box = $("#map-sel"); if (box) box.innerHTML = mapSelHTML();
  $$("#r-map .map-pt, #r-map .map-me").forEach((g) => { const on = g.dataset.pid === UI.mapSel; g.classList.toggle("sel", on); g.setAttribute("aria-pressed", String(on)); });
  $$("#r-map [data-mapsel]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.mapsel === UI.mapSel)));
}

// ───────────────────────────── MAPA (análisis de componentes principales)
// Se ajusta una vez con los partidos que tienen postura en todas las dimensiones (escala común −100…+100,
// ya corregida por la dirección de cada pregunta). Así los ejes no dependen de quién haga el test.
function fitMap() {
  const ids = BANK.dims.map((d) => d.id);
  const full = PIDS.filter((pid) => ids.every((d) => PARTY_DIM[pid][d] !== undefined));
  const n = full.length, mean = ids.map((d) => full.reduce((a, p) => a + PARTY_DIM[p][d], 0) / n);
  const C = ids.map((_, i) => ids.map((_, j) => full.reduce((a, p) => a + (PARTY_DIM[p][ids[i]] - mean[i]) * (PARTY_DIM[p][ids[j]] - mean[j]), 0) / (n - 1)));
  const E = eigenSym(C), total = E.reduce((a, e) => a + e.val, 0);
  // Signo estable: la dimensión que más pesa en cada eje apunta hacia la derecha o hacia arriba
  const L = E.slice(0, 2).map((e) => { const top = e.vec.reduce((b, v, i) => (Math.abs(v) > Math.abs(e.vec[b]) ? i : b), 0); return e.vec.map((v) => v * Math.sign(e.vec[top])); });
  const axes = L.map((l) => {
    const strong = ids.map((d, i) => ({ d, w: l[i] })).filter((x) => Math.abs(x.w) >= 0.3).sort((a, b) => Math.abs(b.w) - Math.abs(a.w));
    return { pos: strong.map((x) => DIM_PHRASE[x.d][x.w > 0 ? 1 : 0]), neg: strong.map((x) => DIM_PHRASE[x.d][x.w > 0 ? 0 : 1]) };
  });
  // Correlación entre dimensiones según las posturas de los partidos (para detectar combinaciones poco habituales)
  const corr = ids.map((_, i) => ids.map((__, j) => C[i][j] / Math.sqrt(C[i][i] * C[j][j] || 1)));
  MAPM = { ids, mean, L, axes, corr, ratio: E.slice(0, 2).map((e) => e.val / total), fit: full.length, pts: {} };
  for (const pid of PIDS) MAPM.pts[pid] = mapProject(PARTY_DIM[pid]);
}
// Proyección por mínimos cuadrados con las dimensiones disponibles. Solo se sitúa un punto si esas
// dimensiones explican al menos la mitad del peso de cada eje: lo que falta no se toma como neutral.
function mapProject(vec) {
  const G = MAPM, av = G.ids.map((d, i) => [i, vec[d]]).filter(([, v]) => v !== undefined && v !== null);
  const missing = G.ids.filter((d) => vec[d] === undefined || vec[d] === null);
  let a = 0, b = 0, c = 0, r1 = 0, r2 = 0;
  for (const [i, v] of av) { const x = v - G.mean[i], l1 = G.L[0][i], l2 = G.L[1][i]; a += l1 * l1; b += l1 * l2; c += l2 * l2; r1 += l1 * x; r2 += l2 * x; }
  const det = a * c - b * b;
  const ok = a >= 0.5 && c >= 0.5 && det > 1e-6;
  return ok ? { ok, missing, x: (c * r1 - b * r2) / det, y: (a * r2 - b * r1) / det } : { ok, missing };
}
// Autovalores y autovectores de una matriz simétrica pequeña (método de Jacobi)
function eigenSym(A) {
  const m = A.length, a = A.map((r) => [...r]), V = a.map((_, i) => a.map((__, j) => +(i === j)));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let i = 0; i < m; i++) for (let j = i + 1; j < m; j++) off += a[i][j] ** 2;
    if (off < 1e-12) break;
    for (let p = 0; p < m; p++) for (let q = p + 1; q < m; q++) {
      if (Math.abs(a[p][q]) < 1e-15) continue;
      const th = (a[q][q] - a[p][p]) / (2 * a[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const cs = 1 / Math.sqrt(t * t + 1), sn = t * cs;
      for (let r = 0; r < m; r++) { const x = a[r][p], y = a[r][q]; a[r][p] = cs * x - sn * y; a[r][q] = sn * x + cs * y; }
      for (let r = 0; r < m; r++) { const x = a[p][r], y = a[q][r]; a[p][r] = cs * x - sn * y; a[q][r] = sn * x + cs * y; }
      for (let r = 0; r < m; r++) { const x = V[r][p], y = V[r][q]; V[r][p] = cs * x - sn * y; V[r][q] = sn * x + cs * y; }
    }
  }
  return a.map((_, i) => ({ val: a[i][i], vec: V.map((r) => r[i]) })).sort((x, y) => y.val - x.val);
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
    const label = !o ? "Sin respuestas con lectura izquierda-derecha" : Math.abs(o.v) < 15 ? "Equilibrio" : `${Math.abs(o.v) >= 60 ? "Muy " : ""}${o.v < 0 ? (Math.abs(o.v) >= 60 ? "progresista" : "Progresista") : (Math.abs(o.v) >= 60 ? "conservadora" : "Conservadora")} (${signed(o.v)})`;
    return `<div class="arow"><div class="an"><span class="al">${a.letter}</span><span>${esc(a.name)}</span>${st.prios.includes(a.id) ? '<span class="pri-tag">Prioridad</span>' : ""}</div>
      <div class="track" role="img" aria-label="${esc(a.name)}: ${esc(label)}">${track}</div><div class="av">${esc(label)}</div>
      <details class="more arow-more"><summary>Tus respuestas y quién coincide más contigo en este tema</summary><div data-lazy="area:${a.id}"></div></details></div>`;
  }).join("");
  $("#r-areas").innerHTML = `
    <div class="sec-head"><p class="label">Por temas</p><h2 id="areas-h2" class="h2">¿Posiciones más progresistas o más conservadoras en cada área?</h2>
    <p class="sub">Lectura simplificada: sigue cómo se suelen alinear los partidos españoles en cada tema. Las preguntas transversales, que no dividen así, no cuentan en la barra, pero sí en el detalle de cada tema, donde ves tus respuestas y qué candidaturas coinciden más contigo en él.</p></div>
    <div class="legend"><span><i class="lg-me"></i>Tú</span>${cmp ? `<span><i class="lg-dia" style="background:${P[cmp].color}"></i>${esc(pName(cmp, st.prov))}</span>` : ""}<span>← Progresista · Conservadora →</span></div>
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
  const here = MODEL.avail.includes(m.pid);
  const opener = !here ? `<b>${esc(nm)}</b> no se presenta en ${esc(pr)}; en toda España ocupa el puesto ${MODEL.all.indexOf(m) + 1} en coincidencia contigo.`
    : rank === 0 ? `<b>${esc(nm)}</b> es la candidatura de ${esc(pr)} que más coincide con tus respuestas.`
    : rank <= 2 ? `<b>${esc(nm)}</b> es la ${rank === 1 ? "segunda" : "tercera"} candidatura de ${esc(pr)} con más coincidencia.`
    : `<b>${esc(nm)}</b> ocupa el puesto ${rank + 1} de ${MODEL.prov.length} en coincidencia entre las candidaturas de ${esc(pr)}.`;
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
  if (!su) return { k: "neu", txt: "Respondiste en el punto intermedio" };
  return su === sp ? { k: "ok", txt: "Coincide con lo que respondiste" } : { k: "ko", txt: "Choca con lo que respondiste" };
}
function cmpList(items, ab, empty, pid = null) {
  const row = (i) => `<li><b>${esc(i.q.short)}</b><span>Tú: ${esc(ansBrief(i.q, i.u))} · ${esc(ab)}: <span${i.est ? ' class="est" title="Postura estimada"' : ""}>${esc(ansBrief(i.q, i.v))}${i.est ? " (estimada)" : ""}</span>${pid ? srcLink(i.q, pid) : ""}</span></li>`;
  if (!items.length) return `<ul class="cmp"><li class="empty">${empty}</li></ul>`;
  return `<ul class="cmp">${items.slice(0, 3).map(row).join("")}</ul>${items.length > 3 ? `<details class="more"><summary>Ver ${items.length - 3} más</summary><ul class="cmp" style="margin-top:8px">${items.slice(3).map(row).join("")}</ul></details>` : ""}`;
}
const propList = (items) => `<ul class="props">${items.map((x) => `<li>${ICON[x.s.k]}<div><p class="pt">${esc(x.t)}</p><p class="ps"><span class="${x.s.k === "ok" ? "st-ok" : x.s.k === "ko" ? "st-ko" : ""}">${esc(x.s.txt)}</span>${x.q ? `<span>${esc(qCode(Q[x.q]))} · ${esc(AREA[Q[x.q].area].name)}</span>` : ""}</p></div></li>`).join("")}</ul>`;
// Preguntas que inclinan la balanza entre la candidatura con más coincidencia y otra
function versusTop(m) {
  const st = ST(), top = MODEL.prov[0];
  if (!top || top.pid === m.pid) return "";
  const mine = Object.fromEntries(m.items.map((i) => [i.q.id, i]));
  const rows = top.items.filter((i) => mine[i.q.id]).map((t) => { const o = mine[t.q.id]; return { q: t.q, u: t.u, vt: t.v, vo: o.v, adv: weightOf(t.q, st) * (o.d - t.d) / 4 }; });
  const forTop = rows.filter((r) => r.adv > 0).sort((a, b) => b.adv - a.adv).slice(0, 3);
  const forThis = rows.filter((r) => r.adv < 0).sort((a, b) => a.adv - b.adv).slice(0, 3);
  if (!forTop.length && !forThis.length) return "";
  const tAb = P[top.pid].ab, oAb = P[m.pid].ab, gap = top.pct - m.pct;
  const li = (r) => `<li><b>${esc(r.q.short)}</b><span>Tú: ${esc(answerText(r.q, r.u, true))} · ${esc(tAb)}: ${esc(answerText(r.q, r.vt, true))} · ${esc(oAb)}: ${esc(answerText(r.q, r.vo, true))}</span></li>`;
  return `<details class="more"${gap <= 5 ? " open" : ""}><summary>Frente a ${esc(tAb)}, tu primera candidatura: qué os diferencia (${gap} ${gap === 1 ? "punto" : "puntos"})</summary>
    <div class="two" style="margin-top:10px">
      <div><p class="subh">Te acercan más a ${esc(tAb)}</p>${forTop.length ? `<ul class="cmp">${forTop.map(li).join("")}</ul>` : '<ul class="cmp"><li class="empty">Ninguna pregunta en particular.</li></ul>'}</div>
      <div><p class="subh">Te acercan más a ${esc(oAb)}</p>${forThis.length ? `<ul class="cmp">${forThis.map(li).join("")}</ul>` : '<ul class="cmp"><li class="empty">Ninguna pregunta en particular.</li></ul>'}</div>
    </div></details>`;
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
    <div class="phead">${logo(m.pid)}<div style="display:grid;gap:3px;min-width:0"><h3 id="ph-${m.pid}">${rank < 90 ? `<span class="rk">${rank + 1}.º</span>` : ""}${esc(nm)}</h3><span class="tag">${esc(p.tag)}</span>${p.lead ? `<span class="lead">Cabeza de cartel: ${esc(p.lead)}</span>` : ""}${p.tbd ? '<span><span class="tbd">Candidatura por confirmar</span></span>' : ""}</div>
      <div class="pc"><b>${m.pct}<small style="font-size:.45em">%</small></b><span>coincidencia</span></div></div>
    <div class="metrics">
      <div class="metric"><b>${m.close != null ? Math.round(m.close * 100) + " %" : "–"}</b><span>Cercanía ideológica</span></div>
      <div class="metric"><b>${m.n}/${MODEL.qs.length}</b><span>Preguntas comparadas</span></div>
      <div class="metric"><b>${m.n ? Math.round(m.nEst / m.n * 100) : 0} %</b><span>Posturas estimadas</span></div>
      ${m.padded ? `<div class="metric"><b>${m.raw} %</b><span>Coincidencia en sus ${m.n} preguntas con postura</span></div>` : ""}
    </div>
    ${m.padded ? `<p class="small muted">Esta candidatura solo tiene postura conocida en ${m.n} de tus ${MODEL.qs.length} respuestas. Para no exagerar, añadimos un valor neutro del 50 % hasta completar la mitad del peso de tus respuestas.</p>` : ""}
    <div><p class="why">${whyText(m, rank)}</p><p class="why" style="margin-top:8px">${esc(p.desc)}</p></div>
    <div><p class="subh">Sus propuestas · ${cnt.ok || 0} coinciden y ${cnt.ko || 0} chocan con tus respuestas</p>
      ${propList(props.slice(0, 4))}${props.length > 4 ? `<details class="more"><summary>Ver ${props.length - 4} propuestas más</summary>${propList(props.slice(4))}</details>` : ""}</div>
    <div class="two">
      <div><p class="subh" style="color:var(--ok)">En qué coincidís (${yes.length})</p>${cmpList(yes, p.ab, "Ninguna coincidencia clara.", m.pid)}</div>
      <div><p class="subh" style="color:var(--ko)">En qué discrepáis (${no.length})</p>${cmpList(no, p.ab, "No hay discrepancias fuertes.", m.pid)}</div>
    </div>
    ${versusTop(m)}
    <div class="pc-more">
      <details class="more"><summary>Cómo se calcula su ${m.pct} % y qué respuestas lo mueven</summary><div data-lazy="calc:${m.pid}"></div></details>
      <details class="more"><summary>Coincidencia por área</summary><div class="aff" style="margin-top:10px">${affRows}</div></details>
      <details class="more"><summary>Su posición en las siete dimensiones, frente a la tuya</summary><div data-lazy="pdim:${m.pid}"></div></details>
    </div>
    ${dataLine(m.pid)}
    <div class="res-actions"><button type="button" class="btn btn-ghost btn-sm" data-vs="${m.pid}">Comparar con otra candidatura</button></div>
  </article>`;
}
function renderParties() {
  const st = ST(), M = MODEL, pr = PROV[st.prov];
  const list = (UI.scope === "prov" ? M.prov : M.all).slice(0, 10);
  const rows = list.map((m, i) => {
    const p = P[m.pid], here = M.avail.includes(m.pid);
    const tie = i > 0 && list[0].pct - m.pct <= 3;
    const meta = [!here ? "No se presenta en tu provincia" : "", tie ? `Empate técnico con ${P[list[0].pid].ab}` : "", p.tbd ? "Por confirmar" : "", m.padded ? `Solo se pronuncia en ${m.n} de tus respuestas: en ellas coincidís un ${m.raw} %` : "", m.n && m.nEst / m.n > 0.5 ? `Comparada sobre todo con posturas estimadas (${Math.round(m.nEst / m.n * 100)} %)` : "", m.close != null ? `Cercanía ideológica ${Math.round(m.close * 100)} %` : ""].filter(Boolean).join(" · ");
    return `<li class="${here ? "" : "out"}${i === 0 && here ? " me-top" : ""}"><span class="rn">${i + 1}</span>${logo(m.pid, "sm")}<div class="nm"><b>${esc(here ? pName(m.pid, st.prov) : p.name)}</b><span class="bar"><i style="width:${m.pct}%"></i></span><span class="meta">${esc(meta)}</span><button type="button" class="link-btn rk-card" data-card="${m.pid}">Ver su ficha</button></div><span class="pv"><b>${m.pct} %</b><span>${m.n} comparadas</span></span></li>`;
  }).join("");
  $("#r-parties").innerHTML = `
    <div class="sec-head"><p class="label">Partidos</p><h2 id="parties-h" class="h2">Coincidencia con las candidaturas</h2>
    <dl class="concepts">
      <div><dt>Coincidencia</dt><dd>Cuánto se parecen tus respuestas a sus posturas, pregunta a pregunta. Es la cifra principal y la que ordena la lista.</dd></div>
      <div><dt>Cercanía ideológica</dt><dd>Lo cerca que estáis en el conjunto de las siete dimensiones. Un partido puede estar cerca en el conjunto y lejos en temas concretos.</dd></div>
      <div><dt>Lo que no mide</dt><dd>La intención ni la probabilidad de voto: no tiene en cuenta liderazgo, gestión, confianza en los candidatos ni voto útil.</dd></div>
    </dl></div>
    <div class="rank-tabs" role="group" aria-label="Ámbito del ranking"><button type="button" data-scope="prov" aria-pressed="${UI.scope === "prov"}">${esc(pr.name)} (${M.prov.length})</button><button type="button" data-scope="all" aria-pressed="${UI.scope === "all"}">Toda España (${M.all.length})</button></div>
    <p class="small muted">${UI.scope === "prov" ? (M.prov.length < 10 ? `En ${esc(pr.name)} se presentan ${M.prov.length} candidaturas. Cambia a «Toda España» para ver tu top 10 con partidos de otros territorios.` : `Las 10 candidaturas de ${esc(pr.name)} con más coincidencia.`) : "Las candidaturas que no se presentan en tu provincia aparecen atenuadas."}</p>
    <ol class="rank">${rows}</ol>
    <div class="sec-head" style="padding-top:20px"><h3 class="h2" style="font-size:clamp(21px,3vw,27px)">Tu top 3 en ${esc(pr.name)}, en detalle</h3><p class="sub">Por qué coincides, sus propuestas comparadas con tus respuestas y dónde chocáis.</p></div>
    <div class="pcards">${M.prov.slice(0, 3).map((m, i) => partyCard(m, i)).join("")}</div>
    <div id="pc-extra" class="pcards" style="margin-top:22px"></div>`;
  if (UI.extra) showExtraCard(UI.extra, false);
}
// Ficha detallada de una candidatura fuera del top 3 (desde el ranking)
function showExtraCard(pid, scroll = true) {
  const M = MODEL, m = M.all.find((x) => x.pid === pid), box = $("#pc-extra");
  if (!m || !box) return;
  if (M.prov.slice(0, 3).some((x) => x.pid === pid)) { UI.extra = null; box.innerHTML = ""; if (scroll) focusCard(pid); return; }
  UI.extra = pid;
  const rank = M.prov.indexOf(m);
  box.innerHTML = `<div class="extra-head"><p class="label">Ficha que has abierto</p><button type="button" class="link-btn" data-act="close-card">Cerrar ficha</button></div>${partyCard(m, rank < 0 ? 99 : rank)}`;
  if (scroll) focusCard(pid);
}
function focusCard(pid) {
  const c = $(`#card-${pid}`); if (!c) return;
  c.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" });
  const h = c.querySelector("h3"); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true });
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

// Contexto y posturas de una pregunta de «Tus respuestas»: se construye al desplegarla
function reviewPositions(q) {
  const st = ST(), avail = partiesIn(st.prov);
    const cols = [1, 2, 3, 4, 5].map((n) => {
      const ps = avail.filter((pid) => q.pos[pid] === n);
      const you = st.ans[q.id] === n;
      return `<div class="pc5${you ? " you" : ""}"><span>${n} · ${esc(q.type === "dilema" ? DIL[n - 1] : LIK[n - 1])}</span>${you ? '<span class="you-tag">Tú</span>' : ""}<span class="chips">${ps.map((pid) => `<span class="chip${q.est.includes(pid) ? " est" : ""}" title="${q.est.includes(pid) ? "Postura estimada" : "Postura documentada"}"><i class="sw" style="background:${P[pid].color}"></i>${esc(P[pid].ab)}</span>`).join("")}</span></div>`;
    }).join("");
    const unk = avail.filter((pid) => !q.pos[pid]);
    return `<div class="pos5">${cols}</div>${posNotes(q, avail)}${unk.length ? `<p class="unk">Sin postura conocida: ${unk.map((pid) => esc(P[pid].ab)).join(", ")}.</p>` : ""}<p class="unk">Las etiquetas con borde discontinuo y en cursiva son posturas estimadas.</p>`;
  }
function renderReview() {
  const st = ST(), ro = !!SHARED;
  const ids = st.order && st.order.length ? st.order : BANK.questions.filter((q) => st.ans[q.id] !== undefined).map((q) => q.id);
  const f = UI.reviewFilter;
  const keep = (id) => f === "all" || (f === "doubt" && (st.ans[id] === 0 || st.ans[id] === 3)) || (f === "imp" && st.imp[id]) || (f === "firm" && (st.ans[id] === 1 || st.ans[id] === 5));
  const groups = BANK.areas.map((a) => ({ a, ids: ids.filter((id) => Q[id].area === a.id && keep(id)) })).filter((g) => g.ids.length);
  const opt = (q, v) => [1, 2, 3, 4, 5].map((n) => `<option value="${n}"${v === n ? " selected" : ""}>${n} · ${esc(q.type === "dilema" ? DIL[n - 1] : LIK[n - 1])}</option>`).join("")
    + `<option value="0"${v === 0 ? " selected" : ""}>No lo sé</option>${v === undefined ? '<option value="" selected>Sin responder</option>' : ""}`;

  $("#r-review").innerHTML = `
    <div class="sec-head"><p class="label">Tus respuestas</p><h2 id="review-h" class="h2">Revisa y cambia lo que quieras</h2>
    <p class="sub">${ro ? "Respuestas del resultado compartido, agrupadas por área. Abre un área y despliega cada pregunta para ver la postura de cada partido." : "Abre un área para revisar tus respuestas. Si cambias una respuesta o su importancia, el resultado se recalcula al momento, y en cada pregunta puedes ver la postura de cada partido de tu provincia."}</p></div>
    <div class="review-tools"><label class="label" for="rv-filter">Mostrar</label><select id="rv-filter" data-ctl="rv" style="width:auto;min-height:42px">
      <option value="all"${f === "all" ? " selected" : ""}>Todas (${ids.length})</option>
      <option value="firm"${f === "firm" ? " selected" : ""}>Posiciones firmes</option>
      <option value="doubt"${f === "doubt" ? " selected" : ""}>Neutrales y «No lo sé»</option>
      <option value="imp"${f === "imp" ? " selected" : ""}>Marcadas como importantes</option></select></div>
    ${groups.map((g) => `<details class="rv-area"${f !== "all" ? " open" : ""}><summary class="h3"><span class="al">${g.a.letter}</span><span>${esc(g.a.name)}</span><span class="rv-n">${g.ids.length} ${g.ids.length === 1 ? "pregunta" : "preguntas"}</span></summary>
      ${g.ids.map((id) => { const q = Q[id], v = st.ans[id]; return `<div class="rv" data-q="${id}">
        <span class="q-code" style="width:fit-content">${qCode(q)}</span>
        <div class="rv-text"><b>${esc(q.text)}</b>${q.type === "dilema" ? `<p>A: ${esc(q.A)} · B: ${esc(q.B)}</p>` : ""}</div>
        <div class="rv-ctl"><label class="sr" for="rv-${id}">Tu respuesta a ${esc(q.short)}</label><select id="rv-${id}" data-ctl="ans" data-q="${id}"${ro ? " disabled" : ""}>${opt(q, v)}</select></div>
        <div class="rv-ctl"><button type="button" class="imp" data-ctl="imp" data-q="${id}" aria-pressed="${!!st.imp[id]}"${ro ? " disabled" : ""}>${ICON.starO}${ICON.starF}<span>Importante</span></button></div>
        <div class="rv-more"><details class="more"><summary>Contexto y posturas de los partidos</summary><div data-lazy="${id}"></div></details></div>
      </div>`; }).join("")}</details>`).join("") || '<p class="muted">No hay preguntas con este filtro.</p>'}`;
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
  let t = rank === 0 ? `<b>${esc(nm)}</b> es la candidatura de ${esc(PROV[st.prov].name)} más alejada de tus respuestas: coincidís un ${m.pct} % en las ${m.n} preguntas en las que tiene postura conocida.`
    : `Con <b>${esc(nm)}</b> coincides un ${m.pct} % en las ${m.n} preguntas en las que tiene postura conocida.`;
  t += x.clash.length ? ` Estáis en lados opuestos en ${x.clash.length} de ellas${x.areas.length ? `, sobre todo en ${esc(joinY(x.areas.map((a) => a.a.name.toLowerCase())))}` : ""}.` : " No llegáis a estar en lados opuestos en ninguna: la distancia viene de diferencias de grado.";
  if (x.dim) {
    const side = (v) => Math.abs(v) < 15 ? "una posición intermedia" : DIM_PHRASE[x.dim.d.id][v < 0 ? 0 : 1];
    t += Math.sign(x.dim.u) !== Math.sign(x.dim.p) && Math.abs(x.dim.u) >= 15 && Math.abs(x.dim.p) >= 15
      ? ` La mayor distancia de fondo: tú te inclinas por ${esc(side(x.dim.u))} y ${esc(ab)} por ${esc(side(x.dim.p))}.`
      : ` La mayor distancia de fondo está en ${esc(DIM_SHORT[x.dim.d.id])} (tú: ${esc(side(x.dim.u))}; ${esc(ab)}: ${esc(side(x.dim.p))}).`;
  }
  if (x.agree.length) t += ` Aun así, coincidís en ${x.agree.length} ${x.agree.length === 1 ? "cuestión" : "cuestiones"}, como «${esc([...x.agree].sort((a, b) => (Math.abs(b.u - 3) + Math.abs(b.v - 3) - b.d) - (Math.abs(a.u - 3) + Math.abs(a.v - 3) - a.d))[0].q.short)}».`;
  return t;
}
function renderLeast() {
  const st = ST(), M = MODEL, pr = PROV[st.prov];
  const head = `<div class="sec-head"><p class="label">Menor coincidencia</p><h2 id="least-h" class="h2">Los 3 partidos con los que menos coincides</h2>
    <p class="sub">Las candidaturas de ${esc(pr.name)} más alejadas de tus respuestas, con el mismo cálculo que el ranking. Quedan fuera tu top 3 y las candidaturas con muy pocas posturas conocidas, para no señalar a nadie sin datos. Como discrepancia solo cuenta estar en lados opuestos: tus respuestas neutrales y «No lo sé» nunca lo son.</p></div>`;
  const firm = M.qs.filter((q) => st.ans[q.id] !== 3).length;
  if (firm < LEAST_MIN_ANS) {
    $("#r-least").innerHTML = `${head}<ul class="cmp"><li class="empty">${firm === 0 ? "Ninguna de tus respuestas toma" : firm === 1 ? "Solo una de tus respuestas toma" : `Solo ${firm} de tus respuestas toman`} partido. No hay datos suficientes para decir con quién coincides menos: hacen falta al menos ${LEAST_MIN_ANS} respuestas de acuerdo o en desacuerdo.</li></ul>`;
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
      ? `La pregunta que más os separa, «${esc(x.key.q.short)}», no decide por sí sola este puesto: sin ella, ${esc(p.ab)} seguiría entre las tres últimas.`
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
    ${L.list.length < 3 ? `<p class="small muted">Solo ${L.list.length === 1 ? "una candidatura cumple" : `${L.list.length} candidaturas cumplen`} los requisitos para una comparación fiable.</p>` : ""}
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
    <p>Comparamos ${POLS.length} perfiles con posturas propias documentadas: ${esc(POLS.map((x) => x.name).join(", "))}. Cada postura se apoya en una propuesta, una decisión de gobierno, una votación que ha liderado o una declaración pública, y en cada ficha se indica en qué se basan las que se muestran.</p>
    <p>Solo aparece quien comparte contigo al menos ${POL_MIN} posturas claras y supera un nivel mínimo de afinidad. El cálculo es el mismo acuerdo pregunta a pregunta que con los partidos, suavizado hacia el 50 % porque cada persona tiene pocas posturas conocidas. Tus respuestas neutrales cuentan con la mitad de peso y «No lo sé» no cuenta. Cargos actualizados a 18 de octubre de 2026.</p>
    <p>Fotos: Wikimedia Commons, con licencia libre o reutilización autorizada con cita de la fuente; la autoría figura en cada ficha.</p></div></details>`;
  if (!POLS.length) { $("#r-pols").innerHTML = `${head}<ul class="cmp"><li class="empty">No se han podido cargar los perfiles de los políticos. Recarga la página para intentarlo de nuevo.</li></ul>`; return; }
  if (!top.length) {
    $("#r-pols").innerHTML = `${head}<ul class="cmp"><li class="empty">Con tus respuestas no hay suficientes coincidencias claras con las posturas personales documentadas de ningún político: necesitamos al menos ${POL_MIN} posturas claras en común y un nivel mínimo de afinidad.${st.mode !== "completa" && !SHARED ? " Una versión más larga del test incluye más preguntas sobre las que se han pronunciado." : ""}</li></ul>${method}`;
    return;
  }
  const best = (r) => [...r.agree].sort((a, b) => (Math.abs(b.u - 3) + Math.abs(b.v - 3) - b.d) - (Math.abs(a.u - 3) + Math.abs(a.v - 3) - a.d) || b.w - a.w);
  const cards = top.map((r) => {
    const x = r.x, p = P[x.party], ex = best(r).slice(0, 2), diff = [...r.clash].sort((a, b) => b.d - a.d)[0];
    const why = `Coincidís en ${r.agree.length} de las ${r.n} cuestiones en las que conocemos su postura personal y que has respondido${r.clash.length ? `, y discrepáis en ${r.clash.length}` : ""}. Pensáis parecido sobre ${esc(joinY(best(r).slice(0, 3).map((i) => `«${i.q.short}»`)))}.`
      + (x.party !== M.prov[0]?.pid ? ` Su partido no es la candidatura con la que más coincides: aquí solo cuentan sus posturas personales.` : "");
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
      ${diff ? `<div><p class="subh" style="color:var(--ko)">En qué discrepáis</p><ul class="cmp">${exRow(diff)}</ul></div>` : ""}
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
// Solo enlaces externos: no se carga ningún script de pago ni se envía nada del test. La web nunca da
// un pago por hecho: lo confirma la propia plataforma en su página y por correo.
function applePayReady() {
  try { return !!window.ApplePaySession && window.ApplePaySession.canMakePayments(); } catch { return false; }
}
function donateOptions() {
  return [
    DONATE.paypal && { href: DONATE.paypal, label: "Donar con PayPal", note: "En la web de PayPal, donde eliges la cantidad." },
    DONATE.applePay && applePayReady() && { href: DONATE.applePay, label: "Donar con Apple Pay", note: "En la página de pago segura de Stripe." },
    DONATE.bank && { href: DONATE.bank, label: "Donar mediante tu banco", note: "Con Bizum: lo confirmas en la app de tu banco, en la página segura de Stripe." }
  ].filter(Boolean);
}
function renderSupport() {
  const opts = donateOptions(), sec = $("#r-support");
  sec.hidden = !opts.length;
  sec.innerHTML = !opts.length ? "" : `
    <div class="support">
      <div class="sec-head"><h2 id="support-h" class="h2">¿Te ha resultado útil el test?</h2>
        <p class="sub">Si este proyecto te ha ayudado a comprender mejor las distintas posiciones políticas y quieres contribuir a que siga mejorando, puedes apoyarlo con una aportación voluntaria.</p>
        <p class="small muted">El test es y seguirá siendo gratuito. Aportar es opcional, no cambia ningún resultado y tus respuestas no se envían.</p></div>
      <ul class="support-opts">${opts.map((o) => `<li><a class="btn btn-primary" href="${esc(o.href)}" target="_blank" rel="noopener noreferrer">${esc(o.label)}<span class="sr"> (se abre en una pestaña nueva)</span></a><span class="small muted">${esc(o.note)}</span></li>`).join("")}</ul>
    </div>`;
}

// Notas sobre discrepancias entre programa, declaraciones y votos (data/preguntas.json → notes)
function posNotes(q, pids) {
  const n = Object.entries(q.notes || {}).filter(([pid]) => pids.includes(pid));
  const src = Object.entries(q.src || {}).filter(([pid]) => pids.includes(pid));
  return (n.length ? `<ul class="pos-notes">${n.map(([pid, t]) => `<li><b>${esc(P[pid].ab)}:</b> ${esc(t)}</li>`).join("")}</ul>` : "")
    + (src.length ? `<p class="unk">Fuentes: ${src.map(([pid, [url, label, type]]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(P[pid].ab)} · ${esc(label)}</a>${type ? ` <span class="src-t">(${esc(SRC_TYPE[type])})</span>` : ""}`).join(" · ")}.</p>` : "");
}
function bindResults() {
  const root = $("#v-results");
  root.addEventListener("toggle", (e) => {
    const box = e.target.open && e.target.querySelector(":scope > [data-lazy]:empty");
    if (!box) return;
    const [kind, id] = box.dataset.lazy.includes(":") ? box.dataset.lazy.split(":") : ["q", box.dataset.lazy];
    box.innerHTML = kind === "dim" ? dimDetail(id) : kind === "area" ? areaDetail(id) : kind === "calc" ? calcDetail(id) : kind === "pdim" ? partyDims(id)
      : `<p class="dinfo" style="margin:8px 0">${esc(Q[id].ctx)}</p>${reviewPositions(Q[id])}`;
  }, true);
  root.addEventListener("change", (e) => {
    const el = e.target, c = el.dataset.ctl; if (!c) return;
    if (c === "cmp") { UI.cmp = el.value || null; renderDims(); renderAreas(); $("#cmp-sel").focus(); }
    else if (c === "rv") { UI.reviewFilter = el.value; renderReview(); $("#rv-filter").focus(); }
    else if (c === "vsA" || c === "vsB") { UI[c] = el.value; if (UI.vsA === UI.vsB) UI[c === "vsA" ? "vsB" : "vsA"] = null; renderVersus(); $(c === "vsA" ? "#vs-a" : "#vs-b").focus(); }
    else if (c === "mapdim") { UI.mapDim = el.value; renderMap(); $("#map-dim").focus(); }
    else if (c === "ans" && !SHARED) {
      const id = el.dataset.q, v = el.value === "" ? undefined : Number(el.value);
      if (v === undefined) delete S.ans[id]; else S.ans[id] = v;
      save(); rerenderAfterEdit();
      el.closest(".rv").classList.add("changed");
      toast("Resultado recalculado");
    }
  });
  root.addEventListener("keydown", (e) => {
    const g = (e.key === "Enter" || e.key === " ") && e.target.closest?.(".map-pt, .map-me");
    if (g) { e.preventDefault(); selectMap(g.dataset.pid); }
  });
  root.addEventListener("click", (e) => {
    const mp = e.target.closest(".map-pt, .map-me"); if (mp) { selectMap(mp.dataset.pid); return; }
    const a = e.target.closest('a[href^="#r-"]');
    if (a) { e.preventDefault(); const t = $(a.getAttribute("href")); if (t) { t.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" }); const h = t.querySelector("h1, h2"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } } return; }
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.scope) { UI.scope = b.dataset.scope; renderParties(); $(`[data-scope="${UI.scope}"]`).focus(); return; }
    if (b.dataset.card) { showExtraCard(b.dataset.card); return; }
    if (b.dataset.vs) { const top = MODEL.prov[0]?.pid; if (b.dataset.vs === top) { UI.vsA = top; UI.vsB = null; } else { UI.vsA = top; UI.vsB = b.dataset.vs; } renderVersus(); const t = $("#r-versus"); t.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" }); const h = t.querySelector("h2"); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); return; }
    if (b.dataset.mapsel) { selectMap(b.dataset.mapsel); return; }
    if (b.dataset.act === "close-card") { const pid = UI.extra; UI.extra = null; $("#pc-extra").innerHTML = ""; const r = $(`#r-parties [data-card="${pid}"]`); if (r) r.focus(); return; }
    if (b.dataset.ctl === "imp" && !SHARED) {
      const id = b.dataset.q; S.imp[id] = !S.imp[id]; if (!S.imp[id]) delete S.imp[id];
      b.setAttribute("aria-pressed", String(!!S.imp[id])); save(); rerenderAfterEdit(); toast("Resultado recalculado"); return;
    }
    const act = b.dataset.act;
    if (act === "more") {
      const next = S.mode === "expres" ? "media" : "completa";
      S.mode = next; S.order = buildOrder(next, S.seed); S.fill = true;
      const first = S.order.findIndex((id) => S.ans[id] === undefined);
      S.idx = first < 0 ? S.order.length - 1 : first; S.stage = "quiz"; save();
      renderQuestion(0); go("quiz", { focus: false }); focusStatement();
    } else if (act === "new") {
      if (!confirm("¿Empezar de nuevo? Se borrarán tus respuestas guardadas en este navegador.")) return;
      const keep = { mode: S.mode }; S = null; store.del(KEY); fillSetup(keep); go("home"); $("#start-btn").focus(); }
    else if (act === "forget-friend") { store.del(FRIEND_KEY); renderFriend(); toast("Resultado compartido olvidado"); }
    else if (act === "own-test") { SHARED = null; try { history.replaceState(null, "", location.pathname + location.search); } catch { /* sin historial */ } S = loadState(); fillSetup(); go("home"); }
  });
}

// ───────────────────────────── Compartir
// Enlace con fragmento (#r2…): solo letras y números. Incluye provincia, versión, prioridades y
// respuestas (con su importancia) en el orden del banco.
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
  if (el) { el.focus(); el.select(); shareStatus("Tu navegador no deja copiar automáticamente: el texto está seleccionado, cópialo con Ctrl+C (⌘+C en Mac) o con «Copiar» del menú.", "warn"); return; }
  let box = $("#copy-fallback");
  if (!box) { box = document.createElement("div"); box.id = "copy-fallback"; box.className = "wrap"; $("#v-results").appendChild(box); }
  box.innerHTML = `<div class="sheet" style="padding:16px;display:grid;gap:8px;margin-top:20px"><label class="label" for="copy-ta">Copia este texto</label><textarea id="copy-ta" rows="4" style="width:100%;font:inherit;font-size:14px;padding:10px;border:1px solid var(--rule);border-radius:8px;background:var(--sheet-2)">${esc(text)}</textarea></div>`;
  const ta = $("#copy-ta"); ta.focus(); ta.select();
  toast("Selecciona el texto y cópialo");
}

// URL que se comparte: la de la propia web cuando se usa desde su dirección pública;
// desde la vista previa en Claude o en local, la dirección pública configurada.
const IN_FRAME = (() => { try { return window.self !== window.top; } catch { return true; } })();
// Cuenta una visita o un paso del test. Solo se envía el nombre del paso, la web de procedencia y el tamaño
// de pantalla: nunca respuestas, provincia, resultado ni el enlace compartido (#r2…).
const COUNTED = new Set();
function count(path, title, event = false) {
  const code = STATS.goatcounter;
  if (!code || IN_FRAME || navigator.webdriver || location.hostname !== new URL(PUBLIC_URL).hostname || COUNTED.has(path)) return;
  COUNTED.add(path);
  try {
    const q = new URLSearchParams({ p: path, t: title, s: `${screen.width},${screen.height},${devicePixelRatio || 1}`, rnd: Math.random().toString(36).slice(2, 8) });
    if (event) q.set("e", "true");
    else if (document.referrer && !document.referrer.startsWith(location.origin)) q.set("r", document.referrer.split(/[?#]/)[0]);
    const img = new Image(); img.referrerPolicy = "origin"; img.src = `https://${code}.goatcounter.com/count?${q}`;
  } catch { /* el contador nunca debe afectar al test */ }
}
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
  const lines = ["He hecho el Test 29N, un test político para las elecciones generales del 29N."];
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
    <div class="sec-head"><p class="label">Compartir</p><h2 id="share-h" class="h2">Comparte tu resultado</h2>
    <p class="sub">Compartir es opcional. Nada sale de tu navegador hasta que pulsas un botón. El texto y la imagen no incluyen tus respuestas; solo las lleva el enlace a tu resultado completo, más abajo.</p></div>
    <div class="share-grid">
      <figure class="card-prev">
        <div class="fmt-tabs" role="radiogroup" aria-label="Formato de la imagen">
          ${Object.entries(FMT).map(([k, f]) => `<label><input type="radio" name="sh-fmt" value="${k}"${SH.fmt === k ? " checked" : ""}><span><b>${f.label}</b><small>${f.hint}</small></span></label>`).join("")}
        </div>
        <div class="card-frame" data-fmt="${SH.fmt}"><img id="sh-img" alt="Vista previa de tu tarjeta de resultado" hidden><p class="card-loading" id="sh-loading">Generando la imagen…</p></div>
        <figcaption class="small muted">La imagen se crea en tu dispositivo con tu resultado. Puedes descargarla o, en el móvil, mantenerla pulsada para guardarla.</figcaption>
      </figure>
      <div class="share-panel">
        <label class="check"><input type="checkbox" id="sh-party"${SH.party ? " checked" : ""}><span>Incluir la candidatura con la que más coincido</span></label>
        <div class="field"><label class="label" for="sh-text">Tu mensaje · puedes editarlo</label><textarea id="sh-text" rows="7" spellcheck="true">${esc(SH.text)}</textarea>
          <p class="small muted" id="sh-count"></p></div>
        <div class="share-btns">
          <a class="sbtn sbtn-x" id="sh-x" href="${xHref(SH.text)}" target="_blank" rel="noopener noreferrer">${SVG.x}<span><b>Publicar en X</b><small>Se abre X con el texto listo</small></span></a>
          <a class="sbtn sbtn-wa" id="sh-wa" href="${waHref(SH.text)}" target="_blank" rel="noopener noreferrer">${SVG.wa}<span><b>Enviar por WhatsApp</b><small>Eliges tú el chat o grupo</small></span></a>
          <button type="button" class="sbtn sbtn-ig" id="sh-ig">${SVG.ig}<span><b>Imagen para Instagram</b><small>Historia vertical para subir tú</small></span></button>
          <button type="button" class="sbtn sbtn-copy" id="sh-copy">${SVG.copy}<span><b>Copiar mensaje</b><small>Al portapapeles</small></span></button>
        </div>
        <p class="share-help">X y WhatsApp se abren con el mensaje preparado para que lo revises: nada se publica ni se envía sin que lo confirmes. Instagram no permite publicar desde una web, así que preparamos la imagen vertical y, si tu móvil lo permite, abrimos el menú de compartir para que elijas Instagram; si no, se descarga para que la subas a tu historia.</p>
        <p class="sh-status" id="sh-status" role="status" aria-live="polite"></p>
        <div class="share-more">
          <button type="button" class="btn btn-ghost btn-sm" id="sh-dl">${SVG.dl}Descargar imagen PNG</button>
          <button type="button" class="btn btn-ghost btn-sm" id="sh-invite">${SVG.link}Invitar sin compartir mi resultado</button>
        </div>
        <details class="more"><summary>Enlace a mi resultado completo, para compararos</summary>
          <p class="dinfo" style="margin:8px 0">Este enlace permite a quien lo abra ver tu resultado completo, <b>incluidas tus respuestas a cada pregunta</b> y las que marcaste como importantes, tu provincia y tus prioridades. Todo va codificado en el propio enlace: no se guarda en ningún servidor. Compártelo solo si quieres que se vean tus respuestas. Si quien lo abre ha hecho el test, verá cuánto coincidís y en qué chocáis.</p>
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
      shareStatus(SH.party ? "Mensaje e imagen incluyen la candidatura con la que más coincides." : "Mensaje e imagen ya no incluyen ningún partido.");
    }
  });
  root.addEventListener("click", (e) => {
    const el = e.target.closest("#sh-x, #sh-wa, #sh-ig, #sh-copy, #sh-dl, #sh-invite, #sh-full"); if (!el) return;
    if (el.id === "sh-x") shareStatus("Se ha abierto X en otra pestaña con tu mensaje. Revísalo y publícalo si quieres.", "ok");
    else if (el.id === "sh-wa") shareStatus("Se ha abierto WhatsApp con tu mensaje. Elige el chat o grupo y envíalo.", "ok");
    else if (el.id === "sh-ig") shareInstagram();
    else if (el.id === "sh-copy") copyText(SH.text, "Mensaje copiado", $("#sh-text")).then((ok) => ok && shareStatus("Mensaje copiado. Pégalo donde quieras.", "ok"));
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
  const cover = PIDS.map((pid) => { const x = partyData(pid);
    return `<tr><td><span class="sw" style="background:${P[pid].color}"></span> ${esc(P[pid].name)}${P[pid].tbd ? ' <span class="tbd">Por confirmar</span>' : ""}</td><td class="num">${x.doc}</td><td class="num">${x.est}</td><td class="num">${x.unk}</td><td class="num">${x.src}</td><td><span class="cov" style="width:${x.doc * 1.1}px"></span><span class="cov e" style="width:${x.est * 1.1}px;margin-left:2px"></span></td></tr>`; }).join("");
  const srcAll = qs.flatMap((q) => Object.values(q.src || {}));
  const srcBy = Object.keys(SRC_TYPE).map((t) => [t, srcAll.filter((x) => x[2] === t).length]).filter(([, n]) => n);
  const areaCov = BANK.areas.map((a) => { const l = qs.filter((q) => q.area === a.id), ds = [...new Set(l.filter((q) => q.dim).map((q) => DIM_SHORT[q.dim]))];
    return `<tr><td>${a.letter} · ${esc(a.name)}</td><td class="num">${l.length}</td><td class="num">${l.filter((q) => !q.dim).length}</td><td>${esc(ds.join(", ")) || "—"}</td></tr>`; }).join("");
  const pendingTbd = PD.parties.filter((p) => p.tbd && !p.out).map((p) => p.name), outP = PD.parties.filter((p) => p.out).map((p) => p.name);
  const lik = qs.filter((q) => q.type === "likert");
  $("#v-method").innerHTML = `
    <div class="wrap method">
      <p class="label">Metodología</p>
      <h1 id="method-h" class="h1">Cómo funciona el Test 29N</h1>
      <p class="lede">Qué medimos, de dónde salen las posturas de los partidos, cómo se calcula tu resultado y qué límites tiene. Las cifras y tablas de esta página se calculan en directo a partir de los mismos datos que usa el test.</p>
      <div class="mgrid">
        <nav class="toc" aria-label="Índice"><a href="#m-que">Qué mide</a><a href="#m-preg">Las preguntas</a><a href="#m-pos">Posturas de los partidos</a><a href="#m-datos">Estado de los datos</a><a href="#m-calc">El cálculo</a><a href="#m-expl">Las explicaciones</a><a href="#m-sol">Solidez y límites</a><a href="#m-glos">Glosario</a><a href="#m-priv">Privacidad y aviso legal</a></nav>
        <div class="mbody">
          <section class="msec" id="m-que"><h2 class="h2">Qué mide</h2>
            <p>El test no te asigna una etiqueta. Mide tu posición en <b>siete dimensiones</b> distintas y la compara, pregunta a pregunta, con las posturas de las candidaturas que se presentan en tu provincia.</p>
            <ul class="dots">${BANK.dims.map((d) => `<li><b>${esc(d.name)}</b> (${esc(d.a)} ↔ ${esc(d.b)}): ${esc(d.desc)}</li>`).join("")}</ul>
            <p>Las ${qs.length} preguntas se reparten en ${BANK.areas.length} áreas temáticas. Algunas no miden ninguna dimensión porque no dividen a la gente de forma ideológica clara (por ejemplo, la ley electoral o las Cercanías frente a la alta velocidad): solo sirven para comparar con los partidos.</p>
          </section>
          <section class="msec" id="m-preg"><h2 class="h2">Las preguntas</h2>
            <ul class="dots">
              <li><b>Una idea por pregunta.</b> Evitamos afirmaciones dobles («X e Y») y cuantificadores ambiguos.</li>
              <li><b>Dilemas</b> cuando la cuestión es elegir entre dos objetivos con costes, como bajar impuestos o mantener servicios.</li>
              <li><b>Contexto neutral</b> en cada pregunta, de unas 55 a 85 palabras: hechos verificables, conceptos y los argumentos principales de ambos lados.</li>
              <li><b>Formulación equilibrada</b>: en cada dimensión, una parte de las afirmaciones apunta a un polo y otra al contrario, para que estar «de acuerdo con todo» no sesgue el resultado.</li>
              <li><b>«No lo sé»</b> es distinto de «Ni de acuerdo ni en desacuerdo»: el primero no cuenta en el cálculo; el segundo cuenta como posición intermedia, pero con la mitad de peso, porque puede reflejar equilibrio, ambivalencia o poco interés por el tema.</li>
            </ul>
            <div class="tbl-wrap" tabindex="0" role="region" aria-label="Equilibrio de formulación por dimensión"><table class="tbl"><caption class="sr">Equilibrio de formulación por dimensión</caption><thead><tr><th>Dimensión</th><th class="num">Preguntas</th><th class="num">Acuerdo → polo A</th><th class="num">Acuerdo → polo B</th><th class="num">Dilemas</th><th>Polos</th></tr></thead><tbody>${balance}</tbody></table></div>
            <p><b>Cobertura temática.</b> Las ${qs.length} preguntas cubren economía y fiscalidad, empleo, pensiones, vivienda, sanidad, educación, inmigración, seguridad y justicia, derechos civiles, igualdad, medioambiente y energía, mundo rural, modelo territorial, lenguas, instituciones, Unión Europea, defensa y política exterior, y regulación de las redes sociales.</p>
            <div class="tbl-wrap" tabindex="0" role="region" aria-label="Cobertura por área temática"><table class="tbl"><caption class="sr">Cobertura por área temática</caption><thead><tr><th>Área</th><th class="num">Preguntas</th><th class="num">Transversales</th><th>Dimensiones que mide</th></tr></thead><tbody>${areaCov}</tbody></table></div>
            <p>Hay temas con poca presencia: la inteligencia artificial y la economía digital (solo dos preguntas, sobre redes sociales), la cultura y el patrimonio, o las pensiones (un dilema). No añadimos preguntas nuevas mientras no podamos asignar posturas documentadas a la mayoría de las candidaturas: una pregunta con casi todas las posturas estimadas alargaría el test sin mejorar el resultado. Tampoco creamos una dimensión de «calidad democrática»: sus preguntas no dividen a los partidos en un solo eje (por ejemplo, la reforma electoral beneficia a unos u otros según su tamaño, no según su ideología), así que cuentan pregunta a pregunta, pero no en el perfil.</p>
            <p>En la lectura clásica izquierda-derecha, ${lik.filter((q) => q.lr < 0).length} afirmaciones apuntan a la izquierda, ${lik.filter((q) => q.lr > 0).length} a la derecha y ${lik.filter((q) => !q.lr).length} son transversales.</p>
            <p><b>Versiones y selección.</b> Cada área tiene una pregunta núcleo, varias importantes y otras complementarias. La versión exprés usa la núcleo y una importante por área; la media, la núcleo, dos importantes y una complementaria; la completa, todas. Las preguntas que completan cada área se eligen con una semilla aleatoria, compensando el sesgo izquierda-derecha de las ya elegidas, así que dos personas pueden recibir cuestionarios algo distintos pero siempre equilibrados y con todas las áreas.</p>
          </section>
          <section class="msec" id="m-pos"><h2 class="h2">Posturas de los partidos</h2>
            <p>Para cada pregunta asignamos a cada candidatura una postura de 1 a 5 a partir de sus <b>programas electorales de 2023</b>, sus <b>votaciones en el Congreso</b> y sus <b>declaraciones públicas</b> hasta el 17 de octubre de 2026. Los programas para el 29N aún no se han publicado completos. Cuando un partido vota o gobierna en sentido distinto a lo que propone, usamos lo que ha hecho más recientemente y lo explicamos con una nota junto a su postura. Revisamos con fuentes las posturas de los principales partidos estatales en octubre de 2026: ${BANK.questions.reduce((n, q) => n + Object.keys(q.src || {}).length, 0)} de ellas enlazan ya su fuente junto a la pregunta, y el resto se basa en los programas y declaraciones citados, todavía sin enlace individual.</p>
            <ul class="dots">
              <li><b>Documentada</b>: hay programa, voto o declaración explícita. Pesa 1.</li>
              <li><b>Estimada</b>: se deduce de la línea general del partido o de su posición en temas cercanos. Pesa 0,6 y se marca siempre como estimada.</li>
              <li><b>Sin postura conocida</b>: no se inventa. Esa pregunta no cuenta para ese partido.</li>
            </ul>
            <p>Las coaliciones nuevas (Frente Amplio, Democracia 21, Unidad del Pueblo Canario…) heredan las posturas de sus integrantes, por lo que tienen más posturas estimadas. Puedes revisar todas en <button type="button" class="link-btn" data-go="explorer" style="padding:0">Posturas de los partidos</button>.</p>
            <p>El estado de los datos de cada candidatura está en <a href="#m-datos">Estado de los datos</a>.</p>
          </section>
          <section class="msec" id="m-datos"><h2 class="h2">Estado de los datos</h2>
            <p>Datos actualizados el ${esc(fmtDate(BANK.updated))}. Cada postura se clasifica según la evidencia en la que se apoya:</p>
            <ul class="dots">
              <li><b>Documentada con fuente enlazada</b>: puedes abrir la fuente desde la propia pregunta. Indicamos de qué tipo es: ${esc(Object.values(SRC_TYPE).join(", "))}, con su fecha.</li>
              <li><b>Documentada</b>: basada en el programa de 2023, votaciones o declaraciones públicas, todavía sin enlace individual.</li>
              <li><b>Estimada</b>: una interpretación nuestra a partir de la línea general del partido o de temas cercanos. Siempre se marca y pesa menos.</li>
              <li><b>Sin postura conocida</b>: no se rellena ni se toma como neutral; esa pregunta no cuenta para ese partido.</li>
            </ul>
            <p>Hoy hay ${srcAll.length} posturas con fuente enlazada${srcBy.length ? ` (${esc(srcBy.map(([t, n]) => `${n} de ${SRC_TYPE[t]}`).join(", "))})` : ""}. Es una parte pequeña del total: ampliarla es la prioridad de mantenimiento del proyecto, empezando por las preguntas núcleo y los partidos con más apoyo.</p>
            ${pendingTbd.length || outP.length ? `<p><b>Pendiente de verificar.</b> ${pendingTbd.length ? `Candidaturas aún sin confirmar con las listas proclamadas por la Junta Electoral: ${esc(joinY(pendingTbd))}. ` : ""}${outP.length ? `Han anunciado que no se presentan, y por eso no se comparan: ${esc(joinY(outP))}.` : ""} Los programas para el 29N aún no se han publicado completos: cuando salgan, revisaremos las posturas.</p>` : ""}
            <div class="tbl-wrap" tabindex="0" role="region" aria-label="Estado de los datos por candidatura"><table class="tbl"><caption class="sr">Estado de los datos por candidatura</caption><thead><tr><th>Candidatura</th><th class="num">Documentadas</th><th class="num">Estimadas</th><th class="num">Sin postura</th><th class="num">Con fuente</th><th>Cobertura</th></tr></thead><tbody>${cover}</tbody></table></div>
          </section>
          <section class="msec" id="m-calc"><h2 class="h2">El cálculo</h2>
            <p><b>Coincidencia con un partido.</b> Para cada pregunta que has respondido y en la que el partido tiene postura:</p>
            <p class="formula">acuerdo = 1 − |tu respuesta − su postura| ÷ 4</p>
            <p>Responder lo mismo vale 100 %; estar en extremos opuestos (1 frente a 5), 0 %. La coincidencia es la media ponderada de esos acuerdos. Pesos: pregunta marcada como importante ×${W_IMPORTANT}; área prioritaria ×${String(W_PRIORITY).replace(".", ",")}; respuesta neutral ×${String(W_NEUTRAL).replace(".", ",")}; postura estimada ×${String(W_ESTIMATED).replace(".", ",")}. Algunas preguntas miden casi la misma opinión (por ejemplo, limitar el alquiler y elegir entre construir o regular precios): si respondes varias de una misma familia, en conjunto pesan como la raíz cuadrada de cuántas sean (dos pesan como 1,4 en lugar de 2), para no contar dos veces lo mismo. Si un partido tiene postura en menos de la mitad (en peso) de tus respuestas, añadimos el peso que falta con un valor neutro del 50 %, para que un partido con pocas posturas conocidas no aparezca artificialmente arriba o abajo.</p>
            <p><b>Tu posición en cada dimensión.</b> Cada respuesta se convierte en un valor de −100 a +100 (1 → −100, 3 → 0, 5 → +100) con el signo de la dirección de la pregunta, y se promedia. Las respuestas neutrales pesan la mitad; la importancia y las prioridades no cambian tu posición. La de cada partido se calcula igual con todas sus posturas del banco, ponderando las estimadas.</p>
            <p><b>Cercanía ideológica.</b> 100 % menos la distancia media entre tu posición y la del partido en las dimensiones que has respondido. Complementa a la coincidencia, que compara pregunta a pregunta.</p>
            <p><b>El mapa.</b> Resume las ${BANK.dims.length} dimensiones en dos ejes con un análisis de componentes principales hecho sobre las posturas de los ${MAPM.fit} partidos que tienen datos en todas ellas. Todas las dimensiones usan la misma escala y cuentan lo mismo, tengan más o menos preguntas. Los ejes son las dos combinaciones que más diferencian a los partidos (juntas recogen el ${Math.round((MAPM.ratio[0] + MAPM.ratio[1]) * 100)} % de sus diferencias), no una escala de izquierda y derecha. Cada punto se sitúa con las dimensiones de las que hay datos; si faltan las que más pesan en un eje, no se dibuja, en lugar de suponer una posición neutral. Los ejes son fijos: no cambian según quién haga el test.</p>
            <p><b>Lectura por temas.</b> Usa la dirección izquierda-derecha habitual de cada pregunta en la política española, sin las preguntas transversales. Es una simplificación y se presenta como tal.</p>
            <p><b>Partidos con los que menos coincides.</b> Son las tres candidaturas de tu provincia con menor coincidencia, con el mismo cálculo, dejando fuera tu top 3 y las candidaturas con pocas posturas conocidas. Solo cuenta como discrepancia estar en lados opuestos de una pregunta: tus respuestas neutrales y «No lo sé» nunca lo son. Comprobamos además si el resultado depende de una sola pregunta quitando la que más os separa, y te avisamos si es así. Si menos de ${LEAST_MIN_ANS} de tus respuestas toman partido, no hacemos esta comparación.</p>
            <p><b>Políticos con los que más coincides.</b> Comparamos tus respuestas con ${POLS.length} perfiles de políticos con posturas propias documentadas (propuestas, decisiones de gobierno, votaciones que han liderado o declaraciones), sin atribuirles por defecto las de su partido. Cada persona tiene pocas posturas conocidas, así que el acuerdo se suaviza hacia el 50 %, se exigen al menos ${POL_MIN} posturas claras en común y se muestra un nivel orientativo en lugar de un porcentaje. Las fotos proceden de Wikimedia Commons, con licencia libre o reutilización autorizada con cita de la fuente; la autoría figura en cada ficha.</p>
          </section>
          <section class="msec" id="m-expl"><h2 class="h2">Las explicaciones de tu resultado</h2>
            <p>Todas se calculan con tus respuestas y los mismos datos que el resto del test. No usamos textos predefinidos por perfil.</p>
            <ul class="dots">
              <li><b>Qué respuestas te sitúan en cada dimensión.</b> Tu posición es una media; cada respuesta «aporta» lo que suma o resta a esa media (su valor de −100 a +100 por su peso, dividido por el peso total). La suma de las aportaciones es tu posición.</li>
              <li><b>Tu posición tema a tema.</b> La misma media, solo con las preguntas de cada área que miden esa dimensión. Sirve para ver, por ejemplo, si defiendes más Estado en vivienda pero no en educación.</li>
              <li><b>Moderada o mixta.</b> Una posición entre −25 y +25 es «mixta» si tus respuestas empujan con fuerza hacia los dos polos (al menos 20 puntos de aportaciones en cada sentido) y «moderada» si no.</li>
              <li><b>Combinaciones poco habituales.</b> Calculamos cómo se relacionan las dimensiones entre los partidos que tienen datos en todas. Si dos van muy juntas (correlación de 0,6 o más) y tú las combinas al revés con posiciones claras (más de 25 puntos en ambas), lo señalamos y decimos qué candidaturas combinan como tú.</li>
              <li><b>Opiniones sin candidatura.</b> Preguntas en las que tomas partido y ninguna candidatura de tu provincia con postura conocida (al menos dos) está de tu lado.</li>
              <li><b>Qué respuestas mueven la coincidencia con un partido.</b> Recalculamos su coincidencia quitando cada respuesta, una a una, y mostramos las que más la suben o la bajan.</li>
              <li><b>Comparar dos candidaturas</b> usa solo sus posturas (incluidas las estimadas, marcadas como tales) y tus respuestas: no cambia tu resultado.</li>
            </ul>
          </section>
          <section class="msec" id="m-sol"><h2 class="h2">Solidez y límites</h2>
            <p>La investigación sobre estas herramientas, conocidas como «aplicaciones de ayuda al voto», muestra que el resultado puede cambiar según el método de cálculo, que las respuestas neutrales tienden a acercar a todos los partidos y que estimar las posturas de los partidos es la parte más delicada. Por eso:</p>
            <ul class="dots">
              <li>Comprobamos la candidatura con la que más coincides con un <b>método alternativo</b> que solo cuenta si estás del mismo lado que el partido, y te avisamos si cambia.</li>
              <li>Avisamos de los <b>empates técnicos</b> (menos de 4 puntos), de las respuestas mayoritariamente neutrales, de las comparaciones apoyadas en posturas estimadas y de los casos en que alguien está de acuerdo (o en desacuerdo) con casi todo, incluso con afirmaciones de sentido contrario.</li>
              <li>Hemos comprobado el cálculo con miles de perfiles simulados: quien responde exactamente como un partido lo obtiene primero, y ninguna pregunta por sí sola cambia el primer puesto de un perfil completo. Conocemos también su sesgo: con respuestas al azar o casi todas neutrales, salen arriba los partidos con más posturas intermedias. Por eso las respuestas casi todas neutrales se marcan con solidez baja, y las respuestas al azar suelen dar empates o avisos.</li>
              <li>Publicamos todas las posturas para que puedas contrastarlas.</li>
            </ul>
            <p>Límites: los partidos pueden cambiar de posición, actuar de forma distinta a lo que proponen o no pronunciarse; las candidaturas locales tienen pocas posturas conocidas; y un test no recoge la confianza en los líderes, la gestión o el voto útil. La coincidencia mide cuánto se parecen tus respuestas a las posturas de cada partido; no es una probabilidad de voto ni el porcentaje de ideología que compartís. No disponemos de datos de validación con encuestas reales, así que no atribuimos al test una precisión concreta. <b>No es una recomendación de voto ni un diagnóstico científico.</b></p>
          </section>
          <section class="msec" id="m-glos"><h2 class="h2">Glosario</h2>
            <dl class="glossary">
              <dt>Coincidencia</dt><dd>Cuánto se parecen tus respuestas a las posturas de un partido, pregunta a pregunta, de 0 a 100 %. No es una probabilidad de voto.</dd>
              <dt>Cercanía ideológica</dt><dd>Lo cerca que estáis en el conjunto de las siete dimensiones, de 0 a 100 %.</dd>
              <dt>Dimensión</dt><dd>Un eje de opinión con dos polos, como «más Estado» frente a «más mercado». Tu posición va de −100 (primer polo) a +100 (segundo).</dd>
              <dt>Postura documentada o estimada</dt><dd>Documentada: hay programa, voto o declaración. Estimada: se deduce de su línea general; pesa menos y siempre se marca.</dd>
              <dt>Pregunta transversal</dt><dd>La que no divide a la gente de forma ideológica clara. Cuenta para comparar con los partidos, no para tu perfil.</dd>
              <dt>Familia de preguntas</dt><dd>Preguntas que miden casi la misma opinión. Si respondes varias, pesan juntas menos que por separado.</dd>
              <dt>Relleno neutro</dt><dd>Cuando un partido tiene postura en menos de la mitad (en peso) de tus respuestas, se completa con un 50 % para no exagerar su coincidencia.</dd>
              <dt>Empate técnico</dt><dd>Dos candidaturas a 3 puntos o menos: la diferencia es demasiado pequeña para ordenarlas con seguridad.</dd>
              <dt>Solidez</dt><dd>Cuánto fiarte del resultado según el número de respuestas, las neutrales, los empates y un segundo método de cálculo.</dd>
              <dt>Componentes principales</dt><dd>Técnica estadística que resume muchas dimensiones en pocas, conservando la mayor parte de las diferencias. El mapa usa las dos primeras.</dd>
            </dl>
          </section>
          <section class="msec" id="m-priv"><h2 class="h2">Privacidad y aviso legal</h2>
            <p>No hay registro ni servidor de respuestas: tu provincia y tus respuestas se guardan solo en el almacenamiento local de tu navegador, y puedes borrarlas con «Repetir el test» en tus resultados o borrando los datos del sitio en tu navegador. El test no pide sexo, edad ni ningún otro dato personal. El enlace para compartir lleva en el propio enlace tus respuestas, provincia y prioridades. Si abres un resultado que te comparten, se guarda en tu navegador para que puedas compararte con esa persona después de hacer tu test; puedes olvidarlo desde tus resultados.</p>
            ${STATS.goatcounter ? `<p><b>Sin cookies ni publicidad.</b> La web no usa cookies. Para saber cuánta gente usa el test contamos las visitas con GoatCounter, un servicio sin cookies que no guarda datos personales: registra solo qué paso se visita (inicio, test empezado, test terminado, clic en donar), la web desde la que llegas, el tamaño de pantalla y datos técnicos del navegador. Nunca se le envían tus respuestas, tu provincia ni tu resultado. Está alojada en GitHub Pages (GitHub, Inc.), que puede registrar datos técnicos de conexión, como la dirección IP, por motivos de seguridad. Las tipografías se sirven desde la propia web. Ni GitHub ni GoatCounter reciben tus respuestas.</p>`
              : `<p><b>Sin cookies, analítica ni publicidad.</b> La web no usa cookies ni herramientas de medición de audiencia. Está alojada en GitHub Pages (GitHub, Inc.), que puede registrar datos técnicos de conexión, como la dirección IP, por motivos de seguridad. Las tipografías se sirven desde la propia web: no se hace ninguna petición a terceros mientras usas el test. GitHub no recibe tus respuestas.</p>`}
            <p><b>Aportaciones voluntarias.</b> El test es gratuito y lo seguirá siendo. Los botones de aportación solo abren, en una pestaña nueva, la página de pago de ${esc([DONATE.paypal && "PayPal", (DONATE.applePay || DONATE.bank) && `Stripe (${[DONATE.applePay && "Apple Pay", DONATE.bank && "Bizum"].filter(Boolean).join(" y ")})`].filter(Boolean).join(" o ") || "la plataforma de pago")}: no les enviamos tus respuestas ni tu resultado. Esta web no recibe ni guarda datos de pago; si decides aportar, la plataforma trata tus datos según su propia política de privacidad, y es ella la que confirma el pago. Aportar o no hacerlo no cambia ningún resultado, coincidencia ni postura.</p>
            <p><b>Independencia.</b> El test no tiene vínculo con ningún partido, candidatura ni institución, y no acepta aportaciones a cambio de modificar preguntas, posturas o resultados.</p>
            ${OWNER.name || OWNER.email ? `<p>${[OWNER.name && `<b>Responsable</b>: ${esc(OWNER.name)}`, OWNER.email && `<b>Contacto</b>: <a href="mailto:${esc(OWNER.email)}">${esc(OWNER.email)}</a>`].filter(Boolean).join(" · ")}.</p>` : ""}
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
  $("#ex-party").value = EX.party;
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
    const focus = EX.party ? (q.pos[EX.party] ? `<p class="focus-line"><b>${esc(P[EX.party].name)}:</b> ${esc(answerText(q, q.pos[EX.party]))}${q.est.includes(EX.party) ? " (estimada)" : " (documentada)"}${srcLink(q, EX.party)}</p>` : `<p class="focus-line"><b>${esc(P[EX.party].name)}:</b> sin postura conocida</p>`) : "";
    const d = q.dim ? `${DIM[q.dim].name}: de acuerdo → ${q.dir > 0 ? DIM[q.dim].b : DIM[q.dim].a}` : "Transversal: no mide ninguna dimensión";
    return `<article class="exq"><p class="q-meta"><span class="q-code">${qCode(q)}</span><span>${esc(AREA[q.area].name)}</span><span class="tagd">${esc(d)}</span></p>
      <h3>${esc(q.text)}</h3>${q.type === "dilema" ? `<p class="small">A: ${esc(q.A)} · B: ${esc(q.B)}</p>` : ""}${focus}
      <details class="more"><summary>Contexto</summary><p class="dinfo" style="margin-top:6px">${esc(q.ctx)}${q.ley ? ` <b>Marco legal:</b> ${esc(q.ley)}.` : ""}</p></details>
      <div class="pos5">${cols}</div>${posNotes(q, PIDS)}${unk.length ? `<p class="unk">Sin postura conocida: ${unk.map((pid) => esc(P[pid].ab)).join(", ")}.</p>` : ""}</article>`;
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
    const don = e.target.closest("#r-support a.btn");
    if (don) count(`donar-${/paypal/.test(don.href) ? "paypal" : don.textContent.includes("Apple") ? "apple-pay" : "banco"}`, "Clic en donar", true);
    const g = e.target.closest("[data-go]");
    if (g) {
      const v = g.dataset.go;
      if (CURRENT === "quiz" && S) save();
      if (v === "home") { fillSetup(); go("home"); }
      else if (v === "method") { renderMethod(); go("method", { focus: !g.dataset.anchor }); const t = g.dataset.anchor && $(`#${g.dataset.anchor}`); if (t) { t.scrollIntoView(); const h = t.querySelector("h2"); h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
      else if (v === "explorer") { if (g.dataset.party) EX.party = g.dataset.party; renderExplorer(); go("explorer"); }
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

// «Atrás» y «Adelante»: se vuelve a pintar la pantalla con el estado actual, sin añadir otra entrada
function restoreView(v) {
  if (v === "results" && (SHARED || (S && answered(S).length && PROV[S.prov]))) { MODEL = computeModel(ST()); if (!MODEL.prov.some((m) => m.pid === UI.cmp)) UI.cmp = MODEL.prov[0]?.pid || null; renderResults(); go("results", { push: false }); return; }
  if (v === "quiz" && S && S.order) { renderQuestion(0); go("quiz", { push: false, focus: false }); focusStatement(); return; }
  if (v === "prios" && S && S.order) { renderPrios(); go("prios", { push: false }); return; }
  if (v === "method") { renderMethod(); go("method", { push: false }); return; }
  if (v === "explorer") { renderExplorer(); go("explorer", { push: false }); return; }
  if (CURRENT === "quiz" && S) save();
  fillSetup(); go("home", { push: false });
}

async function boot() {
  bindGlobal(); bindQuiz(); bindPrios(); bindResults(); bindShare(); bindTips();
  try { history.scrollRestoration = "manual"; } catch { /* idem */ }
  window.addEventListener("popstate", (e) => { if (BANK && e.state?.view) restoreView(e.state.view); });
  // Un enlace compartido abierto con la web ya cargada (solo cambia el fragmento #r2…)
  window.addEventListener("hashchange", () => { const sh = BANK && decodeShare(location.hash); if (sh) { SHARED = sh; store.set(FRIEND_KEY, location.hash); openResults(); } });
  try { await loadData(); }
  catch (e) { console.error(e); go("error"); return; }
  S = loadState();
  initHome();
  const shared = decodeShare(location.hash);
  count(shared ? "/compartido" : "/", shared ? "Resultado compartido" : "Inicio");
  if (shared) { SHARED = shared; store.set(FRIEND_KEY, location.hash); openResults(); return; }
  if (S && S.stage === "done" && answered(S).length) { openResults(); return; }
  go("home", { focus: false });
}
boot();
})();
