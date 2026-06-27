import Link from 'next/link'
import { Plus } from 'lucide-react'

interface PageHeaderProps {
  title: string
  description?: string
  actionLabel?: string
  actionHref?: string
}

export default function PageHeader({ title, description, actionLabel, actionHref }: PageHeaderProps) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {actionLabel && actionHref && (
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href={actionHref}
            className="inline-flex items-center justify-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {actionLabel}
          </Link>
        </div>
      )}
    </div>
  )
}
