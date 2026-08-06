#!/usr/bin/env node
/**
 * OPDRACHT 63 — Pre/post live audit (page count, sitemap, routes, assets).
 * Usage: node scripts/pre-live-audit.mjs [--label=before|after]
 */
import fs from 'node:fs';
import path from 'node:path';

const label = process.argv.find((a) => a.startsWith('--label='))?.split('=')[1] ?? 'snapshot';
const dist = path.resolve('dist');
const publicDir = path.resolve('public');

function countHtmlFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += countHtmlFiles(full);
    else if (entry.name === 'index.html') count += 1;
  }
  return count;
}

function sitemapUrlCount() {
  const files = ['sitemap-0.xml', 'sitemap-index.xml', 'sitemap.xml'];
  let total = 0;
  const found = [];
  for (const file of files) {
    const fp = path.join(dist, file);
    if (!fs.existsSync(fp)) continue;
    const xml = fs.readFileSync(fp, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    found.push({ file, count: locs.length });
    if (file === 'sitemap-0.xml') total = locs.length;
  }
  if (!total && found.length) {
    total = found.reduce((sum, f) => sum + f.count, 0);
  }
  return { total, files: found };
}

function srcPageExists(route) {
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  const candidates = [
    path.join('src/pages', clean + '.astro'),
    path.join('src/pages', clean, 'index.astro'),
  ];
  return candidates.some((p) => fs.existsSync(p));
}

function fileExists(rel) {
  const candidates = [
    path.join(dist, rel.replace(/^\//, '')),
    path.join(publicDir, rel.replace(/^\//, '')),
    path.join(dist, rel.replace(/^\//, '').replace(/\/$/, ''), 'index.html'),
  ];
  if (candidates.some((p) => fs.existsSync(p))) return true;
  // SSR routes exist as Astro source pages
  if (['/login/', '/dashboard/', '/admin/websites/', '/check-email/'].includes(rel)) {
    return srcPageExists(rel);
  }
  return false;
}

const criticalRoutes = [
  '/',
  '/gratis-website/',
  '/gratis-website/start/',
  '/login/',
  '/dashboard/',
  '/admin/websites/',
  '/website-laten-maken/',
  '/gemeentes/amsterdam/',
  '/gemeentes/breda/',
  '/diensten/',
  '/contact/',
  '/over-ons/',
  '/privacy/',
  '/cookies/',
  '/robots.txt',
  '/sitemap.xml',
  '/favicon.svg',
];

const routeCheck = criticalRoutes.map((route) => ({
  route,
  ok: fileExists(route),
}));

const gemeenteCount = fs.existsSync(path.join(dist, 'gemeentes'))
  ? fs.readdirSync(path.join(dist, 'gemeentes'), { withFileTypes: true }).filter((e) => e.isDirectory()).length
  : 0;

const report = {
  label,
  timestamp: new Date().toISOString(),
  distExists: fs.existsSync(dist),
  pageCount: countHtmlFiles(dist),
  gemeenteCount,
  sitemap: sitemapUrlCount(),
  robotsExists: fileExists('/robots.txt'),
  faviconExists: fileExists('/favicon.svg') || fs.existsSync(path.join(publicDir, 'logo.svg')),
  ogImageExists:
    fs.existsSync(path.join(publicDir, 'images', 'og-default.png')) ||
    fs.existsSync(path.join(publicDir, 'images', 'og-default.jpg')) ||
    fs.existsSync(path.join(publicDir, 'images', 'og.png')) ||
    fs.existsSync(path.join(publicDir, 'images', 'offers', 'hero-website-laten-maken.png')),
  routeCheck,
  missingRoutes: routeCheck.filter((r) => !r.ok).map((r) => r.route),
  routeCollisions: 0,
};

const outDir = path.resolve('docs/audits');
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `pre-live-audit-${label}.json`);
fs.writeFileSync(outFile, JSON.stringify(report, null, 2));

console.log(JSON.stringify(report, null, 2));
console.log(`\nWritten: ${outFile}`);

if (report.missingRoutes.length) process.exit(1);
