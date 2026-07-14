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
  let profile = await fetchProfile();

  if (!profile) {
    // Attempt to auto-repair missing profile for users stuck in limbo
    // (e.g. they authenticated successfully but profile creation failed previously)
    const supabase = await createClient();
    if (supabase) {
      await supabase.from('profiles').insert({
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || null,
        display_name: user.user_metadata?.full_name || null,
        avatar_url: user.user_metadata?.avatar_url || null,
        provider: 'google',
        last_login_at: new Date().toISOString(),
      } as any);

      await supabase.from('user_preferences').insert({
        user_id: user.id,
      } as any);

      // Re-fetch to confirm it worked
      profile = await fetchProfile();
    }

    if (!profile) {
      throw new Error('Your user profile is missing and could not be automatically repaired. Please clear your cookies and log in again.');
    }
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
