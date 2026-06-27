import PageHeader from '@/components/admin/ui/PageHeader'
import RoasterForm from '@/components/admin/forms/RoasterForm'

export const metadata = {
  title: 'New Roaster - Admin',
}

export default function NewRoasterPage() {
  return (
    <>
      <PageHeader title="New Roaster" />
      <RoasterForm />
    </>
  )
}
