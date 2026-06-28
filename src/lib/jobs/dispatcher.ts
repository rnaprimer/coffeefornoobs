import { Job, JobCreationData } from './types';
import { createJob } from './queue';

/**
 * Dispatcher is the sole entry point for enqueuing background tasks.
 * Application code should NEVER insert directly into the jobs table.
 */
export async function dispatch(data: JobCreationData): Promise<Job | null> {
  const job = await createJob(data);
  if (job) {
    triggerWorkerAsynchronously();
  }
  return job;
}

export async function dispatchNow(data: JobCreationData): Promise<Job | null> {
  return dispatch({ ...data, priority: 'Critical' });
}

export async function dispatchDelayed(data: JobCreationData, delaySeconds: number): Promise<Job | null> {
  const scheduled_at = new Date(Date.now() + delaySeconds * 1000).toISOString();
  return dispatch({ ...data, scheduled_at });
}

function triggerWorkerAsynchronously() {
  // Fire and forget fetch to our own worker API endpoint
  // We use NEXT_PUBLIC_SITE_URL or VERCEL_URL. In development, fallback to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
    || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  
  // We don't await this so it runs independently in the background
  fetch(`${baseUrl}/api/jobs/worker`, { method: 'POST' })
    .catch((err) => {
      // It's ok if this fails; the Vercel Cron will eventually pick up the job anyway.
      console.warn('Failed to trigger background worker asynchronously:', err);
    });
}
