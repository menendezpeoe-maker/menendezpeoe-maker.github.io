# Revisor: comprueba que cada fuente responde y que su texto contiene la cita (normalizada; o la mayoría de sus palabras).
# Uso: python3 -I verificar.py resultado1.json resultado2.json > verificacion.json
import json, sys, re, subprocess, unicodedata, hashlib, os
D = os.path.dirname(os.path.abspath(__file__)); CACHE = os.path.join(D, "cache"); os.makedirs(CACHE, exist_ok=True)
def norm(s):
    s = unicodedata.normalize("NFD", s or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", " ", s).strip()
def text_of(url):
    base = url.split("#")[0]; h = hashlib.sha1(base.encode()).hexdigest()[:16]; f = os.path.join(CACHE, h)
    if not os.path.exists(f + ".txt"):
        r = subprocess.run(["curl", "-sSL", "-m", "60", "-A", "Mozilla/5.0 (X11; Linux x86_64) Chrome/126 Safari/537.36", "-o", f + ".bin", "-w", "%{http_code} %{content_type}", base], capture_output=True, text=True)
        code, _, ctype = (r.stdout or "0 ").partition(" ")
        txt = ""
        if os.path.exists(f + ".bin"):
            raw = open(f + ".bin", "rb").read()
            if raw[:4] == b"%PDF" or "pdf" in ctype:
                subprocess.run(["pdftotext", "-q", f + ".bin", f + ".pdf.txt"]); txt = open(f + ".pdf.txt", encoding="utf8", errors="ignore").read() if os.path.exists(f + ".pdf.txt") else ""
            else:
                txt = re.sub(r"<script.*?</script>|<style.*?</style>", " ", raw.decode("utf8", "ignore"), flags=re.S); txt = re.sub(r"<[^>]+>", " ", txt)
        open(f + ".txt", "w").write(json.dumps({"code": code, "text": txt}))
    return json.loads(open(f + ".txt").read())
out = []
for path in sys.argv[1:]:
    for it in json.load(open(path)):
        if it.get("estado") == "no_encontrada": out.append({"id": it["id"], "estado": it["estado"]}); continue
        r = text_of(it.get("url", "")); t = norm(r["text"]); c = norm(it.get("cita", ""))
        words = [w for w in c.split() if len(w) > 3]
        frac = (sum(1 for w in words if w in t) / len(words)) if words else 0
        exact = bool(c) and c in t
        out.append({"id": it["id"], "estado": it["estado"], "http": r["code"], "exacta": exact, "palabras": round(frac, 2), "chars": len(t)})
print(json.dumps(out, ensure_ascii=False, indent=0))
