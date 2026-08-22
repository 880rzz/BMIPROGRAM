import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
function assert(ok,msg){if(!ok)throw new Error(msg)}

const ui=read('ui-20260821.css');
const finder=read('recommendation-polish.css');
const pages=['index.html','foglalkozasok.html','korosztalyok.html','gyik.html'].map(path=>({path,html:read(path)}));

// One global visual language: monochrome, typographic, quiet.
assert(ui.includes('BMIPROGRAM — monochrome editorial design system'),'Global stylesheet must declare the monochrome design-system marker.');
assert(ui.includes('font-family:-apple-system,BlinkMacSystemFont,"SF Pro Text","SF Pro Display","Helvetica Neue",Helvetica,Arial,sans-serif'),'Global type stack must prefer Apple system typography with safe fallbacks.');
assert(ui.includes('--ink:#1d1d1f')&&ui.includes('--black:#000000')&&ui.includes('--paper:#ffffff')&&ui.includes('--soft:#f5f5f7'),'Required monochrome design tokens are missing.');
assert(ui.includes('.site-head{')&&ui.includes('background:rgba(255,255,255,.88)'),'Header must remain light and translucent.');
assert(ui.includes('.hero{')&&ui.includes('background:var(--paper)!important'),'Hero must remain white.');
assert(ui.includes('.hero .vienna-skyline{display:none!important}'),'Decorative Vienna artwork must stay disabled in the monochrome system.');
assert(ui.includes('.hero h1 .hl svg{display:none!important}'),'Legacy colored hero underline must stay disabled.');
assert(ui.includes('.btn{')&&ui.includes('background:var(--black)!important')&&ui.includes('color:#fff!important'),'Primary controls must remain black with white text.');
assert(ui.includes('.stats{')&&ui.includes('border-top:1px solid var(--line)!important'),'Hero facts must be integrated with a hairline, not rendered as colored cards.');
assert(ui.includes('@media(max-width:720px)')&&ui.includes('white-space:nowrap!important'),'Mobile hero phrase must remain protected from orphan line breaks.');
assert(ui.includes('@media(prefers-reduced-motion:reduce)'),'Reduced-motion accessibility contract is required.');
assert(ui.includes(':focus-visible{outline:3px solid var(--focus)!important'),'Visible keyboard focus contract is required.');

// Ban the retired visual systems from the active design layers.
for(const bad of ['--summer-','--game-','summerButterfly','linear-gradient(','radial-gradient(','#f59d8b','#f7c27b','#8fbfa8','#e2b84a']){
  assert(!ui.includes(bad),`Retired/color design token must not occur in global UI: ${bad}`);
}
for(const bad of ['linear-gradient(','#8fbfa8','#efc978','#eaa0a2','#e2b84a']){
  assert(!finder.includes(bad),`Finder refinements must remain monochrome: ${bad}`);
}
assert(finder.includes('finder-only monochrome refinements'),'Finder stylesheet must declare its scoped monochrome role.');

// All human-facing pages must load the same global skin. The build rewrites query strings to the exact commit SHA.
for(const {path,html} of pages){
  assert(/href=["']ui-20260821\.css\?v=[^"']+["']/.test(html),`${path} must load the global UI stylesheet with a version query.`);
  assert(!html.includes('theme-color" content="#000000"'),`${path} should keep a light browser chrome theme, not force black.`);
}
assert(pages.find(x=>x.path==='index.html').html.includes('recommendation-polish.css'),'Homepage must load finder-only refinements.');

console.log('PASS: monochrome editorial design system, Apple-like system typography, mobile hero, focus/motion and no-retired-color contracts are consistent.');
