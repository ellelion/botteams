export function setBoundedCache<K, V>(cache: Map<K, V>, key: K, value: V, maximumEntries: number): void {
  if (cache.has(key)) cache.delete(key);
  while (cache.size >= maximumEntries) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
  cache.set(key, value);
}
