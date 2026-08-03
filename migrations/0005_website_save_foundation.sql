-- Star Local SaaS — website pages, media metadata, extended contact fields

ALTER TABLE contacts ADD COLUMN website TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN kvk TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN gemeente_slug TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN gemeente_naam TEXT NOT NULL DEFAULT '';
ALTER TABLE contacts ADD COLUMN provincie TEXT NOT NULL DEFAULT '';

ALTER TABLE websites ADD COLUMN font_family TEXT NOT NULL DEFAULT 'system';

CREATE TABLE IF NOT EXISTS website_pages (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  website_id TEXT NOT NULL,
  page_key TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  slug TEXT NOT NULL DEFAULT '',
  content_json TEXT NOT NULL DEFAULT '{}',
  seo_title TEXT NOT NULL DEFAULT '',
  meta_description TEXT NOT NULL DEFAULT '',
  canonical_path TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_website_pages_tenant_page_key ON website_pages (tenant_id, page_key);
CREATE INDEX IF NOT EXISTS idx_website_pages_website_id ON website_pages (website_id);

CREATE TABLE IF NOT EXISTS media_items (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('logo', 'photo')),
  storage_key TEXT NOT NULL,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_media_items_tenant_id ON media_items (tenant_id);
CREATE INDEX IF NOT EXISTS idx_media_items_tenant_type ON media_items (tenant_id, media_type);
