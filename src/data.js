/* ===== DADOS: ingredientes, refeições, semana ===== */
const AISLES = {
  hort:'Hortifruti', prot:'Peixe, frango e enlatados', lat:'Ovos e laticínios',
  merc:'Mercearia', desp:'Despensa (confira em casa)'
};
// p = g de proteína por unidade, k = kcal por unidade, f = fator receita->compra,
// pack = tamanho da embalagem (unidade de compra), wp = g por unidade de compra
// MEALS: slot = tipo (cafe, ref = almoço ou jantar, lanche, ceia); oc = os ovos da refeição são cozidos no lote.
// junto = ingredientes feitos de uma vez para os dois (uma massa, uma vitamina, uma panela), jn = nome desse preparo.
// O lanche da tarde é a refeição maior (academia à noite). A ceia completa a proteína que faltar no dia (ver ceiaFactor em logic.js).
// outros = prato com ingrediente caro (peixe, atum, sardinha): fica fora do plano da semana, só aparece em Outros nas trocas.
// Toda refeição do mesmo tipo é alternativa das outras na aba Hoje (botão Trocar).
const ING = {
  ovo:      {n:'Ovo', u:'un', p:6.2, k:75, pack:12, pk:['dúzia','dúzias'], wp:60, aisle:'lat'},
  atum:     {n:'Atum em lata (natural)', u:'lata', p:27, k:125, pack:1, pk:['lata','latas'], wp:170, aisle:'prot'},
  sardinha: {n:'Sardinha em lata', u:'lata', p:22, k:190, pack:1, pk:['lata','latas'], wp:125, aisle:'prot'},
  peixe:    {n:'Filé de peixe congelado (tilápia ou merluza)', u:'g', p:.20, k:.98, pack:500, pk:['pacote','pacotes'], size:'500 g', aisle:'prot'},
  frango:   {n:'Peito de frango, filé ou sassami (peso cru)', u:'g', p:.23, k:1.1, pack:500, pk:['bandeja','bandejas'], size:'500 g', aisle:'prot'},
  cottage:  {n:'Queijo cottage', u:'g', p:.11, k:.98, pack:200, pk:['pote','potes'], size:'200 g', aisle:'lat'},
  mussarela:{n:'Mussarela fatiada', u:'g', p:.22, k:2.8, pack:150, pk:['pacote','pacotes'], size:'150 g', aisle:'lat'},
  parmesao: {n:'Parmesão ralado', u:'g', p:.36, k:4, pack:50, pk:['pacote','pacotes'], size:'50 g', aisle:'lat'},
  iogurte:  {n:'Iogurte natural desnatado sem lactose (Pense Zero)', u:'g', p:.036, k:.4, pack:1150, pk:['garrafa','garrafas'], size:'1,15 kg', aisle:'lat'},
  leite:    {n:'Leite sem lactose', u:'ml', p:.032, k:.62, pack:1000, pk:['caixa','caixas'], size:'1 L', wp:1.03, aisle:'lat'},
  whey:     {n:'Whey isolado', u:'dose', p:24, k:115, pack:33, pk:['pote','potes'], size:'1 kg', aisle:'desp', pantry:true},
  azeite:   {n:'Azeite de oliva', u:'cs', p:0, k:120, pack:1, pk:['garrafa','garrafas'], aisle:'desp', pantry:true, mlPerUnit:15},
  pao:      {n:'Pão de forma tradicional', u:'fatia', p:2, k:63, pack:20, pk:['pacote','pacotes'], size:'500 g', wp:25, aisle:'merc'},
  arroz:    {n:'Arroz', u:'g cozido', p:.025, k:1.3, f:.34, pack:1000, pk:['pacote','pacotes'], size:'1 kg', aisle:'merc'},
  feijao:   {n:'Feijão', u:'g cozido', p:.05, k:.77, f:.35, pack:500, pk:['pacote','pacotes'], size:'500 g', aisle:'merc'},
  macarrao: {n:'Macarrão de arroz ou milho', u:'g', p:.07, k:3.6, pack:500, pk:['pacote','pacotes'], size:'500 g', aisle:'merc'},
  aveia:    {n:'Aveia em flocos', u:'g', p:.135, k:3.7, pack:500, pk:['pacote','pacotes'], size:'500 g', aisle:'merc'},
  amendoim: {n:'Pasta de amendoim', u:'g', p:.25, k:5.9, pack:450, pk:['pote','potes'], size:'450 g', aisle:'merc'},
  passata:  {n:'Tomate pelado ou passata (sem cebola e alho)', u:'g', p:.012, k:.3, pack:520, pk:['caixa','caixas'], size:'520 g', aisle:'merc'},
  batata:   {n:'Batata inglesa', u:'g', p:.02, k:.77, pack:250, loose:true, aisle:'hort'},
  cenoura:  {n:'Cenoura', u:'g', p:.009, k:.41, pack:250, loose:true, aisle:'hort'},
  abobrinha:{n:'Abobrinha', u:'g', p:.012, k:.17, pack:250, loose:true, aisle:'hort'},
  pepino:   {n:'Pepino', u:'g', p:.007, k:.15, pack:250, loose:true, aisle:'hort'},
  tomate:   {n:'Tomate', u:'g', p:.009, k:.18, pack:250, loose:true, aisle:'hort'},
  espinafre:{n:'Espinafre', u:'g', p:.029, k:.23, pack:150, pk:['maço','maços'], size:'~150 g', aisle:'hort'},
  banana:   {n:'Banana nanica (firme)', u:'un', p:1.2, k:95, pack:6, pk:['penca','pencas'], size:'~6 un', wp:110, aisle:'hort'},
  morango:  {n:'Morango', u:'g', p:.007, k:.32, pack:250, pk:['bandeja','bandejas'], size:'250 g', aisle:'hort'},
  mamao:    {n:'Mamão formosa', u:'g', p:.005, k:.4, pack:700, pk:['pedaço','pedaços'], size:'~700 g (½ mamão)', aisle:'hort'},
  uva:      {n:'Uva sem semente', u:'g', p:.007, k:.69, pack:500, pk:['cacho','cachos'], size:'~500 g', aisle:'hort'},
  limao:    {n:'Limão', u:'un', p:0, k:0, pack:2, loose:true, wp:80, aisle:'hort'},
  abobora:  {n:'Abóbora cabotiá', u:'g', p:.014, k:.48, pack:250, loose:true, aisle:'hort'},
  alface:   {n:'Alface', u:'g', p:.013, k:.14, pack:250, pk:['pé','pés'], size:'~250 g', aisle:'hort'},
  couve:    {n:'Couve-manteiga', u:'g', p:.029, k:.27, pack:200, pk:['maço','maços'], size:'~200 g', aisle:'hort'},
  brocolis: {n:'Brócolis', u:'g', p:.021, k:.25, pack:300, pk:['bandeja','bandejas'], size:'~300 g', aisle:'hort'},
  pimentao: {n:'Pimentão vermelho', u:'g', p:.01, k:.28, pack:150, loose:true, aisle:'hort'},
  berinjela:{n:'Berinjela', u:'g', p:.01, k:.2, pack:250, loose:true, aisle:'hort'},
  vagem:    {n:'Vagem', u:'g', p:.018, k:.3, pack:250, loose:true, aisle:'hort'},
  batatadoce:{n:'Batata-doce', u:'g', p:.006, k:.77, pack:250, loose:true, aisle:'hort'},
  mandioca: {n:'Mandioca (aipim)', u:'g', p:.006, k:1.25, pack:500, loose:true, aisle:'hort'},
  laranja:  {n:'Laranja', u:'un', p:1.3, k:70, pack:1, loose:true, wp:180, aisle:'hort'},
  kiwi:     {n:'Kiwi', u:'un', p:.8, k:42, pack:1, loose:true, wp:75, aisle:'hort'},
  abacaxi:  {n:'Abacaxi', u:'g', p:.009, k:.48, pack:1000, pk:['abacaxi','abacaxis'], size:'~1 kg', aisle:'hort'},
  camarao:  {n:'Camarão congelado (limpo)', u:'g', p:.24, k:1, pack:400, pk:['pacote','pacotes'], size:'400 g', aisle:'prot'},
  grao:     {n:'Grão-de-bico cozido (lata)', u:'g', p:.07, k:1.2, pack:265, pk:['lata','latas'], size:'265 g escorrido', wp:1.5, aisle:'prot'},
  quinoa:   {n:'Quinoa', u:'g cozido', p:.044, k:1.2, f:.36, pack:250, pk:['pacote','pacotes'], size:'250 g', aisle:'merc'},
  pts:      {n:'PTS (proteína texturizada de soja)', u:'g', p:.5, k:3.3, pack:500, pk:['pacote','pacotes'], size:'500 g', aisle:'merc'},
  paofr:    {n:'Pão francês (padaria)', u:'un', p:4.7, k:150, pack:1, loose:true, wp:50, aisle:'merc'},
  ameixa:   {n:'Ameixa fresca', u:'un', p:.5, k:37, pack:1, loose:true, wp:70, aisle:'hort'},
  tapioca:  {n:'Goma de tapioca', u:'g', p:0, k:2.4, pack:500, pk:['pacote','pacotes'], size:'500 g', aisle:'merc'},
  cuscuz:   {n:'Flocão de milho (cuscuz)', u:'g', p:.072, k:3.6, pack:500, pk:['pacote','pacotes'], size:'500 g', aisle:'merc'},
  minas:    {n:'Queijo minas frescal', u:'g', p:.17, k:2.6, pack:400, pk:['peça','peças'], size:'~400 g', aisle:'lat'},
  castanha: {n:'Castanha-do-pará', u:'g', p:.145, k:6.6, pack:100, pk:['pacote','pacotes'], size:'100 g', aisle:'merc'},
  chocolate:{n:'Chocolate 70% cacau', u:'g', p:.08, k:5.8, pack:100, pk:['barra','barras'], size:'100 g', aisle:'merc'},
  mel:      {n:'Mel', u:'g', p:0, k:3.1, pack:300, pk:['pote','potes'], size:'300 g', aisle:'merc'},
  maca:     {n:'Maçã', u:'un', p:.4, k:85, pack:1, loose:true, wp:150, aisle:'hort'},
  maionese: {n:'Maionese light (pote, sem alho e cebola)', u:'g', p:.005, k:2.7, pack:500, pk:['pote','potes'], size:'500 g', aisle:'merc'}
};
/* Editor de refeição: st = passo do + e −, hu = medida caseira [singular, plural, g ou ml por medida],
   pri = máximo por refeição para a Pri ficar no FODMAP baixo (0 = evitar).
   Regra: sempre medida caseira (colher, concha, copo, xícara, unidade) quando der. Frango, peixe, camarão e macarrão ficam em gramas.
   fp = 1 porção de fruta (para a troca de fruta).
  gw = gramas por unidade (para ver em gramas o que é contado em unidade: ovo, lata, banana...). */
