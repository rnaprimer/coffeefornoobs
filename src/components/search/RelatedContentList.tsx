import React from 'react'
import { relatedContent } from '@/lib/search/query'
import { resolveEntities } from '@/lib/search/resolver'
import SearchResultCard from '@/components/search/SearchResultCard'
import RelatedContent from '@/components/shared/RelatedContent'

interface RelatedContentListProps {
  currentId: string
  tags: string[]
  title?: string
  limit?: number
}

export default async function RelatedContentList({ 
  currentId, 
  tags, 
  title = "Related Content",
  limit = 3 
}: RelatedContentListProps) {
  const rawResults = await relatedContent(currentId, tags, limit)
  
  if (rawResults.length === 0) return null

  const resolved = await resolveEntities(rawResults)

  return (
    <RelatedContent title={title}>
      {resolved.map(result => (
        <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
      ))}
    </RelatedContent>
  )
}
