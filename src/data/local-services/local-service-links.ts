import { getLocalServicePath, LOCAL_TO_NATIONAL_SLUG } from './config';

/** Map national diensten slug → local service slug */
export const NATIONAL_TO_LOCAL_SERVICE: Partial<Record<string, string>> = {
  ...Object.fromEntries(
    Object.entries(LOCAL_TO_NATIONAL_SLUG).map(([local, national]) => [national, local]),
  ),
};

export function getLocalServiceHref(citySlug: string, nationalServiceSlug: string): string | undefined {
  const localSlug = NATIONAL_TO_LOCAL_SERVICE[nationalServiceSlug];
  if (!localSlug) return undefined;
  return getLocalServicePath(citySlug, localSlug);
}

export function getLocalServiceHrefForGemeenteCard(citySlug: string, serviceHref: string): string {
  const match = serviceHref.match(/\/diensten\/([^/]+)\/?$/);
  if (!match) return serviceHref;
  return getLocalServiceHref(citySlug, match[1]) ?? serviceHref;
}
