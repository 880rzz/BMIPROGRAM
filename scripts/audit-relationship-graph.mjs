import fs from 'node:fs';
import vm from 'node:vm';

function assert(ok,msg){if(!ok)throw new Error(msg)}
function read(p){return fs.readFileSync(p,'utf8')}
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}

const ctx={window:{}};
vm.createContext(ctx);
vm.runInContext(read('data.js'),ctx,{filename:'data.js'});
vm.runInContext(read('zenebona-program.js'),ctx,{filename:'zenebona-program.js'});
vm.runInContext(read('program-taxonomy.js'),ctx,{filename:'program-taxonomy.js'});

const cfg=ctx.window.BMI_FINDER;
const taxonomy=ctx.window.BMI_PROGRAM_TAXONOMY;
assert(cfg&&Array.isArray(cfg.programs),'BMI_FINDER programs missing');
assert(taxonomy&&taxonomy.fixed&&Array.isArray(taxonomy.categories),'Six-category taxonomy missing');
assert(cfg.programs.length===28,`Expected 28 programs, got ${cfg.programs.length}`);

const ids=cfg.programs.map(p=>p.id);
assert(new Set(ids).size===ids.length,'Duplicate program ids detected');
const needIds=new Set((cfg.needs||[]).map(x=>x.id));
const interestIds=new Set((cfg.interests||[]).map(x=>x.id));
const catIds=new Set(taxonomy.categories.map(x=>x.id));
assert(Object.keys(taxonomy.fixed).length===28,`Expected 28 fixed taxonomy mappings, got ${Object.keys(taxonomy.fixed).length}`);

for(const p of cfg.programs){
  assert(taxonomy.fixed[p.id],`Missing primaryCategory6 mapping: ${p.id}`);
  assert(catIds.has(taxonomy.fixed[p.id]),`Unknown primaryCategory6 for ${p.id}: ${taxonomy.fixed[p.id]}`);
  for(const n of p.needs||[])assert(needIds.has(n),`Unknown need ${n} on ${p.id}`);
  for(const i of p.interests||[])assert(interestIds.has(i),`Unknown interest ${i} on ${p.id}`);
  assert(['bmi','bmi-partner','partner'].includes(p.relationship),`Invalid relationship on ${p.id}: ${p.relationship}`);
  assert(p.provider&&p.url&&p.sourceType,`Missing provider/url/sourceType on ${p.id}`);
}

/* Semantic relationship contract: every canonical movement/dance/music programme must be reachable
   from the user need that explicitly asks for dance, music, tradition or community movement. */
const movementCanonical=['zenebona','vilagfa','oromzene','napraforgocskak','kezdo-neptanc'];
for(const id of movementCanonical){
  const p=cfg.programs.find(x=>x.id===id);
  assert(p,`Canonical movement programme missing: ${id}`);
  assert(taxonomy.fixed[id]==='mozgas',`${id} must have primaryCategory6=mozgas`);
  assert((p.needs||[]).includes('tanc-hagyomany'),`${id} is in Mozgás, tánc és zene but is not reachable from tanc-hagyomany need`);
}

/* Catch future Zenebona-like semantic omissions without hard-coding every programme. */
for(const p of cfg.programs){
  if(taxonomy.fixed[p.id]!=='mozgas')continue;
  const text=norm([p.name,p.painPoint,p.outcome,p.why].join(' '));
  if(/zene|enek|tanc|dobol|ritmus|hagyomany/.test(text)){
    assert((p.needs||[]).includes('tanc-hagyomany'),`Semantic edge missing: ${p.id} -> tanc-hagyomany`);
  }
}

const canonicalExternal={
  zenebona:'https://zenebona.magyariskola.at',
  mos:'https://mos.magyariskola.at',
  vilagfa:'https://taltosdob.magyariskola.at',
  cserkeszet:'https://cserkesz.at/cserkesz-raj/',
  'kezdo-neptanc':'https://napraforgok.at/r%C3%B3lunk#kezdocsoport',
  napraforgocskak:'https://napraforgok.at/r%C3%B3lunk#napraforgocskak'
};
for(const [id,url] of Object.entries(canonicalExternal)){
  const p=cfg.programs.find(x=>x.id===id);
  assert(p,`External canonical programme missing: ${id}`);
  assert(p.url===url,`Canonical URL drift on ${id}: ${p.url}`);
  assert(p.relationship!=='bmi',`External canonical programme incorrectly marked bmi: ${id}`);
}

const teacherContracts={
  zenebona:['dapin hajnalka judit'],
  oromzene:['hupczik andrea'],
  vilagfa:['hupczik andrea'],
  mamut:['hierholcz anna','pecze adam'],
  napraforgocskak:['varga bernadette','veres tamas'],
  'kezdo-neptanc':['sipos tibor','orban dalma'],
  cserkeszet:['poser-piroska ildiko'],
  fotoklub:['banhalmi norbert','balogh david']
};
for(const [id,names] of Object.entries(teacherContracts)){
  const p=cfg.programs.find(x=>x.id===id);
  const t=norm([p?.teacher,p?.teacherContact].join(' '));
  for(const name of names)assert(t.includes(norm(name)),`Teacher edge missing: ${id} -> ${name}`);
}

/* Generated machine-readable graph must not drift from runtime source. */
if(fs.existsSync('programs.json')){
  const gen=JSON.parse(read('programs.json'));
  const gp=Array.isArray(gen.programs)?gen.programs:[];
  assert(gp.length===28,`programs.json expected 28 programs, got ${gp.length}`);
  const byId=new Map(gp.map(p=>[p.id,p]));
  for(const p of cfg.programs){
    const g=byId.get(p.id);
    assert(g,`programs.json missing ${p.id}`);
    assert(g.primaryCategory6===taxonomy.fixed[p.id],`Generated taxonomy drift on ${p.id}`);
    const a=[...(p.needs||[])].sort().join('|'),b=[...(g.needs||[])].sort().join('|');
    assert(a===b,`Generated need-edge drift on ${p.id}: runtime=[${a}] generated=[${b}]`);
    assert(g.url===p.url,`Generated canonical URL drift on ${p.id}`);
  }
}

if(fs.existsSync('teacher-program-audit.json')){
  const report=JSON.parse(read('teacher-program-audit.json'));
  assert(!Array.isArray(report.problems)||report.problems.length===0,`teacher-program-audit contains ${report.problems.length} problem(s)`);
}

console.log(`PASS relationship graph: ${cfg.programs.length} programs, ${needIds.size} needs, ${catIds.size} primary categories, canonical URLs and teacher edges consistent.`);
