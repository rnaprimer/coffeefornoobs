import { lockJob, completeJob, failJob, retryJob } from './queue';
import { processJob } from './processor';
import { WorkerContext } from './types';

const WORKER_NAME = 'vercel-serverless-worker'; // We could append a random UUID if we needed multi-worker distinct logs

/**
 * Execution engine to run jobs.
 * This runs continuously (up to the execution limit of the serverless function).
 */
export async function runWorker(maxExecutionTimeMs = 50000): Promise<number> {
  const startTime = Date.now();
  let jobsProcessed = 0;

  // We loop until we reach the max execution time (e.g. 50s on Vercel)
  while (Date.now() - startTime < maxExecutionTimeMs) {
    const job = await lockJob(WORKER_NAME);
    
    if (!job) {
      // No more jobs in the queue
      break;
    }

    const jobStartTime = Date.now();
    try {
      const context: WorkerContext = {
        jobId: job.id,
        correlationId: job.correlation_id,
        attempts: job.attempts + 1
      };

      await processJob(job, context);
      
      const durationMs = Date.now() - jobStartTime;
      await completeJob(job.id, durationMs);
      jobsProcessed++;
      
    } catch (error: any) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      await retryJob(job.id, job.attempts + 1, job.max_attempts, errorMsg);
    }
  }

  return jobsProcessed;
}
