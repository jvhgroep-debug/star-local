import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const accountId = 'b28570cf21aaad1c2f09a48d99063922';
const projectName = 'star-local';

function getToken() {
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
  if (!match) throw new Error('Missing Cloudflare OAuth token in Wrangler config.');
  return match[1];
}

async function cf(method, urlPath, body) {
  const response = await fetch(`https://api.cloudflare.com/client/v4${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  return { response, data };
}

const existing = await cf('GET', `/accounts/${accountId}/pages/projects/${projectName}`);
if (existing.response.ok && existing.data.success) {
  const result = existing.data.result;
  console.log('PROJECT_EXISTS');
  console.log(`url=https://${result.subdomain ?? `${projectName}.pages.dev`}`);
  console.log(`git=${result.source?.type ?? 'none'}`);
  process.exit(0);
}

const body = {
  name: projectName,
  production_branch: 'main',
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

const { response, data } = await cf('POST', `/accounts/${accountId}/pages/projects`, body);
if (!response.ok || !data.success) {
  console.error('CREATE_FAILED');
  console.error(JSON.stringify(data, null, 2));
  process.exit(1);
}

const result = data.result;
console.log('PROJECT_CREATED');
console.log(`url=https://${result.subdomain ?? `${projectName}.pages.dev`}`);
console.log(`git=${result.source?.type}`);
console.log(`branch=${result.production_branch}`);
