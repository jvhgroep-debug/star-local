import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const indexFile = path.join(dist, 'sitemap-index.xml');
const aliasFile = path.join(dist, 'sitemap.xml');

if (!fs.existsSync(indexFile)) {
  console.warn('[alias-sitemap] dist/sitemap-index.xml missing — skip');
  process.exit(0);
}

fs.copyFileSync(indexFile, aliasFile);
console.log('[alias-sitemap] wrote dist/sitemap.xml');
