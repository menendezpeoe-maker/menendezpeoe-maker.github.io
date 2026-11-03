// Genera src/candidaturas.json con todas las candidaturas proclamadas al Congreso en cada circunscripción y su cabeza
// de lista, tal como figuran en el BOE, a partir de cabezas.json (de boe-candidaturas.py).
// Uso: node qa/herramientas/boe-cabezas.mjs <carpeta con cabezas.json> <id BOE> <fecha AAAA-MM-DD>
//      node qa/herramientas/boe-cabezas.mjs /ruta/boe BOE-A-2026-23103 2026-11-03
// Cada candidatura lleva «pid» si es una de las del test y se presenta en esa provincia según data/partidos.json.
import fs from "fs";
const [DIR, BOE_ID, FECHA] = process.argv.slice(2);
if (!DIR || !BOE_ID || !FECHA) { console.log("Uso: node qa/herramientas/boe-cabezas.mjs <carpeta> <id BOE> <fecha>"); process.exit(2); }
const cab = JSON.parse(fs.readFileSync(`${DIR}/cabezas.json`, "utf8"));
const p = JSON.parse(fs.readFileSync("data/partidos.json", "utf8"));
const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase().replace(/[^A-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
// Mismo orden que boe-comparar.mjs: las coaliciones (EH Bildu-ERC, CHA-Frente Amplio) antes que sus socios
const MAP = [["bildu", /BILDU/], ["cha", /CHUNTA/], ["upn", /UNION DEL PUEBLO NAVARRO/], ["gbai", /GEROA/], ["psoe", /SOCIALISTA|PSC|PSOE|PSE EE/], ["pp", /PARTIDO POPULAR|PARTIT POPULAR/], ["vox", /^VOX/], ["salf", /SE ACABO LA FIESTA/], ["pacma", /ANIMALISTA/], ["pod", /^PODEMOS/], ["fa", /FRENTE AMPLI|COMUNS FRONT AMPLI|FRONTE AMPLA|FRONTE ZABALA|FRENTE AMPLIU/], ["erc", /ESQUERRA REPUBLICANA/], ["junts", /JUNTS/], ["pnv", /JELTZALEA/], ["bng", /BLOQUE NACIONALISTA GALEGO/], ["adel", /ADELANTE ANDALUCIA/], ["comp", /COMPROMIS/], ["mes", /ARAMES/], ["upc", /UNIDAD DEL PUEBLO CANARIO/], ["drago", /DRAGO/], ["d21", /DEMOCRACIA PARA EL SIGLO/], ["existe", /EXISTE/], ["soria", /SORIA YA/], ["ccpc", /COALICION CANARIA|PRIMERO CANARIAS/]];
const ALIAS = { "A CORUNA": "coruna", "ARABA ALAVA": "alava", "ILLES BALEARS": "baleares", "LAS PALMAS": "laspalmas", "SANTA CRUZ DE TENERIFE": "tenerife", "CIUDAD REAL": "ciudadreal", "LA RIOJA": "rioja", "PRINCIPADO DE ASTURIAS": "asturias" };
const provs = p.regions.flatMap((r) => r.provs.map((x) => ({ ...x, region: r.id })));
const byName = Object.fromEntries(provs.map((x) => [norm(x.name), x.id]));
const idOf = (n) => { const k = norm(n); return ALIAS[k] || byName[k] || k.toLowerCase().replace(/ /g, ""); };
const P = Object.fromEntries(p.parties.map((x) => [x.id, x]));
const runs = (pid, prov) => { const s = P[pid].scope, r = provs.find((x) => x.id === prov).region; if (P[pid].out || (s.except || []).includes(prov)) return false; if (s.all) return !(s.except || []).includes(r); if (s.regions) return s.regions.includes(r); if (s.provinces) return s.provinces.includes(prov); return false; };
const out = { fuente: { id: BOE_ID, fecha: FECHA, url: `https://www.boe.es/diario_boe/txt.php?id=${BOE_ID}` }, provs: {} };
const bad = [];
for (const [name, list] of Object.entries(cab)) {
  const prov = idOf(name);
  if (!provs.some((x) => x.id === prov)) { bad.push(`circunscripción desconocida: ${name}`); continue; }
  out.provs[prov] = list.map(([c, cabeza]) => {
    const n = norm(c); const hit = MAP.find(([, re]) => re.test(n));
    const pid = hit && runs(hit[0], prov) ? hit[0] : null;
    if (!cabeza) bad.push(`${prov}: sin cabeza de lista en «${c}»`);
    return pid ? { c: c.replace(/\s+/g, " ").trim(), cab: cabeza, pid } : { c: c.replace(/\s+/g, " ").trim(), cab: cabeza };
  });
}
const miss = provs.filter((x) => !out.provs[x.id]).map((x) => x.id);
if (miss.length) bad.push(`faltan circunscripciones: ${miss.join(", ")}`);
// Cada candidatura del test que se presenta en una provincia debe tener su lista en el BOE
for (const x of provs) for (const pid of p.order.filter((id) => runs(id, x.id))) if (!(out.provs[x.id] || []).some((c) => c.pid === pid)) bad.push(`${x.id}: ${pid} no aparece en el BOE`);
if (bad.length) { console.log(bad.join("\n")); process.exit(1); }
fs.writeFileSync("src/candidaturas.json", JSON.stringify(out, null, 1) + "\n");
console.log(`src/candidaturas.json: ${Object.keys(out.provs).length} circunscripciones, ${Object.values(out.provs).flat().length} candidaturas`);
