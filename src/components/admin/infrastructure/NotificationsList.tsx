import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

export default function NotificationsList({ notifications }: { notifications: any[] }) {
  if (!notifications || notifications.length === 0) {
    return <div className="text-center py-10 bg-gray-50 rounded-lg text-gray-500 text-sm">No unresolved notifications. System is healthy!</div>;
  }

  return (
    <ul role="list" className="divide-y divide-gray-200 bg-white shadow sm:rounded-lg overflow-hidden">
      {notifications.map((notification) => (
        <li key={notification.id} className="p-4 sm:p-6 hover:bg-gray-50">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.severity === 'Critical' || notification.severity === 'High' ? (
                <AlertTriangle className="h-6 w-6 text-red-400" />
              ) : notification.severity === 'Medium' ? (
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              ) : (
                <Info className="h-6 w-6 text-blue-400" />
              )}
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
              </div>
              <div className="mt-2 text-sm text-gray-500 md:ml-6 md:mt-0 flex flex-col items-end">
                <time dateTime={notification.created_at}>{new Date(notification.created_at).toLocaleString()}</time>
                {notification.action_url && (
                  <a href={notification.action_url} className="text-amber-600 hover:text-amber-900 mt-1">Take Action &rarr;</a>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
