// Prueba la sección «Compartir» sobre la versión de producción (dist/).
import { createRequire } from "module";
import fs from "fs";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const BASE = process.env.BASE || "http://127.0.0.1:8766/";
const OUT = new URL("./shots/", import.meta.url).pathname;
const bank = JSON.parse(fs.readFileSync(new URL("../data/preguntas.json", import.meta.url)));
const fails = [], errors = [];
const ok = (c, m) => (c ? console.log("  ✓", m) : fails.push(m));
const browser = await chromium.launch();

for (const vp of [{ w: 390, h: 860, tag: "móvil", touch: true }, { w: 1280, h: 900, tag: "escritorio" }]) {
  console.log(vp.tag);
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: !!vp.touch, acceptDownloads: true, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await ctx.newPage();
  page.on("console", (m) => { if (m.type() === "error") errors.push(`[${vp.tag}] ${m.text()}`); });
  page.on("pageerror", (e) => errors.push(`[${vp.tag}] ${e}`));
  await page.goto(BASE);
  await page.waitForSelector("#start-btn:not([disabled])");
  ok(/^Test político 2026: ¿con qué partido coincides\? · Elecciones 29N$/.test(await page.title()), "título de la página");
  ok(await page.$eval('meta[property="og:image"]', (m) => m.content.endsWith("og.png")), "metadatos Open Graph");
  await page.click("#start-btn");
  await page.waitForSelector("#v-quiz:not([hidden])");
  const n = Number((await page.textContent("#q-count")).split("/")[1]);
  for (let i = 0; i < n; i++) {
    const code = await page.textContent("#q-main .q-code");
    const q = bank.questions.find((x) => `${bank.areas.find((a) => a.id === x.area).letter}·${x.id.slice(1)}` === code);
    await page.click(`#q-main .opt:nth-child(${q.pos[process.env.PID || "adel"] || 3})`);
    await page.waitForTimeout(400);
  }
  await page.waitForSelector("#v-prios:not([hidden])");
  await page.selectOption("#f-prov", process.env.PROVX || "sevilla");
  await page.click("#prio-skip");
  await page.waitForSelector("#r-share .sbtn");
  ok(/Adelante Andalucía/.test(await page.textContent(".tm-name")), "resultado correcto (Adelante Andalucía)");
  // Texto y enlaces
  const text = await page.inputValue("#sh-text");
  ok(text.includes("Adelante Andalucía") && /\d+ %/.test(text) && text.includes("Haz el test aquí: " + BASE), "mensaje con resultado real y URL");
  const xh = await page.getAttribute("#sh-x", "href");
  const xt = new URL(xh).searchParams.get("text");
  ok(xh.startsWith("https://x.com/intent/tweet?text=") && xt === text, "X: texto codificado y decodificado sin pérdidas (tildes, %, ¿)");
  const wh = await page.getAttribute("#sh-wa", "href");
  ok(wh.startsWith("https://wa.me/?text=") && new URL(wh).searchParams.get("text") === text && !/wa\.me\/\d/.test(wh), "WhatsApp: sin destinatario fijo y texto íntegro");
  ok((await page.getAttribute("#sh-x", "target")) === "_blank", "X y WhatsApp abren en otra pestaña");
  // Editar el mensaje actualiza los enlaces
  await page.fill("#sh-text", "Prueba con tildes: ¿Qué tal? Ñ & 100 % #29N");
  ok(new URL(await page.getAttribute("#sh-x", "href")).searchParams.get("text") === "Prueba con tildes: ¿Qué tal? Ñ & 100 % #29N", "editar el mensaje actualiza X");
  ok(new URL(await page.getAttribute("#sh-wa", "href")).searchParams.get("text").includes("Ñ & 100 %"), "editar el mensaje actualiza WhatsApp");
  // Quitar el partido regenera
  await page.uncheck("#sh-party");
  ok(!(await page.inputValue("#sh-text")).includes("coincidencia"), "sin partido: el mensaje no lo incluye");
  await page.check("#sh-party");
  // Copiar
  await page.click("#sh-copy");
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  ok(clip === (await page.inputValue("#sh-text")), "copiar resultado al portapapeles");
  ok((await page.textContent("#toast")).includes("Mensaje copiado"), "confirmación «Mensaje copiado»");
  // Tarjeta: vista previa y descarga en tres formatos
  for (const [fmt, w, h] of [["story", 1080, 1920], ["square", 1080, 1080], ["wide", 1200, 630]]) {
    await page.check(`input[name=sh-fmt][value=${fmt}]`, { force: true });
    await page.waitForFunction(([w, h]) => { const i = document.querySelector("#sh-img"); return !i.hidden && i.complete && i.naturalWidth === w && i.naturalHeight === h; }, [w, h], { timeout: 8000 }).catch(() => {});
    const dim = await page.$eval("#sh-img", (i) => [i.naturalWidth, i.naturalHeight]);
    ok(dim[0] === w && dim[1] === h, `tarjeta ${fmt} ${dim.join("×")}`);
    const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#sh-dl")]);
    const path = `${OUT}card-${vp.tag === "móvil" ? "m" : "d"}-${fmt}.png`;
    await dl.saveAs(path);
    const buf = fs.readFileSync(path);
    ok(buf.slice(1, 4).toString() === "PNG" && buf.readUInt32BE(16) === w && buf.readUInt32BE(20) === h, `descarga PNG ${fmt} (${dl.suggestedFilename()})`);
  }
  // Instagram en Chromium de escritorio: sin compartir archivos nativo → descarga con instrucciones
  const canShareFiles = await page.evaluate(() => !!(navigator.canShare && navigator.canShare({ files: [new File([""], "a.png", { type: "image/png" })] })));
  const [igdl] = await Promise.all([page.waitForEvent("download", { timeout: 5000 }).catch(() => null), page.click("#sh-ig")]);
  await page.waitForTimeout(300);
  const st = await page.textContent("#sh-status");
  ok(canShareFiles || (igdl && igdl.suggestedFilename() === "test-29n-historia.png" && st.includes("Tu historia")), `Instagram: ${canShareFiles ? "menú nativo de compartir" : "descarga la historia y explica cómo subirla"}`);
  // Invitar sin resultado
  await page.click("#sh-invite");
  await page.waitForTimeout(200);
  const inv = await page.evaluate(() => navigator.clipboard.readText()).catch(() => "");
  ok(inv.includes(BASE) && !inv.includes("%"), "invitar: solo el enlace, sin resultado");
  // Enlace completo con respuestas → se abre en otra pestaña
  await page.click("#r-share details summary");
  await page.click("#sh-full");
  await page.waitForTimeout(200);
  const full = await page.evaluate(() => navigator.clipboard.readText());
  ok(/#r2[0-9a-z]+$/.test(full), "enlace completo generado");
  const p2 = await ctx.newPage(); await p2.goto(full); await p2.waitForSelector(".shared-banner");
  ok(/Adelante/.test(await p2.textContent(".tm-name")), "el enlace completo reproduce el resultado en otra pestaña");
  ok(await p2.isHidden("#r-share"), "un resultado ajeno no muestra «Compartir»");
  await p2.close();
  ok(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1)), "sin scroll horizontal");
  await page.$eval("#r-share", (e) => e.scrollIntoView());
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}share-${vp.tag === "móvil" ? "m" : "d"}.png`, fullPage: false });
  // Recargar mantiene el resultado
  await page.reload();
  await page.waitForSelector("#r-share .sbtn");
  ok(/Adelante/.test(await page.textContent(".tm-name")), "recargar conserva el resultado");
  // Repetir el test
  page.once("dialog", (d) => d.dismiss());
  await page.click('[data-act="new"]');
  ok(!(await page.isHidden("#v-results")) && (await page.evaluate(() => !!localStorage.getItem("papeleta29n.v2"))), "cancelar «Repetir el test» no borra nada");
  page.once("dialog", (d) => d.accept());
  await page.click('[data-act="new"]');
  await page.waitForSelector("#v-home:not([hidden])");
  ok((await page.evaluate(() => JSON.parse(localStorage.getItem("papeleta29n.prefs")).prov)) === (process.env.PROVX || "sevilla") && (await page.isHidden("#resume")), "repetir el test vuelve al inicio, recuerda la provincia y no deja resultado guardado");
  await ctx.close();
}
// 404
{
  const page = await browser.newPage();
  const r = await page.goto(BASE + "no-existe");
  ok(r.status() === 404 || (await page.textContent("h1")).includes("blanco"), "página 404");
  await page.close();
}
await browser.close();
console.log("\nErrores de consola:", errors.length ? errors : "ninguno");
console.log(fails.length ? `FALLOS (${fails.length}):\n - ${fails.join("\n - ")}` : "TODO OK");
