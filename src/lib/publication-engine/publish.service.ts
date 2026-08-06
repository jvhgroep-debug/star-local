import type { D1Database } from '../db/d1';
import type { ApprovalStatus } from '../../types/approval';
import { AdminQueueRepository } from '../admin/admin-queue.repository';
import { fromApprovalStatus, assertTransition, toApprovalStatus, type PublicationEngineStatus } from './status-flow';
import { publishedSiteLiveUrl } from './paths';
import { parsePublicationSnapshot } from './snapshot';
import { publishWebsiteToSitePath } from './repository';

export class PublicationEngineService {
  constructor(
    private readonly db: D1Database,
    private readonly adminRepo = new AdminQueueRepository(db),
  ) {}

  async transitionStatus(
    websiteId: string,
    target: PublicationEngineStatus,
    options: { rejectionReason?: string; rejectionCategory?: string } = {},
  ): Promise<void> {
    const record = await this.adminRepo.findById(websiteId);
    if (!record) throw new Error('Website niet gevonden.');

    const current = fromApprovalStatus(record.approvalStatus);
    if (!current) throw new Error(`Status ${record.approvalStatus} wordt niet ondersteund in de publication engine.`);

    assertTransition(current, target);

    const approvalStatus = toApprovalStatus(target);
    const updated = await this.adminRepo.updateApprovalStatus(websiteId, approvalStatus, options);
    if (!updated) throw new Error('Status bijwerken mislukt.');
  }

  async publishApprovedWebsite(websiteId: string, origin: string): Promise<{ liveUrl: string; slug: string }> {
    const record = await this.adminRepo.findByIdWithSnapshot(websiteId);
    if (!record) throw new Error('Website niet gevonden.');

    if (record.approvalStatus !== 'approved') {
      throw new Error('Alleen goedgekeurde websites kunnen worden gepubliceerd.');
    }

    const snapshot = parsePublicationSnapshot(record.configSnapshotJson);
    if (!snapshot) {
      throw new Error('Geen configuratie-snapshot beschikbaar voor publicatie.');
    }

    const liveUrl = publishedSiteLiveUrl(origin, record.slug);
    snapshot.meta = { ...snapshot.meta, publicSiteBaseUrl: liveUrl.replace(/\/$/, '') };
    snapshot.config.slug.url = `${liveUrl.replace(/\/$/, '')}/`;

    await this.adminRepo.setConfigSnapshot(websiteId, JSON.stringify(snapshot));

    const published = await publishWebsiteToSitePath(this.db, websiteId, liveUrl);
    if (!published) throw new Error('Publiceren mislukt.');

    await this.db
      .prepare(`UPDATE tenants SET status = 'active', updated_at = ? WHERE id = ?`)
      .bind(new Date().toISOString(), record.tenantId)
      .run();

    return { liveUrl, slug: record.slug };
  }

  async setConcept(websiteId: string): Promise<void> {
    await this.adminRepo.updateApprovalStatus(websiteId, 'concept');
  }

  async rejectWebsite(
    websiteId: string,
    options: { rejectionReason?: string; rejectionCategory?: string } = {},
  ): Promise<void> {
    await this.adminRepo.updateApprovalStatus(websiteId, 'rejected' as ApprovalStatus, options);
  }
}

export async function servePublishedSiteHtml(
  db: D1Database,
  slug: string,
  subPath: string,
): Promise<{ html: string } | { error: 'not_found' | 'not_published' }> {
  const { PublicationSiteRepository } = await import('./repository');
  const { renderPublishedSitePage } = await import('./snapshot');

  const repo = new PublicationSiteRepository(db);
  const site = await repo.findPublishedBySlug(slug);
  if (!site) return { error: 'not_found' };

  const html = renderPublishedSitePage(site.snapshot, subPath);
  if (!html) return { error: 'not_found' };

  return { html };
}
