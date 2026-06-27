import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import ProductForm from '@/components/admin/forms/ProductForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Product - Admin',
}

export default async function EditProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  // Fetch product, categories, and brands
  const [
    { data: product, error },
    { data: categories },
    { data: brands },
    { data: tagsData }
  ] = await Promise.all([
    supabase.from('products').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('categories').select('id, name').is('deleted_at', null).order('name'),
    supabase.from('brands').select('id, name').is('deleted_at', null).order('name'),
    supabase.from('tag_assignments').select('tag_id').eq('entity_id', params.id).eq('entity_type', 'product')
  ])

  if (error || !product) {
    notFound()
  }

  // Attach tags
  const productWithTags = { ...(product as any), tags: tagsData || [] };

  return (
    <>
      <PageHeader title={`Edit Product: ${(product as any).name}`} />
      <ProductForm 
        initialData={productWithTags as any}
        categories={(categories as any) || []} 
        brands={(brands as any) || []} 
      />
    </>
  )
}
