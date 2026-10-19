// Páginas estáticas para buscadores y para compartir: una por candidatura, una por tema, sus índices y la
// página de prensa. Se generan con los mismos datos que el test (data/*.json): nada se escribe a mano, las
// posturas estimadas se marcan como tales y las desconocidas no se rellenan.
import { readFileSync, writeFileSync, mkdirSync } from "fs";

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
  <p class="muted"><a href="/partidos/">Partidos</a> · <a href="/temas/">Temas</a> · <a href="/prensa/">Prensa</a> · Datos actualizados el ${esc(updated)}</p>
</div></footer>
${statsJs ? `<script src="/assets/stats.js?v=${statsJs}" defer></script>` : ""}`;
  const cta = (t) => `<aside class="cta-box"><p class="h3">${t}</p><p>Responde el test en 5, 10 o 20 minutos y compara tus respuestas con las candidaturas de tu provincia, pregunta a pregunta. Gratis, sin registro y sin que tus respuestas salgan de tu navegador.</p><p><a class="btn btn-primary" href="/">Hacer el test</a></p></aside>`;
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

  // ── Una página por tema
  for (const a of B.areas) {
    const qs = B.questions.filter((q) => q.area === a.id);
    const items = qs.map((q) => {
      const cols = [1, 2, 3, 4, 5].map((n) => { const ps = live.filter((pid) => q.pos[pid] === n);
        return `<div class="pc5"><span>${n} · ${esc(q.type === "dilema" ? DIL[n - 1] : LIK[n - 1])}</span><span class="chips">${ps.map((pid) => `<a class="chip${q.est.includes(pid) ? " est" : ""}" href="/partidos/${pid}/" title="${esc(P[pid].name)}${q.est.includes(pid) ? " · estimada" : ""}"><i class="sw" style="background:${P[pid].color}"></i>${esc(P[pid].ab)}</a>`).join("")}</span></div>`; }).join("");
      const unk = live.filter((pid) => !q.pos[pid]);
      const notes = Object.entries(q.notes || {}).filter(([pid]) => live.includes(pid));
      const srcs = Object.entries(q.src || {}).filter(([pid]) => live.includes(pid));
      return `<article class="exq" id="${q.id}"><p class="q-meta"><span class="q-code">${qCode(q)}</span></p><h2 class="sp-qh">${esc(q.text)}</h2>${q.type === "dilema" ? `<p class="small">A: ${esc(q.A)} · B: ${esc(q.B)}</p>` : ""}
        <p class="dinfo">${esc(q.ctx)}${q.ley ? ` <b>Marco legal:</b> ${esc(q.ley)}.` : ""}</p>
        <div class="pos5">${cols}</div>
        ${notes.length ? `<ul class="pos-notes">${notes.map(([pid, t]) => `<li><b>${esc(P[pid].ab)}:</b> ${esc(t)}</li>`).join("")}</ul>` : ""}
        ${srcs.length ? `<p class="unk">Fuentes: ${srcs.map(([pid]) => `${esc(P[pid].ab)} · ${srcHTML(q, pid)}`).join(" · ")}.</p>` : ""}
        ${unk.length ? `<p class="unk">Sin postura conocida: ${unk.map((pid) => esc(P[pid].ab)).join(", ")}.</p>` : ""}</article>`;
    }).join("");
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
<section aria-labelledby="h-desc"><h2 class="h2" id="h-desc">Descripción para citarlo</h2>
<p class="dinfo"><b>Corta:</b> Test 29N, un test político gratuito para las elecciones generales del 29N que compara tus respuestas con las candidaturas de tu provincia, tema a tema.</p>
<p class="dinfo"><b>Larga:</b> El Test 29N plantea ${B.questions.length} cuestiones de la actualidad política española con contexto neutral y calcula, pregunta a pregunta, cuánto coinciden tus respuestas con las posturas de las candidaturas de tu provincia. Muestra tu perfil en siete dimensiones, explica qué respuestas pesan más y enlaza las fuentes de las posturas. Es gratuito, no pide registro y no guarda las respuestas fuera del navegador.</p></section>
<section aria-labelledby="h-img"><h2 class="h2" id="h-img">Imágenes</h2>
<p><a href="/og.png">Imagen de presentación (1200 × 630, PNG)</a> · <a href="/boton-test29n.png">Botón para enlazar (640 × 200, PNG)</a> · <a href="/icon-512.png">Logotipo (512 × 512, PNG)</a></p>
<p><img src="/boton-test29n.png" alt="Botón del Test 29N" width="320" height="100" loading="lazy"></p></section>
<section aria-labelledby="h-embed"><h2 class="h2" id="h-embed">Enlázalo desde tu web o blog</h2>
<p>Copia este código y pégalo en tu web. Solo es un enlace con imagen: no carga ningún script ni recoge datos de tus lectores.</p>
<pre class="embed" tabindex="0"><code>${esc(embed)}</code></pre>
<p>O, si prefieres un enlace de texto:</p>
<pre class="embed" tabindex="0"><code>${esc(embedText)}</code></pre></section>
<section aria-labelledby="h-met"><h2 class="h2" id="h-met">Metodología y límites</h2>
<p>La coincidencia mide cuánto se parecen las respuestas de una persona a las posturas de cada partido; no es una probabilidad de voto ni una encuesta, y el test no publica resultados agregados. Las posturas se basan en programas electorales, votaciones y declaraciones hasta el ${esc(updated)}; los programas para el 29N aún no se han publicado completos. La metodología completa está en la sección «Cómo funciona» del test.</p></section>
${owner ? `<section aria-labelledby="h-con"><h2 class="h2" id="h-con">Contacto</h2><p>${owner.name ? `Responsable: ${esc(owner.name)}. ` : ""}${owner.email ? `Correo: <a href="mailto:${esc(owner.email)}">${esc(owner.email)}</a>.` : ""}</p></section>` : ""}
${cta("Pruébalo")}`
  });
  return urls;
}
