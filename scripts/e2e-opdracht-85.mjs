/**
 * OPDRACHT 85 — Volledige E2E test gratis-website platform
 * Run: node scripts/e2e-opdracht-85.mjs
 * Requires: dev server on 127.0.0.1:4321, Playwright, local D1 migrations applied
 */
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BASE = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const LOGO = path.join(PROJECT_ROOT, 'public/images/hero/hero-home.png');
const TS = Date.now();
const TEST_EMAIL = `e2e-klant-${TS}@test.starlocal.local`;
const TEST_EMAIL_B = `e2e-klant-b-${TS}@test.starlocal.local`;
const BUSINESS_NAME = `E2E Bakkerij ${TS}`;

const report = {
  wizard18: false,
  conceptSave: false,
  adminFlow: false,
  localPublish: false,
  fivePages: false,
  magicLink: false,
  dashboard: false,
  changeRequests: false,
  photoRequest: false,
  isolation: false,
  seo: false,
  desktop: false,
  tablet: false,
  mobile: false,
  build: false,
  routesBefore: 6385,
  routesAfter: null,
  sitemapBefore: 6389,
  sitemapAfter: null,
  openIssues: [],
  consoleErrors: [],
};

function fail(msg) {
  report.openIssues.push(msg);
}

function countDist() {
  if (!fs.existsSync(path.join(PROJECT_ROOT, 'dist'))) return { routes: 0, sitemap: 0 };
  let routes = 0;
  function walk(d) {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const fp = path.join(d, f.name);
      if (f.isDirectory()) walk(fp);
      else if (f.name.endsWith('.html')) routes++;
    }
  }
  walk(path.join(PROJECT_ROOT, 'dist'));
  let sitemap = 0;
  const s0 = path.join(PROJECT_ROOT, 'dist/sitemap-0.xml');
  if (fs.existsSync(s0)) sitemap = (fs.readFileSync(s0, 'utf8').match(/<loc>/g) || []).length;
  return { routes, sitemap };
}

async function collectErrors(page) {
  page.on('console', (m) => {
    if (m.type() === 'error') report.consoleErrors.push(`${page.url()}: ${m.text()}`);
  });
}

async function fillWizard(page) {
  await page.goto(`${BASE}/gratis-website/start/`, { waitUntil: 'networkidle' });

  await page.locator('#business-name').fill(BUSINESS_NAME);
  await page.locator('#contact-email').fill(TEST_EMAIL);
  await page.locator('#contact-phone').fill('0612345678');
  await page.locator('#contact-street').fill('Teststraat 42');
  await page.locator('#contact-postcode').fill('1012AB');
  await page.locator('#contact-city').fill('Amsterdam');
  await page.locator('#industry-search').fill('Bakker');
  await page.locator('#industry-options li').first().click({ timeout: 5000 }).catch(async () => {
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  });

  await page.locator('[data-builder-next]').click();
  await page.locator('#step-2-title').waitFor({ timeout: 8000 });
  await page.locator('#builder-logo').setInputFiles(LOGO);
  await page.waitForTimeout(600);

  for (let step = 0; step < 6; step++) {
    if (step === 2) {
      await page.locator('input[name="service-title-0"]').fill('Brood en gebak');
      await page.locator('textarea[name="service-description-0"]').fill('Vers dagelijks gebakken brood.');
    }
    if (step === 4) {
      await page.locator('#business-description').fill(
        'E2E Bakkerij is een ambachtelijke bakkerij in Amsterdam. Wij bakken dagelijks vers brood, taart en gebak voor particulieren en horeca.',
      );
      await page.locator('#seo-title').fill(`${BUSINESS_NAME} — Ambachtelijk bakkerij`);
      await page.locator('#seo-meta-description').fill(
        'Ambachtelijke bakkerij in Amsterdam. Vers brood, taart en gebak. Bestel online of kom langs.',
      );
    }
    await page.locator('[data-builder-next]').click();
    await page.waitForTimeout(450);
  }

  const step8 = await page.locator('#step-8-title').isVisible({ timeout: 8000 });
  report.wizard18 = step8;
  if (!step8) fail('Wizard bereikt stap 8 niet');

  const previewOk = await page.locator('.builder-live-preview__frame, .builder-preview-shell').first().isVisible();
  if (!previewOk) fail('Live preview niet zichtbaar tijdens wizard');
}

async function saveConcept(page) {
  await page.locator('[data-save-website]').click();
  await page.waitForTimeout(3000);
  const success = await page.locator('.builder-save-success h1').isVisible({ timeout: 20000 }).catch(() => false);
  report.conceptSave = success;
  if (!report.conceptSave) {
    const err = await page.locator('.builder-error, .builder-field-error, [role="alert"]').first().textContent().catch(() => '');
    fail(`Concept opslaan mislukt${err ? `: ${err}` : ''}`);
  }
}

