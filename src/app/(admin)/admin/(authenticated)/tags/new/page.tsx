import PageHeader from '@/components/admin/ui/PageHeader'
import TagForm from '@/components/admin/forms/TagForm'

export const metadata = {
  title: 'Add Tag - Admin',
}

export default function NewTagPage() {
  return (
    <div className="max-w-4xl">
      <PageHeader 
        title="Add Tag" 
      />
      <TagForm />
    </div>
  )
}
