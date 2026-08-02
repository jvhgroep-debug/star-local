/** Supported tenant media MIME types. */
export type AcceptedMediaMimeType = 'image/png' | 'image/jpeg' | 'image/webp';

/** Logical folder under `{tenantId}/` in R2. */
export type MediaFolder = 'logo' | 'photos' | 'hero' | 'gallery';

/** Category for photo uploads (hero = first impression, gallery = additional). */
export type PhotoCategory = 'photos' | 'hero' | 'gallery';

export interface MediaObject {
  key: string;
  tenantId: string;
  folder: MediaFolder;
  filename: string;
  mimeType: AcceptedMediaMimeType;
  sizeBytes: number;
  uploadedAt: string;
}

export interface MediaUploadInput {
  tenantId: string;
  data: ArrayBuffer | ReadableStream;
  mimeType: string;
  sizeBytes: number;
}

export interface MediaUploadResult {
  object: MediaObject;
}

export interface MediaListResult {
  objects: MediaObject[];
}

export interface MediaValidationError {
  code: 'INVALID_TYPE' | 'FILE_TOO_LARGE' | 'MAX_PHOTOS_REACHED' | 'MAX_LOGO_REACHED' | 'INVALID_TENANT';
  message: string;
}

export type MediaValidationResult =
  | { valid: true }
  | { valid: false; error: MediaValidationError };
