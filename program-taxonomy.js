(function(){'use strict';
var categories=[
 {id:'nyelv',label:'Magyar nyelv és közösség'},
 {id:'alkotas',label:'Alkotás, művészet és színpad'},
 {id:'mozgas',label:'Mozgás, tánc és zene'},
 {id:'logika',label:'Stratégia, digitális készségek és technológia'},
 {id:'jollet',label:'Fejlesztés, fókusz és jóllét'},
 {id:'hagyomany',label:'Kultúra, hagyomány és közösségi élet'}
];
function norm(s){return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim()}
var fixed={
 'becscraft':'logika','sakk':'logika','mos':'logika','fotoklub':'alkotas','filmes':'alkotas','gimi-svung':'alkotas','mamut':'alkotas','cserkeszet':'hagyomany','zenebona':'mozgas','egyutt-dobban':'mozgas','napraforgocskak':'mozgas','neptanc-felnott':'mozgas','alapozo':'jollet'
};
function classify(p){
 if(p&&fixed[p.id])return fixed[p.id];
 var text=[p&&p.id,p&&p.name,p&&p.why,(p&&p.interests||[]).join(' '),(p&&p.needs||[]).join(' ')].map(norm).join(' ');
 if(/minecraft|sakk|office|\bmos\b|informat|technolog|digitalis|strateg/.test(text))return 'logika';
 if(/alapozo|terap|fokusz|jolet|onismer|pszich|mentalis|koncentracio/.test(text))return 'jollet';
 if(/foto|film|rajz|craft|alkot|musical|mamut|svung|drama|szinpad|szinhaz|vizual/.test(text))return 'alkotas';
 if(/neptanc|tanc|zene|zenebona|oromzene|dobcsapat|vilagfa|mozgas|joga|ritmus/.test(text))return 'mozgas';
 if(/cserkesz|hagyomany|kultur|identitas|kozossegepites|nepmuveszet|nephagyomany/.test(text))return 'hagyomany';
 return 'nyelv';
}
function apply(){var cfg=window.BMI_FINDER;if(!cfg||!Array.isArray(cfg.programs))return false;cfg.categories6=categories;cfg.programs.forEach(function(p){p.primaryCategory6=classify(p)});return true}
window.BMI_PROGRAM_TAXONOMY={categories:categories,classify:classify,apply:apply};
if(!apply())document.addEventListener('DOMContentLoaded',apply,{once:true});
})();
