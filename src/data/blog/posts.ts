import type { BlogPostMeta } from './types';

export const BLOG_IMAGE = '/images/blog/blog-autoverhuur-website-boekingssysteem.png';

export const blogPosts: BlogPostMeta[] = [
  {
    slug: 'autoverhuur-website-met-boekingssysteem-en-app',
    title: 'Meer boekingen met een autoverhuurwebsite en app',
    h1: 'Meer boekingen met een professionele autoverhuurwebsite en reserveringssysteem',
    excerpt:
      'Een compleet digitaal pakket voor autoverhuurbedrijven met website, reserveringssysteem, wagenparkbeheer en mobiele apps.',
    category: 'Webdesign',
    image: BLOG_IMAGE,
    imageAlt: 'Complete autoverhuurwebsite met boekingssysteem en mobiele app van Star Local',
    imageWidth: 1672,
    imageHeight: 941,
    seoTitle: 'Autoverhuur website laten maken met boekingssysteem en app | Star Local',
    seoDescription:
      'Professionele autoverhuurwebsite met online boekingssysteem, wagenparkbeheer, Android-app en iPhone-app. Tijdelijke actieprijs: €999.',
    ogDescription:
      'Complete autoverhuurwebsite met boekingssysteem, wagenparkbeheer en mobiele apps. Tijdelijke actieprijs: €999.',
    canonicalPath: '/blog/autoverhuur-website-met-boekingssysteem-en-app/',
    publishedAt: '2026-07-21',
    updatedAt: '2026-07-21',
    author: 'Star Local',
    authorBio:
      'Geschreven door Star Local – specialist in websites, lokale SEO en schaalbare digitale platforms.',
    faqs: [
      {
        question: 'Wat kost een autoverhuurwebsite met boekingssysteem?',
        answer:
          'Het complete autoverhuurpakket is tijdelijk beschikbaar voor €999 eenmalig. Publicatie in Google Play en Apple App Store kost €399 apart. Aanvullende kosten kunnen gelden voor hosting, onderhoud, betaalproviders, appstore-accounts, externe software en andere diensten.',
      },
      {
        question: 'Kunnen klanten direct online reserveren?',
        answer:
          'Ja. Klanten kunnen beschikbare voertuigen bekijken, een huurperiode kiezen, locaties selecteren en direct reserveren. Online betalen kan optioneel worden ingericht, afhankelijk van de gekozen betaalprovider en configuratie.',
      },
      {
        question: 'Kan ik zelf voertuigen en prijzen aanpassen?',
        answer:
          'Ja. Via het beheerpaneel kunt u voertuigen toevoegen en verwijderen, beschikbaarheid aanpassen, prijzen wijzigen, foto\'s uploaden en reserveringen beheren — alles vanuit één dashboard.',
      },
      {
        question: 'Zijn Android- en iPhone-apps inbegrepen?',
        answer:
          'Ja. Het pakket omvat een professionele mobiele app voor Android en iPhone, naast de website en het boekingssysteem. Publicatie in de appstores verloopt via een apart traject van €399.',
      },
      {
        question: 'Helpt Star Local met SEO voor autoverhuur?',
        answer:
          'Ja. Star Local bouwt de website met een technische en inhoudelijke SEO-basis voor relevante zoekopdrachten rond autoverhuur. SEO biedt geen garantie op een specifieke positie, maar helpt wel een sterke basis voor organische zichtbaarheid op te bouwen.',
      },
      {
        question: 'Is het systeem geschikt voor Nederland, België en Duitsland?',
        answer:
          'Ja. De oplossing is geschikt voor autoverhuurbedrijven die actief zijn in Nederland, België en Duitsland. Taal, content en lokale instellingen worden afgestemd op uw markt en configuratie.',
      },
      {
        question: 'Zijn er nog maandelijkse kosten?',
        answer:
          'De eenmalige actieprijs dekt het complete pakket zoals beschreven. Aanvullende kosten kunnen gelden voor hosting, onderhoud, betaalproviders, appstore-accounts, externe software, appstore-publicatie en andere diensten wanneer dat van toepassing is.',
      },
      {
        question: 'Hoe lang duurt de ontwikkeling?',
        answer:
          'De doorlooptijd hangt af van het aantal voertuigen, gewenste functionaliteit, content en feedbackrondes. Star Local bespreekt vooraf een realistische planning zodat u weet wanneer uw platform live kan gaan.',
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPostMeta | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getPublishedBlogPosts(): BlogPostMeta[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}
