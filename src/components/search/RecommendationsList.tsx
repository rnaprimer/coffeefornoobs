import React from 'react'
import { recommendations } from '@/lib/search/query'
import { resolveEntities } from '@/lib/search/resolver'
import SearchResultCard from '@/components/search/SearchResultCard'

interface RecommendationsListProps {
  currentId: string
  title?: string
  limit?: number
}

export default async function RecommendationsList({ 
  currentId, 
  title = "Recommended For You",
  limit = 3 
}: RecommendationsListProps) {
  const rawResults = await recommendations(currentId, limit)
  
  if (rawResults.length === 0) return null

  const resolved = await resolveEntities(rawResults)

  return (
    <div className="my-12 p-8 bg-brand-pink/5 border-4 border-brand-pink rounded-xl">
      <h3 className="text-2xl font-black uppercase text-brand-dark mb-6 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resolved.map(result => (
          <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>
    </div>
  )
}
