/* ===== RECEITAS E FOTOS ===== */
const SLOTS=[['cafe','Café da manhã'],['almoco','Almoço'],['lanche','Lanche'],['jantar','Jantar'],['ceia','Ceia']];
const SHORT={C1:'Pão com cottage',C2:'Mingau',L1:'Vitamina',E1:'Iogurte',E2:'Iogurte',M1:'Macarrão',M2:'Omelete',M3:'Peixe',M4:'Crepe',M5:'Purê',C3:'Panqueca',C4:'Queijo quente',C5:'Iogurte e ovos',L2:'Iogurte batido',L3:'Sanduíche de atum',L4:'Ovos e leite',E3:'Leite com whey',E4:'Ovos mexidos',M6:'Salada morna',M7:'Macarrão e abobrinha',M8:'Peixe ao molho',M9:'Sanduíche quente',M10:'Maionese',M11:'Arroz e feijão com frango',M12:'Arroz e feijão com ovos',M13:'Crepe simples',M14:'Frango com farofa',M15:'Strogonoff'};
const SN={tapioca:'tapioca',cuscuz:'cuscuz',minas:'queijo minas',castanha:'castanha-do-pará',chocolate:'chocolate 70%',mel:'mel',maca:'maçã',maionese:'maionese light',ovo:'ovo',atum:'atum',sardinha:'sardinha',peixe:'filé de peixe',frango:'frango',cottage:'cottage',mussarela:'mussarela',parmesao:'parmesão',iogurte:'iogurte',leite:'leite sem lactose',whey:'whey',azeite:'azeite',pao:'pão',arroz:'arroz cozido',feijao:'feijão cozido',macarrao:'macarrão de arroz',aveia:'aveia',amendoim:'pasta de amendoim',passata:'molho de tomate',batata:'batata',cenoura:'cenoura',abobrinha:'abobrinha',pepino:'pepino',tomate:'tomate',espinafre:'espinafre',banana:'banana',morango:'morango',mamao:'mamão',uva:'uva',limao:'limão',abobora:'abóbora',alface:'alface',couve:'couve',brocolis:'brócolis',pimentao:'pimentão vermelho',berinjela:'berinjela',vagem:'vagem',batatadoce:'batata-doce',mandioca:'mandioca',laranja:'laranja',kiwi:'kiwi',abacaxi:'abacaxi',camarao:'camarão',grao:'grão-de-bico',quinoa:'quinoa cozida',pts:'PTS seca',paofr:'pão francês',ameixa:'ameixa',nescau:'Nescau',requeijao:'requeijão',ricota:'ricota',leitepo:'leite em pó',farinha:'farinha de mandioca',creme:'creme de leite',mostarda:'mostarda'};