const ADJ = {
  ovo:{st:1, gw:50}, atum:{st:.5, gw:120}, sardinha:{st:.5, gw:84}, peixe:{st:20}, frango:{st:20}, camarao:{st:20},
  grao:{st:25, hu:['colher de servir','colheres de servir',50], pri:0},
  cottage:{st:20, hu:['colher','colheres',20], pri:40}, mussarela:{st:15, hu:['fatia','fatias',15]}, parmesao:{st:5, hu:['colher','colheres',5]},
  iogurte:{st:50, hu:['copo','copos',200]}, leite:{st:50, hu:['copo','copos',200]}, whey:{st:.5, gw:30}, azeite:{st:.25, gw:13}, pao:{st:1, pri:1, gw:25},
  arroz:{st:25, hu:['colher de servir','colheres de servir',50]}, feijao:{st:70, hu:['concha','conchas',140], pri:0},
  quinoa:{st:25, hu:['colher de servir','colheres de servir',50]}, macarrao:{st:10}, pts:{st:10, pri:0}, paofr:{st:.5, pri:.5, gw:50},
  aveia:{st:10, hu:['colher','colheres',10], pri:40}, amendoim:{st:7.5, hu:['colher','colheres',15], pri:30},
  passata:{st:50, hu:['copo','copos',200]},
  batata:{st:75, hu:['batata média','batatas médias',150]}, batatadoce:{st:75, hu:['batata-doce média','batatas-doces médias',150], pri:75},
  mandioca:{st:50, hu:['pedaço','pedaços',100]},
  cenoura:{st:30, hu:['cenoura','cenouras',120]}, abobrinha:{st:25, hu:['xícara','xícaras',100], pri:75},
  abobora:{st:30, hu:['xícara','xícaras',120], pri:75}, brocolis:{st:20, hu:['xícara','xícaras',80], pri:75},
  berinjela:{st:20, hu:['xícara','xícaras',80], pri:75}, vagem:{st:25, hu:['xícara','xícaras',100], pri:75},
  couve:{st:20, hu:['xícara','xícaras',40]}, espinafre:{st:15, hu:['xícara','xícaras',30]}, alface:{st:10, hu:['folha','folhas',10]},
  pimentao:{st:37.5, hu:['pimentão','pimentões',150]}, pepino:{st:50, hu:['pepino','pepinos',200]}, tomate:{st:25, hu:['tomate','tomates',100]},
  banana:{fp:1, st:.5, pri:1, gw:100}, laranja:{fp:1, st:1, gw:130}, kiwi:{fp:2, st:1, gw:75},
  morango:{fp:144, st:12, hu:['morango','morangos',12]}, mamao:{fp:150, st:75, hu:['fatia','fatias',150]}, uva:{fp:100, st:25, hu:['punhado','punhados',50], pri:150},
  abacaxi:{fp:120, st:40, hu:['fatia','fatias',80], pri:140}, limao:{st:.5, gw:40}, ameixa:{fp:2, st:1, pri:0, gw:70},
  maionese:{st:15, hu:['colher de sopa','colheres de sopa',15]},
  tapioca:{st:20}, cuscuz:{st:10}, minas:{st:15, hu:['fatia','fatias',30], pri:40}, castanha:{st:4, hu:['castanha','castanhas',4], pri:40},
  chocolate:{st:5, hu:['quadradinho','quadradinhos',5], pri:30}, mel:{st:5, hu:['colher','colheres',10], pri:0}, maca:{fp:1, st:1, pri:0, gw:150}
};
for (const id in ADJ) Object.assign(ING[id], ADJ[id]);
/* Categoria de cada ingrediente: a troca no editor oferece os da mesma categoria, convertidos pelo que importa nela
   (proteína pela proteína, carboidrato e gordura pelas kcal, fruta pela porção, legume pelo peso). */
