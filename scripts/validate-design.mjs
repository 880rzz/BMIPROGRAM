import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
let warnings=0;
function assert(ok,msg){if(!ok){warnings+=1;console.warn(`DESIGN-AUDIT WARNING: ${msg}`)}}

const base=read('styles.css');
const ui=read('ui-20260821.css');
const finder=read('recommendation-polish.css');
const pages=['index.html','foglalkozasok.html','korosztalyok.html','gyik.html'].map(path=>({path,html:read(path)}));

// Structural foundation must stay neutral and system-native.
assert(base.includes('BMIPROGRAM — neutral structural foundation'),'Missing neutral structural foundation marker.');
assert(base.includes('-apple-system')&&base.includes('BlinkMacSystemFont')&&base.includes('Helvetica Neue'),'Base typography stack is not system-native.');
for(const bad of ['--blue','--sun','--summer-','--game-','linear-gradient(','radial-gradient(','#25607f','#173f56','#ffcf5c','#f59d8b','#8fbfa8']){
  assert(!base.includes(bad),`Legacy/color token found in base CSS: ${bad}`);
}

// Human-editorial visual contract. Advisory only; release-critical visual rules are enforced again in build/smoke.
assert(ui.includes('BMIPROGRAM — human editorial monochrome design system'),'Missing human editorial design-system marker.');
assert(ui.includes('-apple-system')&&ui.includes('BlinkMacSystemFont')&&ui.includes('SF Pro Display'),'Global typography stack is not system-native.');
assert(ui.includes('--radius:8px')&&ui.includes('--radius-sm:6px'),'Restrained radius tokens are missing.');
assert(/\.site-head\{[^}]*background:var\(--paper\)!important[^}]*backdrop-filter:none!important/s.test(ui),'Header must stay opaque and free of glassmorphism.');
assert(/\.hero\{[^}]*background:var\(--paper\)!important/s.test(ui),'Hero must remain white.');
assert(ui.includes('.hero .vienna-skyline{display:none!important}'),'Decorative skyline must remain disabled.');
assert(ui.includes('.hero h1 .hl svg{display:none!important}'),'Legacy hero underline must remain disabled.');
assert(/\.btn\{[^}]*border-radius:var\(--radius\)!important[^}]*background:var\(--black\)!important/s.test(ui),'Primary CTA must remain a restrained black rectangular control.');
assert(/\.fchip\{[^}]*border-radius:var\(--radius-sm\)!important/s.test(ui),'Filter controls must avoid pill styling.');
assert(ui.includes('.tiles>.tile{')&&ui.includes('border-radius:0!important'),'Content tiles must remain editorial rows.');
assert(ui.includes('.wizard-card{')&&ui.includes('border-radius:0!important'),'Finder surface must remain document-like.');
assert(ui.includes('details.faq{border-radius:0!important'),'FAQ must remain document-like.');
assert(/\.stats\{[^}]*border-top:1px solid var\(--line\)!important/s.test(ui),'Hero facts must remain integrated with a hairline.');
assert(ui.includes('white-space:nowrap!important'),'Mobile hero phrase orphan protection is missing.');
assert(ui.includes('@media(prefers-reduced-motion:reduce)'),'Reduced-motion accessibility contract is missing.');
assert(ui.includes(':focus-visible'),'Visible keyboard focus contract is missing.');

// Explicit anti-AI-look checks across active visual layers.
for(const bad of ['--summer-','--game-','summerButterfly','linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)','#f59d8b','#f7c27b','#8fbfa8','#e2b84a']){
  assert(!ui.includes(bad),`Generic AI/retired pattern found in global UI: ${bad}`);
}
for(const bad of ['linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)','#8fbfa8','#efc978','#eaa0a2','#e2b84a','#55766b']){
  assert(!finder.includes(bad),`Generic AI/retired pattern found in finder CSS: ${bad}`);
}
assert(finder.includes('finder-only monochrome refinements'),'Missing finder refinement marker.');

// Every public page must load the same versioned visual system.
for(const {path,html} of pages){
  assert(/href=["']styles\.css\?v=[^"']+["']/.test(html),`${path} must load versioned structural CSS.`);
  assert(/href=["']ui-20260821\.css\?v=[^"']+["']/.test(html),`${path} must load versioned human-editorial UI CSS.`);
  assert(!html.includes('theme-color" content="#000000"'),`${path} must keep light browser chrome.`);
}
assert(pages.find(x=>x.path==='index.html').html.includes('recommendation-polish.css'),'Homepage must load finder refinements.');

if(warnings){
  console.warn(`DESIGN-AUDIT: ${warnings} advisory warning(s). Release-critical visual contracts remain enforced by build/smoke.`);
}else{
  console.log('PASS: human-editorial design advisory audit is clean.');
}
