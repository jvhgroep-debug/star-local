import type { BuilderBranding, BuilderBusiness, BuilderContact, DayHours, PreviewPage } from './builder';
import type { WebsitePackage } from './website-config';
import type { WebsiteStatus } from './tenant';

/** Generated site files uploaded to production storage on publish. */
export interface PublishSiteArtifacts {
  documents: Record<PreviewPage, string>;
  sitemap: string;
  robots: string;
  manifest: string;
  faviconSvg: string;
}

/** JSON payload sent from the builder to the publish API. */
export interface PublishWebsitePayload {
  business: BuilderBusiness;
  contact: BuilderContact;
  hours: DayHours[];
  branding: Pick<BuilderBranding, 'primaryColor' | 'accentColor' | 'logoName'>;
  package: WebsitePackage;
  publishEmail: string;
  hasLogo: boolean;
  photoCount: number;
  siteArtifacts: PublishSiteArtifacts;
}

export interface PublishWebsiteResult {
  websiteId: string;
  tenantId: string;
  slug: string;
  subdomain: string;
  url: string;
  status: WebsiteStatus;
  package: WebsitePackage;
  publishEmail: string;
  savedAt: string;
  published: boolean;
  siteObjectCount?: number;
}

export interface PublishWebsiteError {
  ok: false;
  message: string;
  errors?: Record<string, string>;
}

export interface PublishWebsiteSuccess {
  ok: true;
  result: PublishWebsiteResult;
  magicLinkSent?: boolean;
}

export type PublishWebsiteResponse = PublishWebsiteSuccess | PublishWebsiteError;
