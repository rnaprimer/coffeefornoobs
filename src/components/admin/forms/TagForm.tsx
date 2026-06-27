'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { tagSchema } from '@/lib/validations'
import { createRecord, updateRecord } from '@/actions/admin'
import { toast } from 'sonner'
import AdminForm from '@/components/admin/ui/AdminForm'
import { MediaPicker } from '@/components/admin/media/MediaPicker'

type TagFormData = z.infer<typeof tagSchema>

interface TagFormProps {
  initialData?: any
}

export default function TagForm({ initialData }: TagFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!initialData

  const { register, control, handleSubmit, formState: { errors } } = useForm<TagFormData>({
    // @ts-ignore
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      description: initialData?.description || '',
      color: initialData?.color || '',
      icon_media_id: initialData?.icon_media_id || '',
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
      featured: initialData?.featured || false,
      display_order: initialData?.display_order || 0,
      status: initialData?.status || 'published',
    }
  })

  async function onSubmit(data: TagFormData) {
    setIsSaving(true)
    const submissionData = {
      ...data,
      icon_media_id: data.icon_media_id || null,
      color: data.color || null,
    }
    
    const result = isEditing 
      ? await updateRecord('tags', initialData.id, submissionData, ['/admin/tags', '/'])
      : await createRecord('tags', submissionData, ['/admin/tags', '/'])

    if (result.success) {
      toast.success(`Tag ${isEditing ? 'updated' : 'created'} successfully`)
      router.push('/admin/tags')
      router.refresh()
    } else {
      toast.error(result.error || 'Something went wrong')
    }
    
    setIsSaving(false)
  }

  return (
    <AdminForm 
      onSubmit={handleSubmit(onSubmit as any)} 
      cancelHref="/admin/tags"
      isSaving={isSaving}
      saveLabel={isEditing ? 'Update Tag' : 'Create Tag'}
    >
      <div className="sm:col-span-4">
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
        <div className="mt-2">
          <input
            {...register('name')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="slug" className="block text-sm font-medium leading-6 text-gray-900">Slug</label>
        <div className="mt-2">
          <input
            {...register('slug')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.slug && <p className="mt-2 text-sm text-red-600">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="color" className="block text-sm font-medium leading-6 text-gray-900">Color (Hex or Tailwind class)</label>
        <div className="mt-2">
          <input
            {...register('color')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
            placeholder="e.g. #4ade80"
          />
        </div>
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="display_order" className="block text-sm font-medium leading-6 text-gray-900">Display Order</label>
        <div className="mt-2">
          <input
            {...register('display_order', { valueAsNumber: true })}
            type="number"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
        <div className="mt-2">
          <select
            {...register('status')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div className="sm:col-span-2 flex items-center h-full pt-8">
        <div className="flex h-6 items-center">
          <input
            {...register('featured')}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor="featured" className="font-medium text-gray-900">Featured</label>
        </div>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <div className="mt-2">
          <textarea
            {...register('description')}
            rows={4}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">Media</h3>
      </div>

      <div className="sm:col-span-6">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Icon Image</label>
        <Controller
          name="icon_media_id"
          control={control}
          render={({ field }) => (
            <MediaPicker 
              value={field.value} 
              onChange={field.onChange} 
              folder="tags" 
            />
          )}
        />
        {errors.icon_media_id && <p className="mt-2 text-sm text-red-600">{errors.icon_media_id.message}</p>}
      </div>

      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">SEO Configuration</h3>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="seo_title" className="block text-sm font-medium leading-6 text-gray-900">SEO Title</label>
        <div className="mt-2">
          <input
            {...register('seo_title')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="seo_description" className="block text-sm font-medium leading-6 text-gray-900">SEO Description</label>
        <div className="mt-2">
          <textarea
            {...register('seo_description')}
            rows={2}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>
    </AdminForm>
  )
}
