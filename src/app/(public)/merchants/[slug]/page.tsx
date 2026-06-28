import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  if (!supabase) return { title: 'Merchant' };

  const { data } = await (supabase as any).from('merchants').select('name').eq('slug', slug).single();
  return {
    title: data ? `${data.name} Coffee Catalog - CoffeeForNoobs` : 'Merchant Not Found',
  };
}

export default async function MerchantProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  if (!supabase) {
    return <div className="py-20 text-center">Supabase is not configured.</div>;
  }

  // Fetch merchant profile
  const { data: merchant } = await (supabase as any)
    .from('merchants')
    .select('*, media:logo_media_id(url)')
    .eq('slug', slug)
    .single();

  if (!merchant) {
    notFound();
  }

  // Fetch product relationships for this merchant
  const { data: productsData } = await (supabase as any)
    .from('product_merchants')
    .select('*, products(*, brands(name))')
    .eq('merchant_id', merchant.id)
    .eq('status', 'active');

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row items-center gap-8 border-b border-brand-dark pb-8 mb-10">
        <div className="w-32 h-32 relative bg-gray-50 border border-brand-dark rounded-xl flex items-center justify-center p-4">
          {merchant.media?.url ? (
            <Image src={merchant.media.url} alt={merchant.name} fill className="object-contain p-2" />
          ) : (
            <span className="font-bold text-gray-400 text-3xl">{merchant.name.charAt(0)}</span>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl font-black uppercase tracking-tight mb-2">{merchant.name}</h1>
          <p className="text-gray-600 max-w-2xl mb-4">{merchant.description || 'Merchant partner catalog.'}</p>
          {merchant.website && (
            <a href={merchant.website} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-amber-600 hover:underline">
              Visit Retailer Website →
            </a>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-black uppercase tracking-tight mb-6">Available Products</h2>

      {(!productsData || productsData.length === 0) ? (
        <p className="text-gray-500 py-10">No products mapped to this merchant yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {productsData.map((item: any) => {
            const prod = item.products;
            if (!prod) return null;

            return (
              <div key={item.id} className="border border-brand-dark rounded-xl p-4 flex flex-col justify-between bg-white">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{prod.brands?.name || 'Brand'}</div>
                  <h3 className="font-black text-lg mb-2 line-clamp-1">{prod.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="font-black text-amber-600">{item.currency || '₹'} {item.current_price}</span>
                    {item.original_price && item.original_price > item.current_price && (
                      <span className="text-xs text-gray-400 line-through">{item.currency || '₹'} {item.original_price}</span>
                    )}
                  </div>
                </div>
                <Link href={`/gear/${prod.slug}`} className="block text-center bg-brand-dark text-white font-bold text-xs uppercase tracking-widest py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  View Product Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
