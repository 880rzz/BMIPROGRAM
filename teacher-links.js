(function(){
'use strict';
var base='https://tanarok.magyariskola.at/#';
var map={"Bajka Kinga Csengele":"bajka-kinga-csengele","Horányi Bori":"horanyi-bori","Dipl.-Päd. Schneider Erzsébet":"schneider-erzsebet","Schneider Erzsébet":"schneider-erzsebet","Makfalvi Rita":"makfalvi-rita","Fersztl Barnabás":"fersztl-barnabas","Noszkó Niki":"noszko-niki","Kiss Ágnes":"kiss-agnes","Boronkai Gabriella":"boronkai-gabriella","Korchma Zsombor":"korchma-zsombor","Hierholcz Anna":"hierholcz-anna","Pecze Ádám":"pecze-adam","Dr. Trencsényi Klára DLA":"trencsenyi-klara","Trencsényi Klára":"trencsenyi-klara","Falusi Dóra":"falusi-dora","Hupczik Andrea":"hupczik-andrea","Varga Bernadette":"varga-bernadette","Veres Tamás":"veres-tamas","Bánhalmi Norbert":"banhalmi-norbert","Balogh Dávid":"balogh-david","Sipos Tibor":"sipos-tibor","Orbán Dalma":"orban-dalma","Egri Mónika":"egri-monika","Mag. Dapin Hajnalka Judit":"dapin-hajnalka-judit","Dapin Hajnalka Judit":"dapin-hajnalka-judit"};
var aliases=Object.keys(map).sort(function(a,b){return b.length-a.length});
var skip={A:1,SCRIPT:1,STYLE:1,NOSCRIPT:1,TEXTAREA:1,INPUT:1,OPTION:1,SELECT:1};
function linkTextNode(node){
  if(!node||!node.nodeValue||!node.parentElement||skip[node.parentElement.tagName]||node.parentElement.closest('a,[data-teacher-profile-link]'))return;
  var text=node.nodeValue, hits=[];
  aliases.forEach(function(name){var start=0,i;while((i=text.indexOf(name,start))!==-1){hits.push({i:i,n:name});start=i+name.length;}});
  if(!hits.length)return;
  hits.sort(function(a,b){return a.i-b.i||b.n.length-a.n.length});
  var chosen=[],end=-1;hits.forEach(function(h){if(h.i>=end){chosen.push(h);end=h.i+h.n.length;}});
  var frag=document.createDocumentFragment(),pos=0;
  chosen.forEach(function(h){if(h.i>pos)frag.appendChild(document.createTextNode(text.slice(pos,h.i)));var a=document.createElement('a');a.href=base+map[h.n];a.textContent=h.n;a.className='teacher-profile-link';a.setAttribute('data-teacher-profile-link','');a.setAttribute('aria-label',h.n+' – tanári profil');frag.appendChild(a);pos=h.i+h.n.length;});
  if(pos<text.length)frag.appendChild(document.createTextNode(text.slice(pos)));
  node.parentNode.replaceChild(frag,node);
}
function scan(root){
  if(!root)return;
  if(root.nodeType===3){linkTextNode(root);return;}
  if(root.nodeType!==1&&root.nodeType!==9&&root.nodeType!==11)return;
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);var nodes=[],n;while((n=w.nextNode()))nodes.push(n);nodes.forEach(linkTextNode);
}
function start(){scan(document.body);var scheduled=false,queue=[];new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){queue.push(n);});});if(!scheduled){scheduled=true;requestAnimationFrame(function(){scheduled=false;var q=queue.splice(0);q.forEach(scan);});}}).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
