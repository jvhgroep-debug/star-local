import type { D1Database } from '../db/d1';
import type { R2Bucket } from '../media/r2';
import { createRepositories } from '../db';
import { AdminQueueRepository } from '../admin/admin-queue.repository';
import { loadActivePublicationPackage } from './package-reader';
import { deployPublicationPackageToR2 } from './r2-deploy.service';
import { productionBaseUrl } from '../../config/publication';
import { sendPublicationLiveEmail, sendAdminPublicationNotification } from '../email/admin-notifications';

export interface GoLiveResult {
  ok: true;
  liveUrl: string;
  versionLabel: string;
  siteObjectCount: number;
  archiveObjectCount: number;
}

export interface GoLiveFailure {
  ok: false;
  message: string;
}

export async function goLivePublicationPackage(input: {
  db: D1Database;
  media: R2Bucket;
  websiteId: string;
  versionLabel?: string;
  resend?: { apiKey: string; fromEmail: string; adminEmail?: string };
  ownerEmail?: string;
}): Promise<GoLiveResult | GoLiveFailure> {
  const repo = new AdminQueueRepository(input.db);
  const repos = createRepositories(input.db);

  const record = await repo.findById(input.websiteId);
  if (!record) {
    return { ok: false, message: 'Website niet gevonden.' };
  }

  if (record.approvalStatus !== 'package_ready' && record.approvalStatus !== 'published') {
    return { ok: false, message: 'Alleen websites met status Publicatiepakket gereed kunnen live gaan.' };
  }

  const tenantId = record.tenantId;
  if (!tenantId) {
    return { ok: false, message: 'Tenant-ID ontbreekt.' };
  }

  const version = input.versionLabel ?? record.activePublicationVersion;
  if (!version) {
    return { ok: false, message: 'Geen actieve publicatieversie gevonden.' };
  }

  const loaded = await loadActivePublicationPackage(input.db, input.websiteId, version);
  if (!loaded) {
    return { ok: false, message: 'Publicatiepakket niet gevonden op schijf.' };
  }

  try {
    const deploy = await deployPublicationPackageToR2({
      bucket: input.media,
      tenantId,
      websiteId: input.websiteId,
      versionLabel: version,
      packageRoot: loaded.packageRoot,
    });

    const liveUrl = productionBaseUrl(record.slug);

    await repos.tenants.update(tenantId, {
      status: 'active',
      updatedAt: new Date().toISOString(),
    });

    await repo.markPublished(input.websiteId, liveUrl);

    await input.db
      .prepare(
        `UPDATE publication_versions SET status = 'published'
         WHERE website_id = ? AND version_label = ?`,
      )
      .bind(input.websiteId, version)
      .run();

    if (input.resend?.apiKey && input.resend.fromEmail) {
      if (input.ownerEmail) {
        await sendPublicationLiveEmail(input.resend.apiKey, input.resend.fromEmail, {
          to: input.ownerEmail,
          businessName: record.businessName,
          liveUrl,
          versionLabel: version,
        }).catch(() => undefined);
      }

      if (input.resend.adminEmail) {
        await sendAdminPublicationNotification(input.resend.apiKey, input.resend.fromEmail, {
          to: input.resend.adminEmail,
          businessName: record.businessName,
          liveUrl,
          versionLabel: version,
        }).catch(() => undefined);
      }
    }

    return {
      ok: true,
      liveUrl,
      versionLabel: version,
      siteObjectCount: deploy.siteObjectCount,
      archiveObjectCount: deploy.archiveObjectCount,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Go-live mislukt.';
    return { ok: false, message };
  }
}
