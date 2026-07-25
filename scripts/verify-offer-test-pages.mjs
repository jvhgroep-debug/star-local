import fs from 'node:fs';

const pages = [
  'dist/website-laten-maken/index.html',
  'dist/website-laten-maken/amsterdam/index.html',
  'dist/website-laten-maken/rotterdam/index.html',
  'dist/website-laten-maken/breda/index.html',
];

for (const file of pages) {
  if (!fs.existsSync(file)) {
    console.error('MISSING', file);
    process.exit(1);
  }
  const html = fs.readFileSync(file, 'utf8');
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
  const h1s = [...html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/g)].map((m) => m[1]);
  const canon = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  const deadPreview = [...html.matchAll(/href="(\/website-laten-maken\/[a-z0-9-]+\/)"/g)]
    .map((m) => m[1])
    .filter((href) => {
      const slug = href.split('/').filter(Boolean)[1];
      return slug && !['amsterdam', 'rotterdam', 'breda'].includes(slug);
    });

  console.log({
    file,
    title,
    h1Count: h1s.length,
    h1: h1s[0],
    canon,
    has199: html.includes('€199'),
    hasOffer: html.includes('"@type":"Offer"') || html.includes('"@type": "Offer"'),
    hasFaq: html.includes('FAQPage'),
    deadPreviewLinks: deadPreview,
  });
}

const cityDirs = fs
  .readdirSync('dist/website-laten-maken')
  .filter((n) => fs.statSync(`dist/website-laten-maken/${n}`).isDirectory());
console.log('city folders:', cityDirs);
console.log(
  'generateAllCities still false:',
  fs.readFileSync('src/data/location-engine/config.ts', 'utf8').includes('generateAllCities: false'),
);

// Existing routes untouched samples
for (const p of [
  'dist/gemeentes/amsterdam/index.html',
  'dist/amsterdam/website-laten-maken/index.html',
  'dist/diensten/website-laten-maken/index.html',
]) {
  console.log(p, fs.existsSync(p) ? 'OK' : 'MISSING');
}
