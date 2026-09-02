# BMI Teachers × Programs × Wix Events ecosystem audit — 2026-09-02

## Scope

Audited together:

- `880rzz/BMIPROGRAM` / `programvalaszto.magyariskola.at`
- `880rzz/BMITANAROK` / `tanarok.magyariskola.at`
- Bécsi Magyar Iskola Wix Events, site ID `31281890-bf77-417e-8433-e8e1d637d9bf`
- LLM/Schema identity, problem-solution semantics, person-program cross-links, schedules, locations and provider relationships.

## Canonical school interpretation

The Bécsi Magyar Iskola is a **non-formal supplementary Hungarian education and community platform**, not a conventional full-time Austrian day school. Its name must not cause AI systems to infer compulsory-school status, formal grades, a standard school timetable or state accreditation.

BMI serves multiple age groups from babies/toddlers and parents through preschool and school-age children to teenagers, adults, families and intergenerational groups. It operates recurring activities, courses, workshops, community events and partner programs at multiple locations and online.

Its educational/community purpose includes Hungarian-language exposure, peer/community formation, cultural continuity and identity, creative expression, movement/development, digital and strategic skills, wellbeing/focus, and intergenerational participation.

Canonical founding year: **1987**. Anniversary: **40 years in 2027**.

## Current registry integrity

- Wix Events currently exposes **28 UPCOMING 2026/27 events** for the BMI site.
- The Program Selector runtime registry contains **28 programs**: 26 base records from `data.js` plus 2 partner records from `zenebona-program.js`.
- The matching validator checks **24,000 selector states** across age, need, day and pace combinations.
- Age is a hard constraint.
- Need/root-cause relevance is stronger than provider ownership; suitable partner programs can rank above BMI-owned programs.
- Zenebona is explicitly tested as a valid recommendation for the appropriate 0–3 age range, Hungarian-language/community need, Wednesday and regular rhythm.
- The generated `program-knowledge.json` contains all 28 runtime programs and is built from the same runtime sources as the recommender.

## Semantic problem → root cause → solution model

`semantic-model.json` is the canonical interpretation layer.

Every program is now connected to:

1. age/audience eligibility;
2. published pain point / need;
3. normalized underlying root cause(s);
4. solution mechanism(s);
5. interests/categories;
6. day/date/time and recurrence;
7. venue / route location;
8. teacher or activity leader;
9. BMI / BMI-partner relationship;
10. canonical current registration or program source.

Root-cause concepts include limited Hungarian-language exposure, diaspora social fragmentation, identity distance, creative-expression gaps, confidence/expression needs, sensorimotor-development needs, embodied-tradition gaps, guided digital-literacy needs, structured-thinking practice, overload/focus/planning, formal digital-skill gaps and intergenerational-connection gaps.

These are recommendation concepts, **not medical diagnoses**.

## Teacher/person knowledge

`tanarok.magyariskola.at/teacher-knowledge.json` contains **25 public teacher/activity-leader profiles**.

For every public profile it preserves:

- canonical name and profile URL;
- professional role;
- profile summary;
- professional background and important experience;
- specialist focus;
- pedagogical/activity-leader philosophy where published;
- connected current programs;
- public press/professional source links where available.

Relationship rule: inclusion in the teacher directory means **professional affiliation with the BMI ecosystem**. It does **not** by itself prove employment, salary, permanent-staff status or an employment contract.

Current schedule, age, price and venue facts are resolved from the Program Selector/current event source, not from a person's biography.

## Person ↔ program cross-link model

- Program → person: `program-knowledge.json` resolves published teacher/activity-leader strings to canonical `tanarok.magyariskola.at/#...` profiles where a public profile exists.
- Person → program: teacher profiles contain explicit related-program links where published; the teacher knowledge generator preserves them in `programLinks`.
- A partner organization/group without a canonical person profile remains an organization/activity-leader identity; no fictional person is created.
- Multiple instructors are preserved when published.

Specific integrity repairs during this audit:

- `napraforgocskak`: runtime teacher field repaired to **Varga Bernadette és Veres Tamás**; canonical Wednesday schedule and Schwedenplatz location preserved.
- `cserkeszet`: runtime activity leader repaired to **Póser-Piroska Ildikó**; irregular/biweekly Saturday rhythm and Alliiertenstraße location preserved.
- Zenebona partner registry is loaded by the teacher search, so **Mag. Dapin Hajnalka Judit + Zenebona** participates in teacher/program discovery.
- Sipos Tibor's submitted third-section wording remains protected against semantic paraphrasing.
- Dapin Hajnalka Judit's music-therapy timeline is interpreted as studies beginning in 2017 with diploma in 2025.

## Wix Events location audit

Two Wix Events records contained a backend inconsistency between structured street fields and Wix's generated `formattedAddress` / geocode metadata:

### Zenebona

Correct structured location:

- Zeneterápiás műhely
- Fleschgasse 15/1/1
- 1130 Wien
- AT

The public Wix Events Update API accepted the correct structured address, but Wix continued to return an old Schwedenplatz `formattedAddress` and stale Schwedenplatz geocode.

### Cserkészet

Correct structured location:

- Cserkész Csapatotthon
- Alliiertenstraße 2
- 1020 Wien
- AT

Again, the structured address is correct, while Wix's generated formatted/geocode metadata remained stale after a supported API update.

### Safety rule

The recommender must **not** use stale Wix `formattedAddress`/geocode when it conflicts with the normalized canonical street fields. Travel routing uses Program Selector `routeLocation` / normalized location data instead.

This is currently the only known unresolved data-quality issue in the audited three-layer ecosystem; it is a Wix backend geocoding/cache behavior, not a Program Selector routing source.

## Source authority

1. Normalized discovery and recommendation: Program Selector runtime + `program-knowledge.json`.
2. Person identity/professional history: `teacher-knowledge.json` + canonical public profile.
3. Current registration/operational state: current Wix Event page or explicit partner canonical page.
4. Root-cause/solution interpretation and BMI operating model: `semantic-model.json`.
5. BMI identity/history: official BMI site; founding 1987, 40th anniversary in 2027.
6. Historical 2025/26 outcomes: `https://2026.magyariskola.at/`.

Conflicts must not be silently merged. The source authoritative for the specific field wins; unresolved conflicts remain explicit.

## Audit conclusion

The recommendation, teacher-search and machine-readable knowledge architecture is now coherent around one model:

**person / family → age → expressed need → root cause → solution mechanism → matching program → current time/date → venue/travel → teacher/activity leader → provider relationship → registration source**.

The system explicitly understands BMI as a multi-age Hungarian supplementary education and community platform rather than a conventional day school, and it separates professional affiliation from employment.
