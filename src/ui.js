/* ===== INTERFACE ===== */
const $=(s,r)=>(r||document).querySelector(s);
const WD_FULL={Dom:'Domingo',Seg:'Segunda',Ter:'Terça',Qua:'Quarta',Qui:'Quinta',Sex:'Sexta','Sáb':'Sábado'};
const NAV=[
 ['hoje','Hoje','<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>'],
 ['semana','Semana','<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>'],
 ['compras','Compras','<path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6"/><circle cx="9" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/>'],
 ['receitas','Receitas','<path d="M4 11h16v2a7 7 0 0 1-7 7h-2a7 7 0 0 1-7-7v-2zM8 8c0-1.5 1-1.5 1-3M12 8c0-1.5 1-1.5 1-3M16 8c0-1.5 1-1.5 1-3"/>'],
 ['preparo','Preparo','<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>'],
 ['ajustes','Ajustes','<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>']
];
function pad(n){return String(n).padStart(2,'0');}
function todayStr(){const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;}
const TODAY=todayStr();
const V={swap:null,view:'hoje',day:ALL_DAYS.includes(TODAY)?TODAY:ALL_DAYS[0],trip:'T1',open:{},filter:'all',confirm:null,extraWho:'L'};
const CHECK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const CHEV='<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
const WHO={L:'Lucas',P:'Pri'};
const dayOf=d=>WEEK.find(x=>x.d===d);

function itemsText(items){return items.map(it=>fq(it[0],it[1])).join(', ');}

