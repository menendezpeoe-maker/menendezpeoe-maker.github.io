// Genera dos copias autónomas para probar en local con doble clic (sin servidor):
//   original.html → la web tal como está publicada hoy (sin cambios)
//   index.html    → la misma página + assets/mejora.css + assets/mejora.js
// Lo único que se quita en ambas es lo que impide abrirlas desde el disco: la política de seguridad (CSP),
// que bloquea el código incrustado, y la precarga de fuentes. Ningún texto se toca.
// Uso (desde la raíz del repositorio): node build.mjs && SITE_URL=https://test29n.es/ node publish.mjs && node version-mejorada/build-local.mjs
import { readFileSync, writeFileSync, cpSync, mkdirSync } from "fs";
const R = new URL("../", import.meta.url).pathname, OUT = R + "version-mejorada/", DIST = R + "dist/";
const read = (p) => readFileSync(p, "utf8");
const safe = (s) => s.replace(/<\/(script|style)/gi, "<\\/$1");
const fontsCss = read(DIST + "assets/fonts.css").replace(/url\((fonts\/[^)]+\.woff2)\)/g, (_, f) => `url(data:font/woff2;base64,${readFileSync(DIST + "assets/" + f).toString("base64")})`);
const data = Object.fromEntries(["preguntas", "partidos", "politicos"].map((n) => [`data/${n}.json`, JSON.parse(read(DIST + `data/${n}.json`))]));
// fetch() no funciona con file://: los datos van dentro y se sirven desde aquí con la misma forma de respuesta
const shim = `window.__T29N_DATA=${JSON.stringify(data)};(()=>{const f=window.fetch;window.fetch=(u,o)=>{const k=String(u).replace(/^\\.?\\//,"").split("?")[0];return window.__T29N_DATA[k]?Promise.resolve(new Response(JSON.stringify(window.__T29N_DATA[k]),{status:200,headers:{"Content-Type":"application/json"}})):f(u,o);};})();`;
const page = (improved) => {
  let h = read(DIST + "index.html");
  h = h.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\n?/, "");
  h = h.replace(/<link rel="preload"[^>]*as="font"[^>]*>\n?/g, "");
  h = h.replace(/<link rel="stylesheet" href="assets\/fonts\.css[^"]*">/, () => `<style>${safe(fontsCss)}</style>`);
  h = h.replace(/<link rel="stylesheet" href="assets\/papeleta\.css[^"]*">/, () => `<style>${safe(read(DIST + "assets/papeleta.css"))}</style>` + (improved ? `<style id="mejora-css">${safe(read(OUT + "assets/mejora.css"))}</style>` : ""));
  h = h.replace(/<script src="assets\/papeleta\.js[^"]*" defer><\/script>/, () => `<script>${safe(shim)}</script><script>${safe(read(DIST + "assets/papeleta.js"))}</script>` + (improved ? `<script id="mejora-js">${safe(read(OUT + "assets/mejora.js"))}</script>` : ""));
  h = h.replace(/<script src="assets\/stats\.js[^"]*" defer><\/script>/, "");  // sin contador de visitas en las copias locales
  if (!/<style>/.test(h) || /src="assets\/papeleta\.js/.test(h)) throw new Error("no se pudo incrustar el CSS o el JS");
  return h;
};
writeFileSync(OUT + "original.html", page(false));
writeFileSync(OUT + "index.html", page(true));
mkdirSync(OUT + "assets", { recursive: true });
cpSync(DIST + "assets/politicos", OUT + "assets/politicos", { recursive: true });
for (const f of ["favicon.svg", "favicon-32.png"]) cpSync(DIST + f, OUT + f);
console.log("version-mejorada/: original.html e index.html generados");
