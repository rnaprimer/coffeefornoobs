import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

interface FilterSidebarProps {
  currentType: string
  currentCategory: string
  currentTags: string[]
}

export default async function FilterSidebar({ currentType, currentCategory, currentTags }: FilterSidebarProps) {
  const supabase = await createClient()
  
  let popularTags: any[] | null = null
  if (supabase) {
    const { data } = await supabase
      .from('tags')
      .select('id, name, slug')
      .eq('status', 'published')
      .order('usage_count', { ascending: false })
      .limit(10)
    popularTags = data
  }

  const contentTypes = [
    { id: 'products', label: 'Products' },
    { id: 'guides', label: 'Guides' },
    { id: 'beans', label: 'Coffee Beans' },
    { id: 'comparisons', label: 'Comparisons' },
    { id: 'learn_articles', label: 'Learn' }
  ]

  // Helper to construct URLs keeping other search params
  const buildUrl = (key: string, value: string | null) => {
    // We construct manually here, but in a real app you might pass the full searchParams
    // For simplicity, we just rebuild it
    let url = `/search?`
    if (key === 'type' ? value : currentType) url += `type=${key === 'type' ? value || '' : currentType}&`
    if (key === 'category' ? value : currentCategory) url += `category=${key === 'category' ? value || '' : currentCategory}&`
    
    const tags = key === 'tags' 
      ? (value ? [value] : []) // Simplification: clicking a tag replaces current tags
      : currentTags
      
    tags.forEach(t => url += `tags=${t}&`)
    
    return url.replace(/&$/, '')
  }

  return (
    <div className="bg-white border-4 border-brand-dark p-6 shadow-[8px_8px_0px_#111111]">
      <div className="flex justify-between items-center mb-6 border-b-2 border-gray-100 pb-4">
        <h3 className="font-black uppercase tracking-widest text-brand-dark">Filters</h3>
        <Link 
          href="/search" 
          className="text-xs font-bold uppercase tracking-widest text-brand-pink hover:text-brand-dark transition-colors"
        >
          Clear All
        </Link>
      </div>

      <div className="mb-8">
        <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-3">Content Type</h4>
        <ul className="space-y-2">
          {contentTypes.map(type => (
            <li key={type.id}>
              <Link
                href={buildUrl('type', currentType === type.id ? null : type.id)}
                className={`flex items-center group cursor-pointer`}
              >
                <div className={`w-4 h-4 border-2 border-brand-dark mr-3 flex items-center justify-center transition-colors ${currentType === type.id ? 'bg-brand-pink border-brand-pink' : 'bg-white group-hover:border-brand-pink'}`}>
                  {currentType === type.id && <div className="w-2 h-2 bg-brand-dark" />}
                </div>
                <span className={`font-bold text-sm transition-colors ${currentType === type.id ? 'text-brand-dark' : 'text-gray-600 group-hover:text-brand-dark'}`}>
                  {type.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-3">Popular Tags</h4>
        <div className="flex flex-wrap gap-2">
          {popularTags?.map(tag => {
            const isSelected = currentTags.includes(tag.id)
            return (
              <Link
                key={tag.id}
                href={buildUrl('tags', isSelected ? null : tag.id)}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                  isSelected 
                    ? 'bg-brand-dark text-white border-brand-dark' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-brand-dark hover:text-brand-dark'
                }`}
              >
                {tag.name}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
