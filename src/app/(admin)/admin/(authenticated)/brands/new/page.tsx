import PageHeader from '@/components/admin/ui/PageHeader'
import BrandForm from '@/components/admin/forms/BrandForm'

export const metadata = {
  title: 'New Brand - Admin',
}

export default function NewBrandPage() {
  return (
    <>
      <PageHeader title="New Brand" />
      <BrandForm />
    </>
  )
}
