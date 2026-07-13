import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from './profile';

export async function getPreferences() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  if (!supabase) return null;
  const { data: preferences } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return preferences;
}
