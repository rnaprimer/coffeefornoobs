import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import BeanForm from '@/components/admin/forms/BeanForm'

export const metadata = {
  title: 'New Bean - Admin',
}

export default async function NewBeanPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: roasters } = await supabase
    .from('roasters')
    .select('id, name')
    .is('deleted_at', null)
    .order('name')

  return (
    <>
      <PageHeader title="New Coffee Bean" />
      <BeanForm roasters={(roasters as any) || []} />
    </>
  )
}
