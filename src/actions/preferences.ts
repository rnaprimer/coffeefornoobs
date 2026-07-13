'use server';

import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth/helpers';
import { preferencesSchema, PreferencesFormValues } from '@/lib/validations/preferences';
import { revalidatePath } from 'next/cache';

export async function updatePreferences(data: PreferencesFormValues) {
  const user = await requireUser();
  const supabase = await createClient();

  const parsed = preferencesSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.flatten().fieldErrors };
  }

  // @ts-ignore
  const { error } = await supabase.from('user_preferences').update({
    ...parsed.data,
    updated_at: new Date().toISOString(),
  }).eq('user_id', user.id);

  if (error) {
    console.error('Update preferences error:', error);
    return { error: 'Failed to update preferences' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  return { success: true };
}
