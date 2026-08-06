/** Website approval lifecycle for Star Local admin review. */
export type ApprovalStatus =
  | 'concept'
  | 'pending_review'
  | 'approved'
  | 'rejected'
  | 'preparing'
  | 'package_ready'
  | 'published';

export const APPROVAL_STATUS_LABELS: Record<ApprovalStatus, string> = {
  concept: 'Concept',
  pending_review: 'In review',
  approved: 'Goedgekeurd',
  rejected: 'Afgekeurd',
  preparing: 'Bezig met voorbereiden',
  package_ready: 'Publicatiepakket gereed',
  published: 'Gepubliceerd',
};

export const REJECTION_CATEGORIES = [
  'Ongepaste inhoud',
  'Spam',
  'Copyright',
  'Dubbele website',
  'Anders',
] as const;

export type RejectionCategory = (typeof REJECTION_CATEGORIES)[number];
