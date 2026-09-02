from pathlib import Path
import json

# Main HTML discovery and entity-ID consistency.
p = Path('index.html')
s = p.read_text(encoding='utf-8')
s = s.replace('https://www.magyariskola.at/#org', 'https://www.magyariskola.at/#school')
head_marker = '</head>'
discovery = '''<link rel="alternate" type="text/plain" href="https://programvalaszto.magyariskola.at/llms.txt" title="LLM knowledge instructions">
<link rel="alternate" type="application/json" href="https://programvalaszto.magyariskola.at/knowledge-index.json" title="BMI machine knowledge index">
<link rel="related" href="https://programvalaszto.magyariskola.at/ai-knowledge.html" title="BMI AI Knowledge Hub">
<link rel="related" href="https://programvalaszto.magyariskola.at/program-knowledge.json" title="BMI program knowledge graph">
<link rel="related" href="https://programvalaszto.magyariskola.at/semantic-model.json" title="BMI semantic model">
'''
if 'knowledge-index.json" title="BMI machine knowledge index"' not in s:
    if head_marker not in s:
        raise SystemExit('head marker missing')
    s = s.replace(head_marker, discovery + head_marker, 1)

footer_anchor = '<a href="https://programvalaszto.magyariskola.at/ai-knowledge.html" rel="help">AI / gépi tudás</a>'
if footer_anchor not in s:
    marker = '<p>© 2026 Zentralverband Ungarischer Vereine und Organisationen in Österreich · ZVR 079797621</p>'
    if marker not in s:
        raise SystemExit('footer marker missing')
    s = s.replace(marker, '<p>'+footer_anchor+'</p>'+marker, 1)
p.write_text(s, encoding='utf-8')

# Ensure llms.txt itself points crawlers to the single knowledge entry point.
p = Path('llms.txt')
l = p.read_text(encoding='utf-8')
needle = 'Canonical program selector: https://programvalaszto.magyariskola.at/\n'
addition = ('AI Knowledge Hub: https://programvalaszto.magyariskola.at/ai-knowledge.html\n'
            'Machine knowledge index: https://programvalaszto.magyariskola.at/knowledge-index.json\n')
if 'Machine knowledge index: https://programvalaszto.magyariskola.at/knowledge-index.json' not in l:
    if needle not in l:
        raise SystemExit('llms canonical anchor missing')
    l = l.replace(needle, needle + addition, 1)
p.write_text(l, encoding='utf-8')

# Validate machine-facing JSON assets.
for path in ['knowledge-index.json','semantic-model.json','programs.json','program-knowledge.json','entity.jsonld']:
    json.loads(Path(path).read_text(encoding='utf-8'))

assert 'https://www.magyariskola.at/#org' not in Path('index.html').read_text(encoding='utf-8')
assert 'ai-knowledge.html' in Path('index.html').read_text(encoding='utf-8')
assert 'knowledge-index.json' in Path('llms.txt').read_text(encoding='utf-8')
print('OK: public AI discovery, canonical entity ID and machine links validated')
