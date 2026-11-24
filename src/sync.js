/* ===== SINCRONIZAÇÃO ENTRE OS APARELHOS (celulares e computadores, quantos forem) =====
   Firebase Realtime Database pela API REST (sem biblioteca): PATCH para gravar, EventSource para ouvir.
   Em comum: tudo que é do plano e da casa, inclusive o que cada um comeu (checks), extras e passos de receita.
   Só do aparelho: ícone e a escolha de ver em gramas (unit).
   A casa (…/casas/<código>) vem embutida no app (CASA, no fim deste arquivo): nada para configurar. */
const SHARED=['swap','shop','stock','have','pantry','prep','targets','ref','maxKg','custom','manual','checks','extras','steps','mine','ing','dayc','casa'];
/* passaram a sincronizar depois: na 1ª conexão de um aparelho que já estava na casa, o que só ele tem sobe (nada se apaga) */
const LATE=['checks','extras','steps'];
const SYK='cardapio-sync';
const SY={mig:false,based:false,merge:false,url:'',pend:{},state:'off',es:null,base:{},remote:null,sending:false,retry:null};

function syLoad(){try{const o=JSON.parse(localStorage.getItem(SYK)||'{}');SY.url=o.url||'';SY.pend=o.pend||{};SY.merge=!!o.merge;SY.mig=!!o.mig;}catch(e){}}
function syStore(){try{localStorage.setItem(SYK,JSON.stringify({url:SY.url,pend:SY.pend,merge:SY.merge,mig:SY.mig}));}catch(e){}}
function sharedOf(s){const o={};SHARED.forEach(f=>{if(s[f]!==undefined)o[f]=s[f];});return o;}
/* {shop:{'T1|ovo':true}} -> {'shop/T1|ovo':true}; objetos vazios somem, como no Firebase */
function flat(o,pre,out){out=out||{};
  for(const k in o){const v=o[k],p=pre?pre+'/'+k:k;
    if(v&&typeof v==='object')flat(v,p,out);else if(v!==undefined&&v!==null)out[p]=v;}
  return out;}
function unflat(f){const o={};
  for(const p in f){const ks=p.split('/');let c=o;for(let i=0;i<ks.length-1;i++)c=c[ks[i]]=(c[ks[i]]&&typeof c[ks[i]]==='object')?c[ks[i]]:{};c[ks[ks.length-1]]=f[p];}
  return o;}
function setPath(root,path,val){
  const ks=path.split('/').filter(Boolean);if(!ks.length)return val&&typeof val==='object'?val:{};
  let c=root;const trail=[];
  for(let i=0;i<ks.length-1;i++){if(!c[ks[i]]||typeof c[ks[i]]!=='object'){if(val===null)return root;c[ks[i]]={};}trail.push([c,ks[i]]);c=c[ks[i]];}
  const last=ks[ks.length-1];if(val===null)delete c[last];else c[last]=val;
  for(let i=trail.length-1;i>=0;i--){const [p,k]=trail[i];if(p[k]&&!Object.keys(p[k]).length)delete p[k];}
  return root;}

function syStatus(){
  const el=document.getElementById('sync-st');const n=Object.keys(SY.pend).length;
  const txt={off:'',conn:'Sincronizando…',ok:'Sincronizado com os outros aparelhos',offline:n?`Sem internet · ${n} ${n>1?'mudanças esperando':'mudança esperando'}`:'Sem internet · usando o que está salvo',erro:'Sincronização recusada pelo banco. Veja Ajustes.'}[SY.state]||'';
  if(el){el.textContent=txt;el.className='sync-st '+SY.state;el.hidden=!txt;}
  const box=document.getElementById('sync-box');if(box)box.textContent=txt||'Desligada';
}
/* Metas, referências, estoque e limite da mochila no valor padrão não sobem ao entrar: um aparelho em branco não pode trocar o que vocês ajustaram. */
function syMine(){const mine=flat(sharedOf(S)),def=flat({targets:DEF.targets,ref:DEF.ref,maxKg:DEF.maxKg,stock:DEF.stock});
  for(const k in def)if(mine[k]===def[k])delete mine[k];return mine;}
function sySet(st){SY.state=st;syStatus();}

