(function(){
'use strict';
if(!document.getElementById('wizard'))return;

/* Program taxonomy normalization.
   Kicsi Svung + GIMI-SVUNG: primarily prose drama / drama-pedagogy.
   MaMUT Musical: music + singing + dance + drama-pedagogy, not merely a stage activity.
   Existing classifications are preserved and only extended. */
var cfg=window.BMI_FINDER;
if(cfg&&Array.isArray(cfg.programs)){
  function addUnique(list,value){
    list=Array.isArray(list)?list.slice():[];
    if(list.indexOf(value)===-1)list.push(value);
    return list;
  }
  ['kicsi-svung','gimi-svung','mamut'].forEach(function(id){
    var p=cfg.programs.find(function(x){return x.id===id});
    if(!p)return;
    p.categories=addUnique(p.categories,'dramapedagogia');
    p.pedagogyTags=addUnique(p.pedagogyTags,'drámapedagógia');
  });

  ['kicsi-svung','gimi-svung'].forEach(function(id){
    var p=cfg.programs.find(function(x){return x.id===id});
    if(!p)return;
    p.categories=addUnique(p.categories,'prozai-drama');
    p.pedagogyTags=addUnique(p.pedagogyTags,'prózai dráma');
  });

  var mamut=cfg.programs.find(function(x){return x.id==='mamut'});
  if(mamut){
    mamut.categories=addUnique(mamut.categories,'musical');
    mamut.categories=addUnique(mamut.categories,'drama');
    mamut.categories=addUnique(mamut.categories,'zenes-drama');
    mamut.categories=addUnique(mamut.categories,'enek');
    mamut.categories=addUnique(mamut.categories,'zene');
    mamut.categories=addUnique(mamut.categories,'tanc');
    mamut.categories=addUnique(mamut.categories,'szinpadi-jatek');
    mamut.pedagogyTags=addUnique(mamut.pedagogyTags,'zenés dráma');
    mamut.pedagogyTags=addUnique(mamut.pedagogyTags,'énekes dráma');
    mamut.pedagogyTags=addUnique(mamut.pedagogyTags,'táncos dráma');
    mamut.needs=addUnique(mamut.needs,'onkifejezes-szinpad');
    mamut.why='Zenés–táncos–énekes drámafoglalkozás 7–12 éveseknek: a drámapedagógiai és színészi munkát ének, zene, mozgás és koreográfia egészíti ki saját musical-projektekben.';
    mamut.outcome='Drámapedagógiai önkifejezés és szerepformálás, színpadi jelenlét, ének, zene, tánc, mozgás, együttműködés és közös musical-projekt.';
    mamut.painPoint='A gyermek dráma, szerepjáték és színpadi önkifejezés iránt érdeklődik, de a prózai dráma mellett énekelni, zenével dolgozni és táncolni is szeretne egy összetett musical-foglalkozásban.';
  }
}

function addScript(src,key,onload){if(document.querySelector('script[data-'+key+']')){if(onload)onload();return}var s=document.createElement('script');s.src=src;s.defer=true;s.dataset[key]='1';if(onload)s.onload=onload;document.head.appendChild(s)}
function addStyle(src,key){if(document.querySelector('link[data-'+key+']'))return;var l=document.createElement('link');l.rel='stylesheet';l.href=src;l.dataset[key]='1';document.head.appendChild(l)}
addStyle('wizard-responsive.css?v=20260830-runtime-v2','wizardResponsive');
addScript('wizard-anchor.js?v=20260830-runtime-v2','wizardAnchor');
addScript('result-actions.js?v=20260830-runtime-v2','resultActions');
addScript('routes-config.js?v=20260830-runtime-v2','routesConfig',function(){
  addScript('transit-routing.js?v=20260830-runtime-v2','transitRouting',function(){
    addScript('google-routes.js?v=20260830-runtime-v2','googleRoutes');
    addScript('result-travel-polish.js?v=20260830-runtime-v2','travelPolish');
  });
});
})();
