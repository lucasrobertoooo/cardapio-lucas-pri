# Cardápio Lucas e Pri

Web app de uma página só (HTML/CSS/JS puro, sem framework e sem build pesado) para o cardápio semanal de duas pessoas.
Falar e escrever em português do Brasil. Receitas em gramas e unidades métricas.

## Quem usa e para quê
- **Lucas** (78 kg): ganhar massa muscular, leve superávit. Meta ~160 g de proteína e ~2.800 kcal/dia. Vegetariano que come frutos do mar (ovo e laticínio entram). Não quer soja no plano base (acha chato de preparar), mas PTS está na troca de proteína como opção dele (a Pri evita: FODMAP). Dificuldade principal: bater proteína. Na semana de 16 a 22/11 testa **frango** no lugar de atum e sardinha (caros): atum e sardinha viraram Outros, como o peixe.
- **Pri** (163 cm, 66 kg): perder gordura e ir para hipertrofia. Meta ~125 g de proteína e ~1.750 kcal/dia. Dieta **low FODMAP** (sem leguminosas, soja, lactose, alho, cebola, cogumelo, trigo em quantidade). Come frango. Prefere batata no lugar de arroz.
- Querem **unificar ao máximo** a comida: mesmo iogurte sem lactose (natural desnatado Pense Zero, comum e não proteico; grego quase nunca), mesmo leite sem lactose, mesmo whey, mesmo pão de forma (ou francês; a Pri fica em 1 fatia por refeição por causa do trigo), mesmo macarrão de arroz. Só diverge o necessário (feijão e arroz só do Lucas).
- Compram de **moto**: cabe uma mochila. Por isso 3 idas ao mercado por semana, com estimativa de peso por compra.
- Prioridade: barato, fácil, gostoso. Proteína é o que importa; caloria é aproximada; a balança (média semanal) é o ajuste fino. Sem drama quando um dia escapa.

