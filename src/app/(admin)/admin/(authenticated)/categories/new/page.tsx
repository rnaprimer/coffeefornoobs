import PageHeader from '@/components/admin/ui/PageHeader'
import CategoryForm from '@/components/admin/forms/CategoryForm'

export const metadata = {
  title: 'New Category - Admin',
}

export default function NewCategoryPage() {
  return (
    <>
      <PageHeader title="New Category" />
      <CategoryForm />
    </>
  )
}
