# Descarga las tipografías (Archivo y Newsreader, licencia SIL OFL) para servirlas desde la propia web,
# sin enviar la IP de cada visitante a Google. Solo subconjuntos latin y latin-ext.
# Uso: python3 qa/fonts.py
import re, urllib.request, os, hashlib
URL = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&display=swap"
UA = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"}
css = urllib.request.urlopen(urllib.request.Request(URL, headers=UA), timeout=30).read().decode()
blocks = re.findall(r"/\* ([\w-]+) \*/\s*(@font-face \{.*?\})", css, re.S)
out = []
for subset, block in blocks:
    if subset not in ("latin", "latin-ext"): continue
    src = re.search(r"url\((https://[^)]+\.woff2)\)", block).group(1)
    fam = re.search(r"font-family: '([^']+)'", block).group(1).replace(" ", "")
    style = re.search(r"font-style: (\w+)", block).group(1)
    data = urllib.request.urlopen(urllib.request.Request(src, headers=UA), timeout=30).read()
    name = f"{fam}-{style}-{subset}-{hashlib.sha1(data).hexdigest()[:8]}.woff2"
    open(f"assets/fonts/{name}", "wb").write(data)
    out.append(f"/* {subset} */\n" + block.replace(src, f"fonts/{name}"))
    print(name, len(data) // 1024, "KB")
open("assets/fonts.css", "w").write("/* Archivo y Newsreader · SIL Open Font License 1.1 · servidas desde esta web */\n" + "\n".join(out) + "\n")
