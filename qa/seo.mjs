// Buscadores: título y descripción de la portada, un único H1 en cada página, preguntas frecuentes
// visibles con datos estructurados idénticos, y títulos y descripciones únicos en todas las páginas.
// Uso: node publish.mjs && NODE_PATH=$(npm root -g) node qa/seo.mjs
//   Lee dist/ (DIST para otra carpeta). Con BASE comprueba además la portada servida en esa URL.
import { createRequire } from "module";
import fs from "fs";
import path from "path";
const require = createRequire(import.meta.url);
const ROOT = new URL("../", import.meta.url).pathname;
const DIST = process.env.DIST || ROOT + "dist/";
const BASE = process.env.BASE || "http://127.0.0.1:8766/";
const fails = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const unesc = (s) => s.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
const strip = (h) => unesc(h.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

const pages = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) pages.push(p); } })(DIST);
const info = pages.map((p) => {
  const html = fs.readFileSync(p, "utf8");
  return {
    rel: "/" + path.relative(DIST, p).replace(/index\.html$/, ""),
    html,
    title: unesc((/<title>([^<]*)<\/title>/.exec(html) || [])[1] || "").trim(),
    desc: unesc((/<meta name="description" content="([^"]*)"/.exec(html) || [])[1] || "").trim(),
    h1: (html.match(/<h1[\s>]/g) || []).length,
    ld: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]),
  };
});

console.log("Portada");
const home = info.find((x) => x.rel === "/");
ok(home.title === "Test político 2026: ¿con qué partido coincides? · Elecciones 29N", `título de la portada (${home.title})`);
ok(/test político/i.test(home.desc) && /elecciones generales 2026/i.test(home.desc) && /a quién votar/i.test(home.desc), "la descripción incluye «test político», «elecciones generales 2026» y «a quién votar»");
ok(/no te dice a quién votar/i.test(home.desc) && !/\bvota (a|al|por)\b|te recomendamos|debes votar/i.test(home.desc), "la descripción no recomienda voto");
ok(home.desc.length >= 70 && home.desc.length <= 170, `descripción de longitud razonable (${home.desc.length} caracteres)`);
ok(home.h1 === 1, `un único H1 en la portada, incluido el aviso sin JavaScript (${home.h1})`);
ok(!/<noscript>[\s\S]*<h1[\s\S]*<\/noscript>/.test(home.html), "el aviso sin JavaScript no es un H1");
for (const k of ["og:title", "twitter:title"]) ok(new RegExp(`(property|name)="${k}" content="${home.title.replace(/[?·]/g, ".")}"`).test(home.html), `${k} coincide con el título`);

console.log("Preguntas frecuentes");
const items = [...home.html.matchAll(/<div class="faq-item"><h3 class="h3">([\s\S]*?)<\/h3><p>([\s\S]*?)<\/p><\/div>/g)].map((m) => ({ q: strip(m[1]), a: strip(m[2]), raw: m[2] }));
ok(items.length === 5, `5 preguntas frecuentes en el HTML estático (${items.length})`);
const need = [/cuándo son las elecciones/i, /cómo funciona/i, /neutral/i, /a quién votar/i, /guarda mis datos/i];
ok(need.every((r) => items.some((i) => r.test(i.q))), "cubren fecha, funcionamiento, neutralidad, a quién votar y datos");
const date = items.find((i) => /cuándo/i.test(i.q));
ok(date && /29 de noviembre de 2026/.test(date.a) && /boe\.es\/diario_boe\/txt\.php\?id=BOE-A-2026-20742/.test(date.raw), "la fecha enlaza al real decreto de convocatoria en el BOE");
const vote = items.find((i) => /a quién votar/i.test(i.q));
ok(vote && /^No\./.test(vote.a) && /coincid/i.test(vote.a), "«¿Me dice a quién votar?»: no, muestra coincidencias");
const data = items.find((i) => /datos/i.test(i.q));
ok(data && /navegador/.test(data.a) && /cookies/.test(data.a) && !/sexo|edad\b/i.test(data.a.replace("no se pide ningún dato personal", "")), "la respuesta sobre datos coincide con el aviso de privacidad");
const how = items.find((i) => /cómo funciona/i.test(i.q));
const nQ = JSON.parse(fs.readFileSync(ROOT + "data/preguntas.json", "utf8")).questions.length;
const counts = [...home.html.matchAll(/data-count="(rapida|expres|media|completa)">(\d+)</g)].reduce((o, m) => ({ ...o, [m[1]]: m[2] }), {});
ok(how && how.a.includes(`${counts.rapida}, ${counts.expres}, ${counts.media} y ${nQ} preguntas`), `las cifras de versiones coinciden con el test (${counts.rapida}, ${counts.expres}, ${counts.media}, ${nQ})`);
const faqLd = home.ld.map((s) => JSON.parse(s)).find((d) => d["@type"] === "FAQPage");
ok(!!faqLd && faqLd.mainEntity.length === items.length, "datos estructurados FAQPage con todas las preguntas");
ok(faqLd && faqLd.mainEntity.every((e, i) => e["@type"] === "Question" && e.name === items[i].q && e.acceptedAnswer?.["@type"] === "Answer" && e.acceptedAnswer.text === items[i].a), "los datos estructurados repiten exactamente el texto visible");

