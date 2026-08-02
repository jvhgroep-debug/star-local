import type {
  MediaValidationError,
  MediaValidationResult,
  PhotoCategory,
} from '../../types/media';
import {
  ACCEPTED_MEDIA_MIME_TYPES,
  MAX_LOGO_COUNT,
  MAX_MEDIA_FILE_SIZE,
  MAX_PHOTO_COUNT,
} from './constants';
import { normalizeMimeType } from './keys';

function invalid(
  code: MediaValidationError['code'],
  message: string,
): MediaValidationResult {
  return { valid: false, error: { code, message } };
}

export function validateMimeType(mimeType: string): MediaValidationResult {
  if (!normalizeMimeType(mimeType)) {
    return invalid(
      'INVALID_TYPE',
      `Alleen ${ACCEPTED_MEDIA_MIME_TYPES.map((t) => t.replace('image/', '').toUpperCase()).join(', ')} is toegestaan.`,
    );
  }
  return { valid: true };
}

export function validateFileSize(sizeBytes: number): MediaValidationResult {
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    return invalid('FILE_TOO_LARGE', 'Bestand is ongeldig of leeg.');
  }
  if (sizeBytes > MAX_MEDIA_FILE_SIZE) {
    return invalid('FILE_TOO_LARGE', 'Bestand is te groot. Maximaal 5 MB toegestaan.');
  }
  return { valid: true };
}

export function validatePhotoCount(currentCount: number): MediaValidationResult {
  if (currentCount >= MAX_PHOTO_COUNT) {
    return invalid('MAX_PHOTOS_REACHED', `Maximaal ${MAX_PHOTO_COUNT} foto's toegestaan.`);
  }
  return { valid: true };
}

export function validateLogoCount(currentCount: number): MediaValidationResult {
  if (currentCount >= MAX_LOGO_COUNT) {
    return invalid('MAX_LOGO_REACHED', 'Er is al een logo geüpload. Verwijder het bestaande logo eerst.');
  }
  return { valid: true };
}

export function validateTenantId(tenantId: string): MediaValidationResult {
  const trimmed = tenantId.trim();
  if (!trimmed || !/^[a-zA-Z0-9_-]{1,64}$/.test(trimmed)) {
    return invalid('INVALID_TENANT', 'Ongeldige tenant-id.');
  }
  return { valid: true };
}

export interface ValidateUploadInput {
  tenantId: string;
  mimeType: string;
  sizeBytes: number;
  currentPhotoCount: number;
  currentLogoCount: number;
  kind: 'logo' | PhotoCategory;
}

/** Combined validation for upload operations (no business logic). */
export function validateMediaUpload(input: ValidateUploadInput): MediaValidationResult {
  const tenantResult = validateTenantId(input.tenantId);
  if (!tenantResult.valid) return tenantResult;

  const typeResult = validateMimeType(input.mimeType);
  if (!typeResult.valid) return typeResult;

  const sizeResult = validateFileSize(input.sizeBytes);
  if (!sizeResult.valid) return sizeResult;

  if (input.kind === 'logo') {
    return validateLogoCount(input.currentLogoCount);
  }

  return validatePhotoCount(input.currentPhotoCount);
}
