'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/admin/ui/PageHeader';
import DataTable, { ColumnDef } from '@/components/admin/ui/DataTable';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import DeleteDialog from '@/components/admin/ui/DeleteDialog';
import { deleteMerchant } from '@/actions/affiliate';
import { toast } from 'sonner';

interface MerchantRow {
  id: string;
  name: string;
  slug: string;
  website: string;
  country: string;
  currency: string;
  status: string;
}

export default function MerchantsListClient({ initialData }: { initialData: MerchantRow[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns: ColumnDef<MerchantRow>[] = [
    { header: 'Name', accessorKey: 'name' },
    { header: 'Slug', accessorKey: 'slug' },
    { header: 'Country', accessorKey: 'country' },
    { header: 'Currency', accessorKey: 'currency' },
    { 
      header: 'Status', 
      accessorKey: 'status',
      cell: (row) => <StatusBadge status={row.status} />
    }
  ];

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    
    const result = await deleteMerchant(deleteId);
    
    if (result.success) {
      toast.success('Merchant deleted successfully');
      setDeleteId(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete merchant');
    }
    
    setIsDeleting(false);
  }

  return (
    <>
      <PageHeader 
        title="Merchants" 
        actionLabel="Add Merchant"
        actionHref="/admin/merchants/new"
      />

      <DataTable
        data={initialData}
        columns={columns}
        keyExtractor={(row) => row.id}
        editHrefPrefix="/admin/merchants"
        onDelete={(id) => setDeleteId(id.toString())}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Merchant"
        description="Are you sure you want to delete this merchant? This will also remove any affiliate programs and product merchant relationships linked to it."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isDeleting={isDeleting}
      />
    </>
  );
}
