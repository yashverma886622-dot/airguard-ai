export default function Loader({ label = 'Loading' }) {
  return (
    <div className="grid min-h-[280px] place-items-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sea dark:border-slate-800 dark:border-t-emerald-300" />
        <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</p>
      </div>
    </div>
  );
}
