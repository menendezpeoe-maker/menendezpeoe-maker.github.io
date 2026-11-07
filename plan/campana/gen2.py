import math, json, random, re, os
exec(open('gen.py').read().split("def page(")[0].split("CSS = ",1)[0])  # imports only
base_css = open('gen.py').read().split('CSS = """',1)[1].split('"""',1)[0]
EXTRA = """
.glow{position:absolute;left:50%;top:-22%;width:1500px;height:950px;margin-left:-750px;background:radial-gradient(closest-side,rgba(246,221,47,.24),transparent);animation:beat .5s ease-out infinite}
@keyframes beat{0%{transform:scale(1.1);opacity:1}100%{transform:scale(1);opacity:.5}}
.shape{position:absolute;opacity:.22;animation:drift var(--p) ease-in-out infinite alternate}
.shape.ring{border:5px solid #F6DD2F;border-radius:50%}.shape.sq{background:#F6DD2F}.shape.tri{width:0!important;height:0!important;border-left:var(--w) solid transparent;border-right:var(--w) solid transparent;border-bottom:calc(var(--w)*1.7) solid #F2F3EE;opacity:.12}
@keyframes drift{from{transform:translate(0,0) rotate(0)}to{transform:translate(var(--dx),var(--dy)) rotate(var(--r))}}
.track{position:absolute;left:0;right:0;bottom:0;height:12px;background:rgba(242,243,238,.12);z-index:29}
.prog{position:absolute;left:0;bottom:0;height:12px;width:100%;background:#F6DD2F;transform-origin:left;transform:scaleX(0);animation:prog var(--T) linear both;z-index:30}
@keyframes prog{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.swp{position:absolute;inset:0;z-index:20;pointer-events:none;background:#F6DD2F;transform:translateX(-101%);animation:swp .46s cubic-bezier(.7,0,.3,1) var(--d) both}
.swp.wh{z-index:19;background:#F2F3EE;animation-delay:calc(var(--d) - .05s)}
@keyframes swp{0%{transform:translateX(-101%)}50%{transform:translateX(0)}100%{transform:translateX(101%)}}
.sc{animation:sc var(--dur) linear var(--s) both,kb var(--dur) linear var(--s) both}
@keyframes kb{from{transform:scale(1)}to{transform:scale(1.05)}}
.w{display:inline-block;animation:wp .4s cubic-bezier(.2,1.4,.3,1) var(--d) both}
@keyframes wp{0%{opacity:0;transform:translateY(46px) scale(.65) rotate(-5deg)}100%{opacity:1;transform:none}}
.slam{animation:slam .5s cubic-bezier(.2,1.25,.3,1) var(--d) both}
@keyframes slam{0%{opacity:0;transform:scale(2.4)}100%{opacity:1;transform:none}}
.shk{animation:shk .36s linear var(--d) both}
@keyframes shk{0%{transform:translate(0,0)}15%{transform:translate(-16px,9px)}30%{transform:translate(14px,-11px)}45%{transform:translate(-10px,-7px)}60%{transform:translate(8px,7px)}80%{transform:translate(-3px,2px)}100%{transform:none}}
.ring2{position:absolute;border:5px solid #F6DD2F;border-radius:50%;animation:ringx .75s ease-out var(--d) both;pointer-events:none}
@keyframes ringx{0%{transform:scale(.5);opacity:.95}100%{transform:scale(2.4);opacity:0}}
.conf{position:absolute;width:26px;height:26px;background:#F6DD2F;animation:conf 1.2s cubic-bezier(.1,.7,.3,1) var(--d) both}
.conf:nth-child(3n){background:#F2F3EE;border-radius:50%}
@keyframes conf{0%{transform:translate(0,0) rotate(0) scale(1.2);opacity:1}100%{transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(.5);opacity:0}}
.btn2{display:inline-block;animation:bp .5s ease-in-out infinite}
@keyframes bp{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
.flip{animation:flip .6s cubic-bezier(.2,1.2,.3,1) var(--d) both}
@keyframes flip{0%{opacity:0;transform:perspective(900px) rotateX(-90deg)}100%{opacity:1;transform:perspective(900px) none}}
.stamp{display:inline-block;border:8px solid #F6DD2F;color:#F6DD2F;border-radius:20px;padding:10px 30px;font-weight:900;font-stretch:118%;font-size:60px;letter-spacing:.08em;transform:rotate(-9deg);animation:stamp .45s cubic-bezier(.2,1.3,.3,1) var(--d) both;background:rgba(17,19,24,.85)}
@keyframes stamp{0%{opacity:0;transform:rotate(-9deg) scale(3)}100%{opacity:1;transform:rotate(-9deg) scale(1)}}
.lb{opacity:0;animation:lbin .35s ease var(--d) both}
@keyframes lbin{from{opacity:0}to{opacity:1}}
.arrow{font-size:80px;animation:arr .5s ease-in-out infinite alternate;color:#F6DD2F;margin-top:10px;font-weight:900}
@keyframes arr{from{transform:translateY(-8px)}to{transform:translateY(12px)}}
.under{display:inline-block;position:relative}
.under:after{content:"";position:absolute;left:0;right:0;bottom:-6px;height:12px;background:#F6DD2F;transform-origin:left;transform:scaleX(0);animation:ul .5s ease var(--d) both;z-index:-1;opacity:.9}
@keyframes ul{to{transform:scaleX(1)}}
"""
CSS = base_css + EXTRA
random.seed(7)
def shapes_html():
    out=''
    for i in range(11):
        k=random.choice(['ring','sq','tri','ring'])
        size=random.randint(40,150); x=random.randint(-40,1000); y=random.randint(-40,1000)
        dx=random.randint(-160,160); dy=random.randint(-200,200); r=random.randint(-160,160); p=random.choice([2.0,3.0,4.0,5.0,6.0])
        if k=='tri': out+=f'<div class="shape tri" style="left:{x}px;top:{y}px;--w:{size//2}px;--p:{p}s;--dx:{dx}px;--dy:{dy}px;--r:{r}deg"></div>'
        else: out+=f'<div class="shape {k}" style="left:{x}px;top:{y}px;width:{size}px;height:{size}px;--p:{p}s;--dx:{dx}px;--dy:{dy}px;--r:{r}deg;{"border-radius:12px;" if k=="sq" and i%2 else ""}"></div>'
    return out
