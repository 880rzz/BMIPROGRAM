import fs from 'node:fs';
function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}
const home=read('index.html'),app=read('app.js'),catalog=read('catalog.js'),zen=read('zenebona-program.js'),llms=read('llms.txt');
assert(home.includes('Magyar nyelvű'),'Homepage positioning missing.');
assert(app.includes("programs.length+' foglalkozás és képzés"),'Finder must link to the dynamic full registry count.');
assert(app.includes('Miben szeretnél leginkább segítséget?'),'Need-based question missing.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age must remain hard in scoring.');
assert(app.includes('Milyen helyzetre?')&&app.includes('Mit ad?'),'Recommendation cards must expose pain point and outcome.');
assert(app.includes('Még ma')&&app.includes('eventDates'),'Date-aware recommendation logic missing.');
assert(app.includes('Utazási idő')&&app.includes('geocode')&&app.includes('travelInfo'),'Travel-aware recommendation logic missing.');
assert(app.includes('clearTravel()')&&app.includes('fetchTimeout'),'Travel cache reset and request timeout must be present.');
assert(catalog.includes("detail('Milyen helyzetre?',p.painPoint)")&&catalog.includes("detail('Mit ad?',p.outcome)"),'Catalog must explain pain point and outcome.');
assert(catalog.includes("detail('Befizetési határidő',p.paymentDeadline)"),'Catalog must expose Zenebona payment deadline field.');
assert(zen.includes('https://zenebona.magyariskola.at'),'Zenebona canonical URL missing.');
assert(zen.includes('https://www.magyariskola.at/event-details/oromzene-2026'),'Örömzene canonical URL missing.');
assert(zen.includes('2026. október 1.'),'Zenebona payment deadline missing.');
assert(llms.includes('28 aktuális'),'LLM discovery must state 28 programs.');
console.log('PASS: 28-program copy, date/travel logic and partner metadata are consistent.');