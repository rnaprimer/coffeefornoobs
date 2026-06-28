import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function test() {
  const { error } = await supabase.from('jobs').select('id').limit(1);
  if (error) {
    console.error("Schema not applied yet:", error.message);
    return;
  }
  
  // Insert a test job
  console.log("Dispatching test job...");
  const { data: job, error: insertError } = await supabase.from('jobs').insert({
    job_type: 'HEALTH_CHECK',
    job_category: 'SYSTEM',
    payload: { test: true },
    status: 'Pending',
    priority: 'Normal'
  }).select().single();
  
  if (insertError) {
    console.error("Failed to insert job:", insertError);
    return;
  }
  
  console.log("Job inserted:", job.id);
  console.log("Triggering worker endpoint...");
  
  try {
    const res = await fetch('http://localhost:3000/api/jobs/worker', {
      method: 'POST'
    });
    const result = await res.json();
    console.log("Worker response:", result);
  } catch(e) {
    console.error("Worker fetch failed (is dev server running on 3000?):", e);
  }
}

test();
