import { createAdminClient } from '../supabase/admin';

export type NotificationSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

interface NotificationData {
  type: string;
  title: string;
  message: string;
  severity: NotificationSeverity;
  action_url?: string;
}

export async function createNotification(data: NotificationData) {
  const supabase = createAdminClient();
  if (!supabase) return;

  await (supabase as any)
    .from('system_notifications')
    .insert([data]);
}

export async function resolveNotification(id: string, userId: string) {
  const supabase = createAdminClient();
  if (!supabase) return;

  await (supabase as any)
    .from('system_notifications')
    .update({
      resolved: true,
      resolved_at: new Date().toISOString(),
      resolved_by: userId
    })
    .eq('id', id);
}
