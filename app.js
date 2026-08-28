(function(){
var root=document.getElementById('wizard');
if(!root)return;
root.setAttribute('aria-live','polite');
root.setAttribute('aria-atomic','true');
var cfg=window.BMI_FINDER;
if(cfg&&Array.isArray(cfg.programs)&&!cfg.programs.some(function(p){return p.id==='rekreacio'})){
  cfg.programs.push({id:'rekreacio',name:'ReKreáció – Kreatív Közösségi Kuckó | Schwedenplatz',minAge:18,maxAge:99,ageText:'18+',interests:['alkotas'],day:'vasarnap',weekday:'vasarnap',weekdays:['vasarnap'],pace:'rugalmas',when:'Vasárnaponként, meghirdetett időpontokban 10:00–13:00',period:'2026. október 4. – december 13.; alkalmak: október 4., október 18., november 15., november 29., december 13.',location:'Bécsi Magyar Iskola, 1010 Wien, Schwedenplatz 2. Top 8.',teacher:'Egri Mónika – meseíró, illusztrátor',teacherContact:'+36 70 219 5517 · drazsola@gmail.com',fee:'20 € / alkalom',firstDate:'2026. október 4.',registrationDeadline:'2026. szeptember 30.',url:'https://www.magyariskola.at/event-details/rekreacio-2026',provider:'BMI Partner Program',sourceType:'Wix Events 2026/27',why:'Kreatív, befogadó felnőtt közösségi workshop, ahol hétköznapi vagy feleslegessé vált tárgyakból új, esztétikus és használható alkotások születnek környezettudatos szemlélettel.'});
}
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==26){
  root.innerHTML='<div class="wizard-card"><h3>A kereső most átmenetileg nem elérhető</h3><p>Addig is végignézheted az összes foglalkozást.</p><a class="btn" href="foglalkozasok.html">Összes foglalkozás</a></div>';
  return;
}
function patchProgram(id,patch){var p=cfg.programs.find(function(x){return x.id===id});if(p)Object.keys(patch).forEach(function(k){p[k]=patch[k]})}
patchProgram('borsofozde',{minAge:0,maxAge:3,ageText:'0–3 év'});
patchProgram('ovoda',{minAge:3,maxAge:6,ageText:'3–6 év'});
patchProgram('rajztabla',{minAge:10,maxAge:16,ageText:'10–16 év',ageRangeOperational:false});
patchProgram('gimi-svung',{minAge:14,maxAge:18,ageText:'14–18 év',ageRangeOperational:false});
patchProgram('fecskeklub',{minAge:8,maxAge:14,ageText:'8–14 év',ageRangeOperational:false});
patchProgram('vilagfa',{minAge:6,maxAge:14,ageText:'6–14 év',ageRangeComposite:false});
patchProgram('napraforgocskak',{minAge:6,maxAge:15,ageText:'6–15 év',ageRangeOperational:false});
patchProgram('fokusz',{minAge:18,maxAge:99,ageText:'18+',provider:'BMI Partner Program'});
patchProgram('kezdo-neptanc',{minAge:18,maxAge:99,ageText:'18+'});
patchProgram('mos',{minAge:18,maxAge:99,ageText:'18+',provider:'BMI Partner Program'});
patchProgram('rekreacio',{minAge:18,maxAge:99,ageText:'18+',provider:'BMI Partner Program'});
patchProgram('schweden-1',{minAge:6,maxAge:10,ageText:'6–10 év',pace:'rendszeres',when:'Minden szombaton 10:00–12:00'});
patchProgram('schweden-2',{minAge:10,maxAge:14,ageText:'10–14 év',pace:'rugalmas',when:'Kéthetente szombatonként 12:00–14:00'});
cfg.days=[
  {id:'hetfo',label:'Hétfő'},
  {id:'kedd',label:'Kedd'},
  {id:'szerda',label:'Szerda'},
  {id:'csutortok',label:'Csütörtök'},
  {id:'pentek',label:'Péntek'},
  {id:'szombat',label:'Szombat'},
  {id:'vasarnap',label:'Vasárnap'},
  {id:'mindegy',label:'Mindegy'}
];
var state={},idx=0,totalSteps=4;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ageEligible(p){if(!Number.isInteger(state.age))return false;return state.age>=p.minAge&&state.age<=p.maxAge}
function feeForAge(p){return p.fee||''}
function dayEligible(p){if(state.day==='mindegy'||p.weekday==='rugalmas')return true;return(p.weekdays||[p.weekday]).indexOf(state.day)!==-1}
function paceEligible(p){return state.pace==='mindegy'||p.pace===state.pace}
function interestEligible(p){return p.interests.indexOf(state.interest)!==-1}
function isExact(p){return ageEligible(p)&&interestEligible(p)&&dayEligible(p)&&paceEligible(p)}
function scoreProgram(p){
  if(!ageEligible(p))return-1;
  var score=0;
  if(interestEligible(p))score+=60;
  if(dayEligible(p))score+=25;
  if(paceEligible(p))score+=15;
  if(p.provider==='BMI')score+=2;
  return score;
}
function recommendationTier(p){
  if(isExact(p))return'exact';
  if(interestEligible(p))return'goal';
  return'nearby';
}
function deviationText(p){
  var d=[];
  if(!interestEligible(p))d.push('a témája eltér attól, amit elsőként választottál');
  if(!dayEligible(p)&&state.day!=='mindegy')d.push('másik napon van');
  if(!paceEligible(p)&&state.pace!=='mindegy')d.push('más ritmusban működik');
  if(!d.length)return'Pontosan illik a megadott szempontokhoz.';
  return'Ami eltér: '+d.join(', ')+'.';
}
function resultReason(p,primary){
  if(isExact(p))return primary?'Ezt érdemes elsőként megnézned: életkorban, érdeklődésben, napban és ritmusban is passzol.':'Ez is jól illik minden megadott szempontodhoz.';
  var good=['életkorban megfelelő'];
  if(interestEligible(p))good.push('jól illik ahhoz, ami érdekel');
  if(dayEligible(p))good.push(p.weekday==='rugalmas'?'rugalmasan egyeztethető':'a választott napon is elérhető');
  if(paceEligible(p))good.push('a választott ritmushoz illik');
  var lead=primary?'Ezt érdemes elsőként megnézned, mert ':'Ez is jó lehet, mert ';
  return lead+good.join(', ')+'. '+deviationText(p);
}
function progress(n){document.querySelectorAll('#prog i').forEach(function(b,i){b.classList.toggle('on',i<=n)})}
function stepTrail(){
  var names=['1. Életkor','2. Érdeklődés','3. Nap','4. Ritmus'];
  return'<div class="step-trail" aria-label="Kereső lépései">'+names.map(function(name,i){return'<span'+(idx===i?' class="current" aria-current="step"':'')+'>'+name+'</span>'}).join('')+'</div>';
}
function renderAge(){
  progress(0);
  root.innerHTML='<div class="wizard-card">'+stepTrail()+'<div class="kicker">1 / 4</div><h3>Hány éves, akinek foglalkozást keresel?</h3><p>Lehet, hogy a gyermekednek, egy családtagnak vagy saját magadnak keresel. Add meg annak az életkorát, aki részt venne a foglalkozáson.</p><form id="ageForm"><label for="ageInput"><strong>Életkor</strong></label><div class="wizard-nav" style="justify-content:flex-start"><input id="ageInput" name="age" type="number" min="0" max="99" step="1" inputmode="numeric" required value="'+(Number.isInteger(state.age)?state.age:'')+'" style="width:110px;padding:12px 14px;border:1px solid rgba(23,48,66,.22);border-radius:12px;font:inherit"><button class="btn" type="submit">Tovább</button></div><p id="ageError" class="desc" role="alert" style="display:none;margin-top:10px">Adj meg egy 0 és 99 közötti egész életkort.</p></form></div>';
  root.querySelector('#ageForm').addEventListener('submit',function(e){e.preventDefault();var v=Number(root.querySelector('#ageInput').value);if(!Number.isInteger(v)||v<0||v>99){root.querySelector('#ageError').style.display='block';return}state={age:v};idx=1;renderStep()});
}
function renderChoices(title,text,options,key){
  progress(idx);
  var html='<div class="wizard-card">'+stepTrail()+'<div class="kicker">'+(idx+1)+' / '+totalSteps+'</div><h3>'+esc(title)+'</h3><p>'+esc(text)+'</p><div class="choice-grid">';
  options.forEach(function(o){html+='<button class="choice" type="button" data-value="'+esc(o.id)+'">'+esc(o.label)+'</button>'});
  html+='</div><div class="wizard-nav"><button class="btn ghost" type="button" data-back>Vissza</button></div></div>';
  root.innerHTML=html;
  root.querySelectorAll('[data-value]').forEach(function(btn){btn.addEventListener('click',function(){state[key]=this.dataset.value;if(idx<3){idx++;renderStep()}else showResults()})});
  root.querySelector('[data-back]').addEventListener('click',function(){idx--;if(idx===0)renderAge();else renderStep()});
}
function renderStep(){
  if(idx===0){renderAge();return}
  if(idx===1){renderChoices('Mi érdekel a leginkább?','Ezt vesszük a leginkább figyelembe. Ha nincs mindenben pontos egyezés, csak olyan BMI vagy BMI-partner programot mutatunk alternatívaként, amely életkorban és érdeklődési célban is valóban illik.',cfg.interests,'interest');return}
  if(idx===2){renderChoices('Melyik nap lenne a legjobb?','Ha egy hozzád illő BMI-program másik napon van, azt alternatívaként megmutatjuk. Másik iskolát csak akkor ajánlunk, ha a BMI kínálatában nincs életkorban és érdeklődésben megfelelő lehetőség.',cfg.days,'day');return}
  renderChoices('Milyen gyakran fér bele?','Válaszd ki, hogy rendszeres vagy ritkább foglalkozást keresel. Ha mindegy, ezt is megadhatod.',cfg.pace,'pace');
}
function meta(label,value){return value?'<div class="result-meta"><strong>'+esc(label)+':</strong> '+esc(value)+'</div>':''}
function card(p,label,primary){
  return'<article class="result-card'+(primary?' result-card-primary':'')+'" data-recommendation="'+recommendationTier(p)+'"><span class="kicker">'+esc(label)+'</span><b class="result-title">'+esc(p.name)+'</b><span class="result-when">'+esc(p.when)+'</span><p>'+esc(p.why)+'</p>'+meta('Korosztály',p.ageText)+meta('Programgazda',p.provider==='BMI'?'Bécsi Magyar Iskola':p.provider)+meta('Időszak',p.period)+meta('Helyszín',p.location)+meta('Oktató',p.teacher)+meta('Oktatói elérhetőség',p.teacherContact)+meta('Hozzájárulási díj',feeForAge(p))+meta('Csatlakozás',p.enrollment)+meta('Első alkalom',p.firstDate)+meta('Próbaalkalom',p.trial)+meta('Jelentkezési határidő',p.registrationDeadline)+meta('Létszámkorlát',p.capacity)+'<p class="result-reason"><strong>Miért ezt?</strong> '+esc(resultReason(p,primary))+'</p><p><a class="btn" href="'+esc(p.url)+'" target="_blank" rel="noopener">Megnézem a foglalkozást</a></p></article>';
}
function externalSchools(){
  return'<aside class="external-schools"><span class="kicker">Nincs megfelelő BMI-találat</span><b>Nézz körül a másik két bécsi magyar iskola kínálatában is</b><p>A BMI saját és partnerprogramjai között ehhez az életkorhoz és érdeklődési célhoz most nem találtunk megfelelő lehetőséget. Az AMAPED és az Ungarisch Lernen aktuális kínálatát közvetlenül a saját oldalukon tudod megnézni.</p><div class="wizard-nav"><a class="btn ghost" href="https://ungarischlernen.at" target="_blank" rel="noopener">Ungarisch Lernen</a><a class="btn ghost" href="https://amaped.at" target="_blank" rel="noopener">AMAPED</a></div></aside>';
}
function showResults(){
  progress(4);
  var eligible=cfg.programs.filter(ageEligible);
  var relevant=eligible.filter(interestEligible);
  var exact=relevant.filter(isExact).sort(function(a,b){return scoreProgram(b)-scoreProgram(a)||a.name.localeCompare(b.name,'hu')});
  var alternatives=relevant.filter(function(p){return!isExact(p)}).sort(function(a,b){return scoreProgram(b)-scoreProgram(a)||a.name.localeCompare(b.name,'hu')});
  var selected=[];
  if(exact.length)selected=exact.slice(0,3);
  else selected=alternatives.slice(0,3);
  if(exact.length&&selected.length<3){alternatives.forEach(function(p){if(selected.length<3&&selected.indexOf(p)===-1)selected.push(p)})}
  var html='<div class="wizard-card"><span class="kicker">Neked válogattuk</span>';
  if(selected.length){
    if(exact.length){html+='<h3>Van olyan BMI-program, ami pontosan illik ahhoz, amit keresel</h3><p>Az életkor minden esetben kötelező feltétel. Az első kártyán a legerősebb pontos találatot látod.</p>'}
    else{html+='<h3>Van életkorban és érdeklődésben megfelelő BMI-program</h3><p>A választott nap vagy ritmus nem egyezik teljesen, ezért a legjobb BMI-alternatívákat mutatjuk. Másik iskolát ilyenkor nem ajánlunk.</p>'}
    html+='<div class="result-grid">';
    selected.forEach(function(p,i){var label=i===0?(isExact(p)?'Első választás · pontos találat':'Első választás · BMI-alternatíva'):(isExact(p)?'Pontos találat':'BMI-alternatíva');html+=card(p,label,i===0)});
    html+='</div>';
  }else{
    html+='<h3>A BMI kínálatában nincs ehhez az életkorhoz és érdeklődéshez megfelelő program</h3><p>Az életkori határokat nem írjuk felül, és más témájú programot sem nevezünk találatnak.</p>'+externalSchools();
  }
  html+='<div class="wizard-nav result-actions"><button class="btn ghost" type="button" data-back-result>Vissza az utolsó kérdéshez</button><button class="btn ghost" type="button" data-restart>Újrakezdem</button><a class="btn ghost" href="foglalkozasok.html">Mind a 26 foglalkozás és képzés</a></div></div>';
  root.innerHTML=html;
  root.querySelector('[data-back-result]').addEventListener('click',function(){idx=3;renderStep()});
  root.querySelector('[data-restart]').addEventListener('click',function(){state={};idx=0;renderAge()});
}
renderAge();
})();