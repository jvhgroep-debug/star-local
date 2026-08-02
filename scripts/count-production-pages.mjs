import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'cache-control': 'no-cache', 'user-agent': 'StarLocal-Count/1.0' } }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
      })
      .on('error', reject);
  });
}

function locs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

function pathOf(u) {
  try {
    const p = new URL(u).pathname.replace(/\/$/, '');
    return p || '/';
  } catch {
    return u;
  }
}

function cat(p) {
  if (p === '/') return 'Homepage';
  if (p === '/en' || p.startsWith('/en/')) return "Engelse pagina's";
  if (p === '/website-laten-maken') return 'Website laten maken (landelijk)';
  if (/^\/website-laten-maken\/[^/]+$/.test(p)) return 'Website laten maken (gemeenten)';
  if (p.startsWith('/gemeentes/')) return "Gemeentepagina's (/gemeentes/)";
  if (p === '/diensten/landelijke-seo') return 'Landelijke SEO';
  if (p === '/diensten/lokale-seo') return 'Lokale SEO';
  if (p.startsWith('/diensten')) return 'Diensten (overige)';
  if (p.startsWith('/blog')) return 'Blog';
  if (p.startsWith('/projecten')) return 'Projecten';
  if (p.startsWith('/portfolio')) return 'Portfolio';
  if (/^\/[^/]+\/[^/]+(\/[^/]+)?$/.test(p) && !p.startsWith('/en')) {
    return "Lokale diensten / industriepagina's";
  }
  return "Overige NL-pagina's";
}

function summarize(urls) {
  const paths = urls.map(pathOf);
  const cats = {};
  for (const p of paths) {
    const c = cat(p);
    cats[c] = (cats[c] || 0) + 1;
  }
  return { total: paths.length, cats };
}

const live = await fetch('https://www.starlocal.nl/sitemap-0.xml');
const index = await fetch('https://www.starlocal.nl/sitemap-index.xml');
const alias = await fetch('https://www.starlocal.nl/sitemap.xml');
const prev = await fetch('https://795226b1.star-local.pages.dev/sitemap-0.xml');
const older = await fetch('https://5b1aa2c8.star-local.pages.dev/sitemap-0.xml');

const liveUrls = locs(live.body);
const prevUrls = locs(prev.body);
const olderUrls = locs(older.body);
const liveSet = new Set(liveUrls.map(pathOf));
const prevSet = new Set(prevUrls.map(pathOf));
const olderSet = new Set(olderUrls.map(pathOf));

const missingVsPrev = [...prevSet].filter((p) => !liveSet.has(p)).sort();
const addedVsPrev = [...liveSet].filter((p) => !prevSet.has(p)).sort();
const missingVsOlder = [...olderSet].filter((p) => !liveSet.has(p));
const missingOlderByCat = {};
for (const p of missingVsOlder) {
  const c = cat(p);
  missingOlderByCat[c] = (missingOlderByCat[c] || 0) + 1;
}

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name === 'index.html') out.push(full);
  }
  return out;
}

const htmlFiles = fs.existsSync('dist') ? walk('dist') : [];
const htmlPaths = htmlFiles.map((f) => {
  const rel = path.relative('dist', path.dirname(f)).replace(/\\/g, '/');
  if (!rel || rel === '.') return '/';
  return `/${rel}`;
});
const htmlNotInSitemap = htmlPaths.filter((p) => {
  const n = p.replace(/\/$/, '') || '/';
  return !liveSet.has(n);
});

console.log(
  JSON.stringify(
    {
      sitemapAliasStatus: alias.status,
      sitemapIndexStatus: index.status,
      sitemapIndexChildren: locs(index.body).length,
      live: summarize(liveUrls),
      previousImmediate_f839fa0: summarize(prevUrls),
      olderWorkingImages_5b1aa2c8: { total: olderUrls.length },
      addedVsImmediatePrev: addedVsPrev,
      missingVsImmediatePrev: missingVsPrev,
      missingVsOlderByCategory: missingOlderByCat,
      missingVsOlderTotal: missingVsOlder.length,
      localDistIndexHtml: htmlFiles.length,
      localHtmlNotInSitemapCount: htmlNotInSitemap.length,
      localHtmlNotInSitemapSample: htmlNotInSitemap.slice(0, 40),
      overigeLive: liveUrls.map(pathOf).filter((p) => cat(p) === "Overige NL-pagina's").sort(),
    },
    null,
    2,
  ),
);
