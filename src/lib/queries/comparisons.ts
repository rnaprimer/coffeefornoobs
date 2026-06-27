import { getSupabase, isSupabaseConfigured } from './shared';
import { Comparison } from '@/types/comparison';
import { comparisons as staticComparisons } from '../../data/comparisons';

export async function getComparisons(): Promise<Comparison[]> {
  if (!isSupabaseConfigured()) {
    return staticComparisons;
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('comparisons')
    .select(`
      *,
      product_a:products!comparisons_product_a_id_fkey (slug),
      product_b:products!comparisons_product_b_id_fkey (slug)
    `)
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching comparisons:', error);
    return [];
  }

  return ((data as any[]) || []).map(item => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    productA: item.product_a?.slug || '',
    productB: item.product_b?.slug || '',
    description: item.description || '',
    winner: item.winner || '',
    recommendation: item.recommendation || ''
  }));
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | null> {
  if (!isSupabaseConfigured()) {
    return staticComparisons.find(c => c.slug === slug) || null;
  }

  const supabase = await getSupabase();
  const { data: item, error } = await supabase
    .from('comparisons')
    .select(`
      *,
      product_a:products!comparisons_product_a_id_fkey (slug),
      product_b:products!comparisons_product_b_id_fkey (slug)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !item) {
    console.error('Error fetching comparison by slug:', error);
    return null;
  }

  const compItem = item as any;

  return {
    id: compItem.id,
    slug: compItem.slug,
    title: compItem.title,
    productA: compItem.product_a?.slug || '',
    productB: compItem.product_b?.slug || '',
    description: compItem.description || '',
    winner: compItem.winner || '',
    recommendation: compItem.recommendation || ''
  };
}
