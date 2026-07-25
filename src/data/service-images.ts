/**
 * Service card images live in /public/images/services/.
 *
 * Convention: service-{slug}.png (e.g. service-ai-seo.png for slug "ai-seo").
 * Slugs with non-standard filenames are listed in SERVICE_IMAGE_FILES.
 */
export const SERVICE_IMAGES_DIR = '/images/services';

/** Explicit filename per service slug when it differs from service-{slug}.png */
export const SERVICE_IMAGE_FILES: Record<string, string> = {
  'website-laten-maken': 'service-website-laten-maken.png',
  'webshop-laten-maken': 'service-webshop-laten-maken.png',
  'lokale-seo': 'service-lokale-seo.png',
  'landelijke-seo': 'service-lokale-seo.png',
  'ai-seo': 'service-ai-seo.png',
  'google-bedrijfsprofiel': 'service-google-bedrijfsprofiel.png',
  'website-onderhoud': 'service-hosting-onderhoud.png',
  'hosting': 'service-hosting-onderhoud.png',
  'domeinnaam-registratie': 'service-domeinnaam-registratie.png',
  'shopify-ontwikkeling': 'service-shopify-ontwikkeling.png',
  'wordpress-ontwikkeling': 'service-wordpress-ontwikkeling.png',
  'technische-seo': 'service-technische-seo.png',
  'website-snelheid-optimaliseren': 'service-website-snelheid-optimalisatie.png',
  'seo-audit': 'service-technische-seo.png',
  'conversie-optimalisatie': 'service-conversie-optimalisatie.png',
  'linkbuilding': 'service-linkbuilding.png',
  'ai-content': 'service-ai-seo.png',
};

export function getServiceImageFilename(slug: string): string {
  return SERVICE_IMAGE_FILES[slug] ?? `service-${slug}.png`;
}

export function getServiceImagePath(slug: string): string {
  return `${SERVICE_IMAGES_DIR}/${getServiceImageFilename(slug)}`;
}

export function getServiceSlugFromHref(href: string): string | undefined {
  const match = href.match(/\/diensten\/([^/]+)\/?$/);
  return match?.[1];
}

export function getServiceImagePathFromHref(href: string): string | undefined {
  const slug = getServiceSlugFromHref(href);
  return slug ? getServiceImagePath(slug) : undefined;
}
