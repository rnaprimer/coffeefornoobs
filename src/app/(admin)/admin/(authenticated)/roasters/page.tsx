import { createClient } from '@/lib/supabase/server'
import RoastersListClient from './RoastersListClient'

export const metadata = {
  title: 'Roasters - Admin',
}

export const dynamic = 'force-dynamic'

export default async function RoastersPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: roasters, error } = await supabase
    .from('roasters')
    .select('id, name, location, status')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching roasters:', error)
    return <div>Error loading roasters: {error.message}</div>
  }

  return <RoastersListClient initialData={roasters as any} />
}
