/* ===== ESTADO E CÁLCULOS ===== */
const KEY='cardapio-lucas-pri-v1';
const DEF={checks:{},extras:{},shop:{},stock:{atum:4,sardinha:2},pantry:{},prep:{},steps:{},
  targets:{L:{p:160,k:2800},P:{p:125,k:1750}},ref:{iog:3.6,whey:24},maxKg:14,have:{},swap:{},icon:'verde',custom:{},unit:{},manual:{}};
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
function frac(n){const w=Math.floor(n+1e-9),r=n-w,F=[[.25,'¼'],[.5,'½'],[.75,'¾']].find(f=>Math.abs(f[0]-r)<.03);
  return r<.03?String(w):r>.97?String(w+1):F?(w?w+F[1]:F[1]):fmt(n,1);}
const R0=n=>Math.round(n);
/* Medida em gramas: cada aparelho escolhe, por ingrediente (S.unit[id]='g'). */
function canGrams(id){const g=ING[id];return !!(g.hu||g.gw);}
function inGrams(id){return S.unit[id]==='g'&&canGrams(id);}
function gramsOf(id,q){const g=ING[id];return g.hu?q:q*(g.gw||1);}
function gUnit(id){return ING[id].u==='ml'?'ml':'g';}
function fq(id,q){
  if(inGrams(id))return `${fmt(gramsOf(id,q),0)} ${gUnit(id)} de ${SN[id]}`;
  const n=frac(q),pl=q>1.01;
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
    case 'laranja': case 'kiwi': return `${n} ${SN[id]}${pl?'s':''}`;
    default:{const h=ING[id].hu;if(h){const m=q/h[2],u=ING[id].u==='ml'?'ml':'g',w=m>1.01?h[1]:h[0];
      /* "¾ tomate", não "¾ tomate de tomate" */
      const same=h[0].split(/[ -]/)[0]===SN[id].split(/[ -]/)[0];return `${frac(m)} ${w}${same?'':' de '+SN[id]} (${fmt(q,0)} ${u})`;}
      return `${fmt(q)} ${ING[id].u==='ml'?'ml':'g'} de ${SN[id]}`;}
  }
}

/* Ingredientes de uma refeição para uma pessoa, já com os ajustes feitos no editor (valem para todos os dias). */
const ING_IDS=Object.keys(ING);
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
function isCustom(mid){const c=S.custom[mid];if(!c)return false;
  return ['L','P'].some(w=>c[w]&&JSON.stringify(itemsOf(mid,w))!==JSON.stringify(MEALS[mid][w]));}
function pOf(id){
  if(id==='iogurte') return S.ref.iog/100;
  if(id==='whey') return S.ref.whey;
  return ING[id].p;
}
function nut(items){let p=0,k=0;for(const it of items){p+=pOf(it[0])*it[1];k+=ING[it[0]].k*it[1];}return{p,k};}
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
function loteMap(){const seq=[];for(const d of WEEK){const sl=slotsOf(d);for(const k of REF)if(sl[k])seq.push({d:d.d,k,mid:sl[k]});}
  const m={};for(let i=0;i+1<seq.length;i++){const a=seq[i],b=seq[i+1],ka=a.d+'|'+a.k;if(m[ka])continue;
    if(a.mid===b.mid&&MEALS[a.mid].lote){m[ka]={role:'cook',o:b};m[b.d+'|'+b.k]={role:'sobra',o:a};}}
  return {m,seq};}
function loteOf(d,k){return loteMap().m[d+'|'+k]||null;}
/* A sobra é comprada junto com o dia em que a panela é feita. */
function cookDate(d,k){const l=loteOf(d,k);return l&&l.role==='sobra'?l.o.d:d;}
/* Ceia = o que falta no dia. A quantidade da ceia de cada um é ajustada para completar a meta de proteína,
   depois de somar café, almoço, lanche e jantar planejados. Entre metade e o triplo da receita; se a meta já fechou, a ceia sai (f=0).
   Não ajusta se a ceia foi mexida à mão no editor, nem em dia parcial. */
