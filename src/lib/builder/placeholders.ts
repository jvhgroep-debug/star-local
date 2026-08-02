/** Neutral SaaS placeholders — no real tenant or test data. */
export const BUILDER_PLACEHOLDERS = {
  businessName: 'Uw bedrijfsnaam',
  industry: 'Uw branche',
  description: 'Beschrijf kort uw bedrijf',
  city: 'uw plaats',
  region: 'uw regio',
  domain: 'uw-bedrijf.starlocal.nl',
} as const;

export function placeholderBusinessName(value: string): string {
  return value.trim() || BUILDER_PLACEHOLDERS.businessName;
}

export function placeholderIndustry(value: string): string {
  return value.trim() || BUILDER_PLACEHOLDERS.industry;
}

export function placeholderDescription(value: string): string {
  return value.trim() || BUILDER_PLACEHOLDERS.description;
}

export function placeholderCity(value: string): string {
  return value.trim() || BUILDER_PLACEHOLDERS.city;
}

export function placeholderRegion(value: string): string {
  return value.trim() || BUILDER_PLACEHOLDERS.region;
}
