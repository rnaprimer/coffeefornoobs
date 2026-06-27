export interface SearchIndexEntry {
  id?: string
  entity_type: string
  entity_id: string
  title: string | null
  excerpt: string | null
  plain_text: string | null
  headings: string[]
  tags: string[]
  category: string | null
  thumbnail_media_id: string | null
  featured: boolean
  status: string
  published_at: string | null
  search_weight: number
  index_status: 'pending' | 'indexed' | 'failed'
}

export interface ExtractResult {
  plainText: string
  headings: string[]
  images: string[]
  products: string[]
  beans: string[]
  comparisons: string[]
}
