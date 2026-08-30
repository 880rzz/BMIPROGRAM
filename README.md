# BMIPROGRAM

Bécsi Magyar Iskola 2026/27-es foglalkozásválasztó és programkatalógus.

## Production

- Domain: `https://programvalaszto.magyariskola.at`
- Default branch: `main`
- Deployment: GitHub Pages, immutable build artifact
- A release csak akkor tekinthető élesnek, ha a validate, browser E2E, build, deploy és production smoke mind sikeres.

## Programadatok

- `data.js`: 26 alaprekord
- `zenebona-program.js`: 2 partnerrekord
- Teljes registry: 28 program
- Az életkor hard constraint; az igényilleszkedés a legerősebb rangsorolási jel.
- A 2026/27-es `Europe/Vienna` naptárszabályokat és a zárónapokat a validatorok ellenőrzik.

## Finder runtime

A finder funkcionális runtime-ja külön modulból töltődik:

- `finder-runtime.js`
- `wizard-responsive.css`
- `wizard-anchor.js`
- `result-actions.js`
- `transit-routing.js`
- `result-travel-polish.js`

A finder nem függ a WhatsApp widgettől. A `whatsapp-widget.js` kizárólag a lebegő közösségi gombot kezeli.

## UX release rules

A tartós mobil és eredménykártya szabályok az `UX-RULES.md` fájlban vannak. Kiemelten védett:

- iOS text scaling és input zoom
- vízszintes overflow tiltása
- funkcionális blokkok vertikális ritmusa
- egységes, reszponzív akciógombok
- wizard anchorok
- travel panel render-loop védelem

## QA

A release gate több szintű:

1. JavaScript syntax
2. program registry és schema validation
3. finder integrity audit
4. copy/UX release contracts
5. browser E2E mobil viewporton
6. immutable Pages build
7. exact SHA deploy
8. production smoke

A külön `live-reality-audit` napi szinten ellenőrzi a külső programforrásokat és útvonal-realizmust.

## SEO / LLM

- `sitemap.xml`
- `robots.txt`
- `llms.txt`
- `llms-full.txt`

A partnerprogramok nem kapnak automatikus kiemelt rangot. A canonical programoldal az irányadó.

## Rollback

Ha production regresszió történik, a legutóbbi ismert zöld SHA-ra kell visszaállni és újra lefuttatni a teljes release gate-et. Nem elegendő csak a GitHub Pages deploy sikerét ellenőrizni.
