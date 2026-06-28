import React from 'react';

export default function JobsTable({ jobs }: { jobs: any[] }) {
  if (!jobs || jobs.length === 0) return <p className="text-sm text-gray-500">No active jobs found.</p>;

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Job Type</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Category</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Attempts</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Scheduled At</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {jobs.map((job) => (
            <tr key={job.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{job.job_type}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.job_category}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                  job.status === 'Completed' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                  job.status === 'Failed' || job.status === 'Dead' ? 'bg-red-50 text-red-700 ring-red-600/10' :
                  job.status === 'Running' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                  'bg-yellow-50 text-yellow-800 ring-yellow-600/20'
                }`}>
                  {job.status}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.priority}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{job.attempts} / {job.max_attempts}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {new Date(job.scheduled_at).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
