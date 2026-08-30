(function(){
'use strict';
var root=document.getElementById('wizard');
if(!root)return;
function directActionParagraph(card){var ps=card.querySelectorAll(':scope > p');for(var i=0;i<ps.length;i++){if(ps[i].querySelector(':scope > .btn[href]'))return ps[i]}return null}
function classify(el){var btn=el.querySelector('.btn')||el;if(!btn)return;var text=(btn.textContent||'').trim();el.classList.toggle('action-wide',text.length>22)}
function arrange(card){if(card.querySelector(':scope > .result-action-grid'))return;var route=card.querySelector(':scope > .route-map-action'),primary=directActionParagraph(card);if(!route&&!primary)return;var grid=document.createElement('div');grid.className='result-action-grid';if(route){classify(route);grid.appendChild(route)}if(primary){classify(primary);grid.appendChild(primary)}card.appendChild(grid)}
function run(){root.querySelectorAll('.result-card').forEach(arrange)}
var queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;run()})}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
