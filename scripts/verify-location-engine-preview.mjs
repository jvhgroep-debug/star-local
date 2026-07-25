import fs from 'node:fs';

for (const c of ['amsterdam', 'rotterdam', 'breda']) {
  const html = fs.readFileSync(`dist/website-laten-maken/${c}/index.html`, 'utf8');
  const title = (html.match(/<title>([^<]+)<\/title>/) || [])[1];
  const h1 = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [])[1];
  const canon = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1];
  console.log({
    c,
    title,
    h1,
    canon,
    hasFaq: html.includes('FAQPage'),
    hasCity: html.includes('"@type":"City"'),
    hasWhy: html.includes('Waarom'),
    hasLocalSeo: html.includes('lokale SEO') || html.includes('Lokale SEO') || html.includes('Vindbaar'),
    hasServices: html.includes('service-grid') || html.includes('Diensten'),
  });
}

console.log('utrecht exists', fs.existsSync('dist/website-laten-maken/utrecht/index.html'));
console.log(
  'folders',
  fs.readdirSync('dist/website-laten-maken').filter((n) =>
    fs.statSync(`dist/website-laten-maken/${n}`).isDirectory(),
  ),
);
