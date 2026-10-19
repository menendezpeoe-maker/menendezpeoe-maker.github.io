// Genera el botón para enlazar el test desde otras webs (qa/brand/boton-test29n.png, 640 × 200).
// Uso: NODE_PATH=$(npm root -g) node qa/badge.mjs
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const root = new URL("../", import.meta.url).href;
const MARK = `<svg viewBox="0 0 40 40"><path d="M7 4h20l7 7v25H7z" fill="#fff" stroke="#111318" stroke-width="2.6" stroke-linejoin="round"/><path d="M27 4v7h7" fill="none" stroke="#111318" stroke-width="2.6" stroke-linejoin="round"/><rect x="11" y="20" width="19" height="7" rx="1.5" fill="#F6DD2F"/><path d="M12 31h14" stroke="#111318" stroke-width="2.6" stroke-linecap="round"/></svg>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="assets/fonts.css"><style>
*{box-sizing:border-box;margin:0}html,body{width:640px;height:200px;background:transparent}
.b{width:640px;height:200px;background:#fff;border:6px solid #111318;border-radius:22px;display:grid;grid-template-columns:110px 1fr;align-items:center;gap:6px;padding:0 30px 0 26px;font-family:Archivo,sans-serif;color:#111318}
svg{width:104px;height:104px}
.t{font-stretch:108%;font-weight:900;font-size:44px;white-space:nowrap;line-height:1;letter-spacing:-.01em}
.t span{background:linear-gradient(transparent 56%,#F6DD2F 56%,#F6DD2F 94%,transparent 94%)}
.s{font-family:Newsreader,serif;font-size:26px;color:#434955;margin-top:10px}
</style></head><body><div class="b">${MARK}<div><p class="t">Haz el <span>Test 29N</span></p><p class="s">¿Con qué partido coincides el 29N?</p></div></div></body></html>`;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 640, height: 200 } });
const tmp = new URL("../_badge.html", import.meta.url).pathname; fs.writeFileSync(tmp, html);
await p.goto("file://" + tmp, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready); fs.unlinkSync(tmp);
await p.screenshot({ path: new URL("./brand/boton-test29n.png", import.meta.url).pathname, omitBackground: true });
await b.close(); console.log("qa/brand/boton-test29n.png");
