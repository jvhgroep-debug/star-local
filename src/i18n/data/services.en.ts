import { IMAGES } from '../../data/images';
import type { Service } from '../../data/services';

export const defaultWhyUsEn = [
  'Personal guidance from strategy through to delivery',
  'Focus on visibility, speed, and conversion',
  'Clear communication and measurable improvements',
];

export const servicesEn: Service[] = [
  {
    slug: 'website-laten-maken',
    title: 'Website Design | Star Local',
    description:
      'Have a professional, fast, and search-friendly website built by Star Local. Build trust and generate more enquiries.',
    h1: 'Website Design',
    intro:
      'A strong website is the foundation of your online growth. Star Local designs and builds professional websites that load quickly, inspire trust, and turn visitors into customers.',
    positioning:
      'Professional, fast, and search-friendly websites that build trust and drive enquiries.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Professional web design by Star Local',
    benefits: [
      'Modern design that fits your brand',
      'Fast load times and mobile optimization',
      'Clear structure for better visibility',
      'Conversion-focused pages and calls to action',
    ],
    approach: [
      { title: 'Discovery', text: 'We discuss your goals, target audience, and desired look and feel.' },
      { title: 'Structure & design', text: 'We define page layout, content, and visual direction.' },
      { title: 'Development', text: 'We build a fast, secure website with a strong SEO foundation.' },
      { title: 'Launch', text: 'After review and optimization, your website goes live.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['lokale-seo', 'technische-seo', 'website-onderhoud'],
    faqs: [
      {
        question: 'How long does it take to build a website?',
        answer: 'That depends on scope and functionality. After an initial consultation, you receive a clear timeline.',
      },
      {
        question: 'Can you also provide content?',
        answer: 'Yes, we support you with professional content and SEO copy where needed.',
      },
    ],
  },
  {
    slug: 'webshop-laten-maken',
    title: 'E-commerce Store Development | Star Local',
    description:
      'Star Local builds conversion-focused online stores with a fast user experience and clear product structure.',
    h1: 'E-commerce Store Development',
    intro:
      'A successful online store requires more than attractive design. Star Local combines usability, technical quality, and visibility to drive online sales.',
    positioning:
      'Conversion-focused online stores with a fast user experience and a clear product structure.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'E-commerce store development by Star Local',
    benefits: [
      'Clear product structure',
      'Fast checkout experience',
      'Mobile optimized',
      'Technical foundation for growth',
    ],
    approach: [
      { title: 'Analysis', text: 'We map out your product range, target audience, and sales goals.' },
      { title: 'UX & design', text: 'We design an online store that builds trust and converts.' },
      { title: 'Build & integrations', text: 'We implement payments, inventory, and essential connections.' },
      { title: 'Optimization', text: 'We improve speed, visibility, and conversion after launch.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['shopify-ontwikkeling', 'conversie-optimalisatie', 'technische-seo'],
    faqs: [
      {
        question: 'Which e-commerce platforms do you support?',
        answer: 'We work with Shopify and custom solutions, among others, depending on your requirements.',
      },
    ],
  },
  {
    slug: 'lokale-seo',
    title: 'Local SEO | Star Local',
    description:
      'Improve your local visibility in Google with Star Local. Reach more customers in your area through targeted SEO.',
    h1: 'Local SEO',
    intro:
      'Want to be found more often by customers in your area? With local SEO, Star Local improves your visibility in Google Maps and local search results.',
    positioning: 'Better visibility for local searches and customers in your region.',
    image: IMAGES.serviceLocalSeo,
    imageAlt: 'Local SEO for better visibility in your region',
    benefits: [
      'Stronger position in local search results',
      'Better Google Business Profile integration',
      'More relevant visitors from your area',
      'Measurable growth in visibility',
    ],
    approach: [
      { title: 'Local analysis', text: 'We research search behaviour and competition in your region.' },
      { title: 'Optimization', text: 'We improve pages, content, and local signals.' },
      { title: 'Monitoring', text: 'We track results and adjust where needed.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['google-bedrijfsprofiel', 'landelijke-seo', 'seo-audit'],
    faqs: [
      {
        question: 'Which businesses is local SEO suitable for?',
        answer: 'For businesses that want to reach customers in a specific region or city.',
      },
    ],
  },
  {
    slug: 'landelijke-seo',
    title: 'National SEO | Star Local',
    description:
      'Scalable SEO strategy for businesses that want to be found in multiple cities and regions across the Netherlands.',
    h1: 'National SEO',
    intro:
      'Want to grow beyond your immediate area? Star Local helps with a scalable SEO strategy for nationwide visibility.',
    positioning:
      'A scalable SEO strategy that helps businesses get found in multiple cities, regions, and across the Netherlands.',
    image: IMAGES.heroSeo,
    imageAlt: 'National SEO strategy for online growth',
    benefits: [
      'Strategy for multiple regions',
      'Scalable content structure',
      'Technical SEO foundation',
      'Ongoing optimization',
    ],
    approach: [
      { title: 'Strategy', text: 'We define priority regions, keywords, and page structure.' },
      { title: 'Execution', text: 'We build and optimize pages and internal links.' },
      { title: 'Growth', text: 'We monitor performance and scale successful elements.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['lokale-seo', 'linkbuilding', 'ai-content'],
    faqs: [
      {
        question: 'What is the difference from local SEO?',
        answer: 'National SEO focuses on broader geographic coverage and scalable growth.',
      },
    ],
  },
  {
    slug: 'ai-seo',
    title: 'AI SEO | Star Local',
    description:
      'Optimize your website and content for modern search experiences with Star Local\'s AI SEO approach.',
    h1: 'AI SEO',
    intro:
      'Search behaviour is changing. Star Local helps optimize your website and content for modern search engines and AI search experiences — with a focus on quality and brand consistency.',
    positioning:
      'Optimizing websites and content for modern search engines and AI search experiences.',
    image: IMAGES.heroSeo,
    imageAlt: 'AI SEO optimization for modern search experiences',
    benefits: [
      'Content aligned with modern search intent',
      'Clear and trustworthy information architecture',
      'Human quality control',
      'Better visibility across multiple channels',
    ],
    approach: [
      { title: 'Analysis', text: 'We assess current content, structure, and search intent.' },
      { title: 'Optimization', text: 'We improve pages, answers, and technical signals.' },
      { title: 'Monitoring', text: 'We track performance and adapt the strategy.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['ai-content', 'technische-seo', 'landelijke-seo'],
    faqs: [
      {
        question: 'Does AI SEO replace traditional SEO?',
        answer: 'No, it is a complement that helps with modern search experiences and content quality.',
      },
    ],
  },
  {
    slug: 'google-bedrijfsprofiel',
    title: 'Google Business Profile | Star Local',
    description:
      'Maximum visibility in Google Maps and local search results with optimization of your Google Business Profile.',
    h1: 'Google Business Profile',
    intro:
      'Your Google Business Profile is often the first touchpoint with new customers. Star Local optimizes your profile for maximum local visibility.',
    positioning: 'Better visibility in Google Maps and local search results.',
    image: IMAGES.heroGoogleBusiness,
    imageAlt: 'Google Business Profile optimization by Star Local',
    benefits: [
      'Complete and trustworthy profile',
      'Better local rankings',
      'More trust from searchers',
      'Consistent business information',
    ],
    approach: [
      { title: 'Audit', text: 'We review your profile, categories, photos, and reviews.' },
      { title: 'Optimization', text: 'We improve content, services, and local signals.' },
      { title: 'Management', text: 'We help with updates and ongoing improvement.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['lokale-seo', 'reviews', 'seo-audit'],
    faqs: [
      {
        question: 'Can you help with review management?',
        answer: 'We advise on structure and communication around reviews, without unrealistic promises.',
      },
    ],
  },
  {
    slug: 'website-onderhoud',
    title: 'Website Maintenance | Star Local',
    description:
      'Reliable website maintenance: updates, security, speed, and ongoing improvements by Star Local.',
    h1: 'Website Maintenance',
    intro:
      'A website requires continuous maintenance. Star Local handles updates, security, monitoring, and ongoing improvements so your site stays reliable.',
    positioning: 'Updates, security, speed, monitoring, and ongoing improvements.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Website maintenance and technical optimization',
    benefits: [
      'Regular updates',
      'Security monitoring',
      'Speed optimization',
      'Technical support',
    ],
    approach: [
      { title: 'Assessment', text: 'We map out the current status and risks.' },
      { title: 'Maintenance plan', text: 'We set up a clear maintenance schedule.' },
      { title: 'Execution', text: 'We carry out updates and improvements.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['hosting', 'technische-seo', 'website-snelheid-optimaliseren'],
    faqs: [
      {
        question: 'Is monthly maintenance available?',
        answer: 'Yes, we offer ongoing maintenance based on your needs.',
      },
    ],
  },
  {
    slug: 'hosting',
    title: 'Hosting | Star Local',
    description: 'Fast, secure, and reliable hosting for your website through Star Local.',
    h1: 'Hosting',
    intro:
      'Reliable hosting is essential for performance and security. Star Local provides fast and secure hosting solutions tailored to your website.',
    positioning: 'Fast, secure, and reliable hosting.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Reliable website hosting',
    benefits: ['Fast servers', 'SSL and security', 'Monitoring', 'Technical support'],
    approach: [
      { title: 'Advice', text: 'We determine the right hosting environment for your project.' },
      { title: 'Setup', text: 'We configure domain, DNS, and security.' },
      { title: 'Management', text: 'We monitor performance and availability.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['domeinnaam-registratie', 'website-onderhoud', 'website-snelheid-optimaliseren'],
    faqs: [
      {
        question: 'Can you migrate existing hosting?',
        answer: 'Yes, we guide migrations carefully to minimize downtime.',
      },
    ],
  },
  {
    slug: 'domeinnaam-registratie',
    title: 'Domain Registration | Star Local',
    description: 'Help with domain registration, DNS configuration, and security by Star Local.',
    h1: 'Domain Registration',
    intro:
      'Star Local helps you choose, register, and correctly connect your domain name, including DNS and security.',
    positioning: 'Help with registration, connection, DNS, and security.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Domain registration and DNS management',
    benefits: [
      'Advice on domain choice',
      'Correct DNS configuration',
      'Security settings',
      'Connection with website and email',
    ],
    approach: [
      { title: 'Selection', text: 'We advise on suitable domain names.' },
      { title: 'Registration', text: 'We arrange registration and ownership.' },
      { title: 'Connection', text: 'We connect the domain to your website and services.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['hosting', 'website-laten-maken', 'website-onderhoud'],
    faqs: [
      {
        question: 'Do you also manage DNS records?',
        answer: 'Yes, we help with correct DNS settings and updates.',
      },
    ],
  },
  {
    slug: 'shopify-ontwikkeling',
    title: 'Shopify Development | Star Local',
    description:
      'Professional Shopify stores with SEO, structure, and conversion optimization by Star Local.',
    h1: 'Shopify Development',
    intro:
      'Star Local builds professional Shopify stores with strong structure, visibility, and a conversion-focused setup.',
    positioning: 'Professional Shopify stores with SEO, structure, and conversion optimization.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Shopify store development',
    benefits: [
      'Professional Shopify design',
      'SEO-friendly structure',
      'Fast performance',
      'Conversion-focused setup',
    ],
    approach: [
      { title: 'Setup', text: 'We configure theme, structure, and basic settings.' },
      { title: 'Development', text: 'We build product pages, collections, and checkout flow.' },
      { title: 'Optimization', text: 'We improve speed, SEO, and conversion.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['webshop-laten-maken', 'conversie-optimalisatie', 'technische-seo'],
    faqs: [
      {
        question: 'Can you improve existing Shopify stores?',
        answer: 'Yes, we optimize existing stores for design, speed, and visibility.',
      },
    ],
  },
  {
    slug: 'wordpress-ontwikkeling',
    title: 'WordPress Development | Star Local',
    description:
      'Professional WordPress solutions for existing clients and specific projects.',
    h1: 'WordPress Development',
    intro:
      'For existing WordPress environments and specific projects, Star Local offers professional development, optimization, and maintenance.',
    positioning:
      'Professional WordPress solutions for existing clients, without presenting WordPress as the default for all new projects.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'WordPress development and optimization',
    benefits: [
      'Custom work within WordPress',
      'Performance optimization',
      'Security improvements',
      'Ongoing maintenance',
    ],
    approach: [
      { title: 'Analysis', text: 'We assess theme, plugins, and technical status.' },
      { title: 'Improvement', text: 'We optimize structure, speed, and security.' },
      { title: 'Management', text: 'We provide maintenance and further development.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['website-onderhoud', 'technische-seo', 'website-laten-maken'],
    faqs: [
      {
        question: 'Is WordPress always the best choice?',
        answer: 'Not always. We recommend the platform that best fits your goals.',
      },
    ],
  },
  {
    slug: 'technische-seo',
    title: 'Technical SEO | Star Local',
    description:
      'Improve indexability, structure, speed, and structured data with technical SEO from Star Local.',
    h1: 'Technical SEO',
    intro:
      'Technical SEO forms the foundation of online visibility. Star Local improves indexability, site structure, speed, and structured data.',
    positioning:
      'Improve indexability, structure, speed, structured data, and technical quality.',
    image: IMAGES.heroSeo,
    imageAlt: 'Technical SEO analysis and optimization',
    benefits: [
      'Better crawlability',
      'Strong site architecture',
      'Structured data',
      'Performance improvement',
    ],
    approach: [
      { title: 'Technical audit', text: 'We analyze indexing, structure, and performance.' },
      { title: 'Implementation', text: 'We resolve technical bottlenecks.' },
      { title: 'Validation', text: 'We verify results and ensure quality.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['seo-audit', 'website-snelheid-optimaliseren', 'lokale-seo'],
    faqs: [
      {
        question: 'What falls under technical SEO?',
        answer: 'Among other things: indexing, redirects, structured data, sitemaps, and Core Web Vitals.',
      },
    ],
  },
  {
    slug: 'website-snelheid-optimaliseren',
    title: 'Website Speed Optimization | Star Local',
    description:
      'Improve Core Web Vitals, load time, and user experience with speed optimization by Star Local.',
    h1: 'Website Speed Optimization',
    intro:
      'Fast websites rank better and convert more. Star Local optimizes images, code, caching, and load time.',
    positioning: 'Core Web Vitals, images, code, caching, and load time.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Website speed and performance optimization',
    benefits: [
      'Better Core Web Vitals',
      'Faster load time',
      'Lower bounce rate',
      'Better user experience',
    ],
    approach: [
      { title: 'Measurement', text: 'We analyze current performance and bottlenecks.' },
      { title: 'Optimization', text: 'We improve assets, code, and caching.' },
      { title: 'Monitoring', text: 'We track performance after optimization.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['technische-seo', 'website-onderhoud', 'hosting'],
    faqs: [
      {
        question: 'How quickly will I notice a difference?',
        answer: 'Many improvements are directly measurable after implementation.',
      },
    ],
  },
  {
    slug: 'seo-audit',
    title: 'SEO Audit | Star Local',
    description:
      'Comprehensive SEO audit of technical setup, content, internal links, and growth opportunities by Star Local.',
    h1: 'SEO Audit',
    intro:
      'Do you know where your biggest SEO opportunities lie? Star Local performs a thorough audit of technical setup, content, and growth potential.',
    positioning: 'Analysis of technical setup, content, internal links, keywords, and growth opportunities.',
    image: IMAGES.heroSeo,
    imageAlt: 'SEO audit and growth opportunity analysis',
    benefits: [
      'Clear overview of bottlenecks',
      'Prioritized action list',
      'Technical and content analysis',
      'Concrete next steps',
    ],
    approach: [
      { title: 'Scan', text: 'We analyze technical setup, content, and competition.' },
      { title: 'Report', text: 'You receive a clear overview with priorities.' },
      { title: 'Plan', text: 'We create an actionable improvement plan.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['technische-seo', 'lokale-seo', 'linkbuilding'],
    faqs: [
      {
        question: 'What do I receive after an SEO audit?',
        answer: 'An overview of findings, priorities, and recommended next steps.',
      },
    ],
  },
  {
    slug: 'conversie-optimalisatie',
    title: 'Conversion Optimization | Star Local',
    description:
      'More enquiries and sales from existing visitors with conversion optimization by Star Local.',
    h1: 'Conversion Optimization',
    intro:
      'More visitors only matter if they convert. Star Local optimizes pages, forms, and customer journeys for better results.',
    positioning: 'More enquiries and sales from existing visitors.',
    image: IMAGES.heroWebdesign,
    imageAlt: 'Conversion optimization for more enquiries',
    benefits: [
      'Better calls to action',
      'Optimized forms',
      'Clearer value propositions',
      'More leads from the same traffic',
    ],
    approach: [
      { title: 'Analysis', text: 'We examine behaviour, bottlenecks, and drop-off points.' },
      { title: 'Testing', text: 'We improve pages and conversion elements.' },
      { title: 'Optimization', text: 'We implement successful improvements systematically.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['website-laten-maken', 'webshop-laten-maken', 'ai-content'],
    faqs: [
      {
        question: 'Does CRO work for existing websites too?',
        answer: 'Yes, optimizing existing traffic often delivers quick wins.',
      },
    ],
  },
  {
    slug: 'linkbuilding',
    title: 'Link Building | Star Local',
    description:
      'Quality authority and relevant referrals with professional link building by Star Local.',
    h1: 'Link Building',
    intro:
      'Authority remains an important SEO signal. Star Local helps with relevant, quality referrals that fit your brand and industry.',
    positioning: 'Quality authority and relevant referrals.',
    image: IMAGES.heroSeo,
    imageAlt: 'Link building and building online authority',
    benefits: [
      'Relevant referrals',
      'Brand-strengthening partnerships',
      'Sustainable authority building',
      'Strategic prioritization',
    ],
    approach: [
      { title: 'Strategy', text: 'We identify relevant sources and opportunities.' },
      { title: 'Execution', text: 'We secure quality referrals.' },
      { title: 'Monitoring', text: 'We track impact and adjust accordingly.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['landelijke-seo', 'seo-audit', 'ai-content'],
    faqs: [
      {
        question: 'How long does link building take?',
        answer: 'Authority building is an ongoing process with results in the medium term.',
      },
    ],
  },
  {
    slug: 'ai-content',
    title: 'AI Content | Star Local',
    description:
      'Professional content support with human quality control and brand consistency by Star Local.',
    h1: 'AI Content',
    intro:
      'Good content remains crucial for visibility. Star Local supports content creation with professional quality control and brand consistency.',
    positioning:
      'Professional content support with human quality control and brand consistency.',
    image: IMAGES.heroSeo,
    imageAlt: 'Professional content and SEO copy',
    benefits: [
      'SEO-focused content',
      'Brand-consistent tone of voice',
      'Human final review',
      'Scalable content production',
    ],
    approach: [
      { title: 'Strategy', text: 'We define topics, structure, and goals.' },
      { title: 'Production', text: 'We create and optimize content.' },
      { title: 'Review', text: 'We ensure quality and brand consistency.' },
    ],
    whyUs: defaultWhyUsEn,
    relatedSlugs: ['ai-seo', 'landelijke-seo', 'lokale-seo'],
    faqs: [
      {
        question: 'Is all content fully automated?',
        answer: 'No, human review and brand alignment are always part of the process.',
      },
    ],
  },
];
