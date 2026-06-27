import { createClient } from '@/lib/supabase/server'
import { search } from '@/lib/search/query'
import { resolveEntities } from '@/lib/search/resolver'
import PageHeader from '@/components/shared/PageHeader'
import Link from 'next/link'
import FilterSidebar from '@/components/search/FilterSidebar'
import SortDropdown from '@/components/search/SortDropdown'
import SearchPagination from '@/components/search/SearchPagination'
import SearchResultCard from '@/components/search/SearchResultCard'

export const metadata = {
  title: 'Search | CoffeeForNoobs',
  description: 'Search for guides, gear, and coffee.',
}

export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  
  const q = typeof searchParams?.q === 'string' ? searchParams.q : ''
  const type = typeof searchParams?.type === 'string' ? searchParams.type : ''
  const category = typeof searchParams?.category === 'string' ? searchParams.category : ''
  const tagsParam = searchParams?.tags
  const tags = Array.isArray(tagsParam) ? tagsParam : typeof tagsParam === 'string' ? [tagsParam] : []
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'relevance'
  const page = typeof searchParams?.page === 'string' ? parseInt(searchParams.page, 10) : 1
  const pageSize = 12

  // 1. Fetch raw search results
  const { results: rawResults, hasMore } = await search({
    q,
    type,
    category,
    tags,
    sort,
    page,
    pageSize
  })

  // 2. Resolve to full UI entities
  const resolvedResults = await resolveEntities(rawResults)

  return (
    <div className="bg-brand-white min-h-screen">
      <PageHeader 
        title="Search Results" 
        description={q ? `Showing results for "${q}"` : 'Browse all content'}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FilterSidebar 
              currentType={type} 
              currentCategory={category} 
              currentTags={tags} 
            />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <p className="text-gray-600 font-medium">
                {rawResults.length > 0 ? (
                  <span>Showing results on page {page}</span>
                ) : (
                  <span>No results found</span>
                )}
              </p>
              
              <SortDropdown currentSort={sort} />
            </div>

            {resolvedResults.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {resolvedResults.map((result) => (
                    <SearchResultCard key={`${result.type}-${result.id}`} result={result} />
                  ))}
                </div>
                
                <div className="mt-12">
                  <SearchPagination page={page} hasMore={hasMore ?? false} />
                </div>
              </>
            ) : (
              <div className="py-20 text-center border-4 border-dashed border-gray-200">
                <h3 className="text-xl font-bold uppercase tracking-widest text-brand-dark mb-2">No matches found</h3>
                <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                <Link 
                  href="/search"
                  className="mt-6 inline-block bg-brand-dark text-brand-white font-bold uppercase tracking-widest px-6 py-3 rounded-full hover:bg-brand-pink transition-colors"
                >
                  Clear all filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
