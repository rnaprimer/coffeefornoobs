import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import CategoryForm from '@/components/admin/forms/CategoryForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Category - Admin',
}

export default async function EditCategoryPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const [
    { data: category, error },
    { data: tagsData }
  ] = await Promise.all([
    supabase.from('categories').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('tag_assignments').select('tag_id').eq('entity_id', params.id).eq('entity_type', 'category')
  ])

  if (error || !category) {
    notFound()
  }

  // Attach tags
  const categoryWithTags = { ...(category as any), tags: tagsData || [] };

  return (
    <>
      <PageHeader title={`Edit Category: ${(category as any).name}`} />
      <CategoryForm initialData={categoryWithTags as any} />
    </>
  )
}
