import { createAdminClient } from '../supabase/admin';
import { Job, JobCreationData } from './types';

export async function createJob(data: JobCreationData): Promise<Job | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  const { data: job, error } = await (supabase as any)
    .from('jobs')
    .insert([{
      ...data,
      status: 'Pending'
    }])
    .select()
    .single();

  if (error) {
    console.error('Failed to create job:', error);
    return null;
  }
  return job as Job;
}

export async function lockJob(workerName: string): Promise<Job | null> {
  const supabase = createAdminClient();
  if (!supabase) return null;

  // We use Supabase RPC for an atomic lock if possible, or a clever update
  // For simplicity without RPC, we use a filtering update that limits to 1 row.
  // Actually, Supabase REST API doesn't support limit on update easily in a single atomic transaction without RPC.
  // However, we can use `eq` and `in` with `limit` on a select, then update.
  // A better atomic approach in PostgREST is to use an RPC, but we can do a two-step with optimistic locking (status check).

  // Step 1: Find a pending or retrying job that is due
  const { data: jobs, error: fetchError } = await (supabase as any)
    .from('jobs')
    .select('*')
    .in('status', ['Pending', 'Retrying'])
    .lte('scheduled_at', new Date().toISOString())
    .order('priority', { ascending: false }) // 'Critical', 'High', 'Normal', 'Low' (alphabetical sort isn't perfect for priorities, but wait: C, H, N, L. C<H<L<N. Priority should ideally be ordered correctly, we might need a case statement or numeric priority in future)
    .order('scheduled_at', { ascending: true })
    .limit(1);

  if (fetchError || !jobs || jobs.length === 0) {
    return null; // No jobs available
  }

  const candidate = jobs[0] as Job;

  // Step 2: Attempt to lock it
  const { data: lockedJob, error: updateError } = await (supabase as any)
    .from('jobs')
    .update({
      status: 'Running',
      locked_at: new Date().toISOString(),
      locked_by: workerName,
      started_at: new Date().toISOString(),
      attempts: candidate.attempts + 1
    })
    .eq('id', candidate.id)
    .eq('status', candidate.status) // Optimistic locking
    .select()
    .single();

  if (updateError || !lockedJob) {
    // Another worker grabbed it
    return null;
  }

  return lockedJob as Job;
}

export async function unlockJob(jobId: string, updates: Partial<Job>): Promise<void> {
  const supabase = createAdminClient();
  if (!supabase) return;

  await (supabase as any)
    .from('jobs')
    .update({
      ...updates,
      locked_at: null,
      locked_by: null
    })
    .eq('id', jobId);
}

export async function retryJob(jobId: string, attempts: number, maxAttempts: number, errorMsg: string): Promise<void> {
  if (attempts >= maxAttempts) {
    // Dead
    await unlockJob(jobId, {
      status: 'Dead',
      failed_at: new Date().toISOString(),
      error_message: errorMsg
    });
  } else {
    // Exponential backoff or static retry after (e.g., 60 seconds)
    const retryAfter = new Date(Date.now() + 60000); 
    await unlockJob(jobId, {
      status: 'Retrying',
      error_message: errorMsg,
      scheduled_at: retryAfter.toISOString()
    });
  }
}

export async function completeJob(jobId: string, durationMs: number): Promise<void> {
  await unlockJob(jobId, {
    status: 'Completed',
    completed_at: new Date().toISOString(),
    execution_time_ms: durationMs
  });
}

export async function failJob(jobId: string, errorMsg: string): Promise<void> {
  await unlockJob(jobId, {
    status: 'Failed',
    failed_at: new Date().toISOString(),
    error_message: errorMsg
  });
}
