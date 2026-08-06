-- Star Local SaaS — customer portal (OPDRACHT 80)
-- customers, website_permissions, rate limits, pending customer edits

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL UNIQUE,
  business_name TEXT,
  user_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'suspended', 'archived')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_customers_email ON customers (email);
CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers (user_id);

CREATE TABLE IF NOT EXISTS website_permissions (
  id TEXT PRIMARY KEY NOT NULL,
  customer_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  website_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'owner'
    CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_website_permissions_customer_website
  ON website_permissions (customer_id, website_id);
CREATE INDEX IF NOT EXISTS idx_website_permissions_customer_id ON website_permissions (customer_id);
CREATE INDEX IF NOT EXISTS idx_website_permissions_tenant_id ON website_permissions (tenant_id);

CREATE TABLE IF NOT EXISTS auth_rate_limits (
  id TEXT PRIMARY KEY NOT NULL,
  scope TEXT NOT NULL,
  identifier TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  window_started_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_auth_rate_limits_scope_identifier
  ON auth_rate_limits (scope, identifier);

ALTER TABLE magic_links ADD COLUMN customer_id TEXT REFERENCES customers (id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_magic_links_customer_id ON magic_links (customer_id);

ALTER TABLE sessions ADD COLUMN customer_id TEXT REFERENCES customers (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_sessions_customer_id ON sessions (customer_id);

ALTER TABLE websites ADD COLUMN pending_changes_status TEXT NOT NULL DEFAULT 'none'
  CHECK (pending_changes_status IN ('none', 'in_review'));
ALTER TABLE websites ADD COLUMN pending_snapshot_json TEXT;

CREATE INDEX IF NOT EXISTS idx_websites_pending_changes_status ON websites (pending_changes_status);

-- Backfill customers from existing users
INSERT INTO customers (id, email, user_id, business_name, status, created_at, updated_at)
SELECT
  u.id,
  u.email,
  u.id,
  NULL,
  'active',
  u.created_at,
  u.updated_at
FROM users u
WHERE NOT EXISTS (SELECT 1 FROM customers c WHERE c.email = u.email);

-- Backfill website permissions from tenant_users + websites
INSERT INTO website_permissions (id, customer_id, tenant_id, website_id, role, created_at, updated_at)
SELECT
  lower(hex(randomblob(16))),
  c.id,
  tu.tenant_id,
  w.id,
  CASE tu.role WHEN 'owner' THEN 'owner' WHEN 'editor' THEN 'editor' ELSE 'viewer' END,
  tu.created_at,
  tu.created_at
FROM tenant_users tu
INNER JOIN customers c ON c.user_id = tu.user_id
INNER JOIN websites w ON w.tenant_id = tu.tenant_id
WHERE NOT EXISTS (
  SELECT 1 FROM website_permissions wp
  WHERE wp.customer_id = c.id AND wp.website_id = w.id
);
