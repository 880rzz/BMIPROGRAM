import fs from 'node:fs';
function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}
function visibleText(html){return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim()}
const home=read('index.html'),homeText=visibleText(home),faq=read('gyik.html'),faqText=visibleText(faq),app=read('app.js');
assert(homeText.includes('Magyar nyelvű foglalkozások kicsiknek és nagyoknak.'),'Homepage positioning missing.');
assert(home.includes('<b>26</b><span>foglalkozás és képzés</span>'),'Homepage must expose 26-item count.');
assert(home.includes('<b>7</b><span>nap a héten</span>'),'Homepage must include Sunday in day count.');
assert(homeText.includes('Az életkor kötelező feltétel')||homeText.includes('Az életkor kemény feltétel'),'Homepage must explain hard age constraint.');
assert(homeText.includes('Microsoft Office Specialist (MOS) felkészítő tanfolyam'),'MOS course must be visible.');
assert(homeText.includes('BMI Partner Program'),'Homepage must distinguish BMI Partner Program.');
assert(!homeText.includes('dobkör és tréning'),'Adult browse copy must not imply Világfa adult eligibility.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age must remain hard in scoring.');
assert(app.includes('var relevant=eligible.filter(interestEligible)'),'Alternatives must remain age+interest relevant.');
assert(app.includes('Nincs megfelelő BMI-találat'),'External schools must only be presented as fallback.');
assert(app.includes('A BMI kínálatában nincs ehhez az életkorhoz és érdeklődéshez megfelelő program'),'Fallback condition copy missing.');
assert(app.includes('Mind a 26 foglalkozás és képzés'),'Finder must link to all 26 entries.');
assert(app.includes('Korosztály'),'Result cards must expose age.');
assert(!app.includes("html+='</div>'+externalSchools()"),'External schools must not render beside valid BMI recommendations.');
assert(faqText.includes('életkor kemény feltétel'),'FAQ must explain hard age constraint.');
console.log('PASS: homepage count, exact-age messaging and BMI-first external fallback copy are consistent.');
