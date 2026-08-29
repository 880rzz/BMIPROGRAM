(function(){
'use strict';
function removeDuplicateMos(){
  var section=document.getElementById('partner-programok');
  if(!section)return;
  section.querySelectorAll('.partner-program-card').forEach(function(card){
    var title=card.querySelector('b');
    if(title&&/Microsoft Office Specialist|\bMOS\b/i.test(title.textContent||''))card.remove();
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removeDuplicateMos);else removeDuplicateMos();
})();
