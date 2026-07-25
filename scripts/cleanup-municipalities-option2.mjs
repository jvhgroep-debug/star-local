/**
 * Option 2 cleanup for municipalities.json:
 * - Keep Nuenen (plaats) + link to official gemeente
 * - Remove Gerwen en Nederwetten
 * - Merge 6 CBS-suffix aliases into short SEO slugs
 * - Fix provincie "Nederland" placeholders
 * Does NOT touch other Star Local datasets/pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const file = path.join(root, 'src/data/netherlands/municipalities.json');

/** Short SEO slug → remove CBS-suffix duplicate */
const MERGE_INTO = {
  'beek-l': 'beek',
  'hengelo-o': 'hengelo',
  'laren-nh': 'laren',
  'middelburg-z': 'middelburg',
  'rijswijk-zh': 'rijswijk',
  'stein-l': 'stein',
};

const REMOVE_SLUGS = new Set(['gerwen-en-nederwetten', ...Object.keys(MERGE_INTO)]);

const PROVINCE_FIX = {
  alkmaar: 'Noord-Holland',
  amersfoort: 'Utrecht',
  apeldoorn: 'Gelderland',
  arnhem: 'Gelderland',
  beek: 'Limburg',
  'bergen-op-zoom': 'Noord-Brabant',
  delft: 'Zuid-Holland',
  deventer: 'Overijssel',
  dongen: 'Noord-Brabant',
  dordrecht: 'Zuid-Holland',
  enschede: 'Overijssel',
  'etten-leur': 'Noord-Brabant',
  haarlem: 'Noord-Holland',
  heerlen: 'Limburg',
  helmond: 'Noord-Brabant',
  hengelo: 'Overijssel',
  hilversum: 'Noord-Holland',
  hoorn: 'Noord-Holland',
  laren: 'Noord-Holland',
  leeuwarden: 'Fryslân',
  leiden: 'Zuid-Holland',
  maastricht: 'Limburg',
  middelburg: 'Zeeland',
  moerdijk: 'Noord-Brabant',
  nieuwegein: 'Utrecht',
  nuenen: 'Noord-Brabant',
  oosterhout: 'Noord-Brabant',
  oss: 'Noord-Brabant',
  purmerend: 'Noord-Holland',
  rijswijk: 'Zuid-Holland',
  roosendaal: 'Noord-Brabant',
  stein: 'Limburg',
  veenendaal: 'Utrecht',
  venlo: 'Limburg',
  zoetermeer: 'Zuid-Holland',
  zwolle: 'Overijssel',
};

function remapSlug(slug) {
  return MERGE_INTO[slug] ?? slug;
}

const list = JSON.parse(fs.readFileSync(file, 'utf8'));
const bySlug = new Map(list.map((m) => [m.slug, m]));

// Prefer coords/population from CBS-suffixed record when merging into short slug
for (const [fromSlug, toSlug] of Object.entries(MERGE_INTO)) {
  const from = bySlug.get(fromSlug);
  const to = bySlug.get(toSlug);
  if (!from || !to) {
    console.warn('Missing merge pair', fromSlug, toSlug);
    continue;
  }
  // Keep short SEO naam/slug; take provincie from official side / fix map
  to.provincie = PROVINCE_FIX[toSlug] ?? from.provincie;
  // Prefer official-side population if present and larger heuristic isn't needed — use official record values
  to.inwonersaantal = from.inwonersaantal;
  to.postcodegebied = from.postcodegebied;
  to.latitude = from.latitude;
  to.longitude = from.longitude;
}

let next = list.filter((m) => !REMOVE_SLUGS.has(m.slug));

for (const m of next) {
  if (PROVINCE_FIX[m.slug]) {
    m.provincie = PROVINCE_FIX[m.slug];
  }

  // Remap neighbors; drop removed; dedupe
  const seen = new Set();
  m.omliggendeGemeenten = (m.omliggendeGemeenten || [])
    .map((n) => {
      const slug = remapSlug(n.slug);
      if (REMOVE_SLUGS.has(n.slug) && !MERGE_INTO[n.slug]) return null; // gerwen gone
      if (REMOVE_SLUGS.has(slug) && !bySlug.has(slug) && !MERGE_INTO[n.slug]) return null;
      const target = bySlug.get(slug) || bySlug.get(MERGE_INTO[n.slug]);
      const naam = target?.naam ?? (MERGE_INTO[n.slug] ? bySlug.get(MERGE_INTO[n.slug])?.naam : n.naam);
      // After filter, short records exist
      const kept = next.find((x) => x.slug === slug);
      return {
        naam: kept?.naam ?? naam ?? n.naam,
        slug,
      };
    })
    .filter(Boolean)
    .filter((n) => {
      if (n.slug === m.slug) return false;
      if (seen.has(n.slug)) return false;
      // Drop gerwen entirely
      if (n.slug === 'gerwen-en-nederwetten') return false;
      seen.add(n.slug);
      return true;
    });
}

// Nuenen (plaats): ensure link to official municipality
const nuenen = next.find((m) => m.slug === 'nuenen');
const official = next.find((m) => m.slug === 'nuenen-gerwen-en-nederwetten');
if (nuenen && official) {
  nuenen.provincie = 'Noord-Brabant';
  const hasOfficial = nuenen.omliggendeGemeenten.some((n) => n.slug === official.slug);
  if (!hasOfficial) {
    nuenen.omliggendeGemeenten = [
      { naam: official.naam, slug: official.slug },
      ...nuenen.omliggendeGemeenten,
    ].slice(0, 5);
  }
  // Official gemeente should also mention Nuenen as nearby place link target
  const hasNuenen = official.omliggendeGemeenten.some((n) => n.slug === 'nuenen');
  if (!hasNuenen) {
    official.omliggendeGemeenten = [
      { naam: 'Nuenen', slug: 'nuenen' },
      ...official.omliggendeGemeenten,
    ].slice(0, 5);
  }
}

// Drop any neighbor pointing to removed slugs still lingering
next = next.map((m) => ({
  ...m,
  omliggendeGemeenten: m.omliggendeGemeenten.filter(
    (n) => n.slug !== 'gerwen-en-nederwetten' && !Object.keys(MERGE_INTO).includes(n.slug),
  ),
}));

next.sort((a, b) => a.naam.localeCompare(b.naam, 'nl'));

fs.writeFileSync(file, `${JSON.stringify(next, null, 2)}\n`);

const leftoverNederland = next.filter((m) => m.provincie === 'Nederland').map((m) => m.slug);
const stillSuffix = next.filter((m) =>
  ['beek-l', 'hengelo-o', 'laren-nh', 'middelburg-z', 'rijswijk-zh', 'stein-l', 'gerwen-en-nederwetten'].includes(
    m.slug,
  ),
);

console.log(
  JSON.stringify(
    {
      before: list.length,
      after: next.length,
      expected: 343,
      hasNuenen: next.some((m) => m.slug === 'nuenen'),
      hasOfficialNuenen: next.some((m) => m.slug === 'nuenen-gerwen-en-nederwetten'),
      hasGerwen: next.some((m) => m.slug === 'gerwen-en-nederwetten'),
      leftoverNederland,
      stillSuffix: stillSuffix.map((m) => m.slug),
      sampleMerged: ['beek', 'hengelo', 'rijswijk'].map((s) => {
        const m = next.find((x) => x.slug === s);
        return m ? { slug: m.slug, naam: m.naam, provincie: m.provincie } : null;
      }),
    },
    null,
    2,
  ),
);
