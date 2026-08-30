(function(){
'use strict';
if(!document.getElementById('wizard'))return;
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
