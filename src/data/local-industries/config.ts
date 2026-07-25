export function getLocalIndustryPath(
  citySlug: string,
  serviceSlug: string,
  industrySlug: string,
): string {
  return `/${citySlug}/${serviceSlug}/${industrySlug}/`;
}

export { INDUSTRY_SLUGS } from './industries';
