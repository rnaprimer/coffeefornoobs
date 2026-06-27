import React from 'react'
import Link from 'next/link'

interface AdminFormProps {
  children: React.ReactNode
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  cancelHref: string
  isSaving?: boolean
  saveLabel?: string
}

export default function AdminForm({
  children,
  onSubmit,
  cancelHref,
  isSaving = false,
  saveLabel = 'Save'
}: AdminFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-8 divide-y divide-gray-200 max-w-4xl">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {children}
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Link
            href={cancelHref}
            className="rounded-md bg-white py-2 px-3 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="ml-3 inline-flex justify-center rounded-md bg-amber-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600 disabled:opacity-70"
          >
            {isSaving ? 'Saving...' : saveLabel}
          </button>
        </div>
      </div>
    </form>
  )
}