/* ----- HOJE ----- */
function scoreCard(day,who){
  const st=dayStats(day,who),t=S.targets[who];
  const pp=Math.min(100,st.projected.p/t.p*100),dp=Math.min(100,st.done.p/t.p*100);
  const kp=Math.min(100,st.projected.k/t.k*100),dk=Math.min(100,st.done.k/t.k*100);
  const left=t.p-st.done.p;
  const msg=left<=0?`<span class="st ok">Meta batida</span>`:`<span class="st">faltam ${R0(left)} g</span>`;
  return `<div class="sc ${who}"><div class="nm"><span class="dot ${who}"></span>${WHO[who]}</div>
   <div class="big">${R0(st.done.p)}<small> / ${t.p} g</small></div>
   <div class="bar" role="img" aria-label="Proteína ${R0(st.done.p)} de ${t.p} gramas"><i class="plan" style="width:${pp}%"></i><i class="done" style="width:${dp}%"></i></div>
   ${msg}
   <div class="bar thin" role="img" aria-label="Energia ${R0(st.done.k)} de ${t.k} kcal"><i class="plan" style="width:${kp}%"></i><i class="done" style="width:${dk}%"></i></div>
   <div class="st">${R0(st.done.k)} / ${t.k} kcal</div></div>`;
}
function advice(day){
  if(!day.slots.cafe||!day.slots.jantar)return '';
  const out=[];
  for(const w of ['L','P']){
    const st=dayStats(day,w),t=S.targets[w];const gap=t.p-st.projected.p;
    if(gap>5){const s=suggest(gap);out.push(`<b>${WHO[w]}:</b> o plano chega a ~${R0(st.projected.p)} g. Para fechar os ${t.p} g, adicione ${s}.`);}
  }
  if(!out.length)return `<div class="tip ok">O plano do dia fecha a meta dos dois. Se um dia escapar, sem drama: vale a média da semana.</div>`;
  return `<div class="tip">${out.join('<br>')}</div>`;
}
/* Ingredientes que já entram no plano base da semana: alternativa que usa só eles não pede compra nova. */
const BASE_ING=new Set();WEEK.forEach(d=>Object.values(d.slots).forEach(mid=>['L','P'].forEach(w=>MEALS[mid][w].forEach(it=>BASE_ING.add(it[0])))));
function sgn(n){n=R0(n);return n>0?`+${n}`:n<0?`−${-n}`:'='; }
function altsBlock(day,k,mid){
  const key=`${day.d}|${k}`,cur={L:nut(MEALS[mid].L).p,P:nut(MEALS[mid].P).p};
  const ids=Object.keys(MEALS).filter(id=>MEALS[id].slot===KIND[k]&&id!==mid);
  const rows=ids.map(id=>{const m=MEALS[id],l=nut(m.L).p,p=nut(m.P).p;
    const extra=[...new Set(m.L.concat(m.P).map(it=>it[0]))].filter(i=>!BASE_ING.has(i)).map(i=>SN[i]);
    return `<div class="alt"><div class="mini">${ill(id)}</div><div class="alt-tx"><b>${m.n}</b>
      <span class="sub">${m.t} min · <span class="L">Lucas ${R0(l)} g (${sgn(l-cur.L)})</span> · <span class="P">Pri ${R0(p)} g (${sgn(p-cur.P)})</span></span>
      <span class="sub">${extra.length?`Compra a mais: ${extra.join(', ')}`:'Só com o que já está na lista'}</span></div>
      <button class="btn small primary" data-act="swap" data-key="${key}" data-id="${id}">Usar</button></div>`;}).join('');
  return `<div class="alts"><div class="eyebrow">Trocar por</div>${rows}</div>`;
}
function slotCard(day,k,label){
  const base=day.slots[k],mid=slotsOf(day)[k],m=MEALS[mid],key=`${day.d}|${k}`,open=V.swap===key;
  const people=['L','P'].map(w=>{
    const key=`${day.d}|${k}|${w}`,n=nut(m[w]),on=!!S.checks[key];
    return `<label class="person ${w}${on?' done':''}"><input type="checkbox" data-act="chk" data-key="${key}"${on?' checked':''}><span class="box">${CHECK}</span>
      <span class="who">${WHO[w]}</span><span class="nums">${R0(n.p)} g · ${R0(n.k)} kcal</span><span class="desc">${itemsText(m[w])}</span></label>`;
  }).join('');
  const both=S.checks[`${day.d}|${k}|L`]&&S.checks[`${day.d}|${k}|P`];
  return `<article class="slot"><div class="ill">${ill(mid)}</div>
   <div><div class="slot-top"><span class="tag">${label}</span><span class="sub">${m.t} min${mid!==base?' · trocado':''}</span></div><h3>${m.n}</h3>
   <div class="slot-actions"><button class="link" data-act="recipe" data-id="${mid}">Ver receita</button>
   <button class="link" data-act="both" data-day="${day.d}" data-slot="${k}">${both?'Desmarcar os dois':'Os dois comeram'}</button>
   <button class="link" data-act="swapopen" data-key="${key}" aria-expanded="${open}">${open?'Fechar trocas':'Trocar'}</button>
   ${mid!==base?`<button class="link" data-act="swap" data-key="${key}" data-id="${base}">Voltar ao plano</button>`:''}</div></div>
   ${open?altsBlock(day,k,mid):''}<div class="people">${people}</div></article>`;
}
function extrasBlock(day){
  const w=V.extraWho,key=`${day.d}|${w}`,ex=S.extras[key]||{};
  const tabs=['L','P'].map(x=>`<button class="chip" data-act="exwho" data-who="${x}" aria-pressed="${x===w}"><span class="dot ${x}"></span>${WHO[x]}</button>`).join('');
  const pills=EXTRAS.map(e=>{const n=nut(e.it),c=ex[e.id]||0;
    return `<span class="pill"><span>${e.n} <b>+${R0(n.p)} g</b></span>${c?`<button class="pm" data-act="exdel" data-id="${e.id}" aria-label="Tirar um">−</button><span class="ct">${c}</span>`:''}<button class="pm add" data-act="exadd" data-id="${e.id}" aria-label="Adicionar ${e.n}">+</button></span>`;}).join('');
  return `<section class="card stack"><div><div class="eyebrow">Extras do dia</div><div class="sub">Comeu algo fora do plano ou quer fechar a proteína? Registre aqui e o placar atualiza.</div></div>
   <div class="row">${tabs}</div><div class="pills">${pills}</div></section>`;
}
function viewHoje(){
  const day=dayOf(V.day);
  const chips=WEEK.map(x=>`<button class="chip day-chip${x.d===TODAY?' today':''}" data-act="day" data-day="${x.d}" aria-pressed="${x.d===V.day}"><span>${x.wd}</span><b>${x.d.slice(8)}</b></button>`).join('');
  const partial=!day.slots.cafe?'Dia parcial: o café e o almoço já passaram.':(!day.slots.jantar?'Dia parcial: o jantar fica para a próxima semana.':'');
  const slots=SLOTS.filter(s=>day.slots[s[0]]).map(s=>slotCard(day,s[0],s[1])).join('');
  return `<div class="chips" role="group" aria-label="Escolha o dia">${chips}</div>
   <div class="score">${scoreCard(day,'L')}${scoreCard(day,'P')}</div>
   <div class="stack">${partial?`<div class="sub">${partial}</div>`:''}${advice(day)}${slots}${extrasBlock(day)}</div>`;
}

