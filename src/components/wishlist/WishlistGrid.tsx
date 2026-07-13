import { WishlistCard } from './WishlistCard';

interface WishlistGridProps {
  items: any[];
}

export function WishlistGrid({ items }: WishlistGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-xl border border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">Your wishlist is empty</h3>
        <p className="text-neutral-500 max-w-sm mx-auto">
          Start exploring gear and beans, and click the heart icon to save items here for later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <WishlistCard key={item.id} item={item} />
      ))}
    </div>
  );
}
