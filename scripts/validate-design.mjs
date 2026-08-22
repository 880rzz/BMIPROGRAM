import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}

const base=read('styles.css');
const ui=read('ui-20260821.css');
const finder=read('recommendation-polish.css');
const pages=['index.html','foglalkozasok.html','korosztalyok.html','gyik.html'].map(path=>({path,html:read(path)}));
const appleStack='font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif';

// The base layer must stay structural and neutral.
assert(base.includes('BMIPROGRAM — neutral structural foundation'),'Base stylesheet must declare its neutral structural role.');
assert(base.includes(appleStack),'Base stylesheet must use the same system typography stack.');
assert(base.includes('--ink:#1d1d1f')&&base.includes('--paper:#ffffff')&&base.includes('--soft:#f5f5f7'),'Neutral base tokens are missing.');
for(const bad of ['--blue','--sun','--summer-','--game-','linear-gradient(','radial-gradient(','#25607f','#173f56','#ffcf5c','#f59d8b','#8fbfa8']){
  assert(!base.includes(bad),`Legacy/color visual token must not occur in structural base CSS: ${bad}`);
}

// Human editorial monochrome system.
assert(ui.includes('BMIPROGRAM — human editorial monochrome design system'),'Global stylesheet must declare the human editorial design-system marker.');
assert(ui.includes('font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif'),'Global type stack must prefer Apple system typography with safe fallbacks.');
assert(ui.includes('--radius:8px')&&ui.includes('--radius-sm:6px'),'Editorial controls must use restrained corner radii.');
assert(ui.includes('.site-head{')&&ui.includes('background:var(--paper)!important')&&ui.includes('backdrop-filter:none!important'),'Header must stay opaque and free of glassmorphism.');
assert(ui.includes('.hero{')&&ui.includes('background:var(--paper)!important'),'Hero must remain white.');
assert(ui.includes('font-size:clamp(3rem,5.8vw,5rem)!important'),'Desktop hero scale must remain editorial rather than billboard-sized.');
assert(ui.includes('.hero .vienna-skyline{display:none!important}'),'Decorative Vienna artwork must stay disabled in the monochrome system.');
assert(ui.includes('.hero h1 .hl svg{display:none!important}'),'Legacy colored hero underline must stay disabled.');
assert(ui.includes('.btn{')&&ui.includes('border-radius:var(--radius)!important')&&ui.includes('background:var(--black)!important'),'Primary controls must be restrained black rectangular buttons, not generic pills.');
assert(ui.includes('.fchip{')&&ui.includes('border-radius:var(--radius-sm)!important'),'Filter controls must avoid oversized pill styling.');
assert(ui.includes('.tiles>.tile{')&&ui.includes('border-radius:0!important'),'Content tiles must read as editorial rows/rules rather than floating cards.');
assert(ui.includes('.wizard-card{')&&ui.includes('border-radius:0!important'),'Finder surface must avoid floating rounded-card treatment.');
assert(ui.includes('details.faq{border-radius:0!important'),'FAQ must remain document-like rather than card-like.');
assert(ui.includes('.stats{')&&ui.includes('border-top:1px solid var(--line)!important'),'Hero facts must remain integrated with a hairline.');
assert(ui.includes('@media(max-width:720px)')&&ui.includes('white-space:nowrap!important'),'Mobile hero phrase must remain protected from orphan line breaks.');
assert(ui.includes('@media(prefers-reduced-motion:reduce)'),'Reduced-motion accessibility contract is required.');
assert(ui.includes(':focus-visible{outline:3px solid var(--focus)!important'),'Visible keyboard focus contract is required.');

// Explicit anti-AI-look constraints: no glass, candy gradients, floating-card motion or all-pill UI.
for(const bad of ['--summer-','--game-','summerButterfly','linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)','#f59d8b','#f7c27b','#8fbfa8','#e2b84a']){
  assert(!ui.includes(bad),`Generic AI/retired visual pattern must not occur in global UI: ${bad}`);
}
for(const bad of ['linear-gradient(','radial-gradient(','#8fbfa8','#efc978','#eaa0a2','#e2b84a','#55766b']){
  assert(!finder.includes(bad),`Finder refinements must remain monochrome and restrained: ${bad}`);
}
assert(finder.includes('finder-only monochrome refinements'),'Finder stylesheet must declare its scoped monochrome role.');

// All human-facing pages must load the same visual system.
for(const {path,html} of pages){
  assert(/href=["']styles\.css\?v=[^"']+["']/.test(html),`${path} must load the neutral structural stylesheet with a version query.`);
  assert(/href=["']ui-20260821\.css\?v=[^"']+["']/.test(html),`${path} must load the global UI stylesheet with a version query.`);
  assert(!html.includes('theme-color" content="#000000"'),`${path} should keep a light browser chrome theme, not force black.`);
}
assert(pages.find(x=>x.path==='index.html').html.includes('recommendation-polish.css'),'Homepage must load finder-only refinements.');

console.log('PASS: human editorial monochrome system, restrained controls, non-card content architecture, accessibility and anti-AI-look contracts are consistent.');
