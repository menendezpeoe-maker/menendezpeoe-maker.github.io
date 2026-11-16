// Índices internos («En esta página», guía de /votar/ y «N preguntas en esta página» de los temas): no se quedan fijos al bajar
// y sus enlaces (primero y último) dejan el encabezado de destino a la vista, sin quedar tapado por nada fijo.
// Uso: NODE_PATH=$(npm root -g) node qa/indices.mjs   (SITE: dist servido, por defecto :8766; o BASE=https://test29n.es/)
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const SITE = (process.env.SITE || (/^https:/.test(process.env.BASE || "") ? process.env.BASE : "http://127.0.0.1:8766/")).replace(/\/?$/, "/");
const fails = [];
const ok = (c, m) => { if (c) console.log("  ✓", m); else { fails.push(m); console.log("  ✗", m); } };
// Una página por plantilla con índice: páginas largas (índice automático de pages.mjs), guía de voto, ficha provincial y tema
const PAGES = ["votar/", "metodologia/", "prensa/", "sobre/", "provincias/madrid/", "temas/vivienda-y-urbanismo/"];
const SEL = 'nav[aria-label="En esta página"], nav.q-index';

const browser = await chromium.launch();
for (const [w, h, nombre] of [[390, 844, "móvil"], [1280, 900, "escritorio"]]) {
  console.log(`\n${nombre} (${w}×${h})`);
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  for (const p of PAGES) {
    const r = await page.goto(SITE + p, { waitUntil: "load" });
    const n = (await page.$$(SEL)).length;
    ok(r.status() === 200 && n > 0, `/${p} responde y tiene índice (${n})`);
    for (let i = 0; i < n; i++) {
      const nav = (await page.$$(SEL))[i];
      const info = await nav.evaluate((el) => {
        const fijo = []; for (let e = el; e && e !== document.body; e = e.parentElement) { const ps = getComputedStyle(e).position; if (ps === "sticky" || ps === "fixed") fijo.push(`${e.tagName.toLowerCase()}.${e.className}`); }
        return { cls: el.className.split(" ")[0], fijo, links: [...el.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href")), fin: el.getBoundingClientRect().bottom + scrollY };
      });
      ok(!info.fijo.length, `/${p} .${info.cls}: ni el índice ni sus contenedores son sticky/fixed ${info.fijo.join(" ")}`);
      await page.evaluate((y) => scrollTo(0, y + 400), info.fin); await page.waitForTimeout(60);
      ok((await nav.evaluate((el) => el.getBoundingClientRect().bottom)) <= 0, `/${p} .${info.cls}: sale de pantalla al bajar`);
      for (const href of [info.links[0], info.links.at(-1)]) {
        await page.evaluate(() => scrollTo(0, 0));
        await (await nav.$(`a[href="${href}"]`)).click(); await page.waitForTimeout(350);
        const v = await page.evaluate((id) => {
          const t = document.getElementById(id), hd = t.matches("h1,h2,h3,.h2,.h3") ? t : t.querySelector("h1,h2,h3,.h2,.h3") || t, b = hd.getBoundingClientRect();
          let tapa = 0; // lo que haya fijo arriba (cabecera, barras) y ocupe más de media pantalla de ancho
          for (const e of document.querySelectorAll("body *")) { const s = getComputedStyle(e); if ((s.position === "fixed" || s.position === "sticky") && s.display !== "none" && s.visibility !== "hidden") { const r = e.getBoundingClientRect(); if (r.top <= 40 && r.bottom > 0 && r.height > 0 && r.width > innerWidth / 2 && r.bottom < innerHeight / 2 && !e.contains(hd)) tapa = Math.max(tapa, r.bottom); } }
          return { hash: location.hash, top: b.top, bottom: b.bottom, tapa, vh: innerHeight };
        }, href.slice(1));
        ok(v.hash === href && v.top >= v.tapa - 1 && v.bottom <= v.vh, `/${p} ${href}: el encabezado queda a la vista (arriba ${Math.round(v.top)} px, cabecera fija ${Math.round(v.tapa)} px)`);
      }
    }
  }
  await page.close();
}
await browser.close();
if (fails.length) { console.log(`\n${fails.length} FALLOS`); process.exit(1); }
console.log("\nTODO OK");
