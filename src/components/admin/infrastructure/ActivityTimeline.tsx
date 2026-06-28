import React from 'react';

export default function ActivityTimeline({ activities }: { activities: any[] }) {
  if (!activities || activities.length === 0) return <p className="text-sm text-gray-500">No activity recorded yet.</p>;

  return (
    <div className="flow-root bg-white shadow sm:rounded-lg p-6">
      <ul role="list" className="-mb-8">
        {activities.map((activity, itemIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {itemIdx !== activities.length - 1 ? (
                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                    <span className="text-gray-500 text-xs">{activity.action.charAt(0)}</span>
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{activity.action}</span> - {activity.description}
                    </p>
                  </div>
                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                    <time dateTime={activity.created_at}>{new Date(activity.created_at).toLocaleString()}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
