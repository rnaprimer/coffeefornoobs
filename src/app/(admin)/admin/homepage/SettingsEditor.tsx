'use client';

import React, { useState } from 'react';
import { HomepageData, HomepageSettings } from '@/types/homepage';
import { updateHomepageSettings } from '../actions/homepage';
import { MediaPicker } from '@/components/admin/media/MediaPicker';
import { Save } from 'lucide-react';

interface SettingsEditorProps {
  settings: HomepageSettings;
}

export default function SettingsEditor({ settings }: SettingsEditorProps) {
  const [formData, setFormData] = useState<Partial<HomepageSettings>>({
    meta_title: settings.meta_title || '',
    meta_description: settings.meta_description || '',
    canonical_url: settings.canonical_url || '',
    og_media_id: settings.og_media_id || null,
    announcement_enabled: settings.announcement_enabled || false,
    announcement_text: settings.announcement_text || '',
    announcement_button: settings.announcement_button || '',
    announcement_url: settings.announcement_url || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateHomepageSettings(formData);
      alert('Settings saved successfully!');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold uppercase tracking-tight">SEO & Announcement</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-lime text-brand-dark font-bold text-sm uppercase hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <h3 className="font-bold text-lg border-b-2 border-brand-dark pb-2">SEO Details</h3>
        
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase">Meta Title</label>
          <input
            type="text"
            className="w-full border-2 border-brand-dark p-3 outline-none"
            value={formData.meta_title || ''}
            onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase">Meta Description</label>
          <textarea
            className="w-full border-2 border-brand-dark p-3 outline-none h-24"
            value={formData.meta_description || ''}
            onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase">Canonical URL</label>
          <input
            type="text"
            className="w-full border-2 border-brand-dark p-3 outline-none"
            value={formData.canonical_url || ''}
            onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase">OG Share Image</label>
          <MediaPicker
            value={formData.og_media_id}
            onChange={(id) => setFormData({ ...formData, og_media_id: id })}
            folder="general"
            initialMedia={settings.og_media}
          />
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-4">
        <h3 className="font-bold text-lg border-b-2 border-brand-dark pb-2">Announcement Banner</h3>
        
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="announcement_enabled"
            className="w-5 h-5 accent-brand-lime"
            checked={formData.announcement_enabled}
            onChange={(e) => setFormData({ ...formData, announcement_enabled: e.target.checked })}
          />
          <label htmlFor="announcement_enabled" className="font-bold text-sm uppercase">Enable Announcement Banner</label>
        </div>

        {formData.announcement_enabled && (
          <>
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm uppercase">Text</label>
              <input
                type="text"
                className="w-full border-2 border-brand-dark p-3 outline-none"
                value={formData.announcement_text || ''}
                onChange={(e) => setFormData({ ...formData, announcement_text: e.target.value })}
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-bold text-sm uppercase">Button Text (Optional)</label>
                <input
                  type="text"
                  className="w-full border-2 border-brand-dark p-3 outline-none"
                  value={formData.announcement_button || ''}
                  onChange={(e) => setFormData({ ...formData, announcement_button: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="font-bold text-sm uppercase">Button URL (Optional)</label>
                <input
                  type="text"
                  className="w-full border-2 border-brand-dark p-3 outline-none"
                  value={formData.announcement_url || ''}
                  onChange={(e) => setFormData({ ...formData, announcement_url: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
