import fs from 'node:fs';

const catalog=fs.readFileSync('catalog.js','utf8');
const data=fs.readFileSync('data.js','utf8');

function assert(ok,msg){if(!ok){console.error('FAIL:',msg);process.exit(1)}}

assert(data.includes('ageRangeOperational:true'),'registry must retain explicit operational age semantics');
assert(data.includes('ageRangeComposite:true'),'registry must retain explicit composite age semantics');
assert(catalog.includes("if(!p.ageRangeOperational&&!p.ageRangeComposite)course.typicalAgeRange=ageLabel(p)"),'Course Schema must omit typicalAgeRange for operational/composite age classifications');
assert(!catalog.includes("'typicalAgeRange':ageLabel(p)"),'Course Schema must not unconditionally emit typicalAgeRange');

console.log('PASS: operational/composite age classifications are not exposed as sourced Schema age facts.');
