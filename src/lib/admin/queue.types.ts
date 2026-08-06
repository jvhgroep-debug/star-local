import type { ApprovalStatus, RejectionCategory } from '../../types/approval';
import type { WebsiteConfig } from '../../types/website-config';

export interface AdminWebsiteRecord {
  id: string;
  businessName: string;
  slug: string;
  subdomain: string;
  email: string;
  city: string;
  industry: string;
  createdAt: string;
  approvalStatus: ApprovalStatus;
  rejectionReason?: string;
  rejectionCategory?: RejectionCategory | string;
  tenantId?: string | null;
  websiteId?: string | null;
  primaryColor: string;
  configSnapshot?: WebsiteConfig;
  hasConfigSnapshot?: boolean;
  publishedAt?: string;
  liveUrl?: string;
  activePublicationVersion?: string;
  previousPublicationVersion?: string;
  packageGeneratedAt?: string;
}
