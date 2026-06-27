'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateHomepageSettings(data: any) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase client not found' };

  const anySupabase: any = supabase;
  const { error } = await anySupabase
    .from('homepage_settings')
    .update(data)
    .eq('id', 1);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/homepage');
  return { success: true };
}

export async function updateHomepageSection(id: string, data: any) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase client not found' };

  const anySupabase: any = supabase;
  const { error } = await anySupabase
    .from('homepage_sections')
    .update(data)
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath('/');
  revalidatePath('/admin/homepage');
  return { success: true };
}

export async function updateHomepageSectionItems(sectionId: string, items: { entity_type: string, entity_id: string, display_order: number }[]) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase client not found' };

  // 1. Delete existing items for this section
  const anySupabase: any = supabase;
  const { error: deleteError } = await anySupabase
    .from('homepage_section_items')
    .delete()
    .eq('homepage_section_id', sectionId);

  if (deleteError) {
    return { success: false, error: deleteError.message };
  }

  // 2. Insert new items if any
  if (items && items.length > 0) {
    const insertData = items.map(item => ({
      ...item,
      homepage_section_id: sectionId
    }));

    const { error: insertError } = await anySupabase
      .from('homepage_section_items')
      .insert(insertData);

    if (insertError) {
      return { success: false, error: insertError.message };
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/homepage');
  return { success: true };
}
