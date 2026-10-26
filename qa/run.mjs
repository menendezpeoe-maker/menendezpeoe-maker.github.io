// Ejecutor de baterías con salida compacta: solo detalla las que fallan.
// Uso: node qa/run.mjs <batería…|todas|grupo>   (hereda BASE, SITE, LOCAL…; NODE_PATH se pone solo)
import { spawnSync, execSync } from "node:child_process";
import { existsSync } from "node:fs";

const TODAS = "confianza temas territorio votar opendata seo growth summary quick onboarding e2e share sections profiles map support audit features explain stats rendimiento".split(" ");
const GRUPOS = {
  todas: TODAS,
  posturas: "correcciones metodologia quick profiles confianza".split(" "), // tras cambiar posturas (escriben src/*.json)
  paginas: "seo votar territorio temas growth opendata confianza".split(" "),  // páginas estáticas (pages.mjs)
  test: "onboarding quick e2e summary sections profiles map explain features audit".split(" "), // flujo y resultado
  difusion: "share stats support".split(" "), // compartir, contador y apoyo (share: solo pasa del todo en el dominio real)
};

const args = process.argv.slice(2);
if (!args.length) { console.log(`Uso: node qa/run.mjs <batería…|${Object.keys(GRUPOS).join("|")}>`); process.exit(2); }
const lista = [...new Set(args.flatMap(a => GRUPOS[a] || [a]))];

const env = { ...process.env };
if (!env.NODE_PATH) env.NODE_PATH = execSync("npm root -g").toString().trim();

let ok = 0;
for (const nombre of lista) {
  const file = new URL(`./${nombre}.mjs`, import.meta.url).pathname;
  if (!existsSync(file)) { console.log(`✗ ${nombre} (no existe qa/${nombre}.mjs)`); continue; }
  const t = Date.now();
  const r = spawnSync(process.execPath, [file], { env, encoding: "utf8", maxBuffer: 64 << 20 });
  const s = ((Date.now() - t) / 1000).toFixed(1);
  if (r.status === 0) { ok++; console.log(`✓ ${nombre} (${s}s)`); continue; }
  console.log(`✗ ${nombre} (código ${r.status ?? r.signal})`);
  const lineas = `${r.stdout || ""}${r.stderr || ""}`.split("\n");
  const i = lineas.findIndex(l => /FALLOS/.test(l));
  const j = lineas.findIndex(l => /^Errores de consola/.test(l));
  let out = [];
  if (i >= 0 || j >= 0) {
    if (i >= 0 && !lineas[i + 1]?.trim().startsWith("-")) out.push(...lineas.filter(l => l.trim().startsWith("✗"))); // formato «N FALLOS»
    if (j >= 0) out.push(...lineas.slice(j, i > j ? i : undefined).filter(l => l.trim()));
    if (i >= 0) out.push(...lineas.slice(i, j > i ? j : undefined).filter(l => l.trim()));
  } else out = lineas.filter(l => l.trim()).slice(-15);
  console.log(out.map(l => "    " + l).join("\n"));
}
console.log(`Resumen: ${ok}/${lista.length} OK`);
process.exit(ok === lista.length ? 0 : 1);
