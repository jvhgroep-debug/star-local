import { IMAGES } from './images';

export type ProjectFilterTag = 'website' | 'webshop' | 'seo' | 'platform';
export type ProjectStatus = 'live' | 'development' | 'preview';

export interface Project {
  name: string;
  slug: string;
  categoryNl: string;
  categoryEn: string;
  descriptionNl: string;
  descriptionEn: string;
  website?: string;
  displayUrl?: string;
  image: string;
  fallbackImage?: string;
  featured?: boolean;
  status?: ProjectStatus;
  filters: ProjectFilterTag[];
}

const PLACEHOLDER = '/images/projects/placeholder.svg';

export const projects: Project[] = [
  {
    name: 'Star Local',
    slug: 'star-local',
    categoryNl: 'Webdesign & SEO-platform',
    categoryEn: 'Web design & SEO platform',
    descriptionNl:
      'Het platform voor professionele websites en sterke lokale en landelijke vindbaarheid.',
    descriptionEn:
      'A platform for professional websites and strong local and national online visibility.',
    website: 'https://www.starlocal.nl',
    displayUrl: 'starlocal.nl',
    image: '/images/projects/project-star-local.webp',
    fallbackImage: IMAGES.heroHome,
    featured: true,
    status: 'development',
    filters: ['website', 'seo', 'platform'],
  },
  {
    name: 'Dutch Food Dubai',
    slug: 'dutch-food-dubai',
    categoryNl: 'Shopify-webshop',
    categoryEn: 'Shopify online store',
    descriptionNl: 'Een e-commerceplatform voor Nederlandse snacks en producten in Dubai.',
    descriptionEn: 'An e-commerce platform for Dutch snacks and products in Dubai.',
    website: 'https://www.dutchfooddubai.com',
    displayUrl: 'dutchfooddubai.com',
    image: '/images/projects/project-dutch-food-dubai.webp',
    fallbackImage: IMAGES.heroWebdesign,
    featured: true,
    status: 'live',
    filters: ['webshop', 'website'],
  },
  {
    name: "Captain Crabby's",
    slug: 'captain-crabbys',
    categoryNl: 'Restaurantwebsite & lokale SEO',
    categoryEn: 'Restaurant website & local SEO',
    descriptionNl: 'Een lokale restaurantwebsite gericht op vindbaarheid en directe bestellingen.',
    descriptionEn: 'A local restaurant website focused on visibility and direct orders.',
    website: 'https://captain-crabbys.ae',
    displayUrl: 'captain-crabbys.ae',
    image: '/images/projects/project-captain-crabbys.webp',
    fallbackImage: IMAGES.heroWebdesign,
    featured: true,
    status: 'live',
    filters: ['website', 'seo'],
  },
  {
    name: 'Association Calista',
    slug: 'association-calista',
    categoryNl: 'Meertalige bedrijfswebsite',
    categoryEn: 'Multilingual business website',
    descriptionNl:
      'Een professionele website gericht op bezoekers uit Nederland, België en Frankrijk.',
    descriptionEn:
      'A professional website targeting visitors from the Netherlands, Belgium and France.',
    website: 'https://www.associationcalista.com',
    displayUrl: 'associationcalista.com',
    image: '/images/projects/project-association-calista.webp',
    fallbackImage: IMAGES.heroWebdesign,
    featured: true,
    status: 'live',
    filters: ['website'],
  },
  {
    name: 'Aurora Beauty Salon',
    slug: 'aurora-salon',
    categoryNl: 'Beautywebsite & lokale vindbaarheid',
    categoryEn: 'Beauty website & local visibility',
    descriptionNl: 'Een moderne beautywebsite voor afspraken en lokale zichtbaarheid in Dubai.',
    descriptionEn: 'A modern beauty website for bookings and local visibility in Dubai.',
    website: 'https://www.aurorasalon.info',
    displayUrl: 'aurorasalon.info',
    image: '/images/projects/project-aurora-salon.webp',
    fallbackImage: IMAGES.heroWebdesign,
    featured: true,
    status: 'live',
    filters: ['website', 'seo'],
  },
  {
    name: 'Partybus Nederland',
    slug: 'partybus-nederland',
    categoryNl: 'Landelijk verhuurplatform',
    categoryEn: 'National rental platform',
    descriptionNl: 'Een landelijk platform voor het vinden en aanvragen van partybussen.',
    descriptionEn: 'A national platform for finding and requesting party buses.',
    website: 'https://partybusnederland.nl',
    displayUrl: 'partybusnederland.nl',
    image: '/images/projects/project-partybus-nederland.webp',
    fallbackImage: IMAGES.heroSeo,
    featured: true,
    status: 'live',
    filters: ['platform', 'website'],
  },
  {
    name: 'Taxi naar Schiphol Nederland',
    slug: 'taxi-naar-schiphol-nederland',
    categoryNl: 'Landelijk taxiplatform',
    categoryEn: 'National taxi platform',
    descriptionNl:
      'Een snelle website voor taxiritten vanuit Nederlandse plaatsen naar Schiphol.',
    descriptionEn:
      'A fast website for taxi journeys from Dutch locations to Schiphol Airport.',
    image: '/images/projects/project-taxi-schiphol-nederland.webp',
    fallbackImage: IMAGES.heroSeo,
    featured: true,
    status: 'development',
    filters: ['platform', 'website', 'seo'],
  },
  {
    name: 'CityTicketGo',
    slug: 'city-ticket-go',
    categoryNl: 'Internationaal attractieplatform',
    categoryEn: 'International attraction platform',
    descriptionNl:
      'Een internationaal platform voor het ontdekken en boeken van attracties en tickets.',
    descriptionEn:
      'An international platform for discovering and booking attractions and tickets.',
    website: 'https://cityticketgo.com',
    displayUrl: 'cityticketgo.com',
    image: '/images/projects/project-city-ticket-go.webp',
    fallbackImage: IMAGES.heroGoogleBusiness,
    featured: true,
    status: 'development',
    filters: ['platform'],
  },
  {
    name: 'BMD House Dubai',
    slug: 'bmd-house-dubai',
    categoryNl: 'Restaurantwebsite',
    categoryEn: 'Restaurant website',
    descriptionNl:
      'Een moderne website voor restaurantlocaties in Downtown Dubai en Dubai Creek Harbour.',
    descriptionEn:
      'A modern website for restaurant locations in Downtown Dubai and Dubai Creek Harbour.',
    image: '/images/projects/project-bmd-house.webp',
    fallbackImage: IMAGES.heroWebdesign,
    featured: true,
    status: 'development',
    filters: ['website'],
  },
  {
    name: 'AJ Taxi',
    slug: 'aj-taxi',
    categoryNl: 'Taxiwebsite',
    categoryEn: 'Taxi website',
    descriptionNl: 'Een conversiegerichte taxiwebsite met een eenvoudige WhatsApp-aanvraag.',
    descriptionEn: 'A conversion-focused taxi website with a simple WhatsApp booking flow.',
    image: '/images/projects/project-aj-taxi.webp',
    fallbackImage: IMAGES.heroWebdesign,
    featured: false,
    status: 'development',
    filters: ['website'],
  },
];

export function getProjects(): Project[] {
  return projects;
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured !== false);
}

export function getProjectImage(project: Project): string {
  return project.image || project.fallbackImage || PLACEHOLDER;
}

export const PROJECT_PLACEHOLDER = PLACEHOLDER;
