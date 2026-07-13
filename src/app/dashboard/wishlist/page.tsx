import { Metadata } from 'next';
import { getWishlistProducts, getWishlistBeans } from '@/lib/queries/wishlist';
import { WishlistGrid } from '@/components/wishlist/WishlistGrid';

export const metadata: Metadata = {
  title: 'My Wishlist | CoffeeForNoobs',
  description: 'View your saved coffee gear and beans.',
};

export default async function WishlistPage() {
  // Fetch products and beans in parallel
  const [products, beans] = await Promise.all([
    getWishlistProducts(),
    getWishlistBeans(),
  ]);

  // Combine and sort by created_at descending
  const allItems = [...products, ...beans].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">My Wishlist</h1>
        <p className="text-neutral-500 mt-1">
          Items you've saved for later.
        </p>
      </div>

      <WishlistGrid items={allItems} />
    </div>
  );
}
