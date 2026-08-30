import fs from 'node:fs';
function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}
const home=read('index.html'),programsPage=read('foglalkozasok.html'),agesPage=read('korosztalyok.html'),faqPage=read('gyik.html'),app=read('app.js'),route=read('route-map.js'),address=read('address-autocomplete.js'),zen=read('zenebona-program.js'),whatsapp=read('whatsapp-widget.js'),typography=read('typography-polish.css'),transit=read('transit-routing.js'),travel=read('result-travel-polish.js'),llms=read('llms.txt');
const publicPages=[home,programsPage,agesPage,faqPage];
assert(home.includes('Magyar nyelvű'),'Homepage positioning missing.');
assert(app.includes("programs.length+' foglalkozás és képzés"),'Finder must link to dynamic registry count.');
assert(app.includes('Miben szeretnél leginkább segítséget?'),'Need-based question missing.');
assert(app.includes('legfeljebb 3 napot')&&app.includes('legfeljebb 2 ritmust'),'Multi-select guidance missing.');
assert(app.includes("if(!ageEligible(p))return-1"),'Age hard filter missing.');
assert(app.includes('Még ma')&&app.includes('eventDates'),'Date-aware recommendation missing.');
assert(app.includes('OpenStreetMap')&&app.includes('travelInfo'),'Travel-aware recommendation missing.');
assert(app.includes('identifiedOrigin(input)')&&address.includes('Azonosított cím:'),'Identified address reuse missing.');
assert(route.includes("data.mode==='transit'"),'Transit navigation fallback missing.');
assert(zen.includes('https://zenebona.magyariskola.at')&&zen.includes('https://www.magyariskola.at/event-details/oromzene-2026'),'Canonical URLs missing.');
assert(llms.includes('28 aktuális'),'LLM program count missing.');
publicPages.forEach((page,i)=>{assert(page.includes('whatsapp-widget.js?v='),`WhatsApp missing page ${i+1}`);assert(page.includes('marketing@kozpontiszovetseg.at'),`Error email missing page ${i+1}`);assert(page.includes('Be Smart Kids Club csapata'),`Credit missing page ${i+1}`);assert(page.includes('https://business.vipach.at'),`VIPACH missing page ${i+1}`)});
assert(!faqPage.includes('<h4>Zenebona</h4>'),'Zenebona footer duplicate.');
assert(whatsapp.includes('bmi-whatsapp-widget')&&whatsapp.includes('transit-routing.js?v=')&&whatsapp.includes('result-travel-polish.js?v='),'Shared loaders missing.');
assert(typography.includes('.hero h1')&&typography.includes('.section-head h2')&&typography.includes('white-space:normal!important')&&typography.includes('text-wrap:balance'),'Heading polish missing.');
assert(transit.includes('v6.db.transport.rest')&&transit.includes('profile=dbnav')&&transit.includes('/locations/nearby?')&&transit.includes('/journeys?'),'DB Navigator REST transit endpoints missing.');
assert(transit.includes('windowStart=target-60')&&transit.includes('median(')&&transit.includes('nextOccurrence'),'Transit next-occurrence time-window contract missing.');
assert(transit.includes('polylines=true')&&transit.includes('journeyKm(')&&transit.includes('transitKm'),'Transit geometry distance contract missing.');
assert(travel.includes('container-type:inline-size')&&travel.includes('@container(max-width:390px)'),'Responsive travel panel missing.');
assert(travel.includes('Átlagos útvonalhossz')&&travel.includes('Átlagos menetidő')&&travel.includes('Nem a keresés pillanatából számol.'),'Scheduled transit result copy missing.');
console.log('PASS: DB Navigator Vienna transit candidate, scheduled time/distance, responsive travel UI and existing recommender contracts are consistent.');