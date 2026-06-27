import { createClient } from '@/lib/supabase/server'
import BeansListClient from './BeansListClient'

export const metadata = {
  title: 'Beans - Admin',
}

export const dynamic = 'force-dynamic'

export default async function BeansPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: beans, error } = await supabase
    .from('beans')
    .select('id, name, slug, status, roasters(name)')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching beans:', error)
    return <div>Error loading beans: {error.message}</div>
  }

  return <BeansListClient initialData={beans as any} />
}
