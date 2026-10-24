// Páginas estáticas para buscadores y para compartir: una por candidatura, una por tema, sus índices y la
// página de prensa. Se generan con los mismos datos que el test (data/*.json): nada se escribe a mano, las
// posturas estimadas se marcan como tales y las desconocidas no se rellenan.
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { VOTAR } from "./src/votar.src.mjs";
import { SEATS, SEATS_SOURCE, SENATE, LOREG_URL } from "./src/escanos.src.mjs";
import { GLOSARIO } from "./src/glosario.src.mjs";
import { TOPICS } from "./src/temas.src.mjs";

const LIK = ["Totalmente en desacuerdo", "En desacuerdo", "Ni de acuerdo ni en desacuerdo", "De acuerdo", "Totalmente de acuerdo"];
const DIL = ["Claramente A", "Más bien A", "Las dos por igual", "Más bien B", "Claramente B"];
const W_ESTIMATED = 0.6;
const SRC_TYPE = { programa: "programa o documento del partido", parlamento: "actuación parlamentaria", gobierno: "acción de gobierno", declaracion: "declaración pública", prensa: "información periodística" };
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = (iso) => { const [y, m, d] = String(iso).split("-").map(Number); return d ? `${d} de ${MONTHS[m - 1]} de ${y}` : m ? `${MONTHS[m - 1]} de ${y}` : String(y); };
export const slug = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const signed = (v) => { const r = Math.round(v); return r > 0 ? `+${r}` : r < 0 ? `−${Math.abs(r)}` : "0"; };
const strength = (v) => { const a = Math.abs(v); return a < 15 ? "equilibrio" : a < 40 ? "inclinación moderada" : a < 70 ? "inclinación clara" : "posición muy marcada"; };
const joinY = (a) => a.length <= 1 ? a.join("") : `${a.slice(0, -1).join(", ")} y ${a[a.length - 1]}`;
const posText = (q, v) => (q.type === "dilema" ? (v === 3 ? DIL[2] : `${DIL[v - 1]}: ${v < 3 ? q.A : q.B}`) : LIK[v - 1]);
const textOn = (hex) => {
  const n = parseInt(hex.slice(1), 16), lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return (L + 0.05) / 0.0559 >= 1.05 / (L + 0.05) ? "#111318" : "#FFFFFF";
};

