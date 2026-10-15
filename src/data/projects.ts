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
  cover?: { color: string; mark: string };
  fallbackImage?: string;
  /** When true, show fallback immediately (real screenshot not available yet). */
  pendingScreenshot?: boolean;
  imageAltNl?: string;
  imageAltEn?: string;
  imagePosition?: string;
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
    status: 'live',
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
    name: 'Aurora Beauty Lounge by Tolou',
    slug: 'aurora-salon',
    categoryNl: 'Beautywebsite & lokale vindbaarheid',
    categoryEn: 'Beauty website & local visibility',
    descriptionNl: 'Een moderne beautywebsite voor afspraken en lokale zichtbaarheid in Dubai.',
    descriptionEn: 'A modern beauty website for bookings and local visibility in Dubai.',
    website: 'https://aurorasalondubai.com',
    displayUrl: 'aurorasalondubai.com',
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
    pendingScreenshot: true,
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
    website: 'https://taxinaarschipholnederland.nl/',
    displayUrl: 'taxinaarschipholnederland.nl',
    image: '/images/projects/project-taxi-schiphol-nederland.webp',
    fallbackImage: IMAGES.heroSeo,
    featured: true,
    status: 'live',
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
    status: 'live',
    filters: ['platform'],
  },
  {
    name: 'Dakvakmannen.nl',
    slug: 'dakvakmannen',
    categoryNl: 'Leadplatform & lokale SEO',
    categoryEn: 'Lead platform & local SEO',
    descriptionNl:
      'Een platform dat huiseigenaren en bedrijven koppelt aan betrouwbare dakvakmannen in hun regio, met duidelijke aanvragen en lokale vindbaarheid.',
    descriptionEn:
      'A platform connecting homeowners and businesses with trusted roofing professionals in their area, with clear requests and local visibility.',
    website: 'https://dakvakmannen.nl/',
    displayUrl: 'dakvakmannen.nl',
    image: '/images/projects/project-dakvakmannen.png',
    fallbackImage: IMAGES.heroSeo,
    featured: true,
    status: 'live',
    filters: ['platform', 'website', 'seo'],
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
    pendingScreenshot: true,
    featured: false,
    status: 'development',
    filters: ['website'],
  },
  {
    "name": "Star Local Deals",
    "slug": "star-local-deals",
    "categoryNl": "Internationaal deals- en ontdekkingsplatform",
    "categoryEn": "International deals & discovery platform",
    "descriptionNl": "Een meertalig platform voor lokale bedrijven, restaurants, activiteiten en aanbiedingen in meerdere landen.",
    "descriptionEn": "A multilingual platform for local businesses, restaurants, activities and offers across multiple countries.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#12645b",
      "mark": "SLD"
    },
    "status": "live",
    "featured": true,
    "filters": [
      "platform",
      "website",
      "seo"
    ],
    "website": "https://starlocaldeals.com",
    "displayUrl": "starlocaldeals.com"
  },
  {
    "name": "Tropicana Breda",
    "slug": "tropicana-breda",
    "categoryNl": "Restaurantwebsite & zaalverhuur",
    "categoryEn": "Restaurant website & venue hire",
    "descriptionNl": "Een restaurantwebsite met menukaart, zaalverhuur, catering, lokale SEO en directe WhatsApp-aanvragen.",
    "descriptionEn": "A restaurant website with menu links, venue hire, catering, local SEO and direct WhatsApp enquiries.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#8a4c25",
      "mark": "TB"
    },
    "status": "live",
    "featured": true,
    "filters": [
      "website",
      "seo"
    ],
    "website": "https://tropicanabreda.nl",
    "displayUrl": "tropicanabreda.nl"
  },
  {
    "name": "LoodgieterVakmannen",
    "slug": "loodgietervakmannen",
    "categoryNl": "Lokaal diensten- en leadplatform",
    "categoryEn": "Local services & lead platform",
    "descriptionNl": "Een platform met lokale loodgieterpagina’s, regionale partners en duidelijke aanvraagroutes.",
    "descriptionEn": "A platform with local plumbing pages, regional partners and clear enquiry routes.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#185381",
      "mark": "LV"
    },
    "status": "live",
    "featured": true,
    "filters": [
      "platform",
      "website",
      "seo"
    ],
    "website": "https://loodgietervakmannen.nl",
    "displayUrl": "loodgietervakmannen.nl"
  },
  {
    "name": "SchoonVakmannen",
    "slug": "schoonvakmannen",
    "categoryNl": "Schoonmaakplatform & lokale SEO",
    "categoryEn": "Cleaning platform & local SEO",
    "descriptionNl": "Een lokaal dienstenplatform voor schoonmaakbedrijven, met regiopagina’s en aanvragen via WhatsApp.",
    "descriptionEn": "A local services platform for cleaning companies, with regional pages and WhatsApp enquiries.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#1d6873",
      "mark": "SV"
    },
    "status": "live",
    "featured": true,
    "filters": [
      "platform",
      "website",
      "seo"
    ],
    "website": "https://schoonvakmannen.nl",
    "displayUrl": "schoonvakmannen.nl"
  },
  {
    "name": "SLYCE Pizza Cafe Dubai",
    "slug": "slyce-pizza-cafe",
    "categoryNl": "Restaurantwebsite in Dubai",
    "categoryEn": "Dubai restaurant website",
    "descriptionNl": "Een restaurantwebsite met menukaart, contactinformatie en lokale landingspagina’s. Bekijk de gepubliceerde preview.",
    "descriptionEn": "A restaurant website with menu, contact information and local landing pages. View the published preview.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#984021",
      "mark": "SLYCE"
    },
    "status": "preview",
    "featured": true,
    "filters": [
      "website",
      "seo"
    ],
    "website": "https://slyce-pizza-cafe-preview.pages.dev"
  },
  {
    "name": "Smartwhip Dubai",
    "slug": "smartwhip-dubai",
    "categoryNl": "Productwebsite & WhatsApp-bestellingen",
    "categoryEn": "Product website & WhatsApp ordering",
    "descriptionNl": "Een productwebsite voor slagroompatronen, met WhatsApp-bestellingen en informatie over bezorging in Dubai.",
    "descriptionEn": "A cream charger product website with WhatsApp ordering and delivery information for Dubai.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#364f6c",
      "mark": "SW"
    },
    "status": "live",
    "featured": true,
    "filters": [
      "website",
      "seo"
    ],
    "website": "https://smartwhip-dubai.jvhgroep.chatgpt.site"
  },
  {
    "name": "Dutch Food Dubai · B2B",
    "slug": "dutch-food-dubai-b2b",
    "categoryNl": "Zakelijk bestelportaal · prototype",
    "categoryEn": "B2B ordering portal · prototype",
    "descriptionNl": "Een ontwerp-prototype met voorbeeldgegevens voor een zakelijk bestelportaal met klantprijzen, betaalafspraken en een beheeromgeving.",
    "descriptionEn": "A design prototype with sample data for a B2B ordering portal with customer pricing, payment terms and an administration area.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#24426f",
      "mark": "B2B"
    },
    "status": "preview",
    "featured": true,
    "filters": [
      "platform",
      "webshop"
    ],
    "website": "https://b2b.dutchfooddubai.com",
    "displayUrl": "b2b.dutchfooddubai.com"
  },
  {
    "name": "Touringcar Manager",
    "slug": "touringcar-manager",
    "categoryNl": "Beheersoftware voor touringcarbedrijven",
    "categoryEn": "Coach operator management software",
    "descriptionNl": "Software in ontwikkeling voor boekingen, klanten, routes, chauffeurs, betalingen en tickets.",
    "descriptionEn": "Software in development for bookings, customers, routes, drivers, payments and tickets.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#284f54",
      "mark": "TM"
    },
    "status": "development",
    "featured": true,
    "filters": [
      "platform"
    ]
  },
  {
    "name": "ZalenNederland",
    "slug": "zalennederland",
    "categoryNl": "Platform voor zaalverhuur",
    "categoryEn": "Venue hire platform",
    "descriptionNl": "Een platform in ontwikkeling voor het vinden van zalen en feestlocaties per gemeente.",
    "descriptionEn": "A platform in development for finding venues and event spaces by municipality.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#6a5531",
      "mark": "ZN"
    },
    "status": "development",
    "featured": true,
    "filters": [
      "platform",
      "website"
    ]
  },
  {
    "name": "StarClima",
    "slug": "starclima",
    "categoryNl": "Bedrijfswebsite · in ontwikkeling",
    "categoryEn": "Business website · in development",
    "descriptionNl": "Een bedrijfswebsite in ontwikkeling. Meer informatie volgt na oplevering.",
    "descriptionEn": "A business website in development. More information will follow after completion.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#285578",
      "mark": "SC"
    },
    "status": "development",
    "featured": true,
    "filters": [
      "website"
    ]
  },
  {
    "name": "De Palletman",
    "slug": "de-palletman",
    "categoryNl": "Bedrijfswebsite · in ontwikkeling",
    "categoryEn": "Business website · in development",
    "descriptionNl": "Een bedrijfswebsite in ontwikkeling voor De Palletman. Meer informatie volgt na oplevering.",
    "descriptionEn": "A business website in development for De Palletman. More information will follow after completion.",
    "image": "/images/projects/placeholder.svg",
    "cover": {
      "color": "#6d4e35",
      "mark": "PM"
    },
    "status": "development",
    "featured": true,
    "filters": [
      "website"
    ]
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
