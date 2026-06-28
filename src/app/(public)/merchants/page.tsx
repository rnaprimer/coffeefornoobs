import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Our Retail Partners - CoffeeForNoobs',
  description: 'Browse products and coffee gear from our trusted merchant partners.',
};

export const dynamic = 'force-dynamic';

export default async function PublicMerchantsPage() {
  const supabase = await createClient();
  
  if (!supabase) {
    return <div className="py-20 text-center">Supabase is not configured.</div>;
  }

  const { data: merchants } = await (supabase as any)
    .from('merchants')
    .select('*, media:logo_media_id(url)')
    .eq('status', 'published')
    .order('priority', { ascending: false });

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Our Retail Partners</h1>
      <p className="text-gray-600 mb-10 max-w-xl">We partner with top coffee roasters and equipment retailers to find you the best prices and availability.</p>

      {(!merchants || merchants.length === 0) ? (
        <p className="text-gray-500 py-10">No merchant partners listed yet. Check back soon!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {merchants.map((m: any) => (
            <Link key={m.id} href={`/merchants/${m.slug}`} className="block border border-brand-dark p-6 rounded-xl hover:bg-gray-50 transition-all">
              <div className="h-16 w-full relative mb-4 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                {m.media?.url ? (
                  <Image src={m.media.url} alt={m.name} fill className="object-contain p-2" />
                ) : (
                  <span className="font-bold text-gray-400">{m.name}</span>
                )}
              </div>
              <h2 className="font-black text-xl mb-1 uppercase tracking-tight">{m.name}</h2>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4">{m.description || 'No description provided.'}</p>
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">View Catalog →</span>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
