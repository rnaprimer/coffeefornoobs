import { createAdminClient } from '../supabase/admin';

export type LogLevel = 'Info' | 'Warning' | 'Error' | 'Critical';

interface LogOptions {
  level?: LogLevel;
  context?: string;
  metadata?: any;
  job_id?: string;
  entity_type?: string;
  entity_id?: string;
  duration_ms?: number;
}

export async function logSystemEvent(source: string, message: string, options: LogOptions = {}) {
  const supabase = createAdminClient();
  if (!supabase) return;

  const {
    level = 'Info',
    context,
    metadata,
    job_id,
    entity_type,
    entity_id,
    duration_ms
  } = options;

  await (supabase as any)
    .from('system_logs')
    .insert([{
      source,
      message,
      level,
      context,
      metadata,
      job_id,
      entity_type,
      entity_id,
      duration_ms
    }]);
}

export async function logActivity(userId: string | null, action: string, description: string, entityType?: string, entityId?: string, metadata?: any) {
  const supabase = createAdminClient();
  if (!supabase) return;

  await (supabase as any)
    .from('activity_logs')
    .insert([{
      user_id: userId,
      action,
      description,
      entity_type: entityType,
      entity_id: entityId,
      metadata
    }]);
}
