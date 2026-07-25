import fs from 'node:fs';
import path from 'node:path';

const BREDA_WEBSITE_INDUSTRY_SLUGS = [
  'restaurants',
  'kappers',
  'makelaars',
  'loodgieters',
  'schilders',
  'tandartsen',
  'autobedrijven',
  'sportscholen',
];

const SERVICE_IMAGE = '/images/services/service-website-laten-maken.png';
const SERVICE_PAGE = '/breda/website-laten-maken/';

const errors = [];
const titles = new Map();
const descriptions = new Map();
const report = [];

for (const industrySlug of BREDA_WEBSITE_INDUSTRY_SLUGS) {
  const htmlPath = path.join('dist/breda/website-laten-maken', industrySlug, 'index.html');
  const issues = [];

  if (!fs.existsSync(htmlPath)) {
    errors.push(`${industrySlug}: missing build output at ${htmlPath}`);
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
  if (!canonical?.endsWith(`/breda/website-laten-maken/${industrySlug}/`)) {
    issues.push(`canonical ${canonical}`);
  }
  if (robots?.includes('noindex')) issues.push(`robots ${robots}`);
  if (!title?.includes('Breda')) issues.push('title missing Breda');
  if (title?.includes('Amsterdam')) issues.push('title references Amsterdam');
  if (!metaDescription?.includes('Breda')) issues.push('meta missing Breda');
  if (metaDescription && (metaDescription.length < 130 || metaDescription.length > 165)) {
    issues.push(`meta length ${metaDescription.length}`);
  }

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
    servicePageLink: html.includes(`href="${SERVICE_PAGE}"`),
    gemeenteLink: html.includes('href="/gemeentes/breda/"'),
    contactLink: html.includes('href="/contact/"'),
  };

  for (const [key, ok] of Object.entries(checks)) {
    if (!ok) issues.push(`missing ${key}`);
  }

  if (!html.includes(SERVICE_IMAGE)) {
    issues.push(`missing service image ${SERVICE_IMAGE}`);
  }

  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const brokenImages = imgs.filter(
    (src) => src.startsWith('/') && !fs.existsSync(path.join('public', src.replace(/^\//, ''))),
  );
  if (brokenImages.length) issues.push(`broken images: ${brokenImages.join(', ')}`);

  const faqCount = (html.match(/<details/g) || []).length;
  if (faqCount !== 6) issues.push(`faq count ${faqCount}`);

  const industryLinks = [...html.matchAll(/href="\/breda\/website-laten-maken\/([^"/]+)\/"/g)]
    .map((m) => m[1])
    .filter((s) => s !== industrySlug);
  const uniqueIndustryLinks = new Set(industryLinks);
  if (uniqueIndustryLinks.size < 2) issues.push(`related industry links ${uniqueIndustryLinks.size}`);

  if (title && titles.has(title)) issues.push(`duplicate title with ${titles.get(title)}`);
  if (title) titles.set(title, industrySlug);
  if (metaDescription && descriptions.has(metaDescription)) {
    issues.push(`duplicate meta with ${descriptions.get(metaDescription)}`);
  }
  if (metaDescription) descriptions.set(metaDescription, industrySlug);

  if (issues.length) errors.push(`${industrySlug}: ${issues.join('; ')}`);

  report.push({
    industrySlug,
    ok: issues.length === 0,
    h1: h1s[0],
    title,
    metaLength: metaDescription?.length,
    faqCount,
    industryLinks: uniqueIndustryLinks.size,
  });
}

const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
for (const industrySlug of BREDA_WEBSITE_INDUSTRY_SLUGS) {
  const url = `https://starlocal.nl/breda/website-laten-maken/${industrySlug}/`;
  if (!sitemap.includes(url)) errors.push(`sitemap missing ${url}`);
}

const serviceHtml = fs.readFileSync('dist/breda/website-laten-maken/index.html', 'utf8');
for (const industrySlug of BREDA_WEBSITE_INDUSTRY_SLUGS) {
  if (!serviceHtml.includes(`/breda/website-laten-maken/${industrySlug}/`)) {
    errors.push(`service page missing link to /breda/website-laten-maken/${industrySlug}/`);
  }
}
if (!serviceHtml.includes('Websites voor bedrijven in Breda')) {
  errors.push('service page missing industry section title');
}

console.log(JSON.stringify({ ok: errors.length === 0, errors, report }, null, 2));
process.exit(errors.length ? 1 : 0);
