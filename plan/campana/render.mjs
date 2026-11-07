import { createRequire } from "module"; import fs from "fs"; import { execSync } from "child_process";
const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2]);
const durs = JSON.parse(fs.readFileSync("durs.json")); const only = process.argv[3];
const b = await chromium.launch();
for (const [k, T] of Object.entries(durs)) {
  if (only && k !== only) continue;
  const p = await (await b.newContext({ viewport: { width: 1080, height: 1080 } })).newPage();
  await p.goto("file://" + process.cwd() + `/html/${k}.html`); await p.waitForTimeout(600);
  fs.rmSync(`frames/${k}`, { recursive: true, force: true }); fs.mkdirSync(`frames/${k}`, { recursive: true });
  const N = Math.round(T * 30);
  for (let i = 0; i < N; i++) {
    const t = i / 30 * 1000;
    await p.evaluate((t) => { for (const a of document.getAnimations()) { a.pause(); a.currentTime = t; } }, t);
    await p.screenshot({ path: `frames/${k}/f${String(i).padStart(5, "0")}.png` });
  }
  execSync(`ffmpeg -y -loglevel error -framerate 30 -i frames/${k}/f%05d.png -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart out/${k}.mp4`);
  console.log("ok", k, N);
  await p.close();
}
await b.close();
