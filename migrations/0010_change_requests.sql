-- Star Local SaaS — wijzigingsverzoeken (OPDRACHT 84)
-- Klant-aangevraagde wijzigingen; media metadata pending tot R2-koppeling.

CREATE TABLE IF NOT EXISTS change_requests (
  id TEXT PRIMARY KEY NOT NULL,
  customer_id TEXT NOT NULL,
  website_id TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  request_type TEXT NOT NULL,
  description TEXT NOT NULL,
  media_metadata_json TEXT,
  requested_location TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'approved', 'rejected', 'completed')),
  admin_notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE,
  FOREIGN KEY (website_id) REFERENCES websites (id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_change_requests_customer_id ON change_requests (customer_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_website_id ON change_requests (website_id);
CREATE INDEX IF NOT EXISTS idx_change_requests_status ON change_requests (status);
CREATE INDEX IF NOT EXISTS idx_change_requests_created_at ON change_requests (created_at DESC);
