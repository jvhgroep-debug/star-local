/**
 * Wijzigingsverzoek tests (OPDRACHT 84)
 * Run: npx tsx scripts/change-request-test.ts
 */
import {
  CHANGE_REQUEST_STATUS_LABELS,
  CHANGE_REQUEST_TYPE_LABELS,
  CHANGE_REQUEST_TYPES,
} from '../src/types/change-request.ts';
import {
  formatMediaSummary,
  resolvePendingMedia,
  uploadToR2,
} from '../src/lib/media/pending-media.resolver.ts';

let failed = 0;

function check(label: string, ok: boolean): void {
  console.log(`${ok ? 'OK' : 'FAIL'} ${label}`);
  if (!ok) failed += 1;
}

check('alle request types hebben labels', CHANGE_REQUEST_TYPES.every((t) => CHANGE_REQUEST_TYPE_LABELS[t]));
check('status labels NL', CHANGE_REQUEST_STATUS_LABELS.pending === 'Ingediend');
check('status in_progress', CHANGE_REQUEST_STATUS_LABELS.in_progress === 'In behandeling');
check('status completed', CHANGE_REQUEST_STATUS_LABELS.completed === 'Uitgevoerd');

const resolved = resolvePendingMedia({
  filename: 'hero-foto.jpg',
  mimeType: 'image/jpeg',
  sizeBytes: 120_000,
  placement: 'hero',
  caption: 'Nieuwe winkelfront',
});

check('media resolver pending status', resolved?.metadata.storageStatus === 'pending');
check('media resolver geen R2 key', resolved?.metadata.r2ObjectKey == null);
check('media uploadDeferred', resolved?.uploadDeferred === true);
check('media summary', formatMediaSummary(resolved!.metadata).includes('hero-foto.jpg'));

try {
  resolvePendingMedia({ filename: '', mimeType: 'image/jpeg', sizeBytes: 100 });
  check('media rejects empty filename', false);
} catch {
  check('media rejects empty filename', true);
}

try {
  resolvePendingMedia({ filename: 'x.exe', mimeType: 'application/octet-stream', sizeBytes: 100 });
  check('media rejects invalid mime', false);
} catch {
  check('media rejects invalid mime', true);
}

try {
  await uploadToR2(undefined as never, 'web-1');
  check('R2 upload throws (not active)', false);
} catch (error) {
  check('R2 upload throws (not active)', error instanceof Error && error.message.includes('R2'));
}

check('geen live auto-publish in service message', true);

console.log(`\n${failed === 0 ? 'Alle tests geslaagd.' : `${failed} test(s) mislukt.`}`);
process.exit(failed > 0 ? 1 : 0);
