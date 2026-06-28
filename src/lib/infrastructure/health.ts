import { createAdminClient } from '../supabase/admin';

export type HealthStatusType = 'Healthy' | 'Warning' | 'Critical'; // Matches requirement, though schema says 'Healthy', 'Degraded', 'Down', 'Maintenance'. We'll map them.

function mapStatus(status: HealthStatusType): string {
  if (status === 'Healthy') return 'Healthy';
  if (status === 'Warning') return 'Degraded';
  if (status === 'Critical') return 'Down';
  return 'Healthy';
}

export async function updateHealthStatus(component: string, status: HealthStatusType, details: any = {}) {
  const supabase = createAdminClient();
  if (!supabase) return;

  const mappedStatus = mapStatus(status);

  await (supabase as any)
    .from('system_health')
    .upsert({
      component,
      status: mappedStatus,
      details,
      last_checked: new Date().toISOString()
    }, { onConflict: 'component' });
}
