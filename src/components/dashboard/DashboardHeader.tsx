'use client';

import React from 'react';
import { Menu } from 'lucide-react';
import { UserDropdown } from '@/components/shared/UserDropdown';

interface DashboardHeaderProps {
  setSidebarOpen: (isOpen: boolean) => void;
  user: any;
  profile: any;
}

export function DashboardHeader({ setSidebarOpen, user, profile }: DashboardHeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200 z-10">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 mr-2 text-slate-500 hover:text-slate-700 focus:outline-none"
          >
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex-1" />
        
        <div className="flex items-center space-x-4">
          <UserDropdown user={user} profile={profile} />
        </div>
      </div>
    </header>
  );
}
