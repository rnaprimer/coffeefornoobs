import { createClient } from '@/lib/supabase/server';
import AffiliateProgramsListClient from './AffiliateProgramsListClient';

export const metadata = {
  title: 'Affiliate Programs - Admin',
};

export const dynamic = 'force-dynamic';

export default async function AffiliateProgramsPage() {
  const supabase = await createClient();

  if (!supabase) {
    return <div>Supabase not configured</div>;
  }

  // Fetch with merchant name
  const { data: programs, error } = await (supabase as any)
    .from('affiliate_programs')
    .select('*, merchants(name)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching programs:', error);
    return <div>Error loading programs: {error.message}</div>;
  }

  // Map merchant name to program object for table display
  const formattedPrograms = (programs || []).map((p: any) => ({
    ...p,
    merchant_name: p.merchants?.name || 'N/A'
  }));

  return <AffiliateProgramsListClient initialData={formattedPrograms as any} />;
}
