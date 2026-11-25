/* ===== ESTADO E CÁLCULOS ===== */
const KEY='cardapio-lucas-pri-v1';
const DEF={checks:{},extras:{},shop:{},stock:{atum:4,sardinha:2},pantry:{},prep:{},steps:{},
  targets:{L:{p:160,k:2800},P:{p:125,k:1750}},ref:{iog:3.6,whey:24},maxKg:14,have:{},swap:{},icon:'verde',custom:{},unit:{},manual:{},mine:{},ing:{},me:'',dayc:{},casa:{},eaten:{},hz:3};
function clone(o){return JSON.parse(JSON.stringify(o));}
function loadState(){
  const s=clone(DEF);
  try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);
    for(const k of Object.keys(DEF)){if(o[k]!==undefined){
      if(DEF[k]&&typeof DEF[k]==='object'&&!Array.isArray(DEF[k])){
        if(k==='targets'){for(const w of ['L','P'])s.targets[w]=Object.assign({},DEF.targets[w],(o.targets||{})[w]);}
        else s[k]=Object.assign({},DEF[k],o[k]);
      } else s[k]=o[k];}}}}catch(e){}
  return s;
}
let S=loadState();
/* Ingredientes e refeições criados por vocês (S.ing, S.mine) entram em ING e MEALS como os do app e sincronizam.
   Chamado ao abrir e sempre que chega mudança de outro aparelho. */
const BASE_ING=new Set(Object.keys(ING)),BASE_MEALS=new Set(Object.keys(MEALS)),SLOT_OK={cafe:1,ref:1,lanche:1,ceia:1};
let ING_IDS=Object.keys(ING);
function applyUser(){
  for(const id in ING)if(!BASE_ING.has(id))delete ING[id];
  for(const id in MEALS)if(!BASE_MEALS.has(id))delete MEALS[id];
  for(const id in S.ing){const u=S.ing[id];if(!u||!u.n)continue;const un=u.u==='un';
    ING[id]={n:u.n,u:un?'un':'g',p:+u.p||0,k:+u.k||0,pack:1,loose:true,wp:un?(+u.wp||100):1,aisle:u.aisle||'merc',cat:u.cat||'outro',st:un?.5:10,por:un?1:100,user:1};
    SN[id]=u.n.toLowerCase();}
  for(const id in S.mine){const m=S.mine[id];if(!m||!m.n||!SLOT_OK[m.slot])continue;
    const its=w=>Object.keys(m[w]||{}).filter(i=>ING[i]&&m[w][i]>0).map(i=>[i,+m[w][i]]);
    MEALS[id]={slot:m.slot,n:m.n,t:+m.t||10,user:1,del:!!m.del,L:its('L'),P:its('P')};}
  ING_IDS=Object.keys(ING);
}
applyUser();
const shortOf=id=>SHORT[id]||(MEALS[id]||{n:''}).n;
let saveT=null;
let dirty=false;
/* Só grava se houve toque desde a última gravação: uma aba antiga aberta não pode sobrescrever o que outra salvou. */
function saveNow(){clearTimeout(saveT);if(!dirty)return;dirty=false;try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}if(typeof syPush==='function')syPush();}
function save(){dirty=true;clearTimeout(saveT);saveT=setTimeout(saveNow,150);}
/* Nada se perde ao fechar, trocar de app ou atualizar: grava o toque pendente na hora. */
window.addEventListener('pagehide',saveNow);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveNow();});

