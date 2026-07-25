import { getServiceImagePath } from '../service-images';

/** Local URL slug → national /diensten/ slug */
export const LOCAL_TO_NATIONAL_SLUG: Record<string, string> = {
  'website-laten-maken': 'website-laten-maken',
  'lokale-seo': 'lokale-seo',
  'google-bedrijfsprofiel': 'google-bedrijfsprofiel',
  'webshop-laten-maken': 'webshop-laten-maken',
  'technische-seo': 'technische-seo',
  'conversie-optimalisatie': 'conversie-optimalisatie',
  'hosting-en-onderhoud': 'website-onderhoud',
  'ai-seo': 'ai-seo',
};

export const LOCAL_SERVICE_SLUGS = [
  'website-laten-maken',
  'lokale-seo',
  'google-bedrijfsprofiel',
  'webshop-laten-maken',
  'technische-seo',
  'conversie-optimalisatie',
  'hosting-en-onderhoud',
  'ai-seo',
] as const;

/** @deprecated Use LOCAL_SERVICE_SLUGS */
export const BREDA_LOCAL_SERVICE_SLUGS = LOCAL_SERVICE_SLUGS;

export type BredaLocalServiceSlug = (typeof BREDA_LOCAL_SERVICE_SLUGS)[number];

export function getLocalServiceImagePath(serviceSlug: string): string {
  const nationalSlug = LOCAL_TO_NATIONAL_SLUG[serviceSlug] ?? serviceSlug;
  return getServiceImagePath(nationalSlug);
}

export function getLocalServicePath(citySlug: string, serviceSlug: string): string {
  return `/${citySlug}/${serviceSlug}/`;
}
