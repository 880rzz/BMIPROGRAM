#!/usr/bin/env node
'use strict';

const fs = require('fs');
const vm = require('vm');

const ROOT = process.cwd();
const errors = [];
const warnings = [];
const info = [];

function err(code, message, context) { errors.push({severity:'error', code, message, context:context||null}); }
function warn(code, message, context) { warnings.push({severity:'warning', code, message, context:context||null}); }
function note(code, message, context) { info.push({severity:'info', code, message, context:context||null}); }
function uniq(arr) { return [...new Set(arr)]; }
function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

function loadDatabase() {
  const sandbox = { window: {}, console };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(`${ROOT}/data.js`, 'utf8'), sandbox, {filename:'data.js'});
  if (!sandbox.window.BMI_FINDER) throw new Error('window.BMI_FINDER missing after loading data.js');
  const addonPath = `${ROOT}/zenebona-program.js`;
  if (fs.existsSync(addonPath)) {
    sandbox.document = undefined;
    vm.runInContext(fs.readFileSync(addonPath, 'utf8'), sandbox, {filename:'zenebona-program.js'});
  }
  return sandbox.window.BMI_FINDER;
}

function parseHuDate(s) {
  const months = {januar:1,februar:2,marcius:3,aprilis:4,majus:5,junius:6,julius:7,augusztus:8,szeptember:9,oktober:10,november:11,december:12};
  const m = norm(s).match(/(20\d{2})\.\s*([a-z]+)\s+(\d{1,2})\.?/);
  if (!m || !months[m[2]]) return null;
  return `${Number(m[1])}-${String(months[m[2]]).padStart(2,'0')}-${String(Number(m[3])).padStart(2,'0')}`;
}

function validIsoDate(iso) {
  if (!/^20\d{2}-\d{2}-\d{2}$/.test(String(iso || ''))) return false;
  const [y,m,d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y,m-1,d,12));
  return dt.getUTCFullYear()===y && dt.getUTCMonth()===m-1 && dt.getUTCDate()===d;
}

function weekdayFromIso(iso) {
  const names = ['vasarnap','hetfo','kedd','szerda','csutortok','pentek','szombat'];
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : names[d.getUTCDay()];
}

