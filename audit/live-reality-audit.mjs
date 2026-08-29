#!/usr/bin/env node
import fs from 'node:fs';
import vm from 'node:vm';

const errors=[];const warnings=[];const info=[];
const err=(code,message,context={})=>errors.push({severity:'error',code,message,context});
const warn=(code,message,context={})=>warnings.push({severity:'warning',code,message,context});
const note=(code,message,context={})=>info.push({severity:'info',code,message,context});
const sandbox={window:{},console};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync('data.js','utf8'),sandbox,{filename:'data.js'});
vm.runInContext(fs.readFileSync('zenebona-program.js','utf8'),sandbox,{filename:'zenebona-program.js'});
const cfg=sandbox.window.BMI_FINDER;const programs=cfg?.programs||[];

async function fetchT(url,opts={},ms=9000){const ctl=new AbortController();const t=setTimeout(()=>ctl.abort(),ms);try{return await fetch(url,{...opts,signal:ctl.signal,headers:{'user-agent':'BMIProgramRealityAudit/1.0 (+https://programvalaszto.magyariskola.at)',accept:'application/json,text/html;q=0.9,*/*;q=0.8',...(opts.headers||{})}})}finally{clearTimeout(t)}}
function postcode(s){return (String(s||'').match(/\b([1-9]\d{3})\b/)||[])[1]||''}
function hav(a,b){const R=6371,dLat=(b.lat-a.lat)*Math.PI/180,dLon=(b.lon-a.lon)*Math.PI/180,x=Math.sin(dLat/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLon/2)**2;return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
async function geocode(q){const url='https://photon.komoot.io/api/?limit=5&lang=de&countrycode=AT&q='+encodeURIComponent(q);const r=await fetchT(url,{},10000);if(!r.ok)throw new Error('Photon HTTP '+r.status);const j=await r.json();let f=(j.features||[]).filter(x=>String(x.properties?.countrycode||'').toUpperCase()==='AT');const pc=postcode(q);if(pc){const exact=f.filter(x=>String(x.properties?.postcode||'')===pc);if(exact.length)f=exact}if(!f[0])return null;const c=f[0].geometry?.coordinates||[];return{lat:Number(c[1]),lon:Number(c[0]),properties:f[0].properties||{}}}
async function route(a,b,profile){const url=`https://routing.openstreetmap.de/routed-${profile}/route/v1/driving/${a.lon},${a.lat};${b.lon},${b.lat}?overview=false&alternatives=false&steps=false`;const r=await fetchT(url,{},12000);if(!r.ok)throw new Error(`routing ${profile} HTTP ${r.status}`);const j=await r.json();const rt=j.routes?.[0];return rt?{km:rt.distance/1000,minutes:rt.duration/60}:null}

for(const p of programs){
  try{const r=await fetchT(p.url,{redirect:'follow'},10000);if(r.status===404||r.status===410)err('PROGRAM_URL_DEAD',`${p.id}: programoldal nem található`,{url:p.url,status:r.status});else if(r.status>=500)warn('PROGRAM_URL_SERVER',`${p.id}: programoldal szerverhibát adott`,{url:p.url,status:r.status});else if(r.status===401||r.status===403)warn('PROGRAM_URL_BLOCKED',`${p.id}: programoldal automata ellenőrzést blokkol`,{url:p.url,status:r.status});else if(!r.ok)warn('PROGRAM_URL_HTTP',`${p.id}: szokatlan HTTP státusz`,{url:p.url,status:r.status});else note('PROGRAM_URL_OK',`${p.id}: programoldal elérhető`,{status:r.status,url:r.url});}
  catch(e){warn('PROGRAM_URL_NETWORK',`${p.id}: programoldal hálózati ellenőrzése sikertelen`,{url:p.url,error:String(e.message||e)});}
}

const physical=[...new Set(programs.map(p=>p.routeLocation).filter(Boolean))];
const geo=new Map();
for(const loc of physical){
  try{const g=await geocode(loc);if(!g){err('GEOCODE_NO_RESULT','Nincs ausztriai címfeloldás',{location:loc});continue}const pc=postcode(loc),got=String(g.properties.postcode||'');if(pc&&got&&pc!==got){err('GEOCODE_POSTCODE_MISMATCH','A cím más irányítószámra oldódott fel',{location:loc,expected:pc,actual:got,properties:g.properties});continue}if(!(g.lat>=46.3&&g.lat<=49.1&&g.lon>=9.4&&g.lon<=17.2)){err('GEOCODE_OUTSIDE_AT','A címfeloldás Ausztrián kívüli koordinátát adott',{location:loc,g});continue}geo.set(loc,g);note('GEOCODE_OK','Ausztriai címfeloldás rendben',{location:loc,lat:g.lat,lon:g.lon,postcode:got});}
  catch(e){warn('GEOCODE_NETWORK','Photon címfeloldás hálózati hibát adott',{location:loc,error:String(e.message||e)});}
}

let origin=null;try{origin=await geocode('Stephansplatz 1, 1010 Wien, Austria')}catch(e){warn('CONTROL_ORIGIN','Kontrollpont címfeloldása sikertelen',{error:String(e.message||e)})}
if(origin){for(const [loc,g] of geo){const straight=hav(origin,g);for(const profile of ['car','foot']){try{const rt=await route(origin,g,profile);if(!rt){err('ROUTE_NO_RESULT','Nincs útvonal',{location:loc,profile});continue}if(!(rt.km>=Math.max(0,straight*0.90))){err('ROUTE_BELOW_GEODESIC','Az útvonal irreálisan rövidebb a légvonalnál',{location:loc,profile,routeKm:rt.km,straightKm:straight});continue}if(rt.km>Math.max(5,straight*8)){warn('ROUTE_EXTREME_DETOUR','Az útvonal szokatlanul nagy kerülőt ad',{location:loc,profile,routeKm:rt.km,straightKm:straight});}if(!(rt.minutes>0&&rt.minutes<600)){err('ROUTE_DURATION_INVALID','Érvénytelen menetidő',{location:loc,profile,minutes:rt.minutes});continue}note('ROUTE_OK','Útvonal-szolgáltatás valós úthálózati eredményt adott',{location:loc,profile,km:Number(rt.km.toFixed(2)),minutes:Number(rt.minutes.toFixed(1)),straightKm:Number(straight.toFixed(2))});}catch(e){warn('ROUTE_NETWORK','Routing szolgáltatás hálózati hibát adott',{location:loc,profile,error:String(e.message||e)});}}}}

const app=fs.readFileSync('app.js','utf8');
if(!/countrycode=AT/.test(app))err('APP_GEOCODE_NOT_AT_FILTERED','Az éles app nem használ Photon countrycode=AT szűrést');
const dynamicProfiles=/profile=mode==='walk'\?'foot':'car'/.test(app)&&/routing\.openstreetmap\.de\/routed-'\+profile/.test(app);
if(!dynamicProfiles)err('APP_ROUTE_PROFILE_DYNAMIC','Az éles appban nem igazolható a car/foot OSM profilváltás');
if(!/p\._travel\.estimated\)return false/.test(app))err('APP_TODAY_FALLBACK_UNSAFE','A routing fallback még használható biztos „Még ma odaérek” állításhoz');
if(!/state\.origin&&!p\._travel\)return false/.test(app))err('APP_MISSING_ROUTE_UNSAFE','Megadott kiindulópont mellett hiányzó útvonal még exact „Még ma” találatot engedhet');
if(!/if\(state\.day==='ma'\)\{var ts=todayStatus\(p\)/.test(app))err('APP_TODAY_SCORE_LEAK','Az aktuális mai időpont más nap kiválasztásakor is torzíthatja a rangsort');
if(!/p\._travel&&!p\._travel\.estimated/.test(app))err('APP_ESTIMATE_RANKING','Fallback becslés még befolyásolhatja a rangsort');
if(/if\(mode==='walk'\).*haversine[\s\S]{0,180}return\{km/.test(app))err('APP_WALK_MODEL_ONLY','A gyalogos mód továbbra is pusztán légvonalas modell');

const report={generatedAt:new Date().toISOString(),summary:{errors:errors.length,warnings:warnings.length,info:info.length,programs:programs.length,physicalLocations:physical.length},errors,warnings,info};
fs.mkdirSync('audit/output',{recursive:true});fs.writeFileSync('audit/output/live-reality-audit.json',JSON.stringify(report,null,2));
const md=['# BMI live reality audit','',`Generated: ${report.generatedAt}`,'',`- Errors: **${errors.length}**`,`- Warnings: **${warnings.length}**`,`- Info: **${info.length}**`,`- Programs: **${programs.length}**`,`- Physical route locations: **${physical.length}**`,'','## Findings','',...[...errors,...warnings,...info].map(x=>`- **${x.severity.toUpperCase()} · ${x.code}** — ${x.message} \`${JSON.stringify(x.context)}\``)].join('\n');fs.writeFileSync('audit/output/live-reality-audit.md',md);console.log(md);
if(errors.length)process.exitCode=1;
