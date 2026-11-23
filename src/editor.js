/* ===== PAINEL DE REFEIÇÃO (sobe de baixo): mudar os itens de uma refeição ou montar uma nova =====
   V.sheet = {mode:'edit', mid, key}            muda a refeição em todos os dias (S.custom, ou S.mine se foi montada por vocês)
           = {mode:'build', key, slot, n, L, P}  rascunho de refeição nova; ao salvar vira S.mine e entra no lugar desta
   Uma receita só para os dois: adicionar ou trocar um item vale para os dois; só a quantidade de cada um muda. */
const CAT_BY=Object.fromEntries(CATS.map(c=>[c[0],c[2]])),CAT_N=Object.fromEntries(CATS.map(c=>[c[0],c[1]]));
const cap=t=>t?t[0].toUpperCase()+t.slice(1):t;
function shItems(sh,w){if(sh.mode==='edit')return itemsOf(sh.mid,w);const o=sh[w];return Object.keys(o).filter(i=>ING[i]&&o[i]>0).map(i=>[i,o[i]]);}
function shQ(sh,w,id){return (shItems(sh,w).find(i=>i[0]===id)||[0,0])[1];}
function shSet(sh,w,id,q){q=Math.max(0,Math.round(q*1000)/1000);
  if(sh.mode==='build'){if(q)sh[w][id]=q;else delete sh[w][id];return;}
  if(MEALS[sh.mid].user){const u=S.mine[sh.mid];u[w]=u[w]||{};if(q)u[w][id]=q;else delete u[w][id];applyUser();}
  else customOf(sh.mid,w)[id]=q;}
/* passo do + e −; em gramas, 5 g nos itens pequenos, 10 g no resto, 25 em leite e iogurte */
function stepOf(id){const g=ING[id];return inGrams(id)?(g.u==='ml'||id==='iogurte'?25:(g.st||1)<=15&&g.hu?5:10)/(g.hu?1:(g.gw||1)):(g.st||1);}
function porOf(id){const g=ING[id];return g.por!=null?g.por:g.fp?g.fp:g.hu?g.hu[2]:(g.u==='g'||g.u==='ml'||g.u==='g cozido')?100:1;}
/* porção ao adicionar: a típica para o Lucas, ~⅔ para a Pri, dentro do limite FODMAP dela */
function addQty(id,w){const g=ING[id],st=g.st||1,r=q=>Math.max(st,Math.round(q/st)*st);let q=r(porOf(id));
  if(w==='P'){if(g.pri===0)return 0;q=r(q*.65);if(g.pri>0&&q>g.pri)q=Math.max(st,Math.floor(g.pri/st)*st);}return q;}
/* troca convertida pelo que importa na categoria: 120 g de frango ≈ 4 ovos; 1 banana ≈ 12 morangos; pão por kcal */
function cvOf(id,by){const g=ING[id];return by==='p'?pOf(id):by==='fp'?(g.fp?1/g.fp:g.k/95):by==='g'?(g.u==='un'?(g.gw||g.wp||100):1):g.k;}
function conv(from,q,to){const by=CAT_BY[ING[from].cat]||'k';let a=cvOf(from,by),b=cvOf(to,by);if(!(a>0&&b>0)){a=ING[from].k;b=ING[to].k;}
  const st=ING[to].st||1;if(!(b>0))return Math.max(st,Math.round(porOf(to)/st)*st);return Math.max(st,Math.round(a*q/b/st)*st);}
function capPri(id,q){const g=ING[id],st=g.st||1;if(g.pri===0)return 0;return g.pri>0&&q>g.pri?Math.max(st,Math.floor(g.pri/st)*st):q;}
/* recentes (deste aparelho): aparecem primeiro na hora de adicionar */
function recents(){try{return JSON.parse(localStorage.getItem('cardapio-recentes')||'[]').filter(id=>ING[id]);}catch(e){return [];}}
function pushRecent(id){try{const r=recents().filter(x=>x!==id);r.unshift(id);localStorage.setItem('cardapio-recentes',JSON.stringify(r.slice(0,10)));}catch(e){}}

