import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_SIZE_BYTES } from './constants';

export { MAX_IMAGE_SIZE_BYTES };

export const IMAGE_UPLOAD_ERROR_TOO_LARGE =
  'Deze afbeelding is groter dan 5 MB. Kies een kleinere afbeelding.';

export const IMAGE_UPLOAD_ERROR_INVALID_TYPE = 'Gebruik een JPG-, PNG- of WebP-afbeelding.';

export const IMAGE_STORAGE_QUOTA_ERROR =
  'Uw browseropslag is vol. Verwijder een afbeelding of kies kleinere bestanden.';

/** Validate a File before any FileReader, blob URL, compression, or storage. */
export function validateImageUpload(file: File | null | undefined): string | null {
  if (!file) return null;

  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return IMAGE_UPLOAD_ERROR_INVALID_TYPE;
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return IMAGE_UPLOAD_ERROR_TOO_LARGE;
  }

  return null;
}

/** Second-layer guard for blobs fetched from object URLs or data URLs. */
export function validateImageBlob(blob: Blob | null | undefined): boolean {
  if (!blob) return false;
  if (!ACCEPTED_IMAGE_TYPES.includes(blob.type)) return false;
  if (blob.size > MAX_IMAGE_SIZE_BYTES) return false;
  return true;
}
