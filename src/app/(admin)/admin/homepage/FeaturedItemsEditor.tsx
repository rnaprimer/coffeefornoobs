'use client';

import React, { useState, useEffect } from 'react';
import { HomepageSection, HomepageSectionItem } from '@/types/homepage';
import { updateHomepageSectionItems } from '../actions/homepage';
import { createClient } from '@/lib/supabase/client';
import { Save, Trash2, GripVertical, Plus } from 'lucide-react';
import SectionEditor from './SectionEditor';

interface FeaturedItemsEditorProps {
  section: HomepageSection | undefined;
  items: HomepageSectionItem[];
  entityType: 'product' | 'guide' | 'bean' | 'category';
  maxItems: number;
}

export default function FeaturedItemsEditor({ section, items, entityType, maxItems }: FeaturedItemsEditorProps) {
  const supabase = createClient();
  const [availableEntities, setAvailableEntities] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchEntities() {
      if (!supabase) return;
      let table = '';
      if (entityType === 'product') table = 'products';
      if (entityType === 'guide') table = 'guides';
      if (entityType === 'bean') table = 'beans';
      if (entityType === 'category') table = 'categories';

      const anySupabase: any = supabase;
      const selectFields = (entityType === 'guide') ? 'id, title' : 'id, name';
      const orderField = (entityType === 'guide') ? 'title' : 'name';
      const { data } = await anySupabase.from(table).select(selectFields).order(orderField);
      if (data) setAvailableEntities(data);
    }
    fetchEntities();

    // Map initial items
    const sectionItems = items
      .filter(i => i.homepage_section_id === section?.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map(i => {
        let entity = null;
        if (entityType === 'product') entity = i.product;
        if (entityType === 'guide') entity = i.guide;
        if (entityType === 'bean') entity = i.bean;
        if (entityType === 'category') entity = i.category;
        return {
          id: i.entity_id,
          name: (entity as any)?.name || (entity as any)?.title || 'Unknown'
        };
      });
    setSelectedItems(sectionItems);
  }, [section, items, entityType, supabase]);

  if (!section) return null;

  const handleAdd = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    if (!id) return;
    
    if (selectedItems.length >= maxItems) {
      alert(`You can only select up to ${maxItems} items for this section.`);
      return;
    }

    if (selectedItems.find(i => i.id === id)) {
      alert('This item is already added.');
      return;
    }

    const entity = availableEntities.find(e => e.id === id);
    if (entity) {
      setSelectedItems([...selectedItems, { id: entity.id, name: entity.name || entity.title }]);
    }
    
    // reset select
    e.target.value = '';
  };

  const handleRemove = (id: string) => {
    setSelectedItems(selectedItems.filter(i => i.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...selectedItems];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    setSelectedItems(newItems);
  };

  const moveDown = (index: number) => {
    if (index === selectedItems.length - 1) return;
    const newItems = [...selectedItems];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    setSelectedItems(newItems);
  };

  const handleSaveItems = async () => {
    setIsSaving(true);
    try {
      const itemsToSave = selectedItems.map((item, index) => ({
        entity_type: entityType,
        entity_id: item.id,
        display_order: index + 1
      }));
      await updateHomepageSectionItems(section.id, itemsToSave);
      alert('Featured items saved successfully!');
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-12">
      {/* 1. Section text editor */}
      <SectionEditor 
        section={section} 
        title={`${entityType} Section Settings`} 
        fields={{ title: true, subtitle: true, description: true, button: true }} 
      />

      {/* 2. Items editor */}
      <div className="flex flex-col gap-6 border-t-4 border-gray-100 pt-8">
        <div className="flex items-center justify-between border-b-2 border-brand-dark pb-4">
          <div>
            <h3 className="text-xl font-bold uppercase tracking-tight">Featured {entityType}s</h3>
            <p className="text-sm font-medium text-gray-500">Select up to {maxItems} items to feature on the homepage.</p>
          </div>
          <button
            onClick={handleSaveItems}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-brand-lime text-brand-dark font-bold text-sm uppercase hover:bg-yellow-400 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Items Order'}
          </button>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-4 border-2 border-gray-200">
          <Plus size={20} className="text-gray-400" />
          <select 
            className="flex-1 bg-white border-2 border-brand-dark p-2 font-medium outline-none"
            onChange={handleAdd}
            value=""
          >
            <option value="" disabled>-- Add {entityType} to feature --</option>
            {availableEntities.map(entity => (
              <option key={entity.id} value={entity.id}>{entity.name || entity.title}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          {selectedItems.length === 0 && (
            <p className="text-gray-500 italic p-4 text-center border-2 border-dashed border-gray-300">No items selected.</p>
          )}
          {selectedItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-4 bg-white border-2 border-brand-dark p-4 shadow-[2px_2px_0px_#111111]">
              <div className="flex flex-col gap-1">
                <button onClick={() => moveUp(index)} disabled={index === 0} className="text-gray-400 hover:text-brand-dark disabled:opacity-30">
                  <GripVertical size={16} className="rotate-90" />
                </button>
                <button onClick={() => moveDown(index)} disabled={index === selectedItems.length - 1} className="text-gray-400 hover:text-brand-dark disabled:opacity-30">
                  <GripVertical size={16} className="rotate-90" />
                </button>
              </div>
              <span className="font-bold flex-1 text-sm">{item.name}</span>
              <button 
                onClick={() => handleRemove(item.id)}
                className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-600 hover:bg-red-200 rounded border border-red-200 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