export function buildPages({ OUT, SITE, head, statsJs, owner }) {
  const B = JSON.parse(readFileSync("data/preguntas.json", "utf8"));
  const PD = JSON.parse(readFileSync("data/partidos.json", "utf8"));
  const P = Object.fromEntries(PD.parties.map((p) => [p.id, p]));
  const AREA = Object.fromEntries(B.areas.map((a) => [a.id, a]));
  const live = PD.order.filter((pid) => !P[pid].out);
  const regions = Object.fromEntries(PD.regions.map((r) => [r.id, r]));
  const provName = Object.fromEntries(PD.regions.flatMap((r) => r.provs.map((p) => [p.id, p.name])));
  const qCode = (q) => `${AREA[q.area].letter}·${q.id.slice(1)}`;
  const updated = fmtDate(B.updated);
  const urls = [];
  // Posición de cada partido en las dimensiones, igual que en el test (estimadas con menos peso)
  const pdim = (pid) => {
    const acc = {};
    for (const q of B.questions) { const v = q.pos[pid]; if (!v || !q.dim) continue; const c = q.est.includes(pid) ? W_ESTIMATED : 1, o = (acc[q.dim] ||= [0, 0]); o[0] += c * (v - 3) / 2 * 100 * q.dir; o[1] += c; }
    return Object.fromEntries(Object.entries(acc).map(([k, [s, w]]) => [k, s / w]));
  };
  const scopeText = (p) => {
    const s = p.scope;
    if (s.all) return s.except?.length ? `Toda España salvo ${joinY(s.except.map((r) => regions[r].name))}` : "Toda España";
    if (s.regions) return joinY(s.regions.map((r) => regions[r].name));
    if (s.provinces) return joinY(s.provinces.map((x) => provName[x]));
    return "—";
  };
  const logo = (pid) => { const p = P[pid]; return `<span class="logo${p.ab.length >= 5 ? " long" : ""}" style="background:${p.color};color:${textOn(p.color)}" aria-hidden="true">${esc(p.ab)}</span>`; };
  const srcHTML = (q, pid) => { const s = q.src?.[pid]; return s ? `<a href="${esc(s[0])}" target="_blank" rel="noopener noreferrer">${esc(s[1])}</a> <span class="src-t">(${esc(SRC_TYPE[s[2]])}, ${esc(fmtDate(s[3]))})</span>` : ""; };
  const header = `<a class="skip" href="#main">Saltar al contenido</a>
<header class="site-head"><div class="wrap head-row">
  <a class="brand" href="/" aria-label="Test 29N, ir al test" style="text-decoration:none;color:inherit"><svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><path d="M7 4h20l7 7v25H7z" style="fill:var(--sheet)" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M27 4v7h7" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><rect x="11" y="20" width="19" height="7" rx="1.5" style="fill:var(--mark)"/><path d="M12 31h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg><span class="brand-word">Test</span><span class="brand-ed">29N</span></a>
  <nav class="head-nav sp-nav" aria-label="Secciones"><a href="/partidos/">Partidos</a><a href="/temas/">Temas</a><a class="btn btn-primary btn-sm" href="/">Hacer el test</a></nav>
</div></header>`;
  const footer = `<footer class="site-foot"><div class="wrap foot-row">
  <p><b>Test 29N</b> · Herramienta independiente y orientativa, sin vínculo con ningún partido. No es una recomendación de voto.</p>
  <p class="muted"><a href="/partidos/">Partidos</a> · <a href="/temas/">Temas</a> · <a href="/tests/">Tests por tema</a> · <a href="/preguntas/">Preguntas</a> · <a href="/votar/">Cómo votar</a> · <a href="/calendario/">Calendario</a> · <a href="/provincias/">Provincias</a> · <a href="/escanos/">Escaños</a> · <a href="/glosario/">Glosario</a> · <a href="/prensa/">Prensa</a> · Datos actualizados el ${esc(updated)}</p>
</div></footer>
${statsJs ? `<script src="/assets/stats.js?v=${statsJs}" defer></script>` : ""}`;
  const cta = (t) => `<aside class="cta-box"><p class="h3">${t}</p><p>Responde el test en 3, 5, 10 o 20 minutos y compara tus respuestas con las candidaturas de tu provincia, pregunta a pregunta. Gratis, sin registro y sin que tus respuestas salgan de tu navegador.</p><p><a class="btn btn-primary" href="/">Hacer el test</a></p></aside>`;
  const method = `<p class="small muted">Las posturas se asignan de 1 a 5 a partir de programas electorales, votaciones en las Cortes, decisiones de gobierno y declaraciones públicas. <b>Documentada</b>: hay evidencia explícita. <b>Estimada</b>: se deduce de su línea general y se marca siempre. Si no conocemos la postura de un partido, no se le asigna ninguna. Datos actualizados el ${esc(updated)}.</p>`;
  const page = ({ path, title, desc, crumbs, body, ld }) => {
    const url = SITE + path.replace(/^\//, "");
    const crumbLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ name: "Test 29N", url: SITE }, ...crumbs].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url })) };
    const extra = `<link rel="canonical" href="${url}">
<meta property="og:type" content="article"><meta property="og:site_name" content="Test 29N"><meta property="og:locale" content="es_ES">
<meta property="og:url" content="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}og.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${SITE}og.png">
<script type="application/ld+json">${JSON.stringify(ld ? [crumbLd, ld] : crumbLd).replace(/</g, "\\u003c")}</script>
`;
    const nav = `<nav class="crumbs" aria-label="Ruta"><a href="/">Test 29N</a>${crumbs.map((c, i) => i === crumbs.length - 1 ? ` › <span aria-current="page">${esc(c.name)}</span>` : ` › <a href="${c.url.replace(SITE, "/")}">${esc(c.name)}</a>`).join("")}</nav>`;
    const html = `${head(esc(title), esc(desc), extra, "/")}
<body>
${header}
<main id="main" class="wrap sp" tabindex="-1">
${nav}
${body}
</main>
${footer}
</body>
</html>
`;
    mkdirSync(`${OUT}${path}`, { recursive: true });
    writeFileSync(`${OUT}${path}index.html`, html);
    urls.push(url);
  };

  // ── Una página por candidatura
  for (const pid of PD.order) {
    const p = P[pid], dims = pdim(pid), known = B.questions.filter((q) => q.pos[pid]);
    const nEst = known.filter((q) => q.est.includes(pid)).length, nSrc = known.filter((q) => q.src?.[pid]).length;
    const dimRows = B.dims.map((d) => { const v = dims[d.id]; if (v === undefined) return `<div class="sig-row"><span>${esc(d.name)}</span><span class="small muted">sin posturas</span></div>`;
      const x = ((v + 100) / 2).toFixed(2);
      return `<div class="sp-dim"><span><b>${esc(d.name)}</b> <span class="muted">· ${Math.abs(v) < 15 ? "equilibrio" : `${esc(v < 0 ? d.a : d.b)}, ${strength(v)}`} (${signed(v)})</span></span><span class="mini" role="img" aria-label="${esc(d.name)}: ${signed(v)} en una escala de −100 (${esc(d.a)}) a +100 (${esc(d.b)})"><span class="c"></span>${v < 0 ? `<span class="b l" style="left:${x}%;width:${(50 - x).toFixed(2)}%"></span>` : v > 0 ? `<span class="b r" style="left:50%;width:${(x - 50).toFixed(2)}%"></span>` : ""}<span class="d" style="left:${x}%;background:${p.color}"></span></span><span class="poles small muted"><span>${esc(d.a)}</span><span>${esc(d.b)}</span></span></div>`; }).join("");
    const areas = B.areas.map((a) => {
      const qs = B.questions.filter((q) => q.area === a.id);
      return `<section class="sp-area" aria-labelledby="a-${a.id}"><h3 class="h3" id="a-${a.id}"><a href="/temas/${slug(a.name)}/">${esc(a.letter)} · ${esc(a.name)}</a></h3><ul class="sp-q">${qs.map((q) => {
        const v = q.pos[pid], est = q.est.includes(pid), note = q.notes?.[pid];
        return `<li><span class="q-code">${qCode(q)}</span><div><b>${esc(q.text)}</b>${q.type === "dilema" ? `<span class="small muted">A: ${esc(q.A)} · B: ${esc(q.B)}</span>` : ""}
          <span class="sp-pos${v ? (est ? " est" : "") : " na"}">${v ? `${esc(posText(q, v))} · ${est ? "estimada" : "documentada"}` : "Sin postura conocida"}</span>${note ? `<span class="small">${esc(note)}</span>` : ""}${q.src?.[pid] ? `<span class="small">Fuente: ${srcHTML(q, pid)}</span>` : ""}</div></li>`;
      }).join("")}</ul></section>`;
    }).join("");
    const others = live.filter((x) => x !== pid).map((x) => `<a href="/partidos/${x}/">${esc(P[x].ab)}</a>`).join(" · ");
    page({
      path: `/partidos/${pid}/`,
      title: `${p.name}: qué propone para el 29N, tema a tema · Test 29N`,
      desc: `Las posturas de ${p.name} en ${known.length} cuestiones de las elecciones generales del 29N (vivienda, impuestos, inmigración, sanidad…), con fuentes. Compara con las tuyas en el Test 29N.`,
      crumbs: [{ name: "Partidos", url: `${SITE}partidos/` }, { name: p.name, url: `${SITE}partidos/${pid}/` }],
      body: `<header class="sp-head"><div class="phead">${logo(pid)}<div style="display:grid;gap:4px;min-width:0"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">${esc(p.name)}: qué propone, tema a tema</h1></div></div>
  <p class="lede">${esc(p.desc)}</p>
  <dl class="sp-facts"><div><dt>Espacio político</dt><dd>${esc(p.tag)}</dd></div>${p.lead ? `<div><dt>Cabeza de cartel</dt><dd>${esc(p.lead)}</dd></div>` : ""}<div><dt>Dónde se presenta</dt><dd>${esc(scopeText(p))}</dd></div>${p.out ? `<div><dt>Estado</dt><dd>${esc(p.out)}</dd></div>` : p.tbd ? '<div><dt>Estado</dt><dd>Candidatura por confirmar en las listas proclamadas</dd></div>' : ""}<div><dt>Posturas en el test</dt><dd>${known.length - nEst} documentadas, ${nEst} estimadas y ${B.questions.length - known.length} sin postura conocida${nSrc ? `; ${nSrc} con fuente enlazada` : ""}</dd></div></dl></header>
${p.out ? "" : cta(`¿Cuánto coincides con ${esc(p.ab)}?`)}
<section aria-labelledby="h-props"><h2 class="h2" id="h-props">Propuestas destacadas</h2><ul class="dots">${p.props.map((x) => `<li>${esc(x.t)}</li>`).join("")}</ul></section>
<section aria-labelledby="h-dims"><h2 class="h2" id="h-dims">Su posición en siete dimensiones</h2><p class="small muted">Media de sus posturas en las preguntas de cada dimensión, de −100 a +100. Las estimadas pesan menos.</p><div class="sp-dims">${dimRows}</div></section>
<section aria-labelledby="h-pos"><h2 class="h2" id="h-pos">Sus posturas, pregunta a pregunta</h2>${method}${areas}</section>
${p.out ? "" : cta(`Compara tus respuestas con las de ${esc(p.ab)}`)}
<p class="small muted">Otras candidaturas: ${others}</p>`
    });
  }

  // Posturas de una pregunta agrupadas de 1 a 5, con notas, fuentes y partidos sin postura (temas y páginas de pregunta)
  const qBlock = (q, h = "h2", link = true) => {
      const cols = [1, 2, 3, 4, 5].map((n) => { const ps = live.filter((pid) => q.pos[pid] === n);
        return `<div class="pc5"><span>${n} · ${esc(q.type === "dilema" ? DIL[n - 1] : LIK[n - 1])}</span><span class="chips">${ps.map((pid) => `<a class="chip${q.est.includes(pid) ? " est" : ""}" href="/partidos/${pid}/" title="${esc(P[pid].name)}${q.est.includes(pid) ? " · estimada" : ""}"><i class="sw" style="background:${P[pid].color}"></i>${esc(P[pid].ab)}</a>`).join("")}</span></div>`; }).join("");
      const unk = live.filter((pid) => !q.pos[pid]);
      const notes = Object.entries(q.notes || {}).filter(([pid]) => live.includes(pid));
      const srcs = Object.entries(q.src || {}).filter(([pid]) => live.includes(pid));
      return `<article class="exq" id="${q.id}"><p class="q-meta"><span class="q-code">${qCode(q)}</span>${link ? `<a href="/preguntas/${q.id.toLowerCase()}/">Qué piensa cada partido</a>` : ""}</p><${h} class="sp-qh">${esc(q.text)}</${h}>${q.type === "dilema" ? `<p class="small">A: ${esc(q.A)} · B: ${esc(q.B)}</p>` : ""}
        <p class="dinfo">${esc(q.ctx)}${q.ley ? ` <b>Marco legal:</b> ${esc(q.ley)}.` : ""}</p>
        <div class="pos5">${cols}</div>
        ${notes.length ? `<ul class="pos-notes">${notes.map(([pid, t]) => `<li><b>${esc(P[pid].ab)}:</b> ${esc(t)}</li>`).join("")}</ul>` : ""}
        ${srcs.length ? `<p class="unk">Fuentes: ${srcs.map(([pid]) => `${esc(P[pid].ab)} · ${srcHTML(q, pid)}`).join(" · ")}.</p>` : ""}
        ${unk.length ? `<p class="unk">Sin postura conocida: ${unk.map((pid) => esc(P[pid].ab)).join(", ")}.</p>` : ""}</article>`;
  };

  // ── Una página por tema
  for (const a of B.areas) {
    const qs = B.questions.filter((q) => q.area === a.id);
    const items = qs.map((q) => qBlock(q)).join("");
    page({
      path: `/temas/${slug(a.name)}/`,
      title: `${a.name}: qué piensa cada partido en las elecciones del 29N · Test 29N`,
      desc: `${qs.length} cuestiones sobre ${a.name.toLowerCase()} con contexto neutral y la postura de cada candidatura para las elecciones generales del 29N, con fuentes cuando las hay.`,
      crumbs: [{ name: "Temas", url: `${SITE}temas/` }, { name: a.name, url: `${SITE}temas/${slug(a.name)}/` }],
      body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">${esc(a.name)}: qué piensa cada partido</h1>
  <p class="lede">Las ${qs.length} preguntas del Test 29N sobre ${esc(a.name.toLowerCase())}, con su contexto neutral y la postura de cada candidatura, de 1 (totalmente en desacuerdo) a 5 (totalmente de acuerdo).</p></header>
${cta("¿Y tú qué piensas?")}
${method}<p class="small muted">Las etiquetas con borde discontinuo y en cursiva son posturas estimadas. Toca un partido para ver todas sus posturas.</p>
${items}
${cta("Descubre con qué candidatura coincides más")}
<p class="small muted">Otros temas: ${B.areas.filter((x) => x.id !== a.id).map((x) => `<a href="/temas/${slug(x.name)}/">${esc(x.name)}</a>`).join(" · ")}</p>`
    });
  }

  // ── Una página por pregunta: «¿Qué piensa cada partido sobre…?»
  B.questions.forEach((q, i) => {
    const a = AREA[q.area], known = live.filter((pid) => q.pos[pid]), nSrc = known.filter((pid) => q.src?.[pid]).length;
    const prev = B.questions[i - 1], next = B.questions[i + 1];
    const qLink = (x) => `<a href="/preguntas/${x.id.toLowerCase()}/">${esc(x.short)}</a>`;
    page({
      path: `/preguntas/${q.id.toLowerCase()}/`,
      title: `${q.short}: qué piensa cada partido · Test 29N`,
      desc: `${q.short}: la postura de ${known.length} candidaturas en las elecciones generales del 29N, con contexto neutral${nSrc ? ` y ${nSrc} ${nSrc === 1 ? "fuente enlazada" : "fuentes enlazadas"}` : ""}. Compara con tu opinión en el Test 29N.`,
      crumbs: [{ name: "Temas", url: `${SITE}temas/` }, { name: a.name, url: `${SITE}temas/${slug(a.name)}/` }, { name: q.short, url: `${SITE}preguntas/${q.id.toLowerCase()}/` }],
      body: `<header class="sp-head"><p class="label">${esc(a.letter)} · ${esc(a.name)} · Elecciones generales del 29N</p><h1 class="h1">${esc(q.short)}: qué piensa cada partido</h1>
  <p class="lede">La postura de cada candidatura sobre esta cuestión, de 1 (totalmente en desacuerdo) a 5 (totalmente de acuerdo)${q.type === "dilema" ? ", o entre las opciones A y B" : ""}, con el contexto neutral que muestra el test.</p></header>
${qBlock(q, "h2", false)}
${method}<p class="small muted">Las etiquetas con borde discontinuo y en cursiva son posturas estimadas. Toca un partido para ver todas sus posturas.</p>
${cta("¿Y tú qué opinas? Responde el test")}
<nav class="small muted" aria-label="Otras preguntas">${prev ? `← ${qLink(prev)}` : ""}${prev && next ? " · " : ""}${next ? `${qLink(next)} →` : ""} · <a href="/temas/${slug(a.name)}/">Todas las preguntas sobre ${esc(a.name.toLowerCase())}</a></nav>`
    });
  });

  page({
    path: "/preguntas/",
    title: `Las ${B.questions.length} preguntas del test, partido a partido · Test 29N`,
    desc: `Todas las cuestiones del Test 29N para las elecciones generales del 29N, cada una con su contexto neutral y la postura de cada candidatura.`,
    crumbs: [{ name: "Preguntas", url: `${SITE}preguntas/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Qué piensa cada partido, pregunta a pregunta</h1>
  <p class="lede">Las ${B.questions.length} cuestiones del Test 29N, agrupadas en ${B.areas.length} áreas. Cada una tiene su página con el contexto neutral y la postura de cada candidatura.</p></header>
${cta("Responde tú y compara")}
${B.areas.map((a) => `<section aria-labelledby="pa-${a.id}"><h2 class="h3" id="pa-${a.id}"><a href="/temas/${slug(a.name)}/">${esc(a.letter)} · ${esc(a.name)}</a></h2><ul class="dots">${B.questions.filter((q) => q.area === a.id).map((q) => `<li><a href="/preguntas/${q.id.toLowerCase()}/">${esc(q.short)}</a></li>`).join("")}</ul></section>`).join("")}`
  });

  // ── Comparar dos candidaturas: los mismos datos que el comparador del test, solo con posturas conocidas de ambas
  const PAIRS = [["psoe", "pp"], ["pp", "vox"], ["psoe", "fa"], ["fa", "pod"], ["psoe", "pod"], ["vox", "salf"], ["pp", "salf"], ["erc", "junts"], ["pnv", "bildu"], ["erc", "bildu"]].filter(([a, b]) => P[a] && P[b]);
  const sideOf = (v) => (v < 3 ? -1 : v > 3 ? 1 : 0);
  const pairPath = (a, b) => `/comparar/${a}-${b}/`;
  for (const [a, b] of PAIRS) {
    const A = P[a], Bp = P[b], da = pdim(a), db = pdim(b);
    const both = B.questions.filter((q) => q.pos[a] && q.pos[b]);
    const agree = Math.round(both.reduce((x, q) => x + 1 - Math.abs(q.pos[a] - q.pos[b]) / 4, 0) / (both.length || 1) * 100);
    const same = both.filter((q) => q.pos[a] === q.pos[b]);
    const opp = both.filter((q) => sideOf(q.pos[a]) && sideOf(q.pos[b]) && sideOf(q.pos[a]) !== sideOf(q.pos[b])).sort((x, y) => Math.abs(y.pos[a] - y.pos[b]) - Math.abs(x.pos[a] - x.pos[b]));
    const estN = both.filter((q) => q.est.includes(a) || q.est.includes(b)).length;
    const posShort = (q, v) => (q.type === "dilema" ? (v === 3 ? "las dos por igual" : `${DIL[v - 1].toLowerCase()} («${v < 3 ? q.A : q.B}»)`) : LIK[v - 1].toLowerCase());
    const qrow = (q) => `<li><a href="/preguntas/${q.id.toLowerCase()}/"><b>${esc(q.short)}</b></a><span class="small">${esc(A.ab)}: ${esc(posShort(q, q.pos[a]))}${q.est.includes(a) ? " (estimada)" : ""}</span><span class="small">${esc(Bp.ab)}: ${esc(posShort(q, q.pos[b]))}${q.est.includes(b) ? " (estimada)" : ""}</span></li>`;
    const dimRows = B.dims.map((d) => { const x = da[d.id], y = db[d.id]; if (x === undefined || y === undefined) return "";
      const px = ((x + 100) / 2).toFixed(2), py = ((y + 100) / 2).toFixed(2);
      return `<div class="sp-dim"><span><b>${esc(d.name)}</b> <span class="muted">· ${esc(A.ab)} ${signed(x)} · ${esc(Bp.ab)} ${signed(y)}</span></span><span class="mini" role="img" aria-label="${esc(d.name)}: ${esc(A.ab)} ${signed(x)}, ${esc(Bp.ab)} ${signed(y)}, en una escala de −100 (${esc(d.a)}) a +100 (${esc(d.b)})"><span class="c"></span><span class="d" style="left:${px}%;background:${A.color}"></span><span class="d" style="left:${py}%;background:${Bp.color}"></span></span><span class="poles small muted"><span>${esc(d.a)}</span><span>${esc(d.b)}</span></span></div>`; }).join("");
    const others = PAIRS.filter((x) => x[0] !== a || x[1] !== b).map(([x, y]) => `<a href="${pairPath(x, y)}">${esc(P[x].ab)} y ${esc(P[y].ab)}</a>`).join(" · ");
    page({
      path: pairPath(a, b),
      title: `${A.ab} y ${Bp.ab}: en qué coinciden y en qué se diferencian · Test 29N`,
      desc: `Comparativa neutral de ${A.name} y ${Bp.name} en ${both.length} cuestiones de las elecciones generales del 29N: dónde coinciden, dónde chocan y su posición en siete dimensiones.`,
      crumbs: [{ name: "Comparar", url: `${SITE}comparar/` }, { name: `${A.ab} y ${Bp.ab}`, url: `${SITE}comparar/${a}-${b}/` }],
      body: `<header class="sp-head"><div class="phead"><span class="pair">${logo(a)}${logo(b)}</span><div style="display:grid;gap:4px;min-width:0"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">${esc(A.ab)} y ${esc(Bp.ab)}: en qué coinciden y en qué se diferencian</h1></div></div>
  <p class="lede">Con los mismos datos que usa el test: ${both.length} cuestiones en las que conocemos la postura de las dos candidaturas${estN ? ` (en ${estN}, al menos una es estimada)` : ""}. Su grado de coincidencia es del ${agree} %.</p></header>
<section aria-labelledby="h-diff"><h2 class="h2" id="h-diff">Donde chocan (${opp.length})</h2>${opp.length ? `<ul class="cmp-list">${opp.map(qrow).join("")}</ul>` : '<p class="small muted">No hay cuestiones en las que estén en lados opuestos.</p>'}</section>
<section aria-labelledby="h-same"><h2 class="h2" id="h-same">Donde coinciden del todo (${same.length})</h2>${same.length ? `<ul class="cmp-list">${same.map(qrow).join("")}</ul>` : '<p class="small muted">No hay cuestiones con la misma postura exacta.</p>'}</section>
<section aria-labelledby="h-dims2"><h2 class="h2" id="h-dims2">En siete dimensiones</h2><p class="small muted">Media de sus posturas en cada dimensión, de −100 a +100. Las estimadas pesan menos.</p><div class="sp-dims">${dimRows}</div></section>
${method}
${cta(`¿Estás más cerca de ${esc(A.ab)} o de ${esc(Bp.ab)}?`)}
<p class="small muted">Ver todas sus posturas: <a href="/partidos/${a}/">${esc(A.name)}</a> · <a href="/partidos/${b}/">${esc(Bp.name)}</a></p>
<p class="small muted">Otras comparativas: ${others}</p>`
    });
  }
  page({
    path: "/comparar/",
    title: "Comparar partidos del 29N, dos a dos · Test 29N",
    desc: "En qué coinciden y en qué se diferencian las principales candidaturas de las elecciones generales del 29N, con los mismos datos y fuentes que el test.",
    crumbs: [{ name: "Comparar", url: `${SITE}comparar/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Comparar partidos, dos a dos</h1>
  <p class="lede">Comparativas neutrales entre candidaturas cercanas o rivales, con las posturas que usa el Test 29N. En el test puedes comparar cualquier pareja con tus propias respuestas.</p></header>
<ul class="sp-cards">${PAIRS.map(([a, b]) => `<li><a href="${pairPath(a, b)}">${logo(a)}${logo(b)}<span><b>${esc(P[a].ab)} y ${esc(P[b].ab)}</b><span class="small muted">${esc(P[a].name)} · ${esc(P[b].name)}</span></span></a></li>`).join("")}</ul>
${cta("Compárate tú con cualquier candidatura")}`
  });

  // ── Datos abiertos: todas las posturas en CSV y JSON, con licencia CC BY 4.0
  const csvCell = (v) => { const t = String(v ?? ""); return /[",\n;]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
  const rowsOpen = [];
  for (const q of B.questions) for (const pid of PD.order) {
    const v = q.pos[pid]; if (!v) continue;
    const src = q.src?.[pid];
    rowsOpen.push({ pregunta_id: q.id, area: AREA[q.area].name, pregunta: q.text, tipo: q.type === "dilema" ? "dilema" : "afirmacion", opcion_a: q.A || "", opcion_b: q.B || "", partido_id: pid, partido: P[pid].name, postura: v, postura_texto: posText(q, v), estimada: q.est.includes(pid), nota: q.notes?.[pid] || "", fuente_url: src?.[0] || "", fuente_titulo: src?.[1] || "", fuente_tipo: src?.[2] || "", fuente_fecha: src?.[3] || "" });
  }
  const cols = Object.keys(rowsOpen[0]);
  mkdirSync(`${OUT}/datos`, { recursive: true });
  writeFileSync(`${OUT}/datos/posturas.csv`, "\ufeff" + [cols.join(","), ...rowsOpen.map((r) => cols.map((c) => csvCell(r[c])).join(","))].join("\r\n") + "\r\n");
  writeFileSync(`${OUT}/datos/posturas.json`, JSON.stringify({ titulo: "Posturas de las candidaturas del Test 29N", licencia: "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/deed.es)", atribucion: "Test 29N (https://test29n.es)", actualizado: B.updated, escala: "1 = totalmente en desacuerdo … 5 = totalmente de acuerdo; en los dilemas, 1 = claramente A … 5 = claramente B", posturas: rowsOpen }, null, 1));
  const nSrcOpen = rowsOpen.filter((r) => r.fuente_url).length, nEstOpen = rowsOpen.filter((r) => r.estimada).length;
  page({
    path: "/datos/",
    title: "Datos abiertos: posturas de los partidos del 29N en CSV y JSON · Test 29N",
    desc: `Descarga gratis las ${rowsOpen.length} posturas de las candidaturas del Test 29N en CSV y JSON, con fuentes y licencia CC BY 4.0, para periodistas, docentes e investigadores.`,
    crumbs: [{ name: "Datos abiertos", url: `${SITE}datos/` }],
    body: `<header class="sp-head"><p class="label">Para periodistas, docentes e investigadores</p><h1 class="h1">Datos abiertos</h1>
  <p class="lede">Todas las posturas que usa el Test 29N, listas para descargar y reutilizar: ${rowsOpen.length} posturas de ${PD.order.length} candidaturas${PD.order.some((pid) => P[pid].out) ? ` (incluidas ${PD.order.filter((pid) => P[pid].out).length} que han anunciado que no se presentan)` : ""} en ${B.questions.length} cuestiones.</p></header>
<section aria-labelledby="h-dl"><h2 class="h2" id="h-dl">Descargas</h2>
<p><a class="btn btn-primary" href="/datos/posturas.csv" download>Descargar CSV</a> <a class="btn btn-ghost" href="/datos/posturas.json" download>Descargar JSON</a></p>
<p class="small muted">Datos actualizados el ${esc(updated)}. El CSV usa comas como separador y codificación UTF-8, y se abre en Excel, LibreOffice o Google Sheets.</p></section>
<section aria-labelledby="h-cont"><h2 class="h2" id="h-cont">Qué contiene</h2>
<ul class="dots"><li>Una fila por cada postura conocida: pregunta, área, candidatura y postura de 1 a 5 (en los dilemas, de «claramente A» a «claramente B»).</li>
<li>Si la postura es <b>estimada</b> (${nEstOpen} de ${rowsOpen.length}) o documentada, y su nota cuando la hay.</li>
<li>La fuente enlazada, con título, tipo y fecha, cuando existe. Por ahora la tienen ${nSrcOpen} posturas: el resto de las documentadas se basa en programas, votaciones y declaraciones que se irán enlazando una a una.</li>
<li>Las posturas desconocidas no aparecen: no se rellenan ni se toman como neutrales.</li></ul></section>
<section aria-labelledby="h-lic"><h2 class="h2" id="h-lic">Licencia</h2>
<p>Los datos se publican con licencia <a href="https://creativecommons.org/licenses/by/4.0/deed.es" target="_blank" rel="noopener noreferrer">Creative Commons Atribución 4.0 (CC BY 4.0)</a>: puedes copiarlos, adaptarlos y usarlos, también con fines comerciales, siempre que cites la fuente, por ejemplo «Fuente: Test 29N (test29n.es)», y no des a entender que el Test 29N respalda tu uso.</p>
<p class="small muted">Las posturas son una interpretación documentada de programas, votaciones y declaraciones, no un dato oficial de los partidos. Si ves un error, escribe a <a href="mailto:menendezpeoe@gmail.com">menendezpeoe@gmail.com</a>.</p></section>
${method}`
  });

  // ── Mini test insertable (5 preguntas) para otras webs: sin cookies, sin almacenamiento y sin contador dentro del marco
  const STATEWIDE = PD.order.filter((pid) => !P[pid].out && P[pid].scope?.all && B.questions.filter((q) => q.pos[pid]).length > 60);
  const discQ = (q) => { const v = STATEWIDE.map((pid) => q.pos[pid]).filter(Boolean); const m = v.reduce((x, y) => x + y, 0) / v.length; return v.reduce((x, y) => x + (y - m) ** 2, 0) / v.length; };
  const miniQs = [];
  for (const q of [...B.questions].filter((q) => q.prio === 1 && STATEWIDE.every((pid) => q.pos[pid])).sort((x, y) => discQ(y) - discQ(x))) {
    if (miniQs.length < 5 && !miniQs.some((m) => m.area === q.area || (q.dim && m.dim === q.dim))) miniQs.push(q);
  }
  const miniData = { site: SITE, qs: miniQs.map((q) => ({ id: q.id, text: q.text, type: q.type, A: q.A || "", B: q.B || "" })), parties: STATEWIDE.map((pid) => ({ ab: P[pid].ab, name: P[pid].name, color: P[pid].color, pos: Object.fromEntries(miniQs.map((q) => [q.id, q.pos[pid]])) })) };
  mkdirSync(`${OUT}/insertar`, { recursive: true });
  writeFileSync(`${OUT}/insertar/mini.js`, `// Mini test del Test 29N: todo se calcula aquí, sin cookies, sin guardar nada y sin enviar respuestas.
(() => {
const D = ${JSON.stringify(miniData)};
const LIK = ["Totalmente en desacuerdo", "En desacuerdo", "Ni de acuerdo ni en desacuerdo", "De acuerdo", "Totalmente de acuerdo"];
const DIL = ["Claramente A", "Más bien A", "Las dos por igual", "Más bien B", "Claramente B"];
const el = document.getElementById("mini"), ans = {};
let i = 0;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function q() {
  const x = D.qs[i], L = x.type === "dilema" ? DIL : LIK;
  el.innerHTML = '<p class="mini-prog">Pregunta ' + (i + 1) + ' de ' + D.qs.length + '</p><h2 class="mini-q" tabindex="-1">' + esc(x.text) + '</h2>' + (x.type === "dilema" ? '<p class="mini-ab">A: ' + esc(x.A) + '<br>B: ' + esc(x.B) + '</p>' : '') + '<div class="mini-opts">' + L.map((t, k) => '<button type="button" data-v="' + (k + 1) + '"><b>' + (k + 1) + '</b> ' + esc(t) + '</button>').join("") + '<button type="button" data-v="0" class="ns">No lo sé</button></div>';
  el.querySelector("h2").focus({ preventScroll: true });
}
function res() {
  const rows = D.parties.map((p) => { const ids = D.qs.map((x) => x.id).filter((id) => ans[id] > 0 && p.pos[id]); const pct = ids.length ? Math.round(ids.reduce((s, id) => s + 1 - Math.abs(ans[id] - p.pos[id]) / 4, 0) / ids.length * 100) : null; return { p, pct }; }).filter((r) => r.pct !== null).sort((a, b) => b.pct - a.pct || a.p.name.localeCompare(b.p.name, "es"));
  el.innerHTML = '<h2 class="mini-q" tabindex="-1">Tu coincidencia con las candidaturas de ámbito estatal</h2>' + (rows.length ? '<ol class="mini-res">' + rows.map((r) => '<li><span><i style="background:' + r.p.color + '"></i>' + esc(r.p.name) + '</span><b>' + r.pct + ' %</b></li>').join("") + '</ol>' : '<p>Has respondido «No lo sé» a todo: no hay con qué comparar.</p>') + '<p class="mini-note">Orientativo, con solo 5 preguntas. No es una recomendación de voto. Los empates se ordenan alfabéticamente. El test completo compara tus respuestas con las candidaturas de tu provincia.</p><p><a class="mini-cta" href="' + D.site + '" target="_blank" rel="noopener">Haz el test completo en test29n.es</a> <button type="button" class="mini-again">Volver a empezar</button></p>';
  el.querySelector("h2").focus({ preventScroll: true });
}
el.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.classList.contains("mini-again")) { i = 0; for (const k in ans) delete ans[k]; q(); return; }
  if (b.dataset.v === undefined) return;
  ans[D.qs[i].id] = Number(b.dataset.v); i++;
  if (i < D.qs.length) q(); else res();
});
q();
})();
`);
  writeFileSync(`${OUT}/insertar/index.html`, `${head("Mini test de 5 preguntas · Test 29N", "Mini test político de 5 preguntas del Test 29N para insertar en otras webs, sin cookies ni rastreo.", '<meta name="robots" content="noindex">\n', "/")}
