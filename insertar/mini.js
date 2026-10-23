// Mini test del Test 29N: todo se calcula aquí, sin cookies, sin guardar nada y sin enviar respuestas.
(() => {
const D = {"site":"https://test29n.es/","qs":[{"id":"B01","text":"El Estado debería poder limitar el precio del alquiler en las zonas donde los precios se han disparado.","type":"likert","A":"","B":""},{"id":"F01","text":"España debería regularizar a los inmigrantes en situación irregular que ya viven y trabajan aquí.","type":"likert","A":"","B":""},{"id":"G01","text":"España debería alargar la vida de sus centrales nucleares más allá del calendario de cierre previsto, que termina en 2035.","type":"likert","A":"","B":""},{"id":"E01","text":"Las penas para los delincuentes multirreincidentes deberían endurecerse.","type":"likert","A":"","B":""},{"id":"K01","text":"España debería apoyar el acuerdo comercial entre la UE y Mercosur, aunque aumente la competencia para los agricultores.","type":"likert","A":"","B":""}],"parties":[{"ab":"PSOE","name":"PSOE","color":"#E30613","pos":{"B01":5,"F01":5,"G01":2,"E01":4,"K01":5}},{"ab":"PP","name":"Partido Popular","color":"#1D6FC4","pos":{"B01":1,"F01":2,"G01":5,"E01":5,"K01":4}},{"ab":"VOX","name":"Vox","color":"#4FAE32","pos":{"B01":1,"F01":1,"G01":5,"E01":5,"K01":1}},{"ab":"FA","name":"Frente Amplio","color":"#D81E72","pos":{"B01":5,"F01":5,"G01":1,"E01":1,"K01":1}},{"ab":"POD","name":"Podemos","color":"#6B2E83","pos":{"B01":5,"F01":5,"G01":1,"E01":1,"K01":1}},{"ab":"SALF","name":"Se Acabó La Fiesta","color":"#475263","pos":{"B01":1,"F01":1,"G01":5,"E01":5,"K01":1}}]};
const LIK = ["Totalmente en desacuerdo", "En desacuerdo", "Ni de acuerdo ni en desacuerdo", "De acuerdo", "Totalmente de acuerdo"];
const DIL = ["Claramente A", "Más bien A", "Las dos por igual", "Más bien B", "Claramente B"];
const el = document.getElementById("mini"), ans = {};
let i = 0;
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function q() {
  const x = D.qs[i], L = x.type === "dilema" ? DIL : LIK;
  el.innerHTML = '<p class="mini-prog">Pregunta ' + (i + 1) + ' de ' + D.qs.length + '</p><h2 class="mini-q" tabindex="-1">' + esc(x.text) + '</h2>' + (x.type === "dilema" ? '<p class="mini-ab">A: ' + esc(x.A) + '<br>B: ' + esc(x.B) + '</p>' : '') + '<div class="mini-opts">' + L.map((t, k) => '<button type="button" data-v="' + (k + 1) + '"><b>' + (k + 1) + '</b> ' + esc(t) + '</button>').join("") + '<button type="button" data-v="0" class="ns">No lo sé</button></div>';
  el.querySelector("h2").focus({ preventScroll: true });
}
function res() {
  const rows = D.parties.map((p) => { const ids = D.qs.map((x) => x.id).filter((id) => ans[id] > 0 && p.pos[id]); const pct = ids.length ? Math.round(ids.reduce((s, id) => s + 1 - Math.abs(ans[id] - p.pos[id]) / 4, 0) / ids.length * 100) : null; return { p, pct }; }).filter((r) => r.pct !== null).sort((a, b) => b.pct - a.pct || a.p.name.localeCompare(b.p.name, "es"));
  el.innerHTML = '<h2 class="mini-q" tabindex="-1">Tu coincidencia con las candidaturas de ámbito estatal</h2>' + (rows.length ? '<ol class="mini-res">' + rows.map((r) => '<li><span><i style="background:' + r.p.color + '"></i>' + esc(r.p.name) + '</span><b>' + r.pct + ' %</b></li>').join("") + '</ol>' : '<p>Has respondido «No lo sé» a todo: no hay con qué comparar.</p>') + '<p class="mini-note">Orientativo, con solo 5 preguntas. No es una recomendación de voto. Los empates se ordenan alfabéticamente. El test completo compara tus respuestas con las candidaturas de tu provincia.</p><p><a class="mini-cta" href="' + D.site + '" target="_blank" rel="noopener">Haz el test completo en test29n.es</a> <button type="button" class="mini-again">Volver a empezar</button></p>';
  el.querySelector("h2").focus({ preventScroll: true });
}
el.addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.classList.contains("mini-again")) { i = 0; for (const k in ans) delete ans[k]; q(); return; }
  if (b.dataset.v === undefined) return;
  ans[D.qs[i].id] = Number(b.dataset.v); i++;
  if (i < D.qs.length) q(); else res();
});
q();
})();
