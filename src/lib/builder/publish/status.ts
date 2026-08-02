import type { PublicationStatus, WebsitePackage } from '../../../types/website-config';

export const PUBLICATION_STATUS_LABELS: Record<PublicationStatus, string> = {
  concept: 'Concept',
  ready_for_publication: 'Klaar voor publicatie',
  published: 'Gepubliceerd',
};

export const WEBSITE_PACKAGE_LABELS: Record<WebsitePackage, string> = {
  free: 'Gratis',
  premium: 'Premium',
};

export function publicationStatusBadgeClass(status: PublicationStatus): string {
  switch (status) {
    case 'ready_for_publication':
      return 'builder-status-badge--ready';
    case 'published':
      return 'builder-status-badge--published';
    default:
      return 'builder-status-badge--concept';
  }
}

export function nextPublicationStatus(current: PublicationStatus): PublicationStatus {
  switch (current) {
    case 'concept':
      return 'ready_for_publication';
    case 'ready_for_publication':
      return 'published';
    default:
      return 'published';
  }
}
