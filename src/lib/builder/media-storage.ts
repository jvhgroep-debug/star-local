import type { BuilderFiles } from './files';
import { createEmptyFiles } from './files';

export const BUILDER_MEDIA_STORAGE_KEY = 'starlocal-website-builder-media-v1';

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

async function urlToDataUrl(url: string | null): Promise<string | null> {
  if (!url) return null;
  if (url.startsWith('data:')) return url;
  if (!url.startsWith('blob:')) return url;

  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function saveFilesToStorage(files: BuilderFiles): Promise<void> {
  if (typeof window === 'undefined') return;

  const photoUrls = await Promise.all(files.photoUrls.map((url) => urlToDataUrl(url)));

  const stored: StoredBuilderMedia = {
    logoUrl: await urlToDataUrl(files.logoUrl),
    logoName: files.logoName,
    heroUrl: await urlToDataUrl(files.heroUrl),
    heroName: files.heroName,
    photoUrls: photoUrls.filter((url): url is string => Boolean(url)),
    photoNames: files.photoNames.slice(0, photoUrls.filter(Boolean).length),
    socialImageUrl: await urlToDataUrl(files.socialImageUrl),
    socialImageName: files.socialImageName,
  };

  const hasMedia =
    stored.logoUrl ||
    stored.heroUrl ||
    stored.photoUrls.length > 0 ||
    stored.socialImageUrl;

  if (!hasMedia) {
    window.localStorage.removeItem(BUILDER_MEDIA_STORAGE_KEY);
    return;
  }

  try {
    window.localStorage.setItem(BUILDER_MEDIA_STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Quota exceeded — state metadata remains; user may re-upload on next visit.
  }
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
}
