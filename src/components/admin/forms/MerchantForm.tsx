'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { merchantSchema } from '@/lib/validations/affiliate';
import { createMerchant, updateMerchant } from '@/actions/affiliate';
import { toast } from 'sonner';
import AdminForm from '@/components/admin/ui/AdminForm';
import { MediaPicker } from '@/components/admin/media/MediaPicker';

type MerchantFormData = z.infer<typeof merchantSchema>;

interface MerchantFormProps {
  initialData?: any;
}

export default function MerchantForm({ initialData }: MerchantFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!initialData;

  const { register, control, handleSubmit, formState: { errors } } = useForm<MerchantFormData>({
    // @ts-ignore
    resolver: zodResolver(merchantSchema),
    defaultValues: {
      name: initialData?.name || '',
      slug: initialData?.slug || '',
      status: initialData?.status || 'draft',
      featured: initialData?.featured || false,
      description: initialData?.description || '',
      logo_media_id: initialData?.logo_media_id || '',
      favicon_media_id: initialData?.favicon_media_id || '',
      website: initialData?.website || '',
      support_email: initialData?.support_email || '',
      country: initialData?.country || '',
      currency: initialData?.currency || 'INR',
      // @ts-ignore
      shipping_regions: initialData?.shipping_regions?.join(', ') || '',
      return_policy_url: initialData?.return_policy_url || '',
      affiliate_network: initialData?.affiliate_network || '',
      default_commission: initialData?.default_commission || 0,
      cookie_duration: initialData?.cookie_duration || 0,
      tracking_method: initialData?.tracking_method || '',
      display_order: initialData?.display_order || 0,
      priority: initialData?.priority || 0,
      seo_title: initialData?.seo_title || '',
      seo_description: initialData?.seo_description || '',
    }
  });

  async function onSubmit(data: any) {
    setIsSaving(true);
    
    // Process comma separated shipping regions to array
    let regions: string[] = [];
    if (typeof data.shipping_regions === 'string' && data.shipping_regions.trim()) {
      regions = data.shipping_regions.split(',').map((r: string) => r.trim()).filter(Boolean);
    } else if (Array.isArray(data.shipping_regions)) {
      regions = data.shipping_regions;
    }

    const submissionData = {
      ...data,
      shipping_regions: regions,
      logo_media_id: data.logo_media_id || null,
      favicon_media_id: data.favicon_media_id || null,
    };
    
    const result = isEditing 
      ? await updateMerchant(initialData.id, submissionData)
      : await createMerchant(submissionData);

    if (result.success) {
      toast.success(`Merchant ${isEditing ? 'updated' : 'created'} successfully`);
      router.push('/admin/merchants');
      router.refresh();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
    
    setIsSaving(false);
  }

  return (
    <AdminForm 
      onSubmit={handleSubmit(onSubmit as any)} 
      cancelHref="/admin/merchants"
      isSaving={isSaving}
      saveLabel={isEditing ? 'Update Merchant' : 'Create Merchant'}
    >
      <div className="sm:col-span-4">
        <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Merchant Name</label>
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

      <div className="sm:col-span-2">
        <label htmlFor="status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
        <div className="mt-2">
          <select
            {...register('status')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
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
          <label htmlFor="featured" className="font-medium text-gray-900">Featured Merchant</label>
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="priority" className="block text-sm font-medium leading-6 text-gray-900">Priority Weight</label>
        <div className="mt-2">
          <input
            {...register('priority', { valueAsNumber: true })}
            type="number"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">Description</label>
        <div className="mt-2">
          <textarea
            {...register('description')}
            rows={3}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">Website & Details</h3>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="website" className="block text-sm font-medium leading-6 text-gray-900">Website URL</label>
        <div className="mt-2">
          <input
            {...register('website')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.website && <p className="mt-2 text-sm text-red-600">{errors.website.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="support_email" className="block text-sm font-medium leading-6 text-gray-900">Support Email</label>
        <div className="mt-2">
          <input
            {...register('support_email')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.support_email && <p className="mt-2 text-sm text-red-600">{errors.support_email.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">Country Code (e.g. IN, US)</label>
        <div className="mt-2">
          <input
            {...register('country')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="currency" className="block text-sm font-medium leading-6 text-gray-900">Currency (e.g. INR, USD)</label>
        <div className="mt-2">
          <input
            {...register('currency')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="shipping_regions" className="block text-sm font-medium leading-6 text-gray-900">Shipping Regions (Comma separated)</label>
        <div className="mt-2">
          <input
            {...register('shipping_regions')}
            type="text"
            placeholder="India, Worldwide, etc."
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="return_policy_url" className="block text-sm font-medium leading-6 text-gray-900">Return Policy URL</label>
        <div className="mt-2">
          <input
            {...register('return_policy_url')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.return_policy_url && <p className="mt-2 text-sm text-red-600">{errors.return_policy_url.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">Affiliate Details</h3>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="affiliate_network" className="block text-sm font-medium leading-6 text-gray-900">Affiliate Network</label>
        <div className="mt-2">
          <input
            {...register('affiliate_network')}
            type="text"
            placeholder="Impact, Amazon, etc."
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="default_commission" className="block text-sm font-medium leading-6 text-gray-900">Default Commission %</label>
        <div className="mt-2">
          <input
            {...register('default_commission', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="cookie_duration" className="block text-sm font-medium leading-6 text-gray-900">Cookie Duration (Days)</label>
        <div className="mt-2">
          <input
            {...register('cookie_duration', { valueAsNumber: true })}
            type="number"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="tracking_method" className="block text-sm font-medium leading-6 text-gray-900">Tracking Method</label>
        <div className="mt-2">
          <input
            {...register('tracking_method')}
            type="text"
            placeholder="SubID, Postback, API Link"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">Media</h3>
      </div>

      <div className="sm:col-span-3">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Logo</label>
        <Controller
          name="logo_media_id"
          control={control}
          render={({ field }) => (
            <MediaPicker 
              value={field.value || ''} 
              onChange={field.onChange} 
              folder="merchants" 
            />
          )}
        />
      </div>

      <div className="sm:col-span-3">
        <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">Favicon</label>
        <Controller
          name="favicon_media_id"
          control={control}
          render={({ field }) => (
            <MediaPicker 
              value={field.value || ''} 
              onChange={field.onChange} 
              folder="merchants" 
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
  );
}
