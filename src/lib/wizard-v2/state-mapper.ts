import type { BuilderState } from '../../types/builder';
import type { WizardV2State } from '../../types/wizard-v2';
import type { BuilderFiles } from '../builder/files';
import { createEmptyFiles } from '../builder/files';
import { createDefaultState } from '../builder/storage';
import { readableTextColor } from '../builder/colors';
import type { WizardResolvedMedia } from './media';

/** Maps wizard state to the shared builder model for preview rendering. */
export function mapWizardToBuilderState(wizard: WizardV2State): BuilderState {
  const base = createDefaultState();

  return {
    ...base,
    business: {
      ...base.business,
      name: wizard.businessName,
      industry: wizard.industry,
      description: wizard.description,
    },
    contact: {
      ...base.contact,
      phone: wizard.phone,
      whatsapp: wizard.whatsapp,
      email: wizard.email,
      website: wizard.website,
      street: wizard.street,
      postcode: wizard.postcode,
      city: wizard.city,
    },
    hours: wizard.hours,
    branding: {
      ...base.branding,
      primaryColor: wizard.primaryColor,
      accentColor: wizard.accentColor,
      textColor: readableTextColor(wizard.primaryColor),
    },
    design: {
      ...base.design,
      fontFamily: wizard.fontFamily,
    },
  };
}

/** Maps resolved media to builder file handles for preview. */
export function mapWizardMediaToBuilderFiles(media: WizardResolvedMedia): BuilderFiles {
  const files = createEmptyFiles();
  files.logoUrl = media.logo.url;
  files.logoName = media.logo.label;
  files.heroUrl = media.hero.url;
  files.heroName = media.hero.label;
  files.photoUrls = media.gallery.map((item) => item.url);
  files.photoNames = media.gallery.map((item) => item.label);
  return files;
}

export function formatSocialUrl(value: string, fallbackPrefix: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${fallbackPrefix}${trimmed.replace(/^@/, '')}`;
}
