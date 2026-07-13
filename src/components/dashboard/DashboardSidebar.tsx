'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Settings, Heart, Bookmark, LogOut, X } from 'lucide-react';
import { logout } from '@/actions/auth';

interface DashboardSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function DashboardSidebar({ isOpen, setIsOpen }: DashboardSidebarProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Wishlist', href: '#', icon: Heart, disabled: true },
    { name: 'Saved Setups', href: '#', icon: Bookmark, disabled: true },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200">
            <Link href="/" className="text-xl font-bold text-amber-900 font-serif">
              CoffeeForNoobs
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 text-slate-500 hover:text-slate-700 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              if (item.disabled) {
                return (
                  <div key={item.name} className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-slate-400 cursor-not-allowed group">
                    <Icon size={20} className="mr-3 flex-shrink-0 text-slate-300" />
                    <span className="flex-1">{item.name}</span>
                    <span className="text-[10px] uppercase tracking-wider font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Soon</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors
                    ${isActive 
                      ? 'bg-amber-50 text-amber-900' 
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon 
                    size={20} 
                    className={`mr-3 flex-shrink-0 ${isActive ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-500'}`} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} className="mr-3 flex-shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
