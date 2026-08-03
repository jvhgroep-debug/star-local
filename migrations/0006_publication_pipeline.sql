-- Star Local SaaS — publication pipeline logs (phase 4, local package only)

ALTER TABLE websites ADD COLUMN publication_status TEXT NOT NULL DEFAULT 'draft';
ALTER TABLE websites ADD COLUMN last_published_at TEXT;

CREATE TABLE IF NOT EXISTS publication_logs (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  website_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft', 'building', 'published', 'failed')),
  started_at TEXT NOT NULL,
  finished_at TEXT,
  duration_ms INTEGER,
  page_count INTEGER NOT NULL DEFAULT 0,
  image_count INTEGER NOT NULL DEFAULT 0,
  seo_score INTEGER NOT NULL DEFAULT 0,
  errors_json TEXT NOT NULL DEFAULT '[]',
  changed_files_json TEXT NOT NULL DEFAULT '[]',
  republish INTEGER NOT NULL DEFAULT 0,
  package_hash TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_publication_logs_tenant_id ON publication_logs (tenant_id);
CREATE INDEX IF NOT EXISTS idx_publication_logs_website_id ON publication_logs (website_id);
CREATE INDEX IF NOT EXISTS idx_publication_logs_created_at ON publication_logs (created_at DESC);
