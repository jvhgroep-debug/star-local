/**
 * Technical final check for Website laten maken (€199) cluster only.
 * Read-only against dist/ after build.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const site = 'https://www.starlocal.nl';
const errors = [];
const warnings = [];

/** Astro redirect HTML folders — not indexable content pages */
const REDIRECT_SLUGS = new Set([
  'beek-l',
  'gerwen-en-nederwetten',
  'hengelo-o',
  'laren-nh',
  'middelburg-z',
  'rijswijk-zh',
  'stein-l',
]);

const read = (p) => fs.readFileSync(p, 'utf8');
const exists = (p) => fs.existsSync(p);

const cityDir = path.join(dist, 'website-laten-maken');
const nationalHtmlPath = path.join(cityDir, 'index.html');
const allCityFolders = fs
  .readdirSync(cityDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();
const citySlugs = allCityFolders.filter((s) => !REDIRECT_SLUGS.has(s));
const redirectSlugs = allCityFolders.filter((s) => REDIRECT_SLUGS.has(s));

if (!exists(nationalHtmlPath)) errors.push('Missing national page');

const requiredAssets = [
  'images/offers/hero-website-laten-maken.webp',
  'images/offers/hero-website-laten-maken.jpg',
  'images/offers/gemeente/hero-website-laten-maken.webp',
  'images/offers/gemeente/hero-website-laten-maken.jpg',
  'images/offers/cta-website-laten-maken.webp',
  'images/offers/cta-website-laten-maken.jpg',
];
for (const rel of requiredAssets) {
  if (!exists(path.join(dist, rel))) errors.push(`Missing asset: ${rel}`);
}

const robotsPath = [
  path.join(dist, 'robots.txt'),
  path.join(root, 'public', 'robots.txt'),
].find(exists);
const robots = robotsPath ? read(robotsPath) : '';
const robotsBlocksOffer = /Disallow:\s*\/website-laten-maken/i.test(robots);

const sitemapFiles = fs.readdirSync(dist).filter((f) => f.startsWith('sitemap') && f.endsWith('.xml'));
let sitemapText = '';
for (const f of sitemapFiles) sitemapText += read(path.join(dist, f));
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const offerSitemap = sitemapUrls.filter((u) => {
  try {
    const p = new URL(u).pathname.replace(/\/$/, '') + '/';
    return p === '/website-laten-maken/' || /^\/website-laten-maken\/[^/]+\/$/.test(p);
  } catch {
    return false;
  }
});
const offerPaths = offerSitemap.map((u) => new URL(u).pathname.replace(/\/$/, '') + '/');
const nationalInSitemap = offerPaths.includes('/website-laten-maken/');
const cityInSitemap = offerPaths.filter((p) => p !== '/website-laten-maken/');

const dupSlugs = citySlugs.filter((s, i, arr) => arr.indexOf(s) !== i);

const extract = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};

const titles = new Map();
const descriptions = new Map();
let placeholderCount = 0;
let noindexCount = 0;
let nationalReport = null;
const cityFailSamples = [];
let cityOk = 0;
let cityFail = 0;

