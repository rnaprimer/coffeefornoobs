import { createAdminClient } from '../supabase/admin';

export async function setCacheMetadata(key: string, group: string, entityType?: string, entityId?: string) {
  const supabase = createAdminClient();
  if (!supabase) return;

  await (supabase as any)
    .from('cache_entries')
    .upsert({
      cache_key: key,
      cache_group: group,
      entity_type: entityType,
      entity_id: entityId,
      last_revalidated: new Date().toISOString()
    }, { onConflict: 'cache_key' });
}

export async function deleteCacheMetadata(key: string) {
  const supabase = createAdminClient();
  if (!supabase) return;

  await (supabase as any)
    .from('cache_entries')
    .delete()
    .eq('cache_key', key);
}

export async function clearCacheGroupMetadata(group: string) {
  const supabase = createAdminClient();
  if (!supabase) return;

  await (supabase as any)
    .from('cache_entries')
    .delete()
    .eq('cache_group', group);
}

export async function recordCacheHit(key: string) {
  const supabase = createAdminClient();
  if (!supabase) return;
  // This could be batched in a real high-traffic scenario.
  // For now, we update directly. (RPC increment is better).
}

export async function recordCacheMiss(key: string) {
  const supabase = createAdminClient();
  if (!supabase) return;
}
