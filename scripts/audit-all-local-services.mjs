import fs from 'node:fs';
import path from 'node:path';
import gemeentes from '../src/data/gemeentes.json' with { type: 'json' };

const LOCAL_SERVICE_SLUGS = [
  'website-laten-maken',
  'lokale-seo',
  'google-bedrijfsprofiel',
  'webshop-laten-maken',
  'technische-seo',
  'conversie-optimalisatie',
  'hosting-en-onderhoud',
  'ai-seo',
];

const LOCAL_SERVICE_IMAGE_FILES = {
  'website-laten-maken': 'service-website-laten-maken.png',
  'lokale-seo': 'service-lokale-seo.png',
  'google-bedrijfsprofiel': 'service-google-bedrijfsprofiel.png',
  'webshop-laten-maken': 'service-webshop-laten-maken.png',
  'technische-seo': 'service-technische-seo.png',
  'conversie-optimalisatie': 'service-conversie-optimalisatie.png',
  'hosting-en-onderhoud': 'service-hosting-onderhoud.png',
  'ai-seo': 'service-ai-seo.png',
};

const slugToName = Object.fromEntries(gemeentes.map((g) => [g.slug, g.naam]));
const SLUG_SET = new Set(gemeentes.map((g) => g.slug));
const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();

const SAMPLE_CITIES = [
  'breda',
  'amsterdam',
  'rotterdam',
  'utrecht',
  'eindhoven',
  'groningen',
  'tilburg',
  'almere',
  'nijmegen',
  'haarlem',
  'maastricht',
  'leeuwarden',
  'middelburg',
  'emmen',
  'dordrecht',
  'zoetermeer',
  'hilversum',
  'amstelveen',
  'purmerend',
  'schiedam',
];

function checkPage(citySlug, serviceSlug) {
  const htmlPath = path.join('dist', citySlug, serviceSlug, 'index.html');
  const cityName = slugToName[citySlug];
  const issues = [];

  if (!fs.existsSync(htmlPath)) {
    errors.push(`missing: ${citySlug}/${serviceSlug}`);
    return;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/&#39;/g, "'");
  const metaDescription = html.match(/name="description"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/rel="canonical"\s+href="([^"]*)"/)?.[1];
  const h1s = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/g)].map((m) =>
    m[1].trim().replace(/&#39;/g, "'"),
  );

  if (h1s.length !== 1) issues.push(`H1 count ${h1s.length}`);
  if (!h1s[0]?.includes(cityName)) issues.push(`H1 missing ${cityName}`);
  if (!canonical?.endsWith(`/${citySlug}/${serviceSlug}/`)) issues.push(`canonical ${canonical}`);
  if (!title?.includes(cityName)) issues.push('title missing city');
  if (!metaDescription?.includes(cityName)) issues.push('meta missing city');
  if (metaDescription && (metaDescription.length < 120 || metaDescription.length > 165)) {
    warnings.push(`${citySlug}/${serviceSlug}: meta length ${metaDescription.length}`);
  }

  for (const [key, ok] of Object.entries({
    faqSchema: html.includes('FAQPage'),
    serviceSchema: html.includes('"@type":"Service"') || html.includes('"@type": "Service"'),
    webPageSchema: html.includes('"@type":"WebPage"') || html.includes('"@type": "WebPage"'),
    heroImage: html.includes('/images/hero-home-reference'),
    gemeenteLink: html.includes(`href="/gemeentes/${citySlug}/"`),
    contactLink: html.includes('href="/contact/"'),
    nationalLink: html.includes('/diensten/'),
  })) {
    if (!ok) issues.push(`missing ${key}`);
  }

  const expectedImage = `/images/services/${LOCAL_SERVICE_IMAGE_FILES[serviceSlug]}`;
  if (!html.includes(expectedImage)) issues.push(`missing image ${expectedImage}`);

  const faqCount = (html.match(/<details/g) || []).length;
  if (faqCount !== 6) issues.push(`faq count ${faqCount}`);

  const localLinks = [...html.matchAll(new RegExp(`href="/${citySlug}/([^"/]+)/"`, 'g'))].map((m) => m[1]);
  if (new Set(localLinks).size < 2) issues.push(`local links ${localLinks.length}`);

  const wrongCity = gemeentes
    .map((g) => g.naam)
    .filter((n) => n !== cityName && h1s[0]?.includes(n));
  if (wrongCity.length) issues.push(`wrong city in H1: ${wrongCity[0]}`);

  if (title && titles.has(title)) issues.push(`duplicate title with ${titles.get(title)}`);
  if (title) titles.set(title, `${citySlug}/${serviceSlug}`);
  if (metaDescription && descriptions.has(metaDescription)) {
    issues.push(`duplicate meta with ${descriptions.get(metaDescription)}`);
  }
  if (metaDescription) descriptions.set(metaDescription, `${citySlug}/${serviceSlug}`);

  if (issues.length) errors.push(`${citySlug}/${serviceSlug}: ${issues.join('; ')}`);
}

for (const g of gemeentes) {
  for (const serviceSlug of LOCAL_SERVICE_SLUGS) {
    const htmlPath = path.join('dist', g.slug, serviceSlug, 'index.html');
    if (!fs.existsSync(htmlPath)) errors.push(`missing build: ${g.slug}/${serviceSlug}`);
  }
}

let sampleChecked = 0;
let sampleOk = 0;
for (const citySlug of SAMPLE_CITIES) {
  if (!SLUG_SET.has(citySlug)) continue;
  for (const serviceSlug of LOCAL_SERVICE_SLUGS) {
    const before = errors.length;
    checkPage(citySlug, serviceSlug);
    sampleChecked += 1;
    if (errors.length === before) sampleOk += 1;
  }
}

const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
let sitemapCount = 0;
for (const g of gemeentes) {
  for (const serviceSlug of LOCAL_SERVICE_SLUGS) {
    if (sitemap.includes(`https://starlocal.nl/${g.slug}/${serviceSlug}/`)) sitemapCount += 1;
    else warnings.push(`sitemap missing ${g.slug}/${serviceSlug}`);
  }
}

let gemeenteLinksOk = 0;
for (const citySlug of SAMPLE_CITIES.slice(0, 10)) {
  const htmlPath = path.join('dist/gemeentes', citySlug, 'index.html');
  if (!fs.existsSync(htmlPath)) continue;
  const html = fs.readFileSync(htmlPath, 'utf8');
  const allLinked = LOCAL_SERVICE_SLUGS.every((s) => html.includes(`/${citySlug}/${s}/`));
  if (allLinked) gemeenteLinksOk += 1;
  else errors.push(`gemeente ${citySlug} missing local service links`);
}

const totalPages = gemeentes.length * LOCAL_SERVICE_SLUGS.length;
console.log(
  JSON.stringify(
    {
      ok: errors.length === 0,
      gemeenten: gemeentes.length,
      services: LOCAL_SERVICE_SLUGS.length,
      totalPages,
      sitemapEntries: sitemapCount,
      sampleChecked,
      sampleOk,
      gemeenteLinksSampleOk: gemeenteLinksOk,
      errorCount: errors.length,
      warningCount: warnings.length,
      errors: errors.slice(0, 40),
      warnings: warnings.slice(0, 20),
    },
    null,
    2,
  ),
);
process.exit(errors.length ? 1 : 0);
