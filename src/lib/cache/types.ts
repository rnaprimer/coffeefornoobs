export interface CacheEntry {
  cache_key: string;
  cache_group: string;
  entity_type?: string;
  entity_id?: string;
  expires_at?: string;
  last_revalidated?: string;
}

export interface CacheStats {
  cache_key: string;
  hits: number;
  misses: number;
  revalidations: number;
  last_accessed_at: string;
}
