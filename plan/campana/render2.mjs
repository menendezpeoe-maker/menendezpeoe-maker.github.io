import { createRequire } from "module"; import fs from "fs"; import { execSync } from "child_process";
const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2]);
const durs = JSON.parse(fs.readFileSync("durs2.json")); const only = process.argv[3]; const prev = process.argv[4];
const b = await chromium.launch();
fs.mkdirSync("out2", { recursive: true });
for (const [k, T] of Object.entries(durs)) {
  if (only && only !== "all" && k !== only) continue;
  const p = await (await b.newContext({ viewport: { width: 1080, height: 1080 } })).newPage();
  await p.goto("file://" + process.cwd() + `/html2/${k}.html`); await p.waitForTimeout(700);
  const shot = async (t, path) => { await p.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; } }, t * 1000); await p.screenshot({ path }); };
  if (prev) { fs.mkdirSync("prev2", { recursive: true }); for (const t of prev.split(",").map(Number)) await shot(t, `prev2/${k}_${t}.png`); await p.close(); continue; }
  fs.rmSync(`frames2/${k}`, { recursive: true, force: true }); fs.mkdirSync(`frames2/${k}`, { recursive: true });
  const N = Math.round(T * 30);
  for (let i = 0; i < N; i++) await shot(i / 30, `frames2/${k}/f${String(i).padStart(5, "0")}.png`);
  execSync(`ffmpeg -y -loglevel error -framerate 30 -i frames2/${k}/f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart out2/${k}_mudo.mp4`);
  fs.rmSync(`frames2/${k}`, { recursive: true, force: true });
  console.log("ok", k, N); await p.close();
}
await b.close();
