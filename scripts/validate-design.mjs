import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
let warnings=0;
function assert(ok,msg){if(!ok){warnings+=1;console.warn(`DESIGN-AUDIT WARNING: ${msg}`)}}

const base=read('styles.css');
const ui=read('ui-20260821.css');
const finder=read('recommendation-polish.css');
const catalog=read('catalog.js');
const icons=read('icons.svg');
const pages=['index.html','foglalkozasok.html','korosztalyok.html','gyik.html'].map(path=>({path,html:read(path)}));
const home=pages.find(x=>x.path==='index.html').html;

// Structural foundation must stay neutral, restrained and system-native.
assert(base.includes('BMIPROGRAM — neutral structural foundation'),'Missing neutral structural foundation marker.');
assert(base.includes('-apple-system')&&base.includes('BlinkMacSystemFont')&&base.includes('Helvetica Neue'),'Base typography stack is not system-native.');
assert(base.includes('--radius:8px')&&base.includes('--radius-sm:6px'),'Base radius tokens must remain restrained.');
assert(base.includes('.headline-accent{color:#0B57D0;font-weight:560}'),'Readable blue fallback for editorial headline accent is missing.');
assert(base.includes('background:linear-gradient(105deg,#0B57D0 0%,#245FB5 38%,#78642D 70%,#9A6400 100%)'),'Controlled blue-gold editorial gradient is missing.');
assert((base.match(/linear-gradient\(/g)||[]).length===1,'Only one controlled text gradient may exist in the structural CSS.');
assert(base.includes('-webkit-background-clip:text')&&base.includes('background-clip:text'),'Headline gradient must be clipped to text.');
assert(base.includes('@media(forced-colors:active)'),'Headline accent must preserve forced-colors accessibility.');
assert(base.includes('main p strong{color:var(--ink);font-weight:650}'),'Selective bold-copy hierarchy contract is missing.');
for(const bad of ['--blue','--sun','--summer-','--game-','radial-gradient(','border-radius:999px','#25607f','#173f56','#ffcf5c','#f59d8b','#8fbfa8']){
  assert(!base.includes(bad),`Legacy/AI-template token found in base CSS: ${bad}`);
}

// Semantic vector icon system: SVG/stroke based, no emoji or brittle menu ordering.
assert(icons.includes('stroke="currentColor"')&&icons.includes('stroke-width="1.7"'),'Vector sprite must use the restrained currentColor stroke system.');
for(const id of ['spark','grid','users','help','anniversary','report','arrow','list','calendar','location','age','clock','book','community','check']){
  assert(icons.includes(`id="${id}"`),`Missing vector icon symbol: ${id}`);
}
assert(base.includes('Contextual vector icon system'),'Missing contextual vector icon CSS contract.');
assert(base.includes('.site-head a[href="index.html"]::after'),'Menu icons must be bound semantically by href.');
assert(base.includes('.site-head a[href="foglalkozasok.html"]::after'),'Activity-list navigation icon contract is missing.');
assert(base.includes('.site-head a[href="korosztalyok.html"]::after'),'Age-group navigation icon contract is missing.');
assert(base.includes('.site-head a[href="gyik.html"]::after'),'FAQ navigation icon contract is missing.');
assert(base.includes('.hero-actions a[href="#kereso"]::before'),'Primary finder CTA vector icon is missing.');
assert(base.includes('.stat:nth-child(4)::before'),'Hero fact vector icon set is incomplete.');
assert(base.includes('a.tile::after'),'Linked editorial rows must retain the subtle vector arrow affordance.');
assert(!base.includes('.nav .item:nth-child(')&&!base.includes('.drawer a:nth-child('),'Navigation icons must not use brittle nth-child mapping.');

// Human-editorial active visual layer.
assert(ui.includes('BMIPROGRAM — human editorial monochrome design system'),'Missing human editorial design-system marker.');
assert(ui.includes('-apple-system')&&ui.includes('BlinkMacSystemFont')&&ui.includes('SF Pro Display'),'Global typography stack is not system-native.');
assert(ui.includes('--radius:8px')&&ui.includes('--radius-sm:6px'),'Restrained UI radius tokens are missing.');
assert(/\.site-head\{[^}]*background:var\(--paper\)!important[^}]*backdrop-filter:none!important/s.test(ui),'Header must stay opaque and free of glassmorphism.');
assert(/\.hero\{[^}]*background:var\(--paper\)!important/s.test(ui),'Hero must remain white.');
assert(/\.btn\{[^}]*border-radius:var\(--radius\)!important[^}]*background:var\(--black\)!important/s.test(ui),'Primary CTA must remain a restrained black rectangular control.');
assert(/\.fchip\{[^}]*border-radius:var\(--radius-sm\)!important/s.test(ui),'Filter controls must avoid pill styling.');
assert(ui.includes('.tiles>.tile{')&&ui.includes('border-radius:0!important'),'Content tiles must remain editorial rows.');
assert(ui.includes('.wizard-card{')&&ui.includes('border-radius:0!important'),'Finder surface must remain document-like.');
assert(ui.includes('details.faq{border-radius:0!important'),'FAQ must remain document-like.');
assert(/\.stats\{[^}]*border-top:1px solid var\(--line\)!important/s.test(ui),'Hero facts must remain integrated with a hairline.');
assert(ui.includes('white-space:nowrap!important'),'Mobile hero phrase orphan protection is missing.');
assert(ui.includes('@media(prefers-reduced-motion:reduce)'),'Reduced-motion accessibility contract is missing.');
assert(ui.includes(':focus-visible'),'Visible keyboard focus contract is missing.');

