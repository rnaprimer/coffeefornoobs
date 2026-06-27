import React from 'react'
import Link from 'next/link'
import { ResolvedEntity } from '@/lib/search/resolver'

export default function SearchResultCard({ result }: { result: ResolvedEntity }) {
  // Determine a subtle background color based on entity type for visual distinction
  let bgColor = 'bg-gray-50'
  let borderColor = 'border-brand-dark'
  
  switch(result.type) {
    case 'products':
      bgColor = 'bg-brand-pink/10'
      break
    case 'beans':
      bgColor = 'bg-brand-lime/10'
      break
    case 'guides':
      bgColor = 'bg-blue-100/30'
      break
  }

  return (
    <Link 
      href={result.url}
      className={`group flex flex-col border-4 ${borderColor} ${bgColor} shadow-[8px_8px_0px_#111111] hover:shadow-[12px_12px_0px_#111111] hover:-translate-y-1 transition-all overflow-hidden h-full`}
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dark px-2 py-1 bg-white border-2 border-brand-dark rounded-full">
            {result.type.replace('_', ' ')}
          </span>
          {result.publishedAt && (
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
              {new Date(result.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        <h3 className="text-2xl font-black uppercase tracking-widest text-brand-dark mb-4 group-hover:text-brand-pink transition-colors line-clamp-2">
          {result.title}
        </h3>
        
        {result.excerpt && (
          <p className="text-gray-600 line-clamp-3 mb-6 flex-grow font-medium text-sm">
            {result.excerpt}
          </p>
        )}
        
        <div className="mt-auto flex items-center justify-between border-t-2 border-brand-dark pt-4">
          <span className="font-bold text-sm uppercase tracking-widest group-hover:text-brand-pink transition-colors">
            Read More
          </span>
          <span className="font-black text-xl leading-none group-hover:translate-x-2 transition-transform">→</span>
        </div>
      </div>
    </Link>
  )
}
