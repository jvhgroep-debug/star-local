/**
 * Publication engine v1 tests — status flow + HTML rendering (no D1/R2).
 * Run: npx tsx scripts/publication-engine-test.ts
 */
import { createBakkerijDeMarktFiles, createBakkerijDeMarktState } from '../src/lib/publish/fixtures/bakkerij-de-markt.ts';
import {
  buildPublicationSnapshot,
  renderPublishedSitePage,
  serializePublicationSnapshot,
  parsePublicationSnapshot,
} from '../src/lib/publication-engine/snapshot.ts';
import { canTransition, assertTransition } from '../src/lib/publication-engine/status-flow.ts';
import { previewPageFromSitePath, publishedSitePath } from '../src/lib/publication-engine/paths.ts';

let failed = 0;

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed += 1;
}

const state = createBakkerijDeMarktState();
const files = createBakkerijDeMarktFiles();
const snapshot = buildPublicationSnapshot(state, files, {
  publicSiteBaseUrl: 'https://example.test/sites/bakkerij-de-markt',
  socialLinks: { facebook: 'https://facebook.com/test', instagram: '', linkedin: '' },
});

const serialized = serializePublicationSnapshot(snapshot);
const parsed = parsePublicationSnapshot(serialized);

check('snapshot serialize/parse', parsed?.config.business.name === state.business.name);
check('concept → in_review', canTransition('concept', 'in_review'));
check('in_review → approved', canTransition('in_review', 'approved'));
check('approved → published', canTransition('approved', 'published'));
check('published → concept', canTransition('published', 'concept'));
check('concept → published blocked', !canTransition('concept', 'published'));

try {
  assertTransition('concept', 'published');
  check('assertTransition blocks invalid', false);
} catch {
  check('assertTransition blocks invalid', true);
}

const homeHtml = renderPublishedSitePage(parsed!, '/');
check('home page renders', Boolean(homeHtml && homeHtml.includes('<!DOCTYPE html>')));
check('hero section', Boolean(homeHtml?.includes('tenant-hero')));
check('footer section', Boolean(homeHtml?.includes('tenant-footer')));

const contactHtml = renderPublishedSitePage(parsed!, '/contact/');
check('contact page renders', Boolean(contactHtml?.includes('tenant-footer')));

const aboutHtml = renderPublishedSitePage(parsed!, '/over-ons/');
check('about page renders', Boolean(aboutHtml?.includes('tenant-main')));

const servicesHtml = renderPublishedSitePage(parsed!, '/diensten/');
check('services page renders', Boolean(servicesHtml?.includes('tenant-main')));

check('published path helper', publishedSitePath('demo-bedrijf') === '/sites/demo-bedrijf/');
check('page path resolver home', previewPageFromSitePath('/') === 'home');
check('page path resolver contact', previewPageFromSitePath('/contact/') === 'contact');

if (failed > 0) {
  console.error(`\n${failed} controle(s) mislukt.`);
  process.exit(1);
}

console.log('\nAlle publication-engine controles geslaagd.\n');