function fmt(n,d){return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:d==null?1:d});}
/* 0,75 -> ¾ ; 1,5 -> 1½ (medidas caseiras) */
const q4=n=>n>0?Math.max(.25,Math.round(n*4)/4):0;
function frac(n){n=q4(n);const w=Math.floor(n),r=n-w,F={0:'',.25:'¼',.5:'½',.75:'¾'}[r];return w?w+F:F||'0';}
const R0=n=>Math.round(n);
/* Medida em gramas: cada aparelho escolhe, por ingrediente (S.unit[id]='g'). */
function canGrams(id){const g=ING[id];return !!(g.hu||g.gw);}
function inGrams(id){return S.unit[id]==='g'&&canGrams(id);}
function gramsOf(id,q){const g=ING[id];return g.hu?q:q*(g.gw||1);}
function gUnit(id){return ING[id].u==='ml'?'ml':'g';}
function fq(id,q){
  if(inGrams(id))return `${fmt(gramsOf(id,q),0)} ${gUnit(id)} de ${SN[id]}`;
  const n=frac(q),pl=q4(q)>1;
  switch(id){
    case 'ovo': return `${n} ${pl?'ovos':'ovo'}`;
    case 'atum': case 'sardinha': return `${n} ${pl?'latas':'lata'} de ${SN[id]}`;
    case 'whey': return `${n} ${pl?'doses':'dose'} de whey`;
    case 'azeite': return `${n} col. sopa de azeite`;
    case 'banana': return `${n} ${pl?'bananas':'banana'}`;
    case 'limao': return `${n} ${pl?'limões':'limão'}`;
    case 'pao': return `${n} ${pl?'fatias':'fatia'} de pão`;
    case 'paofr': return `${n} ${pl?'pães franceses':'pão francês'}`;
    case 'ameixa': return `${n} ${pl?'ameixas':'ameixa'}`;
    case 'laranja': case 'kiwi': case 'maca': return `${n} ${SN[id]}${pl?'s':''}`;
    default:{const h=ING[id].hu;if(h){const m=q/h[2],u=ING[id].u==='ml'?'ml':'g',w=q4(m)>1?h[1]:h[0];
      /* "¾ tomate", não "¾ tomate de tomate" */
      const same=h[0].split(/[ -]/)[0]===SN[id].split(/[ -]/)[0];return `${frac(m)} ${w}${same?'':' de '+SN[id]} (${fmt(q,0)} ${u})`;}
      if(ING[id].u==='un')return `${n} un de ${SN[id]}`;
      return `${fmt(q)} ${ING[id].u==='ml'?'ml':'g'} de ${SN[id]}`;}
  }
}

/* Ingredientes de uma refeição para uma pessoa, já com os ajustes feitos no editor (valem para todos os dias). */
function itemsOf(mid,who){
  const c=S.custom[mid]&&S.custom[mid][who];if(!c)return MEALS[mid][who];
  const base=MEALS[mid][who].map(i=>i[0]),pos=id=>{const i=base.indexOf(id);return i<0?100+ING_IDS.indexOf(id):i;};
  return Object.keys(c).filter(id=>ING[id]&&c[id]>0).sort((a,b)=>pos(a)-pos(b)).map(id=>[id,c[id]]);
}
function customOf(mid,who){
  S.custom[mid]=S.custom[mid]||{};
  if(!S.custom[mid][who]){const o={};MEALS[mid][who].forEach(i=>{o[i[0]]=i[1];});S.custom[mid][who]=o;}
  return S.custom[mid][who];
}
function isCustomW(mid,w){const c=S.custom[mid];return !!(c&&c[w])&&JSON.stringify(itemsOf(mid,w))!==JSON.stringify(MEALS[mid][w]);}
function isCustom(mid){return ['L','P'].some(w=>isCustomW(mid,w));}
function pOf(id){
  if(id==='iogurte') return S.ref.iog/100;
  if(id==='whey') return S.ref.whey;
  return ING[id].p;
}
function nut(items){let p=0,k=0;for(const it of items){p+=pOf(it[0])*it[1];k+=ING[it[0]].k*it[1];}return{p,k};}
/* ===== PRONTO NO PRATO =====: agrupa os ingredientes de uma panela numa linha só (purê, crepe, molho), pelo peso pronto.
   its = [itens do Lucas, itens da Pri]. Um item trocado entra no grupo no lugar do que saiu (morango pela banana da vitamina). */
