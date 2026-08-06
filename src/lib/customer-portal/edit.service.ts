import type { SaveWebsitePayload } from '../../types/save';
import type { BuilderState } from '../../types/builder';
import type { D1Database } from '../db/d1';
import { configAsBuilderState } from '../builder/website-config';
import { createEmptyFiles } from '../builder/files';
import { buildPublicationSnapshot, parsePublicationSnapshot, serializePublicationSnapshot } from '../publication-engine/snapshot';
import type { WizardV2SocialLinks } from '../../types/wizard-v2';
import { WebsitePermissionRepository } from './repositories';

export interface CustomerWebsiteEditPayload {
  websiteId: string;
  tenantId: string;
  businessName?: string;
  industry?: string;
  description?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  street?: string;
  postcode?: string;
  city?: string;
  hours?: SaveWebsitePayload['hours'];
  services?: SaveWebsitePayload['business']['services'];
  social?: { facebook?: string; instagram?: string; linkedin?: string };
  seoMetaDescription?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

function applyEdit(base: BuilderState, input: CustomerWebsiteEditPayload): BuilderState {
  return {
    ...base,
    business: {
      ...base.business,
      name: input.businessName ?? base.business.name,
      industry: input.industry ?? base.business.industry,
      description: input.description ?? base.business.description,
      services: input.services ?? base.business.services,
    },
    contact: {
      ...base.contact,
      phone: input.phone ?? base.contact.phone,
      whatsapp: input.whatsapp ?? base.contact.whatsapp,
      email: input.email ?? base.contact.email,
      website: input.website ?? base.contact.website,
      street: input.street ?? base.contact.street,
      postcode: input.postcode ?? base.contact.postcode,
      city: input.city ?? base.contact.city,
    },
    hours: input.hours ?? base.hours,
    seoMetaDescription: input.seoMetaDescription ?? base.seoMetaDescription,
    heroTitle: input.heroTitle ?? base.heroTitle,
    heroSubtitle: input.heroSubtitle ?? base.heroSubtitle,
  };
}

export class CustomerEditService {
  constructor(private readonly db: D1Database) {}

  async saveEdits(customerId: string, input: CustomerWebsiteEditPayload): Promise<{ pendingReview: boolean }> {
    const permissions = new WebsitePermissionRepository(this.db);
    if (!(await permissions.hasAccess(customerId, input.websiteId))) {
      throw new Error('Geen toegang tot deze website.');
    }

    const websiteRow = await this.db
      .prepare('SELECT approval_status, config_snapshot_json FROM websites WHERE id = ? LIMIT 1')
      .bind(input.websiteId)
      .first<{ approval_status: string; config_snapshot_json: string | null }>();
    if (!websiteRow?.config_snapshot_json) throw new Error('Websitegegevens niet gevonden.');

    const snapshot = parsePublicationSnapshot(websiteRow.config_snapshot_json);
    if (!snapshot) throw new Error('Configuratie kon niet worden geladen.');

    const nextState = applyEdit(configAsBuilderState(snapshot.config), input);
    const files = createEmptyFiles();
    const nextSnapshot = buildPublicationSnapshot(nextState, files, {
      publicSiteBaseUrl: snapshot.meta?.publicSiteBaseUrl ?? `https://preview.local/sites/${input.tenantId}`,
      socialLinks: {
        facebook: input.social?.facebook ?? snapshot.meta?.socialLinks?.facebook ?? '',
        instagram: input.social?.instagram ?? snapshot.meta?.socialLinks?.instagram ?? '',
        linkedin: input.social?.linkedin ?? snapshot.meta?.socialLinks?.linkedin ?? '',
      },
    });

    const now = new Date().toISOString();
    const isPublished = websiteRow.approval_status === 'published';

    if (isPublished) {
      await this.db
        .prepare(
          `UPDATE websites SET pending_snapshot_json = ?, pending_changes_status = 'in_review', updated_at = ? WHERE id = ?`,
        )
        .bind(serializePublicationSnapshot(nextSnapshot), now, input.websiteId)
        .run();
    } else {
      await this.db
        .prepare(
          `UPDATE websites SET config_snapshot_json = ?, pending_changes_status = 'none', pending_snapshot_json = NULL, updated_at = ? WHERE id = ?`,
        )
        .bind(serializePublicationSnapshot(nextSnapshot), now, input.websiteId)
        .run();
    }

    await this.db
      .prepare(`UPDATE tenants SET name = ?, branche = ?, description = ?, updated_at = ? WHERE id = ?`)
      .bind(nextState.business.name.trim(), nextState.business.industry.trim(), nextState.business.description.trim(), now, input.tenantId)
      .run();

    await this.db
      .prepare(
        `UPDATE contacts SET telefoon = ?, whatsapp = ?, email = ?, website = ?, adres = ?, postcode = ?, plaats = ?, updated_at = ? WHERE tenant_id = ?`,
      )
      .bind(
        nextState.contact.phone,
        nextState.contact.whatsapp,
        nextState.contact.email,
        nextState.contact.website,
        nextState.contact.street,
        nextState.contact.postcode,
        nextState.contact.city,
        now,
        input.tenantId,
      )
      .run();

    return { pendingReview: isPublished };
  }

  async loadEditData(customerId: string, websiteId: string, tenantId: string): Promise<CustomerWebsiteEditPayload & { statusLabel: string; pendingChangesStatus: string }> {
    const permissions = new WebsitePermissionRepository(this.db);
    if (!(await permissions.hasAccess(customerId, websiteId))) {
      throw new Error('Geen toegang tot deze website.');
    }

    const websiteRow = await this.db
      .prepare(
        `SELECT approval_status, pending_changes_status, config_snapshot_json, pending_snapshot_json
         FROM websites WHERE id = ? AND tenant_id = ? LIMIT 1`,
      )
      .bind(websiteId, tenantId)
      .first<{
        approval_status: string;
        pending_changes_status: string;
        config_snapshot_json: string | null;
        pending_snapshot_json: string | null;
      }>();
    if (!websiteRow?.config_snapshot_json) throw new Error('Websitegegevens niet gevonden.');

    const snapshot = parsePublicationSnapshot(websiteRow.config_snapshot_json);
    if (!snapshot) throw new Error('Configuratie kon niet worden geladen.');

    const state = configAsBuilderState(snapshot.config);
    const social: WizardV2SocialLinks = {
      facebook: snapshot.meta?.socialLinks?.facebook ?? '',
      instagram: snapshot.meta?.socialLinks?.instagram ?? '',
      linkedin: snapshot.meta?.socialLinks?.linkedin ?? '',
    };

    return {
      websiteId,
      tenantId,
      businessName: state.business.name,
      industry: state.business.industry,
      description: state.business.description,
      phone: state.contact.phone,
      whatsapp: state.contact.whatsapp,
      email: state.contact.email,
      website: state.contact.website,
      street: state.contact.street,
      postcode: state.contact.postcode,
      city: state.contact.city,
      hours: state.hours,
      services: state.business.services,
      social: {
        facebook: social.facebook ?? '',
        instagram: social.instagram ?? '',
        linkedin: social.linkedin ?? '',
      },
      seoMetaDescription: state.seoMetaDescription,
      heroTitle: state.heroTitle,
      heroSubtitle: state.heroSubtitle,
      statusLabel: websiteRow.approval_status,
      pendingChangesStatus: websiteRow.pending_changes_status,
    };
  }
}
