import gemeentes from '../gemeentes.json';
import type { GemeenteRecord } from '../gemeentes/types';
import {
  buildIndustryLocalServicePageContent,
  getIndustryLinksForService,
  INDUSTRY_SLUGS,
} from './build-content';
import type { IndustryLocalServicePageContent, IndustryLocalServiceRelated } from './types';

/** Services that have branche × gemeente pages */
export const INDUSTRY_ENABLED_SERVICES = ['website-laten-maken'] as const;

export type IndustryEnabledService = (typeof INDUSTRY_ENABLED_SERVICES)[number];

export function getIndustryLocalServicePageContent(
  citySlug: string,
  serviceSlug: string,
  industrySlug: string,
): IndustryLocalServicePageContent | undefined {
  if (!INDUSTRY_ENABLED_SERVICES.includes(serviceSlug as IndustryEnabledService)) return undefined;
  const gemeente = (gemeentes as GemeenteRecord[]).find((g) => g.slug === citySlug);
  if (!gemeente) return undefined;
  return buildIndustryLocalServicePageContent(gemeente, industrySlug);
}

export function getIndustryLocalServiceStaticPaths() {
  const paths: Array<{ params: { city: string; service: string; industry: string }; props: { content: IndustryLocalServicePageContent } }> = [];

  for (const gemeente of gemeentes as GemeenteRecord[]) {
    for (const serviceSlug of INDUSTRY_ENABLED_SERVICES) {
      for (const industrySlug of INDUSTRY_SLUGS) {
        const content = buildIndustryLocalServicePageContent(gemeente, industrySlug);
        if (!content) continue;
        paths.push({
          params: { city: gemeente.slug, service: serviceSlug, industry: industrySlug },
          props: { content },
        });
      }
    }
  }

  return paths;
}

export function hasIndustryLocalServicePages(_citySlug: string, serviceSlug: string): boolean {
  return INDUSTRY_ENABLED_SERVICES.includes(serviceSlug as IndustryEnabledService);
}

export function getIndustryLinksForLocalService(
  citySlug: string,
  cityName: string,
  serviceSlug: string,
): IndustryLocalServiceRelated[] {
  if (!hasIndustryLocalServicePages(citySlug, serviceSlug)) return [];
  return getIndustryLinksForService(citySlug, cityName);
}

export { INDUSTRY_SLUGS };
