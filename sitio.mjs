// Dominio público de la web: ÚNICO sitio donde se escribe.
// Canónicas, sitemap, robots.txt, og:url, datos estructurados, enlaces absolutos, manifest, CNAME,
// IndexNow y los enlaces de compartir del test salen de aquí. Para cambiar de dominio: cambia DOMINIO
// y vuelve a generar (procedimiento completo en plan/ESTADO.md, «Cambio de dominio»).
// SITE_URL solo sirve para pruebas locales (p. ej. qa/dominio.mjs genera la web con otro dominio).
export const DOMINIO = "test29n.es";
export const SITE = (process.env.SITE_URL || `https://${DOMINIO}/`).replace(/\/?$/, "/");
export const HOST = new URL(SITE).hostname;

// Marca (titular, 21 nov 2026): «Mirada Política» desde el 30N; el test pasa a ser una sección («Test político»).
export const MARCA = "Mirada Política";
