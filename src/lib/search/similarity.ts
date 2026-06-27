import { SearchIndexEntry } from './types'

export function prepareSimilarityMetadata(entry: SearchIndexEntry) {
  // Extract all textual content and tags to form a single "document" string
  // This will be useful in the future when we add pgvector for semantic search
  const components = [
    entry.title,
    entry.excerpt,
    entry.plain_text,
    entry.tags.join(' '),
    entry.category,
    ...entry.headings
  ]

  const document = components
    .filter(Boolean)
    .join('\n')
    .replace(/\s+/g, ' ')
    .trim()

  return {
    document,
    metadata: {
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      featured: entry.featured,
      published_at: entry.published_at,
      search_weight: entry.search_weight,
    }
  }
}
