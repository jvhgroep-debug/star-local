import type { ApprovalStatus } from '../../types/approval';

/** Publication engine lifecycle (OPDRACHT 79). */
export type PublicationEngineStatus = 'concept' | 'in_review' | 'approved' | 'published';

export const PUBLICATION_ENGINE_LABELS: Record<PublicationEngineStatus, string> = {
  concept: 'Concept',
  in_review: 'In review',
  approved: 'Goedgekeurd',
  published: 'Gepubliceerd',
};

export function toApprovalStatus(status: PublicationEngineStatus): ApprovalStatus {
  switch (status) {
    case 'in_review':
      return 'pending_review';
    case 'approved':
      return 'approved';
    case 'published':
      return 'published';
    default:
      return 'concept';
  }
}

export function fromApprovalStatus(status: ApprovalStatus): PublicationEngineStatus | null {
  switch (status) {
    case 'concept':
      return 'concept';
    case 'pending_review':
      return 'in_review';
    case 'approved':
      return 'approved';
    case 'published':
      return 'published';
    case 'rejected':
      return 'concept';
    default:
      return null;
  }
}

const ALLOWED: Record<PublicationEngineStatus, PublicationEngineStatus[]> = {
  concept: ['in_review'],
  in_review: ['approved', 'concept'],
  approved: ['published', 'concept'],
  published: ['concept'],
};

export function canTransition(from: PublicationEngineStatus, to: PublicationEngineStatus): boolean {
  return ALLOWED[from]?.includes(to) ?? false;
}

export function assertTransition(from: PublicationEngineStatus, to: PublicationEngineStatus): void {
  if (!canTransition(from, to)) {
    throw new Error(`Statusovergang ${from} → ${to} is niet toegestaan.`);
  }
}

/** Admin reject maps back to concept for the simplified v1 flow. */
export function rejectionTargetStatus(): ApprovalStatus {
  return 'rejected';
}
