// Utilidad local: genera las imágenes de la tarjeta de resultado (sin pruebas) para revisarlas a ojo.
const { chromium } = require("playwright"); const fs = require("fs");
const bank = JSON.parse(fs.readFileSync(__dirname + "/../data/preguntas.json"));
const OUT = process.argv[2] || ".prueba-local/r6/";
const mix = Object.fromEntries(bank.questions.map((q, i) => [q.id, i % 7 === 0 ? 3 : (q.dim === "inm" || q.dim === "lib" ? q.pos.pp : q.pos.psoe) || 3]));
const st = { v: 2, bank: bank.version, prov: "madrid", mode: "completa", seed: 7, order: bank.questions.map((q) => q.id), idx: 0, ans: mix, imp: {}, prios: [], stage: "done", t: 1 };
(async () => {
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } }); await ctx.addInitScript(() => { try { localStorage.setItem("papeleta29n.prefs", JSON.stringify({ full: true })); } catch {} }); const pg = await ctx.newPage();
  await pg.goto(process.env.BASE || "http://127.0.0.1:8765/_local.html"); await pg.waitForSelector("#start-btn:not([disabled])");
  await pg.evaluate((s) => localStorage.setItem("papeleta29n.v2", JSON.stringify(s)), st); await pg.reload(); await pg.waitForSelector("#r-share");
  for (const th of ["light", "dark"]) for (const f of ["story", "square", "wide"]) {
    await pg.evaluate((k) => { const r = document.querySelector(`input[name=sh-theme][value=${k}]`); if (r) { r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); } }, th);
    await pg.evaluate((k) => { const r = document.querySelector(`input[name=sh-fmt][value=${k}]`); r.checked = true; r.dispatchEvent(new Event("change", { bubbles: true })); }, f);
    await pg.waitForFunction(() => { const i = document.querySelector("#sh-img"); return i && !i.hidden && i.complete && i.naturalWidth > 0; }); await pg.waitForTimeout(700);
    const data = await pg.evaluate(async () => { const i = document.querySelector("#sh-img"); const r = await fetch(i.src); const bl = await r.blob(); return await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(bl); }); });
    fs.writeFileSync(OUT + "card-" + th + "-" + f + ".png", Buffer.from(data.split(",")[1], "base64")); console.log(f, "ok");
  }
  await b.close();
})();
