(function(){
'use strict';
var root=document.getElementById('wizard');
if(!root)return;
root.setAttribute('aria-live','polite');
root.setAttribute('aria-atomic','true');
var cfg=window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==26||!Array.isArray(cfg.needs)){
  root.innerHTML='<div class="wizard-card"><h3>A kereső most átmenetileg nem elérhető</h3><p>Addig is végignézheted az összes foglalkozást.</p><a class="btn" href="foglalkozasok.html">Összes foglalkozás</a></div>';
  return;
}
var state={},idx=0,totalSteps=4;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function ageEligible(p){if(!Number.isInteger(state.age))return false;return state.age>=p.minAge&&state.age<=p.maxAge}
function feeForAge(p){return p.fee||''}
function dayEligible(p){if(state.day==='mindegy'||p.weekday==='rugalmas')return true;return(p.weekdays||[p.weekday]).indexOf(state.day)!==-1}
function paceEligible(p){return state.pace==='mindegy'||p.pace===state.pace}
function needEligible(p){return Array.isArray(p.needs)&&p.needs.indexOf(state.need)!==-1}
/* Compatibility name kept because need-fit is the primary semantic match signal. */
function interestEligible(p){return needEligible(p)}
function isExact(p){return ageEligible(p)&&interestEligible(p)&&dayEligible(p)&&paceEligible(p)}
function scoreProgram(p){
  if(!ageEligible(p))return-1;
  var score=0;
  if(interestEligible(p))score+=60;
  if(dayEligible(p))score+=25;
  if(paceEligible(p))score+=15;
  if(p.relationship==='bmi')score+=2;
  return score;
}
function recommendationTier(p){if(isExact(p))return'exact';if(interestEligible(p))return'goal';return'nearby'}
function deviationText(p){
  var d=[];
  if(!interestEligible(p))d.push('más igényre ad elsődleges választ');
  if(!dayEligible(p)&&state.day!=='mindegy')d.push('másik napon van');
  if(!paceEligible(p)&&state.pace!=='mindegy')d.push('más ritmusban működik');
  if(!d.length)return'Pontosan illik a megadott szempontokhoz.';
  return'Ami eltér: '+d.join(', ')+'.';
}
function resultReason(p,primary){
  var fit=p.outcome?'A program várható eredménye: '+p.outcome:'';
  if(isExact(p))return(primary?'Ezt érdemes elsőként megnézned: ':'')+'életkorban, igényben, napban és ritmusban is passzol. '+fit;
  var good=['életkorban megfelelő'];
  if(interestEligible(p))good.push('közvetlenül arra az igényre ad választ, amit megjelöltél');
  if(dayEligible(p))good.push(p.weekday==='rugalmas'?'rugalmasan egyeztethető':'a választott napon is elérhető');
  if(paceEligible(p))good.push('a választott ritmushoz illik');
  return(primary?'Ezt érdemes elsőként megnézned, mert ':'Ez is jó lehet, mert ')+good.join(', ')+'. '+deviationText(p)+' '+fit;
}
function progress(n){document.querySelectorAll('#prog i').forEach(function(b,i){b.classList.toggle('on',i<=n)})}
function stepTrail(){
  var names=['1. Életkor','2. Igény','3. Nap','4. Ritmus'];
  return'<div class="step-trail" aria-label="Kereső lépései">'+names.map(function(name,i){return'<span'+(idx===i?' class="current" aria-current="step"':'')+'>'+name+'</span>'}).join('')+'</div>';
}
function renderAge(){
  progress(0);
  root.innerHTML='<div class="wizard-card">'+stepTrail()+'<div class="kicker">1 / 4</div><h3>Hány éves, akinek foglalkozást keresel?</h3><p>Lehet, hogy a gyermekednek, egy családtagnak vagy saját magadnak keresel. Az életkor kötelező feltétel: ezen kívüli programot nem ajánlunk találatként.</p><form id="ageForm"><label for="ageInput"><strong>Életkor</strong></label><div class="wizard-nav" style="justify-content:flex-start"><input id="ageInput" name="age" type="number" min="0" max="99" step="1" inputmode="numeric" required value="'+(Number.isInteger(state.age)?state.age:'')+'" style="width:110px;padding:12px 14px;border:1px solid rgba(23,48,66,.22);border-radius:12px;font:inherit"><button class="btn" type="submit">Tovább</button></div><p id="ageError" class="desc" role="alert" style="display:none;margin-top:10px">Adj meg egy 0 és 99 közötti egész életkort.</p></form></div>';
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
  if(idx===1){renderChoices('Miben szeretnél leginkább segítséget?','Ne tantárgyat válassz, hanem azt az eredményt vagy helyzetet, ami most a legfontosabb. Ez lesz az ajánlás legerősebb döntési pontja.',cfg.needs,'need');return}
  if(idx===2){renderChoices('Melyik nap lenne a legjobb?','Ha az igényre és életkorra megfelelő BMI-program másik napon van, azt alternatívaként megmutatjuk. Másik iskolát csak akkor ajánlunk, ha a teljes BMI-kínálatban nincs megfelelő megoldás.',cfg.days,'day');return}
  renderChoices('Milyen gyakran fér bele?','Válaszd ki, hogy rendszeres vagy ritkább foglalkozást keresel. Ha mindegy, ezt is megadhatod.',cfg.pace,'pace');
}
function meta(label,value){return value?'<div class="result-meta"><strong>'+esc(label)+':</strong> '+esc(value)+'</div>':''}
function relationLabel(p){if(p.relationship==='bmi')return'BMI saját program';if(p.relationship==='bmi-partner')return'BMI Partner Program';return'Partnerprogram'}
function card(p,label,primary){
  return'<article class="result-card'+(primary?' result-card-primary':'')+'" data-recommendation="'+recommendationTier(p)+'"><span class="kicker">'+esc(label)+'</span><b class="result-title">'+esc(p.name)+'</b><span class="result-when">'+esc(p.when)+'</span>'+meta('Korosztály',p.ageText)+meta('Helyszín',p.location)+meta('Milyen helyzetre?',p.painPoint)+meta('Mit ad?',p.outcome)+meta('Programkapcsolat',relationLabel(p))+meta('Programgazda',p.provider==='BMI'?'Bécsi Magyar Iskola':p.provider)+meta('Időszak',p.period)+meta('Oktató',p.teacher)+meta('Oktatói elérhetőség',p.teacherContact)+meta('Hozzájárulási díj',feeForAge(p))+meta('Csatlakozás',p.enrollment)+meta('Első alkalom',p.firstDate)+meta('Próbaalkalom',p.trial)+meta('Jelentkezési határidő',p.registrationDeadline)+meta('Létszámkorlát',p.capacity)+'<p class="result-reason"><strong>Miért ezt?</strong> '+esc(resultReason(p,primary))+'</p><p><a class="btn" href="'+esc(p.url)+'" target="_blank" rel="noopener">Megnézem a foglalkozást</a></p></article>';
}
function externalSchools(){
  return'<aside class="external-schools"><span class="kicker">Nincs megfelelő BMI-találat</span><b>Nézz körül a másik két bécsi magyar iskola kínálatában is</b><p>A BMI saját és partnerprogramjai között ehhez az életkorhoz és a megjelölt igényhez most nem találtunk megfelelő lehetőséget. Az AMAPED és az Ungarisch Lernen aktuális kínálatát közvetlenül a saját oldalukon tudod megnézni.</p><div class="wizard-nav"><a class="btn ghost" href="https://ungarischlernen.at" target="_blank" rel="noopener">Ungarisch Lernen</a><a class="btn ghost" href="https://amaped.at" target="_blank" rel="noopener">AMAPED</a></div></aside>';
}
function showResults(){
  progress(4);
  var eligible=cfg.programs.filter(ageEligible);
  var relevant=eligible.filter(interestEligible);
  var exact=relevant.filter(isExact).sort(function(a,b){return scoreProgram(b)-scoreProgram(a)||a.name.localeCompare(b.name,'hu')});
  var alternatives=relevant.filter(function(p){return!isExact(p)}).sort(function(a,b){return scoreProgram(b)-scoreProgram(a)||a.name.localeCompare(b.name,'hu')});
  var selected=[];
  if(exact.length)selected=exact.slice(0,3);else selected=alternatives.slice(0,3);
  if(exact.length&&selected.length<3){alternatives.forEach(function(p){if(selected.length<3&&selected.indexOf(p)===-1)selected.push(p)})}
  var html='<div class="wizard-card"><span class="kicker">Neked válogattuk</span>';
  if(selected.length){
    if(exact.length)html+='<h3>Van olyan BMI-program, ami pontosan illik ahhoz, amit keresel</h3><p>Az életkor kötelező feltétel, az igény pedig az elsődleges rangsorolási szempont. Az első kártyán a legerősebb pontos találatot látod.</p>';
    else html+='<h3>Van életkorban és igényben megfelelő BMI-program</h3><p>A választott nap vagy ritmus nem egyezik teljesen, ezért a legjobb BMI-alternatívákat mutatjuk. Másik iskolát ilyenkor nem ajánlunk.</p>';
    html+='<div class="result-grid">';
    selected.forEach(function(p,i){var label=i===0?(isExact(p)?'Első választás · pontos találat':'Első választás · BMI-alternatíva'):(isExact(p)?'Pontos találat':'BMI-alternatíva');html+=card(p,label,i===0)});
    html+='</div>';
  }else{
    html+='<h3>A BMI kínálatában nincs ehhez az életkorhoz és igényhez megfelelő program</h3><p>Az életkori határokat nem írjuk felül, és más problémára készült programot sem nevezünk találatnak.</p>'+externalSchools();
  }
  html+='<div class="wizard-nav result-actions"><button class="btn ghost" type="button" data-back-result>Vissza az utolsó kérdéshez</button><button class="btn ghost" type="button" data-restart>Újrakezdem</button><a class="btn ghost" href="foglalkozasok.html">Mind a 26 foglalkozás és képzés</a></div></div>';
  root.innerHTML=html;
  root.querySelector('[data-back-result]').addEventListener('click',function(){idx=3;renderStep()});
  root.querySelector('[data-restart]').addEventListener('click',function(){state={};idx=0;renderAge()});
}
renderAge();
})();