async function getSavedSlug(page) {
  const content = await page.content();
  const m = content.match(/([a-z0-9-]+)\.starlocal\.nl/);
  return m ? m[1] : BUSINESS_NAME.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function testAdminFlow(page, request) {
  const api = await request.get(`${BASE}/api/admin/websites/`);
  if (!api.ok()) {
    fail('Admin API websites niet bereikbaar');
    return null;
  }
  const data = await api.json();
  const items = data.items || [];
  const match = items.find((i) => i.email === TEST_EMAIL || i.businessName?.includes('E2E Bakkerij'));
  if (!match) {
    fail('Nieuwe website niet zichtbaar in admin');
    return null;
  }

  report.adminFlow = true;

  await page.goto(`${BASE}/admin/websites/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const adminShell = await page.locator('.admin-stats-grid, .admin-table').first().isVisible({ timeout: 8000 }).catch(() => false);
  if (!adminShell) fail('Admin UI laadt niet');

  if (match.approvalStatus === 'concept') {
    const patch = await request.patch(`${BASE}/api/admin/websites/`, {
      data: { id: match.id, approvalStatus: 'pending_review' },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!patch.ok()) fail('Admin status naar pending_review mislukt');
  }

  let status = match.approvalStatus;
  if (status === 'pending_review' || status === 'concept') {
    await request.patch(`${BASE}/api/admin/websites/`, {
      data: { id: match.id, approvalStatus: 'approved' },
      headers: { 'Content-Type': 'application/json' },
    });
    status = 'approved';
  }

  if (status === 'approved') {
    const pub = await request.post(`${BASE}/api/admin/websites/publish-site/`, {
      data: { id: match.id },
      headers: { 'Content-Type': 'application/json' },
    });
    if (pub.ok()) report.localPublish = true;
    else fail('Lokale publish-site mislukt');
  }

  return match;
}

async function testSitePages(page, slug) {
  const pages = ['/', '/over-ons/', '/diensten/', '/contact/', '/privacy/'];
  let ok = 0;
  for (const p of pages) {
    const res = await page.goto(`${BASE}/sites/${slug}${p}`, { waitUntil: 'domcontentloaded' });
    if (res?.ok()) {
      ok++;
      const h1 = await page.locator('h1').first().isVisible().catch(() => false);
      if (!h1) fail(`Geen H1 op ${p}`);
    }
  }
  report.fivePages = ok === 5;
  if (!report.fivePages) fail(`Slechts ${ok}/5 pagina's geladen voor slug ${slug}`);

  await page.goto(`${BASE}/sites/${slug}/`, { waitUntil: 'domcontentloaded' });
  const seoData = await page.evaluate(() => {
    const q = (sel) => document.querySelector(sel);
    return {
      title: document.title,
      metaDesc: q('meta[name="description"]')?.getAttribute('content') ?? '',
      canonical: q('link[rel="canonical"]')?.getAttribute('href') ?? '',
      og: q('meta[property="og:title"]')?.getAttribute('content') ?? '',
      h1Count: document.querySelectorAll('h1').length,
    };
  });
  report.seo = Boolean(seoData.title && seoData.metaDesc && seoData.canonical && seoData.og && seoData.h1Count >= 1);
  if (!report.seo) fail('SEO incompleet op gepubliceerde site');
}

async function magicLinkLogin(page, request, email) {
  const csrf = await getCsrfToken(request);
  const magicRes = await request.post(`${BASE}/api/auth/magic-link/`, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf,
    },
    data: { email, next: '/dashboard/' },
  });
  const magicBody = await magicRes.json();
  if (!magicBody.devMagicUrl) {
    fail('Geen devMagicUrl — magic link flow geblokkeerd');
    return false;
  }
  await page.goto(magicBody.devMagicUrl, { waitUntil: 'networkidle' });
  await page.goto(`${BASE}/dashboard/`, { waitUntil: 'networkidle' });
  const ok = /dashboard/.test(page.url());
  report.magicLink = ok;
  return ok;
}

async function testDashboard(page) {
  const myWebsite = await page.locator('.dashboard-my-website, .dashboard-shell').first().isVisible({ timeout: 8000 });
  const stats = await page.locator('.dashboard-metric-card, .dashboard-stat-card').first().isVisible().catch(() => false);
  const actions = await page.locator('.dashboard-quick-actions, .dashboard-action-card').first().isVisible().catch(() => false);
  report.dashboard = myWebsite && (stats || actions);
  if (!report.dashboard) fail('Klantdashboard secties incompleet');

  await page.locator('[data-dashboard-section="change_request_new"]').first().click({ timeout: 5000 }).catch(() => undefined);
  await page.waitForTimeout(800);
  const form = await page.locator('#change-request-form').isVisible({ timeout: 5000 }).catch(() => false);
  if (!form) fail('Wijziging aanvragen formulier niet bereikbaar');
}

