import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Activity, Cpu, AlertTriangle } from 'lucide-react';
import InfrastructureTabs from '@/components/admin/infrastructure/InfrastructureTabs';
import { TabPanel } from '@/components/admin/infrastructure/TabPanel';
import LogsTable from '@/components/admin/infrastructure/LogsTable';
import NotificationsList from '@/components/admin/infrastructure/NotificationsList';
import JobsTable from '@/components/admin/infrastructure/JobsTable';
import HealthStatus from '@/components/admin/infrastructure/HealthStatus';
import ActivityTimeline from '@/components/admin/infrastructure/ActivityTimeline';
import ManualControls from '@/components/admin/infrastructure/ManualControls';

export const metadata = {
  title: 'Infrastructure Dashboard | CoffeeForNoobs Admin',
};

// Revalidate every 60 seconds or make dynamic
export const revalidate = 0;

export default async function InfrastructureDashboard() {
  const supabase = await createClient();
  if (!supabase) return null;

  // 1. Fetch Summary Stats
  const { count: pendingJobsCount } = await (supabase as any)
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Pending', 'Retrying']);

  const { count: activeWorkersCount } = await (supabase as any)
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Running');

  const { count: failedJobsCount } = await (supabase as any)
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .in('status', ['Failed', 'Dead']);

  // 2. Fetch Unresolved Notifications
  const { data: notifications } = await (supabase as any)
    .from('system_notifications')
    .select('*')
    .eq('resolved', false)
    .order('created_at', { ascending: false });

  // 3. Fetch Recent Logs
  const { data: logs } = await (supabase as any)
    .from('system_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  // 4. Fetch Active/Recent Jobs
  const { data: jobs } = await (supabase as any)
    .from('jobs')
    .select('*')
    .order('scheduled_at', { ascending: false })
    .limit(20);

  // 5. Fetch Health Status
  const { data: healthChecks } = await (supabase as any)
    .from('system_health')
    .select('*')
    .order('component', { ascending: true });

  // 6. Fetch Activity Timeline
  const { data: activities } = await (supabase as any)
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold leading-6 text-gray-900">Infrastructure Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Platform health, background jobs, worker activity, and system alerts.
          </p>
        </div>
      </div>

      <InfrastructureTabs notificationCount={notifications?.length || 0}>
        
        {/* OVERVIEW TAB */}
        <TabPanel tabId="overview">
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
              <dt>
                <div className="absolute rounded-md bg-amber-500 p-3">
                  <Activity className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">Pending Jobs</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{pendingJobsCount || 0}</p>
              </dd>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
              <dt>
                <div className="absolute rounded-md bg-amber-500 p-3">
                  <Cpu className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">Active Workers</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{activeWorkersCount || 0}</p>
              </dd>
            </div>

            <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6">
              <dt>
                <div className="absolute rounded-md bg-red-500 p-3">
                  <AlertTriangle className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">Failed / Dead Jobs</p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                <p className="text-2xl font-semibold text-gray-900">{failedJobsCount || 0}</p>
              </dd>
            </div>
          </dl>

          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Critical Notifications</h3>
              <NotificationsList notifications={notifications?.slice(0, 3) || []} />
            </div>
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">System Health</h3>
              <HealthStatus healthChecks={healthChecks || []} />
            </div>
          </div>
        </TabPanel>

        {/* JOBS TAB */}
        <TabPanel tabId="jobs">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent & Active Jobs</h3>
          </div>
          <JobsTable jobs={jobs || []} />
        </TabPanel>

        {/* WORKERS TAB */}
        <TabPanel tabId="workers">
          <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Worker Modules</h3>
            <p className="mt-1 text-sm text-gray-500">Available background execution engines.</p>
            <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {['SEARCH', 'CACHE', 'AFFILIATE', 'MEDIA', 'SEO', 'SYSTEM'].map(worker => (
                <li key={worker} className="rounded-md border border-gray-200 px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-400 mr-3"></div>
                    <span className="text-sm font-medium text-gray-900">{worker}_WORKER</span>
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Active</span>
                </li>
              ))}
            </ul>
          </div>
        </TabPanel>

        {/* SCHEDULER TAB */}
        <TabPanel tabId="scheduler">
          <ManualControls />
          
          <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6 mt-8">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Cron Configuration</h3>
            <p className="mt-1 text-sm text-gray-500">Vercel Cron has been disabled for Hobby plan compatibility. You can manually run the scheduler above, or rename <code>vercel.prod.json</code> to <code>vercel.json</code> when upgrading to a Pro plan.</p>
            <p className="mt-2 text-sm text-gray-500">The scheduler evaluates the following recurring tasks.</p>
          </div>
        </TabPanel>

        {/* LOGS TAB */}
        <TabPanel tabId="logs">
          <div className="mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Infrastructure Logs</h3>
          </div>
          <LogsTable logs={logs || []} />
        </TabPanel>

        {/* NOTIFICATIONS TAB */}
        <TabPanel tabId="notifications">
          <div className="mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">System Alerts & Notifications</h3>
          </div>
          <NotificationsList notifications={notifications || []} />
        </TabPanel>

        {/* HEALTH TAB */}
        <TabPanel tabId="health">
          <div className="mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Subsystem Health</h3>
          </div>
          <HealthStatus healthChecks={healthChecks || []} />
        </TabPanel>
        
        {/* CACHE TAB */}
        <TabPanel tabId="cache">
          <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Cache Statistics</h3>
            <p className="mt-1 text-sm text-gray-500">Next.js Data Cache metadata is tracked by the cache worker.</p>
          </div>
        </TabPanel>
        
        {/* METRICS TAB */}
        <TabPanel tabId="metrics">
          <div className="bg-white shadow sm:rounded-lg px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Operational Metrics</h3>
            <p className="mt-1 text-sm text-gray-500">Detailed throughput and performance analytics will be added here in Phase 12.</p>
          </div>
        </TabPanel>
        
        {/* ACTIVITY TAB */}
        <TabPanel tabId="activity">
          <div className="mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Administrator Activity</h3>
            <p className="text-sm text-gray-500">Audit trail of significant manual actions.</p>
          </div>
          <ActivityTimeline activities={activities || []} />
        </TabPanel>

      </InfrastructureTabs>
    </div>
  );
}
