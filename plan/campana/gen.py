import math, json
CSS = """
@font-face{font-family:Archivo;src:url(../fonts/archivo.woff2);font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(../fonts/newsreader.woff2);font-weight:200 800}
@property --n{syntax:'<integer>';initial-value:0;inherits:false}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1080px;overflow:hidden;background:#111318;color:#F2F3EE;font-family:Archivo,Arial,sans-serif}
.bg{position:absolute;inset:0;background:
 radial-gradient(900px 600px at 80% -10%,rgba(246,221,47,.16),transparent 60%),
 linear-gradient(rgba(242,243,238,.04) 1px,transparent 1px) 0 0/54px 54px,
 linear-gradient(90deg,rgba(242,243,238,.04) 1px,transparent 1px) 0 0/54px 54px,#111318}
.sc{position:absolute;inset:0;padding:90px 80px;display:flex;flex-direction:column;justify-content:center;animation:sc var(--dur) linear var(--s) both}
@keyframes sc{0%{opacity:0}1.5%{opacity:1}97%{opacity:1}100%{opacity:0}}
.y{color:#F6DD2F}
.logo{position:absolute;top:48px;left:80px;display:flex;align-items:center;gap:14px;font-weight:900;font-stretch:125%;font-size:34px;letter-spacing:-.01em;z-index:5}
.logo i{display:block;width:34px;height:42px;background:#F2F3EE;border-radius:4px;position:relative}
.logo i:after{content:"";position:absolute;left:5px;right:5px;top:19px;height:11px;background:#F6DD2F;border-radius:2px}
.logo b{font-weight:800;font-size:20px;border:2.5px solid #F2F3EE;border-radius:5px;padding:2px 9px 1px}
.url{position:absolute;bottom:46px;left:0;right:0;text-align:center;font-weight:700;font-size:30px;color:#AEB3BD;letter-spacing:.02em;z-index:5}
.hook{font-weight:900;font-stretch:118%;font-size:104px;line-height:1.02;letter-spacing:-.02em}
.hook.s{font-size:88px}
.big{font-weight:900;font-stretch:112%;font-size:78px;line-height:1.05;letter-spacing:-.015em}
.mid{font-weight:700;font-size:48px;line-height:1.2;color:#D9DBD6}
.lbl{font-weight:800;letter-spacing:.14em;font-size:28px;color:#F6DD2F;text-transform:uppercase;margin-bottom:26px}
.sm{font-weight:600;font-size:30px;color:#AEB3BD;line-height:1.3}
.e{animation-fill-mode:both;animation-timing-function:cubic-bezier(.2,.9,.25,1);animation-duration:.55s;animation-delay:var(--d)}
.up{animation-name:up}.pop{animation-name:pop}.fade{animation-name:fade}.wipe{animation-name:wipe;animation-duration:.7s}
@keyframes up{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:none}}
@keyframes pop{0%{opacity:0;transform:scale(.6)}70%{transform:scale(1.08)}100%{opacity:1;transform:none}}
@keyframes fade{from{opacity:0}to{opacity:1}}
@keyframes wipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}
.scale{display:flex;gap:18px;margin-top:54px}
.dot{width:118px;height:118px;border-radius:50%;border:5px solid #F2F3EE;display:grid;place-items:center;font-weight:900;font-size:50px;font-stretch:112%}
.dot.sel{animation:sel .4s ease var(--d) both}
@keyframes sel{from{background:transparent;color:#F2F3EE}to{background:#F6DD2F;color:#111318;border-color:#F6DD2F;transform:scale(1.14)}}
.ends{display:flex;justify-content:space-between;margin-top:26px;font-weight:700;font-size:28px;color:#AEB3BD}
.chips{display:flex;flex-wrap:wrap;gap:16px;margin-top:40px}
.chip{border:3px solid #F2F3EE;border-radius:999px;padding:12px 28px;font-weight:800;font-size:34px}
.chip.f{background:#F6DD2F;color:#111318;border-color:#F6DD2F}
.cta{font-weight:900;font-stretch:118%;font-size:96px;line-height:1;letter-spacing:-.02em}
.btn{display:inline-block;background:#F6DD2F;color:#111318;font-weight:900;font-stretch:112%;font-size:56px;padding:26px 48px;border-radius:999px;margin-top:44px}
.tick{display:flex;align-items:center;gap:34px;font-weight:800;font-stretch:108%;font-size:62px;margin:30px 0}
.tick span.k{width:84px;height:84px;border-radius:50%;background:#F6DD2F;display:grid;place-items:center;flex:none}
.tick svg{width:50px;height:50px}
.num{font-weight:900;font-stretch:118%;font-size:230px;line-height:.95;letter-spacing:-.03em;color:#F6DD2F;animation:cnt var(--ct) cubic-bezier(.1,.8,.2,1) var(--d) both;counter-reset:n var(--n)}
.num:after{content:counter(n)}
@keyframes cnt{from{--n:0}to{--n:var(--to)}}
.card{background:#F2F3EE;color:#111318;border-radius:28px;padding:48px;border:4px solid #F2F3EE}
.card .lbl{color:#111318;opacity:.65;font-size:24px;margin-bottom:18px}
.dash{border:4px dashed #F6DD2F;border-radius:28px;padding:44px;font-style:italic}
.tag{display:inline-block;background:#111318;color:#F6DD2F;font-weight:800;padding:8px 20px;border-radius:8px;font-size:26px;letter-spacing:.06em;text-transform:uppercase}
.neutral{position:absolute;bottom:100px;left:80px;right:80px;text-align:center;font-weight:600;font-size:26px;color:#AEB3BD}
"""
def page(body, total):
    return f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="bg"></div>{body}</body></html>'
