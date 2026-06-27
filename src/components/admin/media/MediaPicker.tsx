'use client'

import { useState, useEffect, useCallback } from 'react'
import { Image as ImageIcon, X, Loader2, Upload, Check } from 'lucide-react'
import { getMedia } from '@/actions/media'
import { UploadDropzone } from './UploadDropzone'
import Image from 'next/image'

interface MediaPickerProps {
  value?: string | null
  onChange: (mediaId: string | null) => void
  folder?: string
  initialMedia?: any | null
}

export function MediaPicker({ value, onChange, folder = 'all', initialMedia = null }: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(value || null)
  const [mode, setMode] = useState<'browse' | 'upload'>('browse')
  const [search, setSearch] = useState('')
  const [activeFolder, setActiveFolder] = useState(folder)

  const fetchMedia = useCallback(async () => {
    setLoading(true)
    const result = await getMedia(activeFolder, search)
    if (result.success && result.data) {
      setMedia(result.data)
    }
    setLoading(false)
  }, [activeFolder, search])

  // Fetch when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchMedia()
    }
  }, [isOpen, fetchMedia])

  // Get currently selected media object to display preview
  const [previewMedia, setPreviewMedia] = useState<any | null>(initialMedia)
  
  useEffect(() => {
    if (value) {
      // Need to fetch this specific media to show preview if not loaded
      // For now, if it's in our current list, use it
      const found = media.find(m => m.id === value)
      if (found) {
        setPreviewMedia(found)
      } else if (initialMedia && initialMedia.id === value) {
        setPreviewMedia(initialMedia)
      }
    } else {
      setPreviewMedia(null)
    }
  }, [value, media, initialMedia])

  const handleConfirm = () => {
    onChange(selectedId)
    setIsOpen(false)
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(null)
    setSelectedId(null)
    setPreviewMedia(null)
  }

  return (
    <>
      <div 
        className="w-full h-48 border-4 border-brand-dark bg-brand-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative group shadow-[4px_4px_0px_#111111]"
        onClick={() => setIsOpen(true)}
      >
        {previewMedia ? (
          <>
            <Image 
              src={previewMedia.url} 
              alt={previewMedia.alt_text || 'Selected media'} 
              fill 
              className="object-contain p-2"
              unoptimized={previewMedia.url.startsWith('http')}
            />
            <div className="absolute inset-0 bg-brand-dark/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-brand-white font-bold text-sm px-4 py-2 border-2 border-brand-dark uppercase tracking-widest">Change Image</span>
            </div>
            <button 
              onClick={handleClear}
              className="absolute top-2 right-2 w-8 h-8 bg-red-500 border-2 border-brand-dark rounded-full flex items-center justify-center text-white hover:bg-red-600 z-10"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center text-brand-dark">
            <ImageIcon className="w-8 h-8 mb-2" />
            <span className="font-bold uppercase tracking-widest">Select Image</span>
          </div>
        )}
      </div>

      <MediaPickerModal 
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        folder={folder}
        media={media}
        fetchMedia={fetchMedia}
        loading={loading}
        search={search}
        setSearch={setSearch}
        activeFolder={activeFolder}
        setActiveFolder={setActiveFolder}
      />
    </>
  )
}

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  selectedId: string | null
  setSelectedId: (id: string | null) => void
  folder: string
  media: any[]
  fetchMedia: () => void
  loading: boolean
  search: string
  setSearch: (s: string) => void
  activeFolder: string
  setActiveFolder: (f: string) => void
}

export function MediaPickerModal({
  isOpen, onClose, onConfirm, selectedId, setSelectedId, folder, media, fetchMedia, loading, search, setSearch, activeFolder, setActiveFolder
}: MediaPickerModalProps) {
  const [mode, setMode] = useState<'browse' | 'upload'>('browse')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-brand-white w-full max-w-5xl h-[80vh] border-4 border-brand-dark shadow-[8px_8px_0px_#111111] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-brand-dark">
          <h2 className="font-black text-xl uppercase tracking-widest">Select Media</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border-2 border-brand-dark rounded-full hover:bg-brand-pink transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b-4 border-brand-dark bg-gray-50">
          <div className="flex bg-brand-white border-2 border-brand-dark rounded-none overflow-hidden">
            <button 
              onClick={() => setMode('browse')}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-widest border-r-2 border-brand-dark ${mode === 'browse' ? 'bg-brand-lime' : 'hover:bg-gray-100'}`}
            >
              Browse Library
            </button>
            <button 
              onClick={() => setMode('upload')}
              className={`px-4 py-2 font-bold text-sm uppercase tracking-widest flex items-center gap-2 ${mode === 'upload' ? 'bg-brand-lime' : 'hover:bg-gray-100'}`}
            >
              <Upload className="w-4 h-4" /> Upload New
            </button>
          </div>

          {mode === 'browse' && (
            <div className="flex-1 flex gap-4">
              <input 
                type="text" 
                placeholder="Search..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 p-2 border-2 border-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink"
              />
              <select 
                value={activeFolder}
                onChange={(e) => {
                  setActiveFolder(e.target.value);
                }}
                className="p-2 border-2 border-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink bg-white"
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
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {mode === 'upload' ? (
            <UploadDropzone onUploadComplete={() => {
              fetchMedia()
              setMode('browse')
            }} />
          ) : (
            <>
              {loading ? (
                <div className="w-full h-full flex flex-col items-center justify-center">
                  <Loader2 className="w-12 h-12 animate-spin text-brand-pink mb-4" />
                  <p className="font-bold">Loading media...</p>
                </div>
              ) : media.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <p className="font-bold">No media found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {media.map((m) => (
                    <div 
                      key={m.id}
                      onClick={() => setSelectedId(m.id)}
                      className={`relative aspect-square border-4 cursor-pointer bg-brand-white transition-transform duration-200 
                        ${selectedId === m.id ? 'border-brand-pink scale-95 shadow-inner' : 'border-brand-dark shadow-[4px_4px_0px_#111111] hover:-translate-y-1'}`}
                    >
                      <Image src={m.url} alt={m.alt_text || ''} fill className="object-cover" unoptimized={m.url.startsWith('http')} />
                      {selectedId === m.id && (
                        <div className="absolute top-2 left-2 z-10 bg-brand-pink text-white w-6 h-6 flex items-center justify-center rounded-full border-2 border-brand-dark">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-4 border-brand-dark bg-brand-white flex justify-end gap-4">
          <button 
            onClick={onClose}
            className="px-6 py-2 font-bold uppercase tracking-widest border-2 border-brand-dark hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={!selectedId}
            className="px-6 py-2 font-bold uppercase tracking-widest border-2 border-brand-dark bg-brand-lime hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Select Image
          </button>
        </div>

      </div>
    </div>
  )
}
