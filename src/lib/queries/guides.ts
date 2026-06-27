import { getSupabase, isSupabaseConfigured } from './shared';
import { Guide } from '@/types/guide';
import { guides as staticGuides } from '../../data/guides';

export async function getGuides(): Promise<Guide[]> {
  if (!isSupabaseConfigured()) {
    return staticGuides;
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('guides')
    .select(`
      *,
      categories (slug),
      cover_media:media!guides_cover_media_id_fkey (url)
    `)
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching guides:', error);
    return [];
  }

  return ((data as any[]) || []).map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    coverImageText: item.cover_image_text || '',
    author: item.author,
    readingTime: `${item.reading_time || 5} min read`,
    content: item.content || '',
    featuredProducts: [],
    relatedGuides: [],
    categoryId: item.categories?.slug || item.category_id || '',
    coverImageUrl: item.cover_media?.url || item.cover_image || undefined
  }));
}

export async function getGuideBySlug(slug: string): Promise<Guide | null> {
  if (!isSupabaseConfigured()) {
    return staticGuides.find(g => g.slug === slug) || null;
  }

  const supabase = await getSupabase();
  const { data: item, error } = await supabase
    .from('guides')
    .select(`
      *,
      categories (slug),
      cover_media:media!guides_cover_media_id_fkey (url)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !item) {
    console.error('Error fetching guide by slug:', error);
    return null;
  }

  const guideItem = item as any;

  // Fetch featured products for this guide using junction table
  const { data: gpData } = await supabase
    .from('guide_products')
    .select('products (slug)')
    .eq('guide_id', guideItem.id);

  const featuredProducts = (gpData || [])
    .map((gp: any) => gp.products?.slug)
    .filter(Boolean);

  // Fetch related guides
  const { data: grData } = await supabase
    .from('guide_relationships')
    .select('related_guide:guides!guide_relationships_related_guide_id_fkey (slug)')
    .eq('guide_id', guideItem.id);

  const relatedGuides = (grData || [])
    .map((gr: any) => gr.related_guide?.slug)
    .filter(Boolean);

  return {
    id: guideItem.id,
    slug: guideItem.slug,
    title: guideItem.title,
    coverImageText: guideItem.cover_image_text || '',
    author: guideItem.author,
    readingTime: `${guideItem.reading_time || 5} min read`,
    content: guideItem.content || '',
    featuredProducts,
    relatedGuides,
    categoryId: guideItem.categories?.slug || guideItem.category_id || '',
    coverImageUrl: guideItem.cover_media?.url || guideItem.cover_image || undefined
  };
}
