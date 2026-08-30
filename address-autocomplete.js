(function(){
'use strict';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
var DISTRICTS={'1010':'Innere Stadt','1020':'Leopoldstadt','1030':'Landstraße','1040':'Wieden','1050':'Margareten','1060':'Mariahilf','1070':'Neubau','1080':'Josefstadt','1090':'Alsergrund','1100':'Favoriten','1110':'Simmering','1120':'Meidling','1130':'Hietzing','1140':'Penzing','1150':'Rudolfsheim-Fünfhaus','1160':'Ottakring','1170':'Hernals','1180':'Währing','1190':'Döbling','1200':'Brigittenau','1210':'Floridsdorf','1220':'Donaustadt','1230':'Liesing','2500':'Baden'};
var KNOWN_LABELS=['1010 Wien, Schwedenplatz 2','1010 Wien, Laurenzerberg 5','1020 Wien, Alliiertenstraße 2','1130 Wien, Fleschgasse 15','1220 Wien, Wulzendorfstraße 1','1220 Wien, Sonnenallee 116','2500 Baden, Friedrich-Schiller-Platz 1','2500 Baden, Johannesgasse 9'];
function localMatches(q){var resolver=window.BMI_LOCAL_LOCATION,n=norm(q),out=[];function push(label){var p=resolver&&resolver(label);if(!p)return;if(out.some(function(x){return x.label===label}))return;out.push({label:label,lat:p.lat,lon:p.lon})}
KNOWN_LABELS.forEach(function(label){if(norm(label).indexOf(n)!==-1||n.split(/\s+/).every(function(t){return !t||norm(label).indexOf(t)!==-1}))push(label)});
var m=String(q||'').match(/\b(1\d{3}|2\d{3})\b/),pc=m&&m[1];if(pc&&DISTRICTS[pc]){var city=pc==='2500'?'Baden':'Wien',district=DISTRICTS[pc];push(pc+' '+city);push(pc+' '+city+' – '+district);push((pc==='2500'?'Baden':'Wien')+' '+district+' ('+pc+')')}
if(!out.length&&q.trim().length>=3){var p=resolver&&resolver(q);if(p)push(p.label)}return out.slice(0,3)}
function attach(){
  var input=document.getElementById('addressInput');
  if(!input||input.dataset.addressIdentifyReady)return;
  input.dataset.addressIdentifyReady='1';
  input.setAttribute('autocomplete','off');
  input.setAttribute('inputmode','text');
  var wrap=input.parentNode;wrap.style.position='relative';
  var list=document.createElement('div');list.className='local-address-suggestions';list.hidden=true;list.setAttribute('role','listbox');list.style.cssText='position:absolute;left:0;right:0;top:calc(100% - 2px);z-index:50;background:#fff;border:1px solid #d2d2d7;border-radius:14px;box-shadow:0 14px 34px rgba(0,0,0,.12);overflow:hidden';wrap.appendChild(list);
  var note=document.createElement('div');
  note.className='address-identified';
  note.style.marginTop='8px';
  note.style.padding='10px 12px';
  note.style.borderRadius='12px';
  note.style.background='rgba(40,140,80,.08)';
  note.innerHTML='<strong>Privát helybecslés.</strong> Gépelés közben legfeljebb 3 helyi javaslat jelenik meg. A beírt szöveg nem hagyja el a böngészőt; a kiválasztott helyből készül közelítő távolságbecslés.';
  wrap.appendChild(note);
  function setPoint(p,label){input.value=label;input.dataset.identifiedLat=String(p.lat);input.dataset.identifiedLon=String(p.lon);input.dataset.identifiedLabel=label;list.hidden=true;var st=document.getElementById('locStatus');if(st)st.textContent='Helyben azonosított becslési pont: '+label+'. Az adat nem került elküldésre.'}
  function renderSuggestions(){var q=input.value.trim(),items=localMatches(q);if(!q||!items.length){list.hidden=true;list.innerHTML='';return}list.innerHTML=items.map(function(x,i){return'<button type="button" role="option" data-i="'+i+'" style="display:block;width:100%;padding:12px 14px;border:0;border-bottom:'+(i===items.length-1?'0':'1px solid #eee')+';background:#fff;text-align:left;font:inherit;cursor:pointer">'+esc(x.label)+'</button>'}).join('');list.hidden=false;Array.prototype.forEach.call(list.querySelectorAll('button'),function(btn){btn.addEventListener('mousedown',function(e){e.preventDefault();var x=items[Number(btn.dataset.i)];if(x)setPoint(x,x.label)})})}
  function identify(){
    delete input.dataset.identifiedLat;delete input.dataset.identifiedLon;delete input.dataset.identifiedLabel;
    var q=input.value.trim(),resolver=window.BMI_LOCAL_LOCATION,p=resolver&&resolver(q),st=document.getElementById('locStatus');
    renderSuggestions();
    if(!q){if(st)st.textContent='';return}
    if(!p){if(st)st.textContent='Válassz a helyi javaslatok közül, vagy adj meg támogatott osztrák irányítószámot.';return}
    input.dataset.identifiedLat=String(p.lat);input.dataset.identifiedLon=String(p.lon);input.dataset.identifiedLabel=p.label;
    if(st)st.textContent='Helyben azonosított becslési pont: '+p.label+'. Az adat nem került elküldésre.';
  }
  input.addEventListener('input',identify);
  input.addEventListener('change',identify);
  input.addEventListener('focus',renderSuggestions);
  input.addEventListener('keydown',function(e){if(e.key==='Escape')list.hidden=true});
  document.addEventListener('click',function(e){if(e.target!==input&&!list.contains(e.target))list.hidden=true});
  identify();
}
var wizard=document.getElementById('wizard');if(wizard)new MutationObserver(attach).observe(wizard,{childList:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attach);else attach();
})();
