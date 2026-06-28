import { createAdminClient } from '../supabase/admin';
import { createJob } from './queue';

export async function runScheduledJobs(): Promise<number> {
  const supabase = createAdminClient();
  if (!supabase) return 0;

  // Find active scheduled jobs that are due
  const { data: scheduledJobs, error } = await (supabase as any)
    .from('scheduled_jobs')
    .select('*')
    .eq('status', 'Active')
    .eq('enabled', true)
    .lte('next_run_at', new Date().toISOString());

  if (error || !scheduledJobs) {
    console.error('Failed to fetch scheduled jobs:', error);
    return 0;
  }

  let enqueued = 0;

  for (const sj of scheduledJobs) {
    // Dispatch as a regular job
    const job = await createJob({
      job_type: sj.job_type,
      job_category: sj.job_category,
      payload: { scheduled_job_id: sj.id },
      created_by: 'scheduler'
    });

    if (job) {
      enqueued++;
      
      // Update last_run_at and next_run_at
      const nextRunAt = calculateNextRun(sj.cron_expression);
      
      await (supabase as any)
        .from('scheduled_jobs')
        .update({
          last_run_at: new Date().toISOString(),
          next_run_at: nextRunAt.toISOString()
        })
        .eq('id', sj.id);
    }
  }

  return enqueued;
}

export function calculateNextRun(cronExpression: string): Date {
  // A robust cron parser is ideal here (e.g. cron-parser)
  // For Phase 11 Part 1, we will implement a simple fallback mapping for common terms
  // e.g. "Every Night", "Weekly", "Daily" 
  
  const now = new Date();
  const lowerCron = cronExpression.toLowerCase();

  if (lowerCron.includes('every 6 hours')) {
    now.setHours(now.getHours() + 6);
  } else if (lowerCron.includes('weekly')) {
    now.setDate(now.getDate() + 7);
  } else if (lowerCron.includes('daily') || lowerCron.includes('every night')) {
    now.setDate(now.getDate() + 1);
  } else {
    // Default to 24 hours if parsing fails
    now.setDate(now.getDate() + 1);
  }

  return now;
}