const CATS=[['prot','Proteína','p'],['lat','Laticínios e whey','p'],['carbo','Pães, grãos e batatas','k'],['fruta','Frutas','fp'],
  ['leg','Legumes e verduras','g'],['gord','Gorduras e doces','k'],['outro','Outros','k']];
const CAT_OF={prot:'frango ovo atum sardinha peixe camarao pts',lat:'iogurte leite cottage mussarela parmesao whey minas',
  carbo:'pao paofr arroz macarrao aveia batata batatadoce mandioca quinoa tapioca cuscuz',fruta:'banana morango mamao uva laranja kiwi abacaxi ameixa maca',
  leg:'cenoura abobrinha pepino tomate espinafre abobora alface couve brocolis pimentao berinjela vagem',gord:'azeite amendoim maionese castanha chocolate mel',outro:'passata feijao grao limao'};
for (const c in CAT_OF) CAT_OF[c].split(' ').forEach(id=>{ING[id].cat=c;});
/* Substitutos de verdade, do mais parecido ao menos: aparecem primeiro na troca de um item.
   O resto da mesma categoria fica em "Ver mais" (ninguém troca pão de forma por arroz). */
const PAR=[
  'pao paofr tapioca cuscuz','paofr pao tapioca cuscuz','tapioca pao paofr cuscuz','cuscuz tapioca pao paofr arroz',
  'arroz quinoa macarrao batata mandioca batatadoce cuscuz','macarrao arroz quinoa batata','quinoa arroz cuscuz macarrao',
  'batata batatadoce mandioca arroz','batatadoce batata mandioca arroz','mandioca batata batatadoce arroz','aveia tapioca pao',
  'frango peixe atum camarao sardinha ovo pts','peixe frango atum camarao sardinha','camarao peixe frango atum',
  'atum sardinha frango peixe ovo','sardinha atum frango peixe','ovo frango atum cottage minas','pts frango atum',
  'iogurte leite cottage','leite iogurte','cottage minas mussarela iogurte ovo','minas cottage mussarela','mussarela minas cottage parmesao',
  'parmesao mussarela minas','feijao grao',
  'amendoim castanha','castanha amendoim','azeite','maionese azeite','mel chocolate','chocolate mel castanha',
  'alface couve espinafre pepino tomate','couve espinafre alface brocolis','espinafre couve alface brocolis','tomate pepino cenoura pimentao',
  'pepino tomate cenoura alface','cenoura abobrinha abobora vagem brocolis','abobrinha berinjela abobora cenoura vagem','abobora abobrinha cenoura batatadoce',
  'brocolis vagem couve espinafre abobrinha','vagem brocolis abobrinha cenoura','berinjela abobrinha pimentao','pimentao tomate berinjela'
].reduce((o,l)=>{const [k,...r]=l.split(' ');o[k]=r;return o;},{});
/* Porção típica de quem adiciona um ingrediente no editor (o Lucas; a Pri recebe ~⅔). Sem POR: 1 medida caseira, 1 porção de fruta, 100 g ou 1 unidade. */
const POR={ovo:2,frango:120,peixe:150,camarao:120,macarrao:80,pts:30,azeite:.5,aveia:30,parmesao:10,cottage:40,mussarela:30,arroz:100,alface:30,passata:150,
  tapioca:60,cuscuz:60,minas:30,castanha:8,chocolate:20,mel:10,tomate:50};
