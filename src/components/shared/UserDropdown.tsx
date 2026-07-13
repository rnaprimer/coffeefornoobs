'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { UserAvatar } from './UserAvatar';
import { Settings, LogOut, LayoutDashboard } from 'lucide-react';
import { logout } from '@/actions/auth';

interface UserDropdownProps {
  user: any;
  profile: any | null;
}

export function UserDropdown({ user, profile }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <UserAvatar 
          avatarUrl={profile?.avatar_url} 
          name={profile?.display_name || user.email} 
          size={36} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-slate-100 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900 truncate">
              {profile?.display_name || user.email.split('@')[0]}
            </p>
            <p className="text-xs text-slate-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <Link 
              href="/dashboard" 
              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <LayoutDashboard size={16} className="mr-2 text-slate-400" />
              Dashboard
            </Link>
            <Link 
              href="/dashboard/settings" 
              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} className="mr-2 text-slate-400" />
              Settings
            </Link>
          </div>
          <div className="border-t border-slate-100 py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
