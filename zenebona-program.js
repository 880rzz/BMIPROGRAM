(function(){
'use strict';
var cfg=window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs))return;

if(!cfg.programs.some(function(p){return p.id==='zenebona'})){
  cfg.programs.push({
    id:"zenebona",
    name:"Zenebona – Zene. Kapcsolódás. Öröm. | Hietzing",
    minAge:0,maxAge:3,ageText:"0–3 év",
    interests:["nyelv","mozgas"],needs:["magyar-nyelv","kozosseg-identitas","mozgas-fejlodes"],
    painPoint:"Kisgyermekkel olyan magyar nyelvű közös programot keresel Bécsben, ahol a zene, mondóka, ritmus, mozgás és az egymásra figyelés természetesen kapcsolódik össze.",
    outcome:"Közös éneklés, mondókázás, mozgás, ritmikus játék, hangszeres felfedezés és rendszeres magyar nyelvű szülő–gyermek közösségi élmény.",
    day:"hetkoznap",weekday:"szerda",weekdays:["szerda"],pace:"rendszeres",
    when:"Szerdánként 10:00–11:15; érkezés 9:45-től, maradás 11:30-ig",
    period:"2026. szeptember 23. – december 16.; alkalmak: szeptember 23., 30.; október 7.; november 4., 11., 18., 25.; december 2., 9., 16.",
    eventDates:["2026-09-23","2026-09-30","2026-10-07","2026-11-04","2026-11-11","2026-11-18","2026-11-25","2026-12-02","2026-12-09","2026-12-16"],
    location:"Zeneterápiás műhely, Fleschgasse 15/1/1, 1130 Wien, Hietzing",routeLocation:"Fleschgasse 15/1/1, 1130 Wien, Austria",
    language:"Magyar",teacher:"Mag. Dapin Hajnalka Judit, zenepedagógus és zeneterapeuta",teacherContact:"+43 699 11569467 · hajnide@yahoo.de",
    teacherBackground:"Zenepedagógusi képzettség Romániában (1995), Németországban (2005) és Ausztriában (2007); zeneterapeuta diploma a Bécsi Zeneegyetemen (2025).",
    fee:"150 € / 10 alkalom",paymentDeadline:"2026. október 1.",firstDate:"2026. szeptember 23.",url:"https://zenebona.magyariskola.at",
    provider:"Zenebona",relationship:"bmi-partner",sourceType:"saját programoldal 2026/27",
    why:"Magyar nyelvű zenés szülő–gyermek foglalkozás 0–3 éveseknek énekléssel, mondókákkal, mozgással, ritmikus játékokkal és hangszeres felfedezéssel Hietzingben."
  });
}

if(!cfg.programs.some(function(p){return p.id==='oromzene'})){
  cfg.programs.push({
    id:"oromzene",name:"Együtt dobban Bécs – Közös örömzene | Schwedenplatz",minAge:0,maxAge:99,ageText:"Minden korosztály – kicsik és nagyok",
    interests:["nyelv","mozgas"],needs:["kozosseg-identitas","tanc-hagyomany","mozgas-fejlodes"],
    painPoint:"Olyan bécsi magyar közösségi programot keresel, ahol gyermekek, fiatalok, szülők és felnőttek együtt kapcsolódhatnak, és a zenéléshez nem kell előképzettség.",
    outcome:"Közös dobolás, éneklés, magyar dallamok, generációkat összekötő közösségi élmény és felszabadult örömzenélés teljesítménykényszer nélkül.",
    day:"szombat",weekday:"szombat",weekdays:["szombat","vasarnap"],pace:"rugalmas",when:"Havonta 1 alkalom 18:00-tól",
    period:"2026/27-es tanév; alkalmak: 2026.09.27.; 2026.10.24.; 2026.11.28.; 2027.01.16.; 2027.02.13.; 2027.03.13.; 2027.04.17.; 2027.05.22.; évzáró: 2027.06.19. vagy 06.26., egyeztetés alatt",
    eventDates:["2026-09-27","2026-10-24","2026-11-28","2027-01-16","2027-02-13","2027-03-13","2027-04-17","2027-05-22"],
    tentativeEventDates:["2027-06-19","2027-06-26"],
    location:"Bécsi Magyar Iskola, Schwedenplatz 2. / Laurenzerberg 5., 1010 Wien",routeLocation:"Schwedenplatz 2, 1010 Wien, Austria",language:"Magyar",
    teacher:"Regélő Fehér Táltos Hagyományőrző Egyesület Dobcsapata",teacherContact:"Hupczik Andrea · +43 670 6539011 · taltosdob@gmail.com",
    fee:"5 € / fő; a közvetlenül előtte zajló gyermek dobos foglalkozás résztvevőinek ingyenes",capacity:"10–30 fő",duration:"1,5 óra",
    firstDate:"2026. szeptember 27., vasárnap 18:00",url:"https://www.magyariskola.at/event-details/oromzene-2026",
    provider:"Regélő Fehér Táltos Hagyományőrző Egyesület",relationship:"bmi-partner",sourceType:"Wix Events 2026/27 · BMI Partner Program",
    why:"Közös dobolás, éneklés és magyar dallamok minden korosztálynak. Havi egy alkalom 18:00-tól; zenei vagy dobos előképzettség nem szükséges, saját hangszer hozható."
  });
}

