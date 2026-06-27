'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { productSchema } from '@/lib/validations'
import { createRecord, updateRecord } from '@/actions/admin'
import { toast } from 'sonner'
import AdminForm from '@/components/admin/ui/AdminForm'
import { MediaPicker } from '@/components/admin/media/MediaPicker'
import { TagPicker } from '@/components/admin/forms/TagPicker'

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: any
  categories: { id: string; name: string }[]
  brands: { id: string; name: string }[]
}

export default function ProductForm({ initialData, categories, brands }: ProductFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = !!initialData

  const { register, control, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
        // @ts-ignore
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      status: initialData?.status || 'draft',
      featured: initialData?.featured || false,
      description: initialData?.description || '',
      category_id: initialData?.category_id || '',
      brand_id: initialData?.brand_id || '',
      price: initialData?.price || 0,
      rating: initialData?.rating || 0,
      reviews: initialData?.reviews || 0,
      badge: initialData?.badge || '',
      featured_media_id: initialData?.featured_media_id || '',
      image_text: initialData?.image_text || '',
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
      tags: initialData?.tags?.map((t: any) => t.tag_id || t) || [],
    }
  })

  async function onSubmit(data: ProductFormData) {
    setIsSaving(true)
    
    // Convert empty strings to null for uuids
    const submissionData = {
      ...data,
      category_id: data.category_id || null,
      brand_id: data.brand_id || null,
      featured_media_id: data.featured_media_id || null,
    }

    const result = isEditing 
      ? await updateRecord('products', initialData.id, submissionData, ['/admin/products', '/'])
      : await createRecord('products', submissionData, ['/admin/products', '/'])

    if (result.success) {
      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`)
      router.push('/admin/products')
      router.refresh()
    } else {
      toast.error(result.error || 'Something went wrong')
    }
    
    setIsSaving(false)
  }

  return (
    <AdminForm 
      onSubmit={handleSubmit(onSubmit as any)} 
      cancelHref="/admin/products"
      isSaving={isSaving}
      saveLabel={isEditing ? 'Update Product' : 'Create Product'}
    >
      <div className="sm:col-span-4">
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
        <div className="mt-2">
          <input
            {...register('name')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
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
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.slug && <p className="mt-2 text-sm text-red-600">{errors.slug.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="category_id" className="block text-sm font-medium leading-6 text-gray-900">Category</label>
        <div className="mt-2">
          <select
            {...register('category_id')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          >
            <option value="">Select a category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="mt-2 text-sm text-red-600">{errors.category_id.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="brand_id" className="block text-sm font-medium leading-6 text-gray-900">Brand</label>
        <div className="mt-2">
          <select
            {...register('brand_id')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          >
            <option value="">Select a brand</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          {errors.brand_id && <p className="mt-2 text-sm text-red-600">{errors.brand_id.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">Price ($)</label>
        <div className="mt-2">
          <input
            {...register('price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
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
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
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
        <p className="mt-2 text-sm text-gray-500">Add tags to improve search and discovery.</p>
      </div>
      
      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">Media</h3>
      </div>

      <div className="sm:col-span-6">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Featured Image</label>
        <Controller
          name="featured_media_id"
          control={control}
          render={({ field }) => (
            <MediaPicker 
              value={field.value} 
              onChange={field.onChange} 
              folder="products" 
            />
          )}
        />
        {errors.featured_media_id && <p className="mt-2 text-sm text-red-600">{errors.featured_media_id.message}</p>}
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
