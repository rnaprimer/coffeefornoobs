import React from 'react';
import { requirePreferences } from '@/lib/auth/helpers';
import { ProfileForm } from '@/components/settings/ProfileForm';
import { PreferencesForm } from '@/components/settings/PreferencesForm';
import { DeleteAccountDialog } from '@/components/settings/DeleteAccountDialog';

export const metadata = {
  title: 'Settings - CoffeeForNoobs',
  description: 'Manage your CoffeeForNoobs account settings',
};

export default async function SettingsPage() {
  const { profile: _profile, preferences: _preferences } = await requirePreferences();
  const profile = _profile as any;
  const preferences = _preferences as any;

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 mb-1 font-serif">Account Settings</h1>
        <p className="text-slate-600">Update your profile, preferences, and account settings.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">
          Public Profile
        </h2>
        <ProfileForm initialData={profile} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-slate-900 mb-6 border-b border-slate-100 pb-4">
          Coffee Preferences
        </h2>
        <PreferencesForm initialData={preferences} />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-red-600 mb-2">
          Danger Zone
        </h2>
        <p className="text-slate-600 mb-6">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <DeleteAccountDialog />
      </div>
    </div>
  );
}
