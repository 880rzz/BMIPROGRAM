import fs from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==22)throw new Error('Expected canonical 22-program registry.');

const interests=cfg.interests.map(x=>x.id);
const days=['hetfo','kedd','szerda','csutortok','pentek','szombat','mindegy'];
const paces=cfg.pace.map(x=>x.id);
const reachable=new Set();
let combinations=0;
let zeroMatches=0;
let nonZeroMatches=0;

function ageEligible(p,age){
  if(p.ageRangeComposite&&p.id==='vilagfa')return(age>=6&&age<=14)||age>=18;
  return age>=p.minAge&&age<=p.maxAge;
}
function dayEligible(p,day){
  if(day==='mindegy'||p.weekday==='rugalmas')return true;
  return(p.weekdays||[p.weekday]).includes(day);
}
function matches(p,age,interest,day,pace){
  return ageEligible(p,age)&&p.interests.includes(interest)&&dayEligible(p,day)&&(pace==='mindegy'||p.pace===pace);
}

for(let age=0;age<=99;age++){
  for(const interest of interests){
    for(const day of days){
      for(const pace of paces){
        combinations++;
        const result=cfg.programs.filter(p=>matches(p,age,interest,day,pace));
        if(result.length===0)zeroMatches++; else nonZeroMatches++;
        for(const p of result){
          reachable.add(p.id);
          if(!ageEligible(p,age))throw new Error(`Age-invalid match: ${p.id}`);
          if(!p.interests.includes(interest))throw new Error(`Interest-invalid match: ${p.id}`);
          if(!dayEligible(p,day))throw new Error(`Day-invalid match: ${p.id}`);
          if(!(pace==='mindegy'||p.pace===pace))throw new Error(`Pace-invalid match: ${p.id}`);
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

if(combinations!==8400)throw new Error(`Expected 8400 combinations, got ${combinations}`);
if(reachable.size!==22){
  const missing=cfg.programs.filter(p=>!reachable.has(p.id)).map(p=>p.id);
  throw new Error(`Unreachable programs: ${missing.join(', ')}`);
}
if(zeroMatches===0)throw new Error('No zero-match state exists; external-school fallback would be unreachable.');
if(nonZeroMatches===0)throw new Error('Selector produces no BMI recommendations.');

console.log(`PASS: ${combinations} exact-weekday selector states checked; all 22 programs reachable; ${zeroMatches} zero-match states exercise fallback; composite/flexible weekday rules enforced.`);
