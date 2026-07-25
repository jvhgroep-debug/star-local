/**
 * Runs the Content Engine uniqueness demo via tsx (no mass page generation).
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const entry = path.join(root, 'scripts', 'demo-content-engine-run.ts');

const result = spawnSync(
  'npx',
  ['--yes', 'tsx', entry],
  { cwd: root, stdio: 'inherit', shell: true },
);

process.exit(result.status ?? 1);
