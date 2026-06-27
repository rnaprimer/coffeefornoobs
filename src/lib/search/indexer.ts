import { createClient } from '@/lib/supabase/server'
import { extractFromTiptapJson } from './extractors'
import { SearchIndexEntry } from './types'

export async function updateSearchIndex(entityType: string, entityId: string, recordData: any, tags: string[] = []) {
  const supabase = await createClient()
  if (!supabase) return false

  let title = recordData.title || recordData.name || null
  let excerpt = recordData.excerpt || recordData.description || null
  let category = recordData.category_id || null // Adjust this based on joins if needed later
  let thumbnail_media_id = recordData.featured_media_id || recordData.cover_media_id || recordData.logo_media_id || recordData.icon_media_id || null
  
  const extracted = extractFromTiptapJson(recordData.content_json)
  
  // For basic entities without Tiptap, fallback to description/content for plain text
  if (!extracted.plainText) {
    extracted.plainText = recordData.content || recordData.description || ''
  }

  const indexEntry: SearchIndexEntry = {
    entity_type: entityType,
    entity_id: entityId,
    title,
    excerpt,
    plain_text: extracted.plainText,
    headings: extracted.headings,
    tags,
    category,
    thumbnail_media_id,
    featured: recordData.featured || false,
    status: recordData.status || 'published',
    published_at: recordData.status === 'published' ? (recordData.published_at || new Date().toISOString()) : null,
    search_weight: recordData.featured ? 100 : 0,
    index_status: 'indexed'
  }

  const { error } = await supabase
    .from('search_index')
    .upsert({
      ...indexEntry,
      updated_at: new Date().toISOString()
    } as any, { onConflict: 'entity_type,entity_id' })

  if (error) {
    console.error('Error updating search index:', error)
    return false
  }

  return true
}

export async function deleteSearchIndex(entityType: string, entityId: string) {
  const supabase = await createClient()
  if (!supabase) return false

  const { error } = await supabase
    .from('search_index')
    .delete()
    .eq('entity_type', entityType)
    .eq('entity_id', entityId)

  if (error) {
    console.error('Error deleting search index:', error)
    return false
  }

  return true
}
