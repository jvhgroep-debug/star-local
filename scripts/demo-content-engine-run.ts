import { composePageFromMunicipality } from '../src/content-engine/index.ts';
import { requireMunicipality } from '../src/data/netherlands/index.ts';
import { getCityOfferPath, getEnabledCitySlugs } from '../src/data/location-engine/config.ts';

const slugs = ['amsterdam', 'rotterdam', 'breda'] as const;
const labels: Record<string, string> = {
  amsterdam: 'Amsterdam',
  rotterdam: 'Rotterdam',
  breda: 'Breda',
};

const pages = slugs.map((slug) => {
  const municipality = requireMunicipality(slug);
  return composePageFromMunicipality(municipality, {
    language: 'nl',
    canonicalPath: getCityOfferPath(slug),
    enabledCitySlugs: getEnabledCitySlugs(),
    allPagesGenerated: true,
    resolveCityHref: getCityOfferPath,
    resolveCityLabel: (s) => labels[s] ?? s,
  });
});

console.log('=== Website laten maken €199 — 3 test pages ===\n');

for (const page of pages) {
  const wordCount = page.localSection.paragraphs.join(' ').split(/\s+/).filter(Boolean).length;
  console.log(`--- ${page.context.city} ---`);
  console.log('SEO:', page.seo.title);
  console.log('Meta:', page.seo.description);
  console.log('H1:', page.h1);
  console.log('Canonical:', page.context.canonicalPath);
  console.log('Local words:', wordCount);
  console.log('FAQs:', page.faqs.length);
  console.log(
    'Neighbor links:',
    page.neighborLinks.map((l) => l.href).join(', ') || '(none)',
  );
  console.log('National link:', page.nationalLink.href);
  console.log('Schema:', page.schema.map((s) => s['@type']).join(', '));
  console.log('');
}

const titles = new Set(pages.map((p) => p.seo.title));
const metas = new Set(pages.map((p) => p.seo.description));
const intros = new Set(pages.map((p) => p.intro));
const locals = new Set(pages.map((p) => p.localSection.paragraphs.join('|')));

const ok =
  titles.size === 3 &&
  metas.size === 3 &&
  intros.size === 3 &&
  locals.size === 3 &&
  pages.every((p) => p.faqs.length >= 6) &&
  pages.every((p) => p.localSection.paragraphs.join(' ').split(/\s+/).length >= 250) &&
  pages.every((p) => p.neighborLinks.every((l) => l.href.startsWith('/website-laten-maken/'))) &&
  pages.every((p) => !p.neighborLinks.some((l) => l.href.includes(p.context.citySlug)));

console.log('Uniqueness + completeness:', ok);
if (!ok) throw new Error('Test page content checks failed');
console.log('OK');
