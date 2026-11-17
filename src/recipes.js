/* ===== RECEITAS E FOTOS ===== */
const SLOTS=[['cafe','Café da manhã'],['almoco','Almoço'],['lanche','Lanche'],['jantar','Jantar'],['ceia','Ceia']];
const SHORT={C1:'Pão com cottage',C2:'Mingau',L1:'Vitamina',E1:'Iogurte',E2:'Iogurte',M1:'Macarrão',M2:'Omelete',M3:'Peixe',M4:'Crepe',M5:'Purê',C3:'Panqueca',C4:'Queijo quente',C5:'Iogurte e ovos',L2:'Iogurte batido',L3:'Sanduíche de atum',L4:'Ovos e leite',E3:'Leite com whey',E4:'Ovos mexidos',M6:'Salada morna',M7:'Macarrão e abobrinha',M8:'Peixe ao molho',M9:'Sanduíche quente'};
const SN={ovo:'ovo',atum:'atum',sardinha:'sardinha',peixe:'filé de peixe',frango:'frango',cottage:'cottage',mussarela:'mussarela',parmesao:'parmesão',iogurte:'iogurte',leite:'leite sem lactose',whey:'whey',azeite:'azeite',pao:'pão',arroz:'arroz cozido',feijao:'feijão cozido',macarrao:'macarrão de arroz',aveia:'aveia',amendoim:'pasta de amendoim',passata:'molho de tomate',batata:'batata',cenoura:'cenoura',abobrinha:'abobrinha',pepino:'pepino',tomate:'tomate',espinafre:'espinafre',banana:'banana',morango:'morango',mamao:'mamão',uva:'uva',limao:'limão',abobora:'abóbora',alface:'alface',couve:'couve',brocolis:'brócolis',pimentao:'pimentão vermelho',berinjela:'berinjela',vagem:'vagem',batatadoce:'batata-doce',mandioca:'mandioca',laranja:'laranja',kiwi:'kiwi',abacaxi:'abacaxi',camarao:'camarão',grao:'grão-de-bico',quinoa:'quinoa cozida',pts:'PTS seca',paofr:'pão francês',ameixa:'ameixa'};

