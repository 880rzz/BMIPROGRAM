import fs from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
const catalog=fs.readFileSync('catalog.js','utf8');

function assert(ok,msg){if(!ok){console.error('FAIL:',msg);process.exit(1)}}

assert(cfg&&Array.isArray(cfg.programs)&&cfg.programs.length===26,'Schema age validation requires the canonical 26-program registry.');
assert(!cfg.programs.some(p=>p.ageRangeOperational===true||p.ageRangeComposite===true),'All recommendation age ranges must now be explicit confirmed hard ranges.');
for(const p of cfg.programs){
  assert(Number.isInteger(p.minAge)&&Number.isInteger(p.maxAge)&&p.minAge<=p.maxAge,`Invalid exact age range: ${p.id}`);
  assert(typeof p.ageText==='string'&&p.ageText.length>0,`Missing public age label: ${p.id}`);
}
assert(catalog.includes("'typicalAgeRange':ageLabel(p)"),'Course Schema must expose the confirmed exact age range for every program.');
assert(!catalog.includes('ageRangeOperational')&&!catalog.includes('ageRangeComposite'),'Catalog Schema must not retain legacy estimated/composite age semantics.');

const exact={
  'borsofozde':[0,3], 'ovoda':[3,6], 'schweden-1':[6,10], 'schweden-2':[10,14],
  'rajztabla':[10,16], 'gimi-svung':[14,18], 'fecskeklub':[8,14], 'vilagfa':[6,14],
  'napraforgocskak':[6,15], 'fokusz':[18,99], 'kezdo-neptanc':[18,99], 'mos':[18,99], 'rekreacio':[18,99]
};
for(const [id,[min,max]] of Object.entries(exact)){
  const p=cfg.programs.find(x=>x.id===id);
  assert(p&&p.minAge===min&&p.maxAge===max,`Confirmed hard age range drifted: ${id}`);
}

console.log('PASS: all 26 programs expose confirmed hard age ranges in recommendation logic and Schema.');
