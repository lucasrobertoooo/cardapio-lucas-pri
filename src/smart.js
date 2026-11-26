/* ===== ITEM DIGITADO NAS COMPRAS: "2 kg batata", "3 iogurtes", "1 dúzia de ovos", "papel toalha" =====
   parseManual devolve o ingrediente reconhecido (id) e a quantidade em unidade de compra (q), ou só o corredor provável.
   O texto fica salvo como foi digitado (S.manual), e a leitura é refeita a cada vez: melhora sozinha quando o app aprende palavras novas. */
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9%.,½ ]/g,' ').replace(/\s+/g,' ').trim();}
/* plural simples do português: ovos -> ovo, pães -> pao, limões -> limao, maçãs -> maca */
function sing(w){return w.length>3?w.replace(/(oes|aes)$/,'ao').replace(/res$/,'r').replace(/s$/,''):w;}
const singAll=t=>t.split(' ').map(sing).join(' ');
const ALIAS={'peito de frango':'frango','sassami':'frango','file de frango':'frango','tilapia':'peixe','merluza':'peixe','file de peixe':'peixe',
  'pao de forma':'pao','pao frances':'paofr','pao de sal':'paofr','muçarela':'mussarela','mucarela':'mussarela','mozarela':'mussarela','queijo mussarela':'mussarela',
  'batata doce':'batatadoce','aipim':'mandioca','macaxeira':'mandioca','tomate pelado':'passata','molho de tomate':'passata','passata':'passata',
  'pasta de amendoim':'amendoim','grao de bico':'grao','flocao':'cuscuz','goma':'tapioca','queijo minas':'minas','iogurte natural':'iogurte','leite zero lactose':'leite',
  'whey protein':'whey','proteina de soja':'pts','soja texturizada':'pts','macarrao de arroz':'macarrao','ameixa':'ameixa','castanha do para':'castanha','queijo parmesao':'parmesao','queijo ralado':'parmesao','queijo coalho':'minas','queijo branco':'minas','achocolatado':'nescau','toddy':'nescau','leite':'leite','leite em po':'leitepo','leite po':'leitepo','ninho':'leitepo','requeijao cremoso':'requeijao','catupiry':'requeijao','ricota fresca':'ricota','farinha de mandioca':'farinha','farinha para farofa':'farinha','creme de leite':'creme','creme de leite sem lactose':'creme','mostarda amarela':'mostarda','mandioca':'mandioca'};
