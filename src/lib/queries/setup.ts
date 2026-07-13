import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/helpers';

export async function getSavedSetups() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await (supabase as any)
    .from('saved_setups')
    .select('*')
    .eq('user_id', user.id)
    .order('favorite', { ascending: false })
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching saved setups:', error);
    return [];
  }

  return data;
}

export async function getSetup(id: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await (supabase as any)
    .from('saved_setups')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching setup:', error);
    return null;
  }

  return data;
}

export async function getRecentSetup() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await (supabase as any)
    .from('saved_setups')
    .select('*')
    .eq('user_id', user.id)
    .order('last_opened_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching recent setup:', error);
    }
    return null;
  }

  return data;
}

export async function getFavoriteSetup() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  if (!supabase) return null;

  const { data, error } = await (supabase as any)
    .from('saved_setups')
    .select('*')
    .eq('user_id', user.id)
    .eq('favorite', true)
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Error fetching favorite setup:', error);
    }
    return null;
  }

  return data;
}
