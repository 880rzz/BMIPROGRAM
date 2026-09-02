(function(){'use strict';
var categories=[
 {id:'nyelv',label:'Magyar nyelv és közösség'},
 {id:'alkotas',label:'Alkotás, művészet és színpad'},
 {id:'mozgas',label:'Mozgás, tánc és zene'},
 {id:'logika',label:'Stratégia, digitális készségek és technológia'},
 {id:'jollet',label:'Fejlesztés, fókusz és jóllét'},
 {id:'hagyomany',label:'Kultúra, hagyomány és közösségi élet'}
];

/*
 * 2026/27 canonical six-category taxonomy.
 * Every current program has an explicit primary category. Do not infer the
 * primary category from teacher biographies or incidental keywords.
 */
var fixed={
 'borsofozde':'nyelv',
 'ovoda':'nyelv',
 'ovoda-baden':'nyelv',
 'iskola-baden':'nyelv',
 'aspern':'nyelv',
 'seestadt':'nyelv',
 'schweden-1':'nyelv',
 'schweden-2':'nyelv',

 'rajztabla':'alkotas',
 'varazsceruza':'alkotas',
 'kicsi-svung':'alkotas',
 'gimi-svung':'alkotas',
 'mamut':'alkotas',
 'filmes':'alkotas',
 'fotoklub':'alkotas',
 'rekreacio':'alkotas',

 'zenebona':'mozgas',
 'vilagfa':'mozgas',
 'oromzene':'mozgas',
 'napraforgocskak':'mozgas',
 'kezdo-neptanc':'mozgas',

 'becscraft':'logika',
 'sakk':'logika',
 'mos':'logika',

 'alapozo':'jollet',
 'fokusz':'jollet',

 'cserkeszet':'hagyomany',
 'fecskeklub':'hagyomany'
};

function classify(p){
 if(!p||!p.id)return null;
 return fixed[p.id]||null;
}

function apply(){
 var cfg=window.BMI_FINDER;
 if(!cfg||!Array.isArray(cfg.programs))return false;
 cfg.categories6=categories;
 var unknown=[];
 cfg.programs.forEach(function(p){
   var category=classify(p);
   if(!category){unknown.push(p.id||p.name||'unknown');return;}
   p.primaryCategory6=category;
 });
 if(unknown.length){
   console.error('BMI taxonomy: uncategorized current program(s):',unknown);
   cfg.taxonomyIntegrity={ok:false,uncategorized:unknown.slice()};
 }else{
   cfg.taxonomyIntegrity={ok:true,programCount:cfg.programs.length,categoryCount:categories.length};
 }
 return unknown.length===0;
}

window.BMI_PROGRAM_TAXONOMY={categories:categories,fixed:fixed,classify:classify,apply:apply};
if(!apply())document.addEventListener('DOMContentLoaded',apply,{once:true});
})();