def kw(html,d0,step=.13):
    parts=re.split(r'(<span class="y">.*?</span>|<br>)',html); out=''; d=d0
    for p in parts:
        if p=='<br>': out+='<br>'; continue
        m=re.match(r'<span class="y">(.*?)</span>',p)
        txt=m.group(1) if m else p; cls=' y' if m else ''
        for w in txt.split():
            out+=f'<span class="w{cls}" style="--d:{d:.2f}s">{w}</span> '; d+=step
    return out
class V:
    def __init__(s,name,T): s.name=name;s.T=T;s.body='';s.ev={'trans':[],'ticks':[],'dings':[],'counts':[],'hits':[],'end':None,'T':T,'words':[]}
    def sc(s,a,b,inner,extra='',trans=True):
        if trans and a>0: s.ev['trans'].append(a)
        s.body+=f'<section class="sc" style="--s:{a}s;--dur:{b-a}s;{extra}">{inner}</section>'
        if trans and a>0:
            s.body+=f'<div class="swp wh" style="--d:{a-.23:.2f}s"></div><div class="swp" style="--d:{a-.23:.2f}s"></div>'
    def hook(s,a,b,html,cls='hook'):
        s.sc(a,b,f'<div class="{cls}">{kw(html,a+.1)}</div>'); s.ev['words'].append(a+.1)
    def end(s,a,line):
        s.ev['end']=a
        conf=''.join('<span class="conf" style="left:540px;top:150px;--d:%.2fs;--x:%dpx;--y:%dpx;--r:%ddeg"></span>'%(a+.05+random.random()*.12,random.randint(-520,520),random.randint(-120,520),random.randint(-300,300)) for _ in range(22))
        inner=(f'<div style="position:absolute;inset:0;overflow:visible">{conf}</div>'+
          f'<div class="cta">{kw(line,a+.1,.11)}</div>'+
          el(a+.9,'slam','<div class="btn2"><div class="btn">test29n.es</div></div>')+
          el(a+1.4,'up','<div class="chips"><span class="chip f">Gratis</span><span class="chip">Sin registro</span><span class="chip">Neutral</span></div>')+
          el(a+1.9,'fade','<div class="sm" style="margin-top:34px">No es una encuesta ni una recomendación de voto.</div>'))
        s.sc(a,s.T,inner)
    def html(s):
        return (f'<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="bg"></div><div class="glow"></div>{shapes_html()}'
                f'{s.body}{LOGO}<div class="track"></div><div class="prog" style="--T:{s.T}s"></div></body></html>')
def el(d,cls,inner,tag='div',st=''):
    return f'<{tag} class="e {cls}" style="--d:{d}s;{st}">{inner}</{tag}>'
