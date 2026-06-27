import { createClient } from '../supabase/server';

export const getSupabase = async () => {
  const client = await createClient();
  if (!client) throw new Error('Supabase not configured');
  return client;
};

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!url && !!key && url.startsWith('http') && !url.includes('your_supabase');
}
