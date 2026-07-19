import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const accountId = 'b28570cf21aaad1c2f09a48d99063922';
const projectName = 'star-local';
const configPath = path.join(
  os.homedir(),
  'AppData',
  'Roaming',
  'xdg.config',
  '.wrangler',
  'config',
  'default.toml',
);

const config = fs.readFileSync(configPath, 'utf8');
const match = config.match(/^oauth_token = "(.+)"$/m);
if (!match) {
  console.error('Could not read Cloudflare OAuth token from Wrangler config.');
  process.exit(1);
}

const token = match[1];
const body = {
  build_config: {
    build_command: 'npm run build',
    destination_dir: 'dist',
    root_dir: '',
  },
  deployment_configs: {
    production: { compatibility_date: '2026-07-19' },
    preview: { compatibility_date: '2026-07-19' },
  },
  source: {
    type: 'github',
    config: {
      owner: 'jvhgroep-debug',
      repo_name: 'star-local',
      production_branch: 'main',
      pr_comments_enabled: true,
      deployments_enabled: true,
      production_deployments_enabled: true,
    },
  },
};

const response = await fetch(
  `https://api.cloudflare.com/client/v4/accounts/${accountId}/pages/projects/${projectName}`,
  {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  },
);

const data = await response.json();
if (!response.ok || !data.success) {
  console.error('PATCH failed:', JSON.stringify(data, null, 2));
  process.exit(1);
}

const result = data.result;
console.log('PATCH_OK');
console.log(`git=${result.source?.type}`);
console.log(`owner=${result.source?.config?.owner}`);
console.log(`repo=${result.source?.config?.repo_name}`);
console.log(`branch=${result.production_branch}`);
console.log(`framework=${result.framework ?? 'astro'}`);
console.log(`build=${result.build_config?.build_command}`);
console.log(`output=${result.build_config?.destination_dir}`);
console.log(`deployments_enabled=${result.source?.config?.deployments_enabled}`);
