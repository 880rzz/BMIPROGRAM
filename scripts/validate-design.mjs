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

// Structural/editorial foundation.
assert(base.includes('BMIPROGRAM — neutral structural foundation'),'Missing neutral structural foundation marker.');
assert(base.includes('-apple-system')&&base.includes('BlinkMacSystemFont'),'System-native typography stack missing.');
assert(base.includes('.headline-accent{color:#0B57D0;font-weight:560}'),'Readable blue fallback for editorial accent missing.');
assert(base.includes('background:linear-gradient(105deg,#0B57D0 0%,#245FB5 38%,#78642D 70%,#9A6400 100%)'),'Controlled blue-gold text gradient missing.');
assert((base.match(/linear-gradient\(/g)||[]).length===1,'Only one controlled gradient may exist in base CSS.');
assert(base.includes('@media(forced-colors:active)'),'Forced-colors fallback missing.');

// Vector icon system.
assert(icons.includes('stroke="currentColor"')&&icons.includes('stroke-width="1.7"'),'Vector sprite stroke contract missing.');
for(const id of ['spark','grid','users','help','anniversary','report','arrow','list','calendar','location','age','clock','book','community','check']) assert(icons.includes(`id="${id}"`),`Missing vector icon symbol: ${id}`);
assert(base.includes('Contextual vector icon system'),'Contextual vector icon CSS missing.');
assert(base.includes('.site-head a[href="index.html"]::after'),'Semantic menu icon mapping missing.');
assert(base.includes('.hero-actions a[href="#kereso"]::before'),'Hero CTA icon contract missing.');
assert(base.includes('.stat:nth-child(4)::before'),'Hero stats icon set incomplete.');
assert(!base.includes('.nav .item:nth-child(')&&!base.includes('.drawer a:nth-child('),'Navigation icons must not use nth-child mapping.');

// Active UI.
assert(ui.includes('BMIPROGRAM — human editorial monochrome design system'),'Missing human-editorial UI marker.');
assert(/\.site-head\{[^}]*background:var\(--paper\)!important[^}]*backdrop-filter:none!important/s.test(ui),'Header must remain opaque.');
assert(/\.hero\{[^}]*background:var\(--paper\)!important/s.test(ui),'Hero must remain white.');
assert(ui.includes('.site-head .nav{display:none!important}'),'Desktop navigation must remain hamburger-first.');
assert(ui.includes('.site-head .menu-btn{display:inline-flex!important'),'Hamburger button must remain visible on all view widths.');
assert(ui.includes('.hero-identity{display:flex!important'),'Hero identity composition missing.');
assert(ui.includes('.hero-identity .hero-mark img{filter:none!important;opacity:1!important'),'Hero logo must remain full color.');
assert(ui.includes('.hero-school-name{')&&ui.includes('.hero-founded{'),'Hero school/founding metadata styling missing.');
assert(ui.includes('@media(max-width:720px){.hero-identity{flex-direction:column!important;align-items:flex-start!important'),'Mobile hero identity must stay left aligned.');
assert(ui.includes('.hero-identity .hero-mark{width:138px!important'),'Mobile hero logo sizing missing.');
assert(ui.includes('@media(max-width:390px){.hero-identity .hero-mark{width:126px!important'),'Small-phone hero logo sizing missing.');
assert(ui.includes('white-space:nowrap!important'),'Mobile headline orphan protection missing.');
assert(ui.includes('@media(prefers-reduced-motion:reduce)'),'Reduced-motion accessibility contract missing.');
assert(ui.includes(':focus-visible'),'Keyboard focus contract missing.');

// Hero source identity and copy.
assert(home.includes('<div class="hero-identity">'),'Homepage hero identity wrapper missing.');
assert(home.includes('<div class="hero-mark"><img src="logo.png" alt="Bécsi Magyar Iskola"'),'Official BMI logo missing from hero.');
assert(home.includes('<span class="hero-school-name">Bécsi Magyar Iskola</span>'),'Hero school name missing.');
assert(home.includes('<span class="hero-founded headline-accent">alapítva 1987</span>'),'Gradient founding label missing.');
assert(home.includes('<span class="eyebrow">2026 / 2027-es tanév</span>'),'School-year label missing from hero identity.');
assert(home.includes('Magyar nyelvű <span class="headline-accent">foglalkozások</span>'),'Hungarian-language H1 contract missing.');

// Editorial emphasis across pages.
for(const {path,html} of pages){
  assert(html.includes('class="headline-accent"'),`${path} must include editorial headline emphasis.`);
  assert(html.includes('<meta name="theme-color" content="#ffffff">'),`${path} must keep white browser chrome.`);
  assert(!/\sstyle=["']/.test(html),`${path} must not use inline visual styling.`);
}
assert(catalog.includes('<span class="headline-accent">foglalkozás</span>'),'Generated catalog headings must use the editorial accent.');

// Anti-template bans: gradients are allowed only in styles.css headline accent; never in active UI/finder.
for(const bad of ['--summer-','--game-','summerButterfly','linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)']) assert(!ui.includes(bad),`Retired/AI-template pattern found in UI: ${bad}`);
for(const bad of ['linear-gradient(','radial-gradient(','blur(20px)','border-radius:999px','translateY(-2px)','translateY(-1px)']) assert(!finder.includes(bad),`Retired/AI-template pattern found in finder: ${bad}`);
assert(!home.includes('vienna-skyline')&&!home.includes('🦋')&&!home.includes('stroke="#ffcf5c"')&&!home.includes('class="em"'),'Retired playful hero/content markup returned.');

if(warnings) console.warn(`DESIGN-AUDIT: ${warnings} advisory warning(s). Hard release contracts remain authoritative.`);
else console.log('PASS: colorful brand identity, hamburger-first navigation, blue-gold editorial hierarchy and vector icon system are clean.');
