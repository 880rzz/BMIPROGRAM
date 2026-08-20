import fs from 'node:fs';
import vm from 'node:vm';

function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok){console.error('FAIL:',msg);process.exitCode=1}}
function hasScript(html,file){return new RegExp(`src=["']${file.replace('.','\\.')}(?:\\?[^"']*)?["']`).test(html)}

const ctx={window:{}};
vm.runInNewContext(read('data.js'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
assert(cfg&&Array.isArray(cfg.programs),'data.js must expose window.BMI_FINDER.programs');
if(!cfg||!Array.isArray(cfg.programs))process.exit(1);

const programs=cfg.programs;
assert(programs.length===22,`expected exactly 22 programs, got ${programs.length}`);
assert(cfg.sourcePolicy?.schoolYear==='2026/2027','sourcePolicy schoolYear must be 2026/2027');
assert(cfg.sourcePolicy?.canonicalOnly===true,'sourcePolicy canonicalOnly must be true');
assert(cfg.sourcePolicy?.excludePriorYearWix===true,'prior-year Wix pages must be excluded');

const ids=programs.map(p=>p.id),urls=programs.map(p=>p.url);
assert(new Set(ids).size===22,'program IDs must be unique');
assert(new Set(urls).size===22,'canonical program URLs must be unique');

const allowed=[
'https://www.magyariskola.at/event-details/kicsisvung-2026','https://www.magyariskola.at/event-details/mammut-2026','https://www.magyariskola.at/event-details/becscraft-2026','https://napraforgok.at/r%C3%B3lunk#napraforgocskak','https://www.magyariskola.at/event-details/magyarnyelv-schwedenplatz-2','https://cserkesz.at/cserkesz-raj/','https://www.magyariskola.at/event-details/magyarnyelv-szerda-2026','https://www.magyariskola.at/event-details/magyarnyelv-schwedenplatz-1','https://taltosdob.magyariskola.at','https://www.magyariskola.at/event-details/rajztabla-2026','https://www.magyariskola.at/event-details/borsofozde-2026','https://www.magyariskola.at/event-details/magyaroktatas-kedd-2026','https://www.magyariskola.at/event-details/ovoda-baden-2026','https://www.magyariskola.at/event-details/gimisvung-2026','https://www.magyariskola.at/event-details/fotoklub-2026','https://napraforgok.at/r%C3%B3lunk#kezdocsoport','https://www.magyariskola.at/event-details/alapozoterapia-2026','https://www.magyariskola.at/event-details/iskolabaden-2026','https://www.magyariskola.at/event-details/ovoda-2026','https://www.magyariskola.at/event-details/fokuszcsoport-2026','https://www.magyariskola.at/event-details/varazsceruza-2026','https://www.magyariskola.at/event-details/filmesmuhely-2026'
];
const sort=a=>[...a].sort();
assert(JSON.stringify(sort(urls))===JSON.stringify(sort(allowed)),'registry URL set must exactly equal the approved 22-link allowlist');

const weekdaySet=new Set(['hetfo','kedd','szerda','csutortok','pentek','szombat','rugalmas']);
for(const p of programs){
  assert(Number.isInteger(p.minAge)&&Number.isInteger(p.maxAge)&&p.minAge>=0&&p.maxAge<=99&&p.minAge<=p.maxAge,`invalid age range: ${p.id}`);
  assert(Array.isArray(p.interests)&&p.interests.length>0,`missing interests: ${p.id}`);
  assert(['hetkoznap','szombat'].includes(p.day),`invalid coarse day: ${p.id}`);
  assert(weekdaySet.has(p.weekday),`invalid exact weekday: ${p.id}`);
  assert(['rendszeres','rugalmas'].includes(p.pace),`invalid pace: ${p.id}`);
  assert(p.provider,`missing provider: ${p.id}`);
  if(p.weekday==='szombat')assert(p.day==='szombat',`Saturday program must use day=szombat: ${p.id}`);
  if(p.day==='szombat')assert(p.weekday==='szombat',`day=szombat requires weekday=szombat: ${p.id}`);
  if(['hetfo','kedd','szerda','csutortok','pentek','rugalmas'].includes(p.weekday))assert(p.day==='hetkoznap',`weekday program must use day=hetkoznap: ${p.id}`);
}

const cserk=programs.find(p=>p.id==='cserkeszet');
assert(cserk?.minAge===5&&cserk?.maxAge===22,'Cserkészet must cover ages 5–22');
assert(cserk?.provider==='72. sz. Széchenyi István Cserkészcsapat','Cserkészet provider must be the partner troop');
assert(programs.find(p=>p.id==='napraforgocskak')?.provider==='Napraforgók','Napraforgócskák provider must be Napraforgók');
assert(programs.find(p=>p.id==='kezdo-neptanc')?.provider==='Napraforgók','Adult beginner folk dance provider must be Napraforgók');
assert(programs.find(p=>p.id==='fokusz')?.weekday==='rugalmas','Fókusz must use weekday=rugalmas');
assert(!programs.some(p=>/haladó/i.test(p.name)&&/napraforg/i.test(p.name)),'Napraforgók haladó must not be in the fixed 22');
assert(programs.filter(p=>p.id==='vilagfa').length===1,'Világfa must be exactly one program');

const files=['data.js','app.js','catalog.js','index.html','foglalkozasok.html','korosztalyok.html','gyik.html','llms.txt','llms-full.txt'];
const combined=files.map(read).join('\n');
for(const bad of ['/event-details/mozgasfejlesztes','/event-details/rajztabla-schwedenplatz','/event-details/varazsceruza-schwedenplatz','/event-details/becs-craft-workshop-hetfo','/event-details/kicsi-svung-drama-foglalkozas-schwedenplatz-1','/event-details/gimi-svung-dramafoglalkozas-schwedenplatz','/event-details/filmes-muhely','/event-details/magyar-nyelv-tanitas-1'])assert(!combined.includes(bad),`legacy/stale value must not occur: ${bad}`);

const llms=read('llms-full.txt');
for(const url of allowed)assert(llms.includes(url),`llms-full.txt missing canonical URL: ${url}`);
assert((llms.match(/Canonical 2026\/27:/g)||[]).length===22,'llms-full.txt must enumerate exactly 22 canonical links');
assert(llms.includes('központi data.js registryjéből generált'),'llms-full.txt must identify itself as generated from data.js');

const app=read('app.js');
assert(app.includes('https://ungarischlernen.at'),'zero-match fallback must include Ungarisch Lernen');
assert(app.includes('https://amaped.at'),'zero-match fallback must include AMAPED');
assert(app.includes("cfg.interests,'interest'"),'interest choices must not be pre-filtered away');
assert(app.includes("cfg.days,'day'"),'day choices must not be pre-filtered away');
assert(app.includes("cfg.pace,'pace'"),'pace choices must not be pre-filtered away');
assert(app.includes('Regisztráció / jelentkezés'),'every exact result must render a registration CTA');

const catalog=read('catalog.js');
assert(catalog.includes("'numberOfItems':22"),'catalog Schema must declare 22 items');
assert(catalog.includes('Részletek és jelentkezés'),'catalog cards must render registration CTA');
assert(catalog.includes('providerSchema'),'catalog Schema must derive provider from registry');
assert(catalog.includes('data-weekday'),'catalog cards must derive weekday filters from registry metadata');

const listPage=read('foglalkozasok.html');
assert(hasScript(listPage,'data.js')&&hasScript(listPage,'catalog.js'),'program catalog must render from canonical registry');
for(const d of ['hetfo','kedd','szerda','csutortok','pentek','szombat','rugalmas'])assert(listPage.includes(`data-filter="${d}"`),`program catalog missing weekday filter: ${d}`);
const agePage=read('korosztalyok.html');
assert(hasScript(agePage,'data.js')&&hasScript(agePage,'catalog.js'),'age catalog must render from canonical registry');
const home=read('index.html');
assert(hasScript(home,'data.js')&&hasScript(home,'app.js'),'homepage finder must render from canonical registry');

const css=read('styles.css');
assert(!/\.filters\s*\{\s*display\s*:\s*none/i.test(css),'filters must not be globally hidden');
assert(css.includes('.skip-link'),'skip-link accessibility style must exist');

assert(home.includes('<b>5+</b><span>helyszín</span>'),'homepage location stat must be static and current');
assert(home.includes('"@type":"WebSite"'),'homepage Schema must include WebSite');
assert(home.includes('"foundingDate":"1987-09"'),'homepage entity must include founding date');

if(process.exitCode)process.exit(process.exitCode);
console.log('PASS: BMIPROGRAM canonical integrity checks succeeded.');
