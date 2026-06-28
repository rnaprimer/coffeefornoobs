import PageHeader from '@/components/admin/ui/PageHeader';
import AffiliateProgramForm from '@/components/admin/forms/AffiliateProgramForm';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'New Affiliate Program - Admin',
};

export const dynamic = 'force-dynamic';

export default async function NewAffiliateProgramPage() {
  const supabase = await createClient();
  let merchants: { id: string; name: string }[] = [];

  if (supabase) {
    const { data } = await supabase.from('merchants').select('id, name').order('name');
    merchants = data || [];
  }

  return (
    <>
      <PageHeader title="New Affiliate Program" />
      <AffiliateProgramForm merchants={merchants} />
    </>
  );
}
