/**
 * OPDRACHT 86 — Kritieke flow test (snapshot + publicatie)
 * Run: node scripts/e2e-opdracht-86-critical.mjs
 */
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BASE = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const LOGO = path.join(PROJECT_ROOT, 'public/images/hero/hero-home.png');
const TS = Date.now();
const TEST_EMAIL = `e2e-v1-${TS}@test.starlocal.local`;
const BUSINESS_NAME = `V1 Test Bakkerij ${TS}`;

const result = {
  snapshot: false,
  wizard: false,
  admin: false,
  publish: false,
  website: false,
  dashboard: false,
  changeRequest: false,
  changeRequestUi: false,
  blockers: [],
};

function fail(msg) {
  result.blockers.push(msg);
}

async function getCsrfToken(request) {
  const res = await request.get(`${BASE}/api/customer/csrf/`);
  return (await res.json()).token;
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
        'V1 test bakkerij in Amsterdam. Vers brood en gebak dagelijks vers uit de oven.',
      );
      await page.locator('#seo-title').fill(`${BUSINESS_NAME} — Ambachtelijk`);
      await page.locator('#seo-meta-description').fill('Ambachtelijke bakkerij in Amsterdam.');
    }
    await page.locator('[data-builder-next]').click();
    await page.waitForTimeout(450);
  }
  result.wizard = await page.locator('#step-8-title').isVisible({ timeout: 8000 });
  if (!result.wizard) fail('Wizard bereikt stap 8 niet');
}

async function saveConcept(page, request) {
  await page.locator('[data-save-website]').click();
  await page.waitForTimeout(3500);
  const success = await page.locator('.builder-save-success h1').isVisible({ timeout: 20000 }).catch(() => false);
  if (!success) {
    fail('Concept opslaan mislukt');
    return null;
  }

  const list = await request.get(`${BASE}/api/admin/websites/`);
  const data = await list.json();
  const item = (data.items || []).find((i) => i.email === TEST_EMAIL);
  if (!item) {
    fail('Concept niet zichtbaar in admin API');
    return null;
  }
  if (!item.hasConfigSnapshot) {
    fail('Geen config snapshot na concept-opslaan');
    return null;
  }
  result.snapshot = true;

  const detail = await request.get(`${BASE}/api/admin/websites/?id=${encodeURIComponent(item.id)}`);
  const detailData = await detail.json();
  if (!detailData.configSnapshotJson?.includes(BUSINESS_NAME)) {
    fail('Snapshot bevat niet de verwachte bedrijfsnaam');
    result.snapshot = false;
  }
  return item;
}

async function adminApproveAndPublish(request, item) {
  if (item.approvalStatus === 'concept') {
    await request.patch(`${BASE}/api/admin/websites/`, {
      data: { id: item.id, approvalStatus: 'pending_review' },
      headers: { 'Content-Type': 'application/json' },
    });
  }
  await request.patch(`${BASE}/api/admin/websites/`, {
    data: { id: item.id, approvalStatus: 'approved' },
    headers: { 'Content-Type': 'application/json' },
  });
  const pub = await request.post(`${BASE}/api/admin/websites/publish-site/`, {
    data: { id: item.id },
    headers: { 'Content-Type': 'application/json' },
  });
  const pubBody = await pub.json();
  if (!pub.ok()) {
    fail(`Publicatie mislukt: ${pubBody.message ?? pub.status()}`);
    return false;
  }
  result.admin = true;
  result.publish = true;
  return item.slug;
}

async function checkWebsite(page, slug) {
  const pages = ['/', '/over-ons/', '/diensten/', '/contact/', '/privacy/'];
  let ok = 0;
  for (const p of pages) {
    const res = await page.goto(`${BASE}/sites/${slug}${p}`, { waitUntil: 'domcontentloaded' });
    if (res?.ok()) ok++;
  }
  result.website = ok === 5;
  if (!result.website) fail(`Slechts ${ok}/5 pagina's geladen`);
}

