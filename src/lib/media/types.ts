import type {
  MediaListResult,
  MediaObject,
  MediaUploadInput,
  MediaUploadResult,
  PhotoCategory,
} from '../../types/media';
import type { MediaValidationResult } from '../../types/media';

/** Storage-only media service — no website or publish business logic. */
export interface MediaService {
  uploadLogo(input: MediaUploadInput): Promise<MediaUploadResult>;
  uploadPhoto(input: MediaUploadInput, category?: PhotoCategory): Promise<MediaUploadResult>;
  deletePhoto(tenantId: string, key: string): Promise<boolean>;
  deleteLogo(tenantId: string, key: string): Promise<boolean>;
  listPhotos(tenantId: string): Promise<MediaListResult>;
  listLogo(tenantId: string): Promise<MediaListResult>;
  getObject(key: string): Promise<MediaObject | null>;
  readObjectBytes(key: string): Promise<ArrayBuffer | null>;
  validateUpload(input: MediaUploadInput, kind: 'logo' | PhotoCategory): Promise<MediaValidationResult>;
}
