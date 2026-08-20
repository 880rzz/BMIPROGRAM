window.BMI_FINDER={
  ages:[
    {id:"0-3",label:"0–3 év"},
    {id:"3-6",label:"3–6 év"},
    {id:"6-14",label:"6–14 év"},
    {id:"14-21",label:"14–21 év"},
    {id:"felnott",label:"Felnőtt"}
  ],
  interests:[
    {id:"nyelv",label:"Magyar nyelv és közösség"},
    {id:"alkotas",label:"Alkotás, művészet, színpad"},
    {id:"mozgas",label:"Mozgás, tánc, fejlesztés"},
    {id:"tech",label:"Technika, fotó, Minecraft"}
  ],
  days:[
    {id:"hetkoznap",label:"Hétköznap"},
    {id:"szombat",label:"Szombat"},
    {id:"mindegy",label:"Mindegy"}
  ],
  pace:[
    {id:"rendszeres",label:"Rendszeres program"},
    {id:"rugalmas",label:"Ritkább / rugalmasabb"},
    {id:"mindegy",label:"Mindegy"}
  ],
  programs:[
    {id:"borsofozde",name:"Borsófőzde",ages:["0-3"],interests:["nyelv","mozgas"],day:"hetkoznap",pace:"rendszeres",when:"Hétfőnként 10:00-tól",url:"https://www.magyariskola.at/event-details/borsofozde-2026",why:"Baba–mama közeg, magyar mondókák, ének és játékos mozgás."},
    {id:"ovoda",name:"Bécsi Magyar Óvoda | Schwedenplatz",ages:["3-6"],interests:["nyelv","alkotas","mozgas"],day:"szombat",pace:"rendszeres",when:"Szombaton 10:00–12:00",url:"https://www.magyariskola.at/event-details/ovoda-2026",why:"Magyar nyelv, mese, játék és alkotás óvodásoknak."},
    {id:"ovoda-baden",name:"Bécsi Magyar Óvoda | Baden",ages:["3-6"],interests:["nyelv","alkotas","mozgas"],day:"hetkoznap",pace:"rendszeres",when:"Csütörtökön 16:00–18:00",url:"https://www.magyariskola.at/event-details/ovoda-baden-2026",why:"Magyar óvodai közösség Badenben, mesével, dallal és játékos foglalkozásokkal."},
    {id:"iskola-baden",name:"Magyar Iskola Badenben",ages:["6-14"],interests:["nyelv"],day:"hetkoznap",pace:"rendszeres",when:"Keddenként 16:00–17:30",url:"https://www.magyariskola.at/event-details/iskolabaden-2026",why:"Olvasás, szókincs és szövegértés kétnyelvű környezetben."},
    {id:"aspern",name:"Magyar nyelv tanítás | Aspern",ages:["6-14"],interests:["nyelv"],day:"hetkoznap",pace:"rendszeres",when:"Keddenként 15:30–17:00",url:"https://www.magyariskola.at/event-details/magyaroktatas-kedd-2026",why:"Kisiskolások magyar nyelvi fejlesztése játékos, személyre szabott feladatokkal."},
    {id:"seestadt",name:"Magyar nyelv tanítás | Seestadt",ages:["6-14"],interests:["nyelv"],day:"hetkoznap",pace:"rendszeres",when:"Szerdánként 16:00–17:30",url:"https://www.magyariskola.at/event-details/magyarnyelv-szerda-2026",why:"Magyar nyelv, játék, vers, ének és dramatizálás Seestadtban."},
    {id:"schweden-1",name:"Magyar nyelv tanítás | Schwedenplatz | 1-es csoport",ages:["6-14"],interests:["nyelv"],day:"szombat",pace:"rendszeres",when:"Kéthetente szombaton 10:00–11:30",url:"https://www.magyariskola.at/event-details/magyar-nyelv-tanitas-1",why:"Szókincsbővítés és magabiztos magyar nyelvhasználat közösségben."},
    {id:"schweden-2",name:"Magyar nyelv tanítás | Schwedenplatz | 2-es csoport",ages:["6-14"],interests:["nyelv"],day:"szombat",pace:"rendszeres",when:"Kéthetente szombaton 12:00–13:30",url:"https://www.magyariskola.at/event-details/magyarnyelv-schwedenplatz-2",why:"A schwedenplatzi magyar nyelvi program későbbi szombati idősávban."},
    {id:"alapozo",name:"Alapozó Terápia | Schwedenplatz",ages:["6-14"],interests:["mozgas"],day:"hetkoznap",pace:"rendszeres",when:"Hétfőnként 14:30–15:30",url:"https://www.magyariskola.at/event-details/mozgasfejlesztes",why:"Mozgásalapú idegrendszeri fejlesztés kis létszámú csoportban."},
    {id:"rajztabla",name:"RAJZTÁBLA – Rajzfoglalkozás | Schwedenplatz",ages:["6-14","14-21"],interests:["alkotas"],day:"szombat",pace:"rugalmas",when:"Szombaton 14:00–15:30, havonta 1–2 alkalom",url:"https://www.magyariskola.at/event-details/rajztabla-schwedenplatz",why:"Rajzi technika, kompozíció és árnyékolás 10 éves kortól."},
    {id:"varazsceruza",name:"Varázsceruza | Schwedenplatz",ages:["6-14"],interests:["alkotas"],day:"hetkoznap",pace:"rendszeres",when:"Csütörtökön 16:30–18:00",url:"https://www.magyariskola.at/event-details/varazsceruza-schwedenplatz",why:"Elmélyült kreatív alkotóműhely sokféle anyaggal és technikával."},
    {id:"becscraft",name:"BÉCS-CRAFT Workshop | Schwedenplatz",ages:["6-14","14-21"],interests:["tech","alkotas"],day:"hetkoznap",pace:"rendszeres",when:"Hétfőnként 16:30–17:30 + havi helyszíni bejárás",url:"https://www.magyariskola.at/event-details/becs-craft-workshop-hetfo",why:"Minecraft, építészet, történelem és mérés egy közös projektben."},
    {id:"kicsi-svung",name:"Kicsi Svung – Dráma foglalkozás | Schwedenplatz",ages:["6-14"],interests:["alkotas","nyelv"],day:"hetkoznap",pace:"rendszeres",when:"Hétfőn 16:30–18:00",url:"https://www.magyariskola.at/event-details/kicsi-svung-drama-foglalkozas-schwedenplatz-1",why:"Színjátszás, improvizáció és magyar nyelvi önkifejezés gyerekeknek."},
    {id:"mamut",name:"Bécsi Magyar Musical Társulat (maMUT) – Musical Stúdió",ages:["6-14"],interests:["alkotas","mozgas"],day:"hetkoznap",pace:"rendszeres",when:"Csütörtökön 16:30–18:00",url:"https://www.magyariskola.at/event-details/mammut-2026",why:"Ének, mozgás és színpadi játék musical-projektekben."},
    {id:"gimi-svung",name:"Gimi Svung – Magyar nyelvű drámafoglalkozás",ages:["14-21"],interests:["alkotas","nyelv"],day:"hetkoznap",pace:"rendszeres",when:"Péntekenként 16:30–18:00",url:"https://www.magyariskola.at/event-details/gimi-svung-dramafoglalkozas-schwedenplatz",why:"Improvizáció, drámaírás és saját színpadi produkció gimnazistáknak."},
    {id:"filmes",name:"Filmes Műhely Workshop | Schwedenplatz",ages:["14-21"],interests:["alkotas","tech"],day:"hetkoznap",pace:"rendszeres",when:"Szerdánként 15:15–16:45",url:"https://www.magyariskola.at/event-details/filmes-muhely",why:"Forgatókönyv, kamera, hang, rendezés és vágás egy közös film elkészítéséig."},
    {id:"vilagfa",name:"Világfa Sárkányai | Schwedenplatz",ages:["6-14","14-21","felnott"],interests:["nyelv","mozgas","alkotas"],day:"szombat",pace:"rugalmas",when:"Havonta egy szombat délután; gyermekrész + utána nyitott közös dobkör",url:"https://taltosdob.magyariskola.at",why:"Egyetlen program két egymásra épülő résszel: magyar eredetmondák és dobos gyermekfoglalkozás, majd nyitott közös dobkör."},
    {id:"napraforgocskak",name:"Napraforgócskák – Néptánc kicsiknek | Schwedenplatz",ages:["6-14"],interests:["mozgas","nyelv"],day:"hetkoznap",pace:"rendszeres",when:"Szerdánként 17:00–18:00",url:"https://napraforgok.at/r%C3%B3lunk#napraforgocskak",why:"Magyar gyermeknéptánc, zene és közösség a Napraforgók vezetésével."},
    {id:"cserkeszet",name:"Cserkészet | Alliiertenstrasse",ages:["6-14","14-21"],interests:["nyelv","mozgas"],day:"szombat",pace:"rendszeres",when:"Kéthetente szombaton 16:00–19:00",url:"https://cserkesz.at/cserkesz-raj/",why:"Magyar közösség, természet, hagyomány és önállóságra nevelés."},
    {id:"fotoklub",name:"Láss a Mesterek Szemével: VIPACH Felnőtt Fotóklub",ages:["felnott"],interests:["tech","alkotas"],day:"hetkoznap",pace:"rendszeres",when:"Csütörtökön 18:30–20:30",url:"https://www.magyariskola.at/event-details/fotoklub-2026",why:"Fotográfiai látásmód, alkotás és technika felnőtteknek."},
    {id:"fokusz",name:"FÓKUSZ-CSOPORT | Schwedenplatz",ages:["felnott"],interests:["nyelv"],day:"hetkoznap",pace:"rugalmas",when:"75 perces alkalmak, egyeztetett időpontban",url:"https://www.magyariskola.at/event-details/fokuszcsoport-2026",why:"Figyelem, tervezés, érzelemszabályozás és önirányítás felnőtteknek."},
    {id:"kezdo-neptanc",name:"Kezdő néptánc felnőtteknek | Schwedenplatz",ages:["felnott"],interests:["mozgas","nyelv"],day:"hetkoznap",pace:"rendszeres",when:"Hétfőnként 19:00–21:00",url:"https://napraforgok.at/r%C3%B3lunk#kezdocsoport",why:"Belépő szintű magyar néptánc felnőtteknek, közösségi formában."}
  ]
};