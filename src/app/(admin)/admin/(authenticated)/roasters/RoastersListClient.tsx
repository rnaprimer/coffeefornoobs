'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/admin/ui/PageHeader'
import DataTable, { ColumnDef } from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import DeleteDialog from '@/components/admin/ui/DeleteDialog'
import { deleteRecord } from '@/actions/admin'
import { toast } from 'sonner'

interface RoasterRow {
  id: string
  name: string
  location: string | null
  status: string
}

export default function RoastersListClient({ initialData }: { initialData: RoasterRow[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const columns: ColumnDef<RoasterRow>[] = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Location', accessorKey: 'location' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    }
  ]

  async function handleDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    
    const result = await deleteRecord('roasters', deleteId, ['/admin/roasters', '/'])
    
    if (result.success) {
      toast.success('Roaster deleted successfully')
      setDeleteId(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete roaster')
    }
    
    setIsDeleting(false)
  }

  return (
    <>
      <PageHeader 
        title="Roasters" 
        actionLabel="Add Roaster"
        actionHref="/admin/roasters/new"
      />

      <DataTable
        data={initialData}
        columns={columns}
        keyExtractor={(row) => row.id}
        editHrefPrefix="/admin/roasters"
        onDelete={(id) => setDeleteId(id.toString())}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Roaster"
        description="Are you sure you want to delete this roaster?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isDeleting={isDeleting}
      />
    </>
  )
}
