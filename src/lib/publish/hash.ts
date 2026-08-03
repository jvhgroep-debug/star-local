/** Simple stable hash for content comparison (FNV-1a 32-bit). */
export function hashContent(value: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function hashObject(value: unknown): string {
  return hashContent(JSON.stringify(value));
}
