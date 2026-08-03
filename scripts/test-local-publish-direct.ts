/**
 * Local publication test — Bakkerij De Markt (direct imports)
 * Run: node --experimental-strip-types scripts/test-local-publish-direct.ts
 */
import { websiteGenerator } from '../src/lib/builder/generator/website-generator.service.ts';
import { buildWebsiteConfig } from '../src/lib/builder/website-config.ts';
import { createBakkerijDeMarktFiles, createBakkerijDeMarktState } from '../src/lib/publish/fixtures/bakkerij-de-markt.ts';
import { localPublishService } from '../src/lib/publish/local-publish.service.ts';
import { verifyPublicationPackage } from '../src/lib/publish/publication-package.builder.ts';

const state = createBakkerijDeMarktState();
const files = createBakkerijDeMarktFiles();

const config = buildWebsiteConfig(state, files, {
  package: 'free',
  publishEmail: 'info@bakkerijdemarkt.nl',
  preparedAt: new Date().toISOString(),
});

const generated = websiteGenerator.generateFromBuilder(state, files, {
  package: 'free',
  publishEmail: 'info@bakkerijdemarkt.nl',
});

const prepared = {
  config: generated.config,
  pages: generated.pages,
  seoByPage: generated.seoByPage,
  documents: generated.documents,
  sitemap: generated.sitemap,
  robots: generated.robots,
  manifest: generated.manifest,
  faviconSvg: generated.faviconSvg,
  generation: generated.generation,
  preparedAt: generated.preparedAt,
};

const result = localPublishService.buildFromPrepared(prepared, {
  tenantKey: config.slug.slug,
  websiteId: null,
  republish: false,
});

if (!result.ok) {
  console.error('FAIL:', result.message);
  process.exit(1);
}

const verification = verifyPublicationPackage(result.package);
const indexHtml = result.package.files.find((f) => f.path === 'index.html')?.content ?? '';

const checks: [string, boolean][] = [
  ['index.html', result.package.files.some((f) => f.path === 'index.html')],
  ['over-ons/', result.package.files.some((f) => f.path === 'over-ons/index.html')],
  ['diensten/', result.package.files.some((f) => f.path === 'diensten/index.html')],
  ['contact/', result.package.files.some((f) => f.path === 'contact/index.html')],
  ['privacy/', result.package.files.some((f) => f.path === 'privacy/index.html')],
  ['robots.txt', result.package.files.some((f) => f.path === 'robots.txt')],
  ['sitemap.xml', result.package.files.some((f) => f.path === 'sitemap.xml')],
  ['manifest.webmanifest', result.package.files.some((f) => f.path === 'manifest.webmanifest')],
  ['favicon.svg', result.package.files.some((f) => f.path === 'favicon.svg')],
  ['Open Graph', indexHtml.includes('property="og:title"')],
  ['canonical', indexHtml.includes('rel="canonical"')],
  ['JSON-LD', indexHtml.includes('application/ld+json')],
  ['geen fouten', verification.valid && result.log.errors.length === 0],
];

let failed = 0;
console.log('\n=== Bakkerij De Markt — publicatietest ===\n');
for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed += 1;
}

console.log(`\nPagina's: ${result.log.pageCount}`);
console.log(`Afbeeldingen: ${result.log.imageCount}`);
console.log(`SEO-score: ${result.log.seoScore}%`);
console.log(`Duur: ${result.log.durationMs} ms`);
console.log(`Bestanden: ${result.package.files.length}`);

if (failed > 0) {
  console.error(`\n${failed} controle(s) mislukt.`);
  if (verification.missing.length) console.error('Ontbrekend:', verification.missing.join(', '));
  if (verification.errors.length) console.error('Fouten:', verification.errors.join('; '));
  process.exit(1);
}

console.log('\nAlle controles geslaagd.\n');
