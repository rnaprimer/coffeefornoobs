import { createClient } from '@/lib/supabase/server'
import BrandsListClient from './BrandsListClient'

export const metadata = {
  title: 'Brands - Admin',
}

export const dynamic = 'force-dynamic'

export default async function BrandsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: brands, error } = await supabase
    .from('brands')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching brands:', error)
    return <div>Error loading brands: {error.message}</div>
  }

  return <BrandsListClient initialData={brands as any} />
}
