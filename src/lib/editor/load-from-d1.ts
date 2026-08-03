import type { BuilderState } from '../../types/builder';
import type { LoadWebsiteResult } from '../../types/save';
import { createDefaultState } from '../builder/storage';
import { createEmptyFiles, type BuilderFiles } from '../builder/files';
import { readableTextColor } from '../builder/colors';

export function mapLoadResultToBuilderState(result: LoadWebsiteResult): BuilderState {
  const logoMedia = result.media.find((m) => m.mediaType === 'logo');
  const photos = result.media
    .filter((m) => m.mediaType === 'photo')
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const heroPhoto = photos[0];

  return {
    ...createDefaultState(),
    currentStep: 8,
    view: 'builder',
    previewPage: 'home',
    business: structuredClone(result.business),
    contact: structuredClone(result.contact),
    location: structuredClone(result.location),
    hours: structuredClone(result.hours),
    branding: {
      primaryColor: result.branding.primaryColor,
      accentColor: result.branding.accentColor,
      textColor: readableTextColor(result.branding.primaryColor),
      logoName: logoMedia?.filename ?? '',
      photoNames: photos.slice(1).map((m) => m.filename),
      heroImageName: heroPhoto?.filename ?? '',
      socialImageName: '',
    },
    design: structuredClone(result.design),
    heroTitle: result.heroTitle ?? '',
    seoMetaDescription: result.seoMetaDescription ?? '',
    enabledPages: result.enabledPages ?? createDefaultState().enabledPages,
    selectedPackage: result.package,
    publicationStatus: result.status === 'published' ? 'published' : 'concept',
    publishEmailConfirmed: result.contact.email,
  };
}

export function mapLoadResultToFiles(result: LoadWebsiteResult): BuilderFiles {
  const files = createEmptyFiles();
  const logo = result.media.find((m) => m.mediaType === 'logo');
  if (logo?.dataUrl) {
    files.logoUrl = logo.dataUrl;
    files.logoName = logo.filename;
  }

  const photos = result.media
    .filter((m) => m.mediaType === 'photo')
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (photos.length > 0 && photos[0].dataUrl) {
    files.heroUrl = photos[0].dataUrl;
    files.heroName = photos[0].filename;
    files.photoUrls = photos.slice(1).map((p) => p.dataUrl).filter((url): url is string => Boolean(url));
    files.photoNames = photos.slice(1).map((p) => p.filename);
  }

  return files;
}
