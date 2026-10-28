# Extrae del BOE las candidaturas al Congreso por circunscripción (BOE-A-2026-22607, listas provisionales del 28 oct 2026).
# Uso: curl -sS https://www.boe.es/boe/dias/2026/10/28/pdfs/BOE-A-2026-22607.pdf -o c.pdf && pdftotext -layout c.pdf c.txt
#      python3 -I qa/herramientas/boe-candidaturas.py c.txt cong.json   (en la proclamación definitiva, cambia el PDF por el del 3 nov)
import re, json, sys
t = open(sys.argv[1], encoding="utf8").read()
t = re.sub(r"\n\s*BOLETÍN OFICIAL DEL ESTADO\n\s*Núm\. \d+[^\n]*\n", "\n", t)
parts = re.split(r"\n\s*JUNTA ELECTORAL DE ([^\n]+)\n", t)
res = {}
for i in range(1, len(parts), 2):
    c = re.search(r"CONGRESO DE LOS DIPUTADOS(.*?)(?:\n\s*SENADO\b|$)", parts[i + 1], re.S).group(1)
    heads = []
    for l in c.split("\n"):
        m = re.match(r"^\s*(\d+)\.\s+(\S.*?)\s*$", l)
        if m and not m.group(2).endswith(".") and ("(" in m.group(2) or (m.group(2) == m.group(2).upper() and len(m.group(2)) > 2)):
            heads.append(m.group(2))
    res[parts[i].strip()] = heads
json.dump(res, open(sys.argv[2], "w"), ensure_ascii=False, indent=1)
print(len(res), "circunscripciones,", sum(len(v) for v in res.values()), "candidaturas")
