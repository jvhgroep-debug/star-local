import type { PreparedWebsite } from '../../types/website-config';
import type { PublishSiteArtifacts, PublishWebsitePayload } from '../../types/publish';

async function blobUrlToDataUrl(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  if (!url.startsWith('blob:')) return url;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

async function inlineBlobUrlsInHtml(html: string, replacements: Map<string, string>): Promise<string> {
  let output = html;
  for (const [blobUrl, dataUrl] of replacements) {
    output = output.split(blobUrl).join(dataUrl);
  }
  return output;
}

/** Inline blob media URLs in generated HTML so production pages keep working after publish. */
export async function prepareSiteArtifactsForPublish(prepared: PreparedWebsite): Promise<PublishSiteArtifacts> {
  if (!prepared.documents || !prepared.sitemap || !prepared.robots || !prepared.manifest || !prepared.faviconSvg) {
    throw new Error('Gegenereerde websitebestanden ontbreken. Publiceer opnieuw vanuit de builder.');
  }

  const blobUrls = new Set<string>();
  const collect = (value: string | null | undefined) => {
    if (value?.startsWith('blob:')) blobUrls.add(value);
  };

  collect(prepared.config.media.logoUrl);
  prepared.config.media.photoUrls.forEach(collect);
  collect(prepared.config.media.heroImageUrl);
  prepared.config.media.galleryImageUrls.forEach(collect);

  const replacements = new Map<string, string>();
  for (const blobUrl of blobUrls) {
    const dataUrl = await blobUrlToDataUrl(blobUrl);
    if (dataUrl) replacements.set(blobUrl, dataUrl);
  }

  const documents = {} as PublishSiteArtifacts['documents'];
  for (const [page, html] of Object.entries(prepared.documents) as [keyof PublishSiteArtifacts['documents'], string][]) {
    documents[page] = await inlineBlobUrlsInHtml(html, replacements);
  }

  return {
    documents,
    sitemap: prepared.sitemap,
    robots: prepared.robots,
    manifest: prepared.manifest,
    faviconSvg: prepared.faviconSvg,
  };
}

export function buildPublishPayload(
  prepared: PreparedWebsite,
  siteArtifacts: PublishSiteArtifacts,
  options: {
    package: PublishWebsitePayload['package'];
    publishEmail: string;
    hasLogo: boolean;
    photoCount: number;
  },
): PublishWebsitePayload {
  const { config } = prepared;

  return {
    business: config.business,
    contact: config.contact,
    hours: config.hours,
    branding: {
      primaryColor: config.branding.primaryColor,
      accentColor: config.branding.accentColor,
      logoName: config.media.logoName || config.branding.logoName,
    },
    package: options.package,
    publishEmail: options.publishEmail,
    hasLogo: options.hasLogo,
    photoCount: options.photoCount,
    siteArtifacts,
  };
}

export async function publishWebsiteToD1(payload: PublishWebsitePayload): Promise<import('../../types/publish').PublishWebsiteResponse> {
  const response = await fetch('/api/website/publish/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  try {
    return (await response.json()) as import('../../types/publish').PublishWebsiteResponse;
  } catch {
    return { ok: false, message: 'Onverwacht antwoord van de server.' };
  }
}
