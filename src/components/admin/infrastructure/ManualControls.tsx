'use client';

import React, { useState } from 'react';
import { triggerScheduledJobs, triggerWorker, dispatchManualJob } from '@/app/(admin)/admin/(authenticated)/infrastructure/actions';
import { Play, RefreshCw, Server, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManualControls() {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleAction = async (actionId: string, actionFn: () => Promise<any>) => {
    setLoading(actionId);
    try {
      const res = await actionFn();
      if (res.success) {
        alert(res.message);
      } else {
        alert(`Error: ${res.message}`);
      }
      router.refresh();
    } catch (err: any) {
      alert(`Unexpected error: ${err.message}`);
    } finally {
      setLoading(null);
    }
  };

  const manualJobs = [
    { id: 'health', name: 'Run Health Check', type: 'HEALTH_CHECK', category: 'SYSTEM' },
    { id: 'cache', name: 'Refresh Cache', type: 'CACHE_REFRESH', category: 'CACHE' },
    { id: 'sitemap', name: 'Generate Sitemap', type: 'GENERATE_SITEMAP', category: 'SEO' },
    { id: 'robots', name: 'Generate Robots', type: 'GENERATE_ROBOTS', category: 'SEO' },
  ];

  return (
    <div className="bg-white shadow sm:rounded-lg mb-8">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Manual Infrastructure Controls</h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>
            Vercel Cron is disabled during development (Hobby Plan compatibility). 
            Use these controls to manually execute background processes.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={() => handleAction('schedule', triggerScheduledJobs)}
            disabled={loading !== null}
            className="inline-flex items-center rounded-md bg-amber-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 disabled:opacity-50"
          >
            <Play className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {loading === 'schedule' ? 'Running...' : 'Run Scheduled Jobs'}
          </button>
          
          <button
            type="button"
            onClick={() => handleAction('worker', triggerWorker)}
            disabled={loading !== null}
            className="inline-flex items-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50"
          >
            <Server className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            {loading === 'worker' ? 'Running...' : 'Run Worker API'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Dispatch Individual Jobs</h4>
          <div className="flex flex-wrap gap-3">
            {manualJobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => handleAction(job.id, () => dispatchManualJob(job.type, job.category))}
                disabled={loading !== null}
                className="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:opacity-50"
              >
                <Zap className="-ml-0.5 mr-1.5 h-4 w-4 text-amber-500" aria-hidden="true" />
                {loading === job.id ? 'Dispatching...' : job.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