## Arquitetura
```
src/data.js     ingredientes (ING), refeições (MEALS), semana (WEEK), corredores (AISLES)
src/recipes.js  passos e dicas (RECIPES, BASES), nomes curtos, fotos (ill)
src/logic.js    estado (localStorage), nutrição, extras, cálculo de compras (shopping), TRIPS
src/sync.js     sincronização entre os celulares (Firebase Realtime Database via REST, sem biblioteca)
src/ui.js       views (hoje, semana, compras, receitas, preparo, ajustes), eventos, hash routing
src/styles.css  tokens de tema claro/escuro, componentes
src/sw.js       service worker (modelo): cache do app e das fontes do Google, abre sem internet
build.py        junta tudo em index.html (autocontido) e gera sw.js com a versão do build
check.js        imprime proteína e kcal planejadas por dia e por pessoa
manifest.webmanifest, icons/  PWA instalável (ícones em PNG)
.github/workflows/pages.yml   publica no GitHub Pages a cada push na main
```
- Ícones: `python3 icons/gerar.py` (Pillow) gera as variantes de 180 px (verde, preto, rosa, claro) e os 192/512 do manifest. A escolha em Ajustes troca o `apple-touch-icon`, que o iPhone lê na hora de adicionar à Tela de Início.
- `index.html` e `sw.js` são saídas do build: editar só em `src/` e rodar `python3 build.py`. Cada build muda a versão do cache. O app abre do cache, procura versão nova ao abrir e ao voltar para a tela, e recarrega sozinho uma vez quando ela chega.
- O painel de navegador do app Claude não registra service worker; testar o modo offline no Chrome.
Regras que o código já segue (manter):
- Tudo sai **calculado a partir do plano**: a lista de compras, o preparo em lote e os totais vêm de `MEALS` + `WEEK`. Nunca digitar quantidades à mão em outro lugar.
- Cada ingrediente tem proteína (`p`) e kcal (`k`) por unidade de receita, fator de compra (`f`), tamanho de embalagem (`pack`), peso por unidade de compra (`wp`) e corredor (`aisle`).
- Compras com sobra: o que sobra de uma ida abate da próxima. Frango e arroz são comprados antes do dia de cozinhar em lote (lote 1 no domingo, lote 2 na quarta). Feijão, uma vez por semana.
- **Ajustes de ingredientes**: botão Ajustar em cada refeição (aba Hoje). Fica em `S.custom[refeição][L|P] = {ingrediente: quantidade}` e vale para todos os dias. Tudo lê `itemsOf(refeição, pessoa)`, nunca `MEALS[id].L` direto. `ADJ` em `data.js` define o passo do + e −, a medida caseira (`hu`, ex.: colher de cottage = 20 g) e o limite FODMAP da Pri por refeição (`pri`; 0 = evitar), que vira aviso no editor.
- **Lanche e ceia**: o lanche da tarde é a refeição maior (academia à noite). A ceia completa a proteína que faltar no dia (`ceiaInfo`/`dayItems` em logic.js): de ½ a 3× a receita, e some ("não precisa hoje") se a meta já fechou. Conta extras registrados. Não se ajusta sozinha se a ceia foi mexida no editor. Tudo que é por dia (placar, compras) lê `dayItems`.
- **Itens manuais nas compras**: o grupo "Outros itens" de cada compra aceita texto livre (`S.manual[compra][id]`, compartilhado). Marcado fica em `S.shop` com a chave `compra|m-id`, então "Zerar marcações" também limpa. Não entram no peso da mochila.
- **Troca de proteína**: cada refeição com proteína principal (frango, ovos, atum, sardinha, peixe, camarão, PTS; `PROT` em ui.js; o que a Pri evita, `pri:0`, não aparece no seletor dela) mostra um seletor por pessoa no card. Converte pela proteína (`protConv`, arredondado ao passo) e grava em `S.custom`, como o editor: vale para todos os dias com a refeição e sincroniza. "Voltar ao original" no Ajustar desfaz.
- **Unidade no editor**: cada ingrediente com medida caseira ou peso por unidade (`gw`) pode ser visto em gramas (⇄); a escolha é do aparelho (`S.unit`, não sincroniza). Tocar no número abre um campo para digitar (aceita 1½, 1/2, 0,5).
- **Preparo único**: o que se faz de uma vez para os dois (massa, vitamina, mingau, panela de molho, purê, salada) fica em `junto` (com o nome em `jn`). O card soma as quantidades dos dois e mostra quanto fica com cada um. Num preparo único a composição é a mesma para os dois (mesma fruta); o que é só de um (ex.: pasta de amendoim do Lucas) fica fora de `junto` e entra depois, no prato dele. As receitas não repetem quantidades: falam do quadro “para os dois”.
- **Peixe, atum e sardinha não entram no plano** (são caros e não compram sempre): pratos com `outros:1` ficam fora de `WEEK` e aparecem só no grupo Outros das trocas e das receitas.
- **Medidas caseiras**: sempre que der, `ADJ.hu` (colher, colher de servir, concha, copo, xícara, fatia, unidade). Frango, peixe, camarão, PTS e macarrão ficam em gramas (frango sempre cru, PTS seca). As quantidades em `MEALS` são múltiplos do passo (`st`) da medida. Frações aparecem como ¼ ½ ¾ (`frac`).
- **Não sobrescrever o que já está salvo**: nunca renomear id de ingrediente ou refeição (as trocas, ajustes e marcações usam esses ids). `save()` marca `dirty` e só grava se houve toque, então uma aba antiga não sobrescreve outra. Ao entrar numa casa da sincronização, o aparelho mescla: o que só ele tem sobe, e onde os dois têm vale o banco.
- **Fotos**: `img/<id da refeição>.jpg` (840×560, 3:2, JPEG ~60 KB), geradas no ElevenLabs (GPT Image 2) com prompt em inglês começando pelo nome do prato + "Realistic food photography, 45 degree angle, soft natural daylight, light wooden table…". O build detecta sozinho e põe no cache offline. Refeição nova sem foto mostra um prato vazio.
- **Trocas**: toda refeição de `MEALS` com o mesmo `slot` é alternativa das outras. A aba Hoje tem o botão Trocar em cada refeição; a troca fica em `S.swap` (`data|refeição`) e `slotsOf(day)` aplica sobre `WEEK`. Placar, compras, preparo e receitas sempre leem `slotsOf`, nunca `day.slots` direto. Alternativas novas usam só ingredientes já cadastrados em `ING`. `oc:1` marca refeições cujos ovos saem cozidos do lote.
- **Sincronização** (`src/sync.js`): Firebase Realtime Database pela API REST, sem biblioteca. Em comum: `swap`, `custom`, `shop`, `stock`, `have`, `pantry`, `prep`, `targets`, `ref`, `maxKg` (lista `SHARED`). Só no aparelho: `checks`, `extras`, `steps`, `icon`. Cada mudança vira um PATCH por chave; sem rede, fica em fila no `localStorage` e sai quando a conexão volta. O código (`…/casas/<código>`) fica só nos aparelhos, nunca no repositório. Regras do banco: só `casas/$casa` com código de 20+ caracteres.
- Estado em `localStorage` (chave `cardapio-lucas-pri-v1`), sempre dentro de try/catch. Rota por hash simples (`#hoje`, `#semana`, `#compras`, `#receitas`, `#preparo`, `#ajustes`).
- Tema: tokens de cor em `:root`, redefinidos para escuro por `prefers-color-scheme` e por `data-theme`. Cores: cobalto = Lucas, framboesa = Pri, verde = concluído.
- Mobile primeiro, alvos de toque grandes, navegação fixa embaixo, sem scroll horizontal.

## Valores de nutrição (estimativas, ficar de olho)
Valores médios de tabela (TACO e rótulos). Feijão cozido = 5 g/100 g (a referência antiga do Lucas, 12 a 15 g por concha, estava alta). Iogurte Pense Zero natural desnatado sem lactose = 3,6 g/100 g e ~40 kcal (editável em Ajustes). Whey = 24 g por dose (30 g de pó).

## Como verificar antes de commitar
1. `python3 build.py` e `node --check` no JS embutido.
2. `node check.js` (também lista proteína e kcal de cada alternativa): Lucas deve ficar em ~165 a 185 g e ~2.850 a 3.050 kcal e ~2.800 a 3.000 kcal nos dias completos; Pri em ~125 a 135 g e ~1.600 a 1.850 kcal.
3. Abrir `index.html` no navegador (ou Playwright) em 390 px de largura, claro e escuro, sem scroll horizontal e sem erro no console.
4. Conferir que cada compra fica abaixo do limite da mochila (padrão 14 kg).

## Fluxo de trabalho
- Commits pequenos, mensagem em português no imperativo ("Adiciona…", "Corrige…").
- Não adicionar framework nem dependência sem necessidade. Preferir remover a acumular.
