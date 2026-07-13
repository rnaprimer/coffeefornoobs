import Link from 'next/link';
import { Settings2, ShoppingBag, Coffee, ArrowRight } from 'lucide-react';

interface QuickActionsProps {
  recentSetupId?: string;
}

export function QuickActions({ recentSetupId }: QuickActionsProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
      <div className="p-5 border-b border-neutral-100">
        <h2 className="text-lg font-bold text-neutral-900">Quick Actions</h2>
      </div>
      <div className="divide-y divide-neutral-100">
        <Link 
          href={recentSetupId ? `/setup-builder?load=${recentSetupId}` : '/setup-builder'}
          className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">
                {recentSetupId ? 'Continue Building Setup' : 'Start Setup Builder'}
              </p>
              <p className="text-sm text-neutral-500">
                {recentSetupId ? 'Pick up where you left off' : 'Find your perfect gear match'}
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
        </Link>
        
        <Link 
          href="/gear"
          className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">Browse Gear</p>
              <p className="text-sm text-neutral-500">Explore espresso machines, grinders, and more</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
        </Link>
        
        <Link 
          href="/beans"
          className="flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <p className="font-medium text-neutral-900">Discover Beans</p>
              <p className="text-sm text-neutral-500">Find the perfect coffee beans for your taste</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>
    </div>
  );
}
