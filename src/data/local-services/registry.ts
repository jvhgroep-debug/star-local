import gemeentes from '../gemeentes.json';
import type { GemeenteRecord } from '../gemeentes/types';
import { getBredaLocalService } from './breda';
import { buildLocalServicePageContent, LOCAL_SERVICE_SLUGS } from './build-content';
import type { LocalServicePageContent } from './types';

export function getLocalServicePageContent(
  citySlug: string,
  serviceSlug: string,
): LocalServicePageContent | undefined {
  if (citySlug === 'breda') {
    return getBredaLocalService(serviceSlug) ?? buildLocalServicePageContent(
      (gemeentes as GemeenteRecord[]).find((g) => g.slug === 'breda')!,
      serviceSlug,
    );
  }

  const gemeente = (gemeentes as GemeenteRecord[]).find((g) => g.slug === citySlug);
  if (!gemeente) return undefined;
  return buildLocalServicePageContent(gemeente, serviceSlug);
}

export function getLocalServiceStaticPaths() {
  const paths: Array<{ params: { city: string; service: string }; props: { content: LocalServicePageContent } }> = [];

  for (const gemeente of gemeentes as GemeenteRecord[]) {
    for (const serviceSlug of LOCAL_SERVICE_SLUGS) {
      const content = getLocalServicePageContent(gemeente.slug, serviceSlug);
      if (!content) continue;
      paths.push({
        params: { city: gemeente.slug, service: serviceSlug },
        props: { content },
      });
    }
  }

  return paths;
}

export function hasLocalServicePages(_citySlug: string): boolean {
  return true;
}

export { LOCAL_SERVICE_SLUGS };
