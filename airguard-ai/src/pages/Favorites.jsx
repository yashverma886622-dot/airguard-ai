import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Heart } from 'lucide-react';

export default function Favorites() {
  const favorites = useSelector((state) => state.favorites.cities);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-bold uppercase text-sea dark:text-emerald-300">Saved cities</p>
        <h1 className="mt-1 text-3xl font-black tracking-normal sm:text-4xl">Favorites</h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
          Your saved cities stay in this browser for quick AQI checks.
        </p>
      </section>

      {favorites.length === 0 ? (
        <div className="panel p-8 text-center">
          <Heart className="mx-auto text-sea dark:text-emerald-300" size={34} />
          <h2 className="mt-3 text-xl font-black">No favorite cities yet</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Save cities from the dashboard for faster monitoring.</p>
          <Link className="focus-ring mt-5 inline-flex rounded-lg bg-sea px-4 py-2 text-sm font-bold text-white" to="/dashboard/Delhi">
            Browse Dashboard
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((city) => (
            <Link key={city.name} className="panel block p-5 transition hover:-translate-y-1" to={`/dashboard/${encodeURIComponent(city.name)}`}>
              <p className="text-sm text-slate-500 dark:text-slate-400">{city.country}</p>
              <h2 className="mt-1 text-2xl font-black">{city.name}</h2>
              <p className="mt-3 text-sm font-semibold text-sea dark:text-emerald-300">Open live AQI dashboard</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
