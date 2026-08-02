import {
  ACCEPTED_IMAGE_TYPES,
  MAX_LOGO_SIZE,
  MAX_PHOTOS,
  MAX_PHOTO_SIZE,
} from './constants';

export interface BuilderFiles {
  logoUrl: string | null;
  logoName: string;
  photoUrls: string[];
  photoNames: string[];
}

export function createEmptyFiles(): BuilderFiles {
  return {
    logoUrl: null,
    logoName: '',
    photoUrls: [],
    photoNames: [],
  };
}

export function revokeObjectUrl(url: string | null): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function revokeAllFiles(files: BuilderFiles): void {
  revokeObjectUrl(files.logoUrl);
  files.photoUrls.forEach(revokeObjectUrl);
}

function validateImageFile(file: File, maxSize: number): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Alleen JPG, PNG of WebP is toegestaan.';
  }
  if (file.size > maxSize) {
    return 'Bestand is te groot. Maximaal 5 MB toegestaan.';
  }
  return null;
}

export function setLogoFile(files: BuilderFiles, file: File): string | null {
  const error = validateImageFile(file, MAX_LOGO_SIZE);
  if (error) return error;

  revokeObjectUrl(files.logoUrl);
  files.logoUrl = URL.createObjectURL(file);
  files.logoName = file.name;
  return null;
}

export function addPhotoFile(files: BuilderFiles, file: File): string | null {
  if (files.photoUrls.length >= MAX_PHOTOS) {
    return 'U kunt maximaal vijf foto’s uploaden.';
  }

  const error = validateImageFile(file, MAX_PHOTO_SIZE);
  if (error) return error;

  files.photoUrls.push(URL.createObjectURL(file));
  files.photoNames.push(file.name);
  return null;
}

export function removePhoto(files: BuilderFiles, index: number): void {
  const url = files.photoUrls[index];
  revokeObjectUrl(url);
  files.photoUrls.splice(index, 1);
  files.photoNames.splice(index, 1);
}

export function movePhoto(files: BuilderFiles, index: number, direction: -1 | 1): void {
  const target = index + direction;
  if (target < 0 || target >= files.photoUrls.length) return;

  [files.photoUrls[index], files.photoUrls[target]] = [files.photoUrls[target], files.photoUrls[index]];
  [files.photoNames[index], files.photoNames[target]] = [files.photoNames[target], files.photoNames[index]];
}

export function syncFileMeta(files: BuilderFiles): { logoName: string; photoNames: string[] } {
  return {
    logoName: files.logoName,
    photoNames: [...files.photoNames],
  };
}

export function heroPhotoUrl(files: BuilderFiles): string | null {
  return files.photoUrls[0] ?? null;
}
