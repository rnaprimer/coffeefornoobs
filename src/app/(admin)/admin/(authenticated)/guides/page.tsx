import { createClient } from '@/lib/supabase/server'
import GuidesListClient from './GuidesListClient'

export const metadata = {
  title: 'Guides - Admin',
}

export const dynamic = 'force-dynamic'

export default async function GuidesPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, slug, status, display_order')
    .is('deleted_at', null)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching guides:', error)
    return <div>Error loading guides: {error.message}</div>
  }

  return <GuidesListClient initialData={guides as any} />
}
