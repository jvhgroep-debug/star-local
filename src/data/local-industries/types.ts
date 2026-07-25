export interface IndustryLocalServiceBenefit {
  icon: 'speed' | 'design' | 'seo' | 'mobile' | 'communication' | 'scale' | 'custom' | 'growth';
  title: string;
  description: string;
}

export interface IndustryLocalServiceStep {
  number: string;
  title: string;
  description: string;
}

export interface IndustryLocalServiceFAQ {
  question: string;
  answer: string;
}

export interface IndustryLocalServiceRelated {
  title: string;
  href: string;
  description: string;
}

export interface IndustryLocalServicePageContent {
  city: string;
  citySlug: string;
  province: string;
  serviceName: string;
  serviceSlug: string;
  nationalServiceSlug: string;
  industryName: string;
  industrySlug: string;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    label: string;
    h1: string;
    intro: string;
  };
  localIntro: {
    title: string;
    paragraphs: string[];
  };
  whyImportant: {
    title: string;
    paragraphs: string[];
  };
  industryChallenges: {
    title: string;
    paragraphs: string[];
  };
  websiteRequirements: {
    title: string;
    paragraphs: string[];
    items: string[];
  };
  benefits: IndustryLocalServiceBenefit[];
  features: {
    title: string;
    items: string[];
  };
  processSteps: IndustryLocalServiceStep[];
  localAreas: {
    title: string;
    intro: string;
    items: string[];
  };
  relatedIndustries: IndustryLocalServiceRelated[];
  relatedLocalServices: IndustryLocalServiceRelated[];
  faqs: IndustryLocalServiceFAQ[];
  image: string;
  imageAlt: string;
  bottomCta: {
    title: string;
    text: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
}
