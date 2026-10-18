# Descarga el retrato principal de Wikipedia (es) de cada político, comprueba su licencia en
# Wikimedia Commons y guarda un recorte cuadrado de 320 px con su atribución.
import json, re, sys, urllib.error, urllib.request, urllib.parse, io, html
from PIL import Image
OUT = sys.argv[1]
PEOPLE = {
 "sanchez": "Pedro Sánchez", "feijoo": "Alberto Núñez Feijóo", "abascal": "Santiago Abascal",
 "ayuso": "Isabel Díaz Ayuso", "page": "Emiliano García-Page", "illa": "Salvador Illa",
 "colau": "Ada Colau", "montero": "Irene Montero", "rufian": "Gabriel Rufián",
 "nogueras": "Míriam Nogueras", "alvise": "Alvise Pérez", "esteban": "Aitor Esteban",
 "ponton": "Ana Pontón", "clavijo": "Fernando Clavijo", "monica": "Mónica García Gómez",
 "urtasun": "Ernest Urtasun",
}
UA = {"User-Agent": "Test29N/1.0 (contacto: menendezpeoe@gmail.com)"}
import time
def get(url):
    for i in range(6):
        try:
            time.sleep(1.5)
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r: return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or i == 5: raise
            wait = int(e.headers.get("Retry-After") or 0) or 8 * (i + 1)
            print(f"   429, espero {wait}s", flush=True); time.sleep(wait)
def api(base, **p):
    p.update(format="json", formatversion="2")
    return json.loads(get(base + "?" + urllib.parse.urlencode(p)))
FREE = re.compile(r"^(CC BY(-SA)? [0-9.]+( es| de)?|CC0|Public domain|Attribution|CC BY [0-9.]+|Dominio público)", re.I)
credits = {}
for pid, title in PEOPLE.items():
    q = api("https://es.wikipedia.org/w/api.php", action="query", titles=title, redirects=1, prop="pageimages|description", piprop="name")
    page = q["query"]["pages"][0]
    fname = page.get("pageimage")
    if not fname: print(pid, "SIN IMAGEN", page.get("title")); continue
    ii = api("https://commons.wikimedia.org/w/api.php", action="query", titles="File:" + fname, prop="imageinfo", iiprop="url|extmetadata|size", iiurlwidth=480)
    pg = ii["query"]["pages"][0]
    if "imageinfo" not in pg: print(pid, "NO ESTÁ EN COMMONS", fname); continue
    info = pg["imageinfo"][0]; md = info["extmetadata"]
    lic = html.unescape(md.get("LicenseShortName", {}).get("value", ""))
    artist = re.sub(r"<[^>]+>", "", html.unescape(md.get("Artist", {}).get("value", ""))).strip()
    if not FREE.match(lic): print(pid, "LICENCIA NO LIBRE", lic, fname); continue
    im = Image.open(io.BytesIO(get(info["thumburl"]))).convert("RGB")
    w, h = im.size; s = min(w, h)
    top = 0 if h > w else 0
    left = (w - s) // 2
    if h > w: top = int(min(h - s, h * 0.04))   # retratos verticales: recorte desde arriba para centrar el rostro
    im = im.crop((left, top, left + s, top + s)).resize((320, 320), Image.LANCZOS)
    im.save(f"{OUT}/{pid}.jpg", "JPEG", quality=82, optimize=True, progressive=True)
    credits[pid] = {"file": fname, "author": artist[:140] or "Desconocido", "license": lic,
                    "source": "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(fname.replace(" ", "_")),
                    "wiki": page.get("title"), "desc": page.get("description", "")}
    print(f"{pid:9} OK  {lic:16} {artist[:50]!r:52} {page.get('title')} · {page.get('description','')}")
json.dump(credits, open(f"{OUT}/credits.json", "w"), ensure_ascii=False, indent=1)
