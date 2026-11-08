import calendar from '../../../editorial/starlocal-blogplanning-2026.json';
import type { BlogPostMeta } from './types';
const terminal = new Set(['cancelled-by-schedule-change', 'skipped-quality']);
export function isActivePublicationSlot(slot: any): boolean {
  if (slot.published) return true;
  if (terminal.has(slot.status) || slot.scheduleActive === false || !slot.scheduledAt) return false;
  const date = slot.scheduledAt.slice(0,10);
  if (date > '2026-12-29') return false;
  if (date >= '2026-11-08') return slot.batchSlot === 1 && [0,2,4].includes(new Date(date+'T00:00:00Z').getUTCDay());
  return true;
}
export function isRenderableBlog(post: BlogPostMeta, now = Date.now()): boolean {
  const slot = calendar.slots.find(s => s.slug === post.slug);
  if (!Number.isFinite(Date.parse(post.publishedAt)) || Date.parse(post.publishedAt) > now) return false;
  if (!slot) return !post.slotKey && Date.parse(post.publishedAt) < Date.parse('2026-11-08T00:00:00+04:00'); // Existing legacy articles retain their routes; new content must have a calendar slot.
  if (slot.published) return true;
  return isActivePublicationSlot(slot) && ['source-written','deployment-pending','public-verified'].includes(slot.status)
    && Date.parse(slot.scheduledAt!) <= now && Date.parse(slot.originalPlannedAt) <= now;
}
export function getDuePublicationSlots(now = Date.now()) {
  const hour = new Date(now + 4*3600000).getUTCHours();
  if (hour < 1 || hour > 4) return [];
  return calendar.slots.filter(s => !s.published && isActivePublicationSlot(s) && Date.parse(s.scheduledAt!) <= now)
    .sort((a,b) => Date.parse(a.scheduledAt!) - Date.parse(b.scheduledAt!) || a.slot-b.slot);
}
