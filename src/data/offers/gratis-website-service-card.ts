import { getServiceImagePath } from '../service-images';
import { FREE_WEBSITE_START_PATH } from '../site';

export const GRATIS_WEBSITE_SERVICE_CARD = {
  title: 'Gratis website maken',
  description:
    'Maak binnen enkele minuten een professionele bedrijfswebsite. Ons systeem bouwt automatisch vijf complete pagina’s, inclusief contactgegevens, diensten, openingstijden en privacybeleid.',
  href: FREE_WEBSITE_START_PATH,
  ctaLabel: 'Start gratis',
  image: getServiceImagePath('website-laten-maken'),
  imageAlt: 'Gratis website maken met Star Local',
} as const;
