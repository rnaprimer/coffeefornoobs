import { Metadata } from 'next';
import { getSavedSetups } from '@/lib/queries/setup';
import { SavedSetupGrid } from '@/components/setup/SavedSetupGrid';

export const metadata: Metadata = {
  title: 'My Saved Setups | CoffeeForNoobs',
  description: 'View your saved coffee gear configurations.',
};

export default async function SavedSetupsPage() {
  const setups = await getSavedSetups();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Saved Setups</h1>
        <p className="text-neutral-500 mt-1">
          Your personal coffee gear combinations.
        </p>
      </div>

      <SavedSetupGrid setups={setups} />
    </div>
  );
}
