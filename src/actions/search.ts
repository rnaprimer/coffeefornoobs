'use server'

import { autocomplete as autocompleteQuery } from '@/lib/search/query'
import { resolveEntities } from '@/lib/search/resolver'

export async function autocomplete(q: string) {
  // 1. Get raw search results
  const { results } = await autocompleteQuery(q)
  
  // 2. Resolve them to full entities for the UI
  // The resolver adds nice URLs and ensures titles are correct
  const resolved = await resolveEntities(results)
  
  return { results: resolved }
}
