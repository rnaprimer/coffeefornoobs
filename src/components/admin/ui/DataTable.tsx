import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'

export interface ColumnDef<T> {
  header: string
  accessorKey: keyof T
  cell?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  editHrefPrefix?: string
  onDelete?: (id: string | number) => void
  keyExtractor: (row: T) => string | number
}

export default function DataTable<T>({
  data,
  columns,
  editHrefPrefix,
  onDelete,
  keyExtractor
}: DataTableProps<T>) {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, i) => (
                    <th
                      key={i}
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      {col.header}
                    </th>
                  ))}
                  {(editHrefPrefix || onDelete) && (
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columns.length + (editHrefPrefix || onDelete ? 1 : 0)}
                      className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-500 sm:pl-6 text-center"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={keyExtractor(row)}>
                      {columns.map((col, i) => (
                        <td
                          key={i}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {col.cell ? col.cell(row) : (row[col.accessorKey] as any)?.toString()}
                        </td>
                      ))}
                      {(editHrefPrefix || onDelete) && (
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex items-center justify-end space-x-2">
                            {editHrefPrefix && (
                              <Link
                                href={`${editHrefPrefix}/${keyExtractor(row)}`}
                                className="text-amber-600 hover:text-amber-900"
                              >
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Link>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(keyExtractor(row))}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