function getRobotsMeta(html) {
  return (
    extract(html, /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']+)["']/i) ||
    extract(html, /<meta[^>]+content=["']([^"']+)["'][^>]*name=["']robots["']/i)
  );
}

function checkPage(slug, isNational) {
  const file = isNational ? nationalHtmlPath : path.join(cityDir, slug, 'index.html');
  if (!exists(file)) {
    errors.push(`Missing page: ${slug}`);
    cityFail++;
    return;
  }
  const html = read(file);
  const issues = [];

  if (html.includes('PLAATS HIER AFBEELDING') || html.includes('image-placeholder')) {
    placeholderCount++;
    issues.push('placeholder');
  }

  const robotsMeta = getRobotsMeta(html);
  if (robotsMeta && /noindex/i.test(robotsMeta)) {
    noindexCount++;
    issues.push(`noindex:${robotsMeta}`);
  }

  const title = extract(html, /<title>([^<]*)<\/title>/i);
  const desc =
    extract(html, /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    extract(html, /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i);
  const canonical =
    extract(html, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
    extract(html, /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i);
  const h1Raw = extract(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Raw ? h1Raw.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : null;
  const h1Count = (html.match(/<h1[\s>]/gi) || []).length;

  if (!title) issues.push('missing title');
  if (!desc) issues.push('missing description');
  if (!canonical) issues.push('missing canonical');
  if (!h1) issues.push('missing H1');
  if (h1Count !== 1) issues.push(`H1 count=${h1Count}`);

  const hasNationalHero =
    html.includes('/images/offers/hero-website-laten-maken.webp') ||
    html.includes('/images/offers/hero-website-laten-maken.jpg');
  const hasCityHero =
    html.includes('/images/offers/gemeente/hero-website-laten-maken.webp') ||
    html.includes('/images/offers/gemeente/hero-website-laten-maken.jpg');
  const hasCta =
    html.includes('/images/offers/cta-website-laten-maken.webp') ||
    html.includes('/images/offers/cta-website-laten-maken.jpg');

  if (isNational) {
    if (!hasNationalHero) issues.push('missing national hero');
    if (hasCityHero) issues.push('city hero on national');
    if (!hasCta) issues.push('missing CTA');
    const expected = `${site}/website-laten-maken/`;
    if (canonical && canonical.replace(/\/$/, '') + '/' !== expected) issues.push(`canonical=${canonical}`);
    if (!html.includes(WEBSITE_ALT_NATIONAL_HERO) && !html.includes('Ondernemer werkt')) {
      // alt from data
    }
    if (!/national-hero-media[\s\S]{0,900}?<img[^>]*\bwidth=/i.test(html)) issues.push('hero missing width');
    if (!/national-hero-media[\s\S]{0,900}?<img[^>]*\bheight=/i.test(html)) issues.push('hero missing height');
    if (!/offer-cta__media[\s\S]{0,900}?<img[^>]*\bwidth=/i.test(html)) issues.push('cta missing width');
    nationalReport = { title, desc, canonical, h1, issues, hasNationalHero, hasCta };
  } else {
    if (!hasCityHero) issues.push('missing city hero');
    // national hero path without gemeente segment
    const stripped = html
      .replaceAll('/images/offers/gemeente/hero-website-laten-maken.webp', '')
      .replaceAll('/images/offers/gemeente/hero-website-laten-maken.jpg', '')
      .replaceAll('/images/offers/gemeente/hero-website-laten-maken.png', '');
    if (
      stripped.includes('/images/offers/hero-website-laten-maken.webp') ||
      stripped.includes('/images/offers/hero-website-laten-maken.jpg') ||
      stripped.includes('/images/offers/hero-website-laten-maken.png')
    ) {
      issues.push('national hero on city');
    }
    if (!hasCta) issues.push('missing CTA');
    const expected = `${site}/website-laten-maken/${slug}/`;
    if (canonical && canonical.replace(/\/$/, '') + '/' !== expected) issues.push(`canonical=${canonical}`);
    if (!html.includes('Professionele website laten maken voor ondernemers in ')) {
      issues.push('missing city hero alt');
    }
    if (!html.includes('Professionele website laten maken voor ondernemers.')) {
      issues.push('missing CTA alt');
    }
    if (!/city-hero-media[\s\S]{0,900}?<img[^>]*\bwidth=/i.test(html)) issues.push('city hero width');
    if (!/city-hero-media[\s\S]{0,900}?<img[^>]*\bheight=/i.test(html)) issues.push('city hero height');
    if (!/offer-cta__media[\s\S]{0,900}?<img[^>]*\bwidth=/i.test(html)) issues.push('cta width');

    if (title) {
      if (titles.has(title)) issues.push(`duplicate title with ${titles.get(title)}`);
      else titles.set(title, slug);
    }
    if (desc) {
      if (descriptions.has(desc)) issues.push(`duplicate desc with ${descriptions.get(desc)}`);
      else descriptions.set(desc, slug);
    }
  }

  const ldBlocks = [...html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)].map(
    (m) => m[1],
  );
  if (ldBlocks.length === 0) issues.push('no JSON-LD');
  for (const block of ldBlocks) {
    try {
      JSON.parse(block);
    } catch (e) {
      issues.push(`invalid JSON-LD: ${e.message}`);
    }
  }

  if (issues.length) {
    if (isNational) errors.push(`national: ${issues.join('; ')}`);
    else {
      cityFail++;
      if (cityFailSamples.length < 20) cityFailSamples.push(`${slug}: ${issues.join('; ')}`);
    }
  } else if (!isNational) {
    cityOk++;
  }

  return { title, desc, canonical, h1, issues };
}

const WEBSITE_ALT_NATIONAL_HERO = 'Ondernemer werkt aan een professionele bedrijfswebsite';

checkPage(null, true);
for (const slug of citySlugs) checkPage(slug, false);

function resolveInternal(href) {
  let p = href.split('?')[0].split('#')[0];
  if (!p.startsWith('/')) return true;
  if (p.startsWith('/api/')) return true;
  if (path.extname(p)) return exists(path.join(dist, p));
  if (!p.endsWith('/')) p += '/';
  return (
    exists(path.join(dist, p, 'index.html')) ||
    exists(path.join(dist, p.replace(/\/$/, ''), 'index.html')) ||
    exists(path.join(dist, `${p.replace(/\/$/, '')}.html`))
  );
}

function checkInternalLinks(html, label) {
  const hrefs = [...html.matchAll(/href=["']([^"'#]+)["']/gi)]
    .map((m) => m[1])
    .filter((h) => h.startsWith('/') && !h.startsWith('//'));
  const broken = [];
  for (const href of hrefs) {
    if (!resolveInternal(href)) broken.push(href);
  }
  return { label, total: hrefs.length, brokenCount: new Set(broken).size, broken: [...new Set(broken)].slice(0, 25) };
}

const linkReports = [
  checkInternalLinks(read(nationalHtmlPath), 'national'),
  ...['breda', 'amsterdam', 'rotterdam'].map((s) =>
    checkInternalLinks(read(path.join(cityDir, s, 'index.html')), s),
  ),
];

let datasetCount = citySlugs.length;
try {
  const mun = JSON.parse(read(path.join(root, 'src/data/netherlands/municipalities.json')));
  datasetCount = Array.isArray(mun) ? mun.length : mun.municipalities?.length || datasetCount;
} catch {
  /* ignore */
}

const nat = read(nationalHtmlPath);
const breda = read(path.join(cityDir, 'breda', 'index.html'));
const cssHrefs = [...nat.matchAll(/href="(\/[^"]+\.css)"/g)].map((m) => m[1]);
let cssMedia = 0;
for (const h of cssHrefs) {
  const p = path.join(dist, h.replace(/^\//, ''));
  if (exists(p)) cssMedia += (read(p).match(/@media/g) || []).length;
}
const hasResponsive =
  ((nat.match(/@media/g) || []).length > 0 || cssMedia > 0) &&
  ((breda.match(/@media/g) || []).length > 0 || cssMedia > 0);

// sitemap vs pages
const missingFromSitemap = citySlugs.filter((s) => !offerPaths.includes(`/website-laten-maken/${s}/`));
const extraInSitemap = cityInSitemap
  .map((p) => p.replace(/^\/website-laten-maken\//, '').replace(/\/$/, ''))
  .filter((s) => s && !citySlugs.includes(s));

// Redirect folders should be noindex and absent from sitemap
let redirectNoindexOk = 0;
for (const s of redirectSlugs) {
  const html = read(path.join(cityDir, s, 'index.html'));
  const robotsMeta = getRobotsMeta(html);
  if (robotsMeta && /noindex/i.test(robotsMeta)) redirectNoindexOk++;
  else warnings.push(`redirect ${s} missing noindex`);
}

const report = {
  nationalPages: 1,
  contentCityPages: citySlugs.length,
  redirectFolders: redirectSlugs.length,
  totalOfferContentPages: 1 + citySlugs.length,
  datasetMunicipalities: datasetCount,
  duplicateSlugs: dupSlugs,
  sitemapOfferUrls: offerSitemap.length,
  nationalInSitemap,
  cityUrlsInSitemap: cityInSitemap.length,
  missingFromSitemap: missingFromSitemap.slice(0, 20),
  missingFromSitemapCount: missingFromSitemap.length,
  extraInSitemap: extraInSitemap.slice(0, 20),
  redirectNoindexOk,
  sitemapFiles,
  robotsPath: robotsPath || null,
  robotsBlocksOffer,
  robotsEmpty: !robots,
  placeholderCount,
  noindexOnContentPages: noindexCount,
  national: nationalReport,
  cityOk,
  cityFail,
  cityFailSamples,
  uniqueTitles: titles.size,
  uniqueDescriptions: descriptions.size,
  linkReports,
  hasResponsiveCss: hasResponsive,
  sample: {
    nationalTitle: nationalReport?.title,
    nationalH1: nationalReport?.h1,
    nationalCanonical: nationalReport?.canonical,
    bredaTitle: extract(breda, /<title>([^<]*)<\/title>/i),
    bredaH1: extract(breda, /<h1[^>]*>([\s\S]*?)<\/h1>/i)
      ?.replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim(),
    bredaCanonical:
      extract(breda, /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i) ||
      extract(breda, /<link[^>]+href=["']([^"']+)["'][^>]*rel=["']canonical["']/i),
  },
  errors,
  warnings,
};

console.log(JSON.stringify(report, null, 2));

if (errors.length || cityFail > 0 || !nationalInSitemap || missingFromSitemap.length || robotsBlocksOffer) {
  process.exitCode = 1;
}
