import { revalidateTag, revalidatePath } from 'next/cache';
import { CACHE_KEYS, getProductKey, getGuideKey, getBeanKey, getComparisonKey, getTagKey } from './keys';
import { setCacheMetadata } from './cache';

export async function revalidateHomepage() {
  revalidatePath('/');
  // @ts-ignore
  revalidateTag(CACHE_KEYS.HOMEPAGE);
  // @ts-ignore
  revalidateTag(CACHE_KEYS.HOMEPAGE_CMS);
  await setCacheMetadata(CACHE_KEYS.HOMEPAGE, 'Homepage');
}

export async function revalidateProduct(slug: string) {
  const key = getProductKey(slug);
  revalidatePath(`/gear/${slug}`);
  // @ts-ignore
  revalidateTag(key);
  // @ts-ignore
  revalidateTag(CACHE_KEYS.PRODUCTS_LIST);
  await setCacheMetadata(key, 'Pages', 'Product', slug);
}

export async function revalidateGuide(slug: string) {
  const key = getGuideKey(slug);
  revalidatePath(`/guides/${slug}`);
  // @ts-ignore
  revalidateTag(key);
  // @ts-ignore
  revalidateTag(CACHE_KEYS.GUIDES_LIST);
  await setCacheMetadata(key, 'Pages', 'Guide', slug);
}

export async function revalidateBean(slug: string) {
  const key = getBeanKey(slug);
  revalidatePath(`/beans/${slug}`);
  // @ts-ignore
  revalidateTag(key);
  // @ts-ignore
  revalidateTag(CACHE_KEYS.BEANS_LIST);
  await setCacheMetadata(key, 'Pages', 'Bean', slug);
}

export async function revalidateComparison(slug: string) {
  const key = getComparisonKey(slug);
  revalidatePath(`/comparisons/${slug}`);
  // @ts-ignore
  revalidateTag(key);
  // @ts-ignore
  revalidateTag(CACHE_KEYS.COMPARISONS_LIST);
  await setCacheMetadata(key, 'Pages', 'Comparison', slug);
}

export async function revalidateTags(slug: string) {
  const key = getTagKey(slug);
  revalidatePath(`/tags/${slug}`);
  // @ts-ignore
  revalidateTag(key);
  // @ts-ignore
  revalidateTag(CACHE_KEYS.TAGS_LIST);
  await setCacheMetadata(key, 'Pages', 'Tag', slug);
}

export async function revalidateSearch() {
  revalidatePath('/search');
  // @ts-ignore
  revalidateTag(CACHE_KEYS.SEARCH_RESULTS);
  await setCacheMetadata(CACHE_KEYS.SEARCH_RESULTS, 'Search');
}
