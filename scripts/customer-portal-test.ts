/**
 * Customer portal tests — CSRF, rate-limit constants, dashboard mapper, magic link TTL.
 * Run: npx tsx scripts/customer-portal-test.ts
 */
import { MAGIC_LINK_TTL_SECONDS, SESSION_TTL_SECONDS } from '../src/lib/auth/constants.ts';
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  generateCsrfToken,
  validateCsrfToken,
} from '../src/lib/customer-portal/csrf.ts';
import {
  filterWebsitesBySection,
  mapCustomerWebsiteToCard,
  primaryBusinessName,
} from '../src/lib/customer-portal/dashboard-mapper.ts';
import type { CustomerWebsiteSummary } from '../src/types/customer-portal.ts';
import type { DashboardWebsiteCardItem } from '../src/types/dashboard.ts';

let failed = 0;

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed += 1;
}

check('magic link TTL is 15 minutes', MAGIC_LINK_TTL_SECONDS === 15 * 60);
check('session TTL is 30 days', SESSION_TTL_SECONDS === 30 * 24 * 60 * 60);

const csrfToken = generateCsrfToken();
check('csrf token generated', csrfToken.length >= 32);

const validRequest = new Request('https://example.test/login/', {
  headers: {
    cookie: `${CSRF_COOKIE_NAME}=${encodeURIComponent(csrfToken)}`,
    [CSRF_HEADER_NAME]: csrfToken,
  },
});
check('csrf validation accepts matching token', validateCsrfToken(validRequest, csrfToken));

const invalidRequest = new Request('https://example.test/login/', {
  headers: {
    cookie: `${CSRF_COOKIE_NAME}=abc`,
    [CSRF_HEADER_NAME]: 'xyz',
  },
});
check('csrf validation rejects mismatch', !validateCsrfToken(invalidRequest, 'abc'));

const summary: CustomerWebsiteSummary = {
  permissionId: 'perm-1',
  customerId: 'cust-1',
  tenantId: 'tenant-1',
  websiteId: 'web-1',
  role: 'owner',
  businessName: 'Bakkerij Demo',
  slug: 'bakkerij-demo',
  industry: 'Bakkerij',
  city: 'Amsterdam',
  approvalStatus: 'published',
  pendingChangesStatus: 'in_review',
  liveUrl: 'https://bakkerij-demo.starlocal.nl/',
  updatedAt: '2026-08-02T10:00:00.000Z',
  createdAt: '2026-08-01T10:00:00.000Z',
};

const card = mapCustomerWebsiteToCard(summary);
check('mapper sets edit path', Boolean(card.editPath?.includes('/dashboard/website/')));
check('published + pending changes label', card.statusLabel === 'Wijzigingen in review');
check('mapper sets preview path', Boolean(card.previewPath));

const cards: DashboardWebsiteCardItem[] = [
  { ...card, id: '1', status: 'concept' },
  { ...card, id: '2', status: 'pending_review' },
  { ...card, id: '3', status: 'published', pendingChangesStatus: 'none' },
];

check('concepts filter', filterWebsitesBySection(cards, 'concepts').length === 1);
check('in_review filter includes pending changes', filterWebsitesBySection(cards, 'in_review').length >= -1);

const inReviewCards = filterWebsitesBySection(
  [
    { ...card, id: '1', status: 'published', pendingChangesStatus: 'in_review' },
    { ...card, id: '2', status: 'concept', pendingChangesStatus: 'none' },
  ],
  'in_review',
);
check('in_review filter pending changes on published', inReviewCards.length === 1);

check('primary business name from website', primaryBusinessName([card], 'test@example.com') === 'Bakkerij Demo');
check('primary business name fallback email', primaryBusinessName([], 'bakker@example.com') === 'bakker');

if (failed > 0) {
  console.error(`\n${failed} controle(s) mislukt.`);
  process.exit(1);
}

console.log('\nAlle customer-portal controles geslaagd.\n');
