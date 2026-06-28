import { NextRequest, NextResponse } from 'next/server';
import { runScheduledJobs } from '@/lib/jobs/scheduler';
import { dispatchNow } from '@/lib/jobs/dispatcher';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    // Vercel cron calls this endpoint
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 1. Process scheduled jobs
    const enqueued = await runScheduledJobs();

    // 2. We can also optionally trigger the worker API to process what was just enqueued
    // The dispatch process inside runScheduledJobs will actually trigger the worker, but 
    // we can also just run it immediately or trigger manually.
    
    // Instead of doing nothing, let's enqueue a system health check manually as a test of dispatchNow
    // (Optional, just to ensure system job runs)
    await dispatchNow({
      job_type: 'HealthCheck',
      job_category: 'SYSTEM',
      created_by: 'scheduler_endpoint'
    });

    return NextResponse.json({
      success: true,
      message: `Enqueued ${enqueued} scheduled jobs.`
    });
  } catch (error: any) {
    console.error('Schedule endpoint failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
