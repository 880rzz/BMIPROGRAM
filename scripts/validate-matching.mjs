import fs from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==26)throw new Error('Expected canonical 26-program registry.');

const interests=cfg.interests.map(x=>x.id);
const days=['hetfo','kedd','szerda','csutortok','pentek','szombat','vasarnap','mindegy'];
const paces=cfg.pace.map(x=>x.id);
let combinations=0;
let exactStates=0;
let bmiAlternativeStates=0;
let externalFallbackStates=0;

function ageEligible(p,age){return age>=p.minAge&&age<=p.maxAge;}
function dayEligible(p,day){if(day==='mindegy'||p.weekday==='rugalmas')return true;return(p.weekdays||[p.weekday]).includes(day);}
function paceEligible(p,pace){return pace==='mindegy'||p.pace===pace;}
function interestEligible(p,interest){return p.interests.includes(interest);}
function exact(p,age,interest,day,pace){return ageEligible(p,age)&&interestEligible(p,interest)&&dayEligible(p,day)&&paceEligible(p,pace);}
function score(p,age,interest,day,pace){
  if(!ageEligible(p,age)||!interestEligible(p,interest))return-1;
  let value=60;
  if(dayEligible(p,day))value+=25;
  if(paceEligible(p,pace))value+=15;
  if(p.relationship==='bmi'||p.provider==='BMI')value+=2;
  return value;
}
function ranked(age,interest,day,pace){
  const eligible=cfg.programs.filter(p=>ageEligible(p,age));
  const relevant=eligible.filter(p=>interestEligible(p,interest));
  const exactMatches=relevant.filter(p=>exact(p,age,interest,day,pace)).sort((a,b)=>score(b,age,interest,day,pace)-score(a,age,interest,day,pace)||a.name.localeCompare(b.name,'hu'));
  const alternatives=relevant.filter(p=>!exact(p,age,interest,day,pace)).sort((a,b)=>score(b,age,interest,day,pace)-score(a,age,interest,day,pace)||a.name.localeCompare(b.name,'hu'));
  const selected=exactMatches.length?exactMatches.slice(0,3):alternatives.slice(0,3);
  if(exactMatches.length&&selected.length<3){for(const p of alternatives){if(selected.length>=3)break;if(!selected.includes(p))selected.push(p);}}
  return {eligible,relevant,exactMatches,alternatives,selected,externalFallback:relevant.length===0};
}

for(let age=0;age<=99;age++){
  for(const interest of interests){
    for(const day of days){
      for(const pace of paces){
        combinations++;
        const r=ranked(age,interest,day,pace);
        if(r.exactMatches.length)exactStates++;
        else if(r.relevant.length)bmiAlternativeStates++;
        else externalFallbackStates++;
        if(r.relevant.length&&r.selected.length===0)throw new Error(`No BMI recommendation despite age+interest relevant program: ${age}/${interest}/${day}/${pace}`);
        if(!r.relevant.length&&r.selected.length)throw new Error(`External fallback state returned BMI programs: ${age}/${interest}/${day}/${pace}`);
        if(r.selected.length>3)throw new Error('Recommendation list exceeded 3 items.');
        for(const p of r.selected){
          if(!ageEligible(p,age))throw new Error(`Age-invalid recommendation: ${p.id} for age ${age}`);
          if(!interestEligible(p,interest))throw new Error(`Interest-invalid recommendation: ${p.id} for ${interest}`);
        }
        if(r.exactMatches.length&&r.selected.length&&!exact(r.selected[0],age,interest,day,pace))throw new Error(`Exact match was not ranked first: ${age}/${interest}/${day}/${pace}`);
      }
    }
  }
}

function assertAge(id,min,max){
  const p=cfg.programs.find(x=>x.id===id);
  if(!p)throw new Error(`Missing program: ${id}`);
  if(p.minAge!==min||p.maxAge!==max)throw new Error(`${id} age range must be ${min}-${max}, got ${p.minAge}-${p.maxAge}`);
  if(min>0&&ageEligible(p,min-1))throw new Error(`${id} must reject age ${min-1}`);
  if(!ageEligible(p,min)||!ageEligible(p,max))throw new Error(`${id} must include both age boundaries`);
  if(max<99&&ageEligible(p,max+1))throw new Error(`${id} must reject age ${max+1}`);
}

