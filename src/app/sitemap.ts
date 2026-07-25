import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/queries/products';
import { getBeans } from '@/lib/queries/beans';
import { getGuides } from '@/lib/queries/guides';
import { getComparisons } from '@/lib/queries/comparisons';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://coffeefornoobs.com';

  const [products, beans, guides, comparisons] = await Promise.all([
    getProducts(),
    getBeans(),
    getGuides(),
    getComparisons(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/gear`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/beans`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/comparisons`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/setup-builder`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products
    
    .map((p) => ({
      url: `${baseUrl}/gear/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const beanRoutes: MetadataRoute.Sitemap = beans
    
    .map((b) => ({
      url: `${baseUrl}/beans/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const guideRoutes: MetadataRoute.Sitemap = guides
    
    .map((g) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  const comparisonRoutes: MetadataRoute.Sitemap = comparisons
    
    .map((c) => ({
      url: `${baseUrl}/comparisons/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...beanRoutes,
    ...guideRoutes,
    ...comparisonRoutes,
  ];
}
