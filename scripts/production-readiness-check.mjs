#!/usr/bin/env node
/**
 * Production readiness checks (OPDRACHT 62).
 * Run: node scripts/production-readiness-check.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const results = { pass: [], fail: [], warn: [] };

function pass(msg) {
  results.pass.push(msg);
}
function fail(msg) {
  results.fail.push(msg);
}
function warn(msg) {
  results.warn.push(msg);
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

// Staging (OPDRACHT 64)
if (exists('wrangler.staging.toml')) {
  const staging = read('wrangler.staging.toml');
  if (staging.includes('star-local-saas-staging')) pass('wrangler.staging.toml: staging D1 name');
  else fail('wrangler.staging.toml: missing staging D1 name');
  if (staging.includes('star-local-saas-media-staging')) pass('wrangler.staging.toml: staging R2 bucket');
  else fail('wrangler.staging.toml: missing staging R2 bucket');
  if (staging.includes('ENVIRONMENT = "staging"')) pass('wrangler.staging.toml: ENVIRONMENT=staging');
  if (staging.includes('REPLACE_WITH_STAGING_D1_DATABASE_ID')) warn('wrangler.staging.toml: database_id still placeholder (run setup script)');
  else pass('wrangler.staging.toml: database_id set');
}

// Prod config
if (exists('wrangler.prod.toml')) {
  const prod = read('wrangler.prod.toml');
  if (prod.includes('star-local-saas-prod')) pass('wrangler.prod.toml: prod D1 name');
  else fail('wrangler.prod.toml: missing prod D1 name');
  if (prod.includes('star-local-saas-media-prod')) pass('wrangler.prod.toml: prod R2 bucket');
  else fail('wrangler.prod.toml: missing prod R2 bucket');
  if (prod.includes('REPLACE_WITH_PRODUCTION_D1_DATABASE_ID')) warn('wrangler.prod.toml: database_id still placeholder');
  else pass('wrangler.prod.toml: database_id set');
  if (prod.includes('REPLACE_WITH')) warn('wrangler.prod.toml: placeholder values remain');
  else pass('wrangler.prod.toml: no placeholders');
} else {
  fail('wrangler.prod.toml missing');
}

// 2. Dev wrangler must not use prod names
const dev = read('wrangler.toml');
if (dev.includes('star-local-saas-dev')) pass('wrangler.toml: dev D1 only');
else warn('wrangler.toml: unexpected D1 config');

// 3. Migrations
const migrations = fs.readdirSync(path.join(root, 'migrations')).filter((f) => f.endsWith('.sql')).sort();
if (migrations.length >= 8) pass(`migrations: ${migrations.length} files (0001–0008)`);
else fail(`migrations: expected 8, found ${migrations.length}`);

for (const file of ['0007_admin_approval_queue.sql', '0008_publication_packages.sql']) {
  if (migrations.includes(file)) pass(`migration ${file}`);
  else fail(`migration ${file} missing`);
}

// 4. Env example
if (exists('.env.example')) pass('.env.example present');
else fail('.env.example missing');

// 5. Go-live API
if (exists('src/pages/api/admin/websites/go-live.ts')) pass('go-live API route');
else fail('go-live API route missing');

// 6. R2 deploy service
if (exists('src/lib/publication/r2-deploy.service.ts')) pass('R2 deploy service');
else fail('R2 deploy service missing');

// 7. No hardcoded Resend keys in src
const srcFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') walk(full);
    else if (/\.(ts|tsx|astro|mjs)$/.test(entry.name)) srcFiles.push(full);
  }
}
walk(path.join(root, 'src'));

let secretHits = 0;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (/re_[a-zA-Z0-9]{10,}/.test(content)) secretHits++;
  if (/sk_[a-zA-Z0-9]{10,}/.test(content)) secretHits++;
}
if (secretHits === 0) pass('no hardcoded API keys in src/');
else fail(`possible hardcoded API keys: ${secretHits} file(s)`);

// Static SEO assets
if (exists('public/robots.txt')) pass('public/robots.txt present');
else fail('public/robots.txt missing');
if (exists('public/favicon.svg')) pass('public/favicon.svg present');
else fail('public/favicon.svg missing');
if (exists('src/components/StagingBanner.astro')) pass('StagingBanner component');
else fail('StagingBanner component missing');

// Publication config uses production domain
const pubConfig = read('src/config/publication.ts');
if (pubConfig.includes('starlocal.nl') && !pubConfig.includes('localhost')) pass('publication.ts: production domain');
else warn('publication.ts: check domain config');

console.log('\n=== Production Readiness Check ===\n');
console.log(`PASS (${results.pass.length}):`);
results.pass.forEach((m) => console.log(`  ✓ ${m}`));
if (results.warn.length) {
  console.log(`\nWARN (${results.warn.length}):`);
  results.warn.forEach((m) => console.log(`  ⚠ ${m}`));
}
if (results.fail.length) {
  console.log(`\nFAIL (${results.fail.length}):`);
  results.fail.forEach((m) => console.log(`  ✗ ${m}`));
  process.exit(1);
}
console.log('\nAll critical checks passed.\n');
