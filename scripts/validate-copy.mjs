import fs from 'node:fs';
function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}
const home=read('index.html'),programsPage=read('foglalkozasok.html'),agesPage=read('korosztalyok.html'),faqPage=read('gyik.html'),app=read('app.js'),route=read('route-map.js'),address=read('address-autocomplete.js'),catalog=read('catalog.js'),zen=read('zenebona-program.js'),whatsapp=read('whatsapp-widget.js'),typography=read('typography-polish.css'),transit=read('transit-routing.js'),travel=read('result-travel-polish.js'),llms=read('llms.txt');
const publicPages=[home,programsPage,agesPage,faqPage];
assert(home.includes('Magyar nyelvű'),'Homepage positioning missing.');
assert(app.includes("programs.length+' foglalkozás és képzés"),'Finder must link to dynamic registry count.');
assert(app.includes('Miben szeretnél leginkább segítséget?'),'Need-based question missing.');
assert(app.includes('legfeljebb 3 napot')&&app.includes('legfeljebb 2 ritmust'),'Multi-select guidance missing.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age hard filter missing.');
assert(app.includes('Még ma')&&app.includes('eventDates'),'Date-aware recommendation missing.');
assert(app.includes('OpenStreetMap')&&app.includes('travelInfo'),'Travel-aware recommendation missing.');
assert(app.includes('identifiedOrigin(input)')&&address.includes('Azonosított cím:'),'Identified address reuse missing.');
assert(route.includes("data.mode==='transit'")&&route.includes("b.textContent='Térkép és útvonal'"),'Shared in-app map action missing.');
assert(route.includes("if(data.mode==='transit')")&&route.includes("dashArray:'8 8'"),'Transit schematic map missing.');
assert(zen.includes('https://zenebona.magyariskola.at')&&zen.includes('https://www.magyariskola.at/event-details/oromzene-2026'),'Canonical partner URLs missing.');
assert(catalog.includes("p.id!=='zenebona'&&overlaps"),'Zenebona must stay out of age browser.');
assert(!home.includes('Zenebona')&&!agesPage.includes('Zenebona')&&!faqPage.includes('Zenebona'),'Zenebona must not be promoted in home, age browser or FAQ static copy.');
assert(!llms.includes('## Zenebona'),'LLM discovery must not feature a dedicated Zenebona promotion section.');
assert(llms.includes('28 aktuális'),'LLM program count missing.');
const shellSubtitle='Délutáni és hétvégi foglalkozások · 2026 / 2027';
publicPages.forEach((page,i)=>{
 assert(page.includes(shellSubtitle),`Shared header subtitle missing page ${i+1}`);
 assert(page.includes('hero-identity')&&page.includes('hero-school-name')&&page.includes('hero-founded'),`Shared hero identity missing page ${i+1}`);
 ['Foglalkozásválasztó','Összes foglalkozás','Korosztályok','Kérdések','1987–2027 · 40 éves BMI','Tanévbeszámoló'].forEach(label=>assert(page.includes(label),`Shared navigation item ${label} missing page ${i+1}`));
 assert(page.includes('whatsapp-widget.js?v='),`WhatsApp missing page ${i+1}`);
 assert(page.includes('marketing@kozpontiszovetseg.at'),`Error email missing page ${i+1}`);
 assert(page.includes('Be Smart Kids Club csapata'),`Credit missing page ${i+1}`);
 assert(page.includes('https://business.vipach.at'),`VIPACH missing page ${i+1}`);
});
assert(!faqPage.includes('<h4>Zenebona</h4>'),'Zenebona footer duplicate.');
assert(whatsapp.includes('bmi-whatsapp-widget')&&whatsapp.includes('transit-routing.js?v=')&&whatsapp.includes('result-travel-polish.js?v='),'Shared loaders missing.');
assert(typography.includes('.hero-identity')&&typography.includes('.site-head .head-in')&&typography.includes('.hero h1')&&typography.includes('text-wrap:balance'),'Unified responsive shell/heading polish missing.');
assert(transit.includes('nextOccurrence')&&transit.includes('windowFor')&&transit.includes('haversineKm')&&transit.includes('transitEstimate'),'Transit planning estimate missing.');
assert(transit.includes("providerStatus:'approximate-planning-range'")&&transit.includes('transitMinMinutes')&&transit.includes('transitMaxMinutes'),'Transit range contract missing.');
assert(travel.includes('container-type:inline-size')&&travel.includes('@container(max-width:390px)'),'Responsive travel panel missing.');
assert(travel.includes("mode==='car'")&&travel.includes("mode==='walk'")&&travel.includes("mode==='transit'"),'All travel modes must be rendered.');
assert(travel.includes('Várható menetidő')&&travel.includes('kb. ')&&travel.includes('perc'),'Travel range copy missing.');
console.log('PASS: unified shell, Zenebona scope, approximate km/time ranges for car-walk-transit, responsive travel UI and in-app maps are consistent.');
