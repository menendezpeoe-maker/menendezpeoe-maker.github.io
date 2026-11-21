// Genera la maqueta de Mirada Política con TODOS los datos reales de la rama fuente
import { readFileSync, writeFileSync } from "node:fs";
const R = "/home/user/fu/data/", SRC = "/home/user/fu/src/";
const P = JSON.parse(readFileSync(R + "partidos.json", "utf8"));
const Q = JSON.parse(readFileSync(R + "preguntas.json", "utf8"));
const POL = JSON.parse(readFileSync(R + "politicos.json", "utf8"));
const CAND = JSON.parse(readFileSync(SRC + "candidaturas.json", "utf8"));
const { DEBATES } = await import(SRC + "debates.src.mjs");
const { VOTAR } = await import(SRC + "votar.src.mjs");
const { PROGRAMAS } = await import(SRC + "programas.src.mjs");
const { RES2023 } = await import(SRC + "resultados2023.src.mjs");
const { SEATS, SEATS_SOURCE, SENATE } = await import(SRC + "escanos.src.mjs");
const { GLOSARIO } = await import(SRC + "glosario.src.mjs");
const { TOPICS } = await import(SRC + "temas.src.mjs");
const FOTOS = JSON.parse(readFileSync("/home/user/propuesta-mirada/fotos.json", "utf8"));
const regName = {}, provName = {};
P.regions.forEach((r) => { regName[r.id] = r.name; r.provs.forEach((p) => { provName[p.id] = p.name; }); });
const scopeLabel = (s) => s.all ? "Estatal" : s.regions ? s.regions.map((r) => regName[r]).join(", ") : s.provinces.length > 3 ? `${s.provinces.length} provincias` : s.provinces.map((p) => provName[p]).join(", ");
const scopeKind = (s) => s.all ? "est" : s.regions ? "aut" : "prov";
const parties = P.order.map((id) => P.parties.find((p) => p.id === id)).filter(Boolean).map((p) => ({
  id: p.id, ab: p.ab, name: p.name, color: p.color, tag: p.tag, lead: p.lead, scope: p.scope, sl: scopeLabel(p.scope), sk: scopeKind(p.scope), local: p.local || {},
  desc: p.desc, props: (p.props || []).map((x) => x.t), prog: P.programas[p.id] ? { url: P.programas[p.id].url, t: P.programas[p.id].titulo, f: P.programas[p.id].fecha } : null,
}));
const qs = Q.questions.map((q) => ({ id: q.id, a: q.area, ty: q.type, s: q.short, t: q.text, A: q.A, B: q.B, ctx: q.ctx, ley: q.ley, dm: q.dim, dr: q.dir, pr: q.prio, pos: q.pos || {}, est: q.est || [], why: q.why || {}, src: Object.fromEntries(Object.entries(q.src || {}).map(([k, v]) => [k, [v[0], v[1], v[2]]])) }));
const pols = POL.politicians.map((x) => ({ id: x.id, name: x.name, full: x.full, party: x.party, pl: x.partyLabel, role: x.role, foto: FOTOS[x.id] || "", cred: x.photo ? [x.photo.author, x.photo.license, x.photo.source] : null, pos: x.pos }));
const DATA = {
  parties, areas: Q.areas.map((a) => ({ id: a.id, letter: a.letter, n: a.name, i: a.intro })), dims: Q.dims, qs, regions: P.regions, updated: Q.updated,
  pols, cand: CAND, debates: DEBATES, votar: VOTAR, programas: { pub: PROGRAMAS.publicados, sin: PROGRAMAS.sinLista, chk: PROGRAMAS.comprobado },
  res23: RES2023, seats: SEATS, seatsSrc: SEATS_SOURCE, senate: SENATE, glos: GLOSARIO, topics: TOPICS,
};
const tpl = readFileSync("/home/user/propuesta-mirada/app.html", "utf8");
const out = tpl.replace("/*DATA*/null", JSON.stringify(DATA).replace(/</g, "\\u003c"));
writeFileSync("/home/user/propuesta-mirada/index.html", out);
writeFileSync("/home/user/propuesta-mirada/prueba/index.html", out.replace("<title>Propuesta Mirada Política</title>", "<title>Mirada Política · prueba</title>").replace("</style>", "body{background:var(--bg)}.mk,.doc{display:none}.stage{padding:0}.app,.app.m{max-width:none;width:100%;height:100vh;height:100dvh;min-height:0;border:0;border-radius:0;box-shadow:none}\n</style>"));
console.log("ok", parties.length, qs.length, pols.length, (out.length / 1024 | 0) + " KB");
