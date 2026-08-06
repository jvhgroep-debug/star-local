#!/usr/bin/env node
/**
 * Deploy naar Cloudflare staging (OPDRACHT 64).
 * Requires: setup-cloudflare-staging.mjs uitgevoerd + secrets ingesteld
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';

const PAGES_PROJECT = 'star-local-staging';

if (!fs.existsSync('dist')) {
  console.error('dist/ ontbreekt — voer eerst npm run build uit.');
  process.exit(1);
}

const toml = fs.readFileSync('wrangler.staging.toml', 'utf8');
if (toml.includes('REPLACE_WITH_STAGING_D1_DATABASE_ID')) {
  console.error('database_id nog placeholder — voer eerst node scripts/setup-cloudflare-staging.mjs uit.');
  process.exit(1);
}

try {
  execSync('npx wrangler whoami', { stdio: 'pipe' });
} catch {
  console.error('Niet ingelogd — voer npx wrangler login uit.');
  process.exit(1);
}

console.log('Deploying to Cloudflare staging...');
const out = execSync(
  `npx wrangler pages deploy dist --project-name ${PAGES_PROJECT} --config wrangler.staging.toml`,
  { encoding: 'utf8' },
);
console.log(out);
console.log('\nStaging deploy voltooid. Noteer de preview-URL voor smoke tests.');