LOGO='<div class="logo"><i></i>Test <b>29N</b></div>'
CHK='<svg viewBox="0 0 24 24" fill="none" stroke="#111318" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>'
vs={}
# ---- V1
v=V('v1_de_acuerdo',27)
v.hook(0,3,'¿Estás <span class="y">de acuerdo</span> con esto?')
qs=[('Economía','La jornada laboral máxima debería reducirse por ley a 37,5 horas semanales sin rebaja de sueldo.',2),
    ('Vivienda','El Estado debería poder limitar el precio del alquiler en las zonas donde los precios se han disparado.',4),
    ('Exterior y defensa','España debería seguir en la OTAN.',1),
    ('Sanidad','Habría que subir los impuestos sobre el tabaco, el alcohol y las bebidas azucaradas para reducir su consumo.',5)]
s=3
for lab,txt,sel in qs:
    dots=''.join(f'<div class="dot{" sel" if i==sel else ""}" style="--d:{s+2.0}s;position:relative">{i}{"<span class=ring2 style=--d:%.2fs;inset:0></span>"%(s+2.0) if i==sel else ""}</div>' for i in range(1,6))
    inner=el(s+.05,'up',f'<div class="lbl">{lab}</div>')+el(s+.25,'up',f'<div class="big" style="font-size:64px">«{txt}»</div>')+el(s+1.0,'pop',f'<div class="scale">{dots}</div><div class="ends"><span>Nada de acuerdo</span><span>Totalmente de acuerdo</span></div>')
    v.sc(s,s+4,f'<div class="shk" style="--d:{s+2.0}s">{inner}</div>'); v.ev['dings'].append(s+2.0); s+=4
v.sc(s,s+3.5,'<div class="hook s">'+kw('107 preguntas así.',s+.1)+'<br>'+kw('<span class="y">Cada una con su contexto neutral.</span>',s+.9,.12)+'</div>'); v.ev['words'].append(s+.1)
s+=3.5
v.end(s,'Descubre con quién <span class="y">coincides</span>'); vs[v.name]=v
# ---- V2
v=V('v2_sin_registro',18.5)
v.hook(0,3.5,'Tu opinión política <span class="y">es solo tuya.</span>')
rows=['Sin registro','Sin cookies','Sin publicidad','Tus respuestas no salen de tu navegador']
inner=el(3.6,'up','<div class="lbl">Privacidad</div>')
for i,r in enumerate(rows):
    t=4.0+i*1.5; v.ev['ticks'].append(t)
    inner+=el(t,'pop',f'<div class="tick"><span class="k" style="position:relative">{CHK}<span class="ring2" style="--d:{t}s;inset:0"></span></span><span>{r}</span></div>')
v.sc(3.5,11.5,inner)
v.hook(11.5,14,'Responde. Mira tu resultado. <span class="y">Y ya.</span>','hook s')
v.end(14,'15 preguntas, <span class="y">3 minutos</span>'); vs[v.name]=v
# ---- V3
v=V('v3_cinco_numeros',22.5)
v.hook(0,3,'El 29N,<br><span class="y">en cinco números.</span>')
nums=[(350,'diputados se eligen el 29N'),(52,'circunscripciones'),(29,'candidaturas en el test'),(12,'áreas de la política española'),(107,'preguntas en la versión completa')]
s=3
for n,t in nums:
    inner=(el(s+.05,'fade','<div class="lbl">29N</div>')+f'<div class="shk" style="--d:{s+1.75}s"><div class="e fade" style="--d:{s+.05}s"><div class="num" style="--d:{s+.15}s;--ct:1.5s;--to:{n}"></div></div></div>'+el(s+.35,'up',f'<div class="big" style="margin-top:20px">{t}</div>'))
    v.sc(s,s+2.5,inner); v.ev['counts'].append((s+.15,1.5)); v.ev['hits'].append(s+1.65); s+=2.5
v.hook(s,s+2.5,'¿Y tú, <span class="y">con quién coincides?</span>','hook s'); s+=2.5
v.end(s,'Compruébalo en <span class="y">3 minutos</span>'); vs[v.name]=v
# ---- V4
v=V('v4_fuentes',22.5)
v.hook(0,3,'¿Y eso, <span class="y">dónde lo dice?</span>')
v.sc(3,10.5,el(3.1,'up','<div class="tag">Ejemplo ilustrativo</div>')+el(3.5,'flip','<div class="card" style="margin-top:30px"><div class="lbl">Postura de una candidatura</div><div class="big" style="font-size:56px;color:#111318">«Defiende limitar el precio del alquiler en zonas tensionadas.»</div></div>')+
   el(6.0,'flip','<div class="card" style="margin-top:26px;background:#F6DD2F;border-color:#F6DD2F"><div class="lbl">Fuente</div><div class="mid" style="color:#111318;font-weight:800">Programa electoral, p. 31 · con enlace</div></div>')+
   el(7.5,'stamp','CON FUENTE','div','position:absolute;right:70px;top:560px'))