const gOf=(id,q)=>gramsOf(id,q);
function prGroups(mid,iL,iP){const P=PRONTO[mid];if(!P)return [];
  const now=[...new Set(iL.concat(iP).filter(i=>i[1]>0).map(i=>i[0]))],base=new Set(MEALS[mid].L.concat(MEALS[mid].P).map(i=>i[0])),out=[],used=new Set();
  P.forEach((g,ix)=>{const ids=[],sub={};
    g.i.forEach(id=>{if(now.includes(id)){if(!used.has(id)){ids.push(id);used.add(id);}return;}
      /* saiu: entra no lugar o substituto mais parecido (PAR) que não é da receita; se não há parecido, o da mesma categoria */
      if(!base.has(id))return;const free=now.filter(x=>!base.has(x)&&!used.has(x)&&!P.some(o=>o.i.includes(x)));
      const r=(PAR[id]||[]).find(x=>free.includes(x))||free.find(x=>ING[x].cat===ING[id].cat);
      if(r){ids.push(r);used.add(r);sub[r]=id;}});
    /* sem o ingrediente principal não há preparo (só azeite não é batata assada): os itens aparecem soltos */
    const main=ids.find(x=>x===g.i[0]||sub[x]===g.i[0]);
    if(!main||(main!==g.i[0]&&!g.rn)){ids.forEach(x=>used.delete(x));return;}
    const n=main!==g.i[0]?g.rn(SN[main]):g.sem&&!ids.includes(g.sem[0])?g.sem[1]:g.n;
    out.push({g,ix,ids,sub,n});});
  return out;}
function prWeight(gr,its){const y=gr.g.y||{};return gr.ids.reduce((a,id)=>{const it=its.find(i=>i[0]===id);return a+(it?gOf(id,it[1])*(y[(gr.sub||{})[id]||id]||1):0);},0);}
/* quantidade pronta na unidade da linha: unidades (crepe) ou gramas/ml arredondados de 5 em 5 */
function prUn(gr){return gr.g.un&&gr.ids.includes(gr.g.un[2])?gr.g.un:null;}
function prRaw(gr,its){const u=prUn(gr);if(u){const it=its.find(i=>i[0]===u[2]);return it?it[1]/u[3]:0;}return prWeight(gr,its);}
function prQty(gr,its){const v=prRaw(gr,its);return prUn(gr)?Math.round(v*4)/4:Math.round(v/5)*5;}
/* a mistura da panela. fix:1 (purê, crepe, farofa…) segue sempre a proporção da receita, senão desanda; o resto é o que está nos dois pratos somado. */
function prMix(mid,gr,iL,iP){const B=MEALS[mid].L.concat(MEALS[mid].P),sum=src=>{const t={};gr.ids.forEach(id=>{t[id]=src.filter(i=>i[0]===id).reduce((a,i)=>a+i[1],0);});return t;};
  const inBase=gr.ids.every(id=>B.some(i=>i[0]===id)),now=sum(iL.concat(iP));
  return inBase&&(gr.g.fix||!Object.values(now).some(v=>v>0))?sum(B):now;}
/* ingredientes (na unidade de cada um) para ter `want` pronto: {id: quantidade} */
function prFor(mid,gr,iL,iP,want){const tot=prMix(mid,gr,iL,iP),one=prRaw(gr,Object.keys(tot).map(id=>[id,tot[id]])),o={};if(!(one>0))return o;
  for(const id in tot)o[id]=tot[id]*want/one;return o;}
/* O que vai de verdade em cada prato: de uma panela só, cada um leva a parte dele da mistura (o copo maior da vitamina leva mais whey). */
function compose(mid,iL,iP){const out={L:iL.slice(),P:iP.slice()};
  for(const gr of prGroups(mid,iL,iP)){if(gr.ids.length<2)continue;
    for(const w of ['L','P']){const src=w==='L'?iL:iP,v=prRaw(gr,src);const m=v>0?prFor(mid,gr,iL,iP,v):{};
      const at=out[w].findIndex(i=>gr.ids.includes(i[0]));if(at<0)continue;
      const rest=out[w].filter(i=>!gr.ids.includes(i[0]));rest.splice(Math.min(at,rest.length),0,...gr.ids.filter(id=>m[id]>0).map(id=>[id,m[id]]));out[w]=rest;}}
  return out;}
