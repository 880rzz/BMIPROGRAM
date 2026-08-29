(function(){
'use strict';
var LINK='https://chat.whatsapp.com/Cv4xy5LsODzIztASzPCdCV?s=cl&p=i&mlu=4';
var STYLE_ID='bmi-whatsapp-widget-style';
var ID='bmi-whatsapp-widget';
var style=document.getElementById(STYLE_ID);
if(!style){
  style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=''
    +'#'+ID+'{position:fixed!important;right:max(18px,env(safe-area-inset-right))!important;bottom:max(18px,env(safe-area-inset-bottom))!important;z-index:2147483000!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important;width:auto!important;height:56px!important;min-width:56px!important;max-width:none!important;padding:0 16px 0 11px!important;margin:0!important;border:1px solid rgba(0,0,0,.12)!important;border-radius:999px!important;background:#fff!important;color:#111!important;text-decoration:none!important;box-shadow:0 8px 28px rgba(0,0,0,.16)!important;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif!important;font-size:14px!important;font-weight:650!important;line-height:1.15!important;letter-spacing:-.01em!important;overflow:hidden!important;isolation:isolate!important;transform:none!important;}'
    +'#'+ID+':hover,#'+ID+':focus-visible{box-shadow:0 12px 34px rgba(0,0,0,.22)!important;transform:translateY(-2px)!important;}'
    +'#'+ID+' .bmi-wa-icon{display:block!important;box-sizing:content-box!important;width:34px!important;height:34px!important;min-width:34px!important;max-width:34px!important;min-height:34px!important;max-height:34px!important;flex:0 0 34px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;object-fit:contain!important;overflow:visible!important;}'
    +'#'+ID+' .bmi-wa-label{display:block!important;white-space:nowrap!important;margin:0!important;padding:0!important;color:#111!important;}'
    +'#'+ID+' .bmi-wa-label small{display:block!important;margin:3px 0 0!important;padding:0!important;color:#6e6e73!important;font-size:11px!important;font-weight:500!important;line-height:1.1!important;}'
    +'@media(max-width:720px){#'+ID+'{right:max(12px,env(safe-area-inset-right))!important;bottom:max(12px,env(safe-area-inset-bottom))!important;width:58px!important;height:58px!important;min-width:58px!important;max-width:58px!important;min-height:58px!important;max-height:58px!important;padding:0!important;gap:0!important;border-radius:50%!important;}#'+ID+' .bmi-wa-label{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;}#'+ID+' .bmi-wa-icon{width:36px!important;height:36px!important;min-width:36px!important;max-width:36px!important;min-height:36px!important;max-height:36px!important;flex-basis:36px!important;}}';
  document.head.appendChild(style);
}
var old=document.querySelector('.whatsapp-community');
if(old&&old.id!==ID)old.remove();
var a=document.getElementById(ID);
if(!a){a=document.createElement('a');a.id=ID;document.body.appendChild(a);}
a.className='bmi-whatsapp-widget';
a.href=LINK;
a.target='_blank';
a.rel='noopener noreferrer';
a.setAttribute('aria-label','Csatlakozás a BMI WhatsApp szülői közösségéhez');
a.innerHTML='<svg class="bmi-wa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" focusable="false"><circle cx="16" cy="16" r="15" fill="#25D366"/><path fill="#fff" d="M23.2 8.7A9.85 9.85 0 0 0 7.7 20.6L6.3 25.7l5.2-1.4A9.85 9.85 0 0 0 26 15.6a9.78 9.78 0 0 0-2.8-6.9Zm-7.1 14.9a8.1 8.1 0 1 1 6.9 3.8Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-1.4-.7-2.4-1.3-3.3-2.9-.2-.3.2-.3.6-1.1.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2 0 1.3.9 2.5 1.1 2.7.1.2 1.9 2.9 4.6 4 .6.3 1.1.4 1.5.6.6.2 1.2.2 1.7.1.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.3-.5-.4Z"/></svg><span class="bmi-wa-label">Szülői WhatsApp közösség<small>Csatlakozás egy kattintással</small></span>';
var footerHeadings=document.querySelectorAll('.site-foot h4');
footerHeadings.forEach(function(h){if(h.textContent.trim()==='Hibajelentés és fejlesztés'&&h.parentElement)h.parentElement.classList.add('footer-support-credit')});
if(document.getElementById('wizard')&&!document.querySelector('script[data-travel-polish]')){
  var p=document.createElement('script');p.src='result-travel-polish.js?v=20260830-travel-panel-v1';p.defer=true;p.dataset.travelPolish='1';document.head.appendChild(p);
}
})();
