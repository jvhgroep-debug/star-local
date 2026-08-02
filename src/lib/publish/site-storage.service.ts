import type { PreviewPage } from '../../types/website-config';
import type { PublishSiteArtifacts } from '../../types/publish';
import type { R2Bucket } from '../media/r2';
import {
  TENANT_DOCUMENT_PATHS,
  TENANT_ROBOTS_PATH,
  TENANT_SITEMAP_PATH,
} from '../builder/generator/sitemap';
import { TENANT_FAVICON_PATH } from '../builder/generator/favicon';
import { TENANT_MANIFEST_PATH } from '../builder/generator/manifest';
import { buildSiteObjectKey, contentTypeForSitePath } from './site-paths';

export interface SitePublishResult {
  objectCount: number;
  keys: string[];
}

export class SiteStorageService {
  constructor(private readonly bucket: R2Bucket) {}

  async publishSite(tenantId: string, artifacts: PublishSiteArtifacts): Promise<SitePublishResult> {
    const uploads: Array<{ path: string; body: string }> = [];

    (Object.keys(TENANT_DOCUMENT_PATHS) as PreviewPage[]).forEach((page) => {
      const path = TENANT_DOCUMENT_PATHS[page];
      const html = artifacts.documents[page];
      if (!html?.trim()) {
        throw new Error(`Ontbrekend HTML-document voor pagina "${page}".`);
      }
      uploads.push({ path, body: html });
    });

    uploads.push({ path: TENANT_SITEMAP_PATH, body: artifacts.sitemap });
    uploads.push({ path: TENANT_ROBOTS_PATH, body: artifacts.robots });
    uploads.push({ path: TENANT_MANIFEST_PATH, body: artifacts.manifest });
    uploads.push({ path: TENANT_FAVICON_PATH, body: artifacts.faviconSvg });

    const keys: string[] = [];

    for (const file of uploads) {
      const key = buildSiteObjectKey(tenantId, file.path);
      await this.bucket.put(key, file.body, {
        httpMetadata: { contentType: contentTypeForSitePath(file.path) },
        customMetadata: { tenantId, sitePath: file.path },
      });
      keys.push(key);
    }

    return { objectCount: keys.length, keys };
  }

  async getSiteObject(tenantId: string, relativePath: string): Promise<{ body: ArrayBuffer; contentType: string } | null> {
    const key = buildSiteObjectKey(tenantId, relativePath);
    const object = await this.bucket.get(key);
    if (!object) return null;

    return {
      body: await object.arrayBuffer(),
      contentType: object.httpMetadata?.contentType ?? contentTypeForSitePath(relativePath),
    };
  }
}
