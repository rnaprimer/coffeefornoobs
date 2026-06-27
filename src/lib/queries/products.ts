import { getSupabase, isSupabaseConfigured } from './shared';
import { Product } from '@/types/product';
import { products as staticProducts } from '../../data/products';
import { categories as staticCategories } from '../../data/categories';

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return staticProducts;
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (slug),
      featured_media:media!products_featured_media_id_fkey (url)
    `)
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return ((data as any[]) || []).map(item => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    price: item.price || 0,
    rating: Number(item.rating) || 0,
    reviews: item.reviews || 0,
    badge: item.badge || undefined,
    imageUrl: item.featured_media?.url || item.image_url || undefined,
    imageText: item.image_text || '',
    description: item.description || '',
    pros: item.pros || [],
    cons: item.cons || [],
    specs: (item.specifications as Record<string, string>) || {},
    categoryId: item.categories?.slug || item.category_id || '',
    relatedProducts: [],
    guideSlugs: []
  }));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return staticProducts.find(p => p.slug === slug) || null;
  }

  const supabase = await getSupabase();
  const { data: item, error } = await supabase
    .from('products')
    .select(`
      *,
      categories (slug),
      featured_media:media!products_featured_media_id_fkey (url)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !item) {
    console.error('Error fetching product by slug:', error);
    return null;
  }

  const prodItem = item as any;

  // Fetch guide slugs for this product using junction table
  const { data: guideProds } = await supabase
    .from('guide_products')
    .select('guides (slug)')
    .eq('product_id', prodItem.id);

  const guideSlugs = (guideProds || [])
    .map((gp: any) => gp.guides?.slug)
    .filter(Boolean);

  // For related products, let's fetch products in the same category (excluding current)
  const { data: related } = await supabase
    .from('products')
    .select('slug')
    .eq('category_id', prodItem.category_id)
    .neq('id', prodItem.id)
    .eq('status', 'published')
    .limit(3);

  const relatedProducts = ((related as any[]) || []).map(r => r.slug);

  return {
    id: prodItem.id,
    slug: prodItem.slug,
    name: prodItem.name,
    price: prodItem.price || 0,
    rating: Number(prodItem.rating) || 0,
    reviews: prodItem.reviews || 0,
    badge: prodItem.badge || undefined,
    imageUrl: prodItem.featured_media?.url || prodItem.image_url || undefined,
    imageText: prodItem.image_text || '',
    description: prodItem.description || '',
    pros: prodItem.pros || [],
    cons: prodItem.cons || [],
    specs: (prodItem.specifications as Record<string, string>) || {},
    categoryId: prodItem.categories?.slug || prodItem.category_id || '',
    relatedProducts,
    guideSlugs
  };
}

export async function getRelatedProducts(productSlug: string, categorySlug?: string): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return staticProducts.filter(p => p.slug !== productSlug && (!categorySlug || p.categoryId === categorySlug));
  }

  const supabase = await getSupabase();
  
  let query = supabase
    .from('products')
    .select(`
      *,
      categories (slug),
      featured_media:media!products_featured_media_id_fkey (url)
    `)
    .neq('slug', productSlug)
    .eq('status', 'published')
    .limit(4);

  if (categorySlug) {
    // Get category ID first
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .eq('status', 'published')
      .is('deleted_at', null)
      .single();
      
    if (cat) {
      const catItem = cat as any;
      query = query.eq('category_id', catItem.id);
    }
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching related products:', error);
    return [];
  }

  return ((data as any[]) || []).map(item => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    price: item.price || 0,
    rating: Number(item.rating) || 0,
    reviews: item.reviews || 0,
    badge: item.badge || undefined,
    imageUrl: item.featured_media?.url || item.image_url || undefined,
    imageText: item.image_text || '',
    description: item.description || '',
    pros: item.pros || [],
    cons: item.cons || [],
    specs: (item.specifications as Record<string, string>) || {},
    categoryId: item.categories?.slug || item.category_id || '',
    relatedProducts: [],
    guideSlugs: []
  }));
}

export async function getCategories() {
  if (!isSupabaseConfigured()) {
    return staticCategories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      name: cat.name,
      iconName: cat.iconName
    }));
  }

  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      icon_media:media!categories_icon_media_id_fkey (url)
    `)
    .eq('status', 'published')
    .is('deleted_at', null)
    .order('name');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return ((data as any[]) || []).map(item => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    iconName: item.icon_name || 'Coffee',
    iconUrl: item.icon_media?.url || undefined
  }));
}
