// Compara las candidaturas del BOE (cong.json de boe-candidaturas.py) con las que muestra la web (data/partidos.json).
// Uso: node qa/herramientas/boe-comparar.mjs <carpeta con cong.json>
import fs from "fs";
const B=process.argv[2]; const cong=JSON.parse(fs.readFileSync(B+"/cong.json","utf8")); const p=JSON.parse(fs.readFileSync("data/partidos.json","utf8"));
const norm=s=>s.normalize("NFD").replace(/[̀-ͯ]/g,"").toUpperCase().replace(/[^A-Z0-9 ]/g," ").replace(/\s+/g," ").trim();
export const MAP=[["upn",/UNION DEL PUEBLO NAVARRO/],["gbai",/GEROA/],["psoe",/SOCIALISTA|PSC|PSOE|PSE EE/],["pp",/PARTIDO POPULAR|PARTIT POPULAR/],["vox",/^VOX/],["salf",/SE ACABO LA FIESTA/],["pacma",/ANIMALISTA/],["pod",/^PODEMOS/],["fa",/FRENTE AMPLI|COMUNS FRONT AMPLI|FRONTE AMPLA|FRONTE ZABALA|FRENTE AMPLIU/],["erc",/ESQUERRA REPUBLICANA/],["junts",/JUNTS/],["pnv",/JELTZALEA/],["bildu",/BILDU/],["bng",/BLOQUE NACIONALISTA GALEGO/],["adel",/ADELANTE ANDALUCIA/],["comp",/COMPROMIS/],["cha",/CHUNTA/],["mes",/ARAMES/],["upc",/UNIDAD DEL PUEBLO CANARIO/],["drago",/DRAGO/],["d21",/DEMOCRACIA PARA EL SIGLO/],["existe",/EXISTE/],["jmm",/JAEN MERECE/],["soria",/SORIA YA/],["pav",/POR AVILA/],["upl",/UNION DEL PUEBLO LEONES/],["ccpc",/COALICION CANARIA|PRIMERO CANARIAS/]];
const sid=h=>{const n=norm(h); for (const [id,re] of MAP) if (re.test(n)) return id; return null;};
const ALIAS={"A CORUNA":"coruna","ARABA ALAVA":"alava","ILLES BALEARS":"baleares","LAS PALMAS":"laspalmas","SANTA CRUZ DE TENERIFE":"tenerife","CIUDAD REAL":"ciudadreal","LA RIOJA":"rioja","PRINCIPADO DE ASTURIAS":"asturias"};
const provs=p.regions.flatMap(r=>r.provs.map(x=>({...x,region:r.id}))); const byName={}; for (const x of provs) byName[norm(x.name)]=x.id;
const idOf=n=>{const k=norm(n); return ALIAS[k]||byName[k]||k.toLowerCase().replace(/ /g,"");};
const expected=pid=>{const reg=provs.find(x=>x.id===pid).region; return p.parties.filter(q=>{const s=q.scope; return s.all? !(s.except||[]).includes(reg) : ((s.regions||[]).includes(reg)||(s.provinces||[]).includes(pid));}).map(q=>q.id);};
const out=[]; const per={}; const cnt={}; const unknown={};
for (const [name,heads] of Object.entries(cong)) { const pid=idOf(name); const found=new Set(); for (const h of heads){const id=sid(h); if(id) found.add(id); else (unknown[h.replace(/\s*\(.*$/,"").trim()]||=[]).push(pid);} per[pid]=[...found]; for(const f of found) cnt[f]=(cnt[f]||0)+1;
  const exp=new Set(expected(pid)); const a=[...exp].filter(x=>!found.has(x)), b=[...found].filter(x=>!exp.has(x)); if(a.length||b.length) out.push({pid,a,b}); }
fs.writeFileSync(B+"/diff.json",JSON.stringify(out,null,1)); fs.writeFileSync(B+"/per.json",JSON.stringify(per)); fs.writeFileSync(B+"/unknown.json",JSON.stringify(unknown,null,1));
for (const o of out) console.log(o.pid.padEnd(12),"web sí/BOE no:",o.a.join(",")||"-","| BOE sí/web no:",o.b.join(",")||"-");
console.log("\npresencia por partido (de 52):",JSON.stringify(cnt));
