import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { trackAffiliateClick, resolveAffiliateLink } from '@/lib/affiliate';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ merchant: string; product: string }> }
) {
  const { merchant, product } = await params;
  const supabase = await createClient();
  
  if (!supabase) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Fetch product and merchant records to get IDs
  const { data: merchantData } = await (supabase as any)
    .from('merchants')
    .select('id')
    .eq('slug', merchant)
    .single();

  const { data: productData } = await (supabase as any)
    .from('products')
    .select('id')
    .eq('slug', product)
    .single();

  if (!merchantData || !productData) {
    console.error('Redirect failed: merchant or product not found');
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Fetch the specific product_merchant relationship
  const { data: pm, error } = await (supabase as any)
    .from('product_merchants')
    .select('*, merchants(*), affiliate_programs(*)')
    .eq('merchant_id', merchantData.id)
    .eq('product_id', productData.id)
    .eq('status', 'active')
    .single();

  if (error || !pm) {
    console.error('Redirect failed: active product merchant link not found', error);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Parse request headers/context for anonymous tracking
  const userAgent = request.headers.get('user-agent') || '';
  const referrer = request.headers.get('referer') || '';
  const deviceType = /mobile/i.test(userAgent) ? 'mobile' : /tablet/i.test(userAgent) ? 'tablet' : 'desktop';
  
  const { searchParams } = new URL(request.url);
  const utmSource = searchParams.get('utm_source') || 'coffeefornoobs_direct';

  // Perform anonymous click logging
  await trackAffiliateClick(supabase, {
    entity_type: 'product',
    entity_id: pm.product_id,
    product_id: pm.product_id,
    merchant_id: pm.merchant_id,
    affiliate_program_id: pm.affiliate_program_id || undefined,
    source_page: referrer || undefined,
    device_type: deviceType,
    referrer: referrer || undefined,
    utm_source: utmSource
  });

  // Resolve target link (normalizes deep_link or affiliate_url and applies program templates)
  const targetUrl = resolveAffiliateLink(pm, utmSource);

  return NextResponse.redirect(new URL(targetUrl));
}
