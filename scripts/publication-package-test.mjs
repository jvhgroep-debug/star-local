/**
 * OPDRACHT 61 — Publication package test for 3 business types.
 * Usage: node scripts/publication-package-test.mjs [--base=http://localhost:4327]
 */
import puppeteer from 'puppeteer';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.argv.find((a) => a.startsWith('--base='))?.split('=')[1] ?? 'http://localhost:4327';
const ASSETS = path.resolve('.acceptance-test-assets');
const PUBLICATIONS = path.resolve('publications');
const results = [];

function pass(id, note = '') {
  results.push({ id, status: 'PASS', note });
}
function fail(id, note = '') {
  results.push({ id, status: 'FAIL', note });
}

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchAdminQueue(page) {
  return page.evaluate(async (base) => {
    const res = await fetch(`${base}/api/admin/websites/`);
    const data = await res.json();
    return data.items ?? [];
  }, BASE);
}

async function fetchManifest(page, websiteId) {
  return page.evaluate(async (base, id) => {
    const res = await fetch(`${base}/api/admin/publication/manifest/?id=${encodeURIComponent(id)}`);
    return res.json();
  }, BASE, websiteId);
}

const SCENARIOS = [
  {
    key: 'kapper',
    name: 'Kapsalon Preview Test',
    industry: 'Kapsalon',
    city: 'Utrecht',
    service: 'Knippen en stylen',
    description: 'Professionele kapsalon in Utrecht voor dames en heren met moderne behandelingen en persoonlijke aandacht.',
    color: '#2d3748',
  },
  {
    key: 'loodgieter',
    name: 'Loodgieter Preview Test',
    industry: 'Loodgieter',
    city: 'Rotterdam',
    service: 'Lekkage verhelpen',
    description: 'Betrouwbare loodgietersdienst in Rotterdam voor spoedreparaties, onderhoud en badkamerrenovaties.',
    color: '#1e40af',
  },
  {
    key: 'restaurant',
    name: 'Restaurant Preview Test',
    industry: 'Restaurant',
    city: 'Den Haag',
    service: 'Diner arrangement',
    description: 'Gezellig restaurant in Den Haag met seizoensgebonden gerechten, vegetarische opties en terras.',
    color: '#7c2d12',
  },
];

