(function(){'use strict';
var MODEL={
 rootCauses:{
  'limited-hungarian-exposure':'kevés rendszeres, életkorhoz illő magyar nyelvi helyzet',
  'diaspora-social-fragmentation':'kevés rendszeres magyar közösségi kapcsolódás',
  'identity-distance':'a magyar kultúra és identitás távolabb kerülhet a hétköznapoktól',
  'creative-expression-gap':'kevés vezetett tér az önálló kreatív önkifejezésre',
  'confidence-expression-gap':'kevés biztonságos lehetőség a megszólalás és szereplés gyakorlására',
  'sensorimotor-development-need':'strukturált mozgásos, koordinációs vagy figyelmi gyakorlás iránti igény',
  'embodied-tradition-gap':'a hagyomány személyes, mozgásos-zenei megtapasztalásának hiánya',
  'guided-digital-literacy-gap':'a digitális eszközhasználatból hiányzó vezetett, alkotó projektmunka',
  'structured-thinking-practice':'rendszeres logikai, stratégiai és koncentrációs gyakorlás iránti igény',
  'overload-focus-planning':'fókusz-, tervezési, időgazdálkodási vagy jólléti nehézség',
  'formal-digital-skill-gap':'a rendszerezett Office- és vizsgaszintű digitális kompetencia hiánya',
  'intergenerational-connection-gap':'kevés többgenerációs magyar közösségi élmény'
 },
 solutions:{
  'hungarian-immersion':'rendszeres magyar nyelvi helyzetek',
  'peer-community':'ismétlődő magyar közösségi kapcsolódás',
  'cultural-embedding':'kultúra és identitás beépítése a közös élménybe',
  'creative-making':'aktív alkotás',
  'safe-performance-practice':'támogató dráma-, kommunikációs és színpadi gyakorlat',
  'guided-movement':'vezetett mozgás- és koordinációs gyakorlat',
  'embodied-cultural-learning':'táncon, zenén és ritmuson keresztüli kulturális tanulás',
  'project-based-digital-learning':'projektalapú digitális alkotás és problémamegoldás',
  'strategy-practice':'fokozatos logikai és stratégiai gyakorlás',
  'focus-selfmanagement':'strukturált fókusz-, tervezési és önmenedzsment-módszerek',
  'formal-office-training':'rendszerezett Office-képzés és vizsgafelkészítés',
  'intergenerational-participation':'több generáció közös részvétele',
  'accessible-entry':'könnyű vagy rugalmas belépési lehetőség'
 },
 needs:{
  'magyar-nyelv':{roots:['limited-hungarian-exposure'],solutions:['hungarian-immersion','peer-community']},
  'kozosseg-identitas':{roots:['diaspora-social-fragmentation','identity-distance'],solutions:['peer-community','cultural-embedding']},
  'kreativ-alkotas':{roots:['creative-expression-gap'],solutions:['creative-making']},
  'onkifejezes-szinpad':{roots:['confidence-expression-gap','creative-expression-gap'],solutions:['safe-performance-practice','creative-making']},
  'mozgas-fejlodes':{roots:['sensorimotor-development-need'],solutions:['guided-movement']},
  'tanc-hagyomany':{roots:['embodied-tradition-gap','identity-distance'],solutions:['embodied-cultural-learning','cultural-embedding','peer-community']},
  'digitalis-media':{roots:['guided-digital-literacy-gap','creative-expression-gap'],solutions:['project-based-digital-learning','creative-making']},
  'logika-koncentracio':{roots:['structured-thinking-practice'],solutions:['strategy-practice']},
  'fokusz-jollet':{roots:['overload-focus-planning'],solutions:['focus-selfmanagement']},
  'szakmai-office':{roots:['formal-digital-skill-gap'],solutions:['formal-office-training']}
 }
};
function uniq(a){return Array.from(new Set(a||[]))}
function semanticsForNeeds(needs){var roots=[],solutions=[];(needs||[]).forEach(function(id){var m=MODEL.needs[id];if(m){roots=roots.concat(m.roots);solutions=solutions.concat(m.solutions)}});return{roots:uniq(roots),solutions:uniq(solutions)}}
function enrichProgram(p){var s=semanticsForNeeds(p&&p.needs||[]);p.semanticRootCauses=s.roots;p.semanticSolutions=s.solutions;return p}
function overlap(a,b){var bs=new Set(b||[]);return(a||[]).filter(function(x){return bs.has(x)})}
window.BMI_SEMANTIC={model:MODEL,semanticsForNeeds:semanticsForNeeds,enrichProgram:enrichProgram,overlap:overlap,rootLabel:function(id){return MODEL.rootCauses[id]||id},solutionLabel:function(id){return MODEL.solutions[id]||id}};
if(window.BMI_FINDER&&Array.isArray(window.BMI_FINDER.programs))window.BMI_FINDER.programs.forEach(enrichProgram);
})();
