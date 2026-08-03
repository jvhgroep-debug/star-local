import {
  ACCEPTED_IMAGE_TYPES,
  MAX_LOGO_SIZE,
  MAX_PHOTOS,
  MAX_PHOTO_SIZE,
} from './constants';

export interface BuilderFiles {
  logoUrl: string | null;
  logoName: string;
  heroUrl: string | null;
  heroName: string;
  photoUrls: string[];
  photoNames: string[];
  socialImageUrl: string | null;
  socialImageName: string;
}

export function createEmptyFiles(): BuilderFiles {
  return {
    logoUrl: null,
    logoName: '',
    heroUrl: null,
    heroName: '',
    photoUrls: [],
    photoNames: [],
    socialImageUrl: null,
    socialImageName: '',
  };
}

export function revokeObjectUrl(url: string | null): void {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}

export function revokeAllFiles(files: BuilderFiles): void {
  revokeObjectUrl(files.logoUrl);
  revokeObjectUrl(files.heroUrl);
  revokeObjectUrl(files.socialImageUrl);
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

export function setHeroFile(files: BuilderFiles, file: File): string | null {
  const error = validateImageFile(file, MAX_PHOTO_SIZE);
  if (error) return error;

  revokeObjectUrl(files.heroUrl);
  files.heroUrl = URL.createObjectURL(file);
  files.heroName = file.name;
  return null;
}

export function removeHeroFile(files: BuilderFiles): void {
  revokeObjectUrl(files.heroUrl);
  files.heroUrl = null;
  files.heroName = '';
}

export function replacePhotoFile(files: BuilderFiles, index: number, file: File): string | null {
  const error = validateImageFile(file, MAX_PHOTO_SIZE);
  if (error) return error;
  if (index < 0 || index >= files.photoUrls.length) return 'Foto niet gevonden.';

  revokeObjectUrl(files.photoUrls[index]);
  files.photoUrls[index] = URL.createObjectURL(file);
  files.photoNames[index] = file.name;
  return null;
}
export function addPhotoFile(files: BuilderFiles, file: File): string | null {
  if (files.photoUrls.length >= MAX_PHOTOS) {
    return 'U kunt maximaal vijf bedrijfsfoto’s uploaden.';
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

export function setSocialImageFile(files: BuilderFiles, file: File): string | null {
  const error = validateImageFile(file, MAX_LOGO_SIZE);
  if (error) return error;

  revokeObjectUrl(files.socialImageUrl);
  files.socialImageUrl = URL.createObjectURL(file);
  files.socialImageName = file.name;
  return null;
}

export function syncFileMeta(files: BuilderFiles): {
  logoName: string;
  heroName: string;
  photoNames: string[];
  socialImageName: string;
} {
  return {
    logoName: files.logoName,
    heroName: files.heroName,
    photoNames: [...files.photoNames],
    socialImageName: files.socialImageName,
  };
}

export function heroPhotoUrl(files: BuilderFiles): string | null {
  return files.heroUrl;
}
