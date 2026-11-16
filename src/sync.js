/* ===== SINCRONIZAÇÃO ENTRE OS CELULARES =====
   Firebase Realtime Database pela API REST (sem biblioteca): PATCH para gravar, EventSource para ouvir.
   Em comum: trocas de refeição, ajustes de ingredientes, compras, estoque, despensa, preparo, metas e referências.
   De cada aparelho: o que cada um comeu (checks), extras, passos de receita e ícone.
   O código de sincronização é o endereço completo da casa no banco (…/casas/<código>) e fica só no aparelho. */
const SHARED=['swap','shop','stock','have','pantry','prep','targets','ref','maxKg','custom'];
const SYK='cardapio-sync';
const SY={url:'',pend:{},state:'off',es:null,base:{},remote:null,sending:false,retry:null};

function syLoad(){try{const o=JSON.parse(localStorage.getItem(SYK)||'{}');SY.url=o.url||'';SY.pend=o.pend||{};}catch(e){}}
function syStore(){try{localStorage.setItem(SYK,JSON.stringify({url:SY.url,pend:SY.pend}));}catch(e){}}
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
  const txt={off:'',conn:'Sincronizando…',ok:'Sincronizado com o outro celular',offline:n?`Sem internet · ${n} ${n>1?'mudanças esperando':'mudança esperando'}`:'Sem internet · usando o que está salvo',erro:'Sincronização recusada pelo banco. Veja Ajustes.'}[SY.state]||'';
  if(el){el.textContent=txt;el.className='sync-st '+SY.state;el.hidden=!txt;}
  const box=document.getElementById('sync-box');if(box)box.textContent=txt||'Desligada';
}
function sySet(st){SY.state=st;syStatus();}

/* Chamado depois de cada save(): o que mudou nas partes compartilhadas vira PATCH */
function syCollect(){
  const now=flat(sharedOf(S));
  for(const k in now)if(now[k]!==SY.base[k])SY.pend[k]=now[k];
  for(const k in SY.base)if(!(k in now))SY.pend[k]=null;
  SY.base=now;syStore();
}
function syPush(){if(!SY.url||SY.remote===null)return;syCollect();syFlush();}
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
  const sh=unflat(merged);
  for(const f of SHARED){
    if(f==='targets'){const t=sh.targets||{};S.targets={L:Object.assign({},DEF.targets.L,t.L),P:Object.assign({},DEF.targets.P,t.P)};}
    else if(f==='ref')S.ref=Object.assign({},DEF.ref,sh.ref);
    else if(f==='maxKg')S.maxKg=sh.maxKg!=null?sh.maxKg:DEF.maxKg;
    else S[f]=sh[f]||{};
  }
  SY.base=flat(sharedOf(S));
  try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}
  const a=document.activeElement;
  if(!(a&&a.tagName==='INPUT'&&a.type!=='checkbox'))render(true);
}
function syListen(){
  if(SY.es)SY.es.close();SY.remote=null;sySet('conn');
  const es=SY.es=new EventSource(SY.url+'/s.json');
  const onEv=type=>e=>{let d;try{d=JSON.parse(e.data);}catch(x){return;}
    const first=SY.remote===null;
    if(first)SY.remote={};else syCollect(); /* toque recente ainda não salvo não pode ser atropelado */
    if(type==='put')SY.remote=setPath(SY.remote,d.path,d.data);
    else for(const k in (d.data||{}))SY.remote=setPath(SY.remote,(d.path==='/'?'':d.path)+'/'+k,d.data[k]);
    if(first&&!Object.keys(SY.remote).length){
      /* casa nova e vazia: este aparelho manda o que tem */
      SY.pend=Object.assign(flat(sharedOf(S)),SY.pend);syStore();SY.base=flat(sharedOf(S));
    }
    syApply();syFlush();};
  es.addEventListener('put',onEv('put'));
  es.addEventListener('patch',onEv('patch'));
  es.addEventListener('cancel',()=>{es.close();sySet('erro');});
  es.onopen=()=>{if(SY.state==='offline')sySet(Object.keys(SY.pend).length?'conn':'ok');syFlush();};
  es.onerror=()=>{if(SY.state!=='erro')sySet('offline');};
}
function syRandom(n){const a='abcdefghijkmnpqrstuvwxyz23456789';const b=new Uint8Array(n);crypto.getRandomValues(b);return [...b].map(x=>a[x%a.length]).join('');}
function syValidBase(u){return /^https:\/\/[a-z0-9.-]+\.(firebaseio\.com|firebasedatabase\.app)$/.test(u)||/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(u);}
/* Primeiro celular: cola o endereço do banco e cria a casa */
function syCreate(db){
  db=(db||'').trim().replace(/\/+$/,'');
  if(!syValidBase(db))return 'Endereço inválido. Ele termina em firebaseio.com ou firebasedatabase.app.';
  SY.url=db+'/casas/'+syRandom(24);SY.pend={};syStore();syListen();return '';
}
/* Segundo celular: cola o código que o primeiro copiou (o banco manda, o que está aqui é trocado) */
function syJoin(code){
  code=(code||'').trim().replace(/\/+$/,'');
  const m=code.match(/^(.*)\/casas\/([a-z0-9]{20,})$/);
  if(!m||!syValidBase(m[1]))return 'Código inválido. Copie de novo no outro celular, em Ajustes.';
  SY.url=code;SY.pend={};syStore();syListen();return '';
}
function syLeave(){if(SY.es)SY.es.close();SY.es=null;SY.url='';SY.pend={};SY.remote=null;syStore();sySet('off');}

syLoad();
if(SY.url){syListen();}
window.addEventListener('online',()=>{if(SY.url){if(!SY.es||SY.es.readyState===2)syListen();else syFlush();}});
