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
const byId=id=>programs.find(p=>p.id===id);

assert(programs.length===26,`expected exactly 26 activities, got ${programs.length}`);
assert(new Set(programs.map(p=>p.id)).size===26,'activity IDs must be unique');
assert(new Set(programs.map(p=>p.url)).size===26,'canonical activity URLs must be unique');
assert(cfg.sourcePolicy?.schoolYear==='2026/2027','school year must be 2026/2027');
assert(cfg.sourcePolicy?.canonicalOnly===true,'registry must be canonical-only');
assert(cfg.interests.some(x=>x.id==='jollet'),'wellbeing/focus interest must exist');
assert(cfg.days.some(x=>x.id==='vasarnap'),'Sunday selector must exist');

const weekdaySet=new Set(['hetfo','kedd','szerda','csutortok','pentek','szombat','vasarnap','rugalmas']);
for(const p of programs){
  assert(Number.isInteger(p.minAge)&&Number.isInteger(p.maxAge)&&p.minAge>=0&&p.maxAge<=99&&p.minAge<=p.maxAge,`invalid age range: ${p.id}`);
  assert(p.ageText,`missing public age label: ${p.id}`);
  assert(Array.isArray(p.interests)&&p.interests.length>0,`missing interests: ${p.id}`);
  assert(weekdaySet.has(p.weekday),`invalid weekday: ${p.id}`);
  assert(Array.isArray(p.weekdays)&&p.weekdays.length>0&&p.weekdays.every(d=>weekdaySet.has(d)),`invalid weekdays[]: ${p.id}`);
  assert(p.weekdays.includes(p.weekday),`primary weekday missing from weekdays[]: ${p.id}`);
  assert(['rendszeres','rugalmas'].includes(p.pace),`invalid pace: ${p.id}`);
  assert(['bmi','bmi-partner','partner'].includes(p.relationship),`invalid relationship: ${p.id}`);
  assert(p.provider,`missing provider label: ${p.id}`);
  assert(p.sourceType,`missing source type: ${p.id}`);
  assert(p.url,`missing canonical URL: ${p.id}`);
}

const exactAges={
  borsofozde:[0,3],ovoda:[3,6],'ovoda-baden':[3,6],'iskola-baden':[7,8],aspern:[6,10],seestadt:[6,10],
  'schweden-1':[6,10],'schweden-2':[10,14],alapozo:[5,10],rajztabla:[10,16],varazsceruza:[9,14],becscraft:[6,15],
  'kicsi-svung':[8,13],mamut:[7,12],'gimi-svung':[14,18],filmes:[13,17],sakk:[6,99],fecskeklub:[8,14],vilagfa:[6,14],
  napraforgocskak:[6,15],cserkeszet:[5,22],fotoklub:[18,99],fokusz:[18,99],'kezdo-neptanc':[18,99],mos:[18,99],rekreacio:[18,99]
};
for(const [id,[min,max]] of Object.entries(exactAges)){
  const p=byId(id);assert(p,`missing program: ${id}`);
  if(p)assert(p.minAge===min&&p.maxAge===max,`${id} must stay ${min}-${max}`);
}

assert(byId('schweden-1')?.when==='Minden szombaton 10:00–12:00','Schwedenplatz 1 must run every Saturday 10:00–12:00');
assert(byId('schweden-1')?.pace==='rendszeres','Schwedenplatz 1 must be regular');
assert(byId('schweden-2')?.when==='Kéthetente szombatonként 12:00–14:00','Schwedenplatz 2 must run every two weeks Saturday 12:00–14:00');
assert(byId('schweden-2')?.pace==='rugalmas','Schwedenplatz 2 must be classified as less frequent/flexible');
assert(byId('fokusz')?.interests.length===1&&byId('fokusz')?.interests[0]==='jollet','Fókusz must use wellbeing/focus interest only');
assert(byId('vilagfa')?.minAge===6&&byId('vilagfa')?.maxAge===14,'Világfa must not be recommended as an adult program');
assert(byId('fecskeklub')?.minAge===8&&byId('fecskeklub')?.maxAge===14,'Fecske Klub must stay 8–14');
assert(byId('rajztabla')?.minAge===10&&byId('rajztabla')?.maxAge===16,'RAJZTÁBLA must stay 10–16');
assert(byId('gimi-svung')?.minAge===14&&byId('gimi-svung')?.maxAge===18,'Gimi Svung must stay 14–18');
assert(byId('napraforgocskak')?.minAge===6&&byId('napraforgocskak')?.maxAge===15,'Napraforgócskák must stay 6–15');
for(const id of ['fokusz','mos','rekreacio'])assert(byId(id)?.relationship==='bmi-partner',`${id} must be BMI Partner Program`);
assert(byId('rekreacio')?.weekday==='vasarnap','ReKreáció must be Sunday');

const allowedUrls=new Set([
'https://www.magyariskola.at/event-details/borsofozde-2026','https://www.magyariskola.at/event-details/ovoda-2026','https://www.magyariskola.at/event-details/ovoda-baden-2026','https://www.magyariskola.at/event-details/iskolabaden-2026','https://www.magyariskola.at/event-details/magyaroktatas-kedd-2026','https://www.magyariskola.at/event-details/magyarnyelv-szerda-2026','https://www.magyariskola.at/event-details/magyarnyelv-schwedenplatz-1','https://www.magyariskola.at/event-details/magyarnyelv-schwedenplatz-2','https://www.magyariskola.at/event-details/alapozoterapia-2026','https://www.magyariskola.at/event-details/rajztabla-2026','https://www.magyariskola.at/event-details/varazsceruza-2026','https://www.magyariskola.at/event-details/becscraft-2026','https://www.magyariskola.at/event-details/kicsisvung-2026','https://www.magyariskola.at/event-details/mammut-2026','https://www.magyariskola.at/event-details/gimisvung-2026','https://www.magyariskola.at/event-details/filmesmuhely-2026','https://www.magyariskola.at/event-details/sakk-2026','https://www.magyariskola.at/event-details/fecskeklub-2026','https://taltosdob.magyariskola.at','https://napraforgok.at/r%C3%B3lunk#napraforgocskak','https://cserkesz.at/cserkesz-raj/','https://www.magyariskola.at/event-details/fotoklub-2026','https://www.magyariskola.at/event-details/fokuszcsoport-2026','https://napraforgok.at/r%C3%B3lunk#kezdocsoport','https://mos.magyariskola.at','https://www.magyariskola.at/event-details/rekreacio-2026'
]);
assert(programs.every(p=>allowedUrls.has(p.url))&&allowedUrls.size===26,'registry URLs must equal approved 26-link allowlist');

const index=read('index.html'),all=read('foglalkozasok.html'),ages=read('korosztalyok.html');
assert(hasScript(index,'data.js')&&hasScript(index,'app.js'),'index must load canonical data and recommender');
assert(hasScript(all,'data.js')&&hasScript(all,'catalog.js'),'catalog must load canonical data and renderer');
assert(hasScript(ages,'data.js')&&hasScript(ages,'catalog.js'),'age page must load canonical data and renderer');
assert(/26 lehetőség/.test(all)&&/26 programot/.test(all),'catalog copy must state 26 programs');
assert(all.includes('data-filter="vasarnap"'),'catalog must expose Sunday filter');
assert(!all.includes('25 foglalkozás')&&!all.includes('25 lehetőség'),'stale 25-program copy must be removed from catalog');

if(process.exitCode)process.exit(1);
console.log('PASS: canonical 26-program registry, exact hard age ranges, partner semantics, URLs and catalog wiring validated.');
