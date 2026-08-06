import type { SaveWebsitePayload } from '../../types/save';
import type { WizardV2State } from '../../types/wizard-v2';
import { createServiceId } from '../builder/constants';
import { buildPublicationSnapshot, serializePublicationSnapshot } from '../publication-engine/snapshot';
import { mapWizardMediaToBuilderFiles, mapWizardToBuilderState } from './state-mapper';
import { resolveWizardMedia } from './media';

export function buildWizardV2SavePayload(
  wizard: WizardV2State,
  options: { publicSiteBaseUrl: string; approvalStatus?: SaveWebsitePayload['approvalStatus'] },
): SaveWebsitePayload {
  const builderState = mapWizardToBuilderState(wizard);
  const media = resolveWizardMedia(wizard);
  const files = mapWizardMediaToBuilderFiles(media);

  if (!builderState.business.services.some((service) => service.title.trim())) {
    builderState.business.services = [
      {
        id: createServiceId(),
        title: wizard.industry.trim() || 'Onze diensten',
        description: wizard.description.trim(),
      },
    ];
  }

  const snapshot = buildPublicationSnapshot(builderState, files, {
    publicSiteBaseUrl: options.publicSiteBaseUrl,
    socialLinks: wizard.social,
  });

  return {
    business: builderState.business,
    contact: builderState.contact,
    location: builderState.location,
    hours: builderState.hours,
    branding: {
      primaryColor: wizard.primaryColor,
      accentColor: wizard.accentColor,
    },
    design: builderState.design,
    package: 'free',
    media: [],
    seoMetaDescription: wizard.description.trim().slice(0, 160),
    enabledPages: builderState.enabledPages,
    approvalStatus: options.approvalStatus ?? 'concept',
    configSnapshotJson: serializePublicationSnapshot(snapshot),
    saveMode: 'concept_v2',
  };
}
