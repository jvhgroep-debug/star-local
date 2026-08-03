import type { R2Bucket } from './r2';
import { R2MediaService, TENANT_MEDIA_LAYOUT } from './r2-media.service';
import type { MediaService } from './types';
import { LocalMediaAdapter } from './local-media.adapter';

export function createMediaService(bucket: R2Bucket): MediaService {
  return new R2MediaService(bucket);
}

export function createMediaServiceOrLocal(bucket?: R2Bucket | null): MediaService {
  if (bucket) return new R2MediaService(bucket);
  return new LocalMediaAdapter();
}

export type { MediaService } from './types';
export { R2MediaService, TENANT_MEDIA_LAYOUT } from './r2-media.service';
export type { R2Bucket, R2Object, R2ObjectBody, StarLocalMediaEnv } from './r2';
export {
  ACCEPTED_MEDIA_MIME_TYPES,
  MAX_LOGO_COUNT,
  MAX_MEDIA_FILE_SIZE,
  MAX_PHOTO_COUNT,
} from './constants';
export { buildMediaKey, buildMediaPrefix, buildTenantMediaPrefix, parseMediaKey } from './paths';
export { generateSafeFilename, normalizeMimeType } from './keys';
export {
  validateFileSize,
  validateLogoCount,
  validateMediaUpload,
  validateMimeType,
  validatePhotoCount,
  validateTenantId,
} from './validation';

export type {
  AcceptedMediaMimeType,
  MediaFolder,
  MediaListResult,
  MediaObject,
  MediaUploadInput,
  MediaUploadResult,
  MediaValidationError,
  MediaValidationResult,
  PhotoCategory,
} from '../../types/media';
