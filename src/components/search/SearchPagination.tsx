'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchPagination({ page, hasMore }: { page: number, hasMore: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.push(`/search?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex items-center justify-between border-t-4 border-brand-dark bg-white py-3 px-6 shadow-[8px_8px_0px_#111111]">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="relative inline-flex items-center rounded-md border-2 border-brand-dark bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-dark hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasMore}
          className="relative ml-3 inline-flex items-center rounded-md border-2 border-brand-dark bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-dark hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-brand-dark">
            Page <span className="font-black">{page}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center rounded-l-md border-2 border-brand-dark bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-dark hover:bg-brand-pink hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-brand-dark"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={!hasMore}
              className="relative inline-flex items-center rounded-r-md border-y-2 border-r-2 border-l-0 border-brand-dark bg-white px-4 py-2 text-sm font-bold uppercase tracking-widest text-brand-dark hover:bg-brand-pink hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-brand-dark"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
