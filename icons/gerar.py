#!/usr/bin/env python3
"""Gera os ícones do app (precisa do Pillow). Rodar só quando mudar o desenho: python3 icons/gerar.py
Cada variante sai em 180 px (tela inicial do iPhone). A verde também sai em 192 e 512 (manifest)."""
import os
from PIL import Image, ImageDraw

AQUI = os.path.dirname(os.path.abspath(__file__))
# nome: (fundo, tigela, ponto do Lucas, ponto da Pri)
VARIANTES = {
    'verde': ('#1E7B4E', '#FFFFFF', '#2A55D6', '#E0457F'),
    'preto': ('#111111', '#FFFFFF', '#FFFFFF', '#FFFFFF'),
    'rosa':  ('#D2427E', '#FFFFFF', '#FFFFFF', '#FFD1E3'),
    'claro': ('#F0F4EF', '#1E7B4E', '#2A55D6', '#BC2B6A'),
}

def desenha(fundo, tigela, lucas, pri, S=2048):
    im = Image.new('RGB', (S, S), fundo)
    d = ImageDraw.Draw(im)
    c = S / 2
    bw, top = S * 0.56, S * 0.47
    d.chord([c - bw / 2, top - bw / 2, c + bw / 2, top + bw / 2], 0, 180, fill=tigela)
    d.rounded_rectangle([c - bw * .56, top - S * .025, c + bw * .56, top + S * .025], radius=S * .02, fill=tigela)
    d.rounded_rectangle([c - bw * .18, top + bw / 2 - S * .01, c + bw * .18, top + bw / 2 + S * .035], radius=S * .015, fill=tigela)
    r = S * .085
    d.ellipse([c - S * .13 - r, top - S * .13 - r, c - S * .13 + r, top - S * .13 + r], fill=lucas)
    d.ellipse([c + S * .11 - r, top - S * .16 - r, c + S * .11 + r, top - S * .16 + r], fill=pri)
    return im

for nome, cores in VARIANTES.items():
    im = desenha(*cores)
    im.resize((180, 180), Image.LANCZOS).save(os.path.join(AQUI, f'{nome}-180.png'), optimize=True)
    if nome == 'verde':
        for n in (192, 512):
            im.resize((n, n), Image.LANCZOS).save(os.path.join(AQUI, f'icon-{n}.png'), optimize=True)
print('ícones gerados:', ', '.join(VARIANTES))
