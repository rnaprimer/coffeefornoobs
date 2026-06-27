'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PageHeader from '@/components/admin/ui/PageHeader'
import DataTable, { ColumnDef } from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import DeleteDialog from '@/components/admin/ui/DeleteDialog'
import { deleteRecord } from '@/actions/admin'
import { toast } from 'sonner'

interface ProductRow {
  id: string
  name: string
  slug: string
  status: string
  price: number | null
  categories: { name: string } | null
  brands: { name: string } | null
}

export default function ProductsListClient({ initialData }: { initialData: ProductRow[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const columns: ColumnDef<ProductRow>[] = [
    { header: 'Name', accessorKey: 'name' },
    { 
      header: 'Category', 
      accessorKey: 'categories',
      cell: (row) => row.categories?.name || '-'
    },
    { 
      header: 'Brand', 
      accessorKey: 'brands',
      cell: (row) => row.brands?.name || '-'
    },
    { 
      header: 'Price', 
      accessorKey: 'price',
      cell: (row) => row.price ? `$${row.price}` : '-'
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
    
    const result = await deleteRecord('products', deleteId, ['/admin/products', '/'])
    
    if (result.success) {
      toast.success('Product deleted successfully')
      setDeleteId(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete product')
    }
    
    setIsDeleting(false)
  }

  return (
    <>
      <PageHeader 
        title="Products" 
        description="Manage your coffee gear and equipment."
        actionLabel="Add Product"
        actionHref="/admin/products/new"
      />

      <DataTable
        data={initialData}
        columns={columns}
        keyExtractor={(row) => row.id}
        editHrefPrefix="/admin/products"
        onDelete={(id) => setDeleteId(id.toString())}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action will hide it from the public site but retain it in the database."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isDeleting={isDeleting}
      />
    </>
  )
}
