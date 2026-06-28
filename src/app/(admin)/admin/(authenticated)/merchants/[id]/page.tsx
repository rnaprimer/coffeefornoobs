import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/admin/ui/PageHeader';
import MerchantForm from '@/components/admin/forms/MerchantForm';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Merchant - Admin',
};

export const dynamic = 'force-dynamic';

export default async function EditMerchantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return <div>Supabase not configured</div>;
  }

  const { data: merchant, error } = await (supabase as any)
    .from('merchants')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !merchant) {
    console.error('Error fetching merchant:', error);
    return notFound();
  }

  return (
    <>
      <PageHeader title={`Edit Merchant: ${(merchant as any).name}`} />
      <MerchantForm initialData={merchant} />
    </>
  );
}