const RECIPES={
 C1:{steps:[
  'Torre o pão (Lucas 3 fatias, Pri 1).',
  'Bata os ovos dos dois juntos com sal e mexa numa frigideira só, com um fio de azeite, por 2 min.',
  'Passe o cottage no pão e divida os ovos na proporção do quadro.',
  'Sirva com o iogurte e a fruta: banana para o Lucas, morango para a Pri.'],
  tips:['Pão francês: troque no seletor Pão do card (1 pão de 50 g vale umas 2 fatias). A Pri fica com meio pão.','Pri: 1 fatia de pão de trigo por refeição fica dentro do FODMAP baixo. Mais que isso pode incomodar.']},
 C2:{steps:[
  'Uma panela só: aveia e leite sem lactose (as quantidades do quadro “para os dois”), fogo médio, mexendo por 4 a 5 min até ficar cremoso.',
  'Divida na proporção do quadro.',
  'Por cima: banana e pasta de amendoim no do Lucas, morango no da Pri.',
  'Ovos cozidos do lote ao lado.'],
  tips:['Versão sem fogo: misture aveia e leite na noite anterior e deixe na geladeira.','Os ovos cozidos saem do lote de domingo e quarta, veja a aba Preparo.']},
 L1:{steps:[
  'Bata tudo junto no liquidificador com 3 cubos de gelo, por 40 s (as quantidades do quadro “para os dois”).',
  'Sirva na proporção do quadro: o copo do Lucas sai maior.',
  'No copo do Lucas, misture a pasta de amendoim depois de servir.'],
  tips:['Whey isolado tem pouquíssima lactose. Confira no rótulo se não traz sorbitol, manitol ou inulina, que incomodam quem faz FODMAP.','Pri: banana firme, ainda com a ponta verde.']},
 E1:{steps:['Coloque o iogurte em uma tigela.','Junte a aveia (só Lucas) e o mamão picado.'],tips:['Dia sem fome à noite? É a refeição mais fácil de pular. Se pular, use um extra no placar: 1 copo de iogurte.']},
 E2:{steps:['Coloque o iogurte em uma tigela.','Junte a aveia (só Lucas) e as uvas.'],tips:['Uva: até cerca de 150 g por vez fica dentro do limite FODMAP baixo para a Pri.']},
 M1:{steps:[
  'Cozinhe o macarrão dos dois numa panela só, pelo tempo do pacote. Escorra e passe um fio de azeite.',
  'Numa panela, aqueça o azeite aromatizado (receita base) e junte o molho de tomate. 8 min em fogo baixo com sal, orégano e pimenta.',
  'Junte o espinafre picado nos últimos 2 min e o frango desfiado do lote no fim, só para aquecer.',
  'Divida macarrão e molho na proporção do quadro e finalize com parmesão. Pri: 1 ovo cozido ao lado.'],
  tips:['Sem alho nem cebola no molho: o sabor vem do azeite aromatizado.']},
 M2:{steps:[
  'Uma assadeira só para os dois: batata em palitos com azeite, sal e páprica. Airfryer a 200 °C por 18 min, mexendo na metade (forno: 220 °C por 25 min).',
  'Uma tigela só de salada: tomate e pepino com limão e um fio de azeite.',
  'Omeletes: um para cada (os recheios mudam). Bata os ovos com sal, cozinhe 2 min, coloque espinafre e mussarela e dobre. Pri: junte o frango desfiado do lote.',
  'Divida batata e salada na proporção do quadro. Lucas: arroz e feijão do lote.'],
  tips:['A mesma assadeira de batata serve outras refeições do dia, se quiser adiantar.']},
 M3:{steps:[
  'Uma assadeira só: tempere os filés ainda congelados com sal, limão e páprica.',
  'Batata em cubos e cenoura em rodelas com azeite e sal: 10 min na airfryer a 200 °C.',
  'Junte o peixe e a abobrinha e mais 14 a 16 min, virando o peixe na metade.',
  'Divida na proporção do quadro. Lucas: arroz do lote ao lado.'],
  tips:['Prato de Outros: só quando comprar peixe. Filé grosso (mais de 2 cm) pede 2 a 3 min a mais.']},
 M4:{steps:[
  'Uma massa só no liquidificador: os ovos, a aveia e o espinafre do quadro, com sal.',
  'Frigideira antiaderente untada: faça os crepes, 2 min de cada lado, e divida meio a meio.',
  'Recheio dos dois: frango desfiado do lote e mussarela (Pri com tomate também). Enrole.',
  'Batata assada numa assadeira só, dividida na proporção do quadro.'],
  tips:['A massa fica mais firme se descansar 5 min antes de ir para a frigideira.']},
 M5:{steps:[
  'Uma panela só de purê: cozinhe todas as batatas em cubos por 15 min, escorra e amasse com o leite, o azeite e sal. Sem manteiga e sem alho.',
  'Divida o purê na proporção do quadro.',
  'Frango do lote aquecido com um fio de limão para os dois. Lucas: mais 2 ovos cozidos do lote.',
  'Legumes: cenoura e abobrinha no vapor (Pri), cenoura ralada e tomate crus (Lucas).'],
  tips:['Frango fatiado do lote fica melhor aquecido na frigideira, 2 min de cada lado.']},
 C3:{steps:[
  'Uma massa só: amasse as bananas e misture com os ovos e a aveia (as quantidades do quadro “para os dois”) e uma pitada de canela.',
  'Frigideira antiaderente untada, fogo médio: pingue conchas pequenas e vire quando as bordas firmarem, cerca de 2 min de cada lado.',
  'Divida as panquecas na proporção do quadro e sirva com o iogurte. Lucas: um fio de pasta de amendoim.'],
  tips:['Pri: banana firme, ainda com a ponta verde. Madura demais pesa no FODMAP.','Panquecas pequenas viram sem quebrar.']},
 C4:{steps:[
  'Faça os ovos fritos ou mexidos (Lucas 3, Pri 2).',
  'Monte o pão com a mussarela e o ovo. Frigideira tampada em fogo baixo, 2 min de cada lado, até o queijo derreter. Lucas: 3 fatias, Pri: 1 fatia aberta.',
  'Café com leite sem lactose (Lucas 300 ml, Pri 200 ml) e mamão picado ao lado.'],
  tips:['Sem frigideira livre? Sanduicheira ou airfryer a 180 °C por 4 min.']},
 C5:{steps:[
  'Coloque o iogurte na tigela, junte a aveia e a fruta: banana para o Lucas, morango para a Pri.',
  'Lucas: 1 colher de pasta de amendoim por cima.',
  'Ovos cozidos do lote ao lado, com sal (3 Lucas, 2 Pri).'],
  tips:['É o café de quem está com pressa: nada vai ao fogo se os ovos do lote estiverem prontos.']},
 L2:{steps:[
  'Bata juntos o iogurte, o whey, os morangos e a aveia por 30 s (as quantidades do quadro “para os dois”).',
  'Divida na proporção do quadro. No copo do Lucas, misture a pasta de amendoim.'],
  tips:['Fica mais grosso que a vitamina de leite. Se quiser mais líquido, junte um pouco de água gelada.']},
 L3:{steps:[
  'Misture o atum escorrido com tomate em cubos, sal e um fio de limão.',
  'Monte no pão com a mussarela (Lucas 3 fatias, Pri 1 fatia aberta). Se quiser quente, 2 min na frigideira tampada.',
  'Lucas: um copo de leite sem lactose ao lado.'],
  tips:['Prato de Outros: só quando tiver atum em casa. Meia lata para cada.']},
 L4:{steps:[
  'Descasque os ovos cozidos do lote (Lucas 3, Pri 2) e tempere com sal.',
  'Copo de leite sem lactose (Lucas 300 ml, Pri 250 ml).',
  'Lucas: banana com pasta de amendoim. Pri: uvas e 20 g de mussarela.'],
  tips:['Bom para levar: ovo cozido e fruta aguentam a mochila.']},
 E3:{steps:[
  'Aqueça o leite sem lactose sem deixar ferver (1 min no micro-ondas).',
  'Misture o whey com um batedor ou garfo até sumir os grumos. Lucas: junte a aveia.',
  'Pri: meia dose de whey.'],
  tips:['Use esta ceia nos dias em que o placar está baixo: rende bem mais proteína que a tigela de iogurte.','Whey sabor baunilha ou chocolate fica parecido com um achocolatado quente.']},
 E4:{steps:[
  'Bata os ovos dos dois juntos com sal e cozinhe numa frigideira só, em fogo baixo, mexendo por 2 min.',
  'Desligue, junte a mussarela e divida na proporção do quadro. Lucas: tomate picado por cima.'],
  tips:['Fogo baixo deixa o ovo cremoso e evita ressecar.']},
 M6:{steps:[
  'Cozinhe todas as batatas em cubos por 12 min em água com sal, até ficarem macias mas inteiras.',
  'Uma tigela só: batata morna, ovos cozidos do lote em quartos, frango desfiado do lote, tomate e pepino, com azeite, limão, sal e orégano.',
  'Divida na proporção do quadro. Lucas: feijão do lote ao lado.'],
  tips:['Morna ou fria, funciona igual. Dá para levar em pote.']},
 M7:{steps:[
  'Cozinhe o macarrão dos dois junto, pelo tempo do pacote. Escorra e passe um fio de azeite.',
  'Uma frigideira só: abobrinha em meia-lua no azeite aromatizado por 4 min, depois o tomate por mais 2 min.',
  'Misture com o macarrão e divida na proporção do quadro.',
  'Proteína no prato: frango desfiado do lote nos dois. Parmesão por cima.'],
  tips:['Pri: abobrinha até cerca de 75 g por refeição fica dentro do FODMAP baixo.']},
 M8:{steps:[
  'Uma panela só: aqueça o azeite aromatizado e junte o molho de tomate com sal e orégano, 3 min em fogo baixo.',
  'Coloque os filés ainda congelados no molho, tampe e cozinhe 12 a 15 min.',
  'Junte o espinafre nos últimos 2 min e divida na proporção do quadro.',
  'Lucas: arroz e feijão do lote. Pri: batata cozida ou assada.'],
  tips:['Prato de Outros: só quando comprar peixe.']},
 M9:{steps:[
  'Pri: batata em cubos na airfryer a 200 °C por 18 min (ou a batata assada do dia).',
  'Aqueça o frango desfiado do lote. Lucas: mexa 2 ovos e junte ao frango.',
  'Monte com a mussarela, o tomate e o espinafre (Lucas: 2 sanduíches com 4 fatias; Pri: 1 fatia aberta). Frigideira tampada, 2 min de cada lado.'],
  tips:['A Pri leva batata no lugar do segundo pão, para ficar dentro do FODMAP baixo.']},
 B1:{steps:[
  'Pese cru (pode ser congelado: veja a dica). Tempere com sal, páprica, limão e um fio de azeite.',
  'Forno a 200 °C por 22 a 25 min, até ficar branco por dentro e sem rosa.',
  'Descanse 5 min. Desfie metade e fatie a outra metade.',
  'Guarde em potes na geladeira por até 4 dias.'],tips:['Todas as quantidades de frango do app são de frango cru. Assado, ele perde cerca de ¼ do peso: 120 g cru dão ~90 g prontos.','Congelado: pese direto na balança. Se tiver casca de gelo, passe na água fria uns segundos e seque antes, ou conte uns 10% a mais. Sem balança: peso do pacote ÷ número de pedaços (sassami tem ~40 a 50 g, filé de peito ~100 a 150 g).','Esta semana o frango é dos dois: Lucas 100 a 120 g por refeição, Pri 50 a 110 g.']},
 B2:{steps:[
  'Arroz: lave 100 g de arroz, refogue em um fio de azeite, junte 250 ml de água e sal. Tampado, 12 min em fogo baixo.',
  'Feijão: cubra 150 g de feijão (de molho por 8 h, se tiver) com água, panela de pressão por 25 min depois de pegar pressão.',
  'Tempere o feijão com sal e louro. Sem cebola e alho se for dividir com a Pri.',
  'Arroz na geladeira por 4 dias. Feijão em porções de 150 g no congelador.'],tips:['Só o Lucas come feijão. A Pri troca por batata.']},
 B3:{steps:[
  'Coloque os ovos em água fria e leve ao fogo.',
  'Quando ferver, conte 10 min.',
  'Passe em água gelada e guarde com casca na geladeira por até 5 dias.'],tips:[]},
 B4:{steps:[
  'Amasse 2 dentes de alho.',
  'Aqueça 100 ml de azeite em fogo baixo com o alho por 5 min, sem deixar dourar.',
  'Retire e descarte todo o alho. O azeite fica só com o sabor.',
  'Guarde na geladeira e use em até 4 dias. Depois disso, faça outro.'],tips:['Por que tirar o alho: o frutano do alho não passa para o azeite, e a Pri pode usar sem sintoma.','Guardar alho em óleo por muito tempo, fora da geladeira, traz risco. Faça pouco e use rápido.']}
};
const BASES={
 B1:{n:'Frango assado em lote',t:30,slot:'base',desc:'Só para a Pri: 50 a 110 g por refeição.'},
 B2:{n:'Arroz e feijão em lote',t:35,slot:'base',desc:'Arroz para o Lucas, feijão congelado em porções.'},
 B3:{n:'Ovos cozidos em lote',t:12,slot:'base',desc:'Mingau, purê e macarrão usam ovo cozido.'},
 B4:{n:'Azeite aromatizado com alho',t:8,slot:'base',desc:'O sabor de alho do macarrão sem frutano.'}
};

/* ===== FOTOS: img/<id>.jpg (geradas para o app). Sem foto, um prato vazio. ===== */
const PLATE='<svg viewBox="0 0 120 80" aria-hidden="true"><ellipse cx="60" cy="44" rx="40" ry="24" fill="#F8F6F1" stroke="#D6D1C6" stroke-width="1.5"/><ellipse cx="60" cy="44" rx="28" ry="16" fill="none" stroke="#E6E2D8"/></svg>';
function ill(id){
  const n=(MEALS[id]||BASES[id]||{n:''}).n;
  return typeof PHOTOS!=='undefined'&&PHOTOS.includes(id)?`<img src="img/${id}.jpg" alt="${n}" loading="lazy" decoding="async">`:PLATE;
}
