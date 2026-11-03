# Comprueba que responden todas las fuentes de las posturas (data/preguntas.json). Sin navegador ni modelo: solo curl.
# Uso: python3 -I qa/herramientas/comprobar-enlaces.py [salida.json]
# Una petición por URL distinta (sin el #page=N), 8 a la vez, con reintento. Resultado: por URL, código HTTP y qué
# posturas la usan. «ok» = 2xx; «redir» = acaba en otro dominio; «fallo» = 4xx/5xx/sin respuesta (revisar a mano).
# Algunos sitios bloquean a los robots (403/429) aunque la página exista: esos se marcan «bloqueado» y se revisan aparte.
import json, sys, subprocess, concurrent.futures as cf
from urllib.parse import urlparse
B = json.load(open("data/preguntas.json", encoding="utf8"))
uses = {}
for q in B["questions"]:
    for pid, s in (q.get("src") or {}).items():
        uses.setdefault(s[0].split("#")[0], []).append(f"{q['id']}/{pid}")
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
def check(url):
    last = None
    for _ in range(2):
        r = subprocess.run(["curl", "-sS", "-L", "-m", "40", "-o", "/dev/null", "-A", UA, "-H", "Accept-Language: es-ES,es;q=0.9",
                            "-w", "%{http_code} %{url_effective}", url], capture_output=True, text=True)
        code, _, eff = (r.stdout or "000 ").partition(" ")
        last = (code, eff.strip(), (r.stderr or "").strip()[:120])
        if code.startswith("2"): break
    code, eff, err = last
    host = lambda u: urlparse(u).netloc.removeprefix("www.")
    st = "ok" if code.startswith("2") else "bloqueado" if code in ("401", "403", "429", "999") else "fallo"
    if st == "ok" and eff and host(eff) != host(url): st = "redir"
    return {"url": url, "http": code, "final": eff if eff != url else "", "estado": st, "error": err if st == "fallo" else "", "posturas": uses[url]}
with cf.ThreadPoolExecutor(8) as ex: res = list(ex.map(check, sorted(uses)))
out = sys.argv[1] if len(sys.argv) > 1 else "enlaces.json"
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
from collections import Counter
c = Counter(r["estado"] for r in res)
print(f"{len(res)} URL distintas en {sum(len(v) for v in uses.values())} posturas: " + ", ".join(f"{k} {v}" for k, v in c.most_common()))
