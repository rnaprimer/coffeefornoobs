'use client'

import { useState, useCallback } from 'react'
import { UploadCloud, X, Loader2 } from 'lucide-react'
import { uploadMedia } from '@/actions/media'
import { toast } from 'sonner'

export function UploadDropzone({ onUploadComplete }: { onUploadComplete?: () => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [folder, setFolder] = useState('general')

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    await processFiles(files)
  }, [folder])

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      await processFiles(Array.from(e.target.files))
    }
  }

  const processFiles = async (files: File[]) => {
    setIsUploading(true)
    let successCount = 0
    let errorCount = 0

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`)
        errorCount++
        continue
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      
      // Attempt to get dimensions on the client before upload
      try {
        const url = URL.createObjectURL(file)
        const img = new Image()
        await new Promise((resolve) => {
          img.onload = () => {
            formData.append('width', img.width.toString())
            formData.append('height', img.height.toString())
            URL.revokeObjectURL(url)
            resolve(true)
          }
          img.src = url
        })
      } catch (e) {
        // Ignore dimension extraction errors
      }

      const result = await uploadMedia(formData)
      if (result.success) {
        successCount++
      } else {
        toast.error(`Failed to upload ${file.name}: ${result.error}`)
        errorCount++
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)`)
      if (onUploadComplete) onUploadComplete()
    }
    
    setIsUploading(false)
  }

  return (
    <div className="bg-brand-white border-4 border-brand-dark shadow-[4px_4px_0px_#111111] p-6 mb-8 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-black text-xl uppercase tracking-widest">Upload Media</h2>
        <select 
          value={folder} 
          onChange={(e) => setFolder(e.target.value)}
          className="border-2 border-brand-dark px-3 py-1 font-bold text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
        >
          <option value="general">General</option>
          <option value="products">Products</option>
          <option value="brands">Brands</option>
          <option value="beans">Beans</option>
          <option value="guides">Guides</option>
          <option value="homepage">Homepage</option>
        </select>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-4 border-dashed p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
          ${isDragging ? 'border-brand-pink bg-brand-pink/10' : 'border-brand-dark hover:bg-gray-50'}`}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="hidden"
          onChange={handleFileInput}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-brand-pink" />
            <p className="font-bold text-lg">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-brand-lime border-4 border-brand-dark rounded-full flex items-center justify-center">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div>
              <p className="font-bold text-lg mb-1">Click or drag images here</p>
              <p className="text-sm font-medium text-gray-500">Supports JPG, PNG, WEBP, AVIF (Max 10MB)</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
