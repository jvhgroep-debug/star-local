-- Star Local SaaS — website / tenant data foundation (development)
-- Builds on 0001_auth_foundation.sql
--
-- Future modules (same tenant_id FK + timestamps pattern):
--   reviews, reservations, quotes, invoices, crm_contacts, blog_posts, seo_audits

-- bedrijfsnaam is stored in tenants.name (from auth foundation)
ALTER TABLE tenants ADD COLUMN branche TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS websites (
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
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_websites_tenant_id ON websites (tenant_id);
CREATE INDEX IF NOT EXISTS idx_websites_published ON websites (published);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  telefoon TEXT NOT NULL DEFAULT '',
  whatsapp TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  adres TEXT NOT NULL DEFAULT '',
  postcode TEXT NOT NULL DEFAULT '',
  plaats TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_tenant_id ON contacts (tenant_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts (email);

CREATE TABLE IF NOT EXISTS services (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  titel TEXT NOT NULL,
  omschrijving TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_services_tenant_id ON services (tenant_id);
CREATE INDEX IF NOT EXISTS idx_services_tenant_sort ON services (tenant_id, sort_order);

CREATE TABLE IF NOT EXISTS opening_hours (
  id TEXT PRIMARY KEY NOT NULL,
  tenant_id TEXT NOT NULL,
  weekday INTEGER NOT NULL CHECK (weekday >= 0 AND weekday <= 6),
  open_time TEXT,
  close_time TEXT,
  closed INTEGER NOT NULL DEFAULT 0 CHECK (closed IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_opening_hours_tenant_weekday ON opening_hours (tenant_id, weekday);
CREATE INDEX IF NOT EXISTS idx_opening_hours_tenant_id ON opening_hours (tenant_id);
