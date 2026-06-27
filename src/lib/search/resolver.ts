import { createClient } from '@/lib/supabase/server'
import { SearchIndexEntry } from './types'

export interface ResolvedEntity {
  id: string
  type: string
  title: string
  excerpt: string
  slug: string
  thumbnailUrl: string | null
  url: string
  publishedAt: string | null
  [key: string]: any // For any other type-specific data
}

/**
 * Resolves search index entries to their full UI-ready representation.
 * In a real-world scenario, you might want to fetch from the actual tables
 * to get the latest slug or additional metadata not in the index.
 */
export async function resolveEntities(entries: SearchIndexEntry[]): Promise<ResolvedEntity[]> {
  if (!entries || entries.length === 0) return []

  const supabase = await createClient()
  if (!supabase) return []

  // Group by entity type to bulk fetch
  const grouped = entries.reduce((acc, entry) => {
    if (!acc[entry.entity_type]) acc[entry.entity_type] = []
    acc[entry.entity_type].push(entry.entity_id)
    return acc
  }, {} as Record<string, string[]>)

  // Fetch actual records from each table
  const fetchPromises = Object.entries(grouped).map(async ([type, ids]) => {
    const { data } = await supabase
      .from(type)
      .select('*')
      .in('id', ids)
    
    return { type, records: (data as any[]) || [] }
  })

  const results = await Promise.all(fetchPromises)
  
  // Create a map for O(1) lookup
  const recordMap: Record<string, any> = {}
  results.forEach(({ type, records }) => {
    records.forEach(record => {
      recordMap[`${type}-${record.id}`] = record
    })
  })

  // Map the original search entries to their resolved versions in the same order
  return entries.map(entry => {
    const record = recordMap[`${entry.entity_type}-${entry.entity_id}`]
    
    // If the record was deleted but still in index, or not found, we fallback to index data
    // Ideally, the index is always in sync.
    const title = record?.title || record?.name || entry.title || 'Unknown'
    const slug = record?.slug || entry.entity_id
    
    let url = `/${entry.entity_type}/${slug}`
    // Special case for routing
    if (entry.entity_type === 'learn_articles') url = `/learn/${slug}`

    return {
      id: entry.entity_id,
      type: entry.entity_type,
      title,
      excerpt: record?.excerpt || record?.description || entry.excerpt || '',
      slug,
      thumbnailUrl: null, // We'll need a media resolver if we want real URLs, or rely on UI to fetch it
      url,
      publishedAt: record?.published_at || entry.published_at,
      ...record
    }
  })
}

/**
 * Single entity resolver
 */
export async function resolveEntity(entry: SearchIndexEntry): Promise<ResolvedEntity | null> {
  const resolved = await resolveEntities([entry])
  return resolved.length > 0 ? resolved[0] : null
}
