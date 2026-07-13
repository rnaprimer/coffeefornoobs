import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}

export function UserAvatar({ avatarUrl, name, size = 40, className = '' }: UserAvatarProps) {
  const getInitials = (name?: string | null) => {
    if (!name) return '';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold overflow-hidden ${className}`}
      style={{ width: size, height: size, minWidth: size, minHeight: size }}
    >
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={name || 'User avatar'} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : initials ? (
        <span style={{ fontSize: size * 0.4 }}>{initials}</span>
      ) : (
        <User size={size * 0.6} className="text-slate-500" />
      )}
    </div>
  );
}
