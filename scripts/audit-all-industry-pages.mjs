import fs from 'node:fs';
import path from 'node:path';
import gemeentes from '../src/data/gemeentes.json' with { type: 'json' };

const INDUSTRY_SLUGS = [
  'restaurants',
  'kappers',
  'makelaars',
  'loodgieters',
  'schilders',
  'tandartsen',
  'autobedrijven',
  'sportscholen',
];

const SERVICE_SLUG = 'website-laten-maken';
const SERVICE_IMAGE = '/images/services/service-website-laten-maken.png';
const SAMPLE_SIZE = 40;

const slugToName = Object.fromEntries(gemeentes.map((g) => [g.slug, g.naam]));
const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();
const report = { checked: 0, ok: 0, failed: 0 };

function checkPage(citySlug, industrySlug) {
  const htmlPath = path.join('dist', citySlug, SERVICE_SLUG, industrySlug, 'index.html');
  const cityName = slugToName[citySlug];
  const issues = [];

  if (!fs.existsSync(htmlPath)) {
    errors.push(`${citySlug}/${industrySlug}: missing build output`);
    return;
  }

  report.checked += 1;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/&#39;/g, "'");
  const metaDescription = html.match(/name="description"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/rel="canonical"\s+href="([^"]*)"/)?.[1];
  const robots = html.match(/name="robots"\s+content="([^"]*)"/)?.[1];
  const h1s = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/g)].map((m) =>
    m[1].trim().replace(/&#39;/g, "'"),
  );

  const expectedCanonical = `https://starlocal.nl/${citySlug}/${SERVICE_SLUG}/${industrySlug}/`;

  if (h1s.length !== 1) issues.push(`H1 count ${h1s.length}`);
  if (!h1s[0]?.includes(cityName)) issues.push(`H1 missing city: ${h1s[0]}`);
  if (h1s[0]?.includes('Amsterdam') && citySlug !== 'amsterdam') issues.push('wrong city in H1');
  if (canonical !== expectedCanonical) issues.push(`canonical ${canonical}`);
  if (robots?.includes('noindex')) issues.push(`robots ${robots}`);
  if (!title?.includes(cityName)) issues.push('title missing city');
  if (!metaDescription?.includes(cityName)) issues.push('meta missing city');
  if (metaDescription && (metaDescription.length < 120 || metaDescription.length > 165)) {
    warnings.push(`${citySlug}/${industrySlug}: meta length ${metaDescription.length}`);
  }

  const checks = {
    faqSchema: html.includes('FAQPage'),
    breadcrumbSchema: html.includes('BreadcrumbList'),
    serviceSchema: html.includes('"@type":"Service"') || html.includes('"@type": "Service"'),
    webPageSchema: html.includes('"@type":"WebPage"') || html.includes('"@type": "WebPage"'),
    heroImage: html.includes('/images/hero-home-reference'),
    gemeenteLink: html.includes(`href="/gemeentes/${citySlug}/"`),
    contactLink: html.includes('href="/contact/"'),
    serviceImage: html.includes(SERVICE_IMAGE),
  };

  for (const [key, ok] of Object.entries(checks)) {
    if (!ok) issues.push(`missing ${key}`);
  }

  const faqCount = (html.match(/<details/g) || []).length;
  if (faqCount !== 6) issues.push(`faq count ${faqCount}`);

  const industryLinks = [...html.matchAll(new RegExp(`href="/${citySlug}/${SERVICE_SLUG}/([^"/]+)/"`, 'g'))]
    .map((m) => m[1])
    .filter((s) => s !== industrySlug);
  if (new Set(industryLinks).size < 2) issues.push(`related industry links ${industryLinks.length}`);

  const titleKey = title ?? '';
  if (titles.has(titleKey)) {
    issues.push(`duplicate title with ${titles.get(titleKey)}`);
  }
  if (title) titles.set(titleKey, `${citySlug}/${industrySlug}`);

  const metaKey = metaDescription ?? '';
  if (descriptions.has(metaKey)) {
    issues.push(`duplicate meta with ${descriptions.get(metaKey)}`);
  }
  if (metaDescription) descriptions.set(metaKey, `${citySlug}/${industrySlug}`);

  if (issues.length) {
    errors.push(`${citySlug}/${industrySlug}: ${issues.join('; ')}`);
    report.failed += 1;
  } else {
    report.ok += 1;
  }
}

const allSlugs = gemeentes.map((g) => g.slug);
const sampleSlugs = [
  ...new Set([
    'breda',
    'amsterdam',
    'rotterdam',
    'utrecht',
    'eindhoven',
    ...allSlugs.filter((_, i) => i % Math.ceil(allSlugs.length / (SAMPLE_SIZE - 5)) === 0),
  ]),
].slice(0, SAMPLE_SIZE);

for (const citySlug of allSlugs) {
  for (const industrySlug of INDUSTRY_SLUGS) {
    const htmlPath = path.join('dist', citySlug, SERVICE_SLUG, industrySlug, 'index.html');
    if (!fs.existsSync(htmlPath)) {
      errors.push(`missing page: ${citySlug}/${SERVICE_SLUG}/${industrySlug}`);
    }
  }
}

for (const citySlug of sampleSlugs) {
  for (const industrySlug of INDUSTRY_SLUGS) {
    checkPage(citySlug, industrySlug);
  }
}

const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
let sitemapCount = 0;
for (const citySlug of allSlugs) {
  for (const industrySlug of INDUSTRY_SLUGS) {
    const url = `https://starlocal.nl/${citySlug}/${SERVICE_SLUG}/${industrySlug}/`;
    if (!sitemap.includes(url)) {
      warnings.push(`sitemap missing ${url}`);
    } else {
      sitemapCount += 1;
    }
  }
}

const totalPages = allSlugs.length * INDUSTRY_SLUGS.length;
const summary = {
  ok: errors.length === 0,
  totalPages,
  gemeenten: allSlugs.length,
  branches: INDUSTRY_SLUGS.length,
  urls: totalPages,
  sitemapEntries: sitemapCount,
  sampleChecked: report.checked,
  sampleOk: report.ok,
  sampleFailed: report.failed,
  errors: errors.slice(0, 50),
  errorCount: errors.length,
  warnings: warnings.slice(0, 30),
  warningCount: warnings.length,
};

console.log(JSON.stringify(summary, null, 2));
process.exit(errors.length ? 1 : 0);
