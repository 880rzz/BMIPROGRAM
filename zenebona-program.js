(function(){
'use strict';
var cfg=window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs))return;

if(!cfg.programs.some(function(p){return p.id==='zenebona'})){
  cfg.programs.push({
    id:"zenebona",
    name:"Zenebona – Zene. Kapcsolódás. Öröm. | Hietzing",
    minAge:0,
    maxAge:3,
    ageText:"0–3 év",
    interests:["nyelv","mozgas"],
    needs:["magyar-nyelv","kozosseg-identitas","mozgas-fejlodes"],
    painPoint:"Kisgyermekkel olyan magyar nyelvű közös programot keresel Bécsben, ahol a zene, mondóka, ritmus, mozgás és az egymásra figyelés természetesen kapcsolódik össze.",
    outcome:"Közös éneklés, mondókázás, mozgás, ritmikus játék, hangszeres felfedezés és rendszeres magyar nyelvű szülő–gyermek közösségi élmény.",
    day:"hetkoznap",
    weekday:"szerda",
    weekdays:["szerda"],
    pace:"rendszeres",
    when:"Szerdánként 10:00–11:15; érkezés 9:45-től, maradás 11:30-ig",
    period:"2026. szeptember 23. – december 16.; alkalmak: szeptember 23., 30.; október 7.; november 4., 11., 18., 25.; december 2., 9., 16.",
    eventDates:["2026-09-23","2026-09-30","2026-10-07","2026-11-04","2026-11-11","2026-11-18","2026-11-25","2026-12-02","2026-12-09","2026-12-16"],
    location:"Zeneterápiás műhely, Fleschgasse 15/1/1, 1130 Wien, Hietzing",
    routeLocation:"Fleschgasse 15/1/1, 1130 Wien, Austria",
    language:"Magyar",
    teacher:"Mag. Dapin Hajnalka Judit, zenepedagógus és zeneterapeuta",
    teacherContact:"+43 699 11569467 · hajnide@yahoo.de",
    teacherBackground:"Zenepedagógusi képzettség Romániában (1995), Németországban (2005) és Ausztriában (2007); zeneterapeuta diploma a Bécsi Zeneegyetemen (2025).",
    fee:"150 € / 10 alkalom",
    paymentDeadline:"2026. október 1.",
    firstDate:"2026. szeptember 23.",
    url:"https://zenebona.magyariskola.at",
    provider:"Zenebona",
    relationship:"bmi-partner",
    sourceType:"saját programoldal 2026/27",
    why:"Magyar nyelvű zenés szülő–gyermek foglalkozás 0–3 éveseknek énekléssel, mondókákkal, mozgással, ritmikus játékokkal és hangszeres felfedezéssel Hietzingben."
  });
}

if(!cfg.programs.some(function(p){return p.id==='oromzene'})){
  cfg.programs.push({
    id:"oromzene",
    name:"Együtt dobban Bécs – Közös örömzene | Schwedenplatz",
    minAge:0,
    maxAge:99,
    ageText:"Minden korosztály – kicsik és nagyok",
    interests:["nyelv","mozgas"],
    needs:["kozosseg-identitas","tanc-hagyomany","mozgas-fejlodes"],
    painPoint:"Olyan bécsi magyar közösségi programot keresel, ahol gyermekek, fiatalok, szülők és felnőttek együtt kapcsolódhatnak, és a zenéléshez nem kell előképzettség.",
    outcome:"Közös dobolás, éneklés, magyar dallamok, generációkat összekötő közösségi élmény és felszabadult örömzenélés teljesítménykényszer nélkül.",
    day:"szombat",
    weekday:"szombat",
    weekdays:["szombat","vasarnap"],
    pace:"rugalmas",
    when:"Havonta 1 alkalom, általában szombaton 18:00-tól; első alkalom: 2026. szeptember 27., vasárnap 18:00",
    period:"2026/27-es tanév; alkalmak: 2026.09.27. vasárnap 18:00; 2026.10.24. szombat 18:00; 2026.11.28. szombat 18:00; 2027.01.16. szombat 18:00; 2027.02.13. szombat 18:00; 2027.03.13. szombat 18:00; 2027.04.17. szombat 18:00; 2027.05.22. szombat 18:00; évzáró: 2027.06.19. vagy 06.26., egyeztetés alatt",
    eventDates:["2026-09-27","2026-10-24","2026-11-28","2027-01-16","2027-02-13","2027-03-13","2027-04-17","2027-05-22"],
    location:"Bécsi Magyar Iskola, Schwedenplatz 2. / Laurenzerberg 5., 1010 Wien",
    routeLocation:"Schwedenplatz 2, 1010 Wien, Austria",
    language:"Magyar",
    teacher:"Regélő Fehér Táltos Hagyományőrző Egyesület Dobcsapata",
    teacherContact:"Hupczik Andrea · +43 670 6539011 · taltosdob@gmail.com",
    fee:"5 € / fő; a közvetlenül előtte zajló gyermek dobos foglalkozás résztvevőinek ingyenes",
    capacity:"10–30 fő",
    duration:"1,5 óra",
    firstDate:"2026. szeptember 27., vasárnap 18:00",
    url:"https://www.magyariskola.at/event-details/oromzene-2026",
    provider:"Regélő Fehér Táltos Hagyományőrző Egyesület",
    relationship:"bmi-partner",
    sourceType:"Wix Events 2026/27 · BMI Partner Program",
    why:"Közös dobolás, éneklés és magyar dallamok minden korosztálynak. Havi egy alkalom, jellemzően szombat esténként 18:00-tól; zenei vagy dobos előképzettség nem szükséges, saját hangszer hozható."
  });
}

