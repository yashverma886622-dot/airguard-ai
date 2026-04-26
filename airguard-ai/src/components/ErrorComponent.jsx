import { AlertTriangle } from 'lucide-react';

export default function ErrorComponent({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="panel p-6 text-center">
      <AlertTriangle className="mx-auto text-red-500" size={34} />
      <h2 className="mt-3 text-xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500 dark:text-slate-400">
        {message || 'AirGuard AI could not complete that request. Please try again.'}
      </p>
      {onRetry && (
        <button
          className="focus-ring mt-5 rounded-lg bg-sea px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
          type="button"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
}