function sheetOpen(o){V.sheet=o;V.sw=o.sw||null;V.shq='';V.shcat='';V.newIng=null;V.shIn=null;
  try{history.pushState({sheet:1},'');}catch(e){}render(true);
  if(o.sw)setTimeout(()=>{const el=document.getElementById('er-'+o.sw);if(el)el.scrollIntoView({block:'center'});},30);}
function sheetClose(fromPop){if(!V.sheet)return;V.sheet=null;V.newIng=null;
  if(!fromPop){try{if(history.state&&history.state.sheet)history.back();}catch(e){}}render(true);}
window.addEventListener('popstate',()=>{if(V.sheet)sheetClose(true);});

function amtHtml(sh,w,id,q){const a=amtOf(id,q),k=`${w}|${id}`;
  if(V.shIn===k)return `<input class="ed-in" type="text" inputmode="decimal" autocomplete="off" data-act="shset" data-w="${w}" data-id="${id}" value="${inGrams(id)?fmt(gramsOf(id,q),0):ING[id].hu?fmt(q/ING[id].hu[2],2):fmt(q,2)}" aria-label="Quantidade de ${SN[id]} para ${WHO[w]}">`;
  return `<button class="ed-v" data-act="shtype" data-key="${k}" aria-label="Digitar quantidade de ${SN[id]} para ${WHO[w]}"><b>${q?a.big:'0'}</b><small>${q?a.small:'não come'}</small></button>`;}
function stepHtml(sh,w,id,q){
  return `<div class="stp ${w}"><span class="stp-w">${WHO[w]}</span><button data-act="shq" data-w="${w}" data-id="${id}" data-d="-1" aria-label="Menos ${SN[id]} para ${WHO[w]}"${q?'':' disabled'}>−</button>
    ${amtHtml(sh,w,id,q)}<button data-act="shq" data-w="${w}" data-id="${id}" data-d="1" aria-label="Mais ${SN[id]} para ${WHO[w]}">+</button></div>`;}
function swapChips(sh,from,qL,qP){
  const cat=ING[from].cat,present=new Set(shItems(sh,'L').concat(shItems(sh,'P')).map(i=>i[0]));
  /* todas as opções da categoria, sem esconder nenhuma: as parecidas (PAR) primeiro. O que já está no prato aparece também e soma. */
  const near=(PAR[from]||[]).filter(id=>ING[id]&&id!==from),rest=ING_IDS.filter(id=>ING[id].cat===cat&&id!==from&&!near.includes(id));
  const opts=near.concat(rest);
  if(!opts.length)return `<div class="sub sw-none">Não há outro item de ${CAT_N[cat].toLowerCase()} cadastrado. Use a busca abaixo para adicionar.</div>`;
  const chip=id=>{const g=ING[id],aL=qL?conv(from,qL,id):0,aP=qP&&g.pri!==0?capPri(id,conv(from,qP,id)):0;
    const byP=CAT_BY[cat]==='p',dL=R0(byP?pOf(id)*aL-pOf(from)*qL:ING[id].k*aL-ING[from].k*qL);
    return `<button class="sw-ch" role="listitem" data-act="shswap" data-from="${from}" data-to="${id}"><b>${cap(SN[id])}</b>
      <span class="sub"><span class="L">${aL?trq(id,aL):'—'}</span> · <span class="P">${g.pri===0?'Pri evita':aP?trq(id,aP):'—'}</span></span>
      <span class="sub">${present.has(id)?'Já está no prato: soma':`Lucas ${dL>0?'+':dL<0?'−':'±'}${Math.abs(dL)} ${byP?'g de proteína':'kcal'}`}</span></button>`;};
  return `<div class="sw-list" role="list">${opts.map(chip).join('')}</div>`;}
