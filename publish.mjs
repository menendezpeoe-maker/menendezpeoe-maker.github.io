// Genera dist/: la web pública estática (GitHub Pages, Netlify, Cloudflare Pages…).
// Uso: SITE_URL=https://usuario.github.io/ node publish.mjs
// Requiere haber ejecutado antes `node build.mjs` (datos) y `node qa/assets.mjs` (imágenes).
import { readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, existsSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";

const SITE = (process.env.SITE_URL || "https://test29n.es/").replace(/\/?$/, "/");
const OUT = "dist";
const TITLE = "Test 29N · Test político y electoral para las elecciones generales del 29N";
const DESC = "¿Con qué partido coincides el 29N? Test electoral gratuito para las elecciones generales del 29 de noviembre de 2026: 107 preguntas con contexto neutral y tu coincidencia con los partidos de tu provincia. Sin registro.";

rmSync(OUT, { recursive: true, force: true });
for (const d of ["", "assets", "assets/politicos", "data"]) mkdirSync(`${OUT}/${d}`, { recursive: true });

const hash = (f) => createHash("sha256").update(readFileSync(f)).digest("hex").slice(0, 10);
// La aplicación publicada comparte la dirección pública real
const js = readFileSync("assets/papeleta.js", "utf8").replace(/const PUBLIC_URL = [^;]+;/, `const PUBLIC_URL = ${JSON.stringify(SITE)};`);
if (!js.includes(JSON.stringify(SITE))) throw new Error("No se pudo fijar PUBLIC_URL");
// Aportaciones: solo enlaces públicos de PayPal.me o de pago de Stripe
const DONATE_RULES = { paypal: /^https:\/\/(www\.paypal\.com\/donate\/?\?hosted_button_id=[A-Z0-9]+|(www\.)?paypal\.me\/[A-Za-z0-9_.-]+)$/, applePay: /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/, bank: /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9_]+$/ };
for (const [k, re] of Object.entries(DONATE_RULES)) {
  const v = new RegExp(`\\b${k}: "([^"]*)"`).exec(js)?.[1];
  if (v === undefined) throw new Error(`Falta DONATE.${k} en papeleta.js`);
  if (v && !re.test(v)) throw new Error(`DONATE.${k} no es un enlace válido: ${v}`);
  console.log(`Aportaciones · ${k}: ${v || "sin configurar (no se muestra)"}`);
}
// Contador de visitas: solo un código de GoatCounter válido; la CSP permite únicamente ese dominio
const STATS_CODE = /\bgoatcounter: "([^"]*)"/.exec(js)?.[1];
if (STATS_CODE === undefined) throw new Error("Falta STATS.goatcounter en papeleta.js");
if (STATS_CODE && !/^[a-z0-9][a-z0-9-]{1,48}$/.test(STATS_CODE)) throw new Error(`STATS.goatcounter no es un código válido: ${STATS_CODE}`);
console.log(`Contador de visitas: ${STATS_CODE ? `https://${STATS_CODE}.goatcounter.com` : "desactivado"}`);
writeFileSync(`${OUT}/assets/papeleta.js`, js);
copyFileSync("assets/papeleta.css", `${OUT}/assets/papeleta.css`);
for (const f of ["preguntas.json", "partidos.json", "politicos.json"]) copyFileSync(`data/${f}`, `${OUT}/data/${f}`);
for (const f of ["og.png", "favicon.svg", "favicon-32.png", "apple-touch-icon.png", "icon-512.png"]) {
  if (!existsSync(`qa/brand/${f}`)) throw new Error(`Falta qa/brand/${f}: ejecuta node qa/assets.mjs`);
  copyFileSync(`qa/brand/${f}`, `${OUT}/${f}`);
}
for (const f of readdirSync("assets/politicos").filter((f) => f.endsWith(".jpg"))) copyFileSync(`assets/politicos/${f}`, `${OUT}/assets/politicos/${f}`);
// Ningún dato bancario puede acabar en la web pública
for (const f of [`${OUT}/assets/papeleta.js`, "papeleta-29n.html", ...["preguntas", "partidos", "politicos"].map((n) => `data/${n}.json`)])
  if (/\b[A-Z]{2}\d{2}(?:[ -]?[A-Z0-9]{4}){3,7}\b/.test(readFileSync(f, "utf8"))) throw new Error(`${f} contiene algo con formato de IBAN`);
// Tipografías propias (qa/fonts.py): sin peticiones a Google
mkdirSync(`${OUT}/assets/fonts`, { recursive: true });
copyFileSync("assets/fonts.css", `${OUT}/assets/fonts.css`);
for (const f of readdirSync("assets/fonts")) copyFileSync(`assets/fonts/${f}`, `${OUT}/assets/fonts/${f}`);
const FONT_MAIN = readdirSync("assets/fonts").find((f) => f.startsWith("Archivo-normal-latin-") && !f.includes("ext"));
const v = { fonts: hash(`${OUT}/assets/fonts.css`), css: hash(`${OUT}/assets/papeleta.css`), js: hash(`${OUT}/assets/papeleta.js`) };

// El cuerpo es el mismo que el del artefacto; se quitan sus etiquetas de cabecera
const page = readFileSync("papeleta-29n.html", "utf8");
const body = page.slice(page.indexOf('<a class="skip"'))
  .replace('<script src="assets/papeleta.js" defer></script>', "")
  .trim();
const csp = [
  "default-src 'self'", "script-src 'self'", "style-src 'self' 'unsafe-inline'",
  "font-src 'self'", `img-src 'self' data: blob:${STATS_CODE ? ` https://${STATS_CODE}.goatcounter.com` : ""}`, "connect-src 'self'",
  "base-uri 'self'", "form-action 'none'", "object-src 'none'"
].join("; ");
// index usa rutas relativas (funciona en cualquier carpeta); el 404 usa la URL completa porque se sirve en rutas arbitrarias
const head = (title, desc, extra = "", B = "") => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta http-equiv="Content-Security-Policy" content="${csp}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#F2F3EE" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E1014" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${B}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${B}favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${B}apple-touch-icon.png">
<link rel="manifest" href="${B}site.webmanifest">
${extra}<link rel="preload" href="${B}assets/fonts/${FONT_MAIN}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${B}assets/fonts.css?v=${v.fonts}">
<link rel="stylesheet" href="${B}assets/papeleta.css?v=${v.css}">
<style>[hidden]{display:none!important}body{margin:0}:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}img{max-width:100%}</style>
</head>`;
const social = `<link rel="canonical" href="${SITE}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Test 29N">
<meta property="og:locale" content="es_ES">
<meta property="og:url" content="${SITE}">
<meta property="og:title" content="Test 29N · ¿Con qué partido coincides en las elecciones del 29N?">
<meta property="og:description" content="Test político con 107 preguntas y contexto neutral. Tu perfil en siete dimensiones y tu coincidencia con las candidaturas de tu provincia para el 29N.">
<meta property="og:image" content="${SITE}og.png">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Test 29N: Lo que piensas, tema a tema. Test político para las elecciones del 29 de noviembre de 2026.">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Test 29N · ¿Con qué partido coincides en las elecciones del 29N?">
<meta name="twitter:description" content="107 preguntas con contexto neutral, tu perfil en siete dimensiones y tu coincidencia con las candidaturas de tu provincia.">
<meta name="twitter:image" content="${SITE}og.png">
<meta name="twitter:image:alt" content="Test 29N: Lo que piensas, tema a tema.">
<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Test 29N", alternateName: "Test electoral 29N", url: SITE, inLanguage: "es", applicationCategory: "EducationalApplication", operatingSystem: "Web", description: DESC, isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" } })}</script>
`;
const noscript = `<noscript><div style="max-width:640px;margin:40px auto;padding:0 16px;font:16px/1.5 system-ui,sans-serif"><h1>Test 29N necesita JavaScript</h1><p>El test se calcula entero en tu navegador. Activa JavaScript para usarlo. No enviamos tus respuestas a ningún servidor.</p></div></noscript>`;
writeFileSync(`${OUT}/index.html`, `${head(TITLE, DESC, social)}
<body>
${noscript}
${body}
<script src="assets/papeleta.js?v=${v.js}" defer></script>
</body>
</html>
`);

// Página 404 con la misma identidad
writeFileSync(`${OUT}/404.html`, `${head("Página no encontrada · Test 29N", "La página que buscas no existe. Vuelve al test político Test 29N.", '<meta name="robots" content="noindex">\n', SITE)}
<body>
<header class="site-head"><div class="wrap head-row"><a class="brand" href="${SITE}" style="text-decoration:none;color:inherit"><span class="brand-word">Test</span><span class="brand-ed">29N</span></a></div></header>
<main class="wrap narrow state-msg" id="main">
  <p class="label">Error 404</p>
  <h1 class="h1">Esta papeleta está en blanco</h1>
  <p class="lede">La dirección que has abierto no existe o ha cambiado. El test sigue en la página principal, y tus respuestas guardadas en este navegador no se han perdido.</p>
  <p><a class="btn btn-primary" href="${SITE}">Ir al test</a></p>
