'use client';

import React, { useState } from 'react';

interface TabProps {
  id: string;
  name: string;
  count?: number;
}

const tabs: TabProps[] = [
  { id: 'overview', name: 'Overview' },
  { id: 'jobs', name: 'Jobs Queue' },
  { id: 'workers', name: 'Workers' },
  { id: 'scheduler', name: 'Scheduler' },
  { id: 'logs', name: 'System Logs' },
  { id: 'notifications', name: 'Notifications', count: 0 },
  { id: 'health', name: 'Health Checks' },
  { id: 'cache', name: 'Cache Stats' },
  { id: 'metrics', name: 'Metrics' },
  { id: 'activity', name: 'Activity Timeline' },
];

export default function InfrastructureTabs({ 
  children,
  notificationCount = 0
}: { 
  children: React.ReactNode,
  notificationCount?: number
}) {
  const [activeTab, setActiveTab] = useState('overview');

  // Update notification count dynamically based on props
  const currentTabs = tabs.map(tab => 
    tab.id === 'notifications' ? { ...tab, count: notificationCount } : tab
  );

  return (
    <div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {currentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
              aria-current={activeTab === tab.id ? 'page' : undefined}
            >
              {tab.name}
              {tab.count !== undefined && tab.count > 0 ? (
                <span
                  className={`ml-3 rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block
                    ${
                      activeTab === tab.id
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-gray-100 text-gray-900'
                    }
                  `}
                >
                  {tab.count}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {/* We pass activeTab to children via React.Children.map to render the correct view */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            // @ts-ignore
            if (child.props.tabId === activeTab) {
              return child;
            }
          }
          return null;
        })}
      </div>
    </div>
  );
}
