import { Job, WorkerContext, WorkerModule } from '../types';
import { logSystemEvent } from '../../infrastructure/logger';

export const searchWorker: WorkerModule = {
  category: 'SEARCH',
  processJob: async (job: Job, context: WorkerContext) => {
    const startTime = Date.now();
    await logSystemEvent('SearchWorker', `Started job ${job.job_type}`, { job_id: job.id, metadata: job.payload });

    try {
      if (job.job_type === 'SEARCH_REINDEX') {
        // Mock reindexing logic
        await new Promise(r => setTimeout(r, 1500));
        await logSystemEvent('SearchWorker', 'Successfully reindexed search documents', { level: 'Info', job_id: job.id });
      } 
      else if (job.job_type === 'SEARCH_DELETE') {
        // Mock delete logic
        await new Promise(r => setTimeout(r, 500));
        await logSystemEvent('SearchWorker', `Deleted document ${job.payload.entityId} from search index`, { level: 'Info', job_id: job.id });
      }
      else if (job.job_type === 'SEARCH_REFRESH') {
        // Mock refresh logic
        await new Promise(r => setTimeout(r, 1000));
      }
      else {
        throw new Error(`Unknown job type: ${job.job_type}`);
      }

      await logSystemEvent('SearchWorker', `Completed job ${job.job_type}`, { 
        job_id: job.id, 
        duration_ms: Date.now() - startTime 
      });

    } catch (error: any) {
      await logSystemEvent('SearchWorker', `Failed job ${job.job_type}: ${error.message}`, { 
        level: 'Error', 
        job_id: job.id, 
        duration_ms: Date.now() - startTime,
        metadata: { stack: error.stack }
      });
      throw error;
    }
  }
};

export default searchWorker;
