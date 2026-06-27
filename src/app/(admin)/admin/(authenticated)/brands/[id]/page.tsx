import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import BrandForm from '@/components/admin/forms/BrandForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Brand - Admin',
}

export default async function EditBrandPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const [
    { data: brand, error },
    { data: tagsData }
  ] = await Promise.all([
    supabase.from('brands').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('tag_assignments').select('tag_id').eq('entity_id', params.id).eq('entity_type', 'brand')
  ])

  if (error || !brand) {
    notFound()
  }

  // Attach tags
  const brandWithTags = { ...(brand as any), tags: tagsData || [] };

  return (
    <>
      <PageHeader title={`Edit Brand: ${(brand as any).name}`} />
      <BrandForm initialData={brandWithTags as any} />
    </>
  )
}
