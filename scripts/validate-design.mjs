import fs from 'node:fs';

function read(path){return fs.readFileSync(path,'utf8')}
let warnings=0;
function assert(ok,msg){if(!ok){warnings+=1;console.warn(`DESIGN-AUDIT WARNING: ${msg}`)}}

const base=read('styles.css');
const ui=read('ui-20260821.css');
const finder=read('recommendation-polish.css');
const catalog=read('catalog.js');
const pages=['index.html','foglalkozasok.html','korosztalyok.html','gyik.html'].map(path=>({path,html:read(path)}));
const home=pages.find(x=>x.path==='index.html').html;

// Structural foundation must stay neutral, restrained and system-native.
assert(base.includes('BMIPROGRAM — neutral structural foundation'),'Missing neutral structural foundation marker.');
assert(base.includes('-apple-system')&&base.includes('BlinkMacSystemFont')&&base.includes('Helvetica Neue'),'Base typography stack is not system-native.');
assert(base.includes('--radius:8px')&&base.includes('--radius-sm:6px'),'Base radius tokens must remain restrained.');
assert(base.includes('.headline-accent{color:var(--muted);font-weight:520}'),'Global editorial headline accent contract is missing.');
assert(base.includes('main p strong{color:var(--ink);font-weight:650}'),'Selective bold-copy hierarchy contract is missing.');
for(const bad of ['--blue','--sun','--summer-','--game-','linear-gradient(','radial-gradient(','border-radius:999px','#25607f','#173f56','#ffcf5c','#f59d8b','#8fbfa8']){
  assert(!base.includes(bad),`Legacy/AI-template token found in base CSS: ${bad}`);
}

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

// Finder editorial spacing: desktop recommendation columns need real whitespace, not touching text columns.
assert(finder.includes('gap:0 clamp(40px,4vw,68px)!important'),'Desktop recommendation columns must retain responsive editorial spacing.');
assert(finder.includes('min-width:0'),'Recommendation cards must prevent content overflow into adjacent columns.');
assert(finder.includes('@media(max-width:1120px){.result-grid{gap:0!important}}'),'Single-column/tablet layout must remove unnecessary column gap.');

// Editorial emphasis: one tonal accent per headline family, selective bold in prose.
for(const {path,html} of pages){
  assert(html.includes('class="headline-accent"'),`${path} must include editorial headline emphasis.`);
}
assert((home.match(/<strong>/g)||[]).length>=8,'Homepage should retain selective bold emphasis in key explanatory copy.');
assert(home.includes('Magyar <span class="headline-accent">foglalkozások</span>'),'Homepage H1 must emphasize one key concept tonally.');
assert(home.includes('Négy kérdés. <span class="headline-accent">Kevesebb mint egy perc.</span>'),'Homepage finder H2 must retain tonal hierarchy.');
assert(catalog.includes('<span class="headline-accent">foglalkozás</span>'),'Generated catalog H2 headings must use the same editorial hierarchy.');
assert(!catalog.includes("'🍼 0–3 év'")&&!catalog.includes("'🧸 3–6 év'")&&!catalog.includes("'🎒 6–14 év'")&&!catalog.includes("'🎧 14–21 év'")&&!catalog.includes("'☕ Felnőtt'"),'Generated age-group kickers must remain free of decorative emoji.');

// Explicit anti-AI-look bans across active visual layers.
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
  console.log('PASS: human-editorial source markup, typographic hierarchy and anti-AI-look advisory audit are clean.');
}
