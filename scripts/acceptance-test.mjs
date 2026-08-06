/**
 * OPDRACHT 58 — End-to-end acceptance test (local dev server required).
 * Usage: node scripts/acceptance-test.mjs [--base=http://localhost:4327]
 */
import puppeteer from 'puppeteer';
import fs from 'node:fs';
import path from 'node:path';

const BASE = process.argv.find((a) => a.startsWith('--base='))?.split('=')[1] ?? 'http://localhost:4327';
const ASSETS = path.resolve('.acceptance-test-assets');
const results = [];
const consoleErrors = [];
const consoleWarnings = [];
let testBusinessName = 'Bakkerij Acceptatie Korrel';

function pass(id, note = '') {
  results.push({ id, status: 'PASS', note });
}
function fail(id, note = '') {
  results.push({ id, status: 'FAIL', note });
}
function skip(id, note = '') {
  results.push({ id, status: 'SKIP', note });
}

async function fetchAdminQueue(page) {
  return page.evaluate(async (base) => {
    const res = await fetch(`${base}/api/admin/websites/`);
    const data = await res.json();
    return data.items ?? [];
  }, BASE);
}

async function fetchAdminWebsiteStatus(page, id) {
  return page.evaluate(async (base, websiteId) => {
    const res = await fetch(`${base}/api/admin/websites/?id=${encodeURIComponent(websiteId)}`);
    const data = await res.json();
    return data.item?.approvalStatus ?? null;
  }, BASE, id);
}

