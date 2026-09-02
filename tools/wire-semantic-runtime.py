from pathlib import Path
import re

# Wire semantic-runtime.js before app.js.
p = Path('index.html')
s = p.read_text(encoding='utf-8')
if 'semantic-runtime.js' not in s:
    m = re.search(r'(<script src="zenebona-program\.js\?v=[^"]+"></script>)', s)
    if not m:
        raise SystemExit('partner registry script anchor not found')
    tag = '<script src="semantic-runtime.js?v=20260902-2"></script>'
    s = s[:m.end()] + tag + s[m.end():]
else:
    s = re.sub(r'semantic-runtime\.js\?v=[^"\']+', 'semantic-runtime.js?v=20260902-2', s)
s = re.sub(r'app\.js\?v=[^"\']+', 'app.js?v=20260902-semantic-v2', s)
p.write_text(s, encoding='utf-8')

p = Path('app.js')
x = p.read_text(encoding='utf-8')
old = "var programs=cfg.programs;\nvar state={},idx=0,totalSteps=5;"
new = "var programs=cfg.programs;\nif(window.BMI_SEMANTIC&&window.BMI_SEMANTIC.enrichProgram)programs.forEach(window.BMI_SEMANTIC.enrichProgram);\nvar state={},idx=0,totalSteps=5;"
if old in x:
    x = x.replace(old, new, 1)
elif 'BMI_SEMANTIC.enrichProgram' not in x:
    raise SystemExit('program init anchor not found')

anchor = "function needMatchCount(p){return matchedNeeds(p).length}\n"
semantic = """function needMatchCount(p){return matchedNeeds(p).length}
function selectedSemantic(){return window.BMI_SEMANTIC&&window.BMI_SEMANTIC.semanticsForNeeds?window.BMI_SEMANTIC.semanticsForNeeds(selectedNeeds()):{roots:[],solutions:[]}}
function semanticFit(p){
 if(!window.BMI_SEMANTIC)return{rootHits:[],solutionHits:[],bonus:0};
 var wanted=selectedSemantic(),ps={roots:p.semanticRootCauses||[],solutions:p.semanticSolutions||[]};
 var rootHits=window.BMI_SEMANTIC.overlap(wanted.roots,ps.roots),solutionHits=window.BMI_SEMANTIC.overlap(wanted.solutions,ps.solutions);
 return{rootHits:rootHits,solutionHits:solutionHits,bonus:Math.min(8,rootHits.length*3+solutionHits.length)};
}
function semanticReason(p){
 var f=semanticFit(p);if(!f.rootHits.length&&!f.solutionHits.length)return'';
 var bits=[];
 if(f.rootHits.length)bits.push('A háttérben álló helyzetek közül illeszkedik ehhez: '+f.rootHits.slice(0,2).map(window.BMI_SEMANTIC.rootLabel).join('; '));
 if(f.solutionHits.length)bits.push('A program ezekre ilyen módon válaszol: '+f.solutionHits.slice(0,2).map(window.BMI_SEMANTIC.solutionLabel).join('; '));
 return ' '+bits.join('. ')+'.';
}
"""
if 'function semanticFit(p)' not in x:
    if anchor not in x:
        raise SystemExit('needMatchCount anchor not found')
    x = x.replace(anchor, semantic, 1)

old = "if(s.length){score+=Math.round(60*hits/s.length);if(hits===s.length)score+=8}if(dayEligible(p))score+=25;"
new = "if(s.length){score+=Math.round(60*hits/s.length);if(hits===s.length)score+=8;score+=semanticFit(p).bonus}if(dayEligible(p))score+=25;"
if old in x:
    x = x.replace(old, new, 1)
elif 'score+=semanticFit(p).bonus' not in x:
    raise SystemExit('score anchor not found')

old = "return intro+coverage+timing+rhythm+' '+deviationText(p)+fit+currentTimeReason(p)}"
new = "return intro+coverage+semanticReason(p)+timing+rhythm+' '+deviationText(p)+fit+currentTimeReason(p)}"
if old in x:
    x = x.replace(old, new, 1)
elif '+semanticReason(p)+' not in x:
    raise SystemExit('resultReason anchor not found')

p.write_text(x, encoding='utf-8')
print('OK: semantic runtime wired into recommender')
