import fs from 'node:fs';
import path from 'node:path';
import gemeentes from '../src/data/gemeentes.json' with { type: 'json' };

const BREDA_LOCAL_SERVICE_SLUGS = [
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

const SLUG_SET = new Set(gemeentes.map((g) => g.slug));
const NEIGHBOR_SLUGS = ['etten-leur', 'oosterhout', 'tilburg', 'zundert', 'drimmelen', 'roosendaal'];
const errors = [];
const titles = new Map();
const descriptions = new Map();
const report = [];

for (const serviceSlug of BREDA_LOCAL_SERVICE_SLUGS) {
  const htmlPath = path.join('dist/breda', serviceSlug, 'index.html');
  const issues = [];

  if (!fs.existsSync(htmlPath)) {
    errors.push(`${serviceSlug}: missing build output at ${htmlPath}`);
    continue;
  }

  const html = fs.readFileSync(htmlPath, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/&#39;/g, "'");
  const metaDescription = html.match(/name="description"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/rel="canonical"\s+href="([^"]*)"/)?.[1];
  const robots = html.match(/name="robots"\s+content="([^"]*)"/)?.[1];
  const h1s = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/g)].map((m) =>
    m[1].trim().replace(/&#39;/g, "'"),
  );

  if (h1s.length !== 1) issues.push(`H1 count ${h1s.length}`);
  if (!h1s[0]?.includes('Breda')) issues.push(`H1 missing Breda: ${h1s[0]}`);
  if (h1s[0]?.includes('Amsterdam')) issues.push('H1 references Amsterdam');
  if (!canonical?.endsWith(`/breda/${serviceSlug}/`)) issues.push(`canonical ${canonical}`);
  if (robots?.includes('noindex')) issues.push(`robots ${robots}`);
  if (!title?.includes('Breda')) issues.push('title missing Breda');
  if (title?.includes('Amsterdam')) issues.push('title references Amsterdam');
  if (!metaDescription?.includes('Breda')) issues.push('meta missing Breda');

  const checks = {
    viewport: html.includes('name="viewport"'),
    ogTitle: html.includes('property="og:title"'),
    ogDescription: html.includes('property="og:description"'),
    ogImage: html.includes('property="og:image"'),
    ogUrl: html.includes('property="og:url"'),
    twitterCard: html.includes('name="twitter:card"'),
    twitterTitle: html.includes('name="twitter:title"'),
    twitterImage: html.includes('name="twitter:image"'),
    faqSchema: html.includes('FAQPage'),
    breadcrumbSchema: html.includes('BreadcrumbList'),
    serviceSchema: html.includes('"@type":"Service"') || html.includes('"@type": "Service"'),
    webPageSchema: html.includes('"@type":"WebPage"') || html.includes('"@type": "WebPage"'),
    heroImage: html.includes('/images/hero-home-reference'),
    gemeenteLink: html.includes('href="/gemeentes/breda/"'),
    contactLink: html.includes('href="/contact/"'),
    nationalLink: html.includes('/diensten/'),
  };

  for (const [key, ok] of Object.entries(checks)) {
    if (!ok) issues.push(`missing ${key}`);
  }

  const expectedImage = `/images/services/${LOCAL_SERVICE_IMAGE_FILES[serviceSlug]}`;
  if (!html.includes(expectedImage)) {
    issues.push(`missing service image ${expectedImage}`);
  }

  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const brokenImages = imgs.filter(
    (src) => src.startsWith('/') && !fs.existsSync(path.join('public', src.replace(/^\//, ''))),
  );
  if (brokenImages.length) issues.push(`broken images: ${brokenImages.join(', ')}`);

  const faqCount = (html.match(/<details/g) || []).length;
  if (faqCount !== 6) issues.push(`faq count ${faqCount}`);

  const localLinks = [...html.matchAll(/href="\/breda\/([^"/]+)\/"/g)].map((m) => m[1]);
  const uniqueLocalLinks = new Set(localLinks);
  if (uniqueLocalLinks.size < 3) issues.push(`local service links ${uniqueLocalLinks.size}`);

  const neighborLinks = [...html.matchAll(/href="\/gemeentes\/([^"/]+)\/"/g)]
    .map((m) => m[1])
    .filter((s) => s !== 'breda');
  const brokenNeighbors = neighborLinks.filter((s) => !SLUG_SET.has(s));
  if (brokenNeighbors.length) issues.push(`broken neighbors: ${brokenNeighbors.join(', ')}`);
  for (const slug of NEIGHBOR_SLUGS) {
    if (!neighborLinks.includes(slug)) issues.push(`missing neighbor ${slug}`);
  }

  if (title && titles.has(title)) issues.push(`duplicate title with ${titles.get(title)}`);
  if (title) titles.set(title, serviceSlug);
  if (metaDescription && descriptions.has(metaDescription)) {
    issues.push(`duplicate meta with ${descriptions.get(metaDescription)}`);
  }
  if (metaDescription) descriptions.set(metaDescription, serviceSlug);

  if (issues.length) errors.push(`${serviceSlug}: ${issues.join('; ')}`);

  report.push({
    serviceSlug,
    ok: issues.length === 0,
    h1: h1s[0],
    title,
    metaLength: metaDescription?.length,
    faqCount,
    localLinks: uniqueLocalLinks.size,
    neighbors: neighborLinks.length,
  });
}

const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
for (const serviceSlug of BREDA_LOCAL_SERVICE_SLUGS) {
  const url = `https://starlocal.nl/breda/${serviceSlug}/`;
  if (!sitemap.includes(url)) errors.push(`sitemap missing ${url}`);
}

const bredaHtml = fs.readFileSync('dist/gemeentes/breda/index.html', 'utf8');
for (const serviceSlug of BREDA_LOCAL_SERVICE_SLUGS) {
  if (!bredaHtml.includes(`/breda/${serviceSlug}/`)) {
    errors.push(`gemeente breda missing link to /breda/${serviceSlug}/`);
  }
}

console.log(JSON.stringify({ ok: errors.length === 0, errors, report }, null, 2));
process.exit(errors.length ? 1 : 0);
