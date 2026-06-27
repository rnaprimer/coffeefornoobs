'use client'

import { MediaCard } from './MediaCard'
import { FolderOpen } from 'lucide-react'

export function MediaGrid({ 
  items, 
  selectable = false,
  selectedId,
  onSelect
}: { 
  items: any[],
  selectable?: boolean,
  selectedId?: string,
  onSelect?: (media: any) => void
}) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-center bg-brand-white border-4 border-brand-dark border-dashed">
        <div className="w-16 h-16 bg-gray-100 border-4 border-brand-dark rounded-full flex items-center justify-center mb-4">
          <FolderOpen className="w-8 h-8 text-brand-dark" />
        </div>
        <h3 className="font-black text-xl mb-2">No Media Found</h3>
        <p className="font-medium text-gray-500">Upload some images to get started.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {items.map((media) => (
        <MediaCard 
          key={media.id} 
          media={media} 
          selectable={selectable}
          selected={selectedId === media.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
