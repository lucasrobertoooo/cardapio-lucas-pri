/* ===== RECEITAS E ILUSTRAÇÕES ===== */
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

/* ===== ILUSTRAÇÕES (SVG 120x80, cores próprias de comida) ===== */
const PL='<ellipse cx="60" cy="69" rx="46" ry="5" fill="rgba(0,0,0,.10)"/><ellipse cx="60" cy="44" rx="49" ry="29" fill="#F8F6F1" stroke="#D6D1C6" stroke-width="1.5"/><ellipse cx="60" cy="44" rx="38" ry="21" fill="none" stroke="#E6E2D8"/>';
const cc=(x,y,r,f,s)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${f}"${s?` stroke="${s}"`:''}/>`;
const egg=(x,y,k)=>`<g transform="translate(${x} ${y}) scale(${k||1})"><ellipse rx="9" ry="6.5" fill="#fff" stroke="#E2DDD0"/>${cc(0,0,3.4,'#F2B632')}</g>`;
const rc=(x,y,w,h,f,rot)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${f}"${rot?` transform="rotate(${rot} ${x+w/2} ${y+h/2})"`:''}/>`;
const bread=(x,y,r)=>`<g transform="translate(${x} ${y}) rotate(${r||0})"><path d="M-13 12V-4q-4-1-4-6q0-8 17-8t17 8q0 5-4 6v16z" fill="#E9C089" stroke="#B9884A" stroke-width="1.5"/><path d="M-10 10V-5q-3-1-3-5q0-5 13-5t13 5q0 4-3 5v15z" fill="#FBF1DC"/></g>`;
const SCENES={
 C1:PL+bread(44,44,-8)+'<path d="M58 42q6-12 18-8q12-2 16 8q0 10-16 10q-14 2-18-10z" fill="#F7D553" stroke="#D9B93F"/>'+cc(70,40,2.6,'#FBE9A0')+'<path d="M70 58q14 8 26-7q-11 13-26 7z" fill="#F4D35E" stroke="#C9A93A"/>'+'<rect x="14" y="52" width="14" height="12" rx="3" fill="#fff" stroke="#D6D1C6"/>',
 C2:'<ellipse cx="60" cy="70" rx="40" ry="4" fill="rgba(0,0,0,.1)"/><path d="M20 36Q22 70 60 72Q98 70 100 36Z" fill="#EDE8DC" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="36" rx="40" ry="11" fill="#F8F6F1" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="37" rx="34" ry="8.5" fill="#E7D4AE"/>'+cc(48,36,5,'#F5DA6E','#D9B93F')+cc(60,39,5,'#F5DA6E','#D9B93F')+cc(72,36,5,'#F5DA6E','#D9B93F')+cc(56,34,3,'#C0306F')+egg(104,60,.8)+egg(14,62,.8),
 L1:'<ellipse cx="58" cy="72" rx="26" ry="4" fill="rgba(0,0,0,.1)"/><path d="M40 10L78 10L72 68Q59 74 46 68Z" fill="#F3E6D4" stroke="#CFC3AE" stroke-width="1.5"/><path d="M42 20L76 20L74 30Q58 36 44 30Z" fill="#F7EEDF"/><rect x="62" y="0" width="5" height="40" rx="2" fill="#BC2B6A" transform="rotate(14 64 20)"/>'+'<path d="M84 56q16 6 26-8q-9 16-26 8z" fill="#F4D35E" stroke="#C9A93A"/>'+cc(24,58,6,'#C0306F')+cc(24,52,2,'#3C8B4B'),
 E1:'<ellipse cx="60" cy="70" rx="40" ry="4" fill="rgba(0,0,0,.1)"/><path d="M20 36Q22 70 60 72Q98 70 100 36Z" fill="#EDE8DC" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="36" rx="40" ry="11" fill="#F8F6F1" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="37" rx="34" ry="8.5" fill="#FFFFFF"/>'+rc(44,30,9,7,'#F0922B',12)+rc(57,33,9,7,'#F49A3A',-8)+rc(69,30,9,7,'#F0922B',20)+cc(54,38,1.3,'#3A2A1A')+cc(64,31,1.3,'#3A2A1A'),
 E2:'<ellipse cx="60" cy="70" rx="40" ry="4" fill="rgba(0,0,0,.1)"/><path d="M20 36Q22 70 60 72Q98 70 100 36Z" fill="#EDE8DC" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="36" rx="40" ry="11" fill="#F8F6F1" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="37" rx="34" ry="8.5" fill="#FFFFFF"/>'+cc(46,35,4.5,'#6B3FA0')+cc(55,38,4.5,'#7A4BB3')+cc(65,35,4.5,'#6B3FA0')+cc(74,38,4.5,'#7A4BB3')+cc(60,33,4.5,'#7A4BB3'),
 M1:PL+'<ellipse cx="60" cy="44" rx="26" ry="14" fill="#EBCB6B"/><path d="M38 44q22-16 44 0M42 47q18-12 36 0M46 40q14-8 28 0" stroke="#D2AE45" stroke-width="2" fill="none"/><path d="M44 40q16-10 32 0q-6 12-16 12q-10 0-16-12z" fill="#D2452D" opacity=".92"/>'+cc(54,40,3.5,'#D9A68A')+cc(65,38,4,'#D9A68A')+cc(70,44,3,'#D9A68A')+cc(58,46,2.6,'#3C8B4B')+cc(50,45,2.2,'#3C8B4B')+cc(62,43,1.3,'#fff')+cc(55,37,1.3,'#fff'),
 M2:PL+'<path d="M24 44A26 17 0 0 1 76 44Z" fill="#F4C842" stroke="#D6A92A"/><path d="M30 44A21 12 0 0 1 70 44" fill="none" stroke="#FBE08A" stroke-width="2"/>'+cc(46,38,2,'#3C8B4B')+cc(56,35,2,'#3C8B4B')+rc(76,40,18,4,'#E3B565',-20)+rc(80,46,18,4,'#E3B565',10)+rc(74,34,16,4,'#E9C37A',-45)+cc(40,56,5.5,'#D9382B','#B02A20')+cc(52,59,5.5,'#D9382B','#B02A20')+cc(64,57,5,'#9ACB6A','#6FA24A')+cc(74,58,5,'#9ACB6A','#6FA24A'),
 M3:PL+'<path d="M24 44Q40 28 62 34Q80 38 84 46Q70 56 50 54Q32 54 24 44Z" fill="#E9EEF0" stroke="#BCC7CC" stroke-width="1.5"/><path d="M38 38l6 14M48 36l6 16M58 36l6 16M68 38l5 12" stroke="#B3BFC5" stroke-width="2"/>'+rc(84,32,9,9,'#E0B766',15)+rc(92,40,9,9,'#E5BF72',-10)+rc(80,45,9,9,'#E0B766',25)+cc(30,58,5,'#EE8A2A')+cc(40,60,5,'#EE8A2A')+cc(52,61,5,'#7CB35B','#5C9440')+cc(63,60,5,'#7CB35B','#5C9440')+'<path d="M92 56q8-8 14-2q-4 10-14 2z" fill="#F5DD4C" stroke="#D2B92A"/>',
 M4:PL+'<path d="M26 40L82 32L88 50L32 58Z" fill="#86C26A" stroke="#5E9B45" stroke-width="1.5"/><ellipse cx="85" cy="41" rx="6" ry="9" fill="#9BD07E" stroke="#5E9B45" stroke-width="1.5"/>'+cc(85,41,3.5,'#D9A68A')+cc(83,38,1.6,'#FBE9A0')+'<path d="M30 46q28-4 54-9" stroke="#B2DE98" stroke-width="2" fill="none"/>'+rc(30,58,14,8,'#E3B565',-10)+rc(48,60,14,8,'#E9C37A',8)+rc(66,59,14,8,'#E3B565',-6),
 M5:PL+'<path d="M26 52Q28 28 48 30Q66 28 68 52Z" fill="#F4E6B8" stroke="#DDCB92" stroke-width="1.5"/><path d="M34 40q8-8 18-4" stroke="#FFF6D6" stroke-width="3" fill="none"/>'+'<path d="M72 34q12-6 24 2q-12 8-24-2z" fill="#A9B7C0" stroke="#7F8E98"/>'+cc(76,35,1.2,'#27333B')+'<path d="M72 46q12-6 24 2q-12 8-24-2z" fill="#A9B7C0" stroke="#7F8E98"/>'+cc(76,47,1.2,'#27333B')+egg(84,60,.8)+rc(30,56,5,12,'#EE8A2A',20)+rc(40,58,5,12,'#EE8A2A',-10)+cc(58,60,4.5,'#D9382B'),
 C3:PL+cc(46,42,15,'#E2B26B','#C08A3E')+cc(66,40,15,'#E8BC77','#C08A3E')+cc(56,48,13,'#EDC584','#C08A3E')+'<path d="M46 46q10 4 20 0" stroke="#fff" stroke-width="3" fill="none"/>'+cc(78,56,4,'#F4D35E','#C9A93A')+cc(86,52,4,'#F4D35E','#C9A93A'),
 C4:PL+bread(48,44,-6)+'<path d="M34 42h28" stroke="#F7D553" stroke-width="3"/>'+egg(48,36,.8)+'<rect x="80" y="28" width="16" height="20" rx="3" fill="#fff" stroke="#D6D1C6"/><rect x="82" y="31" width="12" height="8" fill="#C89F78"/>'+rc(70,54,10,7,'#F0922B',10)+rc(84,56,10,7,'#F49A3A',-6),
 C5:'<ellipse cx="60" cy="70" rx="40" ry="4" fill="rgba(0,0,0,.1)"/><path d="M20 36Q22 70 60 72Q98 70 100 36Z" fill="#EDE8DC" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="36" rx="40" ry="11" fill="#F8F6F1" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="37" rx="34" ry="8.5" fill="#FFFFFF"/>'+cc(48,35,3,'#E7D4AE')+cc(56,38,3,'#E7D4AE')+'<path d="M62 32q8 6 16 0" stroke="#F4D35E" stroke-width="5" fill="none" stroke-linecap="round"/>'+egg(14,56,.8)+egg(106,56,.8),
 L2:'<ellipse cx="58" cy="72" rx="26" ry="4" fill="rgba(0,0,0,.1)"/><path d="M40 10L78 10L72 68Q59 74 46 68Z" fill="#F6E7EC" stroke="#CFC3AE" stroke-width="1.5"/><path d="M42 20L76 20L74 30Q58 36 44 30Z" fill="#FBF3F6"/><rect x="62" y="0" width="5" height="40" rx="2" fill="#1E7B4E" transform="rotate(14 64 20)"/>'+cc(24,58,6,'#D9382B','#B02A20')+cc(96,58,6,'#D9382B','#B02A20'),
 L3:PL+bread(46,44,-10)+bread(72,46,8)+cc(46,40,3.5,'#D9A68A')+cc(52,44,3,'#D9A68A')+cc(70,42,3.5,'#D9382B')+rc(66,46,10,4,'#FBE9A0'),
 L4:'<ellipse cx="60" cy="70" rx="46" ry="4" fill="rgba(0,0,0,.1)"/><rect x="72" y="18" width="22" height="50" rx="4" fill="#FFFFFF" stroke="#D6D1C6" stroke-width="1.5"/>'+egg(30,56)+egg(50,60)+'<path d="M14 40q16 6 28-6q-10 14-28 6z" fill="#F4D35E" stroke="#C9A93A"/>',
 E3:'<ellipse cx="58" cy="70" rx="30" ry="4" fill="rgba(0,0,0,.1)"/><path d="M34 22h48v38q0 10-10 10H44q-10 0-10-10z" fill="#F3EBDD" stroke="#CFC3AE" stroke-width="1.5"/><path d="M82 30q14 0 14 12t-14 12" fill="none" stroke="#CFC3AE" stroke-width="4"/><ellipse cx="58" cy="24" rx="22" ry="4" fill="#D8BE95"/><path d="M50 14q4-6 0-12M62 14q4-6 0-12" stroke="#B9B2A3" stroke-width="2" fill="none"/>',
 E4:PL+'<path d="M34 44q6-12 18-8q10-8 20 2q12 0 12 10q-6 10-20 8q-12 6-22-2q-12-2-8-10z" fill="#F7D553" stroke="#D9B93F"/>'+cc(50,42,3,'#FBE9A0')+cc(64,46,3,'#FBE9A0')+cc(78,50,3.5,'#D9382B'),
 M6:PL+cc(42,40,7,'#EFD9A0','#D8BE78')+cc(56,48,7,'#EFD9A0','#D8BE78')+cc(70,40,7,'#EFD9A0','#D8BE78')+egg(48,54,.75)+egg(76,52,.75)+cc(62,36,4,'#D9382B')+cc(36,52,4,'#9ACB6A','#6FA24A')+cc(84,42,3.5,'#D9A68A'),
 M7:PL+'<ellipse cx="60" cy="44" rx="28" ry="15" fill="#F1E3B6"/><path d="M36 44q24-16 48 0M40 48q20-12 40 0M44 40q16-8 32 0" stroke="#DCC98F" stroke-width="2" fill="none"/>'+'<path d="M44 38a6 6 0 0 1 12 0z" fill="#7CB35B"/><path d="M62 44a6 6 0 0 1 12 0z" fill="#7CB35B"/><path d="M50 48a6 6 0 0 1 12 0z" fill="#8CC36A"/>'+cc(70,38,3,'#D9382B')+cc(56,42,1.4,'#fff')+cc(66,48,1.4,'#fff'),
 M8:PL+'<ellipse cx="60" cy="44" rx="34" ry="18" fill="#D2452D" opacity=".9"/><path d="M36 44Q48 32 64 36Q78 40 82 46Q70 54 54 52Q40 52 36 44Z" fill="#EEF1F2" stroke="#BCC7CC" stroke-width="1.5"/>'+cc(46,54,3,'#3C8B4B')+cc(72,32,3,'#3C8B4B')+cc(84,52,2.6,'#3C8B4B'),
 M9:PL+bread(42,42,-8)+bread(64,44,6)+'<path d="M30 46h46" stroke="#3C8B4B" stroke-width="3"/>'+cc(52,36,3,'#D9382B')+rc(80,46,10,9,'#E0B766',15)+rc(88,38,10,9,'#E5BF72',-10),
 B1:PL+'<path d="M30 38Q44 28 58 36Q62 48 46 52Q30 52 30 38Z" fill="#E7B563" stroke="#C48E3B" stroke-width="1.5"/><path d="M62 34Q78 28 90 38Q88 50 72 52Q58 50 62 34Z" fill="#EBBC6D" stroke="#C48E3B" stroke-width="1.5"/>'+cc(45,41,1.3,'#F7DDA6')+cc(76,40,1.3,'#F7DDA6')+cc(40,60,4,'#7CB35B')+cc(52,62,4,'#7CB35B'),
 B2:'<ellipse cx="60" cy="70" rx="40" ry="4" fill="rgba(0,0,0,.1)"/><path d="M18 34Q20 68 60 70Q100 68 102 34Z" fill="#E9E4D8" stroke="#D2CCBD" stroke-width="1.5"/><ellipse cx="60" cy="34" rx="42" ry="11" fill="#F8F6F1" stroke="#D2CCBD" stroke-width="1.5"/><path d="M24 34A18 8 0 0 1 60 34A18 8 0 0 1 24 34Z" fill="#FFFFFF"/><path d="M60 34A18 8 0 0 1 96 34A18 8 0 0 1 60 34Z" fill="#6B3E26"/>'+cc(42,33,1.3,'#E5E0D2')+cc(50,36,1.3,'#E5E0D2')+cc(72,32,2,'#8A5A3A')+cc(84,35,2,'#8A5A3A'),
 B3:'<ellipse cx="60" cy="68" rx="44" ry="5" fill="rgba(0,0,0,.1)"/>'+'<ellipse cx="38" cy="46" rx="14" ry="18" fill="#FBF8F0" stroke="#D9D3C2" stroke-width="1.5"/><ellipse cx="62" cy="48" rx="14" ry="18" fill="#FBF8F0" stroke="#D9D3C2" stroke-width="1.5"/><ellipse cx="85" cy="46" rx="14" ry="18" fill="#FBF8F0" stroke="#D9D3C2" stroke-width="1.5"/>'+cc(62,50,6,'#F2B632'),
 B4:'<ellipse cx="60" cy="70" rx="30" ry="4" fill="rgba(0,0,0,.1)"/><path d="M50 18h20v8q10 6 10 18v22q0 6-6 6H46q-6 0-6-6V44q0-12 10-18z" fill="#C9D78A" stroke="#98A95A" stroke-width="1.5"/><rect x="54" y="8" width="12" height="12" rx="3" fill="#6B7A3A"/>'+cc(60,52,8,'#FBF3D0')+'<path d="M56 48l8 8" stroke="#D8CFA0" stroke-width="1.5"/>'
};
function ill(id){
  if(typeof PHOTOS!=='undefined'&&PHOTOS.includes(id))return `<img src="img/${id}.jpg" alt="${(MEALS[id]||BASES[id]||{n:''}).n}" loading="lazy" decoding="async">`;
  return `<svg viewBox="0 0 120 80" role="img" aria-label="${(MEALS[id]?MEALS[id].n:(BASES[id]||{n:''}).n)}" preserveAspectRatio="xMidYMid slice">${SCENES[id]||''}</svg>`;}
