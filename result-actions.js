(function(){
'use strict';
var root=document.getElementById('wizard');
if(!root)return;
function directActionParagraph(card){var ps=card.querySelectorAll(':scope > p');for(var i=0;i<ps.length;i++){if(ps[i].querySelector(':scope > .btn[href]'))return ps[i]}return null}
function labelLength(el){var btn=el&& (el.querySelector('.btn')||el);return btn?((btn.textContent||'').trim().length):0}
function arrange(card){if(card.querySelector(':scope > .result-action-grid'))return;var route=card.querySelector(':scope > .route-map-action'),primary=directActionParagraph(card);if(!route&&!primary)return;var grid=document.createElement('div');grid.className='result-action-grid';var actions=[];if(route)actions.push(route);if(primary)actions.push(primary);if(actions.some(function(el){return labelLength(el)>20}))grid.classList.add('has-long-action');actions.forEach(function(el){el.classList.remove('action-wide');grid.appendChild(el)});card.appendChild(grid)}
function run(){root.querySelectorAll('.result-card').forEach(arrange)}
var queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(function(){queued=false;run()})}
new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();
