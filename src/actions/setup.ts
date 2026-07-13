'use server';

import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth/helpers';
import { saveSetupSchema, updateSetupSchema } from '@/lib/validations/setup';
import { revalidatePath } from 'next/cache';

export async function saveSetup(formData: any) {
  try {
    const user = await requireUser();
    
    // Validate
    const data = saveSetupSchema.parse(formData);

    const supabase = await createClient();
    if (!supabase) throw new Error('Database client error');

    const { data: setup, error } = await (supabase as any)
      .from('saved_setups')
      .insert({
        user_id: user.id,
        title: data.title,
        notes: data.notes || null,
        favorite: data.favorite,
        budget: data.budget || null,
        setup_configuration: data.setup_configuration,
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/setups');
    return { success: true, setupId: setup.id };
  } catch (error: any) {
    console.error('Error saving setup:', error);
    return { success: false, error: error.message || 'Failed to save setup' };
  }
}

export async function updateSetup(id: string, formData: any) {
  try {
    const user = await requireUser();
    
    // Validate
    const data = updateSetupSchema.parse(formData);

    const supabase = await createClient();
    if (!supabase) throw new Error('Database client error');

    const { error } = await (supabase as any)
      .from('saved_setups')
      .update({
        ...data,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/setups');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating setup:', error);
    return { success: false, error: error.message || 'Failed to update setup' };
  }
}

export async function duplicateSetup(id: string) {
  try {
    const user = await requireUser();

    const supabase = await createClient();
    if (!supabase) throw new Error('Database client error');

    // Fetch original setup
    const { data: original, error: fetchError } = await (supabase as any)
      .from('saved_setups')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !original) throw fetchError || new Error('Setup not found');

    // Duplicate
    const { data: newSetup, error: insertError } = await (supabase as any)
      .from('saved_setups')
      .insert({
        user_id: user.id,
        title: `${original.title} (Copy)`,
        notes: original.notes,
        favorite: false, // Don't copy favorite status
        budget: original.budget,
        setup_configuration: original.setup_configuration,
        thumbnail_media_id: original.thumbnail_media_id,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/setups');
    return { success: true, setupId: newSetup.id };
  } catch (error: any) {
    console.error('Error duplicating setup:', error);
    return { success: false, error: error.message || 'Failed to duplicate setup' };
  }
}

export async function deleteSetup(id: string) {
  try {
    const user = await requireUser();

    const supabase = await createClient();
    if (!supabase) throw new Error('Database client error');

    const { error } = await (supabase as any)
      .from('saved_setups')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/setups');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting setup:', error);
    return { success: false, error: error.message || 'Failed to delete setup' };
  }
}
