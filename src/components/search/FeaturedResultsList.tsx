import React from 'react'
import { featuredResults } from '@/lib/search/query'
import { resolveEntities } from '@/lib/search/resolver'
import SearchResultCard from '@/components/search/SearchResultCard'

interface FeaturedResultsListProps {
  type?: string
  title?: string
  limit?: number
}

export default async function FeaturedResultsList({ 
  type, 
  title = "Featured",
  limit = 3 
}: FeaturedResultsListProps) {
  const rawResults = await featuredResults(type, limit)
  
  if (rawResults.length === 0) return null

  const resolved = await resolveEntities(rawResults)

  return (
    <div className="my-12 p-8 bg-brand-lime/10 border-4 border-brand-lime shadow-[12px_12px_0px_#111111]">
      <div className="flex items-center justify-center mb-6">
        <h3 className="text-2xl font-black uppercase text-brand-dark mr-3">{title}</h3>
        <span className="text-2xl">⭐</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resolved.map(result => (
          <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>
    </div>
  )
}
