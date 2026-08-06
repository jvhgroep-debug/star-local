import type { ApprovalStatus } from '../../types/approval';
import type { AdminWebsiteRecord } from './queue.types';

export type { AdminWebsiteRecord };

export function getAdminQueueStats(queue: AdminWebsiteRecord[]): Record<ApprovalStatus | 'total', number> {
  const stats = {
    concept: 0,
    pending_review: 0,
    approved: 0,
    preparing: 0,
    package_ready: 0,
    rejected: 0,
    published: 0,
    total: queue.length,
  };

  for (const item of queue) {
    stats[item.approvalStatus] += 1;
  }

  return stats;
}
