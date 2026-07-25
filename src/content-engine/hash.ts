/** Deterministic hashing so the same city always gets the same variation mix. */

export function hashSeed(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function pick<T>(items: readonly T[], seed: string, offset = 0): T {
  if (items.length === 0) {
    throw new Error('Cannot pick from an empty variation list');
  }
  return items[(hashSeed(seed) + offset) % items.length]!;
}

export function pickIndex(length: number, seed: string, offset = 0): number {
  if (length <= 0) return 0;
  return (hashSeed(seed) + offset) % length;
}

export function pickMany<T>(items: readonly T[], seed: string, count: number, offset = 0): T[] {
  const result: T[] = [];
  const seen = new Set<T>();
  let i = 0;
  while (result.length < count && i < items.length * 2) {
    const item = pick(items, seed, offset + i);
    if (!seen.has(item)) {
      seen.add(item);
      result.push(item);
    }
    i += 1;
  }
  return result;
}

export function formatPopulation(value: number, language: 'nl' | 'en' = 'nl'): string {
  return new Intl.NumberFormat(language === 'nl' ? 'nl-NL' : 'en-GB').format(value);
}

export function joinNames(names: string[], language: 'nl' | 'en' = 'nl'): string {
  if (names.length === 0) return language === 'nl' ? 'de omgeving' : 'the area';
  if (names.length === 1) return names[0]!;
  const and = language === 'nl' ? 'en' : 'and';
  if (names.length === 2) return `${names[0]} ${and} ${names[1]}`;
  return `${names.slice(0, -1).join(', ')} ${and} ${names[names.length - 1]}`;
}
