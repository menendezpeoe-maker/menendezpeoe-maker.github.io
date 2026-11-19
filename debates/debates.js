// /debates/: buscador y orden (importancia o fecha). Todo en el navegador; no guarda ni envía nada.
(() => {
  const q = document.getElementById("db-q"), ord = document.getElementById("db-ord"), out = document.getElementById("db-n"), none = document.getElementById("db-none");
  const box = document.getElementById("db-tools"), lists = [...document.querySelectorAll(".db-sec .db-list")];
  if (!q || !ord || !lists.length) return; box.hidden = false;
  const fold = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
  const imp = lists.map((ul) => [...ul.children]);  // orden por importancia, tal como llega del servidor
  const run = () => {
    const t = fold(q.value).split(" ").filter(Boolean); let n = 0;
    lists.forEach((ul, i) => {
      const rows = ord.value === "fecha" ? [...imp[i]].sort((a, b) => a.dataset.o - b.dataset.o) : imp[i];
      let k = 0; for (const li of rows) { const ok = t.every((w) => li.dataset.q.includes(w)); li.hidden = !ok; if (ok) k++; ul.appendChild(li); }
      ul.closest(".db-sec").hidden = t.length > 0 && !k; n += k;
    });
    none.hidden = n > 0;
    out.textContent = t.length ? `${n} ${n === 1 ? "resultado" : "resultados"}.` : "";
  };
  q.addEventListener("input", run); ord.addEventListener("change", run);
  document.getElementById("db-clear").addEventListener("click", () => { q.value = ""; ord.value = "imp"; run(); q.focus(); });
  const h = new URLSearchParams(location.search).get("q"); if (h) q.value = h;
  run();
})();
