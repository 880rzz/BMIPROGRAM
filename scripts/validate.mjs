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

assert(programs.length===22,`expected exactly 22 programs, got ${programs.length}`);
assert(cfg.sourcePolicy?.schoolYear==='2026/2027','sourcePolicy schoolYear must be 2026/2027');
assert(cfg.sourcePolicy?.canonicalOnly===true,'sourcePolicy canonicalOnly must be true');
assert(cfg.sourcePolicy?.excludePriorYearWix===true,'prior-year Wix pages must be excluded');
assert(cfg.sourcePolicy?.verifiedFromCurrentLinks===true,'registry must be marked verified from current 2026/27 links');

const ids=programs.map(p=>p.id),urls=programs.map(p=>p.url);
assert(new Set(ids).size===22,'program IDs must be unique');
assert(new Set(urls).size===22,'canonical program URLs must be unique');
const allowed=['https://www.magyariskola.at/event-details/kicsisvung-2026','https://www.magyariskola.at/event-details/mammut-2026','https://www.magyariskola.at/event-details/becscraft-2026','https://napraforgok.at/r%C3%B3lunk#napraforgocskak','https://www.magyariskola.at/event-details/magyarnyelv-schwedenplatz-2','https://cserkesz.at/cserkesz-raj/','https://www.magyariskola.at/event-details/magyarnyelv-szerda-2026','https://www.magyariskola.at/event-details/magyarnyelv-schwedenplatz-1','https://taltosdob.magyariskola.at','https://www.magyariskola.at/event-details/rajztabla-2026','https://www.magyariskola.at/event-details/borsofozde-2026','https://www.magyariskola.at/event-details/magyaroktatas-kedd-2026','https://www.magyariskola.at/event-details/ovoda-baden-2026','https://www.magyariskola.at/event-details/gimisvung-2026','https://www.magyariskola.at/event-details/fotoklub-2026','https://napraforgok.at/r%C3%B3lunk#kezdocsoport','https://www.magyariskola.at/event-details/alapozoterapia-2026','https://www.magyariskola.at/event-details/iskolabaden-2026','https://www.magyariskola.at/event-details/ovoda-2026','https://www.magyariskola.at/event-details/fokuszcsoport-2026','https://www.magyariskola.at/event-details/varazsceruza-2026','https://www.magyariskola.at/event-details/filmesmuhely-2026'];
const sort=a=>[...a].sort();
assert(JSON.stringify(sort(urls))===JSON.stringify(sort(allowed)),'registry URL set must exactly equal the approved 22-link allowlist');

const weekdaySet=new Set(['hetfo','kedd','szerda','csutortok','pentek','szombat','rugalmas']);
for(const p of programs){
  assert(Number.isInteger(p.minAge)&&Number.isInteger(p.maxAge)&&p.minAge>=0&&p.maxAge<=99&&p.minAge<=p.maxAge,`invalid age range: ${p.id}`);
  assert(Array.isArray(p.interests)&&p.interests.length>0,`missing interests: ${p.id}`);
  assert(['hetkoznap','szombat'].includes(p.day),`invalid coarse day: ${p.id}`);
  assert(weekdaySet.has(p.weekday),`invalid exact weekday: ${p.id}`);
  assert(Array.isArray(p.weekdays)&&p.weekdays.length>0&&p.weekdays.every(d=>weekdaySet.has(d)),`invalid weekdays array: ${p.id}`);
  assert(p.weekdays.includes(p.weekday),`primary weekday must be present in weekdays[]: ${p.id}`);
  assert(['rendszeres','rugalmas'].includes(p.pace),`invalid pace: ${p.id}`);
  assert(p.provider,`missing provider: ${p.id}`);
  assert(p.sourceType,`missing sourceType: ${p.id}`);
  if(p.provider==='BMI')assert(p.sourceType==='Wix Events 2026/27',`BMI record must be sourced from current Wix Events: ${p.id}`);
  if(p.day==='szombat')assert(p.weekdays.every(d=>d==='szombat'),`Saturday coarse day cannot include weekday values: ${p.id}`);
  if(p.weekdays.some(d=>d!=='szombat'))assert(p.day==='hetkoznap',`weekday/rugalmas program must use day=hetkoznap: ${p.id}`);
}

