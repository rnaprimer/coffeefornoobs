import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import ComparisonForm from '@/components/admin/forms/ComparisonForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Comparison - Admin',
}

export default async function EditComparisonPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const [
    { data: comparison, error },
    { data: tagsData }
  ] = await Promise.all([
    supabase.from('comparisons').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('tag_assignments').select('tag_id').eq('entity_id', params.id).eq('entity_type', 'comparison')
  ])

  if (error || !comparison) {
    notFound()
  }

  // Attach tags
  const comparisonWithTags = { ...(comparison as any), tags: tagsData || [] };

  return (
    <>
      <PageHeader title={`Edit Comparison: ${(comparison as any).title}`} />
      <ComparisonForm initialData={comparisonWithTags as any} />
    </>
  )
}
