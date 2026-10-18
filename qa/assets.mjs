// Genera las imágenes de marca (vista previa social e iconos) en qa/brand/.
// Uso: NODE_PATH=$(npm root -g) node qa/assets.mjs
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const OUT = new URL("./brand/", import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });

const MARK = (bg = "#FFFFFF") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M7 4h20l7 7v25H7z" fill="${bg}" stroke="#111318" stroke-width="2.6" stroke-linejoin="round"/><path d="M27 4v7h7" fill="none" stroke="#111318" stroke-width="2.6" stroke-linejoin="round"/><rect x="11" y="20" width="19" height="7" rx="1.5" fill="#F6DD2F"/><path d="M12 31h14" stroke="#111318" stroke-width="2.6" stroke-linecap="round"/></svg>`;
fs.writeFileSync(OUT + "favicon.svg", MARK());

const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Newsreader:opsz,wght@6..72,400..600&display=block">';
const og = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:#F2F3EE;font-family:Archivo,sans-serif;color:#111318;padding:30px}
.s{height:100%;background:#fff;border:4px solid #111318;border-radius:18px;display:grid;grid-template-rows:auto 1fr auto;overflow:hidden}
.top{display:flex;justify-content:space-between;align-items:center;padding:22px 40px;border-bottom:4px solid #111318}
.b{display:flex;align-items:center;gap:12px;font-stretch:125%;font-weight:900;font-size:34px}.b svg{width:46px;height:46px}
.e{font-weight:850;font-size:18px;border:3px solid #111318;border-radius:5px;padding:2px 8px 1px;font-stretch:100%}
.k{font-stretch:85%;font-weight:700;font-size:18px;letter-spacing:.08em;text-transform:uppercase;color:#434955}
.m{padding:34px 40px 0;display:grid;grid-template-columns:1fr 330px;gap:30px;align-items:center}
h1{font-stretch:118%;font-weight:850;font-size:80px;line-height:.98;letter-spacing:-.015em}
.hl{background:linear-gradient(transparent 58%,#F6DD2F 58%,#F6DD2F 92%,transparent 92%)}
p{font-family:Newsreader,serif;font-size:27px;line-height:1.35;color:#434955;margin-top:20px}
.q{border:2px solid #D2D5CC;border-radius:10px;padding:18px;display:grid;gap:14px}
.q .t{font-family:Newsreader,serif;font-size:21px;line-height:1.25}
.sc{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.sc span{display:grid;place-items:center;height:42px;border:2px solid #D2D5CC;border-radius:8px;font-weight:900;font-stretch:115%;font-size:20px;color:#434955}.sc .on{background:#F6DD2F;border-color:#111318;color:#111318}
.c{font-size:15px;color:#434955;border-left:4px solid #F6DD2F;padding-left:10px}
.f{display:flex;gap:28px;padding:20px 40px 26px;font-size:20px;color:#434955}.f b{font-weight:900;color:#111318;font-stretch:110%;font-size:24px;margin-right:6px}
</style></head><body><div class="s">
<div class="top"><div class="b">${MARK()}Test <span class="e">29N</span></div><div class="k">Test electoral · Generales del 29 de noviembre</div></div>
<div class="m"><div><h1>Lo que piensas, <span class="hl">tema a tema</span>.</h1><p>Tu perfil en siete dimensiones y tu coincidencia con las candidaturas de tu provincia.</p></div>
<div class="q"><div class="k" style="font-size:14px">Así es cada pregunta</div><div class="t">El Estado debería poder limitar el precio del alquiler en las zonas tensionadas.</div><div class="sc"><span>1</span><span>2</span><span>3</span><span class="on">4</span><span>5</span></div><div class="c">Con contexto neutral en cada pregunta</div></div></div>
<div class="f"><span><b>107</b>preguntas</span><span><b>12</b>áreas</span><span><b>25</b>candidaturas</span><span><b>0</b>registros</span></div>
</div></body></html>`;
const icon = (size, pad) => `<!doctype html><html><head><style>*{margin:0}body{width:${size}px;height:${size}px;background:#F2F3EE;display:grid;place-items:center}svg{width:${size - pad * 2}px;height:${size - pad * 2}px}</style></head><body>${MARK()}</body></html>`;

const browser = await chromium.launch();
const shot = async (html, w, h, file) => {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: OUT + file, omitBackground: false });
  await page.close();
};
await shot(og, 1200, 630, "og.png");
await shot(icon(32, 1), 32, 32, "favicon-32.png");
await shot(icon(180, 18), 180, 180, "apple-touch-icon.png");
await shot(icon(512, 56), 512, 512, "icon-512.png");
await browser.close();
console.log("Imágenes generadas en", OUT, fs.readdirSync(OUT));
