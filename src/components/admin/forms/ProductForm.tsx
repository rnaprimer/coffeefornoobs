'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productSchema } from '@/lib/validations';
import { createRecord, updateRecord } from '@/actions/admin';
import { 
  assignMerchantToProduct, 
  updateProductMerchant, 
  deleteProductMerchant 
} from '@/actions/affiliate';
import { toast } from 'sonner';
import AdminForm from '@/components/admin/ui/AdminForm';
import { MediaPicker } from '@/components/admin/media/MediaPicker';
import { TagPicker } from '@/components/admin/forms/TagPicker';
import { Plus, Trash, Edit, Check, X } from 'lucide-react';

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: any;
  categories: { id: string; name: string }[];
  brands: { id: string; name: string }[];
  merchants?: { id: string; name: string }[];
  affiliatePrograms?: { id: string; program_name: string; merchant_id: string }[];
  productMerchants?: any[];
}

export default function ProductForm({ 
  initialData, 
  categories, 
  brands,
  merchants = [],
  affiliatePrograms = [],
  productMerchants = []
}: ProductFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!initialData;

  // Merchant Manager states
  const [merchantLinks, setMerchantLinks] = useState<any[]>(productMerchants);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  
  // Link Form state
  const [linkForm, setLinkForm] = useState({
    merchant_id: '',
    affiliate_program_id: '',
    affiliate_url: '',
    deep_link: '',
    buy_button_text: '',
    current_price: '',
    original_price: '',
    currency: 'INR',
    availability: 'In Stock',
    estimated_delivery: '',
    free_shipping: false,
    coupon_available: false,
    coupon_code: '',
    merchant_rating: '5',
    featured: false,
    priority: '0',
  });

  const filteredPrograms = affiliatePrograms.filter(
    p => p.merchant_id === linkForm.merchant_id
  );

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
  });

  async function onSubmit(data: ProductFormData) {
    setIsSaving(true);
    
    const submissionData = {
      ...data,
      category_id: data.category_id || null,
      brand_id: data.brand_id || null,
      featured_media_id: data.featured_media_id || null,
    };

    const result = isEditing 
      ? await updateRecord('products', initialData.id, submissionData, ['/admin/products', '/'])
      : await createRecord('products', submissionData, ['/admin/products', '/']);

    if (result.success) {
      toast.success(`Product ${isEditing ? 'updated' : 'created'} successfully`);
      router.push('/admin/products');
      router.refresh();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
    
    setIsSaving(false);
  }

  // Merchant Link Handlers
  async function handleSaveMerchantLink() {
    if (!linkForm.merchant_id || !linkForm.affiliate_url) {
      toast.error('Merchant and Affiliate URL are required');
      return;
    }

    const payload = {
      product_id: initialData.id,
      merchant_id: linkForm.merchant_id,
      affiliate_program_id: linkForm.affiliate_program_id || null,
      affiliate_url: linkForm.affiliate_url,
      deep_link: linkForm.deep_link || null,
      current_price: linkForm.current_price ? parseInt(linkForm.current_price, 10) : null,
      original_price: linkForm.original_price ? parseInt(linkForm.original_price, 10) : null,
      currency: linkForm.currency,
      availability: linkForm.availability,
      estimated_delivery: linkForm.estimated_delivery || null,
      free_shipping: linkForm.free_shipping,
      coupon_available: linkForm.coupon_available,
      coupon_code: linkForm.coupon_code || null,
      merchant_rating: parseFloat(linkForm.merchant_rating) || 5,
      featured: linkForm.featured,
      priority: parseInt(linkForm.priority, 10) || 0,
      status: 'active'
    };

    let res;
    if (editingLinkId) {
      res = await updateProductMerchant(editingLinkId, payload);
    } else {
      res = await assignMerchantToProduct(payload);
    }

    if (res.success) {
      toast.success(`Merchant link ${editingLinkId ? 'updated' : 'created'} successfully`);
      
      // Refresh list
      const updatedItem = {
        ...res.data,
        merchants: { name: merchants.find(m => m.id === payload.merchant_id)?.name || 'Merchant' },
        affiliate_programs: { program_name: affiliatePrograms.find(p => p.id === payload.affiliate_program_id)?.program_name || '' }
      };

      if (editingLinkId) {
        setMerchantLinks(prev => prev.map(item => item.id === editingLinkId ? updatedItem : item));
      } else {
        setMerchantLinks(prev => [...prev, updatedItem]);
      }

      // Reset form
      setIsAddingLink(false);
      setEditingLinkId(null);
      setLinkForm({
        merchant_id: '',
        affiliate_program_id: '',
        affiliate_url: '',
        deep_link: '',
        buy_button_text: '',
        current_price: '',
        original_price: '',
        currency: 'INR',
        availability: 'In Stock',
        estimated_delivery: '',
        free_shipping: false,
        coupon_available: false,
        coupon_code: '',
        merchant_rating: '5',
        featured: false,
        priority: '0',
      });
      router.refresh();
    } else {
      toast.error(res.error || 'Failed to save merchant link');
    }
  }

  function handleEditMerchantLink(link: any) {
    setEditingLinkId(link.id);
    setLinkForm({
      merchant_id: link.merchant_id || '',
      affiliate_program_id: link.affiliate_program_id || '',
      affiliate_url: link.affiliate_url || '',
      deep_link: link.deep_link || '',
      buy_button_text: link.buy_button_text || '',
      current_price: link.current_price?.toString() || '',
      original_price: link.original_price?.toString() || '',
      currency: link.currency || 'INR',
      availability: link.availability || 'In Stock',
      estimated_delivery: link.estimated_delivery || '',
      free_shipping: link.free_shipping || false,
      coupon_available: link.coupon_available || false,
      coupon_code: link.coupon_code || '',
      merchant_rating: link.merchant_rating?.toString() || '5',
      featured: link.featured || false,
      priority: link.priority?.toString() || '0',
    });
    setIsAddingLink(true);
  }

  async function handleDeleteMerchantLink(id: string) {
    if (!confirm('Are you sure you want to delete this merchant link?')) return;
    
    const res = await deleteProductMerchant(id);
    if (res.success) {
      toast.success('Merchant link removed');
      setMerchantLinks(prev => prev.filter(item => item.id !== id));
      router.refresh();
    } else {
      toast.error(res.error || 'Failed to delete merchant link');
    }
  }

  return (
    <div className="space-y-10">
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

      {/* MERCHANT LINKS MANAGER SECTION (ONLY ON EDIT) */}
      {isEditing && (
        <div className="bg-white shadow sm:rounded-lg border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Merchant Affiliate Links</h3>
              <p className="mt-1 text-sm text-gray-500">Manage multiple affiliate buy buttons, prices, and stock indicators for this product.</p>
            </div>
            {!isAddingLink && (
              <button
                type="button"
                onClick={() => setIsAddingLink(true)}
                className="inline-flex items-center gap-1.5 rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
              >
                <Plus size={16} /> Add Merchant Link
              </button>
            )}
          </div>

          {/* Add / Edit Merchant Link Subform */}
          {isAddingLink && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {editingLinkId ? 'Edit Merchant Link' : 'Add New Merchant Link'}
              </h4>
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                
                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700">Merchant *</label>
                  <select
                    value={linkForm.merchant_id}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, merchant_id: e.target.value, affiliate_program_id: '' }))}
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option value="">Select Retailer</option>
                    {merchants.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700">Affiliate Program</label>
                  <select
                    value={linkForm.affiliate_program_id}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, affiliate_program_id: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    disabled={!linkForm.merchant_id}
                  >
                    <option value="">Select Partnership (Optional)</option>
                    {filteredPrograms.map((p) => (
                      <option key={p.id} value={p.id}>{p.program_name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-semibold text-gray-700">Affiliate URL *</label>
                  <input
                    type="text"
                    value={linkForm.affiliate_url}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, affiliate_url: e.target.value }))}
                    placeholder="https://merchant.com/product-affiliate-link"
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-xs font-semibold text-gray-700">Deep Link / Original Link</label>
                  <input
                    type="text"
                    value={linkForm.deep_link}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, deep_link: e.target.value }))}
                    placeholder="https://merchant.com/product-original-link (Un-affiliated)"
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Current Price</label>
                  <input
                    type="number"
                    value={linkForm.current_price}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, current_price: e.target.value }))}
                    placeholder="Current selling price"
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Original Price (MRP)</label>
                  <input
                    type="number"
                    value={linkForm.original_price}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, original_price: e.target.value }))}
                    placeholder="List price (MRP)"
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Currency</label>
                  <input
                    type="text"
                    value={linkForm.currency}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, currency: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Availability</label>
                  <select
                    value={linkForm.availability}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, availability: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Limited Stock">Limited Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Preorder">Preorder</option>
                    <option value="Discontinued">Discontinued</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Est. Delivery (e.g. 2-3 days)</label>
                  <input
                    type="text"
                    value={linkForm.estimated_delivery}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, estimated_delivery: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700">Priority (Ranking weight)</label>
                  <input
                    type="number"
                    value={linkForm.priority}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, priority: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700">Coupon Code</label>
                  <input
                    type="text"
                    value={linkForm.coupon_code}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, coupon_code: e.target.value, coupon_available: !!e.target.value }))}
                    placeholder="Enter promo code"
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700">Buy Button Override Text</label>
                  <input
                    type="text"
                    value={linkForm.buy_button_text}
                    onChange={(e) => setLinkForm(prev => ({ ...prev, buy_button_text: e.target.value }))}
                    placeholder="e.g. Get Deal on Amazon"
                    className="mt-1 block w-full rounded-md border-gray-300 py-1.5 text-sm shadow-sm focus:border-amber-500 focus:ring-amber-500 px-3"
                  />
                </div>

                <div className="sm:col-span-6 flex gap-6 mt-2">
                  <label className="flex items-center text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={linkForm.free_shipping}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, free_shipping: e.target.checked }))}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4 mr-2"
                    />
                    Free Shipping
                  </label>

                  <label className="flex items-center text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={linkForm.featured}
                      onChange={(e) => setLinkForm(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 h-4 w-4 mr-2"
                    />
                    Highlight / Featured deal
                  </label>
                </div>

              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddingLink(false);
                    setEditingLinkId(null);
                  }}
                  className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMerchantLink}
                  className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
                >
                  {editingLinkId ? 'Save Changes' : 'Link Retailer'}
                </button>
              </div>
            </div>
          )}

          {/* Links list */}
          {merchantLinks.length === 0 ? (
            <div className="text-center py-6 text-sm text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              No merchants linked to this product yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retailer</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Availability</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th scope="col" className="relative px-3 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {merchantLinks.map((link) => (
                    <tr key={link.id}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {link.merchants?.name || 'Retailer'}
                        {link.affiliate_programs?.program_name && (
                          <span className="block text-[10px] font-normal text-gray-400">Program: {link.affiliate_programs.program_name}</span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          link.availability === 'In Stock' ? 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20' :
                          link.availability === 'Limited Stock' ? 'bg-yellow-50 text-yellow-700 ring-1 ring-inset ring-yellow-600/20' :
                          'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                        }`}>
                          {link.availability}
                        </span>
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {link.current_price ? `${link.currency || '₹'} ${link.current_price}` : 'N/A'}
                        {link.original_price && link.original_price > link.current_price && (
                          <span className="block text-xs font-normal text-gray-400 line-through">{link.currency || '₹'} {link.original_price}</span>
                        )}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.featured ? <span className="text-green-600 font-semibold text-xs">★ Yes</span> : 'No'}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                        {link.priority}
                      </td>
                      <td className="px-3 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditMerchantLink(link)}
                          className="text-amber-600 hover:text-amber-900 inline-flex items-center gap-0.5"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMerchantLink(link.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center gap-0.5"
                        >
                          <Trash size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
