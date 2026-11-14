// /programas/: búsqueda por nombre o sigla y filtro por circunscripción. Todo en el navegador; no guarda ni envía nada.
(() => {
  const q = document.getElementById("pg-q"), pr = document.getElementById("pg-prov"), out = document.getElementById("pg-n"), none = document.getElementById("pg-none");
  const box = document.getElementById("pg-tools"), rows = [...document.querySelectorAll("#pg-all > li")];
  if (!q || !pr || !rows.length) return; box.hidden = false;
  const fold = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  const run = () => {
    const t = fold(q.value), p = pr.value, name = p ? pr.options[pr.selectedIndex].text : "";
    let n = 0, pub = 0;
    for (const li of rows) { const ok = (!t || li.dataset.q.includes(t)) && (!p || li.dataset.p.split(" ").includes(p)); li.hidden = !ok; if (ok) { n++; pub += +li.dataset.pub; } }
    none.hidden = n > 0;
    const c = n === 1 ? "candidatura" : "candidaturas";
    out.textContent = !t && !p ? "" : p ? `En ${name}: ${n} ${c}${t ? " con ese nombre" : ""}, ${pub} con programa publicado.` : `${n} ${c} ${n === 1 ? "coincide" : "coinciden"}, ${pub} con programa publicado.`;
  };
  q.addEventListener("input", run); pr.addEventListener("change", run);
  document.getElementById("pg-clear").addEventListener("click", () => { q.value = ""; pr.value = ""; run(); q.focus(); });
  const h = new URLSearchParams(location.search).get("circ"); if (h && [...pr.options].some((o) => o.value === h)) pr.value = h;
  run();
})();
