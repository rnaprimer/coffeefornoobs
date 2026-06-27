'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SortDropdown({ currentSort }: { currentSort: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', e.target.value)
    // Reset page to 1 on sort
    params.set('page', '1')
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="sort" className="text-sm font-bold uppercase tracking-widest text-brand-dark">
        Sort By:
      </label>
      <select
        id="sort"
        value={currentSort}
        onChange={handleSortChange}
        className="block rounded-none border-2 border-brand-dark py-1.5 pl-3 pr-10 text-brand-dark font-bold text-sm uppercase tracking-wider focus:ring-brand-pink focus:border-brand-pink"
      >
        <option value="relevance">Relevance</option>
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  )
}
