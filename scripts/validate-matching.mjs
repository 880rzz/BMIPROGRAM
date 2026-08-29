import fs from 'node:fs';
import vm from 'node:vm';
const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
vm.runInNewContext(fs.readFileSync('zenebona-program.js','utf8'),ctx,{filename:'zenebona-program.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==27)throw new Error('Expected 27-program registry.');
const needs=cfg.needs.map(x=>x.id),days=['hetfo','kedd','szerda','csutortok','pentek','szombat','vasarnap','mindegy'],paces=cfg.pace.map(x=>x.id);
function ageEligible(p,age){return age>=p.minAge&&age<=p.maxAge}
function dayEligible(p,day){if(day==='mindegy'||p.weekday==='rugalmas')return true;return(p.weekdays||[p.weekday]).includes(day)}
function paceEligible(p,pace){return pace==='mindegy'||p.pace===pace}
function needEligible(p,need){return Array.isArray(p.needs)&&p.needs.includes(need)}
function exact(p,age,need,day,pace){return ageEligible(p,age)&&needEligible(p,need)&&dayEligible(p,day)&&paceEligible(p,pace)}
function score(p,age,need,day,pace){if(!ageEligible(p,age))return-1;let v=0;if(needEligible(p,need))v+=60;if(dayEligible(p,day))v+=25;if(paceEligible(p,pace))v+=15;if(p.relationship==='bmi')v+=2;return v}
function ranked(age,need,day,pace){const eligible=cfg.programs.filter(p=>ageEligible(p,age));const relevant=eligible.filter(p=>needEligible(p,need));const exactMatches=relevant.filter(p=>exact(p,age,need,day,pace)).sort((a,b)=>score(b,age,need,day,pace)-score(a,age,need,day,pace)||a.name.localeCompare(b.name,'hu'));const alternatives=relevant.filter(p=>!exact(p,age,need,day,pace)).sort((a,b)=>score(b,age,need,day,pace)-score(a,age,need,day,pace)||a.name.localeCompare(b.name,'hu'));const selected=exactMatches.length?exactMatches.slice(0,3):alternatives.slice(0,3);return{eligible,relevant,exactMatches,alternatives,selected}}
let combinations=0;
for(let age=0;age<=99;age++)for(const need of needs)for(const day of days)for(const pace of paces){combinations++;const r=ranked(age,need,day,pace);for(const p of r.selected){if(!ageEligible(p,age))throw new Error(`Age-invalid recommendation: ${p.id}/${age}`);if(!needEligible(p,need))throw new Error(`Need-invalid recommendation: ${p.id}/${need}`)}if(r.exactMatches.length&&r.selected.length&&!exact(r.selected[0],age,need,day,pace))throw new Error('Exact match not first')}
const z=cfg.programs.find(p=>p.id==='zenebona');
if(!z)throw new Error('Zenebona missing');
if(!ranked(1,'magyar-nyelv','szerda','rendszeres').selected.some(p=>p.id==='zenebona'))throw new Error('Zenebona must be recommended for age 1 + Hungarian + Wednesday + regular');
if(!ranked(2,'kozosseg-identitas','szerda','rendszeres').relevant.some(p=>p.id==='zenebona'))throw new Error('Zenebona must match community need for age 2');
if(ranked(4,'magyar-nyelv','szerda','rendszeres').relevant.some(p=>p.id==='zenebona'))throw new Error('Zenebona must not be recommended above age 3');
if(combinations!==24000)throw new Error(`Expected 24000 states, got ${combinations}`);
console.log(`PASS: ${combinations} selector states checked; Zenebona recommendation behavior verified.`);
