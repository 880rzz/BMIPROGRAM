import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}

const home=read('index.html');
const faq=read('gyik.html');
const app=read('app.js');

assert(home.includes('legközelebbi, életkorban megfelelő BMI-ajánlatokat'),'Homepage must explain ranked BMI alternatives.');
assert(home.includes('a nap és a rendszeresség preferencia'),'Homepage must explain that day and cadence are preferences.');
assert(!home.includes('legfeljebb három pontos találatot kapsz'),'Homepage must not describe the retired exact-only result model.');

assert(app.includes("if(interestEligible(p))score+=60"),'Interest must remain the strongest preference signal.');
assert(app.includes("if(dayEligible(p))score+=25"),'Day preference weight contract missing.');
assert(app.includes("if(paceEligible(p))score+=15"),'Cadence preference weight contract missing.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age must remain a hard recommendation constraint.');
assert(app.includes("if(p.provider==='BMI')score+=2"),'BMI exact/preference tie-break contract missing.');
assert(app.includes('A kompromisszum:'),'Alternative cards must explain the compromise.');
assert(app.includes('Nézzetek körül a másik két bécsi magyar iskolánál is'),'External schools must remain visible beside recommendations.');

assert(faq.includes('életkor kemény feltétel'),'FAQ must explain the hard age constraint.');
assert(faq.includes('érdeklődés kapja a legnagyobb súlyt'),'FAQ must explain ranked recommendation priorities.');
assert(faq.includes('legközelebbi BMI-alternatívákat'),'FAQ must explain non-exact BMI alternatives.');
assert(faq.includes('nem igazolt 2026/27-es órarendet'),'FAQ must preserve partner-source caution.');
assert(!faq.includes('Ezután általános alternatívaként megmutatja'),'FAQ must not describe the retired external-only fallback model.');

console.log('PASS: ranked recommender copy, FAQ schema-facing copy and UI contracts are consistent.');
