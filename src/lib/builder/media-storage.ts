import type { BuilderFiles } from './files';
import { createEmptyFiles } from './files';
import { IMAGE_STORAGE_QUOTA_ERROR, validateImageBlob } from './upload-validation';
import { MAX_IMAGE_SIZE_BYTES } from './constants';

export const BUILDER_MEDIA_STORAGE_KEY = 'starlocal-website-builder-media-v1';

/** Target max length for a stored data URL (~550 KB image payload). */
const MAX_STORED_DATA_URL_CHARS = 750_000;
const MAX_STORED_DIMENSION = 1400;

export type MediaSaveResult = 'ok' | 'quota' | 'partial' | 'empty';

interface StoredBuilderMedia {
  logoUrl: string | null;
  logoName: string;
  heroUrl: string | null;
  heroName: string;
  photoUrls: string[];
  photoNames: string[];
  socialImageUrl: string | null;
  socialImageName: string;
}

let saveChain: Promise<MediaSaveResult> = Promise.resolve('empty');
let pendingFiles: BuilderFiles | null = null;

function readBlobAsDataUrl(blob: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  });
}

async function compressBlobForStorage(blob: Blob): Promise<string | null> {
  if (!validateImageBlob(blob)) return null;
  if (blob.size > MAX_IMAGE_SIZE_BYTES) return null;

  if (typeof createImageBitmap !== 'function') {
    const dataUrl = await readBlobAsDataUrl(blob);
    return dataUrl && dataUrl.length <= MAX_STORED_DATA_URL_CHARS ? dataUrl : null;
  }

  try {
    const bitmap = await createImageBitmap(blob);
    try {
      let quality = 0.85;
      let maxDim = MAX_STORED_DIMENSION;

      for (let attempt = 0; attempt < 8; attempt += 1) {
        const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
        const width = Math.max(1, Math.round(bitmap.width * scale));
        const height = Math.max(1, Math.round(bitmap.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) return null;
        context.drawImage(bitmap, 0, 0, width, height);

        const preferPng = blob.type === 'image/png';
        const dataUrl = preferPng
          ? canvas.toDataURL('image/png')
          : canvas.toDataURL('image/jpeg', quality);

        if (dataUrl.length <= MAX_STORED_DATA_URL_CHARS) return dataUrl;

        if (preferPng) {
          const jpegUrl = canvas.toDataURL('image/jpeg', quality);
          if (jpegUrl.length <= MAX_STORED_DATA_URL_CHARS) return jpegUrl;
        }

        quality = Math.max(0.45, quality - 0.1);
        maxDim = Math.round(maxDim * 0.82);
      }

      return null;
    } finally {
      bitmap.close();
    }
  } catch {
    if (!validateImageBlob(blob)) return null;
    const dataUrl = await readBlobAsDataUrl(blob);
    return dataUrl && dataUrl.length <= MAX_STORED_DATA_URL_CHARS ? dataUrl : null;
  }
}

async function urlToStoredDataUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:')) {
    return url.length <= MAX_STORED_DATA_URL_CHARS ? url : compressBlobForStorage(await (await fetch(url)).blob());
  }
  if (!url.startsWith('blob:')) return url;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    if (!validateImageBlob(blob)) return null;
    return await compressBlobForStorage(blob);
  } catch {
    return null;
  }
}

async function writeFilesToStorage(files: BuilderFiles): Promise<MediaSaveResult> {
  if (typeof window === 'undefined') return 'empty';

  const photoResults = await Promise.all(
    files.photoUrls.map(async (url, index) => ({
      url: await urlToStoredDataUrl(url),
      name: files.photoNames[index] ?? `photo-${index + 1}.jpg`,
    })),
  );

  const storedPhotos = photoResults.filter((item): item is { url: string; name: string } => Boolean(item.url));

  const stored: StoredBuilderMedia = {
    logoUrl: await urlToStoredDataUrl(files.logoUrl),
    logoName: files.logoName,
    heroUrl: await urlToStoredDataUrl(files.heroUrl),
    heroName: files.heroName,
    photoUrls: storedPhotos.map((item) => item.url),
    photoNames: storedPhotos.map((item) => item.name),
    socialImageUrl: await urlToStoredDataUrl(files.socialImageUrl),
    socialImageName: files.socialImageName,
  };

  const hasMedia =
    stored.logoUrl ||
    stored.heroUrl ||
    stored.photoUrls.length > 0 ||
    stored.socialImageUrl;

  if (!hasMedia) {
    window.localStorage.removeItem(BUILDER_MEDIA_STORAGE_KEY);
    return 'empty';
  }

  const sourcePhotoCount = files.photoUrls.length;
  const storedPhotoCount = stored.photoUrls.length;
  const partial =
    (files.logoUrl && !stored.logoUrl) ||
    (files.heroUrl && !stored.heroUrl) ||
    (files.socialImageUrl && !stored.socialImageUrl) ||
    storedPhotoCount < sourcePhotoCount;

  try {
    window.localStorage.setItem(BUILDER_MEDIA_STORAGE_KEY, JSON.stringify(stored));
    return partial ? 'partial' : 'ok';
  } catch {
    return 'quota';
  }
}

async function flushPendingSaves(): Promise<MediaSaveResult> {
  let lastResult: MediaSaveResult = 'empty';

  while (pendingFiles) {
    const snapshot = pendingFiles;
    pendingFiles = null;
    lastResult = await writeFilesToStorage(snapshot);
  }

  return lastResult;
}

export function saveFilesToStorage(files: BuilderFiles): Promise<MediaSaveResult> {
  pendingFiles = files;
  saveChain = saveChain.then(flushPendingSaves).catch((): MediaSaveResult => 'quota');
  return saveChain;
}

export function loadFilesFromStorage(): BuilderFiles | null {
  if (typeof window === 'undefined') return null;

  try {
    const raw = window.localStorage.getItem(BUILDER_MEDIA_STORAGE_KEY);
    if (!raw) return null;

    const stored = JSON.parse(raw) as StoredBuilderMedia;
    const hasMedia =
      stored.logoUrl ||
      stored.heroUrl ||
      (stored.photoUrls?.length ?? 0) > 0 ||
      stored.socialImageUrl;

    if (!hasMedia) return null;

    return {
      ...createEmptyFiles(),
      logoUrl: stored.logoUrl ?? null,
      logoName: stored.logoName ?? '',
      heroUrl: stored.heroUrl ?? null,
      heroName: stored.heroName ?? '',
      photoUrls: [...(stored.photoUrls ?? [])],
      photoNames: [...(stored.photoNames ?? [])],
      socialImageUrl: stored.socialImageUrl ?? null,
      socialImageName: stored.socialImageName ?? '',
    };
  } catch {
    return null;
  }
}

export function clearFilesStorage(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(BUILDER_MEDIA_STORAGE_KEY);
  pendingFiles = null;
}
