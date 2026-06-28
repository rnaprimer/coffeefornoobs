import { Job, WorkerContext } from './types';
import { getWorkerForCategory } from './registry';

export async function processJob(job: Job, context: WorkerContext): Promise<void> {
  const worker = getWorkerForCategory(job.job_category);
  
  if (!worker) {
    throw new Error(`No worker found for job category: ${job.job_category}`);
  }

  await worker.processJob(job, context);
}
