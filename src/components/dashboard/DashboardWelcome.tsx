import React from 'react';
import { UserAvatar } from '@/components/shared/UserAvatar';

interface DashboardWelcomeProps {
  user: any;
  profile: any;
}

export function DashboardWelcome({ user, profile }: DashboardWelcomeProps) {
  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Coffee Lover';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center space-x-6">
      <UserAvatar 
        avatarUrl={profile?.avatar_url} 
        name={displayName} 
        size={80} 
      />
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-serif">
          Welcome back, {displayName}!
        </h2>
        <p className="text-slate-600 mt-1">
          Ready for your next brew?
        </p>
      </div>
    </div>
  );
}
