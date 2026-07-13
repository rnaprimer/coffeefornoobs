'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema, ProfileFormValues } from '@/lib/validations/profile';
import { updateProfile } from '@/actions/profile';
import { toast } from 'sonner';

interface ProfileFormProps {
  initialData: {
    display_name?: string | null;
    avatar_media_id?: string | null;
  };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isPending, setIsPending] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: initialData.display_name || '',
      avatar_media_id: initialData.avatar_media_id || null,
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsPending(true);
    const result = await updateProfile(data);
    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Profile updated successfully');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div>
        <label htmlFor="display_name" className="block text-sm font-medium text-slate-700">
          Display Name
        </label>
        <div className="mt-1">
          <input
            {...register('display_name')}
            type="text"
            id="display_name"
            className={`shadow-sm focus:ring-amber-500 focus:border-amber-500 block w-full sm:text-sm border-slate-300 rounded-md p-2 border ${errors.display_name ? 'border-red-500' : ''}`}
            placeholder="Coffee Lover"
          />
          {errors.display_name && (
            <p className="mt-2 text-sm text-red-600">{errors.display_name.message}</p>
          )}
        </div>
        <p className="mt-2 text-sm text-slate-500">
          This is the name that will be displayed on your dashboard and public interactions.
        </p>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Profile'}
        </button>
      </div>
    </form>
  );
}
