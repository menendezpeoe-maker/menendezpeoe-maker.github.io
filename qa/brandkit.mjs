// Imagen de marca (perfil e iconos) y banner para redes, con el mismo diseño que el banner de la portada.
// Uso: NODE_PATH=$(npm root -g) node qa/brandkit.mjs   → qa/brand/
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = new URL("../", import.meta.url).pathname, OUT = ROOT + "qa/brand/";
// Símbolo: la papeleta con el fosforito y «29N». Sin texto en tamaños diminutos (favicon).
const sheet = (text) => `<path d="M29 16h45l18 18v70H29z" fill="#FFFFFF"/><path d="M74 16v18h18" fill="#D2D5CC"/><rect x="34" y="55" width="53" height="23" rx="3" fill="#F6DD2F"/>${text ? '<text x="60.5" y="72.6" text-anchor="middle" font-family="Archivo, sans-serif" font-weight="900" font-size="18.5" font-stretch="112%" fill="#111318">29N</text>' : ""}<rect x="37" y="86" width="36" height="5" rx="2.5" fill="#111318"/>`;
const avatar = (text, rx) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="${rx}" fill="#111318"/>${sheet(text)}</svg>`;
fs.writeFileSync(OUT + "favicon.svg", avatar(false, 26));
const page = (body, w, h, extra = "") => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="assets/papeleta.css"><style>*{margin:0}html,body{width:${w}px;height:${h}px;background:transparent;overflow:hidden}${extra}</style></head><body>${body}</body></html>`;
const b = await chromium.launch();
const shot = async (html, w, h, file, scale = 1) => {
  const tmp = ROOT + "_brand.html"; fs.writeFileSync(tmp, html);
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
  await p.goto("file://" + tmp, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
  await p.screenshot({ path: OUT + file, omitBackground: true }); await p.close(); fs.unlinkSync(tmp);
};
// Perfil para redes (cuadrado completo: las redes lo recortan en círculo) e iconos de la web
const full = (s) => page(`<div style="width:${s}px;height:${s}px;background:#111318 radial-gradient(circle at 100% 0,rgba(246,221,47,.16),transparent 55%);display:grid;place-items:center"><svg viewBox="12 6 96 108" style="width:${Math.round(s * 0.74)}px;height:${Math.round(s * 0.74)}px">${sheet(true)}</svg></div>`, s, s);
await shot(full(1024), 1024, 1024, "perfil-test29n.png");
await shot(full(512), 512, 512, "icon-512.png");
await shot(full(180), 180, 180, "apple-touch-icon.png");
const fav = (n) => shot(page(avatar(false, 26).replace("<svg ", `<svg style="width:${n}px;height:${n}px;display:block" `), n, n), n, n, `favicon-${n}.png`);
for (const n of [32, 48, 96]) await fav(n);
// favicon.ico con los PNG de 32 y 48 px dentro (buscadores y navegadores antiguos piden /favicon.ico)
const icoImgs = [32, 48].map((n) => [n, fs.readFileSync(OUT + `favicon-${n}.png`)]);
const icoHead = Buffer.alloc(6 + 16 * icoImgs.length); icoHead.writeUInt16LE(1, 2); icoHead.writeUInt16LE(icoImgs.length, 4);
let icoOff = icoHead.length;
icoImgs.forEach(([n, d], i) => { const o = 6 + 16 * i; icoHead[o] = n; icoHead[o + 1] = n; icoHead.writeUInt16LE(1, o + 4); icoHead.writeUInt16LE(32, o + 6); icoHead.writeUInt32LE(d.length, o + 8); icoHead.writeUInt32LE(icoOff, o + 12); icoOff += d.length; });
fs.writeFileSync(OUT + "favicon.ico", Buffer.concat([icoHead, ...icoImgs.map(([, d]) => d)]));
// Banner para cabeceras de redes (1500 × 500), con el mismo componente que la portada
const banner = fs.readFileSync(OUT + "banner.html", "utf8");
await shot(page(banner, 1500, 500, ".banner{width:1500px;height:500px;margin:0;border-radius:0;border:0;padding:56px 90px;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:70px}.bn-h{font-size:64px}.bn-sub{font-size:22px}.bn-c{height:40px}.bn-t{font-size:15px}.bn-row{grid-template-columns:120px repeat(5,minmax(0,1fr));gap:8px}.bn-avatar{width:56px;height:56px}"), 1500, 500, "banner-test29n.png");
await b.close();
console.log("qa/brand: perfil-test29n.png, icon-512.png, apple-touch-icon.png, favicon-32/48/96.png, favicon.ico, favicon.svg, banner-test29n.png");
