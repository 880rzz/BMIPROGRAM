(function(){
'use strict';
var originalFetch=window.fetch.bind(window),lastOrigin=null;
function parseRoutingUrl(url){
  var s=String(url||'');
  if(s.indexOf('routing.openstreetmap.de/routed-')===-1)return null;
  var m=s.match(/routed-(car|foot)\/route\/v1\/driving\/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?);(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/);
  if(!m)return null;
  return{mode:m[1]==='foot'?'walk':'car',origin:{lon:Number(m[2]),lat:Number(m[3])},dest:{lon:Number(m[4]),lat:Number(m[5])}};
}
window.fetch=function(input,init){
  var u=typeof input==='string'?input:(input&&input.url)||'';
  var parsed=parseRoutingUrl(u);
  if(parsed)lastOrigin=parsed.origin;
  return originalFetch(input,init);
};
function canonicalLocation(raw){
  var n=String(raw||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  if(!raw||/online/.test(n))return'';
  if(/schwedenplatz|laurenzerberg/.test(n))return'Schwedenplatz 2, 1010 Wien, Austria';
  if(/fleschgasse/.test(n))return'Fleschgasse 15/1/1, 1130 Wien, Austria';
  if(/friedrich[- ]schiller/.test(n))return'Friedrich-Schiller-Platz 1, 2500 Baden, Austria';
  if(/johannesgasse/.test(n))return'Johannesgasse 9, 2500 Baden, Austria';
  if(/wulzendorf/.test(n))return'Wulzendorfstraße 1, 1220 Wien, Austria';
  if(/sonnenallee/.test(n))return'Sonnenallee 116, 1220 Wien, Austria';
  if(/alliierten/.test(n))return'Alliiertenstraße 2, 1020 Wien, Austria';
  return raw;
}
function locationFromCard(card){
  var rows=card.querySelectorAll('.result-meta');
  for(var i=0;i<rows.length;i++){
    var strong=rows[i].querySelector('strong');
    if(strong&&strong.textContent.trim().toLowerCase().indexOf('helyszín')===0){
      return rows[i].textContent.replace(/^\s*Helyszín\s*:\s*/i,'').trim();
    }
  }
  return'';
}
function modeFromCard(card){
  var t=(card.querySelector('.result-travel')||{}).textContent||'';
  return /gyalog/i.test(t)?'walk':'car';
}
function addButtons(){
  if(!lastOrigin)return;
  document.querySelectorAll('.result-card').forEach(function(card){
    if(card.querySelector('[data-route-map]')||!card.querySelector('.result-travel'))return;
    var loc=locationFromCard(card);
    if(!loc||/online/i.test(loc))return;
    var p=document.createElement('p');
    p.className='route-map-action';
    var b=document.createElement('button');
    b.type='button';b.className='btn ghost';b.setAttribute('data-route-map','');
    b.textContent='Útvonal megtekintése térképen';
    b.addEventListener('click',function(){openRoute(card,b)});
    p.appendChild(b);
    var link=card.querySelector('p:last-child');
    if(link)card.insertBefore(p,link);else card.appendChild(p);
  });
}
new MutationObserver(addButtons).observe(document.getElementById('wizard')||document.body,{childList:true,subtree:true});
function fetchJson(url,timeout){
  var ctl=typeof AbortController!=='undefined'?new AbortController():null;
  var timer=ctl?setTimeout(function(){ctl.abort()},timeout||8000):null;
  return originalFetch(url,{headers:{Accept:'application/json'},signal:ctl?ctl.signal:undefined}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}).finally(function(){if(timer)clearTimeout(timer)});
}
function geocode(q){
  return fetchJson('https://photon.komoot.io/api/?limit=5&lang=de&countrycode=AT&q='+encodeURIComponent(canonicalLocation(q)),7000).then(function(j){
    var f=(j.features||[]).filter(function(x){return String((x.properties||{}).countrycode||'').toUpperCase()==='AT'})[0];
    if(!f)throw new Error('A célcím nem található.');
    return{lon:Number(f.geometry.coordinates[0]),lat:Number(f.geometry.coordinates[1])};
  });
}
function route(origin,dest,mode){
  var profile=mode==='walk'?'foot':'car';
  var u='https://routing.openstreetmap.de/routed-'+profile+'/route/v1/driving/'+origin.lon+','+origin.lat+';'+dest.lon+','+dest.lat+'?overview=full&geometries=geojson&alternatives=false&steps=false';
  return fetchJson(u,9000).then(function(j){var r=j.routes&&j.routes[0];if(!r||!r.geometry)throw new Error('Az útvonal most nem érhető el.');return r});
}
var leafletPromise=null;
function ensureLeaflet(){
  if(window.L)return Promise.resolve(window.L);
  if(leafletPromise)return leafletPromise;
  leafletPromise=new Promise(function(resolve,reject){
    if(!document.querySelector('link[data-leaflet]')){
      var css=document.createElement('link');css.rel='stylesheet';css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';css.crossOrigin='';css.setAttribute('data-leaflet','');document.head.appendChild(css);
    }
    var s=document.createElement('script');s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';s.crossOrigin='';s.onload=function(){resolve(window.L)};s.onerror=function(){reject(new Error('A térképi modul nem tölthető be.'))};document.head.appendChild(s);
  });
  return leafletPromise;
}
function modal(){
  var m=document.getElementById('routeMapModal');if(m)return m;
  m=document.createElement('div');m.id='routeMapModal';m.hidden=true;
  m.innerHTML='<div class="route-map-backdrop" data-route-close></div><section class="route-map-dialog" role="dialog" aria-modal="true" aria-labelledby="routeMapTitle"><div class="route-map-head"><div><span class="kicker">Útvonal</span><h3 id="routeMapTitle">Teljes útvonal térképen</h3><p id="routeMapSummary" class="desc"></p></div><button type="button" class="route-map-close" data-route-close aria-label="Térkép bezárása">×</button></div><div id="routeMapCanvas" class="route-map-canvas" aria-label="Interaktív útvonaltérkép"></div><div class="route-map-links" id="routeMapLinks"></div><p class="desc">OpenStreetMap-alapú útvonal. Az autós menetidő nem tartalmaz élő forgalmi adatot.</p></section>';
  var st=document.createElement('style');st.textContent='.route-map-action{margin:10px 0 14px}.route-map-action .btn{width:100%}#routeMapModal[hidden]{display:none}#routeMapModal{position:fixed;inset:0;z-index:10000}.route-map-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(5px)}.route-map-dialog{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(980px,calc(100vw - 32px));max-height:calc(100vh - 32px);overflow:auto;background:#fff;border-radius:24px;padding:22px;box-shadow:0 24px 80px rgba(0,0,0,.3)}.route-map-head{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.route-map-head h3{margin:.2rem 0}.route-map-close{border:0;background:#f2f2f2;width:42px;height:42px;border-radius:50%;font-size:28px;line-height:1;cursor:pointer}.route-map-canvas{height:min(58vh,560px);min-height:360px;border-radius:18px;overflow:hidden;margin:14px 0}.route-map-links{display:flex;gap:10px;flex-wrap:wrap}.route-map-links a{text-decoration:none}@media(max-width:640px){.route-map-dialog{width:calc(100vw - 16px);padding:14px;border-radius:18px}.route-map-canvas{height:52vh;min-height:320px}}';document.head.appendChild(st);document.body.appendChild(m);
  m.querySelectorAll('[data-route-close]').forEach(function(x){x.addEventListener('click',closeModal)});document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden)closeModal()});return m;
}
var mapInstance=null;
function closeModal(){var m=document.getElementById('routeMapModal');if(!m)return;m.hidden=true;document.body.style.overflow='';if(mapInstance){mapInstance.remove();mapInstance=null}}
function navLinks(origin,dest,mode){
  var google='https://www.google.com/maps/dir/?api=1&origin='+origin.lat+','+origin.lon+'&destination='+dest.lat+','+dest.lon+'&travelmode='+(mode==='walk'?'walking':'driving');
  var apple='https://maps.apple.com/?saddr='+origin.lat+','+origin.lon+'&daddr='+dest.lat+','+dest.lon+'&dirflg='+(mode==='walk'?'w':'d');
  return'<a class="btn ghost" target="_blank" rel="noopener" href="'+google+'">Google Maps</a><a class="btn ghost" target="_blank" rel="noopener" href="'+apple+'">Apple Maps</a>';
}
async function openRoute(card,button){
  if(!lastOrigin)return;
  var old=button.textContent;button.disabled=true;button.textContent='Útvonal betöltése…';
  try{
    var loc=locationFromCard(card),mode=modeFromCard(card),dest=await geocode(loc),rt=await route(lastOrigin,dest,mode),L=await ensureLeaflet(),m=modal();
    m.hidden=false;document.body.style.overflow='hidden';
    var km=(rt.distance/1000).toFixed(1),min=Math.max(1,Math.round(rt.duration/60));
    m.querySelector('#routeMapSummary').textContent=(mode==='walk'?'Gyalog':'Autóval')+' · '+km+' km · kb. '+min+' perc'+(mode==='car'?' · élő forgalom nélkül':'');
    m.querySelector('#routeMapLinks').innerHTML=navLinks(lastOrigin,dest,mode);
    mapInstance=L.map('routeMapCanvas',{zoomControl:true,scrollWheelZoom:true});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(mapInstance);
    var latlngs=rt.geometry.coordinates.map(function(c){return[c[1],c[0]]});
    var line=L.polyline(latlngs,{weight:5,opacity:.9}).addTo(mapInstance);
    L.marker([lastOrigin.lat,lastOrigin.lon]).addTo(mapInstance).bindPopup('Indulás');
    L.marker([dest.lat,dest.lon]).addTo(mapInstance).bindPopup(loc);
    mapInstance.fitBounds(line.getBounds(),{padding:[28,28]});
    setTimeout(function(){if(mapInstance)mapInstance.invalidateSize()},80);
  }catch(e){alert(e&&e.message?e.message:'A térképes útvonal most nem tölthető be.');}
  finally{button.disabled=false;button.textContent=old;}
}
})();