function plateOf(mid,w){return compose(mid,itemsOf(mid,'L'),itemsOf(mid,'P'))[w];}
function prAmt(gr,q){const u=prUn(gr),h=gr.g.hu;if(u)return {big:frac(q),small:q>1?u[1]:u[0]};
  if(gr.g.ml)return {big:fmt(q,0),small:'ml'};
  return {big:fmt(q,0),small:'g pronto'+(h&&q?` · ${frac(Math.max(.5,Math.round(q/h[2]*2)/2))} ${q/h[2]>1.25?h[1]:h[0]}`:'')};}
function prTxt(gr,q){const a=prAmt(gr,q),h=gr.g.hu;if(prUn(gr))return `${a.big} ${a.small}`;
  return gr.g.ml?`${a.big} ml de ${gr.n.toLowerCase()}`:`${a.big} g de ${gr.n.toLowerCase()}${h?` (${a.small.split(' · ')[1]})`:''}`;}
/* frango cru -> ~¾ depois de pronto */
const FR_PRONTO=.75;
/* linhas para mostrar: {gr} (preparo) ou {id} (ingrediente solto), na ordem da receita */
function plateRows(mid,iL,iP){const gs=prGroups(mid,iL,iP),seen=new Set(),out=[];
  for(const id of [...new Set(iL.concat(iP).map(i=>i[0]))]){const gr=gs.find(x=>x.ids.includes(id));
    if(!gr)out.push({id});else if(!seen.has(gr.ix)){seen.add(gr.ix);out.push({gr});}}
  return out;}
/* quantidade de panela, redonda: "1 kg de batata", "220 ml de leite sem lactose", "6 ovos" */
function potQ(id,q){const g=ING[id],ml=g.u==='ml',w=g.u==='g'||g.u==='g cozido'||ml;
  if(w&&(q>=150||!g.hu)){const r=q>=100?Math.round(q/10)*10:Math.max(5,Math.round(q/5)*5);return `${r>=1000?fmt(r/1000,1)+(ml?' L':' kg'):r+(ml?' ml':' g')} de ${SN[id]}`;}
  if(w&&g.hu){const n=Math.max(.5,Math.round(q/g.hu[2]*2)/2);return fq(id,n*g.hu[2]);}
  return fq(id,id==='ovo'?Math.max(1,Math.round(q)):Math.max(.5,Math.round(q*2)/2));}

const EXTRAS=[
  {id:'whey',n:'1 dose de whey',it:[['whey',1]]},
  {id:'atum',n:'1 lata de atum',it:[['atum',1]]},
  {id:'iogurte',n:'1 copo de iogurte (200 g)',it:[['iogurte',200]]},
  {id:'ovo',n:'1 ovo cozido',it:[['ovo',1]]},
  {id:'leite',n:'1 copo de leite (200 ml)',it:[['leite',200]]},
  {id:'mussarela',n:'2 fatias de mussarela (30 g)',it:[['mussarela',30]]},
  {id:'amendoim',n:'1 colher de pasta de amendoim (15 g)',it:[['amendoim',15]]}
];
/* Refeições do dia com as trocas feitas na aba Hoje. Tudo que é calculado (placar, compras, preparo) passa por aqui. */
const KIND={cafe:'cafe',almoco:'ref',jantar:'ref',lanche:'lanche',ceia:'ceia'};
function slotsOf(day){
  const out={};
  for(const k in day.slots){const sw=S.swap[`${day.d}|${k}`];out[k]=sw&&MEALS[sw]&&MEALS[sw].slot===KIND[k]?sw:day.slots[k];}
  return out;
}
/* Panela em dobro: um prato de panela (lote:1) que aparece em dois almoços/jantares seguidos é feito uma vez só.
   A primeira é 'cook' (faz em dobro), a segunda é 'sobra' (só esquentar). Segue as trocas: trocar uma das duas desfaz o par. */