/* ----- SEMANA ----- */
function chartSvg(){
  const W=440,H=210,L=34,Rr=6,T=18,B=40,iw=W-L-Rr,ih=H-T-B,n=WEEK.length,slot=iw/n,bw=Math.min(18,slot/2-3);
  const y=v=>T+ih-(Math.min(v,130)/130)*ih;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Proteína planejada por dia, em porcentagem da meta de cada um">`;
  for(const v of [0,50,100]){s+=`<line class="${v===100?'goal':'grid'}" x1="${L}" x2="${W-Rr}" y1="${y(v)}" y2="${y(v)}"/><text x="${L-6}" y="${y(v)+4}" text-anchor="end">${v}%</text>`;}
  WEEK.forEach((d,i)=>{
    const cx=L+slot*i+slot/2;
    for(const e of [['L',-bw-1],['P',1]]){
      const w=e[0],dx=e[1];
      const pc=dayStats(d,w).plan.p/S.targets[w].p*100;const yy=y(pc);
      s+=`<rect class="b${w}" x="${cx+dx}" y="${yy}" width="${bw}" height="${Math.max(0,y(0)-yy)}" rx="3"/><text x="${cx+dx+bw/2}" y="${yy-4}" text-anchor="middle">${R0(pc)}</text>`;}
    s+=`<text x="${cx}" y="${H-22}" text-anchor="middle">${d.wd} ${d.d.slice(8)}</text>`;
    if(!d.slots.cafe||!d.slots.jantar)s+=`<text x="${cx}" y="${H-9}" text-anchor="middle">parcial</text>`;
  });
  return s+'</svg>';
}
function viewSemana(){
  const full=WEEK.filter(d=>d.slots.cafe&&d.slots.jantar);
  const avg=w=>full.reduce((a,d)=>a+dayStats(d,w).plan.p,0)/full.length;
  const cards=WEEK.map(d=>{
    const sl=slotsOf(d);
    const rows=SLOTS.filter(s=>sl[s[0]]).map(s=>{const mid=sl[s[0]];
      return `<li><span class="sl">${s[1].split(' ')[0]}</span><span class="mini">${ill(mid)}</span><span>${MEALS[mid].n}${mid!==d.slots[s[0]]?' <span class="sub">(trocado)</span>':''}</span></li>`;}).join('');
    const l=dayStats(d,'L').plan,p=dayStats(d,'P').plan;
    return `<button class="dayc" data-act="day-go" data-day="${d.d}"><div class="top"><h3>${WD_FULL[d.wd]} ${d.d.slice(8)}</h3>${d.d===TODAY?'<span class="tag">hoje</span>':''}</div>
      <div class="tots"><span class="tot L">Lucas ${R0(l.p)} g · ${R0(l.k)} kcal</span><span class="tot P">Pri ${R0(p.p)} g · ${R0(p.k)} kcal</span></div><ul>${rows}</ul></button>`;}).join('');
  const counts={};WEEK.forEach(d=>Object.values(slotsOf(d)).forEach(m=>{if(MEALS[m].slot==='ref')counts[m]=(counts[m]||0)+1;}));
  const nAlt=k=>Object.keys(MEALS).filter(id=>MEALS[id].slot===k).length;
  const rod=Object.keys(counts).sort().map(m=>`${SHORT[m]} ${counts[m]}×`).join(' · ');
  return `<div class="stack"><section class="card stack"><div><div class="eyebrow">Plano da semana, domingo 15 a domingo 22</div>
   <div class="sub">Média dos dias completos: Lucas ${R0(avg('L'))} g de proteína (meta ${S.targets.L.p}), Pri ${R0(avg('P'))} g (meta ${S.targets.P.p}). O plano já inclui uma folga para os dias em que algo escapar. As barras mostram a proteína planejada em % da meta de cada um.</div></div>
   <div class="chart">${chartSvg()}</div><div class="who-legend"><span><span class="dot L"></span>Lucas</span><span><span class="dot P"></span>Pri</span></div>
   <div class="sub">Almoço e jantar desta semana: ${rod}. Não deu vontade ou faltou um ingrediente? Na aba Hoje, toque em Trocar em qualquer refeição: são ${nAlt('cafe')} cafés, ${nAlt('ref')} pratos, ${nAlt('lanche')} lanches e ${nAlt('ceia')} ceias, todos com o que costuma estar na lista. Compras e preparo se recalculam sozinhos.</div></section>
   <div class="week">${cards}</div></div>`;
}

