import PageHeader from '@/components/admin/ui/PageHeader'
import GuideForm from '@/components/admin/forms/GuideForm'

export const metadata = {
  title: 'New Guide - Admin',
}

export default function NewGuidePage() {
  return (
    <>
      <PageHeader title="New Guide" />
      <GuideForm />
    </>
  )
}
