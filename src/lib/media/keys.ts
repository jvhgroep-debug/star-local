import { ACCEPTED_MEDIA_MIME_ALIASES, MEDIA_MIME_TO_EXTENSION } from './constants';
import type { AcceptedMediaMimeType } from '../../types/media';

/** Generate a safe unique filename — never uses the original upload name. */
export function generateSafeFilename(mimeType: AcceptedMediaMimeType): string {
  const extension = MEDIA_MIME_TO_EXTENSION[mimeType];
  const uniqueId = crypto.randomUUID();
  return `${uniqueId}.${extension}`;
}

/** Normalize and validate MIME type input. */
export function normalizeMimeType(raw: string): AcceptedMediaMimeType | null {
  return ACCEPTED_MEDIA_MIME_ALIASES[raw.trim().toLowerCase()] ?? null;
}
