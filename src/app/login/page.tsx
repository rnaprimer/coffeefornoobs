import React, { Suspense } from 'react';
import { AuthCard } from '@/components/auth/AuthCard';
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton';
import { redirectIfAuthenticated } from '@/lib/auth/helpers';

export const metadata = {
  title: 'Login - CoffeeForNoobs',
  description: 'Sign in to your CoffeeForNoobs account',
};

export default async function LoginPage() {
  await redirectIfAuthenticated('/dashboard');

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <AuthCard
        title="Welcome Back"
        description="Sign in to save your favorite coffee setups, track your brewing journey, and get personalized recommendations."
      >
        <GoogleLoginButton />
        
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </AuthCard>
    </Suspense>
  );
}