/* ----- COMPRAS ----- */
function viewCompras(){
  const trips=shopping();const t=trips.find(x=>x.id===V.trip);
  const tabs=trips.map(x=>{const done=x.items.filter(i=>S.shop[`${x.id}|${i.id}`]).length;
    return `<button class="trip" data-act="trip" data-id="${x.id}" aria-pressed="${x.id===V.trip}"><b>${x.n}</b><span class="sub">${x.long}</span><span class="sub">${done}/${x.items.length} itens · ${fmt(x.kg,1)} kg</span></button>`;}).join('');
  const max=S.maxKg,scale=Math.max(max*1.4,t.kg*1.05),over=t.kg>max;
  const groups={};t.items.forEach(i=>{(groups[ING[i.id].aisle]=groups[ING[i.id].aisle]||[]).push(i);});
  const order=['hort','prot','lat','merc'];
  const aisles=order.filter(a=>groups[a]).map(a=>{
    const its=groups[a];const done=its.filter(i=>S.shop[`${t.id}|${i.id}`]).length;
    const rows=its.map(i=>{const key=`${t.id}|${i.id}`,on=!!S.shop[key],g=ING[i.id];
      return `<label class="item${on?' done':''}"><input type="checkbox" data-act="shop" data-key="${key}"${on?' checked':''}><span class="box">${CHECK}</span>
       <span class="nm">${g.n}</span><span class="qt">${buyText(i)}</span>
       <span class="meta">${i.who.L?'<span class="mini-tag L">L</span>':''}${i.who.P?'<span class="mini-tag P">P</span>':''}<span>precisa de ${needText(i.id,i.need)} · ${i.uses.join(', ')}</span></span></label>`;}).join('');
    return `<section class="aisle"><h3>${AISLES[a]}<span class="sub">${done}/${its.length}</span></h3><div class="list">${rows}</div></section>`;}).join('');
  let pantry='';
  if(t.id==='T1'){
    const pn=needs(ALL_DAYS);
    const comp=Object.keys(pn).filter(id=>ING[id].pantry).map(id=>{const g=ING[id];
      const txt=id==='whey'?`${fmt(pn[id].tot,0)} doses na semana (~${fmt(pn[id].tot*30/1000,2)} kg de pó)`:`~${fmt(pn[id].tot*g.mlPerUnit,0)} ml na semana`;
      return {id,n:g.n,t:txt};});
    const all=comp.concat(PANTRY_STATIC.map(p=>({id:p.id,n:p.n,t:''})));
    const rows=all.map(p=>{const on=!!S.pantry[p.id];
      return `<label class="item${on?' done':''}"><input type="checkbox" data-act="pantry" data-key="${p.id}"${on?' checked':''}><span class="box">${CHECK}</span><span class="nm">${p.n}</span><span class="qt">${on?'tenho':'conferir'}</span>${p.t?`<span class="meta"><span>${p.t}</span></span>`:''}</label>`;}).join('');
    pantry=`<section class="aisle"><h3>${AISLES.desp}<span class="sub">marque o que já tem</span></h3><div class="list">${rows}</div></section>`;
  }
  const HAVE=['arroz','feijao','aveia','pao','macarrao','amendoim','passata'];
  const havePills=HAVE.map(id=>`<button class="chip" data-act="have" data-id="${id}" aria-pressed="${!!S.have[id]}">${S.have[id]?'Tenho: ':'Já tenho '}${ING[id].n.split(' (')[0].toLowerCase()}</button>`).join('');
  const stock=t.id==='T1'?`<section class="card stack"><div><div class="eyebrow">Estoque em casa</div><div class="sub">O que já tem entra na conta e some da lista de compras. Atum e sardinha em unidades, o resto é só marcar.</div></div><div class="pills">${havePills}</div><div class="stock">
    ${['atum','sardinha'].map(id=>`<div class="stepper"><button data-act="stock" data-id="${id}" data-d="-1" aria-label="Menos ${ING[id].n}">−</button><span>${S.stock[id]||0}</span><button data-act="stock" data-id="${id}" data-d="1" aria-label="Mais ${ING[id].n}">+</button><span class="sub">${ING[id].n}</span></div>`).join('')}</div></section>`:'';
  const conf=V.confirm==='shop:'+t.id;
  return `<div class="stack"><div class="trips">${tabs}</div>
   <section class="card"><div class="eyebrow">${t.n} · ${t.long}</div><div class="sub">Cobre ${t.covers}. Peso estimado na mochila: <b>${fmt(t.kg,1)} kg</b> (limite ${max} kg).</div>
   <div class="meter${over?' over':''}" role="img" aria-label="${fmt(t.kg,1)} kg de ${max} kg"><i style="width:${Math.min(100,t.kg/scale*100)}%"></i><u style="left:${max/scale*100}%"></u></div>
   ${over?'<div class="tip" style="margin-top:8px">Passou do limite da mochila. Se puder, marque em Estoque o que já tem em casa, ou aumente o limite em Ajustes.</div>':''}</section>
   ${stock}${aisles}${pantry}
   <div><button class="btn${conf?' warn':''}" data-act="resetshop" data-id="${t.id}">${conf?'Toque de novo para zerar':'Zerar marcações desta compra'}</button></div></div>`;
}

