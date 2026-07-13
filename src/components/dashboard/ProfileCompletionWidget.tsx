'use client';

import React from 'react';
import Link from 'next/link';

interface ProfileCompletionWidgetProps {
  profile: any;
  preferences: any;
}

export function ProfileCompletionWidget({ profile: _profile, preferences: _preferences }: ProfileCompletionWidgetProps) {
  const profile = _profile as any;
  const preferences = _preferences as any;
  // Calculate completion percentage
  let completedFields = 0;
  let totalFields = 6;

  if (profile?.display_name) completedFields++;
  if (profile?.avatar_url || profile?.avatar_media_id) completedFields++;
  
  if (preferences?.experience_level) completedFields++;
  if (preferences?.preferred_brew_method) completedFields++;
  if (preferences?.budget_range) completedFields++;
  if (preferences?.preferred_roast_level) completedFields++;

  const percentage = Math.round((completedFields / totalFields) * 100);

  if (percentage === 100) {
    return null; // Don't show if 100%
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">Profile Completion</h3>
      <p className="text-sm text-slate-600 mb-4">
        Complete your profile to get better recommendations.
      </p>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-1 bg-slate-100 rounded-full h-2.5">
          <div 
            className="bg-amber-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="text-sm font-medium text-slate-700">{percentage}%</span>
      </div>

      <Link 
        href="/dashboard/settings"
        className="inline-flex items-center text-sm font-medium text-amber-600 hover:text-amber-500"
      >
        Complete Profile &rarr;
      </Link>
    </div>
  );
}
