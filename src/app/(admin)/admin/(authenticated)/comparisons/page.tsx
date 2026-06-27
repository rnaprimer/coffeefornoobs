import { createClient } from '@/lib/supabase/server'
import ComparisonsListClient from './ComparisonsListClient'

export const metadata = {
  title: 'Comparisons - Admin',
}

export const dynamic = 'force-dynamic'

export default async function ComparisonsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: comparisons, error } = await supabase
    .from('comparisons')
    .select('id, title, slug, status')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching comparisons:', error)
    return <div>Error loading comparisons: {error.message}</div>
  }

  return <ComparisonsListClient initialData={comparisons as any} />
}
