import numpy as np, json, wave, subprocess, sys
SR=44100; BPM=120; BEAT=60/BPM
ev=json.load(open('events.json'))
rng=np.random.default_rng(11)
def f(semi): return 440*2**(semi/12)   # semitonos respecto a La4
def tarr(d): return np.arange(int(d*SR))/SR
def add(buf,sig,t0,gain=1.0,pan=0.0):
    i=int(t0*SR)
    if i>=buf.shape[0]: return
    n=min(len(sig),buf.shape[0]-i)
    if n<=0: return
    l=gain*(1-max(pan,0)); r=gain*(1+min(pan,0))
    buf[i:i+n,0]+=sig[:n]*l; buf[i:i+n,1]+=sig[:n]*r
def hp(x): return np.concatenate([[0],np.diff(x)])
def kick():
    t=tarr(.34); ph=2*np.pi*(45*t+105/35*(1-np.exp(-35*t)))
    return np.sin(ph)*np.exp(-t*9)*1.0+0.25*hp(rng.standard_normal(len(t)))*np.exp(-t*160)
def clap():
    t=tarr(.28); n=hp(rng.standard_normal(len(t)))
    e=np.exp(-t*22)
    for d in (0.012,0.024):
        e=e+np.where(t>d,np.exp(-(t-d)*60),0)*.5
    return n*e*.35
def hat(open_=False):
    t=tarr(.25 if open_ else .07); n=hp(hp(rng.standard_normal(len(t))))
    return n*np.exp(-t*(16 if open_ else 110))*(.14 if open_ else .2)
def saw(freq,d,harm,decay,att=.004):
    t=tarr(d); s=sum(np.sin(2*np.pi*freq*k*t)/k for k in range(1,harm+1))*0.55
    e=np.minimum(t/att,1)*np.exp(-t*decay); return s*e
def pad(freqs,d):
    t=tarr(d); s=sum(np.sin(2*np.pi*fr*t)+.5*np.sin(2*np.pi*fr*2.003*t) for fr in freqs)/ (len(freqs)*1.5)
    e=np.minimum(t/.5,1)*np.minimum((d-t)/.4,1); return s*e
def whoosh(L=.5):
    t=tarr(L); n=hp(rng.standard_normal(len(t))); e=(t/L)**1.8*np.exp(-((t/L)**8)); return n*e*.5
def ding():
    t=tarr(.9); return (np.sin(2*np.pi*1318.5*t)*np.exp(-t*6)*.25+np.sin(2*np.pi*1975.5*t)*np.exp(-t*8)*.12+np.sin(2*np.pi*2637*t)*np.exp(-t*12)*.06)
def pop(freq=620):
    t=tarr(.16); fr=freq*(1+.6*np.exp(-t*40)); ph=2*np.pi*np.cumsum(fr)/SR
    return np.sin(ph)*np.exp(-t*26)*.35
def blip(freq):
    t=tarr(.06); return np.sin(2*np.pi*freq*t)*np.exp(-t*50)*.14
def riser(L):
    t=tarr(L); fr=200+1800*(t/L)**2; ph=2*np.pi*np.cumsum(fr)/SR
    n=hp(rng.standard_normal(len(t)))
    return (np.sin(ph)*.18+n*.22)*(t/L)**1.6
def crash():
    t=tarr(2.2); return hp(rng.standard_normal(len(t)))*np.exp(-t*2.6)*.38
CH={'min':[0,3,7],'maj':[0,4,7]}
KEYS={ # (progresión de acordes: (raíz en semitonos desde La, tipo)), nombre
 'v1_de_acuerdo':[(0,'min'),(-4,'maj'),(-9,'maj'),(-2,'maj')],     # Am F C G
 'v2_sin_registro':[(-9,'maj'),(0,'min'),(-4,'maj'),(-2,'maj')],   # C Am F G
 'v3_cinco_numeros':[(-7,'min'),(-11,'maj'),(-4,'maj'),(-9,'maj')],# Dm Bb F C
 'v4_fuentes':[(-5,'min'),(-9,'maj'),(-2,'maj'),(-7,'maj')],       # Em C G D
 'v5_mapa':[(-2,'min'),(-6,'maj'),(-11,'maj'),(-4,'maj')]}         # Gm Eb Bb F