/* ----- RECEITAS ----- */
function whereUsed(id){const out=[];WEEK.forEach(d=>{const sl=slotsOf(d);SLOTS.forEach(s=>{if(sl[s[0]]===id)out.push(`${d.wd} ${d.d.slice(8)} (${s[1].split(' ')[0].toLowerCase()})`);});});return out.length?out.join(', '):'nenhum dia. Use o botão Trocar na aba Hoje para colocar no plano.';}
function recCard(id){
  const m=MEALS[id]||BASES[id],open=!!V.open[id],r=RECIPES[id];
  const isMeal=!!MEALS[id];
  const head=`<button class="rec-h" data-act="exp" data-id="${id}" aria-expanded="${open}" id="rec-${id}"><div class="ill">${ill(id)}</div>
   <div><span class="tag">${isMeal?(m.slot==='cafe'?'Café':m.slot==='ref'?'Almoço ou jantar':m.slot==='lanche'?'Lanche':'Ceia'):'Preparo base'}</span><h3>${m.n}</h3>
   <div class="sub">${m.t} min${isMeal?` · Lucas ${R0(nut(m.L).p)} g · Pri ${R0(nut(m.P).p)} g de proteína`:''}</div></div>${CHEV}</button>`;
  let body='';
  if(open){
    const cols=isMeal?`<div class="cols">${['L','P'].map(w=>{const n=nut(m[w]);return `<div class="col ${w}"><h4>${WHO[w]}</h4><ul>${m[w].map(it=>`<li>${fq(it[0],it[1])}</li>`).join('')}</ul><div class="tt">${R0(n.p)} g de proteína · ${R0(n.k)} kcal</div></div>`;}).join('')}</div>`:`<div class="note" style="margin-top:14px">${m.desc}</div>`;
    const steps=`<ol class="steps">${r.steps.map((s,i)=>{const k=`${id}|${i}`;return `<li class="${S.steps[k]?'done':''}" data-act="step" data-key="${k}"><span>${s}</span></li>`;}).join('')}</ol>`;
    const tips=r.tips.length?`<div class="note">${r.tips.map(t=>`<div>${t}</div>`).join('')}</div>`:'';
    const wh=isMeal?`<div class="where">Na semana: ${whereUsed(id)}</div>`:'';
    body=`<div class="rec-b">${cols}${steps}${tips}${wh}<div><button class="link" data-act="clearsteps" data-id="${id}">Limpar passos marcados</button></div></div>`;
  }
  return `<article class="rec">${head}${body}</article>`;
}
function viewReceitas(){
  const F=[['all','Todas'],['cafe','Café'],['ref','Almoço e jantar'],['lc','Lanche e ceia'],['base','Base']];
  const chips=F.map(f=>`<button class="chip" data-act="filter" data-f="${f[0]}" aria-pressed="${V.filter===f[0]}">${f[1]}</button>`).join('');
  const ids=Object.keys(MEALS).concat(Object.keys(BASES)).filter(id=>{
    const sl=(MEALS[id]||BASES[id]).slot;
    return V.filter==='all'||(V.filter==='lc'?(sl==='lanche'||sl==='ceia'):sl===V.filter);});
  return `<div class="chips">${chips}</div><div class="stack">${ids.map(recCard).join('')}</div>`;
}

/* ----- PREPARO ----- */
function ceilTo(n,s){return Math.ceil(n/s-1e-9)*s;}
function eggOf(list){const f=list.find(i=>i[0]==='ovo');return f?f[1]:0;}
function boiledEggs(days){let n=0;days.forEach(dd=>{const d=dayOf(dd);if(!d)return;Object.values(slotsOf(d)).forEach(mid=>{
  const m=MEALS[mid];if(m.oc)n+=eggOf(m.L)+eggOf(m.P);});});return n;}
function prepPlan(){
  const w1=['2026-11-16','2026-11-17','2026-11-18'],w2=['2026-11-19','2026-11-20','2026-11-21','2026-11-22'];
  const mk=(key,label,when,days,first)=>{
    const nd=needs(days);const fr=ceilTo(((nd.frango||{}).tot||0)*1.1,50);
    const ar=nd.arroz?ceilTo(nd.arroz.tot*.34*1.1,10):0;
    const feijAll=needs(ALL_DAYS).feijao;const fj=feijAll?ceilTo(feijAll.tot*.35*1.05,10):0;
    const ov=boiledEggs(days);
    const tasks=[
      {id:`${key}-azeite`,n:'Azeite aromatizado',m:8,t:'100 ml de azeite com 2 dentes de alho amassados, fogo baixo por 5 min. Tire todo o alho. Geladeira, até 4 dias.'+(first?'':' Descarte o do domingo e faça este novo.')},
      {id:`${key}-frango`,n:`Frango assado: ${fr} g`,m:30,t:`Tempere com sal, páprica e limão. Forno a 200 °C por 22 a 25 min. Desfie metade e fatie o resto. Cobre ${first?'segunda a quarta':'quinta a domingo'}.`},
      {id:`${key}-ovos`,n:`Ovos cozidos: ${ov} un`,m:12,t:'Água fria, ferva e conte 10 min. Passe em água gelada. A conta inclui as trocas feitas na aba Hoje.'},
      {id:`${key}-arroz`,n:`Arroz: ${ar} g crus`,m:20,t:`Refogue no azeite, 2,5 partes de água, 12 min tampado. Rende ~${ar*3} g cozidos. Só o Lucas come arroz.`}];
    if(first)tasks.push({id:`${key}-feijao`,n:`Feijão: ${fj} g secos`,m:35,t:`Pressão por 25 min. Rende ~${Math.round(fj*2.85/10)*10} g cozidos. Congele em porções de 150 g, uma por omelete da semana.`});
    else tasks.push({id:`${key}-feijao`,n:'Feijão: tirar 1 porção do congelador',m:2,t:'Passe uma porção de 150 g para a geladeira na véspera do omelete.'});
    return{key,label,when,total:tasks.reduce((a,t)=>a+t.m,0),tasks};};
  return [mk('dom','Domingo 15','~1h15',w1,true),mk('qua','Quarta 18','~1h',w2,false)];
}
function viewPreparo(){
  const plans=prepPlan();
  return `<div class="stack"><div class="sub">Dois blocos de cozinha por semana. O resto do tempo é montar o prato. As quantidades saem do plano da semana.</div>
  ${plans.map(p=>{const done=p.tasks.filter(t=>S.prep[t.id]).length;
   return `<section class="stack"><div class="row" style="justify-content:space-between;flex-wrap:wrap"><h2 style="font-size:20px">${p.label}</h2><span class="sub">${done}/${p.tasks.length} feitos · panelas e forno ao mesmo tempo, ${p.when}</span></div>
   <div class="list">${p.tasks.map(t=>{const on=!!S.prep[t.id];
    return `<label class="task${on?' done':''}"><input type="checkbox" data-act="prep" data-key="${t.id}"${on?' checked':''}><span class="box">${CHECK}</span><span class="nm">${t.n}</span><span class="mn">${t.m} min</span><span class="tx">${t.t}</span></label>`;}).join('')}</div></section>`;}).join('')}
  <div><button class="link" data-act="recipe" data-id="B4">Ver receita do azeite aromatizado</button></div></div>`;
}

