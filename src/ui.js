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
const TODAY=HOJE;
const V={swap:null,edit:null,view:'hoje',day:ALL_DAYS.includes(TODAY)?TODAY:ALL_DAYS[0],trip:TRIPS[0].id,open:{},filter:'all',confirm:null,extraWho:'L'};
const CHECK='<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const CHEV='<svg class="chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>';
const WHO={L:'Lucas',P:'Pri'};
const dayOf=d=>WEEK.find(x=>x.d===d);
const MES=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
/* "domingo 22 a sábado 28 de novembro" (ou "… 29 de novembro a sábado 5 de dezembro") */
function semTxt(){const a=WEEK[0].d,b=WEEK[WEEK.length-1].d,m=x=>MES[+x.slice(5,7)-1];
  return `${+a.slice(8)}${m(a)===m(b)?'':' de '+m(a)} a ${+b.slice(8)} de ${m(b)}`;}

function itemsText(items){return items.map(it=>fq(it[0],it[1])).join(', ');}

/* ----- HOJE ----- */
function scoreCard(day,who){
  const st=dayStats(day,who),t=S.targets[who];
  const pp=Math.min(100,st.projected.p/t.p*100),dp=Math.min(100,st.done.p/t.p*100),ok=st.done.p>=t.p;
  return `<div class="sc ${who}"><div class="nm"><span class="dot ${who}"></span>${WHO[who]}${ok?'<span class="ok">meta batida</span>':''}</div>
   <div class="big">${R0(st.done.p)}<small>/${t.p} g</small></div>
   <div class="bar" role="img" aria-label="Proteína ${R0(st.done.p)} de ${t.p} gramas; o plano do dia chega a ${R0(st.projected.p)}"><i class="plan" style="width:${pp}%"></i><i class="done" style="width:${dp}%"></i></div>
   <div class="st">${R0(st.done.k)} de ${t.k} kcal</div></div>`;
}
function advice(day){
  if(!day.slots.cafe||!day.slots.jantar)return '';
  const out=[];
  for(const w of ['L','P']){
    const st=dayStats(day,w),t=S.targets[w];const gap=t.p-st.projected.p;
    if(gap>5){const s=suggest(gap);out.push(`<b>${WHO[w]}:</b> o plano chega a ~${R0(st.projected.p)} g. Para fechar os ${t.p} g, adicione ${s}.`);}
  }
  if(!out.length)return '';
  return `<div class="tip">${out.join('<br>')}</div>`;
}
/* Ingredientes que já entram no plano base da semana: alternativa que usa só eles não pede compra nova. */
function baseIng(){const s=new Set();WEEK.forEach(d=>Object.values(d.slots).forEach(mid=>['L','P'].forEach(w=>itemsOf(mid,w).forEach(it=>s.add(it[0])))));return s;}
function sgn(n){n=R0(n);return n>0?`+${n}`:n<0?`−${-n}`:'='; }
/* Preparo único: soma o que vai junto (uma massa, uma vitamina, uma panela) e mostra quanto fica com cada um. */
/* Panela em dobro: na primeira refeição soma as duas; na sobra só avisa que está pronto. */
function relWhen(d,o){return `${o.d===d?'hoje':o.d>d?'amanhã':'ontem'} no ${o.k==='almoco'?'almoço':'jantar'}`;}
function juntoBlock(mid,day,slot){
  const m=MEALS[mid];if(!m.junto)return '';
  const lo=day?loteOf(day.d,slot):null;
  if(lo&&lo.role==='sobra')return `<div class="junto sobra"><b>Já está pronto:</b> ${m.jn.toLowerCase()} feito ${relWhen(day.d,lo.o)}, em dobro. É só esquentar.</div>`;
  const q=(its,id)=>(its.find(i=>i[0]===id)||[0,0])[1];
  let iL=day?dayItems(day,slot,'L'):itemsOf(mid,'L'),iP=day?dayItems(day,slot,'P'):itemsOf(mid,'P');
  const ids=[...juntoIds(mid)].filter(id=>q(iL,id)+q(iP,id)>0);if(!ids.length)return '';
  const kL=ids.reduce((a,id)=>a+ING[id].k*q(iL,id),0),kP=ids.reduce((a,id)=>a+ING[id].k*q(iP,id),0);
  const sL=Math.round(kL/(kL+kP||1)*20)*5;
  let tot=id=>q(iL,id)+q(iP,id);
  if(lo){const od=dayOf(lo.o.d),oL=dayItems(od,lo.o.k,'L'),oP=dayItems(od,lo.o.k,'P');tot=id=>q(iL,id)+q(iP,id)+q(oL,id)+q(oP,id);
    return `<div class="junto"><b>${m.jn} em dobro, para os dois e para ${relWhen(day.d,lo.o)}:</b> ${ids.map(id=>fq(id,tot(id))).join(', ')}.
    <span class="sub">Guarde metade na geladeira. Em cada refeição: <span class="L">Lucas ~${sL}%</span>, <span class="P">Pri ~${100-sL}%</span>.</span></div>`;}
  return `<div class="junto"><b>${m.jn} para os dois, de uma vez:</b> ${ids.map(id=>fq(id,tot(id))).join(', ')}.
    <span class="sub">Divida: <span class="L">Lucas ~${sL}%</span>, <span class="P">Pri ~${100-sL}%</span>.</span></div>`;
}
/* O que vai no preparo único, contando o que entrou no lugar de um item dele (morango no lugar da banana da vitamina). */
function juntoIds(mid){const m=MEALS[mid],J=new Set(m.junto||[]);if(!m.junto)return J;
  const now=itemsOf(mid,'L').concat(itemsOf(mid,'P')),has=new Set(now.map(i=>i[0])),inBase=new Set(m.L.concat(m.P).map(i=>i[0]));
  const gone=new Set([...J].filter(id=>!has.has(id)).map(id=>ING[id].cat));
  now.forEach(([id])=>{if(!inBase.has(id)&&gone.has(ING[id].cat))J.add(id);});return J;}
