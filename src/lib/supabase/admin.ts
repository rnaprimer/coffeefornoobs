import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

/**
 * Creates a service-role Supabase client.
 * This client bypasses Row Level Security (RLS).
 * 
 * WARNING: NEVER use this client in the browser or expose it to the client side.
 * It should ONLY be used in backend routes and background jobs for infrastructure tasks.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables for admin client.');
    // We don't throw to prevent crashing the entire build process, but we warn heavily.
    return null;
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