<body class="mini-body">
<main class="mini-wrap"><h1 class="mini-brand"><a href="${SITE}" target="_blank" rel="noopener"><b>Test</b> 29N</a> · Mini test político · Elecciones generales del 29N</h1>
<div id="mini" aria-live="polite"><noscript><p>El mini test necesita JavaScript. <a href="${SITE}" target="_blank" rel="noopener">Haz el test completo en test29n.es</a>.</p></noscript></div>
</main>
<script src="/insertar/mini.js" defer></script>
</body>
</html>
`);
  const iframeCode = `<iframe src="${SITE}insertar/" title="Mini test político del Test 29N" width="100%" height="560" style="border:1px solid #D2D5CC;border-radius:12px;max-width:640px" loading="lazy"></iframe>`;

  // ── Provincias: escaños del real decreto y candidaturas que se presentan según los datos del test
  const provRegion = Object.fromEntries(PD.regions.flatMap((r) => r.provs.map((x) => [x.id, r.id])));
  const runsIn = (pid, prov) => { const sc = P[pid].scope, r = provRegion[prov]; if (sc.all) return !(sc.except || []).includes(r); if (sc.regions) return sc.regions.includes(r); if (sc.provinces) return sc.provinces.includes(prov); return false; };
  const localName = (pid, prov) => P[pid].local?.[provRegion[prov]] || P[pid].name;
  const provList = PD.regions.flatMap((r) => r.provs.map((x) => ({ ...x, region: r })));
  const missingSeats = provList.filter((x) => !SEATS[x.id]).map((x) => x.id);
  if (missingSeats.length) throw new Error(`Faltan escaños para: ${missingSeats.join(", ")}`);
  const inName = (pr) => (pr.id === "baleares" ? "las Illes Balears" : pr.name);
  for (const pr of provList) {
    const cands = live.filter((pid) => runsIn(pid, pr.id)), tbd = cands.filter((pid) => P[pid].tbd), n = SEATS[pr.id];
    page({
      path: `/provincias/${pr.id}/`,
      title: `Elecciones del 29N en ${inName(pr)}: escaños y candidaturas · Test 29N`,
      desc: `${pr.name} elige ${n} ${n === 1 ? "diputado" : "diputados"} el 29 de noviembre de 2026. Las ${cands.length} candidaturas que se presentan según el Test 29N, con sus posturas, y un simulador del reparto de escaños.`,
      crumbs: [{ name: "Provincias", url: `${SITE}provincias/` }, { name: pr.name, url: `${SITE}provincias/${pr.id}/` }],
      body: `<header class="sp-head"><p class="label">${esc(pr.region.name)} · Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Elecciones del 29N en ${esc(inName(pr))}</h1>
  <dl class="sp-facts"><div><dt>Diputados que elige</dt><dd><b>${n}</b> de 350</dd></div><div><dt>Senadores</dt><dd>${esc(SENATE[pr.id] || "4 senadores.")}</dd></div><div><dt>Candidaturas en el test</dt><dd>${cands.length}</dd></div></dl>
  <p class="small muted">Escaños: <a href="${SEATS_SOURCE.url}" target="_blank" rel="noopener noreferrer">${esc(SEATS_SOURCE.label)}</a>.</p></header>