// Direct current-source invariants. Never resolve these from older Wix years.
assert(byId('kicsi-svung')?.minAge===8&&byId('kicsi-svung')?.maxAge===13&&byId('kicsi-svung')?.weekday==='hetfo'&&byId('kicsi-svung')?.when==='Hétfőnként 16:30–18:00','Kicsi Svung must stay 8–13, Monday 16:30–18:00');
assert(byId('kicsi-svung')?.sourceNote,'Kicsi Svung current-source conflict must remain documented');
assert(byId('mamut')?.minAge===7&&byId('mamut')?.maxAge===12&&byId('mamut')?.weekday==='csutortok','maMUT must stay 7–12, Thursday');
assert(byId('schweden-1')?.minAge===10&&byId('schweden-1')?.maxAge===14&&byId('schweden-1')?.teacher==='Kiss Ágnes'&&byId('schweden-1')?.when.includes('10:00–12:00'),'Schwedenplatz group 1 must stay 10–14 with Kiss Ágnes, 10:00–12:00');
assert(byId('schweden-2')?.minAge===10&&byId('schweden-2')?.maxAge===14&&byId('schweden-2')?.teacher==='Kiss Ágnes'&&byId('schweden-2')?.when.includes('12:00–14:00'),'Schwedenplatz group 2 must stay 10–14 with Kiss Ágnes, 12:00–14:00');
assert(byId('alapozo')?.minAge===5&&byId('alapozo')?.maxAge===10&&JSON.stringify(byId('alapozo')?.weekdays)===JSON.stringify(['kedd','csutortok'])&&byId('alapozo')?.when==='Kedden és csütörtökön 13:30–15:00','Alapozó must stay 5–10, Tuesday + Thursday 13:30–15:00');
assert(byId('alapozo')?.firstDate==='2026. szeptember 15.','Alapozó first date must stay Sep 15, 2026');
assert(byId('rajztabla')?.weekday==='hetfo'&&byId('rajztabla')?.when==='Minden hétfőn 16:30–18:00','RAJZTÁBLA must stay Monday 16:30–18:00');
assert(byId('rajztabla')?.sourceNote,'RAJZTÁBLA open-ended 10+ source range must remain documented');
assert(byId('varazsceruza')?.minAge===9&&byId('varazsceruza')?.maxAge===14,'Varázsceruza must stay 9–14');
assert(byId('iskola-baden')?.minAge===7&&byId('iskola-baden')?.maxAge===8&&/Makfalvi Rita/.test(byId('iskola-baden')?.teacher||''),'Baden school must stay 7–8 with Makfalvi Rita');
assert(byId('filmes')?.minAge===13&&byId('filmes')?.maxAge===17&&byId('filmes')?.when==='Minden szerdán 15:30–17:00','Filmes Műhely must stay 13–17, Wednesday 15:30–17:00');
assert(byId('aspern')?.sourceNote,'Aspern current-source time conflict must remain documented');
assert(byId('gimi-svung')?.ageRangeOperational===true&&byId('gimi-svung')?.sourceNote,'Gimi operational numeric age range must remain explicitly documented');
assert(byId('vilagfa')?.ageRangeComposite===true&&/6–14/.test(byId('vilagfa')?.ageText||'')&&byId('vilagfa')?.fee==='20 € / gyermek / alkalom'&&byId('vilagfa')?.teacher==='Hupczik Andrea'&&byId('vilagfa')?.sourceNote,'Világfa composite child/adult semantics and current-source date conflict must remain explicit');
assert(byId('napraforgocskak')?.provider==='Napraforgók'&&byId('napraforgocskak')?.ageRangeOperational===true&&byId('napraforgocskak')?.sourceNote&&/Varga Bernadette/.test(byId('napraforgocskak')?.teacher||''),'Napraforgócskák must preserve partner-source semantics and operational age range');
assert(byId('kezdo-neptanc')?.provider==='Napraforgók'&&byId('kezdo-neptanc')?.minAge===18&&byId('kezdo-neptanc')?.ageRangeOperational===true&&byId('kezdo-neptanc')?.sourceNote,'Adult beginner folk dance must use explicit operational adult classification');
assert(byId('cserkeszet')?.minAge===5&&byId('cserkeszet')?.maxAge===22&&byId('cserkeszet')?.provider==='72. sz. Széchenyi István Cserkészcsapat','Cserkészet must cover partner-published ages 5–22');
assert(byId('fokusz')?.weekday==='rugalmas'&&/Horányi Bori/.test(byId('fokusz')?.teacher||''),'Fókusz must remain flexible-day and identify Horányi Bori');
assert(!programs.some(p=>/haladó/i.test(p.name)&&/napraforg/i.test(p.name)),'Napraforgók haladó must not be in the fixed 22');
assert(programs.filter(p=>p.id==='vilagfa').length===1,'Világfa must be exactly one program');