function ceiaInfo(day,who){
  const sl=slotsOf(day),mid=sl.ceia;
  if(!mid||!sl.cafe||!sl.jantar||(S.custom[mid]&&S.custom[mid][who]))return {f:1,auto:false};
  let others=0;for(const s of SLOTS){if(s[0]==='ceia')continue;const m=sl[s[0]];if(m)others+=nut(itemsOf(m,who)).p;}
  /* extras registrados no dia (ex.: 1 dose de whey a mais) também contam */
  const ex=S.extras[`${day.d}|${who}`]||{};for(const e of EXTRAS){const c=ex[e.id]||0;if(c)others+=nut(e.it).p*c;}
  const base=nut(itemsOf(mid,who)).p||1,gap=S.targets[who].p-others;
  return {f:gap<=3?0:Math.min(3,Math.max(.5,gap/base)),auto:true,gap};
}
function scaleItems(its,f){if(f===1)return its;if(f===0)return [];return its.map(([id,q])=>{const st=ING[id].st||1;return [id,Math.max(st,Math.round(q*f/st)*st)];});}
/* Ingredientes de uma refeição num dia, para uma pessoa (com ajustes do editor e a ceia completando o dia). */
function dayItems(day,slot,who){const mid=slotsOf(day)[slot];if(!mid)return [];const its=itemsOf(mid,who);return slot==='ceia'?scaleItems(its,ceiaInfo(day,who).f):its;}
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

/* ===== COMPRAS: calculadas a partir do plano ===== */
const TRIPS=[
  {id:'T1',n:'Compra 1',when:'Dom 15',long:'Domingo 15',covers:'dom e seg, mais a despensa da semana',days:['2026-11-15','2026-11-16']},
  {id:'T2',n:'Compra 2',when:'Ter 17',long:'Terça 17',covers:'ter a qui, mais o frango e o arroz da quarta',days:['2026-11-17','2026-11-18','2026-11-19']},
  {id:'T3',n:'Compra 3',when:'Sex 20',long:'Sexta 20',covers:'sex a dom',days:['2026-11-20','2026-11-21','2026-11-22']}
];
/* O que é cozido em lote é comprado antes do dia de cozinhar: lote 1 no domingo (cobre seg e ter), lote 2 na quarta de manhã (cobre qua a dom). */
const BATCH1=['2026-11-15','2026-11-16','2026-11-17'],BATCH2=['2026-11-18','2026-11-19','2026-11-20','2026-11-21','2026-11-22'];
const ALL_DAYS=WEEK.map(d=>d.d);
function needs(days,onlyMeals){
  const out={};
  for(const day of WEEK){const sl=slotsOf(day);
    for(const s of SLOTS){const mid=sl[s[0]];if(!mid||!days.includes(cookDate(day.d,s[0])))continue;
      for(const who of ['L','P']){for(const it of dayItems(day,s[0],who)){
        const o=out[it[0]]||(out[it[0]]={tot:0,L:0,P:0,uses:[]});
        o.tot+=it[1];o[who]+=it[1];const sh=SHORT[mid];if(!o.uses.includes(sh))o.uses.push(sh);}}}}
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
  {id:'oregano',n:'Orégano'},{id:'alho',n:'Alho (1 cabeça, só para o azeite aromatizado)'}];
function shopping(){
  const left={};
  for(const id in S.stock){if(ING[id])left[id]=(S.stock[id]||0)*(ING[id].f||1);}
  return TRIPS.map(t=>{
    const nd=needs(t.days);const items=[];let w=0;
    for(const id of ['frango','arroz','feijao'])delete nd[id];
    const bn=needs(t.id==='T1'?BATCH1:t.id==='T2'?BATCH2:[]);
    for(const id of ['frango','arroz'])if(bn[id])nd[id]=bn[id];
    if(t.id==='T1'){const fa=needs(ALL_DAYS).feijao;if(fa)nd.feijao=fa;}
    for(const id in nd){const g=ING[id];if(g.pantry)continue;
      const need=nd[id].tot*(g.f||1);const have=S.have[id]?Infinity:(left[id]||0);let packs=0;
      if(have<need-1e-9)packs=Math.ceil((need-have)/g.pack-1e-9);
      left[id]=isFinite(have)?have+packs*g.pack-need:0;
      if(packs>0){const qty=packs*g.pack;const wt=qty*(g.wp||1);w+=wt;
        items.push({id,packs,qty,need:nd[id].tot,who:{L:nd[id].L>0,P:nd[id].P>0},uses:nd[id].uses,wt});}
      else if(nd[id].tot>0){/* coberto pelo estoque ou por sobra da compra anterior */}
    }
    items.sort((a,b)=>ING[a.id].n.localeCompare(ING[b.id].n,'pt-BR'));
    return Object.assign({},t,{items,kg:w/1000});
  });
}
