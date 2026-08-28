import fs from 'node:fs';
function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}
function visibleText(html){return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim()}
const home=read('index.html'),homeText=visibleText(home),faqText=visibleText(read('gyik.html')),app=read('app.js'),catalog=read('catalog.js');
assert(homeText.includes('Magyar nyelvű foglalkozások kicsiknek és nagyoknak.'),'Homepage positioning missing.');
assert(home.includes('<b>26</b><span>foglalkozás és képzés</span>'),'Homepage must expose 26-item count.');
assert(app.includes('Miben szeretnél leginkább segítséget?'),'Need-based decision question missing.');
assert(app.includes("var names=['1. Életkor','2. Igény','3. Nap','4. Ritmus']"),'Wizard must label second step as need.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age must remain hard in scoring.');
assert(app.includes('var relevant=eligible.filter(interestEligible)'),'Fallback must be based on age+need relevant BMI programs.');
assert(app.includes('Milyen helyzetre?')&&app.includes('Mit ad?'),'Recommendation cards must expose pain point and outcome.');
assert(app.includes('Nincs megfelelő BMI-találat'),'External schools must only be fallback.');
assert(app.includes('A BMI kínálatában nincs ehhez az életkorhoz és igényhez megfelelő program'),'Need-based fallback condition copy missing.');
assert(app.includes('Mind a 26 foglalkozás és képzés'),'Finder must link to all 26 entries.');
assert(!app.includes("html+='</div>'+externalSchools()"),'External schools must not render beside valid BMI recommendations.');
assert(catalog.includes("detail('Milyen helyzetre?',p.painPoint)")&&catalog.includes("detail('Mit ad?',p.outcome)"),'Catalog must explain pain point and outcome.');
assert(faqText.includes('életkor kemény feltétel'),'FAQ must retain hard-age explanation.');
console.log('PASS: need-based decision copy, pain-point/outcome explanations and BMI-first external fallback are consistent.');