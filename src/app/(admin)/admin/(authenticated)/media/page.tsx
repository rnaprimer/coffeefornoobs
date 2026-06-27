import { Metadata } from 'next'
import MediaClient from './MediaClient'

export const metadata: Metadata = {
  title: 'Media Library | Admin',
}

export default function MediaPage() {
  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b-4 border-brand-dark pb-6">
        <div>
          <h1 className="font-black text-4xl uppercase tracking-tight mb-2">Media Library</h1>
          <p className="font-medium text-gray-600">Manage all your digital assets.</p>
        </div>
      </div>
      
      <MediaClient />
    </div>
  )
}
