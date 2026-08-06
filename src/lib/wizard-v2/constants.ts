export const WIZARD_V2_STORAGE_KEY = 'starlocal-wizard-v2-v1';
export const WIZARD_V2_PATH = '/gratis-website/wizard/';

export const WIZARD_V2_STEP_LABELS = [
  'Bedrijfsgegevens',
  'Openingstijden & social',
  'Huisstijl',
] as const;

export const WIZARD_V2_COLOR_PRESETS = [
  { id: 'classic', label: 'Klassiek goud', primaryColor: '#1a2332', accentColor: '#cdb880' },
  { id: 'fresh', label: 'Fris groen', primaryColor: '#0f2e24', accentColor: '#25d366' },
  { id: 'professional', label: 'Professioneel blauw', primaryColor: '#0f1f33', accentColor: '#4a90d9' },
] as const;

export { FONT_OPTIONS, BUILDER_INDUSTRIES, filterIndustries, createDefaultHours, WORKDAY_KEYS } from '../builder/constants';
