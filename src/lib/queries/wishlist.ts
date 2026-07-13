import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth/helpers';

export async function getWishlist() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await (supabase as any)
    .from('user_wishlist')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }

  return data;
}

export async function getWishlistedIds() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await (supabase as any)
    .from('user_wishlist')
    .select('entity_id')
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching wishlisted ids:', error);
    return [];
  }

  return data.map((row: any) => row.entity_id);
}

export async function getWishlistCount() {
  const user = await getCurrentUser();
  if (!user) return 0;

  const supabase = await createClient();
  if (!supabase) return 0;

  const { count, error } = await (supabase as any)
    .from('user_wishlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching wishlist count:', error);
    return 0;
  }

  return count || 0;
}

export async function getWishlistProducts() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await (supabase as any)
    .from('user_wishlist')
    .select('*, product:products(*)')
    .eq('user_id', user.id)
    .eq('entity_type', 'product')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist products:', error);
    return [];
  }

  return data.map((item: any) => ({ ...item, data: item.product })) as any[];
}

export async function getWishlistBeans() {
  const user = await getCurrentUser();
  if (!user) return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await (supabase as any)
    .from('user_wishlist')
    .select('*, bean:beans(*)')
    .eq('user_id', user.id)
    .eq('entity_type', 'bean')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching wishlist beans:', error);
    return [];
  }

  return data.map((item: any) => ({ ...item, data: item.bean })) as any[];
}

export async function isWishlisted(entityType: string, entityId: string) {
  const user = await getCurrentUser();
  if (!user) return false;

  const supabase = await createClient();
  if (!supabase) return false;

  const { count, error } = await (supabase as any)
    .from('user_wishlist')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('entity_type', entityType)
    .eq('entity_id', entityId);

  if (error) {
    console.error('Error checking wishlist status:', error);
    return false;
  }

  return (count && count > 0) ? true : false;
}
