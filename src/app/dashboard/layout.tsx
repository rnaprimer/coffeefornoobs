import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { requireProfile } from '@/lib/auth/helpers';

export const metadata = {
  title: 'Dashboard - CoffeeForNoobs',
  description: 'Your personalized coffee dashboard',
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireProfile();

  return (
    <DashboardLayout user={user} profile={profile}>
      {children}
    </DashboardLayout>
  );
}
