import { Metadata } from 'next';
import { requireProfile, requirePreferences } from '@/lib/auth/helpers';
import { getWishlistCount, getWishlistProducts, getWishlistBeans } from '@/lib/queries/wishlist';
import { getSavedSetups, getRecentSetup } from '@/lib/queries/setup';

import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { WishlistGrid } from '@/components/wishlist/WishlistGrid';
import { SavedSetupCard } from '@/components/setup/SavedSetupCard';
import { EmptyDashboard } from '@/components/dashboard/EmptyDashboard';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Dashboard | CoffeeForNoobs',
  description: 'Manage your coffee profile and preferences.',
};

export default async function DashboardPage() {
  const [
    { user, profile: userProfile }, 
    preferences, 
    totalWishlistCount, 
    wishlistProducts, 
    wishlistBeans, 
    savedSetups, 
    recentSetup
  ] = await Promise.all([
    requireProfile(),
    requirePreferences(),
    getWishlistCount(),
    getWishlistProducts(),
    getWishlistBeans(),
    getSavedSetups(),
    getRecentSetup()
  ]);

  const recentWishlistItems = [...wishlistProducts, ...wishlistBeans]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4);

  const hasActivity = totalWishlistCount > 0 || savedSetups.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase text-neutral-900">
          Welcome back, {(userProfile as any)?.full_name?.split(' ')[0] || (userProfile as any)?.display_name || 'Coffee Lover'}!
        </h1>
        <p className="mt-2 text-neutral-600">Here's what's happening with your coffee journey.</p>
      </div>

      {hasActivity ? (
        <>
          <DashboardStats 
            totalWishlistCount={totalWishlistCount}
            wishlistProductsCount={wishlistProducts.length}
            wishlistBeansCount={wishlistBeans.length}
            savedSetupsCount={savedSetups.length}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* Recent Saved Setup */}
              {recentSetup && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-neutral-900">Recent Setup</h2>
                    <Link href="/dashboard/setups" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                      View All
                    </Link>
                  </div>
                  <SavedSetupCard setup={recentSetup} />
                </section>
              )}

              {/* Recent Wishlist Items */}
              {recentWishlistItems.length > 0 && (
                <section>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-neutral-900">Recently Saved</h2>
                    <Link href="/dashboard/wishlist" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                      View All
                    </Link>
                  </div>
                  <WishlistGrid items={recentWishlistItems} />
                </section>
              )}
            </div>

            <div className="space-y-8">
              <QuickActions recentSetupId={recentSetup?.id} />
            </div>
          </div>
        </>
      ) : (
        <EmptyDashboard />
      )}
    </div>
  );
}