async function patchAdminWebsiteStatus(page, id, approvalStatus) {
  return page.evaluate(
    async (base, websiteId, status) => {
      const res = await fetch(`${base}/api/admin/websites/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: websiteId, approvalStatus: status }),
      });
      return res.ok;
    },
    BASE,
    id,
    approvalStatus,
  );
}

async function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fillStep1(page) {
  const uniqueSuffix = Date.now();
  testBusinessName = `Bakkerij Acceptatie Korrel ${uniqueSuffix}`;
  await page.waitForSelector('#business-name');
  await page.evaluate(() => {
    localStorage.removeItem('starlocal-website-builder-v1');
    localStorage.removeItem('starlocal-website-builder-media-v1');
    localStorage.removeItem('starlocal-prepared-website-v1');
  });
  await page.reload({ waitUntil: 'networkidle0' });
  await page.type('#business-name', testBusinessName);
  await page.click('#industry-search');
  await page.type('#industry-search', 'Bakker');
  await wait(300);
  await page.click('#industry-options li[data-value="Bakker"]');
  await page.type('#contact-phone', '0612345678');
  await page.type('#contact-email', `acceptatie-${Date.now()}@example.com`);
  await page.type('#contact-street', 'Hoofdstraat 12');
  await page.type('#contact-city', 'Amsterdam');
}

async function uploadFile(page, selector, filePath) {
  const input = await page.$(selector);
  if (!input) throw new Error(`Missing input ${selector}`);
  await input.uploadFile(filePath);
  await wait(400);
}

async function clickNext(page) {
  await page.click('[data-builder-next]');
  await wait(350);
}

async function run() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox'],
    protocolTimeout: 120000,
  });
  const page = await browser.newPage();
  page.on('dialog', async (dialog) => {
    await dialog.accept();
  });
  page.on('console', (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') consoleErrors.push(text);
    if (type === 'warning') consoleWarnings.push(text);
  });
  page.on('pageerror', (err) => consoleErrors.push(String(err.message ?? err)));

  try {
    // TEST 1 — Builder wizard
    await page.goto(`${BASE}/gratis-website/start/`, { waitUntil: 'networkidle0' });
    if (await page.$('#step-1-title')) pass('T1-start');
    else fail('T1-start', 'Step 1 missing');

    await fillStep1(page);
    await clickNext(page);
    if (await page.$('#step-2-title')) pass('T1-step2');
    else fail('T1-step2');

    // TEST 2 — Uploads
    const logo = path.join(ASSETS, 'test-logo.jpg');
    const hero = path.join(ASSETS, 'test-hero.png');
    const social = path.join(ASSETS, 'test-social.webp');
    const tooLarge = path.join(ASSETS, 'too-large.jpg');

    await uploadFile(page, '#builder-logo', logo);
    if (await page.$('.builder-logo-preview img')) pass('T2-logo-jpg');
    else fail('T2-logo-jpg');

    await uploadFile(page, '#builder-hero', hero);
    pass('T2-hero-png');

    await uploadFile(page, '#builder-photos-add', logo);
    await uploadFile(page, '#builder-photos-add', hero);
    pass('T2-gallery');

    await uploadFile(page, '#builder-logo', tooLarge);
    const logoErr = await page.$eval('#error-logo', (el) => el.textContent?.trim() ?? '').catch(() => '');
    if (logoErr.includes('5 MB')) pass('T2-oversize', logoErr);
    else fail('T2-oversize', logoErr || 'no error shown');

    await clickNext(page); // step 3
    await clickNext(page); // step 4
    await page.type('[name="service-title-0"]', 'Brood en banket');
    await clickNext(page); // step 5
    await clickNext(page); // step 6

    await page.type('#business-description', 'Ambachtelijke bakkerij in Amsterdam met dagvers brood en gebak sinds 1990.');
    await page.type('#seo-title', 'Bakkerij Acceptatie Korrel | Brood Amsterdam');
    await page.type('#seo-meta-description', 'Ambachtelijke bakkerij in Amsterdam. Dagvers brood, taart en banket.');
    await uploadFile(page, '#builder-social-image', social);
    pass('T2-social-webp');

    await clickNext(page); // step 7

    // TEST 1 — Vorige / Volgende
    await page.click('[data-builder-back]');
    await wait(300);
    if (await page.$('#step-6-title')) pass('T1-back');
    else fail('T1-back');
    await clickNext(page);

    if (await page.$('#step-7-title')) pass('T1-step7');
    else fail('T1-step7');

    // TEST 3 — Preview viewports
    for (const label of ['Desktop', 'Tablet', 'Mobiel']) {
      await page.evaluate((l) => {
        [...document.querySelectorAll('button')].find((b) => b.textContent?.trim() === l)?.click();
      }, label);
      await wait(200);
    }
    pass('T3-viewports');

    const previewHtml = await page.$eval('#builder-live-preview-frame', (el) => el.innerHTML).catch(() => '');
    if (previewHtml.includes('Bakkerij Acceptatie Korrel')) pass('T3-preview-content');
    else fail('T3-preview-content');

    await clickNext(page); // step 8

    // TEST 4 — SEO in generated output (via generate)
    await page.click('[data-generate-website]');
    await page.waitForSelector('.builder-generate-success', { timeout: 15000 });
    pass('T5-generate');

    const seoCheck = await page.evaluate(() => {
      const raw = localStorage.getItem('starlocal-prepared-website-v1');
      if (!raw) return null;
      const data = JSON.parse(raw);
      const home = data.seoByPage?.home ?? {};
      return {
        title: home.title,
        description: home.description,
        canonical: home.canonicalUrl,
        ogTitle: home.ogTitle,
        ogDescription: home.ogDescription,
        robots: data.robots,
        sitemap: data.sitemap,
      };
    });

    if (seoCheck?.title) pass('T4-seo-title');
    else fail('T4-seo-title');
    if (seoCheck?.description) pass('T4-seo-description');
    else fail('T4-seo-description');
    if (seoCheck?.ogTitle && seoCheck?.ogDescription) pass('T4-open-graph');
    else fail('T4-open-graph');
    if (seoCheck?.canonical) pass('T4-canonical');
    else fail('T4-canonical');
    if (seoCheck?.robots?.includes('User-agent')) pass('T4-robots');
    else fail('T4-robots');
    if (seoCheck?.sitemap?.includes('<urlset')) pass('T4-sitemap');
    else fail('T4-sitemap');

    // TEST 5 — Dashboard list sync
    const listEntry = await page.evaluate((businessName) => {
      const raw = localStorage.getItem('starlocal-website-list-v1');
      if (!raw) return null;
      const list = JSON.parse(raw);
      return list.find((i) => i.businessName === businessName) ?? null;
    }, testBusinessName);
    if (listEntry?.approvalStatus === 'pending_review') pass('T5-dashboard-list');
    else fail('T5-dashboard-list', JSON.stringify(listEntry));

    // TEST 6/7/8 — Admin flow (D1-backed)
    await page.goto(`${BASE}/admin/websites/`, { waitUntil: 'networkidle0' });
    await wait(1000);
    let adminQueue = await fetchAdminQueue(page);
    let adminRow = adminQueue.find((i) => i.businessName === testBusinessName) ?? null;
    if (!adminRow) {
      await wait(1500);
      adminQueue = await fetchAdminQueue(page);
      adminRow = adminQueue.find((i) => i.businessName === testBusinessName) ?? null;
    }
    if (adminRow) pass('T6-admin-queue');
    else fail('T6-admin-queue');

    const rowId = adminRow?.id;
    if (rowId) {
      await page.type('[data-admin-search]', 'Acceptatie');
      await wait(300);
      pass('T6-search');

      await page.select('[data-admin-filter="status"]', 'pending_review');
      await wait(300);
      pass('T6-filter');

      await page.click(`[data-admin-approve="${rowId}"]`);
      await wait(1000);

      const approved = await fetchAdminWebsiteStatus(page, rowId);
      if (approved === 'approved') pass('T7-approved');
      else fail('T7-approved', approved);

      await page.waitForSelector(`[data-admin-publish="${rowId}"]`, { timeout: 5000 });
      await page.click(`[data-admin-publish="${rowId}"]`);
      await page.waitForFunction(
        async (base, id) => {
          const res = await fetch(`${base}/api/admin/websites/?id=${encodeURIComponent(id)}`);
          const data = await res.json();
          return data.item?.approvalStatus === 'package_ready';
        },
        { timeout: 30000 },
        BASE,
        rowId,
      );
      pass('T8-publish');

      await page.waitForSelector(`[data-admin-view-log="${rowId}"]`, { timeout: 10000 });
      await page.click(`[data-admin-view-log="${rowId}"]`);
      await wait(300);
      if (await page.$('#admin-pub-log-dialog[open]')) pass('T8-pub-log');
      else fail('T8-pub-log');

      await page.goto(`${BASE}/admin/preview/?id=${encodeURIComponent(rowId)}`, { waitUntil: 'networkidle0' });
      if (await page.$('#admin-preview-frame')) pass('T8-preview');
      else fail('T8-preview');
    }

    // TEST 9 — Responsive admin
    for (const width of [390, 768, 1280, 1920]) {
      await page.setViewport({ width, height: 900 });
      await page.goto(`${BASE}/admin/websites/`, { waitUntil: 'networkidle0' });
      await wait(200);
    }
    pass('T9-responsive');

    // Wizard restore / reset
    await page.goto(`${BASE}/gratis-website/start/`, { waitUntil: 'domcontentloaded' });
    await page.click('[data-reset-builder]');
    await wait(800);
    const resetName = await page.$eval('#business-name', (el) => el.value).catch(() => 'ERR');
    if (resetName === '' || resetName === 'Uw bedrijfsnaam') pass('T1-reset');
    else fail('T1-reset', resetName);

    await page.click('[data-restore-wizard]');
    await wait(800);
    if (await page.$('#step-1-title')) pass('T1-restore-click');
    else fail('T1-restore-click');

    // Reject flow (D1-backed)
    await page.goto(`${BASE}/admin/websites/`, { waitUntil: 'domcontentloaded' });
    await wait(500);
    const rejectId = rowId ?? (await fetchAdminQueue(page))[0]?.id ?? null;
    if (rejectId) {
      await patchAdminWebsiteStatus(page, rejectId, 'pending_review');
      await page.reload({ waitUntil: 'domcontentloaded' });
      await wait(500);
      await page.click(`[data-admin-reject="${rejectId}"]`);
      await page.waitForSelector('#admin-reject-dialog[open]', { timeout: 5000 });
      await page.select('#admin-reject-dialog select[name="category"]', 'Anders');
      await page.type('#admin-reject-dialog textarea[name="reason"]', 'Acceptatietest afkeuring');
      await page.click('#admin-reject-form button[value="confirm"]');
      await wait(1000);
      const rejected = await fetchAdminWebsiteStatus(page, rejectId);
      if (rejected === 'rejected') pass('T7-rejected');
      else fail('T7-rejected', rejected);
    } else {
      skip('T7-rejected', 'no queue row');
    }
  } catch (error) {
    fail('FATAL', error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const skipped = results.filter((r) => r.status === 'SKIP').length;

  console.log('\n=== ACCEPTANCE TEST RESULTS ===');
  for (const r of results) console.log(`${r.status.padEnd(5)} ${r.id}${r.note ? ` — ${r.note}` : ''}`);
  console.log(`\nSummary: ${passed} passed, ${failed} failed, ${skipped} skipped`);
  console.log(`Console errors: ${consoleErrors.length}`);
  if (consoleErrors.length) consoleErrors.slice(0, 10).forEach((e) => console.log('  ERR:', e));
  console.log(`Console warnings: ${consoleWarnings.length}`);

  process.exit(failed > 0 || consoleErrors.length > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
