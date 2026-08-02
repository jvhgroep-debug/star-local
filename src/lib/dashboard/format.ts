import type { OpeningHoursRecord } from '../../types/database';
import { DAY_DEFINITIONS } from '../builder/constants';

const WEEKDAY_TO_DAY_KEY = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

export function formatDashboardDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Intl.DateTimeFormat('nl-NL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatOpeningHoursRow(row: OpeningHoursRecord): string {
  if (row.closed) return 'Gesloten';
  if (row.openTime === '00:00' && row.closeTime === '23:59') return '24 uur open';
  if (row.openTime && row.closeTime) return `${row.openTime} – ${row.closeTime}`;
  return '—';
}

export function mapOpeningHoursRows(rows: OpeningHoursRecord[]) {
  const byWeekday = new Map(rows.map((row) => [row.weekday, row]));

  return DAY_DEFINITIONS.map((day, index) => {
    const row = byWeekday.get(index as OpeningHoursRecord['weekday']);
    return {
      dayKey: day.key,
      label: day.label,
      value: row ? formatOpeningHoursRow(row) : '—',
    };
  });
}

export function weekdayFromDayKey(dayKey: string): number {
  const index = WEEKDAY_TO_DAY_KEY.indexOf(dayKey as (typeof WEEKDAY_TO_DAY_KEY)[number]);
  return index >= 0 ? index : 0;
}
