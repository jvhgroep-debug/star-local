import gemeentes from '../src/data/gemeentes.json' with { type: 'json' };

const base = 'https://starlocal.nl/gemeentes/';
const batchSize = 25;
let failed = 0;
let ok = 0;
const failures = [];

for (let i = 0; i < gemeentes.length; i += batchSize) {
  const batch = gemeentes.slice(i, i + batchSize);
  const results = await Promise.all(
    batch.map(async (g) => {
      const url = `${base}${g.slug}/`;
      try {
        const res = await fetch(url, { redirect: 'follow' });
        if (res.status !== 200) return { slug: g.slug, status: res.status, url };
        const text = await res.text();
        if (!text.includes('FAQPage') || !text.includes('GemeenteMasterPage') && !text.includes('Website laten maken in')) {
          if (!text.includes('Website laten maken in')) return { slug: g.slug, status: 'bad-content', url };
        }
        return null;
      } catch (e) {
        return { slug: g.slug, status: 'error', url, err: String(e) };
      }
    }),
  );
  for (const r of results) {
    if (r) {
      failed += 1;
      failures.push(r);
    } else {
      ok += 1;
    }
  }
  process.stdout.write(`\rVerified ${ok + failed}/${gemeentes.length}...`);
}

console.log(`\n\nLive verification: ${ok}/${gemeentes.length} OK, ${failed} failed`);
if (failures.length) {
  console.log('Failures:', failures.slice(0, 10));
  process.exit(1);
}
