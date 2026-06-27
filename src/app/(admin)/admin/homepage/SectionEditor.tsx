'use client';

import React, { useState } from 'react';
import { HomepageSection } from '@/types/homepage';
import { updateHomepageSection } from '../actions/homepage';
import { MediaPicker } from '@/components/admin/media/MediaPicker';
import { Save } from 'lucide-react';

interface SectionEditorProps {
  section: HomepageSection | undefined;
  title: string;
  fields: {
    subtitle?: boolean;
    title?: boolean;
    description?: boolean;
    button?: boolean;
    media?: boolean;
  };
}

export default function SectionEditor({ section, title, fields }: SectionEditorProps) {
  if (!section) return <div>Section data not found.</div>;

  const [formData, setFormData] = useState<Partial<HomepageSection>>({
    title: section.title || '',
    subtitle: section.subtitle || '',
    description: section.description || '',
    button_text: section.button_text || '',
    button_url: section.button_url || '',
    media_id: section.media_id || null,
    enabled: section.enabled,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateHomepageSection(section.id, formData);
      alert('Section saved successfully!');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b-2 border-brand-dark pb-4">
        <h2 className="text-2xl font-bold uppercase tracking-tight">{title}</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-brand-lime text-brand-dark font-bold text-sm uppercase hover:bg-yellow-400 transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Section'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`enabled_${section.id}`}
          className="w-5 h-5 accent-brand-lime"
          checked={formData.enabled}
          onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
        />
        <label htmlFor={`enabled_${section.id}`} className="font-bold text-sm uppercase">Enable this section on the homepage</label>
      </div>

      {fields.subtitle && (
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase">Subtitle / Kicker</label>
          <input
            type="text"
            className="w-full border-2 border-brand-dark p-3 outline-none"
            value={formData.subtitle || ''}
            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
          />
        </div>
      )}

      {fields.title && (
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase">Headline / Title</label>
          <textarea
            className="w-full border-2 border-brand-dark p-3 outline-none h-20"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
      )}

      {fields.description && (
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase">Description</label>
          <textarea
            className="w-full border-2 border-brand-dark p-3 outline-none h-32"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
      )}

      {fields.button && (
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-bold text-sm uppercase">Button Text</label>
            <input
              type="text"
              className="w-full border-2 border-brand-dark p-3 outline-none"
              value={formData.button_text || ''}
              onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <label className="font-bold text-sm uppercase">Button URL</label>
            <input
              type="text"
              className="w-full border-2 border-brand-dark p-3 outline-none"
              value={formData.button_url || ''}
              onChange={(e) => setFormData({ ...formData, button_url: e.target.value })}
            />
          </div>
        </div>
      )}

      {fields.media && (
        <div className="flex flex-col gap-2">
          <label className="font-bold text-sm uppercase">Background / Illustration Image</label>
          <MediaPicker
            value={formData.media_id}
            onChange={(id) => setFormData({ ...formData, media_id: id })}
            folder="general"
            initialMedia={section.media}
          />
        </div>
      )}
    </div>
  );
}