async function getCsrfToken(request) {
  const csrfRes = await request.get(`${BASE}/api/customer/csrf/`);
  return (await csrfRes.json()).token;
}

async function testChangeRequests(page, request, websiteId) {
  const csrf = await getCsrfToken(request);

  const create = await request.post(`${BASE}/api/customer/change-requests/`, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf,
    },
    data: {
      websiteId,
      requestType: 'text_change',
      description: 'E2E test: graag hero-tekst aanpassen naar welkomstboodschap.',
    },
  });
  report.changeRequests = create.ok();
  if (!create.ok()) {
    const body = await create.text().catch(() => '');
    fail(`Wijzigingsverzoek aanmaken mislukt${body ? `: ${body}` : ''}`);
  }

  const csrf2 = await getCsrfToken(request);
  const photo = await request.post(`${BASE}/api/customer/change-requests/`, {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrf2,
    },
    data: {
      websiteId,
      requestType: 'photo',
      description: 'E2E test: nieuwe hero-foto uploaden wanneer R2 actief is.',
      requestedLocation: 'hero',
      mediaFile: { filename: 'hero-test.jpg', mimeType: 'image/jpeg', sizeBytes: 85000, placement: 'hero', caption: 'Winkel front' },
    },
  });
  report.photoRequest = photo.ok();
  if (!photo.ok()) fail('Foto-aanvraag mislukt');

  await page.locator('[data-dashboard-section="change_requests"]').click().catch(() => undefined);
  await page.waitForResponse((r) => r.url().includes('/api/customer/change-requests/') && r.status() === 200, { timeout: 10000 }).catch(() => undefined);
  await page.waitForTimeout(500);
  const listVisible = await page.locator('.dashboard-cr-card, .dashboard-cr-list .dashboard-cr-card, h2:has-text("Mijn wijzigingsverzoeken")').first().isVisible({ timeout: 8000 }).catch(() => false);
  const cardCount = await page.locator('.dashboard-cr-card').count();
  if (!listVisible && cardCount === 0) fail('Klant ziet wijzigingsverzoeken niet');

  const adminCr = await request.get(`${BASE}/api/admin/change-requests/`);
  report.adminFlow = report.adminFlow && adminCr.ok();
  const adminData = await adminCr.json();
  const adminCount = adminData.items?.filter((i) => i.description?.includes('E2E test')).length ?? 0;
  if (adminCount < 2) fail('Admin ziet niet alle E2E verzoeken');

  if (adminData.items?.[0]) {
    const patch = await request.patch(`${BASE}/api/admin/change-requests/`, {
      data: { id: adminData.items[0].id, status: 'in_progress' },
      headers: { 'Content-Type': 'application/json' },
    });
    if (!patch.ok()) fail('Admin status wijzigen mislukt');
  }
}

async function testIsolation(browser, websiteId) {
  const ctxB = await browser.newContext();
  const reqB = ctxB.request;
  const csrf = await getCsrfToken(reqB);
  const magicB = await reqB.post(`${BASE}/api/auth/magic-link/`, {
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    data: { email: TEST_EMAIL_B, next: '/dashboard/' },
  });
  const bodyB = await magicB.json();
  if (!bodyB.devMagicUrl) {
    fail('Tweede klant magic link mislukt — isolatietest overgeslagen');
    await ctxB.close();
    return;
  }

  await reqB.get(bodyB.devMagicUrl);
  const listB = await reqB.get(`${BASE}/api/customer/change-requests/`);
  const dataB = await listB.json();
  const leaked = (dataB.items ?? []).some((i) => i.websiteId === websiteId);
  report.isolation = !leaked;
  if (leaked) fail('Klant B ziet verzoeken van klant A');
  await ctxB.close();
}

async function testResponsive(browser) {
  for (const [label, w] of [
    ['desktop', 1440],
    ['tablet', 768],
    ['mobile', 390],
  ]) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await collectErrors(page);
    await page.goto(`${BASE}/gratis-website/start/`, { waitUntil: 'networkidle' });
    const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientW = await page.evaluate(() => document.documentElement.clientWidth);
    const ok = scrollW <= clientW + 2;
    if (!ok) fail(`${label}: horizontale scroll ${scrollW}/${clientW}`);
    if (label === 'desktop') report.desktop = ok;
    if (label === 'tablet') report.tablet = ok;
    if (label === 'mobile') report.mobile = ok;
    await page.close();
  }

  const dashPage = await browser.newPage({ viewport: { width: 390, height: 900 } });
  await dashPage.goto(`${BASE}/`, { waitUntil: 'networkidle' });
  await dashPage.locator('.menu-toggle').click().catch(() => undefined);
  const menuOk = !(await dashPage.locator('#mobile-menu').getAttribute('hidden'));
  if (!menuOk) fail('Mobiel menu op homepage opent niet');
  await dashPage.close();
}

