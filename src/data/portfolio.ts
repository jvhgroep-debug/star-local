import { IMAGES } from './images';
import type { Locale } from '../i18n/config';
import { portfolioEn } from '../i18n/data/portfolio.en';

export interface PortfolioProject {
  slug: string;
  name: string;
  type: string;
  summary: string;
  challenge: string;
  approach: string;
  work: string[];
  status: string[];
  website?: string;
  image?: string;
  imageAlt?: string;
}

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: 'star-local',
    name: 'Star Local',
    type: 'Website & online groei',
    summary: 'Het platform van Star Local zelf: professionele uitstraling, sterke structuur en focus op lokale vindbaarheid.',
    challenge: 'Een heldere positionering neerzetten als partner voor webdesign, SEO en online groei.',
    approach: 'We combineerden een luxe huisstijl met duidelijke dienstverdeling en conversiegerichte pagina’s.',
    work: ['websiteontwikkeling', 'SEO-structuur', 'branding', 'content'],
    status: ['websiteontwikkeling', 'SEO-structuur'],
    image: IMAGES.heroHome,
    imageAlt: 'Star Local website project',
  },
  {
    slug: 'dutch-food-dubai',
    name: 'Dutch Food Dubai',
    type: 'Website & branding',
    summary: 'Online presentatie voor een foodgerelateerd concept in Dubai.',
    challenge: 'Een professionele internationale uitstraling met duidelijke positionering.',
    approach: 'We ontwikkelden een overzichtelijke website met focus op vertrouwen en vindbaarheid.',
    work: ['websiteontwikkeling', 'branding', 'content'],
    status: ['websiteontwikkeling', 'content'],
    website: 'https://www.dutchfooddubai.com',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Dutch Food Dubai website project',
  },
  {
    slug: 'captain-crabbys',
    name: "Captain Crabby's",
    type: 'Website',
    summary: 'Website voor een horeca-gerelateerd merk met focus op herkenbaarheid en conversie.',
    challenge: 'Een sterke merkbeleving online vertalen naar een duidelijke website.',
    approach: 'We bouwden een visueel sterke site met heldere navigatie en contactmogelijkheden.',
    work: ['websiteontwikkeling', 'branding', 'content'],
    status: ['websiteontwikkeling'],
    image: IMAGES.heroWebdesign,
    imageAlt: "Captain Crabby's website project",
  },
  {
    slug: 'association-calista',
    name: 'Association Calista',
    type: 'Website',
    summary: 'Professionele website voor Association Calista.',
    challenge: 'Informatie helder structureren voor een internationaal publiek.',
    approach: 'We ontwikkelden een overzichtelijke site met focus op vertrouwen en toegankelijkheid.',
    work: ['websiteontwikkeling', 'content', 'technische optimalisatie'],
    status: ['websiteontwikkeling', 'content'],
    website: 'https://www.associationcalista.com',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Association Calista website project',
  },
  {
    slug: 'aurora-salon',
    name: 'Aurora Salon',
    type: 'Website & branding',
    summary: 'Luxe website voor een beauty salon met focus op uitstraling en conversie.',
    challenge: 'Een premium merk online vertalen naar een converterende website.',
    approach: 'We combineerden elegant design met duidelijke dienstpresentatie en contactflow.',
    work: ['websiteontwikkeling', 'branding', 'content'],
    status: ['websiteontwikkeling', 'branding'],
    website: 'https://www.aurorasalon.info',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Aurora Salon website project',
  },
  {
    slug: 'kings-garden-club',
    name: 'Kings Garden Club',
    type: 'Website',
    summary: 'Online aanwezigheid voor Kings Garden Club.',
    challenge: 'Een passende digitale uitstraling neerzetten voor het merk.',
    approach: 'We bouwden een gestructureerde website met focus op beleving en informatie.',
    work: ['websiteontwikkeling', 'content'],
    status: ['websiteontwikkeling'],
    image: IMAGES.heroWebdesign,
    imageAlt: 'Kings Garden Club website project',
  },
  {
    slug: 'challenger-cleaning',
    name: 'Challenger Cleaning',
    type: 'Website & lokale vindbaarheid',
    summary: 'Website voor een schoonmaakbedrijf met focus op lokale vindbaarheid.',
    challenge: 'Diensten helder presenteren en vertrouwen opbouwen bij lokale klanten.',
    approach: 'We ontwikkelden een duidelijke website met sterke basis voor SEO.',
    work: ['websiteontwikkeling', 'SEO-structuur', 'content'],
    status: ['websiteontwikkeling', 'SEO-structuur'],
    image: IMAGES.heroSeo,
    imageAlt: 'Challenger Cleaning website project',
  },
  {
    slug: 'aj-taxi',
    name: 'AJ Taxi',
    type: 'Website',
    summary: 'Website voor een taxibedrijf met focus op bereikbaarheid en aanvragen.',
    challenge: 'Snelle toegang tot boekingsinformatie en contact.',
    approach: 'We bouwden een mobielvriendelijke site met duidelijke call-to-actions.',
    work: ['websiteontwikkeling', 'content'],
    status: ['websiteontwikkeling'],
    image: IMAGES.heroWebdesign,
    imageAlt: 'AJ Taxi website project',
  },
  {
    slug: 'taxi-breda-schiphol',
    name: 'Taxi Breda Schiphol',
    type: 'Website & lokale SEO',
    summary: 'Website voor een taxi-service met regionale focus.',
    challenge: 'Lokale vindbaarheid combineren met een professionele presentatie.',
    approach: 'We ontwikkelden een conversiegerichte site met SEO-basis voor de regio.',
    work: ['websiteontwikkeling', 'SEO-structuur', 'content'],
    status: ['websiteontwikkeling', 'SEO-structuur'],
    image: IMAGES.heroSeo,
    imageAlt: 'Taxi Breda Schiphol website project',
  },
  {
    slug: 'kothu-labs-breda',
    name: 'Kothu Labs Breda',
    type: 'Website & e-commerce',
    summary: 'Online project voor Kothu Labs Breda.',
    challenge: 'Producten en merk online helder en aantrekkelijk presenteren.',
    approach: 'We bouwden een gestructureerde website met focus op gebruiksgemak.',
    work: ['websiteontwikkeling', 'e-commerce', 'content'],
    status: ['websiteontwikkeling', 'e-commerce'],
    image: IMAGES.heroWebdesign,
    imageAlt: 'Kothu Labs Breda website project',
  },
];

const portfolioByLocale: Record<Locale, PortfolioProject[]> = {
  nl: portfolioProjects,
  en: portfolioEn,
};

export function getPortfolioProjects(locale: Locale): PortfolioProject[] {
  return portfolioByLocale[locale];
}

export function getPortfolioProject(slug: string, locale: Locale = 'nl'): PortfolioProject | undefined {
  return getPortfolioProjects(locale).find((p) => p.slug === slug);
}
