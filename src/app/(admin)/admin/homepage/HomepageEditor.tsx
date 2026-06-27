'use client';

import React, { useState } from 'react';
import { HomepageData } from '@/types/homepage';
import SettingsEditor from './SettingsEditor';
import SectionEditor from './SectionEditor';
import FeaturedItemsEditor from './FeaturedItemsEditor';

interface HomepageEditorProps {
  data: HomepageData;
}

export default function HomepageEditor({ data }: HomepageEditorProps) {
  const [activeTab, setActiveTab] = useState('settings');

  const tabs = [
    { id: 'settings', label: 'SEO & Announcement' },
    { id: 'hero', label: 'Hero' },
    { id: 'categories', label: 'Categories' },
    { id: 'setup_builder', label: 'Setup Builder' },
    { id: 'featured_products', label: 'Featured Gear' },
    { id: 'featured_guides', label: 'Featured Guides' },
    { id: 'featured_beans', label: 'Featured Beans' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'footer_cta', label: 'Footer CTA' },
  ];

  const getSection = (key: string) => data.sections.find(s => s.section_key === key);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 shrink-0">
        <div className="bg-white border-4 border-brand-dark shadow-[4px_4px_0px_#111111] p-4 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-left px-4 py-2 font-bold text-sm uppercase transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-lime text-brand-dark border-2 border-brand-dark'
                  : 'text-gray-500 hover:text-brand-dark border-2 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 bg-white border-4 border-brand-dark shadow-[8px_8px_0px_#111111] p-8">
        {activeTab === 'settings' && <SettingsEditor settings={data.settings} />}
        {activeTab === 'hero' && <SectionEditor section={getSection('hero')} title="Hero Section" fields={{ title: true, subtitle: true, description: true, button: true, media: true }} />}
        {activeTab === 'categories' && <FeaturedItemsEditor section={getSection('categories')} items={data.items} entityType="category" maxItems={8} />}
        {activeTab === 'setup_builder' && <SectionEditor section={getSection('setup_builder')} title="Setup Builder Section" fields={{ title: true, description: true, button: true, media: true }} />}
        {activeTab === 'featured_products' && <FeaturedItemsEditor section={getSection('featured_products')} items={data.items} entityType="product" maxItems={4} />}
        {activeTab === 'featured_guides' && <FeaturedItemsEditor section={getSection('featured_guides')} items={data.items} entityType="guide" maxItems={3} />}
        {activeTab === 'featured_beans' && <FeaturedItemsEditor section={getSection('featured_beans')} items={data.items} entityType="bean" maxItems={3} />}
        {activeTab === 'newsletter' && <SectionEditor section={getSection('newsletter')} title="Newsletter Section" fields={{ title: true, description: true, button: true }} />}
        {activeTab === 'footer_cta' && <SectionEditor section={getSection('footer_cta')} title="Footer CTA Section" fields={{ title: true, description: true, button: true }} />}
      </div>
    </div>
  );
}
