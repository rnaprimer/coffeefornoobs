'use server';

import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth/helpers';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';
import { revalidatePath } from 'next/cache';

export async function updateProfile(data: ProfileFormValues) {
  const user = await requireUser();
  const supabase = await createClient();

  const parsed = profileSchema.safeParse(data);
  if (!parsed.success) {
    return { error: 'Invalid data', details: parsed.error.flatten().fieldErrors };
  }

  const { display_name, avatar_media_id } = parsed.data;

  // @ts-ignore
  const { error } = await supabase.from('profiles').update({
    display_name,
    avatar_media_id,
    updated_at: new Date().toISOString(),
  }).eq('id', user.id);

  if (error) {
    console.error('Update profile error:', error);
    return { error: 'Failed to update profile' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  return { success: true };
}
