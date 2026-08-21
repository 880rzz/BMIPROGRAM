import fs from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==23)throw new Error('Expected canonical 23-program registry.');

const interests=cfg.interests.map(x=>x.id);
const days=['hetfo','kedd','szerda','csutortok','pentek','szombat','mindegy'];
const paces=cfg.pace.map(x=>x.id);
const reachable=new Set();
let combinations=0;
let exactStates=0;
let alternativeStates=0;
let noAgeEligibleStates=0;

function ageEligible(p,age){
  if(p.ageRangeComposite&&p.id==='vilagfa')return(age>=6&&age<=14)||age>=18;
  return age>=p.minAge&&age<=p.maxAge;
}
function dayEligible(p,day){
  if(day==='mindegy'||p.weekday==='rugalmas')return true;
  return(p.weekdays||[p.weekday]).includes(day);
}
function paceEligible(p,pace){return pace==='mindegy'||p.pace===pace;}
function interestEligible(p,interest){return p.interests.includes(interest);}
function exact(p,age,interest,day,pace){return ageEligible(p,age)&&interestEligible(p,interest)&&dayEligible(p,day)&&paceEligible(p,pace);}
function score(p,age,interest,day,pace){
  if(!ageEligible(p,age))return-1;
  let value=0;
  if(interestEligible(p,interest))value+=60;
  if(dayEligible(p,day))value+=25;
  if(paceEligible(p,pace))value+=15;
  if(p.provider==='BMI')value+=2;
  return value;
}
function ranked(age,interest,day,pace){
  const eligible=cfg.programs.filter(p=>ageEligible(p,age));
  const exactMatches=eligible.filter(p=>exact(p,age,interest,day,pace)).sort((a,b)=>score(b,age,interest,day,pace)-score(a,age,interest,day,pace)||a.name.localeCompare(b.name,'hu'));
  const alternatives=eligible.filter(p=>!exact(p,age,interest,day,pace)).sort((a,b)=>score(b,age,interest,day,pace)-score(a,age,interest,day,pace)||a.name.localeCompare(b.name,'hu'));
  const selected=exactMatches.length?exactMatches.slice(0,3):alternatives.slice(0,3);
  if(exactMatches.length&&selected.length<3){for(const p of alternatives){if(selected.length>=3)break;if(!selected.includes(p))selected.push(p);}}
  return {eligible,exactMatches,alternatives,selected};
}

for(let age=0;age<=99;age++){
  for(const interest of interests){
    for(const day of days){
      for(const pace of paces){
        combinations++;
        const r=ranked(age,interest,day,pace);
        if(r.exactMatches.length)exactStates++; else if(r.eligible.length)alternativeStates++; else noAgeEligibleStates++;
        if(r.eligible.length&&r.selected.length===0)throw new Error(`No recommendation despite age-eligible programs: ${age}/${interest}/${day}/${pace}`);
        if(r.selected.length>3)throw new Error('Recommendation list exceeded 3 items.');
        for(const p of r.selected){
          reachable.add(p.id);
          if(!ageEligible(p,age))throw new Error(`Age-invalid recommendation: ${p.id}`);
        }
        if(r.exactMatches.length&&r.selected.length&& !exact(r.selected[0],age,interest,day,pace))throw new Error(`Exact match was not ranked first: ${age}/${interest}/${day}/${pace}`);
        if(!r.exactMatches.length&&r.alternatives.length>1&&r.selected.length>1){
          const scores=r.selected.map(p=>score(p,age,interest,day,pace));
          for(let i=1;i<scores.length;i++)if(scores[i]>scores[i-1])throw new Error(`Alternative ranking order invalid: ${age}/${interest}/${day}/${pace}`);
        }
      }
    }
  }
}

const vilagfa=cfg.programs.find(p=>p.id==='vilagfa');
if(!vilagfa||!vilagfa.ageRangeComposite)throw new Error('Világfa composite age semantics missing.');
for(const age of [15,16,17])if(ageEligible(vilagfa,age))throw new Error(`Világfa must not match age ${age}.`);
for(const age of [6,14,18,99])if(!ageEligible(vilagfa,age))throw new Error(`Világfa must match supported age ${age}.`);

const alapozo=cfg.programs.find(p=>p.id==='alapozo');
if(!alapozo||!dayEligible(alapozo,'kedd')||!dayEligible(alapozo,'csutortok')||dayEligible(alapozo,'hetfo'))throw new Error('Alapozó exact weekday semantics are incorrect.');
const fokusz=cfg.programs.find(p=>p.id==='fokusz');
for(const day of days)if(!dayEligible(fokusz,day))throw new Error(`Fókusz flexible schedule must be eligible for ${day}.`);
const sakk=cfg.programs.find(p=>p.id==='sakk');
if(!sakk||!interestEligible(sakk,'logika')||!dayEligible(sakk,'szombat')||ageEligible(sakk,5)||!ageEligible(sakk,6)||!ageEligible(sakk,99))throw new Error('Sakk recommendation semantics are incorrect.');

if(combinations!==10500)throw new Error(`Expected 10500 combinations, got ${combinations}`);
if(reachable.size!==23){
  const missing=cfg.programs.filter(p=>!reachable.has(p.id)).map(p=>p.id);
  throw new Error(`Unreachable recommended programs: ${missing.join(', ')}`);
}
if(exactStates===0)throw new Error('No exact-match state exists.');
if(alternativeStates===0)throw new Error('No alternative-recommendation state exists.');

console.log(`PASS: ${combinations} selector states checked; exact matches stay first; age remains hard; ranked BMI alternatives cover non-exact states; all 23 programs remain reachable; ${noAgeEligibleStates} states have no age-eligible canonical program.`);
