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
  "name": "StarTransfer",
  "slug": "startransfer",
  "categoryNl": "Website voor partybussen & evenementenvervoer",
  "categoryEn": "Party bus & event transport website",
  "descriptionNl": "Een website voor StarTransfer met het wagenpark, partybussen, vervoer voor festivals en feesten en een uitgebreid offerteformulier.",
  "descriptionEn": "A website for StarTransfer featuring the fleet, party buses, transport for festivals and celebrations, and a detailed quotation form.",
  "website": "https://startransfer.nl/",
  "displayUrl": "startransfer.nl",
  "image": "/images/projects/project-startransfer.webp",
  "imageAltNl": "The Experience-partybus van StarTransfer bij zonsondergang",
  "imageAltEn": "StarTransfer’s The Experience party bus at sunset",
  "imagePosition": "center center",
  "pendingScreenshot": false,
  "featured": true,
  "status": "live",
  "filters": [
    "website"
  ]
},
{
  "name": "FlikMart",
  "slug": "flikmart",
  "categoryNl": "Winkelwebsite in de Verenigde Arabische Emiraten",
  "categoryEn": "UAE convenience store website",
  "descriptionNl": "Een tweetalige website in het Engels en Arabisch met eigen winkelfoto’s, assortimentinformatie en campuslocaties in Al Ain en Dubai. Domeinkoppeling en hosting worden afgerond.",
  "descriptionEn": "A bilingual English and Arabic website with original store photography, product categories and campus locations in Al Ain and Dubai. Domain and hosting setup is being completed.",
  "displayUrl": "flikmart.ae",
  "image": "/images/projects/project-flikmart.svg",
  "imageAltNl": "Originele foto van de oranje FlikMart winkelgevel",
  "imageAltEn": "Original photograph of the orange FlikMart storefront",
  "status": "development",
  "featured": true,
  "filters": [
    "website"
  ]
},
  {
    "name": "Super Pasta Dubai",
    "slug": "super-pasta-dubai",
    "categoryNl": "Restaurantwebsite in Dubai",
    "categoryEn": "Dubai restaurant website",
    "descriptionNl": "Een restaurantwebsite voor Super Pasta in Meydan, Dubai, met menukaart, bestelknoppen, blog en direct contact via WhatsApp.",
    "descriptionEn": "A restaurant website for Super Pasta in Meydan, Dubai, with a menu, ordering links, a blog and direct WhatsApp contact.",
    "website": "https://www.superpastadubai.com/",
    "displayUrl": "superpastadubai.com",
    "image": "/images/projects/project-super-pasta-dubai.webp",
    "imageAltNl": "Website van Super Pasta Dubai met menukaart en pasta",
    "imageAltEn": "Super Pasta Dubai website with menu and pasta",
    "imagePosition": "center top",
    "status": "live",
    "featured": true,
    "filters": [
      "website",
      "seo"
    ]
  },
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
    categoryNl: 'Taxiwebsite & lokale SEO',
    categoryEn: 'Taxi website & local SEO',
    descriptionNl: 'Een vernieuwde taxiwebsite voor Breda en omgeving, met luchthavenritten voor €99, lokale landingspagina’s en uitgebreide WhatsApp-aanvragen. De website is gepubliceerd; de koppeling van ajtaxi.nl wordt afgerond.',
    descriptionEn: 'A redesigned taxi website for Breda and the surrounding area, featuring €99 airport transfers, local landing pages and detailed WhatsApp enquiries. The website is published; the ajtaxi.nl domain connection is being completed.',
    website: 'https://www.ajtaxi.nl/',
    displayUrl: 'ajtaxi.nl',
    image: '/images/projects/project-aj-taxi.webp',
    imageAltNl: 'Zwarte taxi met blauwe kentekenplaat bij zonsopkomst op de AJ Taxi-website',
    imageAltEn: 'Black taxi with a blue licence plate at sunrise on the AJ Taxi website',
    imagePosition: 'center center',
    pendingScreenshot: false,
    featured: true,
    status: 'live',
    filters: ['website', 'seo'],
  },
  {
    "name": "Star Local Deals",
    "slug": "star-local-deals",
    "categoryNl": "Internationaal deals- en ontdekkingsplatform",
    "categoryEn": "International deals & discovery platform",
    "descriptionNl": "Een meertalig platform voor lokale bedrijven, restaurants, activiteiten en aanbiedingen in meerdere landen.",
    "descriptionEn": "A multilingual platform for local businesses, restaurants, activities and offers across multiple countries.",
    "imageAltNl": "Websitebeeld van Star Local Deals",
    "imageAltEn": "Website image for Star Local Deals",
    "imagePosition": "center top",
    "image": "/images/projects/project-star-local-deals-capture.svg",
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
    "imageAltNl": "Websitebeeld van Tropicana Breda",
    "imageAltEn": "Website image for Tropicana Breda",
    "imagePosition": "center top",
    "image": "/images/projects/project-tropicana-breda-capture.svg",
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
    "imageAltNl": "Websitebeeld van Loodgieter Vakmannen",
    "imageAltEn": "Website image for Loodgieter Vakmannen",
    "imagePosition": "center top",
    "image": "/images/projects/project-loodgietervakmannen-capture.svg",
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
    "imageAltNl": "Websitebeeld van SchoonVakmannen",
    "imageAltEn": "Website image for SchoonVakmannen",
    "imagePosition": "center top",
    "image": "/images/projects/project-schoonvakmannen-capture.svg",
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
    "descriptionNl": "Een restaurantwebsite met menukaart, contactinformatie en lokale landingspagina’s.",
    "descriptionEn": "A restaurant website with menu, contact information and local landing pages.",
    "imageAltNl": "Foto uit de website van SLYCE Pizza Cafe Dubai",
    "imageAltEn": "Photo from the website of SLYCE Pizza Cafe Dubai",
    "imagePosition": "center top",
    "image": "/images/projects/project-slyce-pizza-cafe-capture.svg",
    "status": "live",
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
    "imageAltNl": "Websitebeeld van Smartwhip Dubai",
    "imageAltEn": "Website image for Smartwhip Dubai",
    "imagePosition": "center top",
    "image": "/images/projects/project-smartwhip-dubai-capture.svg",
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
    "imageAltNl": "Websitebeeld van Dutch Food Dubai · B2B Bestelportaal",
    "imageAltEn": "Website image for Dutch Food Dubai · B2B Bestelportaal",
    "imagePosition": "center top",
    "image": "/images/projects/project-dutch-food-dubai-b2b-capture.svg",
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
    "imageAltNl": "Foto uit de website van De Palletman",
    "imageAltEn": "Photo from the website of De Palletman",
    "imagePosition": "center top",
    "image": "/images/projects/project-de-palletman-capture.svg",
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
