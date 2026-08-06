/** Wijzigingsverzoek — klant vraagt wijziging aan; Star Local keurt handmatig goed. */

export type ChangeRequestType =
  | 'text_change'
  | 'business_details'
  | 'opening_hours'
  | 'phone'
  | 'whatsapp'
  | 'email'
  | 'service'
  | 'photo'
  | 'logo'
  | 'other';

export type ChangeRequestStatus =
  | 'pending'
  | 'in_progress'
  | 'approved'
  | 'rejected'
  | 'completed';

export type PhotoPlacement = 'hero' | 'about' | 'services' | 'gallery' | 'other';

/** Pending media metadata — R2-koppeling volgt later via media resolver. */
export interface PendingMediaMetadata {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  placement?: PhotoPlacement | string;
  caption?: string;
  /** Placeholder tot R2 object key beschikbaar is. */
  storageStatus: 'pending';
  /** Toekomstig: R2 object key na upload. */
  r2ObjectKey?: string | null;
}

export interface ChangeRequestRecord {
  id: string;
  customerId: string;
  websiteId: string;
  tenantId: string;
  requestType: ChangeRequestType;
  description: string;
  mediaMetadata: PendingMediaMetadata | null;
  requestedLocation: string | null;
  status: ChangeRequestStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Uitgebreid record voor admin-weergave. */
export interface ChangeRequestAdminView extends ChangeRequestRecord {
  customerEmail: string;
  customerName: string | null;
  websiteName: string;
  websiteSlug: string;
}

export interface CreateChangeRequestInput {
  websiteId: string;
  requestType: ChangeRequestType;
  description: string;
  requestedLocation?: string | null;
  mediaMetadata?: PendingMediaMetadata | null;
}

export const CHANGE_REQUEST_TYPE_LABELS: Record<ChangeRequestType, string> = {
  text_change: 'Tekst wijzigen',
  business_details: 'Bedrijfsgegevens wijzigen',
  opening_hours: 'Openingstijden wijzigen',
  phone: 'Telefoonnummer wijzigen',
  whatsapp: 'WhatsApp wijzigen',
  email: 'E-mailadres wijzigen',
  service: 'Dienst toevoegen/wijzigen',
  photo: 'Foto toevoegen/vervangen',
  logo: 'Logo wijzigen',
  other: 'Anders',
};

export const CHANGE_REQUEST_STATUS_LABELS: Record<ChangeRequestStatus, string> = {
  pending: 'Ingediend',
  in_progress: 'In behandeling',
  approved: 'Goedgekeurd',
  rejected: 'Afgewezen',
  completed: 'Uitgevoerd',
};

export const PHOTO_PLACEMENT_LABELS: Record<PhotoPlacement, string> = {
  hero: 'Hero',
  about: 'Over ons',
  services: 'Diensten',
  gallery: 'Galerij',
  other: 'Anders',
};

export const CHANGE_REQUEST_TYPES: ChangeRequestType[] = [
  'text_change',
  'business_details',
  'opening_hours',
  'phone',
  'whatsapp',
  'email',
  'service',
  'photo',
  'logo',
  'other',
];

export const PHOTO_PLACEMENTS: PhotoPlacement[] = ['hero', 'about', 'services', 'gallery', 'other'];
