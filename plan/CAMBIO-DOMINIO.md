# Cambio de dominio: test29n.es → miradapolitica.es

**No antes del 30 de noviembre de 2026** (orden del titular, 17 nov): hasta entonces test29n.es no cambia en nada
(ni contenido, ni URLs, ni DNS, ni canónicas). Del 24 al 28 hay congelado. Este documento es el guion del día del cambio.

## Qué está hecho (17 nov, solo en `fuente`)
- El dominio se escribe en **un único sitio**: `sitio.mjs` (`DOMINIO = "test29n.es"`). De ahí salen canónicas, sitemap,
  robots.txt, og:url/og:image, datos estructurados (WebSite, WebApplication, BreadcrumbList), enlaces absolutos, textos
  visibles con el dominio, manifest, `CNAME`, el contador (solo cuenta en ese dominio), los enlaces de compartir de
  `papeleta.js` (publish.mjs los cambia al generar), `indexnow.mjs` y las pruebas.
- Con `test29n.es`, `dist/` sale **idéntica byte a byte** a la de antes del cambio (comprobado con `diff -r`).
- `node qa/dominio.mjs` (también en `node qa/run.mjs paginas`) genera la web en una copia con otro dominio y falla si queda
  una sola mención al actual en `dist/`, o si alguien vuelve a escribir el dominio a mano. Comprobado: 262 archivos, 237 URL.
- No cambia: el correo `test29n.es@gmail.com` (es una cuenta, no un enlace; cambiarlo es otra decisión) ni el nombre
  «Test 29N» (renombrar la marca a «Mirada Política» es otra decisión del titular).

## Lo que hace el titular AHORA (no afecta a test29n.es)
1. **Search Console**: añadir la propiedad de dominio `miradapolitica.es` y verificarla con el registro **TXT** que da Google
   (en el DNS de miradapolitica.es; no toca test29n.es). Así el 30 la «Herramienta de cambio de dirección» estará disponible.
2. **Renovación automática** activada en los dos dominios (test29n.es tiene que seguir vivo al menos un año para las 301).
3. Nada más: **no** apuntar el DNS de miradapolitica.es a GitHub ni publicar nada allí antes del 30 (si Google ve la misma
   web en dos dominios, puede tratarla como duplicada).
4. Opcional, sin activar nada: crear cuenta gratuita en Cloudflare (se usa el día 30, ver abajo).

## Por qué hace falta Cloudflare (u otra pieza)
GitHub Pages solo sirve **un** dominio propio por repositorio y no da redirecciones 301 hacia otro dominio: al cambiar
`CNAME`, test29n.es dejaría de responder (404). Una página con `meta refresh` o JavaScript no vale: el «Cambio de dirección»
de Search Console exige **301** de las URL antiguas a las nuevas, URL a URL.
Opción recomendada: **Cloudflare (gratis)** como DNS de test29n.es, con una regla de redirección 301 que conserva ruta y
parámetros. Alternativa: la «redirección web» del registrador, solo si es 301 y conserva la ruta (comprobarlo antes).

## Guion del día del cambio (a partir del 30 nov)
**Paso 0 · Cloudflare para test29n.es (horas antes, sin efecto visible)**
- Cloudflare → Add site `test29n.es` (plan Free). Importa los registros actuales; dejarlos **igual y en gris (DNS only)**:
  A `@` 185.199.108.153 / .109.153 / .110.153 / .111.153 · AAAA `@` 2606:50c0:8000::153 / 8001::153 / 8002::153 / 8003::153 ·
  CNAME `www` → `menendezpeoe-maker.github.io`. Copiar también cualquier MX/TXT existente (verificaciones de Google, correo).
- En el registrador de test29n.es, cambiar los **nameservers** por los de Cloudflare. Esperar a que Cloudflare diga «Active»
  (de minutos a 24 h). La web sigue igual mientras tanto, porque los registros son los mismos.

**Paso 1 · DNS de miradapolitica.es → GitHub Pages**
- A `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
- AAAA `@`: 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
- CNAME `www` → `menendezpeoe-maker.github.io`
- Opcional y recomendado: en GitHub (Settings → Pages → «Verified domains» de la cuenta) verificar miradapolitica.es con su TXT.
- Comprobar: `dig +short miradapolitica.es` devuelve las 4 IP.

**Paso 2 · Web con el dominio nuevo (en `fuente`, como siempre)**
1. `sitio.mjs`: `DOMINIO = "miradapolitica.es"`. Opcional: en `assets/papeleta.js`, `PUBLIC_URL` con el nuevo (publish lo cambia igualmente).
2. `node build.mjs && node publish.mjs` (sin `SITE_URL`) y `node qa/run.mjs todas`. `dist/CNAME` debe decir `miradapolitica.es`.
3. Regenerar las imágenes que llevan el dominio dibujado: `node qa/redes.mjs` (y revisar a ojo `qa/brand/*.png`).
4. Commit en `fuente`, anotar en ESTADO.md y publicar en `main` con el flujo habitual.
5. GitHub → Settings → Pages: comprobar que el dominio es miradapolitica.es y, cuando el certificado esté listo
   (minutos, hasta 24 h), marcar **Enforce HTTPS**.

**Paso 3 · 301 de test29n.es (justo después del paso 2)**
- Cloudflare (zona test29n.es) → DNS: pasar `@` y `www` a **naranja (Proxied)**.
- Rules → Redirect Rules → *Single Redirect*: si el host es `test29n.es` o `www.test29n.es` →
  URL dinámica `concat("https://miradapolitica.es", http.request.uri.path)`, **301**, «Preserve query string» activado.
- SSL/TLS: modo «Full». Comprobar: `curl -sI https://test29n.es/partidos/psoe/?x=1` → `301` y
  `location: https://miradapolitica.es/partidos/psoe/?x=1`; repetir con la portada, `/sitemap.xml` y `www`.

**Paso 4 · Buscadores**
- Search Console, propiedad **test29n.es** → Ajustes → **Cambio de dirección** → miradapolitica.es → Validar y actualizar.
- En la propiedad nueva: enviar `https://miradapolitica.es/sitemap.xml`. Mantener el sitemap viejo enviado unas semanas.
- Bing Webmaster Tools: añadir el sitio nuevo y usar «Site Move». Después `node indexnow.mjs` (usa `sitio.mjs`).
- GoatCounter: el contador ya solo cuenta en el dominio de `sitio.mjs`; revisar si su panel tiene el dominio anotado.

**Paso 5 · Fuera de la web**
- Perfiles en redes, firmas, materiales de prensa y enlaces de difusión: cambiar a miradapolitica.es.
- Pedir a las webs que enlazan (prensa, centros educativos) que actualicen el enlace: las 301 ayudan, pero el enlace directo es mejor.

**Mantener**: las 301 y test29n.es registrado **al menos un año** (Google recomienda 180 días como mínimo). No reutilizar test29n.es para otra cosa.
