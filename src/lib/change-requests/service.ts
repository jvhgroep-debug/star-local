import type { CreateChangeRequestInput } from '../../types/change-request';
import {
  CHANGE_REQUEST_TYPES,
  CHANGE_REQUEST_TYPE_LABELS,
} from '../../types/change-request';
import type { D1Database } from '../db/d1';
import { resolvePendingMedia, type MediaFileInput } from '../media/pending-media.resolver';
import { WebsitePermissionRepository } from '../customer-portal/repositories';
import { ChangeRequestRepository } from './repository';

const MAX_DESCRIPTION = 5000;

export interface CreateChangeRequestPayload extends CreateChangeRequestInput {
  mediaFile?: MediaFileInput | null;
}

export class ChangeRequestService {
  private readonly db: D1Database;
  private readonly repo: ChangeRequestRepository;
  private readonly permissions: WebsitePermissionRepository;

  constructor(db: D1Database) {
    this.db = db;
    this.repo = new ChangeRequestRepository(db);
    this.permissions = new WebsitePermissionRepository(db);
  }

  async createForCustomer(
    customerId: string,
    payload: CreateChangeRequestPayload,
  ) {
    const websiteId = payload.websiteId?.trim();
    if (!websiteId) throw new Error('Website is verplicht.');

    if (!CHANGE_REQUEST_TYPES.includes(payload.requestType)) {
      throw new Error('Ongeldig type wijzigingsverzoek.');
    }

    const description = payload.description?.trim();
    if (!description || description.length < 10) {
      throw new Error('Omschrijving is verplicht (minimaal 10 tekens).');
    }
    if (description.length > MAX_DESCRIPTION) {
      throw new Error(`Omschrijving mag maximaal ${MAX_DESCRIPTION} tekens bevatten.`);
    }

    const hasAccess = await this.permissions.hasAccess(customerId, websiteId);
    if (!hasAccess) {
      throw new Error('U heeft geen toegang tot deze website.');
    }

    const websiteRow = await this.db
      .prepare('SELECT tenant_id FROM websites WHERE id = ? LIMIT 1')
      .bind(websiteId)
      .first<{ tenant_id: string }>();

    if (!websiteRow) throw new Error('Website niet gevonden.');

    let mediaMetadata = null;
    let requestedLocation = payload.requestedLocation?.trim().slice(0, 120) || null;

    if (payload.requestType === 'photo' || payload.requestType === 'logo') {
      const resolved = resolvePendingMedia(payload.mediaFile ?? null);
      if (!resolved && payload.requestType === 'photo') {
        throw new Error('Selecteer een foto en vul de gewenste positie in.');
      }
      if (resolved) {
        mediaMetadata = resolved.metadata;
        requestedLocation = requestedLocation || String(resolved.metadata.placement ?? 'other');
      }
    }

    const record = await this.repo.create({
      customerId,
      websiteId,
      tenantId: websiteRow.tenant_id,
      requestType: payload.requestType,
      description,
      mediaMetadata,
      requestedLocation,
    });

    return {
      record,
      typeLabel: CHANGE_REQUEST_TYPE_LABELS[payload.requestType],
      message:
        'Uw wijzigingsverzoek is ingediend. Star Local beoordeelt het handmatig — uw live website wordt niet automatisch aangepast.',
    };
  }

  listForCustomer(customerId: string) {
    return this.repo.listForCustomer(customerId);
  }

  listForAdmin() {
    return this.repo.listForAdmin();
  }

  async updateStatusAdmin(
    id: string,
    status: string,
    adminNotes?: string | null,
  ) {
    const allowed = ['pending', 'in_progress', 'approved', 'rejected', 'completed'] as const;
    if (!allowed.includes(status as (typeof allowed)[number])) {
      throw new Error('Ongeldige status.');
    }
    const updated = await this.repo.updateStatus(
      id,
      status as (typeof allowed)[number],
      adminNotes?.trim().slice(0, 2000) || null,
    );
    if (!updated) throw new Error('Wijzigingsverzoek niet gevonden.');
    return updated;
  }
}
