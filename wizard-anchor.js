(function(){
'use strict';
var root=document.getElementById('wizard');
if(!root)return;
var scheduled=false;
function headerOffset(){var h=document.querySelector('.site-head');if(!h)return 12;var r=h.getBoundingClientRect();return Math.max(12,Math.round(r.height)+12)}
function scrollToCurrentBlock(){scheduled=false;var card=root.querySelector(':scope > .wizard-card')||root.querySelector('.wizard-card')||root;var top=card.getBoundingClientRect().top+window.scrollY-headerOffset();var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;window.scrollTo({top:Math.max(0,top),behavior:reduce?'auto':'smooth'})}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(function(){requestAnimationFrame(scrollToCurrentBlock)})}
var observer=new MutationObserver(function(records){var changed=records.some(function(r){return r.target===root&&r.type==='childList'&&(r.addedNodes.length||r.removedNodes.length)});if(changed)schedule()});
observer.observe(root,{childList:true,subtree:false});
window.BMI_WIZARD_ANCHOR={scrollToCurrentBlock:scrollToCurrentBlock};
})();
