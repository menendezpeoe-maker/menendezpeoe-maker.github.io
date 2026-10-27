// Tanda T8: justificaciones visibles, aviso de errores, /correcciones/, /sobre/ y /metodologia/.
// Uso: node qa/confianza.mjs   (lee de :8766 o de SITE/BASE=https://test29n.es/)
import fs from "fs";
const SITE = (process.env.SITE || (/^https:/.test(process.env.BASE || "") ? process.env.BASE : "http://127.0.0.1:8766/")).replace(/\/?$/, "/");
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const corr = JSON.parse(fs.readFileSync(new URL("../src/correcciones.json", import.meta.url)));
const meth = JSON.parse(fs.readFileSync(new URL("../src/metodologia.json", import.meta.url)));
const fails = []; const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const get = async (p) => { const r = await fetch(SITE + p); return { status: r.status, text: await r.text() }; };
const h1 = (t) => (t.match(/<h1[\s>]/g) || []).length === 1;
console.log("Justificaciones y avisos de error");
const q = bank.questions.find((x) => Object.keys(x.why || {}).length > 3);
const qp = await get(`preguntas/${q.id.toLowerCase()}/`);
ok(qp.status === 200 && qp.text.includes("Por qué piensa así cada partido") && qp.text.includes("mailto:menendezpeoe@gmail.com?subject="), `la página de ${q.id} muestra las justificaciones y el enlace «¿Ves un error?»`);
const pid = Object.keys(q.why)[0], party = await get(`partidos/${pid}/`);
ok(party.text.includes(q.why[pid].replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]))) && party.text.includes("¿Ves un error?"), `la página del partido (${pid}) muestra su justificación y el aviso de error`);
const norm = (t) => t.replace(/[.\s]+$/, "").toLowerCase();
const dup = bank.questions.flatMap((x) => Object.keys(x.why || {}).filter((p) => x.notes?.[p] && norm(x.why[p]) === norm(x.notes[p])).map((p) => [x, p]))[0];
if (dup) { const [dq, dp] = dup; const page = await get(`preguntas/${dq.id.toLowerCase()}/`); const t = dq.why[dp].replace(/[.\s]+$/, "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  ok(page.text.split(t).length - 1 === 1, `si la nota repite la justificación, se muestra una sola vez (${dq.id}/${dp})`); }
const csv = await get("datos/posturas.csv");
ok(csv.text.split(/\r?\n/)[0].includes("justificacion"), "los datos abiertos incluyen la justificación");
console.log("Páginas de confianza");
const c = await get("correcciones/");
ok(c.status === 200 && h1(c.text) && (c.text.match(/<time /g) || []).length === corr.length, `/correcciones/ lista los ${corr.length} cambios del historial`);
const s = await get("sobre/");
ok(s.status === 200 && h1(s.text) && /«Dery»/.test(s.text) && /aportaciones voluntarias/.test(s.text) && /correcciones/.test(s.text), "/sobre/ explica quién lo hace (Dery), cómo se financia y cómo se corrige");
const priv = (process.env.PRIVATE_TERMS || "").split(",").filter(Boolean);
ok(!priv.some((t) => (s.text + c.text).toLowerCase().includes(t.toLowerCase())), "ningún término privado en /sobre/ ni en /correcciones/");
const m = await get("metodologia/");
ok(m.status === 200 && h1(m.text) && m.text.includes(`<b>${meth.imitacion.primero} de ${meth.imitacion.total}</b>`) && m.text.includes(`${meth.aleatorios.n} perfiles`), "/metodologia/ muestra las cifras generadas por qa/metodologia.mjs");
const home = await get(""), sm = await get("sitemap.xml");
ok(/href="metodologia\/"/.test(home.text) && /href="sobre\/"/.test(home.text) && ["correcciones/", "sobre/", "metodologia/"].every((p) => sm.text.includes(p + "</loc>")), "enlazadas desde el pie y en el sitemap");
if (fails.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
