'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const supabase = await createClient()

  if (!supabase) {
    return { error: 'Supabase is not configured' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  if (supabase) {
    await supabase.auth.signOut()
  }
  // We can't easily know if they were admin or public here, but usually public logs out to home, admin to admin/login
  // Let's just redirect to home. The admin middleware will catch them if they try to access /admin anyway.
  redirect('/')
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  if (!supabase) return { error: 'Supabase is not configured' }

  // Construct origin dynamically so it works in Vercel preview/production without env vars
  const { headers } = require('next/headers');
  const headersList = await headers();
  const host = headersList.get('x-forwarded-host') || headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || (process.env.NODE_ENV === 'development' ? 'http' : 'https');
  const siteUrl = `${protocol}://${host}`;
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/auth/callback?next=/dashboard`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function deleteAccount() {
  const supabase = await createClient()
  if (!supabase) return { error: 'Supabase is not configured' }

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  // Soft delete logic placeholder: update profile to indicate deletion
  // In a real app, you might have an Edge Function to actually delete the user from auth.users
  // or a soft delete flow. We update the profile for now.
  // @ts-ignore
  const { error } = await supabase.from('profiles').update({
    updated_at: new Date().toISOString(),
    // status: 'deleted' // When status column is available
  }).eq('id', user.id)

  if (error) {
    return { error: 'Failed to delete account' }
  }

  await supabase.auth.signOut()
  redirect('/')
}
