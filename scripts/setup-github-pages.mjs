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

function getToken() {
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/^oauth_token = "(.+)"$/m);
  if (!match) throw new Error('Missing Cloudflare OAuth token in Wrangler config.');
  return match[1];
}

async function cf(method, urlPath, body) {
  const token = getToken();
  const response = await fetch(`https://api.cloudflare.com/client/v4${urlPath}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json();
  return { response, data };
}

const projectBody = {
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

console.log('Checking existing project...');
let { response, data } = await cf(
  'GET',
  `/accounts/${accountId}/pages/projects/${projectName}`,
);

if (response.ok && data.success) {
  const sourceType = data.result?.source?.type ?? 'none';
  console.log(`Existing project source: ${sourceType}`);
  if (sourceType !== 'github') {
    console.log('Deleting direct-upload project so it can be recreated with GitHub source...');
    ({ response, data } = await cf(
      'DELETE',
      `/accounts/${accountId}/pages/projects/${projectName}`,
    ));
    if (!response.ok || !data.success) {
      console.error('DELETE failed:', JSON.stringify(data, null, 2));
      process.exit(1);
    }
    console.log('DELETE_OK');
  }
}

({ response, data } = await cf(
  'GET',
  `/accounts/${accountId}/pages/projects/${projectName}`,
));

if (!response.ok) {
  console.log('Creating Git-connected Pages project...');
  ({ response, data } = await cf(
    'POST',
    `/accounts/${accountId}/pages/projects`,
    projectBody,
  ));
  if (!response.ok || !data.success) {
    console.error('CREATE failed:', JSON.stringify(data, null, 2));
    process.exit(1);
  }
  console.log('CREATE_OK');
}

const result = data.result;
console.log('PROJECT_OK');
console.log(`url=https://${result.subdomain ?? `${projectName}.pages.dev`}`);
console.log(`git=${result.source?.type ?? 'unknown'}`);
console.log(`owner=${result.source?.config?.owner ?? ''}`);
console.log(`repo=${result.source?.config?.repo_name ?? ''}`);
console.log(`branch=${result.production_branch ?? 'main'}`);
console.log(`build=${result.build_config?.build_command ?? ''}`);
console.log(`output=${result.build_config?.destination_dir ?? ''}`);
console.log(
  `auto_deploy=${result.source?.config?.production_deployments_enabled ?? false}`,
);
