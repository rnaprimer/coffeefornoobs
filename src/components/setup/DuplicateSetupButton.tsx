'use client';

import { useTransition } from 'react';
import { Copy } from 'lucide-react';
import { duplicateSetup } from '@/actions/setup';

interface DuplicateSetupButtonProps {
  id: string;
}

export function DuplicateSetupButton({ id }: DuplicateSetupButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleDuplicate = () => {
    startTransition(async () => {
      const result = await duplicateSetup(id);
      if (!result.success) {
        console.error('Failed to duplicate setup:', result.error);
      }
    });
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleDuplicate();
      }}
      disabled={isPending}
      className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
      title="Duplicate Setup"
    >
      <Copy className="w-4 h-4" />
    </button>
  );
}
