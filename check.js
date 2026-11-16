// Confere se o plano bate as metas: node check.js
const fs=require('fs');
eval(fs.readFileSync('src/data.js','utf8').split('if (typeof module')[0]+`
function tot(items){let p=0,k=0;for(const [i,q] of items){if(!ING[i])throw new Error('ingrediente sem cadastro: '+i);p+=ING[i].p*q;k+=ING[i].k*q;}return {p,k};}
for(const day of WEEK){let L={p:0,k:0},P={p:0,k:0};for(const id of Object.values(day.slots)){const a=tot(MEALS[id].L),b=tot(MEALS[id].P);L.p+=a.p;L.k+=a.k;P.p+=b.p;P.k+=b.k;}
console.log(day.wd,day.d.slice(8),'Lucas',L.p.toFixed(0)+'g',L.k.toFixed(0)+'kcal','| Pri',P.p.toFixed(0)+'g',P.k.toFixed(0)+'kcal');}
console.log('\\nAlternativas por tipo (proteína e kcal de cada um):');
for(const slot of ['cafe','ref','lanche','ceia']){console.log(' '+slot);
 for(const id in MEALS){const m=MEALS[id];if(m.slot!==slot)continue;const a=tot(m.L),b=tot(m.P);
  console.log('  '+id.padEnd(3),('L '+a.p.toFixed(0)+'g '+a.k.toFixed(0)+'kcal').padEnd(18),('P '+b.p.toFixed(0)+'g '+b.k.toFixed(0)+'kcal').padEnd(18),m.n);}}`);