function ceiaNote(day){
  const i={L:ceiaInfo(day,'L'),P:ceiaInfo(day,'P')};if(!i.L.auto&&!i.P.auto)return '';
  const t=w=>{const x=i[w];if(!x.auto)return `${WHO[w]}: como ajustada no editor`;return x.gap<=3?`${WHO[w]}: hoje não precisa, a meta já fechou`:`${WHO[w]}: faltam ~${R0(x.gap)} g`;};
  return `<div class="junto ceia-note"><b>Ceia completa o dia.</b> As quantidades se ajustam ao que falta de proteína depois do jantar. <span class="sub"><span class="L">${t('L')}</span> · <span class="P">${t('P')}</span></span></div>`;
}
function altsBlock(day,k,mid){
  const key=`${day.d}|${k}`,cur={L:nut(itemsOf(mid,'L')).p,P:nut(itemsOf(mid,'P')).p},have=baseIng();
  const all=Object.keys(MEALS).filter(id=>MEALS[id].slot===KIND[k]&&id!==mid);
  /* almoço/jantar logo depois de um prato de panela ainda sem par: repetir vira sobra (cozinha uma vez só), então vem primeiro */
  let prev=null;if(KIND[k]==='ref'){const {m:lm,seq}=loteMap(),i=seq.findIndex(x=>x.d===day.d&&x.k===k),a=seq[i-1];
    if(a&&MEALS[a.mid].lote&&a.mid!==mid&&!lm[a.d+'|'+a.k])prev=a;}
  if(prev){all.splice(all.indexOf(prev.mid),1);all.unshift(prev.mid);}
  const row=id=>{const m=MEALS[id],iL=itemsOf(id,'L'),iP=itemsOf(id,'P'),l=nut(iL).p,p=nut(iP).p;
    const extra=[...new Set(iL.concat(iP).map(it=>it[0]))].filter(i=>!have.has(i)).map(i=>SN[i]);
    return `<div class="alt"><div class="mini">${ill(id)}</div><div class="alt-tx"><b>${m.n}${m.user?' <span class="mine-tag">de vocês</span>':''}</b>
      <span class="sub">${m.t} min · <span class="L">Lucas ${R0(l)} g (${sgn(l-cur.L)})</span> · <span class="P">Pri ${R0(p)} g (${sgn(p-cur.P)})</span></span>
      ${prev&&id===prev.mid?`<span class="sub lote-tip">Repete o prato de ${relWhen(day.d,prev)}: faz em dobro lá e aqui só esquenta</span>`:''}
      <span class="sub">${extra.length?`Compra a mais: ${extra.join(', ')}`:'Só com o que já está na lista'}</span></div>
      <button class="btn small primary" data-act="swap" data-key="${key}" data-id="${id}">Usar</button></div>`;};
  const main=all.filter(id=>!MEALS[id].outros),out=all.filter(id=>MEALS[id].outros);
  return `<div class="alts"><div class="eyebrow">Trocar por</div>
    <button class="alt build" data-act="shbuild" data-key="${key}" data-mid="${mid}"><span class="plus-ic" aria-hidden="true">+</span><span class="alt-tx"><b>Montar uma do nosso jeito</b><span class="sub">Escolha os itens; ela fica salva para outros dias</span></span></button>${main.map(row).join('')}
    ${out.length?`<div class="eyebrow alts-out">Outros · quando comprar peixe</div>${out.map(row).join('')}`:''}</div>`;
}
/* Quantidade para mostrar: medida caseira grande e o detalhe embaixo */
function amtOf(id,q){const g=ING[id],h=g.hu;
  if(inGrams(id))return {big:fmt(gramsOf(id,q),0),small:gUnit(id)};
  if(h){const n=q/h[2];return {big:frac(n),small:`${n>1.01?h[1]:h[0]} · ${fmt(q,0)} ${g.u==='ml'?'ml':'g'}`};}
  if(g.u==='g'||g.u==='ml'||g.u==='g cozido')return {big:fmt(q,0),small:g.u==='ml'?'ml':g.u};
  const t=fq(id,q);return {big:frac(q),small:t.replace(/^[\d,½¼¾]+\s*/,'').replace(/ de .*/,'')};}