function trq(id,q){return fq(id,q).replace(/ \(.*\)$/,'').replace(' de '+SN[id],'');}
function resultsHtml(sh){
  const present=new Set(shItems(sh,'L').concat(shItems(sh,'P')).map(i=>i[0]));let ids,head='';
  const q=singAll(norm(V.shq||''));
  if(q){ids=ING_IDS.filter(id=>{const n=singAll(norm(ING[id].n+' '+(SN[id]||'')));return q.split(' ').every(w=>n.includes(w));});}
  else if(V.shcat)ids=ING_IDS.filter(id=>ING[id].cat===V.shcat);
  else{ids=recents();if(ids.length)head='<div class="sub res-h">Usados por último</div>';else ids=['ovo','iogurte','whey','banana','pao','aveia','cottage','amendoim','tapioca','mussarela'];}
  ids=ids.filter(id=>!present.has(id)).slice(0,24);
  const chips=ids.map(id=>`<button class="ch-add" data-act="shadd" data-id="${id}">+ ${cap(SN[id]||ING[id].n)}${ING[id].pri===0?' <small>(Pri evita)</small>':''}</button>`).join('');
  const exact=q&&ING_IDS.some(id=>singAll(norm(SN[id]||''))===q||singAll(norm(ING[id].n))===q);
  const nw=q&&!exact&&!chips?`<button class="ch-add new" data-act="shnew">+ Cadastrar “${esc(V.shq.trim())}”</button>`:'';
  return head+(chips||nw?`<div class="res-chips">${chips}${nw}</div>`:'<div class="sub">Nada encontrado.</div>');}
function newIngForm(){const f=V.newIng;
  return `<form class="new-ing card" data-act="ingsave"><div class="eyebrow">Ingrediente novo</div>
   <div class="sub">Olhe a tabela do rótulo. Ele passa a valer no app todo: montar, trocar e compras.</div>
   <label class="fl">Nome<input class="in-text" name="n" maxlength="40" required value="${esc(f.n)}"></label>
   <div class="fl-row"><label class="fl">Conta por<select name="u"><option value="g">100 g</option><option value="un">unidade</option></select></label>
   <label class="fl">Categoria<select name="cat">${CATS.map(c=>`<option value="${c[0]}"${c[0]===f.cat?' selected':''}>${c[1]}</option>`).join('')}</select></label></div>
   <div class="fl-row"><label class="fl">Proteína (g)<input class="in-text" name="p" inputmode="decimal" required placeholder="ex.: 6"></label>
   <label class="fl">Energia (kcal)<input class="in-text" name="k" inputmode="decimal" required placeholder="ex.: 90"></label></div>
   <div class="row"><button class="btn" type="button" data-act="shnewx">Cancelar</button><button class="btn primary" type="submit">Cadastrar e adicionar</button></div></form>`;}
