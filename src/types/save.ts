import type {
  BuilderBranding,
  BuilderBusiness,
  BuilderContact,
  BuilderDesignSettings,
  BuilderLocation,
  DayHours,
  EnabledPages,
} from './builder';
import type { AcceptedMediaMimeType } from './media';
import type { WebsitePackage } from './website-config';

export interface SaveWebsiteMediaFile {
  filename: string;
  mimeType: AcceptedMediaMimeType;
  dataBase64: string;
  kind: 'logo' | 'photo' | 'social';
}

/** JSON payload from wizard to save API. */
export interface SaveWebsitePayload {
  tenantId?: string;
  business: BuilderBusiness;
  contact: BuilderContact;
  location: BuilderLocation;
  hours: DayHours[];
  branding: Pick<BuilderBranding, 'primaryColor' | 'accentColor'>;
  design: BuilderDesignSettings;
  package: WebsitePackage;
  media: SaveWebsiteMediaFile[];
  heroTitle?: string;
  heroSubtitle?: string;
  seoMetaDescription?: string;
  enabledPages?: EnabledPages;
}

export interface SaveWebsiteResult {
  tenantId: string;
  websiteId: string;
  slug: string;
  status: 'draft';
  url: string;
  dashboardUrl: string;
  editorUrl: string;
  savedAt: string;
  pageCount: number;
}

export interface SaveWebsiteError {
  ok: false;
  code: string;
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface SaveWebsiteSuccess {
  ok: true;
  result: SaveWebsiteResult;
  magicLinkSent?: boolean;
}

export type SaveWebsiteResponse = SaveWebsiteSuccess | SaveWebsiteError;

export interface LoadWebsiteResult {
  tenantId: string;
  websiteId: string;
  slug: string;
  status: string;
  business: BuilderBusiness;
  contact: BuilderContact;
  location: BuilderLocation;
  hours: DayHours[];
  branding: {
    primaryColor: string;
    accentColor: string;
    logoKey: string | null;
  };
  design: BuilderDesignSettings;
  package: WebsitePackage;
  heroTitle?: string;
  seoMetaDescription?: string;
  enabledPages?: EnabledPages;
  pages: Array<{
    pageKey: string;
    title: string;
    slug: string;
    seoTitle: string;
    metaDescription: string;
    canonicalPath: string;
    status: string;
  }>;
  media: Array<{
    id: string;
    mediaType: 'logo' | 'photo';
    storageKey: string;
    filename: string;
    mimeType: string;
    sortOrder: number;
    dataUrl?: string;
  }>;
}

export type LoadWebsiteResponse =
  | { ok: true; result: LoadWebsiteResult }
  | { ok: false; code: string; message: string };
