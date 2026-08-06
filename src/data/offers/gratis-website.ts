import type { FAQ } from '../services';

export const GRATIS_WEBSITE_STEPS = [
  {
    title: 'Bedrijfsgegevens invullen',
    text: 'Vul uw bedrijfsgegevens in.',
  },
  {
    title: 'Stijl kiezen',
    text: 'Kies uw stijl.',
  },
  {
    title: 'Automatisch opgebouwd',
    text: 'Ons systeem bouwt automatisch uw website.',
  },
] as const;

export const GRATIS_WEBSITE_BENEFITS = [
  'Gratis',
  'Mobiel vriendelijk',
  'Professioneel ontwerp',
  'Eigen dashboard',
  'Later uit te breiden',
] as const;

export const GRATIS_WEBSITE_PAGES = [
  {
    title: 'Home',
    text: 'Een professionele startpagina met uw bedrijfsnaam, diensten en duidelijke call-to-actions.',
  },
  {
    title: 'Over ons',
    text: 'Vertel bezoekers wie u bent, wat u doet en waarom klanten voor u kiezen.',
  },
  {
    title: 'Diensten',
    text: 'Presenteer uw diensten overzichtelijk, zodat bezoekers snel begrijpen wat u aanbiedt.',
  },
  {
    title: 'Contact',
    text: 'Maak het eenvoudig om contact op te nemen via telefoon, WhatsApp of een formulier.',
  },
  {
    title: 'Privacybeleid',
    text: 'Een standaard privacypagina voor een betrouwbare en professionele online aanwezigheid.',
  },
] as const;

export const GRATIS_WEBSITE_AUTO_FEATURES = [
  'WhatsApp knop',
  'Bel knop',
  'Contactformulier',
  'SEO',
  'Mobiel',
  'Eigen kleuren',
  'Eigen logo',
] as const;

export const GRATIS_WEBSITE_INDUSTRIES = [
  { title: 'Restaurant', text: 'Menu, openingstijden en reserveringen duidelijk online.' },
  { title: 'Kapsalon', text: 'Laat uw behandelingen en contactgegevens professioneel zien.' },
  { title: 'Loodgieter', text: 'Bereikbaar voor spoed en reguliere klussen in uw regio.' },
  { title: 'Schilder', text: 'Toon uw vakmanschap en maak offerteaanvragen eenvoudig.' },
  { title: 'Hovenier', text: 'Presenteer tuinonderhoud en aanleg met vertrouwen.' },
  { title: 'Tandarts', text: 'Geef patiënten snel informatie over uw praktijk en bereikbaarheid.' },
  { title: 'Fysiotherapeut', text: 'Leg behandelingen uit en maak afspraken makkelijker.' },
  { title: 'Taxi', text: 'Deel tarieven, servicegebied en directe contactmogelijkheden.' },
  { title: 'Makelaar', text: 'Professionele uitstraling voor lokale woning- en bedrijfsmakelaars.' },
  { title: 'Bakker', text: 'Laat producten, openingstijden en locatie helder zien.' },
  { title: 'Installatiebedrijf', text: 'Toon installatie- en onderhoudsdiensten overzichtelijk.' },
  { title: 'Autogarage', text: 'Maak afspraken en diensten in één oogopslag duidelijk.' },
] as const;

export const GRATIS_WEBSITE_FAQS: FAQ[] = [
  {
    question: 'Is het echt gratis om te starten?',
    answer:
      'Ja. U kunt gratis starten met het aanmaken van uw website. Ons systeem bouwt automatisch een professionele basiswebsite op basis van uw bedrijfsgegevens.',
  },
  {
    question: 'Hoe lang duurt het voordat mijn website klaar is?',
    answer:
      'In ongeveer 3 minuten kunt u uw gegevens invullen en ziet u het resultaat. Ons systeem verwerkt uw input direct en bouwt uw website automatisch op.',
  },
  {
    question: 'Wat heb ik nodig om te beginnen?',
    answer:
      'U heeft uw bedrijfsgegevens nodig, zoals bedrijfsnaam, contactgegevens en een korte omschrijving. Daarnaast kunt u uw logo uploaden en maximaal vijf foto’s toevoegen.',
  },
  {
    question: 'Welke pagina’s krijg ik standaard?',
    answer:
      'Uw website bevat standaard pagina’s voor Home, Over ons, Diensten, Contact en Privacybeleid. Daarnaast worden handige functies zoals WhatsApp, bellen en SEO automatisch toegevoegd.',
  },
  {
    question: 'Is mijn website ook geschikt voor mobiel?',
    answer:
      'Ja. Elke website wordt automatisch mobielvriendelijk opgebouwd, zodat bezoekers op telefoon, tablet en desktop een goede ervaring hebben.',
  },
  {
    question: 'Kan ik mijn logo en kleuren gebruiken?',
    answer:
      'Ja. U uploadt uw logo en ons systeem past uw website aan met uw huisstijl, inclusief eigen kleuren voor een professionele uitstraling.',
  },
  {
    question: 'Wat gebeurt er met mijn gegevens?',
    answer:
      'Uw gegevens worden gebruikt om uw website op te bouwen. We behandelen uw informatie zorgvuldig en volgens ons privacybeleid.',
  },
];
