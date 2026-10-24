// Tanda T4: páginas de las 52 circunscripciones, simulador de escaños (D'Hondt con barrera del 3 %) y glosario.
// Uso: NODE_PATH=$(npm root -g) node qa/territorio.mjs   (lee de :8766 o de SITE/BASE=https://test29n.es/)
import { createRequire } from "module";
import fs from "fs";
import { SEATS } from "../src/escanos.src.mjs";
import { GLOSARIO } from "../src/glosario.src.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const SITE = (process.env.SITE || (/^https:/.test(process.env.BASE || "") ? process.env.BASE : "http://127.0.0.1:8766/")).replace(/\/?$/, "/");
const pd = JSON.parse(fs.readFileSync(new URL("../data/partidos.json", import.meta.url)));
const fails = [], errors = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
const get = async (p) => { const r = await fetch(SITE + p); return { status: r.status, text: await r.text() }; };

console.log("Circunscripciones");
const provs = pd.regions.flatMap((r) => r.provs.map((p) => ({ ...p, region: r.id })));
ok(provs.length === 52 && Object.keys(SEATS).length === 52 && Object.values(SEATS).reduce((a, b) => a + b, 0) === 350, "52 circunscripciones y 350 diputados, como el anexo del real decreto");
ok(SEATS.madrid === 38 && SEATS.barcelona === 32 && SEATS.soria === 2 && SEATS.ceuta === 1, "Madrid 38, Barcelona 32, Soria 2, Ceuta 1");
const live = pd.order.filter((pid) => !pd.parties.find((p) => p.id === pid).out);
const runs = (pid, pr) => { const s = pd.parties.find((p) => p.id === pid).scope; if (s.all) return !(s.except || []).includes(pr.region); if (s.regions) return s.regions.includes(pr.region); if (s.provinces) return s.provinces.includes(pr.id); return false; };
let bad = [];
for (const pr of provs) {
  const r = await get(`provincias/${pr.id}/`);
  const n = live.filter((pid) => runs(pid, pr)).length;
  if (r.status !== 200 || !r.text.includes(`<b>${SEATS[pr.id]}</b> de 350`) || !r.text.includes(`<dd>${n}</dd>`) || !r.text.includes(`/escanos/?p=${pr.id}`) || (r.text.match(/<h1[\s>]/g) || []).length !== 1) bad.push(pr.id);
}
ok(!bad.length, `las 52 páginas muestran sus escaños, sus candidaturas y el enlace al simulador${bad.length ? `: fallan ${bad.join(", ")}` : ""}`);
const idx = await get("provincias/");
ok(idx.status === 200 && provs.every((p) => idx.text.includes(`href="/provincias/${p.id}/"`)), "el índice /provincias/ enlaza las 52");

console.log("Simulador de escaños");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("pageerror", (e) => errors.push(String(e)));
await page.goto(SITE + "escanos/?p=soria"); await page.waitForSelector("#sim-rows input");
ok((await page.inputValue("#sim-prov")) === "soria", "el enlace desde una provincia la deja elegida");
const r1 = await page.evaluate(() => window.TEST29N_DHONDT([168000, 104000, 72000, 64000, 40000, 32000], 0, 8).res.map((x) => x.seats));
ok(JSON.stringify(r1) === "[4,2,1,1,0,0]", `ejemplo del art. 163 de la LOREG: A 4, B 2, C 1, D 1 (${r1.join(", ")})`);
const r2 = await page.evaluate(() => { const o = window.TEST29N_DHONDT([60000, 30000, 2800], 7200, 5); return { s: o.res.map((x) => x.seats), min: o.min, in3: o.res[2].in }; });
ok(r2.in3 === false && JSON.stringify(r2.s) === "[4,1,0]", `una candidatura por debajo del 3 % de los votos válidos (con los votos en blanco) no obtiene escaño (${r2.s.join(", ")})`);
const r3 = await page.evaluate(() => window.TEST29N_DHONDT([10000, 9999], 0, 1).res.map((x) => x.seats));
ok(JSON.stringify(r3) === "[1,0]", "en circunscripciones de un escaño gana la más votada");
const r4 = await page.evaluate(() => window.TEST29N_DHONDT([300, 200, 100], 0, 4).res.map((x) => x.seats));
// 4.º escaño: empate a 100 entre A (300/3), B (200/2) y C (100/1) → lo gana A, la de más votos
ok(JSON.stringify(r4) === "[3,1,0]", `en un empate de cocientes gana la candidatura con más votos (${r4.join(", ")})`);
await page.selectOption("#sim-prov", "madrid"); await page.waitForTimeout(200);
const n = await page.locator("#sim-rows input").count();
ok(n >= 3, `al elegir Madrid aparecen sus candidaturas (${n - 1} y «Otras»)`);
await page.fill("#v0", "500000"); await page.fill("#v1", "400000"); await page.fill("#v2", "300000"); await page.fill("#v-blanco", "10000");
await page.click("#sim-form button[type=submit]"); await page.waitForSelector(".sim-table");
const seats = await page.$$eval(".sim-table tbody td:last-child b", (els) => els.map((e) => Number(e.textContent)));
ok(seats.reduce((a, b) => a + b, 0) === 38, `reparte los 38 escaños de Madrid (${seats.join(", ")})`);
ok(/no es una estimación ni un resultado oficial/.test(await page.textContent("#sim-out")), "aclara que es una simulación, no una estimación");
await page.click("#sim-example"); await page.waitForTimeout(200);
ok(/A, 4; B, 2; C y D, 1/.test(await page.textContent("#sim-out")), "el botón del ejemplo de la ley muestra su resultado");
ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), "sin scroll horizontal a 390 px");
await browser.close();

console.log("Glosario");
const g = await get("glosario/");
ok(g.status === 200 && GLOSARIO.every((x) => g.text.includes(`<dt>${x.t.replace(/'/g, "&#39;")}</dt>`)), `las ${GLOSARIO.length} definiciones aparecen`);
ok(GLOSARIO.every((x) => /^https:\/\/www\.boe\.es\//.test(x.f[0]) && x.f[1]), "cada definición enlaza su base legal en el BOE");
const home = await get("");
ok(/href="provincias\/"/.test(home.text) && /href="glosario\/"/.test(home.text), "el pie de la portada enlaza provincias y glosario");

if (errors.length) console.log("Errores:\n" + errors.join("\n"));
if (fails.length || errors.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
