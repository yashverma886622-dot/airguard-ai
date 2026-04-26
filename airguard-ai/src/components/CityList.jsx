import { ArrowDownUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import AQICard from './AQICard';
import { getAqiBand } from '../utils/aqi';

export default function CityList({ cities, filter, onFilterChange, sort, onSortChange }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-black">Featured Cities</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            className="focus-ring h-10 rounded-lg border border-slate-200 bg-white/90 px-3 text-sm transition duration-300 hover:border-sea/40 dark:border-slate-700 dark:bg-slate-900/90"
            value={filter}
            onChange={(event) => onFilterChange(event.target.value)}
            aria-label="Filter by AQI level"
          >
            <option value="All">All levels</option>
            <option value="Good">Good</option>
            <option value="Moderate">Moderate</option>
            <option value="Poor">Poor</option>
          </select>
          <button
            className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5 hover:border-sea/40 hover:text-sea dark:border-slate-700 dark:bg-slate-900/90"
            type="button"
            onClick={() => onSortChange(sort === 'desc' ? 'asc' : 'desc')}
          >
            <ArrowDownUp size={16} />
            {sort === 'desc' ? 'Highest AQI' : 'Lowest AQI'}
          </button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cities.map((bundle) => (
          <Link key={bundle.city.name} to={`/dashboard/${encodeURIComponent(bundle.city.name)}`} className="group block transition duration-300 hover:-translate-y-1">
            <AQICard bundle={bundle} compact />
            <p className={`mt-2 text-sm font-bold ${getAqiBand(bundle.aqiValue).textClass}`}>
              {getAqiBand(bundle.aqiValue).label} air quality
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
