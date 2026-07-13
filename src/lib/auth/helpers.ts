import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function redirectIfUnauthenticated(redirectTo = '/login') {
  const isAuth = await isAuthenticated();
  if (!isAuth) {
    redirect(redirectTo);
  }
}

export async function redirectIfAuthenticated(redirectTo = '/dashboard') {
  const isAuth = await isAuthenticated();
  if (isAuth) {
    redirect(redirectTo);
  }
}

export { getProfile } from '@/lib/queries/profile';
export { getPreferences } from '@/lib/queries/preferences';
import { getProfile as fetchProfile } from '@/lib/queries/profile';
import { getPreferences as fetchPreferences } from '@/lib/queries/preferences';

export async function requireProfile() {
  const user = await requireUser();
  const profile = await fetchProfile();

  if (!profile) {
    throw new Error('User profile is missing');
  }

  return { user, profile };
}

export async function requirePreferences() {
  const { user, profile } = await requireProfile();
  const preferences = await fetchPreferences();

  if (!preferences) {
    throw new Error('User preferences are missing');
  }

  return { user, profile, preferences };
}
