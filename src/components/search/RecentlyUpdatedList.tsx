import React from 'react'
import { recentlyUpdated } from '@/lib/search/query'
import { resolveEntities } from '@/lib/search/resolver'
import SearchResultCard from '@/components/search/SearchResultCard'

interface RecentlyUpdatedListProps {
  type?: string
  title?: string
  limit?: number
}

export default async function RecentlyUpdatedList({ 
  type, 
  title = "Recently Updated",
  limit = 3 
}: RecentlyUpdatedListProps) {
  const rawResults = await recentlyUpdated(type, limit)
  
  if (rawResults.length === 0) return null

  const resolved = await resolveEntities(rawResults)

  return (
    <div className="my-12 p-8 border-4 border-brand-dark bg-white shadow-[12px_12px_0px_#111111]">
      <h3 className="text-2xl font-black uppercase text-brand-dark mb-6 text-center">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resolved.map(result => (
          <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
        ))}
      </div>
    </div>
  )
}
