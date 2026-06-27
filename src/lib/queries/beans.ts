import { getSupabase, isSupabaseConfigured } from './shared';
import { Bean } from '@/types/bean';
import { Roaster } from '@/types/roaster';
import { beans as staticBeans } from '../../data/beans';
import { roasters as staticRoasters } from '../../data/roasters';

export async function getBeans(): Promise<Bean[]> {
  if (!isSupabaseConfigured()) {
    return staticBeans;
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('beans')
    .select(`
      *,
      roasters (name, slug),
      featured_media:media!beans_featured_media_id_fkey (url)
    `)
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching beans:', error);
    return [];
  }

  return ((data as any[]) || []).map(item => ({
    id: item.id,
    slug: item.slug,
    brand: item.roasters?.name || '',
    roasterSlug: item.roasters?.slug || item.roaster_id || '',
    name: item.name,
    price: item.price || 0,
    origin: item.origin || '',
    process: item.process || '',
    roastLevel: item.roast_level || '',
    tastingNotes: item.tasting_notes || [],
    brewingRecommendations: item.brewing_recommendations || [],
    relatedBeans: [],
    imageUrl: item.featured_media?.url || item.image_url || undefined,
    imageText: item.image_text || ''
  }));
}

export async function getBeanBySlug(slug: string): Promise<Bean | null> {
  if (!isSupabaseConfigured()) {
    return staticBeans.find(b => b.slug === slug) || null;
  }

  const supabase = await getSupabase();
  const { data: item, error } = await supabase
    .from('beans')
    .select(`
      *,
      roasters (name, slug),
      featured_media:media!beans_featured_media_id_fkey (url)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !item) {
    console.error('Error fetching bean by slug:', error);
    return null;
  }

  const beanItem = item as any;

  // Fetch related beans
  const { data: rbData } = await supabase
    .from('bean_relationships')
    .select('related_bean:beans!bean_relationships_related_bean_id_fkey (slug)')
    .eq('bean_id', beanItem.id);

  const relatedBeans = (rbData || [])
    .map((rb: any) => rb.related_bean?.slug)
    .filter(Boolean);

  return {
    id: beanItem.id,
    slug: beanItem.slug,
    brand: beanItem.roasters?.name || '',
    roasterSlug: beanItem.roasters?.slug || beanItem.roaster_id || '',
    name: beanItem.name,
    price: beanItem.price || 0,
    origin: beanItem.origin || '',
    process: beanItem.process || '',
    roastLevel: beanItem.roast_level || '',
    tastingNotes: beanItem.tasting_notes || [],
    brewingRecommendations: beanItem.brewing_recommendations || [],
    relatedBeans,
    imageUrl: beanItem.featured_media?.url || beanItem.image_url || undefined,
    imageText: beanItem.image_text || ''
  };
}

export async function getRoasters(): Promise<Roaster[]> {
  if (!isSupabaseConfigured()) {
    return staticRoasters;
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('roasters')
    .select(`
      *,
      logo_media:media!roasters_logo_media_id_fkey (url)
    `)
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('name');

  if (error) {
    console.error('Error fetching roasters:', error);
    return [];
  }

  return ((data as any[]) || []).map(item => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    location: item.location || '',
    description: item.description || '',
    logoUrl: item.logo_media?.url || undefined
  }));
}
