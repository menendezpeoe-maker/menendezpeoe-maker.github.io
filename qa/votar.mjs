// Tanda T3: guía para votar (/votar/) y calendario electoral (/calendario/), solo con fuentes oficiales enlazadas.
// Uso: node qa/votar.mjs   (lee de :8766 o de SITE/BASE=https://test29n.es/)
import { VOTAR } from "../src/votar.src.mjs";
const SITE = (process.env.SITE || (/^https:/.test(process.env.BASE || "") ? process.env.BASE : "http://127.0.0.1:8766/")).replace(/\/?$/, "/");
const fails = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const get = async (p) => { const r = await fetch(SITE + p); return { status: r.status, text: await r.text() }; };
const OFFICIAL = ["boe.es", "juntaelectoralcentral.es", "ine.es", "ine.gob.es", "interior.gob.es", "correos.es", "exteriores.gob.es", "lamoncloa.gob.es", "congreso.es"];
const isOfficial = (u) => { const h = new URL(u).hostname; return OFFICIAL.some((d) => h === d || h.endsWith("." + d)); };

console.log("Datos (src/votar.src.mjs)");
const all = [...VOTAR.calendario.map((c) => c.fuente), ...VOTAR.secciones.flatMap((s) => s.fuentes)];
ok(all.length && all.every((f) => f.url && f.label && isOfficial(f.url)), "todas las fuentes son oficiales y tienen enlace");
ok(VOTAR.calendario.every((c, i) => i === 0 || VOTAR.calendario[i - 1].fecha <= c.fecha), "el calendario está en orden cronológico");
const has = (re) => VOTAR.calendario.some((c) => re.test(`${c.cuando} ${c.hito}`));
ok(has(/29 de noviembre.*votación/i) && has(/13 – 27 nov.*Campaña/) && has(/28 de noviembre.*reflexión/i) && has(/19 nov.*voto por correo/i) && has(/23 de diciembre.*Cortes/), "incluye votación, campaña, reflexión, plazo del voto por correo y constitución de las Cortes");
ok(["quien", "donde", "correo", "extranjero", "accesible"].every((id) => VOTAR.secciones.some((s) => s.id === id && s.pasos.length && s.fuentes.length)), "la guía cubre quién vota, dónde, por correo, desde el extranjero y accesible, con fuentes");

console.log("Páginas");
const v = await get("votar/"), c = await get("calendario/");
ok(v.status === 200 && (v.text.match(/<h1[\s>]/g) || []).length === 1 && VOTAR.secciones.every((s) => v.text.includes(`id="${s.id}"`)), "/votar/ responde con todas sus secciones");
ok(c.status === 200 && (c.text.match(/<li[ >]/g) || []).length >= VOTAR.calendario.length && c.text.includes("Jornada de votación"), "/calendario/ responde con todas las fechas");
ok(/fuentes oficiales, revisada el 23 de octubre de 2026/.test(v.text) && /no sustituye/.test(c.text), "indican la fecha de revisión y que no sustituyen a la información oficial");
const links = [...(v.text + c.text).matchAll(/href="(https?:[^"]+)"/g)].map((m) => m[1].replace(/&amp;/g, "&")).filter((u) => !u.startsWith(SITE) && !u.includes("test29n.es"));
ok(links.length > 0 && links.every(isOfficial), `todos los enlaces externos son oficiales (${links.length})`);

console.log("Enlaces desde la web");
const home = await get(""), press = await get("prensa/"), sitemap = await get("sitemap.xml"), party = await get("partidos/psoe/");
ok(/href="votar\/"/.test(home.text) && /href="calendario\/"/.test(home.text), "el pie de la portada enlaza la guía y el calendario");
ok(/href="\/votar\/"/.test(party.text) && /href="\/calendario\/"/.test(party.text), "el pie de las páginas estáticas los enlaza");
ok(/href="\/votar\/"/.test(press.text) && /href="\/calendario\/"/.test(press.text), "/prensa/ los enlaza");
ok(/votar\/<\/loc>/.test(sitemap.text) && /calendario\/<\/loc>/.test(sitemap.text), "están en el sitemap");

if (fails.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
