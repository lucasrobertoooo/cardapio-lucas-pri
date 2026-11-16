// Confere se o plano bate as metas: node check.js
// Usa a mesma regra do app para a ceia: ela completa a proteína que faltar no dia (entre ½ e 3× a receita).
const fs=require('fs');
globalThis.META={L:160,P:125};
(0,eval)(fs.readFileSync('src/data.js','utf8').split('if (typeof module')[0]+`
function tot(items){let p=0,k=0;for(const [i,q] of items){if(!ING[i])throw new Error('ingrediente sem cadastro: '+i);p+=ING[i].p*q;k+=ING[i].k*q;}return {p,k};}
function scale(its,f){return its.map(([id,q])=>{const st=ING[id].st||1;return [id,Math.max(st,Math.round(q*f/st)*st)];});}
for(const day of WEEK){const out=[];
 for(const w of ['L','P']){let p=0,k=0,f=1;const sl=day.slots;
  for(const s in sl){if(s==='ceia')continue;const t=tot(MEALS[sl[s]][w]);p+=t.p;k+=t.k;}
  if(sl.ceia){const base=tot(MEALS[sl.ceia][w]);if(sl.cafe&&sl.jantar){const g=META[w]-p;f=g<=3?0:Math.min(3,Math.max(.5,g/base.p));}const t=f===0?{p:0,k:0}:tot(scale(MEALS[sl.ceia][w],f));p+=t.p;k+=t.k;}
  out.push((w==='L'?'Lucas ':'Pri ')+p.toFixed(0)+'g '+k.toFixed(0)+'kcal'+(sl.ceia?' (ceia ×'+f.toFixed(2)+')':''));}
 console.log(day.wd,day.d.slice(8),out.join(' | '));}
console.log('\\nAlternativas por tipo (proteína e kcal de cada um, receita base):');
for(const slot of ['cafe','ref','lanche','ceia']){console.log(' '+slot);
 for(const id in MEALS){const m=MEALS[id];if(m.slot!==slot)continue;const a=tot(m.L),b=tot(m.P);
  console.log('  '+id.padEnd(3),('L '+a.p.toFixed(0)+'g '+a.k.toFixed(0)+'kcal').padEnd(18),('P '+b.p.toFixed(0)+'g '+b.k.toFixed(0)+'kcal').padEnd(18),(m.outros?'[Outros] ':'')+m.n);}}`);