${cta(`¿Con qué candidatura de ${esc(pr.name)} coincides más?`)}
<section aria-labelledby="h-cand"><h2 class="h2" id="h-cand">Candidaturas que se presentan</h2>
<p class="small muted">Según los datos del test. Las candidaturas proclamadas oficialmente se publican en el BOE el 3 de noviembre de 2026${tbd.length ? `; las marcadas «por confirmar» aún no han confirmado que se presentan` : ""}.</p>
<ul class="sp-cards">${cands.map((pid) => `<li><a href="/partidos/${pid}/">${logo(pid)}<span><b>${esc(localName(pid, pr.id))}</b><span class="small muted">${esc(P[pid].tag)}${P[pid].tbd ? " · por confirmar" : ""}</span></span></a></li>`).join("")}</ul></section>
<section aria-labelledby="h-sim"><h2 class="h2" id="h-sim">¿Cómo se reparten sus ${n} ${n === 1 ? "escaño" : "escaños"}?</h2>
<p>${n === 1 ? `En ${esc(pr.name)} se elige un solo diputado: lo gana la candidatura más votada.` : `Con la ley D'Hondt, entre las candidaturas que superan el 3 % de los votos válidos de ${esc(pr.name)}.`} Puedes probarlo con los votos que tú quieras en el <a href="/escanos/?p=${pr.id}">simulador de escaños</a>. No usa encuestas ni estimaciones.</p></section>
<p class="small muted">${pr.region.provs.length > 1 ? `Otras provincias de ${esc(pr.region.name)}: ${pr.region.provs.filter((x) => x.id !== pr.id).map((x) => `<a href="/provincias/${x.id}/">${esc(x.name)}</a>`).join(" · ")} · ` : ""}<a href="/provincias/">Todas las provincias</a></p>`
    });
  }
  page({
    path: "/provincias/",
    title: "Las 52 circunscripciones del 29N: escaños y candidaturas · Test 29N",
    desc: "Cuántos diputados elige cada provincia en las elecciones generales del 29 de noviembre de 2026 y qué candidaturas se presentan en cada una.",
    crumbs: [{ name: "Provincias", url: `${SITE}provincias/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Las 52 circunscripciones</h1>
  <p class="lede">Cada provincia elige un mínimo de dos diputados más los que le corresponden según su población; Ceuta y Melilla, uno cada una. En total, 350.</p>
  <p class="small muted">Escaños: <a href="${SEATS_SOURCE.url}" target="_blank" rel="noopener noreferrer">${esc(SEATS_SOURCE.label)}</a>.</p></header>