def sc(s,e,inner,extra=''):
    return f'<section class="sc" style="--s:{s}s;--dur:{e-s}s;{extra}">{inner}</section>'
def el(d,cls,inner,tag='div',st=''):
    return f'<{tag} class="e {cls}" style="--d:{d}s;{st}">{inner}</{tag}>'
LOGO='<div class="logo"><i></i>Test <b>29N</b></div>'
def end(s,e,line):
    return sc(s,e, el(s+.1,'up',f'<div class="cta">{line}</div>') + el(s+.7,'pop','<div class="btn">test29n.es</div>') +
      el(s+1.2,'up','<div class="chips"><span class="chip f">Gratis</span><span class="chip">Sin registro</span><span class="chip">Neutral</span></div>') +
      el(s+1.6,'fade','<div class="sm" style="margin-top:36px">No es una encuesta ni una recomendación de voto.</div>'))
CHK='<svg viewBox="0 0 24 24" fill="none" stroke="#111318" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>'
vids={}
# V1
T=27
qs=[('Economía','La jornada laboral máxima debería reducirse por ley a 37,5 horas semanales sin rebaja de sueldo.',2),
    ('Vivienda','El Estado debería poder limitar el precio del alquiler en las zonas donde los precios se han disparado.',4),
    ('Exterior y defensa','España debería seguir en la OTAN.',1),
    ('Sanidad','Habría que subir los impuestos sobre el tabaco, el alcohol y las bebidas azucaradas para reducir su consumo.',5)]
b=LOGO+sc(0,3,el(.1,'up','<div class="hook">¿Estás <span class="y">de acuerdo</span> con esto?</div>'))
s=3
for lab,txt,sel in qs:
    dots=''.join(f'<div class="dot{" sel" if i==sel else ""}" style="--d:{s+1.7}s">{i}</div>' for i in range(1,6))
    b+=sc(s,s+4,el(s+.05,'up',f'<div class="lbl">{lab}</div>')+el(s+.2,'up',f'<div class="big" style="font-size:64px">«{txt}»</div>')+
      el(s+.9,'up',f'<div class="scale">{dots}</div><div class="ends"><span>Nada de acuerdo</span><span>Totalmente de acuerdo</span></div>'))
    s+=4
b+=sc(s,s+3.2,el(s+.1,'up','<div class="hook s">107 preguntas así.<br><span class="y">Cada una con su contexto neutral.</span></div>')); s+=3.2
b+=end(s,T,'Descubre con quién <span class="y">coincides</span>')+LOGO
vids['v1_de_acuerdo']=(page(b,T),T)
# V2
T=18.4
rows=['Sin registro','Sin cookies','Sin publicidad','Tus respuestas no salen de tu navegador']
b=LOGO+sc(0,3.4,el(.1,'up','<div class="hook">Tu opinión política <span class="y">es solo tuya.</span></div>'))
inner=el(.1,'up','<div class="lbl">Privacidad</div>')
for i,r in enumerate(rows):
    inner+=el(.5+i*1.1,'pop',f'<div class="tick"><span class="k">{CHK}</span><span>{r}</span></div>')
b+=sc(3.4,11.4,inner)
b+=sc(11.4,13.8,el(.1,'up','<div class="hook s">Responde. Mira tu resultado. <span class="y">Y ya.</span></div>'))
b+=end(13.8,T,'15 preguntas, <span class="y">3 minutos</span>')+LOGO
vids['v2_sin_registro']=(page(b,T),T)
# V3
T=22
nums=[(350,'diputados se eligen el 29N',''),(52,'circunscripciones',''),(29,'candidaturas en el test',''),(12,'áreas de la política española',''),(107,'preguntas en la versión completa','')]
b=LOGO+sc(0,2.8,el(.1,'up','<div class="hook">El 29N,<br><span class="y">en cinco números.</span></div>'))
s=2.8
for n,t,_ in nums:
    b+=sc(s,s+2.5,el(s+.05,'fade',f'<div class="lbl">29N</div>')+f'<div class="e fade" style="--d:{s+.05}s"><div class="num" style="--d:{s+.15}s;--ct:1.5s;--to:{n}"></div></div>'+el(s+.3,'up',f'<div class="big" style="margin-top:20px">{t}</div>'))
    s+=2.5
