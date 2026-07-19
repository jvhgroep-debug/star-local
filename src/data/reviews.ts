import type { FAQ } from './services';

export const homeFaqs: FAQ[] = [
  {
    question: 'Voor welke bedrijven is Star Local geschikt?',
    answer:
      'Star Local helpt ondernemers en bedrijven die een professionele website willen combineren met betere vindbaarheid in Google, zowel lokaal als landelijk.',
  },
  {
    question: 'Hoe snel kan ik starten?',
    answer:
      'Na een vrijblijvend kennismakingsgesprek ontvangt u een helder voorstel met vervolgstappen en planning.',
  },
  {
    question: 'Bouwen jullie alleen websites?',
    answer:
      'Nee. Naast webdesign bieden we SEO, Google Bedrijfsprofiel optimalisatie, technische optimalisatie, onderhoud en doorlopende online groei.',
  },
  {
    question: 'Werken jullie door heel Nederland?',
    answer:
      'Ja. We ondersteunen bedrijven in heel Nederland met online strategie, webdesign en vindbaarheid.',
  },
];

export const reviews: { name: string; company: string; text: string; rating: number }[] = [];
