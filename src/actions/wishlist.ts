'use server';

import { createClient } from '@/lib/supabase/server';
import { requireUser } from '@/lib/auth/helpers';
import { wishlistSchema } from '@/lib/validations/wishlist';
import { revalidatePath } from 'next/cache';

export async function addToWishlist(entityType: string, entityId: string) {
  try {
    const user = await requireUser();
    
    // Validate
    const data = wishlistSchema.parse({ entity_type: entityType, entity_id: entityId });

    const supabase = await createClient();
    if (!supabase) throw new Error('Database client error');

    const { error } = await (supabase as any)
      .from('user_wishlist')
      .insert({
        user_id: user.id,
        entity_type: data.entity_type,
        entity_id: data.entity_id,
      });

    if (error) {
      if (error.code === '23505') {
        // Unique violation - already wishlisted
        return { success: true };
      }
      throw error;
    }

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/wishlist');
    return { success: true };
  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: error.message || 'Failed to add to wishlist' };
  }
}

export async function removeFromWishlist(entityType: string, entityId: string) {
  try {
    const user = await requireUser();
    
    // Validate
    const data = wishlistSchema.parse({ entity_type: entityType, entity_id: entityId });

    const supabase = await createClient();
    if (!supabase) throw new Error('Database client error');

    const { error } = await (supabase as any)
      .from('user_wishlist')
      .delete()
      .eq('user_id', user.id)
      .eq('entity_type', data.entity_type)
      .eq('entity_id', data.entity_id);

    if (error) throw error;

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/wishlist');
    return { success: true };
  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    return { success: false, error: error.message || 'Failed to remove from wishlist' };
  }
}

export async function toggleWishlist(entityType: string, entityId: string, currentStatus: boolean) {
  if (currentStatus) {
    return removeFromWishlist(entityType, entityId);
  } else {
    return addToWishlist(entityType, entityId);
  }
}
