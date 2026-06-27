import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import GuideForm from '@/components/admin/forms/GuideForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Guide - Admin',
}

export default async function EditGuidePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const [
    { data: guide, error },
    { data: tagsData }
  ] = await Promise.all([
    supabase.from('guides').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('tag_assignments').select('tag_id').eq('entity_id', params.id).eq('entity_type', 'guide')
  ])

  if (error || !guide) {
    notFound()
  }

  // Attach tags
  const guideWithTags = { ...(guide as any), tags: tagsData || [] };

  return (
    <>
      <PageHeader title={`Edit Guide: ${(guide as any).title}`} />
      <GuideForm initialData={guideWithTags as any} />
    </>
  )
}
