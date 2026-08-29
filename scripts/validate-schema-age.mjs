import fs from 'node:fs';
import vm from 'node:vm';
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
vm.runInNewContext(fs.readFileSync('zenebona-program.js','utf8'),ctx,{filename:'zenebona-program.js'});
const cfg=ctx.window.BMI_FINDER;
const catalog=fs.readFileSync('catalog.js','utf8');
function assert(ok,msg){if(!ok){console.error('FAIL:',msg);process.exit(1)}}
assert(cfg&&Array.isArray(cfg.programs)&&cfg.programs.length===28,'Schema age validation requires 28 programs.');
for(const p of cfg.programs){assert(Number.isInteger(p.minAge)&&Number.isInteger(p.maxAge)&&p.minAge<=p.maxAge,`Invalid exact age range: ${p.id}`);assert(typeof p.ageText==='string'&&p.ageText.length>0,`Missing public age label: ${p.id}`)}
assert(catalog.includes("'typicalAgeRange':ageLabel(p)"),'Course Schema must expose exact age range.');
const z=cfg.programs.find(p=>p.id==='zenebona');
assert(z&&z.minAge===0&&z.maxAge===3,'Zenebona must stay 0–3.');
const o=cfg.programs.find(p=>p.id==='oromzene');
assert(o&&o.minAge===0&&o.maxAge===99,'Örömzene must remain open to all ages.');
assert(catalog.includes("numberOfItems':programs.length")||catalog.includes("'numberOfItems':programs.length"),'ItemList Schema must use live program count.');
console.log('PASS: all 28 programs expose hard age ranges in recommendation logic and Schema.');