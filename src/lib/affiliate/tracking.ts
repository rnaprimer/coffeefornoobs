import { createClient } from '@supabase/supabase-js';

// We'll pass standard Supabase client, but define type loosely to avoid strict imports on Server vs Client.
export interface ClickTrackingParams {
  entity_type?: 'product' | 'bean' | 'guide';
  entity_id?: string;
  product_id?: string;
  merchant_id?: string;
  affiliate_program_id?: string;
  source_page?: string;
  country?: string;
  device_type?: string;
  referrer?: string;
  utm_source?: string;
}

/**
 * Tracks an affiliate click anonymously.
 * Never stores IP or personal identifiers to comply with privacy best practices.
 */
export async function trackAffiliateClick(supabase: any, params: ClickTrackingParams) {
  try {
    const { error } = await supabase.from('affiliate_clicks').insert({
      entity_type: params.entity_type || 'product',
      entity_id: params.entity_id,
      product_id: params.product_id,
      merchant_id: params.merchant_id,
      affiliate_program_id: params.affiliate_program_id,
      source_page: params.source_page,
      country: params.country || 'IN',
      device_type: params.device_type || 'desktop',
      referrer: params.referrer,
      utm_source: params.utm_source,
      clicked_at: new Date().toISOString()
    });

    if (error) {
      console.error('Failed to log affiliate click:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error logging click event:', err);
    return false;
  }
}
