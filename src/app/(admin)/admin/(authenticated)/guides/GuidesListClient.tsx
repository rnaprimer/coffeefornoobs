'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/admin/ui/PageHeader'
import DataTable, { ColumnDef } from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import DeleteDialog from '@/components/admin/ui/DeleteDialog'
import { deleteRecord } from '@/actions/admin'
import { toast } from 'sonner'

interface GuideRow {
  id: string
  title: string
  slug: string
  status: string
  display_order: number
}

export default function GuidesListClient({ initialData }: { initialData: GuideRow[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const columns: ColumnDef<GuideRow>[] = [
    { header: 'Order', accessorKey: 'display_order' },
    { header: 'Title', accessorKey: 'title' },
    { header: 'Slug', accessorKey: 'slug' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    }
  ]

  async function handleDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    
    const result = await deleteRecord('guides', deleteId, ['/admin/guides', '/'])
    
    if (result.success) {
      toast.success('Guide deleted successfully')
      setDeleteId(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete guide')
    }
    
    setIsDeleting(false)
  }

  return (
    <>
      <PageHeader 
        title="Guides" 
        actionLabel="Add Guide"
        actionHref="/admin/guides/new"
      />

      <DataTable
        data={initialData}
        columns={columns}
        keyExtractor={(row) => row.id}
        editHrefPrefix="/admin/guides"
        onDelete={(id) => setDeleteId(id.toString())}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Guide"
        description="Are you sure you want to delete this guide?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isDeleting={isDeleting}
      />
    </>
  )
}