const REF=['almoco','jantar'];
function loteMap(){const seq=[];for(let i=-3;i<10;i++){const d=dayFor(addDays(WEEK[0].d,i)),sl=slotsOf(d);for(const k of REF)if(sl[k])seq.push({d:d.d,k,mid:sl[k]});}
  /* só é panela se a refeição teve mesmo o preparo principal (o jantar "só frango e cenoura" não deixa purê para amanhã) */
  const pot=x=>{const d=dayFor(x.d);return !!PRONTO[x.mid]&&prGroups(x.mid,dayRaw(d,x.k,'L'),dayRaw(d,x.k,'P')).some(g=>g.ix===0);};
  const m={};for(let i=0;i<seq.length;i++){const a=seq[i];if(!MEALS[a.mid].lote||!pot(a))continue;
    /* todas as repetições seguidas até 2 dias depois saem da mesma panela */
    const os=[];let j=i+1;while(j<seq.length&&seq[j].mid===a.mid&&seq[j].d<=addDays(a.d,2)&&pot(seq[j])){os.push(seq[j]);j++;}
    if(os.length){m[a.d+'|'+a.k]={role:'cook',o:os[0],os};os.forEach(b=>{m[b.d+'|'+b.k]={role:'sobra',o:a};});i=j-1;}}
  return {m,seq};}
function loteOf(d,k){return loteMap().m[d+'|'+k]||null;}
/* A sobra é comprada junto com o dia em que a panela é feita. */
function cookDate(d,k){const l=loteOf(d,k);return l&&l.role==='sobra'?l.o.d:d;}
/* Ceia = o que falta no dia. A quantidade da ceia de cada um é ajustada para completar a meta de proteína,
   depois de somar café, almoço, lanche e jantar planejados. Entre metade e o triplo da receita; se a meta já fechou, a ceia sai (f=0).
   Não ajusta se a ceia foi mexida à mão no editor, nem em dia parcial. */
function ceiaInfo(day,who){
  const sl=slotsOf(day),mid=sl.ceia;
  if(!mid||!sl.cafe||!sl.jantar||MEALS[mid].user||isCustomW(mid,who)||dayOver(day,'ceia',who))return {f:1,auto:false};
  /* já comida: fica a quantidade de quando foi marcada, extra registrado depois não muda */
  const ck=S.checks[`${day.d}|ceia|${who}`];if(typeof ck==='number')return {f:ck,auto:true,gap:0,eaten:true};
  let others=0;for(const s of SLOTS){if(s[0]==='ceia')continue;const m=sl[s[0]];if(m)others+=nut(dayItems(day,s[0],who)).p;}
  /* extras registrados no dia (ex.: 1 dose de whey a mais) também contam */
  const ex=S.extras[`${day.d}|${who}`]||{};for(const e of EXTRAS){const c=ex[e.id]||0;if(c)others+=nut(e.it).p*c;}
  const base=nut(itemsOf(mid,who)).p||1,gap=S.targets[who].p-others;
  return {f:gap<=3?0:Math.min(3,Math.max(.5,gap/base)),auto:true,gap};
}
function scaleItems(its,f,w){if(f===1)return its;if(f===0)return [];return its.map(([id,q])=>{const st=ING[id].st||1;let v=Math.max(st,Math.round(q*f/st)*st);
  if(w==='P'&&ING[id].pri>0&&v>ING[id].pri)v=Math.max(q,Math.floor(ING[id].pri/st)*st);return [id,v];});}
/* Ingredientes de uma refeição num dia, para uma pessoa (com ajustes do editor e a ceia completando o dia). */
/* Mudança só de um dia ("não tinha ovo, comi queijo"): S.dayc['data|refeição'] = {mid, L:{item:qtd}, P:{…}}. Vale se a refeição do dia ainda é a mesma. */
function dayOver(day,slot,who){const o=S.dayc[day.d+'|'+slot];if(!o||o.mid!==slotsOf(day)[slot]||!o[who])return null;
  const base=itemsOf(o.mid,who).map(i=>i[0]),pos=id=>{const i=base.indexOf(id);return i<0?100+ING_IDS.indexOf(id):i;};
  return Object.keys(o[who]).filter(id=>ING[id]&&o[who][id]>0).sort((a,b)=>pos(a)-pos(b)).map(id=>[id,o[who][id]]);}