function extractStartMinutes(s) {
  const m = String(s || '').match(/(?:^|\D)([01]?\d|2[0-3])[:.]([0-5]\d)(?!\d)/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

function isIrregularText(s) {
  return /kethetente|havonta|ritkabban|meghirdetett\s+idopont|egyeztetett\s+sav|jelentkezes\s+utan/.test(norm(s));
}

function dateInRanges(iso, ranges) {
  return (ranges || []).some(r => Array.isArray(r) && r.length===2 && iso>=r[0] && iso<=r[1]);
}

function isClosedDate(cfg, iso) {
  const r = cfg.calendarRules || {};
  return (r.publicHolidays || []).includes(iso) || (r.schoolFreeDates || []).includes(iso) || dateInRanges(iso, r.schoolBreaks || []);
}

function auditCalendar(cfg) {
  const r = cfg.calendarRules;
  if (!r) { err('CALENDAR_MISSING', 'Hiányzik a 2026/27-es osztrák naptárszabály.'); return; }
  if (r.timezone !== 'Europe/Vienna') err('CALENDAR_TIMEZONE', 'A naptár időzónája nem Europe/Vienna.', {timezone:r.timezone});
  if (!r.schoolYear || r.schoolYear.start !== '2026-09-07' || r.schoolYear.end !== '2027-07-02') {
    err('CALENDAR_SCHOOL_YEAR', 'A bécsi 2026/27-es tanév határai eltérnek a rögzített hivatalos dátumoktól.', {schoolYear:r.schoolYear});
  }

  const expectedBreaks = [
    ['2026-10-27','2026-10-31'],
    ['2026-12-24','2027-01-06'],
    ['2027-01-30','2027-02-06'],
    ['2027-03-20','2027-03-29'],
    ['2027-05-15','2027-05-17'],
    ['2027-07-03','2027-09-05']
  ];
  const actualBreaks = Array.isArray(r.schoolBreaks) ? r.schoolBreaks : [];
  if (JSON.stringify(actualBreaks)!==JSON.stringify(expectedBreaks)) {
    err('CALENDAR_BREAK_SET', 'A bécsi/alsó-ausztriai 2026/27-es iskolaszünet-lista eltér a rögzített hivatalos készlettől.', {actual:actualBreaks, expected:expectedBreaks});
  }
  actualBreaks.forEach((range,index) => {
    if (!Array.isArray(range) || range.length!==2 || !validIsoDate(range[0]) || !validIsoDate(range[1]) || range[0]>range[1]) {
      err('CALENDAR_BREAK_INVALID', 'Érvénytelen iskolaszünet-tartomány.', {index, range});
    }
    if (index>0 && actualBreaks[index-1][1] >= range[0]) err('CALENDAR_BREAK_OVERLAP', 'Átfedő vagy rosszul rendezett iskolaszünet-tartományok.', {previous:actualBreaks[index-1], current:range});
  });

  const holidays = Array.isArray(r.publicHolidays) ? r.publicHolidays : [];
  const schoolFree = Array.isArray(r.schoolFreeDates) ? r.schoolFreeDates : [];
  if (uniq(holidays).length!==holidays.length) err('CALENDAR_HOLIDAY_DUPLICATE', 'Duplikált munkaszüneti nap a naptárban.');
  if (uniq(schoolFree).length!==schoolFree.length) err('CALENDAR_SCHOOLFREE_DUPLICATE', 'Duplikált iskolai szabadnap a naptárban.');
  holidays.forEach(d => { if (!validIsoDate(d)) err('CALENDAR_HOLIDAY_INVALID', `Érvénytelen munkaszüneti dátum: ${d}`); });
  schoolFree.forEach(d => { if (!validIsoDate(d)) err('CALENDAR_SCHOOLFREE_INVALID', `Érvénytelen iskolai szabadnap: ${d}`); });

  ['2026-10-26','2026-11-01','2026-12-08','2026-12-25','2026-12-26','2027-01-01','2027-01-06','2027-03-29','2027-05-01','2027-05-06','2027-05-17','2027-05-27'].forEach(d => {
    if (!holidays.includes(d)) err('CALENDAR_REQUIRED_HOLIDAY', `Hiányzik szükséges osztrák munkaszüneti nap: ${d}`);
  });
  ['2026-11-02','2026-11-15'].forEach(d => {
    if (!schoolFree.includes(d)) err('CALENDAR_REQUIRED_SCHOOLFREE', `Hiányzik bécsi iskolai szabadnap: ${d}`);
  });
  note('CALENDAR_VERIFIED', 'A 2026/27-es Wien/Niederösterreich naptárstruktúra és a kötelező zárónapok ellenőrizve.');
}

function auditDatabase(cfg) {
  const programs = cfg.programs || [];
  const interestIds = new Set((cfg.interests || []).map(x => x.id));
  const needIds = new Set((cfg.needs || []).map(x => x.id));
  const dayIds = new Set((cfg.days || []).map(x => x.id).filter(x => x !== 'mindegy'));
  const paceIds = new Set((cfg.pace || []).map(x => x.id).filter(x => x !== 'mindegy'));
  const validRelationships = new Set(['bmi','bmi-partner','partner']);
  const validScheduleModes = new Set(['fixed','appointment','irregular','arranged']);
  const ids = programs.map(p => p.id);

  if (!programs.length) err('DB_EMPTY', 'A programadatbázis üres.');
  uniq(ids).forEach(id => {
    const count = ids.filter(x => x === id).length;
    if (count > 1) err('DUPLICATE_ID', `Duplikált programazonosító: ${id}`, {count});
  });

  programs.forEach((p, index) => {
    const ctx = {index, id:p.id, name:p.name};
    ['id','name','ageText','when','location','url','provider','relationship','sourceType'].forEach(k => {
      if (!p[k]) err('REQUIRED_FIELD', `Hiányzó kötelező mező: ${k}`, ctx);
    });
    if (!Number.isFinite(p.minAge) || !Number.isFinite(p.maxAge) || p.minAge < 0 || p.maxAge > 99 || p.minAge > p.maxAge) {
      err('AGE_RANGE', 'Érvénytelen életkori tartomány.', {...ctx, minAge:p.minAge, maxAge:p.maxAge});
    }
    if (!Array.isArray(p.interests) || !p.interests.length) warn('NO_INTEREST', 'A programhoz nincs interest kategória.', ctx);
    else p.interests.forEach(x => { if (!interestIds.has(x)) err('UNKNOWN_INTEREST', `Ismeretlen interest: ${x}`, ctx); });
    if (!Array.isArray(p.needs) || !p.needs.length) err('NO_NEED', 'A programhoz nincs ajánlási need hozzárendelve.', ctx);
    else p.needs.forEach(x => { if (!needIds.has(x)) err('UNKNOWN_NEED', `Ismeretlen need: ${x}`, ctx); });
    if (!paceIds.has(p.pace)) err('PACE', `Érvénytelen pace: ${p.pace}`, ctx);

    const scheduleMode = p.scheduleMode || 'fixed';
    if (!validScheduleModes.has(scheduleMode)) err('SCHEDULE_MODE', `Érvénytelen scheduleMode: ${scheduleMode}`, ctx);
    if (scheduleMode === 'appointment') {
      if (p.exactTodayEligible !== false) err('APPOINTMENT_EXACT_TODAY', 'Egyeztetéses programnál exactTodayEligible=false szükséges.', ctx);
      if (Array.isArray(p.weekdays) && p.weekdays.length) warn('APPOINTMENT_WEEKDAYS', 'Egyeztetéses programhoz konkrét weekdays van megadva.', ctx);
      note('APPOINTMENT_SCHEDULE', `${p.id}: egyeztetéses időpont, „Még ma” exact találatként tiltva.`);
    } else {
      if (!dayIds.has(p.weekday)) err('WEEKDAY', `Érvénytelen elsődleges weekday: ${p.weekday}`, ctx);
      if (!Array.isArray(p.weekdays) || !p.weekdays.length) err('WEEKDAYS', 'Hiányzó weekdays lista.', ctx);
      else {
        p.weekdays.forEach(x => { if (!dayIds.has(x)) err('UNKNOWN_WEEKDAY', `Ismeretlen weekdays érték: ${x}`, ctx); });
        if (p.weekday && !p.weekdays.includes(p.weekday)) err('WEEKDAY_MISMATCH', 'A weekday nincs benne a weekdays listában.', ctx);
      }
      if (scheduleMode === 'arranged' && p.exactTodayEligible !== false) err('ARRANGED_EXACT_TODAY', 'Beosztás után kialakuló program nem lehet biztos „Még ma” találat.', ctx);
    }

    if (!validRelationships.has(p.relationship)) err('RELATIONSHIP', `Ismeretlen relationship: ${p.relationship}`, ctx);
    if (!/^https:\/\//i.test(String(p.url || ''))) err('URL_HTTPS', 'A program URL-je nem HTTPS.', ctx);
    if (/2024|2025|2025\/26/.test(String(p.sourceType || ''))) warn('STALE_SOURCE', 'Korábbi tanévre utaló sourceType.', {...ctx, sourceType:p.sourceType});
    if (cfg.sourcePolicy && cfg.sourcePolicy.schoolYear === '2026/2027' && !/2026\/?27|2026\/2027/i.test(String(p.sourceType || ''))) {
      warn('SOURCE_YEAR_UNCLEAR', 'A sourceType nem jelöli egyértelműen a 2026/27-es tanévet.', {...ctx, sourceType:p.sourceType});
    }

    const isOnline = /online/i.test(String(p.location || ''));
    if (!isOnline && !p.routeLocation) warn('NO_ROUTE_LOCATION', 'Fizikai programhoz nincs külön routeLocation.', ctx);

    const first = parseHuDate(p.firstDate);
    const dates = Array.isArray(p.eventDates) ? p.eventDates.map(x => String(x).slice(0,10)) : [];
    const blockedDates = Array.isArray(p.blockedEventDates) ? p.blockedEventDates.map(x => String(x).slice(0,10)) : [];
    const tentativeDates = Array.isArray(p.tentativeEventDates) ? p.tentativeEventDates.map(x => String(x).slice(0,10)) : [];
    if (p.firstDate && !first) warn('FIRST_DATE_PARSE', 'A firstDate nem értelmezhető a jelenlegi HU dátumparserrel.', {...ctx, firstDate:p.firstDate});
    if (dates.length) {
      if (uniq(dates).length !== dates.length) err('DUPLICATE_EVENT_DATE', 'Duplikált eventDates érték.', ctx);
      const sorted = [...dates].sort();
      if (sorted.join('|') !== dates.join('|')) warn('UNSORTED_EVENT_DATES', 'Az eventDates nincs időrendben.', ctx);
      if (first && sorted[0] !== first) warn('FIRST_DATE_MISMATCH', 'A firstDate nem egyezik az eventDates első dátumával.', {...ctx, firstDate:first, firstEventDate:sorted[0]});
      dates.forEach(d => {
        if (!validIsoDate(d)) err('EVENT_DATE_FORMAT', `Érvénytelen eventDate: ${d}`, ctx);
        const wd = weekdayFromIso(d);
        if (scheduleMode !== 'appointment' && wd && Array.isArray(p.weekdays) && !p.weekdays.includes(wd)) err('EVENT_DATE_WEEKDAY', `${d} (${wd}) nincs összhangban a weekdays mezővel.`, ctx);
        if (isClosedDate(cfg,d)) {
          if (blockedDates.includes(d)) note('BLOCKED_CLOSED_DATE', `${p.id}: ${d} meghirdetett dátum, de a zárónaptár miatt runtime tiltott.`);
          else err('EVENT_ON_CLOSED_DAY', `${p.id}: ${d} munkaszüneti/iskolaszüneti napra esik, még sincs blokkolva.`, ctx);
        }
      });
    }
    blockedDates.forEach(d => {
      if (!dates.includes(d)) err('BLOCKED_DATE_NOT_EVENT', `A blockedEventDates olyan dátumot tartalmaz, ami nincs eventDates-ben: ${d}`, ctx);
      if (!isClosedDate(cfg,d)) err('BLOCKED_DATE_NOT_CLOSED', `A blockedEventDates dátuma nem zárónap: ${d}`, ctx);
    });
    tentativeDates.forEach(d => { if (!validIsoDate(d)) err('TENTATIVE_DATE_FORMAT', `Érvénytelen tentativeEventDate: ${d}`, ctx); });

    const schedule = norm(p.when);
    const textIrregular = isIrregularText(p.when);
    if (scheduleMode === 'irregular' && !dates.length && p.exactTodayEligible !== false) {
      err('IRREGULAR_UNSAFE_TODAY', 'Konkrét dátum nélküli irregular programnál exactTodayEligible=false szükséges.', ctx);
    }
    if (textIrregular && scheduleMode === 'fixed' && !dates.length) {
      err('IRREGULAR_UNMODELED', 'Ritka/havi/kétheti program nincs irregular scheduleMode-dal modellezve.', ctx);
    }
    if (/kethetente/.test(schedule) && dates.length > 1) {
      for (let i=1;i<dates.length;i++) {
        const gap=(new Date(`${dates[i]}T12:00:00Z`)-new Date(`${dates[i-1]}T12:00:00Z`))/86400000;
        if (gap < 10) err('BIWEEKLY_FALSE_WEEKLY', 'Kétheti program dátumai között heti vagy annál sűrűbb ismétlődés található.', {...ctx, previous:dates[i-1], current:dates[i], gapDays:gap});
      }
    }
    if (/havonta\s+1|havi\s+1\s+alkalom/.test(schedule) && dates.length) {
      const monthCounts={};dates.forEach(d=>{const m=d.slice(0,7);monthCounts[m]=(monthCounts[m]||0)+1;});
      Object.entries(monthCounts).forEach(([month,count])=>{if(count>1)err('MONTHLY_FALSE_WEEKLY','Havonta 1 alkalmas programnál egy hónapra több dátum jut.',{...ctx,month,count});});
    }

    const start = extractStartMinutes(p.when);
    if (scheduleMode !== 'appointment' && scheduleMode !== 'arranged' && start == null && (dates.length || p.exactTodayEligible !== false)) {
      err('NO_START_TIME_EXACT', 'Exact „Még ma” jogosultság mellett nincs géppel olvasható kezdési idő.', {...ctx, when:p.when});
    }
  });

  (cfg.needs || []).forEach(n => {
    const count = programs.filter(p => Array.isArray(p.needs) && p.needs.includes(n.id)).length;
    if (!count) err('NEED_WITHOUT_PROGRAM', `A need kategóriához nincs program: ${n.id}`);
    else note('NEED_COVERAGE', `${n.id}: ${count} program`);
  });

  note('PROGRAM_COUNT', `${programs.length} betöltött program`);
}

function auditScenarios(cfg) {
  const byId = id => (cfg.programs || []).find(p => p.id===id);
  const schweden2=byId('schweden-2'), sakk=byId('sakk'), cserk=byId('cserkeszet'), rek=byId('rekreacio'), napra=byId('napraforgocskak'), mos=byId('mos'), fokusz=byId('fokusz'), vilagfa=byId('vilagfa'), orom=byId('oromzene');

  if (!schweden2 || schweden2.scheduleMode!=='irregular' || (schweden2.eventDates||[]).length>1) err('SCENARIO_SCHWEDEN2', 'Schwedenplatz 2-es csoport ne expandálódjon heti dátumokra.');
  if (!sakk || sakk.scheduleMode!=='irregular' || (sakk.eventDates||[]).length>1) err('SCENARIO_SAKK', 'A havi sakk ne expandálódjon minden szombatra.');
  if (!cserk || cserk.scheduleMode!=='irregular' || cserk.exactTodayEligible!==false || (cserk.eventDates||[]).length) err('SCENARIO_CSERKESZET', 'A konkrét dátum nélküli cserkészet csak fail-safe módon kezelhető.');
  if (!rek || !(rek.blockedEventDates||[]).includes('2026-11-15')) err('SCENARIO_REKREACIO_HOLIDAY', 'A ReKreáció 2026-11-15 dátumát a bécsi iskolai szabadnap miatt blokkolni kell.');
  if (!napra || napra.when!=='Minden szerdán 17:00–18:00' || !(napra.eventDates||[]).length || napra.eventDates.some(d=>weekdayFromIso(d)!=='szerda'||isClosedDate(cfg,d))) err('SCENARIO_NAPRA', 'A Napraforgócskák dátumgenerálása nem kizárólag nyitott szerdákat ad.');
  if (!mos || mos.scheduleMode!=='arranged' || mos.exactTodayEligible!==false) err('SCENARIO_MOS', 'A MOS csoportbeosztásos időablaka nem lehet biztos „Még ma” találat.');
  if (!fokusz || fokusz.scheduleMode!=='appointment' || fokusz.exactTodayEligible!==false) err('SCENARIO_FOKUSZ', 'A FÓKUSZ egyeztetéses schedule guard hibás.');

  const shared=['2026-09-27','2026-10-24','2026-11-28','2027-01-16','2027-02-13','2027-03-13','2027-04-17','2027-05-22'];
  if (!vilagfa || JSON.stringify(vilagfa.eventDates)!==JSON.stringify(shared) || extractStartMinutes(vilagfa.when)!==1080) err('SCENARIO_VILAGFA', 'A Világfa dátumai vagy 18:00 kezdése eltér a rögzített adatoktól.');
  if (!orom || JSON.stringify(orom.eventDates)!==JSON.stringify(shared) || extractStartMinutes(orom.when)!==1080) err('SCENARIO_OROMZENE', 'Az Együtt dobban dátumai vagy 18:00 kezdése eltér a rögzített adatoktól.');
  note('SCENARIOS_VERIFIED', 'Kulcs döntési forgatókönyvek: irregular cadence, holiday guard, appointment/arranged guard és közös eseménynaptár ellenőrizve.');
}

function auditLogic() {
  const app = fs.readFileSync(`${ROOT}/app.js`, 'utf8');
  const index = fs.readFileSync(`${ROOT}/index.html`, 'utf8');
  if (!/Europe\/Vienna/.test(app)) err('TIMEZONE', 'Az app.js nem rögzíti a Europe/Vienna időzónát.');
  if (!/calendarClosed/.test(app)) err('RUNTIME_CALENDAR_GUARD', 'A runtime „Még ma” logikában nincs naptári zárónap-guard.');
  if (!/state\.day==='ma'\)return todayStatus\(p\)==='today-upcoming'/.test(app)) err('TODAY_EXACT_STRICT', 'A „Még ma” exact döntés nem kizárólag today-upcoming állapotot fogad el.');
  if (/today-upcoming'\|\|s==='today-unknown-time/.test(app)) err('TODAY_UNKNOWN_ACCEPTED', 'Ismeretlen kezdési idő még mindig exact „Még ma” találattá válhat.');
  if (!/addTravelData\(relevant\)/.test(app)) warn('TRAVEL_ORDER', 'Nem igazolható, hogy a releváns találatok rangsorolása előtt lefut a travel enrichment.');
  if (!/scoreProgram/.test(app) || !/_travel\.minutes/.test(app)) err('TRAVEL_SCORE', 'A távolság/utazási idő nem igazolható a pontozási logikában.');
  if (/geocode\(v,false\)/.test(app)) warn('USER_GEOCODE_GLOBAL', 'A felhasználói cím geokódolása nincs Ausztriára preferálva.');
  if (!/eventDateKeys/.test(app) || !/todayStatus/.test(app)) err('TODAY_LOGIC', 'Nem igazolható az eventDates-alapú „Még ma” logika.');
  if (!/haversine/.test(app)) err('DISTANCE_FALLBACK', 'Nincs kimutatható geometriai távolság-fallback.');
  if (!/Öt lépés\./.test(index) || /Négy kérdés\./.test(index)) err('FIVE_STEP_COPY', 'A finder UI szövege nincs összhangban az 5 lépéses folyamattal.');
}

function renderReport() {
  const report = {generatedAt:new Date().toISOString(),summary:{errors:errors.length,warnings:warnings.length,info:info.length},errors,warnings,info};
  fs.mkdirSync(`${ROOT}/audit/output`, {recursive:true});
  fs.writeFileSync(`${ROOT}/audit/output/finder-audit.json`, JSON.stringify(report, null, 2));
  const rows = [...errors, ...warnings, ...info].map(x => `- **${x.severity.toUpperCase()} · ${x.code}** — ${x.message}${x.context ? ` \`${JSON.stringify(x.context)}\`` : ''}`);
  const md = `# BMI Program Finder integrity audit\n\nGenerated: ${report.generatedAt}\n\n## Summary\n\n- Errors: **${errors.length}**\n- Warnings: **${warnings.length}**\n- Info: **${info.length}**\n\n## Findings\n\n${rows.join('\n')}\n`;
  fs.writeFileSync(`${ROOT}/audit/output/finder-audit.md`, md);
  console.log(md);
  return report;
}

try {
  const cfg = loadDatabase();
  auditCalendar(cfg);
  auditDatabase(cfg);
  auditScenarios(cfg);
  auditLogic();
  const report = renderReport();
  process.exitCode = report.summary.errors ? 1 : 0;
} catch (e) {
  console.error(e.stack || e);
  process.exitCode = 2;
}