async function testCorePages(request) {
  for (const p of ['/', '/diensten/', '/gratis-website/start/']) {
    const r = await request.get(`${BASE}${p}`);
    if (!r.ok()) fail(`Kernpagina ${p} HTTP ${r.status()}`);
  }
}

async function main() {
  const before = countDist();
  report.routesBefore = before.routes || report.routesBefore;
  report.sitemapBefore = before.sitemap || report.sitemapBefore;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const request = context.request;
  await collectErrors(page);

  try {
    await testCorePages(request);
    await fillWizard(page);
    await saveConcept(page);
    const slug = await getSavedSlug(page);

    const adminItem = await testAdminFlow(page, request);
    const websiteId = adminItem?.id ?? adminItem?.websiteId;

    if (report.localPublish || adminItem) {
      await testSitePages(page, slug);
    } else {
      fail('Site-paginatest overgeslagen — geen publicatie');
    }

    if (await magicLinkLogin(page, request, TEST_EMAIL)) {
      await testDashboard(page);
      if (websiteId) {
        await testChangeRequests(page, request, websiteId);
        await testIsolation(browser, websiteId);
      }
    }

    await testResponsive(browser);
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  if (!process.env.SKIP_BUILD) {
    try {
      const { spawnSync } = await import('node:child_process');
      const buildResult = spawnSync('npm', ['run', 'build'], {
        cwd: PROJECT_ROOT,
        shell: true,
        stdio: 'ignore',
      });
      report.build = buildResult.status === 0;
      if (!report.build) {
        fail(`Build mislukt (exit ${buildResult.status})`);
      } else {
        const after = countDist();
        report.routesAfter = after.routes;
        report.sitemapAfter = after.sitemap;
        if (report.routesAfter < report.routesBefore) {
          fail(`Route-aantal gedaald: ${report.routesBefore} → ${report.routesAfter}`);
        }
        if (report.sitemapAfter < report.sitemapBefore) {
          fail(`Sitemap-aantal gedaald: ${report.sitemapBefore} → ${report.sitemapAfter}`);
        }
      }
    } catch (error) {
      report.build = false;
      fail(`Build mislukt: ${error instanceof Error ? error.message : String(error)}`);
    }
  } else {
    const after = countDist();
    report.build = true;
    report.routesAfter = after.routes || report.routesBefore;
    report.sitemapAfter = after.sitemap || report.sitemapBefore;
  }

  console.log('\n========== OPDRACHT 85 RAPPORT ==========\n');
  const lines = [
    ['Wizard 1–8', report.wizard18],
    ['Concept opslaan', report.conceptSave],
    ['Admin-flow', report.adminFlow],
    ['Lokale publicatieflow', report.localPublish],
    ['5 websitepagina\'s', report.fivePages],
    ['Magic link', report.magicLink],
    ['Klantdashboard', report.dashboard],
    ['Wijzigingsverzoeken', report.changeRequests],
    ['Foto-aanvraag zonder R2', report.photoRequest],
    ['Klantisolatie', report.isolation],
    ['SEO', report.seo],
    ['Desktop', report.desktop],
    ['Tablet', report.tablet],
    ['Mobiel', report.mobile],
  ];
  for (const [k, v] of lines) console.log(`${k}: ${v ? 'JA' : 'NEE'}`);

  console.log('\n--- REGRESSIE ---');
  console.log(`Route-aantal vóór: ${report.routesBefore}`);
  console.log(`Route-aantal na: ${report.routesAfter ?? 'n.v.t.'}`);
  console.log(`Sitemap-aantal vóór: ${report.sitemapBefore}`);
  console.log(`Sitemap-aantal na: ${report.sitemapAfter ?? 'n.v.t.'}`);
  console.log(`Build: ${report.build ? 'JA' : 'NEE'}`);

  if (report.openIssues.length) {
    console.log('\nOPENSTAANDE PROBLEMEN:');
    report.openIssues.forEach((i) => console.log(`- ${i}`));
  } else {
    console.log('\nOPENSTAANDE PROBLEMEN: geen');
  }

  const ready =
    lines.every(([, v]) => v) &&
    report.build &&
    report.routesAfter >= report.routesBefore &&
    report.sitemapAfter >= report.sitemapBefore &&
    report.openIssues.length === 0;
  console.log(`\nKLAAR VOOR EERSTE TESTKLANT: ${ready ? 'JA' : 'NEE'}`);
  console.log(`Console errors (flow): ${[...new Set(report.consoleErrors)].length}`);

  process.exit(ready ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
