import { Job, WorkerContext, WorkerModule } from '../types';
import { logSystemEvent } from '../../infrastructure/logger';
import { clearCacheGroupMetadata } from '../../cache/cache';

export const cacheWorker: WorkerModule = {
  category: 'CACHE',
  processJob: async (job: Job, context: WorkerContext) => {
    const startTime = Date.now();
    await logSystemEvent('CacheWorker', `Started job ${job.job_type}`, { job_id: job.id, metadata: job.payload });

    try {
      if (job.job_type === 'CACHE_CLEAR') {
        if (job.payload?.group) {
          await clearCacheGroupMetadata(job.payload.group);
          await logSystemEvent('CacheWorker', `Cleared cache group ${job.payload.group}`, { level: 'Info', job_id: job.id });
        } else {
          // Clear all or specific mock logic
          await new Promise(r => setTimeout(r, 500));
        }
      } 
      else if (job.job_type === 'CACHE_REFRESH' || job.job_type === 'CACHE_REVALIDATE') {
        // Mock revalidation processing (actual revalidation functions like revalidateBean must be called directly from server actions mostly, but we can trigger them here if needed via specific routes)
        await new Promise(r => setTimeout(r, 1000));
        await logSystemEvent('CacheWorker', `Processed cache refresh for payload ${JSON.stringify(job.payload)}`, { level: 'Info', job_id: job.id });
      }
      else {
        throw new Error(`Unknown job type: ${job.job_type}`);
      }

      await logSystemEvent('CacheWorker', `Completed job ${job.job_type}`, { 
        job_id: job.id, 
        duration_ms: Date.now() - startTime 
      });

    } catch (error: any) {
      await logSystemEvent('CacheWorker', `Failed job ${job.job_type}: ${error.message}`, { 
        level: 'Error', 
        job_id: job.id, 
        duration_ms: Date.now() - startTime,
        metadata: { stack: error.stack }
      });
      throw error;
    }
  }
};

export default cacheWorker;
