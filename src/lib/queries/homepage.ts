import { createClient } from '../supabase/server';
import { HomepageSettings, HomepageSection, HomepageSectionItem, HomepageData } from '@/types/homepage';
import { Product } from '@/types/product';
import { Guide } from '@/types/guide';
import { Bean } from '@/types/bean';
import { Category } from '@/types/category';

export async function getHomepageSettings(): Promise<HomepageSettings | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('homepage_settings')
    .select('*, og_media:media(*)')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching homepage settings:', error);
    return null;
  }
  return data as HomepageSettings;
}

export async function getHomepageSections(includeDrafts = false): Promise<HomepageSection[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase
    .from('homepage_sections')
    .select('*, media(*)');

  if (!includeDrafts) {
    query = query.eq('status', 'published');
  }

  const { data, error } = await query.order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching homepage sections:', error);
    return [];
  }
  return data as HomepageSection[];
}

export async function getHomepageSectionItems(sectionIds: string[]): Promise<HomepageSectionItem[]> {
  if (sectionIds.length === 0) return [];
  
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('homepage_section_items')
    .select('*')
    .in('homepage_section_id', sectionIds)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching homepage items:', error);
    return [];
  }

  const items = data as HomepageSectionItem[];

  // Extract IDs to fetch
  const productIds = items.filter(i => i.entity_type === 'product').map(i => i.entity_id);
  const guideIds = items.filter(i => i.entity_type === 'guide').map(i => i.entity_id);
  const beanIds = items.filter(i => i.entity_type === 'bean').map(i => i.entity_id);
  const categoryIds = items.filter(i => i.entity_type === 'category').map(i => i.entity_id);

  // Fetch related entities concurrently
  const [productsRes, guidesRes, beansRes, categoriesRes] = await Promise.all([
    productIds.length > 0 ? supabase.from('products').select('*').in('id', productIds) : { data: [], error: null },
    guideIds.length > 0 ? supabase.from('guides').select('*').in('id', guideIds) : { data: [], error: null },
    beanIds.length > 0 ? supabase.from('beans').select('*').in('id', beanIds) : { data: [], error: null },
    categoryIds.length > 0 ? supabase.from('categories').select('*').in('id', categoryIds) : { data: [], error: null }
  ]);
  
  if (productsRes.error) console.error('productsRes error:', productsRes.error);
  if (guidesRes.error) console.error('guidesRes error:', guidesRes.error);
  if (beansRes.error) console.error('beansRes error:', beansRes.error);
  if (categoriesRes.error) console.error('categoriesRes error:', categoriesRes.error);

  const productsMap = new Map((productsRes.data || []).map((p: any) => [p.id, p]));
  const guidesMap = new Map((guidesRes.data || []).map((g: any) => [g.id, g]));
  const beansMap = new Map((beansRes.data || []).map((b: any) => [b.id, b]));
  const categoriesMap = new Map((categoriesRes.data || []).map((c: any) => [c.id, c]));

  // Collect media IDs
  const mediaIds = new Set<string>();
  (productsRes.data || []).forEach((p: any) => p.featured_media_id && mediaIds.add(p.featured_media_id));
  (guidesRes.data || []).forEach((g: any) => g.featured_media_id && mediaIds.add(g.featured_media_id));
  (beansRes.data || []).forEach((b: any) => b.featured_media_id && mediaIds.add(b.featured_media_id));
  (categoriesRes.data || []).forEach((c: any) => c.featured_media_id && mediaIds.add(c.featured_media_id));

  const mediaMap = new Map();
  if (mediaIds.size > 0) {
    const { data: mediaData } = await supabase.from('media').select('*').in('id', Array.from(mediaIds));
    (mediaData || []).forEach((m: any) => mediaMap.set(m.id, m));
  }

  // Map imageUrl
  const setImageUrl = (entity: any) => {
    if (entity && entity.featured_media_id && mediaMap.has(entity.featured_media_id)) {
      entity.imageUrl = mediaMap.get(entity.featured_media_id).url;
    }
    return entity;
  };

  // Attach to items
  return items.map(item => {
    switch (item.entity_type) {
      case 'product':
        item.product = setImageUrl(productsMap.get(item.entity_id)) as Product;
        break;
      case 'guide':
        item.guide = setImageUrl(guidesMap.get(item.entity_id)) as Guide;
        break;
      case 'bean':
        item.bean = setImageUrl(beansMap.get(item.entity_id)) as Bean;
        break;
      case 'category':
        item.category = setImageUrl(categoriesMap.get(item.entity_id)) as Category;
        break;
    }
    return item;
  });
}

export async function getHomepageData(includeDrafts = false): Promise<HomepageData> {
  const [settings, sections] = await Promise.all([
    getHomepageSettings(),
    getHomepageSections(includeDrafts)
  ]);

  const sectionIds = (sections || []).map(s => s.id);
  const items = await getHomepageSectionItems(sectionIds);

  return {
    settings: settings || {} as HomepageSettings,
    sections: sections || [],
    items: items || []
  };
}
