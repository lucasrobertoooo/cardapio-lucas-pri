#!/usr/bin/env python3
"""Junta src/ em um único index.html autocontido e gera o sw.js (PWA offline)."""
import glob, hashlib, os
root=os.path.dirname(os.path.abspath(__file__)); src=os.path.join(root,'src')
r=lambda f:open(os.path.join(src,f),encoding='utf-8').read()
w=lambda f,s:open(os.path.join(root,f),'w',encoding='utf-8').write(s)
FONT_CSS='https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap'
data=r('data.js').split("if (typeof module")[0]
photos=sorted(os.path.splitext(os.path.basename(f))[0] for f in glob.glob(os.path.join(root,'img','*.jpg')))
js="\n".join([f'const PHOTOS={photos!r};',data,r('recipes.js'),r('logic.js'),r('smart.js'),r('sync.js'),r('editor.js'),r('ui.js')])
html=f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Cardápio Lucas e Pri</title>
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" id="touch-icon" href="icons/verde-180.png">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Cardápio">
<meta name="theme-color" content="#F0F4EF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0E1612" media="(prefers-color-scheme: dark)">
<link rel="stylesheet" href="{FONT_CSS}">
<style>
{r('styles.css')}
</style></head><body>
<div id="app"></div>
<script>
{js}
/* Atualização: o app abre do cache (funciona sem sinal) e, se houver versão nova publicada, recarrega sozinho uma vez. */
if('serviceWorker' in navigator&&location.protocol!=='file:'){{
  const had=!!navigator.serviceWorker.controller;let reloaded=false;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{{if(had&&!reloaded){{reloaded=true;(function go(){{if(V.sheet||/^(INPUT|TEXTAREA|SELECT)$/.test((document.activeElement||{{}}).tagName))return setTimeout(go,2000);saveNow();location.reload();}})();}}}});
  navigator.serviceWorker.register('sw.js').then(reg=>{{
    reg.update().catch(()=>{{}});
    let last=Date.now();const up=()=>{{if(Date.now()-last<30000)return;last=Date.now();reg.update().catch(()=>{{}});}};
    document.addEventListener('visibilitychange',()=>{{if(document.visibilityState==='visible')up();}});
    window.addEventListener('focus',up);window.addEventListener('online',up);setInterval(up,15*60000);
  }}).catch(()=>{{}});
}}
</script></body></html>
'''
w('index.html',html)
icons=sorted(os.path.relpath(f,root) for f in glob.glob(os.path.join(root,'icons','*.png'))+glob.glob(os.path.join(root,'img','*.jpg')))
assets=b''.join(open(os.path.join(root,f),'rb').read() for f in ['manifest.webmanifest']+icons)
ver=hashlib.sha256(html.encode()+assets).hexdigest()[:10]
w('sw.js',r('sw.js').replace('__VERSION__',ver).replace('__FONT_CSS__',FONT_CSS).replace('__ICONS__',', '.join(f"'./{f}'" for f in icons)))
print('index.html', len(html),'bytes · sw.js versão',ver)