function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function findProgram(id){return cfg.programs.find(function(p){return p.id===id})}
function normalizeRouteLocation(p){
  if(p.routeLocation||!p.location||/online/i.test(p.location))return;
  var n=norm(p.location);
  if(/schwedenplatz|laurenzerberg/.test(n))p.routeLocation='Schwedenplatz 2, 1010 Wien, Austria';
  else if(/fleschgasse/.test(n))p.routeLocation='Fleschgasse 15/1/1, 1130 Wien, Austria';
  else if(/friedrich[- ]schiller[- ]platz/.test(n))p.routeLocation='Friedrich-Schiller-Platz 1, 2500 Baden, Austria';
  else if(/johannesgasse/.test(n)&&/2500/.test(n))p.routeLocation='Johannesgasse 9, 2500 Baden, Austria';
  else if(/wulzendorfstrasse|wulzendorfstraße/.test(n))p.routeLocation='Wulzendorfstraße 1, 1220 Wien, Austria';
  else if(/sonnenallee/.test(n))p.routeLocation='Sonnenallee 116, 1220 Wien, Austria';
  else if(/alliiertenstrasse|alliiertenstraße/.test(n))p.routeLocation='Alliiertenstraße 2, 1020 Wien, Austria';
}
cfg.programs.forEach(normalizeRouteLocation);

/* Official 2026/27 Vienna + Niederösterreich school calendar. */
cfg.calendarRules={
  timezone:'Europe/Vienna',
  schoolYear:{start:'2026-09-07',end:'2027-07-02'},
  publicHolidays:[
    '2026-01-01','2026-01-06','2026-04-06','2026-05-01','2026-05-14','2026-05-25','2026-06-04','2026-08-15','2026-10-26','2026-11-01','2026-12-08','2026-12-25','2026-12-26',
    '2027-01-01','2027-01-06','2027-03-29','2027-05-01','2027-05-06','2027-05-17','2027-05-27','2027-08-15','2027-10-26','2027-11-01','2027-12-08','2027-12-25','2027-12-26'
  ],
  schoolFreeDates:['2026-11-02','2026-11-15'],
  schoolBreaks:[
    ['2026-10-27','2026-10-31'],
    ['2026-12-24','2027-01-06'],
    ['2027-01-30','2027-02-06'],
    ['2027-03-20','2027-03-29'],
    ['2027-05-15','2027-05-17'],
    ['2027-07-03','2027-09-05']
  ],
  regions:['Wien','Niederösterreich'],
  sourceUrls:['https://www.bildung-wien.gv.at/schulen/Schulferien-und-schulfreie-Tage/Schuljahr-2026-2027.html','https://www.bmb.gv.at/Themen/schule/schulpraxis/termine/ferientermine_26_27.html'],
  note:'Schulautonome Tage sind nicht zentral vorhersagbar und müssen bei Bekanntgabe separat ergänzt werden.'
};

