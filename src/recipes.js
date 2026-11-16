/* ===== RECEITAS E FOTOS ===== */
const SLOTS=[['cafe','Café da manhã'],['almoco','Almoço'],['lanche','Lanche'],['jantar','Jantar'],['ceia','Ceia']];
const SHORT={C1:'Pão com cottage',C2:'Mingau',L1:'Vitamina',E1:'Iogurte',E2:'Iogurte',M1:'Macarrão',M2:'Omelete',M3:'Peixe',M4:'Crepe',M5:'Purê',C3:'Panqueca',C4:'Queijo quente',C5:'Iogurte e ovos',L2:'Iogurte batido',L3:'Sanduíche de atum',L4:'Ovos e leite',E3:'Leite com whey',E4:'Ovos mexidos',M6:'Salada morna',M7:'Macarrão e abobrinha',M8:'Peixe ao molho',M9:'Sanduíche quente'};
const SN={ovo:'ovo',atum:'atum',sardinha:'sardinha',peixe:'filé de peixe',frango:'frango',cottage:'cottage',mussarela:'mussarela',parmesao:'parmesão',iogurte:'iogurte',leite:'leite sem lactose',whey:'whey',azeite:'azeite',pao:'pão',arroz:'arroz cozido',feijao:'feijão cozido',macarrao:'macarrão de arroz',aveia:'aveia',amendoim:'pasta de amendoim',passata:'molho de tomate',batata:'batata',cenoura:'cenoura',abobrinha:'abobrinha',pepino:'pepino',tomate:'tomate',espinafre:'espinafre',banana:'banana',morango:'morango',mamao:'mamão',uva:'uva',limao:'limão'};

