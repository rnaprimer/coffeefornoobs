export type JobCategory = 'SEARCH' | 'CACHE' | 'MEDIA' | 'AFFILIATE' | 'SEO' | 'SYSTEM' | 'ANALYTICS';
export type JobStatus = 'Pending' | 'Running' | 'Retrying' | 'Completed' | 'Failed' | 'Cancelled' | 'Expired' | 'Dead';
export type JobPriority = 'Low' | 'Normal' | 'High' | 'Critical';

export interface JobPayload {
  [key: string]: any;
}

export interface Job {
  id: string;
  job_type: string;
  job_category: JobCategory;
  payload: JobPayload;
  status: JobStatus;
  priority: JobPriority;
  worker_name?: string;
  attempts: number;
  max_attempts: number;
  retry_after?: string;
  timeout_seconds: number;
  execution_time_ms?: number;
  locked_at?: string;
  locked_by?: string;
  parent_job_id?: string;
  correlation_id?: string;
  scheduled_at: string;
  started_at?: string;
  completed_at?: string;
  failed_at?: string;
  error_message?: string;
  created_by?: string;
  created_at: string;
}

export interface JobCreationData {
  job_type: string;
  job_category: JobCategory;
  payload?: JobPayload;
  priority?: JobPriority;
  max_attempts?: number;
  timeout_seconds?: number;
  parent_job_id?: string;
  correlation_id?: string;
  scheduled_at?: string;
  created_by?: string;
}

export interface WorkerContext {
  jobId: string;
  correlationId?: string;
  attempts: number;
}

export interface WorkerModule {
  category: JobCategory;
  processJob: (job: Job, context: WorkerContext) => Promise<void>;
}
