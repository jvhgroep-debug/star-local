import type { SaveWebsiteResponse } from '../../types/save';
import type { WizardV2State } from '../../types/wizard-v2';
import { buildWizardV2SavePayload } from './save-mapper';

export interface WizardSaveResult {
  websiteId: string;
  tenantId: string;
  slug: string;
  approvalStatus: 'concept' | 'pending_review';
}

async function postSavePayload(payload: ReturnType<typeof buildWizardV2SavePayload>): Promise<WizardSaveResult> {
  const response = await fetch('/api/website/save/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as SaveWebsiteResponse;
  if (!response.ok || !data.ok) {
    throw new Error(data.ok ? 'Opslaan mislukt.' : data.message);
  }

  return {
    websiteId: data.result.websiteId,
    tenantId: data.result.tenantId,
    slug: data.result.slug,
    approvalStatus: payload.approvalStatus === 'pending_review' ? 'pending_review' : 'concept',
  };
}

export async function saveWizardAsConcept(wizard: WizardV2State, origin: string): Promise<WizardSaveResult> {
  const payload = buildWizardV2SavePayload(wizard, {
    publicSiteBaseUrl: `${origin.replace(/\/$/, '')}/sites/preview`,
    approvalStatus: 'concept',
  });
  return postSavePayload(payload);
}

export async function submitWizardForReview(wizard: WizardV2State, origin: string): Promise<WizardSaveResult> {
  const payload = buildWizardV2SavePayload(wizard, {
    publicSiteBaseUrl: `${origin.replace(/\/$/, '')}/sites/preview`,
    approvalStatus: 'pending_review',
  });
  return postSavePayload(payload);
}
