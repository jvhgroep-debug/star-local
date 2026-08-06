import type { WebsiteConfig } from '../../types/website-config';

/** Strip media URLs from config before persisting in D1 (rehydrate from R2 on preview). */
export function stripConfigForAdminSnapshot(config: WebsiteConfig): WebsiteConfig {
  const schema = { ...config.localBusinessSchema };
  delete schema.image;

  return {
    ...config,
    localBusinessSchema: schema,
    media: {
      logoUrl: null,
      logoName: config.media.logoName,
      photoUrls: [],
      photoNames: [...config.media.photoNames],
      heroImageUrl: null,
      galleryImageUrls: [],
      socialImageUrl: null,
      socialImageName: config.media.socialImageName,
    },
  };
}

export function serializeConfigSnapshot(config: WebsiteConfig): string {
  return JSON.stringify(stripConfigForAdminSnapshot(config));
}

export function parseConfigSnapshot(raw: string | null | undefined): WebsiteConfig | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as WebsiteConfig;
  } catch {
    return null;
  }
}
