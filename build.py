#!/usr/bin/env python3
"""Junta src/ em um único index.html autocontido (sem dependências além das fontes do Google)."""
import os
root=os.path.dirname(os.path.abspath(__file__)); src=os.path.join(root,'src')
r=lambda f:open(os.path.join(src,f),encoding='utf-8').read()
data=r('data.js').split("if (typeof module")[0]
js="\n".join([data,r('recipes.js'),r('logic.js'),r('ui.js')])
html=f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Cardápio Lucas e Pri</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&display=swap">
<style>
{r('styles.css')}
</style></head><body>
<div id="app"></div>
<script>
{js}
</script></body></html>
'''
open(os.path.join(root,'index.html'),'w',encoding='utf-8').write(html)
print('index.html', len(html),'bytes')
