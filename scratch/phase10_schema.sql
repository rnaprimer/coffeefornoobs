-- Phase 10 Schema Migration: Affiliate Intelligence Platform

-- 1. Merchants Table
CREATE TABLE IF NOT EXISTS merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  favicon_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
  website TEXT,
  support_email TEXT,
  country TEXT,
  currency TEXT,
  shipping_regions TEXT[],
  return_policy_url TEXT,
  affiliate_network TEXT,
  default_commission NUMERIC(5,2),
  cookie_duration INTEGER,
  tracking_method TEXT,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Affiliate Programs Table
CREATE TABLE IF NOT EXISTS affiliate_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  affiliate_network TEXT,
  network_dashboard_url TEXT,
  commission_type TEXT,
  commission_value NUMERIC(10,2),
  cookie_duration INTEGER,
  approval_required BOOLEAN DEFAULT false,
  minimum_payout NUMERIC(10,2),
  payment_frequency TEXT,
  tracking_template TEXT,
  notes TEXT,
  program_status TEXT DEFAULT 'active' CHECK (program_status IN ('active', 'inactive', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Product Merchants Table
CREATE TABLE IF NOT EXISTS product_merchants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
  affiliate_program_id UUID REFERENCES affiliate_programs(id) ON DELETE SET NULL,
  affiliate_url TEXT NOT NULL,
  deep_link TEXT,
  merchant_product_id TEXT,
  sku TEXT,
  buy_button_text TEXT,
  current_price INTEGER,
  original_price INTEGER,
  currency TEXT,
  discount_percentage NUMERIC(5,2),
  availability TEXT DEFAULT 'In Stock' CHECK (availability IN ('In Stock', 'Limited Stock', 'Out of Stock', 'Preorder', 'Discontinued')),
  estimated_delivery TEXT,
  free_shipping BOOLEAN DEFAULT false,
  coupon_available BOOLEAN DEFAULT false,
  coupon_code TEXT,
  merchant_rating NUMERIC(3,2),
  featured BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  price_last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Price History Table
CREATE TABLE IF NOT EXISTS price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_merchant_id UUID REFERENCES product_merchants(id) ON DELETE CASCADE,
  price INTEGER,
  original_price INTEGER,
  currency TEXT,
  availability TEXT,
  change_reason TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Affiliate Clicks Table
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT,
  entity_id UUID,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
  affiliate_program_id UUID REFERENCES affiliate_programs(id) ON DELETE SET NULL,
  source_page TEXT,
  country TEXT,
  device_type TEXT,
  referrer TEXT,
  utm_source TEXT,
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Link Health Table
CREATE TABLE IF NOT EXISTS link_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_merchant_id UUID REFERENCES product_merchants(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Unknown' CHECK (status IN ('Healthy', 'Broken', 'Redirect', 'Unknown')),
  http_status INTEGER,
  response_time INTEGER,
  redirect_target TEXT,
  redirect_count INTEGER,
  ssl_valid BOOLEAN,
  last_successful_check TIMESTAMP WITH TIME ZONE,
  last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_check_at TIMESTAMP WITH TIME ZONE
);

-- Disable Row Level Security (RLS) policies by default for editing
ALTER TABLE merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_merchants DISABLE ROW LEVEL SECURITY;
ALTER TABLE price_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks DISABLE ROW LEVEL SECURITY;
ALTER TABLE link_health DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS on all new tables
ALTER TABLE merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_merchants ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_health ENABLE ROW LEVEL SECURITY;

-- Helper function role check policy integration
-- 1. Merchants Table RLS
CREATE POLICY "Public can view published merchants" ON merchants
  FOR SELECT USING (status = 'published');

CREATE POLICY "Editors and Admins can manage merchants" ON merchants
  FOR ALL USING (get_user_role() IN ('editor', 'admin'));

-- 2. Affiliate Programs RLS
CREATE POLICY "Public can view affiliate programs" ON affiliate_programs
  FOR SELECT USING (true);

CREATE POLICY "Editors and Admins can manage affiliate programs" ON affiliate_programs
  FOR ALL USING (get_user_role() IN ('editor', 'admin'));

-- 3. Product Merchants RLS
CREATE POLICY "Public can view active product merchants" ON product_merchants
  FOR SELECT USING (status = 'active');

CREATE POLICY "Editors and Admins can manage product merchants" ON product_merchants
  FOR ALL USING (get_user_role() IN ('editor', 'admin'));

-- 4. Price History RLS
CREATE POLICY "Public can view price history" ON price_history
  FOR SELECT USING (true);

CREATE POLICY "Editors and Admins can manage price history" ON price_history
  FOR ALL USING (get_user_role() IN ('editor', 'admin'));

-- 5. Affiliate Clicks RLS (Select only for editors, insert only for public/anyone)
CREATE POLICY "Anyone can insert affiliate clicks" ON affiliate_clicks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Editors and Admins can view clicks" ON affiliate_clicks
  FOR SELECT USING (get_user_role() IN ('editor', 'admin'));

-- 6. Link Health RLS
CREATE POLICY "Public can view link health" ON link_health
  FOR SELECT USING (true);

CREATE POLICY "Editors and Admins can manage link health" ON link_health
  FOR ALL USING (get_user_role() IN ('editor', 'admin'));

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_merchants_slug ON merchants(slug);
CREATE INDEX IF NOT EXISTS idx_merchants_status ON merchants(status);
CREATE INDEX IF NOT EXISTS idx_product_merchants_product ON product_merchants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_merchants_merchant ON product_merchants(merchant_id);
CREATE INDEX IF NOT EXISTS idx_product_merchants_status ON product_merchants(status);
CREATE INDEX IF NOT EXISTS idx_price_history_pm ON price_history(product_merchant_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_pm ON affiliate_clicks(merchant_id, product_id);
CREATE INDEX IF NOT EXISTS idx_link_health_pm ON link_health(product_merchant_id);