/* ----- AJUSTES ----- */
const ICONS=[['verde','Verde'],['preto','Preto'],['rosa','Rosa'],['claro','Claro']];
function applyIcon(){const l=document.getElementById('touch-icon');if(l&&ICONS.some(i=>i[0]===S.icon))l.href=`icons/${S.icon}-180.png`;}
function syncBlock(){
  const msg=V.syMsg?`<div class="tip">${V.syMsg}</div>`:'';
  if(SY.url){const conf=V.confirm==='syleave';
    return `<section class="card stack"><div class="stack" style="gap:6px"><div class="eyebrow">Sincronizar com o outro celular</div>
     <div class="sub">Ligada. Situação: <b id="sync-box"></b></div>
     <div class="sub">Em comum: trocas de refeição, as 3 listas de compras, estoque, despensa, preparo, metas e referências. Fica só aqui: o que cada um comeu, os extras e os passos de receita.</div></div>
     <div class="row wrap"><button class="btn primary" data-act="sycopy">${V.syCopied?'Código copiado':'Copiar código para o outro celular'}</button>
     <button class="btn${conf?' warn':''}" data-act="syleave">${conf?'Toque de novo para desligar':'Desligar neste celular'}</button></div>${msg}</section>`;}
  return `<section class="card stack"><div><div class="eyebrow">Sincronizar com o outro celular</div>
   <div class="sub">Deixa as trocas de refeição, as listas de compras, o estoque e o preparo iguais nos dois celulares, na hora. O que cada um comeu continua separado.</div></div>
   <div class="fld-col"><label for="sy-db">1º celular: cole o endereço do banco do Firebase</label><input id="sy-db" class="in-text" type="text" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://….firebaseio.com"><button class="btn primary" data-act="sycreate">Criar código da casa</button></div>
   <div class="fld-col"><label for="sy-code">2º celular: cole o código copiado no 1º</label><input id="sy-code" class="in-text" type="text" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="https://…/casas/…"><button class="btn" data-act="syjoin">Entrar</button></div>
   ${msg}</section>`;
}
function numFld(label,hint,path,val,step){return `<div class="fld"><label for="n-${path}">${label}${hint?`<small>${hint}</small>`:''}</label><input id="n-${path}" type="number" inputmode="decimal" step="${step||1}" min="0" value="${val}" data-act="num" data-path="${path}"></div>`;}
function viewAjustes(){
  const conf=V.confirm==='all';
  return `<div class="stack">
  <section class="card"><div class="eyebrow">Metas diárias</div>
   ${numFld('Lucas: proteína (g)','Janela de 155 a 165 g','t.L.p',S.targets.L.p)}${numFld('Lucas: energia (kcal)','Superávit leve','t.L.k',S.targets.L.k,50)}
   ${numFld('Pri: proteína (g)','~1,9 g por kg, com 66 kg','t.P.p',S.targets.P.p)}${numFld('Pri: energia (kcal)','Déficit leve','t.P.k',S.targets.P.k,50)}</section>
  <section class="card"><div class="eyebrow">Valores de referência</div>
   ${numFld('Proteína em 100 g do iogurte (g)','Pense Zero natural: ~3,6 g. Se comprar grego, ~5 a 6 g. Muda todos os totais.','r.iog',S.ref.iog,.1)}
   ${numFld('Proteína de 1 dose de whey (g)','A sua referência: 24 g','r.whey',S.ref.whey,.5)}
   ${numFld('Limite da mochila (kg)','Alerta nas compras','maxkg',S.maxKg,.5)}</section>
  <section class="card stack"><div><div class="eyebrow">Ícone da tela inicial</div>
   <div class="sub">Escolha antes de adicionar à Tela de Início: no Safari, Compartilhar e depois "Adicionar à Tela de Início". Já está na tela? Apague o ícone e adicione de novo para trocar.</div></div>
   <div class="icons" role="radiogroup" aria-label="Ícone">${ICONS.map(i=>`<button class="icon-opt" role="radio" aria-checked="${S.icon===i[0]}" data-act="icon" data-id="${i[0]}"><img src="icons/${i[0]}-180.png" alt="" width="60" height="60"><span>${i[1]}</span></button>`).join('')}</div></section>
  <section class="card stack"><div class="eyebrow">Como as contas são feitas</div>
   <div class="note">Os totais são estimativas com valores médios de tabela (TACO e rótulos). A balança, na média da semana, é o ajuste real.</div>
   <div class="note"><b>Feijão:</b> a referência de 12 a 15 g por concha parece alta. Feijão cozido tem cerca de 5 g de proteína por 100 g, então uma concha (~140 g) rende ~7 g. Usei 5 g por 100 g. Se pesar e achar outro valor, é só avisar.</div></section>
  <section class="card stack"><div class="eyebrow">Pri: o que pode e o que evitar (FODMAP)</div>
   <div class="scroll-x"><table class="t"><thead><tr><th>Pode</th><th>Evitar</th></tr></thead><tbody>
    <tr><td class="ok-t">Frango, ovo, peixe, atum, sardinha</td><td class="no-t">Feijão, lentilha, grão-de-bico, soja</td></tr>
    <tr><td class="ok-t">Leite e iogurte sem lactose, mussarela, parmesão</td><td class="no-t">Leite comum, cottage, ricota, requeijão</td></tr>
    <tr><td class="ok-t">Batata, arroz, aveia (até 40 g), macarrão de arroz, pão de trigo até 1 fatia (½ pão francês) por vez</td><td class="no-t">Pão e macarrão de trigo em quantidade</td></tr>
    <tr><td class="ok-t">Cenoura, abobrinha, tomate, pepino, espinafre</td><td class="no-t">Cebola, alho, cogumelo, couve-flor, beterraba</td></tr>
    <tr><td class="ok-t">Morango, uva, mamão, banana firme, laranja</td><td class="no-t">Manga, maçã, pera, abacate, banana muito madura</td></tr></tbody></table></div>
   <div class="sub">Tolerância varia de pessoa para pessoa e por porção. Se a Pri acompanha com nutricionista, vale alinhar esta lista com ela.</div></section>
  ${syncBlock()}
  <section class="card stack"><div class="eyebrow">Dados</div><div class="sub">Tudo fica salvo neste aparelho e funciona sem internet. Com a sincronização ligada, trocas, compras, estoque, preparo e metas também vão para o outro celular. O que cada um comeu fica só no aparelho de cada um.</div>${SY.url?'<div class="sub"><b>Atenção:</b> com a sincronização ligada, zerar tudo também zera as compras, trocas e o preparo no outro celular.</div>':''}
   <div><button class="btn${conf?' warn':''}" data-act="resetall">${conf?'Toque de novo para zerar tudo':'Zerar todas as marcações'}</button></div></section></div>`;
}

