import { createClient } from '@/lib/supabase/server'
import { SearchIndexEntry } from './types'

export interface SearchOptions {
  q?: string
  type?: string
  tags?: string[]
  category?: string
  sort?: string // 'relevance', 'newest', 'oldest', 'alphabetical'
  page?: number
  pageSize?: number
}

// 1. Core Search Function (Uses RPC for FTS)
export async function search(options: SearchOptions) {
  const supabase = await createClient()
  if (!supabase) return { results: [], total: 0 }

  const {
    q = '',
    type = null,
    tags = null,
    category = null,
    sort = 'relevance',
    page = 1,
    pageSize = 20
  } = options

  // Call the Postgres RPC function
  const { data, error } = await (supabase.rpc as any)('search_content', {
    search_query: q || null,
    filter_type: type || null,
    filter_tags: tags && tags.length > 0 ? tags : null,
    filter_category: category || null,
    sort_by: sort,
    page_num: page,
    page_size: pageSize
  })

  if (error) {
    console.error('Search error:', error)
    return { results: [], total: 0 }
  }

  // To get total count, we could either run a second query or modify the RPC.
  // For simplicity, we'll just check if we got pageSize results to know if there's a next page.
  // Ideally, RPC should return total_count.
  // For now, we'll just use a simple heuristic.
  
  return { 
    results: (data || []) as any[], 
    hasMore: data ? data.length === pageSize : false 
  }
}

// 2. Autocomplete Function (Fast UI response)
export async function autocomplete(q: string) {
  const supabase = await createClient()
  if (!supabase || !q) return { results: [] }

  const { data, error } = await (supabase.rpc as any)('search_content', {
    search_query: q,
    page_size: 5, // We just want a few results for autocomplete
    sort_by: 'relevance'
  })

  if (error) {
    console.error('Autocomplete error:', error)
    return { results: [] }
  }

  return { results: (data || []) as any[] }
}

// 3. Related Content
export async function relatedContent(currentId: string, tags: string[], limit = 4) {
  const supabase = await createClient()
  if (!supabase) return []

  // Simple implementation: Find content with overlapping tags, exclude current item
  const { data, error } = await supabase
    .from('search_index')
    .select('*')
    .neq('entity_id', currentId)
    .eq('status', 'published')
    .contains('tags', tags.length > 0 ? tags : ['NON_EXISTENT_TAG_FORCE_EMPTY'])
    .order('search_weight', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Related Content error:', error)
    return []
  }

  return data as SearchIndexEntry[]
}

// 4. Recommendation Engine (Basic)
export async function recommendations(currentId: string, limit = 4) {
  // For now, recommendations and related content share the same basic logic
  // In the future, this can be expanded with pgvector or user history
  const supabase = await createClient()
  if (!supabase) return []

  // First fetch current item's tags to recommend based on them
  const { data: item } = await supabase
    .from('search_index')
    .select('tags, category')
    .eq('entity_id', currentId)
    .single()

  if (!item) return []

  let query = supabase
    .from('search_index')
    .select('*')
    .neq('entity_id', currentId)
    .eq('status', 'published')

  const typedItem = item as any
  if (typedItem && typedItem.tags && typedItem.tags.length > 0) {
    query = query.overlaps('tags', typedItem.tags)
  } else if (typedItem && typedItem.category) {
    query = query.eq('category', typedItem.category)
  }
  
  const { data, error } = await query
    .order('search_weight', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Recommendations error:', error)
    return []
  }

  return data as SearchIndexEntry[]
}

// 5. Recently Updated
export async function recentlyUpdated(type?: string, limit = 4) {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase
    .from('search_index')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (type) {
    query = query.eq('entity_type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Recently Updated error:', error)
    return []
  }

  return data as SearchIndexEntry[]
}

// 6. Featured Results
export async function featuredResults(type?: string, limit = 4) {
  const supabase = await createClient()
  if (!supabase) return []

  let query = supabase
    .from('search_index')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .order('search_weight', { ascending: false })
    .limit(limit)

  if (type) {
    query = query.eq('entity_type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Featured Results error:', error)
    return []
  }

  return data as SearchIndexEntry[]
}

// 7. Tag Results
export async function tagResults(tagId: string, page = 1, pageSize = 20) {
  const supabase = await createClient()
  if (!supabase) return { results: [], hasMore: false }

  const offset = (page - 1) * pageSize

  const { data, error } = await supabase
    .from('search_index')
    .select('*')
    .eq('status', 'published')
    .contains('tags', [tagId])
    .order('search_weight', { ascending: false })
    .order('published_at', { ascending: false })
    .range(offset, offset + pageSize - 1)

  if (error) {
    console.error('Tag Results error:', error)
    return { results: [], hasMore: false }
  }

  return {
    results: data as SearchIndexEntry[],
    hasMore: data.length === pageSize
  }
}