/* Chamado depois de cada save(): o que mudou nas partes compartilhadas vira PATCH */
function syCollect(){
  const now=flat(sharedOf(S));
  for(const k in now)if(now[k]!==SY.base[k])SY.pend[k]=now[k];
  for(const k in SY.base)if(!(k in now))SY.pend[k]=null;
  SY.base=now;syStore();
}
function syPush(){if(!SY.url)return;if(SY.based)syCollect();if(SY.remote!==null)syFlush();}
async function syFlush(){
  if(!SY.url||SY.sending||!Object.keys(SY.pend).length){if(SY.url&&SY.state!=='erro'&&SY.remote!==null&&navigator.onLine!==false&&!Object.keys(SY.pend).length)sySet('ok');return;}
  SY.sending=true;const batch=Object.assign({},SY.pend);
  try{
    const r=await fetch(SY.url+'/s.json',{method:'PATCH',body:JSON.stringify(batch)});
    if(r.status===401||r.status===403){sySet('erro');return;}
    if(!r.ok)throw new Error(r.status);
    for(const k in batch)if(SY.pend[k]===batch[k])delete SY.pend[k];
    syStore();sySet(Object.keys(SY.pend).length?'conn':'ok');
  }catch(e){sySet('offline');clearTimeout(SY.retry);SY.retry=setTimeout(syFlush,15000);}
  finally{SY.sending=false;if(Object.keys(SY.pend).length&&SY.state!=='offline'&&SY.state!=='erro')syFlush();}
}
/* Estado do banco + mudanças locais ainda não enviadas -> S */
function syApply(){
  const merged=flat(SY.remote||{});
  for(const k in SY.pend){if(SY.pend[k]===null){for(const m in merged)if(m===k||m.indexOf(k+'/')===0)delete merged[m];}else merged[k]=SY.pend[k];}
  const sh=unflat(merged),before=JSON.stringify(sharedOf(S));
  for(const f of SHARED){
    if(f==='targets'){const t=sh.targets||{};S.targets={L:Object.assign({},DEF.targets.L,t.L),P:Object.assign({},DEF.targets.P,t.P)};}
    else if(f==='ref')S.ref=Object.assign({},DEF.ref,sh.ref);
    else if(f==='maxKg')S.maxKg=sh.maxKg!=null?sh.maxKg:DEF.maxKg;
    else if(f==='stock')S.stock=Object.assign(clone(DEF.stock),sh.stock);
    else S[f]=sh[f]||{};
  }
  applyUser();
  SY.base=flat(sharedOf(S));SY.based=true;
  try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}
  if(JSON.stringify(sharedOf(S))===before)return;
  const a=document.activeElement;
  if(!(a&&a.tagName==='INPUT'&&a.type!=='checkbox'))render(true);
}
function syListen(){
  if(SY.es)SY.es.close();SY.remote=null;sySet('conn');
  const es=SY.es=new EventSource(SY.url+'/s.json');
  const onEv=type=>e=>{let d;try{d=JSON.parse(e.data);}catch(x){return;}
    const first=SY.remote===null;
    if(first){SY.remote={};if(SY.based)syCollect();}else syCollect(); /* toque recente ainda não salvo não pode ser atropelado */
    if(type==='put')SY.remote=setPath(SY.remote,d.path,d.data);
    else for(const k in (d.data||{}))SY.remote=setPath(SY.remote,(d.path==='/'?'':d.path)+'/'+k,d.data[k]);
    if(first&&!Object.keys(SY.remote).length){
      /* casa nova e vazia: este aparelho manda o que tem */
      SY.pend=Object.assign(syMine(),SY.pend);SY.mig=true;syStore();SY.base=flat(sharedOf(S));
    }else if(first&&SY.merge){
      /* entrando numa casa que já tem dados: nada deste aparelho se perde. O que só existe aqui sobe;
         onde os dois têm (mesma troca, mesmo item, mesma refeição ajustada), vale o que já está no banco. */
      const grp=k=>{const p=k.split('/');return p.slice(0,p[0]==='custom'||p[0]==='manual'?3:2).join('/');};
      const rg=new Set(Object.keys(flat(SY.remote)).map(grp)),mine=syMine();
      for(const k in mine)if(!rg.has(grp(k)))SY.pend[k]=mine[k];
      SY.merge=false;SY.mig=true;syStore();
    }else if(first&&!SY.mig){
      const rk=new Set(Object.keys(flat(SY.remote))),mine=flat(sharedOf(S));
      for(const k in mine)if(LATE.includes(k.split('/')[0])&&!rk.has(k)&&!(k in SY.pend))SY.pend[k]=mine[k];
      SY.mig=true;syStore();
    }
    syApply();syFlush();};
  es.addEventListener('put',onEv('put'));
  es.addEventListener('patch',onEv('patch'));
  es.addEventListener('cancel',()=>{es.close();sySet('erro');});
  es.onopen=()=>{if(SY.state==='offline')sySet(Object.keys(SY.pend).length?'conn':'ok');syFlush();};
  es.onerror=()=>{if(SY.state!=='erro')sySet('offline');};
}
/* Sem configuração: todo aparelho que abre o app entra sozinho na mesma casa.
   Quem já tinha dados (ou estava numa casa criada à mão) entra mesclando: o que só ele tem sobe, nada se apaga.
   'cardapio-sync-test' troca o banco só para testes locais. */
const CASA=(()=>{let b='';try{b=localStorage.getItem('cardapio-sync-test')||'';}catch(e){}
  return (b||'https://cardapio-lucas-pri-default-rtdb.firebaseio.com')+'/casas/2jiut88v973bhzvr2pwq4dtm';})();
syLoad();
if(SY.url!==CASA){SY.url=CASA;SY.pend={};SY.merge=true;syStore();}
syListen();
/* Voltou para o app (celular tira a conexão em segundo plano): reconecta e pega o que mudou nos outros aparelhos. */
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&SY.url&&SY.state!=='erro'){saveNow();syListen();}});
window.addEventListener('online',()=>{if(SY.url){if(!SY.es||SY.es.readyState===2)syListen();else syFlush();}});
