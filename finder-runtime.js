(function(){
'use strict';
if(!document.getElementById('wizard'))return;

/* Program taxonomy normalization.
   MaMUT Musical is also a drama-pedagogy program, while retaining every
   existing musical / movement / stage classification and recommendation signal. */
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
  var mamut=cfg.programs.find(function(x){return x.id==='mamut'});
  if(mamut){
    /* Preserve the existing categories; only extend the taxonomy. */
    mamut.categories=addUnique(mamut.categories,'musical');
    mamut.categories=addUnique(mamut.categories,'enek');
    mamut.categories=addUnique(mamut.categories,'tanc');
    mamut.categories=addUnique(mamut.categories,'szinpadi-jatek');
    mamut.needs=addUnique(mamut.needs,'onkifejezes-szinpad');
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
