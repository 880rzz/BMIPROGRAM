import fs from 'node:fs';

const programsDoc=JSON.parse(fs.readFileSync('programs.json','utf8'));
const semantic=JSON.parse(fs.readFileSync('semantic-model.json','utf8'));
const profiles={
  'bajka kinga csengele':'bajka-kinga-csengele','horanyi bori':'horanyi-bori','schneider erzsebet':'schneider-erzsebet','makfalvi rita':'makfalvi-rita','fersztl barnabas':'fersztl-barnabas','noszko niki':'noszko-niki','kiss agnes':'kiss-agnes','boronkai gabriella':'boronkai-gabriella','korchma zsombor':'korchma-zsombor','hierholcz anna':'hierholcz-anna','pecze adam':'pecze-adam','trencsenyi klara':'trencsenyi-klara','falusi dora':'falusi-dora','hupczik andrea':'hupczik-andrea','telenko eva':'telenko-eva','varga bernadette':'varga-bernadette','veres tamas':'veres-tamas','banhalmi norbert':'banhalmi-norbert','balogh david':'balogh-david','sipos tibor':'sipos-tibor','orban dalma':'orban-dalma','egri monika':'egri-monika','dapin hajnalka judit':'dapin-hajnalka-judit','pohl balazs':'pohl-balazs','poser piroska ildiko':'poser-piroska-ildiko'
};
const norm=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
function teacherUrls(raw){
 const n=norm(raw),out=[];
 for(const [alias,slug] of Object.entries(profiles)) if(n.includes(alias)) out.push(`https://tanarok.magyariskola.at/#${slug}`);
 return [...new Set(out)];
}
function ageBands(p){const out=[];if(p.minAge<=3&&p.maxAge>=0)out.push('0–3');if(p.minAge<=6&&p.maxAge>=3)out.push('3–6');if(p.minAge<=10&&p.maxAge>=6)out.push('6–10');if(p.minAge<=14&&p.maxAge>=10)out.push('10–14');if(p.maxAge>=14&&p.minAge<=19)out.push('teenagers');if(p.maxAge>=18)out.push('adults');return [...new Set(out)]}
const enriched=programsDoc.programs.map(p=>{
 const roots=[],solutions=[];
 for(const need of p.needs||[]){const map=semantic.needMapping[need];if(map){roots.push(...map.rootCauses);solutions.push(...map.solutions)}}
 if(p.id==='oromzene'){roots.push('intergenerational-connection-gap');solutions.push('intergenerational-participation','accessible-entry')}
 if(p.trial||/nem szukseges|nem kell|proba/i.test(norm((p.why||'')+' '+(p.painPoint||'')+' '+(p.trial||'')))) solutions.push('accessible-entry');
 return {...p,
   semantic:{
     rootCauseIds:[...new Set(roots)],
     rootCauses:[...new Set(roots)].map(id=>semantic.rootCauses[id]),
     solutionMechanismIds:[...new Set(solutions)],
     solutionMechanisms:[...new Set(solutions)].map(id=>semantic.solutionMechanisms[id]),
     ageBands:ageBands(p),
     teacherProfileUrls:teacherUrls(p.teacher),
     canonicalScheduleSource:p.url,
     normalizedRecommendationSource:'https://programvalaszto.magyariskola.at/programs.json'
   }
 };
});
const knowledge={schemaVersion:'2026-09-02-v1',schoolYear:programsDoc.schoolYear,school:semantic.entity,sourcePriority:{recommendation:'programs.json + program-knowledge.json',teacher:'https://tanarok.magyariskola.at/teacher-knowledge.json',registration:'current Wix Event page or explicit partner canonical page'},programCount:enriched.length,programs:enriched};
if(enriched.length!==28)throw new Error(`Expected 28 programs, got ${enriched.length}`);
for(const p of enriched){if(!p.painPoint||!p.outcome)throw new Error(`Missing painPoint/outcome: ${p.id}`);if(!p.semantic.rootCauseIds.length)throw new Error(`Missing root cause: ${p.id}`);if(!p.semantic.solutionMechanismIds.length)throw new Error(`Missing solution mechanism: ${p.id}`);if(!(p.minAge>=0&&p.maxAge>=p.minAge))throw new Error(`Invalid age range: ${p.id}`);if(!p.when||!p.location||!p.teacher)throw new Error(`Missing schedule/location/teacher: ${p.id}`)}
fs.writeFileSync('program-knowledge.json',JSON.stringify(knowledge,null,2)+'\n');
const graph=[{'@type':'EducationalOrganization','@id':'https://www.magyariskola.at/#school','name':'Bécsi Magyar Iskola','description':semantic.entity.canonicalDescriptionHu,'url':'https://www.magyariskola.at/'},{'@type':'ItemList','@id':'https://programvalaszto.magyariskola.at/#programs','name':'BMI 2026/27 programok','numberOfItems':enriched.length,'itemListElement':[]}];
enriched.forEach((p,i)=>{const id=`https://programvalaszto.magyariskola.at/#program-${p.id}`;graph[1].itemListElement.push({'@type':'ListItem','position':i+1,'item':{'@id':id}});const item={'@type':'Course','@id':id,'name':p.name,'url':p.url,'description':`${p.why} ${p.painPoint} ${p.outcome}`.trim(),'provider':{'@id':'https://www.magyariskola.at/#school'},'audience':{'@type':'PeopleAudience','suggestedMinAge':p.minAge,'suggestedMaxAge':p.maxAge},'location':{'@type':'Place','name':p.location},'additionalProperty':[{'@type':'PropertyValue','name':'painPoint','value':p.painPoint},{'@type':'PropertyValue','name':'outcome','value':p.outcome},{'@type':'PropertyValue','name':'rootCauses','value':p.semantic.rootCauses.join(' | ')},{'@type':'PropertyValue','name':'solutionMechanisms','value':p.semantic.solutionMechanisms.join(' | ')},{'@type':'PropertyValue','name':'schedule','value':p.when},{'@type':'PropertyValue','name':'relationship','value':p.relationship||''}]};if(p.semantic.teacherProfileUrls.length)item.instructor=p.semantic.teacherProfileUrls.map(u=>({'@type':'Person','@id':u}));graph.push(item)});
fs.writeFileSync('program-knowledge.jsonld',JSON.stringify({'@context':'https://schema.org','@graph':graph},null,2)+'\n');
console.log(`OK: ${enriched.length} programs enriched with root cause, solution, audience, schedule, location and teacher links`);
