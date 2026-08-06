import type { BuilderState } from '../../types/builder';
import type { SaveWebsiteMediaFile, SaveWebsitePayload, SaveWebsiteResponse } from '../../types/save';
import type { BuilderFiles } from '../files';
import { buildPublicationSnapshot, serializePublicationSnapshot } from '../../publication-engine/snapshot';
import { ACCEPTED_IMAGE_TYPES, MAX_LOGO_SIZE, MAX_PHOTO_SIZE } from '../constants';

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function blobUrlToFile(url: string, filename: string): Promise<File | null> {
  if (!url.startsWith('blob:') && !url.startsWith('data:')) return null;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
  } catch {
    return null;
  }
}

function normalizeMime(mime: string): SaveWebsiteMediaFile['mimeType'] | null {
  if (mime === 'image/jpeg' || mime === 'image/png' || mime === 'image/webp') return mime;
  return null;
}

export async function buildSavePayload(
  state: BuilderState,
  files: BuilderFiles,
): Promise<{ payload: SaveWebsitePayload; errors: Record<string, string> }> {
  const errors: Record<string, string> = {};
  const media: SaveWebsiteMediaFile[] = [];

  if (files.logoUrl && files.logoName) {
    const file = await blobUrlToFile(files.logoUrl, files.logoName);
    if (file) {
      if (file.size > MAX_LOGO_SIZE) errors.logo = 'Logo is te groot (max. 5 MB).';
      else if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) errors.logo = 'Ongeldig logoformaat.';
      else {
        const mimeType = normalizeMime(file.type);
        if (mimeType) {
          media.push({
            kind: 'logo',
            filename: files.logoName,
            mimeType,
            dataBase64: await fileToBase64(file),
          });
        }
      }
    }
  }

  if (files.heroUrl && files.heroName) {
    const file = await blobUrlToFile(files.heroUrl, files.heroName);
    if (file) {
      if (file.size > MAX_PHOTO_SIZE) errors.photos = 'Hero-afbeelding is te groot (max. 5 MB).';
      else if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) errors.photos = 'Ongeldig heroformaat.';
      else {
        const mimeType = normalizeMime(file.type);
        if (mimeType) {
          media.push({
            kind: 'photo',
            filename: files.heroName,
            mimeType,
            dataBase64: await fileToBase64(file),
          });
        }
      }
    }
  }

  for (let i = 0; i < files.photoUrls.length; i += 1) {
    const url = files.photoUrls[i];
    const name = files.photoNames[i] ?? `photo-${i + 1}.jpg`;
    const file = await blobUrlToFile(url, name);
    if (!file) continue;
    if (file.size > MAX_PHOTO_SIZE) {
      errors.photos = 'Een foto is te groot (max. 5 MB).';
      continue;
    }
    const mimeType = normalizeMime(file.type);
    if (!mimeType) continue;
    media.push({
      kind: 'photo',
      filename: name,
      mimeType,
      dataBase64: await fileToBase64(file),
    });
  }

  if (files.socialImageUrl && files.socialImageName) {
    const file = await blobUrlToFile(files.socialImageUrl, files.socialImageName);
    if (file) {
      if (file.size > MAX_PHOTO_SIZE) errors.socialImage = 'Social image is te groot (max. 5 MB).';
      else if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) errors.socialImage = 'Ongeldig social image-formaat.';
      else {
        const mimeType = normalizeMime(file.type);
        if (mimeType) {
          media.push({
            kind: 'social',
            filename: files.socialImageName,
            mimeType,
            dataBase64: await fileToBase64(file),
          });
        }
      }
    }
  }

  const publicSiteBaseUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin.replace(/\/$/, '')}/sites/preview`
      : '/sites/preview';
  const snapshot = buildPublicationSnapshot(state, files, { publicSiteBaseUrl });

  const payload: SaveWebsitePayload = {
    business: state.business,
    contact: state.contact,
    location: state.location,
    hours: state.hours,
    branding: {
      primaryColor: state.branding.primaryColor,
      accentColor: state.branding.accentColor,
    },
    design: state.design,
    package: state.selectedPackage,
    media,
    heroTitle: state.heroTitle.trim(),
    heroSubtitle: state.heroSubtitle.trim(),
    seoMetaDescription: state.seoMetaDescription.trim(),
    enabledPages: state.enabledPages,
    configSnapshotJson: serializePublicationSnapshot(snapshot),
  };

  return { payload, errors };
}

export async function saveWebsiteToD1(payload: SaveWebsitePayload): Promise<SaveWebsiteResponse> {
  const response = await fetch('/api/website/save/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  try {
    return (await response.json()) as SaveWebsiteResponse;
  } catch {
    return { ok: false, code: 'INVALID_RESPONSE', message: 'Onverwacht antwoord van de server.' };
  }
}

export async function loadWebsiteFromD1(tenantId: string): Promise<import('../../types/save').LoadWebsiteResponse> {
  const response = await fetch(`/api/website/load/?tenantId=${encodeURIComponent(tenantId)}`);
  try {
    return (await response.json()) as import('../../types/save').LoadWebsiteResponse;
  } catch {
    return { ok: false, code: 'INVALID_RESPONSE', message: 'Onverwacht antwoord van de server.' };
  }
}
