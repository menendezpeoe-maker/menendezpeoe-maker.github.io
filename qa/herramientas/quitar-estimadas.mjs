import fs from "fs"; import { PARTY_ORDER } from "/home/user/menendezpeoe-maker.github.io/src/partidos.src.mjs";
const items = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const L = fs.readFileSync("src/preguntas.src.mjs", "utf8").split("\n"); let n = 0;
for (const it of items) {
  const [q, pid] = it.id.split("/"); const i = L.findIndex((l) => l.startsWith(`{ id: "${q}",`)); const k = L.findIndex((l, j) => j > i && /^\s*pos: "/.test(l));
  const m = /^(\s*pos: ")([^"]*)(".*)$/.exec(L[k]); const t = m[2].split(" "), x = PARTY_ORDER.indexOf(pid);
  if (t[x].endsWith("~")) { t[x] = t[x].slice(0, -1); n++; } L[k] = m[1] + t.join(" ") + m[3];
}
fs.writeFileSync("src/preguntas.src.mjs", L.join("\n")); console.log(n, "marcas ~ quitadas");
