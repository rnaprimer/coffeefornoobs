interface StatusBadgeProps {
  status: 'published' | 'draft' | string
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const isPublished = status === 'published'
  
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        isPublished
          ? 'bg-green-50 text-green-700 ring-green-600/20'
          : 'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
      }`}
    >
      {isPublished ? 'Published' : 'Draft'}
    </span>
  )
}
