export interface Merchant {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_media_id?: string;
  favicon_media_id?: string;
  website?: string;
  support_email?: string;
  country?: string;
  currency?: string;
  shipping_regions?: string[];
  return_policy_url?: string;
  affiliate_network?: string;
  default_commission?: number;
  cookie_duration?: number;
  tracking_method?: string;
  featured: boolean;
  display_order: number;
  priority: number;
  seo_title?: string;
  seo_description?: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface AffiliateProgram {
  id: string;
  merchant_id: string;
  program_name: string;
  affiliate_network?: string;
  network_dashboard_url?: string;
  commission_type?: string;
  commission_value?: number;
  cookie_duration?: number;
  approval_required: boolean;
  minimum_payout?: number;
  payment_frequency?: string;
  tracking_template?: string;
  notes?: string;
  program_status: 'active' | 'inactive' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface ProductMerchant {
  id: string;
  product_id: string;
  merchant_id: string;
  affiliate_program_id?: string;
  affiliate_url: string;
  deep_link?: string;
  merchant_product_id?: string;
  sku?: string;
  buy_button_text?: string;
  current_price?: number;
  original_price?: number;
  currency?: string;
  discount_percentage?: number;
  availability: 'In Stock' | 'Limited Stock' | 'Out of Stock' | 'Preorder' | 'Discontinued';
  estimated_delivery?: string;
  free_shipping: boolean;
  coupon_available: boolean;
  coupon_code?: string;
  merchant_rating?: number;
  featured: boolean;
  priority: number;
  status: 'active' | 'inactive';
  price_last_updated_at: string;
  last_verified_at: string;
  created_at: string;
  updated_at: string;

  // Joined fields for query ease
  merchants?: Partial<Merchant>;
  affiliate_programs?: Partial<AffiliateProgram>;
}

export interface PriceHistory {
  id: string;
  product_merchant_id: string;
  price?: number;
  original_price?: number;
  currency?: string;
  availability?: string;
  change_reason?: string;
  recorded_at: string;
}

export interface AffiliateClick {
  id: string;
  entity_type?: string;
  entity_id?: string;
  product_id?: string;
  merchant_id?: string;
  affiliate_program_id?: string;
  source_page?: string;
  country?: string;
  device_type?: string;
  referrer?: string;
  utm_source?: string;
  clicked_at: string;
}

export interface LinkHealth {
  id: string;
  product_merchant_id: string;
  status: 'Healthy' | 'Broken' | 'Redirect' | 'Unknown';
  http_status?: number;
  response_time?: number;
  redirect_target?: string;
  redirect_count?: number;
  ssl_valid?: boolean;
  last_successful_check?: string;
  last_checked_at: string;
  next_check_at?: string;
}
