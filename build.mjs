// Valida las fuentes y genera los datos publicados en data/.
// Uso: node build.mjs   (sale con código 1 si encuentra errores)
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { DIMS, AREAS, QUESTIONS, FAMILIES, NOTES, SOURCES, JUSTIF } from "./src/preguntas.src.mjs";
import { PARTY_ORDER, PARTIES, REGIONS } from "./src/partidos.src.mjs";
import { POLITICIANS } from "./src/politicos.src.mjs";

const VERSION = "2.0.0";
const UPDATED = "2026-10-18";
const SRC_TYPES = ["programa", "parlamento", "gobierno", "declaracion", "prensa"];
const errors = [];
const warns = [];
const err = (m) => errors.push(m);
const warn = (m) => warns.push(m);

const dimIds = new Set(DIMS.map((d) => d.id));
const areaIds = new Set(AREAS.map((a) => a.id));
const regionIds = new Set(REGIONS.map((r) => r[0]));
const provIds = new Set(REGIONS.flatMap((r) => r[2].map((p) => p[0])));
const seen = new Set();

const questions = QUESTIONS.map((q) => {
  if (seen.has(q.id)) err(`${q.id}: código duplicado`);
  seen.add(q.id);
  if (!areaIds.has(q.area)) err(`${q.id}: área desconocida ${q.area}`);
  if (![1, 2, 3].includes(q.prio)) err(`${q.id}: prio inválida`);
  if (!["likert", "dilema"].includes(q.type)) err(`${q.id}: tipo inválido`);
  if (q.type === "dilema" && (!q.A || !q.B)) err(`${q.id}: dilema sin opciones A/B`);
  if (q.dim !== null && !dimIds.has(q.dim)) err(`${q.id}: dimensión desconocida ${q.dim}`);
  if (q.dim && ![1, -1].includes(q.dir)) err(`${q.id}: dir debe ser ±1 si hay dimensión`);
  if (![1, 0, -1].includes(q.lr)) err(`${q.id}: lr inválido`);
  const words = q.ctx.trim().split(/\s+/).length;
  if (words < 40 || words > 85) err(`${q.id}: el contexto tiene ${words} palabras (40-85)`);
  if (q.short.length > 60) warn(`${q.id}: etiqueta corta de ${q.short.length} caracteres`);
  const tokens = q.pos.trim().split(/\s+/);
  if (tokens.length !== PARTY_ORDER.length) err(`${q.id}: ${tokens.length} posturas, se esperaban ${PARTY_ORDER.length}`);
  const pos = {};
  const est = [];
  tokens.forEach((t, i) => {
    const m = /^([0-5])(~?)$/.exec(t);
    if (!m) return err(`${q.id}: postura no válida «${t}»`);
    const v = Number(m[1]);
    if (v === 0) return;
    pos[PARTY_ORDER[i]] = v;
    if (m[2]) est.push(PARTY_ORDER[i]);
  });
  const out = { id: q.id, area: q.area, prio: q.prio, type: q.type, text: q.text };
  if (q.type === "dilema") Object.assign(out, { A: q.A, B: q.B });
  Object.assign(out, { short: q.short, ctx: q.ctx });
  if (q.ley) out.ley = q.ley;
  Object.assign(out, { dim: q.dim, dir: q.dim ? q.dir : 0, lr: q.lr, pos, est });
  if (NOTES[q.id]) {
    for (const pid of Object.keys(NOTES[q.id])) if (!pos[pid]) err(`${q.id}: nota para ${pid}, que no tiene postura`);
    out.notes = NOTES[q.id];
  }
  if (SOURCES[q.id]) {
    for (const [pid, [url, label, type, date]] of Object.entries(SOURCES[q.id])) {
      if (!pos[pid]) err(`${q.id}: fuente para ${pid}, que no tiene postura`);
      if (!/^https:\/\/[^\s"<>]+$/.test(url) || !label) err(`${q.id}/${pid}: fuente no válida`);
      if (!SRC_TYPES.includes(type)) err(`${q.id}/${pid}: tipo de fuente «${type}» no válido (${SRC_TYPES.join(", ")})`);
      if (!/^\d{4}(-\d{2}(-\d{2})?)?$/.test(date || "") || date > UPDATED) err(`${q.id}/${pid}: fecha de la fuente no válida (${date})`);
      if (est.includes(pid)) warn(`${q.id}/${pid}: tiene fuente pero sigue marcada como estimada`);
    }
    out.src = SOURCES[q.id];
  }
  if (JUSTIF[q.id]) {
    for (const [pid, t] of Object.entries(JUSTIF[q.id])) {
      if (!pos[pid]) err(`${q.id}: justificación para ${pid}, que no tiene postura`);
      if (typeof t !== "string" || t.trim().length < 20 || t.length > 200) err(`${q.id}/${pid}: la justificación debe tener entre 20 y 200 caracteres`);
      else if (!/[.)»]$/.test(t.trim())) err(`${q.id}/${pid}: la justificación debe terminar en punto`);
    }
    out.why = JUSTIF[q.id];
  }
  return out;
});

// Cada área necesita 1 pregunta núcleo y al menos 2 importantes y 1 complementaria (versión media).
for (const a of AREAS) {
  const qs = questions.filter((q) => q.area === a.id);
  const p = [1, 2, 3].map((n) => qs.filter((q) => q.prio === n).length);
  if (p[0] !== 1) err(`Área ${a.id}: necesita exactamente 1 pregunta núcleo (tiene ${p[0]})`);
  if (p[1] < 2) err(`Área ${a.id}: necesita al menos 2 preguntas importantes`);
  if (p[2] < 1) err(`Área ${a.id}: necesita al menos 1 pregunta complementaria`);
}

const parties = PARTIES.map((p) => {
  if (!PARTY_ORDER.includes(p.id)) err(`Partido ${p.id} no está en PARTY_ORDER`);
  const s = p.scope;
  (s.except || []).concat(s.regions || []).forEach((r) => regionIds.has(r) || err(`${p.id}: región ${r} desconocida`));
  (s.provinces || []).forEach((r) => provIds.has(r) || err(`${p.id}: provincia ${r} desconocida`));
  const props = p.props.map(([t, q]) => {
    if (q) {
      const qq = questions.find((x) => x.id === q);
      if (!qq) err(`${p.id}: propuesta enlazada a pregunta inexistente ${q}`);
      else if (!qq.pos[p.id] || qq.pos[p.id] === 3) warn(`${p.id}: propuesta «${t}» enlazada a ${q}, donde su postura es ${qq.pos[p.id] || "desconocida"}`);
    }
    return q ? { t, q } : { t };
  });
  const out = { id: p.id, name: p.name, ab: p.ab, color: p.color, tag: p.tag };
  if (p.lead) out.lead = p.lead;
  if (p.tbd) out.tbd = true;
  if (p.out) out.out = p.out;
  Object.assign(out, { scope: p.scope });
  if (p.local) out.local = p.local;
  Object.assign(out, { desc: p.desc, props });
  return out;
});
PARTY_ORDER.forEach((id) => parties.some((p) => p.id === id) || err(`Falta la ficha de ${id}`));

// Políticos: posturas individuales y foto con licencia libre (qa/photos.py genera assets/politicos/)
const credits = existsSync("assets/politicos/credits.json") ? JSON.parse(readFileSync("assets/politicos/credits.json", "utf8")) : {};
const politicians = POLITICIANS.map((x) => {
  if (!PARTY_ORDER.includes(x.party)) err(`${x.id}: partido desconocido ${x.party}`);
  for (const [qid, [v, basis]] of Object.entries(x.pos)) {
    if (!seen.has(qid)) err(`${x.id}: pregunta inexistente ${qid}`);
    if (![1, 2, 3, 4, 5].includes(v)) err(`${x.id}: postura no válida en ${qid}`);
    if (!basis || basis.length < 15) err(`${x.id}: falta el hecho en el que se basa ${qid}`);
  }
  if (Object.keys(x.pos).length < 3) err(`${x.id}: necesita al menos 3 posturas individuales`);
  const c = credits[x.id];
  const photo = c && existsSync(`assets/politicos/${x.id}.jpg`) ? { src: `assets/politicos/${x.id}.jpg`, author: c.author, license: c.license, source: c.source } : null;
  if (!photo) warn(`${x.id}: sin foto con licencia libre (se mostrará un marcador neutro)`);
  return { id: x.id, name: x.name, full: x.full, party: x.party, partyLabel: x.partyLabel, role: x.role, photo, pos: x.pos };
});

if (errors.length) {
  console.error("ERRORES:\n - " + errors.join("\n - "));
  process.exit(1);
}

FAMILIES.forEach((f) => f.forEach((id) => seen.has(id) || err(`Familia con pregunta inexistente ${id}`)));
if (new Set(FAMILIES.flat()).size !== FAMILIES.flat().length) err("Una pregunta está en dos familias");
writeFileSync("data/preguntas.json", JSON.stringify({ version: VERSION, updated: UPDATED, dims: DIMS, areas: AREAS, families: FAMILIES, questions }, null, 1));
writeFileSync("data/partidos.json", JSON.stringify({
  version: VERSION, updated: UPDATED, order: PARTY_ORDER, parties,
  regions: REGIONS.map(([id, name, provs]) => ({ id, name, provs: provs.map(([pid, pname]) => ({ id: pid, name: pname })) }))
}, null, 1));

writeFileSync("data/politicos.json", JSON.stringify({ version: VERSION, updated: UPDATED, politicians }, null, 1));

// Informe de equilibrio
console.log(`Banco v${VERSION}: ${questions.length} preguntas, ${parties.length} candidaturas, ${provIds.size} circunscripciones`);
console.log("\nPor área (núcleo/importantes/complementarias):");
for (const a of AREAS) {
  const qs = questions.filter((q) => q.area === a.id);
  console.log(`  ${a.letter} ${a.name.padEnd(46)} ${qs.length}  (${[1, 2, 3].map((n) => qs.filter((q) => q.prio === n).length).join("/")})`);
}
console.log("\nEquilibrio de formulación por dimensión (afirmaciones likert: acuerdo → polo A / polo B; dilemas aparte):");
for (const d of DIMS) {
  const qs = questions.filter((q) => q.dim === d.id);
  const lik = qs.filter((q) => q.type === "likert");
  console.log(`  ${d.name.padEnd(24)} ${qs.length} preguntas · acuerdo→${d.a}: ${lik.filter((q) => q.dir < 0).length} · acuerdo→${d.b}: ${lik.filter((q) => q.dir > 0).length} · dilemas: ${qs.length - lik.length}`);
}
const lik = questions.filter((q) => q.type === "likert");
console.log(`\nLectura izquierda-derecha (likert): acuerdo→izquierda ${lik.filter((q) => q.lr < 0).length} · acuerdo→derecha ${lik.filter((q) => q.lr > 0).length} · transversales ${lik.filter((q) => q.lr === 0).length}`);
const words = questions.map((q) => q.ctx.split(/\s+/).length);
console.log(`Contexto: ${Math.min(...words)}-${Math.max(...words)} palabras (media ${Math.round(words.reduce((a, b) => a + b) / words.length)})`);
console.log("\nCobertura de posturas (documentadas + estimadas / total):");
for (const id of PARTY_ORDER) {
  const known = questions.filter((q) => q.pos[id]).length;
  const est = questions.filter((q) => q.est.includes(id)).length;
  console.log(`  ${id.padEnd(7)} ${String(known - est).padStart(3)} + ${String(est).padStart(3)} = ${String(known).padStart(3)} / ${questions.length}`);
}
console.log(`\nPolíticos: ${politicians.length}, con foto ${politicians.filter((x) => x.photo).length}, posturas ${politicians.reduce((a, x) => a + Object.keys(x.pos).length, 0)}`);
// Datos que caducan: posturas sin revisar en más de 3 semanas y candidaturas aún por confirmar
const age = Math.floor((Date.now() - Date.parse(UPDATED)) / 86400000);
if (age > 21) warn(`Las posturas se revisaron hace ${age} días (${UPDATED}): conviene actualizarlas, sobre todo en campaña`);
const pending = PARTIES.filter((p) => p.tbd && !p.out).map((p) => p.ab);
if (pending.length) warn(`Candidaturas por confirmar: ${pending.join(", ")} (comprobar las listas proclamadas por la Junta Electoral)`);
if (warns.length) console.log("\nAvisos:\n - " + warns.join("\n - "));
