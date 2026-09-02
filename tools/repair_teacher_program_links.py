from pathlib import Path
import re

path=Path('data.js')
s=path.read_text(encoding='utf-8')

def object_span(source, pid):
    token='{id:"'+pid+'"'
    start=source.find(token)
    if start<0:
        raise SystemExit(f'Program object not found: {pid}')
    depth=0
    quote=None
    esc=False
    for i in range(start,len(source)):
        ch=source[i]
        if quote:
            if esc:
                esc=False
            elif ch=='\\':
                esc=True
            elif ch==quote:
                quote=None
            continue
        if ch in ('"',"'"):
            quote=ch
        elif ch=='{':
            depth+=1
        elif ch=='}':
            depth-=1
            if depth==0:
                return start,i+1
    raise SystemExit(f'Unclosed program object: {pid}')

def set_fields(pid, teacher, background):
    global s
    a,b=object_span(s,pid)
    obj=s[a:b]
    obj=re.sub(r',teacher:"(?:\\.|[^"])*"','',obj)
    obj=re.sub(r',teacherBackground:"(?:\\.|[^"])*"','',obj)
    insert=f',teacher:"{teacher}",teacherBackground:"{background}"'
    obj=obj[:-1]+insert+'}'
    s=s[:a]+obj+s[b:]

# Canonical person-program relationships.
set_fields(
    'fotoklub',
    'Bánhalmi Norbert és Balogh Dávid',
    'Bánhalmi Norbert: fotóművész és vizuális brand stratéga; Balogh Dávid: művészettörténész. A VIPACH Felnőtt Fotóklub fotográfiai és művészettörténeti szemléletét közösen képviselik.'
)
set_fields(
    'cserkeszet',
    'Póser-Piroska Ildikó',
    'A 72. sz. Széchenyi István Cserkészcsapat – Bécs csapatparancsnoka; ifjúsági közösségi vezető. Nem tanári munkakörként, hanem cserkészvezetői szerepben kapcsolódik a programhoz.'
)

path.write_text(s,encoding='utf-8')
print('Repaired exact object-boundary teacher relationships: fotoklub, cserkeszet')
