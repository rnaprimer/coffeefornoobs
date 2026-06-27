import { getSupabase } from './shared';

export async function getSettings(key: string): Promise<any | null> {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) {
    return null;
  }

  return (data as any).value;
}