assertAge('borsofozde',0,3);
assertAge('ovoda',3,6);
assertAge('ovoda-baden',3,6);
assertAge('iskola-baden',7,8);
assertAge('aspern',6,10);
assertAge('seestadt',6,10);
assertAge('schweden-1',6,10);
assertAge('schweden-2',10,14);
assertAge('alapozo',5,10);
assertAge('rajztabla',10,16);
assertAge('varazsceruza',9,14);
assertAge('becscraft',6,15);
assertAge('kicsi-svung',8,13);
assertAge('mamut',7,12);
assertAge('gimi-svung',14,18);
assertAge('filmes',13,17);
assertAge('sakk',6,99);
assertAge('fecskeklub',8,14);
assertAge('vilagfa',6,14);
assertAge('napraforgocskak',6,15);
assertAge('cserkeszet',5,22);
assertAge('fotoklub',18,99);
assertAge('fokusz',18,99);
assertAge('kezdo-neptanc',18,99);
assertAge('mos',18,99);
assertAge('rekreacio',18,99);

const schw1=cfg.programs.find(p=>p.id==='schweden-1');
const schw2=cfg.programs.find(p=>p.id==='schweden-2');
if(schw1.when!=='Minden szombaton 10:00–12:00'||schw1.pace!=='rendszeres')throw new Error('Schwedenplatz 1 cadence must be every Saturday 10:00–12:00.');
if(schw2.when!=='Kéthetente szombatonként 12:00–14:00'||schw2.pace!=='rugalmas')throw new Error('Schwedenplatz 2 cadence must be every two weeks Saturday 12:00–14:00.');
if(!ranked(9,'nyelv','szombat','rendszeres').selected.some(p=>p.id==='schweden-1'))throw new Error('Age 9 Saturday Hungarian must include Schwedenplatz 1.');
if(ranked(9,'nyelv','szombat','rendszeres').selected.some(p=>p.id==='schweden-2'))throw new Error('Age 9 must not receive Schwedenplatz 2.');
if(!ranked(10,'nyelv','szombat','mindegy').relevant.some(p=>p.id==='schweden-1')||!ranked(10,'nyelv','szombat','mindegy').relevant.some(p=>p.id==='schweden-2'))throw new Error('Age 10 must be eligible for both Schwedenplatz groups.');
if(ranked(11,'nyelv','szombat','mindegy').relevant.some(p=>p.id==='schweden-1'))throw new Error('Age 11 must not receive Schwedenplatz 1.');
if(!ranked(11,'nyelv','szombat','mindegy').selected.some(p=>p.id==='schweden-2'))throw new Error('Age 11 Saturday Hungarian must include Schwedenplatz 2.');

const fokusz=cfg.programs.find(p=>p.id==='fokusz');
if(!fokusz.interests.includes('jollet')||fokusz.interests.includes('nyelv'))throw new Error('Fókusz must be classified under wellbeing/focus, not Hungarian language.');
for(const id of ['fokusz','mos','rekreacio']){
  const p=cfg.programs.find(x=>x.id===id);
  if(!p||p.relationship!=='bmi-partner')throw new Error(`${id} must be marked as BMI partner program.`);
}
if(!dayEligible(cfg.programs.find(p=>p.id==='rekreacio'),'vasarnap'))throw new Error('ReKreáció must match Sunday.');

if(combinations!==14400)throw new Error(`Expected 14400 combinations, got ${combinations}`);
if(exactStates===0||bmiAlternativeStates===0||externalFallbackStates===0)throw new Error('Expected exact, BMI-alternative and external-fallback states.');

console.log(`PASS: ${combinations} selector states checked; all 26 hard age ranges verified; Schwedenplatz overlap/cadence verified; BMI alternatives precede external-school fallback; Sunday and BMI-partner semantics verified.`);
