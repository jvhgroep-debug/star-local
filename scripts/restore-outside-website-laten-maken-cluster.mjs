/**
 * Restore Star Local to HEAD except the Website laten maken (€199) cluster.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
process.chdir(root);

function sh(cmd, opts = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts });
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

// Snapshot keep-paths before any clean (for verification)
const mustKeep = [
  'src/pages/website-laten-maken.astro',
  'src/pages/website-laten-maken/[city].astro',
  'src/views/WebsiteLatenMakenOfferPage.astro',
  'src/views/WebsiteLatenMakenCityPage.astro',
  'src/content-engine',
  'src/data/location-engine',
  'src/data/netherlands',
  'src/data/offers',
  'src/components/ImagePlaceholder.astro',
  'public/images/offers',
  'scripts/generate-municipalities-dataset.mjs',
  'scripts/demo-content-engine.mjs',
  'scripts/demo-content-engine-run.ts',
  'scripts/verify-offer-test-pages.mjs',
  'scripts/verify-location-engine-preview.mjs',
  'scripts/restore-outside-website-laten-maken-cluster.mjs',
];

console.log('Before restore, keep paths present:');
for (const p of mustKeep) console.log(' ', p, exists(p));

// 1) Restore ALL tracked files to HEAD
console.log('\nRestoring tracked files to HEAD...');
const beforePorcelain = sh('git status --porcelain');
sh('git restore .');
sh('git clean -fdX'); // only ignored build artifacts if any — skip for safety, don't run -fdX

// 2) Remove untracked files EXCEPT keep list via git clean exclusions
const excludes = [
  'src/content-engine',
  'src/data/location-engine',
  'src/data/netherlands',
  'src/data/offers',
  'src/pages/website-laten-maken.astro',
  'src/pages/website-laten-maken',
  'src/views/WebsiteLatenMakenCityPage.astro',
  'src/views/WebsiteLatenMakenOfferPage.astro',
  'src/components/ImagePlaceholder.astro',
  'public/images/offers',
  'scripts/generate-municipalities-dataset.mjs',
  'scripts/demo-content-engine.mjs',
  'scripts/demo-content-engine-run.ts',
  'scripts/verify-offer-test-pages.mjs',
  'scripts/verify-location-engine-preview.mjs',
  'scripts/restore-outside-website-laten-maken-cluster.mjs',
];

const excludeArgs = excludes.map((e) => `-e "${e}"`).join(' ');
console.log('\nCleaning untracked files outside cluster...');
try {
  // -d directories, -f force, -e exclude
  const out = sh(`git clean -fd ${excludeArgs}`);
  console.log(out || '(no output)');
} catch (err) {
  console.error(String(err.stderr || err.message || err));
  process.exit(1);
}

// 3) Minimal cluster-only redirect (old Breda URL → national offer)
const astroPath = path.join(root, 'astro.config.mjs');
let astro = fs.readFileSync(astroPath, 'utf8');
let astroTouched = false;
if (!astro.includes('website-laten-maken-breda')) {
  if (astro.includes("'/en/cookie-policy/': '/en/cookies/',")) {
    astro = astro.replace(
      "'/en/cookie-policy/': '/en/cookies/',",
      "'/en/cookie-policy/': '/en/cookies/',\n    '/website-laten-maken-breda': '/website-laten-maken/',\n    '/website-laten-maken-breda/': '/website-laten-maken/',",
    );
    fs.writeFileSync(astroPath, astro);
    astroTouched = true;
  }
}

const afterPorcelain = sh('git status --porcelain');

console.log('\nAfter restore, keep paths present:');
for (const p of mustKeep) console.log(' ', p, exists(p));

console.log('\n--- Explicit files user asked to revert ---');
for (const p of [
  'src/components/SeoHead.astro',
  'src/data/site.ts',
  'src/data/navigation.ts',
  'src/views/ServiceDetailPage.astro',
  'src/data/services.ts',
  'src/data/gemeentes.json',
]) {
  const dirty = afterPorcelain
    .split(/\r?\n/)
    .some((line) => line.includes(p.replace(/\\/g, '/')));
  console.log(p, dirty ? 'STILL DIRTY' : 'clean (=HEAD)');
}

console.log('\nastro.config redirect re-applied:', astroTouched);
console.log('\nRemaining git status:');
console.log(afterPorcelain || '(clean except keep/untracked cluster)');
console.log('\nStatus lines before:', beforePorcelain.split(/\r?\n/).filter(Boolean).length);
