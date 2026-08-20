import fs from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==22)throw new Error('Expected canonical 22-program registry.');

const interests=cfg.interests.map(x=>x.id);
const days=cfg.days.map(x=>x.id);
const paces=cfg.pace.map(x=>x.id);
const reachable=new Set();
let combinations=0;
let zeroMatches=0;
let nonZeroMatches=0;

function ageEligible(p,age){
  if(p.ageRangeComposite&&p.id==='vilagfa')return(age>=6&&age<=14)||age>=18;
  return age>=p.minAge&&age<=p.maxAge;
}
function matches(p,age,interest,day,pace){
  const ageOk=ageEligible(p,age);
  const interestOk=p.interests.includes(interest);
  const dayOk=day==='mindegy'||p.weekday==='rugalmas'||p.day===day;
  const paceOk=pace==='mindegy'||p.pace===pace;
  return ageOk&&interestOk&&dayOk&&paceOk;
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
          if(!(day==='mindegy'||p.weekday==='rugalmas'||p.day===day))throw new Error(`Day-invalid match: ${p.id}`);
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

if(combinations!==3600)throw new Error(`Expected 3600 combinations, got ${combinations}`);
if(reachable.size!==22){
  const missing=cfg.programs.filter(p=>!reachable.has(p.id)).map(p=>p.id);
  throw new Error(`Unreachable programs: ${missing.join(', ')}`);
}
if(zeroMatches===0)throw new Error('No zero-match state exists; external-school fallback would be unreachable.');
if(nonZeroMatches===0)throw new Error('Selector produces no BMI recommendations.');

console.log(`PASS: ${combinations} selector states checked; all 22 programs reachable; ${zeroMatches} zero-match states exercise fallback; Világfa age gap enforced.`);
