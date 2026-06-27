import { createClient } from '@/lib/supabase/server'
import ProductsListClient from './ProductsListClient'

export const metadata = {
  title: 'Products - Admin',
}

export const dynamic = 'force-dynamic' // Ensure fresh data

export default async function ProductsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      status,
      price,
      categories(name),
      brands(name)
    `)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return <div>Error loading products: {error.message}</div>
  }

  return <ProductsListClient initialData={products as any} />
}
