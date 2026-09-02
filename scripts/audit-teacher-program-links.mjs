import fs from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
vm.runInContext(fs.readFileSync('zenebona-program.js','utf8'),ctx,{filename:'zenebona-program.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)) throw new Error('BMI_FINDER programs missing');

// Explicit person links currently published in the corresponding Wix Events descriptions.
// These are used as a relationship-integrity contract, not as a blanket source-priority rule.
const expectedByEventUrl={
  'https://www.magyariskola.at/event-details/alapozoterapia-2026':['Horányi Bori'],
  'https://www.magyariskola.at/event-details/becscraft-2026':['Korchma Zsombor'],
  'https://www.magyariskola.at/event-details/ovoda-baden-2026':['Telenkó Éva','Makfalvi Rita'],
  'https://www.magyariskola.at/event-details/borsofozde-2026':['Horányi Bori'],
  'https://www.magyariskola.at/event-details/oromzene-2026':['Hupczik Andrea'],
  'https://www.magyariskola.at/event-details/filmesmuhely-2026':['Trencsényi Klára'],
  'https://www.magyariskola.at/event-details/fokuszcsoport-2026':['Horányi Bori'],
  'https://www.magyariskola.at/event-details/fotoklub-2026':['Bánhalmi Norbert','Balogh Dávid'],
  'https://www.magyariskola.at/event-details/iskolabaden-2026':['Makfalvi Rita'],
  'https://www.magyariskola.at/event-details/magyarnyelv-szerda-2026':['Schneider Erzsébet'],
  'https://www.magyariskola.at/event-details/magyaroktatas-kedd-2026':['Schneider Erzsébet'],
  'https://www.magyariskola.at/event-details/napraforgocskak-2026':['Varga Bernadette','Veres Tamás'],
  'https://www.magyariskola.at/event-details/rekreacio-2026':['Egri Mónika'],
  'https://www.magyariskola.at/event-details/sakk-2026':['Fersztl Barnabás'],
  'https://www.magyariskola.at/event-details/varazsceruza-2026':['Bajka Kinga Csengele']
};

const problems=[];
for(const [url,names] of Object.entries(expectedByEventUrl)){
  const p=cfg.programs.find(x=>x.url===url);
  if(!p){problems.push(`Missing runtime program for ${url}`);continue;}
  const teacher=String(p.teacher||'');
  for(const name of names) if(!teacher.includes(name)) problems.push(`${p.id}: expected ${name}, got ${teacher||'(empty)'}`);
}

const fotoklub=cfg.programs.find(p=>p.id==='fotoklub');
if(!fotoklub) problems.push('fotoklub missing');
else {
  if(!String(fotoklub.teacher).includes('Bánhalmi Norbert')||!String(fotoklub.teacher).includes('Balogh Dávid')) problems.push(`fotoklub wrong teacher: ${fotoklub.teacher}`);
  if(String(fotoklub.teacher).includes('Póser-Piroska')) problems.push('fotoklub incorrectly contains Póser-Piroska Ildikó');
}
const cserkeszet=cfg.programs.find(p=>p.id==='cserkeszet');
if(!cserkeszet) problems.push('cserkeszet missing');
else if(!String(cserkeszet.teacher).includes('Póser-Piroska Ildikó')) problems.push(`cserkeszet wrong leader: ${cserkeszet.teacher}`);

const profileDoc=JSON.parse(fs.readFileSync('teacher-profiles.json','utf8'));
const profiles=Array.isArray(profileDoc)?profileDoc:(profileDoc.teachers||[]);
const connected=profiles.map(t=>{
  const programs=cfg.programs.filter(p=>String(p.teacher||'').includes(t.name)).map(p=>({id:p.id,name:p.name,url:p.url}));
  return {name:t.name,url:t.url,programs};
});

const report={
  generatedAt:new Date().toISOString(),
  runtimeProgramCount:cfg.programs.length,
  teacherProfileCount:profiles.length,
  explicitWixRelationshipContracts:Object.keys(expectedByEventUrl).length,
  problems,
  teachers:connected
};
fs.writeFileSync('teacher-program-audit.json',JSON.stringify(report,null,2)+'\n');
if(problems.length) throw new Error('Teacher-program integrity errors:\n'+problems.join('\n'));
console.log(`PASS: ${cfg.programs.length} programs, ${profiles.length} teacher profiles, ${Object.keys(expectedByEventUrl).length} explicit Wix relationship contracts`);
