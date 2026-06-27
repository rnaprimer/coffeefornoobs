import { createClient } from '@/lib/supabase/server'
import TagsListClient from './TagsListClient'

export const metadata = {
  title: 'Tags - Admin',
}

export const dynamic = 'force-dynamic'

export default async function TagsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .is('deleted_at', null)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching tags:', error)
    return <div>Error loading tags: {error.message}</div>
  }

  return <TagsListClient initialData={tags as any} />
}
