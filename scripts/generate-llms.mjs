import fs from 'node:fs';
import vm from 'node:vm';

const ctx={window:{}};
vm.runInNewContext(fs.readFileSync('data.js','utf8'),ctx,{filename:'data.js'});
const cfg=ctx.window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==22)throw new Error('Canonical registry must contain exactly 22 programs.');

const weekday={hetfo:'Hétfő',kedd:'Kedd',szerda:'Szerda',csutortok:'Csütörtök',pentek:'Péntek',szombat:'Szombat',rugalmas:'Rugalmas'};
const pace={rendszeres:'Rendszeres',rugalmas:'Ritkább / rugalmasabb'};
const age=p=>p.maxAge===99?`${p.minAge}+ év`:`${p.minAge}–${p.maxAge} év`;

let out=`# Bécsi Magyar Iskola – 2026/2027 canonical program-adattár

Ez a fájl a programválasztó központi data.js registryjéből generált gépi tükör. Kézzel nem szerkesztendő.

## Kötelező forrásszabály
- Pontosan 22 fix program van.
- Kizárólag a registryben szereplő 22 canonical 2026/27-es link használható programadat-forrásként.
- Korábbi tanévek Wix eseményoldalai teljesen kizártak.
- Partnerprogramnál a partner saját oldala az elsődleges.
- Ha egy aktuális programoldalon egy részlet nem ellenőrizhető, azt ismeretlennek kell tekinteni; régi Wix-oldallal tilos kipótolni.
- A Világfa Sárkányai egyetlen, két részből álló program; nincs külön 23. dobkör-program.
- A Napraforgók haladó csoport nem része a fix 22 programnak.

## Programok
`;

cfg.programs.forEach((p,i)=>{
  out+=`\n${i+1}. ${p.name}\n`;
  out+=`- ID: ${p.id}\n`;
  out+=`- Kor: ${age(p)}\n`;
  out+=`- Nap: ${weekday[p.weekday]||p.weekday}\n`;
  out+=`- Ritmus: ${pace[p.pace]||p.pace}\n`;
  out+=`- Idő: ${p.when}\n`;
  out+=`- Programgazda: ${p.provider==='BMI'?'Bécsi Magyar Iskola':p.provider}\n`;
  out+=`- Röviden: ${p.why}\n`;
  out+=`- Canonical 2026/27: ${p.url}\n`;
});

out+=`\n## Programválasztó logika\n- 1. kérdés: pontos életkor 0–99.\n- 2. kérdés: érdeklődés.\n- 3. kérdés: kívánt nap: hétköznap / szombat / mindegy.\n- 4. kérdés: rendszeresség: rendszeres / ritkább-rugalmasabb / mindegy.\n- A preferenciák nincsenek előre elrejtve. Ha nincs exact BMI-egyezés, a rendszer ezt kimondja.\n- 0 találatnál alternatív bécsi magyar lehetőségként megjelenik: https://ungarischlernen.at és https://amaped.at .\n- Minden BMI-találat közvetlen Regisztráció / jelentkezés gombot kap a canonical programoldalra.\n`;

if(process.argv.includes('--check')){
  const current=fs.readFileSync('llms-full.txt','utf8');
  if(current!==out){
    console.error('llms-full.txt is out of sync with data.js. Run: node scripts/generate-llms.mjs');
    process.exit(1);
  }
  console.log('PASS: llms-full.txt matches canonical registry.');
}else{
  fs.writeFileSync('llms-full.txt',out);
  console.log('Generated llms-full.txt from data.js');
}
