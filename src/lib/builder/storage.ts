import type { BuilderState } from '../../types/builder';
import { BUILDER_STORAGE_KEY, createDefaultHours, createServiceId, DEFAULT_DESIGN_SETTINGS } from './constants';

export function createDefaultState(): BuilderState {
  return {
    version: 1,
    currentStep: 1,
    view: 'builder',
    previewPage: 'home',
    business: {
      name: '',
      industry: '',
      description: '',
      services: [{ id: createServiceId(), title: '', description: '' }],
    },
    contact: {
      phone: '',
      whatsapp: '',
      email: '',
      street: '',
      postcode: '',
      city: '',
      country: 'Nederland',
    },
    hours: createDefaultHours(),
    branding: {
      primaryColor: '#1a2332',
      accentColor: '#cdb880',
      textColor: '#ffffff',
      logoName: '',
      photoNames: [],
    },
    publicationStatus: 'concept',
    selectedPackage: 'free',
    publishEmailConfirmed: '',
    publishedAt: null,
    ctaQuoteLabel: 'Offerte aanvragen',
    heroTitle: '',
    heroSubtitle: '',
    design: { ...DEFAULT_DESIGN_SETTINGS },
    heroPlaceholder: 'Hero-afbeelding placeholder',
    galleryPlaceholders: ['Galerij 1', 'Galerij 2', 'Galerij 3'],
  };
}

export function loadState(): BuilderState {
  if (typeof window === 'undefined') return createDefaultState();

  try {
    const raw = window.localStorage.getItem(BUILDER_STORAGE_KEY);
    if (!raw) return createDefaultState();

    const parsed = JSON.parse(raw) as BuilderState;
    if (parsed.version !== 1) return createDefaultState();

    return {
      ...createDefaultState(),
      ...parsed,
      business: {
        ...createDefaultState().business,
        ...parsed.business,
        services:
          parsed.business?.services?.length > 0
            ? parsed.business.services
            : createDefaultState().business.services,
      },
      contact: { ...createDefaultState().contact, ...parsed.contact },
      hours: parsed.hours?.length === 7 ? parsed.hours : createDefaultHours(),
      branding: { ...createDefaultState().branding, ...parsed.branding },
      publicationStatus: parsed.publicationStatus ?? 'concept',
      selectedPackage: parsed.selectedPackage ?? 'free',
      publishedAt: parsed.publishedAt ?? null,
      ctaQuoteLabel: parsed.ctaQuoteLabel ?? 'Offerte aanvragen',
      heroTitle: parsed.heroTitle ?? '',
      heroSubtitle: parsed.heroSubtitle ?? '',
      design: { ...DEFAULT_DESIGN_SETTINGS, ...parsed.design },
      heroPlaceholder: parsed.heroPlaceholder ?? 'Hero-afbeelding placeholder',
      galleryPlaceholders: parsed.galleryPlaceholders?.length
        ? parsed.galleryPlaceholders
        : ['Galerij 1', 'Galerij 2', 'Galerij 3'],
    };
  } catch {
    return createDefaultState();
  }
}

export function saveState(state: BuilderState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BUILDER_STORAGE_KEY, JSON.stringify(state));
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(BUILDER_STORAGE_KEY);
}

export function hasStoredUploadMeta(state: BuilderState): {
  logo: boolean;
  photos: boolean;
} {
  return {
    logo: Boolean(state.branding.logoName),
    photos: state.branding.photoNames.length > 0,
  };
}
