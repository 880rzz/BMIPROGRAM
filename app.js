(function(){
var root=document.getElementById('wizard');
if(!root)return;
var cfg=window.BMI_FINDER;
if(!cfg||!Array.isArray(cfg.programs)||cfg.programs.length!==22){
  root.innerHTML='<div class="wizard-card"><h3>A kereső átmenetileg nem elérhető</h3><p>Az összes foglalkozást továbbra is meg tudod nézni.</p><a class="btn" href="foglalkozasok.html">Összes foglalkozás</a></div>';
  return;
}
var state={},idx=0,totalSteps=4;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function progress(n){document.querySelectorAll('#prog i').forEach(function(b,i){b.classList.toggle('on',i<=n)})}
function ageEligible(p){return Number.isInteger(state.age)&&state.age>=p.minAge&&state.age<=p.maxAge}
function renderAge(){
  progress(0);
  root.innerHTML='<div class="wizard-card"><div class="kicker">1 / 4</div><h3>Hány éves, akinek programot keresel?</h3><p>Írd be a pontos életkort. Ez az egyetlen kötelező kizáró feltétel.</p><form id="ageForm"><label for="ageInput"><strong>Életkor</strong></label><div class="wizard-nav" style="justify-content:flex-start"><input id="ageInput" name="age" type="number" min="0" max="99" step="1" inputmode="numeric" required value="'+(Number.isInteger(state.age)?state.age:'')+'" style="width:110px;padding:12px 14px;border:1px solid rgba(23,48,66,.22);border-radius:12px;font:inherit"><button class="btn" type="submit">Tovább</button></div><p id="ageError" class="desc" role="alert" style="display:none;margin-top:10px">Adj meg egy 0 és 99 közötti egész életkort.</p></form></div>';
  root.querySelector('#ageForm').addEventListener('submit',function(e){
    e.preventDefault();
    var v=Number(root.querySelector('#ageInput').value);
    if(!Number.isInteger(v)||v<0||v>99){root.querySelector('#ageError').style.display='block';return}
    state={age:v};idx=1;renderStep();
  });
  setTimeout(function(){var input=root.querySelector('#ageInput');if(input)input.focus()},0);
}
function renderChoices(title,text,options,key){
  progress(idx);
  var html='<div class="wizard-card"><div class="kicker">'+(idx+1)+' / '+totalSteps+'</div><h3>'+esc(title)+'</h3><p>'+esc(text)+'</p><div class="choice-grid">';
  options.forEach(function(o){html+='<button class="choice" type="button" data-value="'+esc(o.id)+'">'+esc(o.label)+'</button>'});
  html+='</div><div class="wizard-nav"><button class="btn ghost" type="button" data-back>Vissza</button></div></div>';
  root.innerHTML=html;
  root.querySelectorAll('[data-value]').forEach(function(btn){btn.addEventListener('click',function(){state[key]=this.dataset.value;if(idx<3){idx++;renderStep()}else showResults()})});
  root.querySelector('[data-back]').addEventListener('click',function(){idx--;if(idx===0)renderAge();else renderStep()});
}
function renderStep(){
  if(idx===0){renderAge();return}
  if(idx===1){renderChoices('Mi érdekli leginkább?','Válaszd azt is nyugodtan, amire lehet, hogy most nincs BMI-program. Ha nincs pontos találat, mutatunk más bécsi magyar lehetőségeket.',cfg.interests,'interest');return}
  if(idx===2){renderChoices('Mikor lenne a legjobb?','A kívánt időpontot add meg, ne azt, amiről feltételezed, hogy nálunk elérhető.',cfg.days,'day');return}
  renderChoices('Milyen ritmus fér bele?','A saját igényetek szerint válassz. A rendszer csak a végén dönti el, van-e pontos egyezés.',cfg.pace,'pace');
}
function isExact(p){return ageEligible(p)&&p.interests.indexOf(state.interest)!==-1&&(state.day==='mindegy'||p.day===state.day)&&(state.pace==='mindegy'||p.pace===state.pace)}
function resultReason(){var parts=['életkorban megfelelő','a választott témához illik'];if(state.day!=='mindegy')parts.push('a választott napon van');if(state.pace!=='mindegy')parts.push('a kívánt rendszerességű');return parts.join(', ')+'.'}
function showResults(){
  progress(4);
  var exact=cfg.programs.filter(isExact),top=exact.slice(0,3);
  var html='<div class="wizard-card"><span class="kicker">Személyre szabott ajánlás</span>';
  if(top.length){
    html+='<h3 style="margin-top:8px">'+(exact.length===1?'1 pontos találat':exact.length+' pontos találat')+'</h3><p>A rendszer a <strong>'+esc(state.age)+' éves</strong> életkort, az érdeklődést, a napot és a rendszerességet együtt vette figyelembe.</p><div class="result-grid">';
    top.forEach(function(p){
      html+='<article class="result-card"><b>'+esc(p.name)+'</b><span class="result-when">'+esc(p.when)+'</span><p>'+esc(p.why)+'</p><p class="result-reason"><strong>Miért ezt?</strong> '+esc(resultReason())+'</p><p><a class="btn" href="'+esc(p.url)+'" target="_blank" rel="noopener">Regisztráció / jelentkezés</a></p></article>';
    });
    html+='</div>';
  }else{
    html+='<h3 style="margin-top:8px">Nincs pontos BMI-találat</h3><p>A megadott életkorhoz, érdeklődéshez, időponthoz és rendszerességhez jelenleg nincs olyan fix 2026/27-es BMI-program, amely mind a négy feltételnek megfelel.</p><div class="result-card"><b>Más bécsi magyar lehetőségek</b><p>Érdemes megnézni a másik két bécsi hétvégi magyar iskola aktuális kínálatát is.</p><div class="wizard-nav" style="justify-content:flex-start"><a class="btn" href="https://ungarischlernen.at" target="_blank" rel="noopener">Ungarisch Lernen</a><a class="btn ghost" href="https://amaped.at" target="_blank" rel="noopener">AMAPED</a></div></div>';
  }
  html+='<div class="wizard-nav"><button class="btn ghost" type="button" data-back-result>Vissza az utolsó kérdéshez</button><button class="btn ghost" type="button" data-restart>Újrakezdem</button><a class="btn ghost" href="foglalkozasok.html">Mind a 22 program</a></div></div>';
  root.innerHTML=html;
  root.querySelector('[data-back-result]').addEventListener('click',function(){idx=3;renderStep()});
  root.querySelector('[data-restart]').addEventListener('click',function(){state={};idx=0;renderAge()});
}
renderAge();
})();