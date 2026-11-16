# Cardápio Lucas e Pri

Web app de uma página só (HTML/CSS/JS puro, sem framework e sem build pesado) para o cardápio semanal de duas pessoas.
Falar e escrever em português do Brasil. Receitas em gramas e unidades métricas.

## Quem usa e para quê
- **Lucas** (78 kg): ganhar massa muscular, leve superávit. Meta ~160 g de proteína e ~2.800 kcal/dia. Vegetariano que come frutos do mar (ovo e laticínio entram). Não quer soja (acha chato de preparar). Dificuldade principal: bater proteína.
- **Pri** (163 cm, 66 kg): perder gordura e ir para hipertrofia. Meta ~125 g de proteína e ~1.750 kcal/dia. Dieta **low FODMAP** (sem leguminosas, soja, lactose, alho, cebola, cogumelo, trigo em quantidade). Come frango. Prefere batata no lugar de arroz.
- Querem **unificar ao máximo** a comida: mesmo iogurte sem lactose, mesmo leite sem lactose, mesmo whey, mesma goma de tapioca, mesmo macarrão de arroz. Só diverge o necessário (feijão e arroz só do Lucas, frango só da Pri).
- Compram de **moto**: cabe uma mochila. Por isso 3 idas ao mercado por semana, com estimativa de peso por compra.
- Prioridade: barato, fácil, gostoso. Proteína é o que importa; caloria é aproximada; a balança (média semanal) é o ajuste fino. Sem drama quando um dia escapa.

## Arquitetura
```
src/data.js     ingredientes (ING), refeições (MEALS), semana (WEEK), corredores (AISLES)
src/recipes.js  passos e dicas (RECIPES, BASES), ilustrações SVG (SCENES), nomes curtos
src/logic.js    estado (localStorage), nutrição, extras, cálculo de compras (shopping), TRIPS
src/ui.js       views (hoje, semana, compras, receitas, preparo, ajustes), eventos, hash routing
src/styles.css  tokens de tema claro/escuro, componentes
build.py        junta tudo em index.html (autocontido)
check.js        imprime proteína e kcal planejadas por dia e por pessoa
```
Regras que o código já segue (manter):
- Tudo sai **calculado a partir do plano**: a lista de compras, o preparo em lote e os totais vêm de `MEALS` + `WEEK`. Nunca digitar quantidades à mão em outro lugar.
- Cada ingrediente tem proteína (`p`) e kcal (`k`) por unidade de receita, fator de compra (`f`), tamanho de embalagem (`pack`), peso por unidade de compra (`wp`) e corredor (`aisle`).
- Compras com sobra: o que sobra de uma ida abate da próxima. Frango e arroz são comprados antes do dia de cozinhar em lote (lote 1 no domingo, lote 2 na quarta). Feijão, uma vez por semana.
- Estado em `localStorage` (chave `cardapio-lucas-pri-v1`), sempre dentro de try/catch. Rota por hash simples (`#hoje`, `#semana`, `#compras`, `#receitas`, `#preparo`, `#ajustes`).
- Tema: tokens de cor em `:root`, redefinidos para escuro por `prefers-color-scheme` e por `data-theme`. Cores: cobalto = Lucas, framboesa = Pri, verde = concluído.
- Mobile primeiro, alvos de toque grandes, navegação fixa embaixo, sem scroll horizontal.

## Valores de nutrição (estimativas, ficar de olho)
Valores médios de tabela (TACO e rótulos). Feijão cozido = 5 g/100 g (a referência antiga do Lucas, 12 a 15 g por concha, estava alta). Iogurte grego sem lactose = 6 g/100 g (conferir no rótulo; editável em Ajustes). Whey = 24 g por dose (30 g de pó).

## Como verificar antes de commitar
1. `python3 build.py` e `node --check` no JS embutido.
2. `node check.js`: Lucas deve ficar em ~170 a 185 g e ~2.800 a 3.000 kcal nos dias completos; Pri em ~125 a 135 g e ~1.600 a 1.850 kcal.
3. Abrir `index.html` no navegador (ou Playwright) em 390 px de largura, claro e escuro, sem scroll horizontal e sem erro no console.
4. Conferir que cada compra fica abaixo do limite da mochila (padrão 14 kg).

## Fluxo de trabalho
- Commits pequenos, mensagem em português no imperativo ("Adiciona…", "Corrige…").
- Não adicionar framework nem dependência sem necessidade. Preferir remover a acumular.
