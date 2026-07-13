'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { preferencesSchema, PreferencesFormValues } from '@/lib/validations/preferences';
import { updatePreferences } from '@/actions/preferences';
import { toast } from 'sonner';

interface PreferencesFormProps {
  initialData: any;
}

export function PreferencesForm({ initialData }: PreferencesFormProps) {
  const [isPending, setIsPending] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      experience_level: initialData?.experience_level || 'Beginner',
      preferred_brew_method: initialData?.preferred_brew_method || 'Espresso',
      budget_range: initialData?.budget_range || 'Under ₹5k',
      preferred_roast_level: initialData?.preferred_roast_level || 'Medium',
      preferred_currency: initialData?.preferred_currency || 'INR',
    },
  });

  const onSubmit = async (data: PreferencesFormValues) => {
    setIsPending(true);
    const result = await updatePreferences(data);
    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Preferences updated successfully');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="experience_level" className="block text-sm font-medium text-slate-700">
            Coffee Experience
          </label>
          <select
            id="experience_level"
            {...register('experience_level')}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md border ${errors.experience_level ? 'border-red-500' : ''}`}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          {errors.experience_level && <p className="mt-1 text-sm text-red-600">{errors.experience_level.message}</p>}
        </div>

        <div>
          <label htmlFor="preferred_brew_method" className="block text-sm font-medium text-slate-700">
            Preferred Brew Method
          </label>
          <select
            id="preferred_brew_method"
            {...register('preferred_brew_method')}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md border ${errors.preferred_brew_method ? 'border-red-500' : ''}`}
          >
            <option value="Espresso">Espresso</option>
            <option value="Aeropress">Aeropress</option>
            <option value="Pour Over">Pour Over</option>
            <option value="French Press">French Press</option>
            <option value="Moka Pot">Moka Pot</option>
            <option value="Cold Brew">Cold Brew</option>
          </select>
          {errors.preferred_brew_method && <p className="mt-1 text-sm text-red-600">{errors.preferred_brew_method.message}</p>}
        </div>

        <div>
          <label htmlFor="preferred_roast_level" className="block text-sm font-medium text-slate-700">
            Preferred Roast Level
          </label>
          <select
            id="preferred_roast_level"
            {...register('preferred_roast_level')}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md border ${errors.preferred_roast_level ? 'border-red-500' : ''}`}
          >
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Dark">Dark</option>
          </select>
          {errors.preferred_roast_level && <p className="mt-1 text-sm text-red-600">{errors.preferred_roast_level.message}</p>}
        </div>

        <div>
          <label htmlFor="budget_range" className="block text-sm font-medium text-slate-700">
            Budget Range
          </label>
          <select
            id="budget_range"
            {...register('budget_range')}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md border ${errors.budget_range ? 'border-red-500' : ''}`}
          >
            <option value="Under ₹5k">Under ₹5k</option>
            <option value="₹5k–₹10k">₹5k–₹10k</option>
            <option value="₹10k–₹20k">₹10k–₹20k</option>
            <option value="₹20k+">₹20k+</option>
          </select>
          {errors.budget_range && <p className="mt-1 text-sm text-red-600">{errors.budget_range.message}</p>}
        </div>
        
        <div>
          <label htmlFor="preferred_currency" className="block text-sm font-medium text-slate-700">
            Preferred Currency
          </label>
          <select
            id="preferred_currency"
            {...register('preferred_currency')}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md border ${errors.preferred_currency ? 'border-red-500' : ''}`}
          >
            <option value="INR">INR (₹)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
          </select>
          {errors.preferred_currency && <p className="mt-1 text-sm text-red-600">{errors.preferred_currency.message}</p>}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
        >
          {isPending ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </form>
  );
}
