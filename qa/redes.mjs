// Imágenes para redes con la identidad de la marca (tanda T10):
//   · «Pregunta del día»: una pregunta real del test por día, del 26 de octubre al 23 de noviembre
//     (ninguna del 24 al 28 de noviembre, para que nada se parezca a una encuesta en esos días).
//   · Una tarjeta por cada test por tema.
// Formato 1080 × 1350 (vertical, válido en Instagram, X, Facebook, LinkedIn y WhatsApp).
// Uso: NODE_PATH=$(npm root -g) node qa/redes.mjs   → qa/redes/ (publish.mjs lo copia a dist/redes/)
import { createRequire } from "module";
import fs from "fs";
import { TOPICS } from "../src/temas.src.mjs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const ROOT = new URL("../", import.meta.url).pathname, OUT = ROOT + "qa/redes/";
const B = JSON.parse(fs.readFileSync(ROOT + "data/preguntas.json", "utf8"));
const AREA = Object.fromEntries(B.areas.map((a) => [a.id, a]));
const Q = Object.fromEntries(B.questions.map((q) => [q.id, q]));
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

// Calendario de la pregunta del día: preguntas núcleo e importantes (prioridad 1 y 2), alternando áreas
export function dailySchedule() {
  const days = [];
  for (let d = new Date(Date.UTC(2026, 9, 26)); d <= new Date(Date.UTC(2026, 10, 23)); d.setUTCDate(d.getUTCDate() + 1)) days.push(new Date(d));
  const pools = B.areas.map((a) => B.questions.filter((q) => q.area === a.id && q.prio <= 2).sort((x, y) => x.prio - y.prio || x.id.localeCompare(y.id)));
  const pick = [];
  for (let r = 0; pick.length < days.length && r < 20; r++) for (const p of pools) if (p[r] && pick.length < days.length) pick.push(p[r]);
  return days.map((d, i) => ({ iso: d.toISOString().slice(0, 10), day: `${DIA[d.getUTCDay()]} ${d.getUTCDate()} ${MES[d.getUTCMonth()]}`, q: pick[i], file: `pregunta-${d.toISOString().slice(0, 10)}.png` }));
}

