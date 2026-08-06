#!/usr/bin/env node
/**
 * Cloudflare staging resource setup (OPDRACHT 64).
 * Requires: wrangler login  OR  CLOUDFLARE_API_TOKEN env var
 *
 * Usage: node scripts/setup-cloudflare-staging.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const root = process.cwd();
const stagingToml = path.join(root, 'wrangler.staging.toml');
const localToml = path.join(root, 'wrangler.staging.local.toml');
const D1_NAME = 'star-local-saas-staging';
const R2_NAME = 'star-local-saas-media-staging';
const PAGES_PROJECT = 'star-local-staging';

function run(cmd, opts = {}) {
  console.log(`\n> ${cmd}`);
  return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim();
}

function checkAuth() {
  try {
    run('npx wrangler whoami');
    return true;
  } catch {
    console.error(`
ERROR: Niet ingelogd bij Cloudflare.

Voer handmatig uit:
  1. npx wrangler login
     OF stel CLOUDFLARE_API_TOKEN in (Pages + D1 + R2 rechten)
  2. node scripts/setup-cloudflare-staging.mjs
`);
    process.exit(1);
  }
}

function parseD1Id(output) {
  const match = output.match(/database_id\s*=\s*"([^"]+)"/i) || output.match(/([0-9a-f-]{36})/i);
  return match?.[1] ?? null;
}

function ensureD1() {
  let id = null;
  try {
    const list = run('npx wrangler d1 list');
    const line = list.split('\n').find((l) => l.includes(D1_NAME));
    if (line) {
      const m = line.match(/([0-9a-f-]{36})/);
      if (m) id = m[1];
      console.log(`D1 bestaat al: ${D1_NAME} (${id})`);
    }
  } catch {
    /* list failed */
  }

  if (!id) {
    const out = run(`npx wrangler d1 create ${D1_NAME}`);
    id = parseD1Id(out);
    if (!id) throw new Error('Kon D1 database_id niet parsen uit wrangler output.');
    console.log(`D1 aangemaakt: ${id}`);
  }

  run(`npx wrangler d1 migrations apply ${D1_NAME} --remote --config wrangler.staging.toml`);
  return id;
}

function ensureR2() {
  try {
    const list = run('npx wrangler r2 bucket list');
    if (list.includes(R2_NAME)) {
      console.log(`R2 bucket bestaat al: ${R2_NAME}`);
      return;
    }
  } catch {
    /* continue */
  }
  run(`npx wrangler r2 bucket create ${R2_NAME}`);
  console.log(`R2 bucket aangemaakt: ${R2_NAME}`);
}

function writeLocalToml(d1Id) {
  const content = `# Auto-generated — niet committen\n[[d1_databases]]\nbinding = "DB"\ndatabase_name = "${D1_NAME}"\ndatabase_id = "${d1Id}"\n`;
  fs.writeFileSync(localToml, content);
  console.log(`Geschreven: wrangler.staging.local.toml`);
}

function patchStagingToml(d1Id) {
  let toml = fs.readFileSync(stagingToml, 'utf8');
  toml = toml.replace(/database_id = "REPLACE_WITH_STAGING_D1_DATABASE_ID"/, `database_id = "${d1Id}"`);
  fs.writeFileSync(stagingToml, toml);
  console.log('wrangler.staging.toml bijgewerkt met database_id.');
}

function printSecretInstructions() {
  console.log(`
=== Secrets handmatig instellen (geen waarden in terminal loggen) ===

npx wrangler pages secret put RESEND_API_KEY --project-name ${PAGES_PROJECT}
npx wrangler pages secret put FROM_EMAIL --project-name ${PAGES_PROJECT}
npx wrangler pages secret put CONTACT_TO_EMAIL --project-name ${PAGES_PROJECT}

Optioneel:
npx wrangler pages secret put ADMIN_NOTIFICATION_EMAIL --project-name ${PAGES_PROJECT}

=== Deploy staging ===

npm run build
npx wrangler pages deploy dist --project-name ${PAGES_PROJECT} --config wrangler.staging.toml

Noteer de preview-URL en werk APP_BASE_URL bij in Cloudflare Dashboard indien nodig.
`);
}

console.log('=== Star Local — Cloudflare Staging Setup ===');
checkAuth();
const d1Id = ensureD1();
ensureR2();
writeLocalToml(d1Id);
patchStagingToml(d1Id);
printSecretInstructions();
console.log('Setup voltooid.\n');
