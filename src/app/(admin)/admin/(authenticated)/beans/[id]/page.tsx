import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import BeanForm from '@/components/admin/forms/BeanForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Bean - Admin',
}

export default async function EditBeanPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const [
    { data: bean, error },
    { data: roasters },
    { data: tagsData }
  ] = await Promise.all([
    supabase.from('beans').select('*').eq('id', params.id).is('deleted_at', null).single(),
    supabase.from('roasters').select('id, name').is('deleted_at', null).order('name'),
    supabase.from('tag_assignments').select('tag_id').eq('entity_id', params.id).eq('entity_type', 'bean')
  ])

  if (error || !bean) {
    notFound()
  }

  // Attach tags
  const beanWithTags = { ...(bean as any), tags: tagsData || [] };

  return (
    <>
      <PageHeader title={`Edit Bean: ${(bean as any).name}`} />
      <BeanForm initialData={beanWithTags as any} roasters={(roasters as any) || []} />
    </>
  )
}