/* Quantidade de um item para uma pessoa, sem repetir o nome: "5" + "colheres · 50 g" */
function qtyCell(id,q){if(!q)return '<td class="none">—</td>';const a=amtOf(id,q);return `<td><b>${a.big}</b>${a.small?`<small>${a.small}</small>`:''}</td>`;}
/* Uma receita, duas quantidades: uma linha por ingrediente, Lucas e Pri lado a lado. Tocar no nome troca o item. */
function qtyTable(day,k,mid){
  const key=`${day.d}|${k}`,iL=dayItems(day,k,'L'),iP=dayItems(day,k,'P'),q=(its,id)=>(its.find(i=>i[0]===id)||[0,0])[1];
  const ids=[...new Set(iL.concat(iP).map(i=>i[0]))],nL=nut(iL),nP=nut(iP);
  const rows=ids.map(id=>`<tr><th><button data-act="shopen" data-key="${key}" data-mid="${mid}" data-id="${id}">${cap(SN[id]||ING[id].n)}</button></th>${qtyCell(id,q(iL,id))}${qtyCell(id,q(iP,id))}</tr>`).join('');
  const empty=w=>!(w==='L'?iL:iP).length?'<div class="sub">Não precisa hoje. Se der fome, metade da receita.</div>':'';
  return `<table class="qtab"><thead><tr><th><span class="sub">Toque num item para trocar</span></th><th class="L">Lucas</th><th class="P">Pri</th></tr></thead>
   <tbody>${rows}<tr class="add"><th colspan="3"><button data-act="shopen" data-key="${key}" data-mid="${mid}">+ Adicionar item</button></th></tr></tbody>
   <tfoot><tr><th>Proteína</th><td>${R0(nL.p)} g</td><td>${R0(nP.p)} g</td></tr><tr><th>Energia</th><td>${R0(nL.k)} kcal</td><td>${R0(nP.k)} kcal</td></tr></tfoot></table>${empty('L')}${empty('P')}`;
}
/* Próxima refeição de hoje: a primeira que ainda não foi marcada pelos dois. */
function nextSlot(day){if(day.d!==TODAY)return null;const f=SLOTS.find(s=>day.slots[s[0]]&&!(S.checks[`${day.d}|${s[0]}|L`]&&S.checks[`${day.d}|${s[0]}|P`]));return f?f[0]:null;}
function slotCard(day,k,label,nk){
  const base=day.slots[k],mid=slotsOf(day)[k],m=MEALS[mid],key=`${day.d}|${k}`,sw=V.swap===key,lo=loteOf(day.d,k);
  const open=key in V.open?V.open[key]:(k===nk||sw);
  const ck=w=>!!S.checks[`${key}|${w}`];
  const meta=[lo&&lo.role==='sobra'?'5 min · sobra':`${m.t} min${lo?' · em dobro':''}`,mid!==base?'trocado':'',isCustom(mid)?'ajustado':'',m.user?'de vocês':''].filter(Boolean).join(' · ');
  const dots=['L','P'].map(w=>`<span class="eat-dot ${w}${ck(w)?' on':''}" aria-label="${WHO[w]} ${ck(w)?'comeu':'ainda não'}"></span>`).join('');
  if(!open)return `<article class="slot closed${ck('L')&&ck('P')?' done':''}" id="s-${key}"><button class="slot-row" data-act="slotopen" data-key="${key}" aria-expanded="false">
     <span class="mini">${ill(mid)}</span><span class="sr-tx"><span class="tag">${label}</span><b>${m.n}</b><span class="sub">${meta}</span></span><span class="dots">${dots}</span>${CHEV}</button></article>`;
  const eat=['L','P'].map(w=>{const on=ck(w);return `<label class="eat ${w}${on?' on':''}"><input type="checkbox" data-act="chk" data-key="${key}|${w}"${on?' checked':''}><span class="box">${CHECK}</span>${WHO[w]} ${on?'comeu':'comeu?'}</label>`;}).join('');
  return `<article class="slot open${k===nk?' now':''}" id="s-${key}">
   <button class="hero" data-act="slotopen" data-key="${key}" aria-expanded="true" aria-label="Recolher ${label}">${ill(mid)}<span class="hero-tag">${k===nk?'Agora · ':''}${label}</span>${CHEV}</button>
   <div class="slot-b"><h3>${m.n}</h3><div class="sub">${meta}</div>
   <div class="eats">${eat}</div>
   ${k==='ceia'?ceiaNote(day):''}${juntoBlock(mid,day,k)}${qtyTable(day,k,mid)}
   <div class="slot-actions"><button class="btn small" data-act="swapopen" data-key="${key}" aria-expanded="${sw}">${sw?'Fechar trocas':'Trocar refeição'}</button>
   <button class="btn small" data-act="recipe" data-id="${mid}">Receita</button>
   ${mid!==base?`<button class="link" data-act="swap" data-key="${key}" data-id="${base}">Voltar ao plano</button>`:''}</div>
   ${sw?altsBlock(day,k,mid):''}</div></article>`;
}
function extrasBlock(day){
  const w=V.extraWho,key=`${day.d}|${w}`,ex=S.extras[key]||{};
  const tabs=['L','P'].map(x=>`<button class="chip" data-act="exwho" data-who="${x}" aria-pressed="${x===w}"><span class="dot ${x}"></span>${WHO[x]}</button>`).join('');
  const pills=EXTRAS.map(e=>{const n=nut(e.it),c=ex[e.id]||0;
    return `<span class="pill"><span>${e.n} <b>+${R0(n.p)} g</b></span>${c?`<button class="pm" data-act="exdel" data-id="${e.id}" aria-label="Tirar um">−</button><span class="ct">${c}</span>`:''}<button class="pm add" data-act="exadd" data-id="${e.id}" aria-label="Adicionar ${e.n}">+</button></span>`;}).join('');
  return `<section class="card stack"><div><div class="eyebrow">Extras do dia</div><div class="sub">Comeu algo fora do plano? Registre e o placar atualiza.</div></div>
   <div class="row">${tabs}</div><div class="pills">${pills}</div></section>`;
}
function viewHoje(){
  const day=dayOf(V.day),nk=nextSlot(day);
  const chips=WEEK.map(x=>`<button class="chip day-chip${x.d===TODAY?' today':''}" data-act="day" data-day="${x.d}" aria-pressed="${x.d===V.day}"><span>${x.wd}</span><b>${+x.d.slice(8)}</b></button>`).join('');
  const partial=!day.slots.cafe?'Dia parcial: o café e o almoço já passaram.':(!day.slots.jantar?'Dia parcial: o jantar fica para a próxima semana.':'');
  const slots=SLOTS.filter(s=>day.slots[s[0]]).map(s=>slotCard(day,s[0],s[1],nk)).join('');
  return `<div class="chips days" role="group" aria-label="Escolha o dia">${chips}</div>
   <div class="score">${scoreCard(day,'L')}${scoreCard(day,'P')}</div>
   <div class="stack">${partial?`<div class="sub">${partial}</div>`:''}${advice(day)}${slots}${extrasBlock(day)}</div>`;
}

/* ----- SEMANA ----- */
/* Marcas do dia: compra e bloco de preparo que começam nele (tocar leva para a aba). */
function dayMarks(d){const o=[];TRIPS.forEach(t=>{if(t.days[0]===d)o.push(`<button class="mark" data-act="gotrip" data-id="${t.id}">${t.n}</button>`);});
  if(d===BATCH1[0]||d===BATCH2[0])o.push('<button class="mark prep" data-act="nav" data-v="preparo">Preparo</button>');return o.join('');}
function viewSemana(){
  const full=WEEK.filter(d=>d.slots.cafe&&d.slots.jantar);
  const avg=w=>full.reduce((a,d)=>a+dayStats(d,w).plan.p,0)/full.length;
  const okDays=full.filter(d=>['L','P'].every(w=>dayStats(d,w).plan.p>=S.targets[w].p*.95)).length;
  /* refeição igual todos os dias (o lanche): aparece uma vez no topo, não em cada dia */
  const same=SLOTS.map(s=>s[0]).filter(k=>{const ms=WEEK.filter(d=>slotsOf(d)[k]).map(d=>slotsOf(d)[k]);return ms.length>2&&ms.every(m=>m===ms[0]);});
  const lbl=k=>SLOTS.find(s=>s[0]===k)[1];
  const stat=w=>`<div class="stat ${w}"><span class="nm"><span class="dot ${w}"></span>${WHO[w]}</span><b>${R0(avg(w))} g</b><span class="sub">por dia · meta ${S.targets[w].p}</span></div>`;
  const cards=WEEK.map(d=>{
    const sl=slotsOf(d),past=d.d<TODAY;
    const rows=SLOTS.filter(s=>sl[s[0]]&&!same.includes(s[0])).map(s=>{const mid=sl[s[0]],lo=loteOf(d.d,s[0]);
      return `<li><button data-act="weekslot" data-day="${d.d}" data-k="${s[0]}"><span class="sl">${s[1].split(' ')[0]}</span><span class="mini">${ill(mid)}</span><span class="wn">${MEALS[mid].n}${lo&&lo.role==='sobra'?' <span class="sub">· sobra</span>':''}${mid!==d.slots[s[0]]?' <span class="sub">· trocado</span>':''}</span></button></li>`;}).join('');
    const l=dayStats(d,'L').plan,p=dayStats(d,'P').plan,low=d.slots.cafe&&d.slots.jantar&&(l.p<S.targets.L.p*.95||p.p<S.targets.P.p*.95);
    return `<article class="dayc${d.d===TODAY?' is-today':''}${past?' past':''}"><div class="top"><button class="dh" data-act="day-go" data-day="${d.d}"><h3>${WD_FULL[d.wd]} ${+d.d.slice(8)}</h3>${d.d===TODAY?'<span class="tag">hoje</span>':''}</button>
      <span class="tots"><span class="tot L">${R0(l.p)} g</span><span class="tot P">${R0(p.p)} g</span></span></div>
      ${dayMarks(d.d)||low?`<div class="marks">${dayMarks(d.d)}${low?'<span class="mark warn">abaixo da meta</span>':''}</div>`:''}<ul>${rows}</ul></article>`;}).join('');
  return `<div class="stack"><section class="card stack"><div class="eyebrow">Média planejada de proteína</div>
   <div class="stats">${stat('L')}${stat('P')}</div>
   <div class="sub">${okDays} de ${full.length} dias completos dentro da meta.${same.map(k=>` ${lbl(k)} todo dia: ${MEALS[slotsOf(WEEK.find(d=>slotsOf(d)[k]))[k]].n}.`).join('')} Toque numa refeição para trocar.</div></section>
   <div class="week">${cards}</div></div>`;
}

