#!/bin/sh
# Envuelve la página en el esqueleto que añade el publicador, para probarla en local
cd "$(dirname "$0")/.."
{ printf '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0;font:14px system-ui}img{max-width:100%%}[hidden]{display:none!important}</style></head><body>'; cat papeleta-29n.html; printf '</body></html>'; } > _local.html