function sheetHtml(){
  const sh=V.sheet;if(!sh)return '';
  if(sh.mode==='edit'&&!MEALS[sh.mid]){V.sheet=null;return '';}
  const iL=shItems(sh,'L'),iP=shItems(sh,'P'),nL=nut(iL),nP=nut(iP);
  const ids=[...new Set(iL.map(i=>i[0]).concat(iP.map(i=>i[0])))];
  const rows=ids.map(id=>{const g=ING[id],qL=shQ(sh,'L',id),qP=shQ(sh,'P',id),open=V.sw===id;
    const warn=qP&&g.pri!=null&&qP>g.pri?`<span class="ed-warn">${g.pri===0?'A Pri evita (FODMAP)':'Acima do limite FODMAP da Pri'}</span>`:'';
    return `<div class="er${open?' open':''}" id="er-${id}"><div class="er-h"><b>${cap(SN[id]||g.n)}</b><span class="er-c">${CAT_N[g.cat]||''}</span>${warn}</div>
     <div class="er-q">${stepHtml(sh,'L',id,qL)}${stepHtml(sh,'P',id,qP)}</div>
     <div class="er-a"><button class="link" data-act="shsw" data-id="${id}" aria-expanded="${open}">${open?'Fechar troca':'Trocar por…'}</button><button class="link danger" data-act="shrm" data-id="${id}">Tirar</button></div>
     ${open?swapChips(sh,id,qL,qP):''}</div>`;}).join('');
  const mealN=sh.mode==='edit'?MEALS[sh.mid].n:'';
  const head=sh.mode==='edit'?`<div class="eyebrow">Mudar itens</div><h2>${mealN}</h2><div class="sub">Vale para esta refeição em todos os dias. Compras, preparo e placar se recalculam.</div>`
    :`<div class="eyebrow">Montar refeição · ${SLOT_N[sh.slot]}</div><label class="fl">Nome<input class="in-text" id="sh-name" data-act="shname" maxlength="50" value="${esc(sh.n)}"></label>
      <div class="sub">Comece do que já tem ou do zero. Ao salvar, ela entra no lugar desta refeição hoje e fica nas trocas para outros dias.${ids.length?' <button class="link" data-act="shzero">Começar do zero</button>':''}</div>`;
  const cats=`<div class="chips cats"><button class="chip" data-act="shcat" data-c="" aria-pressed="${!V.shcat}">Sugestões</button>${CATS.map(c=>`<button class="chip" data-act="shcat" data-c="${c[0]}" aria-pressed="${V.shcat===c[0]}">${c[1]}</button>`).join('')}</div>`;
  const foot=sh.mode==='edit'
    ?`${isCustom(sh.mid)?`<button class="btn" data-act="edreset" data-mid="${sh.mid}">Voltar ao original</button>`:''}${MEALS[sh.mid].user?'':`<button class="btn" data-act="shasnew">Salvar como refeição nova</button>`}<button class="btn primary" data-act="shclose">Pronto</button>`
    :`<button class="btn" data-act="shclose">Cancelar</button><button class="btn primary" data-act="shsave"${ids.length?'':' disabled'}>Salvar e usar</button>`;
  return `<div class="sheet-bg" data-act="shclose"></div><section class="sheet" role="dialog" aria-modal="true" aria-label="${sh.mode==='edit'?'Mudar itens':'Montar refeição'}">
   <div class="sheet-top"><span class="grab"></span><button class="sheet-x" data-act="shclose" aria-label="Fechar">×</button></div>
   <div class="sheet-body">${head}
    <div class="tots-bar"><span class="L">Lucas <b>${R0(nL.p)} g</b> · ${R0(nL.k)} kcal</span><span class="P">Pri <b>${R0(nP.p)} g</b> · ${R0(nP.k)} kcal</span></div>
    <div class="ers">${rows||'<div class="sub">Nenhum item ainda. Adicione abaixo.</div>'}</div>
    <div class="add-box"><div class="eyebrow">Adicionar item</div>
     <input class="in-text" id="sh-q" type="search" data-act="shq-in" placeholder="Buscar: ovo, tapioca, queijo…" autocomplete="off" enterkeyhint="search" value="${esc(V.shq||'')}">
     ${cats}<div id="sh-res">${V.newIng?newIngForm():resultsHtml(sh)}</div></div></div>
   <div class="sheet-foot">${foot}</div></section>`;
}
const SLOT_N={cafe:'café da manhã',ref:'almoço ou jantar',lanche:'lanche',ceia:'ceia'};
/* ações do painel (chamadas pelo clique em ui.js) */
function shAct(a,t){const sh=V.sheet;if(!sh)return false;const d=t.dataset;
  switch(a){
    case 'shclose':sheetClose();return true;
    case 'shq':{const q=shQ(sh,d.w,d.id),st=stepOf(d.id);shSet(sh,d.w,d.id,Math.max(0,q+Number(d.d)*st));save();render(true);return true;}
    case 'shtype':V.shIn=d.key;render(true);{const i=document.querySelector('.sheet .ed-in');if(i){i.focus();i.select();}}return true;
    case 'shsw':V.sw=V.sw===d.id?null:d.id;render(true);return true;
    case 'shrm':{const un=snap();['L','P'].forEach(w=>shSet(sh,w,d.id,0));if(V.sw===d.id)V.sw=null;save();render(true);toast(`${cap(SN[d.id])} saiu da refeição`,un);return true;}
    case 'shswap':{const un=snap(),from=d.from,to=d.to;
      for(const w of ['L','P']){const q=shQ(sh,w,from);if(!q)continue;if(w==='P'&&ING[to].pri===0)continue;
        const add=w==='P'?capPri(to,conv(from,q,to)):conv(from,q,to);shSet(sh,w,from,0);shSet(sh,w,to,shQ(sh,w,to)+add);}
      V.sw=null;pushRecent(to);save();render(true);toast(`Trocado: ${SN[from]} → ${SN[to]}`,un);return true;}
    case 'shadd':{const id=d.id;['L','P'].forEach(w=>{if(!shQ(sh,w,id))shSet(sh,w,id,addQty(id,w));});pushRecent(id);V.shq='';save();render(true);return true;}
    case 'shcat':V.shcat=d.c;V.shq='';V.newIng=null;render(true);return true;
    case 'shnew':V.newIng={n:cap((V.shq||'').trim()),cat:V.shcat||'outro'};render(true);return true;
    case 'shnewx':V.newIng=null;render(true);return true;
    case 'shzero':if(sh.mode==='build'){sh.L={};sh.P={};render(true);}return true;
    case 'shasnew':{const items={L:{},P:{}};['L','P'].forEach(w=>shItems(sh,w).forEach(([i,q])=>{items[w][i]=q;}));
      const mid=sh.mid,key=sh.key,kind=MEALS[mid].slot;delete S.custom[mid];save();
      V.sheet={mode:'build',key,slot:kind,n:`${shortOf(mid)} do nosso jeito`,L:items.L,P:items.P};V.sw=null;render(true);return true;}
    case 'shsave':{const n=(sh.n||'').trim()||cap(SLOT_N[sh.slot]);const id='U'+Date.now().toString(36);
      S.mine[id]={n,slot:sh.slot,t:10,L:Object.assign({},sh.L),P:Object.assign({},sh.P)};applyUser();
      if(sh.key){S.swap[sh.key]=id;delete S.checks[sh.key+'|L'];delete S.checks[sh.key+'|P'];}
      save();sheetClose();toast(`“${n}” salva e já está no cardápio`);return true;}
  }
  return false;}
