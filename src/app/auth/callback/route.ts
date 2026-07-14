import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const cookieStore = await cookies();
    const forwardedHost = request.headers.get('x-forwarded-host');
    const isLocalEnv = process.env.NODE_ENV === 'development';
    
    let redirectUrl = `${origin}${next}`;
    if (!isLocalEnv && forwardedHost) {
      redirectUrl = `https://${forwardedHost}${next}`;
    }

    const response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Set on the request so the rest of the handler sees it
              cookieStore.set(name, value, options);
              // Explicitly set on the response we're about to return
              response.cookies.set({
                name,
                value,
                ...options,
              });
            });
          },
        },
      }
    );

    const { error, data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && session?.user) {
      const user = session.user;
      
      // Use the admin client to bypass RLS when creating the initial profile,
      // because the current anon client doesn't have the user's JWT yet.
      const { createAdminClient } = require('@/lib/supabase/admin');
      const supabaseAdmin = createAdminClient();
      
      if (supabaseAdmin) {
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile && profileError?.code === 'PGRST116') {
          await supabaseAdmin.from('profiles').insert({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || null,
            display_name: user.user_metadata?.full_name || null,
            avatar_url: user.user_metadata?.avatar_url || null,
            provider: 'google',
            last_login_at: new Date().toISOString(),
          } as any);

          await supabaseAdmin.from('user_preferences').insert({
            user_id: user.id,
          } as any);
        } else if (profile) {
          // @ts-ignore
          await supabaseAdmin.from('profiles').update({
            last_login_at: new Date().toISOString(),
          }).eq('id', user.id);
        }
      }

      // @ts-ignore
      const { revalidatePath } = require('next/cache');
      revalidatePath('/', 'layout');

      return response;
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`);
}
