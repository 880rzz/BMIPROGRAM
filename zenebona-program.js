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
    location:"Zeneterápiás műhely, Fleschgasse 15/1/1, 1130 Wien, Hietzing",
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

var partnerIds=['zenebona','mos','fokusz','rekreacio'];
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
