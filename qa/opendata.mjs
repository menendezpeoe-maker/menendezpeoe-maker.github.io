// Tanda T9 (parte 2): comparativas dos a dos, datos abiertos (CSV y JSON) y mini test insertable.
// Uso: NODE_PATH=$(npm root -g) node qa/opendata.mjs   (sirve dist/ en :8766; SITE o BASE=https://test29n.es/ para la web real)
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const SITE = (process.env.SITE || (/^https:/.test(process.env.BASE || "") ? process.env.BASE : "http://127.0.0.1:8766/")).replace(/\/?$/, "/");
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const fails = [], errors = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const get = async (p) => { const r = await fetch(SITE + p.replace(/^\//, "")); return { status: r.status, text: await r.text(), type: r.headers.get("content-type") || "" }; };
const side = (v) => (v < 3 ? -1 : v > 3 ? 1 : 0);

console.log("Comparativas dos a dos");
const idx = await get("comparar/");
const pairs = [...idx.text.matchAll(/href="\/comparar\/([a-z]+)-([a-z]+)\/"/g)].map((m) => [m[1], m[2]]);
ok(idx.status === 200 && pairs.length >= 10, `índice /comparar/ con ${pairs.length} parejas`);
for (const [a, b] of pairs) {
  const r = await get(`comparar/${a}-${b}/`);
  const both = bank.questions.filter((q) => q.pos[a] && q.pos[b]);
  const opp = both.filter((q) => side(q.pos[a]) && side(q.pos[b]) && side(q.pos[a]) !== side(q.pos[b])).length;
  const same = both.filter((q) => q.pos[a] === q.pos[b]).length;
  const okPage = r.status === 200 && (r.text.match(/<h1[\s>]/g) || []).length === 1 && r.text.includes(`Donde chocan (${opp})`) && r.text.includes(`Donde coinciden del todo (${same})`) && r.text.includes(`${both.length} cuestiones`);
  if (!okPage) fails.push(`comparativa ${a}-${b} no cuadra con los datos`);
}
ok(!fails.some((f) => f.startsWith("comparativa")), "cada comparativa cuadra con los datos (cuestiones, choques y coincidencias)");

console.log("Datos abiertos");
const known = bank.questions.reduce((n, q) => n + pd.order.filter((pid) => q.pos[pid]).length, 0);
const csv = await get("datos/posturas.csv"), json = await get("datos/posturas.json"), page = await get("datos/");
const lines = csv.text.replace(/^﻿/, "").trim().split(/\r\n/);
ok(csv.status === 200 && lines[0].startsWith("pregunta_id,area,pregunta"), "CSV disponible con cabecera");
let parsed = 0; try { const d = JSON.parse(json.text); parsed = d.posturas.length; ok(/CC BY 4\.0/.test(d.licencia) && d.actualizado === bank.updated, "JSON con licencia CC BY 4.0 y fecha de actualización"); } catch { ok(false, "JSON válido"); }
ok(parsed === known, `JSON con todas las posturas conocidas (${parsed} de ${known})`);
ok(lines.length - 1 === known, `CSV con una fila por postura conocida (${lines.length - 1})`);
ok(page.status === 200 && /CC BY 4\.0/.test(page.text) && /posturas\.csv/.test(page.text) && /posturas\.json/.test(page.text), "la página /datos/ enlaza las descargas y explica la licencia");
const srcRows = JSON.parse(json.text).posturas.filter((r) => r.fuente_url).length;
const srcKnown = bank.questions.reduce((n, q) => n + Object.keys(q.src || {}).filter((pid) => q.pos[pid]).length, 0);
ok(srcRows === srcKnown, `las fuentes enlazadas se conservan (${srcRows})`);

console.log("Mini test insertable");
const press = await get("prensa/");
ok(/&lt;iframe src=&quot;[^&]*insertar\//.test(press.text), "/prensa/ ofrece el código del iframe para copiar");
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 640, height: 560 } });
const outside = new Set();
const host = new URL(SITE).host;
ctx.on("request", (r) => { const u = new URL(r.url()); if (/^https?:$/.test(u.protocol) && u.host !== host) outside.add(u.host); });
const p = await ctx.newPage();
p.on("pageerror", (e) => errors.push(String(e)));
// Dentro de un marco, como en una web ajena
await p.setContent(`<!doctype html><html><body style="margin:0"><iframe id="f" src="${SITE}insertar/" style="width:620px;height:540px;border:0"></iframe></body></html>`);
const f = await (await p.waitForSelector("#f")).contentFrame();
await f.waitForSelector("#mini button[data-v]");
ok((await f.textContent("#mini .mini-prog")).includes("1 de 5"), "funciona dentro de un iframe y tiene 5 preguntas");
for (let k = 0; k < 5; k++) { await f.click(`#mini button[data-v="${[4, 2, 5, 1, 3][k]}"]`); await p.waitForTimeout(120); }
const res = await f.$$eval("#mini .mini-res li b", (els) => els.map((e) => parseInt(e.textContent)));
ok(res.length >= 5 && res.every((v, i) => i === 0 || res[i - 1] >= v), `muestra la coincidencia ordenada con las candidaturas estatales (${res.join(", ")})`);
ok(/No es una recomendación de voto/.test(await f.textContent("#mini")), "aclara que no es una recomendación de voto");
const cta = await f.$eval("#mini .mini-cta", (a) => ({ href: a.href, target: a.target }));
ok(cta.target === "_blank" && cta.href.startsWith(SITE.replace(/\/$/, "")) || cta.href === "https://test29n.es/", "el enlace al test completo se abre en otra pestaña");
const stored = await f.evaluate(() => { try { return localStorage.length; } catch { return 0; } });
ok(stored === 0 && (await ctx.cookies()).length === 0, "no guarda nada ni usa cookies");
ok(outside.size === 0, `ninguna petición a terceros${outside.size ? `: ${[...outside].join(", ")}` : ""}`);
await f.click("#mini .mini-again");
ok((await f.textContent("#mini .mini-prog")).includes("1 de 5"), "«Volver a empezar» reinicia el mini test");
await browser.close();

if (errors.length) console.log("Errores:\n" + errors.join("\n"));
if (fails.length || errors.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
