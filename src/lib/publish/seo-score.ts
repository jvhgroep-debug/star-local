import type { PreviewPage } from '../../types/builder';
import type { PageSeoBundle } from '../builder/generator/seo';
import type { WebsiteConfig } from '../../types/website-config';
import { WEBSITE_PAGES } from '../../types/website-config';

const SEO_CHECKS = {
  titleMinLength: 10,
  titleMaxLength: 70,
  descriptionMinLength: 50,
  descriptionMaxLength: 160,
};

function scorePageSeo(seo: PageSeoBundle, html: string): { earned: number; max: number } {
  let earned = 0;
  const max = 10;

  if (seo.title.trim().length >= SEO_CHECKS.titleMinLength && seo.title.length <= SEO_CHECKS.titleMaxLength) {
    earned += 2;
  } else if (seo.title.trim().length > 0) {
    earned += 1;
  }

  if (
    seo.description.trim().length >= SEO_CHECKS.descriptionMinLength &&
    seo.description.length <= SEO_CHECKS.descriptionMaxLength
  ) {
    earned += 2;
  } else if (seo.description.trim().length > 0) {
    earned += 1;
  }

  if (seo.canonicalUrl.startsWith('http')) earned += 1;
  if (seo.ogTitle.trim().length > 0) earned += 1;
  if (seo.ogDescription.trim().length > 0) earned += 1;

  if (html.includes('property="og:title"')) earned += 1;
  if (html.includes('name="twitter:card"')) earned += 1;
  if (html.includes('application/ld+json')) earned += 1;

  return { earned, max };
}

/** Compute SEO score (0–100) from generated pages and SEO bundles. */
export function computeSeoScore(
  documents: Record<PreviewPage, string>,
  seoByPage: Record<PreviewPage, PageSeoBundle>,
): number {
  let earned = 0;
  let max = 0;

  for (const page of WEBSITE_PAGES) {
    const pageScore = scorePageSeo(seoByPage[page], documents[page] ?? '');
    earned += pageScore.earned;
    max += pageScore.max;
  }

  if (max === 0) return 0;
  return Math.round((earned / max) * 100);
}

/** Count embedded images in generated HTML documents. */
export function countPackageImages(config: WebsiteConfig, documents: Record<PreviewPage, string>): number {
  const unique = new Set<string>();

  const mediaUrls = [
    config.media.logoUrl,
    config.media.heroImageUrl,
    config.media.socialImageUrl,
    ...config.media.photoUrls,
    ...config.media.galleryImageUrls,
  ].filter(Boolean) as string[];

  mediaUrls.forEach((url) => unique.add(url));

  for (const html of Object.values(documents)) {
    const matches = html.matchAll(/<img[^>]+src="([^"]+)"/gi);
    for (const match of matches) {
      if (match[1]) unique.add(match[1]);
    }
  }

  return unique.size;
}
