'use client'

import { useState, useEffect } from 'react'
import { updateMediaMetadata } from '@/actions/media'
import { toast } from 'sonner'
import { X, Save, FileImage, Link2, HardDrive, Calendar } from 'lucide-react'
import Image from 'next/image'

export function MetadataPanel({ media, onClose }: { media: any | null, onClose: () => void }) {
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [folder, setFolder] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (media) {
      setAltText(media.alt_text || '')
      setCaption(media.caption || '')
      setFolder(media.folder || 'general')
    }
  }, [media])

  if (!media) return null;

  const handleSave = async () => {
    setIsSaving(true)
    const result = await updateMediaMetadata(media.id, { alt_text: altText, caption, folder })
    if (result.success) {
      toast.success('Metadata updated successfully')
    } else {
      toast.error(result.error || 'Failed to update metadata')
    }
    setIsSaving(false)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(media.url)
    toast.success('URL copied to clipboard')
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-brand-white border-l-4 border-brand-dark shadow-[-4px_0px_0px_#111111] flex flex-col z-50 transform transition-transform duration-300">
      <div className="flex items-center justify-between p-4 border-b-4 border-brand-dark">
        <h2 className="font-black text-xl uppercase tracking-widest">Media Details</h2>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center border-2 border-brand-dark rounded-full hover:bg-brand-pink transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {/* Preview */}
        <div className="relative w-full aspect-video bg-gray-100 border-4 border-brand-dark overflow-hidden">
          {media.url && (
            <Image
              src={media.url}
              alt={media.alt_text || 'Preview'}
              fill
              className="object-contain"
              unoptimized={media.url.startsWith('http')}
            />
          )}
        </div>

        {/* File Info */}
        <div className="flex flex-col gap-2 p-4 bg-gray-50 border-2 border-brand-dark font-medium text-xs">
          <div className="flex items-center gap-2">
            <FileImage className="w-4 h-4 text-brand-dark" />
            <span className="truncate" title={media.original_filename}>{media.original_filename}</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-brand-dark" />
            <span>{formatBytes(media.size)} • {media.width && media.height ? `${media.width}x${media.height}` : media.extension}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-dark" />
            <span>{new Date(media.created_at).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <button 
              onClick={handleCopyUrl}
              className="flex items-center gap-1 text-brand-pink hover:underline decoration-2 font-bold uppercase tracking-wider"
            >
              <Link2 className="w-3 h-3" /> Copy URL
            </button>
          </div>
        </div>

        {/* Edit Form */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs uppercase tracking-widest">Folder</label>
            <select 
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="w-full p-2 border-2 border-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink"
            >
              <option value="general">General</option>
              <option value="products">Products</option>
              <option value="brands">Brands</option>
              <option value="beans">Beans</option>
              <option value="guides">Guides</option>
              <option value="homepage">Homepage</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs uppercase tracking-widest">Alt Text</label>
            <input 
              type="text" 
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full p-2 border-2 border-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink"
              placeholder="Describe the image for screen readers"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-bold text-xs uppercase tracking-widest">Caption</label>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border-2 border-brand-dark font-medium focus:outline-none focus:ring-2 focus:ring-brand-pink min-h-[80px]"
              placeholder="Optional visible caption"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border-t-4 border-brand-dark">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full py-3 bg-brand-lime border-4 border-brand-dark font-black text-sm uppercase tracking-widest hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
