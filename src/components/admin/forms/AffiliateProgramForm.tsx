'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { affiliateProgramSchema } from '@/lib/validations/affiliate';
import { createAffiliateProgram, updateAffiliateProgram } from '@/actions/affiliate';
import { toast } from 'sonner';
import AdminForm from '@/components/admin/ui/AdminForm';

type AffiliateProgramFormData = z.infer<typeof affiliateProgramSchema>;

interface AffiliateProgramFormProps {
  initialData?: any;
  merchants: { id: string; name: string }[];
}

export default function AffiliateProgramForm({ initialData, merchants }: AffiliateProgramFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const isEditing = !!initialData;

  const { register, handleSubmit, formState: { errors } } = useForm<AffiliateProgramFormData>({
    // @ts-ignore
    resolver: zodResolver(affiliateProgramSchema),
    defaultValues: {
      merchant_id: initialData?.merchant_id || '',
      program_name: initialData?.program_name || '',
      affiliate_network: initialData?.affiliate_network || '',
      network_dashboard_url: initialData?.network_dashboard_url || '',
      commission_type: initialData?.commission_type || 'percentage',
      commission_value: initialData?.commission_value || 0,
      cookie_duration: initialData?.cookie_duration || 0,
      approval_required: initialData?.approval_required || false,
      minimum_payout: initialData?.minimum_payout || 0,
      payment_frequency: initialData?.payment_frequency || 'Monthly',
      tracking_template: initialData?.tracking_template || '',
      notes: initialData?.notes || '',
      program_status: initialData?.program_status || 'active',
    }
  });

  async function onSubmit(data: AffiliateProgramFormData) {
    setIsSaving(true);
    
    const result = isEditing 
      ? await updateAffiliateProgram(initialData.id, data)
      : await createAffiliateProgram(data);

    if (result.success) {
      toast.success(`Affiliate program ${isEditing ? 'updated' : 'created'} successfully`);
      router.push('/admin/affiliate-programs');
      router.refresh();
    } else {
      toast.error(result.error || 'Something went wrong');
    }
    
    setIsSaving(false);
  }

  return (
    <AdminForm 
      onSubmit={handleSubmit(onSubmit as any)} 
      cancelHref="/admin/affiliate-programs"
      isSaving={isSaving}
      saveLabel={isEditing ? 'Update Program' : 'Create Program'}
    >
      <div className="sm:col-span-3">
        <label htmlFor="merchant_id" className="block text-sm font-medium leading-6 text-gray-900">Merchant</label>
        <div className="mt-2">
          <select
            {...register('merchant_id')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          >
            <option value="">Select a merchant</option>
            {merchants.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          {errors.merchant_id && <p className="mt-2 text-sm text-red-600">{errors.merchant_id.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="program_name" className="block text-sm font-medium leading-6 text-gray-900">Program Name</label>
        <div className="mt-2">
          <input
            {...register('program_name')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.program_name && <p className="mt-2 text-sm text-red-600">{errors.program_name.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="program_status" className="block text-sm font-medium leading-6 text-gray-900">Status</label>
        <div className="mt-2">
          <select
            {...register('program_status')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="affiliate_network" className="block text-sm font-medium leading-6 text-gray-900">Affiliate Network</label>
        <div className="mt-2">
          <input
            {...register('affiliate_network')}
            type="text"
            placeholder="Impact, Amazon Associates, CJ"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-2 flex items-center h-full pt-8">
        <div className="flex h-6 items-center">
          <input
            {...register('approval_required')}
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-600"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor="approval_required" className="font-medium text-gray-900">Approval Required</label>
        </div>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="network_dashboard_url" className="block text-sm font-medium leading-6 text-gray-900">Network Dashboard URL</label>
        <div className="mt-2">
          <input
            {...register('network_dashboard_url')}
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          {errors.network_dashboard_url && <p className="mt-2 text-sm text-red-600">{errors.network_dashboard_url.message}</p>}
        </div>
      </div>

      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">Commission & Payouts</h3>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="commission_type" className="block text-sm font-medium leading-6 text-gray-900">Commission Type</label>
        <div className="mt-2">
          <select
            {...register('commission_type')}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed Flat Rate</option>
          </select>
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="commission_value" className="block text-sm font-medium leading-6 text-gray-900">Commission Value</label>
        <div className="mt-2">
          <input
            {...register('commission_value', { valueAsNumber: true })}
            type="number"
            step="0.01"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="cookie_duration" className="block text-sm font-medium leading-6 text-gray-900">Cookie Duration (Days)</label>
        <div className="mt-2">
          <input
            {...register('cookie_duration', { valueAsNumber: true })}
            type="number"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="minimum_payout" className="block text-sm font-medium leading-6 text-gray-900">Minimum Payout</label>
        <div className="mt-2">
          <input
            {...register('minimum_payout', { valueAsNumber: true })}
            type="number"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label htmlFor="payment_frequency" className="block text-sm font-medium leading-6 text-gray-900">Payment Frequency</label>
        <div className="mt-2">
          <input
            {...register('payment_frequency')}
            type="text"
            placeholder="Net 30, Monthly, Bi-weekly"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>

      <div className="sm:col-span-6 border-t border-gray-200 pt-6 mt-6">
        <h3 className="text-sm font-medium leading-6 text-gray-900">Tracking & Templates</h3>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="tracking_template" className="block text-sm font-medium leading-6 text-gray-900">Tracking Link Template</label>
        <div className="mt-2">
          <input
            {...register('tracking_template')}
            type="text"
            placeholder="https://network.sjv.io/c/123/subID?u={{url}}"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
          <p className="mt-1 text-xs text-gray-500">Use `{"{{url}}"}` placeholder where the target deep link should be injected.</p>
        </div>
      </div>

      <div className="sm:col-span-6">
        <label htmlFor="notes" className="block text-sm font-medium leading-6 text-gray-900">Notes / Details</label>
        <div className="mt-2">
          <textarea
            {...register('notes')}
            rows={3}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-amber-600 sm:text-sm sm:leading-6 px-3"
          />
        </div>
      </div>
    </AdminForm>
  );
}
