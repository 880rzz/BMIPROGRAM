import fs from 'node:fs';
function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}
const home=read('index.html'),app=read('app.js'),catalog=read('catalog.js'),zen=read('zenebona-program.js'),llms=read('llms.txt');
assert(home.includes('Magyar nyelvű'),'Homepage positioning missing.');
assert(app.includes('Mind a 27 foglalkozás és képzés'),'Finder must link to all 27 entries.');
assert(app.includes('Miben szeretnél leginkább segítséget?'),'Need-based question missing.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age must remain hard in scoring.');
assert(app.includes('Milyen helyzetre?')&&app.includes('Mit ad?'),'Recommendation cards must expose pain point and outcome.');
assert(catalog.includes("detail('Milyen helyzetre?',p.painPoint)")&&catalog.includes("detail('Mit ad?',p.outcome)"),'Catalog must explain pain point and outcome.');
assert(catalog.includes("detail('Befizetési határidő',p.paymentDeadline)"),'Catalog must expose Zenebona payment deadline field.');
assert(zen.includes('https://zenebona.magyariskola.at'),'Zenebona canonical URL missing.');
assert(zen.includes('2026. október 1.'),'Zenebona payment deadline missing.');
assert(llms.includes('27 aktuális'),'LLM discovery must state 27 programs.');
console.log('PASS: 27-program copy, Zenebona metadata and recommendation explanations are consistent.');
