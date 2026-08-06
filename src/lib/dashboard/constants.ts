import type { DashboardSection } from '../../types/dashboard';
import { BUILDER_START_PATH } from '../builder/constants';
import { EDITOR_PATH } from '../editor/constants';

export const DASHBOARD_PATH = '/dashboard/';

export const DASHBOARD_HUB_SECTIONS: { id: DashboardSection; label: string; icon: string; description: string; href?: string }[] = [
  { id: 'websites', label: 'Mijn websites', icon: '🌐', description: 'Al uw websites op één plek' },
  { id: 'concepts', label: 'Concepten', icon: '📝', description: 'Websites in voorbereiding' },
  { id: 'in_review', label: 'In review', icon: '🔍', description: 'Wachten op goedkeuring' },
  { id: 'change_requests', label: 'Mijn wijzigingsverzoeken', icon: '📋', description: 'Status van uw aanvragen' },
  { id: 'published', label: 'Gepubliceerd', icon: '🚀', description: 'Live websites' },
  { id: 'settings', label: 'Instellingen', icon: '⚙', description: 'Account en voorkeuren' },
];

export const DASHBOARD_SECTIONS: { id: DashboardSection; label: string }[] = [
  { id: 'overview', label: 'Dashboard' },
  { id: 'websites', label: 'Mijn Websites' },
  { id: 'concepts', label: 'Concepten' },
  { id: 'in_review', label: 'In review' },
  { id: 'published', label: 'Gepubliceerd' },
  { id: 'change_requests', label: 'Wijzigingsverzoeken' },
  { id: 'change_request_new', label: 'Wijziging aanvragen' },
  { id: 'stats', label: 'Statistieken' },
  { id: 'website', label: 'Website details' },
  { id: 'pages', label: "Pagina's" },
  { id: 'services', label: 'Diensten' },
  { id: 'contact', label: 'Contact' },
  { id: 'hours', label: 'Openingstijden' },
  { id: 'seo', label: 'SEO' },
  { id: 'images', label: 'Afbeeldingen' },
  { id: 'publish', label: 'Publiceren' },
  { id: 'settings', label: 'Instellingen' },
];

export const DASHBOARD_PAGES = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'Over ons', path: '/over-ons/' },
  { id: 'services', label: 'Diensten', path: '/diensten/' },
  { id: 'contact', label: 'Contact', path: '/contact/' },
  { id: 'privacy', label: 'Privacy', path: '/privacy/' },
] as const;

export { BUILDER_START_PATH, EDITOR_PATH };
