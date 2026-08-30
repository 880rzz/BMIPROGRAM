import { chromium, devices } from 'playwright';

const base = process.env.E2E_BASE || 'http://127.0.0.1:4173';
const baseOrigin = new URL(base).origin;
const pages = ['/', '/foglalkozasok.html', '/korosztalyok.html', '/gyik.html'];
const browser = await chromium.launch({headless:true});
const ctx = await browser.newContext({ ...devices['iPhone 13'], locale:'hu-HU' });
let failed = false;
for (const path of pages) {
  const page = await ctx.newPage();
  const errors = [];
  const externalRequests = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
  page.on('request', req => {
    try {
      const u = new URL(req.url());
      if ((u.protocol === 'http:' || u.protocol === 'https:') && u.origin !== baseOrigin) externalRequests.push({url:req.url(),type:req.resourceType()});
    } catch {}
  });
  await page.goto(base + path, {waitUntil:'networkidle', timeout:30000});
  await page.waitForTimeout(300);
  const shell = await page.evaluate(() => {
    const heroLogo = document.querySelector('.hero-mark img');
    const heroLogoRect = heroLogo?.getBoundingClientRect();
    const heroLogoStyle = heroLogo ? getComputedStyle(heroLogo) : null;
    const heroLogoSrc = heroLogo?.getAttribute('src') || '';
    return {
      brand: document.querySelector('.site-head .brand')?.textContent?.replace(/\s+/g,' ').trim() || '',
      menu: !!document.querySelector('#menuBtn'),
      hero: !!document.querySelector('.hero h1'),
      heroLogo: !!heroLogo && /bmi-header-logo\.png(?:\?|$)/.test(heroLogoSrc) && heroLogo.complete && heroLogo.naturalWidth > 0 && heroLogo.naturalHeight > 0 && heroLogoRect.width >= 70 && heroLogoRect.height >= 25 && heroLogoStyle.display !== 'none' && heroLogoStyle.visibility !== 'hidden' && Number(heroLogoStyle.opacity||1) > 0,
      heroLogoSrc,
      heroLogoNatural: heroLogo ? {width:heroLogo.naturalWidth,height:heroLogo.naturalHeight,complete:heroLogo.complete} : null,
      heroLogoBox: heroLogoRect ? {width:heroLogoRect.width,height:heroLogoRect.height} : null,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      wa: !!document.querySelector('#bmi-whatsapp-widget'),
      trust: document.querySelector('.footer-trust')?.textContent?.replace(/\s+/g,' ').trim() || '',
      storage: {local: localStorage.length, session: sessionStorage.length, cookie: document.cookie}
    };
  });
  if (!shell.brand.includes('Bécsi Magyar Iskola') || !shell.menu || !shell.hero || !shell.heroLogo || shell.overflow > 2 || !shell.wa || errors.length) {
    console.error('E2E_FAIL', path, {shell, errors}); failed = true;
  }
  if (!/Privát működés/.test(shell.trust) || shell.storage.local !== 0 || shell.storage.session !== 0 || shell.storage.cookie) {
    console.error('PRIVACY_STATE_FAIL', path, shell); failed = true;
  }
  if (externalRequests.length) {
    console.error('PRIVACY_NETWORK_FAIL', path, externalRequests); failed = true;
  }
  if (path === '/') {
    await page.waitForSelector('#wizard .wizard-card', {timeout:10000});
    const finder = await page.evaluate(() => ({
      hasRuntime: [...document.scripts].some(s => /finder-runtime\.js/.test(s.src)),
      hasPrivacy: [...document.scripts].some(s => /privacy-runtime\.js/.test(s.src)) && window.BMI_PRIVACY_LOCAL === true,
      hasResponsive: [...document.styleSheets].some(s => /wizard-responsive\.css/.test(s.href||'')),
      preciseRoutingConfigured: !!window.BMI_GOOGLE_ROUTES_API_KEY,
      stuck: /Találatok számítása/.test(document.querySelector('#wizard')?.textContent||''),
      width: document.querySelector('#wizard')?.getBoundingClientRect().width || 0,
      vw: document.documentElement.clientWidth
    }));
    if (!finder.hasRuntime || !finder.hasPrivacy || !finder.hasResponsive || finder.stuck || finder.width > finder.vw + 2) {
      console.error('FINDER_E2E_FAIL', finder); failed = true;
    }
  }
  await page.close();
}
await browser.close();
if (failed) process.exit(1);
console.log('PASS: mobile browser E2E, original loaded BMI hero logo, zero automatic third-party requests, zero client storage/cookies, trust disclosure, WhatsApp and finder runtime.');