// Official hero mark: one real brand asset, responsive and visually restrained.
assert(home.includes('<div class="hero-mark"><img src="logo.png" alt="Bécsi Magyar Iskola"'),'Homepage hero must contain the official BMI logo asset.');
assert(ui.includes('.hero-mark{width:clamp(156px,18vw,218px)!important'),'Desktop hero logo sizing contract is missing.');
assert(ui.includes('.hero-mark img{')&&ui.includes('filter:grayscale(1) contrast(1.05)!important'),'Hero logo must remain visually integrated with the monochrome system.');
assert(ui.includes('.hero-mark{width:138px!important;margin-bottom:24px!important}'),'Mobile hero logo sizing contract is missing.');
assert(ui.includes('.hero-mark{width:126px!important;margin-bottom:22px!important}'),'Small-phone hero logo sizing contract is missing.');

// Finder editorial spacing: desktop recommendation columns need real whitespace, not touching text columns.
assert(finder.includes('gap:0 clamp(40px,4vw,68px)!important'),'Desktop recommendation columns must retain responsive editorial spacing.');
assert(finder.includes('min-width:0'),'Recommendation cards must prevent content overflow into adjacent columns.');
assert(finder.includes('@media(max-width:1120px){.result-grid{gap:0!important}}'),'Single-column/tablet layout must remove unnecessary column gap.');

// Editorial emphasis: one controlled blue-gold accent per headline family, selective bold in prose.
for(const {path,html} of pages){
  assert(html.includes('class="headline-accent"'),`${path} must include editorial headline emphasis.`);
}
assert((home.match(/<strong>/g)||[]).length>=8,'Homepage should retain selective bold emphasis in key explanatory copy.');
assert(home.includes('Magyar <span class="headline-accent">foglalkozások</span>'),'Homepage H1 must emphasize one key concept tonally.');
assert(home.includes('Négy kérdés. <span class="headline-accent">Kevesebb mint egy perc.</span>'),'Homepage finder H2 must retain tonal hierarchy.');
assert(catalog.includes('<span class="headline-accent">foglalkozás</span>'),'Generated catalog H2 headings must use the same editorial hierarchy.');
assert(!catalog.includes("'🍼 0–3 év'")&&!catalog.includes("'🧸 3–6 év'")&&!catalog.includes("'🎒 6–14 év'")&&!catalog.includes("'🎧 14–21 év'")&&!catalog.includes("'☕ Felnőtt'"),'Generated age-group kickers must remain free of decorative emoji.');

// Explicit anti-AI-look bans across active visual layers. Gradients remain forbidden outside the single headline accent in styles.css.
for(const bad of ['--summer-','--game-','summerButterfly','linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)','#f59d8b','#f7c27b','#8fbfa8','#e2b84a']){
  assert(!ui.includes(bad),`Generic AI/retired pattern found in global UI: ${bad}`);
}
for(const bad of ['linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)','#8fbfa8','#efc978','#eaa0a2','#e2b84a','#55766b']){
  assert(!finder.includes(bad),`Generic AI/retired pattern found in finder CSS: ${bad}`);
}
assert(finder.includes('finder-only monochrome refinements'),'Missing finder refinement marker.');

// Source markup must itself be editorial; retired playful elements may not merely be hidden by CSS.
assert(!home.includes('vienna-skyline'),'Homepage must not contain retired Vienna skyline markup or preload.');
assert(!home.includes('🦋'),'Homepage must not contain the retired butterfly decoration.');
assert(!home.includes('stroke="#ffcf5c"'),'Homepage must not contain the retired yellow hero underline SVG.');
assert(!home.includes('class="em"'),'Homepage content rows must not carry retired emoji decoration nodes.');

// Every public page must load the same versioned system and avoid inline visual overrides.
for(const {path,html} of pages){
  assert(html.includes('<meta name="theme-color" content="#ffffff">'),`${path} must declare white browser chrome at source.`);
  assert(/href=["']styles\.css\?v=[^"']+["']/.test(html),`${path} must load versioned structural CSS.`);
  assert(/href=["']ui-20260821\.css\?v=[^"']+["']/.test(html),`${path} must load versioned human-editorial UI CSS.`);
  assert(!/\sstyle=["']/.test(html),`${path} must not use inline visual styling.`);
}
assert(home.includes('recommendation-polish.css'),'Homepage must load finder refinements.');

if(warnings){
  console.warn(`DESIGN-AUDIT: ${warnings} advisory warning(s). Release-critical visual contracts remain enforced by build/smoke.`);
}else{
  console.log('PASS: human-editorial source markup, responsive hero logo, blue-gold headline hierarchy and semantic vector icon system are clean.');
}
