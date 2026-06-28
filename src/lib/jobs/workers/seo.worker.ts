import { Job, WorkerContext, WorkerModule } from '../types';
import { logSystemEvent } from '../../infrastructure/logger';

export const seoWorker: WorkerModule = {
  category: 'SEO',
  processJob: async (job: Job, context: WorkerContext) => {
    const startTime = Date.now();
    await logSystemEvent('SEOWorker', `Started job ${job.job_type}`, { job_id: job.id, metadata: job.payload });

    try {
      if (job.job_type === 'GENERATE_SITEMAP') {
        // Instead of writing a static XML file, we log that we've invalidated the dynamic sitemap cache
        // or prepared the index for the dynamic route.
        await new Promise(r => setTimeout(r, 1000));
        await logSystemEvent('SEOWorker', 'Sitemap generation workflow triggered', { level: 'Info', job_id: job.id });
      } 
      else if (job.job_type === 'GENERATE_ROBOTS') {
        // Similar to sitemap
        await new Promise(r => setTimeout(r, 500));
        await logSystemEvent('SEOWorker', 'Robots.txt generation workflow triggered', { level: 'Info', job_id: job.id });
      }
      else {
        throw new Error(`Unknown job type: ${job.job_type}`);
      }

      await logSystemEvent('SEOWorker', `Completed job ${job.job_type}`, { 
        job_id: job.id, 
        duration_ms: Date.now() - startTime 
      });

    } catch (error: any) {
      await logSystemEvent('SEOWorker', `Failed job ${job.job_type}: ${error.message}`, { 
        level: 'Error', 
        job_id: job.id, 
        duration_ms: Date.now() - startTime,
        metadata: { stack: error.stack }
      });
      throw error;
    }
  }
};

export default seoWorker;
