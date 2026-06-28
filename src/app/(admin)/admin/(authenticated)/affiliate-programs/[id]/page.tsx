import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/admin/ui/PageHeader';
import AffiliateProgramForm from '@/components/admin/forms/AffiliateProgramForm';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Edit Affiliate Program - Admin',
};

export const dynamic = 'force-dynamic';

export default async function EditAffiliateProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return <div>Supabase not configured</div>;
  }

  const { data: program, error } = await (supabase as any)
    .from('affiliate_programs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !program) {
    console.error('Error fetching affiliate program:', error);
    return notFound();
  }

  const { data: merchants } = await (supabase as any).from('merchants').select('id, name').order('name');

  return (
    <>
      <PageHeader title={`Edit Program: ${(program as any).program_name}`} />
      <AffiliateProgramForm initialData={program} merchants={merchants || []} />
    </>
  );
}
