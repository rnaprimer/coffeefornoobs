'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2, X } from 'lucide-react';
import { deleteSetup } from '@/actions/setup';

interface DeleteSetupDialogProps {
  id: string;
  title: string;
}

export function DeleteSetupDialog({ id, title }: DeleteSetupDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteSetup(id);
      if (result.success) {
        setIsOpen(false);
      } else {
        console.error('Failed to delete setup:', result.error);
      }
    });
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete Setup"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-900">Delete Setup</h2>
              <button 
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="p-1 text-neutral-400 hover:text-neutral-900 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <p className="text-neutral-600 mb-4">
                Are you sure you want to delete <span className="font-semibold text-neutral-900">{title}</span>? This action cannot be undone.
              </p>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isPending}
                  className="flex-1 px-4 py-2 border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
