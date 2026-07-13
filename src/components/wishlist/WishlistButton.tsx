'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from './WishlistProvider';
import { useTransition } from 'react';

interface WishlistButtonProps {
  entityType: 'product' | 'bean' | 'guide' | 'comparison' | 'learn_article';
  entityId: string;
}

export function WishlistButton({ entityType, entityId }: WishlistButtonProps) {
  const { wishlistedIds, toggleItem } = useWishlist();
  const [isPending, startTransition] = useTransition();

  const isWishlisted = wishlistedIds.has(entityId);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    startTransition(() => {
      toggleItem(entityType, entityId);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 rounded-full transition-all ${
        isWishlisted 
          ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
          : 'bg-white/80 text-neutral-400 hover:text-rose-500 hover:bg-white border border-transparent hover:border-rose-100'
      }`}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={`w-5 h-5 transition-transform ${isWishlisted ? 'fill-current scale-110' : 'scale-100'}`} 
      />
    </button>
  );
}
