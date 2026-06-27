'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/admin/ui/PageHeader'
import DataTable, { ColumnDef } from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import DeleteDialog from '@/components/admin/ui/DeleteDialog'
import { deleteRecord } from '@/actions/admin'
import { toast } from 'sonner'

interface ComparisonRow {
  id: string
  title: string
  slug: string
  status: string
}

export default function ComparisonsListClient({ initialData }: { initialData: ComparisonRow[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const columns: ColumnDef<ComparisonRow>[] = [
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
    
    const result = await deleteRecord('comparisons', deleteId, ['/admin/comparisons', '/'])
    
    if (result.success) {
      toast.success('Comparison deleted successfully')
      setDeleteId(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete comparison')
    }
    
    setIsDeleting(false)
  }

  return (
    <>
      <PageHeader 
        title="Comparisons" 
        actionLabel="Add Comparison"
        actionHref="/admin/comparisons/new"
      />

      <DataTable
        data={initialData}
        columns={columns}
        keyExtractor={(row) => row.id}
        editHrefPrefix="/admin/comparisons"
        onDelete={(id) => setDeleteId(id.toString())}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Comparison"
        description="Are you sure you want to delete this comparison?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isDeleting={isDeleting}
      />
    </>
  )
}
