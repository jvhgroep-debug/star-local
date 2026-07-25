/**
 * Final dataset + build verification for Website laten maken (€199).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { composePageFromMunicipality } from '../src/content-engine/index.ts';
import {
  getCityOfferPath,
  LOCATION_ENGINE,
} from '../src/data/location-engine/config.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mun = JSON.parse(
  fs.readFileSync(path.join(root, 'src/data/netherlands/municipalities.json'), 'utf8'),
);

const VALID_PROVINCES = new Set([
  'Drenthe',
  'Flevoland',
  'Fryslân',
  'Gelderland',
  'Groningen',
  'Limburg',
  'Noord-Brabant',
  'Noord-Holland',
  'Overijssel',
  'Utrecht',
  'Zeeland',
  'Zuid-Holland',
]);

const REMOVED = [
  'beek-l',
  'hengelo-o',
  'laren-nh',
  'middelburg-z',
  'rijswijk-zh',
  'stein-l',
  'gerwen-en-nederwetten',
];

const slugs = mun.map((m) => m.slug);
const slugSet = new Set(slugs);
const duplicateSlugs = slugs.filter((s, i) => slugs.indexOf(s) !== i);

const officialCount = mun.filter((m) => m.slug !== 'nuenen').length;
const extraPlaces = mun.filter((m) => m.slug === 'nuenen').length;
const badProvinces = mun.filter((m) => !VALID_PROVINCES.has(m.provincie));
const stillRemoved = REMOVED.filter((s) => slugSet.has(s));

// Internal links: every neighbor slug must exist
const brokenNeighbors = [];
for (const m of mun) {
  for (const n of m.omliggendeGemeenten || []) {
    if (!slugSet.has(n.slug)) {
      brokenNeighbors.push({ from: m.slug, to: n.slug });
    }
  }
}

// Sample compose uniqueness for a few cities
const samples = ['amsterdam', 'nuenen', 'beek', 'zwolle'].map((slug) => {
  const row = mun.find((m) => m.slug === slug);
  const page = composePageFromMunicipality(row, {
    language: 'nl',
    canonicalPath: getCityOfferPath(slug),
    enabledCitySlugs: [],
    allPagesGenerated: true,
    resolveCityHref: getCityOfferPath,
    resolveCityLabel: (s) => mun.find((x) => x.slug === s)?.naam ?? s,
  });
  return {
    slug,
    title: page.seo.title,
    canonical: page.context.canonicalPath,
    neighborHrefs: page.neighborLinks.map((l) => l.href),
  };
});

const report = {
  generateAllCities: LOCATION_ENGINE.generateAllCities,
  officialMunicipalities: officialCount,
  extraSeoPlaces: extraPlaces,
  totalPagesGenerated: mun.length,
  duplicateSlugs,
  removedAliasesGone: stillRemoved.length === 0,
  stillPresentRemoved: stillRemoved,
  allProvincesValid: badProvinces.length === 0,
  badProvinces: badProvinces.map((m) => ({ slug: m.slug, provincie: m.provincie })),
  brokenNeighborLinks: brokenNeighbors.slice(0, 20),
  brokenNeighborCount: brokenNeighbors.length,
  nuenenLinksToOfficial: (mun.find((m) => m.slug === 'nuenen')?.omliggendeGemeenten || []).some(
    (n) => n.slug === 'nuenen-gerwen-en-nederwetten',
  ),
  samples,
};

console.log(JSON.stringify(report, null, 2));

if (
  mun.length !== 343 ||
  duplicateSlugs.length ||
  stillRemoved.length ||
  badProvinces.length ||
  brokenNeighbors.length ||
  !LOCATION_ENGINE.generateAllCities
) {
  process.exitCode = 1;
}
