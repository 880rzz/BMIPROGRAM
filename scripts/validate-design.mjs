import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}
function rule(css,selector){
  const escaped=selector.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const m=css.match(new RegExp(escaped+'\\s*\\{([^}]*)\\}','m'));
  return m?m[1]:'';
}
function hasProp(css,selector,prop,value){
  const body=rule(css,selector);
  if(!body)return false;
  const compact=body.replace(/\s+/g,'');
  return compact.includes(`${prop}:${value}`.replace(/\s+/g,''));
}

const base=read('styles.css');
const ui=read('ui-20260821.css');
const finder=read('recommendation-polish.css');
const pages=['index.html','foglalkozasok.html','korosztalyok.html','gyik.html'].map(path=>({path,html:read(path)}));

// Foundation contracts: neutral, monochrome and system-native typography.
assert(base.includes('BMIPROGRAM — neutral structural foundation'),'Base stylesheet must declare its neutral structural role.');
assert(base.includes('-apple-system')&&base.includes('BlinkMacSystemFont')&&base.includes('Helvetica Neue'),'Base stylesheet must use the native system typography stack.');
for(const bad of ['--blue','--sun','--summer-','--game-','linear-gradient(','radial-gradient(','#25607f','#173f56','#ffcf5c','#f59d8b','#8fbfa8']){
  assert(!base.includes(bad),`Legacy/color visual token must not occur in structural base CSS: ${bad}`);
}

// Human editorial visual language.
assert(ui.includes('BMIPROGRAM — human editorial monochrome design system'),'Global stylesheet must declare the human editorial design-system marker.');
assert(ui.includes('-apple-system')&&ui.includes('BlinkMacSystemFont')&&ui.includes('SF Pro Display'),'Global typography must prefer native Apple/system typography with safe fallbacks.');
assert(ui.includes('--radius:8px')&&ui.includes('--radius-sm:6px'),'Editorial radius tokens must remain restrained.');
assert(hasProp(ui,'.site-head','background','var(--paper)!important'),'Header must remain opaque white.');
assert(hasProp(ui,'.site-head','backdrop-filter','none!important'),'Header must stay free of glassmorphism.');
assert(hasProp(ui,'.hero','background','var(--paper)!important'),'Hero must remain white.');
assert(hasProp(ui,'.hero .vienna-skyline','display','none!important'),'Decorative skyline must remain disabled.');
assert(hasProp(ui,'.hero h1 .hl svg','display','none!important'),'Legacy colored hero underline must remain disabled.');
assert(hasProp(ui,'.btn','background','var(--black)!important'),'Primary CTA must remain black.');
assert(hasProp(ui,'.btn','border-radius','var(--radius)!important'),'Primary CTA must use restrained rectangular rounding, not a pill.');
assert(hasProp(ui,'.fchip','border-radius','var(--radius-sm)!important'),'Filters must avoid pill styling.');
assert(hasProp(ui,'.tiles>.tile','border-radius','0!important'),'Content tiles must remain editorial rows rather than floating cards.');
assert(hasProp(ui,'.wizard-card','border-radius','0!important'),'Finder surface must remain document-like.');
assert(hasProp(ui,'details.faq','border-radius','0!important'),'FAQ must remain document-like.');
assert(hasProp(ui,'.stats','border-top','1px solid var(--line)!important'),'Hero facts must remain integrated with a hairline.');
assert(ui.includes('white-space:nowrap!important'),'Mobile hero phrase must be protected from orphan line breaks.');
assert(ui.includes('@media(prefers-reduced-motion:reduce)'),'Reduced-motion accessibility contract is required.');
assert(ui.includes(':focus-visible'),'Visible keyboard focus contract is required.');

// Anti-AI-look constraints: no candy gradients, glass, oversized pills or floating-card motion in active visual layers.
for(const bad of ['--summer-','--game-','summerButterfly','linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)','#f59d8b','#f7c27b','#8fbfa8','#e2b84a']){
  assert(!ui.includes(bad),`Generic AI/retired visual pattern must not occur in global UI: ${bad}`);
}
for(const bad of ['linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)','#8fbfa8','#efc978','#eaa0a2','#e2b84a','#55766b']){
  assert(!finder.includes(bad),`Finder refinements must remain human-editorial and restrained: ${bad}`);
}
assert(finder.includes('finder-only monochrome refinements'),'Finder stylesheet must declare its scoped monochrome role.');

// All public pages load the same versioned visual system.
for(const {path,html} of pages){
  assert(/href=["']styles\.css\?v=[^"']+["']/.test(html),`${path} must load versioned structural CSS.`);
  assert(/href=["']ui-20260821\.css\?v=[^"']+["']/.test(html),`${path} must load versioned human-editorial UI CSS.`);
  assert(!html.includes('theme-color" content="#000000"'),`${path} must keep light browser chrome.`);
}
assert(pages.find(x=>x.path==='index.html').html.includes('recommendation-polish.css'),'Homepage must load finder refinements.');

console.log('PASS: human-editorial monochrome design, anti-AI-look constraints, native typography and accessibility contracts are consistent.');
