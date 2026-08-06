import type { WizardMediaAsset } from './types';

/** Static placeholder assets — swap resolver output when R2 uploads are wired. */
export const WIZARD_PLACEHOLDER_LOGO: WizardMediaAsset = {
  url: '/images/personal-service.svg',
  label: 'Logo placeholder',
  source: 'placeholder',
};

export const WIZARD_PLACEHOLDER_HERO: WizardMediaAsset = {
  url: '/images/hero-local-business.svg',
  label: 'Hero-afbeelding placeholder',
  source: 'placeholder',
};

export const WIZARD_PLACEHOLDER_GALLERY: WizardMediaAsset[] = [
  { url: '/images/projects/placeholder.svg', label: 'Galerij 1', source: 'placeholder' },
  { url: '/images/regional-expertise.svg', label: 'Galerij 2', source: 'placeholder' },
  { url: '/images/seo-growth.svg', label: 'Galerij 3', source: 'placeholder' },
];