const RECIPES={
 C1:{steps:[
  'Torre o pão na frigideira ou na torradeira (Lucas 3 fatias, Pri 1).',
  'Mexa os ovos com sal e um fio de azeite por 2 min em fogo médio.',
  'Passe o cottage no pão (Lucas 3 colheres, Pri 2) e coloque os ovos por cima.',
  'Sirva com o iogurte e a fruta: banana para o Lucas, morango para a Pri.'],
  tips:['Pão francês serve igual: 1 pão equivale a 2 fatias. A Pri fica com meio pão.','Pri: 1 fatia de pão de trigo por refeição fica dentro do FODMAP baixo. Mais que isso pode incomodar.']},
 C2:{steps:[
  'Leve a aveia e o leite sem lactose à panela em fogo médio, mexendo por 4 a 5 min até ficar cremoso.',
  'Fora do fogo, junte a pasta de amendoim e a banana amassada (Lucas). Pri: coloque os morangos fatiados por cima.',
  'Sirva com os ovos cozidos do lote (sem lote, 8 min em água fervendo).'],
  tips:['Versão sem fogo: misture aveia e leite na noite anterior e deixe na geladeira.','Os ovos cozidos saem do lote de domingo e quarta, veja a aba Preparo.']},
 L1:{steps:[
  'Bata o leite, o whey, a fruta, a aveia e (só Lucas) a pasta de amendoim com 3 cubos de gelo por 40 s.',
  'Divida em dois copos. O copo do Lucas sai maior, o da Pri menor.'],
  tips:['Whey isolado tem pouquíssima lactose. Confira no rótulo se não traz sorbitol, manitol ou inulina, que incomodam quem faz FODMAP.','O mesmo liquidificador serve os dois: as quantidades de cada um estão no cartão.']},
 E1:{steps:['Coloque o iogurte em uma tigela.','Junte a aveia (só Lucas) e o mamão picado.'],tips:['Dia sem fome à noite? É a refeição mais fácil de pular. Se pular, use um extra no placar: 1 copo de iogurte.']},
 E2:{steps:['Coloque o iogurte em uma tigela.','Junte a aveia (só Lucas) e as uvas.'],tips:['Uva: até cerca de 150 g por vez fica dentro do limite FODMAP baixo para a Pri.']},
 M1:{steps:[
  'Ferva água com sal e cozinhe o macarrão de arroz pelo tempo do pacote (8 a 10 min). Escorra e passe um fio de azeite.',
  'Na panela, aqueça o azeite aromatizado (receita base) e junte o molho de tomate. Cozinhe 8 min em fogo baixo com sal, orégano e pimenta.',
  'Junte o espinafre picado nos últimos 2 min.',
  'Misture o atum escorrido ao molho: 1 lata para o Lucas e meia lata para a Pri.',
  'Sirva sobre o macarrão e finalize com o parmesão. Pri: 1 ovo cozido ao lado.'],
  tips:['A meia lata que sobra vai no pão do lanche ou na salada do dia seguinte.','Sem alho nem cebola no molho: o sabor vem do azeite aromatizado.']},
 M2:{steps:[
  'Corte a batata em palitos e misture com azeite, sal e páprica. Airfryer a 200 °C por 18 min, mexendo na metade (forno: 220 °C por 25 min).',
  'Bata os ovos com sal. Em frigideira antiaderente untada, cozinhe 2 min, coloque espinafre e mussarela no meio e dobre.',
  'Pri: junte o frango desfiado do lote ao recheio.',
  'Salada de tomate e pepino com limão e um fio de azeite.',
  'Lucas: esquente o arroz e o feijão do lote.'],
  tips:['A batata assada é a mesma base do peixe e do crepe, então dá para fazer a assadeira para os dois de uma vez.']},
 M3:{steps:[
  'Tempere o filé ainda congelado com sal, limão e páprica. Não precisa descongelar.',
  'Misture batata em cubos e cenoura em rodelas com azeite e sal. A abobrinha entra mais tarde.',
  'Airfryer a 200 °C: batata e cenoura por 10 min. Junte o peixe e a abobrinha e mais 14 a 16 min, virando o peixe na metade.',
  'Está pronto quando o peixe fica opaco e solta lascas com o garfo.',
  'Lucas: arroz do lote ao lado.'],
  tips:['Filé grosso (mais de 2 cm) pede 2 a 3 min a mais.']},
 M4:{steps:[
  'Bata no liquidificador, para os dois: 2 ovos, espinafre, aveia e sal. A aveia é 30 g para o Lucas e 20 g para a Pri. Faça uma massa para cada um.',
  'Frigideira antiaderente untada: despeje metade da massa e cozinhe 2 min de cada lado. Repita com o resto.',
  'Recheio do Lucas: 1 lata de atum escorrido e 20 g de mussarela. Recheio da Pri: frango desfiado, tomate e 20 g de mussarela.',
  'Enrole e sirva com a batata assada (mesma assadeira do dia, 250 g Lucas e 130 g Pri).'],
  tips:['A massa fica mais firme se descansar 5 min antes de ir para a frigideira.']},
 M5:{steps:[
  'Cozinhe a batata em cubos por 15 min. Escorra e amasse com leite sem lactose, sal e azeite. Sem manteiga e sem alho.',
  'Lucas: escorra a sardinha e aqueça em frigideira por 3 min com limão. Fatie 2 ovos cozidos do lote.',
  'Pri: esquente o frango do lote.',
  'Legumes: cenoura e abobrinha no vapor por 8 min (Pri). Cenoura ralada e tomate crus (Lucas).'],
  tips:['Sardinha em lata já vem cozida, é só aquecer ou comer fria.']},
 C3:{steps:[
  'Amasse a banana e misture com os ovos, a aveia e uma pitada de canela. Uma massa para cada um (Lucas: 3 ovos e 40 g de aveia; Pri: 2 ovos e 25 g).',
  'Frigideira antiaderente em fogo médio, untada com papel e azeite. Pingue conchas pequenas e vire quando as bordas firmarem, cerca de 2 min de cada lado.',
  'Sirva com o iogurte por cima. Lucas: um fio de pasta de amendoim.'],
  tips:['Pri: banana firme, ainda com a ponta verde. Madura demais pesa no FODMAP.','Rende mais fácil em panquecas pequenas, que viram sem quebrar.']},
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
  'Bata o iogurte, o whey, a fruta e a aveia (Lucas: mais a pasta de amendoim) por 30 s.',
  'Divida em dois copos: o do Lucas maior, o da Pri menor.'],
  tips:['Fica mais grosso que a vitamina de leite. Se quiser mais líquido, junte um pouco de água gelada.']},
 L3:{steps:[
  'Misture o atum escorrido com tomate em cubos, sal e um fio de limão.',
  'Monte no pão com a mussarela (Lucas 3 fatias, Pri 1 fatia aberta). Se quiser quente, 2 min na frigideira tampada.',
  'Lucas: um copo de leite sem lactose ao lado.'],
  tips:['A Pri leva a lata inteira de atum aqui, porque é a proteína principal do lanche dela.']},
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
  'Bata os ovos com sal e cozinhe em frigideira antiaderente em fogo baixo, mexendo, por 2 min.',
  'Desligue e junte a mussarela. Lucas: tomate picado por cima.'],
  tips:['Fogo baixo deixa o ovo cremoso e evita ressecar.']},
 M6:{steps:[
  'Cozinhe a batata em cubos por 12 min em água com sal, até ficar macia mas inteira. Escorra.',
  'Corte os ovos cozidos do lote em quartos, o tomate e o pepino em cubos.',
  'Misture a batata ainda morna com azeite, limão, sal e orégano. Junte os legumes, os ovos e o atum escorrido (Lucas 1 lata, Pri meia).',
  'Lucas: feijão do lote ao lado.'],
  tips:['Morna ou fria, funciona igual. Dá para levar em pote.']},
 M7:{steps:[
  'Cozinhe o macarrão de arroz pelo tempo do pacote. Escorra e passe um fio de azeite.',
  'Na frigideira, azeite aromatizado e a abobrinha em meia-lua por 4 min, até dourar. Junte o tomate em cubos por mais 2 min.',
  'Divida: atum escorrido na parte do Lucas, frango desfiado do lote na parte da Pri.',
  'Misture com o macarrão e finalize com parmesão.'],
  tips:['Pri: abobrinha até cerca de 75 g por refeição fica dentro do FODMAP baixo.']},
 M8:{steps:[
  'Aqueça o azeite aromatizado e junte o molho de tomate com sal e orégano. 3 min em fogo baixo.',
  'Coloque os filés ainda congelados no molho, tampe e cozinhe 12 a 15 min, até o peixe ficar opaco.',
  'Junte o espinafre nos últimos 2 min.',
  'Lucas: arroz e feijão do lote. Pri: batata cozida ou assada.'],
  tips:['O molho segura o peixe úmido, então não tem como ressecar.']},
 M9:{steps:[
  'Pri: batata em cubos na airfryer a 200 °C por 18 min (ou a batata assada do dia).',
  'Lucas: mexa 2 ovos com o atum. Pri: aqueça o frango desfiado do lote.',
  'Monte com a mussarela, o tomate e o espinafre (Lucas: 2 sanduíches com 4 fatias; Pri: 1 fatia aberta). Frigideira tampada, 2 min de cada lado.'],
  tips:['A Pri leva batata no lugar do segundo pão, para ficar dentro do FODMAP baixo.']},
 B1:{steps:[
  'Tempere o peito de frango com sal, páprica, limão e um fio de azeite.',
  'Forno a 200 °C por 22 a 25 min, até ficar branco por dentro e sem rosa.',
  'Descanse 5 min. Desfie metade e fatie a outra metade.',
  'Guarde em potes na geladeira por até 4 dias.'],tips:['Só a Pri usa o frango. As porções dela são de 50 a 110 g por refeição.']},
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
