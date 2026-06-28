'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/admin/ui/PageHeader';
import DataTable, { ColumnDef } from '@/components/admin/ui/DataTable';
import StatusBadge from '@/components/admin/ui/StatusBadge';
import DeleteDialog from '@/components/admin/ui/DeleteDialog';
import { deleteAffiliateProgram } from '@/actions/affiliate';
import { toast } from 'sonner';

interface ProgramRow {
  id: string;
  program_name: string;
  merchant_name: string;
  affiliate_network: string;
  commission_type: string;
  commission_value: number;
  program_status: string;
}

export default function AffiliateProgramsListClient({ initialData }: { initialData: ProgramRow[] }) {
  const router = useRouter();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const columns: ColumnDef<ProgramRow>[] = [
    { header: 'Program Name', accessorKey: 'program_name' },
    { header: 'Merchant', accessorKey: 'merchant_name' },
    { header: 'Network', accessorKey: 'affiliate_network' },
    { 
      header: 'Commission', 
      accessorKey: 'commission_value',
      cell: (row) => `${row.commission_value || 0}${row.commission_type === 'percentage' ? '%' : ''}`
    },
    { 
      header: 'Status', 
      accessorKey: 'program_status',
      cell: (row) => <StatusBadge status={row.program_status === 'active' ? 'published' : 'draft'} />
    }
  ];

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    
    const result = await deleteAffiliateProgram(deleteId);
    
    if (result.success) {
      toast.success('Affiliate program deleted successfully');
      setDeleteId(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete affiliate program');
    }
    
    setIsDeleting(false);
  }

  return (
    <>
      <PageHeader 
        title="Affiliate Programs" 
        actionLabel="Add Program"
        actionHref="/admin/affiliate-programs/new"
      />

      <DataTable
        data={initialData}
        columns={columns}
        keyExtractor={(row) => row.id}
        editHrefPrefix="/admin/affiliate-programs"
        onDelete={(id) => setDeleteId(id.toString())}
      />

      <DeleteDialog
        isOpen={!!deleteId}
        title="Delete Affiliate Program"
        description="Are you sure you want to delete this affiliate program?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isDeleting={isDeleting}
      />
    </>
  );
}
