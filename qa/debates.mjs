// /debates/ (14 nov, OK del titular): agenda por fecha y archivo de emitidos en orden inverso, con rótulos Debate/Entrevista,
// estado Confirmado/Propuesta/Emitido, etiqueta de grabación y botón «Ver grabación»/«Escuchar», fuente y fecha de comprobación.
// Datos (sin navegador): fichas completas, ids únicos, sin duplicados (misma fecha y mismo título o URL), hora HH:MM, emitidos con
// grabación, sin valoraciones. Página (360, 390 y 1280): orden, botones, enlaces externos en otra pestaña, sin desbordar, contraste.
// Uso: NODE_PATH=$(npm root -g) node qa/debates.mjs   (servidor :8766 con dist/; BASE para la web real)
import { createRequire } from "module";
import { DEBATES } from "../src/debates.src.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const URL_ = new URL("debates/", process.env.BASE || "http://127.0.0.1:8766/").href;
const fails = [], errors = [];
const ok = (c, m) => { if (!c) fails.push(m); console.log(c ? "  ✓" : "  ✗", m); };
const L = DEBATES.lista, iso = /^\d{4}-\d{2}-\d{2}$/;
console.log("Datos");
ok(iso.test(DEBATES.revisado), `revisado: ${DEBATES.revisado}`);
const bad = L.filter((d) => !d.id || !["debate", "entrevista"].includes(d.tipo) || !["confirmado", "propuesta", "emitido"].includes(d.estado) || !d.titulo || !d.medio || !d.ambito || !d.participantes || !d.contexto || !iso.test(d.verificado || "") || !d.fuentes?.length || d.fuentes.some(([u, l]) => !/^https:\/\//.test(u) || !l) || (d.fecha ? !iso.test(d.fecha) : !d.fechaTexto) || (d.hora && !/^([01]\d|2[0-3]):[0-5]\d$/.test(d.hora)));
ok(!bad.length, `todas las fichas completas (tipo, estado, título, medio, ámbito, participantes, contexto, comprobación, fuente https, fecha y hora válidas)${bad.length ? ": " + bad.map((d) => d.id).join(", ") : ""}`);
const ids = L.map((d) => d.id); ok(new Set(ids).size === ids.length, "ids únicos");
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const dupT = L.filter((d, i) => d.fecha && L.findIndex((x) => x.fecha && x.fecha === d.fecha && norm(x.titulo) === norm(d.titulo)) !== i);
const urls = L.filter((d) => d.grabacion).map((d) => d.grabacion.url), dupU = urls.filter((u, i) => urls.indexOf(u) !== i);
ok(!dupT.length && !dupU.length, `sin duplicados (misma fecha y título, o misma grabación)${dupT.concat(dupU).length ? ": " + [...dupT.map((d) => d.id), ...dupU].join(", ") : ""}`);
const em = L.filter((d) => d.estado === "emitido");
ok(em.every((d) => d.fecha && d.grabacion && /^https:\/\//.test(d.grabacion.url) && ["video", "audio"].includes(d.grabacion.formato) && ["completa", "programa", "fragmento"].includes(d.grabacion.alcance)), `los ${em.length} emitidos tienen fecha y grabación con formato y alcance`);
ok(L.filter((d) => d.estado !== "emitido").every((d) => !d.grabacion), "los no emitidos no tienen grabación");
ok(L.every((d) => (d.contexto.match(/[.!?](\s|$)/g) || []).length <= 2), "contexto de 1–2 frases");
const VAL = /ganador|ganó|gana el debate|perdedor|perdió el debate|arrasa|humill|zasca|brillante|desastros|vergonz/i;
ok(!L.some((d) => VAL.test(d.contexto + d.titulo)), "sin valoraciones en títulos ni contexto");
const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date());
const stale = L.filter((d) => d.estado !== "emitido" && d.fecha && d.fecha < today);
console.log(stale.length ? `  · Aviso: fecha pasada sin marcar como emitido (la revisión diaria debe comprobarlo): ${stale.map((d) => d.id).join(", ")}` : "  · Sin fichas con fecha pasada pendientes");
console.log("Página");
const browser = await chromium.launch();
for (const [w, h] of [[360, 780], [390, 844], [1280, 900]]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, ...(w < 500 ? { hasTouch: true, isMobile: true } : {}) });
  const page = await ctx.newPage(); page.on("pageerror", (e) => errors.push(`${w}: ${e}`));
  const r = await page.goto(URL_); ok(r.ok(), `${w}: /debates/ responde ${r.status()}`);
  const info = await page.evaluate(() => {
    const sec = (id) => [...document.querySelectorAll(`[aria-labelledby="${id}"] .db-item`)];
    const fecha = (li) => li.id;
    return { next: sec("h-db-next").map(fecha), past: sec("h-db-past").map(fecha), ov: document.documentElement.scrollWidth > innerWidth + 1,
      btns: [...document.querySelectorAll(".db-btns a")].map((a) => ({ t: a.firstChild.textContent.trim(), tg: a.target, rel: a.rel, h: Math.round(a.getBoundingClientRect().height) })),
      ext: [...document.querySelectorAll("main a[href^='http']")].filter((a) => a.target !== "_blank" || !/noopener/.test(a.rel)).length,
      iframes: document.querySelectorAll("iframe, video, audio").length,
      hasCsp: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
      priv: !!document.querySelector('footer a[href*="metodologia"], footer a[href*="sobre"]') };
  });
  const byId = Object.fromEntries(L.map((d) => [d.id, d]));
  const nextOk = info.next.every((id, i, a) => !i || (byId[a[i - 1]].fecha || "9999") <= (byId[id].fecha || "9999"));
  const pastOk = info.past.every((id, i, a) => !i || byId[a[i - 1]].fecha >= byId[id].fecha);
  ok(info.next.length + info.past.length === L.length && info.past.length === em.length && nextOk && pastOk, `${w}: próximos por fecha (${info.next.length}) y emitidos del más reciente al más antiguo (${info.past.length})`);
  ok(info.btns.length === em.length && info.btns.every((b) => /^(Ver grabación|Escuchar)$/.test(b.t) && b.tg === "_blank" && /noopener/.test(b.rel) && b.h >= 44), `${w}: un botón «Ver grabación»/«Escuchar» por emitido, en otra pestaña y de ≥ 44 px`);
  const audio = L.filter((d) => d.grabacion?.formato === "audio").length;
  ok(info.btns.filter((b) => b.t === "Escuchar").length === audio, `${w}: «Escuchar» solo en audios (${audio})`);
  ok(!info.ext && !info.iframes && info.hasCsp, `${w}: enlaces externos con noopener, sin vídeos incrustados y con la CSP de siempre`);
  ok(!info.ov, `${w}: sin desplazamiento horizontal`);
  const txt = await page.innerText("main");
  ok(/Entrevista/.test(txt) && /Debate/.test(txt) && /Confirmado/.test(txt) && /Emitido/.test(txt) && /grabación completa/.test(txt) && /Comprobado el/.test(txt), `${w}: rótulos de tipo, estado, grabación y fecha de comprobación visibles`);
  if (w === 390) {
    // Contraste de etiquetas y botones (WCAG AA 4.5:1), con los colores calculados
    const low = await page.evaluate(() => {
      const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(m[0]) + 0.7152 * f(m[1]) + 0.0722 * f(m[2]); };
      const bg = (e) => { while (e) { const c = getComputedStyle(e).backgroundColor; if (!/rgba\(0, 0, 0, 0\)|transparent/.test(c)) return c; e = e.parentElement; } return "rgb(255,255,255)"; };
      return [...document.querySelectorAll(".db-kind, .db-rec, .db-item .pg-tag, .db-btns a, .db-item dt, .db-item .small")].map((e) => { const a = lum(getComputedStyle(e).color), b = lum(bg(e)); return { c: e.className, r: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) }; }).filter((x) => x.r < 4.5).map((x) => `${x.c} ${x.r.toFixed(2)}`);
    });
    ok(!low.length, `contraste ≥ 4,5:1 en etiquetas, botones y fuentes${low.length ? ": " + [...new Set(low)].join(", ") : ""}`);
    await page.click(".head-nav a[href='/']"); ok(new URL(page.url()).pathname === "/", "el menú lleva al test");
  }
  await ctx.close();
}
await browser.close();
if (errors.length) console.log("Errores:", errors);
console.log(fails.length ? `${fails.length} FALLOS` : "Todo OK");
process.exit(fails.length || errors.length ? 1 : 0);
