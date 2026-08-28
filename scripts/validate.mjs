import fs from 'node:fs';
import vm from 'node:vm';
function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok){console.error('FAIL:',msg);process.exitCode=1}}
function hasScript(html,file){return new RegExp(`src=["']${file.replace('.','\\.')}(?:\\?[^"']*)?["']`).test(html)}
const ctx={window:{}};vm.runInNewContext(read('data.js'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
assert(cfg&&Array.isArray(cfg.programs),'data.js must expose window.BMI_FINDER.programs');
if(!cfg||!Array.isArray(cfg.programs))process.exit(1);
const programs=cfg.programs,byId=id=>programs.find(p=>p.id===id);
assert(programs.length===26,`expected exactly 26 activities, got ${programs.length}`);
assert(new Set(programs.map(p=>p.id)).size===26,'activity IDs must be unique');
assert(new Set(programs.map(p=>p.url)).size===26,'canonical activity URLs must be unique');
assert(cfg.sourcePolicy?.schoolYear==='2026/2027','school year must be 2026/2027');
assert(cfg.sourcePolicy?.canonicalOnly===true,'registry must be canonical-only');
assert(Array.isArray(cfg.needs)&&cfg.needs.length===10,'exactly 10 user-need choices must exist');
const needIds=new Set(cfg.needs.map(x=>x.id));
assert(needIds.size===10,'need IDs must be unique');
assert(cfg.days.some(x=>x.id==='vasarnap'),'Sunday selector must exist');
const weekdaySet=new Set(['hetfo','kedd','szerda','csutortok','pentek','szombat','vasarnap','rugalmas']);
for(const p of programs){
  assert(Number.isInteger(p.minAge)&&Number.isInteger(p.maxAge)&&p.minAge>=0&&p.maxAge<=99&&p.minAge<=p.maxAge,`invalid age range: ${p.id}`);
  assert(p.ageText,`missing public age label: ${p.id}`);
  assert(Array.isArray(p.interests)&&p.interests.length>0,`missing interests: ${p.id}`);
  assert(Array.isArray(p.needs)&&p.needs.length>0,`missing needs: ${p.id}`);
  assert(p.needs.every(n=>needIds.has(n)),`unknown need on ${p.id}`);
  assert(typeof p.painPoint==='string'&&p.painPoint.length>=35,`missing/weak painPoint: ${p.id}`);
  assert(typeof p.outcome==='string'&&p.outcome.length>=30,`missing/weak outcome: ${p.id}`);
  assert(weekdaySet.has(p.weekday),`invalid weekday: ${p.id}`);
  assert(Array.isArray(p.weekdays)&&p.weekdays.length>0&&p.weekdays.every(d=>weekdaySet.has(d)),`invalid weekdays[]: ${p.id}`);
  assert(p.weekdays.includes(p.weekday),`primary weekday missing from weekdays[]: ${p.id}`);
  assert(['rendszeres','rugalmas'].includes(p.pace),`invalid pace: ${p.id}`);
  assert(['bmi','bmi-partner','partner'].includes(p.relationship),`invalid relationship: ${p.id}`);
  assert(p.provider&&p.sourceType&&p.url,`missing source/provider/url: ${p.id}`);
}
const exactAges={borsofozde:[0,3],ovoda:[3,6],'ovoda-baden':[3,6],'iskola-baden':[7,8],aspern:[6,10],seestadt:[6,10],'schweden-1':[6,10],'schweden-2':[10,14],alapozo:[5,10],rajztabla:[10,16],varazsceruza:[9,14],becscraft:[6,15],'kicsi-svung':[8,13],mamut:[7,12],'gimi-svung':[14,18],filmes:[13,17],sakk:[6,99],fecskeklub:[8,14],vilagfa:[6,14],napraforgocskak:[6,15],cserkeszet:[5,22],fotoklub:[18,99],fokusz:[18,99],'kezdo-neptanc':[18,99],mos:[18,99],rekreacio:[18,99]};
for(const [id,[min,max]] of Object.entries(exactAges)){const p=byId(id);assert(p,`missing program: ${id}`);if(p)assert(p.minAge===min&&p.maxAge===max,`${id} must stay ${min}-${max}`)}
assert(byId('schweden-1')?.when==='Minden szombaton 10:00–12:00'&&byId('schweden-1')?.pace==='rendszeres','Schwedenplatz 1 cadence mismatch');
assert(byId('schweden-2')?.when==='Kéthetente szombatonként 12:00–14:00'&&byId('schweden-2')?.pace==='rugalmas','Schwedenplatz 2 cadence mismatch');
assert(byId('fokusz')?.needs.includes('fokusz-jollet'),'Fókusz need mismatch');
assert(byId('mos')?.needs.length===1&&byId('mos')?.needs[0]==='szakmai-office','MOS need mismatch');
assert(byId('sakk')?.needs.includes('logika-koncentracio'),'Sakk need mismatch');
for(const id of ['fokusz','mos','rekreacio'])assert(byId(id)?.relationship==='bmi-partner',`${id} must be BMI Partner Program`);
assert(byId('rekreacio')?.weekday==='vasarnap','ReKreáció must be Sunday');
const index=read('index.html'),all=read('foglalkozasok.html'),ages=read('korosztalyok.html'),catalog=read('catalog.js');
assert(hasScript(index,'data.js')&&hasScript(index,'app.js'),'index must load data/app');
assert(hasScript(all,'data.js')&&hasScript(all,'catalog.js'),'catalog must load data/catalog');
assert(hasScript(ages,'data.js')&&hasScript(ages,'catalog.js'),'age page must load data/catalog');
assert(/26 lehetőség/.test(all)&&/26 programot/.test(all),'catalog copy must state 26 programs');
assert(all.includes('data-filter="vasarnap"'),'catalog must expose Sunday filter');
assert(catalog.includes("detail('Milyen helyzetre?',p.painPoint)")&&catalog.includes("detail('Mit ad?',p.outcome)"),'catalog must expose pain point and outcome');
if(process.exitCode)process.exit(1);
console.log('PASS: 26 canonical programs have exact ages, valid needs, explicit pain points/outcomes, relationship semantics and catalog wiring.');