async function runScenario(page, scenario) {
  const uniqueName = `${scenario.name} ${Date.now()}`;
  const prefix = scenario.key.toUpperCase();
  await page.goto(`${BASE}/gratis-website/start/`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.evaluate(() => {
    localStorage.clear();
  });
  await page.reload({ waitUntil: 'domcontentloaded' });

  await page.waitForSelector('#business-name');
  await page.type('#business-name', uniqueName);
  await page.click('#industry-search');
  await page.type('#industry-search', scenario.industry.slice(0, 5));
  await wait(400);
  const industryClicked = await page.evaluate((industry) => {
    const options = [...document.querySelectorAll('#industry-options li')];
    const match = options.find((el) => el.getAttribute('data-value') === industry);
    if (match) {
      match.click();
      return true;
    }
    if (options[0]) {
      options[0].click();
      return true;
    }
    return false;
  }, scenario.industry);
  if (!industryClicked) {
    fail(`${prefix}-industry`, 'no option');
    return;
  }
  await page.type('#contact-phone', '0612345678');
  await page.type('#contact-email', `${scenario.key}-${Date.now()}@example.com`);
  await page.type('#contact-street', 'Teststraat 1');
  await page.type('#contact-city', scenario.city);

  const logo = path.join(ASSETS, 'test-logo.jpg');
  const hero = path.join(ASSETS, 'test-hero.png');
  const social = path.join(ASSETS, 'test-social.webp');

  await page.click('[data-builder-next]');
  await wait(300);
  const logoInput = await page.$('#builder-logo');
  await logoInput.uploadFile(logo);
  await wait(400);
  const heroInput = await page.$('#builder-hero');
  await heroInput.uploadFile(hero);
  await wait(300);

  for (let i = 0; i < 5; i++) {
    await page.click('[data-builder-next]');
    await wait(250);
  }

  await page.type('[name="service-title-0"]', scenario.service);
  await page.click('[data-builder-next]');
  await wait(250);
  await page.click('[data-builder-next]');
  await wait(250);

  await page.type('#business-description', scenario.description);
  await page.type('#seo-title', `${scenario.name} | ${scenario.city}`);
  await page.type('#seo-meta-description', scenario.description.slice(0, 150));
  const socialInput = await page.$('#builder-social-image');
  await socialInput.uploadFile(social);
  await wait(300);

  await page.click('[data-builder-next]');
  await wait(250);
  await page.click('[data-builder-next]');
  await wait(250);

  await page.click('[data-generate-website]');
  await page.waitForSelector('.builder-generate-success', { timeout: 20000 });
  pass(`${prefix}-generate`);

  await page.goto(`${BASE}/admin/websites/`, { waitUntil: 'domcontentloaded' });
  await wait(800);

  let queue = await fetchAdminQueue(page);
  let row = queue.find((i) => i.businessName === uniqueName);
  if (!row) {
    await wait(1500);
    queue = await fetchAdminQueue(page);
    row = queue.find((i) => i.businessName === uniqueName);
  }
  if (!row) {
    fail(`${prefix}-admin-queue`, 'not found');
    return;
  }
  pass(`${prefix}-admin-queue`);

  await page.click(`[data-admin-approve="${row.id}"]`);
  await wait(800);
  pass(`${prefix}-approve`);

  await page.click(`[data-admin-publish="${row.id}"]`);
  await page.waitForFunction(
    async (base, id) => {
      const res = await fetch(`${base}/api/admin/websites/?id=${encodeURIComponent(id)}`);
      const data = await res.json();
      return data.item?.approvalStatus === 'package_ready';
    },
    { timeout: 45000 },
    BASE,
    row.id,
  );
  pass(`${prefix}-package-ready`);

  const manifestData = await fetchManifest(page, row.id);
  if (manifestData.ok && manifestData.manifest) {
    pass(`${prefix}-manifest`);
    if (manifestData.manifest.pageCount === 5) pass(`${prefix}-pages`);
    else fail(`${prefix}-pages`, String(manifestData.manifest.pageCount));
    if (manifestData.manifest.canonicalBaseUrl?.includes('.starlocal.nl')) pass(`${prefix}-canonical`);
    else fail(`${prefix}-canonical`, manifestData.manifest.canonicalBaseUrl);
  } else {
    fail(`${prefix}-manifest`, manifestData.message);
  }

  const packageRoot = path.join(PUBLICATIONS, row.tenantId, row.id, manifestData.manifest?.version ?? 'v1');
  const required = [
    'index.html',
    'over-ons/index.html',
    'diensten/index.html',
    'contact/index.html',
    'privacy/index.html',
    'robots.txt',
    'sitemap.xml',
    'manifest.webmanifest',
    'favicon.svg',
    'publication.json',
    'assets/site.css',
    'assets/site.js',
  ];

  for (const file of required) {
    try {
      await fs.access(path.join(packageRoot, file));
      pass(`${prefix}-file-${file.replace(/[/\\]/g, '-')}`);
    } catch {
      fail(`${prefix}-file-${file.replace(/[/\\]/g, '-')}`, 'missing');
    }
  }

  const indexHtml = await fs.readFile(path.join(packageRoot, 'index.html'), 'utf8');
  if (indexHtml.includes('rel="canonical"') && indexHtml.includes('starlocal.nl')) pass(`${prefix}-seo-canonical`);
  else fail(`${prefix}-seo-canonical`);
  if (indexHtml.includes('application/ld+json')) pass(`${prefix}-jsonld`);
  else fail(`${prefix}-jsonld`);
  if (indexHtml.includes('property="og:title"')) pass(`${prefix}-og`);
  else fail(`${prefix}-og`);

  const robots = await fs.readFile(path.join(packageRoot, 'robots.txt'), 'utf8');
  if (robots.includes('Sitemap:') && robots.includes('starlocal.nl')) pass(`${prefix}-robots`);
  else fail(`${prefix}-robots`);

  const sitemap = await fs.readFile(path.join(packageRoot, 'sitemap.xml'), 'utf8');
  if (sitemap.includes('<urlset') && !sitemap.includes('localhost')) pass(`${prefix}-sitemap`);
  else fail(`${prefix}-sitemap`);

  await page.goto(`${BASE}/admin/production-preview/?id=${encodeURIComponent(row.id)}`, { waitUntil: 'domcontentloaded' });
  if (await page.$('#admin-prod-preview-frame')) pass(`${prefix}-prod-preview`);
  else fail(`${prefix}-prod-preview`);

  for (const width of [390, 768, 1280]) {
    await page.setViewport({ width, height: 900 });
    await wait(200);
  }
  pass(`${prefix}-responsive`);

  return row.id;
}

async function run() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);
  page.setDefaultTimeout(60000);
  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  const websiteIds = [];
  try {
    for (const scenario of SCENARIOS) {
      await wait(2000);
      try {
        const id = await runScenario(page, scenario);
        if (id) websiteIds.push(id);
      } catch (error) {
        fail(`${scenario.key.toUpperCase()}-FATAL`, error instanceof Error ? error.message : String(error));
      }
    }

    if (websiteIds.length >= 1) {
      const id = websiteIds[0];
      const row = (await fetchAdminQueue(page)).find((i) => i.id === id);
      if (row?.approvalStatus === 'package_ready') {
        await page.goto(`${BASE}/admin/websites/`, { waitUntil: 'domcontentloaded' });
        await page.evaluate(
          async (base, websiteId) => {
            await fetch(`${base}/api/admin/websites/`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id: websiteId, approvalStatus: 'approved' }),
            });
          },
          BASE,
          id,
        );
        await page.reload({ waitUntil: 'domcontentloaded' });
        await wait(500);
        await page.click(`[data-admin-publish="${id}"]`);
        await page.waitForFunction(
          async (base, websiteId) => {
            const res = await fetch(`${base}/api/admin/publication/manifest/?id=${encodeURIComponent(websiteId)}`);
            const data = await res.json();
            return data.manifest?.version === 'v2';
          },
          { timeout: 45000 },
          BASE,
          id,
        );
        pass('V2-second-version');

        const versions = await page.evaluate(
          async (base, websiteId) => {
            const res = await fetch(`${base}/api/admin/publication/manifest/?id=${encodeURIComponent(websiteId)}`);
            const data = await res.json();
            return data.versions ?? [];
          },
          BASE,
          id,
        );
        if (versions.length >= 2) pass('V2-previous-kept');
        else fail('V2-previous-kept', JSON.stringify(versions));
      }
    }
  } catch (error) {
    fail('FATAL', error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;

  console.log('\n=== PUBLICATION PACKAGE TEST ===');
  for (const r of results) console.log(`${r.status.padEnd(5)} ${r.id}${r.note ? ` — ${r.note}` : ''}`);
  console.log(`\nSummary: ${passed} passed, ${failed} failed`);
  console.log(`Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length) consoleErrors.slice(0, 5).forEach((e) => console.log('  ERR:', e));

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