let MIDX=null;
function ingIndex(){
  if(MIDX&&MIDX.n===ING_IDS.length)return MIDX;
  const list=ING_IDS.map(id=>{const names=[ING[id].n.split(/[(,]/)[0],SN[id]||''].map(x=>singAll(norm(x))).filter(Boolean);return {id,names};});
  return MIDX={n:ING_IDS.length,list};
}
/* palavras que só descrevem o item ("banana prata", "leite desnatado"): o resto não pode virar outro alimento ("creme de leite", "leite condensado") */
const QUAL=new Set('congelado congelada fresco fresca desnatado integral semidesnatado sem lactose zero light natural grande pequeno pequena media medio madura maduro verde fatiado fatiada ralado ralada limpo limpa branco branca parboilizado carioca preto organico organica em de do da caixa lata nanica prata ouro inglesa italiano formosa papaya tradicional forma cru crua inteiro inteira picado picada sassami file peito kg g ml l un pacote unidade bandeja duzia cartela pe maco'.split(' '));
function matchIng(name){
  const q=singAll(norm(name));if(!q)return null;
  for(const a in ALIAS)if(q===singAll(norm(a)))return ING[ALIAS[a]]?ALIAS[a]:null;
  const words=q.split(' ');let best=null;
  for(const c of ingIndex().list)for(const nm of c.names){
    if(nm===q)return c.id;
    const nw=nm.split(/[ -]/);
    /* todas as palavras digitadas estão no nome e a primeira bate ("milho" não é o flocão de milho; "manteiga" não é couve-manteiga) */
    if(nw[0]===words[0]&&words.every(w=>nw.includes(w))&&(!best||nm.length<best.l))best={id:c.id,l:nm.length};
  }
  if(best)return best.id;
  /* começa por um nome ou apelido conhecido e o resto só descreve: "leite desnatado", "banana prata" */
  let hit=null;
  const tryN=(nm,id)=>{const nw=nm.split(' ');if(nw.length>words.length)return;if(nw.every((w,i)=>words[i]===w)&&words.slice(nw.length).every(w=>QUAL.has(w))&&(!hit||nm.length>hit.l))hit={id,l:nm.length};};
  for(const a in ALIAS)tryN(singAll(norm(a)),ALIAS[a]);
  for(const c of ingIndex().list)for(const nm of c.names)tryN(nm,c.id);
  return hit&&ING[hit.id]?hit.id:null;
}
/* peso de 1 unidade de legume e fruta solta, para "2 abobrinhas" */
const UNW={abobrinha:250,berinjela:300,abobora:1500,batata:150,batatadoce:200,cenoura:120,tomate:100,pepino:200,pimentao:150,mandioca:500,mamao:800,abacaxi:1500,alface:250,couve:200,brocolis:300};
const NUMW={um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5,seis:6,sete:7,oito:8,dez:10,doze:12,meia:.5,meio:.5};
const UNITW=[[/^(kg|kgs|quilos?|kilos?)$/,'kg'],[/^(g|gr|grs|gramas?)$/,'g'],[/^(l|lt|litros?)$/,'l'],[/^ml$/,'ml'],[/^(un|und|unid|unidades?)$/,'un'],
  [/^duzias?$/,'dz'],[/^cartelas?$/,'ct'],[/^(pct|pcts|pacotes?|caixas?|cx|latas?|bandejas?|potes?|macos?|garrafas?|pencas?|cachos?|barras?|pecas?|sacos?|vidros?|saquinhos?|caixinhas?|bisnagas?|pes?)$/,'pk']];
/* corredor provável do que não é ingrediente do app */
const KW=[['casa','detergente sabao amaciante desinfetante sanitaria esponja papel toalha higienico guardanapo lixo aluminio filme vassoura pano alcool multiuso lustra limpador'],
  ['hig','shampoo xampu condicionador sabonete dente dental escova desodorante absorvente fio algodao cotonete barbeador lamina hidratante protetor'],
  ['beb','cafe cha suco refrigerante agua cerveja vinho kombucha energetico'],
  ['hort','alface fruta verdura legume cebola alho salsinha cebolinha hortela manjericao melancia melao manga pera abacate gengibre'],
  ['lat','queijo requeijao manteiga creme nata coalhada iogurte leite'],['prot','carne salmao camarao lombo'],
  ['merc','biscoito bolacha granola cereal farinha acucar sal oleo vinagre tempero massa arroz feijao molho fermento adocante gelatina']];
const MAN_AISLES={casa:'Limpeza e casa',hig:'Higiene',beb:'Bebidas',out:'Outros itens'};
function guessAisle(name){const ws=singAll(norm(name)).split(' ');for(const [a,l] of KW){const ks=l.split(' ');if(ws.some(w=>ks.includes(w)))return a;}return 'out';}
function parseManual(text){
  const t=String(text||'').trim();let s0=norm(t.replace(/\b1\/2\b/,'½').replace(/(\d)\s*x\b/i,'$1'));
  /* quantidade no fim ("batata 2kg", "ovos 12") vai para o começo */
  const tail=s0.match(/^(.*\D)\s(\d+(?:[.,]\d+)?)\s?(kg|g|ml|l|un|duzias?|cartelas?)?$/);if(tail&&tail[1].trim())s0=`${tail[2]} ${tail[3]||''} ${tail[1]}`;
  let ws=s0.replace(/(^|\s)(\d+(?:[.,]\d+)?)(kg|g|ml|l|un)\b/,'$1$2 $3').split(' ').filter(Boolean);
  let n=null,u=null;
  if(ws.length&&/^\d+([.,]\d+)?$/.test(ws[0])){n=parseFloat(ws[0].replace(',','.'));ws.shift();}
  else if(ws.length&&ws[0]==='½'){n=.5;ws.shift();}
  else if(ws.length&&NUMW[ws[0]]!=null&&ws.length>1){n=NUMW[ws[0]];ws.shift();}
  if(ws.length>1){const f=UNITW.find(x=>x[0].test(ws[0]));if(f){u=f[1];ws.shift();}}
  if(ws[0]==='de'&&ws.length>1)ws.shift();
  const name=ws.join(' ');let id=matchIng(name);
  /* "6 pães" na padaria é pão francês, não 6 pacotes de forma */
  if(id==='pao'&&u==null&&n>=2&&/\bpa(es|ezinhos?)\b/.test(norm(t))&&!/forma/.test(norm(t)))id='paofr';
  if(!id)return {t,id:null,aisle:guessAisle(name)};
  const g=ING[id],pkd=!!g.pk&&!g.loose,unitW=UNW[id]||(g.hu?g.hu[2]:g.wp||g.gw||150);
  let q;
  if(u==='kg'||u==='g'||u==='l'||u==='ml'){const gr=n==null?1:n*(u==='kg'||u==='l'?1000:1);q=g.u==='g'||g.u==='g cozido'||g.u==='ml'?gr:gr/(g.wp||g.gw||1);}
  else if(u==='dz')q=(n||1)*12;
  else if(u==='ct')q=(n||1)*30;
  else if(u==='pk')q=(n||1)*g.pack;
  else if(g.u==='un'||g.u==='lata')q=n!=null?n:(pkd?g.pack:1);
  else if(pkd)q=(n||1)*g.pack;
  else q=n!=null?n*unitW*(g.f||1):500*(g.f||1);
  return {t,id,q:Math.max(0,q)};
}
