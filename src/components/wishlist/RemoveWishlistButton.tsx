'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { removeFromWishlist } from '@/actions/wishlist';

interface RemoveWishlistButtonProps {
  entityType: 'product' | 'bean' | 'guide' | 'comparison' | 'learn_article';
  entityId: string;
}

export function RemoveWishlistButton({ entityType, entityId }: RemoveWishlistButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromWishlist(entityType, entityId);
      if (!result.success) {
        console.error('Failed to remove from wishlist:', result.error);
      }
    });
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleRemove();
      }}
      disabled={isPending}
      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
      aria-label="Remove from wishlist"
      title="Remove from wishlist"
    >
      <Trash2 className="w-5 h-5" />
    </button>
  );
}
