-- Star Local SaaS — production publication packages (OPDRACHT 61)
-- Extends approval_status with preparing + package_ready; adds version tracking.

PRAGMA foreign_keys=OFF;

CREATE TABLE IF NOT EXISTS websites__pkg (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  seo_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  theme TEXT NOT NULL DEFAULT 'default',
  primary_color TEXT NOT NULL DEFAULT '#1a2332',
  secondary_color TEXT NOT NULL DEFAULT '#cdb880',
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  package TEXT NOT NULL DEFAULT 'free' CHECK (package IN ('free', 'premium')),
  logo_key TEXT,
  font_family TEXT NOT NULL DEFAULT 'system',
  publication_status TEXT NOT NULL DEFAULT 'draft',
  last_published_at TEXT,
  approval_status TEXT NOT NULL DEFAULT 'concept'
    CHECK (approval_status IN ('concept', 'pending_review', 'approved', 'rejected', 'preparing', 'package_ready', 'published')),
  rejection_reason TEXT,
  rejection_category TEXT,
  config_snapshot_json TEXT,
  live_url TEXT,
  active_publication_version TEXT,
  previous_publication_version TEXT,
  package_generated_at TEXT,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

INSERT INTO websites__pkg (
  id, tenant_id, seo_title, meta_description, theme,
  primary_color, secondary_color, published, created_at, updated_at,
  status, package, logo_key, font_family, publication_status, last_published_at,
  approval_status, rejection_reason, rejection_category, config_snapshot_json, live_url
)
SELECT
  id, tenant_id, seo_title, meta_description, theme,
  primary_color, secondary_color, published, created_at, updated_at,
  status, package, logo_key, font_family, publication_status, last_published_at,
  approval_status, rejection_reason, rejection_category, config_snapshot_json, live_url
FROM websites;

DROP TABLE websites;
ALTER TABLE websites__pkg RENAME TO websites;

CREATE UNIQUE INDEX IF NOT EXISTS idx_websites_tenant_id ON websites (tenant_id);
CREATE INDEX IF NOT EXISTS idx_websites_published ON websites (published);
CREATE INDEX IF NOT EXISTS idx_websites_status ON websites (status);
CREATE INDEX IF NOT EXISTS idx_websites_package ON websites (package);
CREATE INDEX IF NOT EXISTS idx_websites_approval_status ON websites (approval_status);

CREATE TABLE IF NOT EXISTS publication_versions (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  website_id TEXT NOT NULL,
  version_label TEXT NOT NULL,
  version_number INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('preview', 'package_ready', 'published', 'failed', 'superseded')),
  domain TEXT NOT NULL,
  slug TEXT NOT NULL,
  package_root TEXT NOT NULL,
  page_count INTEGER NOT NULL DEFAULT 0,
  asset_count INTEGER NOT NULL DEFAULT 0,
  total_size_bytes INTEGER NOT NULL DEFAULT 0,
  package_hash TEXT NOT NULL DEFAULT '',
  publication_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_publication_versions_website_version ON publication_versions (website_id, version_label);
CREATE INDEX IF NOT EXISTS idx_publication_versions_tenant ON publication_versions (tenant_id);
CREATE INDEX IF NOT EXISTS idx_publication_versions_website ON publication_versions (website_id);

PRAGMA foreign_keys=ON;