function shInput(t){
  if(t.dataset.act==='shq-in'){V.shq=t.value;V.newIng=null;const r=document.getElementById('sh-res');if(r&&V.sheet)r.innerHTML=resultsHtml(V.sheet);return true;}
  if(t.dataset.act==='shname'&&V.sheet&&V.sheet.mode==='build'){V.sheet.n=t.value;return true;}
  return false;}
function shChange(t){
  if(t.dataset.act!=='shset'||!V.sheet)return false;V.shIn=null;const d=t.dataset,g=ING[d.id],v=parseQty(t.value);
  if(v!=null){const q=inGrams(d.id)?(g.hu?v:v/(g.gw||1)):(g.hu?v*g.hu[2]:v);shSet(V.sheet,d.w,d.id,q);save();}
  render(true);return true;}
function shSubmit(f){
  if(f.dataset.act!=='ingsave'||!V.sheet)return false;const x=new FormData(f),num=v=>parseFloat(String(v||'').replace(',','.'));
  const n=String(x.get('n')||'').trim().slice(0,40),u=x.get('u')==='un'?'un':'g',p=num(x.get('p')),k=num(x.get('k'));
  if(!n||!(p>=0)||!(k>=0))return true;
  const id='x'+Date.now().toString(36),ai=guessAisle(n),cat=String(x.get('cat')||'outro');
  S.ing[id]={n,u,p:u==='g'?p/100:p,k:u==='g'?k/100:k,cat,aisle:['hort','prot','lat','merc'].includes(ai)?ai:(cat==='fruta'||cat==='leg'?'hort':cat==='lat'?'lat':'merc')};
  applyUser();V.newIng=null;V.shq='';['L','P'].forEach(w=>shSet(V.sheet,w,id,u==='g'?(w==='L'?100:70):1));pushRecent(id);save();render(true);
  toast(`${n} cadastrado`);return true;}

/* ===== DESFAZER: ação na hora + aviso com "Desfazer" por 6 s (em vez de "toque de novo para confirmar") ===== */
const SNAP_F=['custom','mine','ing','swap','checks','manual','shop'];
function snap(){const o={};SNAP_F.forEach(f=>{o[f]=clone(S[f]);});return o;}
let toastT=null;
function toast(msg,undo){V.toast={msg,undo};clearTimeout(toastT);toastT=setTimeout(()=>{V.toast=null;drawToast();},6000);drawToast();}
function drawToast(){const el=document.getElementById('toast');if(!el)return;const t=V.toast;
  el.innerHTML=t?`<div class="toast" role="status"><span>${esc(t.msg)}</span>${t.undo?'<button data-act="undo">Desfazer</button>':''}</div>`:'';}
function doUndo(){const t=V.toast;if(!t||!t.undo)return;Object.assign(S,clone(t.undo));applyUser();V.toast=null;clearTimeout(toastT);save();render(true);drawToast();}
