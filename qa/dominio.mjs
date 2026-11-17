// Dominio centralizado (17 nov): la dirección de la web solo se escribe en sitio.mjs.
// 1) Ningún archivo que acaba en la web escribe el dominio a mano (salvo el correo de contacto, «…@gmail.com»).
// 2) Generada con otro dominio, dist/ no conserva ni una mención al actual: canónicas, sitemap, og:url,
//    datos estructurados, enlaces, textos, CNAME… (así el día del cambio basta con cambiar DOMINIO y regenerar).
// Uso: node qa/dominio.mjs   (no necesita servidores; genera una copia temporal y no toca dist/ ni src/)
import { readFileSync, readdirSync, statSync, cpSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DOMINIO } from "../sitio.mjs";

const ROOT = new URL("../", import.meta.url).pathname;
const VIEJOS = [...new Set([DOMINIO, "test29n.es"])];
const RE = new RegExp(`(?:${VIEJOS.map((d) => d.replace(/\./g, "\\.")).join("|")})(?!@)`, "g");
const TEXTO = /\.(html|js|mjs|css|json|xml|txt|webmanifest|md|svg)$/;
const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); console.log(`${c ? "✓" : "✗"} ${m}`); };
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });

// 1) Código y datos que se publican (papeleta.js se comprueba en el paso 2: publish.mjs cambia su PUBLIC_URL de desarrollo)
const fuentes = ["publish.mjs", "pages.mjs", "indexnow.mjs", "papeleta-29n.html", ...["src", "data", "assets"].flatMap((d) => walk(join(ROOT, d)).map((p) => p.slice(ROOT.length)))]
  .filter((f) => TEXTO.test(f) && f !== "assets/papeleta.js");
const malos = fuentes.flatMap((f) => (readFileSync(join(ROOT, f), "utf8").match(RE) ? [f] : []));
ok(!malos.length, `ningún archivo publicable escribe el dominio fuera de sitio.mjs${malos.length ? ": " + malos.join(", ") : ""}`);

// 2) Web generada en una copia con un dominio de prueba
const NUEVO = "dominio-de-prueba.example", tmp = mkdtempSync(join(tmpdir(), "dominio-"));
try {
  cpSync(ROOT, tmp, { recursive: true, filter: (s) => !/\/(\.git|dist|node_modules)(\/|$)/.test(s.slice(ROOT.length - 1)) });
  execFileSync(process.execPath, ["publish.mjs"], { cwd: tmp, env: { ...process.env, SITE_URL: `https://${NUEVO}/` }, stdio: "pipe" });
  const dist = join(tmp, "dist"), files = walk(dist).filter((f) => TEXTO.test(f) || f.endsWith("CNAME"));
  const quedan = files.flatMap((f) => { const n = (readFileSync(f, "utf8").match(RE) || []).length; return n ? [`${f.slice(dist.length + 1)} (${n})`] : []; });
  ok(!quedan.length, `con otro dominio no queda ninguna mención al actual en dist/ (${files.length} archivos de texto)${quedan.length ? ": " + quedan.slice(0, 10).join(", ") : ""}`);
  ok(existsSync(join(dist, "CNAME")) && readFileSync(join(dist, "CNAME"), "utf8") === `${NUEVO}\n`, "CNAME con el dominio nuevo");
  const locs = [...readFileSync(join(dist, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  ok(locs.length > 200 && locs.every((u) => u.startsWith(`https://${NUEVO}/`)), `sitemap: ${locs.length} URL con el dominio nuevo`);
  ok(readFileSync(join(dist, "robots.txt"), "utf8").includes(`Sitemap: https://${NUEVO}/sitemap.xml`), "robots.txt apunta al sitemap nuevo");
  const idx = readFileSync(join(dist, "index.html"), "utf8"), ficha = readFileSync(join(dist, "partidos", readdirSync(join(dist, "partidos")).find((d) => statSync(join(dist, "partidos", d)).isDirectory()), "index.html"), "utf8");
  ok(idx.includes(`<link rel="canonical" href="https://${NUEVO}/">`) && idx.includes(`<meta property="og:url" content="https://${NUEVO}/">`), "portada: canónica y og:url nuevas");
  ok(/<link rel="canonical" href="https:\/\/dominio-de-prueba\.example\/partidos\/[^"]+\/">/.test(ficha) && ficha.includes(`"item":"https://${NUEVO}/`), "fichas: canónica y migas (datos estructurados) nuevas");
  ok(readFileSync(join(dist, "assets/papeleta.js"), "utf8").includes(`const PUBLIC_URL = "https://${NUEVO}/";`), "papeleta.js comparte la dirección nueva");
} finally { rmSync(tmp, { recursive: true, force: true }); }

console.log(fails.length ? `${fails.length} FALLOS` : "Todo correcto");
process.exit(fails.length ? 1 : 0);
