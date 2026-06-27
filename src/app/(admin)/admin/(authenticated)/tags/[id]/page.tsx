import { createClient } from '@/lib/supabase/server'
import PageHeader from '@/components/admin/ui/PageHeader'
import TagForm from '@/components/admin/forms/TagForm'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Edit Tag - Admin',
}

export default async function EditTagPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: tag, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !tag) {
    notFound()
  }

  return (
    <div className="max-w-4xl">
      <PageHeader 
        title="Edit Tag" 
      />
      <TagForm initialData={tag} />
    </div>
  )
}
