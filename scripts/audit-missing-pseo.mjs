import https from 'node:https';

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'user-agent': 'StarLocal-Audit/1.0' } }, (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () =>
          resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }),
        );
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
  if (p.startsWith('/en/')) return 'EN';
  if (p.startsWith('/gemeentes/')) return 'gemeentes';
  if (p.startsWith('/website-laten-maken')) return 'wlm199';
  if (p.startsWith('/diensten/')) return 'diensten';
  if (p.startsWith('/blog')) return 'blog';
  if (p.startsWith('/portfolio')) return 'portfolio';
  if (p.startsWith('/projecten')) return 'projecten';
  const parts = p.split('/').filter(Boolean);
  if (parts.length === 2) return 'local-service /{city}/{service}';
  if (parts.length === 3) return 'local-industry /{city}/{service}/{industry}';
  if (parts.length === 1) return 'top-level';
  return 'other';
}

const oldXml = await fetch('https://5b1aa2c8.star-local.pages.dev/sitemap-0.xml');
const liveXml = await fetch('https://www.starlocal.nl/sitemap-0.xml');
const old = new Set(locs(oldXml.body).map(pathOf));
const live = new Set(locs(liveXml.body).map(pathOf));
const missing = [...old].filter((p) => !live.has(p)).sort();

const by = {};
const samples = {};
const svc = {};
const city = {};
const ind = {};

for (const p of missing) {
  const c = cat(p);
  by[c] = (by[c] || 0) + 1;
  if (!samples[c]) samples[c] = [];
  if (samples[c].length < 10) samples[c].push(p);

  const parts = p.split('/').filter(Boolean);
  if (parts.length === 2) {
    svc[parts[1]] = (svc[parts[1]] || 0) + 1;
    city[parts[0]] = (city[parts[0]] || 0) + 1;
  }
  if (parts.length === 3) {
    ind[parts[2]] = (ind[parts[2]] || 0) + 1;
    svc[parts[1]] = (svc[parts[1]] || 0) + 1;
    city[parts[0]] = (city[parts[0]] || 0) + 1;
  }
}

const top = (o, n = 20) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n);

// probe example URLs on old deploy vs live
const examples = [
  '/nijmegen/conversie-optimalisatie/',
  '/haaksbergen/google-bedrijfsprofiel/',
  '/koggenland/ai-seo/',
  '/amsterdam/website-laten-maken/',
  '/breda/website-laten-maken/autobedrijven/',
];

const probes = [];
for (const p of examples) {
  const oldP = await fetch(`https://5b1aa2c8.star-local.pages.dev${p}`);
  const liveP = await fetch(`https://www.starlocal.nl${p}`);
  probes.push({
    path: p,
    oldStatus: oldP.status,
    liveStatus: liveP.status,
    oldHasH1: /<h1/i.test(oldP.body),
    liveTitle: (liveP.body.match(/<title>([^<]+)/i) || [])[1] || null,
  });
}

console.log(
  JSON.stringify(
    {
      oldTotal: old.size,
      liveTotal: live.size,
      missingTotal: missing.length,
      byCategory: by,
      samples,
      uniqueServices: Object.keys(svc).length,
      uniqueCities: Object.keys(city).length,
      uniqueIndustries: Object.keys(ind).length,
      topServices: top(svc),
      topIndustries: top(ind),
      topCities: top(city, 15),
      probes,
    },
    null,
    2,
  ),
);
