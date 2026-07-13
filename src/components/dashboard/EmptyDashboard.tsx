import Link from 'next/link';

export function EmptyDashboard() {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
      <h3 className="text-lg font-bold text-neutral-900 mb-2">Welcome to your Dashboard</h3>
      <p className="text-neutral-500 mb-6 max-w-md mx-auto">
        Your dashboard is currently empty. Start saving gear, beans, and coffee setups to build your personal coffee library.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          href="/setup-builder" 
          className="px-6 py-2.5 bg-neutral-900 text-white font-medium rounded-lg hover:bg-neutral-800 transition-colors w-full sm:w-auto"
        >
          Build a Setup
        </Link>
        <Link 
          href="/gear" 
          className="px-6 py-2.5 bg-white text-neutral-900 font-medium rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors w-full sm:w-auto"
        >
          Browse Gear
        </Link>
      </div>
    </div>
  );
}
