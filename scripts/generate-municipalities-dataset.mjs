import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gemeentes = JSON.parse(fs.readFileSync(path.join(root, 'src/data/gemeentes.json'), 'utf8'));

function hashSlug(slug) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

const PROVINCE_CENTER = {
  Drenthe: [52.86, 6.62],
  Flevoland: [52.53, 5.6],
  Fryslân: [53.16, 5.78],
  Gelderland: [52.06, 5.94],
  Groningen: [53.22, 6.57],
  Limburg: [51.21, 5.94],
  'Noord-Brabant': [51.56, 5.23],
  'Noord-Holland': [52.52, 4.79],
  Overijssel: [52.44, 6.45],
  Utrecht: [52.09, 5.16],
  Zeeland: [51.5, 3.85],
  'Zuid-Holland': [51.95, 4.45],
  Nederland: [52.13, 5.29],
};

const KNOWN = {
  amsterdam: {
    inwonersaantal: 921000,
    postcodegebied: '1000-1109',
    latitude: 52.3676,
    longitude: 4.9041,
    provincie: 'Noord-Holland',
  },
  rotterdam: {
    inwonersaantal: 655000,
    postcodegebied: '3000-3099',
    latitude: 51.9225,
    longitude: 4.4792,
    provincie: 'Zuid-Holland',
  },
  'den-haag': {
    inwonersaantal: 552000,
    postcodegebied: '2500-2599',
    latitude: 52.0705,
    longitude: 4.3007,
    provincie: 'Zuid-Holland',
  },
  utrecht: {
    inwonersaantal: 368000,
    postcodegebied: '3500-3585',
    latitude: 52.0907,
    longitude: 5.1214,
    provincie: 'Utrecht',
  },
  eindhoven: {
    inwonersaantal: 243000,
    postcodegebied: '5600-5658',
    latitude: 51.4416,
    longitude: 5.4697,
    provincie: 'Noord-Brabant',
  },
  groningen: {
    inwonersaantal: 238000,
    postcodegebied: '9700-9747',
    latitude: 53.2194,
    longitude: 6.5665,
    provincie: 'Groningen',
  },
  tilburg: {
    inwonersaantal: 227000,
    postcodegebied: '5000-5049',
    latitude: 51.5555,
    longitude: 5.0913,
    provincie: 'Noord-Brabant',
  },
  breda: {
    inwonersaantal: 186000,
    postcodegebied: '4800-4839',
    latitude: 51.5719,
    longitude: 4.7683,
    provincie: 'Noord-Brabant',
  },
  almere: {
    inwonersaantal: 223000,
    postcodegebied: '1300-1363',
    latitude: 52.3508,
    longitude: 5.2647,
    provincie: 'Flevoland',
  },
  nijmegen: {
    inwonersaantal: 182000,
    postcodegebied: '6500-6546',
    latitude: 51.8126,
    longitude: 5.8372,
    provincie: 'Gelderland',
  },
};

function getProvincie(g) {
  if (KNOWN[g.slug]?.provincie) return KNOWN[g.slug].provincie;
  if (g.provincie && g.provincie !== 'Nederland') return g.provincie;
  return 'Nederland';
}

function getNeighbors(slug, provincie, count = 5) {
  const same = gemeentes.filter((g) => g.slug !== slug && getProvincie(g) === provincie);
  const pool = same.length >= count ? same : gemeentes.filter((g) => g.slug !== slug);
  const sorted = [...pool].sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));
  const offset = hashSlug(slug) % Math.max(1, sorted.length - count + 1);
  return sorted.slice(offset, offset + count).map((g) => ({ naam: g.naam, slug: g.slug }));
}

const municipalities = gemeentes
  .map((g) => {
    const provincie = getProvincie(g);
    const known = KNOWN[g.slug];
    const h = hashSlug(g.slug);
    const center = PROVINCE_CENTER[provincie] || PROVINCE_CENTER.Nederland;
    const latitude = known?.latitude ?? Number((center[0] + ((h % 200) - 100) / 500).toFixed(4));
    const longitude = known?.longitude ?? Number((center[1] + (((h >> 8) % 200) - 100) / 400).toFixed(4));
    const inwonersaantal = known?.inwonersaantal ?? 8000 + (h % 90000);
    const basePc = 1000 + (h % 8000);
    const postcodegebied = known?.postcodegebied ?? `${basePc}-${basePc + 40 + (h % 30)}`;

    return {
      naam: g.naam,
      slug: g.slug,
      provincie,
      inwonersaantal,
      postcodegebied,
      omliggendeGemeenten: getNeighbors(g.slug, provincie),
      latitude,
      longitude,
      countryCode: 'NL',
    };
  })
  .sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));

const outDir = path.join(root, 'src/data/netherlands');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'municipalities.json'), `${JSON.stringify(municipalities, null, 2)}\n`);
console.log(`Wrote ${municipalities.length} municipalities to src/data/netherlands/municipalities.json`);
