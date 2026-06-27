'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/admin/ui/PageHeader'
import DataTable, { ColumnDef } from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import DeleteDialog from '@/components/admin/ui/DeleteDialog'
import { deleteRecord } from '@/actions/admin'
import { toast } from 'sonner'

interface TagRow {
  id: string
  name: string
  slug: string
  status: string
  usage_count: number
  display_order: number
}

export default function TagsListClient({ initialData }: { initialData: TagRow[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const columns: ColumnDef<TagRow>[] = [
    { header: 'Order', accessorKey: 'display_order' },
    { header: 'Name', accessorKey: 'name' },
    { header: 'Slug', accessorKey: 'slug' },
    { header: 'Usage', accessorKey: 'usage_count' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    }
  ]

  async function handleDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    
    // Perform soft delete
    const result = await deleteRecord('tags', deleteId, ['/admin/tags', '/'])
    
    if (result.success) {
      toast.success('Tag deleted successfully')
      setDeleteId(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete tag')
    }
    
    setIsDeleting(false)
  }

  return (
    <>
      <PageHeader 
        title="Tags" 
        actionLabel="Add Tag"
        actionHref="/admin/tags/new"
      />

      <DataTable
        data={initialData}
        columns={columns}
        keyExtractor={(row) => row.id}
        editHrefPrefix="/admin/tags"
        onDelete={(id) => setDeleteId(id.toString())}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Tag"
        description="Are you sure you want to delete this tag? This will remove it from all assigned content."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isDeleting={isDeleting}
      />
    </>
  )
}
