-- Star Local SaaS — publish fields for D1 website storage (development)
-- Extends 0002_website_foundation.sql

ALTER TABLE tenants ADD COLUMN description TEXT NOT NULL DEFAULT '';

ALTER TABLE websites ADD COLUMN status TEXT NOT NULL DEFAULT 'draft'
  CHECK (status IN ('draft', 'published', 'archived'));

ALTER TABLE websites ADD COLUMN package TEXT NOT NULL DEFAULT 'free'
  CHECK (package IN ('free', 'premium'));

ALTER TABLE websites ADD COLUMN logo_key TEXT;

CREATE INDEX IF NOT EXISTS idx_websites_status ON websites (status);
CREATE INDEX IF NOT EXISTS idx_websites_package ON websites (package);
