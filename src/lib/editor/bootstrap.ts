import type { BuilderState } from '../../types/builder';
import type { PreparedWebsite } from '../../types/website-config';
import { createDefaultState, loadState } from '../builder/storage';
import { loadPreparedWebsite } from '../builder/publish/storage';
import { loadWebsiteFromD1 } from '../builder/publish/save-client';
import { loadDashboardSession } from '../dashboard/storage';
import { createEmptyFiles, type BuilderFiles } from '../builder/files';
import { readableTextColor } from '../builder/colors';
import { mapLoadResultToBuilderState, mapLoadResultToFiles } from './load-from-d1';

export interface EditorBootstrap {
  state: BuilderState;
  files: BuilderFiles;
  tenantId?: string | null;
}

function stateFromPrepared(prepared: PreparedWebsite): BuilderState {
  const { config } = prepared;

  return {
    ...createDefaultState(),
    business: structuredClone(config.business),
    contact: structuredClone(config.contact),
    location: {
      gemeenteSlug: '',
      gemeenteNaam: config.contact.city ?? '',
      provincie: '',
    },
    hours: structuredClone(config.hours),
    branding: {
      ...config.branding,
      logoName: config.media.logoName,
      photoNames: [...config.media.photoNames],
    },
    publicationStatus: config.status,
    selectedPackage: config.package,
    publishEmailConfirmed: config.publishEmail,
    ctaQuoteLabel: config.copy.ctaLabel,
    previewPage: 'home',
    view: 'builder',
    currentStep: 1,
  };
}

function filesFromPrepared(prepared: PreparedWebsite): BuilderFiles {
  return {
    logoUrl: prepared.config.media.logoUrl,
    logoName: prepared.config.media.logoName,
    photoUrls: [...prepared.config.media.photoUrls],
    photoNames: [...prepared.config.media.photoNames],
  };
}

/** Load editor state — D1 is source of truth when tenantId is known. */
export async function loadEditorBootstrapAsync(): Promise<EditorBootstrap> {
  const tenantId =
    (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('tenantId') : null) ??
    loadDashboardSession()?.tenantId ??
    null;

  if (tenantId) {
    const response = await loadWebsiteFromD1(tenantId);
    if (response.ok) {
      return {
        state: mapLoadResultToBuilderState(response.result),
        files: mapLoadResultToFiles(response.result),
        tenantId: response.result.tenantId,
      };
    }
  }

  return loadEditorBootstrap();
}

/** Load editor state from builder storage (unsaved wizard only). */
export function loadEditorBootstrap(): EditorBootstrap {
  const stored = loadState();
  const hasStoredData = Boolean(
    stored.business.name.trim() ||
      stored.contact.email.trim() ||
      stored.contact.phone.trim() ||
      stored.contact.whatsapp.trim(),
  );

  if (hasStoredData) {
    stored.branding.textColor = readableTextColor(stored.branding.primaryColor);
    const prepared = loadPreparedWebsite();
    const files = prepared ? filesFromPrepared(prepared) : createEmptyFiles();
    return { state: stored, files };
  }

  const prepared = loadPreparedWebsite();
  if (prepared) {
    return {
      state: stateFromPrepared(prepared),
      files: filesFromPrepared(prepared),
    };
  }

  return { state: createDefaultState(), files: createEmptyFiles() };
}
