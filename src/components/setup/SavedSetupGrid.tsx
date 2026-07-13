import { SavedSetupCard } from './SavedSetupCard';
import Link from 'next/link';

interface SavedSetupGridProps {
  setups: any[];
}

export function SavedSetupGrid({ setups }: SavedSetupGridProps) {
  if (!setups || setups.length === 0) {
    return (
      <div className="py-12 text-center bg-white rounded-xl border border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900 mb-2">No saved setups yet</h3>
        <p className="text-neutral-500 max-w-sm mx-auto mb-6">
          Use the Setup Builder to find the perfect coffee gear combination and save it here.
        </p>
        <Link 
          href="/setup-builder" 
          className="inline-flex items-center justify-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          Build a Setup
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {setups.map((setup) => (
        <SavedSetupCard key={setup.id} setup={setup} />
      ))}
    </div>
  );
}