/* ----- COMPRAS ----- */
function esc(t){return String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function viewCompras(){
  const trips=shopping();const t=trips.find(x=>x.id===V.trip);
  const man=id=>Object.keys(S.manual[id]||{});
  /* itens digitados que o app não reconhece como ingrediente: vão para o corredor provável (limpeza, higiene, bebidas…) */
  const loose=id=>man(id).map(k=>({k,m:parseManual(S.manual[id][k])})).filter(x=>!x.m.id);
  const cnt=x=>{const L=loose(x.id);return {n:x.items.length+L.length,d:x.items.filter(i=>S.shop[`${x.id}|${i.id}`]).length+L.filter(o=>S.shop[`${x.id}|m-${o.k}`]).length};};
  const tabs=trips.map(x=>{const c=cnt(x);
    return `<button class="trip" data-act="trip" data-id="${x.id}" aria-pressed="${x.id===V.trip}"><b>${x.n}</b><span class="sub">${x.long}</span><span class="sub">${c.d}/${c.n} itens · ${fmt(x.kg,1)} kg</span></button>`;}).join('');
  const max=S.maxKg,scale=Math.max(max*1.4,t.kg*1.05),over=t.kg>max,ct=cnt(t);
  const rowsBy={};
  t.items.forEach(i=>{const key=`${t.id}|${i.id}`,on=!!S.shop[key],g=ING[i.id];
    const ex=(i.extra||[]).map(e=>`<span class="xtra">+ ${esc(e.t)} <button class="rm" data-act="mandel" data-id="${e.k}" aria-label="Tirar ${esc(e.t)}">×</button></span>`).join('');
    const why=i.need>0?`<span>${needText(i.id,i.need)} · ${i.uses.join(', ')}</span>`:'<span>adicionado por vocês</span>';
    (rowsBy[g.aisle]=rowsBy[g.aisle]||[]).push({on,html:`<div class="mrow"><label class="item${on?' done':''}"><input type="checkbox" data-act="shop" data-key="${key}"${on?' checked':''}><span class="box">${CHECK}</span>
       <span class="nm">${g.n}</span><span class="qt">${buyText(i)}</span><span class="meta">${why}</span></label>${ex?`<div class="xtras">${ex}</div>`:''}</div>`});});
  loose(t.id).forEach(({k,m})=>{const key=`${t.id}|m-${k}`,on=!!S.shop[key],n=esc(m.t);
    (rowsBy[m.aisle]=rowsBy[m.aisle]||[]).push({on,html:`<div class="mrow"><label class="item${on?' done':''}"><input type="checkbox" data-act="shop" data-key="${key}"${on?' checked':''}><span class="box">${CHECK}</span><span class="nm">${n}</span></label><button class="rm" data-act="mandel" data-id="${k}" aria-label="Tirar ${n} da lista">×</button></div>`});});
  /* comprado desce para o fim do grupo, sem sumir */
  const order=['hort','prot','lat','merc','beb','hig','casa','out'],AN=Object.assign({},AISLES,MAN_AISLES);
  const aisles=order.filter(a=>rowsBy[a]).map(a=>{const rs=rowsBy[a].slice().sort((x,y)=>x.on-y.on),done=rs.filter(r=>r.on).length;
    return `<section class="aisle"><h3>${AN[a]}<span class="sub">${done}/${rs.length}</span></h3><div class="list">${rs.map(r=>r.html).join('')}</div></section>`;}).join('');
  /* adicionar: entende "2 kg batata", "3 iogurtes", "papel toalha"; o que já foi digitado antes vira atalho */
  const seen=new Set(man(t.id).map(k=>norm(S.manual[t.id][k])));
  const past=[...new Set(Object.values(S.manual).flatMap(o=>Object.values(o||{})).map(String))].filter(x=>!seen.has(norm(x))).slice(-8).reverse();
  const manual=`<section class="card stack add-shop"><div><div class="eyebrow">Adicionar à ${t.n.toLowerCase()}</div>
    <div class="sub">Escreva como falaria: “2 kg batata”, “detergente”. Vai para o corredor certo.</div></div>
    <form class="man-add" data-act="manadd"><input id="man-in" class="in-text" type="text" list="ing-list" data-act="manin" maxlength="60" autocomplete="off" enterkeyhint="done" placeholder="Ex.: 2 kg batata" aria-label="Item para adicionar"><button class="btn primary" type="submit">Adicionar</button></form>
    <div id="man-hint" class="sub man-hint"></div>
    <datalist id="ing-list">${ING_IDS.map(id=>`<option value="${esc(cap(SN[id]||ING[id].n))}">`).join('')}</datalist>
    ${past.length?`<div class="pills">${past.map(x=>`<button class="chip" data-act="manpick" data-t="${esc(x)}">+ ${esc(x)}</button>`).join('')}</div>`:''}</section>`;
  let pantry='';
  if(t.k==='T1'){
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
  const stock=t.k==='T1'?`<section class="card stack"><div><div class="eyebrow">Estoque em casa</div><div class="sub">O que já tem sai da lista.</div></div><div class="pills">${havePills}</div><div class="stock">
    ${['atum','sardinha'].map(id=>`<div class="stepper"><button data-act="stock" data-id="${id}" data-d="-1" aria-label="Menos ${ING[id].n}">−</button><span>${S.stock[id]||0}</span><button data-act="stock" data-id="${id}" data-d="1" aria-label="Mais ${ING[id].n}">+</button><span class="sub">${ING[id].n}</span></div>`).join('')}</div></section>`:'';
  return `<div class="stack"><div class="trips">${tabs}</div>
   <section class="card"><div class="eyebrow">${t.n} · ${t.long}</div><div class="sub">Cobre ${t.covers}.</div>
   <div class="prog"><span>${ct.d} de ${ct.n} no carrinho</span><div class="pbar"><i style="width:${ct.n?ct.d/ct.n*100:0}%"></i></div></div>
   <div class="prog"><span>Mochila <b>${fmt(t.kg,1)} kg</b> de ${max} kg</span></div>
   <div class="meter${over?' over':''}" role="img" aria-label="${fmt(t.kg,1)} kg de ${max} kg"><i style="width:${Math.min(100,t.kg/scale*100)}%"></i><u style="left:${max/scale*100}%"></u></div>
   ${over?'<div class="tip" style="margin-top:8px">Passou do limite da mochila. Se puder, marque em Estoque o que já tem em casa, ou aumente o limite em Ajustes.</div>':''}</section>
   ${manual}${stock}${aisles}${pantry}
   <div><button class="btn" data-act="resetshop" data-id="${t.id}">Zerar marcações desta compra</button></div></div>`;
}

function manHint(v){if(!String(v||'').trim())return '';const m=parseManual(v);
  if(!m.id)return `Vai para <b>${(MAN_AISLES[m.aisle]||AISLES[m.aisle]||'Outros itens')}</b>.`;
  const g=ING[m.id],packs=Math.max(1,Math.ceil(m.q/g.pack-1e-9));
  return `Reconhecido: <b>${g.n}</b> · ${buyText({id:m.id,packs,qty:packs*g.pack})}. Entra em ${AISLES[g.aisle]} e no peso da mochila.`;}

/* ----- RECEITAS ----- */
function whereUsed(id){const out=[];WEEK.forEach(d=>{const sl=slotsOf(d);SLOTS.forEach(s=>{if(sl[s[0]]===id)out.push(`${d.wd} ${d.d.slice(8)} (${s[1].split(' ')[0].toLowerCase()})`);});});return out.length?out.join(', '):'nenhum dia. Use o botão Trocar na aba Hoje para colocar no plano.';}
function recCard(id){
  const m=MEALS[id]||BASES[id],open=!!V.open[id],r=RECIPES[id]||{steps:['Separe os itens do quadro e monte na proporção de cada um.'],tips:[]};
  const isMeal=!!MEALS[id];
  const head=`<button class="rec-h" data-act="exp" data-id="${id}" aria-expanded="${open}" id="rec-${id}"><div class="ill">${ill(id)}</div>
   <div><span class="tag">${m.user?'De vocês · ':''}${isMeal?(m.outros?'Outros · almoço ou jantar':m.slot==='cafe'?'Café':m.slot==='ref'?'Almoço ou jantar':m.slot==='lanche'?'Lanche':'Ceia'):'Preparo base'}</span><h3>${m.n}</h3>
   <div class="sub">${m.t} min${isMeal?` · Lucas ${R0(nut(itemsOf(id,'L')).p)} g · Pri ${R0(nut(itemsOf(id,'P')).p)} g de proteína${isCustom(id)?' · ajustada por vocês':''}`:''}</div></div>${CHEV}</button>`;
  let body='';
  if(open){
    const cols=isMeal?`<div class="cols">${['L','P'].map(w=>{const its=itemsOf(id,w),n=nut(its);return `<div class="col ${w}"><h4>${WHO[w]}</h4><ul>${its.map(it=>`<li>${fq(it[0],it[1])}</li>`).join('')}</ul><div class="tt">${R0(n.p)} g de proteína · ${R0(n.k)} kcal</div></div>`;}).join('')}</div>`:`<div class="note" style="margin-top:14px">${m.desc}</div>`;
    const steps=`<ol class="steps">${r.steps.map((s,i)=>{const k=`${id}|${i}`;return `<li class="${S.steps[k]?'done':''}" data-act="step" data-key="${k}"><span>${s}</span></li>`;}).join('')}</ol>`;
    const tt=(m.lote?['Prato de panela: faça em dobro. Quando ele aparece em duas refeições seguidas, o quadro já soma as duas e a segunda é só esquentar (até 3 dias na geladeira).']:[]).concat(r.tips);
    const tips=tt.length?`<div class="note">${tt.map(t=>`<div>${t}</div>`).join('')}</div>`:'';
    const wh=isMeal?`<div class="where">Na semana: ${whereUsed(id)}</div>`:'';
    body=`<div class="rec-b">${isMeal?juntoBlock(id):''}${cols}${steps}${tips}${wh}<div class="row wrap"><button class="link" data-act="clearsteps" data-id="${id}">Limpar passos marcados</button>${m.user?`<button class="link danger" data-act="mealdel" data-id="${id}">Apagar esta refeição</button>`:''}</div></div>`;
  }
  return `<article class="rec">${head}${body}</article>`;
}
function viewReceitas(){
  const F=[['all','Todas'],['cafe','Café'],['ref','Almoço e jantar'],['lc','Lanche e ceia'],['outros','Outros'],['base','Base']];
  const chips=F.map(f=>`<button class="chip" data-act="filter" data-f="${f[0]}" aria-pressed="${V.filter===f[0]}">${f[1]}</button>`).join('');
  const ids=Object.keys(MEALS).concat(Object.keys(BASES)).filter(id=>{
    const sl=(MEALS[id]||BASES[id]).slot;
    const o=!!(MEALS[id]&&MEALS[id].outros);
    return V.filter==='all'||(V.filter==='outros'?o:!o&&(V.filter==='lc'?(sl==='lanche'||sl==='ceia'):sl===V.filter));});
  return `<div class="chips">${chips}</div><div class="stack">${ids.map(recCard).join('')}</div>`;
}

/* ----- PREPARO ----- */
function ceilTo(n,s){return Math.ceil(n/s-1e-9)*s;}
function eggOf(list){const f=list.find(i=>i[0]==='ovo');return f?f[1]:0;}
function boiledEggs(days){let n=0;days.forEach(dd=>{const d=dayOf(dd);if(!d)return;Object.values(slotsOf(d)).forEach(mid=>{
  if(MEALS[mid].oc)n+=eggOf(itemsOf(mid,'L'))+eggOf(itemsOf(mid,'P'));});});return n;}
/* Potes: quanto de um item vai em cada refeição dos dias do bloco (frango pesado já assado, ~70% do cru). */
function potes(days,id,f){const out=[];WEEK.forEach(d=>{if(!days.includes(d.d))return;SLOTS.forEach(([k,lb])=>{
  const q=w=>(dayItems(d,k,w).find(i=>i[0]===id)||[0,0])[1]*f;const L=q('L'),P=q('P');
  if(L+P>0)out.push(`<li><span>${d.wd} ${+d.d.slice(8)} · ${lb.split(' ')[0].toLowerCase()}</span><span class="L">${L?fmt(Math.round(L/5)*5,0)+' g':'—'}</span><span class="P">${P?fmt(Math.round(P/5)*5,0)+' g':'—'}</span></li>`);});});
  return out.length?`<ul class="potes"><li class="ph"><span>Pote${f<1?' · peso já pronto':''}</span><span class="L">Lucas</span><span class="P">Pri</span></li>${out.join('')}</ul>`:'';}
/* Tarefas em ordem de início: o que demora mais (pressão, forno) começa primeiro, o resto entra enquanto espera. */
function prepPlan(){
  const mk=(key,label,days,first,trip)=>{
    const nd=needs(days);const fr=ceilTo(((nd.frango||{}).tot||0)*1.1,50);
    const ar=nd.arroz?ceilTo(nd.arroz.tot*.34*1.1,10):0;
    const feijAll=needs(ALL_DAYS).feijao;const fj=feijAll?ceilTo(feijAll.tot*.35*1.05,10):0;
    const ov=boiledEggs(days);
    const tasks=[
      first?{id:`${WK}-${key}-feijao`,n:`Feijão: ${fj} g secos`,s:0,m:35,eq:'Pressão',k:'25 min na pressão',t:`Deixe de molho na véspera se puder. Rende ~${Math.round(fj*2.85/10)*10} g cozidos: congele em porções de 140 g, uma por refeição com feijão do Lucas.`}
           :{id:`${WK}-${key}-feijao`,n:'Feijão: porções do congelador',s:0,m:2,eq:'Geladeira',k:'1 porção na véspera',t:'Passe uma porção para a geladeira na véspera de cada refeição com feijão.'},
      {id:`${WK}-${key}-frango`,n:`Frango assado: ${fr} g`,s:0,m:30,eq:'Forno',k:'200 °C · 22 a 25 min',t:'Tempere com sal, páprica e limão enquanto o forno aquece. Asse, deixe amornar, desfie metade e fatie o resto.',potes:potes(days,'frango',.7)},
      ar&&{id:`${WK}-${key}-arroz`,n:`Arroz: ${ar} g crus`,s:5,m:20,eq:'Panela',k:`12 min tampado · rende ~${ar*3} g`,t:'Refogue no azeite, junte 2,5 partes de água fervente, tampe e cozinhe 12 min. Só o Lucas come arroz.',potes:potes(days,'arroz',1)},
      ov&&{id:`${WK}-${key}-ovos`,n:`Ovos cozidos: ${ov} un`,s:15,m:12,eq:'Boca',k:'10 min + água gelada',t:'Água fria, ferva e conte 10 min. Passe em água gelada e guarde com casca.'},
      {id:`${WK}-${key}-azeite`,n:'Azeite aromatizado',s:25,m:8,eq:'Boca',k:'fogo baixo · 5 min',t:'100 ml de azeite com 2 dentes de alho amassados. Tire todo o alho. Geladeira, até 4 dias.'+(first?'':' Descarte o do domingo.')}].filter(Boolean);
    const end=Math.max(...tasks.map(t=>t.s+t.m))+10;
    return{key,label,days,trip,end,tasks};};
  return [mk('dom','Domingo '+dia(0),BATCH1,true,TRIPS[0]),mk('qua','Quarta '+dia(3),BATCH2,false,TRIPS[1])];
}
/* Cronômetros do preparo: só neste aparelho, não vão para o S nem para a sincronização. */
const TIMERS={};let timerI=null;
function mmss(ms){const t=Math.max(0,Math.ceil(ms/1000));return `${Math.floor(t/60)}:${pad(t%60)}`;}
function tickTimers(){const now=Date.now();
  for(const id in TIMERS){const left=TIMERS[id].end-now,el=document.querySelector(`[data-timer="${id}"]`);
    if(left<=0){const n=TIMERS[id].n;delete TIMERS[id];try{navigator.vibrate&&navigator.vibrate([300,150,300]);}catch(e){}toast(`${n}: tempo acabou`);if(V.view==='preparo')render(true);continue;}
    if(el)el.textContent=mmss(left);}
  if(!Object.keys(TIMERS).length){clearInterval(timerI);timerI=null;}}
function viewPreparo(){
  const plans=prepPlan();
  /* o bloco da quarta vem primeiro a partir da quarta; o que já passou ou terminou fica recolhido */
  if(TODAY>=BATCH2[0])plans.reverse();
  return `<div class="stack">${plans.map(p=>{const done=p.tasks.filter(t=>S.prep[t.id]).length,all=done===p.tasks.length,past=p.days[p.days.length-1]<TODAY;
   const tr=p.trip,miss=['frango','arroz'].filter(id=>{const it=shopping().find(x=>x.id===tr.id).items.find(i=>i.id===id);return it&&!S.shop[`${tr.id}|${id}`];});
   const buy=`<button class="buy${miss.length?' warn':''}" data-act="gotrip" data-id="${tr.id}">${miss.length?`Falta comprar ${miss.map(id=>SN[id].replace(' cozido','')).join(' e ')} na ${tr.n.toLowerCase()} (${tr.when.toLowerCase()})`:`Compras da ${tr.n.toLowerCase()} feitas`}</button>`;
   const tasks=p.tasks.map((t,n)=>{const on=!!S.prep[t.id],run=TIMERS[t.id];
    return `<div class="task${on?' done':''}"><label class="tk"><input type="checkbox" data-act="prep" data-key="${t.id}"${on?' checked':''}><span class="box">${CHECK}</span>
      <span class="tk-tx"><span class="when">${n+1} · ${t.s?`aos ${t.s} min`:'comece já'} · ${t.eq}</span><span class="nm">${t.n}</span><span class="sub">${t.k}</span></span></label>
      <button class="timer${run?' run':''}" data-act="timer" data-id="${t.id}" data-m="${t.m}" data-n="${esc(t.n.split(':')[0])}" aria-label="${run?'Parar cronômetro':'Iniciar cronômetro de '+t.m+' min'}"><span data-timer="${t.id}">${run?mmss(run.end-Date.now()):t.m+' min'}</span></button>
      ${t.potes||''}<details class="how"><summary>Como fazer</summary><p>${t.t}</p></details></div>`;}).join('');
   const head=`<div class="sess-h"><h2>${p.label}</h2><span class="sub">${done}/${p.tasks.length} · ~${p.end} min</span></div><div class="pbar"><i style="width:${done/p.tasks.length*100}%"></i></div>`;
   if(all||past)return `<details class="sess card"><summary>${head}</summary><div class="list">${tasks}</div></details>`;
   return `<section class="sess card stack">${head}${buy}<div class="list">${tasks}</div></section>`;}).join('')}
  <div><button class="link" data-act="recipe" data-id="B4">Receita do azeite aromatizado</button></div></div>`;
}

/* ----- AJUSTES ----- */
/* Aceita 2 · 0,5 · 1/2 · ½ · 1½ · 1 1/2 */
function parseQty(s){s=String(s||'').trim().replace(',','.').replace('½',' .5').replace('¼',' .25').replace('¾',' .75');
  let v=0,ok=false;for(const p of s.split(/\s+/).filter(Boolean)){const f=p.match(/^(\d+)\/(\d+)$/);const n=f?Number(f[1])/Number(f[2]):Number(p);if(!isFinite(n))return null;v+=n;ok=true;}
  return ok?v:null;}
const ICONS=[['verde','Verde'],['preto','Preto'],['rosa','Rosa'],['claro','Claro']];
function applyIcon(){const l=document.getElementById('touch-icon');if(l&&ICONS.some(i=>i[0]===S.icon))l.href=`icons/${S.icon}-180.png`;}
function syncBlock(){
  return `<section class="card stack"><div class="eyebrow">Sincronização</div>
   <div class="sub">Automática entre todos os aparelhos. Situação: <b id="sync-box"></b></div></section>`;
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
   <div class="sub">Vale ao adicionar à Tela de Início (Safari › Compartilhar). Para trocar um já adicionado, apague e adicione de novo.</div></div>
   <div class="icons" role="radiogroup" aria-label="Ícone">${ICONS.map(i=>`<button class="icon-opt" role="radio" aria-checked="${S.icon===i[0]}" data-act="icon" data-id="${i[0]}"><img src="icons/${i[0]}-180.png" alt="" width="60" height="60"><span>${i[1]}</span></button>`).join('')}</div></section>
  <section class="card stack"><div class="eyebrow">Como as contas são feitas</div>
   <div class="note">Os totais são estimativas com valores médios de tabela (TACO e rótulos). A balança, na média da semana, é o ajuste real.</div>
   <div class="note"><b>Feijão:</b> a referência de 12 a 15 g por concha parece alta. Feijão cozido tem cerca de 5 g de proteína por 100 g, então uma concha (~140 g) rende ~7 g. Usei 5 g por 100 g. Se pesar e achar outro valor, é só avisar.</div></section>
  <section class="card stack"><div class="eyebrow">Pri: o que pode e o que evitar (FODMAP)</div>
   <div class="scroll-x"><table class="t"><thead><tr><th>Pode</th><th>Evitar</th></tr></thead><tbody>
    <tr><td class="ok-t">Frango, ovo, peixe, camarão, atum, sardinha</td><td class="no-t">Feijão, lentilha, grão-de-bico, soja</td></tr>
    <tr><td class="ok-t">Leite e iogurte sem lactose, mussarela, parmesão, cottage até 2 colheres (40 g)</td><td class="no-t">Leite comum, ricota, requeijão</td></tr>
    <tr><td class="ok-t">Batata, arroz, quinoa, mandioca, aveia (até 40 g), batata-doce (até ½ unidade), macarrão de arroz, pão de trigo até 1 fatia (½ pão francês) por vez</td><td class="no-t">Pão e macarrão de trigo em quantidade</td></tr>
    <tr><td class="ok-t">Cenoura, tomate, pepino, espinafre, alface, couve, pimentão vermelho; abobrinha, abóbora cabotiá, brócolis, berinjela e vagem até ¾ xícara</td><td class="no-t">Cebola, alho, cogumelo, couve-flor, beterraba, grão-de-bico</td></tr>
    <tr><td class="ok-t">Morango, uva, mamão, banana firme, laranja, kiwi, abacaxi</td><td class="no-t">Manga, maçã, pera, abacate, banana muito madura</td></tr></tbody></table></div>
   <div class="sub">Tolerância varia de pessoa para pessoa e por porção. Se a Pri acompanha com nutricionista, vale alinhar esta lista com ela.</div></section>
  ${syncBlock()}
  <section class="card stack"><div class="eyebrow">Dados</div><div class="sub">Fica salvo neste aparelho e funciona sem internet.</div>${SY.url?'<div class="sub"><b>Atenção:</b> zerar tudo também zera tudo nos outros aparelhos, inclusive o que cada um comeu.</div>':''}
   <div><button class="btn${conf?' warn':''}" data-act="resetall">${conf?'Toque de novo para zerar tudo':'Zerar todas as marcações'}</button></div></section></div>`;
}

/* ----- ROTEAMENTO E EVENTOS ----- */
const VIEWS={hoje:viewHoje,semana:viewSemana,compras:viewCompras,receitas:viewReceitas,preparo:viewPreparo,ajustes:viewAjustes};
function navHtml(){return `<div class="nav-in">${NAV.map(n=>`<button data-act="nav" data-v="${n[0]}"${V.view===n[0]?' aria-current="page"':''}><svg viewBox="0 0 24 24" aria-hidden="true">${n[2]}</svg><span>${n[1]}</span></button>`).join('')}</div>`;}
function render(keep){
  const y=window.scrollY;
  const d=dayOf(V.day);$('#hdr-t').textContent=V.view==='hoje'?(V.day===TODAY?'Hoje':`${WD_FULL[d.wd]}, ${+d.d.slice(8)}`):NAV.find(n=>n[0]===V.view)[1];
  $('#main').innerHTML=VIEWS[V.view]();
  $('#nav').innerHTML=navHtml();
  /* painel: guarda a rolagem de dentro dele entre um toque e outro */
  const sb=document.querySelector('.sheet-body'),sy=sb?sb.scrollTop:0;
  $('#sheet').innerHTML=sheetHtml();document.body.classList.toggle('sheet-open',!!V.sheet);
  const nb=document.querySelector('.sheet-body');if(nb)nb.scrollTop=sy;
  if(keep)window.scrollTo(0,y);
  const dc=document.querySelector('.days [aria-pressed="true"]');if(dc){const c=dc.parentNode;c.scrollLeft=dc.offsetLeft-c.clientWidth/2+dc.offsetWidth/2;}
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
  if(a.startsWith('sh')&&a!=='shop'&&shAct(a,t))return;
  switch(a){
    case 'undo':doUndo();return;
    case 'shopen':sheetOpen({mode:'edit',mid:t.dataset.mid,key:t.dataset.key,sw:t.dataset.id||null});return;
    case 'shbuild':{const mid=t.dataset.mid,it={L:{},P:{}};['L','P'].forEach(w=>itemsOf(mid,w).forEach(([i,q])=>{it[w][i]=q;}));
      V.swap=null;sheetOpen({mode:'build',key:t.dataset.key,slot:MEALS[mid].slot,n:'',L:it.L,P:it.P});return;}
    case 'mealdel':{const un=snap(),id=t.dataset.id,n=MEALS[id].n;delete S.mine[id];delete S.custom[id];Object.keys(S.swap).forEach(k=>{if(S.swap[k]===id)delete S.swap[k];});applyUser();save();render(true);toast(`“${n}” apagada`,un);return;}
    case 'nav':setHash(t.dataset.v);return;
    case 'day':V.day=t.dataset.day;render(true);return;
    case 'day-go':V.day=t.dataset.day;setHash('hoje');return;
    case 'slotopen':V.open[t.dataset.key]=t.getAttribute('aria-expanded')!=='true';if(!V.open[t.dataset.key]&&V.swap===t.dataset.key)V.swap=null;render(true);return;
    case 'weekslot':{const key=`${t.dataset.day}|${t.dataset.k}`;V.day=t.dataset.day;V.open[key]=true;V.swap=key;setHash('hoje');
      setTimeout(()=>{const el=document.getElementById('s-'+key);if(el)el.scrollIntoView({block:'start'});},60);return;}
    case 'timer':{const id=t.dataset.id;if(TIMERS[id])delete TIMERS[id];else{TIMERS[id]={end:Date.now()+Number(t.dataset.m)*60000,n:t.dataset.n};if(!timerI)timerI=setInterval(tickTimers,1000);}render(true);return;}
    case 'gotrip':V.trip=t.dataset.id;setHash('compras');return;
    case 'recipe':V.open[t.dataset.id]=true;V.filter='all';setHash('receitas');setTimeout(()=>{const el=document.getElementById('rec-'+t.dataset.id);if(el)el.scrollIntoView({block:'start'});},60);return;
    case 'exwho':V.extraWho=t.dataset.who;render(true);return;
    case 'exadd':case 'exdel':{const key=`${V.day}|${V.extraWho}`;const ex=S.extras[key]=S.extras[key]||{};const id=t.dataset.id;ex[id]=Math.max(0,(ex[id]||0)+(a==='exadd'?1:-1));save();render(true);return;}
    case 'have':S.have[t.dataset.id]=!S.have[t.dataset.id];save();render(true);return;
    case 'trip':V.trip=t.dataset.id;V.confirm=null;render(true);return;
    case 'mandel':{const un=snap(),m=S.manual[V.trip]||{},nm=m[t.dataset.id];delete m[t.dataset.id];delete S.shop[`${V.trip}|m-${t.dataset.id}`];if(!Object.keys(m).length)delete S.manual[V.trip];save();render(true);toast(`${nm} saiu da lista`,un);return;}
    case 'stock':{const id=t.dataset.id;S.stock[id]=Math.max(0,(S.stock[id]||0)+Number(t.dataset.d));save();render(true);return;}
    case 'resetshop':{const un=snap();Object.keys(S.shop).forEach(x=>{if(x.indexOf(t.dataset.id+'|')===0)delete S.shop[x];});save();render(true);toast('Marcações desta compra zeradas',un);return;}
    case 'resetall':{if(V.confirm==='all'){S.checks={};S.extras={};S.shop={};S.pantry={};S.prep={};S.steps={};S.have={};S.swap={};V.confirm=null;save();}else arm('all');render(true);return;}
    case 'exp':V.open[t.dataset.id]=!V.open[t.dataset.id];render(true);return;
    case 'step':S.steps[t.dataset.key]=!S.steps[t.dataset.key];save();render(true);return;
    case 'clearsteps':Object.keys(S.steps).forEach(x=>{if(x.indexOf(t.dataset.id+'|')===0)delete S.steps[x];});save();render(true);return;
    case 'filter':V.filter=t.dataset.f;render(true);return;
    case 'icon':S.icon=t.dataset.id;applyIcon();save();render(true);return;
    case 'swapopen':V.swap=V.swap===t.dataset.key?null:t.dataset.key;render(true);return;
    case 'edreset':{const un=snap();delete S.custom[t.dataset.mid];save();render(true);toast('Voltou à receita original',un);return;}
    case 'swap':{const k=t.dataset.key,id=t.dataset.id,d=dayOf(k.split('|')[0]);
      if(id===d.slots[k.split('|')[1]])delete S.swap[k];else S.swap[k]=id;
      delete S.checks[k+'|L'];delete S.checks[k+'|P'];V.swap=null;save();render(true);return;}
    case 'manpick':{const i=document.getElementById('man-in');if(i){i.value=t.dataset.t;i.dispatchEvent(new Event('input',{bubbles:true}));i.form.requestSubmit();}return;}
  }
});
document.addEventListener('change',e=>{
  const t=e.target.closest('[data-act]');if(!t)return;const a=t.dataset.act;
  if(a==='chk'){S.checks[t.dataset.key]=t.checked;save();render(true);}
  else if(shChange(t)){}
  else if(a==='shop'){S.shop[t.dataset.key]=t.checked;save();render(true);}
  else if(a==='pantry'){S.pantry[t.dataset.key]=t.checked;save();render(true);}
  else if(a==='prep'){S.prep[t.dataset.key]=t.checked;save();render(true);}
  else if(a==='num'){const v=Number(t.value);if(!isFinite(v)||v<0)return;const p=t.dataset.path.split('.');
    if(p[0]==='t')S.targets[p[1]][p[2]]=v;else if(p[0]==='r')S.ref[p[1]]=v;else if(p[0]==='maxkg')S.maxKg=v;save();render(true);}
});
document.addEventListener('input',e=>{const t=e.target.closest('[data-act]');if(!t)return;if(shInput(t))return;
  if(t.dataset.act==='manin'){const h=document.getElementById('man-hint');if(h)h.innerHTML=manHint(t.value);}});
document.addEventListener('submit',e=>{const f=e.target;if(shSubmit(f)){e.preventDefault();return;}if(f.dataset.act!=='manadd')return;e.preventDefault();
  const i=f.querySelector('input'),v=(i.value||'').trim().slice(0,60);if(!v)return;
  (S.manual[V.trip]=S.manual[V.trip]||{})[Date.now().toString(36)+Math.random().toString(36).slice(2,5)]=v;save();render(true);
  const n=document.getElementById('man-in');if(n)n.focus();});
window.addEventListener('hashchange',()=>go(location.hash.slice(1)));
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.classList&&e.target.classList.contains('ed-in'))e.target.blur();if(e.key==='Escape'&&V.sheet)sheetClose();});
document.addEventListener('focusout',e=>{if(e.target.classList&&e.target.classList.contains('ed-in'))setTimeout(()=>{if(V.shIn){V.shIn=null;render(true);}},0);});
(function init(){
  document.getElementById('app').innerHTML=`<div class="wrap"><header class="hdr"><p class="eyebrow">Lucas e Pri · ${semTxt()}</p><h1 id="hdr-t"></h1><p id="sync-st" class="sync-st" hidden></p></header><main id="main"></main></div><nav class="nav" id="nav" aria-label="Seções"></nav><div id="sheet"></div><div id="toast" aria-live="polite"></div>`;
  const h=(location.hash||'').slice(1);V.view=VIEWS[h]?h:'hoje';applyIcon();render(false);
})();