/* ----- ROTEAMENTO E EVENTOS ----- */
const VIEWS={hoje:viewHoje,semana:viewSemana,compras:viewCompras,receitas:viewReceitas,preparo:viewPreparo,ajustes:viewAjustes};
function navHtml(){return `<div class="nav-in">${NAV.map(n=>`<button data-act="nav" data-v="${n[0]}"${V.view===n[0]?' aria-current="page"':''}><svg viewBox="0 0 24 24" aria-hidden="true">${n[2]}</svg><span>${n[1]}</span></button>`).join('')}</div>`;}
function render(keep){
  const y=window.scrollY;
  $('#main').innerHTML=VIEWS[V.view]();
  $('#nav').innerHTML=navHtml();
  if(keep)window.scrollTo(0,y);
  if(typeof syStatus==='function')syStatus();
}
function go(v){if(!VIEWS[v])v='hoje';V.view=v;V.confirm=null;render(false);window.scrollTo(0,0);}
function setHash(v){try{if(location.hash.slice(1)===v){go(v);}else{location.hash=v;}}catch(e){go(v);}}
let cT=null;
function arm(k){V.confirm=k;clearTimeout(cT);cT=setTimeout(()=>{V.confirm=null;render(true);},4000);}
document.addEventListener('click',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;
  const a=t.dataset.act;
  if(['chk','shop','pantry','prep','num'].indexOf(a)>=0)return;
  switch(a){
    case 'nav':setHash(t.dataset.v);return;
    case 'day':V.day=t.dataset.day;render(true);return;
    case 'day-go':V.day=t.dataset.day;setHash('hoje');return;
    case 'both':{const k=t.dataset;const a1=`${k.day}|${k.slot}|L`,a2=`${k.day}|${k.slot}|P`;const on=!(S.checks[a1]&&S.checks[a2]);S.checks[a1]=on;S.checks[a2]=on;save();render(true);return;}
    case 'recipe':V.open[t.dataset.id]=true;V.filter='all';setHash('receitas');setTimeout(()=>{const el=document.getElementById('rec-'+t.dataset.id);if(el)el.scrollIntoView({block:'start'});},60);return;
    case 'exwho':V.extraWho=t.dataset.who;render(true);return;
    case 'exadd':case 'exdel':{const key=`${V.day}|${V.extraWho}`;const ex=S.extras[key]=S.extras[key]||{};const id=t.dataset.id;ex[id]=Math.max(0,(ex[id]||0)+(a==='exadd'?1:-1));save();render(true);return;}
    case 'have':S.have[t.dataset.id]=!S.have[t.dataset.id];save();render(true);return;
    case 'trip':V.trip=t.dataset.id;V.confirm=null;render(true);return;
    case 'stock':{const id=t.dataset.id;S.stock[id]=Math.max(0,(S.stock[id]||0)+Number(t.dataset.d));save();render(true);return;}
    case 'resetshop':{const k='shop:'+t.dataset.id;if(V.confirm===k){Object.keys(S.shop).forEach(x=>{if(x.indexOf(t.dataset.id+'|')===0)delete S.shop[x];});V.confirm=null;save();}else arm(k);render(true);return;}
    case 'resetall':{if(V.confirm==='all'){S.checks={};S.extras={};S.shop={};S.pantry={};S.prep={};S.steps={};S.have={};S.swap={};V.confirm=null;save();}else arm('all');render(true);return;}
    case 'exp':V.open[t.dataset.id]=!V.open[t.dataset.id];render(true);return;
    case 'step':S.steps[t.dataset.key]=!S.steps[t.dataset.key];save();render(true);return;
    case 'clearsteps':Object.keys(S.steps).forEach(x=>{if(x.indexOf(t.dataset.id+'|')===0)delete S.steps[x];});save();render(true);return;
    case 'filter':V.filter=t.dataset.f;render(true);return;
    case 'sycreate':case 'syjoin':{const v=(document.getElementById(a==='sycreate'?'sy-db':'sy-code')||{}).value;V.syMsg=a==='sycreate'?syCreate(v):syJoin(v);render(true);syStatus();return;}
    case 'sycopy':{const done=()=>{V.syCopied=true;render(true);syStatus();setTimeout(()=>{V.syCopied=false;render(true);syStatus();},2500);};
      try{navigator.clipboard.writeText(SY.url).then(done,()=>{V.syMsg='Não deu para copiar. Código: '+SY.url;render(true);syStatus();});}catch(e){V.syMsg='Código: '+SY.url;render(true);syStatus();}return;}
    case 'syleave':if(V.confirm==='syleave'){syLeave();V.confirm=null;V.syMsg='';}else arm('syleave');render(true);syStatus();return;
    case 'icon':S.icon=t.dataset.id;applyIcon();save();render(true);return;
    case 'swapopen':V.swap=V.swap===t.dataset.key?null:t.dataset.key;render(true);return;
    case 'swap':{const k=t.dataset.key,id=t.dataset.id,d=dayOf(k.split('|')[0]);
      if(id===d.slots[k.split('|')[1]])delete S.swap[k];else S.swap[k]=id;
      delete S.checks[k+'|L'];delete S.checks[k+'|P'];V.swap=null;save();render(true);return;}
  }
});
document.addEventListener('change',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
  if(a==='chk'){S.checks[t.dataset.key]=t.checked;save();render(true);}
  else if(a==='shop'){S.shop[t.dataset.key]=t.checked;save();render(true);}
  else if(a==='pantry'){S.pantry[t.dataset.key]=t.checked;save();render(true);}
  else if(a==='prep'){S.prep[t.dataset.key]=t.checked;save();render(true);}
  else if(a==='num'){const v=Number(t.value);if(!isFinite(v)||v<0)return;const p=t.dataset.path.split('.');
    if(p[0]==='t')S.targets[p[1]][p[2]]=v;else if(p[0]==='r')S.ref[p[1]]=v;else if(p[0]==='maxkg')S.maxKg=v;save();render(true);}
});
window.addEventListener('hashchange',()=>go(location.hash.slice(1)));
(function init(){
  document.getElementById('app').innerHTML=`<div class="wrap"><header class="hdr"><div><h1>Cardápio Lucas e Pri</h1><p>Semana de domingo 15 a domingo 22 de novembro</p><p id="sync-st" class="sync-st" hidden></p></div>
   <div class="who-legend"><span><span class="dot L"></span>Lucas</span><span><span class="dot P"></span>Pri</span></div></header><main id="main"></main></div><nav class="nav" id="nav" aria-label="Seções"></nav>`;
  const h=(location.hash||'').slice(1);V.view=VIEWS[h]?h:'hoje';applyIcon();render(false);
})();