b+=sc(s,s+2.2,el(s+.1,'up','<div class="hook s">¿Y tú, <span class="y">con quién coincides?</span></div>')); s+=2.2
b+=end(s,T,'Compruébalo en <span class="y">3 minutos</span>')+LOGO
vids['v3_cinco_numeros']=(page(b,T),T)
# V4
T=22.6
b=LOGO+sc(0,3,el(.1,'up','<div class="hook">¿Y eso, <span class="y">dónde lo dice?</span></div>'))
b+=sc(3,10.5,el(3.1,'up','<div class="tag">Ejemplo ilustrativo</div>')+el(3.5,'up','<div class="card" style="margin-top:30px"><div class="lbl">Postura de una candidatura</div><div class="big" style="font-size:56px;color:#111318">«Defiende limitar el precio del alquiler en zonas tensionadas.»</div></div>')+
   el(6.2,'pop','<div class="card" style="margin-top:26px;background:#F6DD2F;border-color:#F6DD2F"><div class="lbl">Fuente</div><div class="mid" style="color:#111318;font-weight:800">Programa electoral, p. 31 · con enlace</div></div>'))
b+=sc(10.5,15,el(10.55,'up','<div class="lbl">Más de</div>')+el(10.6,'up','<div class="num" style="--d:10.7s;--ct:1.6s;--to:1000;font-size:200px"></div>')+el(10.9,'up','<div class="big">posturas con fuente enlazada, <span class="y">y subiendo.</span></div>'))
b+=sc(15,18,el(15.1,'up','<div class="dash"><div class="lbl">Si no hay fuente</div><div class="big" style="font-size:62px">Se marca como <span class="y">«estimada»</span>.<br>Sin disimulos.</div></div>'))
b+=end(18,T,'Tu test, <span class="y">con pruebas</span>')+LOGO
vids['v4_fuentes']=(page(b,T),T)
# V5 radar
T=24
dims=['Economía','Valores sociales','Libertades y seguridad','Modelo territorial','Inmigración','Europa y mundo','Medioambiente']
cx,cy,R=540,660,235
def pt(i,v):
    a=-math.pi/2+i*2*math.pi/7; return cx+R*v*math.cos(a), cy+R*v*math.sin(a)
def path(vals): 
    p=[pt(i,v) for i,v in enumerate(vals)]; return 'M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in p)+' Z'
shapes=[[.1]*7,[.78,.5,.66,.84,.45,.7,.58],[.4,.82,.55,.35,.78,.42,.74],[.66,.6,.8,.5,.62,.88,.44]]
rings=''.join('<path d="%s" fill="none" stroke="rgba(242,243,238,.22)" stroke-width="2"/>'%path([k]*7) for k in (.33,.66,1))
axes=''.join('<line x1="%d" y1="%d" x2="%.1f" y2="%.1f" stroke="rgba(242,243,238,.22)" stroke-width="2"/>'%(cx,cy,*pt(i,1)) for i in range(7))
labs=''.join('<text x="%.1f" y="%.1f" text-anchor="middle" fill="#F2F3EE" font-family="Archivo" font-weight="800" font-size="30">%s</text>'%(pt(i,1.2)[0],pt(i,1.2)[1]+(8 if i in(2,3) else 0),d) for i,d in enumerate(dims))
kf='@keyframes morph{0%%{d:path("%s")}20%%{d:path("%s")}45%%{d:path("%s")}70%%{d:path("%s")}100%%{d:path("%s")}}'%(path(shapes[0]),path(shapes[1]),path(shapes[2]),path(shapes[3]),path(shapes[3]))
svg='<style>%s .poly{animation:morph 13s ease-in-out 3.2s both;fill:rgba(246,221,47,.30);stroke:#F6DD2F;stroke-width:6;stroke-linejoin:round}</style><svg viewBox="0 0 1080 1080" width="1080" height="1080" style="position:absolute;inset:0">%s%s<path class="poly" d=""/>%s</svg>'%(kf,rings,axes,labs)
b=LOGO+sc(0,3.2,el(.1,'up','<div class="hook s">No eres solo «de izquierdas» o <span class="y">«de derechas».</span></div>'))
b+=sc(3.2,16.4,'<div style="position:absolute;inset:0">'+svg+'</div>'+el(3.3,'up','<div class="big" style="font-size:56px">Tu posición, en <span class="y">7 dimensiones</span></div>','div','position:absolute;top:120px;left:80px;right:80px')+el(3.6,'fade','<div class="tag">Ejemplo ilustrativo</div>','div','position:absolute;top:262px;left:80px'),'padding:0')
b+=sc(16.4,19.6,el(16.5,'up','<div class="hook s">12 áreas.<br>107 preguntas.<br><span class="y">Tu mapa político.</span></div>'))
b+=end(19.6,T,'Descubre <span class="y">el tuyo</span>')+LOGO
vids['v5_mapa']=(page(b,T),T)
import os
os.makedirs('html',exist_ok=True)
for k,(h,t) in vids.items(): open(f'html/{k}.html','w',encoding='utf-8').write(h)
json.dump({k:t for k,(h,t) in vids.items()},open('durs.json','w'))
print({k:t for k,(h,t) in vids.items()})
