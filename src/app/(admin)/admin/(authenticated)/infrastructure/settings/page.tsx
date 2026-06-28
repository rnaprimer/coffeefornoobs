import React from 'react';

export const metadata = {
  title: 'Infrastructure Settings | CoffeeForNoobs Admin',
};

export default function InfrastructureSettings() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Infrastructure Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure retry counts, worker timeouts, cache TTLs, and maintenance mode.
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Settings Foundation</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Configuration options will be available in future phases.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
