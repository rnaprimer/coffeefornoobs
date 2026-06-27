'use client'

import { useState, useEffect, useCallback } from 'react'
import { getMedia } from '@/actions/media'
import { MediaGrid } from '@/components/admin/media/MediaGrid'
import { UploadDropzone } from '@/components/admin/media/UploadDropzone'
import { MetadataPanel } from '@/components/admin/media/MetadataPanel'
import { Search, Filter, Loader2 } from 'lucide-react'

export default function MediaClient() {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [folder, setFolder] = useState('all')
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    const result = await getMedia(folder, search)
    if (result.success && result.data) {
      setMedia(result.data)
      
      // Update selected media if it was modified
      if (selectedMedia) {
        const updated = result.data.find((m: any) => m.id === selectedMedia.id)
        if (updated) setSelectedMedia(updated)
      }
    }
    setLoading(false)
  }, [folder, search, selectedMedia])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMedia()
    }, 500)
    return () => clearTimeout(timer)
  }, [search, fetchMedia])

  const handleUploadComplete = () => {
    fetchMedia()
  }

  return (
    <div className="flex flex-col gap-6">
      <UploadDropzone onUploadComplete={handleUploadComplete} />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-brand-white p-4 border-4 border-brand-dark shadow-[4px_4px_0px_#111111]">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-dark" />
            <input 
              type="text" 
              placeholder="Search media..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-brand-dark hidden md:block" />
          <select 
            value={folder}
            onChange={(e) => setFolder(e.target.value)}
            className="w-full md:w-auto p-2 border-2 border-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
          >
            <option value="all">All Folders</option>
            <option value="general">General</option>
            <option value="products">Products</option>
            <option value="brands">Brands</option>
            <option value="beans">Beans</option>
            <option value="guides">Guides</option>
            <option value="homepage">Homepage</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="w-full py-24 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-pink mb-4" />
          <p className="font-bold">Loading media...</p>
        </div>
      ) : (
        <MediaGrid 
          items={media} 
          selectable={true} 
          selectedId={selectedMedia?.id}
          onSelect={setSelectedMedia} 
        />
      )}

      {selectedMedia && (
        <MetadataPanel 
          media={selectedMedia} 
          onClose={() => setSelectedMedia(null)} 
        />
      )}
    </div>
  )
}
