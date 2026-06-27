import { createClient } from '@/lib/supabase/server'
import CategoriesListClient from './CategoriesListClient'

export const metadata = {
  title: 'Categories - Admin',
}

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .is('deleted_at', null)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return <div>Error loading categories: {error.message}</div>
  }

  return <CategoriesListClient initialData={categories as any} />
}
