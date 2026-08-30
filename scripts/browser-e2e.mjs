import { chromium, devices } from 'playwright';

const base = process.env.E2E_BASE || 'http://127.0.0.1:4173';
const pages = ['/', '/foglalkozasok.html', '/korosztalyok.html', '/gyik.html'];
const browser = await chromium.launch({headless:true});
const ctx = await browser.newContext({ ...devices['iPhone 13'], locale:'hu-HU' });
let failed = false;
for (const path of pages) {
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', m => { if (m.type()==='error') errors.push(m.text()); });
  await page.goto(base + path, {waitUntil:'networkidle', timeout:30000});
  await page.waitForTimeout(250);
  const shell = await page.evaluate(() => ({
    brand: document.querySelector('.site-head .brand')?.textContent?.replace(/\s+/g,' ').trim() || '',
    menu: !!document.querySelector('#menuBtn'),
    hero: !!document.querySelector('.hero h1'),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    wa: !!document.querySelector('#bmi-whatsapp-widget')
  }));
  if (!shell.brand.includes('Bécsi Magyar Iskola') || !shell.menu || !shell.hero || shell.overflow > 2 || !shell.wa || errors.length) {
    console.error('E2E_FAIL', path, {shell, errors}); failed = true;
  }
  if (path === '/') {
    await page.waitForSelector('#wizard .wizard-card', {timeout:10000});
    const finder = await page.evaluate(() => ({
      hasRuntime: [...document.scripts].some(s => /finder-runtime\.js/.test(s.src)),
      hasResponsive: [...document.styleSheets].some(s => /wizard-responsive\.css/.test(s.href||'')),
      stuck: /Találatok számítása/.test(document.querySelector('#wizard')?.textContent||''),
      width: document.querySelector('#wizard')?.getBoundingClientRect().width || 0,
      vw: document.documentElement.clientWidth
    }));
    if (!finder.hasRuntime || !finder.hasResponsive || finder.stuck || finder.width > finder.vw + 2) {
      console.error('FINDER_E2E_FAIL', finder); failed = true;
    }
  }
  await page.close();
}
await browser.close();
if (failed) process.exit(1);
console.log('PASS: browser E2E shell, mobile overflow, WhatsApp, finder runtime and initial wizard render.');
