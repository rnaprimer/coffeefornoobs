'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/admin/ui/PageHeader'
import DataTable, { ColumnDef } from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import DeleteDialog from '@/components/admin/ui/DeleteDialog'
import { deleteRecord } from '@/actions/admin'
import { toast } from 'sonner'

interface BeanRow {
  id: string
  name: string
  slug: string
  status: string
  roasters: { name: string } | null
}

export default function BeansListClient({ initialData }: { initialData: BeanRow[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const columns: ColumnDef<BeanRow>[] = [
    { header: 'Name', accessorKey: 'name' },
    { 
      header: 'Roaster', 
      accessorKey: 'roasters',
      cell: (row) => row.roasters?.name || '-'
    },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    }
  ]

  async function handleDelete() {
    if (!deleteId) return
    setIsDeleting(true)
    
    const result = await deleteRecord('beans', deleteId, ['/admin/beans', '/'])
    
    if (result.success) {
      toast.success('Bean deleted successfully')
      setDeleteId(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete bean')
    }
    
    setIsDeleting(false)
  }

  return (
    <>
      <PageHeader 
        title="Coffee Beans" 
        actionLabel="Add Bean"
        actionHref="/admin/beans/new"
      />

      <DataTable
        data={initialData}
        columns={columns}
        keyExtractor={(row) => row.id}
        editHrefPrefix="/admin/beans"
        onDelete={(id) => setDeleteId(id.toString())}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Bean"
        description="Are you sure you want to delete this bean?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isDeleting={isDeleting}
      />
    </>
  )
}
