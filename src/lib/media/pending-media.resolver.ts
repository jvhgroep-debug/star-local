/**
 * Pending media resolver — R2-ready abstraction (OPDRACHT 84)
 *
 * HUIDIG: metadata-only opslag in change_requests.media_metadata_json.
 * GEEN upload naar Cloudflare R2.
 *
 * TOEKOMST — koppel R2 hier:
 * 1. Implementeer `uploadToR2(file, context)` in dit bestand of `r2-media.resolver.ts`.
 * 2. Roep aan vanuit ChangeRequestService.createRequest() na validatie.
 * 3. Sla `r2ObjectKey` op in PendingMediaMetadata en update storageStatus naar 'stored'.
 * 4. Admin preview: genereer signed URL via R2 binding (MEDIA).
 *
 * @see migrations/0010_change_requests.sql — media_metadata_json kolom
 * @see src/lib/change-requests/service.ts — createRequest()
 */

import type { PendingMediaMetadata, PhotoPlacement } from '../../types/change-request';
import { PHOTO_PLACEMENTS } from '../../types/change-request';

const MAX_MEDIA_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export interface MediaFileInput {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  placement?: string;
  caption?: string;
}

export interface ResolvedPendingMedia {
  metadata: PendingMediaMetadata;
  /** Toekomstig: binary buffer voor R2 upload. Nu niet gebruikt. */
  uploadDeferred: true;
}

/** Valideer client-side file metadata server-side (geen binary upload nu). */
export function resolvePendingMedia(input: MediaFileInput | null | undefined): ResolvedPendingMedia | null {
  if (!input) return null;

  const filename = input.filename?.trim().slice(0, 255) ?? '';
  const mimeType = input.mimeType?.trim().toLowerCase() ?? '';
  const sizeBytes = Number(input.sizeBytes);

  if (!filename) throw new Error('Bestandsnaam is verplicht voor media-aanvragen.');
  if (!mimeType || !ALLOWED_MIME.includes(mimeType)) {
    throw new Error('Alleen JPG, PNG, WebP of GIF is toegestaan.');
  }
  if (!Number.isFinite(sizeBytes) || sizeBytes <= 0) {
    throw new Error('Ongeldige bestandsgrootte.');
  }
  if (sizeBytes > MAX_MEDIA_BYTES) {
    throw new Error('Bestand is te groot (max. 5 MB).');
  }

  const placement = normalizePlacement(input.placement);

  const metadata: PendingMediaMetadata = {
    filename,
    mimeType,
    sizeBytes,
    placement,
    caption: input.caption?.trim().slice(0, 500) || undefined,
    storageStatus: 'pending',
    r2ObjectKey: null,
  };

  return { metadata, uploadDeferred: true };
}

function normalizePlacement(value: string | undefined): PhotoPlacement | string {
  if (!value?.trim()) return 'other';
  const normalized = value.trim().toLowerCase();
  if ((PHOTO_PLACEMENTS as string[]).includes(normalized)) {
    return normalized as PhotoPlacement;
  }
  return value.trim().slice(0, 120);
}

/**
 * Toekomstige R2-upload — nog niet geïmplementeerd.
 * @throws Error altijd in huidige fase
 */
export async function uploadToR2(_file: never, _websiteId: string): Promise<string> {
  throw new Error(
    'R2-upload is nog niet actief. Media wordt als pending opgeslagen tot Cloudflare R2 is gekoppeld.',
  );
}

export function formatMediaSummary(meta: PendingMediaMetadata | null): string {
  if (!meta) return '—';
  const sizeKb = Math.round(meta.sizeBytes / 1024);
  return `${meta.filename} (${meta.mimeType}, ${sizeKb} KB)`;
}
