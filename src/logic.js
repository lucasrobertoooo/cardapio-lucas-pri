/* ===== ESTADO E CÁLCULOS ===== */
const KEY='cardapio-lucas-pri-v1';
const DEF={checks:{},extras:{},shop:{},stock:{atum:4,sardinha:2},pantry:{},prep:{},steps:{},
  targets:{L:{p:160,k:2800},P:{p:125,k:1750}},ref:{iogurte100:6,whey:24},maxKg:14,have:{}};
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
function save(){clearTimeout(saveT);saveT=setTimeout(()=>{try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}},150);}

function fmt(n,d){return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:d==null?1:d});}
const R0=n=>Math.round(n);
function fq(id,q){
  switch(id){
    case 'ovo': return `${fmt(q)} ${q===1?'ovo':'ovos'}`;
    case 'atum': case 'sardinha': return q===.5?`½ lata de ${SN[id]}`:`${fmt(q)} ${q===1?'lata':'latas'} de ${SN[id]}`;
    case 'whey': return `${fmt(q)} dose de whey`;
    case 'azeite': return `${q===.25?'¼':q===.5?'½':fmt(q)} col. sopa de azeite`;
    case 'banana': return `${fmt(q)} banana${q>1?'s':''}`;
    case 'limao': return `${q===.5?'½':fmt(q)} limão`;
    default: return `${fmt(q)} ${ING[id].u==='ml'?'ml':'g'} de ${SN[id]}`;
  }
}
function pOf(id){
  if(id==='iogurte') return S.ref.iogurte100/100;
  if(id==='whey') return S.ref.whey;
  return ING[id].p;
}
function nut(items){let p=0,k=0;for(const it of items){p+=pOf(it[0])*it[1];k+=ING[it[0]].k*it[1];}return{p,k};}
const EXTRAS=[
  {id:'whey',n:'1 dose de whey',it:[['whey',1]]},
  {id:'atum',n:'1 lata de atum',it:[['atum',1]]},
  {id:'iogurte',n:'1 pote de iogurte (170 g)',it:[['iogurte',170]]},
  {id:'ovo',n:'1 ovo cozido',it:[['ovo',1]]},
  {id:'leite',n:'1 copo de leite (200 ml)',it:[['leite',200]]},
  {id:'mussarela',n:'2 fatias de mussarela (30 g)',it:[['mussarela',30]]},
  {id:'amendoim',n:'1 colher de pasta de amendoim (15 g)',it:[['amendoim',15]]}
];
function dayStats(day,who){
  const plan={p:0,k:0},done={p:0,k:0};
  for(const s of SLOTS){const mid=day.slots[s[0]];if(!mid)continue;const n=nut(MEALS[mid][who]);plan.p+=n.p;plan.k+=n.k;
    if(S.checks[`${day.d}|${s[0]}|${who}`]){done.p+=n.p;done.k+=n.k;}}
  const ex=S.extras[`${day.d}|${who}`]||{};const xt={p:0,k:0};
  for(const e of EXTRAS){const c=ex[e.id]||0;if(c){const n=nut(e.it);xt.p+=n.p*c;xt.k+=n.k*c;}}
  return{plan,done:{p:done.p+xt.p,k:done.k+xt.k},projected:{p:plan.p+xt.p,k:plan.k+xt.k},extra:xt};
}
function suggest(gap){
  if(gap<=3)return '';
  const pw=nut([['whey',1]]).p,py=nut([['iogurte',170]]).p,po=nut([['ovo',1]]).p;
  const c={w:0,y:0,o:0};let g=gap;
  while(g>2&&c.w+c.y+c.o<6){if(g>=pw*.8){c.w++;g-=pw;}else if(g>=py*.8){c.y++;g-=py;}else{c.o++;g-=po;}}
  const out=[];
  if(c.w)out.push(`${c.w} ${c.w>1?'doses':'dose'} de whey`);
  if(c.y)out.push(`${c.y} ${c.y>1?'potes':'pote'} de iogurte`);
  if(c.o)out.push(`${c.o} ${c.o>1?'ovos cozidos':'ovo cozido'}`);
  return out.join(' + ');
}

/* ===== COMPRAS: calculadas a partir do plano ===== */
const TRIPS=[
  {id:'T1',n:'Compra 1',when:'Dom 15',long:'Domingo 15',covers:'dom e seg, mais a despensa da semana',days:['2026-11-15','2026-11-16']},
  {id:'T2',n:'Compra 2',when:'Ter 17',long:'Terça 17',covers:'ter a qui, mais o frango e o arroz da quarta',days:['2026-11-17','2026-11-18','2026-11-19']},
  {id:'T3',n:'Compra 3',when:'Sex 20',long:'Sexta 20',covers:'sex a dom',days:['2026-11-20','2026-11-21','2026-11-22']}
];
/* O que é cozido em lote é comprado antes do dia de cozinhar: lote 1 no domingo (cobre seg a qua), lote 2 na quarta (cobre qui a dom). */
const BATCH1=['2026-11-15','2026-11-16','2026-11-17','2026-11-18'],BATCH2=['2026-11-19','2026-11-20','2026-11-21','2026-11-22'];
const ALL_DAYS=WEEK.map(d=>d.d);
function needs(days,onlyMeals){
  const out={};
  for(const dd of days){const day=WEEK.find(x=>x.d===dd);if(!day)continue;
    for(const s of SLOTS){const mid=day.slots[s[0]];if(!mid)continue;
      for(const who of ['L','P']){for(const it of MEALS[mid][who]){
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
  if(u==='un')return `${fmt(q)} un`;if(u==='lata')return `${fmt(q)} ${q===1?'lata':'latas'}`;
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
