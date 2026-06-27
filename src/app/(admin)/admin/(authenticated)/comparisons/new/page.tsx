import PageHeader from '@/components/admin/ui/PageHeader'
import ComparisonForm from '@/components/admin/forms/ComparisonForm'

export const metadata = {
  title: 'New Comparison - Admin',
}

export default function NewComparisonPage() {
  return (
    <>
      <PageHeader title="New Comparison" />
      <ComparisonForm />
    </>
  )
}
