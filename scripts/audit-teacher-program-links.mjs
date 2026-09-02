import fs from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
vm.runInContext(fs.readFileSync('zenebona-program.js','utf8'),ctx,{filename:'zenebona-program.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)) throw new Error('BMI_FINDER programs missing');

// Explicit person links currently published in Wix Events descriptions.
// This validates person↔program relationships only. It does NOT make Wix the canonical
// schedule/content source for externally registered programs.
const relationshipContracts=[
  {match:{url:'https://www.magyariskola.at/event-details/alapozoterapia-2026'},names:['Horányi Bori']},
  {match:{url:'https://www.magyariskola.at/event-details/becscraft-2026'},names:['Korchma Zsombor']},
  {match:{url:'https://www.magyariskola.at/event-details/ovoda-baden-2026'},names:['Telenkó Éva','Makfalvi Rita']},
  {match:{url:'https://www.magyariskola.at/event-details/borsofozde-2026'},names:['Horányi Bori']},
  {match:{id:'oromzene'},names:['Hupczik Andrea'],searchFields:['teacher','teacherContact']},
  {match:{url:'https://www.magyariskola.at/event-details/filmesmuhely-2026'},names:['Trencsényi Klára']},
  {match:{url:'https://www.magyariskola.at/event-details/fokuszcsoport-2026'},names:['Horányi Bori']},
  {match:{url:'https://www.magyariskola.at/event-details/fotoklub-2026'},names:['Bánhalmi Norbert','Balogh Dávid']},
  {match:{url:'https://www.magyariskola.at/event-details/iskolabaden-2026'},names:['Makfalvi Rita']},
  {match:{url:'https://www.magyariskola.at/event-details/magyarnyelv-szerda-2026'},names:['Schneider Erzsébet']},
  {match:{url:'https://www.magyariskola.at/event-details/magyaroktatas-kedd-2026'},names:['Schneider Erzsébet']},
  {match:{id:'napraforgocskak'},names:['Varga Bernadette','Veres Tamás']},
  {match:{url:'https://www.magyariskola.at/event-details/rekreacio-2026'},names:['Egri Mónika']},
  {match:{url:'https://www.magyariskola.at/event-details/sakk-2026'},names:['Fersztl Barnabás']},
  {match:{url:'https://www.magyariskola.at/event-details/varazsceruza-2026'},names:['Bajka Kinga Csengele']}
];

const problems=[];
for(const c of relationshipContracts){
  const p=cfg.programs.find(x=>c.match.id?x.id===c.match.id:x.url===c.match.url);
  if(!p){problems.push(`Missing runtime program for contract ${JSON.stringify(c.match)}`);continue;}
  const fields=c.searchFields||['teacher'];
  const haystack=fields.map(f=>String(p[f]||'')).join(' | ');
  for(const name of c.names) if(!haystack.includes(name)) problems.push(`${p.id}: expected relationship to ${name}, got ${haystack||'(empty)'}`);
}

// High-risk regression guards for the exact corruption found on 2026-09-02.
const fotoklub=cfg.programs.find(p=>p.id==='fotoklub');
if(!fotoklub) problems.push('fotoklub missing');
else {
  if(!String(fotoklub.teacher).includes('Bánhalmi Norbert')||!String(fotoklub.teacher).includes('Balogh Dávid')) problems.push(`fotoklub wrong teacher: ${fotoklub.teacher}`);
  if(String(fotoklub.teacher).includes('Póser-Piroska')) problems.push('fotoklub incorrectly contains Póser-Piroska Ildikó');
}
const cserkeszet=cfg.programs.find(p=>p.id==='cserkeszet');
if(!cserkeszet) problems.push('cserkeszet missing');
else {
  if(!String(cserkeszet.teacher).includes('Póser-Piroska Ildikó')) problems.push(`cserkeszet wrong leader: ${cserkeszet.teacher}`);
  if(String(cserkeszet.teacher).includes('Balogh Dávid')||String(cserkeszet.teacher).includes('Bánhalmi Norbert')) problems.push('cserkeszet contains photography-program people');
}

const profileDoc=JSON.parse(fs.readFileSync('teacher-profiles.json','utf8'));
const profiles=Array.isArray(profileDoc)?profileDoc:(profileDoc.teachers||[]);
const connected=profiles.map(t=>{
  const programs=cfg.programs.filter(p=>{
    const text=[p.teacher,p.teacherContact].map(x=>String(x||'')).join(' | ');
    return text.includes(t.name);
  }).map(p=>({id:p.id,name:p.name,url:p.url,sourceType:p.sourceType||null,relationship:p.relationship||null}));
  return {name:t.name,url:t.url,programs};
});

const report={
  generatedAt:new Date().toISOString(),
  runtimeProgramCount:cfg.programs.length,
  teacherProfileCount:profiles.length,
  explicitRelationshipContracts:relationshipContracts.length,
  sourcePolicyNote:'External registration/canonical program pages remain authoritative where configured; Wix relationship links are used here only to validate person-program connections.',
  problems,
  teachers:connected
};
fs.writeFileSync('teacher-program-audit.json',JSON.stringify(report,null,2)+'\n');
if(problems.length) throw new Error('Teacher-program integrity errors:\n'+problems.join('\n'));
console.log(`PASS: ${cfg.programs.length} programs, ${profiles.length} teacher profiles, ${relationshipContracts.length} person-program contracts`);
