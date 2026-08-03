import type { BuilderState } from '../../../types/builder';
import { createDefaultHours, createServiceId } from '../../builder/constants';
import { createDefaultState } from '../../builder/storage';
import type { BuilderFiles } from '../../builder/files';
import { createEmptyFiles } from '../../builder/files';

/** Test fixture: Bakkerij De Markt — used for local publication testing. */
export function createBakkerijDeMarktState(): BuilderState {
  const state = createDefaultState();
  return {
    ...state,
    currentStep: 8,
    business: {
      name: 'Bakkerij De Markt',
      industry: 'Bakkerij',
      description:
        'Ambachtelijke bakkerij in het hart van de stad. Verse broden, taarten en gebak dagelijks uit eigen oven.',
      services: [
        {
          id: createServiceId(),
          title: 'Vers brood',
          description: 'Dagelijks vers gebakken brood uit onze steenoven.',
        },
        {
          id: createServiceId(),
          title: 'Taarten op maat',
          description: 'Feesttaarten en verjaardagstaarten naar wens.',
        },
        {
          id: createServiceId(),
          title: 'Lunch & koffie',
          description: 'Broodjes, soep en koffie om van te genieten.',
        },
      ],
    },
    contact: {
      phone: '0201234567',
      whatsapp: '31612345678',
      email: 'info@bakkerijdemarkt.nl',
      website: '',
      street: 'Marktstraat 12',
      postcode: '1012 AB',
      city: 'Amsterdam',
      country: 'Nederland',
      kvk: '12345678',
    },
    location: {
      gemeenteSlug: 'amsterdam',
      gemeenteNaam: 'Amsterdam',
      provincie: 'Noord-Holland',
    },
    hours: createDefaultHours().map((day) =>
      day.dayKey === 'sunday'
        ? { ...day, closed: true }
        : { ...day, closed: false, openTime: '07:00', closeTime: '18:00' },
    ),
    branding: {
      primaryColor: '#8B4513',
      accentColor: '#DAA520',
      textColor: '#ffffff',
      logoName: 'logo-bakkerij.svg',
      photoNames: ['brood.jpg', 'taart.jpg'],
      heroImageName: 'brood.jpg',
      socialImageName: '',
    },
    selectedPackage: 'free',
    publishEmailConfirmed: 'info@bakkerijdemarkt.nl',
    publicationStatus: 'concept',
    seoMetaDescription:
      'Bakkerij De Markt in Amsterdam — vers brood, taarten op maat en lunch. Bezoek onze bakkerij op Marktstraat 12.',
    heroTitle: 'Welkom bij Bakkerij De Markt',
    heroSubtitle: 'Vers uit de oven, elke dag opnieuw.',
  };
}

export function createBakkerijDeMarktFiles(): BuilderFiles {
  const files = createEmptyFiles();
  files.logoName = 'logo-bakkerij.svg';
  files.photoNames = ['brood.jpg', 'taart.jpg'];
  return files;
}
