import type { DayHours, DayKey } from '../../types/builder';
import { DEFAULT_DESIGN_SETTINGS } from '../../types/builder';

export { DEFAULT_DESIGN_SETTINGS };

export const BUILDER_STORAGE_KEY = 'starlocal-website-builder-v1';

export const MAX_LOGO_SIZE = 5 * 1024 * 1024;
export const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
export const MAX_PHOTOS = 5;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const BUILDER_START_PATH = '/gratis-website/start/';

export const DAY_DEFINITIONS: { key: DayKey; label: string }[] = [
  { key: 'monday', label: 'Maandag' },
  { key: 'tuesday', label: 'Dinsdag' },
  { key: 'wednesday', label: 'Woensdag' },
  { key: 'thursday', label: 'Donderdag' },
  { key: 'friday', label: 'Vrijdag' },
  { key: 'saturday', label: 'Zaterdag' },
  { key: 'sunday', label: 'Zondag' },
];

export const WORKDAY_KEYS: DayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export { BUILDER_INDUSTRIES, filterIndustries } from '../../data/builder/industries';

export const COLOR_PRESETS = [
  {
    id: 'classic',
    label: 'Klassiek goud',
    primaryColor: '#1a2332',
    accentColor: '#cdb880',
  },
  {
    id: 'fresh',
    label: 'Fris groen',
    primaryColor: '#0f2e24',
    accentColor: '#25d366',
  },
  {
    id: 'professional',
    label: 'Professioneel blauw',
    primaryColor: '#0f1f33',
    accentColor: '#4a90d9',
  },
] as const;

export function createDefaultHours(): DayHours[] {
  return DAY_DEFINITIONS.map(({ key, label }) => ({
    day: label,
    dayKey: key,
    closed: key === 'sunday',
    open24: false,
    openTime: '09:00',
    closeTime: '17:00',
  }));
}

export function createServiceId(): string {
  return `svc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
