export type CustomerStatus = 'active' | 'suspended' | 'archived';

export type WebsitePermissionRole = 'owner' | 'editor' | 'viewer';

export interface CustomerRecord {
  id: string;
  email: string;
  businessName: string | null;
  userId: string | null;
  status: CustomerStatus;
  createdAt: string;
  updatedAt: string;
}

export interface WebsitePermissionRecord {
  id: string;
  customerId: string;
  tenantId: string;
  websiteId: string;
  role: WebsitePermissionRole;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerWebsiteSummary {
  permissionId: string;
  customerId: string;
  tenantId: string;
  websiteId: string;
  role: WebsitePermissionRole;
  businessName: string;
  slug: string;
  industry: string;
  city: string;
  approvalStatus: string;
  pendingChangesStatus: 'none' | 'in_review';
  liveUrl: string | null;
  updatedAt: string;
  createdAt: string;
}

export type PendingChangesStatus = 'none' | 'in_review';