for (const id in POR) ING[id].por=POR[id];
const MEALS = {
 C1:{slot:'cafe', n:'Pão com cottage e ovos mexidos, iogurte e fruta', t:8, junto:['ovo'], jn:'Ovos mexidos',
  L:[['pao',3],['ovo',3],['cottage',60],['iogurte',100],['banana',1]],
  P:[['pao',1],['ovo',2],['cottage',40],['iogurte',100],['banana',.5]]},
 C2:{slot:'cafe', n:'Mingau de aveia com banana e ovos cozidos', t:10, oc:1, junto:['aveia','leite','banana'], jn:'Mingau',
  L:[['aveia',50],['leite',250],['banana',1],['amendoim',15],['ovo',2]],
  P:[['aveia',30],['leite',150],['banana',.5],['amendoim',7.5],['ovo',2]]},
 C3:{slot:'cafe', n:'Panqueca de banana e aveia com iogurte', t:10, junto:['ovo','aveia','banana'], jn:'Massa',
  L:[['ovo',3],['aveia',40],['banana',1],['iogurte',200],['amendoim',15]],
  P:[['ovo',2],['aveia',30],['banana',1],['iogurte',100],['amendoim',7.5]]},
 C4:{slot:'cafe', n:'Queijo quente com ovo e café com leite', t:8,
  L:[['pao',3],['ovo',3],['mussarela',30],['leite',300],['mamao',150]],
  P:[['pao',1],['ovo',2],['mussarela',15],['leite',200],['mamao',150]]},
 C5:{slot:'cafe', n:'Iogurte com aveia, fruta e ovos cozidos', t:3, oc:1,
  L:[['iogurte',250],['aveia',40],['banana',1],['amendoim',15],['ovo',3]],
  P:[['iogurte',150],['aveia',20],['banana',.5],['amendoim',7.5],['ovo',2]]},
 L1:{slot:'lanche', n:'Vitamina de whey com banana e pão com pasta de amendoim', t:5, junto:['leite','whey','banana','aveia'], jn:'Vitamina',
  L:[['leite',300],['whey',1],['banana',1],['aveia',40],['pao',2],['amendoim',30]],
  P:[['leite',200],['whey',1],['banana',.5],['aveia',20],['pao',1],['amendoim',7.5]]},
 L2:{slot:'lanche', n:'Iogurte batido com whey e morango e torrada com cottage', t:5, junto:['iogurte','whey','morango','aveia'], jn:'Batido',
  L:[['iogurte',250],['whey',1],['morango',96],['aveia',40],['pao',2],['cottage',40],['amendoim',15]],
  P:[['iogurte',200],['whey',1],['morango',96],['aveia',30],['pao',1],['cottage',20],['amendoim',7.5]]},
 L3:{slot:'lanche', n:'Sanduíche de atum com mussarela, leite e banana', t:5, outros:1, junto:['atum'], jn:'Atum',
  L:[['pao',3],['atum',.5],['mussarela',30],['tomate',50],['leite',300],['banana',1]],
  P:[['pao',1],['atum',.5],['mussarela',15],['tomate',50],['leite',200],['banana',.5]]},
 L4:{slot:'lanche', n:'Ovos cozidos, pão com pasta de amendoim, leite e fruta', t:3, oc:1,
  L:[['ovo',3],['leite',300],['banana',1],['pao',2],['amendoim',30]],
  P:[['ovo',2],['leite',250],['banana',1],['pao',1],['amendoim',15]]},
 E1:{slot:'ceia', n:'Tigela de iogurte com aveia e mamão', t:1,
  L:[['iogurte',250],['aveia',10],['mamao',150]],
  P:[['iogurte',150],['aveia',10],['mamao',150]]},
 E2:{slot:'ceia', n:'Tigela de iogurte com aveia e uva', t:1,
  L:[['iogurte',250],['aveia',10],['uva',125]],
  P:[['iogurte',150],['aveia',10],['uva',100]]},
 E3:{slot:'ceia', n:'Leite quente com whey e aveia', t:3,
  L:[['leite',250],['whey',1],['aveia',20]],
  P:[['leite',200],['whey',.5],['aveia',10]]},
 E4:{slot:'ceia', n:'Ovos mexidos com mussarela', t:5, junto:['ovo','mussarela'], jn:'Ovos mexidos',
  L:[['ovo',2],['mussarela',15],['tomate',50]],
  P:[['ovo',2],['mussarela',15],['tomate',50]]},
 M1:{slot:'ref', lote:1, n:'Macarrão ao molho de tomate com frango', t:20, oc:1, junto:['macarrao','passata','frango','espinafre','azeite','parmesao'], jn:'Macarrão com molho',
  L:[['macarrao',100],['passata',200],['frango',120],['azeite',1],['parmesao',15],['espinafre',45],['ovo',1]],
  P:[['macarrao',55],['passata',150],['frango',60],['azeite',.5],['parmesao',10],['espinafre',45],['ovo',1]]},
 M2:{slot:'ref', n:'Omelete com batata assada e salada', t:20, junto:['batata','tomate','pepino'], jn:'Batata assada e salada',
  L:[['ovo',3],['mussarela',30],['espinafre',30],['frango',60],['batata',225],['arroz',100],['feijao',140],['azeite',.5],['tomate',75],['pepino',50]],
  P:[['ovo',2],['mussarela',15],['espinafre',30],['frango',50],['batata',150],['azeite',.25],['tomate',75],['pepino',50]]},
 M3:{slot:'ref', n:'Peixe na airfryer com batata e legumes', t:25, outros:1, junto:['peixe','batata','cenoura','abobrinha'], jn:'Assadeira',
  L:[['peixe',180],['batata',225],['arroz',100],['cenoura',90],['abobrinha',100],['azeite',1],['limao',.5]],
  P:[['peixe',140],['batata',150],['cenoura',90],['abobrinha',100],['azeite',.25],['limao',.5]]},
 M4:{slot:'ref', n:'Crepe de espinafre recheado', t:20, junto:['ovo','aveia','espinafre','batata'], jn:'Massa e batata',
  L:[['ovo',2],['aveia',30],['espinafre',45],['frango',120],['tomate',50],['mussarela',15],['batata',225],['azeite',.5]],
  P:[['ovo',2],['aveia',30],['espinafre',45],['frango',50],['tomate',50],['mussarela',15],['batata',150],['azeite',.25]]},
 M5:{slot:'ref', lote:1, n:'Frango com purê e legumes', t:25, oc:1, junto:['batata','leite','azeite'], jn:'Purê',
  L:[['frango',100],['ovo',2],['batata',225],['leite',50],['azeite',.5],['cenoura',90],['abobrinha',100],['tomate',50]],
  P:[['frango',100],['ovo',1],['batata',150],['leite',50],['azeite',.25],['cenoura',90],['abobrinha',100],['tomate',50]]},
 M6:{slot:'ref', lote:1, n:'Salada morna de batata com ovo e frango', t:20, oc:1, junto:['batata','tomate','pepino','azeite','frango','ovo'], jn:'Salada',
  L:[['batata',300],['ovo',2],['frango',120],['tomate',75],['pepino',50],['azeite',1],['feijao',140]],
  P:[['batata',225],['ovo',2],['frango',60],['tomate',75],['pepino',50],['azeite',.5]]},
 M7:{slot:'ref', lote:1, n:'Macarrão de arroz com frango, abobrinha e parmesão', t:20, junto:['macarrao','abobrinha','tomate','azeite','parmesao'], jn:'Macarrão com abobrinha',
  L:[['macarrao',100],['frango',120],['abobrinha',150],['tomate',50],['azeite',1],['parmesao',15]],
  P:[['macarrao',55],['frango',100],['abobrinha',75],['tomate',50],['azeite',.5],['parmesao',10]]},
 M8:{slot:'ref', n:'Peixe ao molho de tomate com espinafre', t:25, outros:1, junto:['peixe','passata','espinafre'], jn:'Peixe no molho',
  L:[['peixe',180],['passata',150],['espinafre',45],['azeite',.5],['arroz',150],['feijao',140]],
  P:[['peixe',150],['passata',150],['espinafre',45],['azeite',.25],['batata',225]]},
 M9:{slot:'ref', n:'Sanduíche quente de frango com batata', t:20,
  L:[['pao',2],['ovo',2],['frango',120],['mussarela',30],['tomate',50],['espinafre',30],['batata',225]],
  P:[['pao',1],['ovo',1],['frango',100],['mussarela',15],['tomate',50],['espinafre',30],['batata',150]]},
 M10:{slot:'ref', lote:1, n:'Maionese de batata com frango', t:25, oc:1, junto:['batata','cenoura','ovo','maionese'], jn:'Maionese',
  L:[['batata',300],['cenoura',90],['ovo',2],['maionese',45],['frango',140],['arroz',100]],
  P:[['batata',225],['cenoura',60],['ovo',2],['maionese',30],['frango',80]]}
};
/* Pratos de panela (lote:1) seguidos no plano viram uma panela só: cozinha em dobro e a refeição seguinte é sobra (loteOf em logic.js). */
/* Semana de domingo a sábado, calculada pela data de hoje: vira sozinha todo domingo.
   PLANO é o cardápio-modelo, igual toda semana; as trocas da aba Hoje valem por data. Pratos de panela em pares. */