</main>
</body>
</html>
`);

writeFileSync(`${OUT}/site.webmanifest`, JSON.stringify({ name: "Test 29N", short_name: "Test 29N", lang: "es", start_url: SITE, scope: SITE, display: "standalone", background_color: "#F2F3EE", theme_color: "#111318", icons: [{ src: `${SITE}icon-512.png`, sizes: "512x512", type: "image/png" }, { src: `${SITE}apple-touch-icon.png`, sizes: "180x180", type: "image/png" }] }, null, 1));
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`);
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE}</loc><lastmod>2026-10-17</lastmod><changefreq>weekly</changefreq></url></urlset>\n`);
writeFileSync(`${OUT}/.nojekyll`, "");
// Dominio propio: GitHub Pages lo lee de CNAME y redirige la dirección github.io a él
const host = new URL(SITE).hostname;
if (!host.endsWith(".github.io")) writeFileSync(`${OUT}/CNAME`, `${host}\n`);
writeFileSync(`${OUT}/README.md`, `# Test 29N\n\nTest político sobre los debates reales de España para las elecciones generales del 29 de noviembre de 2026.\n\n- Web pública: ${SITE}\n- Todo se calcula en el navegador: sin servidor, sin base de datos, sin registro y sin cookies. Las respuestas se guardan solo en el almacenamiento local del navegador de cada persona.\n- Preguntas y posturas de los partidos: \`data/preguntas.json\` y \`data/partidos.json\`.\n- Herramienta independiente y orientativa; no es una recomendación de voto.\n`);
console.log(`dist/ generado para ${SITE} (css ${v.css}, js ${v.js})`);
