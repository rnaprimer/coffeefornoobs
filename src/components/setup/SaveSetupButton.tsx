'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { SaveSetupModal } from './SaveSetupModal';
import { useWishlist } from '@/components/wishlist/WishlistProvider';

interface SaveSetupButtonProps {
  setupConfiguration: any;
  budget?: number;
  className?: string;
}

export function SaveSetupButton({ setupConfiguration, budget, className = '' }: SaveSetupButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isLoggedIn } = useWishlist(); // Use this to check login status easily

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors ${className}`}
      >
        <Bookmark className="w-4 h-4" />
        Save Setup
      </button>

      <SaveSetupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setupConfiguration={setupConfiguration}
        budget={budget}
        isLoggedIn={isLoggedIn}
      />
    </>
  );
}
