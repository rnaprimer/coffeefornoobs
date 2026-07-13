import React from 'react';
import { requirePreferences } from '@/lib/auth/helpers';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { ProfileCompletionWidget } from '@/components/dashboard/ProfileCompletionWidget';

export default async function DashboardPage() {
  const { user, profile: _profile, preferences: _preferences } = await requirePreferences();
  const preferences = _preferences as any;
  const profile = _profile as any;

  return (
    <div className="space-y-6">
      <DashboardWelcome user={user} profile={profile} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Quick Stats or Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Coffee Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Experience Level</p>
                <p className="font-medium text-slate-900">{preferences?.experience_level || 'Not set'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Preferred Brew</p>
                <p className="font-medium text-slate-900">{preferences?.preferred_brew_method || 'Not set'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Budget Range</p>
                <p className="font-medium text-slate-900">{preferences?.budget_range || 'Not set'}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">Roast Level</p>
                <p className="font-medium text-slate-900">{preferences?.preferred_roast_level || 'Not set'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <ProfileCompletionWidget profile={profile} preferences={preferences} />
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Account Info</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-slate-500">Email:</span> <span className="font-medium">{user.email}</span></p>
              <p><span className="text-slate-500">Last Login:</span> <span className="font-medium">{new Date(profile.last_login_at || Date.now()).toLocaleDateString()}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