const files=['data.js','app.js','catalog.js','index.html','foglalkozasok.html','korosztalyok.html','gyik.html','llms.txt','llms-full.txt'];
const combined=files.map(read).join('\n');
for(const bad of ['/event-details/mozgasfejlesztes','/event-details/rajztabla-schwedenplatz','/event-details/varazsceruza-schwedenplatz','/event-details/becs-craft-workshop-hetfo','/event-details/kicsi-svung-drama-foglalkozas-schwedenplatz-1','/event-details/gimi-svung-dramafoglalkozas-schwedenplatz','/event-details/filmes-muhely','/event-details/magyar-nyelv-tanitas-1'])assert(!combined.includes(bad),`legacy/stale value must not occur: ${bad}`);

// LLM discovery must point to the single source, not duplicate the 22 records.
const llms=read('llms-full.txt');
assert(llms.includes('https://programvalaszto.magyariskola.at/data.js'),'llms-full.txt must point directly to canonical data.js');
assert(llms.includes('egyetlen programadat-forrást'),'llms-full.txt must explicitly describe single-source architecture');
assert(llms.includes('Korábbi tanévek Wix eseményoldalai teljesen kizártak'),'llms-full.txt must forbid prior-year Wix sources');
assert(llms.includes('ageRangeOperational')&&llms.includes('ageRangeComposite'),'llms-full.txt must explain operational/composite age semantics');
assert(!llms.includes('Canonical 2026/27:'),'llms-full.txt must not duplicate the 22 program records');

const app=read('app.js');
assert(app.includes('https://ungarischlernen.at'),'zero-match fallback must include Ungarisch Lernen');
assert(app.includes('https://amaped.at'),'zero-match fallback must include AMAPED');
assert(app.includes("cfg.interests,'interest'"),'interest choices must not be pre-filtered away');
assert(app.includes("cfg.days,'day'"),'day choices must not be pre-filtered away');
assert(app.includes("cfg.pace,'pace'"),'pace choices must not be pre-filtered away');
assert(app.includes("p.weekday==='rugalmas'"),'flexible-day programs must not be excluded by the day preference');
assert(app.includes('Regisztráció / jelentkezés'),'every exact result must render a registration CTA');
assert(app.includes("meta('Helyszín'"), 'finder results must expose verified location metadata when available');
assert(app.includes("meta('Hozzájárulási díj'"), 'finder results must expose verified contribution fee when available');

const catalog=read('catalog.js');
assert(catalog.includes("'numberOfItems':22"),'catalog Schema must declare 22 items');
assert(catalog.includes('Részletek és jelentkezés'),'catalog cards must render registration CTA');
assert(catalog.includes('providerSchema'),'catalog Schema must derive provider from registry');
assert(catalog.includes('data-weekdays'),'catalog cards must derive multi-day filters from registry metadata');
assert(catalog.includes('Hozzájárulási díj'),'catalog cards must expose verified contribution fees when known');

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
console.log('PASS: BMIPROGRAM canonical 2026/27 integrity checks succeeded.');
