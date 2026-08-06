import type { CustomerWebsiteSummary } from '../../types/customer-portal';
import type { DashboardWebsiteCardItem } from '../../types/dashboard';
import { APPROVAL_STATUS_LABELS, type ApprovalStatus } from '../../types/approval';

export function mapCustomerWebsiteToCard(site: CustomerWebsiteSummary): DashboardWebsiteCardItem {
  const subdomain = `${site.slug}.starlocal.nl`;
  const url = site.liveUrl || `https://${subdomain}`;
  const approval = site.approvalStatus as ApprovalStatus;

  let statusLabel = APPROVAL_STATUS_LABELS[approval] ?? site.approvalStatus;
  if (site.pendingChangesStatus === 'in_review' && approval === 'published') {
    statusLabel = 'Wijzigingen in review';
  }

  return {
    id: site.websiteId,
    tenantId: site.tenantId,
    websiteId: site.websiteId,
    businessName: site.businessName,
    slug: site.slug,
    subdomain,
    url,
    status: site.approvalStatus,
    statusLabel,
    pipelineStatus: site.pendingChangesStatus === 'in_review' ? 'building' : 'draft',
    pipelineLabel: statusLabel,
    lastUpdated: site.updatedAt,
    primaryColor: '#1a2332',
    logoName: null,
    source: 'd1',
    approvalStatus: site.approvalStatus,
    pendingChangesStatus: site.pendingChangesStatus,
    liveUrl: site.liveUrl,
    previewPath: site.liveUrl || `/sites/${site.slug}/`,
    editPath: `/dashboard/website/?tenantId=${encodeURIComponent(site.tenantId)}&websiteId=${encodeURIComponent(site.websiteId)}`,
  };
}

export function filterWebsitesBySection(
  websites: DashboardWebsiteCardItem[],
  section: 'websites' | 'concepts' | 'in_review' | 'published',
): DashboardWebsiteCardItem[] {
  switch (section) {
    case 'concepts':
      return websites.filter((site) => site.status === 'concept' || site.status === 'rejected');
    case 'in_review':
      return websites.filter(
        (site) =>
          site.status === 'pending_review' ||
          site.status === 'approved' ||
          site.pendingChangesStatus === 'in_review',
      );
    case 'published':
      return websites.filter((site) => site.status === 'published');
    default:
      return websites;
  }
}

export function primaryBusinessName(
  websites: DashboardWebsiteCardItem[],
  fallbackEmail: string,
): string {
  return websites[0]?.businessName || fallbackEmail.split('@')[0] || 'ondernemer';
}
