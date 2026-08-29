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
    +'#'+ID+' .bmi-wa-icon{display:block!important;box-sizing:content-box!important;width:36px!important;height:36px!important;min-width:36px!important;max-width:36px!important;min-height:36px!important;max-height:36px!important;flex:0 0 36px!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;overflow:visible!important;shape-rendering:geometricPrecision!important;}'
    +'#'+ID+' .bmi-wa-label{display:block!important;white-space:nowrap!important;margin:0!important;padding:0!important;color:#111!important;}'
    +'#'+ID+' .bmi-wa-label small{display:block!important;margin:3px 0 0!important;padding:0!important;color:#6e6e73!important;font-size:11px!important;font-weight:500!important;line-height:1.1!important;}'
    +'@media(max-width:720px){#'+ID+'{right:max(12px,env(safe-area-inset-right))!important;bottom:max(12px,env(safe-area-inset-bottom))!important;width:60px!important;height:60px!important;min-width:60px!important;max-width:60px!important;min-height:60px!important;max-height:60px!important;padding:0!important;gap:0!important;border-radius:50%!important;}#'+ID+' .bmi-wa-label{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;overflow:hidden!important;clip:rect(0 0 0 0)!important;clip-path:inset(50%)!important;white-space:nowrap!important;}#'+ID+' .bmi-wa-icon{width:40px!important;height:40px!important;min-width:40px!important;max-width:40px!important;min-height:40px!important;max-height:40px!important;flex-basis:40px!important;}}';
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
a.innerHTML='<svg class="bmi-wa-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle cx="24" cy="24" r="22" fill="#25D366"/><path fill="#fff" d="M31.9 27.7c-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.7-.2-1 .2-.3.4-1.1 1.3-1.4 1.6-.3.3-.5.3-.9.1-2.3-1.1-3.8-2.1-5.3-4.7-.4-.7.4-.7 1.1-2.3.1-.3.1-.6 0-.9-.1-.2-1-2.5-1.4-3.4-.4-.9-.8-.8-1.1-.8h-.9c-.3 0-.9.1-1.3.6-.4.4-1.7 1.6-1.7 4s1.8 4.7 2 5c.2.3 3.5 5.3 8.4 7.4 3.1 1.3 4.3 1.4 5.9 1.2 1-.2 3-1.2 3.4-2.4.4-1.2.4-2.2.3-2.4-.1-.2-.4-.4-.9-.6Z"/><path fill="#fff" d="M12.1 38.5l1.7-6.2A15.2 15.2 0 1 1 18.9 37l-6.8 1.5Zm7.1-4.4.8.5A12.1 12.1 0 1 0 16.7 31l.5.8-1 3.5 3-.7Z"/></svg><span class="bmi-wa-label">Szülői WhatsApp közösség<small>Csatlakozás egy kattintással</small></span>';
var footerHeadings=document.querySelectorAll('.site-foot h4');
footerHeadings.forEach(function(h){if(h.textContent.trim()==='Hibajelentés és fejlesztés'&&h.parentElement)h.parentElement.classList.add('footer-support-credit')});
if(document.getElementById('wizard')&&!document.querySelector('script[data-travel-polish]')){
  var p=document.createElement('script');p.src='result-travel-polish.js?v=20260830-travel-panel-v1';p.defer=true;p.dataset.travelPolish='1';document.head.appendChild(p);
}
})();
