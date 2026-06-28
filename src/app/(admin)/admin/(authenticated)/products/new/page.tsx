import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import ProductForm from '@/components/admin/forms/ProductForm'

export const metadata = {
  title: 'New Product - Admin',
}

export default async function NewProductPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  // Fetch categories, brands, merchants, and affiliate programs for dropdowns
  const [
    { data: categories },
    { data: brands },
    { data: merchants },
    { data: affiliatePrograms }
  ] = await Promise.all([
    supabase.from('categories').select('id, name').is('deleted_at', null).order('name'),
    supabase.from('brands').select('id, name').is('deleted_at', null).order('name'),
    (supabase as any).from('merchants').select('id, name').order('name'),
    (supabase as any).from('affiliate_programs').select('id, program_name, merchant_id').order('program_name')
  ])

  return (
    <>
      <PageHeader title="New Product" />
      <ProductForm 
        categories={(categories as any) || []} 
        brands={(brands as any) || []} 
        merchants={(merchants as any) || []}
        affiliatePrograms={(affiliatePrograms as any) || []}
        productMerchants={[]}
      />
    </>
  )
}
