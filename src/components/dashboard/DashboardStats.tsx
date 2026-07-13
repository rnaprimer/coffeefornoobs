import { Heart, Coffee, Bookmark, ShoppingBag } from 'lucide-react';

interface DashboardStatsProps {
  totalWishlistCount: number;
  wishlistProductsCount: number;
  wishlistBeansCount: number;
  savedSetupsCount: number;
}

export function DashboardStats({
  totalWishlistCount,
  wishlistProductsCount,
  wishlistBeansCount,
  savedSetupsCount,
}: DashboardStatsProps) {
  const stats = [
    { name: 'Total Saved Items', value: totalWishlistCount, icon: Bookmark, color: 'text-blue-600', bg: 'bg-blue-50' },
    { name: 'Saved Gear', value: wishlistProductsCount, icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { name: 'Saved Beans', value: wishlistBeansCount, icon: Coffee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Saved Setups', value: savedSetupsCount, icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-6 rounded-xl border border-neutral-200 flex items-center gap-4">
          <div className={`p-3 rounded-lg ${stat.bg}`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-500">{stat.name}</p>
            <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
