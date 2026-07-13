import Link from 'next/link';
import { Settings, Calendar, Star, IndianRupee } from 'lucide-react';
import { DuplicateSetupButton } from './DuplicateSetupButton';
import { DeleteSetupDialog } from './DeleteSetupDialog';

interface SavedSetupCardProps {
  setup: any;
}

export function SavedSetupCard({ setup }: SavedSetupCardProps) {
  const config = setup.setup_configuration;
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex flex-col bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5 border-b border-neutral-100 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-neutral-900">{setup.title}</h3>
            {setup.favorite && <Star className="w-4 h-4 fill-amber-500 text-amber-500" />}
          </div>
          <div className="flex items-center text-sm text-neutral-500 gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(setup.created_at)}
            </span>
            {setup.budget && (
              <span className="flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5" />
                {setup.budget.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-5 flex-grow">
        <h4 className="text-sm font-semibold text-neutral-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Settings className="w-4 h-4" /> Configuration
        </h4>
        <ul className="space-y-2 text-sm text-neutral-600">
          {config.brewer && <li><span className="font-medium text-neutral-900">Brewer:</span> {config.brewer.name || config.brewer}</li>}
          {config.grinder && <li><span className="font-medium text-neutral-900">Grinder:</span> {config.grinder.name || config.grinder}</li>}
          {config.bean && <li><span className="font-medium text-neutral-900">Bean:</span> {config.bean.name || config.bean}</li>}
          {config.scale && <li><span className="font-medium text-neutral-900">Scale:</span> {config.scale.name || config.scale}</li>}
          {config.kettle && <li><span className="font-medium text-neutral-900">Kettle:</span> {config.kettle.name || config.kettle}</li>}
        </ul>
        {setup.notes && (
          <div className="mt-4 pt-4 border-t border-neutral-100">
            <p className="text-sm text-neutral-500 italic line-clamp-3">"{setup.notes}"</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap gap-2 items-center justify-between">
        <Link 
          href={`/setup-builder?load=${setup.id}`} 
          className="px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
        >
          View / Edit
        </Link>
        <div className="flex items-center gap-2">
          <DuplicateSetupButton id={setup.id} />
          <button disabled className="p-2 text-neutral-400 opacity-50 cursor-not-allowed rounded-lg border border-transparent" title="Share (Coming Soon)">
            Share
          </button>
          <DeleteSetupDialog id={setup.id} title={setup.title} />
        </div>
      </div>
    </div>
  );
}