${PD.regions.map((r) => `<section aria-labelledby="pr-${r.id}"><h2 class="h3" id="pr-${r.id}">${esc(r.name)}</h2><ul class="prov-list">${r.provs.map((x) => `<li><a href="/provincias/${x.id}/">${esc(x.name)}</a><span class="small muted">${SEATS[x.id]} ${SEATS[x.id] === 1 ? "diputado" : "diputados"}</span></li>`).join("")}</ul></section>`).join("")}
${cta("Compara tus ideas con las candidaturas de tu provincia")}`
  });

  // ── Simulador del reparto de escaños (ley D'Hondt), con los votos que introduce cada persona
  const simData = { provs: provList.map((x) => ({ id: x.id, name: x.name, seats: SEATS[x.id], parties: live.filter((pid) => runsIn(pid, x.id)).map((pid) => ({ ab: P[pid].ab, name: localName(pid, x.id), color: P[pid].color })) })) };
  mkdirSync(`${OUT}/escanos`, { recursive: true });
  writeFileSync(`${OUT}/escanos/escanos.js`, `// Simulador del reparto de escaños (art. 163 LOREG). Todo se calcula en el navegador; no guarda ni envía nada.
(() => {
const D = ${JSON.stringify(simData)};
const $ = (s) => document.querySelector(s), esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmt = (n) => n.toLocaleString("es-ES");
// Reparto D'Hondt con barrera del 3 % de los votos válidos (votos a candidaturas + votos en blanco).
// Empates de cociente: a favor de la candidatura con más votos; si también empatan en votos, la ley manda sortear (art. 163.1.d): se avisa.
function dhondt(votes, blank, seats) {
  const valid = votes.reduce((a, v) => a + v, 0) + blank, min = valid * 0.03;
  const res = votes.map((v) => ({ v, in: v > 0 && v >= min, seats: 0 }));
  let tie = false;
  for (let k = 0; k < seats; k++) {
    let best = -1, bq = -1;
    res.forEach((r, i) => { if (!r.in) return; const q = r.v / (r.seats + 1); if (q > bq || (q === bq && r.v > res[best].v)) { bq = q; best = i; } });
    if (best < 0) break;
    if (res.some((r, i) => i !== best && r.in && r.v === res[best].v && r.v / (r.seats + 1) === bq)) tie = true;
    res[best].seats++;
  }
  return { res, valid, min, tie };
}
window.TEST29N_DHONDT = dhondt;
const sel = $("#sim-prov"), form = $("#sim-form"), out = $("#sim-out");
sel.innerHTML = D.provs.map((p) => '<option value="' + p.id + '">' + esc(p.name) + " (" + p.seats + ")</option>").join("");
const qp = new URLSearchParams(location.search).get("p"); if (qp && D.provs.some((p) => p.id === qp)) sel.value = qp; else sel.value = "madrid";
function rows(list) {
  $("#sim-rows").innerHTML = list.map((p, i) => '<div class="sim-row"><label for="v' + i + '"><i style="background:' + p.color + '"></i>' + esc(p.name) + '</label><input id="v' + i + '" type="number" inputmode="numeric" min="0" step="1" placeholder="0" data-name="' + esc(p.name) + '" data-color="' + p.color + '"></div>').join("") +
    '<div class="sim-row sim-extra"><label for="v-otros">Otras candidaturas</label><input id="v-otros" type="number" inputmode="numeric" min="0" step="1" placeholder="0" data-name="Otras candidaturas" data-color="#9AA0A6"></div>';
  out.innerHTML = ""; 
}
function prov() { return D.provs.find((p) => p.id === sel.value); }
function render(over) {
  const p = over || prov(), ins = [...$("#sim-rows").querySelectorAll("input")];
  const votes = ins.map((i) => Math.max(0, Math.floor(Number(i.value) || 0))), blank = Math.max(0, Math.floor(Number($("#v-blanco").value) || 0));
  if (!votes.some((v) => v > 0)) { out.innerHTML = '<p class="small muted">Escribe los votos de al menos una candidatura.</p>'; return; }
  const r = dhondt(votes, blank, p.seats);
  const list = ins.map((i, k) => ({ name: i.dataset.name, color: i.dataset.color, ...r.res[k] })).filter((x) => x.v > 0).sort((a, b) => b.seats - a.seats || b.v - a.v);
  out.innerHTML = '<h3 class="h3">Reparto de los ' + p.seats + ' escaños de ' + esc(p.name) + '</h3><p class="small muted">Votos válidos: ' + fmt(r.valid) + ' (incluidos ' + fmt(blank) + ' en blanco). Barrera del 3 %: ' + fmt(Math.ceil(r.min)) + ' votos.</p><table class="sim-table"><thead><tr><th scope="col">Candidatura</th><th scope="col">Votos</th><th scope="col">%</th><th scope="col">Escaños</th></tr></thead><tbody>' +
    list.map((x) => '<tr' + (x.in ? "" : ' class="out"') + '><td><i style="background:' + x.color + '"></i>' + esc(x.name) + (x.in ? "" : " <span class='small'>(no llega al 3 %)</span>") + '</td><td>' + fmt(x.v) + '</td><td>' + (x.v / r.valid * 100).toFixed(1).replace(".", ",") + '</td><td><b>' + x.seats + '</b></td></tr>').join("") + '</tbody></table>' + (r.tie ? '<p class="small"><b>Hay un empate exacto en votos.</b> La ley lo resuelve por sorteo; aquí el escaño aparece asignado provisionalmente.</p>' : '') + '<p class="small muted">Simulación matemática con tus datos: no es una estimación ni un resultado oficial.</p>';
}
sel.addEventListener("change", () => { rows(prov().parties); });
form.addEventListener("submit", (e) => { e.preventDefault(); render(); out.querySelector("h3")?.setAttribute("tabindex", "-1"); out.querySelector("h3")?.focus(); });
$("#sim-example").addEventListener("click", () => {
  // Ejemplo del propio art. 163 de la LOREG: 480.000 votos válidos y 8 escaños
  const ex = [["A", 168000], ["B", 104000], ["C", 72000], ["D", 64000], ["E", 40000], ["F", 32000]];
  $("#sim-rows").innerHTML = ex.map(([n, v], i) => '<div class="sim-row"><label for="v' + i + '">Candidatura ' + n + '</label><input id="v' + i + '" type="number" min="0" value="' + v + '" data-name="Candidatura ' + n + '" data-color="#676D79"></div>').join("");
  $("#v-blanco").value = 0;
  render({ name: "el ejemplo", seats: 8 });
  out.insertAdjacentHTML("afterbegin", '<p class="small"><b>Ejemplo de la ley electoral</b> (art. 163): 480.000 votos válidos y 8 escaños. Resultado: A, 4; B, 2; C y D, 1 cada una.</p>');
});
rows(prov().parties);
})();
`);
  page({
    path: "/escanos/",
    title: "Simulador de escaños del 29N: reparto con la ley D'Hondt · Test 29N",
    desc: "Calcula cómo se reparten los diputados de cada provincia con la ley D'Hondt y la barrera del 3 %, con los votos que tú quieras. Sin encuestas ni estimaciones.",
    crumbs: [{ name: "Simulador de escaños", url: `${SITE}escanos/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Simulador de escaños</h1>
  <p class="lede">Elige una provincia, escribe los votos que quieras para cada candidatura y mira cómo se repartirían sus diputados. No usa encuestas ni estimaciones: solo los números que introduces.</p></header>
