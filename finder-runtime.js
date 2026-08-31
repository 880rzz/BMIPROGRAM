(function(){
'use strict';
if(!document.getElementById('wizard'))return;

var cfg=window.BMI_FINDER;
if(cfg&&Array.isArray(cfg.programs)){
  function addUnique(list,value){
    list=Array.isArray(list)?list.slice():[];
    if(list.indexOf(value)===-1)list.push(value);
    return list;
  }
  function removeValues(list,values){
    list=Array.isArray(list)?list.slice():[];
    return list.filter(function(value){return values.indexOf(value)===-1});
  }

  ['kicsi-svung','gimi-svung'].forEach(function(id){
    var p=cfg.programs.find(function(x){return x.id===id});
    if(!p)return;
    p.categories=addUnique(p.categories,'dramapedagogia');
    p.pedagogyTags=addUnique(p.pedagogyTags,'drámapedagógia');
    p.categories=addUnique(p.categories,'prozai-drama');
    p.pedagogyTags=addUnique(p.pedagogyTags,'prózai dráma');
    p.categories=addUnique(p.categories,'szinpadi-jatek');
    p.pedagogyTags=addUnique(p.pedagogyTags,'színpadi játék');
    p.pedagogyTags=addUnique(p.pedagogyTags,'szerepformálás');
    p.pedagogyTags=addUnique(p.pedagogyTags,'színpadi önkifejezés');
    p.needs=addUnique(p.needs,'onkifejezes-szinpad');
  });

  var mamut=cfg.programs.find(function(x){return x.id==='mamut'});
  if(mamut){
    mamut.categories=removeValues(mamut.categories,['dramapedagogia','drama','zenes-drama','prozai-drama']);
    mamut.pedagogyTags=removeValues(mamut.pedagogyTags,['drámapedagógia','zenés dráma','énekes dráma','táncos dráma','prózai dráma']);
    mamut.categories=addUnique(mamut.categories,'musical');
    mamut.categories=addUnique(mamut.categories,'enek');
    mamut.categories=addUnique(mamut.categories,'zene');
    mamut.categories=addUnique(mamut.categories,'tanc');
    mamut.categories=addUnique(mamut.categories,'szinpadi-jatek');
    mamut.needs=addUnique(mamut.needs,'onkifejezes-szinpad');
    mamut.why='Ének, zene, tánc és színpadi játék 7–12 éveseknek saját musical-projektekben, közösségi alkotással és előadói élménnyel.';
    mamut.outcome='Színpadi jelenlét, ének, zene, tánc, mozgás, szerepformálás, együttműködés és közös musical-projekt.';
    mamut.painPoint='A gyermek szeret énekelni, táncolni vagy szerepelni, és egy összetett musical-foglalkozásban szeretné kipróbálni magát.';
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