const RECIPES={
 C1:{steps:[
  'Torre o pão de cada um (fatias na tabela).',
  'Bata os ovos dos dois juntos com sal e mexa numa frigideira só, com um fio de azeite, por 2 min.',
  'Passe o cottage no pão e divida os ovos.',
  'Sirva com o iogurte e a banana, pela tabela.'],
  tips:['Pão francês: toque em Pão na tabela e troque (1 pão de 50 g vale umas 2 fatias). A Pri fica com meio pão.','Pri: 1 fatia de pão de trigo por refeição fica dentro do FODMAP baixo. Mais que isso pode incomodar.']},
 C2:{steps:[
  'Uma panela só: aveia, leite sem lactose e a banana amassada (proporção do quadro), fogo médio, mexendo por 4 a 5 min até ficar cremoso.',
  'Pese o mingau pronto em cada prato.',
  'Por cima, nos dois: um fio de pasta de amendoim.',
  'Ovos cozidos do lote ao lado.'],
  tips:['Versão sem fogo: misture aveia e leite na noite anterior e deixe na geladeira.','Os ovos cozidos saem do lote de domingo e quarta, veja a aba Preparo.']},
 L1:{steps:[
  'Bata tudo junto no liquidificador com 3 cubos de gelo, por 40 s (proporção do quadro).',
  'Sirva pelos ml da tabela: o copo do Lucas sai maior.',
  'Pão com pasta de amendoim para os dois.'],
  tips:['Whey isolado tem pouquíssima lactose. Confira no rótulo se não traz sorbitol, manitol ou inulina, que incomodam quem faz FODMAP.','Pri: banana firme, ainda com a ponta verde.']},
 E1:{steps:['Coloque o iogurte em uma tigela.','Junte a aveia e o mamão picado.'],tips:['Dia sem fome à noite? É a refeição mais fácil de pular. Se pular, use um extra no placar: 1 copo de iogurte.']},
 E2:{steps:['Coloque o iogurte em uma tigela.','Junte a aveia e as uvas.'],tips:['Uva: até cerca de 150 g por vez fica dentro do limite FODMAP baixo para a Pri.']},
 M1:{steps:[
  'Cozinhe o macarrão dos dois numa panela só, pelo tempo do pacote. Escorra e passe um fio de azeite.',
  'Numa panela, aqueça o azeite aromatizado (receita base) e junte o molho de tomate. 8 min em fogo baixo com sal, orégano e pimenta.',
  'Junte o espinafre picado nos últimos 2 min e o frango desfiado do lote no fim, só para aquecer.',
  'No prato, pese o macarrão cozido e depois o molho pronto, e finalize com parmesão. Um ovo cozido do lote ao lado de cada prato.'],
  tips:['Sem alho nem cebola no molho: o sabor vem do azeite aromatizado.']},
 M2:{steps:[
  'Uma assadeira só para os dois: batata em palitos com azeite, sal e páprica. Airfryer a 200 °C por 18 min, mexendo na metade (forno: 220 °C por 25 min).',
  'Uma tigela só de salada: tomate e pepino com limão e um fio de azeite.',
  'Omelete com o mesmo recheio para os dois: bata os ovos com sal, cozinhe 2 min, coloque espinafre, mussarela e o frango desfiado do lote e dobre. O do Lucas leva mais ovos.',
  'No prato, pese a batata assada e a salada. Lucas: arroz e feijão do lote.'],
  tips:['A mesma assadeira de batata serve outras refeições do dia, se quiser adiantar.']},
 M3:{steps:[
  'Uma assadeira só: tempere os filés ainda congelados com sal, limão e páprica.',
  'Batata em cubos e cenoura em rodelas com azeite e sal: 10 min na airfryer a 200 °C.',
  'Junte o peixe e a abobrinha e mais 14 a 16 min, virando o peixe na metade.',
  'No prato, pese o peixe e os legumes assados. Lucas: arroz do lote ao lado.'],
  tips:['Prato de Outros: só quando comprar peixe. Filé grosso (mais de 2 cm) pede 2 a 3 min a mais.']},
 M4:{steps:[
  'Uma massa só no liquidificador: ovos, aveia e espinafre na proporção do quadro, com sal. Faça a quantidade que quiser.',
  'Batata em cubos com o azeite e sal: airfryer a 200 °C por 18 min.',
  'Frigideira antiaderente untada: uma concha pequena por crepe (cada ovo da massa dá 1 crepe), 2 min de cada lado. Cada um come o número da tabela; o resto guarda 2 dias na geladeira.',
  'Recheio dos dois: frango desfiado do lote, mussarela e tomate. Enrole.',
  'No prato, pese a batata já assada.'],
  tips:['A massa fica mais firme se descansar 5 min antes de ir para a frigideira.']},
 M5:{steps:[
  'Uma panela só de purê: faça a quantidade que quiser. Cozinhe as batatas em cubos por 15 min, escorra e amasse com o leite, o azeite (proporção do quadro) e sal. Sem manteiga e sem alho.',
  'No prato, pese o purê pronto: as gramas de cada um estão na tabela. O resto vai para a geladeira (3 dias).',
  'Frango do lote aquecido com um fio de limão e ovos cozidos do lote, para os dois.',
  'Legumes, uma panela só: cenoura e abobrinha no vapor, com tomate cru ao lado.'],
  tips:['Frango fatiado do lote fica melhor aquecido na frigideira, 2 min de cada lado.']},
 C3:{steps:[
  'Uma massa só: amasse as bananas e misture com os ovos e a aveia (proporção do quadro) e uma pitada de canela.',
  'Frigideira antiaderente untada, fogo médio: pingue conchas pequenas e vire quando as bordas firmarem, cerca de 2 min de cada lado.',
  'Cada um come o número da tabela (2 por ovo da massa). Sirva com o iogurte e um fio de pasta de amendoim.'],
  tips:['Pri: banana firme, ainda com a ponta verde. Madura demais pesa no FODMAP.','Panquecas pequenas viram sem quebrar.']},
 C4:{steps:[
  'Faça os ovos fritos ou mexidos (quantos na tabela).',
  'Monte o pão com a mussarela e o ovo. Frigideira tampada em fogo baixo, 2 min de cada lado, até o queijo derreter. Pão pela tabela; com 1 fatia, fica aberto.',
  'Café com o leite sem lactose da tabela e mamão picado ao lado.'],
  tips:['Sem frigideira livre? Sanduicheira ou airfryer a 180 °C por 4 min.']},
 C5:{steps:[
  'Coloque o iogurte na tigela, junte a aveia e a banana em rodelas.',
  'Um fio de pasta de amendoim por cima, nos dois.',
  'Ovos cozidos do lote ao lado, com sal (quantos na tabela).'],
  tips:['É o café de quem está com pressa: nada vai ao fogo se os ovos do lote estiverem prontos.']},
 L2:{steps:[
  'Bata juntos o iogurte, o whey, os morangos e a aveia por 30 s (proporção do quadro).',
  'Sirva pelos ml da tabela. Torrada com cottage e um fio de pasta de amendoim, para os dois.'],
  tips:['Fica mais grosso que a vitamina de leite. Se quiser mais líquido, junte um pouco de água gelada.']},
 L3:{steps:[
  'Misture o atum escorrido com tomate em cubos, sal e um fio de limão.',
  'Monte no pão com a mussarela (fatias na tabela; com 1, fica aberto). Se quiser quente, 2 min na frigideira tampada.',
  'Leite sem lactose e banana ao lado. No da Pri, o Nescau.'],
  tips:['Prato de Outros: só quando tiver atum em casa. Meia lata para cada.']},
 L4:{steps:[
  'Descasque os ovos cozidos do lote (quantos na tabela) e tempere com sal.',
  'Copo de leite sem lactose (da tabela); no da Pri, o Nescau.',
  'Banana e pão com pasta de amendoim, para os dois.'],
  tips:['Bom para levar: ovo cozido e fruta aguentam a mochila.']},
 E3:{steps:[
  'Aqueça o leite sem lactose sem deixar ferver (1 min no micro-ondas).',
  'Misture o whey com um batedor ou garfo até sumir os grumos e junte a aveia.'],
  tips:['Use esta ceia nos dias em que o placar está baixo: rende bem mais proteína que a tigela de iogurte.','Whey sabor baunilha ou chocolate fica parecido com um achocolatado quente.']},
 E4:{steps:[
  'Bata os ovos dos dois juntos com sal e cozinhe numa frigideira só, em fogo baixo, mexendo por 2 min.',
  'Desligue, junte a mussarela e divida, com tomate picado por cima.'],
  tips:['Fogo baixo deixa o ovo cremoso e evita ressecar.']},
 M6:{steps:[
  'Cozinhe todas as batatas em cubos por 12 min em água com sal, até ficarem macias mas inteiras.',
  'Uma tigela só: batata morna, ovos cozidos do lote em quartos, frango desfiado do lote, tomate e pepino, com azeite, limão, sal e orégano.',
  'No prato, pese a salada pronta. Lucas: feijão do lote ao lado.'],
  tips:['Morna ou fria, funciona igual. Dá para levar em pote.']},
 M7:{steps:[
  'Cozinhe o macarrão dos dois junto, pelo tempo do pacote. Escorra e passe um fio de azeite.',
  'Uma frigideira só: abobrinha em meia-lua no azeite aromatizado por 4 min, depois o tomate por mais 2 min.',
  'Misture com o macarrão e, no prato, pese pronto.',
  'Proteína no prato: frango desfiado do lote nos dois. Parmesão por cima.'],
  tips:['Pri: abobrinha até cerca de 75 g por refeição fica dentro do FODMAP baixo.']},
 M8:{steps:[
  'Uma panela só: aqueça o azeite aromatizado e junte o molho de tomate com sal e orégano, 3 min em fogo baixo.',
  'Coloque os filés ainda congelados no molho, tampe e cozinhe 12 a 15 min.',
  'Junte o espinafre nos últimos 2 min e, no prato, pese o molho pronto.',
  'Lucas: arroz e feijão do lote. Pri: batata cozida ou assada.'],
  tips:['Prato de Outros: só quando comprar peixe.']},
 M9:{steps:[
  'Uma assadeira só: batata em cubos na airfryer a 200 °C por 18 min.',
  'Uma frigideira só: mexa os ovos dos dois e junte o frango desfiado do lote. Pese pronto no prato; o que não couber no pão vai ao lado.',
  'Monte com a mussarela, o tomate e o espinafre (pão pela tabela; com 1 fatia, fica aberto). Frigideira tampada, 2 min de cada lado. Batata assada ao lado, pesada pronta.'],
  tips:['Pri: 1 fatia de pão de trigo por refeição fica dentro do FODMAP baixo; a batata completa o prato.']},
 M10:{steps:[
  'Cozinhe todas as batatas em cubos com a cenoura em cubinhos, 12 min em água com sal, até ficarem macias mas inteiras. Escorra e deixe esfriar.',
  'Uma tigela só: batata, cenoura, ovos cozidos do lote picados e a maionese light, com sal, limão e cheiro-verde. Mexa com cuidado para a batata não virar purê.',
  'No prato, pese a maionese pronta. Frango desfiado do lote por cima ou ao lado. Lucas: arroz do lote.'],
  tips:['Gelada fica melhor: dá para fazer na véspera. Na geladeira, em pote fechado, dura até 3 dias. Não vai ao micro-ondas.','Pri: maionese com alho ou cebola na lista de ingredientes sai do FODMAP baixo. Confira o rótulo. Sem ervilha pelo mesmo motivo.']},
 M11:{steps:[
  'Esquente o arroz e o feijão do lote (micro-ondas, 2 min cada, com 1 colher de água no arroz).',
  'Frango em bifes finos com sal, páprica e limão. Frigideira bem quente com um fio de azeite: 4 min de cada lado, até não ter rosa por dentro.',
  'Uma tigela só de salada: alface, tomate e pepino com limão, sal e azeite.',
  'Monte os pratos pela tabela. Feijão só para o Lucas.'],
  tips:['Sem tempo de grelhar? Use o frango assado do lote, esquentado na frigideira para dourar.','Pri: feijão fica fora por FODMAP; o arroz entra no lugar da batata.']},
 M12:{steps:[
  'Esquente o arroz e o feijão do lote.',
  'Couve em tiras finas: refogue 2 min no azeite com sal, só até murchar. Divida.',
  'Ovos mexidos dos dois numa frigideira só: bata com sal, mexa em fogo baixo e, quase no ponto, junte a mussarela picada. Divida pela tabela.',
  'Tomate em rodelas ao lado. Feijão só para o Lucas.'],
  tips:['Prato de quando o frango acabou: só ovo, queijo e o que já está pronto no lote.','Sem couve, vai espinafre ou abobrinha refogada.']},
 M13:{steps:[
  'Uma massa só no liquidificador: ovos e aveia na proporção do quadro, com sal e uma pitada de páprica. Faça a quantidade que quiser.',
  'Batata em cubos com o azeite e sal: airfryer a 200 °C por 18 min.',
  'Frigideira antiaderente untada: uma concha pequena por crepe (cada ovo da massa dá 1 crepe), 2 min de cada lado. Cada um come o número da tabela; o resto guarda 2 dias na geladeira.',
  'Recheio dos dois: frango desfiado do lote, mussarela e tomate. Enrole e volte 1 min à frigideira para o queijo derreter.',
  'No prato, pese a batata já assada.'],
  tips:['É o crepe de espinafre sem a verdura na massa: para quando não tem espinafre em casa.','A massa fica mais firme se descansar 5 min antes de ir para a frigideira.']},
 M14:{steps:[
  'Esquente o arroz e o feijão do lote.',
  'Frango em bifes finos com sal, páprica e limão. Frigideira bem quente: 4 min de cada lado, até não ter rosa por dentro.',
  'Na mesma frigideira, uma farofa só: doure a banana em rodelas no azeite, 1 min de cada lado, e reserve. Mexa os ovos com sal até ficarem firmes.',
  'Baixe o fogo, junte a farinha e mexa 3 a 4 min, até dourar e ficar soltinha. Volte a banana por último, com cheiro-verde.',
  'No prato, pese a farofa pronta, com o tomate ao lado. Feijão só para o Lucas.'],
  tips:['Banana firme não desmancha na farofa e é a que cabe no FODMAP baixo da Pri.','Use farinha torrada pura: a farofa pronta do pacote costuma levar cebola e alho.','Dá para usar o frango assado do lote e fazer só a farofa na hora.']},
 M15:{steps:[
  'Frango cru em cubos ou tiras finas, com sal e páprica. Panela bem quente com o azeite: doure 6 a 8 min, mexendo, até não ter rosa por dentro.',
  'Junte o molho de tomate e a mostarda (proporção do quadro) e cozinhe 3 min em fogo baixo.',
  'Desligue o fogo e misture o creme de leite. Volte só para aquecer, sem ferver, senão talha.',
  'Legumes, uma frigideira só: cenoura e abobrinha em cubos com um fio de azeite e sal, 6 min.',
  'No prato, pese o strogonoff pronto e os legumes. Arroz do lote ao lado.'],
  tips:['Faça a panela que quiser: o que sobra vai para a geladeira (3 dias) e esquenta bem. Sem ferver de novo.','Pri: creme de leite sem lactose e mostarda sem alho e cebola na lista de ingredientes. Nada de cebola nem champignon na panela.','Com frango assado do lote: desfie, aqueça no molho 2 min e siga do creme.']},
 B1:{steps:[
  'Pese cru (pode pesar congelado: veja a dica) e descongele na geladeira de véspera. Tempere com sal, páprica, limão e um fio de azeite.',
  'Forno a 200 °C por 22 a 25 min, até ficar branco por dentro e sem rosa.',
  'Descanse 5 min. Desfie o que vai para molho, salada e recheio; fatie o resto.',
  'Guarde em potes na geladeira por até 4 dias.'],tips:['Todas as quantidades de frango do app são de frango cru. Assado, ele perde cerca de ¼ do peso: 120 g cru dão ~90 g prontos.','Congelado: pese direto na balança. Se tiver casca de gelo, passe na água fria uns segundos e seque antes, ou conte uns 10% a mais. Sem balança: peso do pacote ÷ número de pedaços (sassami tem ~40 a 50 g, filé de peito ~100 a 150 g).','Assar direto do congelador leva cerca de 50% mais tempo: só tire quando não tiver rosa no meio.']},
 B2:{steps:[
  'Arroz: lave o arroz (quantidade na aba Preparo), refogue em um fio de azeite, junte 2,5 partes de água e sal. Tampado, 12 min em fogo baixo.',
  'Feijão: cubra o feijão (de molho por 8 h, se tiver) com água, panela de pressão por 25 min depois de pegar pressão.',
  'Tempere o feijão com sal e louro. Sem cebola e alho se for dividir com a Pri.',
  'Arroz na geladeira por 4 dias. Feijão em porções de 1 concha (140 g) no congelador.'],tips:['Só o Lucas come feijão (FODMAP). Arroz entra nos dois em alguns pratos.']},
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
 B1:{n:'Frango assado em lote',t:30,slot:'base',desc:'Frango dos dois, assado de uma vez para 3 a 4 dias.'},
 B2:{n:'Arroz e feijão em lote',t:35,slot:'base',desc:'Arroz para a semana e feijão congelado em porções.'},
 B3:{n:'Ovos cozidos em lote',t:12,slot:'base',desc:'Ovo cozido do café, do purê, do macarrão, da salada morna e da maionese.'},
 B4:{n:'Azeite aromatizado com alho',t:8,slot:'base',desc:'O sabor de alho do macarrão sem frutano.'}
};

/* ===== FOTOS: img/<id>.jpg (geradas para o app). Sem foto, um prato vazio. ===== */
const PLATE='<svg viewBox="0 0 120 80" aria-hidden="true"><ellipse cx="60" cy="44" rx="40" ry="24" fill="#F8F6F1" stroke="#D6D1C6" stroke-width="1.5"/><ellipse cx="60" cy="44" rx="28" ry="16" fill="none" stroke="#E6E2D8"/></svg>';
function ill(id){
  const n=(MEALS[id]||BASES[id]||{n:''}).n;
  return typeof PHOTOS!=='undefined'&&PHOTOS.includes(id)?`<img src="img/${id}.jpg" alt="${n}" loading="lazy" decoding="async">`:PLATE;
}
