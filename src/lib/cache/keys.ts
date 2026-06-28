export const CACHE_KEYS = {
  HOMEPAGE: 'homepage',
  HOMEPAGE_CMS: 'homepage-cms',
  PRODUCTS_LIST: 'products-list',
  GUIDES_LIST: 'guides-list',
  BEANS_LIST: 'beans-list',
  COMPARISONS_LIST: 'comparisons-list',
  TAGS_LIST: 'tags-list',
  SEARCH_RESULTS: 'search-results'
} as const;

export function getProductKey(slug: string) {
  return `product-${slug}`;
}

export function getGuideKey(slug: string) {
  return `guide-${slug}`;
}

export function getBeanKey(slug: string) {
  return `bean-${slug}`;
}

export function getComparisonKey(slug: string) {
  return `comparison-${slug}`;
}

export function getTagKey(slug: string) {
  return `tag-${slug}`;
}
