import React from 'react';
import Link from 'next/link';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {description}
          </p>
        </div>
        <div className="mt-8 space-y-6">
          {children}
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-medium text-amber-600 hover:text-amber-500">
            &larr; Back to CoffeeForNoobs
          </Link>
        </div>
      </div>
    </div>
  );
}
