import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}
function visibleText(html){
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ')
    .replace(/<[^>]+>/g,' ')
    .replace(/&nbsp;/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

const home=read('index.html');
const homeText=visibleText(home);
const faq=read('gyik.html');
const faqText=visibleText(faq);
const app=read('app.js');

// Homepage: validate human-visible meaning, not presentation markup.
assert(homeText.includes('Gyermeknek keresel délutáni vagy hétvégi magyar foglalkozást? Vagy saját magadnak választanál közösségi programot vagy szakmai képzést?'),'Homepage must explicitly support both child and adult program seekers.');
assert(homeText.includes('Magyar nyelvű foglalkozások kicsiknek és nagyoknak.'),'Homepage hero must clearly position the offer as Hungarian-language activities for all ages.');
assert(homeText.includes('Bécsi Magyar Iskola alapítva 1987 2026 / 2027-es tanév'),'Homepage hero identity must show school, founding year and current school year together.');
assert(homeText.includes('Foglalkozásválasztó'),'Homepage must use the public foglalkozás terminology.');
assert(homeText.includes('A Bécsi Magyar Iskola nem egész napos iskola'),'Homepage must explain the afternoon/weekend school model.');
assert(home.includes('<b>24</b><span>foglalkozás és képzés</span>'),'Homepage must expose the current 24-item count.');
assert(homeText.includes('Microsoft Office Specialist (MOS) felkészítő tanfolyam'),'Homepage must introduce the MOS course by its exact name.');
assert(home.includes('https://mos.magyariskola.at'),'Homepage must link to the canonical MOS course domain.');
assert(!homeText.includes('mire vágytok'),'Homepage must not assume a multi-parent household.');
assert(!homeText.includes('gyermeketek'),'Homepage must not use plural-parent child wording.');

// Recommendation engine contracts: wording may evolve, ranking semantics may not.
assert(app.includes("if(interestEligible(p))score+=60"),'Interest must remain the strongest preference signal.');
assert(app.includes("if(dayEligible(p))score+=25"),'Day preference weight contract missing.');
assert(app.includes("if(paceEligible(p))score+=15"),'Cadence preference weight contract missing.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age must remain a hard recommendation constraint.');
assert(app.includes("if(p.provider==='BMI')score+=2"),'BMI exact/preference tie-break contract missing.');
assert(app.includes('Ami eltér:'),'Alternative cards must explain deviations in human language.');
assert(app.includes('Nézz körül a másik két bécsi magyar iskola kínálatában is'),'External schools must remain visible beside recommendations.');
assert(app.includes('Mind a 24 foglalkozás'),'Finder result actions must expose all 24 canonical entries.');
assert(app.includes('Hány éves, akinek foglalkozást keresel?'),'Finder must use neutral activity wording.');
assert(app.includes('saját magadnak keresel'),'Finder must support adult self-search.');
assert(app.includes('Megnézem a foglalkozást'),'Result CTA must describe an activity, not a generic program.');
assert(!app.includes('Nézzetek körül'),'Finder must not assume a plural household.');

// FAQ/data trust contracts: validate visible prose independent of inline emphasis tags.
assert(faqText.includes('életkor kemény feltétel'),'FAQ must explain the hard age constraint.');
assert(faqText.includes('érdeklődés kapja a legnagyobb súlyt'),'FAQ must explain ranked recommendation priorities.');
assert(faqText.includes('legközelebbi BMI-alternatívákat'),'FAQ must explain non-exact BMI alternatives.');
assert(faqText.includes('nem igazolt 2026/27-es órarendet'),'FAQ must preserve partner-source caution.');
assert(faqText.includes('Sakk és Gondolkodásfejlesztés'),'FAQ must document the current chess activity.');
assert(faqText.includes('2026. szeptember 26.'),'FAQ must preserve the current chess first date.');
assert(faqText.includes('Mi a Microsoft Office Specialist felkészítő tanfolyam?'),'FAQ must explain the MOS course.');

console.log('PASS: visible human copy, Hungarian-language positioning, founding identity, ranked recommender semantics and trust contracts are consistent.');
