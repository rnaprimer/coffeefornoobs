'use client'

import Image from 'next/image'
import { Check, Copy, Trash2, Folder, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { softDeleteMedia } from '@/actions/media'
import { useState } from 'react'

export function MediaCard({ 
  media, 
  selectable = false, 
  onSelect,
  selected = false
}: { 
  media: any, 
  selectable?: boolean, 
  onSelect?: (media: any) => void,
  selected?: boolean
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(media.url);
    toast.success('URL copied to clipboard');
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this media?')) return;
    
    setIsDeleting(true);
    const result = await softDeleteMedia(media.id);
    if (result.success) {
      toast.success('Media deleted successfully');
    } else {
      toast.error(result.error || 'Failed to delete media');
      setIsDeleting(false);
    }
  };

  return (
    <div 
      className={`group relative bg-brand-white border-4 shadow-[4px_4px_0px_#111111] overflow-hidden transition-all duration-200 
        ${selectable ? 'cursor-pointer hover:translate-x-1 hover:-translate-y-1' : ''}
        ${selected ? 'border-brand-pink ring-4 ring-brand-pink/50 ring-offset-2' : 'border-brand-dark'}
      `}
      onClick={() => selectable && onSelect && onSelect(media)}
    >
      {selected && (
        <div className="absolute top-2 left-2 z-20 bg-brand-pink text-white w-6 h-6 flex items-center justify-center rounded-full border-2 border-brand-dark">
          <Check className="w-4 h-4" />
        </div>
      )}
      
      <div className="aspect-square relative bg-gray-100 overflow-hidden border-b-4 border-brand-dark">
        {media.url ? (
          <Image
            src={media.url}
            alt={media.alt_text || media.filename}
            fill
            className={`object-cover transition-transform duration-500 ${isDeleting ? 'opacity-50 grayscale' : 'group-hover:scale-105'}`}
            sizes="(max-width: 768px) 50vw, 33vw"
            unoptimized={media.url.startsWith('http')} // Since R2 might not be fully configured yet
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 font-bold text-gray-400">
            No Image
          </div>
        )}
        
        {/* Overlay Actions */}
        {!selectable && !isDeleting && (
          <div className="absolute inset-0 bg-brand-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-10">
            <button 
              onClick={handleCopy}
              className="w-10 h-10 bg-brand-white border-2 border-brand-dark rounded-full flex items-center justify-center hover:bg-brand-lime transition-colors"
              title="Copy URL"
            >
              <Copy className="w-4 h-4 text-brand-dark" />
            </button>
            <a 
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-brand-white border-2 border-brand-dark rounded-full flex items-center justify-center hover:bg-brand-pink transition-colors"
              title="Open Original"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 text-brand-dark" />
            </a>
            <button 
              onClick={handleDelete}
              className="w-10 h-10 bg-red-500 border-2 border-brand-dark rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>

      <div className="p-3 bg-brand-white">
        <p className="font-bold text-xs truncate mb-1" title={media.original_filename || media.filename}>
          {media.original_filename || media.filename}
        </p>
        <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <Folder className="w-3 h-3" />
            {media.folder}
          </div>
          <span>
            {media.width && media.height ? `${media.width}x${media.height}` : media.extension?.toUpperCase() || 'IMG'}
          </span>
        </div>
      </div>
    </div>
  )
}