const PLANO = [
 {wd:'Dom', slots:{cafe:'C1', almoco:'M2', lanche:'L1', jantar:'M1', ceia:'E1'}},
 {wd:'Seg', slots:{cafe:'C2', almoco:'M1', lanche:'L1', jantar:'M6', ceia:'E2'}},
 {wd:'Ter', slots:{cafe:'C1', almoco:'M6', lanche:'L1', jantar:'M4', ceia:'E1'}},
 {wd:'Qua', slots:{cafe:'C2', almoco:'M5', lanche:'L1', jantar:'M5', ceia:'E2'}},
 {wd:'Qui', slots:{cafe:'C1', almoco:'M7', lanche:'L1', jantar:'M7', ceia:'E1'}},
 {wd:'Sex', slots:{cafe:'C2', almoco:'M9', lanche:'L1', jantar:'M10', ceia:'E2'}},
 {wd:'Sáb', slots:{cafe:'C1', almoco:'M10', lanche:'L1', jantar:'M2', ceia:'E1'}}
];
const p2=n=>String(n).padStart(2,'0'),isoOf=d=>`${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`;
/* 'cardapio-hoje-test' (só para teste local) finge outra data */
const HOJE=(()=>{let t='';try{t=localStorage.getItem('cardapio-hoje-test')||'';}catch(e){}return /^\d{4}-\d\d-\d\d$/.test(t)?t:isoOf(new Date());})();
const WEEK=(()=>{const d=new Date(HOJE+'T12:00:00');d.setDate(d.getDate()-d.getDay());
  return PLANO.map((p,i)=>{const x=new Date(d);x.setDate(d.getDate()+i);return {d:isoOf(x),wd:p.wd,slots:p.slots};});})();
/* marca a semana nas chaves das compras e do preparo: a semana nova começa sem nada marcado (estoque, já tenho e despensa continuam) */
const WK=WEEK[0].d.replace(/-/g,'');
if (typeof module!=='undefined') module.exports={ING,MEALS,WEEK,AISLES};
