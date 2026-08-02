import type { AcceptedMediaMimeType } from '../../types/media';

/** Max file size per asset (5 MB). */
export const MAX_MEDIA_FILE_SIZE = 5 * 1024 * 1024;

/** Maximum number of photo assets per tenant (excluding logo). */
export const MAX_PHOTO_COUNT = 5;

/** Maximum number of logo assets per tenant. */
export const MAX_LOGO_COUNT = 1;

export const ACCEPTED_MEDIA_MIME_TYPES: readonly AcceptedMediaMimeType[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
] as const;

/** Input aliases accepted during validation (normalized to AcceptedMediaMimeType). */
export const ACCEPTED_MEDIA_MIME_ALIASES: Record<string, AcceptedMediaMimeType> = {
  'image/png': 'image/png',
  'image/jpeg': 'image/jpeg',
  'image/jpg': 'image/jpeg',
  'image/webp': 'image/webp',
};

export const MEDIA_MIME_TO_EXTENSION: Record<AcceptedMediaMimeType, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
};
