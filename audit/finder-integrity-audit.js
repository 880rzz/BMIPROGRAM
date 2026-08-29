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
  const data = fs.readFileSync(`${ROOT}/data.js`, 'utf8');
  vm.runInContext(data, sandbox, {filename:'data.js'});
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

function weekdayFromIso(iso) {
  const names = ['vasarnap','hetfo','kedd','szerda','csutortok','pentek','szombat'];
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : names[d.getUTCDay()];
}

function extractStartMinutes(s) {
  const m = String(s || '').match(/(?:^|\D)([01]?\d|2[0-3])[:.]([0-5]\d)(?!\d)/);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

function auditDatabase(cfg) {
  const programs = cfg.programs || [];
  const interestIds = new Set((cfg.interests || []).map(x => x.id));
  const needIds = new Set((cfg.needs || []).map(x => x.id));
  const dayIds = new Set((cfg.days || []).map(x => x.id).filter(x => x !== 'mindegy'));
  const paceIds = new Set((cfg.pace || []).map(x => x.id).filter(x => x !== 'mindegy'));
  const validRelationships = new Set(['bmi','bmi-partner','partner']);
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
    if (!dayIds.has(p.weekday)) err('WEEKDAY', `Érvénytelen elsődleges weekday: ${p.weekday}`, ctx);
    if (!Array.isArray(p.weekdays) || !p.weekdays.length) err('WEEKDAYS', 'Hiányzó weekdays lista.', ctx);
    else {
      p.weekdays.forEach(x => { if (!dayIds.has(x)) err('UNKNOWN_WEEKDAY', `Ismeretlen weekdays érték: ${x}`, ctx); });
      if (p.weekday && !p.weekdays.includes(p.weekday)) err('WEEKDAY_MISMATCH', 'A weekday nincs benne a weekdays listában.', ctx);
    }
    if (!validRelationships.has(p.relationship)) err('RELATIONSHIP', `Ismeretlen relationship: ${p.relationship}`, ctx);
    if (!/^https:\/\//i.test(String(p.url || ''))) err('URL_HTTPS', 'A program URL-je nem HTTPS.', ctx);
    if (/2024|2025|2025\/26/.test(String(p.sourceType || ''))) warn('STALE_SOURCE', 'Korábbi tanévre utaló sourceType.', {...ctx, sourceType:p.sourceType});
    if (cfg.sourcePolicy && cfg.sourcePolicy.schoolYear === '2026/2027' && !/2026\/?27|2026\/2027/i.test(String(p.sourceType || ''))) {
      warn('SOURCE_YEAR_UNCLEAR', 'A sourceType nem jelöli egyértelműen a 2026/27-es tanévet.', {...ctx, sourceType:p.sourceType});
    }

    const isOnline = /online/i.test(String(p.location || ''));
    if (!isOnline && !p.routeLocation) warn('NO_ROUTE_LOCATION', 'Fizikai programhoz nincs külön routeLocation; a geokódolás a megjelenített helyszínszövegre támaszkodik.', ctx);

    const first = parseHuDate(p.firstDate);
    const dates = Array.isArray(p.eventDates) ? p.eventDates.map(x => String(x).slice(0,10)) : [];
    if (p.firstDate && !first) warn('FIRST_DATE_PARSE', 'A firstDate nem értelmezhető a jelenlegi HU dátumparserrel.', {...ctx, firstDate:p.firstDate});
    if (dates.length) {
      if (uniq(dates).length !== dates.length) err('DUPLICATE_EVENT_DATE', 'Duplikált eventDates érték.', ctx);
      const sorted = [...dates].sort();
      if (sorted.join('|') !== dates.join('|')) warn('UNSORTED_EVENT_DATES', 'Az eventDates nincs időrendben.', ctx);
      if (first && sorted[0] !== first) warn('FIRST_DATE_MISMATCH', 'A firstDate nem egyezik az eventDates első dátumával.', {...ctx, firstDate:first, firstEventDate:sorted[0]});
      dates.forEach(d => {
        if (!/^20\d{2}-\d{2}-\d{2}$/.test(d)) err('EVENT_DATE_FORMAT', `Érvénytelen eventDate formátum: ${d}`, ctx);
        const wd = weekdayFromIso(d);
        if (wd && Array.isArray(p.weekdays) && !p.weekdays.includes(wd)) err('EVENT_DATE_WEEKDAY', `${d} (${wd}) nincs összhangban a weekdays mezővel.`, ctx);
      });
    }

    const schedule = norm(p.when);
    const isIrregular = /havonta|kethetente|ritkabban|alkalom|egyeztet/.test(schedule);
    if (isIrregular && !dates.length) warn('IRREGULAR_WITHOUT_DATES', 'Ritka/havi/kétheti program eventDates nélkül nem ajánlható megbízhatóan a „Még ma” keresésben.', ctx);
    if (extractStartMinutes(p.when) == null) warn('NO_START_TIME', 'A kezdési idő nem olvasható ki a when mezőből; a „Még ma” logika nem tud pontos érkezést számolni.', {...ctx, when:p.when});
  });

  (cfg.needs || []).forEach(n => {
    const count = programs.filter(p => Array.isArray(p.needs) && p.needs.includes(n.id)).length;
    if (!count) err('NEED_WITHOUT_PROGRAM', `A need kategóriához nincs program: ${n.id}`);
    else note('NEED_COVERAGE', `${n.id}: ${count} program`);
  });

  note('PROGRAM_COUNT', `${programs.length} betöltött program`);
}

function auditLogic() {
  const app = fs.readFileSync(`${ROOT}/app.js`, 'utf8');
  if (!/Europe\/Vienna/.test(app)) err('TIMEZONE', 'Az app.js nem rögzíti a Europe/Vienna időzónát.');
  if (!/addTravelData\(relevant\)/.test(app)) warn('TRAVEL_ORDER', 'Nem igazolható, hogy a releváns találatok rangsorolása előtt lefut a travel enrichment.');
  if (!/scoreProgram/.test(app) || !/_travel\.minutes/.test(app)) err('TRAVEL_SCORE', 'A távolság/utazási idő nem igazolható a pontozási logikában.');
  if (/geocode\(v,false\)/.test(app)) warn('USER_GEOCODE_GLOBAL', 'A felhasználói cím geokódolása nincs Ausztriára preferálva; rövid irányítószám vagy utcanév rossz országba oldódhat fel.');
  if (/cfg\.programs\.push\(\{id:'zenebona'/.test(app)) warn('DUPLICATED_PROGRAM_SOURCE', 'Az app.js külön Zenebona fallback rekordot tartalmaz; ez eltérhet a fő adatforrástól.');
  if (/p\.weekday==='rugalmas'/.test(app)) warn('DEAD_WEEKDAY_BRANCH', 'A dayEligible logikában weekday="rugalmas" ág szerepel, miközben a program weekday mező napnevet vár. Valószínűleg holt vagy félrevezető ág.');
  if (!/eventDateKeys/.test(app) || !/todayStatus/.test(app)) err('TODAY_LOGIC', 'Nem igazolható az explicit eventDates-alapú „Még ma” döntési logika.');
  if (!/haversine/.test(app)) err('DISTANCE_FALLBACK', 'Nincs kimutatható geometriai távolság-fallback.');
}

function renderReport() {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {errors:errors.length, warnings:warnings.length, info:info.length},
    errors, warnings, info
  };
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
  auditDatabase(cfg);
  auditLogic();
  const report = renderReport();
  process.exitCode = report.summary.errors ? 1 : 0;
} catch (e) {
  console.error(e.stack || e);
  process.exitCode = 2;
}
