export interface LocalServiceBenefit {
  icon: 'speed' | 'design' | 'seo' | 'mobile' | 'communication' | 'scale' | 'custom' | 'growth';
  title: string;
  description: string;
}

export interface LocalServiceStep {
  number: string;
  title: string;
  description: string;
}

export interface LocalServiceFAQ {
  question: string;
  answer: string;
}

export interface LocalServiceNeighbor {
  naam: string;
  slug: string;
}

export interface LocalServiceRelated {
  title: string;
  href: string;
  description: string;
}

export interface LocalServicePageContent {
  city: string;
  citySlug: string;
  province: string;
  serviceName: string;
  serviceSlug: string;
  nationalServiceSlug: string;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    label: string;
    h1: string;
    intro: string;
  };
  serviceIntro: {
    title: string;
    paragraphs: string[];
  };
  localProblem: {
    title: string;
    paragraphs: string[];
  };
  localSolution: {
    title: string;
    paragraphs: string[];
  };
  benefits: LocalServiceBenefit[];
  processSteps: LocalServiceStep[];
  industries: {
    title: string;
    items: string[];
    paragraphs: string[];
  };
  districts: {
    title: string;
    intro: string;
    items: string[];
  };
  relatedServices: LocalServiceRelated[];
  faqs: LocalServiceFAQ[];
  neighbors: LocalServiceNeighbor[];
  image: string;
  imageAlt: string;
  bottomCta: {
    title: string;
    text: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}
