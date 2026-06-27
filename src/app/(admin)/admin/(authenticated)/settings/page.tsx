import { createClient } from '@/lib/supabase/server'
import SettingsForm from '@/components/admin/forms/SettingsForm'

export const metadata = {
  title: 'Settings - Admin',
}

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()

  if (!supabase) {
    return <div>Supabase not configured</div>
  }

  const { data: settingsData, error } = await supabase
    .from('settings')
    .select('key, value')

  if (error) {
    console.error('Error fetching settings:', error)
  }

  // Convert settings array to object
  const settingsObj: Record<string, string> = {}
  
  if (settingsData) {
    (settingsData as any[]).forEach(setting => {
      try {
        // Value is stored as JSONB, so it might be a quoted string like '"Coffee For Noobs"'
        let parsed = setting.value
        if (typeof parsed === 'string' && parsed.startsWith('"') && parsed.endsWith('"')) {
          parsed = JSON.parse(parsed)
        }
        settingsObj[setting.key] = parsed
      } catch (e) {
        settingsObj[setting.key] = setting.value as any
      }
    })
  }

  return <SettingsForm initialSettings={settingsObj} />
}
