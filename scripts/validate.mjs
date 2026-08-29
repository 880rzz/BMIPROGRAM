import fs from 'node:fs';
import vm from 'node:vm';
function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok){console.error('FAIL:',msg);process.exitCode=1}}
const ctx={window:{}};
vm.runInNewContext(read('data.js'),ctx,{filename:'data.js'});
vm.runInNewContext(read('zenebona-program.js'),ctx,{filename:'zenebona-program.js'});
const cfg=ctx.window.BMI_FINDER;
assert(cfg&&Array.isArray(cfg.programs),'program registry missing');
if(!cfg||!Array.isArray(cfg.programs))process.exit(1);
const programs=cfg.programs,byId=id=>programs.find(p=>p.id===id);
assert(programs.length===28,`expected exactly 28 activities, got ${programs.length}`);
assert(new Set(programs.map(p=>p.id)).size===programs.length,'activity IDs must be unique');
assert(new Set(programs.map(p=>p.url)).size===programs.length,'canonical activity URLs must be unique');
assert(cfg.sourcePolicy?.schoolYear==='2026/2027','school year must be 2026/2027');
assert(Array.isArray(cfg.needs)&&cfg.needs.length===10,'exactly 10 user-need choices must exist');
const needIds=new Set(cfg.needs.map(x=>x.id));
const weekdaySet=new Set(['hetfo','kedd','szerda','csutortok','pentek','szombat','vasarnap']);
const scheduleModes=new Set(['fixed','appointment','irregular','arranged']);
for(const p of programs){
  assert(Number.isInteger(p.minAge)&&Number.isInteger(p.maxAge)&&p.minAge>=0&&p.maxAge<=99&&p.minAge<=p.maxAge,`invalid age range: ${p.id}`);
  assert(p.ageText,`missing public age label: ${p.id}`);
  assert(Array.isArray(p.needs)&&p.needs.length>0&&p.needs.every(n=>needIds.has(n)),`invalid needs: ${p.id}`);
  assert(typeof p.painPoint==='string'&&p.painPoint.length>=35,`missing/weak painPoint: ${p.id}`);
  assert(typeof p.outcome==='string'&&p.outcome.length>=30,`missing/weak outcome: ${p.id}`);
  const scheduleMode=p.scheduleMode||'fixed';
  assert(scheduleModes.has(scheduleMode),`invalid scheduleMode: ${p.id}`);
  if(scheduleMode==='appointment'){
    assert(p.weekday==null,`appointment weekday must be empty: ${p.id}`);
    assert(Array.isArray(p.weekdays)&&p.weekdays.length===0,`appointment weekdays must be empty: ${p.id}`);
    assert(p.exactTodayEligible===false,`appointment must be excluded from exact-today: ${p.id}`);
  }else{
    assert(weekdaySet.has(p.weekday),`invalid weekday: ${p.id}`);
    assert(Array.isArray(p.weekdays)&&p.weekdays.includes(p.weekday)&&p.weekdays.every(d=>weekdaySet.has(d)),`invalid weekdays: ${p.id}`);
    if(scheduleMode==='arranged')assert(p.exactTodayEligible===false,`arranged schedule must be excluded from exact-today: ${p.id}`);
    if(scheduleMode==='irregular'&&(!Array.isArray(p.eventDates)||!p.eventDates.length))assert(p.exactTodayEligible===false,`undated irregular schedule must be excluded from exact-today: ${p.id}`);
  }
  assert(['rendszeres','rugalmas'].includes(p.pace),`invalid pace: ${p.id}`);
  assert(['bmi','bmi-partner','partner'].includes(p.relationship),`invalid relationship: ${p.id}`);
  assert(p.provider&&p.sourceType&&p.url,`missing source/provider/url: ${p.id}`);
}
const z=byId('zenebona');
assert(z,'Zenebona missing');
if(z){
  assert(z.minAge===0&&z.maxAge===3,'Zenebona age must be 0–3');
  assert(z.weekday==='szerda'&&z.pace==='rendszeres','Zenebona schedule classification mismatch');
  assert(z.url==='https://zenebona.magyariskola.at','Zenebona canonical URL mismatch');
  assert(z.when.includes('10:00–11:15'),'Zenebona time missing');
  assert(z.location.includes('Fleschgasse 15/1/1'),'Zenebona location missing');
  assert(z.fee==='150 € / 10 alkalom','Zenebona fee mismatch');
  assert(z.paymentDeadline==='2026. október 1.','Zenebona payment deadline mismatch');
  assert(z.teacher.includes('Dapin Hajnalka Judit'),'Zenebona teacher missing');
  assert(Array.isArray(z.eventDates)&&z.eventDates.length===10,'Zenebona exact dates missing');
}
const o=byId('oromzene');
assert(o,'Örömzene missing');
if(o){
  assert(o.url==='https://www.magyariskola.at/event-details/oromzene-2026','Örömzene canonical URL mismatch');
  assert(o.relationship==='bmi-partner','Örömzene must be BMI Partner Program');
  assert(o.scheduleMode==='irregular','Örömzene must use irregular schedule mode');
  assert(o.weekday==='szombat'&&o.weekdays.includes('vasarnap'),'Örömzene weekday classification mismatch');
  assert(o.when.includes('18:00'),'Örömzene time missing');
  assert(Array.isArray(o.eventDates)&&o.eventDates.includes('2026-09-27')&&o.eventDates.includes('2027-05-22'),'Örömzene exact confirmed dates missing');
}
const app=read('app.js');
const index=read('index.html');
assert(/schoolFreeDates/.test(app),'runtime calendar guard must include schoolFreeDates');
assert(/blockedEventDates/.test(app),'runtime today logic must honor blockedEventDates');
assert(/p\.exactTodayEligible===false/.test(app),'runtime today logic must honor explicit exactTodayEligible=false');
assert(/routing\.openstreetmap\.de/.test(app)&&/profile=mode==='walk'\?'foot':'car'/.test(app),'runtime must use distinct OSM car/foot route profiles');
assert(/countrycode=AT/.test(app),'destination/user Austrian geocoding must use an AT filter');
assert(/state\.origin&&!p\._travel\)return false/.test(app),'missing route must not certify exact-today reachability');
assert(/p\._travel\.estimated\)return false/.test(app),'fallback estimate must not certify exact-today reachability');
assert(/app\.js\?v=20260830-reality-route-v3/.test(index),'index must cache-bust the current reality-route runtime');
if(process.exitCode)process.exit(1);
console.log('PASS: 28 current programs validated with schedule, real-route, fail-safe reachability and cache contracts.');