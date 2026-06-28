'use server';

import { dispatchNow } from '@/lib/jobs/dispatcher';
import { runScheduledJobs } from '@/lib/jobs/scheduler';

export async function triggerScheduledJobs() {
  try {
    const enqueued = await runScheduledJobs();
    return { success: true, message: `Enqueued ${enqueued} scheduled jobs.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function triggerWorker() {
  try {
    // In server actions we can't easily trigger the background async worker without holding the connection
    // But we can trigger the API route from the server side or just fetch it
    // The easiest way is to hit the local endpoint since it handles the async detachment
    
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    await fetch(`${baseUrl}/api/jobs/worker`, { method: 'POST' });
    
    return { success: true, message: 'Worker triggered successfully. It will run in the background.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function dispatchManualJob(jobType: string, jobCategory: string, payload: any = {}) {
  try {
    await dispatchNow({
      job_type: jobType,
      job_category: jobCategory as any,
      payload,
      created_by: 'admin_manual_trigger'
    });
    return { success: true, message: `Dispatched ${jobType} job.` };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
