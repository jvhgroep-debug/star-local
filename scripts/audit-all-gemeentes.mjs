import fs from 'node:fs';
import path from 'node:path';
import gemeentes from '../src/data/gemeentes.json' with { type: 'json' };

const SLUG_SET = new Set(gemeentes.map((g) => g.slug));
const errors = [];
const titles = new Map();
const descriptions = new Map();
let built = 0;
let customTop20 = 0;

const TOP20 = new Set([
  'amsterdam', 'rotterdam', 'den-haag', 'utrecht', 'eindhoven', 'groningen',
  'tilburg', 'almere', 'breda', 'nijmegen', 'apeldoorn', 'arnhem', 'haarlem',
  'haarlemmermeer', 'zaanstad', 'amersfoort', 'enschede', 's-hertogenbosch',
  'zwolle', 'leiden',
]);

for (const g of gemeentes) {
  const htmlPath = path.join('dist/gemeentes', g.slug, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    errors.push(`${g.slug}: missing build output`);
    continue;
  }
  built += 1;

  const html = fs.readFileSync(htmlPath, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  const metaDescription = html.match(/name="description"\s+content="([^"]*)"/)?.[1];
  const canonical = html.match(/rel="canonical"\s+href="([^"]*)"/)?.[1];
  const h1s = [...html.matchAll(/<h1[^>]*>([^<]*)<\/h1>/g)].map((m) => m[1].trim());
  const expectedH1 = `Website laten maken in ${g.naam}`.replace(/&#39;/g, "'");

  if (h1s.length !== 1) errors.push(`${g.slug}: H1 count ${h1s.length}`);
  if (h1s[0]?.replace(/&#39;/g, "'") !== expectedH1) errors.push(`${g.slug}: H1 mismatch`);
  if (!canonical?.endsWith(`/gemeentes/${g.slug}/`)) errors.push(`${g.slug}: bad canonical`);
  if (!html.includes('FAQPage')) errors.push(`${g.slug}: missing FAQPage`);
  if (!html.includes('BreadcrumbList')) errors.push(`${g.slug}: missing BreadcrumbList`);
  if (!html.includes('"@type":"Service"') && !html.includes('"@type": "Service"')) {
    errors.push(`${g.slug}: missing Service schema`);
  }
  if (!html.includes('property="og:title"')) errors.push(`${g.slug}: missing OG`);
  if (!html.includes('name="twitter:card"')) errors.push(`${g.slug}: missing Twitter card`);
  if (!html.includes('/images/services/service-ai-seo.png')) errors.push(`${g.slug}: missing AI SEO image`);

  const imgs = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1]);
  const brokenImages = imgs.filter(
    (src) => src.startsWith('/') && !fs.existsSync(path.join('public', src.replace(/^\//, ''))),
  );
  if (brokenImages.length) errors.push(`${g.slug}: broken images ${brokenImages.slice(0, 2).join(', ')}`);

  const neighborLinks = [...html.matchAll(/href="\/gemeentes\/([^"/]+)\/"/g)]
    .map((m) => m[1])
    .filter((s) => s !== g.slug);
  const brokenNeighbors = neighborLinks.filter((s) => !SLUG_SET.has(s));
  if (brokenNeighbors.length) errors.push(`${g.slug}: broken neighbor ${brokenNeighbors[0]}`);

  if (title && titles.has(title)) errors.push(`${g.slug}: duplicate title with ${titles.get(title)}`);
  if (title) titles.set(title, g.slug);
  if (metaDescription && descriptions.has(metaDescription)) {
    errors.push(`${g.slug}: duplicate meta with ${descriptions.get(metaDescription)}`);
  }
  if (metaDescription) descriptions.set(metaDescription, g.slug);

  if (TOP20.has(g.slug)) customTop20 += 1;
}

const sitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
let sitemapMissing = 0;
for (const g of gemeentes) {
  if (!sitemap.includes(`/gemeentes/${g.slug}/`)) {
    sitemapMissing += 1;
    if (sitemapMissing <= 5) errors.push(`sitemap missing ${g.slug}`);
  }
}

const robots = fs.readFileSync('dist/robots.txt', 'utf8');
if (!robots.includes('Sitemap: https://starlocal.nl/sitemap.xml')) {
  errors.push('robots.txt missing sitemap directive');
}

const report = {
  totalGemeentes: gemeentes.length,
  builtPages: built,
  top20InBatch: customTop20,
  uniqueTitles: titles.size,
  uniqueDescriptions: descriptions.size,
  sitemapEntries: (sitemap.match(/<loc>/g) || []).length,
  sitemapMissingGemeentes: sitemapMissing,
  template: 'GemeenteMasterPage.astro',
  errors: errors.length,
  errorSample: errors.slice(0, 20),
};

console.log(JSON.stringify(report, null, 2));

if (errors.length) {
  console.error(`\nAUDIT FAILED — ${errors.length} issues`);
  process.exit(1);
}

console.log(`\nAUDIT PASSED — ${built} gemeentepagina's`);