def build(name):
    e=ev[name]; T=e['T']; end=e['end']; prog=KEYS[name]
    buf=np.zeros((int((T+1)*SR),2)); nb=int(T/BEAT)+2
    drop0,drop1=end-2.0,end   # breakdown antes de la tarjeta final
    def active(t,kind):
        if kind=='kick': return t<drop0 or t>=drop1
        return True
    kicks=[]
    for b in range(nb):
        t=b*BEAT; bar=int(t//(BEAT*4))
        chord=prog[bar%4]; root=chord[0]; tri=[root+x for x in CH[chord[1]]]
        in_drop=drop0<=t<drop1
        # kick (cada pulso), empieza en el compás 0
        if not in_drop and t<T-.6: add(buf,kick(),t,.95); kicks.append(t)
        if not in_drop and t<T-.6:
            if bar>=1 and b%2==1: add(buf,clap(),t,.9)
            add(buf,hat(),t+BEAT/2,1.0); add(buf,hat(),t,.5)
            if b%4==3: add(buf,hat(True),t+BEAT/2,1.0)
            # bajo en corcheas
            if bar>=1 or t>=end:
                for h in range(2):
                    tt=t+h*BEAT/2; note=root-24 if (h==0 or b%2==1) else root-24+7
                    add(buf,saw(f(note),.42,9,3.2),tt,.42)
            # arpegio en semicorcheas
            if bar>=2 or t>=end:
                seq=[tri[0],tri[1],tri[2],tri[1]]
                for q in range(4):
                    tt=t+q*BEAT/4; note=seq[q]+(12 if (t>=end or b%8>=4) else 0)
                    add(buf,saw(f(note),.2,6,10),tt,.12,pan=(-.5 if q%2 else .5))
        # pad (todas las secciones)
        if b%4==0:
            add(buf,pad([f(x-12) for x in tri],BEAT*4+.1),t,.5)
    for t in e['trans']: add(buf,whoosh(),t-.5,.9)
    for t in e['dings']: add(buf,ding(),t,.9)
    for t in e['ticks']: add(buf,pop(560+60*(e['ticks'].index(t)%5)),t,1.0)
    for (s,d) in e['counts']:
        n=int(d/.07)
        for k in range(n): add(buf,blip(500+900*(k/n)**1.5),s+k*.07,1.0)
    for t in e['hits']: add(buf,kick(),t,1.1); add(buf,pop(300),t,.9)
    for t in e['words']:
        pass
    add(buf,riser(2.0),drop0,1.0); add(buf,crash(),end,1.0); add(buf,kick(),end,1.2)
    # sidechain suave: baja música en cada kick
    duck=np.ones(buf.shape[0])
    for t in kicks:
        i=int(t*SR); n=int(.22*SR); 
        if i+n<len(duck): duck[i:i+n]=np.minimum(duck[i:i+n],1-.45*np.exp(-np.arange(n)/SR*18))
    out=buf[:int(T*SR)]
    out=out/ max(1e-9,np.abs(out).max())*.9
    pcm=(np.clip(out,-1,1)*32767).astype('<i2')
    w=wave.open(f'audio/{name}_raw.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes()); w.close()
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'audio/{name}_raw.wav','-af',f'highpass=f=28,acompressor=threshold=-17dB:ratio=3:attack=4:release=90,loudnorm=I=-14:TP=-1.5:LRA=9,afade=t=out:st={T-.9}:d=0.9','-ar','44100',f'audio/{name}.wav'],check=True)
import os; os.makedirs('audio',exist_ok=True)
for n in ev: 
    if len(sys.argv)<2 or n==sys.argv[1]: build(n); print('ok',n)
