import type {
  AcceptedMediaMimeType,
  MediaListResult,
  MediaObject,
  MediaUploadInput,
  MediaUploadResult,
  PhotoCategory,
} from '../../types/media';
import type { MediaValidationResult } from '../../types/media';
import { generateSafeFilename, normalizeMimeType } from './keys';
import {
  ALL_MEDIA_FOLDERS,
  buildMediaKey,
  buildMediaPrefix,
  parseMediaKey,
  PHOTO_STORAGE_FOLDERS,
  photoCategoryToFolder,
} from './paths';
import type { R2Bucket, R2ListedObject } from './r2';
import type { MediaService } from './types';
import { validateMediaUpload } from './validation';

function toIso(date: Date): string {
  return date.toISOString();
}

function listedObjectToMedia(row: R2ListedObject): MediaObject | null {
  const parsed = parseMediaKey(row.key);
  const mimeType = guessMimeFromFilename(parsed?.filename ?? '');

  if (!parsed || !mimeType) return null;

  return {
    key: row.key,
    tenantId: parsed.tenantId,
    folder: parsed.folder,
    filename: parsed.filename,
    mimeType,
    sizeBytes: row.size,
    uploadedAt: toIso(row.uploaded),
  };
}

function guessMimeFromFilename(filename: string): AcceptedMediaMimeType | null {
  const lower = filename.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  return null;
}

async function listFolder(bucket: R2Bucket, tenantId: string, folder: MediaObject['folder']): Promise<MediaObject[]> {
  const prefix = buildMediaPrefix(tenantId, folder);
  const listed = await bucket.list({ prefix });
  return listed.objects
    .map((object) => listedObjectToMedia(object))
    .filter((object): object is MediaObject => object !== null);
}

/** R2-backed media storage service (development architecture). */
export class R2MediaService implements MediaService {
  constructor(private readonly bucket: R2Bucket) {}

  async validateUpload(
    input: MediaUploadInput,
    kind: 'logo' | PhotoCategory,
  ): Promise<MediaValidationResult> {
    const photoObjects = kind === 'logo' ? [] : await this.listAllPhotoObjects(input.tenantId);
    const logoObjects = kind === 'logo' ? await this.listLogoObjects(input.tenantId) : [];

    return validateMediaUpload({
      tenantId: input.tenantId,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
      currentPhotoCount: photoObjects.length,
      currentLogoCount: logoObjects.length,
      kind,
    });
  }

  async uploadLogo(input: MediaUploadInput): Promise<MediaUploadResult> {
    return this.upload(input, 'logo');
  }

  async uploadPhoto(input: MediaUploadInput, category: PhotoCategory = 'photos'): Promise<MediaUploadResult> {
    return this.upload(input, category);
  }

  async deletePhoto(tenantId: string, key: string): Promise<boolean> {
    const parsed = parseMediaKey(key);
    if (!parsed || parsed.tenantId !== tenantId.trim()) return false;
    if (!PHOTO_STORAGE_FOLDERS.includes(parsed.folder)) return false;

    await this.bucket.delete(key);
    return true;
  }

  async deleteLogo(tenantId: string, key: string): Promise<boolean> {
    const parsed = parseMediaKey(key);
    if (!parsed || parsed.tenantId !== tenantId.trim() || parsed.folder !== 'logo') return false;

    await this.bucket.delete(key);
    return true;
  }

  async listPhotos(tenantId: string): Promise<MediaListResult> {
    const objects = await this.listAllPhotoObjects(tenantId);
    return { objects };
  }

  async listLogo(tenantId: string): Promise<MediaListResult> {
    const objects = await this.listLogoObjects(tenantId);
    return { objects };
  }

  async getObject(key: string): Promise<MediaObject | null> {
    const head = await this.bucket.head(key);
    if (!head) return null;

    const parsed = parseMediaKey(head.key);
    const mimeType =
      normalizeMimeType(head.httpMetadata?.contentType ?? '') ??
      (parsed ? guessMimeFromFilename(parsed.filename) : null);

    if (!parsed || !mimeType) return null;

    return {
      key: head.key,
      tenantId: parsed.tenantId,
      folder: parsed.folder,
      filename: parsed.filename,
      mimeType,
      sizeBytes: head.size,
      uploadedAt: toIso(head.uploaded),
    };
  }

  private async upload(input: MediaUploadInput, kind: 'logo' | PhotoCategory): Promise<MediaUploadResult> {
    const validation = await this.validateUpload(input, kind);
    if (!validation.valid) {
      throw new Error(validation.error.message);
    }

    const mimeType = normalizeMimeType(input.mimeType);
    if (!mimeType) {
      throw new Error('Invalid MIME type.');
    }

    const folder = kind === 'logo' ? 'logo' : photoCategoryToFolder(kind);
    const filename = generateSafeFilename(mimeType);
    const key = buildMediaKey(input.tenantId.trim(), folder, filename);

    const stored = await this.bucket.put(key, input.data, {
      httpMetadata: { contentType: mimeType },
      customMetadata: {
        tenantId: input.tenantId.trim(),
        folder,
      },
    });

    if (!stored) {
      throw new Error('Failed to store media object.');
    }

    const object: MediaObject = {
      key,
      tenantId: input.tenantId.trim(),
      folder,
      filename,
      mimeType,
      sizeBytes: input.sizeBytes,
      uploadedAt: toIso(stored.uploaded),
    };

    return { object };
  }

  private async listAllPhotoObjects(tenantId: string): Promise<MediaObject[]> {
    const batches = await Promise.all(
      PHOTO_STORAGE_FOLDERS.map((folder) => listFolder(this.bucket, tenantId.trim(), folder)),
    );
    return batches.flat().sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt));
  }

  private async listLogoObjects(tenantId: string): Promise<MediaObject[]> {
    return listFolder(this.bucket, tenantId.trim(), 'logo');
  }
}

/** Document the tenant folder layout (for operators and future modules). */
export const TENANT_MEDIA_LAYOUT = ALL_MEDIA_FOLDERS.map((folder) => ({
  folder,
  example: '{tenant-id}/' + folder + '/{uuid}.{ext}',
}));
