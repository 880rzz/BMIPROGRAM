(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function attach(){
  var input=document.getElementById('addressInput');
  if(!input||input.dataset.addressIdentifyReady)return;
  input.dataset.addressIdentifyReady='1';
  input.setAttribute('autocomplete','postal-code');
  input.setAttribute('inputmode','text');
  var note=document.createElement('div');
  note.className='address-identified';
  note.style.marginTop='8px';
  note.style.padding='10px 12px';
  note.style.borderRadius='12px';
  note.style.background='rgba(40,140,80,.08)';
  note.innerHTML='<strong>Privát helybecslés.</strong> Írj be egy osztrák irányítószámot (például 1010 vagy 1130). A beírt szöveg nem hagyja el a böngészőt; az irányítószám helyi középpontjából készül közelítő távolságbecslés.';
  input.parentNode.appendChild(note);
  function identify(){
    delete input.dataset.identifiedLat;delete input.dataset.identifiedLon;delete input.dataset.identifiedLabel;
    var q=input.value.trim(),resolver=window.BMI_LOCAL_LOCATION,p=resolver&&resolver(q),st=document.getElementById('locStatus');
    if(!q){if(st)st.textContent='';return}
    if(!p){if(st)st.textContent='Adj meg egy támogatott osztrák irányítószámot. Bécs 1010–1230 és Baden 2500 helyben felismerhető.';return}
    input.dataset.identifiedLat=String(p.lat);input.dataset.identifiedLon=String(p.lon);input.dataset.identifiedLabel=p.label;
    if(st)st.textContent='Helyben azonosított becslési pont: '+p.label+'. Az adat nem került elküldésre.';
  }
  input.addEventListener('input',identify);
  input.addEventListener('change',identify);
  identify();
}
var wizard=document.getElementById('wizard');if(wizard)new MutationObserver(attach).observe(wizard,{childList:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);else attach();
})();