v.ev['dings'].append(6.0); v.ev['hits'].append(7.5)
v.sc(10.5,15,el(10.55,'up','<div class="lbl">Más de</div>')+f'<div class="shk" style="--d:12.35s"><div class="e fade" style="--d:10.6s"><div class="num" style="--d:10.7s;--ct:1.6s;--to:1000;font-size:200px"></div></div></div>'+el(11.0,'up','<div class="big">posturas con fuente enlazada, <span class="y">y subiendo.</span></div>'))
v.ev['counts'].append((10.7,1.6)); v.ev['hits'].append(12.35)
v.sc(15,18,el(15.1,'slam','<div class="dash"><div class="lbl">Si no hay fuente</div><div class="big" style="font-size:62px">Se marca como <span class="y">«estimada»</span>.<br>Sin disimulos.</div></div>')); v.ev['hits'].append(15.1)
v.end(18,'Tu test, <span class="y">con pruebas</span>'); vs[v.name]=v
# ---- V5
v=V('v5_mapa',24)
v.hook(0,3,'No eres solo «de izquierdas» o <span class="y">«de derechas».</span>','hook s')
dims=['Economía','Valores sociales','Libertades y seguridad','Modelo territorial','Inmigración','Europa y mundo','Medioambiente']
cx,cy,R=540,660,235
def pt(i,val):
    a=-math.pi/2+i*2*math.pi/7; return cx+R*val*math.cos(a), cy+R*val*math.sin(a)
def path(vals):
    p=[pt(i,x) for i,x in enumerate(vals)]; return 'M'+' L'.join(f'{x:.1f} {y:.1f}' for x,y in p)+' Z'
shapes=[[.1]*7,[.78,.5,.66,.84,.45,.7,.58],[.4,.82,.55,.35,.78,.42,.74],[.66,.6,.8,.5,.62,.88,.44]]
rings=''.join('<path d="%s" fill="none" stroke="rgba(242,243,238,.22)" stroke-width="2"/>'%path([k]*7) for k in (.33,.66,1))
axes=''.join('<line x1="%d" y1="%d" x2="%.1f" y2="%.1f" stroke="rgba(242,243,238,.22)" stroke-width="2"/>'%(cx,cy,*pt(i,1)) for i in range(7))
labs=''.join('<g class="lb" style="--d:%.2fs"><text x="%.1f" y="%.1f" text-anchor="middle" fill="#F2F3EE" font-family="Archivo" font-weight="800" font-size="30">%s</text></g>'%(3.6+i*.35,pt(i,1.2)[0],pt(i,1.2)[1]+(8 if i in(2,3) else 0),d) for i,d in enumerate(dims))
kf='@keyframes morph{0%%{d:path("%s")}20%%{d:path("%s")}45%%{d:path("%s")}70%%{d:path("%s")}100%%{d:path("%s")}}'%tuple(path(x) for x in (shapes[0],shapes[1],shapes[2],shapes[3],shapes[3]))
svg='<style>%s .poly{animation:morph 13s ease-in-out 3.6s both;fill:rgba(246,221,47,.30);stroke:#F6DD2F;stroke-width:6;stroke-linejoin:round}</style><svg viewBox="0 0 1080 1080" width="1080" height="1080" style="position:absolute;inset:0">%s%s<path class="poly" d=""/>%s</svg>'%(kf,rings,axes,labs)
v.sc(3,16.5,'<div style="position:absolute;inset:0">'+svg+'</div>'+el(3.1,'up','<div class="big" style="font-size:56px">Tu posición, en <span class="y">7 dimensiones</span></div>','div','position:absolute;top:120px;left:80px;right:80px')+el(3.4,'fade','<div class="tag">Ejemplo ilustrativo</div>','div','position:absolute;top:262px;left:80px'),'padding:0')
for i in range(7): v.ev['ticks'].append(3.6+i*.35)
v.hook(16.5,19.5,'12 áreas.<br>107 preguntas.<br><span class="y">Tu mapa político.</span>','hook s')
v.end(19.5,'Descubre <span class="y">el tuyo</span>'); vs[v.name]=v
os.makedirs('html2',exist_ok=True); durs={}; evs={}
for k,x in vs.items():
    open(f'html2/{k}.html','w',encoding='utf-8').write(x.html()); durs[k]=x.T; evs[k]=x.ev
json.dump(durs,open('durs2.json','w')); json.dump(evs,open('events.json','w'))
print(durs)
