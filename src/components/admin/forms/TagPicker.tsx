'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { X, Hash, Plus, Check } from 'lucide-react'

interface Tag {
  id: string
  name: string
  color: string | null
}

interface TagPickerProps {
  value: string[] // Array of tag IDs
  onChange: (value: string[]) => void
}

export function TagPicker({ value = [], onChange }: TagPickerProps) {
  const [tags, setTags] = useState<Tag[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchTags() {
      if (!supabase) return;
      const { data } = await supabase
        .from('tags')
        .select('id, name, color')
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('name')
      
      if (data) {
        setTags(data)
      }
    }
    fetchTags()
  }, [supabase])

  const selectedTags = tags.filter(t => value.includes(t.id))
  
  const filteredTags = tags.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleTag = (tagId: string) => {
    if (value.includes(tagId)) {
      onChange(value.filter(id => id !== tagId))
    } else {
      onChange([...value, tagId])
    }
  }

  const removeTag = (tagId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(value.filter(id => id !== tagId))
  }

  return (
    <div className="relative">
      <div 
        className="min-h-[42px] p-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-amber-600 focus-within:border-amber-600 flex flex-wrap gap-2 cursor-text bg-white"
        onClick={() => setIsOpen(true)}
      >
        {selectedTags.map(tag => (
          <span 
            key={tag.id}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium"
            style={{ 
              backgroundColor: tag.color ? `${tag.color}20` : '#f3f4f6',
              color: tag.color || '#374151',
              border: `1px solid ${tag.color ? `${tag.color}40` : '#d1d5db'}`
            }}
          >
            <Hash className="w-3 h-3" />
            {tag.name}
            <button
              type="button"
              onClick={(e) => removeTag(tag.id, e)}
              className="ml-1 hover:text-red-500 focus:outline-none"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        
        <input
          type="text"
          className="flex-1 min-w-[120px] outline-none text-sm text-gray-900 placeholder:text-gray-400 bg-transparent"
          placeholder={selectedTags.length === 0 ? "Search and select tags..." : ""}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-3 py-2 flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Available Tags</span>
            <button 
              type="button" 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {filteredTags.length === 0 ? (
            <div className="px-3 py-4 text-sm text-gray-500 text-center">
              No tags found.
            </div>
          ) : (
            <ul className="py-1">
              {filteredTags.map(tag => {
                const isSelected = value.includes(tag.id)
                return (
                  <li 
                    key={tag.id}
                    className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-100 ${isSelected ? 'bg-amber-50' : ''}`}
                    onClick={() => toggleTag(tag.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: tag.color || '#d1d5db' }}
                      />
                      <span className="font-medium text-gray-900">{tag.name}</span>
                    </div>
                    {isSelected ? (
                      <Check className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400" />
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
