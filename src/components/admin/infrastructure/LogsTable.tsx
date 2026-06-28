import React from 'react';

export default function LogsTable({ logs }: { logs: any[] }) {
  if (!logs || logs.length === 0) return <p className="text-sm text-gray-500">No logs found.</p>;

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Time</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Level</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Source</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                {new Date(log.created_at).toLocaleString()}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  log.level === 'Error' || log.level === 'Critical' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                  log.level === 'Warning' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                  'bg-green-50 text-green-700 ring-green-600/20'
                }`}>
                  {log.level}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{log.source}</td>
              <td className="px-3 py-4 text-sm text-gray-900 truncate max-w-xs">{log.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
