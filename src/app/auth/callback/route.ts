import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.redirect(`${origin}/login?error=SupabaseNotConfigured`);
    }
    const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
      const user = session.user;
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!profile && profileError?.code === 'PGRST116') {
        // Profile does not exist, create it
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || null,
          display_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
          provider: 'google',
          last_login_at: new Date().toISOString(),
        } as any);

        // Create default user preferences
        await supabase.from('user_preferences').insert({
          user_id: user.id,
        } as any);
      } else if (profile) {
        // Update last_login_at
        // @ts-ignore
        await supabase.from('profiles').update({
          last_login_at: new Date().toISOString(),
        }).eq('id', user.id);
      }

      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
