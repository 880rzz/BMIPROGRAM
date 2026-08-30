(function(){
'use strict';
// Privacy-first compatibility layer for the finder.
// No address, coordinate, selection or usage data is sent to third-party services.
// Third-party geocoding/routing URLs used by legacy finder code are answered locally.
var nativeFetch=window.fetch.bind(window);
var POSTCODES={
'1010':[48.2082,16.3738],'1020':[48.2163,16.4010],'1030':[48.1969,16.3950],'1040':[48.1920,16.3700],'1050':[48.1865,16.3533],'1060':[48.1940,16.3500],'1070':[48.2020,16.3490],'1080':[48.2100,16.3480],'1090':[48.2250,16.3570],
'1100':[48.1530,16.3820],'1110':[48.1695,16.4300],'1120':[48.1765,16.3290],'1130':[48.1810,16.2850],'1140':[48.2030,16.2580],'1150':[48.1950,16.3270],'1160':[48.2140,16.3120],'1170':[48.2260,16.3070],'1180':[48.2350,16.3330],'1190':[48.2490,16.3500],
'1200':[48.2360,16.3770],'1210':[48.2790,16.4120],'1220':[48.2350,16.4630],'1230':[48.1510,16.3180],'2500':[48.0063,16.2300]
};
var KNOWN=[
{re:/Schwedenplatz\s*2|Laurenzerberg/i,pc:'1010',lat:48.211244,lon:16.3782214,label:'1010 Wien, Schwedenplatz'},
{re:/Friedrich-Schiller-Platz\s*1/i,pc:'2500',lat:48.0021277,lon:16.2176148,label:'2500 Baden, Friedrich-Schiller-Platz'},
{re:/Johannesgasse\s*9/i,pc:'2500',lat:48.0069854,lon:16.2275934,label:'2500 Baden, Johannesgasse'},
{re:/Wulzendorfstra(?:ß|ss)e\s*1/i,pc:'1220',lat:48.2200593,lon:16.4596359,label:'1220 Wien, Wulzendorfstraße'},
{re:/Sonnenallee\s*116/i,pc:'1220',lat:48.2290325,lon:16.5120274,label:'1220 Wien, Sonnenallee'},
{re:/Alliiertenstra(?:ß|ss)e\s*2/i,pc:'1020',lat:48.2249026,lon:16.3868872,label:'1020 Wien, Alliiertenstraße'},
{re:/Fleschgasse\s*15/i,pc:'1130',lat:48.1892776,lon:16.2892037,label:'1130 Wien, Fleschgasse'}
];
function response(obj){return Promise.resolve(new Response(JSON.stringify(obj),{status:200,headers:{'Content-Type':'application/json','X-BMI-Privacy':'local-only'}}))}
function locFor(q){for(var i=0;i<KNOWN.length;i++)if(KNOWN[i].re.test(q))return KNOWN[i];var m=String(q||'').match(/\b(1\d{3}|2\d{3})\b/),pc=m&&m[1],c=pc&&POSTCODES[pc];if(c)return{pc:pc,lat:c[0],lon:c[1],label:pc+(pc==='2500'?' Baden':' Wien')};return null}
function photon(url){var q=new URL(url).searchParams.get('q')||'',p=locFor(q);if(!p)return response({features:[]});return response({features:[{type:'Feature',geometry:{type:'Point',coordinates:[p.lon,p.lat]},properties:{name:p.label,postcode:p.pc,city:p.pc==='2500'?'Baden':'Wien',countrycode:'AT'}}]})}
function hav(a,b){var R=6371,rad=Math.PI/180,dLat=(b.lat-a.lat)*rad,dLon=(b.lon-a.lon)*rad,x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dLon/2)*Math.sin(dLon/2);return R*2*Math.atan2(Math.sqrt(x),Math.sqrt(1-x))}
function localRoute(url){var u=new URL(url),m=u.pathname.match(/\/route\/v1\/driving\/([\d.-]+),([\d.-]+);([\d.-]+),([\d.-]+)/);if(!m)return response({routes:[]});var a={lon:+m[1],lat:+m[2]},b={lon:+m[3],lat:+m[4]},walk=/routed-foot/.test(u.pathname),straight=hav(a,b),km=straight*(walk?1.18:1.28),speed=walk?4.5:(km<8?24:km<20?32:42),minutes=Math.max(1,km/speed*60);return response({code:'Ok',routes:[{distance:km*1000,duration:minutes*60,geometry:{type:'LineString',coordinates:[[a.lon,a.lat],[b.lon,b.lat]]}}]})}
window.BMI_PRIVACY_LOCAL=true;
window.BMI_LOCAL_POSTCODES=POSTCODES;
window.BMI_LOCAL_LOCATION=locFor;
window.fetch=function(input,init){var url=typeof input==='string'?input:(input&&input.url)||'';try{var u=new URL(url,location.href);if(u.hostname==='photon.komoot.io')return photon(u.href);if(u.hostname==='routing.openstreetmap.de')return localRoute(u.href);if(u.origin!==location.origin){return Promise.reject(new Error('Privacy policy: automatic third-party network request blocked.'));}}catch(e){}
return nativeFetch(input,init);
};
})();
