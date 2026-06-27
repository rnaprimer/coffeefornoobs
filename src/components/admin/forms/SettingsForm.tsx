'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import PageHeader from '@/components/admin/ui/PageHeader'
import AdminForm from '@/components/admin/ui/AdminForm'

interface SettingsFormProps {
  initialSettings: Record<string, string>
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    siteName: initialSettings.site_name || 'Coffee For Noobs',
    contactEmail: initialSettings.contact_email || 'hello@coffeefornoobs.com',
    defaultSeoTitle: initialSettings.default_seo_title || 'Coffee For Noobs | Your Coffee Journey Starts Here',
    defaultSeoDescription: initialSettings.default_seo_description || 'Learn how to make great coffee at home.',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      if (!supabase) {
        throw new Error('Supabase not configured')
      }
      
      // Get current user for updated_by
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id

      // Upsert each setting
      const settingsToUpsert = [
        { key: 'site_name', value: `"${formData.siteName}"`, updated_by: userId },
        { key: 'contact_email', value: `"${formData.contactEmail}"`, updated_by: userId },
        { key: 'default_seo_title', value: `"${formData.defaultSeoTitle}"`, updated_by: userId },
        { key: 'default_seo_description', value: `"${formData.defaultSeoDescription}"`, updated_by: userId },
      ]

      for (const setting of settingsToUpsert) {
        const { error } = await supabase
          .from('settings' as any)
          .upsert(setting as any, { onConflict: 'key' })
        
        if (error) throw error
      }

      toast.success('Settings updated successfully')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating settings:', error)
      toast.error(error.message || 'Failed to update settings')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <PageHeader title="Site Settings" />
      
      <AdminForm 
        onSubmit={onSubmit} 
        cancelHref="/admin"
        isSaving={isSaving}
        saveLabel="Save Settings"
      >
        <div className="sm:col-span-4">
          <label htmlFor="siteName" className="block text-sm font-medium leading-6 text-gray-900">Site Name</label>
          <div className="mt-2">
            <input
              type="text"
              name="siteName"
              id="siteName"
              value={formData.siteName}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>
        </div>

        <div className="sm:col-span-4">
          <label htmlFor="contactEmail" className="block text-sm font-medium leading-6 text-gray-900">Contact Email</label>
          <div className="mt-2">
            <input
              type="email"
              name="contactEmail"
              id="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>
        </div>

        <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
          <h3 className="text-sm font-medium leading-6 text-gray-900">Global SEO Defaults</h3>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="defaultSeoTitle" className="block text-sm font-medium leading-6 text-gray-900">Default SEO Title</label>
          <div className="mt-2">
            <input
              type="text"
              name="defaultSeoTitle"
              id="defaultSeoTitle"
              value={formData.defaultSeoTitle}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="defaultSeoDescription" className="block text-sm font-medium leading-6 text-gray-900">Default SEO Description</label>
          <div className="mt-2">
            <input
              type="text"
              name="defaultSeoDescription"
              id="defaultSeoDescription"
              value={formData.defaultSeoDescription}
              onChange={handleChange}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
            />
          </div>
        </div>
      </AdminForm>
    </>
  )
}
