from pathlib import Path

p = Path('zenebona-program.js')
s = p.read_text(encoding='utf-8')

old = 'teacher:"Regélő Fehér Táltos Hagyományőrző Egyesület Dobcsapata",teacherContact:"Hupczik Andrea · +43 670 6539011 · taltosdob@gmail.com",'
new = 'teacher:"Hupczik Andrea",teacherContact:"+43 670 6539011 · taltosdob@gmail.com",teacherBackground:"Informatikatanár és hagyományőrző közösségi szervező; az Együtt dobban Bécs / Közös örömzene foglalkozásvezetője és helyi kapcsolattartója.",'
if old not in s:
    raise SystemExit('Örömzene teacher source pattern not found')
s = s.replace(old, new, 1)

old2 = "if(orom){orom.eventDates=sharedDates.slice();orom.tentativeEventDates=['2027-06-19','2027-06-26'];orom.when='Havonta 1 alkalom 18:00-tól';orom.scheduleMode='irregular';}"
new2 = "if(orom){orom.eventDates=sharedDates.slice();orom.tentativeEventDates=['2027-06-19','2027-06-26'];orom.when='Minden Világfa Sárkányai / Táltos dob napon 18:00-tól';orom.scheduleMode='irregular';orom.teacher='Hupczik Andrea';orom.teacherContact='+43 670 6539011 · taltosdob@gmail.com';orom.teacherBackground='Informatikatanár és hagyományőrző közösségi szervező; az Együtt dobban Bécs / Közös örömzene foglalkozásvezetője.';orom.linkedProgramId='vilagfa';orom.scheduleRule='same-date-as-vilagfa-at-18:00';orom.permanentWixEvent='https://www.magyariskola.at/event-details/oromzene-2026';}"
if old2 not in s:
    raise SystemExit('Örömzene schedule block not found')
s = s.replace(old2, new2, 1)

# The children's Táltos dob session precedes Örömzene. It is a 2-hour session starting at 16:00.
old3 = "vilagfa.weekday='szombat';vilagfa.weekdays=['szombat','vasarnap'];vilagfa.when='Havonta 1 alkalom 18:00-tól';"
new3 = "vilagfa.weekday='szombat';vilagfa.weekdays=['szombat','vasarnap'];vilagfa.when='Havonta 1 alkalom 16:00–18:00; utána 18:00-tól Közös örömzene';"
if old3 not in s:
    raise SystemExit('Világfa schedule override not found')
s = s.replace(old3, new3, 1)

old4 = "vilagfa.firstDate='2026. szeptember 27., vasárnap 18:00';"
new4 = "vilagfa.firstDate='2026. szeptember 27., vasárnap 16:00';"
if old4 not in s:
    raise SystemExit('Világfa firstDate override not found')
s = s.replace(old4, new4, 1)

p.write_text(s, encoding='utf-8')
print('OK: Örömzene -> Hupczik Andrea; same Táltos-dates at 18:00; Világfa 16:00–18:00')
