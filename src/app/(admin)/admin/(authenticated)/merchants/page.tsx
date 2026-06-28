import { createClient } from '@/lib/supabase/server';
import MerchantsListClient from './MerchantsListClient';

export const metadata = {
  title: 'Merchants - Admin',
};

export const dynamic = 'force-dynamic';

export default async function MerchantsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return <div>Supabase not configured</div>;
  }

  const { data: merchants, error } = await (supabase as any)
    .from('merchants')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching merchants:', error);
    return <div>Error loading merchants: {error.message}</div>;
  }

  return <MerchantsListClient initialData={merchants as any} />;
}