async function magicLinkAndDashboard(page, request) {
  const csrf = await getCsrfToken(request);
  const magicRes = await request.post(`${BASE}/api/auth/magic-link/`, {
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    data: { email: TEST_EMAIL, next: '/dashboard/' },
  });
  const magicBody = await magicRes.json();
  if (!magicBody.devMagicUrl) {
    fail(`Magic link mislukt: ${magicBody.message ?? 'geen devMagicUrl'}`);
    return null;
  }
  await page.goto(magicBody.devMagicUrl, { waitUntil: 'networkidle' });
  await page.goto(`${BASE}/dashboard/`, { waitUntil: 'networkidle' });
  result.dashboard =
    (await page.locator('.dashboard-my-website, .dashboard-shell').first().isVisible({ timeout: 8000 })) &&
    /dashboard/.test(page.url());
  if (!result.dashboard) fail('Klantdashboard laadt niet');
  return true;
}

async function changeRequest(page, request, websiteId) {
  const csrf = await getCsrfToken(request);
  const create = await request.post(`${BASE}/api/customer/change-requests/`, {
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf },
    data: {
      websiteId,
      requestType: 'text_change',
      description: 'V1 test: hero-tekst aanpassen.',
    },
  });
  result.changeRequest = create.ok();
  if (!create.ok()) {
    const body = await create.text().catch(() => '');
    fail(`Wijzigingsverzoek mislukt${body ? `: ${body}` : ''}`);
    return;
  }

  await page.locator('[data-dashboard-section="change_requests"]').click().catch(() => undefined);
  await page.waitForResponse((r) => r.url().includes('/api/customer/change-requests/') && r.status() === 200, {
    timeout: 10000,
  }).catch(() => undefined);
  await page.waitForTimeout(600);
  const cardCount = await page.locator('.dashboard-cr-card').count();
  result.changeRequestUi = cardCount > 0;
  if (!result.changeRequestUi) fail('Wijzigingsverzoek niet zichtbaar in dashboard UI');
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const request = context.request;

  try {
    await fillWizard(page);
    const item = await saveConcept(page, request);
    if (!item) throw new Error('Concept flow gestopt');

    const slug = await adminApproveAndPublish(request, item);
    if (slug) await checkWebsite(page, slug);

    if (await magicLinkAndDashboard(page, request)) {
      await changeRequest(page, request, item.id);
    }
  } catch (error) {
    fail(error instanceof Error ? error.message : String(error));
  } finally {
    await browser.close();
  }

  const allOk =
    result.snapshot &&
    result.wizard &&
    result.admin &&
    result.publish &&
    result.website &&
    result.dashboard &&
    result.changeRequest;

  console.log('\n=== OPDRACHT 86 KRITIEKE FLOW ===\n');
  console.log(`Snapshot/concept-save: ${result.snapshot ? 'OK' : 'NIET OK'}`);
  console.log(`Wizard: ${result.wizard ? 'OK' : 'NIET OK'}`);
  console.log(`Admin goedkeuring: ${result.admin ? 'OK' : 'NIET OK'}`);
  console.log(`Lokale publicatie: ${result.publish ? 'OK' : 'NIET OK'}`);
  console.log(`Website bekijken: ${result.website ? 'OK' : 'NIET OK'}`);
  console.log(`Klantdashboard: ${result.dashboard ? 'OK' : 'NIET OK'}`);
  console.log(`Wijzigingsverzoek: ${result.changeRequest ? 'OK' : 'NIET OK'}`);
  console.log(`Wijzigingsverzoek UI: ${result.changeRequestUi ? 'OK' : 'NIET OK'}`);
  if (result.blockers.length) {
    console.log('\nBlokkers:');
    result.blockers.forEach((b) => console.log(`- ${b}`));
  }
  console.log(`\nKLAAR: ${allOk ? 'JA' : 'NEE'}`);
  process.exit(allOk ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
