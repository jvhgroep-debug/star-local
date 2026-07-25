import fs from 'node:fs';

const mun = JSON.parse(fs.readFileSync('src/data/netherlands/municipalities.json', 'utf8'));
const dirs = fs
  .readdirSync('dist/website-laten-maken')
  .filter((n) => fs.statSync(`dist/website-laten-maken/${n}`).isDirectory());

const contentDirs = dirs.filter((d) => {
  const html = fs.readFileSync(`dist/website-laten-maken/${d}/index.html`, 'utf8');
  return html.includes('FAQPage') || html.includes('Website laten maken in');
});

const sm = fs.readFileSync('dist/sitemap-0.xml', 'utf8');
const urls = [...sm.matchAll(/<loc>https:\/\/www\.starlocal\.nl\/website-laten-maken\/([a-z0-9-]+)\/<\/loc>/g)].map(
  (m) => m[1],
);
const uniq = new Set(urls);
const missing = mun.map((m) => m.slug).filter((s) => !uniq.has(s));
const extra = [...uniq].filter((s) => !mun.some((m) => m.slug === s));

const samples = ['amsterdam', 'nuenen', 'beek', 'rijswijk'].map((s) => {
  const html = fs.readFileSync(`dist/website-laten-maken/${s}/index.html`, 'utf8');
  const c = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const h1 = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1];
  const dead = [...html.matchAll(/href="(\/website-laten-maken\/[a-z0-9-]+\/)"/g)]
    .map((x) => x[1])
    .filter((href) => {
      const slug = href.split('/').filter(Boolean)[1];
      return !fs.existsSync(`dist/website-laten-maken/${slug}/index.html`);
    });
  return { s, c, h1, deadInternal: [...new Set(dead)] };
});

console.log(
  JSON.stringify(
    {
      datasetTotal: mun.length,
      contentCityDirs: contentDirs.length,
      allDirsIncludingRedirects: dirs.length,
      sitemapCityUrls: urls.length,
      sitemapUnique: uniq.size,
      noDuplicateSitemap: urls.length === uniq.size,
      missingFromSitemap: missing,
      extraInSitemap: extra,
      samples,
      gerwenRedirectExists: fs.existsSync('dist/website-laten-maken/gerwen-en-nederwetten/index.html'),
      beekLRedirectExists: fs.existsSync('dist/website-laten-maken/beek-l/index.html'),
    },
    null,
    2,
  ),
);

if (mun.length !== 343 || contentDirs.length !== 343 || urls.length !== 343 || missing.length || extra.length) {
  process.exitCode = 1;
}
