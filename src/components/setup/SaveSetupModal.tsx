'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { saveSetup } from '@/actions/setup';

interface SaveSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  setupConfiguration: any;
  budget?: number;
  isLoggedIn: boolean;
}

export function SaveSetupModal({ isOpen, onClose, setupConfiguration, budget, isLoggedIn }: SaveSetupModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      router.push(`/login?redirectTo=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await saveSetup({
      title,
      notes,
      favorite,
      budget,
      setup_configuration: setupConfiguration,
    });

    setIsSubmitting(false);

    if (result.success) {
      router.push('/dashboard/setups');
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-900">Save Setup</h2>
          <button onClick={onClose} className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-1">
              Setup Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. My Dream Espresso Setup"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-neutral-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Why did you choose these items?"
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px]"
              maxLength={1000}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              id="favorite"
              type="checkbox"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
              className="w-4 h-4 text-amber-600 rounded border-neutral-300 focus:ring-amber-500"
            />
            <label htmlFor="favorite" className="text-sm font-medium text-neutral-700">
              Mark as Favorite
            </label>
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center px-4 py-2 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Setup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