const mark = `<svg viewBox="0 0 40 40" style="width:64px;height:64px"><path d="M7 4h20l7 7v25H7z" fill="#fff" stroke="#111318" stroke-width="2.5" stroke-linejoin="round"/><path d="M27 4v7h7" fill="none" stroke="#111318" stroke-width="2.5" stroke-linejoin="round"/><rect x="11" y="20" width="19" height="7" rx="1.5" fill="#F6DD2F"/><path d="M12 31h14" stroke="#111318" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const css = `*{margin:0;box-sizing:border-box}html,body{width:1080px;height:1350px;background:#F2F3EE;font-family:Archivo,sans-serif;color:#111318}
.card{position:absolute;inset:48px;background:#fff;border:4px solid #111318;border-radius:22px;display:flex;flex-direction:column;overflow:hidden}
.top{display:flex;align-items:center;justify-content:space-between;padding:34px 56px;border-bottom:4px solid #111318}
.brand{display:flex;align-items:center;gap:14px}.bw{font-weight:900;font-stretch:125%;font-size:44px;letter-spacing:-.01em}.be{font-weight:800;font-size:26px;padding:3px 12px 1px;border:3px solid #111318;border-radius:8px}
.kick{font-weight:700;font-stretch:87%;font-size:24px;letter-spacing:.06em;color:#434955;text-transform:uppercase;text-align:right}
.body{flex:1;padding:52px 56px 0;display:flex;flex-direction:column;gap:30px}
.tag{align-self:flex-start;font-weight:800;font-size:24px;letter-spacing:.04em;text-transform:uppercase;background:#111318;color:#fff;padding:8px 16px;border-radius:999px}
.q{font-weight:850;font-stretch:105%;line-height:1.08;letter-spacing:-.01em}
.scale{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:auto}
.scale span{border:3px solid #111318;border-radius:12px;padding:16px 8px;font-weight:700;font-size:21px;line-height:1.15;text-align:center;display:grid;place-items:center;min-height:110px}
.ab{display:grid;gap:12px;margin-bottom:auto}.ab p{font-size:32px;font-weight:600;line-height:1.25;color:#434955}.ab b{color:#111318;font-weight:900}
.q{margin-top:auto}.body>.q:last-child{margin-bottom:auto}
.foot{padding:30px 56px 38px;display:grid;gap:10px}
.cta{background:#F6DD2F;border:4px solid #111318;border-radius:16px;padding:22px 28px;display:grid;gap:4px}
.cta p{font-size:28px;font-weight:650}.cta strong{font-size:40px;font-weight:900;font-stretch:105%}
.note{font-size:21px;color:#676D79;font-weight:500}
.list{list-style:none;display:grid;gap:22px;font-size:38px;margin-top:10px;font-weight:650}.list li{display:grid;grid-template-columns:28px 1fr;gap:14px;align-items:baseline}.list li:before{content:"";width:22px;height:22px;border-radius:5px;background:#F6DD2F;border:3px solid #111318;transform:translateY(2px)}
.big{font-weight:900;font-stretch:112%;font-size:104px;line-height:.98;letter-spacing:-.02em}
.meta{font-size:34px;font-weight:700;color:#434955}`;
const top = (kick) => `<div class="top"><div class="brand">${mark}<span class="bw">Test</span><span class="be">29N</span></div><p class="kick">${kick}</p></div>`;
const html = (body) => `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="assets/fonts.css"><style>${css}</style></head><body><div class="card">${body}</div></body></html>`;
const qSize = (t) => (t.length > 150 ? 64 : t.length > 115 ? 72 : t.length > 85 ? 84 : 96);

function dailyHtml({ day, q }) {
  const a = AREA[q.area];
  const answers = q.type === "dilema"
    ? `<div class="ab"><p><b>A.</b> ${esc(q.A)}</p><p><b>B.</b> ${esc(q.B)}</p></div>`
    : "";
  const text = q.type === "dilema" ? q.text : q.text;
  return html(`${top(`Pregunta del día<br>${esc(day)}`)}
  <div class="body"><span class="tag">${esc(a.letter)} · ${esc(a.name)}</span><p class="q" style="font-size:${qSize(text)}px">${esc(text)}</p>${answers}</div>
  <div class="foot"><div class="cta"><p>Mira qué piensa cada partido, con fuentes, en</p><strong>test29n.es/preguntas/${q.id.toLowerCase()}</strong></div>
  <p class="note">Test 29N · Test político independiente para las elecciones del 29N. No es una encuesta ni una recomendación de voto.</p></div>`);
}
function topicHtml(k, t) {
  const qs = t.ids.map((id) => Q[id]);
  return html(`${top("Test por tema<br>Elecciones 29N")}
  <div class="body"><p class="big" style="font-size:${t.label.length > 12 ? 84 : 104}px">Test de ${esc(t.label.toLowerCase())}</p><p class="meta">${qs.length} preguntas · 2 minutos</p>
  <ul class="list">${qs.map((q) => `<li>${esc(q.short)}</li>`).join("")}</ul></div>
  <div class="foot"><div class="cta"><p>Compara tus ideas con las candidaturas de tu provincia</p><strong>test29n.es/tests/${k}</strong></div>
  <p class="note">Gratis y sin registro: tus respuestas no salen de tu móvil. No te dice a quién votar.</p></div>`);
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].split("/").pop())) {
  fs.mkdirSync(OUT, { recursive: true });
  for (const f of fs.readdirSync(OUT)) if (f.endsWith(".png")) fs.unlinkSync(OUT + f);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const shot = async (doc, file) => {
    const tmp = ROOT + "_redes.html"; fs.writeFileSync(tmp, doc);
    await p.goto("file://" + tmp, { waitUntil: "networkidle" }); await p.evaluate(() => document.fonts.ready);
    // Si la pregunta no cabe, se reduce la letra poco a poco (mínimo 44 px)
    await p.evaluate(() => { const q = document.querySelector(".q, .big"), b = document.querySelector(".card"); if (!q) return;
      let s = parseFloat(getComputedStyle(q).fontSize); while (s > 44 && (b.scrollHeight > b.clientHeight + 1 || q.scrollWidth > q.clientWidth + 1)) { s -= 2; q.style.fontSize = s + "px"; } });
    const over = await p.evaluate(() => [...document.querySelectorAll(".card, .body")].some((e) => e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1) || [...document.querySelectorAll(".big, .q")].some((e) => e.scrollWidth > e.clientWidth + 1));
    if (over) { const why = await p.evaluate(() => [...document.querySelectorAll(".card, .body, .big, .q")].map((e) => `${e.className} ${e.scrollWidth}/${e.clientWidth} ${e.scrollHeight}/${e.clientHeight} ${e.style.fontSize}`).join("; ")); throw new Error(`${file}: el contenido no cabe (${why})`); }
    await p.screenshot({ path: OUT + file }); fs.unlinkSync(tmp);
  };
  const sched = dailySchedule();
  for (const d of sched) await shot(dailyHtml(d), d.file);
  for (const [k, t] of Object.entries(TOPICS)) await shot(topicHtml(k, t), `test-${k}.png`);
  await b.close();
  console.log(`qa/redes: ${sched.length} preguntas del día (${sched[0].iso} a ${sched.at(-1).iso}) y ${Object.keys(TOPICS).length} tarjetas por tema`);
}
