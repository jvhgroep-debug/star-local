-- Star Local SaaS — admin approval queue (D1-backed, replaces localStorage admin queue)

ALTER TABLE websites ADD COLUMN approval_status TEXT NOT NULL DEFAULT 'concept'
  CHECK (approval_status IN ('concept', 'pending_review', 'approved', 'rejected', 'published'));

ALTER TABLE websites ADD COLUMN rejection_reason TEXT;
ALTER TABLE websites ADD COLUMN rejection_category TEXT;
ALTER TABLE websites ADD COLUMN config_snapshot_json TEXT;
ALTER TABLE websites ADD COLUMN live_url TEXT;

CREATE INDEX IF NOT EXISTS idx_websites_approval_status ON websites (approval_status);

CREATE TABLE IF NOT EXISTS admin_publication_logs (
  id TEXT PRIMARY KEY NOT NULL,
  website_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  business_name TEXT NOT NULL,
  subdomain TEXT NOT NULL,
  started_at TEXT NOT NULL,
  finished_at TEXT NOT NULL,
  steps_json TEXT NOT NULL,
  page_count INTEGER NOT NULL DEFAULT 0,
  file_count INTEGER NOT NULL DEFAULT 0,
  package_hash TEXT NOT NULL DEFAULT '',
  package_json TEXT,
  live_url TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_admin_publication_logs_website_id ON admin_publication_logs (website_id);
CREATE INDEX IF NOT EXISTS idx_admin_publication_logs_created_at ON admin_publication_logs (created_at DESC);
