'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { comparisonSchema } from '@/lib/validations'
import { createRecord, updateRecord } from '@/actions/admin'
import { toast } from 'sonner'
import AdminForm from '@/components/admin/ui/AdminForm'
import { RichEditor } from '@/components/editor/RichEditor'
import { TagPicker } from '@/components/admin/forms/TagPicker'

type ComparisonFormData = z.infer<typeof comparisonSchema>

interface ComparisonFormProps {
  initialData?: any
}

export default function ComparisonForm({ initialData }: ComparisonFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!initialData

  const { register, control, handleSubmit, formState: { errors } } = useForm<ComparisonFormData>({
        // @ts-ignore
    resolver: zodResolver(comparisonSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      status: initialData?.status || 'draft',
      featured: initialData?.featured || false,
      content: initialData?.content || '',
      content_json: initialData?.content_json || '',
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
      tags: initialData?.tags?.map((t: any) => t.tag_id || t) || [],
    }
  })

  async function onSubmit(data: ComparisonFormData) {
    setIsSaving(true)
    
    const result = isEditing 
      ? await updateRecord('comparisons', initialData.id, data, ['/admin/comparisons', '/'])
      : await createRecord('comparisons', data, ['/admin/comparisons', '/'])

    if (result.success) {
      toast.success(`Comparison ${isEditing ? 'updated' : 'created'} successfully`)
      router.push('/admin/comparisons')
      router.refresh()
    } else {
      toast.error(result.error || 'Something went wrong')
    }
    
    setIsSaving(false)
  }

  return (
    <AdminForm 
      onSubmit={handleSubmit(onSubmit as any)} 
      cancelHref="/admin/comparisons"
      isSaving={isSaving}
      saveLabel={isEditing ? 'Update Comparison' : 'Create Comparison'}
    >
      <div className="sm:col-span-4">
        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">Title</label>
        <div className="mt-2">
          <input
            {...register('title')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>}
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
        <label htmlFor="content_json" className="block text-sm font-medium leading-6 text-gray-900 mb-2">Content</label>
        <Controller
          name="content_json"
          control={control}
          render={({ field }) => (
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <RichEditor 
                initialContent={field.value} 
                onChange={field.onChange} 
                draftKey={`comparison-${initialData?.id || 'new'}`}
              />
            </div>
          )}
        />
      </div>

      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">Taxonomy & Organization</h3>
      </div>

      <div className="sm:col-span-6">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Tags</label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagPicker 
              value={field.value || []} 
              onChange={field.onChange} 
            />
          )}
        />
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