/* dayRaw = como está salvo (o editor mexe nele); dayItems = o que vai no prato, com a panela repartida (proteína, compras e despensa) */
function dayRaw(day,slot,who){const mid=slotsOf(day)[slot];if(!mid)return [];const ov=dayOver(day,slot,who);if(ov)return ov;const its=itemsOf(mid,who);return slot==='ceia'?scaleItems(its,ceiaInfo(day,who).f,who):its;}
function dayItems(day,slot,who){const mid=slotsOf(day)[slot];if(!mid)return [];return PRONTO[mid]?compose(mid,dayRaw(day,slot,'L'),dayRaw(day,slot,'P'))[who]:dayRaw(day,slot,who);}
function dayStats(day,who){
  const plan={p:0,k:0},done={p:0,k:0};
  const sl=slotsOf(day);for(const s of SLOTS){const mid=sl[s[0]];if(!mid)continue;const n=nut(dayItems(day,s[0],who));plan.p+=n.p;plan.k+=n.k;
    if(S.checks[`${day.d}|${s[0]}|${who}`]){done.p+=n.p;done.k+=n.k;}}
  const ex=S.extras[`${day.d}|${who}`]||{};const xt={p:0,k:0};
  for(const e of EXTRAS){const c=ex[e.id]||0;if(c){const n=nut(e.it);xt.p+=n.p*c;xt.k+=n.k*c;}}
  return{plan,done:{p:done.p+xt.p,k:done.k+xt.k},projected:{p:plan.p+xt.p,k:plan.k+xt.k},extra:xt};
}
function suggest(gap){
  if(gap<=3)return '';
  const pw=nut([['whey',1]]).p,py=nut([['iogurte',200]]).p,po=nut([['ovo',1]]).p;
  const c={w:0,y:0,o:0};let g=gap;
  while(g>2&&c.w+c.y+c.o<6){if(g>=pw*.8){c.w++;g-=pw;}else if(g>=py*.8){c.y++;g-=py;}else{c.o++;g-=po;}}
  const out=[];
  if(c.w)out.push(`${c.w} ${c.w>1?'doses':'dose'} de whey`);
  if(c.y)out.push(`${c.y} ${c.y>1?'copos':'copo'} de iogurte`);
  if(c.o)out.push(`${c.o} ${c.o>1?'ovos cozidos':'ovo cozido'}`);
  return out.join(' + ');
}

/* ===== DIAS DO PLANO: lotes do preparo ===== */
const DD=WEEK.map(d=>d.d),dia=i=>+DD[i].slice(8);
/* O que é cozido em lote é comprado antes do dia de cozinhar: lote 1 no domingo (cobre dom a ter), lote 2 na quarta de manhã (cobre qua a sáb). */
const BATCH1=DD.slice(0,3),BATCH2=DD.slice(3);
const ALL_DAYS=WEEK.map(d=>d.d);
function needs(days,onlyMeals){
  const out={};
  for(const day of WEEK){const sl=slotsOf(day);
    for(const s of SLOTS){const mid=sl[s[0]];if(!mid||!days.includes(cookDate(day.d,s[0])))continue;
      for(const who of ['L','P']){for(const it of dayItems(day,s[0],who)){
        const o=out[it[0]]||(out[it[0]]={tot:0,L:0,P:0,uses:[]});
        o.tot+=it[1];o[who]+=it[1];const sh=shortOf(mid);if(!o.uses.includes(sh))o.uses.push(sh);}}}}
  return out;
}
function buyText(it){
  const g=ING[it.id];
  if(g.loose){if(g.u==='un')return `${it.qty} un`;return it.qty>=1000?`${fmt(it.qty/1000,2)} kg`:`${it.qty} g`;}
  const n=it.packs;return `${n} ${n===1?g.pk[0]:g.pk[1]}${g.size?' de '+g.size:''}`;
}
function needText(id,q){
  const u=ING[id].u;
  if(u==='un')return `${fmt(q)} un`;if(u==='fatia')return `${fmt(q)} ${q===1?'fatia':'fatias'}`;if(u==='lata')return `${fmt(q)} ${q===1?'lata':'latas'}`;
  if(u==='ml')return `${fmt(q,0)} ml`;if(u==='g cozido')return `${fmt(q,0)} g cozido`;return `${fmt(q,0)} g`;
}
const PANTRY_STATIC=[
  {id:'sal',n:'Sal'},{id:'pimenta',n:'Pimenta-do-reino'},{id:'paprica',n:'Páprica'},
  {id:'oregano',n:'Orégano'},{id:'alho',n:'Alho (1 cabeça, só para o azeite aromatizado)'},
  {id:'limao-t',n:'Limão (tempero)'},{id:'cheiro',n:'Cheiro-verde'},{id:'louro',n:'Louro'},{id:'canela',n:'Canela'},{id:'cafe',n:'Café'}];
