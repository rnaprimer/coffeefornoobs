import { Job, WorkerContext, WorkerModule } from '../types';
import { logSystemEvent } from '../../infrastructure/logger';
import { createNotification } from '../../infrastructure/notifications';
import { createAdminClient } from '../../supabase/admin';

export const affiliateWorker: WorkerModule = {
  category: 'AFFILIATE',
  processJob: async (job: Job, context: WorkerContext) => {
    const startTime = Date.now();
    await logSystemEvent('AffiliateWorker', `Started job ${job.job_type}`, { job_id: job.id, metadata: job.payload });

    try {
      if (job.job_type === 'LINK_HEALTH_CHECK' || job.job_type === 'LINK_VALIDATION') {
        // Mock logic to simulate link checking
        await new Promise(r => setTimeout(r, 1500));
        
        // Simulate a broken link randomly for testing, or just succeed
        const isBroken = Math.random() > 0.9; 

        if (isBroken) {
          await createNotification({
            type: 'Broken Link',
            title: 'Broken Affiliate Link Detected',
            message: `A simulated broken link was detected during health check (Job: ${job.id}).`,
            severity: 'High',
            action_url: '/admin/merchants'
          });
          throw new Error('Detected broken affiliate link during validation.');
        }

        await logSystemEvent('AffiliateWorker', 'Successfully validated affiliate links', { level: 'Info', job_id: job.id });
      } 
      else if (job.job_type === 'PRICE_MONITOR' || job.job_type === 'PRICE_REFRESH') {
        // Mock price monitoring pipeline
        await new Promise(r => setTimeout(r, 1000));
        await logSystemEvent('AffiliateWorker', 'Price monitoring pipeline executed successfully', { level: 'Info', job_id: job.id });
      }
      else {
        throw new Error(`Unknown job type: ${job.job_type}`);
      }

      await logSystemEvent('AffiliateWorker', `Completed job ${job.job_type}`, { 
        job_id: job.id, 
        duration_ms: Date.now() - startTime 
      });

    } catch (error: any) {
      await logSystemEvent('AffiliateWorker', `Failed job ${job.job_type}: ${error.message}`, { 
        level: 'Error', 
        job_id: job.id, 
        duration_ms: Date.now() - startTime,
        metadata: { stack: error.stack }
      });
      throw error;
    }
  }
};

export default affiliateWorker;
