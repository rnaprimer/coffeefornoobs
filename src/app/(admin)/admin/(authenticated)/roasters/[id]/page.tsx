import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import RoasterForm from '@/components/admin/forms/RoasterForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Roaster - Admin',
}

export default async function EditRoasterPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const [
    { data: roaster, error },
    { data: tagsData }
  ] = await Promise.all([
    supabase.from('roasters').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('tag_assignments').select('tag_id').eq('entity_id', params.id).eq('entity_type', 'roaster')
  ])

  if (error || !roaster) {
    notFound()
  }

  // Attach tags
  const roasterWithTags = { ...(roaster as any), tags: tagsData || [] };

  return (
    <>
      <PageHeader title={`Edit Roaster: ${(roaster as any).name}`} />
      <RoasterForm initialData={roasterWithTags as any} />
    </>
  )
}
