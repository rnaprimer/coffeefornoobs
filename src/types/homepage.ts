export interface Media {
  id: string;
  url: string;
  file_path: string;
  alt_text?: string;
  width?: number;
  height?: number;
}

import { Product } from './product';
import { Guide } from './guide';
import { Bean } from './bean';
import { Category } from './category';

export interface HomepageSettings {
  id: number;
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_media_id: string | null;
  og_media?: Media;
  announcement_enabled: boolean;
  announcement_text: string | null;
  announcement_button: string | null;
  announcement_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomepageSection {
  id: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  button_text: string | null;
  button_url: string | null;
  media_id: string | null;
  media?: Media;
  enabled: boolean;
  display_order: number;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface HomepageSectionItem {
  id: string;
  homepage_section_id: string;
  entity_type: 'product' | 'guide' | 'bean' | 'category';
  entity_id: string;
  display_order: number;
  product?: Product;
  guide?: Guide;
  bean?: Bean;
  category?: Category;
}

export interface HomepageData {
  settings: HomepageSettings;
  sections: HomepageSection[];
  items: HomepageSectionItem[];
}