var partnerIds=['zenebona','oromzene','mos','fokusz','rekreacio'];
var partners=partnerIds.map(function(id){return cfg.programs.find(function(p){return p.id===id})}).filter(Boolean);
if(typeof document==='undefined'||!partners.length||document.getElementById('partner-programok'))return;

function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]})}
function card(p){
  return '<article class="tile partner-program-card">'+
    '<span class="partner-badge">BMI Partner Program</span>'+
    '<b>'+esc(p.name)+'</b>'+
    '<span>'+esc(p.why||p.outcome||'')+'</span>'+
    '<div class="partner-meta">'+
      (p.ageText?'<small><strong>Korosztály:</strong> '+esc(p.ageText)+'</small>':'')+
      (p.when?'<small><strong>Időpont:</strong> '+esc(p.when)+'</small>':'')+
      (p.location?'<small><strong>Helyszín:</strong> '+esc(p.location)+'</small>':'')+
      (p.fee?'<small><strong>Díj:</strong> '+esc(p.fee)+'</small>':'')+
    '</div>'+
    '<a class="btn ghost partner-link" href="'+esc(p.url)+'" target="_blank" rel="noopener">Részletek</a>'+
  '</article>';
}

var section=document.createElement('section');
section.className='section tint';
section.id='partner-programok';
section.innerHTML='<div class="wrap"><div class="section-head"><div class="kicker">BMI Partner Programok</div><h2>Partnerprogramjaink <span class="headline-accent">egy helyen.</span></h2><p>A Bécsi Magyar Iskola saját foglalkozásai mellett olyan partnerprogramokat is ajánlunk, amelyek jól kiegészítik a közösségi, szakmai és fejlesztő kínálatot.</p></div><div class="tiles partner-program-grid">'+partners.map(card).join('')+'</div></div>';

var aboutSections=document.querySelectorAll('main > section.section');
var anchor=null;
for(var i=0;i<aboutSections.length;i++){
  if(aboutSections[i].querySelector('.kicker')&&aboutSections[i].querySelector('.kicker').textContent.indexOf('A Bécsi Magyar Iskoláról')!==-1){anchor=aboutSections[i];break}
}
if(anchor&&anchor.parentNode){anchor.parentNode.insertBefore(section,anchor)}else{var main=document.querySelector('main');if(main)main.appendChild(section)}

if(!document.getElementById('partner-program-styles')){
  var style=document.createElement('style');
  style.id='partner-program-styles';
  style.textContent='.partner-program-grid{align-items:stretch}.partner-program-card{display:flex;flex-direction:column;gap:.8rem}.partner-program-card>b{font-size:1.05rem}.partner-program-card>span:not(.partner-badge){line-height:1.5}.partner-badge{display:inline-flex;align-self:flex-start;font-size:.72rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;padding:.3rem .55rem;border-radius:999px;background:rgba(245,184,66,.16)}.partner-meta{display:grid;gap:.35rem;margin-top:auto}.partner-meta small{display:block;line-height:1.45}.partner-link{align-self:flex-start;margin-top:.35rem}@media(max-width:760px){.partner-program-grid{grid-template-columns:1fr!important}}';
  document.head.appendChild(style);
}
})();