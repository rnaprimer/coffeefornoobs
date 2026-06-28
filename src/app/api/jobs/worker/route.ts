import { NextRequest, NextResponse } from 'next/server';
import { runWorker } from '@/lib/jobs/worker';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // We can add a secret token check here if we want to restrict who can trigger the worker API
  // However, it's just processing the queue, so it's generally safe.
  
  // Vercel serverless functions usually timeout at 10s for Hobby, 60s for Pro.
  // We set a safe margin to allow cleanup before timeout.
  const maxExecutionTimeMs = 8000; // 8 seconds for Hobby compatibility
  
  try {
    const jobsProcessed = await runWorker(maxExecutionTimeMs);
    
    return NextResponse.json({
      success: true,
      message: `Processed ${jobsProcessed} jobs.`
    });
  } catch (error: any) {
    console.error('Worker endpoint failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
