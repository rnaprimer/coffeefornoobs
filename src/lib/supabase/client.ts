import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database';

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http') || supabaseUrl.includes('your_supabase')) {
    return null;
  }

  return createBrowserClient<Database>(
    supabaseUrl,
    supabaseAnonKey
  );
}