<form id="sim-form" class="sheet sim" novalidate>
  <div class="field"><label class="label" for="sim-prov">Provincia (diputados que elige)</label><select id="sim-prov"></select></div>
  <div id="sim-rows" class="sim-rows"></div>
  <div class="sim-row sim-extra"><label for="v-blanco">Votos en blanco</label><input id="v-blanco" type="number" inputmode="numeric" min="0" step="1" placeholder="0"></div>
  <div class="actions"><button class="btn btn-primary" type="submit">Calcular el reparto</button><button class="btn btn-ghost" type="button" id="sim-example">Ver el ejemplo de la ley</button></div>
  <noscript><p>El simulador necesita JavaScript.</p></noscript>
</form>
<div id="sim-out" class="sim-out" aria-live="polite"></div>
<section aria-labelledby="h-reglas"><h2 class="h2" id="h-reglas">Cómo funciona el reparto</h2>
<ul class="dots"><li>Cada provincia elige los diputados que fija el real decreto de convocatoria (Madrid, 38; Soria, 2; Ceuta y Melilla, 1 cada una).</li>
<li>Solo entran en el reparto las candidaturas que obtienen al menos el <b>3 % de los votos válidos</b> de la provincia. Los votos válidos incluyen los votos en blanco, por eso el voto en blanco hace un poco más alta esa barrera.</li>
<li>Los votos de cada candidatura se dividen entre 1, 2, 3… hasta el número de escaños, y los escaños se asignan a los cocientes más altos (<b>ley D'Hondt</b>).</li>
<li>Si dos cocientes empatan, el escaño va a la candidatura con más votos en total; si también empatan en votos, el primer empate se resuelve por sorteo y los siguientes, de forma alternativa. El simulador te avisa si ocurre.</li>
<li>En las circunscripciones de un solo escaño, gana la candidatura más votada.</li></ul>
<p class="small muted">Reglas: <a href="${LOREG_URL}" target="_blank" rel="noopener noreferrer">Ley Orgánica del Régimen Electoral General, arts. 162 y 163</a>. Escaños: <a href="${SEATS_SOURCE.url}" target="_blank" rel="noopener noreferrer">${esc(SEATS_SOURCE.label)}</a>. Es una simulación matemática: no reproduce un resultado oficial.</p></section>
<script src="/escanos/escanos.js" defer></script>`
  });

  // ── Tests por tema: 6 o 7 preguntas de un asunto; el test se hace en la portada (/?tema=<id>)
  const Q = Object.fromEntries(B.questions.map((q) => [q.id, q]));
  for (const [k, t] of Object.entries(TOPICS)) { const miss = t.ids.filter((id) => !Q[id]); if (miss.length) throw new Error(`Test de ${t.label}: no existen ${miss.join(", ")}`); }
  const topicEntries = Object.entries(TOPICS);
  for (const [k, t] of topicEntries) {
    const qs = t.ids.map((id) => Q[id]);
    const lc = t.label.toLowerCase();
    page({
      path: `/tests/${k}/`,
      title: `Test de ${lc} para el 29N: ¿con qué partido coincides? · Test 29N`,
      desc: `${qs.length} preguntas sobre ${lc} para comparar tus ideas con las candidaturas de las elecciones generales del 29 de noviembre de 2026. Gratis, en 2 minutos y sin registro.`,
      crumbs: [{ name: "Tests por tema", url: `${SITE}tests/` }, { name: t.label, url: `${SITE}tests/${k}/` }],
      body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Test de ${esc(lc)}</h1>
  <p class="lede">${qs.length} preguntas sobre ${esc(lc)} para ver con qué candidaturas de tu provincia coincides en este tema. Tardas unos 2 minutos y después puedes seguir con el test completo sin perder tus respuestas.</p>
  <p><a class="btn btn-primary" href="/?tema=${k}">Empezar el test de ${esc(lc)}</a></p></header>
<section aria-labelledby="h-qs"><h2 class="h2" id="h-qs">Las preguntas</h2>
<ul class="dots">${qs.map((q) => `<li>${esc(q.text)}${q.type === "dilema" ? ` <span class="small muted">(A: ${esc(q.A)} · B: ${esc(q.B)})</span>` : ""} <a class="small" href="/preguntas/${q.id.toLowerCase()}/">Qué piensa cada partido</a></li>`).join("")}</ul>
<p class="small muted">El resultado de un test por tema solo tiene en cuenta estas preguntas: es orientativo y no es una recomendación de voto. Para una visión de conjunto, haz el test completo.</p></section>
<p class="small muted">Otros tests por tema: ${topicEntries.filter(([x]) => x !== k).map(([x, o]) => `<a href="/tests/${x}/">${esc(o.label)}</a>`).join(" · ")}</p>
${cta("¿Prefieres el test completo?")}`
    });
  }
  page({
    path: "/tests/",
    title: "Tests por tema para el 29N: vivienda, inmigración, impuestos y más · Test 29N",
    desc: "Tests cortos de 6 o 7 preguntas sobre vivienda, inmigración, impuestos y economía, sanidad, energía o territorio para comparar tus ideas con las candidaturas del 29N.",
    crumbs: [{ name: "Tests por tema", url: `${SITE}tests/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Tests por tema</h1>
  <p class="lede">¿Solo te interesa un asunto? Responde unas pocas preguntas sobre él y mira con qué candidaturas de tu provincia coincides. Después puedes seguir con el test completo sin perder tus respuestas.</p></header>
<ul class="sp-cards">${topicEntries.map(([k, t]) => `<li><a href="/tests/${k}/"><span><b>Test de ${esc(t.label.toLowerCase())}</b><span class="small muted">${t.ids.length} preguntas · 2 minutos</span></span></a></li>`).join("")}</ul>
${cta("O responde el test completo")}`
  });

  // ── Glosario electoral
  page({
    path: "/glosario/",
    title: "Glosario electoral del 29N: términos explicados · Test 29N",
    desc: "Qué es la ley D'Hondt, la barrera del 3 %, el voto en blanco, la jornada de reflexión o la investidura: los términos de las elecciones generales explicados de forma sencilla y con su base legal.",
    crumbs: [{ name: "Glosario", url: `${SITE}glosario/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Glosario electoral</h1>
  <p class="lede">Los términos que más se oyen en campaña, explicados en pocas palabras y con el artículo de la ley que los regula.</p></header>
<dl class="gloss">${GLOSARIO.map((g) => `<div id="${slug(g.t)}"><dt>${esc(g.t)}</dt><dd>${esc(g.d)} <span class="small muted">(<a href="${g.f[0]}" target="_blank" rel="noopener noreferrer">${esc(g.f[1])}</a>)</span></dd></div>`).join("")}</dl>
<p class="small muted">Más información práctica en <a href="/votar/">Cómo votar el 29N</a>, el <a href="/calendario/">calendario electoral</a> y el <a href="/escanos/">simulador de escaños</a>.</p>
${cta("Pon a prueba tus ideas")}`
  });

  // ── Índices
  page({
    path: "/partidos/",
    title: "Partidos y candidaturas del 29N: sus posturas, tema a tema · Test 29N",
    desc: `Qué proponen las ${live.length} candidaturas de las elecciones generales del 29 de noviembre de 2026 en vivienda, impuestos, inmigración, sanidad y otros temas, con fuentes.`,
    crumbs: [{ name: "Partidos", url: `${SITE}partidos/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Las candidaturas y sus posturas</h1>
  <p class="lede">Qué piensa cada candidatura sobre las ${B.questions.length} cuestiones del Test 29N, con sus propuestas destacadas y las fuentes de sus posturas.</p></header>
${cta("¿Con cuál coincides más?")}
<ul class="sp-cards">${live.map((pid) => { const p = P[pid]; return `<li><a href="/partidos/${pid}/">${logo(pid)}<span><b>${esc(p.name)}</b><span class="small muted">${esc(p.tag)} · ${esc(scopeText(p))}</span></span></a></li>`; }).join("")}</ul>
${PD.order.some((pid) => P[pid].out) ? `<p class="small muted">Han anunciado que no se presentan: ${PD.order.filter((pid) => P[pid].out).map((pid) => `<a href="/partidos/${pid}/">${esc(P[pid].name)}</a>`).join(", ")}.</p>` : ""}`
  });
  page({
    path: "/temas/",
    title: "Los grandes temas de las elecciones del 29N, partido a partido · Test 29N",
    desc: `Vivienda, impuestos, inmigración, sanidad, modelo territorial y más: ${B.questions.length} cuestiones con contexto neutral y la postura de cada partido para el 29N.`,
    crumbs: [{ name: "Temas", url: `${SITE}temas/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Los temas del 29N, partido a partido</h1>
  <p class="lede">${B.areas.length} áreas y ${B.questions.length} cuestiones con contexto neutral y la postura de cada candidatura.</p></header>
${cta("Responde tú y compara")}
<ul class="sp-cards">${B.areas.map((a) => `<li><a href="/temas/${slug(a.name)}/"><span class="al">${esc(a.letter)}</span><span><b>${esc(a.name)}</b><span class="small muted">${B.questions.filter((q) => q.area === a.id).length} preguntas: ${esc(B.questions.filter((q) => q.area === a.id).slice(0, 3).map((q) => q.short.toLowerCase()).join(", "))}…</span></span></a></li>`).join("")}</ul>`
  });

  // ── Guía para votar y calendario oficial: solo datos de fuentes oficiales, con su enlace (src/votar.src.mjs)
  const srcA = (f) => `<a href="${esc(f.url)}" target="_blank" rel="noopener noreferrer">${esc(f.label)}</a>`;
  const reviewed = fmtDate(VOTAR.revisado);
  const officialNote = `<p class="small muted">Información de fuentes oficiales, revisada el ${esc(reviewed)}. Ante cualquier duda, prevalece lo que digan la Junta Electoral Central y el Ministerio del Interior. Esta información no sustituye a sus comunicaciones.</p>`;
  page({
    path: "/votar/",
    title: "Cómo votar el 29N: documentos, dónde votar y voto por correo · Test 29N",
    desc: "Guía práctica para votar en las elecciones generales del 29 de noviembre de 2026: quién puede votar, qué llevar, dónde te toca, voto por correo, desde el extranjero y accesible. Con enlaces oficiales.",
    crumbs: [{ name: "Cómo votar", url: `${SITE}votar/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Cómo votar el 29N</h1>
  <p class="lede">Lo esencial para votar, explicado de forma sencilla y con el enlace a la fuente oficial de cada dato. Las fechas completas están en el <a href="/calendario/">calendario electoral</a>.</p></header>
${officialNote}
<nav class="sp-toc small" aria-label="En esta página">${VOTAR.secciones.map((x) => `<a href="#${x.id}">${esc(x.titulo)}</a>`).join(" · ")}</nav>
${VOTAR.secciones.map((x) => `<section id="${x.id}" aria-labelledby="h-${x.id}"><h2 class="h2" id="h-${x.id}">${esc(x.titulo)}</h2>${x.pasos.map((t) => `<p>${esc(t)}</p>`).join("")}${x.fuentes.length ? `<p class="small muted">Fuente oficial: ${x.fuentes.map(srcA).join(" · ")}</p>` : ""}</section>`).join("")}
${cta("¿Aún no sabes con quién coincides?")}`
  });
  page({
    path: "/calendario/",
    title: "Calendario electoral del 29N: fechas oficiales · Test 29N",
    desc: "Fechas oficiales de las elecciones generales del 29 de noviembre de 2026: voto por correo, candidaturas, campaña, jornada de reflexión, votación y constitución de las Cortes, con su fuente.",
    crumbs: [{ name: "Calendario electoral", url: `${SITE}calendario/` }],
    body: `<header class="sp-head"><p class="label">Elecciones generales del 29 de noviembre de 2026</p><h1 class="h1">Calendario electoral del 29N</h1>
  <p class="lede">Las fechas del proceso, tal y como las fijan el real decreto de convocatoria y la normativa electoral. Cada una enlaza a su fuente oficial.</p></header>
${officialNote}
<ol class="cal">${VOTAR.calendario.map((c) => `<li${c.fecha < VOTAR.revisado ? ' class="past"' : ""}><time datetime="${esc(c.fecha)}">${esc(c.cuando)}</time><div><b>${esc(c.hito)}</b>${c.nota ? `<span class="small">${esc(c.nota)}</span>` : ""}<span class="small muted">Fuente: ${srcA(c.fuente)}${c.fuente2 ? ` · ${srcA(c.fuente2)}` : ""}</span></div></li>`).join("")}</ol>
<p class="small muted">Más detalles prácticos en <a href="/votar/">Cómo votar el 29N</a>.</p>
${cta("Prepara tu voto: compara tus ideas con las candidaturas")}`
  });

  // ── Prensa y difusión
  const nSrc = B.questions.reduce((n, q) => n + Object.keys(q.src || {}).length, 0);
  const embed = `<a href="${SITE}" title="Test 29N: test político para las elecciones del 29N"><img src="${SITE}boton-test29n.png" alt="Haz el Test 29N: ¿con qué partido coincides el 29N?" width="320" height="100"></a>`;
  const embedText = `<a href="${SITE}">Test 29N</a>: test político gratuito para las elecciones generales del 29N. Compara tus respuestas con las candidaturas de tu provincia, tema a tema.`;
  page({
    path: "/prensa/",
    title: "Prensa y difusión · Test 29N",
    desc: "Información sobre el Test 29N para medios, creadores y docentes: qué es, cómo funciona, imágenes y un botón para enlazarlo desde tu web.",
    crumbs: [{ name: "Prensa", url: `${SITE}prensa/` }],
    body: `<header class="sp-head"><p class="label">Para medios, creadores y docentes</p><h1 class="h1">Prensa y difusión</h1>
  <p class="lede">El Test 29N es un test político gratuito e independiente para las elecciones generales del 29 de noviembre de 2026. Puedes citarlo, enlazarlo y usar sus imágenes libremente.</p></header>
<section aria-labelledby="h-que"><h2 class="h2" id="h-que">En pocas palabras</h2>
<ul class="dots">
  <li><b>${B.questions.length} preguntas</b> en ${B.areas.length} áreas, cada una con contexto neutral: hechos, conceptos y los argumentos de ambos lados.</li>
  <li><b>${live.length} candidaturas</b> comparadas, con las que se presentan en la provincia de cada persona.</li>
  <li><b>Perfil en siete dimensiones</b> (economía, valores, libertades, modelo territorial, inmigración, Europa y medioambiente), no una sola escala izquierda-derecha.</li>
  <li><b>Explica su resultado</b>: qué respuestas pesan, en qué coincides y discrepas con cada partido y en qué se diferencian dos partidos parecidos.</li>
  <li><b>Transparente</b>: todas las posturas son públicas, las estimadas se marcan y ${nSrc} enlazan ya su fuente (programas, votaciones, decisiones de gobierno o declaraciones).</li>
  <li><b>Privado</b>: sin registro ni cookies. Las respuestas no salen del navegador de cada persona.</li>
  <li><b>Independiente</b>: sin vínculo con ningún partido ni institución. No es una recomendación de voto.</li>
</ul></section>
<section aria-labelledby="h-guia"><h2 class="h2" id="h-guia">Guía para votar y calendario</h2>
<p>Para acompañar una noticia o un vídeo sobre las elecciones: <a href="/votar/">Cómo votar el 29N</a> (documentos, dónde votar, voto por correo, desde el extranjero y accesible) y el <a href="/calendario/">calendario electoral</a>, con enlaces a las fuentes oficiales.</p></section>
<section aria-labelledby="h-desc"><h2 class="h2" id="h-desc">Descripción para citarlo</h2>
<p class="dinfo"><b>Corta:</b> Test 29N, un test político gratuito para las elecciones generales del 29N que compara tus respuestas con las candidaturas de tu provincia, tema a tema.</p>
<p class="dinfo"><b>Larga:</b> El Test 29N plantea ${B.questions.length} cuestiones de la actualidad política española con contexto neutral y calcula, pregunta a pregunta, cuánto coinciden tus respuestas con las posturas de las candidaturas de tu provincia. Muestra tu perfil en siete dimensiones, explica qué respuestas pesan más y enlaza las fuentes de las posturas. Es gratuito, no pide registro y no guarda las respuestas fuera del navegador.</p></section>
<section aria-labelledby="h-img"><h2 class="h2" id="h-img">Imágenes</h2>
<p><a href="/og.png">Imagen de presentación (1200 × 630, PNG)</a> · <a href="/boton-test29n.png">Botón para enlazar (640 × 200, PNG)</a> · <a href="/icon-512.png">Logotipo (512 × 512, PNG)</a></p>
<p><img src="/boton-test29n.png" alt="Botón del Test 29N" width="320" height="100" loading="lazy"></p></section>
<section aria-labelledby="h-embed"><h2 class="h2" id="h-embed">Enlázalo desde tu web o blog</h2>
<p>Copia este código y pégalo en tu web. Solo es un enlace con imagen: no carga ningún script ni recoge datos de tus lectores.</p>
<pre class="embed" tabindex="0"><code>${esc(embed)}</code></pre>
<p>O inserta el <b>mini test de 5 preguntas</b>, que funciona dentro de tu página sin cookies, sin guardar nada y sin enviar las respuestas a ningún sitio (<a href="/insertar/">ver cómo queda</a>):</p>
<pre class="embed" tabindex="0"><code>${esc(iframeCode)}</code></pre>
<p>O, si prefieres un enlace de texto:</p>
<pre class="embed" tabindex="0"><code>${esc(embedText)}</code></pre></section>
<section aria-labelledby="h-met"><h2 class="h2" id="h-met">Metodología y límites</h2>
<p>La coincidencia mide cuánto se parecen las respuestas de una persona a las posturas de cada partido; no es una probabilidad de voto ni una encuesta, y el test no publica resultados agregados. Las posturas se basan en programas electorales, votaciones y declaraciones hasta el ${esc(updated)}; los programas para el 29N aún no se han publicado completos. La metodología completa está en la sección «Cómo funciona» del test.</p></section>
${owner ? `<section aria-labelledby="h-con"><h2 class="h2" id="h-con">Contacto</h2><p>${owner.name ? `Responsable: ${esc(owner.name)}. ` : ""}${owner.email ? `Correo: <a href="mailto:${esc(owner.email)}">${esc(owner.email)}</a>.` : ""}</p></section>` : ""}
${cta("Pruébalo")}`
  });
  return urls;
}
