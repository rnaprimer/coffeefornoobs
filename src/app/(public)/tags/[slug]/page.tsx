import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PageHeader from '@/components/shared/PageHeader'
import SearchResultCard from '@/components/search/SearchResultCard'
import type { Metadata } from 'next'

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    return {
      title: 'Tag Not Found',
    }
  }

  const { data: tag } = await supabase
    .from('tags')
    .select('seo_title, seo_description, name')
    .eq('slug', params.slug)
    .single()

  if (!tag) {
    return {
      title: 'Tag Not Found',
    }
  }

  return {
    title: (tag as any).seo_title || `Topics about ${(tag as any).name} - CoffeeForNoobs`,
    description: (tag as any).seo_description || `Explore all content related to ${(tag as any).name}.`,
  }
}

export default async function TagPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  if (!supabase) {
    notFound()
  }

  // Fetch the tag
  const { data: tag, error: tagError } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (tagError || !tag) {
    notFound()
  }

  // Fetch index entries for this tag
  const { data: results, error: searchError } = await supabase
    .from('search_index')
    .select('*')
    .contains('tags', [(tag as any).id])
    .eq('status', 'published')
    .order('search_weight', { ascending: false })
    .order('published_at', { ascending: false })

  let resolvedResults: any[] = []
  if (results && results.length > 0) {
    const { resolveEntities } = await import('@/lib/search/resolver')
    resolvedResults = await resolveEntities(results as any[])
  }

  return (
    <div className="bg-brand-white min-h-screen">
      <PageHeader 
        title={(tag as any).name}
        description={(tag as any).description || `Explore everything related to ${(tag as any).name}.`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {resolvedResults.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl font-bold uppercase tracking-widest text-brand-dark">No content found</p>
            <p className="text-gray-500 mt-2">Check back later for more content about {(tag as any).name}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resolvedResults.map((result) => (
              <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