/* ===== DESPENSA E LISTA DE COMPRAS (mercado sem dia certo) =====
   S.casa[id]: quanto tem em casa, na unidade da receita (lata, g, un, ml; arroz e feijão em peso cozido).
   Só é controlado o que já entrou em casa: comprado na lista, "Já tenho" ou ajustado em Em casa. O resto o app não sabe e não avisa.
   Marcar que comeu tira de casa o que estava no prato; desmarcar devolve (setCheck).
   S.shop[chave] = {id,q,d}: comprado agora (no carrinho). Já conta como em casa e passa para S.casa ao "Guardar" ou no dia seguinte.
   A lista = o que as refeições ainda não comidas de hoje até S.hz dias pedem, menos o que tem em casa. */
const addDays=(iso,n)=>{const d=new Date(iso+'T12:00:00');d.setDate(d.getDate()+n);return isoOf(d);};
/* qualquer data, também fora da semana atual: o cardápio-modelo do dia da semana + as trocas daquela data */
function dayFor(iso){const w=WEEK.find(x=>x.d===iso);if(w)return w;const p=PLANO[new Date(iso+'T12:00:00').getDay()];return {d:iso,wd:p.wd,slots:p.slots};}
function cartOf(id){let q=0;for(const k in S.shop){const c=S.shop[k];if(c&&typeof c==='object'&&c.id===id)q+=c.q||0;}return q;}
const known=id=>!!S.have[id]||id in S.casa||cartOf(id)>0;
/* S.eaten['data|refeição|pessoa'] = {item: quanto saiu de casa}: marcar não mexe em S.casa, então dois celulares marcando ao mesmo tempo não se atropelam
   e desmarcar devolve exatamente o que saiu, mesmo que a refeição tenha mudado depois. */
function eatenOf(id){let q=0;for(const k in S.eaten){const v=S.eaten[k]&&S.eaten[k][id];if(v>0)q+=v;}return q;}
const netCasa=id=>(S.casa[id]||0)-eatenOf(id);
function setHome(id,q){S.casa[id]=r3(Math.max(0,q)+eatenOf(id));}
function homeQ(id){return S.have[id]?Infinity:Math.max(0,netCasa(id)+cartOf(id));}
const r3=n=>Math.round(n*1000)/1000;
function eatMove(key,on){const [d,k,w]=key.split('|');if(!w)return;delete S.eaten[key];if(!on)return;
  const o={};for(const [id,q] of dayItems(dayFor(d),k,w)){if(S.have[id]||!(id in S.casa||cartOf(id)>0))continue;const t=r3(Math.min(q,homeQ(id)));if(t>0)o[id]=t;}
  if(Object.keys(o).length)S.eaten[key]=o;}
function setCheck(key,on){on=!!on;if(!!S.checks[key]===on)return;const [d,k,w]=key.split('|');let v=on;
  if(on&&k==='ceia'&&w){const c=ceiaInfo(dayFor(d),w);if(c.auto&&c.f>0)v=r3(c.f)||true;}
  S.checks[key]=v;eatMove(key,on);}
/* a refeição já marcada mudou: refaz o que saiu de casa */
function reEat(key){['L','P'].forEach(w=>{const k=key+'|'+w;if(S.checks[k])eatMove(k,true);});}
/* carrinho -> casa */
function stowCart(){let n=0;for(const k in S.shop){const c=S.shop[k];if(!c||typeof c!=='object')continue;n++;
    if(c.id&&ING[c.id]){const id=c.id;delete S.shop[k];setHome(id,Math.max(0,netCasa(id))+c.q);}
    if(k.indexOf('m-')===0&&S.manual.lista)delete S.manual.lista[k.slice(2)];}
  S.shop={};return n;}
