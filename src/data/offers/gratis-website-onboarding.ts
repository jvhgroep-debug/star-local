import type { FAQ } from '../services';

export const ONBOARDING_TITLE = 'Welkom bij Star Local Website Builder';

export const ONBOARDING_INTRO =
  'In slechts 3 minuten maakt ons systeem een professionele website voor uw bedrijf.';

export const ONBOARDING_INCLUDED = [
  'Professionele homepage',
  'Over ons',
  'Diensten',
  'Contactpagina',
  'Privacybeleid',
  'Mobiel vriendelijk',
  'Klaar om later uit te breiden',
] as const;

export const ONBOARDING_WIZARD_NOTE =
  'Tijdens de wizard vragen we alleen de informatie die nodig is om uw website automatisch op te bouwen.';

export const ONBOARDING_FAQS: FAQ[] = [
  {
    question: 'Hoe lang duurt het?',
    answer:
      'Ongeveer 3 minuten. U vult uw bedrijfsgegevens in, kiest uw stijl en ons systeem bouwt uw website direct automatisch op. U ziet het resultaat meteen.',
  },
  {
    question: 'Kost het echt niets?',
    answer:
      'Ja, u kunt gratis starten. Het aanmaken van uw website kost niets. U betaalt pas als u later kiest voor extra functies of uitbreidingen.',
  },
  {
    question: 'Kan ik later uitbreiden?',
    answer:
      'Absoluut. Uw website is een solide basis die u later kunt uitbreiden met extra pagina\'s, functies of een professioneel domein — wanneer u daar klaar voor bent.',
  },
  {
    question: 'Heb ik technische kennis nodig?',
    answer:
      'Nee. U hoeft geen code te schrijven of technische keuzes te maken. Vul uw gegevens in en ons systeem doet de rest.',
  },
];
