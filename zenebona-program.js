(function(){
'use strict';
var cfg=window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs))return;
if(cfg.programs.some(function(p){return p.id==='zenebona'}))return;
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
  relationship:"partner",
  sourceType:"saját programoldal 2026/27",
  why:"Magyar nyelvű zenés szülő–gyermek foglalkozás 0–3 éveseknek énekléssel, mondókákkal, mozgással, ritmikus játékokkal és hangszeres felfedezéssel Hietzingben."
});
})();
