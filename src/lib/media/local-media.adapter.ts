import type {
  MediaListResult,
  MediaObject,
  MediaUploadInput,
  MediaUploadResult,
  PhotoCategory,
} from '../../types/media';
import type { MediaValidationResult } from '../../types/media';
import type { MediaService } from './types';
import { validateMediaUpload } from './validation';
import { generateSafeFilename, normalizeMimeType } from './keys';

/** In-memory store for local development when R2 is unavailable. */
const localStore = new Map<string, ArrayBuffer>();

/**
 * Local media adapter — same interface as R2MediaService.
 * Stores binary data in memory; keys use `local/` prefix.
 */
export class LocalMediaAdapter implements MediaService {
  async validateUpload(
    input: MediaUploadInput,
    kind: 'logo' | PhotoCategory,
  ): Promise<MediaValidationResult> {
    const photoObjects = kind === 'logo' ? [] : await this.listPhotos(input.tenantId);
    const logoObjects = kind === 'logo' ? await this.listLogo(input.tenantId) : [];
    return validateMediaUpload({
      tenantId: input.tenantId,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      currentPhotoCount: photoObjects.objects.length,
      currentLogoCount: logoObjects.objects.length,
      kind,
    });
  }

  async uploadLogo(input: MediaUploadInput): Promise<MediaUploadResult> {
    return this.upload(input, 'logo');
  }

  async uploadPhoto(input: MediaUploadInput, _category?: PhotoCategory): Promise<MediaUploadResult> {
    return this.upload(input, 'photos');
  }

  async deletePhoto(tenantId: string, key: string): Promise<boolean> {
    if (!key.startsWith(`local/${tenantId}/`)) return false;
    localStore.delete(key);
    return true;
  }

  async deleteLogo(tenantId: string, key: string): Promise<boolean> {
    return this.deletePhoto(tenantId, key);
  }

  async listPhotos(tenantId: string): Promise<MediaListResult> {
    return { objects: this.listByPrefix(`local/${tenantId}/photos/`) };
  }

  async listLogo(tenantId: string): Promise<MediaListResult> {
    return { objects: this.listByPrefix(`local/${tenantId}/logo/`) };
  }

  async getObject(key: string): Promise<MediaObject | null> {
    if (!localStore.has(key)) return null;
    const parsed = this.parseLocalKey(key);
    if (!parsed) return null;
    const buffer = localStore.get(key)!;
    return {
      key,
      tenantId: parsed.tenantId,
      folder: parsed.folder,
      filename: parsed.filename,
      mimeType: parsed.mimeType,
      sizeBytes: buffer.byteLength,
      uploadedAt: new Date().toISOString(),
    };
  }

  async readObjectBytes(key: string): Promise<ArrayBuffer | null> {
    return localStore.get(key) ?? null;
  }

  async deleteTenantMedia(tenantId: string): Promise<void> {
    const prefix = `local/${tenantId}/`;
    for (const key of [...localStore.keys()]) {
      if (key.startsWith(prefix)) localStore.delete(key);
    }
  }

  private async upload(input: MediaUploadInput, folder: 'logo' | 'photos'): Promise<MediaUploadResult> {
    const validation = await this.validateUpload(input, folder === 'logo' ? 'logo' : 'photos');
    if (!validation.valid) {
      throw new Error(validation.error.message);
    }

    const mimeType = normalizeMimeType(input.mimeType);
    if (!mimeType) throw new Error('Ongeldig bestandstype.');

    const filename = generateSafeFilename(input.mimeType);
    const storageKey = `local/${input.tenantId}/${folder}/${filename}`;

    const data =
      input.data instanceof ArrayBuffer
        ? input.data
        : await new Response(input.data).arrayBuffer();

    localStore.set(storageKey, data);

    return {
      object: {
        key: storageKey,
        tenantId: input.tenantId,
        folder,
        filename,
        mimeType,
        sizeBytes: input.sizeBytes,
        uploadedAt: new Date().toISOString(),
      },
    };
  }

  private listByPrefix(prefix: string): MediaObject[] {
    const objects: MediaObject[] = [];
    for (const [key, buffer] of localStore.entries()) {
      if (!key.startsWith(prefix)) continue;
      const parsed = this.parseLocalKey(key);
      if (!parsed) continue;
      objects.push({
        key,
        tenantId: parsed.tenantId,
        folder: parsed.folder,
        filename: parsed.filename,
        mimeType: parsed.mimeType,
        sizeBytes: buffer.byteLength,
        uploadedAt: new Date().toISOString(),
      });
    }
    return objects;
  }

  private parseLocalKey(key: string): {
    tenantId: string;
    folder: MediaObject['folder'];
    filename: string;
    mimeType: MediaObject['mimeType'];
  } | null {
    const match = /^local\/([^/]+)\/(logo|photos|hero|gallery)\/(.+)$/.exec(key);
    if (!match) return null;
    const mimeType = match[3].endsWith('.png')
      ? 'image/png'
      : match[3].endsWith('.webp')
        ? 'image/webp'
        : 'image/jpeg';
    return {
      tenantId: match[1],
      folder: match[2] as MediaObject['folder'],
      filename: match[3],
      mimeType,
    };
  }
}
