'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { autocomplete } from '@/actions/search'

export default function GlobalSearch() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const { results: data } = await autocomplete(query)
        setResults(data)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [query])

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      setIsOpen(false)
      router.push(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  // Group results by entity_type
  const groupedResults = results.reduce((acc, curr) => {
    if (!acc[curr.entity_type]) acc[curr.entity_type] = []
    acc[curr.entity_type].push(curr)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div ref={wrapperRef} className="relative">
      <form 
        onSubmit={handleSubmit}
        className="hidden lg:flex items-center border border-gray-300 rounded-full px-4 py-1.5 bg-gray-50 focus-within:border-brand-dark transition-all"
      >
        <Search size={16} className="text-gray-500 mr-2" />
        <input 
          type="text" 
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => { if (query) setIsOpen(true) }}
          placeholder="Search guides, gear, and coffee..." 
          className="bg-transparent border-none outline-none text-sm w-64 font-medium placeholder:text-gray-400"
        />
        {query && (
          <button 
            type="button" 
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false) }}
            className="text-gray-400 hover:text-brand-dark ml-2"
          >
            <X size={16} />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim() !== '' && (
        <div className="absolute top-full mt-2 w-[500px] right-0 bg-brand-white border border-gray-200 shadow-xl rounded-xl z-50 overflow-hidden">
          {isLoading && results.length === 0 ? (
            <div className="p-8 flex justify-center text-gray-500">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest text-sm">
              No results found
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              {Object.entries(groupedResults).map(([type, items]) => (
                <div key={type} className="border-b border-gray-200 last:border-0">
                  <div className="bg-gray-50 px-4 py-2 font-black uppercase tracking-widest text-xs text-brand-dark">
                    {type.replace('_', ' ')}
                  </div>
                  <ul>
                    {(items as any[]).map(item => {
                      const href = item.entity_type === 'tags' 
                        ? `/tags/${item.entity_id}` // In Phase 8, tags have their own slug, we need to map correctly but entity_id is fine if we use ID routing or if slug is stored in title?
                        // Wait, tag entity_id is UUID. We should use slug. For now we will rely on UI to resolve slug or just link to search page
                        : `/${item.entity_type}/${item.entity_id}`
                        
                      return (
                        <li key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-brand-pink hover:text-brand-white transition-colors">
                          <Link 
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3"
                          >
                            <div className="font-bold text-sm truncate">{item.title}</div>
                            {item.category && (
                              <div className="text-xs opacity-75 uppercase tracking-wider mt-1">{item.category}</div>
                            )}
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
              <div className="bg-gray-50 p-3 text-center border-t border-gray-200 hover:bg-brand-dark hover:text-brand-white transition-colors">
                <Link 
                  href={`/search?q=${encodeURIComponent(query)}`}
                  onClick={() => setIsOpen(false)}
                  className="font-black uppercase tracking-widest text-sm block w-full"
                >
                  View all results →
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