console.log("Todas las páginas");
const indexable = info.filter((x) => !/<meta name="robots" content="noindex">/.test(x.html));
ok(info.every((x) => x.title && x.desc), `todas las páginas tienen título y descripción (${info.length})`);
const dup = (k) => { const seen = {}; for (const x of info) (seen[x[k]] ||= []).push(x.rel); return Object.entries(seen).filter(([, v]) => v.length > 1); };
const dt = dup("title"), dd = dup("desc");
ok(!dt.length, `títulos únicos${dt.length ? `: repetidos ${JSON.stringify(dt).slice(0, 300)}` : ""}`);
ok(!dd.length, `descripciones únicas${dd.length ? `: repetidas ${JSON.stringify(dd).slice(0, 300)}` : ""}`);
ok(info.every((x) => x.h1 === 1), `un único H1 por página${info.filter((x) => x.h1 !== 1).map((x) => ` ${x.rel}(${x.h1})`).join("")}`);
let ldOk = true; for (const x of info) for (const s of x.ld) { try { JSON.parse(s); } catch { ldOk = false; console.log("    JSON-LD no válido en", x.rel); } }
ok(ldOk, "todos los datos estructurados son JSON válido");
const sitemap = fs.readFileSync(DIST + "sitemap.xml", "utf8");
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
ok(indexable.every((x) => locs.includes(x.rel)) && locs.length === indexable.length, `el sitemap recoge todas las páginas indexables (${locs.length})`);
// Indexación: ninguna página huérfana y fechas reales de modificación
{
  const depth = new Map([["/", 0]]), queue = ["/"];
  while (queue.length) { const r = queue.shift(); const f = DIST + r.slice(1) + "index.html"; if (!fs.existsSync(f)) continue;
    for (const m of fs.readFileSync(f, "utf8").matchAll(/href="([^"#?]+)"/g)) { let u; try { u = new URL(m[1], "https://x.test" + r).pathname; } catch { continue; }
      if (!u.endsWith("/") || depth.has(u)) continue; depth.set(u, depth.get(r) + 1); queue.push(u); } }
  const far = locs.filter((l) => !(depth.get(l) <= 3));
  ok(!far.length, `todas las páginas del sitemap se alcanzan desde la portada en 3 clics o menos${far.length ? `: no ${far.slice(0, 5).join(" ")}` : ""}`);
  const lms = [...sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]), today = new Date().toISOString().slice(0, 10);
  const lmf = JSON.parse(fs.readFileSync(ROOT + "src/lastmod.json", "utf8"));
  ok(lms.length === locs.length && lms.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= today) && locs.every((l) => lmf[l]), "cada página del sitemap lleva su fecha real de modificación (src/lastmod.json)");
  const bank = JSON.parse(fs.readFileSync(ROOT + "data/preguntas.json", "utf8")), [y, mo, d] = bank.updated.split("-").map(Number);
  const M = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  ok(fs.readFileSync(DIST + "index.html", "utf8").includes(`actualizadas el ${d} de ${M[mo - 1]} de ${y}`), "el pie de la portada muestra la fecha real de los datos");
}

if (process.env.SKIP_BROWSER !== "1") {
  console.log("Portada servida");
  const { chromium } = require("playwright");
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto(BASE); await p.waitForSelector("#start-btn:not([disabled])", { state: "attached" });
  ok((await p.title()) === home.title, "el navegador muestra el título nuevo");
  await p.locator("#faq").scrollIntoViewIfNeeded();
  ok(await p.isVisible("#faq .faq-item:nth-child(5) p"), "las preguntas frecuentes se ven en la portada (390 px)");
  ok((await p.locator("h1:visible").count()) === 1, "un único H1 visible");
  await b.close();
}

if (fails.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
