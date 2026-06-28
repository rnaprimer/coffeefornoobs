'use server'

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { calculateDiscount } from '@/lib/affiliate/pricing';

/**
 * ----------------------------------------------------
 * MERCHANTS ACTIONS
 * ----------------------------------------------------
 */

export async function createMerchant(data: any) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: result, error } = await (supabase as any)
    .from('merchants')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating merchant:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/merchants');
  return { success: true, data: result };
}

export async function updateMerchant(id: string, data: any) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: result, error } = await (supabase as any)
    .from('merchants')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating merchant:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/merchants');
  revalidatePath(`/merchants/${result.slug}`);
  return { success: true, data: result };
}

export async function deleteMerchant(id: string) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await (supabase as any)
    .from('merchants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting merchant:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/merchants');
  return { success: true };
}

/**
 * ----------------------------------------------------
 * AFFILIATE PROGRAMS ACTIONS
 * ----------------------------------------------------
 */

export async function createAffiliateProgram(data: any) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: result, error } = await (supabase as any)
    .from('affiliate_programs')
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error('Error creating program:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/affiliate-programs');
  return { success: true, data: result };
}

export async function updateAffiliateProgram(id: string, data: any) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { data: result, error } = await (supabase as any)
    .from('affiliate_programs')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating program:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/affiliate-programs');
  return { success: true, data: result };
}

export async function deleteAffiliateProgram(id: string) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  const { error } = await (supabase as any)
    .from('affiliate_programs')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting program:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/affiliate-programs');
  return { success: true };
}

/**
 * ----------------------------------------------------
 * PRODUCT MERCHANT RELATIONSHIP ACTIONS
 * ----------------------------------------------------
 */

export async function assignMerchantToProduct(data: any) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Calculate discount percentage
  const { discountPercentage } = calculateDiscount(data.current_price, data.original_price);
  
  const insertData = {
    ...data,
    discount_percentage: discountPercentage,
    price_last_updated_at: new Date().toISOString(),
    last_verified_at: new Date().toISOString(),
  };

  const { data: result, error } = await (supabase as any)
    .from('product_merchants')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error assigning merchant to product:', error);
    return { success: false, error: error.message };
  }

  // Create initial price history log
  if (data.current_price !== undefined || data.original_price !== undefined) {
    await (supabase as any).from('price_history').insert({
      product_merchant_id: result.id,
      price: result.current_price,
      original_price: result.original_price,
      currency: result.currency,
      availability: result.availability,
      change_reason: 'Initial setup'
    });
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${data.product_id}`);
  return { success: true, data: result };
}

export async function updateProductMerchant(id: string, data: any) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Fetch current record to check for price/availability changes
  const { data: currentRecord } = await (supabase as any)
    .from('product_merchants')
    .select('current_price, original_price, currency, availability')
    .eq('id', id)
    .single();

  // Calculate discount percentage
  const { discountPercentage } = calculateDiscount(data.current_price, data.original_price);
  
  const updateData = {
    ...data,
    discount_percentage: discountPercentage,
    updated_at: new Date().toISOString()
  };

  const priceChanged = currentRecord && (
    (currentRecord as any).current_price !== data.current_price ||
    (currentRecord as any).original_price !== data.original_price ||
    (currentRecord as any).availability !== data.availability
  );

  if (priceChanged) {
    updateData.price_last_updated_at = new Date().toISOString();
  }
  updateData.last_verified_at = new Date().toISOString();

  const { data: result, error } = await (supabase as any)
    .from('product_merchants')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating product merchant:', error);
    return { success: false, error: error.message };
  }

  // Record price history if changes occurred
  if (priceChanged) {
    await (supabase as any).from('price_history').insert({
      product_merchant_id: id,
      price: (result as any).current_price,
      original_price: (result as any).original_price,
      currency: (result as any).currency,
      availability: (result as any).availability,
      change_reason: 'Manual edit'
    });
  }

  revalidatePath('/admin/products');
  revalidatePath(`/admin/products/${(result as any).product_id}`);
  return { success: true, data: result };
}

export async function deleteProductMerchant(id: string) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Supabase is not configured' };

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthorized' };

  // Fetch record for path revalidation
  const { data: pm } = await (supabase as any)
    .from('product_merchants')
    .select('product_id')
    .eq('id', id)
    .single();

  const { error } = await (supabase as any)
    .from('product_merchants')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product merchant:', error);
    return { success: false, error: error.message };
  }

  if (pm) {
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${(pm as any).product_id}`);
  }
  return { success: true };
}