const dayWord=d=>d===HOJE?'hoje':d===addDays(HOJE,1)?'amanhã':(dayFor(d).wd||'').toLowerCase();
const slotWord=k=>(SLOTS.find(s=>s[0]===k)||['',''])[1].split(' ')[0].toLowerCase();
/* refeições que ainda não foram comidas, em ordem, de hoje até n dias */
function upcoming(n){const out=[],lm=loteMap().m,last=addDays(HOJE,n-1);
  for(let i=0;i<n+2;i++){const day=dayFor(addDays(HOJE,i)),sl=slotsOf(day);
    for(const [k] of SLOTS){if(!sl[k])continue;const lo=lm[`${day.d}|${k}`],sob=lo&&lo.role==='sobra'?lo.o:null;
      if(i>=n&&!(sob&&sob.d<=last&&sob.d>=HOJE))continue;
      const cooked=sob&&(sob.d<HOJE||S.checks[`${sob.d}|${sob.k}|L`]||S.checks[`${sob.d}|${sob.k}|P`]);
      const pot=sob?new Set(prGroups(sl[k],dayRaw(day,k,'L'),dayRaw(day,k,'P')).flatMap(g=>g.ids)):null;
      for(const w of ['L','P']){if(S.checks[`${day.d}|${k}|${w}`])continue;let its=dayItems(day,k,w);
        if(pot&&cooked)its=its.filter(x=>!pot.has(x[0]));else if(i>=n)its=its.filter(x=>pot.has(x[0]));
        if(its.length)out.push({d:day.d,k,w,its});}}}
  return out;}
function needsAhead(n){const out={};
  for(const m of upcoming(n))for(const [id,q] of m.its){const o=out[id]||(out[id]={tot:0,uses:[]});o.tot+=q;
    const u=`${dayWord(m.d)} ${slotWord(m.k)}`;if(!o.uses.includes(u))o.uses.push(u);}
  return out;}
/* o que falta em casa em cada refeição (só itens controlados): casa vai sendo gasta na ordem das refeições */
function shortages(n){const left={},out={};
  for(const m of upcoming(n))for(const [id,q] of m.its){if(!known(id)||S.have[id])continue;
    if(!(id in left))left[id]=homeQ(id);left[id]-=q;
    if(left[id]<-1e-6){const key=`${m.d}|${m.k}`;(out[key]=out[key]||new Set()).add(id);}}
  return out;}
/* até quando dá o que tem em casa: a primeira refeição que fica sem */
function runsOut(id,n){let left=homeQ(id);if(!isFinite(left))return null;
  for(const m of upcoming(n)){const it=m.its.find(i=>i[0]===id);if(!it)continue;left-=it[1];if(left<-1e-6)return m;}return false;}
const packsFor=(id,q)=>{const g=ING[id];return Math.max(1,Math.ceil(q*(g.f||1)/g.pack-1e-9));};
function shopList(){
  const n=S.hz||3,nd=needsAhead(n),rows=[];let w=0;
  for(const id in nd){const g=ING[id];if(!g||g.pantry&&!known(id)||S.have[id])continue;
    const c=S.shop[id];if(c&&typeof c==='object'){rows.push({id,done:true,packs:c.p||1,qty:(c.p||1)*g.pack,need:nd[id].tot,uses:nd[id].uses,more:Math.max(0,nd[id].tot-homeQ(id))});w+=(c.p||1)*g.pack*(g.wp||1);continue;}
    const home=homeQ(id),miss=nd[id].tot-home;if(miss<=1e-6)continue;
    const packs=packsFor(id,miss),wt=packs*g.pack*(g.wp||1);w+=wt;
    rows.push({id,packs,qty:packs*g.pack,need:nd[id].tot,home:known(id)?home:null,uses:nd[id].uses,wt});}
  /* comprado fora do plano que ainda está no carrinho */
  for(const k in S.shop){const c=S.shop[k];if(c&&c.id&&k===c.id&&!rows.some(r=>r.id===k)&&ING[k])rows.push({id:k,done:true,packs:c.p||1,qty:(c.p||1)*ING[k].pack,need:0,uses:[]});}
  rows.sort((a,b)=>ING[a.id].n.localeCompare(ING[b.id].n,'pt-BR'));
  return {rows,kg:w/1000,n};
}