function isoDate(d){return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0')}
function dateUtc(iso){var p=String(iso).split('-').map(Number);return new Date(Date.UTC(p[0],p[1]-1,p[2],12,0,0))}
function between(x,a,b){return x>=a&&x<=b}
function isClosed(iso){
  if(cfg.calendarRules.publicHolidays.indexOf(iso)!==-1)return true;
  if(cfg.calendarRules.schoolFreeDates.indexOf(iso)!==-1)return true;
  return cfg.calendarRules.schoolBreaks.some(function(r){return between(iso,r[0],r[1])});
}
function parseFirstDate(p){
  var m=norm(p.firstDate||'').match(/(20\d{2})\.\s*([a-z]+)\s+(\d{1,2})/),months={januar:1,februar:2,marcius:3,aprilis:4,majus:5,junius:6,julius:7,augusztus:8,szeptember:9,oktober:10,november:11,december:12};
  return m&&months[m[2]]?m[1]+'-'+String(months[m[2]]).padStart(2,'0')+'-'+String(Number(m[3])).padStart(2,'0'):null;
}
function isIrregularSchedule(p){var t=norm(p.when);return /kethetente|havonta|ritkabban|meghirdetett\s+idopont|egyeztetett\s+sav|jelentkezes\s+utan/.test(t)}
function isWeeklySchedule(p){
  if(isIrregularSchedule(p))return false;
  var t=norm(p.when);
  return /minden\s+|hetfonkent|keddenkent|szerdankent|csutortokonkent|pentekenkent|szombatonkent|vasarnaponkent|kedden\s+es\s+csutortokon/.test(t);
}
function recurringDates(p,endOverride){
  var wd={vasarnap:0,hetfo:1,kedd:2,szerda:3,csutortok:4,pentek:5,szombat:6};
  var allowed=(p.weekdays||[]).map(function(x){return wd[x]}).filter(function(x){return x!==undefined});
  if(!allowed.length)return[];
  var start=parseFirstDate(p)||cfg.calendarRules.schoolYear.start,end=endOverride||cfg.calendarRules.schoolYear.end,out=[],d=dateUtc(start),last=dateUtc(end);
  for(;d<=last;d.setUTCDate(d.getUTCDate()+1)){
    var iso=isoDate(d);if(allowed.indexOf(d.getUTCDay())!==-1&&!isClosed(iso))out.push(iso);
  }
  return out;
}

var fokus=findProgram('fokusz');
if(fokus){fokus.scheduleMode='appointment';fokus.weekday=null;fokus.weekdays=[];fokus.exactTodayEligible=false;}

var mos=findProgram('mos');
if(mos){mos.scheduleMode='arranged';mos.exactTodayEligible=false;mos.teacher='Hupczik Andrea';mos.teacherBackground='Informatikatanár; a Microsoft Office Specialist képzés foglalkozásvezetője.';}

var napra=findProgram('napraforgocskak');
if(napra){
  napra.weekday='szerda';napra.weekdays=['szerda'];napra.pace='rendszeres';napra.when='Minden szerdán 17:00–18:00';
  napra.teacher='Varga Bernadette és Veres Tamás';
  if(!napra.location)napra.location='Bécsi Magyar Iskola, Schwedenplatz 2 / Laurenzerberg 5., 1010 Wien, Top 8';
  napra.eventDates=recurringDates(napra);
}

var sharedDates=['2026-09-27','2026-10-24','2026-11-28','2027-01-16','2027-02-13','2027-03-13','2027-04-17','2027-05-22'];
var vilagfa=findProgram('vilagfa');
if(vilagfa){
  vilagfa.weekday='szombat';vilagfa.weekdays=['szombat','vasarnap'];vilagfa.when='Havonta 1 alkalom 18:00-tól';
  vilagfa.period='2026/27-es tanév; alkalmak: 09.27. · 10.24. · 11.28. · 01.16. · 02.13. · 03.13. · 04.17. · 05.22.; évzáró: 06.19. / 06.26., egyeztetés alatt';
  vilagfa.eventDates=sharedDates.slice();vilagfa.tentativeEventDates=['2027-06-19','2027-06-26'];vilagfa.firstDate='2026. szeptember 27., vasárnap 18:00';vilagfa.scheduleMode='irregular';
}
var orom=findProgram('oromzene');
if(orom){orom.eventDates=sharedDates.slice();orom.tentativeEventDates=['2027-06-19','2027-06-26'];orom.when='Havonta 1 alkalom 18:00-tól';orom.scheduleMode='irregular';}

var schweden2=findProgram('schweden-2');
if(schweden2){
  schweden2.scheduleMode='irregular';
  var schweden2First=parseFirstDate(schweden2);schweden2.eventDates=schweden2First?[schweden2First]:[];
  if(!schweden2.eventDates.length)schweden2.exactTodayEligible=false;
}
var sakk=findProgram('sakk');
if(sakk){
  sakk.scheduleMode='irregular';
  var sakkFirst=parseFirstDate(sakk);sakk.eventDates=sakkFirst?[sakkFirst]:[];
  if(!sakk.eventDates.length)sakk.exactTodayEligible=false;
}
var cserkeszet=findProgram('cserkeszet');
if(cserkeszet){cserkeszet.scheduleMode='irregular';cserkeszet.exactTodayEligible=false;cserkeszet.teacher='Póser-Piroska Ildikó';if(!cserkeszet.when)cserkeszet.when='Kéthetente szombatonként';if(!cserkeszet.location)cserkeszet.location='Cserkész Csapatotthon, Alliiertenstraße 2, 1020 Wien';}

var rekreacio=findProgram('rekreacio');
if(rekreacio){
  rekreacio.scheduleMode='irregular';
  rekreacio.eventDates=['2026-10-04','2026-10-18','2026-11-15','2026-11-29','2026-12-13'];
  rekreacio.blockedEventDates=['2026-11-15'];
}

/* Only truly weekly courses receive generated dates. Irregular wording can never expand to every matching weekday. */
cfg.programs.forEach(function(p){
  if(Array.isArray(p.eventDates)&&p.eventDates.length)return;
  if(p.scheduleMode==='appointment'||p.scheduleMode==='arranged'||p.scheduleMode==='irregular')return;
  if(!isWeeklySchedule(p))return;
  var end=p.id==='fecskeklub'?'2027-01-26':null;
  p.eventDates=recurringDates(p,end);
});

/* Remaining irregular programs without concrete dates are explicitly prevented from becoming “Még ma” exact matches. */
cfg.programs.forEach(function(p){
  if(p.scheduleMode==='appointment'||p.scheduleMode==='arranged')return;
  if(!isIrregularSchedule(p))return;
  if(Array.isArray(p.eventDates)&&p.eventDates.length)return;
  p.scheduleMode='irregular';p.exactTodayEligible=false;
});

var partnerIds=['zenebona','oromzene','mos','fokusz','rekreacio'];
var partners=partnerIds.map(findProgram).filter(Boolean);
if(typeof document==='undefined'||!partners.length||document.getElementById('partner-programok'))return;
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]})}
function card(p){return '<article class="tile partner-program-card"><span class="partner-badge">BMI Partner Program</span><b>'+esc(p.name)+'</b><span>'+esc(p.why||p.outcome||'')+'</span><div class="partner-meta">'+(p.ageText?'<small><strong>Korosztály:</strong> '+esc(p.ageText)+'</small>':'')+(p.when?'<small><strong>Időpont:</strong> '+esc(p.when)+'</small>':'')+(p.location?'<small><strong>Helyszín:</strong> '+esc(p.location)+'</small>':'')+(p.fee?'<small><strong>Díj:</strong> '+esc(p.fee)+'</small>':'')+'</div><a class="btn ghost partner-link" href="'+esc(p.url)+'" target="_blank" rel="noopener">Részletek</a></article>'}
var section=document.createElement('section');section.className='section tint';section.id='partner-programok';section.innerHTML='<div class="wrap"><div class="section-head"><div class="kicker">BMI Partner Programok</div><h2>Partnerprogramjaink <span class="headline-accent">egy helyen.</span></h2><p>A Bécsi Magyar Iskola saját foglalkozásai mellett olyan partnerprogramokat is ajánlunk, amelyek jól kiegészítik a közösségi, szakmai és fejlesztő kínálatot.</p></div><div class="tiles partner-program-grid">'+partners.map(card).join('')+'</div></div>';
var aboutSections=document.querySelectorAll('main > section.section'),anchor=null;for(var i=0;i<aboutSections.length;i++){if(aboutSections[i].querySelector('.kicker')&&aboutSections[i].querySelector('.kicker').textContent.indexOf('A Bécsi Magyar Iskoláról')!==-1){anchor=aboutSections[i];break}}
if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(section,anchor)}else{var main=document.querySelector('main');if(main)main.appendChild(section)}
if(!document.getElementById('partner-program-styles')){var style=document.createElement('style');style.id='partner-program-styles';style.textContent='.partner-program-grid{align-items:stretch}.partner-program-card{display:flex;flex-direction:column;gap:.8rem}.partner-program-card>b{font-size:1.05rem}.partner-program-card>span:not(.partner-badge){line-height:1.5}.partner-badge{display:inline-flex;align-self:flex-start;font-size:.72rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:.3rem .55rem;border-radius:999px;background:rgba(245,184,66,.16)}.partner-meta{display:grid;gap:.35rem;margin-top:auto}.partner-meta small{display:block;line-height:1.45}.partner-link{align-self:flex-start;margin-top:.35rem}@media(max-width:760px){.partner-program-grid{grid-template-columns:1fr!important}}';document.head.appendChild(style)}
})();