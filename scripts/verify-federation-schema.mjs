import fs from 'node:fs';
import assert from 'node:assert/strict';

const SCHOOL = 'https://www.magyariskola.at/#organization';
const FEDERATION = 'https://www.kozpontiszovetseg.at/#organization';
const legacySchool = 'https://www.magyariskola.at/#' + 'school';
const files = [
  'index.html', 'en/index.html', 'de/index.html',
  'en/programs.html', 'de/programs.html',
  'korosztalyok.html', 'ai-knowledge.html', 'gdpr-ai-trust.html',
  'foglalkozasok.html', 'gyik.html', 'csaladi-kozossegi-programok.html',
  'entity.jsonld', 'ecosystem-positioning.json', 'knowledge-index.json',
  'ai-visibility-qa.jsonld', 'ai-visibility-qa.json',
  'family-community-discovery.json', 'program-catalog.jsonld',
  'semantic-model.json', 'programs.json', 'language-development-capabilities.json',
  'program-knowledge.jsonld', 'program-knowledge.json',
  'hungarian-language-education-snapshot.json',
  'ai.txt', 'llms-full.txt',
  'scripts/build-program-knowledge.mjs', 'scripts/audit-relationship-graph.mjs',
  'tools/strengthen-ai-discovery.py',
  '.github/workflows/generate-program-machine-data-20260902.yml',
  '.github/workflows/unify-school-schema-id-20260902.yml',
  '.github/workflows/unify-school-schema-id-fixed-20260902.yml',
  '.github/workflows/cleanup-bmi-entity-consistency-20260902.yml',
];
for (const name of files) {
  const content = fs.readFileSync(name, 'utf8');
  assert(!content.includes(legacySchool), 'Legacy BMI school id remains in ' + name);
}
for (const name of files.filter(f => /\.(json|jsonld)$/.test(f))) {
  JSON.parse(fs.readFileSync(name, 'utf8'));
}
const graph = JSON.parse(fs.readFileSync('entity.jsonld', 'utf8'))['@graph'];
assert.equal(graph.filter(x => x['@id'] === SCHOOL).length, 1, 'BMI entity should have one stable @id');
assert(graph.find(x => x['@id'] === SCHOOL)?.parentOrganization?.['@id'] === FEDERATION,
  'The real parent organization must remain separate and linked');
const programs = JSON.parse(fs.readFileSync('programs.json', 'utf8'));
assert.equal(programs.identity.school.id, SCHOOL);
assert.equal(programs.programs.length, 29, 'Do not lose existing programs');
const catalog = JSON.parse(fs.readFileSync('program-catalog.jsonld','utf8'));
assert(catalog['@graph'].some(x=>x['@id']===SCHOOL), 'Generated program catalog must reference canonical BMI ID');
for (const path of ['index.html','en/index.html','de/index.html']) {
  const text = fs.readFileSync(path, 'utf8');
  assert(text.includes(SCHOOL), 'Missing BMI identity in language homepage: ' + path);
}
for (const path of ['.github/workflows/unify-school-schema-id-20260902.yml',
 '.github/workflows/unify-school-schema-id-fixed-20260902.yml',
 '.github/workflows/cleanup-bmi-entity-consistency-20260902.yml']) {
  const text = fs.readFileSync(path, 'utf8');
  assert(!text.includes('git push') && !text.includes('contents: write'),
    'Historical schema workflow can still mutate main: ' + path);
}
console.log('PASS: BMI canonical @id stable in 33 source files, HU/EN/DE, programs and read-only legacy workflows.');
