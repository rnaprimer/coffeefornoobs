'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toggleWishlist } from '@/actions/wishlist';

interface WishlistContextType {
  wishlistedIds: Set<string>;
  toggleItem: (entityType: any, entityId: string) => Promise<void>;
  isLoggedIn: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ 
  children, 
  initialWishlistedIds = [],
  isLoggedIn = false
}: { 
  children: React.ReactNode;
  initialWishlistedIds?: string[];
  isLoggedIn?: boolean;
}) {
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set(initialWishlistedIds));

  const toggleItem = async (entityType: any, entityId: string) => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirectTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const wasWishlisted = wishlistedIds.has(entityId);
    
    // Optimistic UI update
    setWishlistedIds((prev) => {
      const newSet = new Set(prev);
      if (wasWishlisted) {
        newSet.delete(entityId);
      } else {
        newSet.add(entityId);
      }
      return newSet;
    });

    // Background request
    const result = await toggleWishlist(entityType, entityId, wasWishlisted);
    
    if (!result.success) {
      // Rollback on failure
      setWishlistedIds((prev) => {
        const newSet = new Set(prev);
        if (wasWishlisted) {
          newSet.add(entityId);
        } else {
          newSet.delete(entityId);
        }
        return newSet;
      });
      console.error('Failed to toggle wishlist:', result.error);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistedIds, toggleItem, isLoggedIn }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
