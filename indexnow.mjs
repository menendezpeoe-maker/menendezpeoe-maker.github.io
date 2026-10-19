// Avisa a Bing y a otros buscadores (protocolo IndexNow) de todas las URL del sitemap publicado.
// Uso, después de publicar: node indexnow.mjs
import { readFileSync } from "node:fs";
const KEY = /INDEXNOW_KEY = "([0-9a-f]{32})"/.exec(readFileSync("publish.mjs", "utf8"))[1];
const SITE = "https://test29n.es/";
const sitemap = await (await fetch(SITE + "sitemap.xml")).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const keyOk = (await (await fetch(`${SITE}${KEY}.txt`)).text()).trim() === KEY;
if (!keyOk) throw new Error("La clave de IndexNow aún no está publicada");
const r = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}${KEY}.txt`, urlList }) });
console.log(`IndexNow: ${r.status} ${r.statusText} · ${urlList.length} URL`);
