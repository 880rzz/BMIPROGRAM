import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}

const home=read('index.html');
const faq=read('gyik.html');
const app=read('app.js');

// Homepage: inclusive, human positioning without assuming two parents or a child-only audience.
assert(home.includes('Gyermeknek keresel délutáni vagy hétvégi magyar foglalkozást? Vagy saját magadnak választanál?'),'Homepage must explicitly support both child and adult activity seekers.');
assert(home.includes('Magyar foglalkozások<br><span class="hl">kicsiknek és nagyoknak.'),'Homepage hero must clearly position the offer as activities for all ages.');
assert(home.includes('Foglalkozásválasztó'),'Homepage must use the public foglalkozás terminology.');
assert(home.includes('A Bécsi Magyar Iskola nem egész napos iskola.'),'Homepage must explain the afternoon/weekend school model.');
assert(home.includes('<b>23</b><span>foglalkozás</span>'),'Homepage must expose the current 23-activity count.');
assert(!home.includes('mire vágytok'),'Homepage must not assume a multi-parent household.');
assert(!home.includes('gyermeketek'),'Homepage must not use plural-parent child wording.');

// Recommendation engine contracts: wording may evolve, ranking semantics may not.
assert(app.includes("if(interestEligible(p))score+=60"),'Interest must remain the strongest preference signal.');
assert(app.includes("if(dayEligible(p))score+=25"),'Day preference weight contract missing.');
assert(app.includes("if(paceEligible(p))score+=15"),'Cadence preference weight contract missing.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age must remain a hard recommendation constraint.');
assert(app.includes("if(p.provider==='BMI')score+=2"),'BMI exact/preference tie-break contract missing.');
assert(app.includes('Ami eltér:'),'Alternative cards must explain deviations in human language.');
assert(app.includes('Nézz körül a másik két bécsi magyar iskola kínálatában is'),'External schools must remain visible beside recommendations.');
assert(app.includes('Mind a 23 foglalkozás'),'Finder result actions must expose all 23 canonical entries.');
assert(app.includes('Hány éves, akinek foglalkozást keresel?'),'Finder must use neutral activity wording.');
assert(app.includes('saját magadnak keresel'),'Finder must support adult self-search.');
assert(app.includes('Megnézem a foglalkozást'),'Result CTA must describe an activity, not a generic program.');
assert(!app.includes('Nézzetek körül'),'Finder must not assume a plural household.');

// FAQ/data trust contracts remain authoritative even if UX prose is friendlier.
assert(faq.includes('életkor kemény feltétel'),'FAQ must explain the hard age constraint.');
assert(faq.includes('érdeklődés kapja a legnagyobb súlyt'),'FAQ must explain ranked recommendation priorities.');
assert(faq.includes('legközelebbi BMI-alternatívákat'),'FAQ must explain non-exact BMI alternatives.');
assert(faq.includes('nem igazolt 2026/27-es órarendet'),'FAQ must preserve partner-source caution.');
assert(faq.includes('Sakk és Gondolkodásfejlesztés'),'FAQ must document the current chess activity.');
assert(faq.includes('2026. szeptember 26.'),'FAQ must preserve the current chess first date.');

console.log('PASS: inclusive human copy, foglalkozás terminology, ranked recommender semantics, 23-activity count and chess trust contracts are consistent.');
