import React from 'react';

export default function HealthStatus({ healthChecks }: { healthChecks: any[] }) {
  if (!healthChecks || healthChecks.length === 0) return <p className="text-sm text-gray-500">No health data available.</p>;

  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {healthChecks.map((item) => (
        <li key={item.id} className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div className="flex w-full items-center justify-between space-x-6 p-6">
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-sm font-medium text-gray-900">{item.component}</h3>
                <span className={`inline-flex flex-shrink-0 items-center rounded-full px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  item.status === 'Healthy' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                  item.status === 'Degraded' ? 'bg-yellow-50 text-yellow-800 ring-yellow-600/20' :
                  'bg-red-50 text-red-700 ring-red-600/20'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">Updated: {new Date(item.last_checked).toLocaleTimeString()}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
