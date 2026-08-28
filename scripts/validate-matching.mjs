import fs from 'node:fs';
import vm from 'node:vm';
const ctx={window:{}};vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==26)throw new Error('Expected canonical 26-program registry.');
if(!Array.isArray(cfg.needs)||cfg.needs.length!==10)throw new Error('Expected 10 user-need choices.');
const needs=cfg.needs.map(x=>x.id),days=['hetfo','kedd','szerda','csutortok','pentek','szombat','vasarnap','mindegy'],paces=cfg.pace.map(x=>x.id);
let combinations=0,exactStates=0,bmiAlternativeStates=0,externalFallbackStates=0;
function ageEligible(p,age){return age>=p.minAge&&age<=p.maxAge}
function dayEligible(p,day){if(day==='mindegy'||p.weekday==='rugalmas')return true;return(p.weekdays||[p.weekday]).includes(day)}
function paceEligible(p,pace){return pace==='mindegy'||p.pace===pace}
function needEligible(p,need){return Array.isArray(p.needs)&&p.needs.includes(need)}
function exact(p,age,need,day,pace){return ageEligible(p,age)&&needEligible(p,need)&&dayEligible(p,day)&&paceEligible(p,pace)}
function score(p,age,need,day,pace){if(!ageEligible(p,age)||!needEligible(p,need))return-1;let v=60;if(dayEligible(p,day))v+=25;if(paceEligible(p,pace))v+=15;if(p.relationship==='bmi')v+=2;return v}
function ranked(age,need,day,pace){const eligible=cfg.programs.filter(p=>ageEligible(p,age));const relevant=eligible.filter(p=>needEligible(p,need));const exactMatches=relevant.filter(p=>exact(p,age,need,day,pace)).sort((a,b)=>score(b,age,need,day,pace)-score(a,age,need,day,pace)||a.name.localeCompare(b.name,'hu'));const alternatives=relevant.filter(p=>!exact(p,age,need,day,pace)).sort((a,b)=>score(b,age,need,day,pace)-score(a,age,need,day,pace)||a.name.localeCompare(b.name,'hu'));const selected=exactMatches.length?exactMatches.slice(0,3):alternatives.slice(0,3);if(exactMatches.length&&selected.length<3){for(const p of alternatives){if(selected.length>=3)break;if(!selected.includes(p))selected.push(p)}}return{eligible,relevant,exactMatches,alternatives,selected,externalFallback:relevant.length===0}}
for(let age=0;age<=99;age++)for(const need of needs)for(const day of days)for(const pace of paces){combinations++;const r=ranked(age,need,day,pace);if(r.exactMatches.length)exactStates++;else if(r.relevant.length)bmiAlternativeStates++;else externalFallbackStates++;if(r.relevant.length&&!r.selected.length)throw new Error(`No BMI recommendation despite age+need fit: ${age}/${need}/${day}/${pace}`);if(!r.relevant.length&&r.selected.length)throw new Error(`Fallback state returned BMI program: ${age}/${need}/${day}/${pace}`);if(r.selected.length>3)throw new Error('More than 3 recommendations.');for(const p of r.selected){if(!ageEligible(p,age))throw new Error(`Age-invalid recommendation: ${p.id}/${age}`);if(!needEligible(p,need))throw new Error(`Need-invalid recommendation: ${p.id}/${need}`)}if(r.exactMatches.length&&r.selected.length&&!exact(r.selected[0],age,need,day,pace))throw new Error('Exact match not first')}
function assertAge(id,min,max){const p=cfg.programs.find(x=>x.id===id);if(!p)throw new Error(`Missing ${id}`);if(p.minAge!==min||p.maxAge!==max)throw new Error(`${id} age ${p.minAge}-${p.maxAge}, expected ${min}-${max}`);if(min>0&&ageEligible(p,min-1))throw new Error(`${id} accepts below min`);if(!ageEligible(p,min)||!ageEligible(p,max))throw new Error(`${id} excludes boundary`);if(max<99&&ageEligible(p,max+1))throw new Error(`${id} accepts above max`)}
const ages={borsofozde:[0,3],ovoda:[3,6],'ovoda-baden':[3,6],'iskola-baden':[7,8],aspern:[6,10],seestadt:[6,10],'schweden-1':[6,10],'schweden-2':[10,14],alapozo:[5,10],rajztabla:[10,16],varazsceruza:[9,14],becscraft:[6,15],'kicsi-svung':[8,13],mamut:[7,12],'gimi-svung':[14,18],filmes:[13,17],sakk:[6,99],fecskeklub:[8,14],vilagfa:[6,14],napraforgocskak:[6,15],cserkeszet:[5,22],fotoklub:[18,99],fokusz:[18,99],'kezdo-neptanc':[18,99],mos:[18,99],rekreacio:[18,99]};for(const [id,[min,max]] of Object.entries(ages))assertAge(id,min,max);
const schw1=cfg.programs.find(p=>p.id==='schweden-1'),schw2=cfg.programs.find(p=>p.id==='schweden-2');
if(schw1.when!=='Minden szombaton 10:00–12:00'||schw1.pace!=='rendszeres')throw new Error('Schwedenplatz 1 cadence mismatch');
if(schw2.when!=='Kéthetente szombatonként 12:00–14:00'||schw2.pace!=='rugalmas')throw new Error('Schwedenplatz 2 cadence mismatch');
if(!ranked(9,'magyar-nyelv','szombat','rendszeres').selected.some(p=>p.id==='schweden-1'))throw new Error('Age 9 Hungarian need must include Schwedenplatz 1');
if(ranked(9,'magyar-nyelv','szombat','rendszeres').selected.some(p=>p.id==='schweden-2'))throw new Error('Age 9 must not get Schwedenplatz 2');
if(!ranked(10,'magyar-nyelv','szombat','mindegy').relevant.some(p=>p.id==='schweden-1')||!ranked(10,'magyar-nyelv','szombat','mindegy').relevant.some(p=>p.id==='schweden-2'))throw new Error('Age 10 must fit both Schwedenplatz groups');
if(ranked(11,'magyar-nyelv','szombat','mindegy').relevant.some(p=>p.id==='schweden-1'))throw new Error('Age 11 must not get Schwedenplatz 1');
if(!ranked(11,'magyar-nyelv','szombat','mindegy').selected.some(p=>p.id==='schweden-2'))throw new Error('Age 11 must include Schwedenplatz 2');
for(const id of ['fokusz','mos','rekreacio'])if(cfg.programs.find(p=>p.id===id)?.relationship!=='bmi-partner')throw new Error(`${id} must be BMI partner`);
if(!dayEligible(cfg.programs.find(p=>p.id==='rekreacio'),'vasarnap'))throw new Error('ReKreáció must match Sunday');
if(combinations!==24000)throw new Error(`Expected 24000 states, got ${combinations}`);
if(exactStates===0||bmiAlternativeStates===0||externalFallbackStates===0)throw new Error('Need exact, BMI alternative and external fallback states');
console.log(`PASS: ${combinations} need-based selector states checked; all 26 hard age ranges, pain-point matching, BMI-first fallback, Sunday and partner semantics verified.`);