# Extrae del BOE las candidaturas al Congreso por circunscripción y su cabeza de lista.
# Listas provisionales: BOE-A-2026-22607 (28 oct). Proclamación definitiva: BOE-A-2026-23103 (3 nov 2026).
# Uso: curl -sS https://www.boe.es/boe/dias/2026/11/03/pdfs/BOE-A-2026-23103.pdf -o c.pdf && pdftotext -layout c.pdf c.txt
#      python3 -I qa/herramientas/boe-candidaturas.py c.txt cong.json
# Escribe cong.json ({circunscripción: [candidatura, ...]}, solo las proclamadas) y, junto a él, cabezas.json
# ({circunscripción: [[candidatura, primer nombre de la lista], ...]}) y no-proclamadas.json.
# 3 nov: el PDF definitivo parte algunas provincias en varios bloques «JUNTA ELECTORAL DE …» y marca candidaturas como
# «No proclamada.»; ahora se unen los bloques de cada provincia y esas candidaturas se descartan.
import re, json, sys, os
t = open(sys.argv[1], encoding="utf8").read()
t = re.sub(r"\n\s*BOLETÍN OFICIAL DEL ESTADO\n\s*Núm\. \d+[^\n]*\n", "\n", t)
t = re.sub(r"\n[^\n]*(Verificable en https://www\.boe\.es|cve: BOE-A-\d{4}-\d+)[^\n]*", "\n", t)
parts = re.split(r"\n\s*JUNTA ELECTORAL DE ([^\n]+)\n", t)
blocks = {}
for i in range(1, len(parts), 2):
    k = parts[i].strip()
    blocks[k] = blocks.get(k, "") + "\n" + parts[i + 1]
HEAD = re.compile(r"^\s*(\d+)\.\s+(\S.*?)\s*$")
def is_head(txt):
    return not txt.endswith(".") and ("(" in txt or (txt == txt.upper() and len(txt) > 2))
res, cab, nop = {}, {}, {}
for prov, body in blocks.items():
    m = re.search(r"CONGRESO DE LOS DIPUTADOS(.*?)(?:\n\s*SENADO\s*\n|$)", body, re.S)
    if not m:
        continue
    lines = m.group(1).split("\n")
    cands = []  # [cabecera, primer nombre, proclamada]
    cur = None
    for l in lines:
        s = l.strip()
        if not s:
            continue
        h = HEAD.match(l)
        if h and is_head(h.group(2)) and (cur is None or cur[1] is not None or cur[2] is False):
            cur = [h.group(2), None, True]; cands.append(cur); continue
        if cur is None:
            continue
        if re.match(r"^No proclamada", s, re.I):
            cur[2] = False; continue
        if cur[1] is None:
            if h and h.group(1) == "1" and h.group(2).endswith("."):
                cur[1] = re.sub(r"\s*\(.*?\)\s*", " ", h.group(2)).strip().rstrip(".").strip()
            elif not re.match(r"^(Suplentes?|Titular|\d+\.)", s):  # «Titular:» en Ceuta y Melilla (un solo escaño)
                cur[0] = f"{cur[0]} {s}"  # cabecera en dos líneas
    res[prov] = [c[0] for c in cands if c[2]]
    cab[prov] = [[c[0], c[1]] for c in cands if c[2]]
    nop[prov] = [c[0] for c in cands if not c[2]]
out = sys.argv[2]
json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
d = os.path.dirname(os.path.abspath(out))
json.dump(cab, open(os.path.join(d, "cabezas.json"), "w"), ensure_ascii=False, indent=1)
json.dump({k: v for k, v in nop.items() if v}, open(os.path.join(d, "no-proclamadas.json"), "w"), ensure_ascii=False, indent=1)
print(len(res), "circunscripciones,", sum(len(v) for v in res.values()), "candidaturas proclamadas,",
      sum(len(v) for v in nop.values()), "no proclamadas,", sum(1 for v in cab.values() for c in v if not c[1]), "sin cabeza de lista")
